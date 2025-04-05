/**
 * Copyright 2025 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
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
    this.llmSummary = "Tmp None";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      items: { type: Array },
      llmSummary: { type: String, attribute: "llm-summary" },
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
      .llm-summary {
        text-align: center;
        font-family: var(--ddd-font-navigation);
        border-radius: 4px;
        border: 1px solid var(--ddd-theme-primary);
        background-color: black;
        color: white;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <h3>${this.title}</h3>
  <slot></slot>
  <gpslab-fraud-listing description="Two Californians fell victim to the scam website A A16Zcrypto.cc/H5/#, which they believed was a legitimate website run by a well-known venture capital firm. The first victim met a woman named “Lena” via LinkedIn. Lena directed the victim to the website A16Zcrypto.cc/H5/# where the victim believed he would be able to invest his money into the crypto asset industry. Instead, the money went into the scammer’s wallet account and the victim lost approximately $210,000. The second victim also met someone on LinkedIn, who called herself Cindy Yang aka Daiwei Yang. After a while, Cindy asked to move the conversation to WhatsApp. There, Cindy told the victim that she worked for a cryptocurrency trading company and a venture capital fund that invests in crypto and web3 startups. She told the victim that she and her two partners opened an account on the trading platform, and encouraged the victim to also open an account where Cindy would help him trade. The victim initially invested $2,100 to the scammer’s website with the guidance of the scammer, and he was able to withdraw $500. Convincing him he had made a profit, Cindy asked the victim to put in even more money, and he, after several transactions, had contributed another $68,000. After that, he seldom heard from Cindy again. So, the victim decided to take his money out, which he believed was now worth more than $100,000, with half in his Currency Account and half in his Contract Account, or trading account. However, the website did not return his money, but instead used many excuses to hold his money, such as there was an international Anti-Money laundering Organization investigation or that he needed to pay a penalty first. He sent many messages to the website’s Customer Service but was not able to receive his money.  This is not to be confused with the website a16z.com." 
  @click="${this.analyzeCaseWithLLM}">Click anywhere on here to trigger function</gpslab-fraud-listing>
  <button @click="${this.analyzeCaseWithLLM}">Press</button>

  <div class="llm-summary">
    <h4>LLM Summary</h4>
    ${this.llmSummary.split('\n').map(line => html`<p>${line}</p>`)}
  </div>
</div>`;
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