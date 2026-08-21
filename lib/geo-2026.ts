import { SITE_URL } from './site';

export interface HostCity2026 {
  name: string;
  stadium: string;
  country: 'USA' | 'Canada' | 'Mexico';
  keyMatch: string;
}

export const HOST_CITIES_2026: HostCity2026[] = [
  { name: 'New York / New Jersey', stadium: 'MetLife Stadium', country: 'USA', keyMatch: 'FIFA World Cup 2026 Final' },
  { name: 'Los Angeles', stadium: 'SoFi Stadium', country: 'USA', keyMatch: 'USMNT Tournament Opener' },
  { name: 'Mexico City', stadium: 'Estadio Azteca', country: 'Mexico', keyMatch: 'Opening Match of FIFA World Cup 2026' },
  { name: 'Toronto', stadium: 'BMO Field', country: 'Canada', keyMatch: 'CanMNT Opener' },
  { name: 'Dallas', stadium: 'AT&T Stadium', country: 'USA', keyMatch: '2026 Semi-Final Match' },
  { name: 'Miami', stadium: 'Hard Rock Stadium', country: 'USA', keyMatch: '2026 Bronze Final' },
];

/**
 * Helper to fetch 2026 host city data by name.
 */
export function getHostCity2026(cityName: string): HostCity2026 | undefined {
  return HOST_CITIES_2026.find((city) => city.name.toLowerCase().includes(cityName.toLowerCase()));
}

/**
 * Returns JSON-LD Event schema for a 2026 World Cup host match venue.
 */
export function get2026HostCityVenueSchema(city: HostCity2026) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${city.keyMatch} - ${city.name}`,
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    location: {
      '@type': 'Place',
      name: city.stadium,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.name,
        addressCountry: city.country,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: `${SITE_URL}/world-cup-2026/host-cities`,
  };
}
