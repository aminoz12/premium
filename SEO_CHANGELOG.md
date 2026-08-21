# SEO changelog

## 17 August 2026

- Removed the legacy homepage client metadata, schema, hidden keyword copy, keyword marquee and fake Review/AggregateRating presentation from rendered output. App-router metadata and server-rendered schema remain the single source of truth.
- Reduced the rendered homepage to one H1 and moved homepage FAQs to `lib/home-faq.ts`, which now drives both the visible FAQ list and `FAQPage` JSON-LD.
- Normalized canonical URL construction in `lib/site.ts` and fixed root FAQ schema IDs so the homepage uses `https://watchworldcup.us/#faq`, not a double slash.
- Removed rendered claims requiring evidence: catalog/customer counts, ratings, guaranteed availability, free trial, uptime/buffering, universal compatibility, payment-method logos and unsupported home-plan prices.
- Removed Google Analytics from the root layout because the published privacy policy states that no analytics script is installed. Local CTA events remain local browser events only.
- Added compliance/evidence, repository, indexability and release records under `docs/seo/` and this blocker register.
- Replaced the remaining shared pricing-card guarantees with a transparent confirmation checklist, added the indexable-content brief template, and made sitemap `lastmod` values follow maintained route/content dates instead of one blanket timestamp.
- Added a release gate that rejects missing, invalid or blanket sitemap modification dates.
- Reworded price references from “verified” to “listed” or “owner-provided”; the evidence register keeps price-policy confirmation as a deployment blocker.

No redirect changes were necessary. Sitemap route eligibility remains governed by the existing public route list; timestamps still require content-owner verification before a deployment claiming freshness.

## 18 August 2026

- Expanded Brand SEO package with `seo/brand/brand-entity-knowledge-graph.json`, `seo/brand/brand-reputation-policy.json`, `seo/brand/brand-visual-identity-policy.json`, `seo/brand/brand-2026-entity-profile.json`, `seo/brand/brand-2026-search-authority.json`, `seo/brand/citation-register.json`, documentation guides in `docs/seo/brand/`, and TypeScript libraries `lib/brand.ts` and `lib/brand-2026.ts`.
- Expanded Geographic SEO package with `seo/geo/regional-market-map.json`, `seo/geo/geo-faq-schema.json`, `seo/geo/regional-image-localization.json`, `seo/geo/world-cup-2026-regional-broadcast-map.json`, `seo/geo/geo-2026-answer-engine-map.json`, documentation guides in `docs/seo/geo/`, and TypeScript libraries `lib/geo.ts` and `lib/geo-2026.ts`.
- Expanded Image SEO package with `seo/images/image-manifest.json`, `seo/images/image-search-index.json`, `seo/images/image-seo-standards.json`, `seo/images/google-image-seo-guide.json`, `seo/images/world-cup-2026-image-catalog.json`, `seo/images/image-2026-seo-directives.json`, documentation guides in `docs/seo/images/`, `app/_components/OptimizedImage.tsx`, and TypeScript libraries `lib/image-seo.ts` and `lib/image-seo-2026.ts`.
- Created Technical SEO package with `seo/technical/crawl-budget-policy.json`, `seo/technical/cdn-caching-policy.json`, `seo/technical/crawl-policy-2026.json`, and documentation guides in `docs/seo/technical/`.
- Created a complete **Multi-Sitemap Architecture** with specialized XML endpoints (`sitemap-index.xml`, `sitemap.xml`, `sitemap-images.xml`, `sitemap-geo.xml`, `sitemap-brand.xml`, `sitemap-2026.xml`, `sitemap-guides.xml`, `sitemap-news.xml`, `sitemap-video.xml`) and updated `app/robots.ts`.
- Created automated image audit script `scripts/validate-image-seo.mjs` and updated `scripts/seo-files-check.mjs` to validate all 34 SEO package files in automated CI.

