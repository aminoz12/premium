import { SITE_NAME, SITE_URL } from './site';

export interface BrandEntity {
  name: string;
  legalName: string;
  canonicalUrl: string;
  logo: string;
  description: string;
  foundingYear: number;
  contactWhatsApp: string;
  knowsAbout: string[];
}

export const BRAND_ENTITY: BrandEntity = {
  name: SITE_NAME,
  legalName: `${SITE_NAME} Digital Media`,
  canonicalUrl: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: 'Independent technical guide to FIFA World Cup 2026 broadcast schedules, replay sources, streaming devices, and setup configurations.',
  foundingYear: 2026,
  contactWhatsApp: '+212723279328',
  knowsAbout: [
    'FIFA World Cup 2026',
    'Sports Streaming Technical Setup',
    '4K HDR Live Broadcast Infrastructure',
    'Official Replay Source Verification',
    'Streaming Speed & Latency Benchmarks',
  ],
};

/**
 * Returns JSON-LD Organization schema for brand entity establishment.
 */
export function getBrandOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BRAND_ENTITY.name,
    legalName: BRAND_ENTITY.legalName,
    url: BRAND_ENTITY.canonicalUrl,
    logo: {
      '@type': 'ImageObject',
      url: BRAND_ENTITY.logo,
      caption: `${BRAND_ENTITY.name} Logo`,
    },
    description: BRAND_ENTITY.description,
    foundingDate: `${BRAND_ENTITY.foundingYear}-01-01`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BRAND_ENTITY.contactWhatsApp,
        contactType: 'customer support',
        availableLanguage: ['English', 'Spanish'],
      },
    ],
    knowsAbout: BRAND_ENTITY.knowsAbout,
    publishingPrinciples: `${SITE_URL}/editorial-policy`,
    correctionsPolicy: `${SITE_URL}/corrections`,
  };
}

/**
 * Validates whether a given claim text contains forbidden exaggerated commercial claims.
 */
export function validateBrandClaim(claimText: string): { valid: boolean; reason?: string } {
  const forbiddenPatterns = [
    /35,000/i,
    /147,000/i,
    /100%\s*buffer-free/i,
    /#1\s*worldwide/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(claimText)) {
      return { valid: false, reason: `Contains forbidden exaggerated claim matching pattern ${pattern}` };
    }
  }

  return { valid: true };
}
