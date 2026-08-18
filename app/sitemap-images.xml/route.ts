import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

interface ManifestItem {
  path: string;
  file: string;
  title: string;
  width: number;
  height: number;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  // Import manifest records dynamically
  const manifest: ManifestItem[] = (await import('../../public/images/og/manifest.json')).default;

  const urlEntries = manifest.map((item) => {
    const pageLoc = item.path === '/' ? SITE_URL : `${SITE_URL}${item.path}`;
    const imageLoc = `${SITE_URL}${item.file}`;
    const titleEscaped = escapeXml(item.title);
    const captionEscaped = escapeXml(`${item.title} - FIFA World Cup 2026 Guide`);

    return `  <url>
    <loc>${pageLoc}</loc>
    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${titleEscaped}</image:title>
      <image:caption>${captionEscaped}</image:caption>
      <image:license>${SITE_URL}/terms-of-service</image:license>
    </image:image>
  </url>`;
  });

  // Include primary hero fallback images
  const extraImages = [
    {
      page: SITE_URL,
      file: `${SITE_URL}/hero-fallback.webp`,
      title: 'WATCHWORLDCUP Hero Showcase',
      caption: 'Live TV and sports streaming technical setup showcase',
    },
    {
      page: `${SITE_URL}/world-cup-2026`,
      file: `${SITE_URL}/world-cup-fallback.webp`,
      title: 'FIFA World Cup 2026 Hub Stadium Banner',
      caption: 'FIFA World Cup 2026 match schedule and replay tracker header visual',
    },
    {
      page: SITE_URL,
      file: `${SITE_URL}/logo.svg`,
      title: 'WATCHWORLDCUP Official Vector Brand Logo',
      caption: 'WATCHWORLDCUP Official Emblem',
    },
  ];

  const extraEntries = extraImages.map(
    (img) => `  <url>
    <loc>${img.page}</loc>
    <image:image>
      <image:loc>${img.file}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
      <image:license>${SITE_URL}/terms-of-service</image:license>
    </image:image>
  </url>`
  );

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join('\n')}
${extraEntries.join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
