import { describe, expect, it } from "vitest";
import { ITALRAY_CATALOG_REGISTRY } from "../shared/commerce/italrayMeta";

describe("Carmex RK FP-S product content", () => {
  const product = ITALRAY_CATALOG_REGISTRY["italray-carmex-fp21-fp30"];

  it("uses the replacement product name and official brochure asset", () => {
    expect(product.title).toBe("Italray CARMEX RK FP-S");
    expect(product.brochureUrl).toBe("/manus-storage/CARMEXRKFP-S_b473b80e.pdf");
    expect(product.highlights).toContain("Pulsed fluoroscopy up to 15 fps, digital radiography and optional DSA");
  });

  it("keeps both brochure configurations explicit", () => {
    expect(product.specifications.find(section => section.category === "Rotating-Anode Version")?.specs).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Generator Power", value: "5 kW" }),
      expect.objectContaining({ label: "X-ray Tube", value: "300 KHU" }),
    ]));
    expect(product.specifications.find(section => section.category === "Fixed-Anode Version")?.specs).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Generator Power", value: "4 kW" }),
      expect.objectContaining({ label: "X-ray Tube", value: "79.8 KHU" }),
    ]));
  });

  it("publishes the comprehensive 30-item product gallery without raw patient image names", () => {
    expect(product.clinicalGallery.length).toBe(30);
    expect(product.clinicalGallery[0]).toMatchObject({
      title: "Operating Room Context",
      image: "/manus-storage/carmex-rkfps-operating-room-hero_aa00194d.jpg",
    });
    for (const item of product.clinicalGallery) {
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.description?.trim().length).toBeGreaterThan(0);
      expect(item.image.startsWith("/manus-storage/")).toBe(true);
      expect(item.image).not.toMatch(/pevis_AP\.png|knee_(AP|LAT)\.png/i);
    }
    expect(product.clinicalGallery.filter(item => item.image.includes("carmex-gallery-")).length).toBe(29);
  });
});
