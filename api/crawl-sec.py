from http.server import BaseHTTPRequestHandler
import json
import io
from scrapy import Spider, Request
from scrapy.crawler import CrawlerProcess
from contextlib import redirect_stdout


class SECSpider(Spider):
    name = 'sec_spider'
    start_urls = ['https://www.sec.gov/about/divisions-offices/division-enforcement/cyber-crypto-assets-emerging-technology/enforcement-actions']
    results = []  # Initialize results list here

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def parse(self, response):
        for index, table in enumerate(response.xpath('//table')):
            match index:
                case 0:
                    category = "Crypto Assets"
                case 1:
                    category = "Account Intrusions"
                case 2:
                    category = "Hacking/Insider Trading"
                case 3:
                    category = "Market Manipulation/False Tweets/Fake Websites/Dark Web"
                case 4:
                    category = "Regulated Entities - Cybersecurity Controls and Safeguarding Customer Information"
                case 5:
                    category = "Public Company Disclosure and Controls"
                case 6:
                    category = "Trading Suspensions"
            sec_map = []
            for row in table.xpath('tbody/tr'):
                for item in row.xpath("td[1]//a/@href").getall():
                    sec_map.append({
                        "url": item,
                        "date": row.xpath("td[2]//text()").get(),
                    })
            for action in sec_map:
                sanitized_url = response.urljoin(action["url"]);
                yield Request(sanitized_url, callback=self.parse_item, meta={"category": category, "date": action["date"]})
                                            
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
                    "AUTOTHROTTLE_START_DELAY": 5.0,
                    "AUTOTHROTTLE_MAX_DELAY": 60.0,
                    "AUTOTHROTTLE_TARGET_CONCURRENCY": 2.0,
                    "CONCURRENT_REQUESTS": 2,
                    "CONCURRENT_REQUESTS_PER_DOMAIN": 2,
                    "USER_AGENT": "Penn State GPS Lab tfs5747@psu.edu",
                }
            )
            process.crawl(SECSpider)
            process.start()
        response = {
            "data": SECSpider.results,
            "code": 200
        }

        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
        return