# Localized Image Search Ranking Strategy

This document details international image search rank tracking, region-specific visual intent, and geo-targeted alt text strategy for **WATCHWORLDCUP**.

## 1. Geo-Targeted Visual Intent

Users searching for match replay images or broadcast guides in different countries expect region-specific broadcaster references:
- **US Market (`en-US`)**: Alt text and Open Graph graphics highlight FOX Sports, Telemundo, and Peacock streaming setups.
- **UK Market (`en-GB`)**: Visual metadata targets BBC iPlayer and ITVX streaming guides.
- **Canada Market (`en-CA`)**: Visual metadata highlights TSN and RDS broadcast coverage.

## 2. Multi-Lingual Image Indexation

- For Spanish-language search queries in North America (e.g. `repeticiones Copa Mundial 2026`), regional metadata in `seo/geo/regional-image-localization.json` matches multi-lingual search queries without duplicating image URLs.
- Image Schema `ImageObject` includes multi-lingual captions for regional search engines.
