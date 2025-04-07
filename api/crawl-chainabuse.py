from http.server import BaseHTTPRequestHandler
import json
import os
import requests
import pandas as pd

class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        url = "https://api.chainabuse.com/v0/reports?includePrivate=false&page=1&perPage=50"

        headers = {
            "accept": "application/json",
            "authorization": f"Basic {os.environ.get('CHAINABUSE_API_KEY')}"
        }

        response = requests.get(url, headers=headers)

        print(response.text)

        results = []

        for item in response.json():
            results.append({
                'title': f"Report ID: {item['id']}",
                'category': item['scamCategory'],
                'date': item['createdAt'],
                'source': "ChainAbuse",
                'description': item['description'],
                "currency_type": item['losses'][0]['asset'],
                "currency_amount": item['losses'][0]['amount'],
            })
        
        df = pd.DataFrame(results)

        df['date'] = pd.to_datetime(df['date'])
        df['date'] = df['date'].dt.strftime('%Y-%m')


        df['currency_type'] = df['currency_type'].str.capitalize()

        df['currency_amount'] = df['currency_amount'].map('{:,.0f}'.format)
        df['currency_amount'] = df['currency_amount'].str.replace(',', '').astype(float)

        df.insert(3, 'source_url', pd.NA)
        df = df.replace({float('nan'): None})

        json_out = df.to_dict("records")

        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(json_out, indent=2).encode('utf-8'))
        return