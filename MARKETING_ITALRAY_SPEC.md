# Marketing Italray Architecture Decisions

## Confirmed Policy
- Sources: Unified across Shopify Italray storefront items and internal SPM catalogue records (Option C).
- Publishing: Direct publishing by Marketing users without requiring a blocking Owner review step (Option B).
- Commercial Model: Request a Quote only for medical imaging devices (Option A).
- Media Control: Full support for both direct uploads and external CDN URLs, image reordering, hero selection, individual image positioning (top/center/bottom and left/center/right), zoom scale percentage, clinical carousel management, and brochure binding.

## Database Table
`italray_presentation_overrides`:
- `handle`: unique string matching the product slug / Shopify handle.
- `heroObjectPosition`, `heroScalePercent`, `descriptionObjectPosition`.
- `galleryImagesJson`, `imagePositionsJson`.
- `pillarsJson`, `clinicalGalleryJson`, `upgradesJson`, `specificationsJson`.
- `commercialModel` (defaults to 'quote_only').
- `isVisible`, `displayOrder`.
