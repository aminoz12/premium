# SEO and GEO checklist

## Entity clarity

- Brand name is consistent as WATCHWORLDCUP.
- Canonical domain is consistently `watchworldcup.us`.
- Service purpose, prices and WhatsApp destination match visible pages.
- Organization, WebSite and Service schema match visible content.
- Non-affiliation and availability boundaries remain visible.

## Answer-engine readiness

- Important questions have concise answers under descriptive headings.
- Claims include dates, regions and limitations where relevant.
- External facts link to primary sources.
- Dataset claims match visible tables and downloadable files.
- `llms.txt`, sitemap, RSS, structured data and HTML agree.
- No hidden text or answer-engine-only claims exist.

## Geographic governance

- Use subdirectories, never GEO subdomains.
- Publish a region page only when it has unique verified content.
- Use a self-canonical on every region page.
- Keep hreflang reciprocal and include x-default.
- Do not auto-translate, spin location names or create doorway pages.
- Redirect unsupported legacy locale pages to the closest substantive guide.

## Release commands

```bash
npm run seo:inventory -- http://127.0.0.1:3000
npm run seo:files:check
npm run geo:check -- http://127.0.0.1:3000
npm run release:check
```

GEO visibility and answer-engine citations are not guaranteed.
