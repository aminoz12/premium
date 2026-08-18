# Geo 2026 Organic Search Strategy

This document defines the regional organic search acquisition strategy targeting **FIFA World Cup 2026** queries across North America, Europe, Australia, and Latin America.

## 1. 2026 Host City Search Intent

During the 2026 tournament, search volume surges in the 16 host metro areas (New York, Los Angeles, Dallas, Miami, Toronto, Mexico City, etc.).
- **Host City Landing Hub**: `/world-cup-2026/host-cities`
- **Target Keywords**: `FIFA World Cup 2026 host cities`, `New York MetLife Stadium 2026 final replay`, `SoFi Stadium Los Angeles World Cup 2026 stream`.

## 2. Regional Subdirectory Routing

Maintain clean, non-doorway route paths:
- Primary international route: `/world-cup-2026/replays`
- US localized route: `/world-cup-2026/replays/usa`
- Emits reciprocal `x-default` and `en-US` Hreflang headers.

## 3. GEO / AI Answer Engine Distribution

- Ensure `/llms.txt` serves clean 2026 facts (prices $25/$38/$62, official contact +212 723 279 328, verified broadcaster names) to ChatGPT, Perplexity, Gemini, and SearchGPT.
