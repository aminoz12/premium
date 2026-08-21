const fs = require('fs');

function replaceArticle(filePath, newArticle) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('RelatedTools')) {
    const firstNL = content.indexOf('\n');
    content = content.slice(0, firstNL + 1) +
      'import { RelatedTools } from "@/components/tools/related-tools"\n' +
      content.slice(firstNL + 1);
  }
  const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
  const articleStart = content.lastIndexOf('<article', techIdx);
  const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;
  console.log(filePath + ': replacing ' + articleStart + '-' + articleEnd + ' of ' + content.length);
  const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Done. Lines: ' + newContent.split('\n').length);
}

// ── 1. case-converter ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/case-converter/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Text Case Converter: Which Case Convention to Use in Code and Content" />
          <meta
            itemProp="description"
            content="A practical reference for camelCase, snake_case, PascalCase, and kebab-case — which language or context each belongs to and why mixing them in a codebase causes silent bugs."
          />
          <meta itemProp="datePublished" content="2024-02-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Case convention reference */}
          <section aria-labelledby="convention-reference" className="space-y-4">
            <h2
              id="convention-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which case convention belongs where
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Convention</th>
                    <th className="border border-border p-2 text-left font-semibold">Example</th>
                    <th className="border border-border p-2 text-left font-semibold">Used in</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['camelCase', 'getUserById', 'JavaScript/TypeScript variables and functions, JSON keys in APIs'],
                    ['PascalCase', 'UserProfile', 'React components, TypeScript interfaces/types, class names'],
                    ['snake_case', 'user_profile_id', 'Python variables/functions, PostgreSQL column names, Ruby'],
                    ['SCREAMING_SNAKE', 'MAX_RETRY_COUNT', 'Constants in most languages, environment variables'],
                    ['kebab-case', 'user-profile', 'CSS classes, HTML attributes, URL slugs, file names'],
                    ['dot.case', 'app.settings.theme', 'Config keys (dotenv, properties files), namespace paths'],
                  ].map(([convention, example, usedIn]) => (
                    <tr key={convention}>
                      <td className="border border-border p-2 font-medium text-foreground">{convention}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{example}</td>
                      <td className="border border-border p-2 text-muted-foreground">{usedIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why mixing causes bugs */}
          <section
            aria-labelledby="mixing-bugs"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="mixing-bugs"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why mixing cases causes silent bugs
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The most common bug pattern: a REST API returns{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">user_id</code>{' '}
              (snake_case), your frontend code expects{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">userId</code>{' '}
              (camelCase), and the value silently becomes{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">undefined</code>.
              No error, no warning — just missing data. JavaScript property access is
              case-sensitive:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">obj.userId</code>{' '}
              and{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">obj.user_id</code>{' '}
              are different keys.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              CSS has the same issue in the opposite direction:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">className="userProfile"</code>{' '}
              won&apos;t match a stylesheet rule for{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">.user-profile</code>.
              Establish a convention per layer — API responses, database columns, frontend
              variables, CSS classes — and enforce it with a linter or code review
              checklist rather than relying on memory.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related text tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                  { name: "Word Counter", path: "/tools/word-counter" },
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. palindrome-checker ─────────────────────────────────────────────────────
replaceArticle('src/app/tools/palindrome-checker/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Palindrome Checker: How It Works and Why the Unicode Edge Cases Matter" />
          <meta
            itemProp="description"
            content="What counts as a palindrome, how the checker handles spaces and punctuation, and the Unicode characters that trip up naive implementations."
          />
          <meta itemProp="datePublished" content="2024-02-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How palindrome checking actually works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A palindrome reads the same forwards and backwards. The standard algorithm:
              normalize the string (lowercase, strip non-alphanumeric), then compare the
              string to its reverse. In JavaScript:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'s.toLowerCase().replace(/[^a-z0-9]/g, \'\') === s.toLowerCase().replace(/[^a-z0-9]/g, \'\').split(\'\').reverse().join(\'\')'}
              </code>.
              This is O(n) time and O(n) space. The two-pointer approach (compare characters
              from both ends moving inward) uses O(1) space if you normalize first.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Classic examples: &quot;racecar&quot;, &quot;A man a plan a canal Panama&quot;,
              &quot;Was it a car or a cat I saw&quot;. The normalization step is why these
              work — without stripping spaces and punctuation, &quot;A man...&quot; would
              fail a naïve check.
            </p>
          </section>

          {/* Unicode edge cases */}
          <section
            aria-labelledby="unicode-edge-cases"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="unicode-edge-cases"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Unicode characters that trip up naive implementations
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              JavaScript strings are UTF-16. Emoji and characters above U+FFFF (like
              many Chinese characters and math symbols) are stored as two code units
              called a surrogate pair.{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">.split(&apos;&apos;).reverse().join(&apos;&apos;)</code>{' '}
              splits on code units, not characters — it breaks surrogate pairs and
              produces garbage for any string containing emoji or extended Unicode.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The fix: use the spread operator{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">[...str].reverse().join(&apos;&apos;)</code>{' '}
              which iterates over Unicode code points correctly, or use{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">Intl.Segmenter</code>{' '}
              for languages with combining characters (Arabic, Thai, Hindi) where
              a single &quot;user-visible character&quot; may be multiple code points.
              This checker handles the common cases; for production text processing
              that must be Unicode-correct, use a dedicated library.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related text tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Word Counter", path: "/tools/word-counter" },
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. typing-speed-test ──────────────────────────────────────────────────────
replaceArticle('src/app/tools/typing-speed-test/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Typing Speed Test: WPM Scores Explained and How to Improve" />
          <meta
            itemProp="description"
            content="What WPM and accuracy scores actually measure, average typing speeds by role, and the two techniques that reliably improve speed without sacrificing accuracy."
          />
          <meta itemProp="datePublished" content="2024-03-14" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What WPM means */}
          <section aria-labelledby="what-wpm-means" className="space-y-4">
            <h2
              id="what-wpm-means"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What WPM actually measures
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Words Per Minute (WPM) is calculated by dividing the number of characters
              typed by 5 (the standard &quot;word length&quot; used universally), then dividing
              by the time in minutes. This means WPM is really a character rate, not a
              word count — short words inflate it, long technical words deflate it.
              Most typing tests use this standardized measure so scores are comparable
              across different text samples.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Accuracy is measured separately: the percentage of keystrokes that were
              correct. A raw WPM of 80 at 95% accuracy is a net WPM of roughly 72
              (subtracting errors as penalty words). A test that doesn&apos;t show accuracy
              separately is missing half the picture — fast but inaccurate typing is
              slower in practice because of backspacing.
            </p>
          </section>

          {/* Speed reference */}
          <section
            aria-labelledby="speed-reference"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="speed-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Typing speed benchmarks by role
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Role / context</th>
                    <th className="border border-border p-2 text-left font-semibold">Average WPM</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['General population', '40–50 WPM', 'Two-finger or self-taught typists'],
                    ['Office worker', '55–65 WPM', 'Regular email and document typing'],
                    ['Software developer', '60–75 WPM', 'Code typing is slower due to symbols and syntax'],
                    ['Professional typist', '70–90 WPM', 'Data entry, transcription roles'],
                    ['Top competitive typists', '130–180 WPM', 'TypeRacer / Monkeytype leaderboard range'],
                  ].map(([role, wpm, notes]) => (
                    <tr key={role}>
                      <td className="border border-border p-2 text-muted-foreground">{role}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{wpm}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to improve */}
          <section aria-labelledby="how-to-improve" className="space-y-4">
            <h2
              id="how-to-improve"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Two techniques that actually improve speed
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>1. Slow down to remove errors.</strong> Counterintuitively, the
              fastest path to higher WPM is slowing down until your accuracy reaches
              98%+. Muscle memory for correct keystrokes builds faster than muscle
              memory for wrong-then-backspace. Practice at a pace where you rarely
              make errors for 2–3 weeks before pushing speed.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>2. Practice your problem keys, not random text.</strong> Most
              speed losses come from 5–10 specific letter combinations. Identify which
              bigrams (two-letter sequences) slow you down most — often keys like
              &quot;qu&quot;, &quot;th&quot; on a QWERTY layout when reaching with the wrong finger —
              and drill those specifically rather than practicing full paragraphs.
              Tools like Keybr.com auto-detect your weak spots and weight practice
              sessions accordingly.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Word Counter", path: "/tools/word-counter" },
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                  { name: "Case Converter", path: "/tools/case-converter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. user-agent-parser ──────────────────────────────────────────────────────
replaceArticle('src/app/tools/user-agent-parser/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="User Agent Parser: What Browser Strings Actually Mean and Why They're Unreliable" />
          <meta
            itemProp="description"
            content="Why user agent strings look like a mess of contradictions, what you can and can't reliably detect from them, and the modern alternative that's more accurate."
          />
          <meta itemProp="datePublished" content="2024-04-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why UA strings are a mess */}
          <section aria-labelledby="why-mess" className="space-y-4">
            <h2
              id="why-mess"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why user agent strings look like contradictions
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A modern Chrome user agent looks like:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded text-wrap break-all">
                Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
              </code>.
              It claims to be Mozilla, Apple WebKit, and Safari — even though it&apos;s Chrome.
              This is historical: early browsers added &quot;Mozilla/5.0&quot; because web servers
              used that prefix to identify capable browsers. Every subsequent browser
              copied it to avoid being served degraded content. The pattern compounded
              over decades. Firefox says &quot;Gecko&quot;. Chrome says &quot;AppleWebKit&quot; and
              &quot;Safari&quot;. Edge says &quot;Chrome&quot; and &quot;Safari&quot;.
            </p>
          </section>

          {/* What to detect and what not to */}
          <section
            aria-labelledby="what-to-detect"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-to-detect"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What you can and can&apos;t reliably detect
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Reasonably reliable</span>
                <span>
                  Mobile vs. desktop (look for &quot;Mobile&quot; token), OS family (Windows / Mac /
                  Linux / Android / iOS), rendering engine (Gecko vs. WebKit vs. Blink).
                  These change slowly and are present in most real browsers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Unreliable</span>
                <span>
                  Exact browser version (easily spoofed), bot detection (good bots
                  identify themselves; bad bots fake Chrome), exact device model on
                  Android (fragmented across manufacturers).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Better alternative</span>
                <span>
                  For feature detection, use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">navigator.userAgentData</code>{' '}
                  (User-Agent Client Hints, available in Chrome/Edge). For feature support,
                  use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">CSS.supports()</code>{' '}
                  or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">if (&apos;fetch&apos; in window)</code>{' '}
                  — test the capability, not the browser identity.
                </span>
              </li>
            </ul>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "IP Lookup", path: "/tools/ip-lookup" },
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. image-to-base64 ────────────────────────────────────────────────────────
replaceArticle('src/app/tools/image-to-base64/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Image to Base64 Converter: Data URIs, When to Use Them, and When Not To" />
          <meta
            itemProp="description"
            content="What a Base64 data URI is, the 33% size overhead, and the specific cases where inlining images as Base64 actually helps vs. hurts performance."
          />
          <meta itemProp="datePublished" content="2024-02-26" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What a data URI is */}
          <section aria-labelledby="what-data-uri" className="space-y-4">
            <h2
              id="what-data-uri"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a Base64 data URI is
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A data URI embeds a file directly in a text document — HTML, CSS, or
              JSON — using Base64 encoding. Format:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                data:[mime-type];base64,[encoded-data]
              </code>.
              A 100 KB PNG becomes roughly 133 KB of Base64 text (the 3:4 encoding
              ratio adds 33% overhead). The browser decodes it in memory without a
              separate network request.
            </p>
          </section>

          {/* When to use and when not to */}
          <section
            aria-labelledby="when-to-use"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="when-to-use"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When Base64 images actually help — and when they hurt
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Good use: small icons in CSS</span>
                <span>
                  Inline a 200-byte SVG icon or a 1 KB spinner in your CSS to eliminate
                  a network round-trip. At this size, the 33% overhead is negligible
                  and avoiding a separate HTTP request saves real time on constrained
                  connections. Bundlers like webpack can auto-inline images below a
                  size threshold (typically 8 KB) for this reason.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Good use: HTML email images</span>
                <span>
                  Some email clients block externally hosted images by default.
                  Inlining critical images (logo, header) as Base64 ensures they
                  render without user interaction. Be aware: this increases the raw
                  email size, which can trigger spam filters on large inlined images.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Bad use: large images in web pages</span>
                <span>
                  A 500 KB hero image as Base64 in HTML is 667 KB of inline text.
                  It bloats the HTML document, defeats browser caching (the image
                  re-downloads with every page load instead of being cached separately),
                  and delays the first meaningful paint. Serve large images as separate
                  files from a CDN.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Bad use: storing in a database</span>
                <span>
                  Base64 images in a database column create oversized rows, make
                  indexing slower, and complicate backup/restore. Store image files
                  in object storage (S3, Cloudflare R2, Supabase Storage) and save
                  only the URL in the database.
                </span>
              </li>
            </ul>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Converter", path: "/tools/image-converter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');
