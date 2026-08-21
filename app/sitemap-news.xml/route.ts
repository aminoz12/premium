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
  const newsItems = [
    {
      path: '/updates',
      title: 'WATCHWORLDCUP 2026 Platform Updates & Replay Index Schedule',
      publicationDate: UPDATED_ISO,
      language: 'en',
    },
    {
      path: '/world-cup-2026/replays',
      title: 'Official FIFA World Cup 2026 Broadcaster Replay Index Published',
      publicationDate: UPDATED_ISO,
      language: 'en',
    },
    {
      path: '/world-cup-2026/replays/usa',
      title: 'United States FIFA World Cup 2026 Stream & Replay Rights Overview',
      publicationDate: UPDATED_ISO,
      language: 'en',
    },
  ];

  const newsEntries = newsItems.map((item) => {
    const pageLoc = `${SITE_URL}${item.path}`;

    return `  <url>
    <loc>${pageLoc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>${item.language}</news:language>
      </news:publication>
      <news:publication_date>${item.publicationDate}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries.join('\n')}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
