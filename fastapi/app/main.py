import os
# Limitasi TensorFlow Resource
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_FORCE_GPU_ALLOW_GROWTH"] = "true"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"

import tempfile
import asyncio
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

from dotenv import load_dotenv
from urllib.parse import urlparse
from urllib.request import urlretrieve

import numpy as np
import tensorflow as tf
# Optimasi Threading TensorFlow
tf.config.threading.set_intra_op_parallelism_threads(1)
tf.config.threading.set_inter_op_parallelism_threads(1)

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


# --- IMPORT GEMINI SERVICE ---
from .gemini_service import get_gemini_advice, AdviceResponse

load_dotenv()

# =====================================================
# KONFIGURASI DASAR
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.getenv(
    "MODEL_PATH",
    os.path.join(BASE_DIR, "..", "model_artifacts", "best_model_finetuned.keras")
)

CLASS_JSON_PATH = os.getenv(
    "CLASS_JSON_PATH",
    os.path.join(BASE_DIR, "..", "model_artifacts", "class_indices.json")
)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")

# Threshold Config
PROB_THRESH = float(os.getenv("PROB_THRESH", 0.80))
MARGIN_THRESH = float(os.getenv("MARGIN_THRESH", 0.25))
ENTROPY_THRESH = float(os.getenv("ENTROPY_THRESH", 0.70))

IMG_H = os.getenv("IMG_H")
IMG_W = os.getenv("IMG_W")

if IMG_H and IMG_W:
    IMG_SIZE = (int(IMG_H), int(IMG_W))
else:
    IMG_SIZE = None 

# =====================================================
# LOAD MODEL & UTIL
# =====================================================
# (Bagian ini sama persis seperti sebelumnya)
import json

model = None
def get_model():
    global model
    if model is None:
        model = load_model(MODEL_PATH, compile=False)
    return model

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
    items = sorted(data["class_indices"].items(), key=lambda kv: kv[1])
    return [name for name, _ in items]

def normalized_entropy(p: np.ndarray) -> float:
    eps = 1e-12
    p = np.clip(p, eps, 1.0)
    H = -np.sum(p * np.log(p))
    Hmax = np.log(len(p))
    return float(H / Hmax)

if IMG_SIZE is None:
    m = get_model()
    ishape = m.input_shape
    if isinstance(ishape, (list, tuple)) and isinstance(ishape[0], (list, tuple)):
        ishape = ishape[0]
    IMG_SIZE = (ishape[1] or 224, ishape[2] or 224)

class_names = load_class_names_from_class_indices(CLASS_JSON_PATH)
print("Model siap digunakan.")

# =====================================================
# FASTAPI APP
# =====================================================
app = FastAPI(title="Pest Detection Direct API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# SCHEMAS
# =====================================================
class InferenceResult(BaseModel):
    """Hasil Internal CNN"""
    predicted_label: Optional[str]
    confidence: Optional[float]
    should_abstain: bool
    abstain_reasons: list[str]
    entropy: Optional[float]

class PredictionResponse(BaseModel):
    """Response Akhir ke Laravel"""
    source: str
    predicted_label: Optional[str]
    confidence: Optional[float]
    should_abstain: bool
    abstain_reasons: list[str]
    entropy: Optional[float]
    # FIELD INFO DARI GEMINI
    info: Optional[AdviceResponse] = None 

# =====================================================
# CORE LOGIC
# =====================================================
def run_cnn_inference(image_path: str) -> InferenceResult:
    img = image.load_img(image_path, target_size=IMG_SIZE)
    img_array = np.expand_dims(image.img_to_array(img), 0) / 255.0

    predictions = get_model().predict(img_array)
    score = predictions[0]

    sorted_idx = np.argsort(score)[::-1]
    top1, top2 = sorted_idx[:2]
    p1 = float(score[top1])
    
    # Hitung entropy & abstain logic (disederhanakan untuk brevity)
    Hnorm = normalized_entropy(score)
    
    # Logic Abstain sederhana
    should_abstain = False
    reasons = []
    
    if p1 < PROB_THRESH:
        should_abstain = True
        reasons.append(f"Confidence rendah ({p1:.2f})")
    
    return InferenceResult(
        predicted_label=None if should_abstain else class_names[top1],
        confidence=None if should_abstain else p1,
        should_abstain=should_abstain,
        abstain_reasons=reasons,
        entropy=Hnorm
    )

# =====================================================
# ENDPOINT UTAMA
# =====================================================
@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(None),
    image_url: Optional[str] = Form(None),
):
    # 1. Validasi Input
    if file is None and not image_url:
        raise HTTPException(400, "Wajib upload gambar.")

    temp_path = None
    try:
        # 2. Simpan File Sementara
        if file:
            suffix = "." + (file.filename.split(".")[-1] if "." in file.filename else "jpg")
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())
                temp_path = tmp.name
        else:
            if not is_url(image_url):
                raise HTTPException(400, "URL Invalid")
            suffix = os.path.splitext(image_url)[1] or ".jpg"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                urlretrieve(image_url, tmp.name)
                temp_path = tmp.name

        # 3. Jalankan CNN (Visual Detection)
        cnn_result = await run_in_threadpool(run_cnn_inference, temp_path)
        
        gemini_result = None

        # 4. JIKA Prediksi Valid -> TEMBAK GEMINI LANGSUNG
        # (Tanpa Cache, Langsung Request setiap kali)
        if not cnn_result.should_abstain and cnn_result.predicted_label:
            
            print(f"Detect: {cnn_result.predicted_label}. Asking Gemini...")
            
            # Bersihkan nama label agar lebih natural (misal: tomato_healthy -> Tomato Healthy)
            readable_label = cnn_result.predicted_label.replace("_", " ").title()
            
            # --- DIRECT REQUEST KE GEMINI ---
            # Kita gunakan 'await' karena fungsi di gemini_service adalah async
            gemini_result = await get_gemini_advice(
                predicted_label=readable_label,
                confidence=cnn_result.confidence
            )
            print("Gemini response received.")

        # 5. Gabungkan Hasil & Kirim
        return PredictionResponse(
            source=file.filename if file else image_url,
            predicted_label=cnn_result.predicted_label,
            confidence=cnn_result.confidence,
            should_abstain=cnn_result.should_abstain,
            abstain_reasons=cnn_result.abstain_reasons,
            entropy=cnn_result.entropy,
            info=gemini_result # Data JSON dari Gemini masuk sini
        )

    finally:
        # Bersihkan file temp
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

# =====================================================
# ENDPOINT FOLLOW-UP (CONTINUOUS CARE)
# =====================================================
@app.post("/analyze-followup")
async def analyze_followup(
    file_old: UploadFile = File(...),
    file_new: UploadFile = File(...),
    predicted_label: str = Form(...),
    confidence: float = Form(...),
    user_prompt: str = Form(...),
):
    """
    Endpoint khusus untuk membandingkan kondisi tanaman (Old vs New).
    """
    print(f"Follow-up Analysis for {predicted_label}...")
    
    # 1. Read files into memory (bytes)
    # Gemini (google-generativeai) bisa menerima raw bytes dengan mime_type
    
    content_old = await file_old.read()
    content_new = await file_new.read()
    
    # MIME type sniffing (sederhana)
    mime_old = file_old.content_type or "image/jpeg"
    mime_new = file_new.content_type or "image/jpeg"

    # 2. Siapkan Image Parts untuk Gemini
    # Urutan: [Foto Lama, Foto Baru]
    image_parts = [
        {"mime_type": mime_old, "data": content_old},
        {"mime_type": mime_new, "data": content_new},
    ]
    
    # 3. Buat Context khusus Comparison
    context_instruction = (
        f"COMPARE TWO IMAGES. Image 1: Original condition. Image 2: Current condition. "
        f"User Note: {user_prompt}. "
        f"Analyze if the condition has improved, worsened, or stayed the same based on the treatment."
    )

    # 4. Call Gemini
    try:
        gemini_result = await get_gemini_advice(
            predicted_label=predicted_label,
            confidence=confidence,
            locale="id",
            context=context_instruction,
            image_parts=image_parts
        )
        return gemini_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}