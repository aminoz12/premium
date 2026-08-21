export function createSoftwareApplicationSchema(
  name: string,
  description: string,
  category: string,
  keywords: string[],
  url: string,
  datePublished?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description,
    url,
    keywords: keywords.join(', '),
    author: {
      '@type': 'Organization',
      name: 'TheFreeAITools.com',
    },
    browserRequirements: 'Requires JavaScript. Compatible with all modern browsers.',
    softwareVersion: '1.0',
    datePublished: datePublished || new Date().toISOString(),
    category,
  };
}