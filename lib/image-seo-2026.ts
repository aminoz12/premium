import { SITE_URL } from './site';

export interface Image2026Metadata {
  path: string;
  altText2026: string;
  width?: number;
  height?: number;
  caption2026?: string;
}

/**
 * Returns JSON-LD ImageObject schema tailored for 2026 World Cup visual search indexation.
 */
export function get2026ImageObjectSchema({ path, altText2026, width = 1200, height = 630, caption2026 }: Image2026Metadata) {
  const imageUrl = path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${imageUrl}#image-2026`,
    url: imageUrl,
    contentUrl: imageUrl,
    width: `${width}px`,
    height: `${height}px`,
    caption: caption2026 || altText2026,
    description: altText2026,
    author: {
      '@type': 'Organization',
      name: 'WATCHWORLDCUP 2026',
      url: SITE_URL,
    },
    license: `${SITE_URL}/terms-of-service`,
    acquireLicensePage: `${SITE_URL}/editorial-policy`,
  };
}
