# Multi-Sitemap XML Architecture

This document defines the specialized multi-sitemap architecture for **WATCHWORLDCUP** to maximize organic search discovery across search engines, Google Images, Geo clusters, and Brand entity indexing.

## 1. Multi-Sitemap Overview

| Sitemap URL | Type | Purpose | Discovered Routes |
| --- | --- | --- | --- |
| `https://watchworldcup.us/sitemap-index.xml` | Master Sitemap Index | Central index linking to all specialized sitemaps | 9 sub-sitemaps |
| `https://watchworldcup.us/sitemap.xml` | Primary Sitemap | Main index of all 40 indexable routes | 40 |
| `https://watchworldcup.us/sitemap-images.xml` | Google Image Sitemap | Visual search optimization & WebP image metadata | 43 visual assets |
| `https://watchworldcup.us/sitemap-geo.xml` | Geo & Localization Sitemap | Hreflang cluster tags, regional market maps, and broadcaster guides | Regional routes |
| `https://watchworldcup.us/sitemap-brand.xml` | Brand & E-E-A-T Sitemap | Organization entity profile, editorial policy, corrections registry, and trust docs | Brand trust routes |
| `https://watchworldcup.us/sitemap-2026.xml` | FIFA World Cup 2026 Sitemap | 2026 tournament archive, match replays, final standings, awards, and host cities | 2026 tournament routes |
| `https://watchworldcup.us/sitemap-guides.xml` | Technical Guides Sitemap | 4K sports streaming guides, device setup, troubleshooting, and benchmark data | Guide & research routes |
| `https://watchworldcup.us/sitemap-news.xml` | Google News Sitemap | Google News indexation for live replay index updates | News & update routes |
| `https://watchworldcup.us/sitemap-video.xml` | Google Video Sitemap | Google Video search indexation for replay video clips and setup walkthroughs | Video replay routes |
| `https://watchworldcup.us/sitemap-devices.xml` | Streaming Hardware Sitemap | Device & platform compatibility (Fire TV, Apple TV, Smart TVs) | Hardware routes |
| `https://watchworldcup.us/sitemap-datasets.xml` | Google Dataset Sitemap | Downloadable CSV/JSON tournament data catalog for Google Dataset Search | Dataset routes |
| `https://watchworldcup.us/rss.xml` | RSS 2.0 Syndication | News syndication & instant RSS feed reader indexation | All articles |

## 2. Robots.txt Configuration

All specialized sitemaps are declared in `app/robots.ts` to allow search crawlers (Googlebot, Bingbot, DuckDuckGo) to discover them automatically:

```text
Sitemap: https://watchworldcup.us/sitemap-index.xml
Sitemap: https://watchworldcup.us/sitemap.xml
Sitemap: https://watchworldcup.us/sitemap-images.xml
Sitemap: https://watchworldcup.us/sitemap-geo.xml
Sitemap: https://watchworldcup.us/sitemap-brand.xml
Sitemap: https://watchworldcup.us/sitemap-2026.xml
Sitemap: https://watchworldcup.us/sitemap-guides.xml
Sitemap: https://watchworldcup.us/sitemap-news.xml
Sitemap: https://watchworldcup.us/sitemap-video.xml
Sitemap: https://watchworldcup.us/sitemap-devices.xml
Sitemap: https://watchworldcup.us/sitemap-datasets.xml
Sitemap: https://watchworldcup.us/rss.xml
```
