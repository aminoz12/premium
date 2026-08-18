# Visual Search & Social Card Optimization Guide

This document covers Open Graph visual cards, Google Lens/Images indexing rules, and structured image schema for **WATCHWORLDCUP**.

## 1. Open Graph & Twitter Social Cards

- Every indexable page has a custom WebP social card (`1200x630` px) in `public/images/og/`.
- Card paths strictly follow route slugs (e.g. `guides--best-device-live-sports.webp` for `/guides/best-device-live-sports`).
- Open Graph tags generated via `pageMetadata()` in `lib/seo.ts`:
  - `og:image`: Full canonical URL (`https://watchworldcup.us/images/og/[slug].webp`)
  - `og:image:type`: `image/webp`
  - `og:image:width`: `1200`
  - `og:image:height`: `630`
  - `og:image:alt`: Contextual page title

## 2. ImageObject Schema Markup

- Embedded images on major guide routes include schema.org `ImageObject` markup defining `contentUrl`, `caption`, `width`, and `height`.

## 3. Visual Search Indexing

- File names use descriptive dash-separated keywords (e.g. `hero-fallback.webp`).
- Alt attributes explicitly describe visual content without generic filler.
