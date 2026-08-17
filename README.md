# WATCHWORLDCUP SEO Recovery Rebuild

A separate Next.js 16 SSG/SSR rebuild created from the forensic audit. The earlier `/home/user/premium-iptv` project remains unchanged.

## Positioning

WATCHWORLDCUP is implemented as an IPTV / M3U subscription service with three owner-provided plan prices and WhatsApp ordering. Live TV, sports, movies and series pages use neutral categories and pre-purchase verification because no real catalog feed is connected. World Cup archives, research and technical guides remain as separate secondary resources.

## Run

```bash
npm install
npm run dev
npm run lint
npm run build
npm run seo:check
npm run quality:check
npm run migration:check
npm run links:check
npm run images:check
npm run data:check
npm run cta:check
```

Use `npm run images:generate` against the local production server after adding or renaming an indexable route, then rebuild before running `images:check`. Run `npm run data:generate` whenever a canonical dataset CSV changes, then rebuild before `data:check`.

The crawl, status, and image checks expect a production server on `http://127.0.0.1:3000` by default. Override with `SEO_BASE_URL`. The external-source monitor uses the public network and should run on a schedule rather than blocking every build.

## Phase 2 authority assets

- Legal soccer-without-cable guide with FCC and platform sources.
- Streaming-latency explainer using Apple HLS and AWS documentation.
- Sports accessibility checklist using FCC and WCAG sources.
- Open research hub and reproducible benchmark methodology.
- Downloadable CSV measurement template.
- RSS feed at `/feed.xml`.
- Security contact at `/.well-known/security.txt`.
- Content-Security-Policy and hardened response headers.

## Phase 3 evidence and quality assets

- Replay-source tracker at `/research/world-cup-2026-replay-source-tracker`.
- Open CSV at `/downloads/world-cup-2026-replay-sources.csv` under CC BY 4.0.
- Dataset JSON-LD aligned with the visible table and download.
- Public update log at `/updates`.
- Automated rendered-content, uniqueness, schema, internal-inlink, migration, and external-source checks.
- Completed-tournament archive updated with an official FIFA final-standings source.

## Phase 4 completed-tournament entities

- Source-backed 2026 final archive with completed-event schema.
- Official award winners and Golden Boot top-ten table.
- All 48 final tournament standings with tied placement preserved.
- Downloadable final-standings CSV and visible-content-aligned Dataset schema.
- One-hop recovery redirect for the former World Cup final blog URL.

## Phase 5 metadata and image system

- Unique 1200×630 Open Graph and Twitter image for every indexable URL.
- Fourteen first-party generated editorial/commercial backgrounds and 40 route-specific cards across the current sitemap.
- Image-aware sitemap entries and route-specific Article JSON-LD images.
- Reproducible `images:generate` workflow and automated `images:check` gate.
- Public disclosure that generated visuals are illustrative, not event evidence.

## Phase 6 evergreen history authority

- Source-backed World Cup history hub spanning 1930–2026.
- Complete 23-edition winners and final-results table.
- Open historical CSV and Dataset JSON-LD.
- Explicit handling for the 1950 final round and West Germany/Germany normalization.
- No thin edition-by-edition route generation.

## Phase 7 open data and provenance

- Crawlable `/data` catalog with four visible Dataset references and 88 total records.
- CSV and JSON distributions with exact record parity.
- Field dictionaries, versions, licenses, provenance, and source pages.
- SHA-256 integrity manifest covering datasets and the benchmark template.
- Reproducible `data:generate` and automated `data:check` workflows.

## Phase 8 WhatsApp conversion implementation

- Bottom-right icon, disclosed footer panel, and exact supplied URL implemented as reusable components.
- Local data-layer and custom-event conversion taxonomy by placement and path.
- Honest ROI framework that requires CRM, revenue, refund, and cost data.
- Phase 11 enables the limited owner-authorized WhatsApp order flow while keeping unsupported claims gated.

## Phase 9 World Cup records

- Search-focused records page derived from the 23-edition winners source table.
- Thirteen-team title, runner-up, and final-appearance dataset.
- Host champion, retained-title, and deciding-method analysis.
- CSV and JSON distributions with Dataset JSON-LD.
- Data catalog expanded to four datasets and 88 records.

## Phase 10 commercial verification gate

- Preserved as the decision and safeguard record before the operator authorized the limited public pivot.
- Automated checks still reject unsupported catalog counts, stability, market-leadership, Product, Offer, payment, and external-domain claims.

## Phase 11 public IPTV/M3U architecture

- Commercial homepage and navigation centered on IPTV/M3U subscriptions.
- Separate Live TV, Sports, Movies, Series, Pricing and Setup pages.
- Three owner-provided plan prices and site-wide WhatsApp ordering.
- Original category imagery with no real title, channel or platform claims.
- World Cup archives and research retained as separate secondary resources.
- `COMMERCIAL-LAUNCH-REQUIREMENTS.md` now governs claim, catalog, checkout and legal expansion.

## Phase 12 guided WhatsApp ordering

- Branded generic and plan-specific WhatsApp messages.
- Private-by-design `/order` wizard with no site-side form submission or storage.
- Optional country, device and app details sent only after the user activates WhatsApp.
- `order_intent` event stores plan and completion booleans, not entered text values.
- No checkout, payment-provider or Product/Offer schema claims.

## Phase 13 premium streaming UI refinement

- Tokenized dark streaming design system with restrained glass and ambient lighting.
- Premium pill navigation and accessible raw-SVG mobile menu.
- Refined hero hierarchy, CTA styles, category cards and responsive spacing.
- Reusable premium pricing cards with mathematical monthly equivalents.
- Enhanced guided-order selection, inputs and WhatsApp continuation UI.
- Lightweight CSS motion, touch-device safeguards and reduced-motion support.
- No route, price, event, metadata, dataset, redirect or ordering behavior changed.

## Phase 15 release candidate

- Netlify/OpenNext build configuration in `netlify.toml`, pinned to Node 20 and the `.next` publish output.
- Canonical origin, WhatsApp recipient, prices, CTA state and indexing policy are fixed in source; the production application does not use `.env` or runtime environment variables.
- All 40 public sitemap pages explicitly render `index, follow`; the application emits no indexing-exclusion meta tag or response-header override.
- Unverified placeholder email mailboxes were removed; contact, corrections, and security.txt use the fixed WhatsApp destination or HTTPS contact page.
- Reproducible `npm run release:check` technical gate and `npm run deployment:smoke -- https://DEPLOYMENT-ORIGIN` verifier.
- Cutover procedure, rollback plan, owner-controlled blockers, and checks recorded in `NETLIFY-DEPLOYMENT-RUNBOOK.md`.

## Phase 16 cinematic red visual system

- Deep-black and neutral-charcoal canvas with WATCHWORLDCUP crimson accents, white text and subtle gray surfaces.
- Red CTA, focus, selection, glow, navigation and social-card system with no legacy cyan/blue UI tokens.
- Original WATCHWORLDCUP structure, typography, imagery and mark retained; no third-party streaming brand UI copied.

## Phase 17 raw SVG icon system

- First-party TV, sports, film, series, device, archive, shield, list, message, download, database, clock, globe, check, alert and arrow SVGs.
- Unicode emoji and decorative arrow/check glyphs removed from the interface.
- `npm run icons:check` rejects emoji and external icon-library imports and is part of the release gate.

## Phase 18 collaboration and channel requests

- Responsive homepage banner for current channel/platform checks and editorial, data or business collaboration.
- beIN SPORTS, Disney, Netflix and “15+ more requests welcome” shown only as request examples, with explicit no-inclusion and no-affiliation disclosure.
- Fixed WhatsApp availability and collaboration messages, channel-stack and handshake SVGs, and no third-party logos.

## Production SEO package

- Complete `seo/` directory with generated 40-route metadata inventory, canonicals, schema types, redirect map, status policy, Search Console procedure, monitoring plan and SEO/GEO package.
- `npm run seo:inventory -- ORIGIN` regenerates the route-level SEO evidence from a running production build.
- `npm run seo:files:check` validates every required SEO deliverable and blocks incomplete packages.
- Full mobile and desktop Lighthouse evidence plus machine-readable quality summary.
- Public `llms.txt`, entity profile, answer-engine content map, citation policy, anti-doorway geographic policy and reciprocal x-default/en-US hreflang cluster.

## Phase 21 WebP asset migration

- Converted all 107 project raster assets to compressed WebP and removed JPG, JPEG and PNG originals.
- Updated application, metadata, structured data, sitemap, social cards, generator, manifests, documentation and SEO inventories to `.webp`.
- Added `npm run webp:convert` for future source assets and `npm run webp:check`; the release gate rejects any non-WebP raster, stale image reference or non-WebP Next Image output format.
- Preserved SVG logos and raw inline SVG icons as vector assets.
- Reduced total project raster bytes by approximately 71.6%.

## Phase 22 performance hardening

- Server-rendered homepage Header and Footer outside the client interaction boundary.
- One passive delegated card-glow listener instead of one listener per card.
- Compact non-blocking loader with the required count, hold and fade timing preserved.
- WebP-only optimized image output, approved quality 55 for below-fold homepage imagery and CDN-friendly cache headers.
- Measured desktop Lighthouse 100/100/100/100; final isolated mobile run 97/100/100/100 with CLS 0.

## Production requirements

1. Supply and publish the verified legal operator identity, jurisdiction, registration details and address where applicable.
2. Have counsel review About, Privacy, Terms, trademark usage, refund/cancellation terms, and jurisdiction-specific obligations.
3. Verify every external replay link and material claim before deployment.
4. Complete `COMMERCIAL-LAUNCH-REQUIREMENTS.md` before adding real catalog records, inventory totals, payment processors, checkout, stronger compatibility/quality claims, or expanded rights claims.
5. Export Search Console data before deciding whether any old match/team URL deserves a unique archive page.
6. Deploy the redirect/410 map and submit only the new `/sitemap.xml`.
