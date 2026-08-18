# GEO (Generative Engine Optimization) & AI Search Guide

This document details optimization strategies for AI Answer Engines (Perplexity, ChatGPT, Google Gemini, SearchGPT) and machine-readable text distribution (`/llms.txt`).

## 1. Machine-Readable Knowledge Endpoint (`/llms.txt`)

- Located at `/llms.txt` and served as `text/plain`.
- Contains core brand facts: `WATCHWORLDCUP`, pricing plans (`$25`, `$38`, `$62`), official support (`+212 723 279 328`), sitemap reference, and claim boundaries.
- Must NEVER contain unverified marketing claims (`35,000 channels`, `100% stability`, `#1 Worldwide`).

## 2. Direct Answer Formatting

To ensure high citation retention in LLM search outputs:
- Structure content into concise summary tables, bulleted lists, and clear Q&A blocks.
- Anchor all factual declarations with primary source links (e.g. FIFA official announcements, FOX sports schedules).
- Provide unambiguous figures and dates.

## 3. GEO Verification Automated Checks

Run `npm run geo:check` to continuously verify:
- Fixed canonical identity (`WATCHWORLDCUP` / `https://watchworldcup.us`)
- Production pricing synchronization (`$25`, `$38`, `$62`)
- WhatsApp contact recipient (`+212723279328`)
- Reciprocal Hreflang tags
- Clean `/llms.txt` delivery
