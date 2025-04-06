/**
 * Copyright 2025 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `gpslab-dashboard`
 * 
 * @demo index.html
 * @element gpslab-dashboard
 */
export class GpslabFraudListing extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "gpslab-fraud-listing";
  }

  constructor() {
    super();
    this.title = "";
    this.fraud_category = "";
    this.date = "";
    this.source = "";
    this.source_url = "";
    this.currency_types = "";
    this.currency_amount = 0;
    this.accused_parties = "";
    this.relavent_addresses = "";
    this.description = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      fraudCategory: { type: String, attribute: "fraud-category" },
      date: { type: String },
      source: { type: String },
      sourceUrl: { type: String, attribute: "source-url" },
      currencyTypes: { type: String, attribute: "currency-types" },
      currencyAmount: { type: Number, attribute: "currency-amount" },
      accusedParties: { type: String, attribute: "accused-parties" },
      relaventAddresses: { type: String, attribute: "relavent-addresses" },
      description: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: table-row;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        margin: 0;
        padding: 0;
      }
      .wrapper {
        display: inline-flex;
      }
      h3 span {
        font-size: var(--gpslab-dashboard-label-font-size, var(--ddd-font-size-s));
      }
      .table-cell {
        display: table-cell;
        width: 40px;
        border: 1px solid black;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
        <a href=${this.source_url} class="table-cell">${this.title}</a>
        <p class="table-cell">${this.fraudCategory}</p>
        <p class="table-cell">${this.date}</p>
        <p class="table-cell">${this.source}</p>
        <p class="table-cell">${this.currencyTypes}</p>
        <p class="table-cell">${this.currencyAmount}</p>
        <p class="table-cell">${this.accusedParties}</p>
        <p class="table-cell">${this.relaventAddresses}</p>
        `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GpslabFraudListing.tag, GpslabFraudListing);