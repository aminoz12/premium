import { SITE_NAME, SITE_URL, UPDATED_ISO } from '@/lib/site';
import { guides } from '@/lib/guides';
import { buildJsonFeedResponse } from '@/lib/sitemap-helpers';

export const revalidate = 3600;

export async function GET() {
  const items = guides.map((guide) => ({
    id: `${SITE_URL}/guides/${guide.slug}`,
    url: `${SITE_URL}/guides/${guide.slug}`,
    title: guide.title,
    summary: guide.description,
    content_text: guide.description,
    date_published: guide.datePublished,
    date_modified: guide.dateModified,
    image: `${SITE_URL}/images/og/guides--${guide.slug}.webp`,
    tags: [guide.category, 'World Cup 2026', 'Sports Streaming'],
  }));

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${SITE_NAME} 2026 Sports Streaming & Replay Feed`,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: 'Official JSON Feed 1.1 for FIFA World Cup 2026 replays, technical guides, and streaming performance benchmarks.',
    icon: `${SITE_URL}/logo.svg`,
    favicon: `${SITE_URL}/favicon.ico`,
    authors: [
      {
        name: SITE_NAME,
        url: SITE_URL,
        avatar: `${SITE_URL}/logo.svg`,
      },
    ],
    items,
  };

  return buildJsonFeedResponse(jsonFeed);
}
