import os
import json
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from resume_parser import extract_text_from_pdf, score_resume, extract_weak_bullets
from groq_client import rewrite_bullets_improved
from database import get_db_connection

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="ResumeIQ Backend")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
allowed_origins = [o.strip() for o in allowed_origins_str.split(",") if o.strip()]

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {"message": "ResumeIQ API is running."}

@app.get("/api/history")
def get_history():
    conn = get_db_connection()
    if not conn:
        return []
    
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, filename, ats_score, created_at FROM resume_scans ORDER BY created_at DESC LIMIT 50")
        rows = [dict(row) for row in cur.fetchall()]
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []

@app.get("/api/history/{scan_id}")
def get_history_detail(scan_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=503, detail="DB unavailable")
    
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM resume_scans WHERE id = %s", (scan_id,))
    row = cur.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
        
    def safe_json_loads(val):
        if not val:
            return []
        try:
            return json.loads(val)
        except:
            return []
            
    return {
        "ats_score": row["ats_score"] or 0,
        "sub_scores": {
            "keyword_score": row["keyword_score"] or 0,
            "format_score": row["format_score"] or 0,
            "impact_score": row["impact_score"] or 0,
            "alignment_score": row["alignment_score"] or 0
        },
        "missing_keywords": safe_json_loads(row["missing_keywords"]),
        "found_keywords": safe_json_loads(row["found_keywords"]),
        "rewrites": safe_json_loads(row["rewrites"])
    }

@app.post("/api/analyze")
@limiter.limit("10/minute")
async def analyze_resume(
    request: Request,
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # 1. Read File & Validate Type
    allowed_mime_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if resume.content_type not in allowed_mime_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX are allowed.")
    pdf_bytes = await resume.read()
    if len(pdf_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size is 5MB.")

    resume_text = extract_text_from_pdf(pdf_bytes, resume.filename)
    
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the provided PDF or DOCX file.")
        
    # 2. Score Resume
    scores = score_resume(resume_text, job_description)
    
    # 3. Extract weak bullets and get rewrites
    weak_bullets = extract_weak_bullets(resume_text)
    rewrites = rewrite_bullets_improved(weak_bullets, job_description)
    
    # Prepare result payload
    result = {
        "ats_score": scores["ats_score"],
        "sub_scores": {
            "keyword_score": scores["keyword_score"],
            "format_score": scores["format_score"],
            "impact_score": scores["impact_score"],
            "alignment_score": scores["alignment_score"],
            "section_score": scores.get("section_score", 0)
        },
        "missing_keywords": scores["missing_keywords"],
        "found_keywords": scores["found_keywords"],
        "sections_found": scores.get("sections_found", []),
        "tips": scores.get("tips", []),
        "rewrites": rewrites
    }
    
    # 4. Save to Database
    try:
        conn = get_db_connection()
        if conn:
            cur = conn.cursor()
            cur.execute(
                """
                INSERT INTO resume_scans 
                (filename, ats_score, keyword_score, format_score, impact_score, alignment_score, missing_keywords, found_keywords, rewrites)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    resume.filename,
                    scores["ats_score"],
                    scores["keyword_score"],
                    scores["format_score"],
                    scores["impact_score"],
                    scores["alignment_score"],
                    json.dumps(scores["missing_keywords"]),
                    json.dumps(scores["found_keywords"]),
                    json.dumps(rewrites)
                )
            )
            conn.commit()
            cur.close()
            conn.close()
    except Exception as e:
        print(f"Failed to save to database: {e}")
        
    return result

@app.delete("/api/history/{scan_id}")
def delete_scan(scan_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=503, detail="DB unavailable")
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM resume_scans WHERE id = %s", (scan_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True}
    except Exception as e:
        print(f"Error deleting scan: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete scan")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
