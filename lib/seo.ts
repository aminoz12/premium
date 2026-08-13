import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from './site';

export function pageMetadata({ title, description, path, type = 'website', languages }: { title: string; description: string; path: string; type?: 'website' | 'article'; languages?: Record<string,string> }): Metadata {
  const url = `${SITE_URL}${path}`;
  const socialTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const imageSlug = path === '/' ? 'home' : path.replace(/^\//, '').replaceAll('/', '--');
  const socialImage = `${SITE_URL}/images/og/${imageSlug}.webp`;
  return {
    title,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}), types: { 'application/rss+xml': `${SITE_URL}/feed.xml` } },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      locale: 'en_US',
      images: [{ url: socialImage, secureUrl: socialImage, width: 1200, height: 630, type: 'image/webp', alt: socialTitle }],
    },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [{ url: socialImage, alt: socialTitle }] },
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  };
}
