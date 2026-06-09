import json
import os
from dotenv import load_dotenv
load_dotenv()
from groq import Groq

client = Groq(api_key=os.getenv('GROQ_API_KEY'))
try:
    completion = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[
            {'role': 'system', 'content': 'Return a JSON object with a single key "rewrites" containing a list of objects, each with "old" and "new" keys.'},
            {'role': 'user', 'content': 'Job Description: Test\n\nWeak Bullets:\n- Did some stuff'}
        ],
        temperature=0.5,
        max_tokens=1024,
        response_format={'type': 'json_object'}
    )
    print('SUCCESS:', completion.choices[0].message.content)
except Exception as e:
    print('ERROR:', str(e))
