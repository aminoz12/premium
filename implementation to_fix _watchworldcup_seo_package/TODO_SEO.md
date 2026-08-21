# Cursor SEO Implementation TODO

## P0 — Confirm legality, measurement, and deployment safety

- [ ] Confirm that the business has written rights or licenses for every advertised channel, PPV event, movie, series, and territory. If evidence is missing, do not expand the corresponding commercial page; remove or noindex the unverified claim and flag it in `SEO_BLOCKERS.md`.
- [ ] Confirm the canonical hostname and slash policy. The current public policy is `https://watchworldcup.us` without a trailing slash in canonical and sitemap values. Preserve one normalized policy across redirects, links, canonicals, Open Graph URLs, JSON-LD IDs, and sitemap URLs.
- [ ] Verify the domain in Google Search Console and Bing Webmaster Tools. Submit `https://watchworldcup.us/sitemap.xml`; inspect the homepage, `/pricing`, `/setup-guides`, `/guides`, `/world-cup-2026`, and the three highest-value editorial pages.
- [ ] Check Google Search Console Page Indexing, Manual Actions, Security Issues, Removals, Core Web Vitals, and Search Performance. Record the baseline in `docs/seo/baseline.md`.
- [ ] Confirm analytics and event tracking for qualified WhatsApp clicks, plan selection, trial-start clicks, contact/support clicks, scroll depth on guides, and conversion completion. Do not collect unnecessary personal data.

## P1 — Fix confirmed technical defects

- [ ] Reduce the homepage to exactly one primary H1. Keep the main value proposition as the H1 and convert the second H1 to an H2 or a styled paragraph without changing visual design unnecessarily.
- [ ] Change the homepage FAQ JSON-LD `@id` from `https://watchworldcup.us//#faq` to `https://watchworldcup.us/#faq`.
- [ ] Generate homepage FAQ JSON-LD from the same typed FAQ source that renders the visible FAQ. Include only questions and answers visibly present on the page.
- [ ] Audit every JSON-LD block for truthful values, valid URLs, visible content, and applicable schema types. Do not add `AggregateRating`, `Review`, `SoftwareApplication`, `Offer`, `Event`, or `LocalBusiness` markup unless the page and data genuinely qualify.
- [ ] Keep `/api/`, `/checkout`, `/cart`, and `/client-area` out of crawling and indexing. Use authentication or `noindex` for private pages; do not rely on robots.txt to hide sensitive URLs.
- [ ] Ensure the sitemap contains only canonical, public, indexable, valuable URLs. Remove URLs that are thin, duplicate, private, redirecting, or unsupported by the business.
- [ ] Generate sitemap `lastmod` values from real content timestamps. Never update all timestamps merely to imply freshness.
- [ ] Add automated tests for HTTP 200 status, canonical consistency, one H1, unique title, useful description, valid JSON-LD, and sitemap membership for public routes.
- [ ] Check HTTP, HTTPS, www, non-www, slash, query-string, and common redirect variants for one-hop canonical redirects.
- [ ] Preserve the current HSTS and security-header baseline, then verify CSP against all legitimate assets, fonts, analytics, WhatsApp links, and embeds.

## P1 — Metadata and page templates

- [ ] Create typed page metadata helpers in `src/lib/seo/metadata.ts` or the repository’s equivalent. Every indexable page must provide a unique title, description, canonical URL, Open Graph image, Twitter card, language, and robots policy.
- [ ] Do not enforce a universal 50–60 character title rule or 140–155 character description rule. Enforce uniqueness, accuracy, clarity, and practical snippet usability.
- [ ] Ensure titles and visible primary headings describe the same page and language. Avoid keyword stuffing and boilerplate titles.
- [ ] Add canonical metadata to all public templates and explicitly define `noindex` metadata for checkout, account, cart, thank-you, internal search, and other non-search pages.
- [ ] Add `BreadcrumbList` only where the breadcrumb is visible and reflects the real hierarchy.
- [ ] Add `Article` or `Dataset` markup only where a page is genuinely an article or dataset and exposes author, dates, methodology, or source information as appropriate.
- [ ] Add `Organization` and `WebSite` markup globally with one canonical brand name, URL, logo, and controlled social profiles.

## P1 — Trust, brand, and entity clarity

- [ ] Use `WATCHWORLDCUP` consistently in the logo, title templates, Organization schema, Open Graph, About page, and social profiles.
- [ ] State clearly that the business is not FIFA, a league, a broadcaster, studio, or official tournament partner unless written authorization exists.
- [ ] Add an accountable organization description, support contact, operating jurisdiction where legally appropriate, customer-support hours, refund/cancellation rules, privacy details, terms, corrections channel, and editorial policy.
- [ ] Add visible author/editor information to research and guide pages. Link each author to a profile with relevant experience and a review date.
- [ ] Add a “How we verify availability” section describing the date, territory, source, and limitations of channel/content claims.
- [ ] Replace unsupported claims such as “30,000+ channels,” “100,000+ VOD,” “99.9% uptime,” “all PPV,” or “HD/4K” with measured, dated, qualified claims—or remove them.
- [ ] Do not create a Google Business Profile unless the business genuinely meets customers in person and qualifies under Google’s policy. Do not publish a fake address or inconsistent NAP data.

## P1 — Accessibility and performance

- [ ] Reserve dimensions for hero images, promotional cards, floating WhatsApp controls, and embeds to prevent layout shift.
- [ ] Optimize the actual LCP element, preload only critical assets, defer non-critical JavaScript, lazy-load below-the-fold images, and use modern image formats where supported.
- [ ] Test current Core Web Vitals using LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 at the 75th percentile as the public target. Treat lower values as internal engineering goals, not Google requirements.
- [ ] Ensure all keyboard interactions work, focus states are visible, tap targets are usable, text remains readable at mobile widths, and color contrast is accessible.
- [ ] Add descriptive alt text to meaningful images; use empty alt text for decorative images.
- [ ] Avoid intrusive popups and ensure the free-trial CTA does not cover essential content or create accidental clicks.

## P2 — Content and internal linking

- [ ] Keep the lawful content clusters around streaming technology, accessibility, buffering, internet speed, device setup, and legal ways to watch sports.
- [ ] Create a content brief before adding any page. Each brief must specify the user question, search intent, evidence sources, author/editor, update cadence, internal links, conversion goal, and indexability decision.
- [ ] Do not use a fixed minimum word count. Make each page as long as needed to answer the question with original evidence and clear writing.
- [ ] Add contextual internal links from guides to related guides, the relevant setup page, the pricing page, and the support page where appropriate.
- [ ] Avoid programmatically generating thousands of near-identical team, channel, match, or “watch X live” pages.
- [ ] Cite primary sources such as official tournament, league, broadcaster, device, accessibility, and standards pages when making factual claims.
- [ ] Add editorial update dates and remove or redirect outdated seasonal pages instead of leaving stale pages indexable.

## P2 — Compliant visitor growth

- [ ] Publish original research such as a transparent streaming-latency benchmark, accessibility comparison, or device setup test with methodology and downloadable data.
- [ ] Produce genuinely useful video tutorials and link each video to a matching, detailed page. Do not create videos that promise access to unlicensed content.
- [ ] Share new research through legitimate communities only when it answers a real question; disclose the brand relationship and follow each platform’s rules.
- [ ] Pursue editorial citations through original data, expert commentary, partnerships, and transparent outreach. Do not buy links, use link farms, exchange spam links, or optimize to an artificial anchor-text percentage.
- [ ] Maintain one official brand identity on controlled social profiles and link them accurately from the site.
- [ ] Do not claim that traffic, rankings, backlinks, or AI citations are guaranteed.

## P2 — GEO / AI-search readiness

- [ ] Do not add `ai.txt`, special AI schema, hidden AI copy, or crawler-specific content. Google states that no special AI files or markup are required for AI Overviews or AI Mode.
- [ ] Put a concise answer near the beginning of each guide, followed by evidence, definitions, steps, caveats, and sources.
- [ ] Use clear question-based headings, short explanatory paragraphs, tables where useful, and stable anchor links to important sections.
- [ ] Make factual claims attributable: include author/editor, publication date, last reviewed date, source links, methodology, and uncertainty.
- [ ] Use structured data only when it accurately represents visible page content.
- [ ] Monitor branded and non-branded queries in Search Console and compare clicks/impressions by page, query, country, and device.

## P3 — QA and release

- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and the production build.
- [ ] Run the sitemap crawler and fail CI for non-200 public URLs, missing metadata, canonical mismatches, more than one H1, invalid JSON-LD, or private pages in the sitemap.
- [ ] Test the homepage and key pages at narrow mobile, tablet, and desktop widths.
- [ ] Run an accessibility scan and manually test keyboard navigation, screen-reader landmarks, focus order, forms, dialogs, and WhatsApp links.
- [ ] Validate structured data with Google’s Rich Results Test where the type is eligible; treat eligibility as non-guaranteed.
- [ ] Write `SEO_CHANGELOG.md` with changed files, route decisions, schema decisions, redirects, remaining blockers, and evidence still required from the business owner.
- [ ] Do not deploy if the code invents licenses, reviews, ratings, prices, availability, official affiliations, customer counts, or performance statistics.
