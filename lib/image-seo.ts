import { SITE_URL } from './site';

export interface ImageMetadataOptions {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  author?: string;
  license?: string;
}

export interface ImageSitemapEntry {
  loc: string;
  title?: string;
  caption?: string;
  geo_location?: string;
  license?: string;
}

/**
 * Constructs an absolute Open Graph image URL for a given route path.
 */
export function getOgImageUrl(routePath: string): string {
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const slug = normalizedPath === '/' ? 'home' : normalizedPath.replace(/^\//, '').replaceAll('/', '--');
  return `${SITE_URL}/images/og/${slug}.webp`;
}

/**
 * Builds schema.org ImageObject JSON-LD markup optimized for Google Images.
 */
export function getImageObjectSchema({
  path,
  alt,
  width = 1200,
  height = 630,
  caption,
  author = 'WATCHWORLDCUP',
  license = `${SITE_URL}/terms-of-service`,
}: ImageMetadataOptions) {
  const imageUrl = path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${imageUrl}#image`,
    url: imageUrl,
    contentUrl: imageUrl,
    width: `${width}px`,
    height: `${height}px`,
    caption: caption || alt,
    description: alt,
    author: {
      '@type': 'Organization',
      name: author,
      url: SITE_URL,
    },
    license,
    acquireLicensePage: `${SITE_URL}/editorial-policy`,
  };
}

/**
 * Generates Google Image Sitemap XML structure for a given URL and Image list.
 */
export function buildImageSitemapTags(images: ImageSitemapEntry[]): string {
  return images
    .map(
      (img) => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      ${img.title ? `<image:title>${escapeXml(img.title)}</image:title>` : ''}
      ${img.caption ? `<image:caption>${escapeXml(img.caption)}</image:caption>` : ''}
      ${img.geo_location ? `<image:geo_location>${escapeXml(img.geo_location)}</image:geo_location>` : ''}
      ${img.license ? `<image:license>${escapeXml(img.license)}</image:license>` : ''}
    </image:image>`
    )
    .join('');
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates high-priority link preload tags for LCP images in HTML head.
 */
export function getLcpImagePreloadHeader(imagePath: string): { rel: string; href: string; as: string; type: string } {
  const fullUrl = imagePath.startsWith('http') ? imagePath : `${SITE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  return {
    rel: 'preload',
    href: fullUrl,
    as: 'image',
    type: 'image/webp',
  };
}

/**
 * Validates whether an image alt string is descriptive and acceptable for accessibility and Image SEO.
 */
export function validateAltText(altText: string): { valid: boolean; reason?: string } {
  if (!altText || altText.trim().length === 0) {
    return { valid: false, reason: 'Alt text cannot be empty.' };
  }

  if (altText.length < 5) {
    return { valid: false, reason: 'Alt text is too short to be descriptive for Image Search.' };
  }

  const genericPlaceholders = ['image', 'photo', 'picture', 'logo', 'icon', 'graphic'];
  if (genericPlaceholders.includes(altText.trim().toLowerCase())) {
    return { valid: false, reason: 'Alt text cannot be a generic single-word placeholder.' };
  }

  return { valid: true };
}
