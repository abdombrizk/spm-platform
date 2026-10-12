import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { appRouter } from "./routers";

const publicHermannSources = [
  "client/src/pages/Home.tsx",
  "client/src/pages/Catalogue.tsx",
  "client/src/pages/AboutPage.tsx",
  "client/src/components/SiteChrome.tsx",
].map(file => readFileSync(resolve(process.cwd(), file), "utf8")).join("\n");

describe("Hermann endoscopy product catalog", () => {
  const caller = appRouter.createCaller({
    user: null,
    req: { protocol: "https", headers: {} } as any,
    res: {} as any,
  });

  it("publishes 20 Hermann systems and catalogue families in the internal catalogue", async () => {
    const list = await caller.products.published();
    const hermannProducts = list.filter(item => (item.data as any).brand === "Hermann");
    expect(hermannProducts.length).toBe(20);

    const slugs = hermannProducts.map(p => p.slug);
    expect(slugs).toContain("hermann-h4k-icg-uhd-camera");
    expect(slugs).toContain("hermann-h4k-3100-4k-camera");
    expect(slugs).toContain("hermann-hhd-3100-hd-camera");
    expect(slugs).toContain("hermann-hhd-1100-hd-camera");
    expect(slugs).toContain("hermann-hhd-1500-eco-camera");
    expect(slugs).toContain("hermann-hled-icg-light-source");
    expect(slugs).toContain("hermann-hled-3000-light-source");
    expect(slugs).toContain("hermann-hled-1800-2500-light-source");
    expect(slugs).toContain("hermann-hi-series-co2-insufflator");
    expect(slugs).toContain("hermann-hhf-120-electrosurgical-generator");
    expect(slugs).toContain("hermann-hhf-400-electrosurgical-generator");
    expect(slugs).toContain("hermann-hss4000-laparoscopy-fluid-pump");
    expect(slugs).toContain("hermann-hss4500-universal-fluid-pump");
    expect(slugs).toContain("hermann-general-surgery-instrument-families");
    expect(slugs).toContain("hermann-laparoscopy-instrument-families");
    expect(slugs).toContain("hermann-arthroscopy-instrument-families");
    expect(slugs).toContain("hermann-urology-endoscopy-families");
    expect(slugs).toContain("hermann-hysteroscopy-families");
    expect(slugs).toContain("hermann-electrosurgery-accessory-families");
    expect(slugs).toContain("hermann-containers-instrument-trays");
  });

  it("links every Hermann product to managed storage images and the official catalog PDF", async () => {
    const item = await caller.products.publishedBySlug({ slug: "hermann-h4k-icg-uhd-camera" });
    expect(item).not.toBeNull();
    const data = item!.data as any;
    expect(data.name).toBe("H4K-ICG UHD Camera 4K / ICG");
    expect(data.code).toBe("H97-500-103");
    expect(data.mainImage).toMatch(/^\/manus-storage\/hermann-endoscopy-page-8_[a-f0-9]+\.jpg$/);
    expect(data.brochureUrl).toBe("/manus-storage/hermann-catalog_444df261.pdf");
    expect(data.requestQuote).toBe(true);
    expect(data.availabilityStatus).toBe("on_request");
    expect(data.ceStatus).toBe("under_review");
  });

  it("uses source-safe Hermann language in public portfolio surfaces", () => {
    expect(publicHermannSources).toContain("Hermann portfolio");
    expect(publicHermannSources).toContain("Hermann official product categories");
    expect(publicHermannSources).not.toContain("SPM is an authorized Hermann partner");
    expect(publicHermannSources).not.toContain("Authorized agent distribution in Egypt for Hermann");
  });
});
