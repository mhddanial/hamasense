# 🌿 HamaSense - Smart Plant Disease Detection System

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-red?style=for-the-badge&logo=laravel" alt="Laravel 12"/>
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/FastAPI-0.115-green?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/TensorFlow-2.19-orange?style=for-the-badge&logo=tensorflow" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker" alt="Docker"/>
</p>

**HamaSense** is an intelligent plant disease and pest detection platform powered by deep learning and Google Gemini AI. The system enables farmers and agricultural enthusiasts to identify plant diseases through image recognition, receive AI-powered treatment recommendations, track cases, and engage with a community of fellow plant owners.

---

## ✨ Features

### 🔬 AI-Powered Detection
- **Image-based Disease Detection**: Upload photos of affected plants for instant AI analysis
- **Deep Learning Model**: CNN model with TensorFlow/Keras for accurate disease classification
- **Gemini AI Integration**: Detailed treatment recommendations and care advice from Google Gemini
- **Confidence Scoring**: Transparent prediction confidence with entropy-based uncertainty metrics

### 📊 Dashboard & Analytics
- **Weather-based Pest Risk Analysis**: Real-time pest risk assessment based on local weather conditions
- **Detection Statistics**: Visual charts showing detection trends and disease distribution
- **Active Case Tracking**: Monitor ongoing plant health issues

### 🩺 Case Management
- **Continuous Care Tracking**: Follow-up on detected diseases with progress monitoring
- **Treatment Logs**: Record treatments applied to affected plants
- **Case Follow-ups**: Track recovery progress with image comparisons

### 📚 Knowledge Base
- **Disease Encyclopedia**: Comprehensive database of plant diseases
- **Pest Information**: Detailed pest profiles with prevention methods
- **Plant Types**: Information on various plant varieties and their common issues
- **Articles**: Educational content on plant care and disease management

### 👥 Community Features
- **Community Forum**: Share experiences and ask questions
- **Post Categories**: Organized discussions by topic
- **Comments & Likes**: Engage with community content
- **Content Moderation**: Report system for inappropriate content

### 👤 User Management
- **Authentication**: Secure registration and login with Laravel Fortify
- **Social Login**: OAuth integration with Laravel Socialite
- **User Preferences**: Customizable settings and preferences
- **Admin Dashboard**: Comprehensive admin panel for content management

---

## 🏗️ Architecture

```
hamasense/
├── laravel/                 # Laravel 12 Backend + React Frontend
│   ├── app/
│   │   ├── Http/Controllers/   # API & Web Controllers
│   │   └── Models/            # Eloquent Models
│   ├── resources/js/
│   │   ├── pages/             # React (Inertia.js) Pages
│   │   └── components/        # Reusable UI Components
│   └── database/migrations/   # Database Schema
├── fastapi/                 # AI/ML Microservice
│   ├── app/
│   │   ├── main.py            # FastAPI endpoints
│   │   └── gemini_service.py  # Gemini AI integration
│   └── model_artifacts/       # Trained ML models
└── docker-compose.yaml      # Container orchestration
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Inertia.js |
| **Backend** | Laravel 12, PHP 8.2+ |
| **ML Service** | FastAPI, TensorFlow/Keras, Google Gemini AI |
| **Database** | MySQL 8.0 |
| **Web Server** | Nginx |
| **Containerization** | Docker & Docker Compose |

---

## 📦 Installation

### Prerequisites
- **Docker** and **Docker Compose** (recommended)
- Or for local development:
  - PHP 8.2+
  - Composer
  - Node.js 18+
  - Python 3.10+
  - MySQL 8.0

### 🐳 Docker Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/mhddanial/hamasense.git
   cd hamasense
   ```

2. **Configure environment files**
   ```bash
   # Laravel environment
   cp laravel/.env.example laravel/.env
   
   # FastAPI environment
   cp fastapi/.env.example fastapi/.env
   ```

3. **Update environment variables**
   
   Edit `laravel/.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_DATABASE=hamasense
   DB_USERNAME=user
   DB_PASSWORD=password
   
   FASTAPI_URL=http://fastapi:8000
   ```
   
   Edit `fastapi/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   MODEL_PATH=model_artifacts/best_model_finetuned.keras
   CLASS_JSON_PATH=app/class_indices.json
   ```

4. **Start the containers**
   ```bash
   docker-compose up -d --build
   ```

5. **Run database migrations**
   ```bash
   docker exec laravel_web_app php artisan migrate --seed
   ```

6. **Access the application**
   - Web App: `http://localhost`
   - API Health: `http://localhost:8000/health`

---

### 💻 Local Development Installation

#### Laravel Setup

1. **Navigate to Laravel directory**
   ```bash
   cd laravel
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Setup database**
   ```bash
   php artisan migrate --seed
   ```

6. **Start development server**
   ```bash
   composer dev
   ```
   This starts Laravel server, Vite dev server, and queue worker concurrently.

#### FastAPI Setup

1. **Navigate to FastAPI directory**
   ```bash
   cd fastapi
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/macOS
   # or
   .venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Gemini API key
   ```

5. **Start FastAPI server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

---

## 🔧 Configuration

### Environment Variables

#### Laravel (.env)
| Variable | Description |
|----------|-------------|
| `DB_*` | Database connection settings |
| `FASTAPI_URL` | URL to FastAPI ML service |
| `MAIL_*` | Email configuration |
| `OPENWEATHERMAP_API_KEY` | Weather API for pest risk analysis |

#### FastAPI (.env)
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini AI API key |
| `MODEL_PATH` | Path to trained Keras model |
| `PROB_THRESH` | Confidence threshold (default: 0.80) |
| `ALLOWED_ORIGINS` | CORS allowed origins |

---

## 📁 Project Structure

### Database Models
- `User` - User accounts and authentication
- `DetectionHistory` - Disease detection records
- `Disease` - Disease information
- `Pest` - Pest encyclopedia
- `PlantType` - Plant varieties
- `Cases` - Active disease cases for tracking
- `Article` - Educational content
- `CommunityPost` - Forum posts

### Key Controllers
- `DetectController` - Handles disease detection workflow
- `DashboardController` - Dashboard statistics and weather data
- `CaseController` - Case tracking management
- `CommunityPostController` - Community forum logic
- `AdminController` - Admin panel functionality

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Danial** - *Initial development* - [@mhddanial](https://github.com/mhddanial)

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - PHP Framework
- [React](https://react.dev) - JavaScript Library
- [TensorFlow](https://tensorflow.org) - Machine Learning Framework
- [Google Gemini](https://ai.google.dev) - AI Language Model
- [FastAPI](https://fastapi.tiangolo.com) - Python API Framework
- [Inertia.js](https://inertiajs.com) - Modern Monolith Architecture
