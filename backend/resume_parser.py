import io
import re
import pdfplumber

import spacy
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

def extract_text_from_pdf(file_bytes: bytes, filename: str = "") -> str:
    """Extracts text from a PDF or DOCX file."""
    text = ""
    
    if filename.lower().endswith(".docx"):
        try:
            from docx import Document
            doc = Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
            if not text.strip():
                with open("docx_error.log", "w") as f:
                    f.write(f"DOCX extracted empty text. Filename: {filename}")
            return text
        except Exception as e:
            err_msg = f"Error reading DOCX: {e}"
            print(err_msg)
            with open("docx_error.log", "w") as f:
                f.write(err_msg)
            return ""

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                # Try with specific layout tolerances, fallback to default
                extracted = page.extract_text(x_tolerance=2, y_tolerance=3)
                if not extracted:
                    extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        err_msg = f"Error reading PDF: {e}"
        print(err_msg)
        with open("pdf_error.log", "w") as f:
            f.write(err_msg)
        
    if not text.strip():
        with open("pdf_error.log", "w") as f:
            f.write(f"Extraction resulted in empty text. Filename: {filename}, Bytes length: {len(file_bytes)}")
            
    return text

def extract_keywords(text: str) -> set:
    """A basic keyword extraction using spaCy (noun chunks and proper nouns)."""
    stop_words = {"the", "and", "for", "with", "that", "this", "have", "from", "are", "was", "will", "been", "has", "had"}
    
    if not nlp:
        # Fallback to simple split if model not loaded
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text)
        return set(word.lower() for word in words if word.lower() not in stop_words)
    
    doc = nlp(text)
    keywords = set()
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop and len(token.text) > 2:
            if token.text.lower() not in stop_words:
                keywords.add(token.text.lower())
    return keywords

def score_resume(resume_text: str, jd_text: str):
    """
    Scores the resume based on the job description.
    Returns scores and keyword gaps.
    """
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(jd_text)
    
    # Simple scoring logic
    if not jd_keywords:
        keyword_score = 100
        found_keywords = list(resume_keywords)[:15] # Cap for display
        missing_keywords = []
    else:
        found = jd_keywords.intersection(resume_keywords)
        missing = jd_keywords.difference(resume_keywords)
        
        keyword_score = int((len(found) / len(jd_keywords)) * 100)
        found_keywords = list(found)
        missing_keywords = list(missing)
        
    # Mocking other scores based on basic heuristics
    format_score = 85 if len(resume_text.splitlines()) > 10 else 50
    
    # Impact: Check for numbers/percentages
    numbers = len(re.findall(r'\d+', resume_text))
    lines = resume_text.splitlines()
    impact_score = min(100, int((numbers / max(1, len(lines))) * 80))
    
    # Alignment: Similar to keyword score
    alignment_score = max(0, keyword_score - 10)
    
    # Section Detection
    standard_sections = ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications"]
    sections_found = []
    text_lower = resume_text.lower()
    for sec in standard_sections:
        if sec.lower() in text_lower:
            sections_found.append(sec)
            
    section_score = int((len(sections_found) / 4) * 100) # Expecting at least 4 for 100%
    section_score = min(100, section_score)

    # Calculate overall ATS score (weighted average)
    ats_score = int(
        keyword_score * 0.35 +
        format_score * 0.15 +
        impact_score * 0.2 +
        alignment_score * 0.2 +
        section_score * 0.1
    )
    
    # Limit returned keywords for UI (15 max as requested)
    missing_keywords = missing_keywords[:15]
    found_keywords = found_keywords[:15]
    
    # Tips logic based on lowest score
    scores_dict = {
        "keyword_score": keyword_score,
        "impact_score": impact_score,
        "format_score": format_score,
        "alignment_score": alignment_score,
        "section_score": section_score
    }
    lowest_category = min(scores_dict, key=scores_dict.get)
    
    tips = []
    if lowest_category == "keyword_score" or keyword_score < 60:
        tips = [
            "Add these missing keywords naturally into your experience bullets.",
            "Use the exact phrasing from the job description for technical skills.",
            "Include keywords in your summary section for immediate impact."
        ]
    elif lowest_category == "impact_score" or impact_score < 60:
        tips = [
            "Add numbers and percentages to at least 3 bullet points.",
            "Quantify team sizes, budget amounts, or time saved.",
            "Use the 'Action + Context + Result' formula for bullet points."
        ]
    elif lowest_category == "format_score" or format_score < 80:
        tips = [
            "Ensure your resume uses a clean, single-column format.",
            "Avoid using images, charts, or complex tables.",
            "Use standard fonts and clear spacing between sections."
        ]
    elif lowest_category == "section_score" or section_score < 80:
        tips = [
            "Make sure your resume has clear section headings: Summary, Experience, Education, Skills.",
            "Use standard naming for sections so ATS systems can parse them.",
            "Separate your skills into a dedicated 'Skills' section."
        ]
    else:
        tips = [
            "Tailor your bullet points slightly more towards the specific role requirements.",
            "Keep your most relevant experience at the top of the resume.",
            "Ensure consistent formatting for all dates and job titles."
        ]
    
    return {
        "ats_score": ats_score,
        "keyword_score": keyword_score,
        "format_score": format_score,
        "impact_score": impact_score,
        "alignment_score": alignment_score,
        "section_score": section_score,
        "sections_found": sections_found,
        "missing_keywords": missing_keywords,
        "found_keywords": found_keywords,
        "tips": tips
    }

def extract_weak_bullets(resume_text: str) -> list:
    """Extract bullet points that lack numbers or action verbs, are too short, or start with weak verbs."""
    lines = resume_text.splitlines()
    # A basic heuristic: assume bullets are lines that are decently long or start with a bullet character.
    bullets = [line.strip() for line in lines if len(line.strip()) > 15]
    
    weak_bullets = []
    
    weak_verbs = [
        "worked", "helped", "assisted", "was responsible for", 
        "did", "made", "got", "had", "participated", "involved"
    ]
    
    for bullet in bullets:
        bullet_lower = bullet.lower().lstrip("-•* ")
        
        # 1. Starts with a weak verb
        starts_weak = any(bullet_lower.startswith(verb) for verb in weak_verbs)
        
        # 2. Shorter than 40 characters (too vague)
        too_short = len(bullet) < 40
        
        # 3. Has no numbers
        has_no_numbers = not bool(re.search(r'\d', bullet))
        
        # A bullet is weak if it's too short, starts with a weak verb, or lacks numbers
        if starts_weak or too_short or has_no_numbers:
            weak_bullets.append(bullet)
            
    # Return 5 bullets as requested
    return weak_bullets[:5]
