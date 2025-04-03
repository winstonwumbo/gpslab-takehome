import { html, fixture, expect } from '@open-wc/testing';
import "../gpslab-dashboard.js";

describe("GpslabDashboard test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <gpslab-dashboard
        title="title"
      ></gpslab-dashboard>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
