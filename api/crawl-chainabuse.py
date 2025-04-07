from http.server import BaseHTTPRequestHandler
import json
import io
from scrapy import Spider, Request
from scrapy.crawler import CrawlerProcess
from contextlib import redirect_stdout
import pandas as pd
import re
from urllib.parse import urljoin

class ChainAbuseSpider(Spider):
    name = 'chainabuse_spider'
    start_urls = ['https://www.chainabuse.com/reports']
    results = []  # Initialize results list here

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def parse(self, response):
        category = "Twitter Scam"

        self.results.append({
            'description': response.xpath("//html").get()
        })
        for thread_card in response.xpath('//div[contains(@class, "create-ScamReportCard")]'):
            # date = thread_card.xpath('div[contains(@class, "thread-card")]/div[contains(@class, "thread-info")]//text()').get()
            # if not re.search(r',', date):
            #     date = date + ", 2025"
            
            description = thread_card.xpath('//div[contains(@class, "create-LexicalViewer")]/p[contains(@class, "create-Editor__paragraph")]//text()').getall()
            post_info = thread_card.xpath('div[contains(@class, "create-ScamReportCard__submitted-info")]//text()').getall()
            url = urljoin("https://www.chainabuse.com/profile/", thread_card.xpath('div[contains(@class, "create-ScamReportCard__submitted-info")]//a/@href').get())
            self.results.append({
                'description': "hello"
            })
            # yield Request(sanitized_url, callback=self.parse_item, meta={"title": title, "category": category, "date": date, "source_url": sanitized_url})
                                            
    # def parse_item(self, response):
    #     # Process description
    #     description = response.xpath("//div[contains(@class, 'allow-preview')]//text()").getall()
    #     for index in range(len(description)):
    #         description[index] = description[index].strip()
    #     cleaned_description = ' '.join(description)
    #     self.results.append({
    #         'title': response.meta["title"],
    #         'category': response.meta["category"],
    #         'date': response.meta["date"],
    #         'source': "ZachXBT",
    #         'source_url': response.meta['source_url'],
    #         'description': cleaned_description
    #     });


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
            process.crawl(ChainAbuseSpider)
            process.start()
        
        # df = pd.DataFrame(ChainAbuseSpider.results)

        # df['date'] = pd.to_datetime(df['date'], format='%b %d, %Y')
        # df['date'] = df['date'].dt.strftime('%Y-%m')

        # pattern = r'\b(BTC|Bitcoin|BSC|Binance\s*Smart\s*Chain|ETH|Ethereum|SOL|Solana|MATIC|Polygon|TRX|Tron|LTC|Litecoin|ARB|Arbitrum|AVAX|Avalanche|HBAR|Hedera|BASE|Base|ADA|Cardano|EGLD|MultiversX|ALGO|Algorand)\b'
        # crypto_map = {
        #     'BTC': 'Bitcoin',
        #     'BSC': 'Binance Smart Chain',
        #     'ETH': 'Ethereum',
        #     'SOL': 'Solana',
        #     'MATIC': 'Polygon',
        #     'TRX': 'Tron',
        #     'LTC': 'Litecoin',
        #     'ARB': 'Arbitrum',
        #     'AVAX': 'Avalanche',
        #     'HBAR': 'Hedera',
        #     'BASE': 'Base',
        #     'ADA': 'Cardano',
        #     'EGLD': 'MultiversX',
        #     'ALGO': 'Algorand',
        # }
        # df['currency_type'] = df['description'].str.extract(pattern, flags=re.IGNORECASE)
        # df['currency_type'] = df['currency_type'].str.upper().map(crypto_map).fillna(df['currency_type'])

        # df['currency_amount'] = df['description'].apply(
        #     lambda s: sum(
        #         float(num.replace(',', '')) * {'k': 1e3, 'm': 1e6, 'b': 1e9}.get(unit.lower(), 1)
        #         for (num, unit) in re.findall(
        #             r'\$(\d{1,3}(?:,\d{3})*(?:\.\d*)?)([KkMmBb]?)\b', 
        #             str(s)
        #         )
        #         if num.replace(',', '').replace('.', '').isdigit()
        #     )
        # )

        # df['currency_type'] = df['currency_type'].str.capitalize()

        # df['currency_amount'] = df['currency_amount'].map('{:,.0f}'.format)
        # df['currency_amount'] = df['currency_amount'].str.replace(',', '').astype(float)

        # df = df.replace({float('nan'): None})

        # json_out = df.to_dict("records")

        json_out = {
            "data": ChainAbuseSpider.results,
        }
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(json_out, indent=2).encode('utf-8'))
        return