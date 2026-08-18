import { SITE_URL, UPDATED_ISO } from '@/lib/site';

export const revalidate = 3600;

export async function GET() {
  const subSitemaps = [
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/sitemap-images.xml`,
    `${SITE_URL}/sitemap-geo.xml`,
    `${SITE_URL}/sitemap-brand.xml`,
    `${SITE_URL}/sitemap-2026.xml`,
    `${SITE_URL}/sitemap-guides.xml`,
    `${SITE_URL}/sitemap-news.xml`,
    `${SITE_URL}/sitemap-video.xml`,
    `${SITE_URL}/sitemap-devices.xml`,
    `${SITE_URL}/sitemap-datasets.xml`,
  ];

  const sitemapEntries = subSitemaps
    .map(
      (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${UPDATED_ISO}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
