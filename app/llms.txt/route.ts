import { SITE_URL } from '@/lib/site';

const text=`# WATCHWORLDCUP

> WATCHWORLDCUP is an IPTV and M3U subscription service with separate, source-linked World Cup archives, streaming guides, research and open datasets.

## Verified commercial information

- 3 months: $25
- 6 months: $38
- 1 year: $62
- Ordering and public contact: WhatsApp +212 723 279 328
- Current content, language, quality, territory, device and app compatibility must be confirmed before payment.

## Primary pages

- [Home](${SITE_URL})
- [Pricing](${SITE_URL}/pricing)
- [Order preparation](${SITE_URL}/order)
- [Live TV](${SITE_URL}/live-tv)
- [Sports](${SITE_URL}/sports)
- [Movies](${SITE_URL}/movies)
- [Series](${SITE_URL}/series)
- [Setup guides](${SITE_URL}/setup-guides)
- [World Cup 2026 archive](${SITE_URL}/world-cup-2026)
- [World Cup history](${SITE_URL}/world-cup-history)
- [Research](${SITE_URL}/research)
- [Open data](${SITE_URL}/data)
- [About](${SITE_URL}/about)
- [Editorial policy](${SITE_URL}/editorial-policy)
- [Corrections](${SITE_URL}/corrections)
- [Privacy](${SITE_URL}/privacy-policy)
- [Terms](${SITE_URL}/terms-of-service)

## Machine discovery

- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS feed](${SITE_URL}/feed.xml)
- [Security contact](${SITE_URL}/.well-known/security.txt)

## Claim boundaries

WATCHWORLDCUP does not claim FIFA, league, broadcaster, studio or streaming-platform affiliation. Named channels and platforms are request or source references only unless current inclusion is confirmed directly. The public website does not claim catalog totals, universal quality, uptime, payment providers or guaranteed content availability.
`;

export function GET(){return new Response(text,{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=3600'}})}
