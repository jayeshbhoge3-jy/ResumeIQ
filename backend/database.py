import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    if not DATABASE_URL:
        print("DATABASE_URL not set in .env")
        return None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS resume_scans (
                id SERIAL PRIMARY KEY,
                filename TEXT,
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
        """)
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Database initialization error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
