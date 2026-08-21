# Bing Webmaster Tools & IndexNow Integration Guide

This guide details the submission, IndexNow instant indexing, and Bing Visual Search configuration for **WATCHWORLDCUP**.

## 1. Bing Webmaster Tools Submission

1. Sign in to **[Bing Webmaster Tools](https://www.bing.com/webmasters)**.
2. Add site: `https://watchworldcup.us` or import directly from Google Search Console.
3. Submit Master Sitemap Index:
   ```text
   https://watchworldcup.us/sitemap-index.xml
   ```

## 2. Real-Time Indexation via IndexNow API

IndexNow immediately notifies Bing and Yandex when new match replays or guides are updated.

- **API Endpoint**: `POST /api/indexnow`
- **Payload Example**:
  ```json
  {
    "urls": [
      "https://watchworldcup.us/world-cup-2026/replays/usa",
      "https://watchworldcup.us/world-cup-2026/host-cities"
    ]
  }
  ```
