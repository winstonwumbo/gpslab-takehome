# Take-Home Assignment for GPS Lab

A prototype dashboard for tracking cryptocurrency fraud. Try the live demo at: https://gpslab-dashboard.vercel.app/

## Dependencies
* Python
* Node.js
* Git

## What is Vercel?
Vercel is a powerful cloud-hosting platform that's popular for its **serverless function** tooling. **Serverless functions** allow developers to setup API endpoints within their project without deploying a whole web server. This makes applications more lightweight and easier to distribute.

The live demo on `vercel.app` will dynamically load my **API credentials**. However, to test the full dashboard locally, you will need to perform some extra setup on the Vercel website.

### Vercel Steps
1. Authenticate with Vercel using your GitHub account:
    * https://vercel.com/
2. Create a new project using the **Add New** button
4. Add environment variables on the **Settings** Page:
    * CHAINABUSE_API_KEY
    * GOOGLE_LLM_KEY
4. Install the Vercel CLI on your device:
```
npm i -g vercel
```

## Setup
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
6. Link with your Vercel project
```
vercel
```
7. Pull your environment variables (API credentials) from Vercel:
```
vercel pull
```
7. Launch the local project:
``` 
npm start
```

### Note
If you would like to examine my local Jupyter Notebooks, please install the `jupyter` dependency for Python as well. The dependency is not included with the `requirements.txt due to constraints with Vercel.
```
pip install jupyter
```

## Notable Frameworks/Packages
* Jupyter
* Pandas
* Scrapy
* Spacy

## Constraints
[Here](CONSTRAINTS.md)