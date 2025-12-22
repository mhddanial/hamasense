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
    
    # 1. Contoh yang standar untuk deteksi awal - awal
    example_initial = """
    {
        "description": "Hama yang menyerang daun muda menyebabkan daun mengeriting.",
        "symptoms": ["Bercak kuning pada daun", "Daun menggulung", "Pertumbuhan kerdil"],
        "treatment": ["Semprot air deras", "Gunakan musuh alami", "Pestisida nabati daun nimba"],
        "prevention": ["Bersihkan gulma", "Rotasi tanaman", "Pilih bibit unggul"]
    }
    """

    # 2. Contoh QA/Follow-up (Jawab langsung)
    example_followup = """
    {
        "description": "Ya, pada kondisi ini penyiraman dapat ditingkatkan menjadi 2x sehari karena tanah terlihat kering, namun jangan sampai menggenang.",
        "symptoms": ["Tanah kering pecah-pecah", "Daun layu sementara"],
        "treatment": ["Tingkatkan frekuensi penyiraman", "Tambahkan mulsa organik"],
        "prevention": ["Periksa kelembapan tanah rutin"]
    }
    """

    # Logic Switch
    if context:
        task_desc = "Answer the user's specific question based on the plant's condition."
        chosen_example = example_followup
        instruction_extra = "4. VITAL: Your 'description' MUST directly answer the user's question/prompt. Do not just describe the pest again."
    else:
        task_desc = "Identify the plant issue and provide safe management tips."
        chosen_example = example_initial
        instruction_extra = "4. Keep explanation concise and educational."

    
    prompt = f"""
    Context: Agricultural Science & Plant Protection.
    Task: {task_desc}
    Target Plant/Issue: "{predicted_label}"
    Language: {lang}.

    INSTRUCTIONS:
    1. Output MUST be valid JSON only. No markdown formatting.
    2. STRICTLY follow the JSON structure provided below.
    3. SAFETY RULE: Do NOT provide instructions on how to manufacture chemicals. Focus on commercially available solutions and biological control (IPM).
    {instruction_extra}
    5. If images are provided (Old vs New), compare them to see progress.

    Expected JSON Structure:
    {chosen_example}

    BEGIN GENERATION for "{predicted_label}":
    """
    return prompt.strip()

# ======================
# Fungsi Utama
# ======================

async def get_gemini_advice(
    predicted_label: str,
    confidence: float,
    locale: str = "id",
    context: Optional[str] = None,
    image_parts: Optional[List[dict]] = None
) -> AdviceResponse:
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key Missing")

    genai.configure(api_key=api_key)
    
    env_model = os.getenv("GEMINI_MODEL", "models/gemini-2.0-flash")
    
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

    # Menyusun Bagian Prompt
    prompt_parts = []
    
    # 1. Sistem prompt/konteks
    prompt = _build_prompt(predicted_label, confidence, locale, context)
    prompt_parts.append(prompt)
    
    # 2. Gambar
    if image_parts:
        for img in image_parts:
            # Format gambar yang diharapkan: {"mime_type": "image/jpeg", "data": bytes}
            prompt_parts.append(img)
            
    # 3. Konteks Pengguna / Tindak Lanjut Spesifik
    if context:
        prompt_parts.append(f"\nUser Additional Notes/Context: {context}")

    model = genai.GenerativeModel(env_model)

    max_retries = 2
    last_error = None
    
    for attempt in range(max_retries):
        try:
            print(f"[Gemini] Attempt {attempt+1}/{max_retries} using {env_model} for {predicted_label}...")
            
            # Buat konten dengan daftar bagian (Teks + Gambar)
            resp = await model.generate_content_async(
                prompt_parts, 
                generation_config=generation_config, 
                safety_settings=safety_settings
            )

            if not resp.parts:
                finish_reason = resp.candidates[0].finish_reason if resp.candidates else "Unknown"
                print(f"[Gemini BLOCKED] Reason Code: {finish_reason}")
                raise ValueError(f"Blocked by Safety Filter (Reason: {finish_reason})")

            raw_text = resp.text
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