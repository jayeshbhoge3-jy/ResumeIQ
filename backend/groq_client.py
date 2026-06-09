import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here":
    client = Groq(api_key=GROQ_API_KEY)
else:
    client = None


# Better implementation of rewrite_bullets
def rewrite_bullets_improved(weak_bullets: list, job_description: str) -> list:
    if not client:
        print("Warning: Groq API Key not configured. Returning mock rewrites.")
        return [{"old": b.lstrip('-• '), "new": b.lstrip('-• ') + " (Mock rewritten with impact and metrics aligned to the JD)"} for b in weak_bullets]

    if not weak_bullets:
        return []

    system_prompt = (
        "You are an expert resume writer. "
        "Rewrite the provided weak resume bullet points to be more impactful. "
        "Use strong action verbs, infer reasonable quantifiable metrics if possible, and align with the job description. "
        "Return a JSON object with a single key 'rewrites' containing a list of objects, each with 'old' and 'new' keys."
    )

    user_content = f"Job Description:\n{job_description}\n\nWeak Bullets:\n" + "\n".join([f"- {b}" for b in weak_bullets])

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.5,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        response_text = completion.choices[0].message.content
        
        # Clean up markdown code blocks if the model included them
        if response_text.startswith("```"):
            response_text = response_text.strip("`").replace("json\n", "", 1)
            
        data = json.loads(response_text)
        return data.get("rewrites", [])
        
    except Exception as e:
        err_msg = f"Error calling Groq API: {e}\nResponse text: {response_text if 'response_text' in locals() else 'None'}"
        print(err_msg)
        with open("error.log", "w") as f:
            f.write(err_msg)
        return [{"old": b, "new": b + " (Failed to rewrite)"} for b in weak_bullets]
