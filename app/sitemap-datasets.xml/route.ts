import { SITE_NAME, SITE_URL, UPDATED_ISO } from '@/lib/site';

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
  const datasetRoutes = [
    {
      path: '/data',
      title: `${SITE_NAME} FIFA World Cup 2026 Structured Dataset Index`,
      description: 'Downloadable JSON and CSV datasets covering 2026 World Cup replays, standings, and match data.',
    },
    {
      path: '/research/world-cup-2026-replay-source-tracker',
      title: 'Authorized World Cup 2026 Replay Source Rights Dataset',
      description: 'Verified broadcaster rights and official replay source dataset for World Cup 2026.',
    },
    {
      path: '/research/streaming-benchmark-methodology',
      title: 'Live Sports Streaming Performance & Latency Dataset',
      description: 'Reproducible streaming latency, bitrate, and CDN performance benchmarks.',
    },
    {
      path: '/world-cup-2026/final-standings',
      title: 'FIFA World Cup 2026 Final Standings 1-48 Dataset',
      description: 'Complete 1-48 final tournament standings dataset with win/loss records and points.',
    },
  ];

  const urlEntries = datasetRoutes.map((item) => {
    const pageLoc = `${SITE_URL}${item.path}`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${UPDATED_ISO}</lastmod>
    <image:image>
      <image:loc>${SITE_URL}/images/og/data.webp</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
      <image:caption>${escapeXml(item.description)}</image:caption>
    </image:image>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
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
