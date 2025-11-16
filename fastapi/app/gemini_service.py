import os
from dotenv import load_dotenv
load_dotenv()
import json
import re
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, ValidationError, field_validator
from fastapi import HTTPException
import google.generativeai as genai


# ======================
# Pydantic Models
# ======================

class AdviceJSON(BaseModel):
    """
    Payload inti yang ingin kamu kelola di sisi Laravel:
    - description: ringkasan penyebab/penjelasan
    - symptoms: list gejala
    - treatment: list tindakan/penanganan
    - prevention: list pencegahan
    """
    description: str = Field(..., description="Ringkasan penyebab / deskripsi singkat")
    symptoms: List[str] = Field(default_factory=list)
    treatment: List[str] = Field(default_factory=list)
    prevention: List[str] = Field(default_factory=list)

    # Normalisasi item string (trim) dan buang kosong
    @field_validator("symptoms", "treatment", "prevention", mode="before")
    @classmethod
    def _normalize_list(cls, v: Any) -> List[str]:
        if v is None:
            return []
        if isinstance(v, str):
            # jika model mengembalikan satu string dipisah koma / newline
            parts = re.split(r"[,;\n]+", v)
            return [s.strip() for s in parts if s.strip()]
        if isinstance(v, list):
            out = []
            for item in v:
                if isinstance(item, str):
                    s = item.strip()
                    if s:
                        out.append(s)
                else:
                    # jika ada objek/angka, konversi aman ke string
                    out.append(str(item))
            return out
        # tipe lain → paksa string
        return [str(v)]

class AdviceResponse(BaseModel):
    """
    Response akhir yang lebih lengkap untuk FastAPI:
    - label: nama kelas prediksi dari model
    - confidence: skor kepercayaan prediksi
    - data: objek AdviceJSON (yang kamu butuhkan di Laravel)
    - notes: catatan (misal fallback / info parsing)
    - raw_text: output mentah dari LLM (debug/logging)
    """
    label: str
    confidence: float
    data: AdviceJSON
    notes: Optional[str] = None
    raw_text: Optional[str] = None


# ======================
# Util JSON Parsing
# ======================

_JSON_BLOCK_RE = re.compile(r"\{[\s\S]*\}", re.MULTILINE)


def _extract_json(text: str) -> Dict[str, Any]:
    """
    Ambil blok JSON pertama yang valid dari teks.
    - Coba langsung json.loads(text)
    - Kalau gagal, cari blok {...} pertama dengan regex lalu json.loads
    - Raise ValueError bila tetap gagal
    """
    text = (text or "").strip()
    # coba langsung
    try:
        return json.loads(text)
    except Exception:
        pass

    # coba cari blok {...}
    m = _JSON_BLOCK_RE.search(text)
    if m:
        candidate = m.group(0)
        try:
            return json.loads(candidate)
        except Exception:
            pass

    raise ValueError("Tidak menemukan JSON valid pada respons model.")


# ======================
# Prompt Builder
# ======================

def _build_prompt(predicted_label: str, confidence: float, locale: str, context: Optional[str]) -> str:
    """
    Instruksi ketat supaya Gemini hanya mengembalikan JSON sesuai schema.
    Kita berikan contoh (few-shot) supaya format konsisten.
    """
    lang = "Indonesia" if locale.lower() == "id" else "English"

    example_json_id = {
        "description": "Larva memakan daun meninggalkan lubang tidak beraturan.",
        "symptoms": ["Daun berlubang", "Kotoran ulat pada daun", "Kerusakan cepat meluas"],
        "treatment": ["Pasang perangkap feromon", "Ambil manual ulat", "Gunakan Bacillus thuringiensis (BT)"],
        "prevention": ["Pasang perangkap lampu", "Bersihkan gulma sekitar", "Rotasi tanaman"]
    }

    prompt = f"""
    Anda adalah agronom ahli. Bahasa output: {lang}.
    Berikan saran hama/penyakit daun secara PRAKTIS dengan format **HANYA** JSON valid (tanpa markdown, tanpa penjelasan lain).
    Target: "{predicted_label}"
    Confidence model: {confidence:.2f}
    Konteks tambahan: {context or "-"}

    Wajib ikuti skema JSON berikut (kunci-kunci harus ada semuanya):
    {{
    "description": "string",
    "symptoms": ["string", "string", "..."],
    "treatment": ["string", "string", "..."],
    "prevention": ["string", "string", "..."]
    }}

    Ketentuan:
    - Gunakan istilah bahan aktif generik (mis. "tembaga hidroksida", "Bacillus thuringiensis") tanpa menyebut merek.
    - Jangan menyertakan teks di luar JSON.
    - Jangan menuliskan komentar.
    - Jika data kurang pasti, tetap isi dengan saran yang umum berlaku.
    - Maksimum 7 poin untuk masing-masing symptoms/treatment/prevention.

    Contoh output JSON (contoh saja, bukan untuk kasus ini):
    {json.dumps(example_json_id, ensure_ascii=False)}

    Sekarang keluarkan **HANYA** JSON untuk target di atas.
    """
    return prompt.strip()


# ======================
# Fungsi Utama
# ======================

def get_gemini_advice(
    predicted_label: str,
    confidence: float,
    locale: str = "id",
    context: Optional[str] = None
) -> AdviceResponse:
    """
    Meminta saran ke Gemini API dan mengembalikan hasil terstruktur (JSON).
    - Memaksa output berupa JSON valid sesuai schema.
    - Ada fallback aman jika parsing gagal.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY belum diset di environment.")

    # Konfigurasi Gemini
    genai.configure(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")

    generation_config = {
        "temperature": 0.4,
        "top_p": 0.9,
        "top_k": 40,
        "max_output_tokens": 800,
    }

    prompt = _build_prompt(predicted_label, confidence, locale, context)

    try:
        model = genai.GenerativeModel(model_name)
        resp = model.generate_content(prompt, generation_config=generation_config)
        raw_text = (getattr(resp, "text", None) or "").strip()

        # Parse JSON
        parsed: Dict[str, Any] = _extract_json(raw_text)

        # Validasi ke schema kita
        data = AdviceJSON.model_validate(parsed)

        return AdviceResponse(
            label=predicted_label,
            confidence=confidence,
            data=data,
            notes=None,
            raw_text=raw_text
        )

    except ValidationError as ve:
        # JSON terbaca tapi tidak sesuai schema → normalisasi seadanya
        try:
            parsed = _extract_json(raw_text if 'raw_text' in locals() else "")
        except Exception:
            parsed = {}

        data = AdviceJSON(
            description=str(parsed.get("description", "")) or "Tidak ada deskripsi yang valid dari model.",
            symptoms=parsed.get("symptoms", []),
            treatment=parsed.get("treatment", []),
            prevention=parsed.get("prevention", []),
        )
        return AdviceResponse(
            label=predicted_label,
            confidence=confidence,
            data=data,
            notes=f"Schema mismatch: {ve.errors()}",
            raw_text=raw_text if 'raw_text' in locals() else None
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memanggil Gemini API: {e}")
