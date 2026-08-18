import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/cart', '/client-area'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/checkout', '/cart', '/client-area'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/checkout', '/cart', '/client-area'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/checkout', '/cart', '/client-area'],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap-index.xml`,
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
      `${SITE_URL}/sitemap-mobile.xml`,
    ],
  };
}
