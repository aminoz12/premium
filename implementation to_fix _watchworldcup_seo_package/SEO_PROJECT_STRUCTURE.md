# Recommended SEO Project Structure

The public response indicates a **Next.js-style application deployed on Netlify**, but the exact repository layout must be inspected before editing. Cursor should use the existing conventions rather than creating a second routing or metadata system. The following structure is a target design; adapt `app/`, `pages/`, `src/`, or `content/` paths to the repository that actually exists.

```text
/
├── app/ or pages/
│   ├── layout.tsx or _app.tsx                 # Global metadata, fonts, analytics consent, site chrome
│   ├── page.tsx or index.tsx                  # Homepage; exactly one H1
│   ├── robots.ts or robots.txt                # Generated crawl rules
│   ├── sitemap.ts or sitemap.xml              # Canonical, indexable URLs only
│   ├── manifest.ts or manifest.webmanifest    # Optional PWA metadata if the site supports it
│   ├── opengraph-image.tsx                    # Optional brand-consistent OG fallback
│   ├── twitter-image.tsx                      # Optional brand-consistent social image
│   ├── about/
│   ├── contact/
│   ├── corrections/
│   ├── editorial-policy/
│   ├── privacy-policy/
│   ├── terms-of-service/
│   ├── support/
│   ├── guides/
│   ├── research/
│   ├── data/
│   ├── updates/
│   ├── pricing/
│   └── setup-guides/
│
├── src/
│   ├── components/
│   │   ├── SeoHead.tsx or SeoMetadata.tsx      # One metadata abstraction, not page-by-page duplication
│   │   ├── JsonLd.tsx                          # Safe JSON-LD serializer with XSS-safe escaping
│   │   ├── Breadcrumbs.tsx                     # Visible breadcrumb + matching BreadcrumbList schema
│   │   ├── FaqSection.tsx                      # Visible FAQ source of truth
│   │   ├── AuthorByline.tsx                    # Author, editor, published, updated, reviewed data
│   │   ├── TrustPanel.tsx                      # Rights/availability, support, terms, and limitation disclosures
│   │   └── PerformanceSafeMedia.tsx            # Stable image/embed dimensions and lazy loading
│   ├── lib/
│   │   ├── seo/
│   │   │   ├── metadata.ts                     # Typed title, description, canonical, OG, robots helpers
│   │   │   ├── canonical.ts                    # One URL normalization policy
│   │   │   ├── schema.ts                       # Organization, WebSite, Service, Article, Dataset, FAQ builders
│   │   │   ├── faq-schema.ts                   # Builds FAQ schema from visible FAQ data only
│   │   │   ├── sitemap.ts                      # Sitemap generation and truthful lastmod handling
│   │   │   ├── robots.ts                       # Robots generation with private-route rules
│   │   │   └── route-policy.ts                 # index/noindex decisions by route type
│   │   ├── analytics/
│   │   │   ├── events.ts                       # Event names and typed payloads
│   │   │   └── consent.ts                      # Consent-aware analytics loading
│   │   ├── content/
│   │   │   ├── source-registry.ts              # Primary sources and citation metadata
│   │   │   ├── editorial.ts                    # Author/editor/review-date helpers
│   │   │   └── content-policy.ts               # Rules preventing unsupported commercial claims
│   │   └── validation/
│   │       ├── claims.ts                       # Required evidence for channel, rights, uptime, price claims
│   │       └── urls.ts                         # URL and canonical validation
│   ├── content/
│   │   ├── guides/                             # Human-reviewed guides with front matter
│   │   ├── research/                           # Original research and methodology
│   │   ├── data/                               # Versioned datasets and data dictionaries
│   │   └── updates/                            # Dated, editorially reviewed updates
│   └── config/
│       ├── site.ts                             # Brand, canonical URL, logo, locale, support links
│       ├── authors.ts                          # Real author/editor profiles
│       └── social.ts                           # Only verified, controlled social profile URLs
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   ├── icons/
│   ├── images/
│   │   ├── og/                                # 1200x630 social images with descriptive names
│   │   ├── guides/                            # Original screenshots and diagrams
│   │   └── research/                          # Charts, methodology graphics, data visuals
│   └── files/
│       ├── research/                          # Public CSV/PDF only when appropriate and reviewed
│       └── accessibility/                     # Optional captions/transcripts/alt-text resources
│
├── scripts/
│   ├── audit-seo.mjs                          # Crawl routes and validate metadata/schema
│   ├── validate-sitemap.mjs                   # Ensure sitemap URLs are canonical and 200
│   ├── validate-claims.mjs                    # Fail on unsupported placeholder commercial claims
│   └── check-links.mjs                        # Detect broken internal and source links
│
├── tests/
│   ├── seo/
│   │   ├── metadata.test.ts
│   │   ├── sitemap.test.ts
│   │   ├── schema.test.ts
│   │   ├── robots.test.ts
│   │   └── canonical.test.ts
│   ├── accessibility/
│   └── smoke/
│
├── docs/
│   └── seo/
│       ├── baseline.md                        # Search Console, analytics, CWV, and index baseline
│       ├── content-map.md                     # One intent and primary topic per indexable page
│       ├── brand-entity.md                    # Canonical brand facts and controlled profiles
│       ├── geo-content-standard.md             # Answer-ready content rules and citation policy
│       ├── rights-evidence-register.md        # Content/territory rights evidence register
│       ├── route-indexability.md              # Index/noindex decisions by route
│       └── release-checklist.md               # Pre-deploy and post-deploy checks
│
├── SEO_CHANGELOG.md
├── SEO_BLOCKERS.md
└── README.md
```

## Files that should be added first

| File | Why it matters | Required behavior |
|---|---|---|
| `src/lib/seo/metadata.ts` | Prevents inconsistent page metadata | Every page declares unique, accurate metadata through one typed helper |
| `src/lib/seo/canonical.ts` | Prevents URL duplication | One normalized hostname and slash policy is reused everywhere |
| `src/lib/seo/faq-schema.ts` | Prevents visible/schema mismatch | JSON-LD is generated from the exact visible FAQ source |
| `src/lib/seo/route-policy.ts` | Makes indexability intentional | Commercial, editorial, legal, transactional, and private route policies are explicit |
| `src/lib/content/claim-registry.ts` or `src/lib/validation/claims.ts` | Prevents invented marketing claims | Unsupported rights, channel, rating, uptime, review, price, and availability claims fail validation |
| `src/config/site.ts` | Makes brand/entity data consistent | One brand name, canonical URL, logo, locale, support URL, and disclosure settings |
| `scripts/audit-seo.mjs` | Makes SEO regressions testable | Fails on missing/duplicate metadata, multiple H1s, invalid schema, and bad canonicals |
| `docs/seo/rights-evidence-register.md` | Makes commercial claims auditable | Each claim links to evidence, territory, date, owner, and expiry/review date |
| `docs/seo/content-map.md` | Prevents cannibalization and thin pages | Each indexable URL has one purpose, intent, source plan, and internal-link plan |
| `SEO_CHANGELOG.md` | Makes releases reviewable | Lists every SEO change, route decision, redirect, schema change, and unresolved risk |

## Do not add these files

Do not add `ai.txt`, hidden AI-only content, user-agent-specific SEO pages, fake review JSON-LD, a fake `LocalBusiness` profile, a keyword meta tag, a sitemap-news file without qualifying news content, or a directory containing thousands of automatically varied “watch X live” pages. These additions either have no documented benefit or create quality, spam, trust, and compliance risk.
