# Technical SEO 2026 Tournament Readiness

This document defines the server architecture, edge CDN caching rules, and crawler optimization for handling **FIFA World Cup 2026** traffic spikes.

## 1. Edge CDN Caching & Revalidation

During match days in 2026, search traffic increases exponentially.
- **Cache Header**: `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`
- Serves instant cached HTML from Netlify edge nodes while quietly revalidating static assets in the background.

## 2. Layout Stability & Mobile Performance

- All images use `<OptimizedImage />` to enforce zero layout shift (CLS = 0).
- High-priority LCP preloading for 2026 hero banners ensuring TTFB < 200ms and LCP < 1.8s.
