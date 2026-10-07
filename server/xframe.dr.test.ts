import { describe, expect, it } from "vitest";
import { ITALRAY_CATALOG_REGISTRY } from "../shared/commerce/italrayMeta";

describe("X-FRAME DR product content", () => {
  const product = ITALRAY_CATALOG_REGISTRY["italray-x-frame-dr-systems"];

  it("uses the X-FRAME DR EZ identity and supplied brochure", () => {
    expect(product.title).toBe("Italray X-FRAME DR EZ");
    expect(product.brochureUrl).toBe("/manus-storage/DRSOLUTIONS_fab841ef.pdf");
    expect(product.highlights).toContain("Auto Positioning based on the selected examination and projection");
  });

  it("uses the user's last supplied device image as the hero", () => {
    expect(product.heroImage).toBe("/manus-storage/x-frame-dr-hero_791f595c.jpg");
    expect(product.clinicalGallery[0]?.image).toBe(product.heroImage);
  });

  it("keeps published radiographs anonymized", () => {
    const radiographs = product.clinicalGallery.filter(item => item.category.includes("Radiography") || item.category.includes("Orthopedic"));
    expect(radiographs.length).toBeGreaterThanOrEqual(4);
    for (const item of radiographs) {
      expect(item.image).toContain("redacted");
      expect(item.image).not.toMatch(/thorax_(PA|LAT)\.png|stitching_spineAP\.png|skull_PA\.png/i);
    }
  });
});
