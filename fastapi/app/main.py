import os
import json
import tempfile
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dotenv import load_dotenv
from urllib.parse import urlparse
from urllib.request import urlretrieve

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# =====================================================
# LOAD .env FILE
# =====================================================
load_dotenv()

# =====================================================
# KONFIGURASI DARI .env
# =====================================================
MODEL_PATH = os.getenv("MODEL_PATH", "best_model_finetuned.keras")
CLASS_JSON_PATH = os.getenv("CLASS_JSON_PATH", "class_indices.json")

# Threshold dasar (bisa di-override via .env)
PROB_THRESH = float(os.getenv("PROB_THRESH", 0.80))
MARGIN_THRESH = float(os.getenv("MARGIN_THRESH", 0.25))

ENTROPY_THRESH_RAW = os.getenv("ENTROPY_THRESH")
ENTROPY_THRESH = float(ENTROPY_THRESH_RAW) if ENTROPY_THRESH_RAW else 0.70

IMG_H = os.getenv("IMG_H")
IMG_W = os.getenv("IMG_W")

if IMG_H and IMG_W:
    IMG_SIZE = (int(IMG_H), int(IMG_W))
else:
    IMG_SIZE = None  # nanti dibaca dari model

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")

# =====================================================
# UTIL
# =====================================================
def is_url(path_or_url: str) -> bool:
    try:
        p = urlparse(path_or_url)
        return p.scheme in ("http", "https")
    except Exception:
        return False


def load_class_names_from_class_indices(json_path: str):
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"File JSON '{json_path}' tidak ditemukan.")

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "class_indices" not in data:
        raise ValueError("JSON harus berisi key 'class_indices'.")

    # data["class_indices"] = { "nama_kelas": index, ... }
    items = sorted(data["class_indices"].items(), key=lambda kv: kv[1])
    indices = [idx for _, idx in items]

    if indices != list(range(len(indices))):
        raise ValueError(f"Urutan index tidak valid: {indices}")

    # return list nama kelas dengan urutan index 0..N-1
    return [name for name, _ in items]


def normalized_entropy(p: np.ndarray) -> float:
    eps = 1e-12
    p = np.clip(p, eps, 1.0)
    H = -np.sum(p * np.log(p))
    Hmax = np.log(len(p))
    return float(H / Hmax)


# =====================================================
# LOAD MODEL
# =====================================================
print(f"Memuat model dari: {MODEL_PATH}")

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Model '{MODEL_PATH}' tidak ditemukan.")

# compile=False supaya tidak perlu load optimizer / loss
model = load_model(MODEL_PATH, compile=False)
print("Model berhasil dimuat.")

# Tentukan ukuran input
if IMG_SIZE is None:
    ishape = model.input_shape
    if isinstance(ishape, (list, tuple)) and isinstance(ishape[0], (list, tuple)):
        ishape = ishape[0]
    H = ishape[1] if ishape[1] is not None else 224
    W = ishape[2] if ishape[2] is not None else 224
    IMG_SIZE = (H, W)

print(f"Model input IMG_SIZE = {IMG_SIZE}")

# =====================================================
# LOAD CLASS NAMES
# =====================================================
class_names = load_class_names_from_class_indices(CLASS_JSON_PATH)

if len(class_names) != model.output_shape[-1]:
    raise ValueError(
        f"Jumlah kelas di JSON ({len(class_names)}) "
        f"≠ output model ({model.output_shape[-1]})"
    )

print(f"Classes ({len(class_names)}): {class_names}")

# =====================================================
# FASTAPI SETUP
# =====================================================
app = FastAPI(
    title="Pest Detection API (CNN + MobileNetV2)",
    description="API berbasis FastAPI untuk pendeteksian hama/penyakit daun.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# RESPONSE SCHEMA
# =====================================================
class PredictionResponse(BaseModel):
    source: str
    predicted_label: Optional[str]
    confidence: Optional[float]
    should_abstain: bool
    abstain_reasons: list[str]
    entropy: Optional[float]


# =====================================================
# INFERENCE FUNCTION
# =====================================================
def run_inference(image_path: str) -> PredictionResponse:
    # Load & preprocess
    img = image.load_img(image_path, target_size=IMG_SIZE)
    img_array = np.expand_dims(image.img_to_array(img), 0) / 255.0

    # Prediksi
    predictions = model.predict(img_array)
    score = predictions[0]

    # Ambil top-2 untuk analisis margin (internal saja, tidak ditampilkan ke user)
    sorted_idx = np.argsort(score)[::-1]
    top1, top2 = sorted_idx[:2]
    p1, p2 = float(score[top1]), float(score[top2])

    # Entropy ter-normalisasi (0..1)
    Hnorm = normalized_entropy(score)

    # --- OOD / ketidakpastian kuat ---
    # 1) Model tidak cukup yakin pada satu kelas
    is_low_prob = p1 < PROB_THRESH

    # 2) Dua kelas teratas kemungkinannya mirip (model bimbang dua kelas)
    is_small_gap = (p1 - p2) < MARGIN_THRESH

    # 3) Distribusi prediksi menyebar ke banyak kelas (model bingung)
    is_high_entropy = Hnorm > ENTROPY_THRESH

    # 4) Tidak ada kelas yang benar-benar menonjol
    is_softmax_flat = p1 < 0.40

    # 5) Variansi kecil → semua kelas dapat nilai hampir sama
    is_low_variance = float(np.var(score)) < 0.005

    should_abstain = any(
        [is_low_prob, is_small_gap, is_high_entropy, is_softmax_flat, is_low_variance]
    )

    reasons: list[str] = []

    if is_low_prob:
        reasons.append(
            f"Model tidak cukup yakin terhadap hasil prediksi (kepercayaan hanya {p1:.2f})."
        )

    if is_small_gap:
        reasons.append(
            "Model kesulitan membedakan dua kemungkinan kelas yang paling mirip, "
            "sehingga hasil prediksi kurang meyakinkan."
        )

    if is_high_entropy:
        reasons.append(
            f"Model membagi kemungkinan ke banyak kelas sekaligus (entropi {Hnorm:.2f}), "
            "menandakan ketidakpastian yang tinggi."
        )

    if is_softmax_flat:
        reasons.append(
            "Tidak ada kelas yang benar-benar dominan. "
            "Ini bisa terjadi jika gambar tidak sesuai domain (misalnya bukan daun tanaman)."
        )

    if is_low_variance:
        reasons.append(
            "Pola pada gambar sulit dikenali sehingga semua kelas terlihat mirip bagi model. "
            "Coba gunakan gambar yang lebih jelas dan fokus pada daun."
        )

    return PredictionResponse(
        source=os.path.basename(image_path),
        predicted_label=None if should_abstain else class_names[top1],
        confidence=None if should_abstain else p1,
        should_abstain=should_abstain,
        abstain_reasons=reasons,
        entropy=Hnorm,
    )



# =====================================================
# ROUTES
# =====================================================
@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(None),
    image_url: Optional[str] = Form(None),
):
    if file is None and not image_url:
        raise HTTPException(400, "Harus upload file atau mengirim URL!")

    temp_path = None

    try:
        # Kasus upload file
        if file:
            suffix = "." + file.filename.split(".")[-1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())
                temp_path = tmp.name
        else:
            # Kasus URL
            if not is_url(image_url):
                raise HTTPException(400, "URL tidak valid.")
            suffix = os.path.splitext(image_url)[1] or ".jpg"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                urlretrieve(image_url, tmp.name)
                temp_path = tmp.name

        result = run_inference(temp_path)
        result.source = file.filename if file else image_url
        return result

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


@app.get("/")
def home():
    return {
        "status": "running",
        "model": MODEL_PATH,
        "classes": class_names,
        "img_size": IMG_SIZE,
        "prob_threshold": PROB_THRESH,
        "margin_threshold": MARGIN_THRESH,
        "entropy_threshold": ENTROPY_THRESH,
    }
