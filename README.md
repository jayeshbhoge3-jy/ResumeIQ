<div align="center">

# 🧠 ResumeIQ

### AI-Powered Resume Analyzer — Beat the ATS, Land the Interview

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Groq](https://img.shields.io/badge/Groq-LLaMA--3_70B-F55036?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com)
[![spaCy](https://img.shields.io/badge/spaCy-NLP-09A3D5?style=for-the-badge&logo=python&logoColor=white)](https://spacy.io)

<br/>

![ResumeIQ Banner](https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=400&fit=crop&q=80)

<br/>

[🚀 Live Demo](#) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## 🎯 What is ResumeIQ?

**ResumeIQ** is a fast, AI-powered resume analyzer that scores your resume against any job description in seconds. It uses NLP + LLaMA-3 70B to give you a real ATS score, find keyword gaps, and automatically rewrite weak bullet points — so you stop getting filtered out before a human even reads your resume.

> Paste your resume + job description → get your ATS score, missing keywords, and AI-rewritten bullets in under 10 seconds.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **ATS Score** | Overall fit score based on keywords, impact, format, and section alignment |
| 🔍 **Keyword Gap Analysis** | See exactly which keywords you're missing from the job description |
| 🤖 **AI Bullet Rewrites** | Weak bullets auto-detected and rewritten using Groq LLaMA-3 70B |
| 📊 **Detailed Breakdown** | Separate scores for keyword match, format, impact, and alignment |
| 🕐 **Scan History** | Track all your past scans and score improvements over time |
| ⚡ **Blazing Fast** | Groq inference API — results in under 3 seconds |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** + **React** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Framer Motion** + **GSAP** — smooth animations

### Backend
- **FastAPI** — high performance Python API
- **spaCy (en_core_web_sm)** — NLP keyword extraction
- **Groq API (LLaMA-3 70B)** — AI bullet point rewrites
- **PostgreSQL** — scan history storage

### Deployment
- **Frontend** → Vercel
- **Backend** → Render / Railway
- **Database** → Supabase / Render PostgreSQL

---

## 🏗️ Project Structure

```
resumeiq/
├── frontend/                    # Next.js app
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   ├── components/          # UI components
│   │   └── lib/                 # API helpers
│   ├── .env.local.example
│   └── package.json
│
└── backend/                     # FastAPI app
    ├── main.py                  # Entry point + routes
    ├── analyzer.py              # ATS scoring logic
    ├── rewriter.py              # Groq AI rewrite logic
    ├── database.py              # PostgreSQL connection
    ├── requirements.txt
    ├── Procfile
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- [Groq API Key](https://console.groq.com) (free)

---

### 1. Database Setup

Make sure PostgreSQL is running, then create the database and table:

```sql
CREATE DATABASE resumeiq;

\c resumeiq

CREATE TABLE resume_scans (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    ats_score INTEGER,
    keyword_score INTEGER,
    format_score INTEGER,
    impact_score INTEGER,
    alignment_score INTEGER,
    missing_keywords TEXT,
    found_keywords TEXT,
    rewrites TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Download spaCy NLP model
python -m spacy download en_core_web_sm

# Setup environment variables
cp .env.example .env
```

Fill in your `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/resumeiq
ALLOWED_ORIGINS=http://localhost:3000
```

```bash
# Start the server
uvicorn main:app --reload
```

✅ API live at: `http://localhost:8000`
📖 Swagger docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# Start dev server
npm run dev
```

✅ App live at: `http://localhost:3000`

---

## 🌐 Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo → set Root Directory to `backend`
3. Set Build Command:
```bash
pip install -r requirements.txt && python -m spacy download en_core_web_sm
```
4. Set Start Command:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
5. Add environment variables: `GROQ_API_KEY`, `DATABASE_URL`, `ALLOWED_ORIGINS`

### Frontend → Vercel

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Framework preset: **Next.js**
3. Root Directory: `frontend`
4. Add environment variable:
```env
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
```
5. Click **Deploy** ✅

---

## 📡 API Reference

```
POST /analyze          → Analyze resume against job description
                         Body: { resume_text, job_description }
                         Returns: { ats_score, keyword_score, format_score,
                                    impact_score, alignment_score,
                                    missing_keywords[], found_keywords[],
                                    rewrites[] }

GET  /history          → Get all past scan results
GET  /history/{id}     → Get single scan result
```

---

## 📊 How the ATS Score Works

```
ATS Score (100pts)
├── Keyword Match     → 40pts   (spaCy NLP keyword extraction)
├── Impact Score      → 25pts   (numbers, action verbs in bullets)
├── Format Score      → 20pts   (sections, length, structure)
└── Alignment Score   → 15pts   (role-level match, title alignment)
```

---

## 🤝 Contributing

```bash
# Fork the repo
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "Add your feature"

# Push and open PR
git push origin feature/your-feature
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Author

**Jayesh Bhoge**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/yourusername)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yourportfolio.com)

---

<div align="center">

⭐ **If ResumeIQ helped you — drop a star, it means a lot!** ⭐

*Built with ❤️ by Jayesh Bhoge*

</div>
