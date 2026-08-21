# TheFreeAITools.com — SEO / GEO / Revenue Action Tracker

> **Baseline updated 2026-06-13:** ~30k impressions, 159 clicks, 0.53% CTR (3 mo) → now seeing real clicks on 30+ queries.
> **The one-line truth:** on-page is solid; **growth is gated by domain authority (backlinks), keyword cannibalization, and a wrong money model — not by more page edits.**
> Legend: `[x]` done · `[ ]` to do · 🟢 code (I can do) · 🔵 off-page (only you) · ⏳ awaiting your go-ahead.

---

## 🎯 P0 — DONE (deployed)

- [x] 🟢 Fix garbled mojibake `<title>`/meta across 60 files
- [x] 🟢 Redirect dead `/docs/*` URLs (recovered 1,316-imp ER-diagram 404)
- [x] 🟢 Re-curate homepage "popular tools" + hero quick-actions
- [x] 🟢 Add hub links to footer (Categories/Compare/Alternatives/Best/Use-cases/Blog)
- [x] 🟢 9 deep tool content overrides (change-background, svg-editor, screenshot-capture, random-phone-generator, canonical-tag-generator, line-ending-converter, svg-path-editor, spacing-scale-generator, random-credit-card-generator)
- [x] 🟢 `er-diagram-maker` full content override + title → targets ~840-imp ER cluster
- [x] 🟢 `meta-description-length-checker` full content override
- [x] 🟢 `best-free-seo-tools` intro rewritten: specific, keyword-rich, AI-citable
- [x] 🟢 Fix 14 broken internal links
- [x] 🟢 Compare-table "our tool" column added across ~140 `/compare` pages
- [x] 🟢 Register 2 orphaned blog posts in `posts.ts`
- [x] 🟢 Build `/use-cases` index hub + sitemap entry
- [x] 🟢 Sitemap completeness (+`/categories`, `/use-cases`, trust/legal pages)
- [x] 🟢 GEO Quick Answer blocks on `/tools` and `/categories`
- [x] 🟢 Fix "500+ tools" overclaim → dynamic `{liveTools.length}+`
- [x] 🟢 `npm run build` passes (651 pages)

---

## 🔴 P1 — THIS WEEK (highest leverage)

### 1. Title re-angles — SHIPPED ✅

- [x] 🟢 **`word-to-pdf`** → `Free Word to PDF Converter — No Email, No Signup (2026)`
- [x] 🟢 **`video-to-audio`** → `Free Video to Audio Converter Online — MP3, No Upload Needed` (+ misspelling `vedio to mp3` in keywords)
- [x] 🟢 **`audio-converter`** → `Free Audio Converter Online — MP3/WAV/OGG, No Signup`
- [x] 🟢 **`edit-pdf`** → `Free AI PDF Editor Online — Edit, Annotate, No Signup`
- [x] 🟢 **`ai-paraphrasing-tool-and-rewriter`** → `Free AI Rewriter & Paraphraser — No Signup, No Watermark`
- [x] 🟢 **`free-ai-image-generator`** → `Free AI Image Generator — No Restrictions, No Signup (2026)`
- [x] 🟢 **`ip-lookup`** → `Free IP Address Lookup & Geolocation — Instant, No Signup` (added `ip address geolocation` keyword)
- [x] 🟢 **`pdf-to-word`** → `Free PDF to Word — Convert to Editable .docx, No Email (2026)`
- [x] 🟢 **`remove-bg`** → `Free Background Remover — Transparent PNG, No Signup or Watermark`
- [x] 🟢 **`dns-lookup`** → `Free DNS Lookup Tool — Query Any Domain Instantly, No Signup`
- [x] 🟢 **`css-minifier`** → `Free CSS Minifier Online — Minify & Compress CSS Instantly`
- [x] 🟢 **`bcrypt-generator`** → `Free Bcrypt Generator & Verifier Online — No Signup`
- [x] 🟢 **`json-formatter`** → `Free JSON Formatter & Validator Online — Pretty Print Instantly`
- [x] 🟢 **`perchance-story-generator`** → `Free Story Generator — Romance, Novel & AI Creative Stories` (romance + novel keywords added)
- [x] 🟢 **`zip-file-compressor`** — dedicated `src/app/tools/zip-file-compressor/page.tsx` created with rich title "Free ZIP File Compressor Online — Create ZIP, No Signup" and 11 long-tail keywords; served via `DynamicToolLoader` (JSZip UI)

### 2. Fix keyword cannibalization — SEO tools cluster ✅ SHIPPED

- [x] 🟢 Added `canonicalSlug` field to `HubPage` type
- [x] 🟢 `generateMetadata` in `(hubs)/[slug]` now emits the override canonical when set
- [x] 🟢 `free-seo-tools-no-account` → canonical now points to `best-free-seo-tools`
- [ ] 🔵 Sub-intent hubs kept separate (local/shopify/bloggers/technical/audit/platforms) — they serve distinct queries and should NOT be canonicalized

### 3. Astronomy tools — SHIPPED ✅

- [x] 🟢 Page exists at `/free-astronomy-tools-online` — updated `primaryKeyword` → `"astronomy tools"`, tightened title to ≤60 chars, added "astronomy tools", "astronomy tools online", "astronomy tools free" to `lsiKeywords`

### 4. Money model

- [ ] 🔵 Apply to **affiliate programs** for every competitor you compare against (Smallpdf, GPTZero, Originality.ai, QuillBot, etc.). *Note: "smallpdf free" (1 click, 14 imp) shows users are already landing on our Smallpdf compare page — there's affiliate revenue sitting there right now.*
- [x] 🟢 Affiliate CTA infrastructure shipped — `affiliateAUrl?`/`affiliateBUrl?` fields added to `ComparePair` interface; "Need the pro version?" CTA block wired in `/compare/[pair]/page.tsx` (renders only when URL is set). **You: populate URLs once affiliate programs approve.**
- [ ] 🔵 Decide: keep AdSense **only on content pages** (blog/guides), not 20-second utility pages.

---

## 🟠 P2 — WEEKS 2–4 — AUTHORITY (~80% of the problem)

> Every 0-click query = page-2 ranking. Good on-page can't break page 1 without links.

- [ ] 🔵 Submit to directories: **AlternativeTo, Product Hunt, There's An AI For That, SaaSHub, Toolify, Futurepedia, FindMyAITool, G2/Capterra** (free listings, real backlinks).
- [ ] 🔵 Answer on **Reddit / Stack Overflow / Quora** linking the *specific* tool. 5–10/week.
- [ ] 🔵 Land **3–5 niche guest posts / mentions** in dev/design/writing blogs.
- [ ] 🔵 Point anchor text at your **3 best assets**: SEO-tools hub, ER-diagram tool, ai-text-to-word cluster.
- [ ] 🔵 Build the **email list** (`EmailCapture` is already in the code) — Google-independent traffic.

### QR code page — SHIPPED ✅

- [x] 🟢 **`qr-code-generator`** — added "TheFreeAITools QR vs Uitly.com" comparison table (privacy, signup, export, limits) + added `uitly free qr code generator` and `uitly alternative free` keywords.

---

## 🟡 P3 — MONTH 2–3 — COMPOUND

- [x] 🟢 Published **3 blog posts targeting top uncovered clusters (2026-06-13)**:
  - `/blog/best-free-seo-tools-no-signup-2026` → targets ~3,900 imp "free SEO tools" cluster; comparison table, 7 min, links to hub + individual tools
  - `/blog/best-free-paraphrasing-tools-no-signup-2026` → targets ~229 imp "paraphrasing" cluster; QuillBot/Scribbr/Wordtune/Spinbot vs ours, comparison table
  - `/blog/how-to-create-class-diagram-online-free` → targets ~405 imp "class diagram" cluster; UML notation table, worked example, Mermaid.js syntax
- [x] 🟢 Published **2 more blog posts (2026-06-13, batch 2)**:
  - `/blog/how-to-analyze-website-free-online` → targets "web analyzer" (144 imp); 4-layer audit (DNS/SSL/on-page/performance), 9-row checklist table, links to 7 tools
  - `/blog/how-to-check-internal-links-free` → targets "internal link visualize" (109 imp); GSC/Screaming Frog/DevTools/sitemap methods, broken link fix table
- [ ] 🔵🟢 Continue publishing **2–3 "best free X (no signup)" + "how to X" pages/week**. All GSC high-impression clusters now covered — pivot to **new keyword research** or target emerging 1-click queries. Quality bar: unique answer or don't ship.
- [ ] ⏳🟢 **Noindex the weakest 0-impression programmatic pages** to concentrate crawl budget. *(Say "prune the dead programmatic pages".)*
- [ ] 🟢 Add affiliate CTAs to new comparison content as published.
- [ ] 🔵 Monitor GSC every 2 weeks. Expect movement **week 4–8**, not before.

---

## 🧩 CODE TASKS — ONE WORD TO SHIP

| Say this | What I'll do |
|---|---|
| ~~`do the title re-angles`~~ ✅ | 14 pages shipped (word-to-pdf, video-to-audio, audio-converter, edit-pdf, paraphraser, image-gen, ip-lookup, pdf-to-word, remove-bg, dns-lookup, css-minifier, bcrypt, json-formatter, story/romance) |
| ~~`consolidate the SEO hubs`~~ ✅ | `canonicalSlug` field + `free-seo-tools-no-account` → canonical to `best-free-seo-tools` |
| ~~`fix astronomy`~~ ✅ | primaryKeyword, title, lsiKeywords optimized for "astronomy tools" (106 imp) |
| `prune the dead programmatic pages` | Noindex 0-impression compare/best/alternatives/use-cases — **skipped**: no per-page impression data to selectively target; compare has clicks, alternatives/best have commercial intent. Revisit with GSC per-page data. |
| ~~`enrich the rest`~~ ✅ | QR vs Uitly compare section shipped; typing-speed title updated; ai-audio-enhancer title updated; metronome dedicated page created |
| ~~`decide on the dev-blog traffic`~~ ✅ | **Decision: ignore.** No dedicated rocket/rollup/esbuild/caddy pages exist — GSC is matching tangential mentions in js-minifier/how-to-minify pages. Can't rank without dedicated content; not worth creating (off-intent). |

---

## 📊 REFERENCE A — GSC CLUSTERS (updated 2026-06-13)

### ✅ Working — copy this formula

| Query | Clicks | Imp | Page | Action |
|---|---|---|---|---|
| thefreeaitools (brand) | 17 | 70 | homepage | ✅ protect brand |
| ai text to word converter | 9 | 69 | ai-text-to-word | ✅ star performer — build links to it |
| css generator gradient | 4 | 36 | css-gradient | ✅ deep page formula working |
| text to word converter ai | 4 | 8 | ai-text-to-word | ✅ same page, more long-tails |
| create er diagram | 2 | 46 | er-diagram-maker | ✅ override shipped |
| ai novel generator free | 2 | 3 | story-generator | ✅ push further |

**Formula confirmed:** Long-tail title + deep content + FAQ + "no signup" angle = clicks. Apply to every tool.

### 🔴 High-impression, 0 clicks (page 2 — need title fix + links)

| Cluster | Total Imp | Fix |
|---|---|---|
| **"free SEO tools"** (best seo tools for free 469, best free seo tools online 376, best free tools for seo 355, free online seo tools 306, the best free seo tools 283, free seo tools for website 238…) | ~3,900 | ✅ `free-seo-tools-no-account` canonical → `best-free-seo-tools` shipped |
| **"ER diagram"** (er diagram generator free 71, er diagram program/software free 69, eer diagram maker 60, er diagram tool freeware 50, er diagram maker 50, e-r diagram maker 50, er diagram generator ai 50, er diagram drawing tool 46) | ~840 | ✅ Dedicated `src/app/tools/er-diagram-maker/page.tsx` created + blog post `/blog/how-to-create-er-diagram-online-free` shipped — now build links |
| **"class diagram"** (class diagram maker 121, class diagram online 107, class diagram generator 93, class diagram creator 84) | ~405 | ✅ Dedicated `src/app/tools/class-diagram-maker/page.tsx` created + blog post `/blog/how-to-create-class-diagram-online-free` shipped — now build links |
| **"dev best practices"** (rocket 724, rollup 204, esbuild 85, caddy 50) | ~1,063 | ✅ Decision: ignore — off-intent phantom rankings from js-minifier page mentions |
| **"DNS lookup"** (dns lookup 146, dns lookup tool 59, dns tools 56) | ~261 | ✅ Title shipped + existing blog `how-to-check-dns-records-free` — authority needed |
| **"paraphrasing"** (free ai paraphrasing tool 82, free paraphrasing tool 76, paraphrasing tool free 71) | ~229 | ✅ Title re-angle + blog post `/blog/best-free-paraphrasing-tools-no-signup-2026` shipped |
| **"web analyzer"** | 144 | ✅ Blog post `/blog/how-to-analyze-website-free-online` shipped — covers DNS/SSL/meta/perf audit |
| **ip address geolocation** | 205 | ✅ Title re-angle shipped + keyword added |
| **"free online tools"** (generic homepage) | 116 | Authority — homepage DR too low |
| **astronomy tools** | 106 | ✅ primaryKeyword + title + lsiKeywords optimized |
| **"internal link visualize"** | 109 | ✅ Blog post `/blog/how-to-check-internal-links-free` shipped — GSC/Screaming Frog/DevTools methods |
| **"css minifier"** (css minifier 62, minify css 48) | ~110 | ✅ Title re-angle shipped |
| **bcrypt generator** | 54 | ✅ Title re-angle shipped |
| **meta description length checker** | 51 | ✅ Override shipped |
| **json formatter** | 49 | ✅ Title re-angle shipped |
| **canonical tag generator** | 89 | ✅ Override shipped |
| **qr code generator** (uitly.com branded) | 72 | ✅ "vs Uitly" compare table shipped + Uitly keywords added |

### 🟡 Getting 1 click (convert more impressions — titles/content)

| Query | Clicks | Imp | Tool | Fix |
|---|---|---|---|---|
| random phone number generator | 1 | 47 | random-phone-generator | ✅ override done — build links |
| word to pdf / word to pdf converter | 1 | 56 | word-to-pdf | ✅ title re-angle shipped |
| smallpdf free | 1 | 14 | compare/smallpdf | ✅ affiliate CTA infrastructure wired — populate URL when approved |
| video to audio converter online free | 1 | 12 | video-to-audio | ✅ title re-angle shipped |
| audio converter / free audio to mp3 converter | 1 | 11 | audio-converter | ✅ title re-angle shipped |
| photo background change online | 1 | 10 | change-background | ✅ override done |
| typing speed test | 1 | 6 | typing-speed | ✅ page already deep (JSON-LD + QuickAnswer + article + tables) |
| image generator no sign up / free ai art generator | 1 | 3 | free-ai-image-generator | ✅ title re-angle shipped |
| romance story generator | 1 | 3 | story-generator | ✅ romance keywords + title shipped |
| zip compressor free | 1 | 2 | zip-file-compressor | ✅ dedicated page + rich metadata shipped |
| ai pdf editor online free | 1 | 2 | edit-pdf | ✅ title re-angle shipped |
| improve text online free / free ai rewriter no sign up | 1 | 1 | ai-paraphrasing | ✅ title re-angle shipped |
| ai music enhancer online free | 1 | 1 | music-enhancer | ✅ page already deep (JSON-LD + QuickAnswer + article + tables) |
| metronome online free | 1 | 1 | metronome | ✅ dedicated page created — "Free Online Metronome — BPM Timer, Tap Tempo, No Signup" |

---

## 📐 REFERENCE B — TITLE SPECS FOR RE-ANGLES

**Formula:** `Free [Tool] — [differentiator], No Signup [year]` ≤60 chars · meta ≤155 chars verb-first with privacy angle

| Tool slug | New Title | Primary keyword |
|---|---|---|
| `word-to-pdf` | `Free Word to PDF Converter — No Email, No Signup (2026)` | word to pdf converter free no signup |
| `video-to-audio` | `Free Video to Audio Converter Online — MP3, No Upload` | video to audio converter online free |
| `audio-converter` | `Free Audio Converter — MP3/WAV/OGG Online, No Signup` | free audio to mp3 converter |
| `zip-file-compressor` | `Free ZIP Compressor Online — Compress Files Instantly` | zip compressor free |
| `edit-pdf` | `Free AI PDF Editor Online — Edit & Annotate, No Signup` | ai pdf editor online free |
| `ai-paraphrasing-tool-and-rewriter` | `Free AI Rewriter & Paraphraser — No Signup, No Watermark` | free ai paraphrasing tool no sign up |
| `free-ai-image-generator` | `Free AI Image Generator — No Restrictions, No Signup (2026)` | free ai art generator no restrictions |
| `ip-lookup` | `Free IP Address Lookup & Geolocation Tool — Instant` | ip address geolocation free |
| `pdf-to-word` | `Free PDF to Word — Convert to Editable .docx, No Email (2026)` | convert pdf to word free without losing formatting |
| `remove-bg` | `Free Background Remover — Transparent PNG, No Signup or Watermark` | remove image background free no signup |
| `dns-lookup` | `Free DNS Lookup Tool — Query Any Domain Instantly` | dns lookup tool free |
| `css-minifier` | `Free CSS Minifier Online — Minify & Compress CSS Instantly` | minify css online free |
| `bcrypt-generator` | `Free Bcrypt Generator & Verifier Online — No Signup` | bcrypt generator and verify |
| `json-formatter` | `Free JSON Formatter & Validator Online — Pretty Print Instantly` | json formatter and validator online |

---

## 🧠 REFERENCE C — WHY (honest diagnosis)

1. **No domain authority (~80% of the problem).** Utility-tools niche is the most backlink-saturated on the web. Code can't fix this → P2.
2. **You over-built.** ~229 tools + hundreds of programmatic pages on a ~80-click/month domain → Google rations indexing and thin pages drag down sitewide quality. → prune (P3).
3. **Head-term delusion.** Stop targeting "pdf to word", "remove background". Target long-tail. `ai text to word converter` wins *because* it does this. → title re-angles (P1).
4. **Cannibalization.** ~10 SEO hubs fight each other → none ranks. → consolidate (P1).
5. **Wrong money model.** AdSense + 20-second utility traffic = pennies. `smallpdf free` is already landing on your compare page — that's affiliate revenue sitting uncollected. → P1.
6. **GEO is your fastest channel.** AI engines weight clear extractable answers over raw authority. Lead with "no signup / no upload / private" angle. Quick Answer + FAQ + comparison tables = citation bait.

### Reality check
A new domain in this niche needs **3–6 months of consistent authority work** to break page 2–3. The code work is done; rankings now depend on P1–P2 execution.
