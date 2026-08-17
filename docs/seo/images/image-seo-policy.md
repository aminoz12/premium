# Image SEO policy

## Asset requirements

- Use original, licensed or documented public-domain assets only.
- Preserve width, height and useful `alt` text for meaningful images; decorative images use an empty `alt` value.
- Use the route-specific 1200×630 WebP Open Graph image generated for each indexable route.
- Keep social-image title, metadata, canonical URL and visible page topic aligned.
- Lazy-load below-the-fold content images and reserve layout space to prevent CLS.

## Claim and provenance requirements

Do not use a logo, screenshot, channel tile, poster, athlete image, broadcast frame or payment mark to imply availability, rights, partnership or endorsement. Keep provenance and licence evidence for every new non-generated asset. Generated artwork must be labelled illustrative where a reasonable visitor could mistake it for event evidence.

Run `npm run images:check` and `npm run webp:check` after image changes.
