FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    OMP_NUM_THREADS=1 \
    TF_NUM_INTRAOP_THREADS=1 \
    TF_NUM_INTEROP_THREADS=1

WORKDIR /srv

# deps python
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
 && pip install --only-binary=:all: -r requirements.txt

# copy source (tanpa model_artifacts)
COPY app ./app

# default env (bisa di-override oleh .env / compose)
ENV MODEL_PATH=app/models/best_model_finetuned_6class.h5
ENV LABEL_MAP_PATH=app/class_indices.json
ENV THRESHOLD=0.55

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", " --port", "8000"]
