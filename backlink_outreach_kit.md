# Backlink & Distribution Kit — thefreeaitools.com

**Why this file exists:** Your on-page SEO is done. Per every audit, the remaining
bottleneck is **domain authority / backlinks** (≈80% of the gap to higher traffic).
That work is manual and off-site — it cannot be coded. This kit makes it fast:
copy-paste-ready submissions so you can earn the first backlinks this week.

**Golden rule:** submit your *best individual tools*, not the homepage. A specific,
genuinely-useful tool earns links and upvotes; a generic "directory" does not.

---

## 0. Do these 5 first (free, high-authority, 30 min total)

| Directory | URL | Notes |
|-----------|-----|-------|
| AlternativeTo | https://alternativeto.net/ | Add each flagship tool as an alternative to TinyPNG, JSONFormatter, etc. |
| There's An AI For That | https://theresanaiforthat.com/submit/ | Submit the AI tools (detector, image gen, paraphraser) |
| Futurepedia | https://www.futurepedia.io/submit-tool | Submit 2–3 AI tools |
| SaaSHub | https://www.saashub.com/submit | Free listing + backlink |
| Toolify.ai | https://www.toolify.ai/submit | AI tool directory, dofollow |

These are the directories already referenced in your Organization schema `sameAs`.
Getting actually listed makes those structured-data claims true.

---

## 1. Show HN (Hacker News) — your single best shot at a traffic spike

Pick ONE tool that is genuinely best-in-class. Strongest candidates given your
unique content: **Image Compressor**, **JSON Formatter**, or **Word Counter**.

**Title (HN format — no hype, no emoji):**
```
Show HN: A browser-based image compressor that never uploads your files
```

**First comment (post immediately after submitting):**
```
I built this because every "free image compressor" either uploads your photo to
a server or buries the result in ads. This one runs entirely in the browser with
the Canvas API — the image never leaves your device. You can watch the file size
update live as you change quality.

A few specifics:
- A typical 3.2 MB phone photo drops to ~400 KB at quality 80 with no visible loss
- Supports JPEG, PNG, and WebP; WebP is ~25–35% smaller at the same quality
- Resize-before-compress is built in (the biggest lever most tools skip)
- No account, no upload, no limit

Tech: Next.js, client-side Canvas/WebCodecs. Happy to answer questions about the
compression approach or why I kept it 100% client-side.

https://www.thefreeaitools.com/tools/image-compressor
```

**Timing:** post Tuesday–Thursday, ~8–10am US Eastern. Reply to every comment.

---

## 2. Reddit — value first, link last (or you'll be removed)

Never drop a bare link. Answer a real question, then mention the tool as one option.

**Subreddits that allow helpful tool mentions:**
- r/webdev, r/web_design (dev tools)
- r/InternetIsBeautiful (genuinely useful single-purpose tools — strict, high reward)
- r/coolguides, r/productivity (the blog posts)
- r/SideProject, r/IMadeThis (you built it — allowed)

**Template reply (paste into a relevant thread, adapt the first line):**
```
For this you don't need to install anything — you can do it in the browser.
I run into this a lot, so here's the workflow I use: [1–2 sentences of real,
specific advice]. If it helps, there's a free tool that does exactly this
without an account or upload: [tool URL]. (Disclosure: I built it.)
```

**r/SideProject launch post:**
```
Title: I built 200+ free browser tools that never upload your data — feedback welcome

Body: Over the last ~3 years I built a directory of free, no-signup tools that all
run client-side (JSON formatter, image compressor, QR generator, etc.). The angle:
your files and text never leave your browser. I'd love feedback on which tools are
actually useful vs. filler — I recently pruned the weak ones. Link in comments.
```

---

## 3. Quora — answer, don't advertise

Search Quora for questions your tools answer, then write a genuinely useful answer
ending with the tool. Target questions like:
- "What's the best free way to compress an image without losing quality?"
- "How do I format JSON online without uploading sensitive data?"
- "Is there a free PDF to Word converter without signup?"

Each answer = a contextual backlink + recurring referral traffic for years.

---

## 4. Guest posts / mentions (authority — 2–3/month)

Pitch a useful article (not a promo) to dev/productivity blogs and newsletters.
Your blog posts are the proof you can write — reuse those angles.

**Cold pitch email template:**
```
Subject: Guest post idea: "Base64 is not encryption" (for [Blog])

Hi [Name],

I write about browser-based developer tools at thefreeaitools.com. I noticed [Blog]
covers [topic] — I'd like to contribute a practical, vendor-neutral piece:

"[Working title]" — [one line on the concrete value, e.g. the 3 semantic traps when
porting Python to JavaScript].

It's hands-on with real examples, no product pitch. I'd link one relevant free tool
where it genuinely helps the reader, nothing more. Happy to send a draft on spec.

— Achraf
```

**Targets:** dev.to (republish your own posts with canonical), Hashnode, Medium
publications, Morocco/Francophone tech blogs, small dev newsletters.

---

## 5. Repurpose the blog into distribution

You have 18 blog posts. Each one is a distribution asset:
- Cross-post to dev.to / Hashnode with a `canonical` URL back to your post (safe, no
  duplicate-content penalty, earns a referral link).
- Turn the "real numbers" posts (image compression, box-shadow) into an X/LinkedIn
  thread with the chart/table, link at the end.
- The 3 new long-tail posts (PDF summary, Python→JS, image-under-100KB) are designed
  to rank for low-competition queries — make sure they're indexed in Search Console.

---

## 6. Weekly cadence (realistic, ~3 hrs/week)

| Day | Task | Time |
|-----|------|------|
| Mon | Submit 1 tool to 1 directory | 15 min |
| Tue | 1 Show HN or 1 r/SideProject-style post | 30 min |
| Wed | Answer 2 Reddit/Quora questions with a tool mention | 45 min |
| Thu | 1 new long-tail blog post (ask me to write it) | — |
| Fri | 1 guest-post pitch | 20 min |

**Realistic expectation (matches the diagnosis):** consistent backlink work compounds
over ~6 months. There is no shortcut and no on-page edit that substitutes for it.

---

## 7. Track it (free)

- **Google Search Console** — submit the (now blog-inclusive) sitemap; watch
  Impressions & Average Position per query. This is your real scoreboard.
- **Bing Webmaster Tools** — free, easy, extra traffic.
- A simple spreadsheet: date · platform · URL submitted · live link Y/N.

---

### What I (the codebase side) can keep doing
- Write more long-tail blog posts targeting specific low-competition queries.
- Make individual high-intent tool pages even stronger.
Everything else in this kit is manual and yours — but it's the part that actually
moves rankings.
