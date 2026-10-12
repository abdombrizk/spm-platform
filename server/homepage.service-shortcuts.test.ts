import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const serviceRequestSource = readFileSync(resolve(process.cwd(), "client/src/pages/ServiceRequest.tsx"), "utf8");

describe("homepage service shortcuts and trust badges", () => {
  it("keeps a prefilled service shortcut for every lifecycle solution card", () => {
    expect(homeSource).toContain('serviceEquipment: "C-Arm and X-ray systems"');
    expect(homeSource).toContain('serviceEquipment: "Italray medical imaging systems"');
    expect(homeSource).toContain('serviceEquipment: "OEM imaging systems and spare parts"');
    expect(homeSource).toContain("/request-service?equipment=${encodeURIComponent(item.serviceEquipment)}");
  });

  it("keeps the quality and radiation compliance badges next to the trust statistics", () => {
    expect(homeSource).toContain("ISO 9001-aligned quality framework");
    expect(homeSource).toContain("Radiation safety & licensing dossier");
    expect(homeSource).toContain('aria-label="Quality and regulatory evidence"');
  });

  it("uses the supplied split-composition operating-room Hero", () => {
    expect(homeSource).toContain("/manus-storage/spm-hero-exact-half-split_1a839b26.webp");
    expect(homeSource).toContain("Italray C-Arm and surgical imaging equipment in a modern operating room");
    expect(homeSource).not.toContain("24/27 governorates coverage");
    expect(homeSource).not.toContain("Make every technical next step clear, traceable & verified.");
  });

  it("keeps the Hermann visual showcase connected to the supplied gallery", () => {
    expect(homeSource).toContain('aria-label="Hermann surgical technology"');
    expect(homeSource).toContain('const hermannGallerySlides = [');
    expect((homeSource.match(/hermann-gallery-[a-z-]+_[a-f0-9]+\.jpg/g) ?? [])).toHaveLength(6);
    expect(homeSource).toContain('role="tablist" aria-label="Hermann gallery images"');
    expect(homeSource).toContain("setHermannSlide(current => (current + 1) % hermannGallerySlides.length)");
    expect(homeSource).toContain("/manus-storage/hermann-catalog_444df261.pdf");
    expect(homeSource).toContain('aria-label="Hermann official product categories"');
    expect(homeSource).toContain("Tungsten Carbide Instruments");
    expect(homeSource).toContain("SPM presents Hermann Medizintechnik");
    expect(homeSource).not.toContain("SPM is an authorized Hermann partner");
  });

  it("reads the equipment query parameter into the service request equipment model", () => {
    expect(serviceRequestSource).toContain('const equipmentName = params.get("equipment")');
    expect(serviceRequestSource).toContain("model: modelName || equipmentName");
  });
});
