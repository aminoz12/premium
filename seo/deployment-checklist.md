# SEO deployment checklist

## Before deployment

- Run `npm ci`.
- Run `npm run release:check`.
- Confirm the clean production build contains 50 application outputs plus the query-scoped proxy.
- Confirm sitemap contains exactly 40 canonical URLs.
- Confirm every sitemap page returns 200, one H1, index/follow and an exact self-canonical.
- Confirm every route has unique title, description and 1200×630 social image.
- Confirm Product, Offer, AggregateRating and Review schema are absent.
- Confirm `/checkout` returns 410.
- Confirm cart, client area, internal search, refund-policy hold and unknown paths return 404.
- Confirm legacy aliases redirect once with 308.
- Confirm robots blocks only required utility routes and advertises the canonical sitemap.
- Confirm contact and commercial links use recipient `212723279328`.
- Confirm source contains no environment-variable dependency, obsolete domain, emoji or external icon package.

## Cutover

- Export the current DNS configuration.
- Save the current Netlify deploy identifier.
- Deploy the clean source package using `npm run build` and `.next` output.
- Keep Node 20 through `.nvmrc`.
- Do not add a universal SPA rewrite.
- Attach `watchworldcup.us` and verify TLS.
- Run `npm run deployment:smoke -- https://watchworldcup.us` before sitemap submission.

## After cutover

- Run all remote SEO, quality, CTA, image, migration and policy gates.
- Verify homepage HTML is the rebuild, not the legacy SPA shell.
- Submit only `https://watchworldcup.us/sitemap.xml`.
- Remove legacy sitemap children.
- Inspect representative commercial, guide, archive, research and trust URLs.
- Start the eight-week monitoring record.
