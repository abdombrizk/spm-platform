import { describe, expect, it } from "vitest";
import { getItalrayProductMeta } from "../shared/commerce/italrayMeta";

describe("Clinodigit OMEGA product media", () => {
  it("uses the supplied hero, official brochure, video, and anonymized clinical gallery", () => {
    const meta = getItalrayProductMeta("italray-clinodigit-omega-drf");
    expect(meta.title).toBe("Italray Clinodigit OMEGA");
    expect(meta.heroImage).toBe("/manus-storage/clinodigit-omega-hero_dc3ed0c5.jpg");
    expect(meta.brochureUrl).toBe("/manus-storage/CLINODIGIT-OMEGA-official_fca26e74.pdf");
    expect(meta.clinicalGallery).toHaveLength(11);
    expect(meta.clinicalGallery[0]).toMatchObject({
      mediaType: "video",
      image: "/manus-storage/clinodigit-omega-system_de00fd72.mp4",
    });
    expect(meta.clinicalGallery.slice(2).every((item) => item.image.includes("_redacted_"))).toBe(true);
    expect(meta.clinicalGallery.some((item) => item.image.includes("clinodigit-omega-hero"))).toBe(true);
  });
});
