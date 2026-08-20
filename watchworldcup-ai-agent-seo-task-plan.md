# WATCHWORLDCUP — AI Agent SEO Fix Task Plan

## Mission

Improve the organic discoverability, trust, measurement and conversion readiness of `watchworldcup.us` without creating spam, doorway pages, misleading claims, copyright-infringing promotion or unsupported SEO promises.

The agent must work from the existing codebase and preserve the current visual identity unless a change is required for accessibility, clarity, performance or conversion.

## Non-negotiable safety and business rules

Before publishing commercial claims, the agent must request verified source material from the owner:

- Business/operator legal name and jurisdiction
- Customer support identity and response expectations
- Payment entity and payment methods
- Refund/cancellation terms
- Countries and devices actually supported
- Proof that all offered channels, sports, movies and series are legally licensed or otherwise authorized for distribution
- Evidence and date for uptime, channel-count, VOD-count and quality claims

If a claim cannot be verified, remove it or replace it with cautious wording such as “availability varies by country, device and current rights.” Do not invent licensing, testimonials, statistics, reviews, prices, guarantees or availability.

Do not create pages targeting illegal streaming, piracy, circumvention, unauthorized restreaming or “free stream” searches. The legal IPTV guide must remain educational and jurisdiction-aware, not legal advice.

---

# Phase 0 — Reconnaissance and baseline

## TASK-001 — Inspect the application architecture

**Priority:** P0  
**Depends on:** None

Determine:

- Next.js version and router type
- Root layout or shared document component
- Metadata implementation
- Existing analytics implementation
- Sitemap and robots implementations
- Existing JSON-LD/schema components
- Content/data source for all public pages
- Image and font loading strategy
- Deployment platform and build command

Do not edit files in this task.

**Deliverable:** Create `SEO_IMPLEMENTATION_NOTES.md` with the relevant file paths, route list and implementation approach.

**Acceptance criteria:**

- Every public route has an identified source file or data definition.
- The agent knows where global metadata, page metadata, analytics, sitemap and structured data are generated.
- No duplicate metadata systems are introduced.

## TASK-002 — Establish a baseline report

**Priority:** P0  
**Depends on:** TASK-001

Record before changing code:

- All sitemap URLs and HTTP status codes
- Title, description, canonical, robots and H1 for every public indexable page
- Internal links to commercial pages
- Existing JSON-LD types
- Existing image dimensions and formats
- Existing analytics markers
- Build status and lint/typecheck status if available

**Deliverable:** `SEO_BASELINE.md`.

**Acceptance criteria:**

- Baseline is reproducible with a script or documented command.
- Baseline distinguishes facts from assumptions.
- No claim is made that a page is indexed without Search Console data.

---

# Phase 1 — Measurement and indexation verification

## TASK-003 — Install one consent-aware analytics system

**Priority:** P0  
**Depends on:** TASK-001

Implement one analytics system only. Prefer the owner’s existing property. If no property exists, add a clearly documented placeholder configuration and stop before publishing a guessed measurement ID.

Requirements:

- Load analytics through the root layout/shared document.
- Do not expose secrets.
- Respect the site’s consent requirements and privacy policy.
- Avoid duplicate page-view events during Next.js client navigation.
- Exclude development, preview and local traffic where practical.

Track:

- `page_view`
- Pricing-page view
- Plan/card view
- Order CTA click
- WhatsApp CTA click
- Setup-guide view
- Form validation/error event, if forms exist
- Confirmed order/lead only when the application can verify it

Use a WhatsApp click as a lead event, not as a completed purchase.

**Acceptance criteria:**

- A real-time test visit appears.
- Navigation between two routes creates correct page views.
- WhatsApp clicks include page and plan context.
- No analytics ID is hard-coded in multiple files.
- Privacy policy matches the actual tracking behavior.

## TASK-004 — Add Search Console and webmaster verification hooks

**Priority:** P0  
**Depends on:** TASK-001

Add support for environment-configured verification values. Do not hard-code guessed verification tokens.

Document the exact owner steps:

1. Verify the domain property in Google Search Console.
2. Verify Bing Webmaster Tools.
3. Submit `https://watchworldcup.us/sitemap-index.xml`.
4. Inspect `/`, `/pricing`, `/order`, `/sports`, `/guides` and `/guides/is-iptv-legal`.
5. Check indexing, exclusions, manual actions and security issues.

**Acceptance criteria:**

- Verification can be enabled through environment variables or the deployment dashboard.
- No fake verification tag is published.
- Documentation names the exact post-deployment checks.

## TASK-005 — Simplify and validate sitemap generation

**Priority:** P0  
**Depends on:** TASK-001

Ensure:

- The sitemap index contains only real child sitemaps.
- Every submitted URL is canonical, public, indexable and HTTP 200.
- No duplicate URLs across child sitemaps unless required by the XML standard.
- `/dmca` and `/refund-policy` are included if they are canonical public pages.
- Checkout, cart, client area and API URLs are excluded.
- `lastmod` reflects real content changes, not every build.
- No future or fabricated modification dates are generated.

Do not submit image, video, news or dataset sitemaps unless they contain valid entries and provide actual discovery value.

**Acceptance criteria:**

- XML validates.
- All URLs resolve with HTTPS.
- URL count and unique URL count are equal within each sitemap family.
- A crawl script reports no non-200 sitemap URLs.

## TASK-006 — Validate robots and canonical behavior

**Priority:** P0  
**Depends on:** TASK-001

Verify:

- `/robots.txt` is plain text.
- `/sitemap-index.xml` is declared once.
- Public commercial and editorial pages are allowed.
- `/api/`, `/checkout`, `/cart` and `/client-area` remain blocked where appropriate.
- Canonical URLs use one host, HTTPS and one trailing-slash policy.
- Query-string variants do not create conflicting canonicals.

**Acceptance criteria:**

- `curl -I` and body checks are documented.
- Canonical URL equals the deployed public URL for every indexable page.
- No important page has `noindex`.

---

# Phase 2 — Trust, compliance and commercial conversion

## TASK-007 — Create a verified business/trust block

**Priority:** P0  
**Depends on:** Owner verification from the safety rules

Add a consistent trust section to the homepage, pricing and order pages containing only verified information:

- Operator/business identity
- Jurisdiction or operating location where appropriate
- Support channel and expected response time
- Payment entity
- Refund/cancellation link
- Terms and privacy links
- Content availability and territory limitations
- Device/application compatibility limitations
- Licensing/authorization explanation, if verified

Do not claim “official,” “guaranteed,” “unlimited,” “99.9% uptime,” “all channels,” “all devices” or similar without evidence.

**Acceptance criteria:**

- Users can understand who they are ordering from before contacting WhatsApp.
- Pricing and order pages link visibly to terms and refunds.
- Legal pages match actual business operations.
- Unsupported claims are removed or have an evidence note and date.

## TASK-008 — Rewrite the homepage conversion path

**Priority:** P1  
**Depends on:** TASK-007

Improve the homepage sequence:

1. Clear H1 and one-sentence explanation
2. Supported use cases and availability limits
3. Transparent plan summary
4. Device/setup compatibility
5. How ordering works
6. Trust/legal information
7. FAQ
8. Primary CTA and secondary support CTA

Use a clear CTA such as “Check availability” instead of implying guaranteed universal access.

**Acceptance criteria:**

- One semantic H1 exists.
- The first viewport explains what the service is, where availability varies and what action to take.
- CTA labels describe the next action.
- Mobile layout has no horizontal overflow.

## TASK-009 — Add or improve FAQ content

**Priority:** P1  
**Depends on:** TASK-007

Answer only questions the business can support:

- What is included?
- Which countries and devices are supported?
- Which applications are compatible?
- How is availability confirmed?
- How are credentials delivered?
- What happens if a plan is unavailable?
- What are cancellation and refund conditions?
- Who provides support?
- Is the content licensed/authorized?

Add FAQPage JSON-LD only when the same questions and answers are visibly present on the page.

**Acceptance criteria:**

- No fabricated answers.
- No FAQ spam copied across every URL.
- Structured data passes validation.

---

# Phase 3 — Metadata and page-level SEO

## TASK-010 — Implement centralized metadata helpers

**Priority:** P1  
**Depends on:** TASK-001

Create one metadata utility that supports:

- Unique title
- Unique description
- Canonical
- Open Graph title/description/url/type/image
- Twitter card
- Locale and site name
- Robots directives

The helper must not overwrite page-specific metadata with homepage values.

**Acceptance criteria:**

- Every indexable page has one title, one description and one canonical.
- No duplicate title or description across the 40 public pages.
- Metadata is present in server HTML, not only after client JavaScript runs.
- OG image URLs are real, hosted and return 200.

## TASK-011 — Apply the approved title map

**Priority:** P1  
**Depends on:** TASK-010

Use these starting titles and adjust only when real Search Console data justifies it:

| Route | Title |
|---|---|
| `/` | `IPTV & M3U Subscriptions for Live Sports \| WATCHWORLDCUP` |
| `/sports` | `Live Sports IPTV Availability \| WATCHWORLDCUP` |
| `/pricing` | `IPTV Subscription Pricing & Plans \| WATCHWORLDCUP` |
| `/order` | `Order IPTV Subscription \| WATCHWORLDCUP` |
| `/setup-guides` | `IPTV Setup Guides for TV, Mobile & Fire TV \| WATCHWORLDCUP` |
| `/guides` | `Live Sports Streaming Guides \| WATCHWORLDCUP` |
| `/guides/is-iptv-legal` | `Is IPTV Legal? Licensing & Warning Signs \| WATCHWORLDCUP` |
| `/guides/watch-soccer-without-cable` | `Watch Soccer Without Cable Legally \| WATCHWORLDCUP` |
| `/support` | `IPTV Setup & Troubleshooting Support \| WATCHWORLDCUP` |

Rewrite other titles to approximately 50–65 characters, placing the search intent first and brand last.

**Acceptance criteria:**

- No commercial title is unnecessarily 70–80 characters.
- Titles accurately describe page content.
- Brand is not repeated multiple times.

## TASK-012 — Rewrite descriptions for intent and click-through

**Priority:** P1  
**Depends on:** TASK-010

Rewrite descriptions for:

- Homepage
- Live TV
- Sports
- Movies
- Series
- Pricing
- Order
- Setup guides
- Support
- `/world-cup-2026/teams`
- `/world-cup-2026/host-cities`
- `/updates`

Use 140–160 characters where natural, but prioritize accuracy over character count.

Each description should contain:

- Page-specific subject
- Real differentiator
- Country/device/availability qualifier where needed
- Useful CTA

**Acceptance criteria:**

- No generic description reused across pages.
- No unsupported promises.
- Descriptions match visible page content.

## TASK-013 — Fix heading structure and visible copy

**Priority:** P1  
**Depends on:** TASK-008

For every indexable page:

- Use exactly one semantic H1.
- Ensure H1 describes the page in normal text.
- Maintain H1 → H2 → H3 order.
- Do not use decorative letter spacing as the only semantic content.
- Put the page’s answer or value proposition near the beginning.

**Acceptance criteria:**

- Automated crawl reports exactly one H1 per indexable page.
- H1 is unique and relevant.
- Decorative branding remains accessible to screen readers.

---

# Phase 4 — Content quality and topical architecture

## TASK-014 — Define the primary site entity and navigation

**Priority:** P1  
**Depends on:** TASK-007

Make the licensed, transparent streaming service the primary commercial entity. Keep World Cup resources in a clearly labeled editorial hub.

Navigation should separate:

- Service: Live TV, Sports, Movies, Series, Pricing, Setup, Support
- Resources: World Cup 2026, Guides, Research, Data
- Trust: About, Contact, Editorial Policy, Corrections, Privacy, Terms, Refunds, DMCA

**Acceptance criteria:**

- Users can reach pricing and support from every commercial page.
- Editorial pages do not look like official FIFA or broadcaster pages.
- Service pages do not depend on tournament-only keywords.

## TASK-015 — Add editorial authorship and sources

**Priority:** P1  
**Depends on:** TASK-014

For guides, research and World Cup pages, add:

- Author or editorial team
- Reviewer where appropriate
- Published date
- Updated date
- Source list
- Methodology when data or tests are used
- Correction/report-error link

Add Article or Report JSON-LD only when the visible information exists.

**Acceptance criteria:**

- Every editorial page has identifiable authorship and dates.
- Every factual dataset/result has a source or methodology.
- Dates are true and generated from content data, not build time.

## TASK-016 — Improve the eight priority guides

**Priority:** P1  
**Depends on:** TASK-015

Improve:

- `/guides/is-iptv-legal`
- `/guides/watch-soccer-without-cable`
- `/guides/streaming-latency`
- `/guides/sports-streaming-accessibility`
- `/guides/internet-speed-4k-sports`
- `/guides/stop-sports-buffering`
- `/guides/best-device-live-sports`
- `/guides/4k-hdr-sports-setup`

Each guide must include:

- A concise answer near the top
- Clear subheadings
- Original examples or measurements
- Limitations
- Sources
- Related guides
- One relevant, non-pushy service link where appropriate

**Acceptance criteria:**

- No guide is a thin keyword page.
- Internal links are contextually relevant.
- Content is useful without requiring a purchase.

## TASK-017 — Add internal-linking rules

**Priority:** P1  
**Depends on:** TASK-014

Implement contextual links:

- Guides → setup/support
- Device guides → setup
- Legal guide → terms/privacy/DMCA
- Sports/live TV → pricing only where relevant
- World Cup pages → legal replay/source pages
- Commercial pages → about/contact/support/terms/refunds

Use descriptive anchor text. Do not repeat identical commercial anchors unnaturally.

**Acceptance criteria:**

- No important page is orphaned.
- Every commercial page is within three clicks of the homepage.
- Crawl reports no broken internal links.

## TASK-018 — Handle thin, duplicate or low-purpose pages

**Priority:** P2  
**Depends on:** Search Console data from TASK-004

Do not automatically delete pages. For each page with no unique purpose:

- Merge into a stronger page, or
- Add genuinely unique evidence/content, or
- Apply `noindex, follow` if it should remain useful to users but not rank, or
- Remove with a proper 301 only when a relevant replacement exists.

Never create country pages without genuinely different availability, legal information, language or support.

**Acceptance criteria:**

- Every indexable URL has a documented search intent and unique value.
- No doorway-page pattern is introduced.

---

# Phase 5 — Structured data, images and performance

## TASK-019 — Complete structured data

**Priority:** P1  
**Depends on:** TASK-015

Use only schema that matches visible content:

- Organization and WebSite globally
- BreadcrumbList on pages with visible breadcrumbs
- Article/Report on editorial pages
- FAQPage where visible FAQs exist
- HowTo where the page genuinely provides steps
- Product/Offer only for accurate, current offers

Validate JSON-LD syntax and avoid nested script blocks.

**Acceptance criteria:**

- No schema contains invented ratings, reviews, prices, availability or identities.
- Rich Results Test and Schema Markup Validator show no critical errors.

## TASK-020 — Optimize images and social previews

**Priority:** P1  
**Depends on:** TASK-001

For every important page:

- Use real 1200×630 OG images.
- Add descriptive alt text.
- Use WebP/AVIF where supported.
- Set width/height to reduce layout shift.
- Use responsive images.
- Lazy-load below-the-fold images.
- Do not lazy-load the LCP image.

**Acceptance criteria:**

- OG image URLs return 200.
- Images have no missing alt text unless decorative.
- Mobile page does not shift while images load.

## TASK-021 — Improve mobile performance

**Priority:** P1  
**Depends on:** TASK-001

Run mobile Lighthouse/PageSpeed and fix the largest issues:

- LCP image preload
- Font loading and font subset
- Unused JavaScript
- Large client components
- Third-party scripts
- Cumulative layout shift
- Long main-thread tasks
- Image dimensions and compression

Do not optimize by removing essential content from server HTML.

**Acceptance criteria:**

- Lighthouse results are recorded before and after.
- Core Web Vitals are measured on representative pages.
- No regression in SSR content or accessibility.

## TASK-022 — Add accessibility checks

**Priority:** P1  
**Depends on:** TASK-013, TASK-020

Check:

- Keyboard navigation
- Focus states
- Color contrast
- Button/link names
- Form labels
- Mobile tap targets
- Screen-reader heading structure
- Decorative brand treatment

**Acceptance criteria:**

- No critical automated accessibility violations.
- Primary CTA and WhatsApp CTA are keyboard accessible.

---

# Phase 6 — Authority and promotion

## TASK-023 — Publish evidence-led original assets

**Priority:** P2  
**Depends on:** TASK-015, TASK-021

Publish 2–4 assets such as:

- Reproducible sports-streaming latency test
- Buffering diagnostic methodology
- Device compatibility matrix
- Accessibility checklist with standards references
- Dated, source-backed availability tracker

Every asset must identify:

- Test date
- Sample size or scope
- Method
- Limitations
- Data source

**Acceptance criteria:**

- Assets are genuinely original.
- Other sites can cite or link to them.
- No content is generated solely to target a keyword.

## TASK-024 — Build a legitimate outreach list

**Priority:** P2  
**Depends on:** TASK-023

Prepare a list of relevant publications, device reviewers, sports technology sites, data repositories and expert contributors.

Do not:

- Buy bulk backlinks
- Use private blog networks
- Spam comments/forums
- Send unsolicited WhatsApp campaigns
- Misrepresent the service as official

**Acceptance criteria:**

- Outreach is personalized and based on a useful asset.
- Links are earned editorially.
- Campaign links use UTM parameters.

## TASK-025 — Create an opt-in audience channel

**Priority:** P2  
**Depends on:** TASK-003, TASK-007

If the business has a lawful reason and verified consent flow, add an email or update-notification option with:

- Explicit opt-in
- Privacy explanation
- Unsubscribe
- Consent record
- No misleading sports-streaming promises

**Acceptance criteria:**

- Consent and unsubscribe work.
- Privacy policy accurately describes the process.

---

# Required automated verification

The agent must add or document a validation command, for example:

```bash
npm run seo:check
```

The check must verify:

- Build succeeds
- Typecheck/lint succeeds if configured
- Every sitemap URL returns 200
- Sitemap XML is valid
- No duplicate sitemap URLs
- Every indexable page has one title
- Every indexable page has one meta description
- Every indexable page has one canonical
- Every indexable page has one H1
- No important page has `noindex`
- Canonical host is HTTPS and consistent
- No broken internal links
- JSON-LD parses
- OG images return 200
- Robots file is plain text
- Sitemap index is declared

If the project has no test framework, implement the check as a small Node script without adding unnecessary dependencies.

# Definition of done

The work is complete only when:

1. Analytics works in real time.
2. Search Console verification and post-deployment checks are documented.
3. Sitemap and robots output validate.
4. All indexable pages have unique, accurate metadata.
5. Homepage has a clear semantic H1.
6. Business, rights, payments, refunds and support information are transparent or unresolved claims are removed.
7. Priority commercial pages have clear CTAs and internal links.
8. Editorial pages have authorship, dates, sources and methodology.
9. JSON-LD is valid and matches visible content.
10. Mobile performance and accessibility have been measured.
11. The SEO validation command passes.
12. The agent provides a changed-file list, test output, remaining owner decisions and deployment checklist.

# Final agent response format

After implementation, report:

## Completed

- Task IDs completed
- Files changed
- Metadata/title changes
- Analytics events added
- Sitemap/robots changes
- Trust/legal changes
- Content/schema changes

## Verification

- Build result
- SEO check result
- Sitemap result
- Link-check result
- JSON-LD result
- Lighthouse/PageSpeed result

## Owner decisions required

- Analytics property ID
- Search Console verification
- Business identity
- Licensing/authorization evidence
- Payment/refund details
- Supported countries/devices
- Approval of any remaining commercial claims

## Not completed

List any blocked task with the exact reason. Never silently publish guessed business or legal information.