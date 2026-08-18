import { SITE_NAME, SITE_URL, UPDATED_ISO } from '@/lib/site';
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
  const items = guides.map((guide) => {
    const link = `${SITE_URL}/guides/${guide.slug}`;
    const pubDate = new Date(guide.datePublished).toUTCString();

    return `    <item>
      <title>${escapeXml(guide.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(guide.description)}</description>
    </item>`;
  });

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2000/rss/1.0/modules/atom/">
  <channel>
    <title>${escapeXml(SITE_NAME)} 2026 Sports Streaming &amp; Replay Feed</title>
    <link>${SITE_URL}</link>
    <description>Official RSS feed for FIFA World Cup 2026 replays, streaming guides, and hardware performance updates.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(UPDATED_ISO).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(rssContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
