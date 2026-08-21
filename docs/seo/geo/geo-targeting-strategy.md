# Geographic SEO & Localization Strategy

This document outlines the geographic targeting architecture, Hreflang implementation, and regional broadcast mapping policy for **WATCHWORLDCUP**.

## 1. Geographic Architecture Policy

- **Subdirectories Only**: Regional variations must use clean path subdirectories (e.g. `/world-cup-2026/replays/usa`) rather than subdomains or CCtlds.
- **Strictly No Doorway Pages**: Programmatic thin pages created solely for keyword location variations are strictly forbidden.
- **Indexable Route Control**: Each geographic page must fulfill explicit search intent with substantial, verified local content.

## 2. Hreflang Implementation Rules

For regional variant clusters (e.g., `/world-cup-2026/replays` and `/world-cup-2026/replays/usa`):
1. **Reciprocal Link Tags**: Every member of the cluster MUST link back to every other member.
2. **`x-default` Link**: Point `x-default` to the primary fallback route (`https://watchworldcup.us/world-cup-2026/replays`).
3. **`en-US` Link**: Point `en-US` to the US specific route (`https://watchworldcup.us/world-cup-2026/replays/usa`).

## 3. Regional Rights & Compliance

- Explicitly state rights holders for each region (e.g. FOX Sports / Telemundo in USA, TSN/RDS in Canada, BBC/ITV in UK).
- Display clear regional support options including WhatsApp (+212 723 279 328).
