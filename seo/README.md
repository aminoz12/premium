# Production SEO package

This folder is the deployment-facing SEO control set for WATCHWORLDCUP.

## Files

- `indexable-routes.json` — generated list of all sitemap URLs, canonicals, titles and schema types.
- `metadata-inventory.csv` — generated route-by-route status, title, description, canonical, robots, H1, word count, social image and schema inventory.
- `runtime-snapshot.json` — generated machine-readable validation summary.
- `redirect-map.json` — one-hop permanent migration rules.
- `status-policy.json` — 200, 308, 404, 410, utility, parameter and crawler-control decisions.
- `structured-data-inventory.json` — allowed, visible schema entities and forbidden unsupported types.
- `deployment-checklist.md` — pre-launch and cutover checks.
- `post-launch-monitoring.md` — eight-week production monitoring plan.
- `search-console-submission.md` — sitemap and inspection procedure.
- `geo/` — entity, answer-engine, citation, geographic architecture, hreflang and GEO validation package.
- `lighthouse-summary.json` — concise measured score and metric summary.
- `quality-summary.json` — build, route, quality-gate, responsive and score release summary.
- `lighthouse-home-production.json` — complete simulated-mobile Lighthouse evidence.
- `lighthouse-home-desktop-production.json` — complete desktop Lighthouse evidence.

## Generation

With a production server running locally:

```bash
npm run seo:inventory -- http://127.0.0.1:3000
```

The generator fails unless all 40 sitemap routes return 200, use explicit index/follow, contain one H1, use exact self-canonicals, have unique metadata and social images, and expose the canonical sitemap in robots.txt.

## Validation

```bash
npm run seo:files:check
npm run geo:check -- http://127.0.0.1:3000
npm run seo:check -- http://127.0.0.1:3000
npm run quality:check -- http://127.0.0.1:3000
npm run policy:check -- http://127.0.0.1:3000
```

Eligibility does not guarantee crawling, indexing, ranking, traffic or recovery.
