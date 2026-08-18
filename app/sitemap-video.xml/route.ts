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
  const videoItems = [
    {
      pagePath: '/world-cup-2026/replays',
      thumbnailLoc: `${SITE_URL}/images/og/world-cup-2026--replays.webp`,
      title: 'FIFA World Cup 2026 Full Match Replays Guide',
      description: 'How to watch complete 2026 World Cup match replays, highlights, and broadcast streams.',
      contentLoc: `${SITE_URL}/world-cup-2026/replays`,
      publicationDate: UPDATED_ISO,
    },
    {
      pagePath: '/world-cup-2026/replays/usa',
      thumbnailLoc: `${SITE_URL}/images/og/world-cup-2026--replays--usa.webp`,
      title: 'USA FIFA World Cup 2026 Broadcaster Replays (FOX, Telemundo)',
      description: 'Complete guide for US viewers to stream World Cup 2026 replays on demand.',
      contentLoc: `${SITE_URL}/world-cup-2026/replays/usa`,
      publicationDate: UPDATED_ISO,
    },
    {
      pagePath: '/guides/4k-hdr-sports-setup',
      thumbnailLoc: `${SITE_URL}/images/og/guides--4k-hdr-sports-setup.webp`,
      title: '4K HDR Sports Streaming Setup Walkthrough',
      description: 'Technical walkthrough for configuring Smart TVs, Fire TV, and Apple TV for 4K HDR live sports.',
      contentLoc: `${SITE_URL}/guides/4k-hdr-sports-setup`,
      publicationDate: UPDATED_ISO,
    },
  ];

  const videoEntries = videoItems.map((item) => {
    const pageLoc = `${SITE_URL}${item.pagePath}`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <video:video>
      <video:thumbnail_loc>${item.thumbnailLoc}</video:thumbnail_loc>
      <video:title>${escapeXml(item.title)}</video:title>
      <video:description>${escapeXml(item.description)}</video:description>
      <video:content_loc>${item.contentLoc}</video:content_loc>
      <video:publication_date>${item.publicationDate}</video:publication_date>
      <video:uploader info="${SITE_URL}/about">${escapeXml(SITE_NAME)}</video:uploader>
    </video:video>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoEntries.join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
