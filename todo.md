# SPM Project Todo

## Completed in this iteration

- [x] Confirm SPM visual direction, temporary assets and content-page scope.
- [x] Extract the dominant dark brand color from the supplied logo.
- [x] Upload the logo and temporary website visuals to WebDev private storage.
- [x] Add responsive SiteChrome with top contact bar, navigation, dropdowns, mobile menu and footer.
- [x] Redesign the public homepage with split hero, service/equipment/parts cards, approved metrics and CTAs.
- [x] Add public structures for Maintenance Contracts, FAQs, Downloads, News, Events and Careers.
- [x] Add public structures for About, Spare Parts, Resources, Contact, Privacy and Terms.
- [x] Update published homepage CMS hero copy and hero image to match the approved visual redesign.
- [x] Build Owner Content Workspace for all seeded public pages.
- [x] Add Media Library for images, PDFs, certificates, agency letters and temporary asset status.
- [x] Add page-level Draft → Review → Approve → Publish workflow.
- [x] Add Owner-controlled content permissions for view, edit, media, review, publish, stats and archive actions.
- [x] Add editable public statistics and connect published values to the homepage.
- [x] Add SEO title, description, Open Graph metadata, robots.txt and sitemap.xml.
- [x] Add route-level code splitting for the heavier catalogue, request, management and content pages.
- [x] Verify desktop rendering for the homepage, public CMS pages, login and request forms.
- [x] Verify mobile rendering for the homepage, public CMS pages, login and request forms.
- [x] Verify robots.txt, sitemap.xml and public CMS APIs return successfully.
- [x] Run TypeScript check, all tests and production build.

## Waiting for SPM inputs / production preparation

- [ ] Replace temporary imagery with SPM-approved assets before production.
- [ ] Upload and approve the real SPM catalogue, certificates, agency letters and customer evidence.
 - [x] Write and seed initial English copy page by page into Owner CMS drafts for review.
 - [ ] Review and publish the approved English pages through the Owner Content Workspace.
- [ ] Add dynamic Downloads, FAQs, News, Events and Careers collections backed by CMS records.
- [ ] Configure a production email provider for quote/service/contact confirmations.
- [ ] Configure production domain/DNS, analytics consent and deployment environment variables.
- [ ] Run the final accessibility and end-to-end request-flow verification after real content and email configuration are available.

## Known non-blocking issue

- The production build now uses route-level code splitting and the largest initial JavaScript chunk is approximately 695 kB minified. Vite still reports a chunk-size warning; further vendor splitting can be done during the final performance pass.
