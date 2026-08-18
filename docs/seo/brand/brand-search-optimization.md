# Brand Search Optimization Guide

This document defines the brand search strategy, entity optimization, sitelink structure, and brand query ownership for **WATCHWORLDCUP**.

## 1. Brand Target Keywords

- `WATCHWORLDCUP`
- `WATCHWORLDCUP.us`
- `Watch World Cup guide`
- `Watch World Cup 2026 replays`
- `Watch World Cup streaming setup`

## 2. Knowledge Graph & Entity Establishment

Google and Bing build entity understanding through consistent structured data and verified brand references:

1. **Organization Schema**: Included on root layout (`app/layout.tsx`) and `about/` page with canonical logo, official domain, and support contacts.
2. **WebSite Schema**: Configured on root page with canonical search potential and publisher reference.
3. **SameAs Links**: Point to official documentation and verified institutional profiles.

## 3. Sitelinks Optimization

To earn clear sitelinks in search engine result pages (SERPs):
- Maintain top-level clear navigation: `/live-tv`, `/sports`, `/movies`, `/series`, `/pricing`, `/setup-guides`, `/world-cup-2026`, `/support`.
- Ensure clean page hierarchy and single `<h1>` tag per route.
- Implement breadcrumb markup with matching visible breadcrumbs.

## 4. Brand Equity Protection

- Monitor navigational brand queries.
- Prevent keyword cannibalization across internal pages by assigning distinct primary targets per route.
- Maintain accurate metadata across all 40 indexable routes.
