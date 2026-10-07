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
- [x] Updated CARMEX RK FP-S Hero with operating room visual and adapted neutral stage.
- [x] Added complete 30-image CARMEX RK FP-S gallery: 29 supplied photos (RK-FP and RK-FPS) + operating-room hero, with dedicated titles, clinical descriptions, overlay text, and smooth carousel/lightbox navigation.
- [x] Optimized all 29 supplied photos (progressive JPEG, max 1800px, 3.23 MiB total) and published to managed storage.
- [x] Synchronized both live database presentation override and static catalog fallback registry.
- [x] Added visual count indicators (total 30 views, slide n / 30) with motion and reduced-motion support.
- [x] Updated test suite (server/carmex.rkfps.test.ts) to validate all 30 titled items without raw patient filenames.
- [x] Passed TypeScript check, full test suite (32/32 tests), production build, and DOM/visual verification.
