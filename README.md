# KelanaAI ✈️

**KelanaAI** is an AI-powered travel planning application that generates personalized day-by-day itineraries using Amazon Bedrock (Nova Lite). Built with Python, FastAPI, PostgreSQL, and Next.js.

---

## 🖥️ Preview

> **"Plan Your Dream Trip with AI"** — Enter a destination, budget, and number of days. KelanaAI generates a detailed itinerary with morning activities, cultural experiences, dinner spots, and nightlife suggestions.

---

## 🏗️ Project Structure

```
kelana-ai/
├── backend/                    # Python FastAPI REST API
│   ├── main.py                 # API endpoints (CRUD + AI generation)
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (not committed)
│   ├── db/
│   │   ├── database.py         # PostgreSQL connection (SQLAlchemy)
│   │   └── models.py           # ORM models
│   └── services/
│       ├── trip_service.py     # Business logic (category, budget)
│       └── bedrock_service.py  # Amazon Bedrock AI integration
└── frontend/                   # Next.js 14 web interface
    ├── src/app/
    │   ├── page.tsx            # Homepage (Navbar, Hero, Form, Features, Footer)
    │   ├── layout.tsx          # Root layout
    │   └── globals.css         # Tailwind CSS + custom styles
    ├── package.json
    ├── tailwind.config.js
    └── next.config.js
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| AI | Amazon Bedrock — Nova Lite |
| Backend | Python 3.12, FastAPI, Uvicorn |
| Database | PostgreSQL 17, SQLAlchemy ORM |
| Frontend | Next.js 14, React, Tailwind CSS |
| Auth (upcoming) | JWT + bcrypt |

---

## ⚙️ Setup & Running

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 17

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your PostgreSQL password and AWS credentials

# Create database
psql -U postgres -c "CREATE DATABASE kelanaai;"

# Run server
uvicorn main:app --reload
```

API runs at: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |
| GET | `/api/v1/trips` | Get all trips |
| POST | `/api/v1/trips` | Create a new trip |
| GET | `/api/v1/trips/{id}` | Get trip by ID |
| PUT | `/api/v1/trips/{id}` | Update trip budget |
| DELETE | `/api/v1/trips/{id}` | Delete a trip |
| POST | `/api/v1/trips/{id}/generate` | Generate AI itinerary |
| GET | `/api/v1/recommendations` | Get place recommendations |
| GET | `/api/v1/transportations` | Get transportation options |

---

## 🌍 Features

- **AI-Powered Itinerary** — Amazon Bedrock generates personalized travel plans
- **CRUD Operations** — Full Create, Read, Update, Delete for trips
- **Budget Categories** — Backpacker (<$1000), Standard ($1000–$3000), Luxury (>$3000)
- **Daily Budget Calculator** — Automatic budget per day calculation
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **Hero Image** — Beautiful destination photography
- **Persistent Storage** — AI recommendations saved to PostgreSQL

---

## 📦 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
AWS_BEARER_TOKEN_BEDROCK=your_token_here
AWS_REGION=ap-southeast-2
MODEL_ID=amazon.nova-lite-v1:0
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/kelanaai
```

> ⚠️ Never commit `.env` to Git.

---

## 📌 Version History

| Tag | Description |
|-----|-------------|
| `v0.1.0` | Initial console app |
| `session-2` | Recommendation engine |
| `session-3` | FastAPI REST API |
| `session-4` | PostgreSQL persistence |
| `session-5` | Amazon Bedrock AI integration |
| `session-6` | Next.js frontend UI |

---

## 👤 Author

**Husyen** — Built as part of MAIN Phase 2 (Mastering Artificial Intelligence for Nation 2026) by Alkademi.

---

© 2026 KelanaAI · Powered by Amazon Bedrock
