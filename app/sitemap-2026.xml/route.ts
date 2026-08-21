import { SITE_URL, UPDATED_ISO } from '@/lib/site';

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
  const routes2026 = [
    { path: '/world-cup-2026', title: 'FIFA World Cup 2026 Hub' },
    { path: '/world-cup-2026/final', title: 'FIFA World Cup 2026 Final Match' },
    { path: '/world-cup-2026/final-standings', title: 'FIFA World Cup 2026 Final Standings 1-48' },
    { path: '/world-cup-2026/awards', title: 'FIFA World Cup 2026 Awards' },
    { path: '/world-cup-2026/replays', title: 'FIFA World Cup 2026 Replay Tracker' },
    { path: '/world-cup-2026/replays/usa', title: 'USA FIFA World Cup 2026 Replays' },
    { path: '/world-cup-2026/teams', title: 'FIFA World Cup 2026 Teams & Groups' },
    { path: '/world-cup-2026/host-cities', title: 'FIFA World Cup 2026 Host Cities & Venues' },
    { path: '/world-cup-history', title: 'FIFA World Cup History & Archives' },
    { path: '/world-cup-history/winners', title: 'FIFA World Cup Champions 1930-2026' },
    { path: '/world-cup-history/records', title: 'FIFA World Cup Tournament Records' },
  ];

  const urlEntries = routes2026.map((item) => {
    const pageLoc = `${SITE_URL}${item.path}`;
    const slug = item.path.replace(/^\//, '').replaceAll('/', '--');
    const imageLoc = `${SITE_URL}/images/og/${slug}.webp`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${UPDATED_ISO}</lastmod>
    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
      <image:caption>${escapeXml(`${item.title} - Official WATCHWORLDCUP 2026 Hub`)}</image:caption>
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
