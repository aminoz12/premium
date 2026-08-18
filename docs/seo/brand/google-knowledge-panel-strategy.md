# Google Knowledge Panel & Bing Entity Card Strategy

This document outlines the entity disambiguation playbook for triggering official Google Knowledge Panels and Bing Entity Cards for **WATCHWORLDCUP**.

## 1. Schema.org Entity Association

`lib/brand.ts` and `lib/brand-2026.ts` dynamically output explicit Organization JSON-LD markup on every page:
```json
{
  "@type": "Organization",
  "@id": "https://watchworldcup.us/#organization",
  "name": "WATCHWORLDCUP",
  "url": "https://watchworldcup.us",
  "logo": "https://watchworldcup.us/logo.svg"
}
```

## 2. Knowledge Graph Verification Workflow
1. Claim Knowledge Panel via Google Search Console linked owner account.
2. Link official social media profiles in `sameAs` array.
3. Keep corporate entity contact numbers (+212 723 279 328) consistent across all citations.
