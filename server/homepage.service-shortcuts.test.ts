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
    expect(homeSource).toContain("Documented quality workflow");
    expect(homeSource).toContain("Project-specific radiation documentation");
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
    expect(homeSource).toContain("onTouchStart={handleHermannTouchStart}");
    expect(homeSource).toContain("onTouchEnd={handleHermannTouchEnd}");
    expect(homeSource).toContain("Math.abs(deltaX) >= 48");
    expect(homeSource).toContain('onKeyDown={event => { if (event.key === "ArrowLeft") moveHermannSlide(-1);');
    expect(homeSource).toContain("/manus-storage/hermann-catalog_444df261.pdf");
    expect(homeSource).toContain('aria-label="Hermann official product categories"');
    expect(homeSource).toContain("Tungsten Carbide Instruments");
    expect(homeSource).toContain("+3 more categories");
    expect(homeSource).toContain(".slice(0, 3)");
    expect(homeSource).toContain("SPM presents Hermann Medizintechnik");
    expect(homeSource).not.toContain("SPM is an authorized Hermann partner");
  });

  it("keeps Home controls touch-friendly and resilient for reduced motion", () => {
    expect(homeSource).toContain('role="region"');
    expect(homeSource).toContain('aria-roledescription="carousel"');
    expect(homeSource).toContain("className=\"inline-flex h-11 w-11 items-center justify-center rounded-full");
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain('aria-live="polite"');
    expect(homeSource).toContain("eventsPageQuery.isError");
    expect(homeSource).toContain("statsQuery.isError");
    expect(homeSource).toContain("productsQuery.isError");
    expect(homeSource).toContain('id="hero-quick-path"');
    expect(homeSource).toContain("/catalogue?brand=hermann");
    expect(homeSource).toContain("/spare-parts");
    expect(homeSource).toContain("View documented quality workflow details");
    expect(homeSource).toContain("View project-specific radiation documentation details");
    expect(homeSource).toContain("Confirm project requirements");
  });

  it("reads the equipment query parameter into the service request equipment model", () => {
    expect(serviceRequestSource).toContain('const equipmentName = params.get("equipment")');
    expect(serviceRequestSource).toContain("model: modelName || equipmentName");
  });
});
