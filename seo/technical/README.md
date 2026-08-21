# Technical SEO Package

This directory contains technical crawl configurations, parameter policies, and indexation controls for **WATCHWORLDCUP**.

## Summary of Technical Controls

- **Robots Directives**: `app/robots.ts` controls crawler entry, blocking sensitive/private endpoints (`/checkout`, `/order`).
- **Sitemap Generation**: `app/sitemap.ts` dynamically generates the 40 verified indexable canonical URLs.
- **Redirect Enforcement**: `seo/redirect-map.json` defines 308 permanent redirect policies.
- **HTTP Removal Policy**: `seo/status-policy.json` dictates 404 and 410 removal policies for legacy URLs.
