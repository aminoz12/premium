import { SITE_URL } from '@/lib/site';
import { guides } from '@/lib/guides';

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
  const guideEntries = guides.map((guide) => {
    const path = `/guides/${guide.slug}`;
    const pageLoc = `${SITE_URL}${path}`;
    const imageLoc = `${SITE_URL}/images/og/guides--${guide.slug}.webp`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${guide.dateModified}</lastmod>
    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${escapeXml(guide.title)}</image:title>
      <image:caption>${escapeXml(guide.description)}</image:caption>
    </image:image>
  </url>`;
  });

  const researchEntries = [
    { path: '/research', title: 'Sports Streaming Research & Benchmark Methodology' },
    { path: '/research/streaming-benchmark-methodology', title: 'Reproducible Sports Streaming Latency Benchmark' },
    { path: '/research/world-cup-2026-replay-source-tracker', title: 'Authorized World Cup 2026 Replay Source Tracker' },
    { path: '/data', title: 'World Cup 2026 Data Catalog & Datasets' },
  ].map((item) => {
    const pageLoc = `${SITE_URL}${item.path}`;
    const slug = item.path.replace(/^\//, '').replaceAll('/', '--');
    const imageLoc = `${SITE_URL}/images/og/${slug}.webp`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
      <image:caption>${escapeXml(item.title)}</image:caption>
    </image:image>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${guideEntries.join('\n')}
${researchEntries.join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
