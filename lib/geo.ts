import { SITE_URL } from './site';

export interface GeoMarket {
  countryCode: string;
  countryName: string;
  language: string;
  locale: string;
  canonicalPath: string;
  officialBroadcasters: string[];
}

export const PRIMARY_GEO_MARKETS: Record<string, GeoMarket> = {
  US: {
    countryCode: 'US',
    countryName: 'United States',
    language: 'en',
    locale: 'en-US',
    canonicalPath: '/world-cup-2026/replays/usa',
    officialBroadcasters: ['FOX Sports', 'Telemundo', 'Peacock'],
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    language: 'en',
    locale: 'en-CA',
    canonicalPath: '/world-cup-2026/replays',
    officialBroadcasters: ['TSN', 'RDS'],
  },
  MX: {
    countryCode: 'MX',
    countryName: 'Mexico',
    language: 'es',
    locale: 'es-MX',
    canonicalPath: '/world-cup-2026/replays',
    officialBroadcasters: ['Televisa', 'TV Azteca', 'TUDN'],
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    language: 'en',
    locale: 'en-GB',
    canonicalPath: '/world-cup-2026/replays',
    officialBroadcasters: ['BBC', 'ITV'],
  },
};

/**
 * Returns reciprocal Hreflang header tags for World Cup replay cluster pages.
 */
export function getReplayClusterHreflang(): Record<string, string> {
  return {
    'x-default': `${SITE_URL}/world-cup-2026/replays`,
    'en-US': `${SITE_URL}/world-cup-2026/replays/usa`,
  };
}

/**
 * Helper to fetch official broadcaster list for a country code.
 */
export function getBroadcastersForCountry(code: string): string[] {
  const market = PRIMARY_GEO_MARKETS[code.toUpperCase()];
  return market ? market.officialBroadcasters : ['Official Local FIFA Rights Holder'];
}
