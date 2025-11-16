import os
import json
import tempfile
from typing import List, Optional

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
MODEL_PATH = os.getenv("MODEL_PATH", "best_model_finetuned_6class.h5")
CLASS_JSON_PATH = os.getenv("CLASS_JSON_PATH", "class_indices.json")

PROB_THRESH = float(os.getenv("PROB_THRESH", 0.60))
MARGIN_THRESH = float(os.getenv("MARGIN_THRESH", 0.15))
ENTROPY_THRESH_RAW = os.getenv("ENTROPY_THRESH")
ENTROPY_THRESH = float(ENTROPY_THRESH_RAW) if ENTROPY_THRESH_RAW else None

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

    items = sorted(data["class_indices"].items(), key=lambda kv: kv[1])
    indices = [idx for _, idx in items]

    if indices != list(range(len(indices))):
        raise ValueError(f"Urutan index tidak valid: {indices}")

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
    raise ValueError(f"Jumlah kelas JSON ≠ output model")

print(f"Classes ({len(class_names)}): {class_names}")


# =====================================================
# FASTAPI SETUP
# =====================================================
app = FastAPI(
    title="Pest Detection API (CNN + MobileNetV2)",
    description="API berbasis FastAPI untuk pendeteksian hama daun.",
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
class TopKPrediction(BaseModel):
    label: str
    probability: float


class PredictionResponse(BaseModel):
    source: str
    predicted_label: Optional[str]
    confidence: Optional[float]
    top_k: List[TopKPrediction]
    should_abstain: bool
    abstain_reasons: List[str]
    entropy: Optional[float]


# =====================================================
# INFERENCE FUNCTION
# =====================================================
def run_inference(image_path: str, top_k: int = 3) -> PredictionResponse:
    img = image.load_img(image_path, target_size=IMG_SIZE)
    img_array = np.expand_dims(image.img_to_array(img), 0) / 255.0

    predictions = model.predict(img_array)
    score = predictions[0]

    sorted_idx = np.argsort(score)[::-1]
    top1, top2 = sorted_idx[:2]
    p1, p2 = float(score[top1]), float(score[top2])

    Hnorm = normalized_entropy(score) if ENTROPY_THRESH is not None else None

    is_low_prob = p1 < PROB_THRESH
    is_small_gap = (p1 - p2) < MARGIN_THRESH
    is_high_entropy = Hnorm is not None and Hnorm > ENTROPY_THRESH

    should_abstain = is_low_prob or is_small_gap or is_high_entropy

    reasons = []
    if is_low_prob:
        reasons.append(f"Probabilitas terlalu rendah ({p1*100:.2f}%)")
    if is_small_gap:
        reasons.append(f"Margin Top1-Top2 terlalu kecil ({(p1-p2)*100:.2f}%)")
    if is_high_entropy:
        reasons.append(f"Entropi terlalu tinggi ({Hnorm:.2f})")

    top_k_list = [
        TopKPrediction(label=class_names[idx], probability=float(score[idx]))
        for idx in sorted_idx[:top_k]
    ]

    return PredictionResponse(
        source=os.path.basename(image_path),
        predicted_label=None if should_abstain else class_names[top1],
        confidence=None if should_abstain else p1,
        top_k=top_k_list,
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
        if file:
            suffix = "." + file.filename.split(".")[-1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())
                temp_path = tmp.name
        else:
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
    }
