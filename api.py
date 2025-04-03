import scrapy
from scrapy.crawler import CrawlerProcess

class DFPISpider(scrapy.Spider):
    name = 'dfpi_spider'
    start_urls = ['https://dfpi.ca.gov/consumers/crypto/crypto-scam-tracker/']

    def parse(self, response):
        for row in response.xpath("//table/tbody/tr"):
            yield {
                "title": row.xpath("td[1]//text()").get(),
                "category": row.xpath("td[3]//text()").get(),
                "source": "DFPI",
                "description": row.xpath("td[2]//text()").get(),
            }

class SECSpider(scrapy.Spider):
    name = 'sec_spider'
    start_urls = ['https://www.sec.gov/about/divisions-offices/division-enforcement/cyber-crypto-assets-emerging-technology/enforcement-actions']

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
                yield scrapy.Request(sanitized_url, callback=self.parse_item, meta={"category": category, "date": action["date"]})
                                          
    def parse_item(self, response):
        # Process description
        description = response.xpath("//div[contains(@class, 'field--name-body')]//p//text()").getall()
        for index in range(len(description)):
            description[index] = description[index].strip()
        cleaned_description = ' '.join(description)
        yield {
            'title': response.xpath('//h1[contains(@class, "page-title__heading")]//text()').get().strip(),
            'category': response.meta["category"],
            'date': response.meta["date"],
            'source': "SEC",
            'description': cleaned_description
        }

class ZachXBTSpider(scrapy.Spider):
    name = 'zachxbt_spider'
    start_urls = ['https://threadreaderapp.com/user/zachxbt']

    def parse(self, response):
        for row in response.xpath('//div[contains(@class, "thread-card")]').getall():
            yield {
                "title": "test",
                "source": "ZachXBT",
            }

process = CrawlerProcess(
    settings={
        "AUTOTHROTTLE_ENABLED": True,
        "AUTOTHROTTLE_START_DELAY": 5.0,
        "AUTOTHROTTLE_MAX_DELAY": 60.0,
        "AUTOTHROTTLE_TARGET_CONCURRENCY": 1.0,
        "CONCURRENT_REQUESTS": 1,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "USER_AGENT": "Penn State GPS Lab tfs5747@psu.edu",
        "FEEDS": {
            "items.json": {"format": "json", "encoding": "utf-8"},
        },
    }
)

process.crawl(DFPISpider)
process.crawl(SECSpider)
# process.crawl(ZachXBTSpider)
process.start()