# TO-DO — Fix Google AdSense "Low Value Content"

**Owner:** Achraf A. · **Site:** thefreeaitools.com · **Updated:** 29 May 2026

> **Read first.** Most HIGH-priority code fixes are already written and committed to the
> `main` branch locally — but they are **NOT deployed**. The live site still shows the old
> problems (verified 29 May: 104 `  ,  ` artifacts on the homepage, `noindex` boilerplate
> pages still live). **Step 0 (deploy) is the single highest-leverage action.**

---

## ✅ STEP 0 — DEPLOYED (29 May 2026)

All fixes are now pushed to `main` and deploying via Vercel:

```
caa4996  Prune 23 template tools + 3 empty categories (301 redirects)
c8c3227  (prior wave: boilerplate, em-dash, dedup, count, FAQ, keywords...)
```

- [x] `git push` done (two waves: `ffc8633..c8c3227`, then `c8c3227..caa4996`)
- [ ] After Vercel finishes, hard-refresh and confirm on the LIVE site:
  - [ ] Homepage `<title>` shows a real em-dash, not `  ,  `
  - [ ] `/tools/voltage-divider-calculator` → 301 redirects to `/categories/engineering`
  - [ ] `/categories/astronomy` → 301 redirects to `/tools`
  - [ ] No `developer.mozilla.org` link on non-dev tool pages
- [ ] Google Search Console → resubmit `https://www.thefreeaitools.com/sitemap.xml`

**Deploying alone removes these findings from the live site:**
em-dash bug · templated boilerplate · intra-page duplication · meta-keyword stuffing ·
`nofollow` dead-ends · count mismatch · FAQ overclaims · MDN placeholder.

---

## ✅ ALREADY DONE IN CODE (verify after deploy)

| # | Fix | Where |
|---|-----|-------|
| 1 | Killed templated boilerplate (the killer scaled-content issue) | `src/lib/seo/tool-content.ts` |
| 2 | `  ,  ` → em-dash, 3,386× across 186 files | sitewide |
| 3 | Removed intra-page duplication (2× FAQ / how-to / related) on 23 pages | `src/app/tools/*/client-page.tsx` |
| 4 | Meta keywords cut from ~40 permutations → ≤12 real terms | `src/lib/seo/metadata.ts` |
| 5 | Noindexed thin pages now `follow: true` (link equity flows) | `src/lib/seo/metadata.ts` |
| 6 | MDN reference only on real web/dev tools | `src/lib/seo/tool-content.ts` |
| 7 | One tool count everywhere (`toolCount = liveTools.length`) | `src/lib/tools/tools-config.ts` |
| 8 | Softened FAQ overclaims (removed "90%", "scanned PDFs", "better than Smallpdf") | `src/app/page.tsx` |
| 9 | Fixed profession-card cannibalization (1 destination each) | `src/app/page.tsx` |
| 10 | Added unique hub content to 11 thin category pages | `src/lib/seo/category-content.ts` |
| 11 | Branded contact email (already live) | `src/lib/site-config.ts` |

---

## 🔴 HIGH — NEEDS YOUR DECISION (blocks re-applying)

### A. Prune the filler tools — ✅ DONE (29 May 2026)
- [x] Redirected 23 template-only tools (301 → parent listing); dropped from sitemap/grids/search/count
- [x] Retired 3 now-empty categories (astronomy, education, finance) → `/tools`
- [x] Kept 4 hand-built tools with unique content (solar-generator, generate-chart, test-speed-connection, color-contrast-checker)
- Note: did NOT touch Random/Audio — those weren't template filler (have real client widgets). Revisit only if you want a deeper cut.

### B. Policy-sensitive tools
- [ ] Decide: keep or remove "humanizer / AI-detector" tools before approval
  (gray-area for AdSense; at minimum don't feature them prominently)

### C. E-E-A-T (your personal info — I can't fabricate)
- [ ] Use full author name (not just "Achraf A.")
- [ ] Add a real founder photo
- [ ] Create an `/author/achraf` page with a short bio + credentials + links
- [ ] (Optional) LinkedIn / X profile link for verifiability

### D. Brand / intent mismatch
- [ ] Decide positioning: lean into "free, no-signup browser tools" (recommended)
      OR commit to building real AI tools. Don't keep "AI" purely as bait.
- [ ] If repositioning: update home `<title>`, H1, and meta description

---

## 🟡 MEDIUM — within 30 days

- [ ] Server-render tool explanatory text so crawlers don't see "Loading tool interface…"
      (widget can hydrate after; the words must be in initial HTML)
- [ ] Run PageSpeed Insights on: home, one category, one tool, one blog post — fix reds
- [ ] Confirm ads (if any test units) do not dominate thin pages (content must dominate viewport)
- [ ] Replace the vanity tool count on the homepage with the real pruned number

---

## 🟢 LOW — ongoing growth

- [ ] One expert blog post per kept category (the Base64 post is the model)
- [ ] Earn links: Show HN, relevant subreddits, dev newsletters, honest tool directories
- [ ] Add SoftwareApplication / FAQPage structured data only on real-content pages
- [ ] Set up a minimal social/distribution loop for initial engagement

---

## AdSense re-application gate (don't reapply until ALL true)

- [ ] Step 0 deployed and verified live
- [ ] Filler tools pruned/redirected; sitemap reflects only real pages
- [ ] Median page passes a human "did this add unique value?" test
- [ ] No two pages exceed ~30% text similarity (re-crawl to confirm)
- [ ] ~4 weeks elapsed since deploy (let Google re-crawl)
- [ ] Core Web Vitals not red in Search Console

---

## Live evidence captured 29 May 2026 (pre-deploy baseline)

- Homepage `<title>`: `244+ Free Online Tools (2026)  ,  No Signup, No Download` (em-dash bug in title)
- `  ,  ` artifact: 104× on homepage
- `/tools/voltage-divider-calculator`: `noindex, nofollow` + "debugging a payload" boilerplate + MDN link
- Count: homepage "244+", About page shows both "244+" and "249+"
- Contact email: `contact@thefreeaitools.com` (already branded — good)
