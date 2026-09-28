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
- [x] Run TypeScript check, all tests and production build.
- [x] Capture visual verification screenshots for the homepage, CMS-backed pages and internal login.

## Next implementation

- [ ] Replace temporary imagery with SPM-approved assets before production.
- [ ] Upload and approve the real SPM catalogue, certificates, agency letters and customer evidence.
- [ ] Complete the final English copy page by page and approve it through the content workflow.
- [ ] Add dynamic Downloads, FAQs, News, Events and Careers collections backed by CMS records.
- [ ] Add production email provider configuration for quote/service/contact confirmations.
- [ ] Add accessibility audit, responsive mobile verification and end-to-end request-flow verification.
- [ ] Add code-splitting/performance optimization for the current 1.2 MB minified client bundle.
- [ ] Configure production domain/DNS, analytics consent and deployment environment variables.

## Known non-blocking issue

- The production build reports a Vite chunk-size warning because the current application bundle is larger than 500 kB. The build passes; code-splitting is planned before production launch.
