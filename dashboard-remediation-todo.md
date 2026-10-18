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

## Homepage Hero visual refresh

- [x] Selected and uploaded the split-composition operating room visual showing both the endoscopic surgical tower and Italray C-Arm system (`/manus-storage/spm-hero-exact-half-split_1a839b26.webp`).
- [x] Restored the exact user-supplied image after the composite revision, removed the crowded Hermann badge/link from the Hero, widened the editorial text column, and tuned the gradient for a cleaner premium composition.
- [x] Synchronized both fallback markup and live published CMS content; added regression assertion in `server/homepage.service-shortcuts.test.ts`.
- [x] Verified DOM loading, screenshot render, TypeScript, 40/40 tests, and production build.

## Homepage declutter pass

- [x] Removed the `24/27 governorates coverage` Hero badge on request.
- [x] Removed the full `Governed Operations` section from Home on request, leaving the lifecycle showcase and final CTA flow intact.
- [x] Verified the shortened Home page visually and passed TypeScript, 40/40 non-Shopify tests, production build, and `git diff --check`.

## About page Hero and response update

- [x] Replaced the About Hero with the exact homepage Hero visual (`/manus-storage/spm-hero-exact-half-split_1a839b26.webp`) and aligned its accessible alt text.
- [x] Replaced the About statistics card “Governorates Covered” with “48h Maximum Response” and synchronized the live CMS content.
- [x] Added `server/about.presentation.test.ts` to cover both static fallback and public CMS values; final suite passes 42/42 non-Shopify tests.

## Catalogue search simplification

- [x] Removed the large Equipment Finder heading, explanatory copy, manufacturer/category/sort controls, clear control, result badge, and category chips from the Catalogue page.
- [x] Kept a single compact, accessible search bar below the Hero with URL-backed search behavior intact for catalogue navigation.
- [x] Verified the rendered DOM has one search input and no legacy filter controls; final suite passes 43/43 non-Shopify tests with a successful production build.

## Home next-step enhancements

- [x] Added native touch swipe support to the Hermann carousel with a 48px threshold, ArrowLeft/ArrowRight keyboard alternative, visible buttons and reduced-motion-safe autoplay behavior.
- [x] Converted the quality and radiation cards into keyboard-accessible buttons that open a focused Dialog with project-specific explanations and a contact CTA; wording avoids unsupported certification claims.
- [x] Added a Hero “Find your path” select that routes directly to C-Arm systems, Hermann portfolio, OEM spare parts or field service support.
- [x] Verified live Dialog content, native TouchEvent slide change, route options, desktop/mobile rendering, TypeScript, 44/44 non-Shopify tests, production build and `git diff --check`.

## Rotating Home Hero and partner navigation

- [x] Rebuilt the Home Hero as a premium split composition: editorial copy on the left and a rotating right-side visual stage using the supplied operating-room Hero, field-engineering C-Arm image, Italray system image and Hermann endoscopy image.
- [x] Added autoplay, pause-on-hover/focus, arrows, dots, keyboard navigation, touch swipe and reduced-motion handling; each slide has meaningful accessible alt text and supporting copy.
- [x] Rewrote the Hero message around imaging systems, field engineering and surgical technology while keeping quote/service CTAs and the quick-path selector.
- [x] Made Italray and Hermann partnership cards actionable links, removed the visible sequence numbers, enlarged/transparent-styled partner marks, and added hover/focus motion.
- [x] Improved global menu stability with a short close delay so the Products/Company flyouts do not disappear while the pointer crosses into them; enlarged product-brand marks.
- [x] Added a visual Hero Studio inside the protected Homepage/Marketing editor: four slide cards, per-slide image upload, eyebrow/title/description/alt-text fields, preview, visibility controls, Save draft and Publish workflow.
- [x] Seeded all 20 Hero slide fields in the live homepage content store; the public Hero now reads slide images and copy from published content with safe built-in fallbacks.
- [x] Added an explicit accessible Play/Pause control plus three contextual C-Arm hotspots with click/focus tooltips, while retaining autoplay, arrow, dot, keyboard, touch and reduced-motion behavior.
- [x] Verified live slide rotation, hotspot expansion and Play/Pause interaction, TypeScript, 9 Home regression assertions, full non-Shopify test suite, production build and `git diff --check`.

## Nine-Slide Portfolio Hero and Trust Bar Removal (2026-10-13)
- [x] Removed the entire Section 2 statistics and quality badge bar directly under the Hero as requested; the page now transitions directly from the Hero into the Strategic Partnerships section.
- [x] Rebuilt the Hero visual stage into a balanced 3/4-width composition (`left-[30%]` with a soft 48% gradient) giving the images dominant presence while preserving headline readability and CTA focus.
- [x] Prepared, optimized and uploaded 9 supplied images to managed storage covering the three required domains:
  - 3 Hermann Medizintechnik slides: specialist inspection (`/manus-storage/hermann-01-specialist_bb5c3fe6.jpg`), precision instruments (`/manus-storage/hermann-02-instruments_ee2f790e.jpg`), and laparoscopic set (`/manus-storage/hermann-03-laparoscopy_3d01e5bd.jpg`).
  - 3 Italray imaging slides: C-Arm operating room setup (`/manus-storage/italray-01-carm-or_a85c8c1d.jpg`), digital radiography room (`/manus-storage/italray-02-digital-radiography_cd60b9f4.jpg`), and mobile radiography system (`/manus-storage/italray-03-mobile-radiography_c23c7522.jpg`).
  - 3 SPM strategic partnership slides: Italray exhibition handshake (`/manus-storage/partner-01-italray-handshake_28044042.jpg`), connected imaging & surgical portfolio (`/manus-storage/partner-02-spm-italray-portfolio_34099f45.jpg`), and multi-system support visual (`/manus-storage/partner-03-systems-partnership_539b217b.jpg`).
- [x] Extended the protected Hero Studio to all 10 media slides with draft/publish fields, supplied image/video upload support, full-media previews and slide segment badges.
- [x] Seeded and published all 50 managed fields in the homepage store, including the supplied `esophagus_LAT.mp4` as the tenth Hero slide.
- [x] Changed public Hero media from `object-cover`/scale treatment to `object-contain` with no crop or zoom; verified all nine images load with `object-fit: contain`, and the supplied video reports a 6.23s playable MP4 stream.
- [x] Verified with Vitest (17 test files, 46 passed), TypeScript, full Vite production build, live browser console checks across 10 slides, and a desktop screenshot.
- [x] Integrated the supplied trust rail directly into the Hero section: 4 metric cards (+450 Hospitals Reached, +66 UPA Projects, Since 2019 SPM commitment, +5,000 Spare Parts in Stock) plus 2 regulatory/quality badges (Documented quality workflow, Project-specific radiation documentation) with glassmorphic styling, non-clashing controls, responsive grid layout, and full test/build verification.
- [x] Refined the trust rail after visual review: removed the separate white panel treatment and placed the same copy directly on the Hero’s dark surface with lightweight translucent cards; removed the redundant “Find your path” select and Hero dot/number row while keeping the top slideshow controls and all media rotation behavior.
- [x] Matched the exact reference layout: solid dark header with inverted SPM brand mark, split-stage Hero (dark content column on the left, bright media stage on the right with object-contain viewing), and a full-width bottom white SNAPSHOT bar with all four live metrics and partner indicators. Verified with TypeScript, 46 tests, full build and live screenshots.
- [x] Styled the SNAPSHOT bar as an elevated floating white card with rounded top corners, subtle drop shadow, and clean dark typography matching the reference snapshot; switched the dark header SPM brand mark to a transparent high-contrast asset that retains the official teal mark color without an artificial white box.
- [x] Restored the official brand colors on the header logo within a neat rounded pill that blends seamlessly with the dark navigation, and tuned the Contact link text color for high contrast and clean hover styling across transparent/dark modes. Verified with TypeScript, full Vitest suite (46 passed), and production build.
- [x] Restored the original header logo appearance without any white container pill; the logo now sits directly on the dark header with a transparent background matching the header color while preserving the official brand icon and typography.
- [x] Standardized the global typography system across the entire site: imported official Inter (400–800) for Latin and Cairo (400–800) for Arabic/RTL contexts, unified line heights (1.55 body, 1.15 titles), letter-spacing, font-smoothing, balanced title wraps, and input inheritance while preserving existing responsive hero scales. Verified with TypeScript, 46 tests, full build, and multi-page visual checks.
- [x] Removed the floating caption badge ("Partnership in Practice / Technology partners. Local accountability.") from the right-hand Hero media stage so the device and partner photos stay clean and unobstructed, while preserving full media containment, hotspots, and slideshow controls. Verified with TypeScript, 46 tests, and live screenshots.
