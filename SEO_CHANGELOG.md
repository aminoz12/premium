# SEO changelog

## 17 August 2026

- Removed the legacy homepage client metadata, schema, hidden keyword copy, keyword marquee and fake Review/AggregateRating presentation from rendered output. App-router metadata and server-rendered schema remain the single source of truth.
- Reduced the rendered homepage to one H1 and moved homepage FAQs to `lib/home-faq.ts`, which now drives both the visible FAQ list and `FAQPage` JSON-LD.
- Normalized canonical URL construction in `lib/site.ts` and fixed root FAQ schema IDs so the homepage uses `https://watchworldcup.us/#faq`, not a double slash.
- Removed rendered claims requiring evidence: catalog/customer counts, ratings, guaranteed availability, free trial, uptime/buffering, universal compatibility, payment-method logos and unsupported home-plan prices.
- Removed Google Analytics from the root layout because the published privacy policy states that no analytics script is installed. Local CTA events remain local browser events only.
- Added compliance/evidence, repository, indexability and release records under `docs/seo/` and this blocker register.

No redirect changes were necessary. Sitemap route eligibility remains governed by the existing public route list; timestamps still require content-owner verification before a deployment claiming freshness.
