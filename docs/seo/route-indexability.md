# Route indexability policy

The sitemap is the implementation-level registry for canonical public routes. All listed routes are indexable only when their visible content remains accurate, valuable and available at HTTP 200.

| Route class | Routes | Intent | Metadata/schema | Owner/evidence |
| --- | --- | --- | --- | --- |
| Public commercial | `/`, `/live-tv`, `/sports`, `/movies`, `/series`, `/pricing`, `/order`, `/setup-guides`, `/support` | Plan information, setup and support | `pageMetadata`; Service/FAQ/Breadcrumb only where visibly applicable | Commercial owner; current terms and availability evidence |
| Public editorial | `/guides/*`, `/research/*`, `/data`, `/updates` | Answer a technical, accessibility, legal or research question | `pageMetadata`; Article/Dataset/Breadcrumb where applicable | Editorial team; primary sources, dates and methodology |
| Tournament/archive | `/world-cup-2026/*`, `/world-cup-history/*` | Source-linked tournament facts and archives | `pageMetadata`; SportsEvent/Dataset/Breadcrumb where applicable | Editorial team; official tournament sources |
| Legal/trust | `/about`, `/contact`, `/editorial-policy`, `/corrections`, `/privacy-policy`, `/terms-of-service` | Explain accountability, contact and policies | `pageMetadata`; Breadcrumb where visible | Business owner; current policy text |
| Private/transactional/utility | `/checkout`, `/cart`, `/client-area`, `/api/*`, `/search` | Not a public search landing page | Excluded from sitemap; removal, authentication or status response | Engineering/operations |

The canonical for each public route is `https://watchworldcup.us` plus the route path with no trailing slash. Query strings are not canonical URLs. Any route that becomes unsupported, thin, duplicate, private or a redirect must be removed from the sitemap and reassessed before release.
