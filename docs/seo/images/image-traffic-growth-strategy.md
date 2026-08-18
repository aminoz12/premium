# Image Search Traffic Growth Strategy

This document details the strategy for capturing high-volume image search traffic from **Google Images**, **Google Lens**, **Bing Visual Search**, and social visual platforms for **WATCHWORLDCUP**.

## 1. Why Image SEO Drives Massive Traffic

Sports fans frequently query Google Images for broadcast schedules, match charts, stadium host locations, and technical setup diagrams. By optimizing image assets:
- **Google Images SERP Carousels**: Our WebP cards appear directly in sports visual carousels above standard organic text results.
- **Google Lens & Multisearch**: Visual matching allows users scanning device setups or sports logos to find `https://watchworldcup.us`.
- **Rich Social Shares**: Custom 1200x630 WebP images maximize CTR on Twitter, Reddit, WhatsApp, and Facebook preview cards.

## 2. Tactical Pillars for Image Traffic Optimization

### A. Format & Compression Excellence
- **WebP Standard**: 100% of raster graphics are lossy WebP compressed under 250 KB for social cards and under 300 KB for hero graphics.
- **Dimension Declarations**: Explicit `width` and `height` attributes eliminate layout shift (CLS = 0) and allow search engines to instantly compute aspect ratios (1.91:1 for OG, 16:9 for hero).

### B. High-Intent Visual Keyword Alt Text
- Map every image to specific user intent keywords rather than generic terms.
  - *Bad*: `alt="image"` or `alt="world cup"`
  - *Good*: `alt="FIFA World Cup 2026 USA replay schedule and FOX Sports streaming guide"`

### C. XML Image Sitemap & Schema.org ImageObject
- `app/sitemap.ts` includes `<image:image>` tags for all 40 indexable routes.
- Component `<OptimizedImage />` injects `@type: "ImageObject"` JSON-LD schema with `contentUrl`, `width`, `height`, `caption`, and `author`.

### D. Contextual Placement & Figcaption Tags
- Place images within relevant body sections immediately under corresponding `<h2>` headings.
- Enclose images in `<figure>` elements with descriptive `<figcaption>` tags to provide search crawlers with high contextual weight.
