# International Geo Hreflang Architecture

This document defines the multi-regional international targeting rules and reciprocal Hreflang XML/HTML tag generation for **WATCHWORLDCUP**.

## 1. Reciprocal Hreflang Tag Rules

To prevent search engines (Google, Bing) from flagging regional versions as duplicate content:
- Every international page route must declare reciprocal `rel="alternate"` links pointing back to all other regional cluster members.
- `x-default` must point to the apex global URL (`https://watchworldcup.us/world-cup-2026/replays`).

## 2. Dynamic Hreflang Generation (`lib/geo.ts`)

`getReplayClusterHreflang()` generates:
```html
<link rel="alternate" hreflang="x-default" href="https://watchworldcup.us/world-cup-2026/replays" />
<link rel="alternate" hreflang="en-US" href="https://watchworldcup.us/world-cup-2026/replays/usa" />
<link rel="alternate" hreflang="en-CA" href="https://watchworldcup.us/world-cup-2026/replays" />
<link rel="alternate" hreflang="en-GB" href="https://watchworldcup.us/world-cup-2026/replays" />
```
