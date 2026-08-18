import { SITE_URL, UPDATED_ISO } from '@/lib/site';
import { escapeXml, buildSitemapXmlResponse } from '@/lib/sitemap-helpers';

export const revalidate = 3600;

export async function GET() {
  const routes: string[] = (await import('../../seo/indexable-routes.json')).default.routes.map((r: { path: string }) => r.path);

  const urlEntries = routes.map((path) => {
    const loc = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${UPDATED_ISO}</lastmod>
    <mobile:mobile/>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${urlEntries.join('\n')}
</urlset>`;

  return buildSitemapXmlResponse(xmlContent);
}
