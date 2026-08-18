# Googlebot Regional Crawl & IP Handling Architecture

This document defines server behavior for international search crawlers visiting regional routes on **WATCHWORLDCUP**.

## 1. Zero-Redirect Policy for Search Crawlers

Googlebot crawls mainly from US IP addresses, but also uses locale-aware crawlers (Googlebot US, Googlebot UK, Googlebot CA).

- **Rule**: Never perform automatic IP-based HTTP redirects on search engine bots.
- **Implementation**: Serve requested regional HTML content directly based on URL path (`/world-cup-2026/replays/usa`), allowing Googlebot to index all regional variants cleanly.
