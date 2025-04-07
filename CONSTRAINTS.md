# Constraints
Discussion on technical issues that impacted the direction of this take-home project

## Web-Scraping and API Usage
1. **ZachXBT**
    * ZachXBT uses a Twitter/X account, and the site is heavily protected against scraping. The current API only allows free users to make POST requests. Users must pay for READ access.
    * **Nitter instances**:
        * An alternative front-end to access Twitter/X from. 
        * Unfortunately, the main pages are blocked behind human user verification, making it difficult to scrape as well.
        * An RSS feed is available and accessible from Scrapy; however, it only goes back a few weeks.
    * **ThreadReaderApp** (Chosen Platform): 
        * A front-end that groups comment threads together, which makes it easier to parse related content. 
        * This website has a constraint as well though. It utilizes infinite scroll, and Scrapy cannot interact without using additional frameworks. These frameworks go beyond the size capacity for Vercel functions.
2. **ChainAbuse**
    * ChainAbuse has a polished API available for developers to interact with the platform.
    * Free users are constrained to **10 requests** maximum per month.
3. **SEC Crypto Assets**
    * The SEC website has a strict rate-limit of 10 requests per second. On the other hand, Vercel functions are limited to a **60 second** duration.
    * The crawler required a great amount of setting optimization to work properly.
4. **California DFPI**
    * The **Scam Tracking** database maintained by DFPI does not provide a data value for any cases. This makes it more difficult to normalize the database with the others.

## Components
1. **Vercel**
   * Serverless functions have a maximum runtime of **60 seconds** and a maximum dependency size of **250 MB** for free users.
2. **Natural-Language Processing (NLP)**
    * Python provides several excellent frameworks for NLP such as **Spacy**, **NLTK**, and **Google Natural Language AI**. However, these are heavy packages, and after significant testing, I realized that they exceed the size limit on **Vercel**.
    * For the purposes of this demo, I decided to manually parse the text data using **regex** and **Pandas**.