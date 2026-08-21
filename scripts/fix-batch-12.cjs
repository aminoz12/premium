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

// ── 1. bcrypt-generator ───────────────────────────────────────────────────────
replaceArticle('src/app/tools/bcrypt-generator/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Bcrypt Generator: Cost Factor, Salt, and Why Identical Passwords Hash Differently" />
          <meta
            itemProp="description"
            content="How bcrypt's salt prevents rainbow table attacks, why the same password produces a different hash every time, and how to pick the right cost factor for your server."
          />
          <meta itemProp="datePublished" content="2024-03-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why identical passwords hash differently */}
          <section aria-labelledby="salt-explanation" className="space-y-4">
            <h2
              id="salt-explanation"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why the same password produces a different hash every time
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Every bcrypt hash includes a randomly generated 128-bit salt embedded
              directly in the output string. When you hash the password{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">hunter2</code>{' '}
              twice, you get two completely different 60-character strings — but both
              verify correctly against the original password. The salt is stored
              inside the hash output itself, so you never need to store it separately.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The salt defeats precomputed rainbow table attacks. Without a salt, an
              attacker with a table of pre-hashed common passwords can look up{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">hunter2</code>{' '}
              instantly. With a unique salt per hash, they would need a separate table
              for every possible salt — computationally infeasible. This is why bcrypt
              hashes from this tool are safe to store even if your database is breached,
              provided the cost factor is high enough.
            </p>
          </section>

          {/* Cost factor guide */}
          <section
            aria-labelledby="cost-factor"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="cost-factor"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Choosing the right cost factor
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The cost factor (rounds) doubles the computation time for each increment.
              Cost 10 takes ~100 ms on a modern server CPU. Cost 12 takes ~400 ms.
              Cost 14 takes ~1.6 seconds. The OWASP recommendation for new systems in
              2026 is cost factor 10 minimum — enough to limit an attacker with a
              stolen database to roughly 10,000 attempts per second per GPU, compared
              to billions per second for unsalted SHA-256.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Cost factor</th>
                    <th className="border border-border p-2 text-left font-semibold">Time on modern server</th>
                    <th className="border border-border p-2 text-left font-semibold">Use when</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['10', '~100 ms', 'Default — OWASP minimum, good for most web apps'],
                    ['11', '~200 ms', 'Slightly stricter, still fast enough for login flows'],
                    ['12', '~400 ms', 'High-security apps, acceptable if login UX allows'],
                    ['13', '~800 ms', 'Financial or healthcare apps with infrequent logins'],
                    ['14+', '1.6 s+', 'Specialized high-security systems — test UX carefully'],
                  ].map(([cost, time, use]) => (
                    <tr key={cost}>
                      <td className="border border-border p-2 font-mono font-bold text-foreground">{cost}</td>
                      <td className="border border-border p-2 text-muted-foreground">{time}</td>
                      <td className="border border-border p-2 text-muted-foreground">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reading the hash string */}
          <section aria-labelledby="hash-anatomy" className="space-y-4">
            <h2
              id="hash-anatomy"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Anatomy of a bcrypt hash string
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A bcrypt output like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                $2b$12$LQv3c1yqBwEHxPvonuf.eOTI.CVLBPZc5BCHQukO0p5Y3UQPOpvAi
              </code>{' '}
              encodes three things:{' '}
              <strong>$2b$</strong> = algorithm version (2b is current),{' '}
              <strong>12$</strong> = cost factor, and the remaining 53 characters
              contain the 128-bit salt (22 chars) followed by the 184-bit hash (31 chars),
              both encoded in a modified Base64. The full string is self-contained —
              you pass it directly to{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">bcrypt.compare()</code>{' '}
              along with the candidate password to verify.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related security tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Password Generator", path: "/tools/password-generator" },
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "SHA-256 Hash Generator", path: "/tools/sha256-hash" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. cursive-text-generator ─────────────────────────────────────────────────
replaceArticle('src/app/tools/cursive-text-generator/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Cursive Text Generator: How Unicode Lookalike Characters Work and Where They Break" />
          <meta
            itemProp="description"
            content="Why cursive text generators use Unicode mathematical symbols rather than actual fonts, where the output works and where it breaks, and the accessibility problem."
          />
          <meta itemProp="datePublished" content="2024-03-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why this isn&apos;t a real font — and why that matters
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Cursive and decorative text generators don&apos;t apply a font. They replace
              standard Latin letters with visually similar characters from Unicode
              mathematical symbol blocks — for example, the script capital A (&#x1D49C;)
              is Unicode code point U+1D49C, a mathematical symbol that happens to look
              like a decorative A. The output is plain text made of these substitute
              characters, which is why it copies and pastes into Instagram bios, Twitter
              profiles, and Discord usernames where custom fonts are not supported.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The limitation: these characters only exist for basic Latin letters (A–Z,
              a–z) and digits. Punctuation, accented characters (é, ñ, ü), and non-Latin
              scripts have no mathematical symbol equivalents and will appear as standard
              characters or question marks in the output.
            </p>
          </section>

          {/* Where it works and breaks */}
          <section
            aria-labelledby="where-works"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="where-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Where the output works — and where it breaks
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform / context</th>
                    <th className="border border-border p-2 text-left font-semibold">Works?</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Instagram bio', 'Yes', 'Instagram renders Unicode mathematical symbols correctly'],
                    ['Twitter/X display name', 'Yes', 'Username field only allows ASCII; display name allows Unicode'],
                    ['Discord username/bio', 'Yes', 'Full Unicode support in display fields'],
                    ['TikTok bio', 'Yes', 'Unicode supported in bio text'],
                    ['Email subject line', 'Partial', 'Most modern clients render it; some older clients show boxes'],
                    ['PDF documents', 'Depends on font', 'Only if the embedded font includes the Unicode math block'],
                    ['HTML title tag', 'No — avoid', 'Search engines read it as mathematical symbols, hurts SEO'],
                    ['Accessibility / screen readers', 'Breaks', 'Read as "mathematical script capital A" not "A" — unintelligible'],
                  ].map(([platform, works, notes]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 text-muted-foreground">{platform}</td>
                      <td className={'border border-border p-2 font-medium ' + (works === 'Yes' ? 'text-green-600' : works === 'No — avoid' ? 'text-red-600' : 'text-yellow-600')}>{works}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Accessibility warning */}
          <section aria-labelledby="accessibility" className="space-y-4">
            <h2
              id="accessibility"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The accessibility problem
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Screen readers (used by blind and low-vision users) read Unicode mathematical
              symbols by their official Unicode name, not by their visual appearance.
              The script letter &#x1D49C; is announced as &quot;mathematical script capital A,&quot;
              not &quot;A.&quot; A bio written in cursive Unicode reads as a string of long
              mathematical symbol names — completely unintelligible. For accessibility,
              limit decorative Unicode text to decorative contexts where the information
              is also conveyed in plain text, and never use it for content that must
              be understood by all users.
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
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                  { name: "Word Counter", path: "/tools/word-counter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. generate-chart ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/generate-chart/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Chart Generator: Which Chart Type Fits Your Data and Which Misleads" />
          <meta
            itemProp="description"
            content="A practical guide to choosing between bar, line, pie, and scatter charts — and the three chart patterns that misrepresent data even when the numbers are accurate."
          />
          <meta itemProp="datePublished" content="2024-04-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Chart type selection */}
          <section aria-labelledby="chart-selection" className="space-y-4">
            <h2
              id="chart-selection"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Choosing the right chart type for your data
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Chart type</th>
                    <th className="border border-border p-2 text-left font-semibold">Best for</th>
                    <th className="border border-border p-2 text-left font-semibold">Don&apos;t use for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Bar chart (vertical)', 'Comparing discrete categories — revenue by product, users by country', 'Time series with many data points — use line chart'],
                    ['Line chart', 'Trends over time — monthly active users, temperature over a year', 'Unordered categories — use bar chart'],
                    ['Pie / donut chart', 'Part-to-whole with 2–5 slices and one slice clearly dominant', 'More than 5 categories, or when exact values matter'],
                    ['Scatter plot', 'Correlation between two variables — ad spend vs. revenue', 'Categorical data with no numeric relationship'],
                    ['Area chart', 'Volume over time, especially for stacked totals', 'Negative values — area below zero is visually confusing'],
                    ['Histogram', 'Distribution of a single variable — response times, age ranges', 'Comparing separate groups — use grouped bar chart'],
                  ].map(([chart, bestFor, avoid]) => (
                    <tr key={chart}>
                      <td className="border border-border p-2 font-medium text-foreground">{chart}</td>
                      <td className="border border-border p-2 text-muted-foreground">{bestFor}</td>
                      <td className="border border-border p-2 text-muted-foreground">{avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Three misleading patterns */}
          <section
            aria-labelledby="misleading-patterns"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="misleading-patterns"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three chart patterns that misrepresent data
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Truncated Y-axis</span>
                <span>
                  Starting a bar chart&apos;s Y-axis at 95 instead of 0 makes a 1% difference
                  look like a 100% difference visually. The bars appear to show a dramatic
                  change when the actual values are nearly identical. Y-axes for bar charts
                  should always start at zero. Line charts are more forgiving — a truncated
                  axis can legitimately show trend detail.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Pie charts with too many slices</span>
                <span>
                  A pie chart with 8 slices — especially when several are similar sizes —
                  makes it impossible to compare values. The human eye cannot judge angles
                  accurately for adjacent slices. Beyond 4–5 slices, group the smallest
                  values into &quot;Other&quot; or switch to a bar chart ranked by value.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Dual Y-axes implying correlation</span>
                <span>
                  Plotting two unrelated datasets on dual Y-axes can make them appear
                  correlated by adjusting the scale of each axis. A famous example: a
                  line showing ice cream sales and a line showing drowning deaths tracked
                  on separate scales — both peak in summer, but one doesn&apos;t cause the other.
                  Dual-axis charts are legitimate when the relationship is real and explained.
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
              Related data tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "CSV to JSON Converter", path: "/tools/csv-json-converter" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. generator-rex ──────────────────────────────────────────────────────────
replaceArticle('src/app/tools/generator-rex/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="AI Regex Generator: What to Test After Getting a Generated Pattern" />
          <meta
            itemProp="description"
            content="Why AI-generated regex patterns need systematic testing, the three test categories that catch silent failures, and the ReDoS risk in patterns with nested quantifiers."
          />
          <meta itemProp="datePublished" content="2024-04-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why generated patterns need testing */}
          <section aria-labelledby="why-test" className="space-y-4">
            <h2
              id="why-test"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why every generated regex pattern needs systematic testing
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              An AI-generated regex will match the examples you gave it — that&apos;s the
              easy part. What it often gets wrong: the boundaries. A pattern generated
              to match email addresses might accept{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">user@</code>{' '}
              (no domain) or reject{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">user+tag@example.co.uk</code>{' '}
              (valid but unusual format). The pattern works for the happy path you
              described and fails silently for real-world edge cases you didn&apos;t mention.
            </p>
          </section>

          {/* Three test categories */}
          <section
            aria-labelledby="test-categories"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="test-categories"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three test categories every regex pattern needs
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">1. Happy path</span>
                <span>
                  Your canonical valid examples — the inputs you gave the AI to generate
                  the pattern. These should all match. If any don&apos;t, the generation failed
                  immediately.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">2. Rejection cases</span>
                <span>
                  Inputs that must NOT match: near-misses, truncated versions, wrong
                  formats. For a phone number pattern, test{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">123</code>{' '}
                  (too short),{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">abc-def-ghij</code>{' '}
                  (letters), and an empty string. A pattern that matches everything
                  is not useful.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">3. Edge cases</span>
                <span>
                  The real-world variations your examples didn&apos;t cover: leading/trailing
                  whitespace, Unicode characters, maximum-length inputs, inputs with
                  only special characters. These are the cases that cause production bugs
                  months after deployment.
                </span>
              </li>
            </ul>
          </section>

          {/* ReDoS warning */}
          <section aria-labelledby="redos-warning" className="space-y-4">
            <h2
              id="redos-warning"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The ReDoS risk in AI-generated patterns
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              ReDoS (Regular Expression Denial of Service) occurs when a regex with
              nested quantifiers — patterns like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{'(a+)+'}</code>{' '}
              or{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{'(a|aa)+'}</code>{' '}
              — is given a carefully crafted input that causes exponential backtracking.
              A 50-character input can lock a Node.js server for seconds. AI-generated
              patterns occasionally produce these structures, especially for complex
              formats like email or URL validation. After generating a pattern, paste
              a 40–50 character string of repeated similar characters (e.g.,
              <code className="text-xs bg-muted px-1 py-0.5 rounded">aaaaaaaaaaaaaaaaaaaab</code>)
              and measure how long it takes to evaluate — if it hangs, the pattern
              is unsafe for production use.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "Error Message Solver", path: "/tools/error-message-solver" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nBatch 12 done (4 pages).');
