import os
import io
import json
import hashlib
from typing import List, Optional

from dotenv import load_dotenv
load_dotenv()

import numpy as np
from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from pydantic import BaseModel, Field

import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Loader kustom yang sudah kamu miliki
from app.model_loader import robust_load_model_any

from app.gemini_service import get_gemini_advice, AdviceResponse, AdviceJSON


# ========================== Konfigurasi ==========================
APP_TITLE = "Pest & Disease Classifier API"

# Path bisa dioverride via .env
MODEL_PATH = os.getenv("MODEL_PATH", "app/models/best_model_finetuned_6class.h5")
LABEL_MAP_PATH = os.getenv("LABEL_MAP_PATH", "app/class_indices.json")

# Ukuran input sesuai training MobileNetV2
IMG_SIZE = (224, 224)

# Ambang default (bisa diubah via env THRESHOLD)
DEFAULT_THRESHOLD = float(os.getenv("THRESHOLD", "0.55"))


# ========================== Utilitas ==========================
def _sha1(p: str) -> str:
    try:
        with open(p, "rb") as f:
            return hashlib.sha1(f.read()).hexdigest()[:12]
    except Exception:
        return "NA"


def read_image_to_array(file_bytes: bytes) -> np.ndarray:
    """
    Baca gambar, resize ke IMG_SIZE, preprocess untuk MobileNetV2, dan tambahkan batch dim.
    """
    try:
        img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File bukan gambar yang valid: {e}")

    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32)
    # MobileNetV2 expects [-1, 1]
    arr = preprocess_input(arr)
    arr = np.expand_dims(arr, axis=0)  # (1, H, W, 3)
    return arr


def softmax(x: np.ndarray) -> np.ndarray:
    """
    Softmax baris per baris untuk array shape (1, C).
    """
    e = np.exp(x - np.max(x, axis=1, keepdims=True))
    return e / np.sum(e, axis=1, keepdims=True)


def _ensure_probs(logits: np.ndarray) -> np.ndarray:
    """
    Pastikan output adalah probabilitas (softmax) satu baris.
    Jika model sudah output softmax (jumlah ~1 dan >=0), gunakan apa adanya.
    Kalau belum, terapkan softmax.
    """
    if logits.ndim != 2 or logits.shape[0] != 1:
        raise HTTPException(status_code=500, detail=f"Bentuk output model tak terduga: {logits.shape}")
    row = logits[0]
    if np.all(row >= 0.0) and np.isclose(np.sum(row), 1.0, atol=1e-3):
        return logits
    return softmax(logits)


def _load_class_names(label_map_path: str, fallback_num_classes: Optional[int]) -> List[str]:
    """
    Muat daftar nama kelas dari label_map json (format umum: {label: index} atau {index: label}).
    Jika tidak tersedia, fallback jadi ['class_0', ..., 'class_{C-1}'] bila jumlah kelas diketahui.
    """
    if os.path.exists(label_map_path):
        with open(label_map_path, "r", encoding="utf-8") as f:
            obj = json.load(f)

        # Deteksi format
        # Format A: {"0": "healthy", "1": "rust", ...}
        # Format B: {"healthy": 0, "rust": 1, ...}
        # Kita normalisasi ke list berurutan index 0..C-1
        if all(isinstance(k, str) and k.isdigit() for k in obj.keys()):
            # keys adalah index string
            items = sorted(((int(k), v) for k, v in obj.items()), key=lambda x: x[0])
            return [v for _, v in items]
        elif all(isinstance(v, int) for v in obj.values()):
            # values adalah index
            items = sorted(((v, k) for k, v in obj.items()), key=lambda x: x[0])
            return [k for _, k in items]
        else:
            # fallback: anggap keys adalah nama kelas (urut alfabet)
            return sorted(list(obj.keys()))

    # Fallback nama kelas jika tidak ada file
    if fallback_num_classes is not None and fallback_num_classes > 0:
        return [f"class_{i}" for i in range(fallback_num_classes)]
    # Jika tidak tahu jumlah kelas sama sekali
    return []


# ========================== FastAPI App ==========================
print("[Boot] TF version =", tf.__version__)
print("[Boot] MODEL_PATH =", MODEL_PATH, "exists:", os.path.exists(MODEL_PATH))
print("[Boot] LABEL_MAP_PATH =", LABEL_MAP_PATH, "exists:", os.path.exists(LABEL_MAP_PATH))
if os.path.exists(MODEL_PATH):
    print("[Boot] MODEL sha1 =", _sha1(MODEL_PATH))

app = FastAPI(title=APP_TITLE)


# ----------- Schemas -----------
class Prediction(BaseModel):
    label: str
    confidence: float
    is_detected: bool  # false jika unknown (di bawah threshold)


class PredictResponse(BaseModel):
    top: Prediction
    scores: List[float]         # probabilitas per kelas sesuai urutan class_names
    classes: List[str]          # echo dari class_names
    threshold: float
    message: Optional[str] = None


class AdviceRequest(BaseModel):
    predicted_label: str = Field(..., description="Nama kelas hasil prediksi")
    confidence: float = Field(..., ge=0.0, le=1.0)
    locale: str = Field("id", description="Bahasa output")
    context: Optional[str] = None


# ----------- Startup: load model & labels -----------
@app.on_event("startup")
def load_artifacts():
    """
    Muat model dan nama kelas sekali saat startup.
    Menggunakan robust_load_model_any untuk menghindari error multi-input/multi-output saat deserialisasi.
    """
    global model, class_names

    # 1) Tentukan jumlah kelas dari label map jika tersedia
    num_classes_from_map = None
    if os.path.exists(LABEL_MAP_PATH):
        try:
            with open(LABEL_MAP_PATH, "r", encoding="utf-8") as f:
                obj = json.load(f)
            if all(isinstance(k, str) and k.isdigit() for k in obj.keys()):
                num_classes_from_map = len(obj)
            elif all(isinstance(v, int) for v in obj.values()):
                num_classes_from_map = len(obj)
            else:
                num_classes_from_map = len(obj.keys())
        except Exception as e:
            print(f"[Boot] Gagal membaca LABEL_MAP_PATH: {e}")

    # 2) Load model secara robust (fungsi ini milikmu)
    #    Sesuaikan backbone/argumen sesuai implementasi robust_load_model_any kamu.
    model = robust_load_model_any(
        MODEL_PATH,
        num_classes=(num_classes_from_map or 6),   # default 6 jika tidak bisa di-infer
        input_shape=(224, 224, 3),
        dropout_rate=0.5,
        backbone="mobilenet_v2",
    )

    # 3) Jika class_names tersedia di file, pakai itu; jika tidak, infer dari model
    inferred_classes = None
    try:
        out_units = int(model.output_shape[-1])
        inferred_classes = out_units
    except Exception:
        pass

    class_names_local = _load_class_names(LABEL_MAP_PATH, inferred_classes)
    if not class_names_local:
        # Jika tetap kosong, buat placeholder sesuai output units
        if inferred_classes:
            class_names_local = [f"class_{i}" for i in range(inferred_classes)]
        else:
            raise RuntimeError("Tidak berhasil menentukan daftar kelas. Pastikan LABEL_MAP_PATH tersedia atau model memiliki output yang valid.")

    class_names = class_names_local
    print(f"[Boot] Loaded model with {len(class_names)} classes: {class_names}")


# ----------- Endpoints -----------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": os.path.basename(MODEL_PATH),
        "num_classes": len(class_names) if 'class_names' in globals() else None
    }


@app.post("/predict", response_model=PredictResponse)
async def predict(
    file: UploadFile = File(..., description="Gambar daun (jpg/png/webp)"),
    threshold: float = Query(DEFAULT_THRESHOLD, ge=0.0, le=1.0, description="Ambang 'terdeteksi' (0-1)")
):
    if file.content_type not in ("image/jpeg", "image/jpg", "image/png", "image/webp"):
        raise HTTPException(status_code=415, detail="Tipe file harus jpg/png/webp")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="File kosong")

    x = read_image_to_array(image_bytes)

    # Forward pass (antisipasi multi-output: ambil output pertama)
    preds = model.predict(x, verbose=0)
    if isinstance(preds, (list, tuple)):
        if len(preds) == 0:
            raise HTTPException(status_code=500, detail="Model mengembalikan list kosong.")
        logits = np.array(preds[0], dtype=np.float32)
    else:
        logits = np.array(preds, dtype=np.float32)

    probs = _ensure_probs(logits)[0].astype(float).tolist()

    top_idx = int(np.argmax(probs))
    top_conf = float(max(probs))
    top_label = class_names[top_idx]

    is_detected = top_conf >= threshold
    message = None
    if not is_detected:
        top_label = "unknown"
        message = "Kepercayaan model di bawah threshold; dikembalikan sebagai 'unknown'."

    return PredictResponse(
        top=Prediction(label=top_label, confidence=top_conf, is_detected=is_detected),
        scores=probs,
        classes=class_names,
        threshold=threshold,
        message=message,
    )


# ---------- ADVICE ENDPOINTS ----------
@app.post("/advice/full", response_model=AdviceResponse)
def advice_full(req: AdviceRequest):
    if req.predicted_label.lower() in ("unknown", "tidak terdeteksi"):
        raise HTTPException(status_code=400, detail="Label tidak diketahui, tidak dapat meminta saran.")
    return get_gemini_advice(req.predicted_label, req.confidence, req.locale, req.context)


@app.post("/advice/json", response_model=AdviceJSON)
def advice_json(req: AdviceRequest):
    if req.predicted_label.lower() in ("unknown", "tidak terdeteksi"):
        raise HTTPException(status_code=400, detail="Label tidak diketahui, tidak dapat meminta saran.")
    full = get_gemini_advice(req.predicted_label, req.confidence, req.locale, req.context)
    return full.data
