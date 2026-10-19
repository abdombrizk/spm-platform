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

- [x] Replaced public website and SEO occurrences of the former imaging-only title with “Medical Imaging and Surgical Technology”, preserving the appropriate uppercase/title/lowercase treatment.
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
- [x] Cleaned up interactive clutter per visual feedback: removed Hero overlay hotspot dots and their popovers, removed the Hero top-right play/arrow buttons in favor of clean smooth autoplay and touch swipe, removed the Hermann gallery dot indicators while keeping side arrows and swipe, and enlarged the Hermann official logo pill on the showcase card for clear brand presence. Verified with TypeScript, full Vitest suite (46 passed), production build, and desktop screenshot.
- [x] Further enhanced and enlarged the Hermann showcase logo container: expanded pill dimensions (up to 80px height and 280px width on desktop) with generous padding and larger image constraints, ensuring prominent brand visibility over the gallery. Verified with TypeScript, 46 tests, and full production build.
- [x] Removed the Hermann logo container background, border, padding and box treatment so only the transparent logo remains over the gallery, with a restrained drop shadow for readability and responsive size limits. Verified by computed DOM styles, TypeScript, 46 tests and production build.

## About Page Engineering & Institutional Enhancement (October 18, 2026)
- [x] Completed comprehensive UI/UX, SEO, accessibility, performance, and claims analysis of `/about` and saved findings to `about-uiux-analysis-2026-10-18.md`.
- [x] Executed Phase 1 structural and copy enhancement:
  - Refined Hero to focus on engineered continuity: "Engineering continuity for critical imaging systems."
  - Added sticky in-page contextual navigation rail with direct anchor jumps.
  - Added three core capability pillars (Systems, Engineering, Continuity) under Who we are.
  - Introduced "One partner, three practical perspectives" section for physicians, biomedical teams and hospital leadership.
  - Upgraded "How we work" with concrete outcome deliverables per step (Documented diagnosis, Validated installation, Trained handover, Tracked follow-up).
  - Set Hermann partnership status to "Exclusive Agent" per user instruction while keeping documentation claims safe until official documents arrive.
  - Cleaned unverified ISO/license numbers from public display until official copies are uploaded.
  - Added Spare Parts shortcut to closing CTA and explicit About image to Open Graph metadata.
  - Verified with full TypeScript check, 46 passed tests, production build, and live browser verification.
- [x] Executed Hero Visual Redesign Pass:
  - Transformed About Hero into a full-width background layout using the managed C-Arm clinical imagery (`spm-about-xray-carm-hero_d720db48.jpg`).
  - Implemented cinematic dark directional gradients for optimal legibility while keeping the medical imaging system clearly visible.
  - Added a frosted glass "Engineering in practice" panel displaying both Italray and Hermann agency badges with transparent high-contrast marks.
  - Streamlined Hero introductory copy for lighter visual scanning.
  - Relocated the 4-metric statistics rail to sit cleanly directly underneath the Hero, followed by the sticky contextual navigation.
  - Verified responsive rendering, TypeScript compilation, 46 regression tests, production build, and live browser screenshots.
- [x] Implemented exact split-screen Reference Hero layout for About:
  - Technical blueprint background on the left and clinical surgical suite depth on the right.
  - "Pioneering Clinical Continuity" top badge and high-contrast typography.
  - Integrated supplied Italray C-Arm (FP21 & FP30) and Hermann Surgical & Endoscopy tower into dedicated studio presentation cards with floating numbering tags.
  - Added bottom translucent partners and support glass bar showcasing official Italray and Hermann logos alongside "ENGINEERED LIFECYCLE: 24/7 Technical Service & Support".
  - Passed TypeScript compilation, 46 tests, and full production build.
- [x] Updated About Hero background image:
  - Replaced Hero operating-room visual with the newly supplied clinical suite visual (`Gemini_Generated_Image_in1ewmin1ewmin1e_ea370a5c.webp`).
  - Synchronized static fallback in `AboutPage.tsx` and live database record via CMS publishing.
  - Retained blueprint grid overlay on the left and clinical depth on the right.
  - Verified with Vitest suite (46 passed), TypeScript check, production build, and desktop/mobile screenshots.
- [x] Aligned About Hero to exact reference split layout:
  - Deep blueprint technical panel on the left with title, intro, and dual CTAs.
  - Clinical surgical environment clearly visible on the right without white covering cards.
  - Added subtle floating reference tags: "01. Hermann Surgical & Endoscopy", "02. Italray Mobile C-Arm System", and "03. Mobile Workstation & Viewing Monitor".
  - Retained bottom glass bar with Authorized Partner logos and 24/7 technical service commitment.
  - Passed TypeScript check, all presentation tests, and full production build.
- [x] Executed visual feedback adjustments on About Hero:
  - Widened the clinical background stage to occupy 3/4 width (`lg:w-[75%]`) with smooth directional gradients, giving the operating suite visual greater breathing room.
  - Removed internal decorative boundary frame so the clinical scene is unobstructed.
  - Merged the 4-metric statistics rail directly into the bottom glass bar under Hero, creating a cohesive, compact trust and partner footer.
  - Refined partner badges with clean white rounded pills for crisp, high-contrast visibility of Italray and Hermann official marks.
  - Successfully passed TypeScript check, Vitest presentation tests, and full production build.
- [x] Refined About Hero bottom bar and partner logos per visual review:
  - Enlarged Italray and Hermann logos and stripped bounding boxes for high-contrast transparent rendering.
  - Softened the directional gradient over the left side of the operating room image so the clinical environment shows through more naturally.
  - Scaled down the Snapshot metrics rail and integrated it into a compact, unified bottom glass bar.
  - Expanded hero bottom padding so action CTAs remain completely unobscured.
  - Passed TypeScript check, all presentation tests, and full production build.
- [x] Enhanced About visual content and removed requested C-Arm overlay badge:
  - Removed "02. Italray Mobile C-Arm System" floating badge from Hero stage.
  - Added "Engineering in Practice" visual gallery section with 6 high-definition clinical, field-engineering, and surgical imagery cards.
  - Added dedicated contextual anchor jump ("In practice") in sticky navigation.
  - Verified with full test suite, TypeScript check, and production build.
- [x] Relocated Snapshot bar beneath Hero section and unified partner logo sizes:
  - Moved the Snapshot and partner indicators bar to sit directly below Hero, completely freeing the bottom of the clinical image.
  - Removed redundant inline lifecycle tagline from the partner bar.
  - Standardized Italray and Hermann partner logos to identical optical sizes with clean left-alignment across both the Snapshot bar and the Strategic Partnerships cards.
  - Passed TypeScript check, all presentation tests, and full production build.
- [x] Streamlined About Hero and unified Snapshot bar into a single continuous row:
  - Removed remaining floating badges (01. Hermann Surgical & 03. Mobile Workstation) so the Hero clinical background is completely unobstructed.
  - Rebuilt the Snapshot bar layout so Authorized Partners and the 4 primary impact metrics sit together in one horizontal row on desktop.
  - Maintained responsive wrapping on tablet and mobile viewports to prevent cramped text or horizontal overflow.
  - Passed TypeScript check, all presentation tests, and full production build.
- [x] Elevated Snapshot bar and enhanced Hero background visibility:
  - Elevated the Snapshot metrics bar with negative top margin (`-mt-10`) so it seamlessly floats into the lower edge of the Hero without creating an artificial dark separator block.
  - Removed the solid border line beneath Hero, allowing the clinical room background to extend cleanly across the section transition.
  - Softened the background gradients (`opacity-95` on the clinical image, reduced overlay opacity to `0.82` and `0.25`) so operating room details and equipment are more visible.
  - Verified with full test suite, TypeScript check, and production build.
- [x] Standardized the institutional naming across the full project:
  - Updated public copy, navigation/footer branding, page titles, Open Graph metadata, SEO defaults, product descriptions, About/Home content, audit documentation, and project notes to use “Medical Imaging and Surgical Technology”.
  - Confirmed zero remaining matches for the former “Medical Imaging Technology” phrase across tracked project files.
  - Passed TypeScript check, 17 test files / 46 tests, diff validation, and production build.
- [x] Enhanced Catalogue partner brand logo presentation:
  - Removed the solid white rounded container box behind the brand logo in the Catalogue hero header.
  - Enlarged the official brand mark rendering (using cropped transparent assets for Italray and Hermann) to 220px width with subtle drop shadow directly on the dark technical hero background.
  - Verified responsive presentation for both Italray and Hermann brand filters.
  - Passed TypeScript check, all 46 automated tests, and full production build.
- [x] Rebuilt Italray Portfolio Hero to match exact reference composition:
  - Applied the newly supplied high-resolution clinical C-Arm suite image (`italray-portfolio-hero_858b8677.webp`) as the hero background.
  - Implemented the reference split composition with left-aligned institutional typography, technical grid background, "Authorized Italray Partner" pill badge, and triple feature tags (Italian imaging systems, 24/7 SPM engineering support, Genuine parts & documentation).
  - Added the bottom status bar with "Authorized partner & service provider: Italray | Powered by SPM".
  - Enforced strict vendor filtering to ensure the portfolio exclusively presents Italray equipment families (Mobile C-Arms, Digital Radiography, Radio-Fluoroscopy, Mammography).
  - Passed TypeScript check, all 46 automated regression tests, and full production build.
- [x] Perfected Italray Product Portfolio Hero to match reference screenshot:
  - Header pill badge: green dot, "AUTHORIZED EGYPTIAN PARTNER", separator line, and SPM white brand icon + text.
  - Headline: "ITALRAY: Visionary Medical Imaging, Engineered for Life." with teal accent highlight on "Engineered for Life."
  - Paragraph: exact wording detailing Italian X-ray innovation from mobile C-Arms to digital radiography supported across Egypt by SPM.
  - Feature pills: Italian flag emoji with "Italian Design & Innovation Since 1974" and wrench icon with "24/7 SPM Engineering Support".
  - Actions: Orange "Explore Systems" primary button with arrow and glassmorphic "Request Tech Specs" button with diagonal arrow.
  - Bottom bar: "50+ YEARS OF X-RAY EXCELLENCE" and "FULL LIFECYCLE SUPPORT" on the left, paired with the glass status pill "AUTHORIZED PARTNER & SERVICE PROVIDER: Italray | Powered by SPM" on the right.
  - Routing: added explicit `/partners/italray` route alias in addition to `/catalogue/italray`.
  - Confirmed the page exclusively showcases Italray equipment families.
  - Passed TypeScript check, all 46 tests, and full production build.
- [x] Applied the exact reference Hero layout directly to the Catalogue page under the Italray filter (`/catalogue?brand=italray`):
  - Unified the Hero presentation so visiting `/catalogue?brand=italray` directly renders the cinematic operating-room visual with the C-Arm and clinical team.
  - Added the exact "AUTHORIZED EGYPTIAN PARTNER" pill badge with live SPM mark.
  - Implemented the reference headline ("ITALRAY: Visionary Medical Imaging, Engineered for Life."), subtitle, dual feature badges, primary orange CTA and glass specs button.
  - Added the bottom glass status pill: "AUTHORIZED PARTNER & SERVICE PROVIDER: Italray | Powered by SPM".
  - Enforced exact brand filtering so when `brand=italray` is active, the equipment grid strictly displays only Italray systems.
  - Verified TypeScript compilation, all 46 automated regression tests, and full production build.
- [x] Refined and polished the Italray Hero presentation on Catalogue (`/catalogue?brand=italray`):
  - Balanced the typography scale (`clamp(2.75rem,5vw,4.5rem)`) and line height so headlines remain punchy without crowding.
  - Enhanced the top partnership pill badge to explicitly feature the official Italray mark, strategic partnership text, and SPM mark.
  - Added a floating glass engineering panel on desktop summarizing the clinical workflow alignment across C-Arm, DR, and DRF.
  - Compacted the hero vertical footprint to 700px-760px so the full stage, CTAs, and bottom status bar are visible comfortably above the fold.
  - Passed TypeScript check, all 46 regression tests, and full production build.
- [x] Streamlined Catalogue layout by removing the redundant top sections:
  - Removed the "Equipment finder / Explore every published system" heading and descriptor block.
  - Removed the "Quick comparison" selection panel and state to give immediate focus to the actual equipment cards.
  - Preserved the full equipment cards grid, search functionality, brand filtering, status tags, and quotation CTAs.
  - Passed TypeScript compilation, 46 regression tests, and full production build.
- [x] Rebuilt the Catalogue product area as a premium Product Showcase inspired by the supplied reference: added a centered Products label and editorial headline, introduced a light blue-grey technical background with soft geometry, rebuilt each product card with brand color, category pill, uppercase system title, dedicated image stage, concise description, specification chips, status line, and clear Explore/Request CTA, with responsive three-column-to-single-column behavior.
- [x] Replaced five external Shopify image references in the Italray registry with managed uploaded CDN assets so the Italray catalogue cards consistently resolve images for Clinodigit FLO, CORSIX DR, XFM Mobile DR, Mammograph, and Clinodigit C-Arm.
- [x] Added regression coverage for the Product Showcase and confirmed the removed comparison UI does not return. Verified TypeScript, 17 test files / 47 tests, diff check, browser rendering, and production build.
- [x] Added an accessible, responsive Italray category filter bar above the Catalogue product grid with clean tabs matching the user reference: ALL, C-ARM, CLINODIGIT, MOBILE X-RAY, MAMMOGRAPHY, STATIONARY DR, and COMPONENTS. Synchronized active tab with URL parameters, mapped current products to their corresponding families, and prepared empty states for incoming products.
- [x] Verified full Vitest suite (17 test files / 48 tests passing), TypeScript, clean git diff check, browser interaction on desktop and mobile, and production build.
- [x] Enlarged the three partner and brand logos in the global desktop navigation Products flyout (Italray, Hermann, SPM Spare Parts) inside SiteChrome. Removed the background box containers and mix-blend-multiply artifacts, ensured crisp transparent display, and added automatic white contrast inversion when hovering or activating the dark active state. Verified 48 tests, TypeScript, production build and browser rendering.
- [x] Redesigned the Products desktop mega flyout with a premium corporate aesthetic: structured dark brand rail on the left, clear partner cards, transparent white-isolated Italray and Hermann brand marks, dedicated SPM Spare Parts entry, and a spacious categories pane on the right. Tight-cropped transparent Hermann wordmark to eliminate padding boxes and verified all 48 tests and production build.
- [x] Upgraded the Products mega menu layout: eliminated empty spaces in the right categories pane, introduced structured two-column numbered category cards with short descriptions and subtle hover elevation, perfected transparent brand logo sizes, and confirmed keyboard reachability and clean responsive behavior across desktop and mobile. All 48 tests pass.
- [x] Replaced the overly dark brand rail background in the Products mega flyout with a refined institutional navy-slate gradient. Increased the contrast of inactive and active states so the white Italray, Hermann and SPM marks pop vividly without disappearing into the background. Verified TypeScript, 48 tests and production build.
- [x] Restructured the Products desktop flyout brand rail to solve logo visibility and text crowding: shifted the partner column to a clean, light healthcare background, returned Italray, Hermann and SPM logos to their authentic full-color branding with comfortable vertical spacing, positioned descriptions beneath each logo naturally, and reduced overall width from 900px to 840px for a more balanced presentation. Verified all 48 tests and production build.
