# Gunakan Python base image
FROM python:3.10-slim

# Set workdir
WORKDIR /app

# Prevent Python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies untuk OpenCV, Numpy dll
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh kode fastapi
COPY . .

# Expose port
EXPOSE 8000

# Jalankan server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
