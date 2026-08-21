# GEO package

This folder covers both meanings commonly attached to GEO:

1. Generative Engine Optimization — making verified entities, claims, sources, datasets and concise answers easy for answer engines to understand and cite.
2. Geographic SEO governance — preventing doorway pages, unsupported localization and broken hreflang clusters.

## Files

- `entity-profile.json` — machine-readable WATCHWORLDCUP entity and verified commercial facts.
- `answer-engine-content-map.json` — user questions mapped to the best canonical answer pages and evidence types.
- `citation-policy.md` — source, attribution and claim rules.
- `geographic-policy.json` — approved locale architecture and anti-doorway controls.
- `hreflang-cluster.json` — current reciprocal x-default/en-US replay cluster.
- `geo-checklist.md` — production and editorial validation procedure.

## Public machine-readable endpoint

`https://watchworldcup.us/llms.txt` summarizes the entity, verified offer, primary pages, discovery files and claim boundaries. It supplements normal HTML, sitemap, RSS and structured data; it does not replace them and does not guarantee inclusion in an answer engine.

## Core rule

A concise answer is publishable only when the supporting fact is visible on the canonical page and is either owner-verified, directly measured, or linked to an appropriate primary source. No answer-engine markup may broaden the visible claim.
