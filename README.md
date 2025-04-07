# Take-Home Assignment for GPS Lab

A prototype dashboard for tracking cryptocurrency fraud. Try the live demo at: https://gpslab-dashboard.vercel.app/

Or read the [Local Setup](#local-setup) section for a guided walkthrough on deploying locally!

## Tables of Contents
* [Primary Dependencies](#primary-dependencies)
* [What is Vercel?](#what-is-vercel)
* [Local Setup](#local-setup)
* [Dashboard Layout](#dashboard-layout)
* [Frontend Architecture](#frontend-architecture)
* [Backend Architecture](#backend-architecture)
* [Database Architecture](#database-architecture)
* [Notable Packages for Data Collection & Engineering](#notable-packages-for-data-collection--engineering)
* [Constraints](#constraints)

## Primary Dependencies
* Python
* Node.js
* Git
* GitHub Account

## What is Vercel?
Vercel is a powerful cloud-hosting platform that's popular for its **serverless function** tooling. **Serverless functions** allow developers to setup API endpoints within their project without deploying a whole web server. This makes applications more lightweight and easier to distribute.

The live demo on `vercel.app` will dynamically load my **API credentials**. However, to test the full dashboard locally, you will need to perform some extra setup on the Vercel website.

### Vercel Steps
1. Authenticate with Vercel using your GitHub account:
    * https://vercel.com/
2. Create a new project using the **Add New** button:
    * Name the project `gpslab-dashboard`
4. Add environment variables on the **Settings** Page:
    * `CHAINABUSE_API_KEY`
    * `GOOGLE_LLM_KEY`
    * `TURSO_DB_URL`
    * `TURSO_DB_KEY`
4. Install the Vercel CLI on your device:
```
npm i -g vercel
```

## Local Setup
1. Download the repository from GitHub: 
```
git clone git@github.com:winstonwumbo/gpslab-takehome.git
```
2. Create a Python Virtual Environment (venv):
    * On Windows
    ```
    py -m venv .venv
    ```
    * On Unix
    ```
    python3 -m venv .venv
    ```
3. Start the Python venv:
```
source .venv/bin/activate
```
4. Install the Python dependencies:
```
pip install -r requirements.txt
```
5. Install the Node.js dependencies:
```
npm install
```
6. Link with your Vercel project:
```
vercel
```
7. When prompted, enter the following:
```
? Link to existing project? yes
? What’s the name of your existing project? gpslab-dashboard
```
8. Pull your environment variables (API credentials) from Vercel:
```
vercel pull
```
9. Launch the local project:
``` 
npm start
```

### Note
If you would like to examine my local Jupyter Notebooks, please install the `jupyter` dependency for Python as well. The dependency is not included with the `requirements.txt due to constraints with Vercel.
```
pip install jupyter
```

## Dashboard Layout
As an early prototype, the dashboard follows the following layout for simplicity:

1. **Interaction Menu**
2. **Fraud Listing Table**
3. **Figures of Frequency Patterns**
4. **Graph Visualizations**
5. **LLM Summary**

## Frontend Architecture
1. **Framework: LitElement (Web Components)**
    * Through my time as a Student Researcher at **HAX Lab**, I have gained significant experience with the **Web Component** standard. The particular framework **LitElement** was created by Google.
    * **Web Components** allow developers to create **encapsulated** JavaScript components that are usable in standard HTML as **custom tags**. This creates a similar workflow to frameworks like React but removes the heavy performance overhead.
    * Learn more at:
        * https://www.webcomponents.org/introduction
        * https://developer.mozilla.org/en-US/docs/Web/API/Web_components
        * https://lit.dev/

2. **CSS: DDD Design System**
    * The **DDD Design System**, short for Develop, Design, Destroy, is a CSS library created by **HAX Lab**.
    * It is similar in usage to other CSS libraries like **Tailwind** and **Bootstrap**; however, it is built entirely through modules that follow the **Web Component** standard.
    * Learn more at:
        * https://oer.hax.psu.edu/bto108/sites/haxcellence/welcome
        * https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd

3. **Data Visualization: Chart.js**
    * **Chart.js** is a simple yet flexible JavaScript library for creating interactive graphs, plots, and charts. 
    * **Chart.js** is much simpler than alternative JavaScript-based solutions, such as D3.js and Plotly. Rather than spending a long time learning syntax, developers can focus on interactions instead. This makes it more efficient for creating basic prototypes. Its smaller size also makes it more performant.
    * Learn more at:
        * https://www.chartjs.org/

## Backend Architecture
1. **Framework: Flask** 
    * **Flask** is a Python server framework designed to simplify setting up the routing process. It is extremely lightweight and considered a **microframework** because it doesn't require any other libraries.
    * **Flask** is supported as a valid Python layout for **Vercel serverless functions**. 
    * Learn more at:
        * https://flask.palletsprojects.com/
2. **API Runtime: Vercel Serverless Functions**
    * **Vercel Serverless Functions** allow developers to assign API endpoints without running a dedicated server. 
    * **Vercel** routes **serverless functions** through temporary containers. The process instantly spins up and deletes itself when completed. 
    * **Vercel** reduces the complexity of maintaining a separate, dedicated server for web applications.
    * Learn more at:
        * https://vercel.com/docs/functions

## Database Architecture
1. **Platform: Turso (SQLite)**
    * **SQLite** is a popular and unique database engine, which the entire database is embedded into a single file. This makes **SQLite** databases extremely portable and lightweight. They can even be stored directly on GitHub as a binary file.
        * The ease of sharing was a key reason for my decision to use **SQLite** for this dashboard project.
        * Other databases such as **Postgres** can be more performant, but sharing access is much more complex.
    * **Turso** is a cloud provider that focuses on databases. It provides a generous free tier for cloud SQLite databases, in addition to a comprehensive API.
        * Simple **SQLite** works well for locally testing; however, website hosts like Vercel are not able to access this local file. Therefore, this cloud provider is an excellent option for maintaining the live demo.
        * A conditional function has been implemented. When the project is run on Vercel, it will use the Turso database, and when it is run on a local device, it will use the repository's SQLite file.
    * Learn more at:
        * https://www.sqlite.org/
        * https://docs.turso.tech/introduction

## Notable Packages for Data Collection & Engineering
1. **Google Generative AI**
    * Google provides API access to its Gemini and Ollama models with a generous free tier. These characteristics made it an excellent choice for the prototype dashboard.
    * The Gemini LLM model is currently used to summarize suspicious behavior from a given fraud listing.
    * ```
      pip install google-genai
      ```
    * Learn more at:
        * https://ai.google.dev/gemini-api/docs
2. **Jupyter**
    * **Project Jupyter** is a data science toolkit designed around the Python kernel. It is most well-known for **Jupyter Notebooks**, a document format that visualizes computational Python code. 
    * Developers can separate the **Jupyter Notebook** between code cells and comment cells. **Jupyter Notebooks** establish a very clear progression of Python execution.
    * In addition to education, **Jupyter Notebooks** are also useful for testing data manipulation code in a contained environment.
    * ```
      pip install jupyter
      ```
    * Learn more at:
        * https://jupyter.org/
3. **Pandas**
    * **Pandas** is a data analysis library designed for manipulating text data. It is commonly implemented in **Extract, Transform, Load (ETL)** pipelines, where users need to integrate multiple sources into one dataset.
    * **Pandas** supports **regular expressions (regex)**, which allows developers to parse text for specific patterns. This makes it an excellent tool for manual **language processing**.
    * **Dataframes in Pandas** follow a two-dimensional table structure, quite similar to CSV or XLSX files. This familiarity greatly simplifies learning the basics.
    * The **Apache Spark** engine is a similar tool for large-scale data processing. There is a Python package for interfacing with it named `pyspark`.
        * The platform is ubiquitous in **big data**, but its complexity is not necessary for the scale of the current dataset.
    * ```
      pip install pandas
      ```
    * Learn more at:
        * https://pandas.pydata.org/
4. **Scrapy**
    * **Scrapy** is a web crawling framework built for general-purpose use with Python. It is lightweight and supports programmatic scraping in Python scripts. Users do not need to run separate shell commands to scrape data with **Scrapy**.
    * **Scrapy** is being utilized in multiple **Vercel serverless functions** to update the **Turso** database.
    * ```
      pip install scrapy
      ```
    * Learn more at:
        * https://scrapy.org/

## Constraints
While working on the project, I discovered a number of constraints with the fraud listing sources and my chosen technologies. A compilation of my experiences is located in the [CONSTRAINTS.md](CONSTRAINTS.md) file.