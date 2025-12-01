import os
import json
import re
import asyncio
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from fastapi import HTTPException
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv

load_dotenv()

# ======================
# Pydantic Models
# ======================

class AdviceJSON(BaseModel):
    description: str = Field(..., description="Ringkasan penyebab / deskripsi singkat")
    symptoms: List[str] = Field(default_factory=list)
    treatment: List[str] = Field(default_factory=list)
    prevention: List[str] = Field(default_factory=list)

    @classmethod
    def normalize_list(cls, v: Any) -> List[str]:
        if v is None: return []
        if isinstance(v, str):
            parts = re.split(r"[,;\n]+", v)
            return [s.strip() for s in parts if s.strip()]
        if isinstance(v, list):
            out = []
            for item in v:
                if isinstance(item, str):
                    s = item.strip()
                    if s: out.append(s)
                else:
                    out.append(str(item))
            return out
        return [str(v)]

class AdviceResponse(BaseModel):
    label: str
    confidence: float
    data: AdviceJSON
    notes: Optional[str] = None

# ======================
# Util Parsing
# ======================

def _clean_and_parse_json(text: str) -> Dict[str, Any]:
    text = (text or "").strip()
    # Bersihkan markdown ```json ... ```
    if "```" in text:
        text = re.sub(r"^```[a-zA-Z]*\n", "", text)
        text = re.sub(r"\n```$", "", text)
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Cari object JSON {}
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
            
    raise ValueError("Format JSON rusak/terpotong.")

# ======================
# Prompt Builder
# ======================

def _build_prompt(predicted_label: str, confidence: float, locale: str, context: Optional[str]) -> str:
    lang = "Indonesia" if locale.lower() == "id" else "English"
    
    example_json = """
    {
        "description": "Hama yang menyerang daun muda menyebabkan daun mengeriting.",
        "symptoms": ["Bercak kuning pada daun", "Daun menggulung", "Pertumbuhan kerdil"],
        "treatment": ["Semprot air deras", "Gunakan musuh alami", "Pestisida nabati daun nimba"],
        "prevention": ["Bersihkan gulma", "Rotasi tanaman", "Pilih bibit unggul"]
    }
    """

    # Prompt diperhalus agar tidak memicu filter "Dangerous Content"
    prompt = f"""
    Context: Agricultural Science & Plant Protection.
    Task: Identify the plant issue and provide safe management tips.
    Target: "{predicted_label}" (Confidence: {confidence:.2f}).
    Language: {lang}.

    INSTRUCTIONS:
    1. Output MUST be valid JSON only. No markdown formatting.
    2. STRICTLY follow the JSON structure provided in the example.
    3. SAFETY RULE: Do NOT provide instructions on how to manufacture chemicals. Focus on commercially available solutions and biological control (IPM).
    4. Keep explanation concise and educational.

    Expected JSON Structure:
    {example_json}

    Generate JSON for "{predicted_label}":
    """
    return prompt.strip()

# ======================
# Fungsi Utama
# ======================

async def get_gemini_advice(
    predicted_label: str,
    confidence: float,
    locale: str = "id",
    context: Optional[str] = None
) -> AdviceResponse:
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key Missing")

    genai.configure(api_key=api_key)
    
    # REKOMENDASI: Gunakan gemini-2.0-flash yang ada di daftar Anda.
    # Model ini cepat dan cukup cerdas. Jika ingin tetap pro, ganti stringnya.
    env_model = os.getenv("GEMINI_MODEL", "models/gemini-2.0-flash")
    
    # Bersihkan nama model jika user hanya menulis "gemini-2.0-flash" tanpa "models/"
    if not env_model.startswith("models/") and "gemini" in env_model:
        # Biarkan library menangani aliasing, atau force prefix jika perlu
        pass

    # --- SAFETY SETTINGS: FORMAT SDK ENUM (WAJIB UNTUK GEMINI 2.0/2.5) ---
    # Menggunakan Object Enum memastikan setting ini dipahami oleh server Google
    safety_settings = {
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }

    generation_config = {
        "temperature": 0.3,
        "max_output_tokens": 1000,
    }

    prompt = _build_prompt(predicted_label, confidence, locale, context)
    model = genai.GenerativeModel(env_model)

    max_retries = 2
    last_error = None
    
    for attempt in range(max_retries):
        try:
            print(f"[Gemini] Attempt {attempt+1}/{max_retries} using {env_model} for {predicted_label}...")
            
            resp = await model.generate_content_async(
                prompt, 
                generation_config=generation_config, 
                safety_settings=safety_settings
            )

            # Cek jika response diblokir
            if not resp.parts:
                finish_reason = resp.candidates[0].finish_reason if resp.candidates else "Unknown"
                print(f"[Gemini BLOCKED] Reason Code: {finish_reason}")
                
                # Feedback loop: Jika diblokir, coba tambah instruksi "Educational only" (opsional)
                raise ValueError(f"Blocked by Safety Filter (Reason: {finish_reason})")

            raw_text = resp.text
            # print(f"[DEBUG RAW]: {raw_text[:50]}...") 

            parsed_dict = _clean_and_parse_json(raw_text)
            
            data = AdviceJSON(
                description=parsed_dict.get("description", "Deskripsi belum tersedia."),
                symptoms=AdviceJSON.normalize_list(parsed_dict.get("symptoms", [])),
                treatment=AdviceJSON.normalize_list(parsed_dict.get("treatment", [])),
                prevention=AdviceJSON.normalize_list(parsed_dict.get("prevention", []))
            )

            return AdviceResponse(
                label=predicted_label,
                confidence=confidence,
                data=data,
                notes=None
            )

        except Exception as e:
            print(f"[Gemini] Error attempt {attempt+1}: {e}")
            last_error = e
            # Sedikit delay sebelum retry
            await asyncio.sleep(1)
            continue

    # Fallback
    print("[Gemini] All attempts failed. Returning fallback.")
    fallback = AdviceJSON(
        description=f"Detil saran untuk '{predicted_label}' sedang tidak dapat diakses (AI Safety Block).",
        symptoms=["Silakan konsultasi dengan penyuluh pertanian setempat."],
        treatment=[],
        prevention=[]
    )
    return AdviceResponse(
        label=predicted_label,
        confidence=confidence,
        data=fallback,
        notes=f"Final Error: {str(last_error)}"
    )