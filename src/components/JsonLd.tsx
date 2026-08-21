'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const id = 'jsonld-' + Math.random().toString(36).slice(2, 9);
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [data]);

  return null;
}

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