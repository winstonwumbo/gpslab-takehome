from google import genai
import os
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
 
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        parsable_response = json.loads(post_data.decode('utf-8'))

        case_description = parsable_response.get('description')
        client = genai.Client(api_key=os.environ.get('GOOGLE_LLM_KEY'))

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Summarize the following crypto scam description by law enforcement. Use brief sentences, focused on important figures and statistics. Keep it to 4 items maximum, number them (1. text, 2.text, etc.), and don't use markdown bolding. Start directly with the content, separate each with a newline: {case_description}",
        )

        results = {
            "description": response.text
        }

        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(results, indent=2).encode('utf-8'))
        return