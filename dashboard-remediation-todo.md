# Italray Marketing Dashboard Remediation

- [x] Audit current Marketing Studio, presentation schema/API, public product template, and footer.
- [x] Add upload buttons beside hero, secondary image, brochure, and every clinical-media URL.
- [x] Add multi-file upload for clinical images and videos.
- [x] Add X-ray/clinical media metadata: title, category, description, alt text, media type, and Ziehm-style overlay text.
- [x] Add full section editors for copy, highlights, technology pillars, upgrades/packages, and technical specifications.
- [x] Keep the public Italray template fixed while allowing content/media changes.
- [x] Render image or video media correctly in the public clinical carousel and lightbox.
- [x] Add official Facebook and LinkedIn links to the footer.
- [x] Finish typecheck, tests, build, preview verification, and WebDev checkpoint.

## Verification note

The public product preview and build/test suite are available for verification. The protected dashboard route requires an authenticated Owner session; the current connected browser redirected to the login screen during the live dashboard check, so no dashboard data was changed during verification.

## CARMEX RK FP-S visual pass

- [x] Added a CARMEX-specific dark technical Hero stage with the device kept prominent.
- [x] Added interactive Rotating Anode / Fixed Anode configuration switch with verified published figures.
- [x] Added premium command-deck quick specs and quotation handoff.
- [x] Verified desktop/mobile screenshots, product assets, brochure response, and public route.
- [x] Added the supplied operating-room visual to the homepage Hero while preserving the original CARMEX RK FP-S product Hero and dark technical stage.
- [x] Added complete 30-image CARMEX RK FP-S gallery: 29 supplied photos (RK-FP and RK-FPS) + operating-room hero, with dedicated titles, clinical descriptions, overlay text, and smooth carousel/lightbox navigation.
- [x] Optimized all 29 supplied photos (progressive JPEG, max 1800px, 3.23 MiB total) and published to managed storage.
- [x] Synchronized both live database presentation override and static catalog fallback registry.
- [x] Added visual count indicators (total 30 views, slide n / 30) with motion and reduced-motion support.
- [x] Updated test suite (server/carmex.rkfps.test.ts) to validate all 30 titled items without raw patient filenames.
- [x] Passed TypeScript check, full test suite (32/32 tests), production build, and DOM/visual verification.
- [x] Restored the original CARMEX RK FP-S product Hero and moved the supplied operating-room visual to the homepage Hero as intended.

## Hermann catalog ingestion

- [x] Reviewed the complete 310-page Hermann 2026/2027 catalog and documented its 8 chapters, approximately 4,020 identifiable code references, and the recommended family → variant → quote structure.
- [x] Added 13 Hermann endoscopy / operating-room systems with managed product images, quote-first status, technical summaries, and the official catalog PDF.
- [x] Added 7 family-level Hermann entries covering General Surgery, Laparoscopy, Arthroscopy, Urology, Hysteroscopy, Electrosurgery, and Containers & Instrument Trays instead of flooding the site with thousands of variant cards.
- [x] Added a Hermann-specific catalog Hero, partner logo, chapter imagery, and direct `brand=hermann` filtering.
- [x] Fixed the published-product public schema so reviewed catalog records are visible without exposing administrative workflow restrictions.
- [x] Added regression coverage in `server/hermann.products.test.ts`; 20 Hermann CMS entries are confirmed through the public API.
- [x] Passed TypeScript check, 37/37 non-Shopify tests, production build, managed-storage checks, and browser verification of the Hermann catalog route.

## About page updates

- [x] Replaced the About page Hero visual with a dedicated operating-room mobile C-Arm X-ray system visual (`/manus-storage/spm-about-xray-carm-hero_d720db48.jpg`).
- [x] Updated the introductory copy and statistics to highlight SPM's establishment in 2019 (`2019 Established`) across both the React component fallback and the live published CMS page.
- [x] Verified full suite (37/37 tests), TypeScript, production build, and live browser rendering.

## Global brand language update

- [x] Replaced public website and SEO occurrences of “Medical Imaging Technology” with “Medical Imaging and Surgical Technology”, preserving the appropriate uppercase/title/lowercase treatment.
- [x] Published the same wording in Home content (`hero.eyebrow`, `highlight.1.title`) and the About CMS page.
- [x] Confirmed the legacy phrase is absent from `client`, `shared`, and `server` source files.

## Hermann Home showcase and Spare Parts relocation

- [x] Removed the standalone Spare Parts manufacturer marquee section from Home so the homepage has one clear partner-focused narrative.
- [x] Added a large Hermann Medizintechnik showcase to Home with partner logo, surgical/laparoscopy visual, portfolio explanation, published-system and family counts, quote/catalogue CTAs, and four live-linked featured Hermann products.
- [x] Moved the verified manufacturer logo marquee into Spare Parts with GE, Siemens, Ziehm, Philips and Genoray managed-storage logos, while preserving the existing brand tabs, search and quote workflows.
- [x] Verified Home and Spare Parts browser rendering, TypeScript, 37/37 non-Shopify tests, production build, and `git diff --check`.
- [x] Added a large Hermann gallery using six supplied, optimized and managed-storage images with meaningful per-slide titles, descriptions, accessible alt text, arrows, dots, autoplay, hover/focus pause and reduced-motion support.
- [x] Added a direct link to the official Hermann catalog PDF and extended the Home regression test; final suite now passes 38/38 non-Shopify tests.

## Hermann official-source research

- [x] Researched the public Hermann Medizintechnik website, official sitemap, certificates, privacy/customer-area pages, German jobs pages and linked official PDFs.
- [x] Saved the Arabic report and page-by-page evidence notes under `hermann-official-research/` and packaged them in `hermann-official-research-package.zip`.
- [x] Flagged material claims requiring confirmation before publication: ISO edition/date discrepancy, employee-count discrepancy, OEM/private-label wording, manufacturing-location wording, certificate QR/DQS verification, and agency/exclusivity claims.

## Hermann presentation and claim-safety pass

- [x] Reworked Home and Catalogue Hermann presentation with a stronger engineering Hero, nine source-aligned portfolio categories, clearer SPM catalogue counts, an official-source note, quote-first CTAs, and managed-storage imagery.
- [x] Replaced unsupported Hermann agency/authorized-partner wording across Home, Catalogue, About, navigation and Footer with accurate portfolio/support language; synchronized the live About CMS partner text and product-brand label.
- [x] Corrected product detail metadata from “Manufacturing Origin” to “Manufacturer / Supplier” and made the documentation notice conditional on quotation review.
- [x] Verified Home gallery assets, all nine category chips, live Hermann catalogue count, product detail rendering, 39/39 non-Shopify tests, TypeScript, production build, and `git diff --check`.
