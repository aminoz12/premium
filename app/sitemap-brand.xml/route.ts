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
  const brandPages = [
    { path: '/about', title: `${SITE_NAME} About & Organization Entity Profile` },
    { path: '/editorial-policy', title: `${SITE_NAME} Editorial & Evidence Verification Policy` },
    { path: '/corrections', title: `${SITE_NAME} Public Corrections & Material Changes Registry` },
    { path: '/contact', title: `${SITE_NAME} Contact & Direct Support Channels` },
    { path: '/support', title: `${SITE_NAME} Diagnostic Support Desk` },
    { path: '/privacy-policy', title: `${SITE_NAME} Privacy Policy` },
    { path: '/terms-of-service', title: `${SITE_NAME} Terms of Service` },
  ];

  const urlEntries = brandPages.map((item) => {
    const pageLoc = `${SITE_URL}${item.path}`;
    const slug = item.path.replace(/^\//, '').replaceAll('/', '--');
    const imageLoc = `${SITE_URL}/images/og/${slug}.webp`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <lastmod>${UPDATED_ISO}</lastmod>
    <image:image>
      <image:loc>${imageLoc}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
      <image:caption>${escapeXml(`Official ${SITE_NAME} Brand & Entity Document`)}</image:caption>
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
