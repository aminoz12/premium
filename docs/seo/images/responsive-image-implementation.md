# Responsive Image Implementation & Performance Guide

This document defines performance, sizing, and format implementation standards for images in **WATCHWORLDCUP**.

## 1. WebP Format Standard

- Convert all raw PNG, JPEG, and raster graphics to high-efficiency WebP using `python3 scripts/convert-raster-to-webp.py`.
- Ensure lossy compression quality target is set between 80% and 85% to balance small payload with zero visual degradation.

## 2. LCP & Above-The-Fold Image Optimization

- Hero images (such as `/hero-fallback.webp` and `/world-cup-fallback.webp`) must specify `priority` or `<link rel="preload" as="image">`.
- Set explicit `width` and `height` attributes on HTML image tags to avoid Cumulative Layout Shift (CLS).

## 3. Responsive Sizing & Srcset

- Use `srcset` and `sizes` attributes for content images to serve appropriate display resolutions for mobile, tablet, and desktop viewports.
- Example:
  ```html
  <img
    src="/hero-fallback.webp"
    alt="Sports streaming technical setup showcase"
    width="1200"
    height="675"
    loading="eager"
    fetchpriority="high"
  />
  ```

## 4. Automated Image Verification

- Run `npm run webp:check` and `npm run images:check` in build pipeline.
