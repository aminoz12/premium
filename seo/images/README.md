# Image SEO Package

This directory contains specifications, standards, and manifests for image optimization across **WATCHWORLDCUP**.

## Standards At A Glance

- **Format**: Modern WebP format for all visual assets and Open Graph cards.
- **Social Card Dimensions**: `1200x630` px (1.91:1 aspect ratio).
- **Compression Threshold**: Maximum `250 KB` per social image card.
- **Alt Text**: Mandatory descriptive alt attributes on all `<img />` tags.

## Automated Image Tooling

- `python3 scripts/generate-og-images.py`: Generates social cards for all 40 indexable routes.
- `python3 scripts/convert-raster-to-webp.py`: Automatically converts PNG/JPG inputs into WebP.
- `node scripts/image-metadata-check.mjs`: Validates dimensions, format, file sizes, and Open Graph metadata alignment.
