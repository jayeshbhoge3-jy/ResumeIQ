# ResumeIQ

ResumeIQ is a fast, AI-powered resume checker that scores your resume against a target job description. It provides a comprehensive ATS score, keyword gap analysis, format checking, and AI-driven rewrites for weak bullet points.

The project is built with:
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion, GSAP
- **Backend**: FastAPI (Python), PostgreSQL, spaCy, Groq (Llama-3 70B)

## Features
- **ATS Score**: Get an overall fit score based on keywords, impact, format, and section alignment.
- **Keyword Gap Analysis**: Instantly see which important keywords you are missing from the job description.
- **AI Bullet Rewrites**: Automatically identifies weak bullet points lacking numbers/impact and rewrites them using Groq's fast LLM API.
- **History**: Keeps track of all your past scans and scores.

---

## Local Setup

### 1. Database Setup
Make sure you have PostgreSQL installed. Create a database for the project and run the following schema to create the required table:
```sql
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

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Download the required spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```
4. Create a `.env` file based on `.env.example`:
   ```env
   GROQ_API_KEY=your_groq_api_key
   DATABASE_URL=postgresql://user:password@localhost:5432/resumeiq
   ALLOWED_ORIGINS=http://localhost:3000,https://your-production-url.com
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.local.example`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## Deployment

### Deploying the Backend (Render / Railway / Heroku)
The backend is configured to easily deploy on Render or similar platforms using the included `Procfile`.

1. Create a new Web Service on Render and link your GitHub repository.
2. Set the Root Directory to `backend`.
3. Set the Build Command to:
   ```bash
   pip install -r requirements.txt && python -m spacy download en_core_web_sm
   ```
4. Set the Start Command to:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   *(Or simply let Render use the `Procfile`)*
5. Add your Environment Variables (`GROQ_API_KEY`, `DATABASE_URL`, `ALLOWED_ORIGINS`).

### Deploying the Frontend (Vercel)
The frontend is optimized for deployment on Vercel.

1. Import your GitHub repository into Vercel.
2. Set the Framework Preset to **Next.js**.
3. Set the Root Directory to `frontend`.
4. Add the `NEXT_PUBLIC_API_URL` environment variable, pointing to your deployed backend URL (e.g., `https://your-backend-app.onrender.com`).
5. Click **Deploy**.
