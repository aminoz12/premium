# `to_fix_google_adsense.md`

**Site:** thefreeaitools.com
**Status:** Rejected 3× by Google AdSense — reason: *Contenu à faible valeur informative* (Low value content)
**Last rejection:** 20 May 2026, 03:01 GMT+1
**Goal:** Pass AdSense review on attempt #4 by removing every signal that triggers the "low value / scaled content" classifier.

---

## 0. Read this first

The rejection isn't about your tools being broken. **Your tools are fine.** Google rejects tool-directory sites when the *surrounding content* looks like templated, AI-style filler repeated across hundreds of URLs. That's exactly what your site looks like right now to a reviewer.

The fix is not "add more tools." The fix is:

1. Drastically cut the page count.
2. Rewrite the remaining pages so each one feels human, specific, and unique.
3. Fix trust signals (author identity, contact, policies).
4. Wait 4–6 weeks before re-applying so Google re-crawls.

Re-applying every 1–2 weeks with cosmetic changes is one of the main reasons you've been rejected 3×. **Do not re-apply for at least 30 days after finishing this list.**

---

## Priority 1 — Stop the bleeding (do these first)

### [ ] 1.1 Remove AdSense ad code from the site until re-approved
- If `auto-ads` or `ca-pub-8141731290667759` script is loaded anywhere, remove it. Loading the script on a rejected site adds nothing and signals impatience to Google.
- Keep only the `<meta name="google-adsense-account">` verification tag.

### [ ] 1.2 Noindex / delete duplicate hub pages (cannibalization)
You have multiple pages targeting the same intent. Pick **one** canonical hub per topic and `noindex` the rest, or 301 them.
- `/best-free-seo-tools` vs `/categories/seo` → keep one, redirect the other
- `/free-image-tools-online` vs `/free-image-tools-browser` vs `/categories/image` → keep one
- `/free-developer-tools` vs `/categories/developer` → keep one
- `/free-text-tools-online` vs `/categories/text` → keep one
- Audit `sitemap.xml` and remove anything that no longer exists.

### [ ] 1.3 Delete or `noindex` the "doorway-style" keyword list on the homepage
The block titled **"Popular free tool searches"** (the 70+ "Free X online", "Free X no signup" links) reads exactly like a doorway page. Google has explicit guidance against this pattern.
- Delete it entirely, OR
- Replace it with **one** short paragraph in natural language pointing to `/tools`.

### [ ] 1.4 Delete or `noindex` the "Common tasks — pick what you need to do" list
Same issue as 1.3 — it's a keyword-stuffed link farm disguised as helpful text. Replace with 4–5 hand-picked, prose-style use cases.

### [ ] 1.5 Remove the "Free alternatives to paid tools" comparison table from the homepage
"You save $108/year" with no actual testing or review is a commercial/affiliate signal without the substance behind it. Either:
- Delete it, OR
- Move it to **one** dedicated blog post that is a real, hand-written comparison with screenshots, your own testing, and pros/cons (not a table).

---

## Priority 2 — Fix the templated content (the core problem)

### [ ] 2.1 Audit every tool page and cut the directory by 40–60%
- Goal: from 249 tools to **~100–130 high-quality tools**.
- Delete tools that are:
  - Duplicates with different names (e.g. multiple random-X generators that do the same thing)
  - Near-empty / non-functional / experimental
  - The misspelled / mixed-language slugs: `vedio-to-audio-ai`, `diagramm-generator-ai`, `audio-convertir-ai` → rename slugs **and** 301 redirect old URLs.
- A smaller, cleaner directory passes review. A bloated one doesn't.

### [ ] 2.2 Rewrite the explainer content on every remaining tool page
Right now every page uses the same 4-block template:
> *What is an X? → How to use → Key Features → FAQ*

This is exactly what gets flagged as "scaled / templated content." Replace it with **unique, specific, human-written content per tool**. For each tool, aim for ~600–900 words covering:
- A specific real-world problem someone has (e.g., "You exported a 4MB hero image from Figma and your Lighthouse score tanked. Here's how to fix that in 30 seconds.")
- A worked example with **real numbers** (input file 3.2MB → output 412KB at quality 80) — this is "Information Gain" and Google rewards it.
- A screenshot or short loom of the tool actually being used on a real file.
- 2–3 *honest* limitations of your tool (when NOT to use it, when to use a paid alternative). Honesty signals trustworthiness.
- A "behind the scenes" paragraph: what library / algorithm / API the tool uses (e.g., "We use the browser's native Canvas `toBlob()` with progressive JPEG encoding"). This proves expertise.
- **No FAQ block on every page.** FAQs only where they add real info. Generic FAQs are a templating signal.

### [ ] 2.3 Kill the uniform AI-style voice
Phrases that appear on multiple pages and need to die:
- *"Open free"*, *"100% free, no signup, instant results"*, *"Your files stay private"*, *"By utilizing the HTML5 Canvas API"*, *"Instant processing"*, *"100% Privacy Focused"*.
- Replace boilerplate with specific, varied phrasing per page. If two tool pages read in the same rhythm, rewrite one.
- Rule of thumb: open any two random tool pages side by side. If a stranger could tell they were written by the same template, keep editing.

### [ ] 2.4 Add E-E-A-T signals to every tool page
- "Last tested on [date] with [browser/version]" — and actually update it.
- "Built by [your real name]" with a link to an author page.
- If the tool uses an open-source library, credit it with a link (e.g., "Powered by pdf-lib v1.17").

---

## Priority 3 — Trust & identity (E-E-A-T)

### [ ] 3.1 Create a real Author / Team page with a real human
- Use your actual name (or a real pseudonym you use publicly elsewhere).
- Add a photo (your real photo or a professional avatar).
- Link to LinkedIn, GitHub, or X / Twitter — at least one real, established profile.
- Write a 200–300 word bio: who you are, why you built this, what your background is.
- AdSense reviewers explicitly look for this.

### [ ] 3.2 Replace the Gmail contact with a domain email
- `contact@thefreeaitools.com` → `hello@thefreeaitools.com` or `contact@thefreeaitools.com`.
- A Gmail address on a site applying for AdSense is a yellow flag.

### [ ] 3.3 Rewrite the About page with specifics
Current About says *"started by an independent web product builder"* — too vague.
- Name yourself.
- Say *where* you are (Morocco is fine and credible).
- Say *when* the site launched and what it's grown to.
- Add 1–2 specific stories: a tool you built because of a specific personal need.

### [ ] 3.4 Verify the Privacy, Terms, Disclaimer, Acceptable Use pages have real content
- Each must be at least 400–600 words, **not** boilerplate copy-pasted from a generator.
- Privacy policy must specifically name: AdSense, any analytics (GA4?), any AI APIs you call from the tools, what data each tool sends server-side vs client-side, and how to contact you for data requests.
- This is a hard AdSense requirement, not optional.

---

## Priority 4 — Language / Arabic question

### [ ] 4.1 Resolve the "Arabic" issue you mentioned
You mentioned "Arabic" in connection with the rejection — please check which of these applies and fix accordingly:
- **(a) The site has an Arabic version** (e.g., `/ar/...` routes): if those pages are machine-translated or sparse, **delete them or `noindex` them** until you can hand-translate properly. Machine-translated localizations are a known AdSense rejection trigger.
- **(b) The site declares Arabic via `hreflang` but has no Arabic pages**: remove the `hreflang` tags. Mismatched language signals confuse the reviewer.
- **(c) You meant something else** — note it here and address it.

### [ ] 4.2 Standardize language metadata
- `<html lang="en">` everywhere unless you genuinely serve other languages.
- `og:locale` should match.
- If you do serve multiple languages, each needs its own hand-written content, not auto-translation.

---

## Priority 5 — Blog content

### [ ] 5.1 Audit the `/blog` section
The blog currently has 3 posts referenced from the footer:
- "How to Format JSON Online Without Installing Anything"
- "Compress Images for Faster Pages Without Losing Workflow Speed"
- "robots.txt and Sitemap Basics for Small Sites"

This is likely too thin and too tool-focused. For AdSense:
- Get to **at least 15 blog posts** before re-applying.
- Each post: **1,500+ words**, with original screenshots, real examples, and a clear personal voice.
- Topics should be useful even to someone who never uses your tools (e.g., "What I learned compressing 12,000 images for an e-commerce client" — story-based).
- Do not auto-generate. If you use AI to draft, rewrite heavily in your own voice and add your own data.

### [ ] 5.2 Date and update each blog post visibly
- Show "Published" and "Last updated" dates.
- Reviewers value freshness.

---

## Priority 6 — Technical SEO hygiene

### [ ] 6.1 Run a full crawl with Screaming Frog (free up to 500 URLs) or Sitebulb
Check for and fix:
- 404s referenced from the sitemap
- Pages with under 300 words of unique text (this is the "thin content" trigger)
- Duplicate `<title>` and meta-description across pages
- Missing canonical tags
- Orphan pages (no internal links pointing to them)

### [ ] 6.2 Submit a fresh sitemap to Google Search Console
- After deletions in 1.2 and 2.1, regenerate `sitemap.xml`.
- Submit it in Search Console and request indexing of the new homepage.

### [ ] 6.3 Verify Core Web Vitals are green in Search Console
- LCP < 2.5s, INP < 200ms, CLS < 0.1.
- A tool directory must load fast or it screams "thin." Especially homepage.

### [ ] 6.4 Make sure the site is fully crawlable
- `robots.txt` doesn't block `/tools/*`.
- No tool page is behind JS-only rendering that Googlebot can't see — server-render the explainer content.

---

## Priority 7 — Before you re-apply (final checklist)

### [ ] 7.1 Wait at least 30 days after completing items 1–6
Re-applying too quickly is a real reason for repeat rejections. Google needs time to re-crawl.

### [ ] 7.2 Spot-check 10 random tool pages
- Open them in incognito.
- Read each as a stranger would.
- Each one must answer: "Why would I bookmark this instead of going to the 5th result on Google?"
- If you can't answer that in one sentence, that page isn't ready.

### [ ] 7.3 Get a second pair of eyes
- Post the site in r/SEO or r/juststart on Reddit and ask for an AdSense-readiness audit.
- Or ask a friend who's never seen it to use 3 tools and tell you their honest impression.

### [ ] 7.4 Re-apply only when you'd happily put your real name on the homepage
That's the bar.

---

## Summary: the three things that matter most

If you only do three things from this list, do these:

1. **Rewrite the templated explainer/FAQ blocks on every tool page** — kill the AI-template feel. (Priority 2.2, 2.3)
2. **Delete the doorway-style keyword lists from the homepage** — the "Popular searches" and "Common tasks" sections. (Priority 1.3, 1.4)
3. **Become a real, named person on your own site** — author page, real photo, domain email, specific bio. (Priority 3)

Do those three, wait 4–6 weeks, and apply again. That's your highest-probability path to approval.

---

*Generated 25 May 2026.*