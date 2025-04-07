from http.server import BaseHTTPRequestHandler
import json
import io
from scrapy import Spider, Request
from scrapy.crawler import CrawlerProcess
from contextlib import redirect_stdout
import pandas as pd
import re


class SECSpider(Spider):
    name = 'sec_spider'
    start_urls = ['https://www.sec.gov/about/divisions-offices/division-enforcement/cyber-crypto-assets-emerging-technology/enforcement-actions']
    results = []  # Initialize results list here

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def parse(self, response):
        table = response.xpath('//table')[0]
        category = "Crypto Assets"

        sec_map = []
        for row in table.xpath('tbody/tr'):
            for item in row.xpath("td[1]//a/@href").getall():
                sanitized_url = response.urljoin(item);
                if row.xpath("td[2]//text()").get() == "\n":
                    date = row.xpath("td[2]/p[1]/text()").get()
                else:
                    date = row.xpath("td[2]//text()").get()
                yield Request(sanitized_url, callback=self.parse_item, meta={"category": category, "date": date})
                                            
    def parse_item(self, response):
        # Process description
        description = response.xpath("//div[contains(@class, 'field--name-body')]//p//text()").getall()
        for index in range(len(description)):
            description[index] = description[index].strip()
        cleaned_description = ' '.join(description)
        self.results.append({
            'title': response.xpath('//h1[contains(@class, "page-title__heading")]//text()').get().strip(),
            'category': response.meta["category"],
            'date': response.meta["date"],
            'source': "SEC",
            'description': cleaned_description
        });


class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        f = io.StringIO()
        with redirect_stdout(f):
            process = CrawlerProcess(
                settings={
                    "AUTOTHROTTLE_ENABLED": True,
                    "AUTOTHROTTLE_START_DELAY": 2.5,
                    "AUTOTHROTTLE_MAX_DELAY": 60.0,
                    "AUTOTHROTTLE_TARGET_CONCURRENCY": 2.0,
                    "CONCURRENT_REQUESTS": 5,
                    "CONCURRENT_REQUESTS_PER_DOMAIN": 5,
                    "USER_AGENT": "Penn State GPS Lab tfs5747@psu.edu",
                }
            )
            process.crawl(SECSpider)
            process.start()
        df = pd.DataFrame(SECSpider.results)

        df['date'] = pd.to_datetime(df['date'], format='%m/%d/%Y')
        df['date'] = df['date'].dt.strftime('%Y-%m')

        pattern = r'\b(BTC|Bitcoin|BSC|Binance\s*Smart\s*Chain|ETH|Ethereum|SOL|Solana|MATIC|Polygon|TRX|Tron|LTC|Litecoin|ARB|Arbitrum|AVAX|Avalanche|HBAR|Hedera|BASE|Base|ADA|Cardano|EGLD|MultiversX|ALGO|Algorand)\b'
        crypto_map = {
            'BTC': 'Bitcoin',
            'BSC': 'Binance Smart Chain',
            'ETH': 'Ethereum',
            'SOL': 'Solana',
            'MATIC': 'Polygon',
            'TRX': 'Tron',
            'LTC': 'Litecoin',
            'ARB': 'Arbitrum',
            'AVAX': 'Avalanche',
            'HBAR': 'Hedera',
            'BASE': 'Base',
            'ADA': 'Cardano',
            'EGLD': 'MultiversX',
            'ALGO': 'Algorand',
        }
        df['currency_type'] = df['description'].str.extract(pattern, flags=re.IGNORECASE)
        df['currency_type'] = df['currency_type'].str.upper().map(crypto_map).fillna(df['currency_type'])
        df['currency_type'] = df['currency_type'].str.capitalize()

        df['currency_amount'] = df['description'].apply(
            lambda s: (
                sum(float(amt.replace('$', '').replace(',', '')) 
                    for amt in re.findall(r'\$\d{1,3}(?:,\d{3})*(?:\.\d+)?', s))
                # Add word-based amounts (1.5 million)
                + sum(
                    float(num) * {'thousand': 1_000, 'million': 1_000_000, 'billion': 1_000_000_000, 'hundred': 100}.get(unit.lower(), 1)
                    for (_, num, unit) in re.findall(
                        r'(\$?(\d+\.?\d*)\s+(million|thousand|billion|hundred))', 
                        s, flags=re.IGNORECASE
                    )
                ))
        )

        df['currency_amount'] = df['currency_amount'].map('{:,.0f}'.format)

        df['currency_amount'] = df['currency_amount'].str.replace(',', '').astype(float)

        df = df.replace({float('nan'): None})

        json_out = df.to_dict("records")

        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(json_out, indent=2).encode('utf-8'))
        return