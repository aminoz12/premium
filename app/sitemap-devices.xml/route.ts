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
  const deviceRoutes = [
    {
      path: '/setup-guides',
      title: 'Smart TV, Fire TV, Apple TV & Mobile IPTV Setup Guides',
    },
    {
      path: '/guides/best-device-live-sports',
      title: 'Best Streaming Device for Live Sports: Fire TV vs Apple TV Benchmark',
    },
    {
      path: '/guides/4k-hdr-sports-setup',
      title: '4K HDR Sports Streaming Checklist: TV, Device, HDMI & Network',
    },
    {
      path: '/guides/internet-speed-4k-sports',
      title: 'Internet Speed for 4K Sports Streaming Calculator & Hardware Setup',
    },
    {
      path: '/guides/stop-sports-buffering',
      title: 'Device Diagnostic Guide to Stop Live Sports Buffering',
    },
  ];

  const urlEntries = deviceRoutes.map((item) => {
    const pageLoc = `${SITE_URL}${item.path}`;
    const slug = item.path.replace(/^\//, '').replaceAll('/', '--');
    const imageLoc = `${SITE_URL}/images/og/${slug}.webp`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${UPDATED_ISO}</lastmod>
    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
      <image:caption>${escapeXml(`${item.title} - Hardware & Device Guide`)}</image:caption>
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
