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
        background-color: black;
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
      }
      .source-filter {
        display: flex;
      }
 
      .upper-container {
        display: flex;
      }
      .table-container {
        display: flex;
        flex: 7;
        flex-direction: column;
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
      <input type="radio" id="allsources" name="source_view" value="AllSources">
      <label for="allsources">All</label><br>
      <input type="radio" id="chainabuse" name="source_view" value="ChainAbuse">
      <label for="chainabuse">ChainAbuse</label><br>
      <input type="radio" id="dfpi" name="source_view" value="DFPI">
      <label for="dfpi">California DFPI</label><br>
      <input type="radio" id="sec" name="source_view" value="SEC">
      <label for="sec">SEC</label><br>
      <input type="radio" id="zachxbt" name="source_view" value="ZachXBT">
      <label for="zachxbt">ZachXBT</label>
    </form>
  </div>

  <div class="upper-container">
  <div class="table-container">
  <h6>Select a table item to generate an LLM Case Summary</h6>

  <div class="fraud-table">
    <div class="table-row">
      <div class="table-cell">Title</div>
      <div class="table-cell">Fraud Category</div>
      <div class="table-cell">Date</div>
      <div class="table-cell">Source</div>
      <div class="table-cell">Currency Types</div>
      <div class="table-cell">Amount Stolen</div>
      <div class="table-cell">Accused</div>
      <div class="table-cell">Relavent Links</div>
    </div>
    ${this.items.map((item, index) => html`
      <gpslab-fraud-listing @click="${this.analyzeCaseWithLLM}" title=${item[1]} fraud-category=${item[2]} date=${item[3]} source=${item[4]} source-url=${item[5]} currency-types=${item[6]} currency-amount=${item[7]} accused-parties=${item[8]} relavent-addresses=${item[9]} description=${item[10]}></gpslab-fraud-listing>
      `)}
  </div>
  </div>
  <div class="frequency-counts">
  <h6>Frequency:</h6>
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

  async updateDatabase(){
    try {
      const response = await fetch('api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
            "item": 1,
            "title": "Scam listing",
          },
          {
            "item": 2,
            "title": "Scam listing",
          }],
        ),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      this.retrieveDatabase();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async retrieveDatabase(){
    try {
      const response = await fetch('api/database', {
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
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  frequencyChart(){
    const ctx = this.renderRoot.querySelector('#myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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

  // updated(changedProperties){
  //   super.updated(changedProperties);
  //   if (changedProperties.has("llmSummary")) {
  //     this.dispatchEvent(new CustomEvent("llm-summary-changed", {
  //       detail: { llmSummary: this.llmSummary },
  //       bubbles: true,
  //       composed: true,
  //     }));
  //   }
  // }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GpslabDashboard.tag, GpslabDashboard);