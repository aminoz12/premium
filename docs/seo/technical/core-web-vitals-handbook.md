# Core Web Vitals Handbook

This document outlines optimization techniques, performance thresholds, and monitoring procedures for **WATCHWORLDCUP**.

## Target Benchmarks

| Metric | Target | Description |
| --- | --- | --- |
| **LCP** (Largest Contentful Paint) | `< 1.8s` | Time for main content element to render |
| **INP** (Interaction to Next Paint) | `< 150ms` | Responsiveness to user input |
| **CLS** (Cumulative Layout Shift) | `< 0.05` | Visual stability of layout |
| **FCP** (First Contentful Paint) | `< 1.0s` | Initial DOM content render |
| **TTFB** (Time to First Byte) | `< 200ms` | Netlify edge response latency |

## Key Optimizations Implemented

1. **Font Optimization**: Use Google Fonts (`Inter`, `Outfit`) with `display: swap` to eliminate render-blocking typography delays.
2. **Media Optimization**: WebP images with explicit width and height dimensions to prevent CLS.
3. **HTTP Cache Control**: Cache-Control headers configured in `next.config.js` and `netlify.toml` for static assets (`max-age=31536000, immutable`).
4. **Minimal Runtime JS**: Streamlined React 19 components without excessive client-side bundles.
