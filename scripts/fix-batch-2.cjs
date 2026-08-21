const fs = require('fs');

function replaceArticle(filePath, newArticle) {
  const content = fs.readFileSync(filePath, 'utf8');
  const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
  if (techIdx === -1) { console.log('SKIP (no TechArticle):', filePath); return; }
  const articleStart = content.lastIndexOf('<article', techIdx);
  const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;
  const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Done:', filePath, '| lines:', newContent.split('\n').length);
}

// ─── Regex Tester ─────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/regex-tester/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Regex Tester: Live Pattern Matching with Real Test Cases" />
          <meta itemProp="description" content="Test regex patterns against live input with match highlighting. Includes the 5-step workflow to avoid silent production bugs." />
          <meta itemProp="datePublished" content="2024-02-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="regex-problem" className="space-y-4">
            <h2 id="regex-problem" className="text-2xl font-semibold tracking-tight text-foreground">
              The silent failure problem with regex
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most code errors announce themselves — a null reference, a type mismatch, a
              failed build. Regex errors are silent. A pattern that is slightly wrong may
              match 99% of inputs correctly and fail only on edge cases: international phone
              formats, email addresses with plus signs, URLs with query strings. These cases
              show up from real users in production, not in unit tests written by the
              developer who designed the pattern.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              I wrote about a specific case in{' '}
              <a href="/blog/regex-testing-workflow" className="text-black  dark:text-white hover:underline">
                How I Test Regex Before It Breaks Production
              </a>
              {' '}— a phone validator that silently rejected every Moroccan number (+212XXXXXXXXX)
              for two months because the length range was off by one. The fix was one
              character. The tool here would have caught it in 30 seconds if I&apos;d tested the
              edge case before shipping.
            </p>
          </section>

          <section aria-labelledby="regex-workflow" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="regex-workflow" className="text-2xl font-semibold tracking-tight text-foreground">
              The three test categories every regex needs
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Before shipping any regex, test three categories of strings — not just
              strings you expect to match:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Happy path</span>
                <span>5–10 strings that should match. If any fail, the pattern is wrong.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Rejection cases</span>
                <span>Strings that should NOT match. If any slip through, the pattern is too permissive.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Edge cases</span>
                <span>
                  Strings that could go either way — decide your intent first, then verify the
                  pattern behaves accordingly. This is where most bugs hide.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Also test for catastrophic backtracking: nested quantifiers like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">(a+)+</code> can cause
              exponential slowdown on certain inputs. Paste a 50-character string that partially
              matches but ultimately fails — if the match takes more than 100 ms, you have a
              ReDoS vulnerability.
            </p>
          </section>

          <section aria-labelledby="regex-flags" className="space-y-4">
            <h2 id="regex-flags" className="text-2xl font-semibold tracking-tight text-foreground">
              The flags that change behavior in non-obvious ways
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">m (multiline)</span>
                <span>
                  Makes <code className="text-xs bg-muted px-1 py-0.5 rounded">^</code> and{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">$</code> match the
                  start/end of each line, not the whole string. A validator with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">^...$</code> and the{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">m</code> flag will
                  accept multiline input when it shouldn&apos;t.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">s (dotAll)</span>
                <span>
                  Makes <code className="text-xs bg-muted px-1 py-0.5 rounded">.</code> match
                  newlines. Without this flag, a pattern designed to match &quot;any character&quot;
                  stops at line breaks.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">u (Unicode)</span>
                <span>
                  Enables proper handling of Unicode code points above U+FFFF (emoji, certain
                  scripts). Without it, emoji and some international characters can cause
                  unexpected behavior in character class ranges.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "Cron Expression Parser", path: "/tools/cron-parser" },
                  { name: "JWT Decoder", path: "/tools/jwt-decoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ─── SQL Formatter ────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/sql-formatter/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="SQL Formatter: Make ORM-Generated Queries Readable" />
          <meta itemProp="description" content="Format raw SQL to find bugs hidden in JOIN types, WHERE vs HAVING confusion, and N+1 query patterns. Real debugging workflow included." />
          <meta itemProp="datePublished" content="2024-03-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="sql-problem" className="space-y-4">
            <h2 id="sql-problem" className="text-2xl font-semibold tracking-tight text-foreground">
              Unformatted SQL is where bugs hide
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              ORMs generate SQL that is logically correct but visually opaque. A query that
              takes 8 seconds might be doing a full table scan because of a missing index, or
              joining in the wrong order, or applying a WHERE filter after an aggregation when
              HAVING was needed. None of these are obvious in a 400-character single-line
              string. Formatted, they&apos;re visible in 10 seconds.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              I described a real debugging session in{' '}
              <a href="/blog/sql-formatting-database-debugging" className="text-black  dark:text-white hover:underline">
                SQL Formatting as a Debugging Tool
              </a>
              {' '}— where formatting an ORM-generated query immediately revealed a LEFT JOIN
              that should have been an INNER JOIN, causing thousands of extra rows to be
              loaded and then filtered in application code. The fix was one word.
            </p>
          </section>

          <section aria-labelledby="sql-bugs" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="sql-bugs" className="text-2xl font-semibold tracking-tight text-foreground">
              Three bugs that formatting makes instantly visible
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Wrong JOIN type</span>
                <span>
                  A LEFT JOIN returns all rows from the left table, including rows with no
                  match on the right — those get NULL values. An INNER JOIN returns only
                  matched rows. ORMs sometimes generate LEFT JOINs when INNER was intended
                  (or vice versa). When formatted, the JOIN keyword is on its own line and
                  easy to spot and change.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">WHERE vs HAVING</span>
                <span>
                  WHERE filters rows before aggregation; HAVING filters after. Using WHERE on
                  an aggregated column causes an error; using HAVING when WHERE was intended
                  causes incorrect counts. Formatted SQL puts these on separate lines with
                  clear indentation of the conditions below each.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">N+1 patterns</span>
                <span>
                  A subquery in the SELECT list that references the outer query runs once per
                  row — the N+1 problem. Formatted SQL makes correlated subqueries visible as
                  indented blocks inside each SELECT column, not buried in a flat string.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="sql-tech" className="space-y-4">
            <h2 id="sql-tech" className="text-2xl font-semibold tracking-tight text-foreground">
              How it formats — and what dialect to pick
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The formatter uses the{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">sql-formatter</code>{' '}
              library (MIT license) to parse and re-indent SQL according to a consistent style.
              Dialect selection matters: PostgreSQL uses{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">::</code> for casting while
              MySQL uses{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">CAST(x AS type)</code>.
              BigQuery uses backtick identifiers. Pick the dialect that matches your database
              so the formatter handles the edge cases correctly.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              All formatting runs in the browser — your SQL, which may contain table names,
              column data, or proprietary business logic, never leaves your device.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "CSV to JSON Converter", path: "/tools/csv-to-json" },
                  { name: "Base64 Encoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ─── JWT Decoder ──────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/jwt-decoder/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="JWT Decoder: Read Token Payloads Without a Library" />
          <meta itemProp="description" content="Decode JWT headers and payloads in the browser. Explains the three-part structure, what fields to check when debugging auth, and what the tool can't verify." />
          <meta itemProp="datePublished" content="2024-02-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="jwt-problem" className="space-y-4">
            <h2 id="jwt-problem" className="text-2xl font-semibold tracking-tight text-foreground">
              What the token actually contains
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A JWT is three Base64url-encoded chunks separated by dots: a header, a payload,
              and a signature. The header and payload are readable by anyone — they&apos;re not
              encrypted, just encoded. The signature is what proves authenticity, and it
              requires the server&apos;s secret key to verify.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              When an auth bug goes dark — a 401 that shouldn&apos;t be happening, a user who
              can&apos;t access a resource they should have permission for — the first step is
              reading what&apos;s actually in the token. I wrote about this in{' '}
              <a href="/blog/reading-jwt-tokens-without-a-library" className="text-black  dark:text-white hover:underline">
                Reading JWT Tokens Without a Library
              </a>
              {' '}— you can decode any token in 10 seconds with just a browser.
            </p>
          </section>

          <section aria-labelledby="jwt-fields" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="jwt-fields" className="text-2xl font-semibold tracking-tight text-foreground">
              Fields to check when debugging auth
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Field</th>
                    <th className="border border-border p-2 text-left font-semibold">What it means</th>
                    <th className="border border-border p-2 text-left font-semibold">What to check</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['exp', 'Expiry time (Unix timestamp)', 'Is it in the past? Compare to Date.now() / 1000'],
                    ['iat', 'Issued at time', 'Is it suspiciously old or in the future?'],
                    ['iss', 'Issuer', 'Does it match the expected auth server?'],
                    ['aud', 'Audience', 'Does it include your API/service?'],
                    ['sub', 'Subject (user ID)', 'Is it the correct user?'],
                    ['scope / roles', 'Permissions granted', 'Does it include the required scope for this endpoint?'],
                    ['alg (header)', 'Signing algorithm', 'Is it RS256 or HS256? Never "none"'],
                  ].map(([field, meaning, check]) => (
                    <tr key={field}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{field}</td>
                      <td className="border border-border p-2 text-muted-foreground">{meaning}</td>
                      <td className="border border-border p-2 text-muted-foreground">{check}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="jwt-limits" className="space-y-4">
            <h2 id="jwt-limits" className="text-2xl font-semibold tracking-tight text-foreground">
              What this tool does NOT do
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Signature verification</span>
                <span>
                  This tool decodes the header and payload — it does not verify the signature.
                  You need the server&apos;s public key (for RS256) or shared secret (for HS256) to
                  verify authenticity. Never trust a JWT&apos;s claims without verifying the
                  signature on the server.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">JWE (encrypted tokens)</span>
                <span>
                  JWE tokens are encrypted, not just signed. They look like 5-part strings
                  (4 dots). This tool decodes JWS (signed) tokens only — JWE will not decode
                  meaningfully.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              The decoder runs entirely in your browser. Your tokens — which may contain user
              IDs, scopes, and session data — never leave your device.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related security tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "Password Generator", path: "/tools/password-generator" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ─── Base64 Encoder ───────────────────────────────────────────────────────────
replaceArticle('src/app/tools/base64-encoder/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Base64 Encoder/Decoder: What It Does and When to Use It" />
          <meta itemProp="description" content="Base64 is not encryption — it's encoding for safe text transmission. Explains HTTP Basic Auth, JWT structure, email attachments, and honest limitations." />
          <meta itemProp="datePublished" content="2024-01-25" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="base64-what" className="space-y-4">
            <h2 id="base64-what" className="text-2xl font-semibold tracking-tight text-foreground">
              What Base64 actually does — and what it doesn&apos;t
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Base64 converts binary data into a string of 64 printable ASCII characters
              (A–Z, a–z, 0–9, +, /). It exists because many transport protocols — email,
              HTTP headers, URLs — were designed for text and can&apos;t safely carry arbitrary
              binary bytes. Base64 solves a transmission problem, not a security problem.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Critically, Base64-encoded data is not encrypted. Anyone with the encoded string
              can reverse it in one step:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">atob(encodedString)</code>{' '}
              in any browser console. If you see something that looks like a long string of
              random letters and ends with{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">=</code> or{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">==</code>, it&apos;s probably
              Base64. Paste it here and decode it. I wrote about this in{' '}
              <a href="/blog/base64-is-not-encryption" className="text-black  dark:text-white hover:underline">
                Base64 Is Not Encryption
              </a>
              {' '}— a mistake I see in code reviews regularly.
            </p>
          </section>

          <section aria-labelledby="base64-uses" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="base64-uses" className="text-2xl font-semibold tracking-tight text-foreground">
              Where Base64 is legitimately used
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">HTTP Basic Auth</span>
                <span>
                  The{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Authorization: Basic ...</code>{' '}
                  header contains{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">username:password</code>{' '}
                  Base64-encoded. It is not secure on its own — use only over HTTPS. Decode
                  it here to inspect what credentials a request is actually sending.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">JWT structure</span>
                <span>
                  JWT tokens are three Base64url-encoded segments separated by dots. The
                  header and payload are plain JSON encoded in Base64url (a variant that uses{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">-</code> and{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">_</code> instead of{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">+</code> and{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/</code>).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Inline images in HTML/CSS</span>
                <span>
                  Small icons and images can be embedded directly as{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">data:image/png;base64,...</code>{' '}
                  URIs to avoid extra HTTP requests. Useful for small UI elements where
                  the encoded size is under ~2 KB.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Email attachments (MIME)</span>
                <span>
                  Email attachments are encoded as Base64 inside the MIME envelope. This is
                  why encoded attachments are ~33% larger than the original file — Base64
                  expands 3 bytes into 4 characters.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="base64-limits" className="space-y-4">
            <h2 id="base64-limits" className="text-2xl font-semibold tracking-tight text-foreground">
              When Base64 is the wrong tool
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Storing passwords</span>
                <span>Use bcrypt, scrypt, or Argon2 — one-way hashing functions designed for passwords. Base64 is trivially reversible.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Hiding API keys</span>
                <span>Base64 in source code or config files provides zero security. Anyone who reads the file can decode it in seconds.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Large file encoding</span>
                <span>Base64 adds ~33% overhead. For files over a few KB, use binary transfer protocols (multipart form upload, binary WebSocket) instead.</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "JWT Decoder", path: "/tools/jwt-decoder" },
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "URL Encoder / Decoder", path: "/tools/url-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll batch-2 rewrites complete.');
