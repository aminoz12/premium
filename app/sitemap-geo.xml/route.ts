import { SITE_URL, UPDATED_ISO } from '@/lib/site';
import { PRIMARY_GEO_MARKETS, getReplayClusterHreflang } from '@/lib/geo';

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const geoCluster = getReplayClusterHreflang();
  const hreflangTags = Object.entries(geoCluster)
    .map(([lang, url]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`)
    .join('\n');

  const geoRoutes = [
    {
      path: '/world-cup-2026/replays/usa',
      market: PRIMARY_GEO_MARKETS.US,
      lastmod: UPDATED_ISO,
    },
    {
      path: '/world-cup-2026/replays',
      market: PRIMARY_GEO_MARKETS.CA,
      lastmod: UPDATED_ISO,
    },
    {
      path: '/world-cup-2026/host-cities',
      market: PRIMARY_GEO_MARKETS.US,
      lastmod: UPDATED_ISO,
    },
    {
      path: '/world-cup-2026/teams',
      market: PRIMARY_GEO_MARKETS.MX,
      lastmod: UPDATED_ISO,
    },
  ];

  const urlEntries = geoRoutes.map((item) => {
    const pageLoc = `${SITE_URL}${item.path}`;
    const broadcasters = item.market ? item.market.officialBroadcasters.join(', ') : 'Official FIFA Rights Holder';
    return `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${item.lastmod}</lastmod>
${hreflangTags}
    <image:image>
      <image:loc>${SITE_URL}/images/og/world-cup-2026--replays--usa.webp</image:loc>
      <image:title>${escapeXml(`FIFA World Cup 2026 ${item.market ? item.market.countryName : 'Global'} Broadcast Replays`)}</image:title>
      <image:caption>${escapeXml(`Official Broadcasters: ${broadcasters}`)}</image:caption>
    </image:image>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
