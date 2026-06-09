import requests

url = 'http://localhost:8000/api/analyze'
files = {'resume': ('test.docx', open('test.docx', 'rb'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
data = {'job_description': 'Software Engineer'}

try:
    res = requests.post(url, files=files, data=data)
    print("Status Code:", res.status_code)
    print("Response JSON:", res.json())
except Exception as e:
    print("Error:", e)
