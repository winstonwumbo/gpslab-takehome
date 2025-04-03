from http.server import BaseHTTPRequestHandler
import json
import io
from scrapy import Spider
from scrapy.crawler import CrawlerProcess
from contextlib import redirect_stdout


class DFPISpider(Spider):
    name = 'dfpi_spider'
    start_urls = ['https://dfpi.ca.gov/consumers/crypto/crypto-scam-tracker/']
    results = []  # Initialize results list here

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.results = []  # Initialize results list here

    def parse(self, response):
        for row in response.xpath("//table/tbody/tr"):
            self.results.append({
                "title": row.xpath("td[1]//text()").get(),
                "category": row.xpath("td[3]//text()").get(),
                "source": "DFPI",
                "description": row.xpath("td[2]//text()").get(),
            })


class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        f = io.StringIO()
        with redirect_stdout(f):
            process = CrawlerProcess(
                settings={
                    "AUTOTHROTTLE_ENABLED": True,
                    "AUTOTHROTTLE_START_DELAY": 5.0,
                    "AUTOTHROTTLE_MAX_DELAY": 60.0,
                    "AUTOTHROTTLE_TARGET_CONCURRENCY": 1.0,
                    "CONCURRENT_REQUESTS": 1,
                    "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
                    "USER_AGENT": "Penn State GPS Lab tfs5747@psu.edu",
                }
            )
            process.crawl(DFPISpider)
            process.start()
        response = {
            "data": DFPISpider.results,
            "code": 200
        }

        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
        return