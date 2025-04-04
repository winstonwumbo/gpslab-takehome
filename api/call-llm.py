from google import genai
import os
from http.server import BaseHTTPRequestHandler
 
class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        client = genai.Client(api_key=os.environ.get('GOOGLE_LLM_KEY'))

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents="Summarize the following crypto scam description by law enforcement. You don't need to use full sentences all the time, but focus on important figures and statistics. Don't use Markdown styling like asterisks (*): The victim was introduced to “Enze Zhao” in a WeChat group. Zhao told the victim he was interested in her, and they continued to communicate. The victim gradually fell in love, believing she and Zhao shared many interests and values.  Zhao told the victim he was an economics major and his hobby is to earn extra money through Rui Win Capitals LTD.  Zhao convinced the victim they had a future together, but wanted her to do better financially, so they could build a house together in the Bay area. Zhao then suggested he could teach the victim to invest Gold Dollars on Meta Traders 5 through Rui Win. She put in $500,000, and Zhao told her she had completed a deal successfully and now had more than a million.  But, she was told she had to pay 20% tax on the profit.",
        )

        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write(response.text.encode('utf-8'))
        return