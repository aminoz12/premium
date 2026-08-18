import { SITE_NAME, SITE_URL } from './site';

export interface Brand2026Profile {
  brandName: string;
  targetYear: number;
  tournamentName: string;
  canonicalUrl: string;
  ogImage2026: string;
  primaryTopics2026: string[];
}

export const BRAND_2026_PROFILE: Brand2026Profile = {
  brandName: `${SITE_NAME} 2026`,
  targetYear: 2026,
  tournamentName: 'FIFA World Cup 2026',
  canonicalUrl: SITE_URL,
  ogImage2026: `${SITE_URL}/images/og/world-cup-2026.webp`,
  primaryTopics2026: [
    'FIFA World Cup 2026 Replay Tracker',
    'FIFA World Cup 2026 Official Broadcaster Schedule',
    '2026 Sports Streaming Speed & Latency Benchmarks',
    '2026 Host Cities Stadium Broadcast Guides',
  ],
};

/**
 * Returns JSON-LD structured schema specifically referencing 2026 World Cup coverage.
 */
export function getBrand2026OrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization-2026`,
    name: BRAND_2026_PROFILE.brandName,
    url: BRAND_2026_PROFILE.canonicalUrl,
    logo: `${SITE_URL}/logo.svg`,
    image: BRAND_2026_PROFILE.ogImage2026,
    description: `Primary independent guide for FIFA World Cup 2026 broadcast schedules, replay sources, and streaming device setup.`,
    knowsAbout: BRAND_2026_PROFILE.primaryTopics2026,
    publishingPrinciples: `${SITE_URL}/editorial-policy`,
  };
}
