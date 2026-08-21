# Crawl Budget & Indexation Management

This document details canonical URL enforcement, robots.txt management, sitemap indexation, and crawl efficiency for **WATCHWORLDCUP**.

## 1. Canonicalization Standard

- Apex domain standard: `https://watchworldcup.us`.
- No trailing slashes except for root (`/`).
- Every page emits a self-referencing canonical URL via `pageMetadata()` in `lib/seo.ts`.

## 2. Robots Directives & Private Routes

- Indexable routes: 40 routes defined in `seo/indexable-routes.json`.
- Blocked private routes: `/checkout`, `/order`.
- Disallowed static build paths: `/_next/`.

## 3. Sitemap Maintenance

- `app/sitemap.ts` generates canonical entries for all 40 indexable routes.
- Includes truthful `lastModified` date tags based on content update records.
- Continuous verification via `npm run seo:files:check` and `npm run policy:check`.
