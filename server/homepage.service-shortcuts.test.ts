import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const siteChromeSource = readFileSync(resolve(process.cwd(), "client/src/components/SiteChrome.tsx"), "utf8");
const homepageEditorSource = readFileSync(resolve(process.cwd(), "client/src/pages/HomepageEditor.tsx"), "utf8");
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
    expect(homeSource).toContain('aria-label="SPM technology and service showcase"');
    expect(homeSource).toContain('const heroSlides = [');
    expect(homeSource).toContain("Support that keeps critical systems moving.");
    expect(homeSource).toContain("Surgical technology, thoughtfully connected.");
    expect(homeSource).toContain("onTouchStart={handleHeroTouchStart}");
    expect(homeSource).toContain("onTouchEnd={handleHeroTouchEnd}");
    expect(homeSource).toContain('role="tablist" aria-label="Hero showcase images"');
    expect(homeSource).toContain("Play Hero slideshow");
    expect(homeSource).toContain("Pause Hero slideshow");
    expect(homeSource).toContain('aria-label="C-Arm feature points"');
    expect(homeSource).toContain("Flat-panel detector");
    expect(homeSource).toContain('content["hero.slide.1.image"]');
    expect(homeSource).not.toContain("24/27 governorates coverage");
    expect(homeSource).not.toContain("Make every technical next step clear, traceable & verified.");
  });

  it("keeps strategic partner cards actionable and visually uncluttered", () => {
    expect(homeSource).toContain('href: "/catalogue?brand=italray"');
    expect(homeSource).toContain('href: "/catalogue?brand=hermann"');
    expect(homeSource).toContain("Explore ${partner.name} portfolio");
    expect(homeSource).not.toContain("0{index + 1}");
    expect(homeSource).toContain("max-h-16 max-w-[240px]");
  });

  it("keeps global navigation stable while moving between menus", () => {
    expect(siteChromeSource).toContain("scheduleMenuClose(() => setActiveCompany(false))");
    expect(siteChromeSource).toContain("scheduleMenuClose(() => setActiveMega(false))");
    expect(siteChromeSource).toContain("max-h-9 max-w-16 object-contain mix-blend-multiply");
  });

  it("exposes a visual Hero Studio for all four managed slides", () => {
    expect(homepageEditorSource).toContain("Hero Studio");
    expect(homepageEditorSource).toContain("const heroSlides = [1, 2, 3, 4]");
    expect(homepageEditorSource).toContain("const imageKeyForSlide = `${prefix}.image`");
    expect(homepageEditorSource).toContain("Replace image");
    expect(homepageEditorSource).toContain("Save draft");
    expect(homepageEditorSource).toContain("Publish");
    expect(homepageEditorSource).toContain("Maximum upload: 8 MB");
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
