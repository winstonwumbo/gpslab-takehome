/**
 * Copyright 2025 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import Chart from 'chart.js/auto';
import "./gpslab-fraud-listing.js"

/**
 * `gpslab-dashboard`
 * 
 * @demo index.html
 * @element gpslab-dashboard
 */
export class GpslabDashboard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "gpslab-dashboard";
  }

  constructor() {
    super();
    this.title = "";
    this.items = [];
    this.llmSummary = "No Case Queried";
    this.categoryFrequency = [];
    this.sourceFrequency = [];
    this.currencyFrequency = [];
    this.currentFilter = "AllSources";
    this.fraudTimeline = [];
    this.fraudCount = [];
    this.fraudPieChart = [];
    this.fraudAmount = [];
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      items: { type: Array },
      llmSummary: { type: String, attribute: "llm-summary" },
      categoryFrequency: { type: Array, attribute: "category-frequency" },
      sourceFrequency: { type: Array, attribute: "source-frequency" },
      currencyFrequency: { type: Array, attribute: "currency-frequency" },
      currentFilter: { type: String, attribute: "current-filter" },
      fraudTimeline: { type: Array, attribute: "fraud-timeline" },
      fraudCount: { type: Array, attribute: "fraud-count" },
      fraudPieChart: { type: Array, attribute: "fraud-pie-chart" },
      fraudAmount: { type: Array, attribute: "fraud-amount" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--gpslab-dashboard-label-font-size, var(--ddd-font-size-s));
      }
      h6 {
        margin: 16px 0;
        text-align: center;
      }
      button {
        background-color: var(--ddd-theme-default-beaverBlue);
        color: white;
        border: 1px solid skyblue;
        border-radius: 4px;
        padding: 16px;
        font-weight: bold;
        cursor: pointer;
      }
      button:hover {
        background-color: #383838;
      }
      form input {
        margin-left: 16px;
      }
      form label {
        padding: 16px;
      }
      .llm-summary {
        text-align: center;
        font-family: var(--ddd-font-navigation);
        border-radius: 4px;
        border: 1px solid black;
        color: black;
      }
      .nav-menu {
        display: flex;
        justify-content: space-between;
      }

      .source-filter {
        display: flex;
      }
 
      .upper-container {
        display: flex;
        max-height: 550px;
      }
      .fraud-listings {
        display: flex;
        flex: 7;
        flex-direction: column;
      }
      .table-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-height: 500px;
        overflow-y: scroll;
      }
      .fraud-table {
        display: table;
      }
      .table-row {
        display: table-row;
      }
      .table-cell {
        display: table-cell;
        width: 40px;
        border: 1px solid black;
      }
      .frequency-counts {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
      }
      .frequency-counts > h6 {
        margin-left: 40px;
      }
      .frequency-counts > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-family: var(--ddd-font-navigation);
        border-radius: 4px;
        border: 1px solid black;
        margin-left: 40px;
        min-width: 120px;
      }
      .category-frequency p {
        color: red;
      }
      .source-frequency p {
        color: green;
      }
      .currency-frequency p {
        color: indigo;
      }

      .chart-visuals {
        display: flex;
      }
      .chart-container {
        width: 50%;
        height: 500px;
      }
      @media only screen and (max-width: 1800px) {
      h6 {
        min-height: 48px;
      }
      .chart-container {
        width: 50%;
        height: 350px;
      }
    }

    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <div class="nav-menu">
    <button @click="${this.updateDatabase}">Refresh Database</button>
    <form class="source-filter">
      <input type="radio" id="allsources" name="source_view" value="AllSources" @change=${this.handleFilterChange}>
      <label for="allsources">All</label><br>
      <input type="radio" id="chainabuse" name="source_view" value="ChainAbuse" @change=${this.handleFilterChange}>
      <label for="chainabuse">ChainAbuse</label><br>
      <input type="radio" id="dfpi" name="source_view" value="DFPI" @change=${this.handleFilterChange}>
      <label for="dfpi">California DFPI</label><br>
      <input type="radio" id="sec" name="source_view" value="SEC" @change=${this.handleFilterChange}>
      <label for="sec">SEC</label><br>
      <input type="radio" id="zachxbt" name="source_view" value="ZachXBT" @change=${this.handleFilterChange}>
      <label for="zachxbt">ZachXBT</label>
    </form>

    <div class="current-filter">
      Current Filter: ${this.currentFilter}
    </div>
  </div>

  <div class="upper-container">
  <div class="fraud-listings">
  <h6>Select a table item to generate an LLM Case Summary</h6>

  <div class="table-container">
    <div class="fraud-table">
      <div class="table-row">
        <div class="table-cell">Title</div>
        <div class="table-cell">Fraud Category</div>
        <div class="table-cell">Date</div>
        <div class="table-cell">Source</div>
        <div class="table-cell">Currency Types</div>
        <div class="table-cell">Amount Stolen</div>
      </div>
      ${this.items.map((item, index) => html`
        <gpslab-fraud-listing @click="${this.analyzeCaseWithLLM}" title=${item[1]} fraud-category=${item[2]} date=${item[3]} source=${item[4]} source-url=${item[5]} currency-types=${item[6]} currency-amount=${item[7]} description=${item[8]}></gpslab-fraud-listing>
        `)}
    </div>
      </div>
  </div>
  <div class="frequency-counts">
  <h6>Frequency Figures</h6>
  <div class="category-frequency">
    <h6>Fraud Category</h6>
    <p>${this.categoryFrequency[0] ? this.categoryFrequency[0] : "Null"}<br>
    Count: ${this.categoryFrequency[1] ? this.categoryFrequency[1] : "Null"}
    </p>
    </div>
  <div class="source-frequency">
    <h6>Fraud Database</h6>
    <p>${this.sourceFrequency[0] ? this.sourceFrequency[0] : "Null"}<br>
    Count: ${this.sourceFrequency[1] ? this.sourceFrequency[1] : "Null"}
    </p>
    </div>
    <div class="currency-frequency">
    <h6>Blockchain</h6>
    <p>${this.currencyFrequency[0] ? this.currencyFrequency[0] : "Null"}<br>
    Count: ${this.currencyFrequency[1] ? this.currencyFrequency[1] : "Null"}
    </p>
    </div>
    </div>
  </div>
  <div class="chart-visuals">
  <div class="chart-container">
  <canvas id="myChart"></canvas>
  </div>
  <div class="chart-container">

  <canvas id="myChart2"></canvas>
</div>
</div>

  <div class="llm-summary">
    <h4>LLM Summary</h4>
    ${this.llmSummary.split('\n').map(line => html`<p>${line}</p>`)}
  </div>
</div>`;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.retrieveDatabase();
    this.frequencyChart();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("fraudTimeline") || changedProperties.has("fraudCount")) {
      this.frequencyChart();
    }
  }

  handleFilterChange(event) {
    this.currentFilter = event.target.value;

    this.retrieveDatabase();
  }

  async updateDatabase(){
    try {

      const secResponse = await fetch(`api/crawl-sec`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json()
      }).then((data) => {
        return data
      });
      const dfpiResponse = await fetch(`api/crawl-dfpi`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json()
      }).then((data) => {
        return data
      });

      const zachxbtResponse = await fetch(`api/crawl-zachxbt`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json()
      }).then((data) => {
        return data
      });

      console.log([...secResponse, ...dfpiResponse, ...zachxbtResponse])

      const combinedResponse = [...secResponse, ...dfpiResponse, ...zachxbtResponse]

      const request = await fetch('api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: combinedResponse,
        }),
      });
  
      const activateRequest = await request.json();
      this.retrieveDatabase();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async retrieveDatabase(){
    try {
      const param = {
        sourceFilter: this.currentFilter,
      }

      const response = await fetch(`api/database?${new URLSearchParams(param).toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const output = await response.json();
      console.log(output);
      this.items = output.data.rows;
      this.categoryFrequency = output.category_frequency.rows[0];
      console.log(this.categoryFrequency)
      this.sourceFrequency = output.source_frequency.rows[0];
      this.currencyFrequency = output.currency_frequency.rows[0];

      this.fraudTimeline = output.fraud_timeline.rows.map(item => item[0]);
      this.fraudCount = output.fraud_timeline.rows.map(item => item[1]);

      this.fraudPieChart = output.amount_stolen_by_category.rows.map(item => item[0]);
      this.fraudAmount = output.amount_stolen_by_category.rows.map(item => item[2]);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  frequencyChart(){
    const ctx = this.renderRoot.querySelector('#myChart');
    Chart.getChart(ctx)?.destroy(); // Destroy the previous chart instance if it exists
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.fraudTimeline,
        datasets: [{
          label: '# of Fraud Cases',
          data: this.fraudCount,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  const ctx2 = this.renderRoot.querySelector('#myChart2');
  Chart.getChart(ctx2)?.destroy();
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: this.fraudPieChart,
      datasets: [{
        label: 'Stolen Money ($) by Fraud Category',
        data: this.fraudAmount,
        borderWidth: 1,
        hoverOffset: 4,
        minBarLength: 35,
      }]
    }, 
  });

  }
  
  // Serverless functions and API calls
  async analyzeCaseWithLLM(event){
    try {
      const response = await fetch('api/call-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: event.currentTarget.description,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      this.llmSummary = data.description;
      console.log(this.llmSummary)
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GpslabDashboard.tag, GpslabDashboard);