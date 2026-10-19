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

  it("uses the ten-slide Hermann, Italray, SPM and supplied-video Hero", () => {
    expect(homeSource).toContain("const HERO_SLIDE_COUNT = 10");
    expect(homeSource).toContain("/manus-storage/esophagus_LAT_c02b071c.mp4");
    expect(homeSource).toContain('mediaType: "video" as const');
    expect(homeSource).toContain("/manus-storage/hermann-01-specialist_bb5c3fe6.jpg");
    expect(homeSource).toContain("/manus-storage/hermann-03-laparoscopy_3d01e5bd.jpg");
    expect(homeSource).toContain("/manus-storage/italray-01-carm-or_a85c8c1d.jpg");
    expect(homeSource).toContain("/manus-storage/italray-03-mobile-radiography_c23c7522.jpg");
    expect(homeSource).toContain("/manus-storage/partner-01-italray-handshake_28044042.jpg");
    expect(homeSource).toContain("/manus-storage/partner-03-systems-partnership_539b217b.jpg");
    expect(homeSource).toContain("const heroPortfolioSlides = [");
    expect(homeSource).toContain("Hermann Medizintechnik");
    expect(homeSource).toContain("Italray imaging systems");
    expect(homeSource).toContain("SPM strategic partnership");
    expect(homeSource).toContain('aria-label="SPM technology and service showcase"');
    expect(homeSource).toContain("<SiteChrome transparentHeader>");
    expect(homeSource).toContain("lg:left-[50%]");
    expect(homeSource).toContain('aria-label="SPM trust signals"');
    expect(homeSource).toContain("SNAPSHOT");
    expect(homeSource).toContain("const heroSlides = heroPortfolioSlides.map");
    expect(homeSource).toContain("Surgical precision, built around the specialist.");
    expect(homeSource).toContain("Medical imaging. Surgical technology. One team.");
    expect(homeSource).toContain("onTouchStart={handleHeroTouchStart}");
    expect(homeSource).toContain("onTouchEnd={handleHeroTouchEnd}");
    expect(homeSource).not.toContain("Play Hero slideshow");
    expect(homeSource).not.toContain("Pause Hero slideshow");
    expect(homeSource).not.toContain('aria-label="C-Arm feature points"');
    expect(homeSource).not.toContain("Flat-panel detector");
    expect(homeSource).toContain("content[`${prefix}.image`]" );
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
    expect(siteChromeSource).toContain("max-h-12 max-w-24 object-contain drop-shadow-sm");
    expect(siteChromeSource).not.toContain("mix-blend-multiply");
    expect(siteChromeSource).not.toContain('activeProductTab === "italray" ? "bg-white/95"');
    expect(siteChromeSource).not.toContain('activeProductTab === "hermann" ? "bg-white/95"');
    expect(siteChromeSource).not.toContain('activeProductTab === "parts" ? "bg-white/95"');
  });

  it("exposes a visual Hero Studio for all ten managed media slides", () => {
    expect(homepageEditorSource).toContain("Hero Studio");
    expect(homepageEditorSource).toContain("const heroSlides = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]");
    expect(homepageEditorSource).toContain("3 Hermann · 3 Italray · 3 SPM partnerships · 1 video");
    expect(homepageEditorSource).toContain("video/mp4");
    expect(homepageEditorSource).toContain("object-contain");
    expect(homepageEditorSource).toContain("const imageKeyForSlide = `${prefix}.image`");
    expect(homepageEditorSource).toContain("Replace media");
    expect(homepageEditorSource).toContain("Save draft");
    expect(homepageEditorSource).toContain("Publish");
    expect(homepageEditorSource).toContain("Maximum upload: 10 MB");
  });

  it("keeps the Hermann visual showcase connected to the supplied gallery", () => {
    expect(homeSource).toContain('aria-label="Hermann surgical technology"');
    expect(homeSource).toContain('const hermannGallerySlides = [');
    expect((homeSource.match(/hermann-gallery-[a-z-]+_[a-f0-9]+\.jpg/g) ?? [])).toHaveLength(6);
    expect(homeSource).not.toContain('role="tablist" aria-label="Hermann gallery images"');
    expect(homeSource).not.toContain("Show Hermann image");
    expect(homeSource).toContain('aria-label="Previous Hermann gallery image"');
    expect(homeSource).toContain('aria-label="Next Hermann gallery image"');
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
    expect(homeSource).toContain('aria-label="Previous Hermann gallery image"');
    expect(homeSource).toContain('loading="lazy"');
    expect(homeSource).toContain('aria-live="polite"');
    expect(homeSource).toContain("eventsPageQuery.isError");
    expect(homeSource).toContain("productsQuery.isError");
    expect(homeSource).toContain("/spare-parts");
    expect(homeSource).toContain("const heroTrustStats = [");
    expect(homeSource).toContain("Hospitals Reached");
    expect(homeSource).toContain("UPA Projects");
    expect(homeSource).toContain("Spare Parts in Stock");
    expect(homeSource).toContain("const heroTrustSignals = [");
    expect(homeSource).toContain("Documented quality workflow");
    expect(homeSource).toContain("Project-specific radiation documentation");
    expect(homeSource).not.toContain("Official Evidence Statistics");
    expect(homeSource).not.toContain("hero-quick-path");
    expect(homeSource).not.toContain("Hero showcase images");
    expect(homeSource).not.toContain("Quality and regulatory evidence");
  });

  it("reads the equipment query parameter into the service request equipment model", () => {
    expect(serviceRequestSource).toContain('const equipmentName = params.get("equipment")');
    expect(serviceRequestSource).toContain("model: modelName || equipmentName");
  });
});
