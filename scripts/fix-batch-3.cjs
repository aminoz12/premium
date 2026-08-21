const fs = require('fs');

function replaceArticle(filePath, newArticle) {
  if (!fs.existsSync(filePath)) { console.log('SKIP (not found):', filePath); return; }
  const content = fs.readFileSync(filePath, 'utf8');
  const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
  if (techIdx === -1) { console.log('SKIP (no TechArticle):', filePath); return; }
  const articleStart = content.lastIndexOf('<article', techIdx);
  const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;
  const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Done:', filePath, '| lines:', newContent.split('\n').length);
}

function ensureImport(filePath, importLine) {
  let c = fs.readFileSync(filePath, 'utf8');
  if (!c.includes("@/components/tools/related-tools")) {
    // Add after the first import statement
    c = c.replace(/^(import .+\n)/m, '$1' + importLine + '\n');
    fs.writeFileSync(filePath, c, 'utf8');
  }
}

// ─── Hash Generator ───────────────────────────────────────────────────────────
replaceArticle('src/app/tools/hash-generator/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Hash Generator: MD5, SHA-1, SHA-256, SHA-512 in the Browser" />
          <meta itemProp="description" content="Generate cryptographic hashes client-side. Explains what hashing is vs encryption, which algorithm to use, and honest limitations for each." />
          <meta itemProp="datePublished" content="2024-02-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="hash-what" className="space-y-4">
            <h2 id="hash-what" className="text-2xl font-semibold tracking-tight text-foreground">
              What hashing is — and why it&apos;s different from encryption
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Hashing is one-way: you can turn any input into a fixed-length digest, but
              you can&apos;t reverse the process. Encryption is two-way: you encrypt with a key
              and decrypt with a key. Hashing has no key — there is nothing to reverse with.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The practical consequence: if you hash a password and store the hash, you
              verify future logins by hashing the entered password and comparing the hashes.
              You never store the original password and never need it again. This is how
              secure authentication works. (Note: for passwords specifically, use bcrypt or
              Argon2 rather than SHA-256 — see the limitations section.)
            </p>
          </section>

          <section aria-labelledby="hash-which" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="hash-which" className="text-2xl font-semibold tracking-tight text-foreground">
              Which algorithm to use and when
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Algorithm</th>
                    <th className="border border-border p-2 text-left font-semibold">Output length</th>
                    <th className="border border-border p-2 text-left font-semibold">Good for</th>
                    <th className="border border-border p-2 text-left font-semibold">Avoid for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MD5', '128 bits (32 hex)', 'File integrity checksums (non-security)', 'Passwords, signatures, anything security-critical'],
                    ['SHA-1', '160 bits (40 hex)', 'Legacy checksums, Git commit IDs', 'New security applications (collision attacks exist)'],
                    ['SHA-256', '256 bits (64 hex)', 'File integrity, API request signing, token generation', 'Passwords (no work factor — use bcrypt)'],
                    ['SHA-512', '512 bits (128 hex)', 'When extra collision resistance is needed', 'Passwords (still too fast to brute-force)'],
                  ].map(([alg, len, good, avoid]) => (
                    <tr key={alg}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{alg}</td>
                      <td className="border border-border p-2 text-muted-foreground">{len}</td>
                      <td className="border border-border p-2 text-muted-foreground">{good}</td>
                      <td className="border border-border p-2 text-muted-foreground">{avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              The tool uses the Web Crypto API&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.subtle.digest()</code>{' '}
              — the browser&apos;s native, hardware-accelerated hash implementation. All processing
              is client-side; your input never leaves your device.
            </p>
          </section>

          <section aria-labelledby="hash-limits" className="space-y-4">
            <h2 id="hash-limits" className="text-2xl font-semibold tracking-tight text-foreground">
              When NOT to use SHA-256 for passwords
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              SHA-256 is very fast — modern GPUs can compute billions of SHA-256 hashes per
              second. For file integrity checks, this is fine. For passwords, it means an
              attacker with a GPU cluster can brute-force a SHA-256 password hash database
              in hours or days.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Password hashing functions like bcrypt, scrypt, and Argon2 are intentionally
              slow — they have a configurable work factor that makes each hash computation
              take 100ms or more. The same GPU that can compute billions of SHA-256 hashes
              per second can only compute thousands of bcrypt hashes per second. Use our{' '}
              <a href="/tools/bcrypt" className="text-black  dark:text-white hover:underline">Bcrypt tool</a>{' '}
              for password hashing.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related security tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Bcrypt Password Hasher", path: "/tools/bcrypt" },
                  { name: "Password Generator", path: "/tools/password-generator" },
                  { name: "Base64 Encoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);
ensureImport('src/app/tools/hash-generator/page.tsx', 'import { RelatedTools } from "@/components/tools/related-tools"');

// ─── Bcrypt ───────────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/bcrypt/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Bcrypt Hash Generator: Password Hashing with Work Factor" />
          <meta itemProp="description" content="Hash and verify passwords using bcrypt in the browser. Explains the work factor (cost), why it matters for password security, and what bcrypt can't protect against." />
          <meta itemProp="datePublished" content="2024-03-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="bcrypt-what" className="space-y-4">
            <h2 id="bcrypt-what" className="text-2xl font-semibold tracking-tight text-foreground">
              Why bcrypt is designed to be slow
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Bcrypt was designed in 1999 specifically for password hashing. Its defining
              feature is the cost factor (also called work factor or rounds): a number
              between 4 and 31 that controls how many iterations the algorithm runs. At
              cost 10, a single bcrypt hash takes about 100ms on modern hardware. At cost 12,
              it takes about 400ms. This slowness is intentional.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              A GPU can compute billions of SHA-256 hashes per second. The same GPU can
              compute roughly 10,000–100,000 bcrypt hashes per second at cost 10. If a
              database of bcrypt-hashed passwords is breached, the attacker&apos;s cracking speed
              is roughly 100,000× slower than against SHA-256. The extra 100ms per login
              that users don&apos;t notice protects them against a breach they don&apos;t know about.
            </p>
          </section>

          <section aria-labelledby="bcrypt-cost" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="bcrypt-cost" className="text-2xl font-semibold tracking-tight text-foreground">
              Choosing the right cost factor
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Cost</th>
                    <th className="border border-border p-2 text-left font-semibold">Iterations</th>
                    <th className="border border-border p-2 text-left font-semibold">Approx. time (modern server)</th>
                    <th className="border border-border p-2 text-left font-semibold">Use case</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['10', '1,024', '~100 ms', 'Standard web application login (OWASP minimum)'],
                    ['11', '2,048', '~200 ms', 'Higher security, slightly more CPU cost'],
                    ['12', '4,096', '~400 ms', 'High-value accounts, slow traffic sites'],
                    ['13+', '8,192+', '800ms+', 'Usually not worth the user-facing latency'],
                  ].map(([cost, iters, time, use]) => (
                    <tr key={cost}>
                      <td className="border border-border p-2 font-medium text-foreground">{cost}</td>
                      <td className="border border-border p-2 text-muted-foreground">{iters}</td>
                      <td className="border border-border p-2 text-muted-foreground">{time}</td>
                      <td className="border border-border p-2 text-muted-foreground">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              OWASP recommends cost 10 as the minimum. Increase it every few years as servers
              get faster — the goal is to keep hash time at roughly 100ms. This tool uses{' '}
              <a href="https://github.com/nicktindall/cyclic-rotate" className="text-black  dark:text-white hover:underline" target="_blank" rel="noopener noreferrer">bcryptjs</a>{' '}
              (MIT), a pure JavaScript implementation that runs entirely in the browser.
            </p>
          </section>

          <section aria-labelledby="bcrypt-limits" className="space-y-4">
            <h2 id="bcrypt-limits" className="text-2xl font-semibold tracking-tight text-foreground">
              What bcrypt does not protect against
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">72-byte limit</span>
                <span>Bcrypt truncates input at 72 bytes. Passwords longer than 72 characters produce the same hash as the 72-character prefix. For very long passphrases, pre-hash with SHA-256 before bcrypt if this matters.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Null bytes</span>
                <span>Some bcrypt implementations stop at the first null byte. Avoid passwords that include null characters.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Weak passwords</span>
                <span>Bcrypt slows down brute force but can&apos;t protect a password like &quot;123456&quot;. It will still be cracked — just a bit slower. Password strength and hashing work together.</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related security tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Hash Generator (SHA-256, MD5)", path: "/tools/hash-generator" },
                  { name: "Password Generator", path: "/tools/password-generator" },
                  { name: "JWT Decoder", path: "/tools/jwt-decoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);
ensureImport('src/app/tools/bcrypt/page.tsx', 'import { RelatedTools } from "@/components/tools/related-tools"');

// ─── Color Picker ─────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/color-picker/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Color Picker: Convert Between HEX, RGB, HSL, and HSB" />
          <meta itemProp="description" content="Pick colors and convert between formats. Explains when each format is most useful, HSL for programmatic color manipulation, and accessibility contrast considerations." />
          <meta itemProp="datePublished" content="2024-01-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="color-formats" className="space-y-4">
            <h2 id="color-formats" className="text-2xl font-semibold tracking-tight text-foreground">
              When each color format actually helps
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              HEX is the format most designers and developers recognize: six hexadecimal digits
              that are easy to copy from design tools and paste into CSS. But HEX is opaque for
              color logic — if you want a 20% lighter version of a color, HEX math is not
              intuitive. HSL is.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              HSL (Hue, Saturation, Lightness) maps directly to how humans think about color.
              Hue is the color angle (0–360°). Saturation is how vivid it is. Lightness is
              how bright. To make a hover state that&apos;s 10% darker, just subtract 10 from the
              L value. To make a muted variant, lower the S. This is why CSS custom properties
              in design systems are often defined in HSL — it makes generating color scales in
              code straightforward.
            </p>
          </section>

          <section aria-labelledby="color-workflow" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="color-workflow" className="text-2xl font-semibold tracking-tight text-foreground">
              A quick format reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Format</th>
                    <th className="border border-border p-2 text-left font-semibold">Example</th>
                    <th className="border border-border p-2 text-left font-semibold">Best used when</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['HEX', '#3B82F6', 'Copying from Figma/Sketch, CSS shorthand, design tokens'],
                    ['RGB', 'rgb(59, 130, 246)', 'Canvas API, WebGL, JavaScript color calculations'],
                    ['RGBA', 'rgba(59, 130, 246, 0.5)', 'CSS with opacity, overlay effects'],
                    ['HSL', 'hsl(217, 91%, 60%)', 'Programmatic color scales, theming, hover states'],
                    ['HSLA', 'hsla(217, 91%, 60%, 0.8)', 'HSL with alpha channel'],
                    ['HSB / HSV', 'hsb(217, 76%, 96%)', 'Photoshop/Illustrator; not native in CSS'],
                  ].map(([fmt, ex, when]) => (
                    <tr key={fmt}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{fmt}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{ex}</td>
                      <td className="border border-border p-2 text-muted-foreground">{when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="color-accessibility" className="space-y-4">
            <h2 id="color-accessibility" className="text-2xl font-semibold tracking-tight text-foreground">
              Contrast and accessibility — what to check
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              WCAG 2.1 AA requires a minimum contrast ratio of 4.5:1 for body text. But the
              ratio number alone is not the full picture — the same 4.5:1 pair that passes
              on a calibrated monitor may fail badly with screen glare or reduced brightness.
              I covered the specifics of where 4.5:1 still fails in{' '}
              <a href="/blog/color-contrast-wcag-what-it-means" className="text-black  dark:text-white hover:underline">
                Color Contrast Ratios: What WCAG AA and AAA Actually Mean
              </a>
              . Use our{' '}
              <a href="/tools/contrast-checker" className="text-black  dark:text-white hover:underline">Contrast Checker</a>{' '}
              to test specific color combinations.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related design tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                  { name: "CSS Box Shadow Generator", path: "/tools/css-box-shadow" },
                  { name: "Contrast Checker", path: "/tools/contrast-checker" },
                ]}
              />
            </nav>
          </section>
        </article>`);
ensureImport('src/app/tools/color-picker/page.tsx', 'import { RelatedTools } from "@/components/tools/related-tools"');

// ─── UUID Generator ───────────────────────────────────────────────────────────
replaceArticle('src/app/tools/uuid-generator/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="UUID Generator: v4 Random UUIDs in the Browser" />
          <meta itemProp="description" content="Generate v4 UUIDs using crypto.randomUUID(). Explains UUID versions, collision probability, and when to use UUIDs vs sequential IDs." />
          <meta itemProp="datePublished" content="2024-02-12" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="uuid-what" className="space-y-4">
            <h2 id="uuid-what" className="text-2xl font-semibold tracking-tight text-foreground">
              When you actually need a UUID
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The canonical use case is distributed systems: when two services need to
              independently generate IDs for objects that will later be merged, a sequential
              integer (1, 2, 3…) doesn&apos;t work — both services will generate the same numbers.
              A UUID is 128 bits of randomness that is statistically guaranteed to be unique
              across all systems and all time.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Common practical uses: primary keys for tables where you want to avoid
              exposing sequential IDs in URLs, idempotency keys for payment APIs, correlation
              IDs for log tracing, file upload names, and session identifiers. The
              recommendation in 2026: use{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.randomUUID()</code>{' '}
              natively in modern Node.js (v14.17+) and browsers — this is what the tool uses.
            </p>
          </section>

          <section aria-labelledby="uuid-versions" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="uuid-versions" className="text-2xl font-semibold tracking-tight text-foreground">
              UUID versions and which to use
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v4 (random)</span>
                <span>122 bits of random data. Most commonly used. What this tool generates. Use when you need uniqueness and don&apos;t care about sort order.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v7 (timestamp-ordered)</span>
                <span>Newer RFC standard that starts with a millisecond timestamp — UUIDs sort chronologically. Better for database primary keys as it avoids random index fragmentation. Node.js 22+ supports it natively.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v1 (timestamp + MAC address)</span>
                <span>Includes the device&apos;s MAC address — a privacy concern. Largely replaced by v4 and v7 for new applications.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v5 (SHA-1 namespace hash)</span>
                <span>Deterministic: same input always produces the same UUID. Useful for generating stable IDs from URLs or other strings.</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Collision probability for v4: generating 1 billion UUIDs per second for 85
              years gives a 50% chance of a single collision. For practical applications,
              collisions are not a real concern — the Earth has more atoms than there are
              possible v4 UUIDs is a common (if slightly overstated) illustration.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "Password Generator", path: "/tools/password-generator" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);
ensureImport('src/app/tools/uuid-generator/page.tsx', 'import { RelatedTools } from "@/components/tools/related-tools"');

// ─── URL Encoder ──────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/url-encoder/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="URL Encoder / Decoder: When to Encode and What Each Function Does" />
          <meta itemProp="description" content="Explains the difference between encodeURI and encodeURIComponent, common encoding mistakes, and specific scenarios where encoding matters." />
          <meta itemProp="datePublished" content="2024-02-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="url-why" className="space-y-4">
            <h2 id="url-why" className="text-2xl font-semibold tracking-tight text-foreground">
              The two functions that solve different problems
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              JavaScript has two URL encoding functions and they are not interchangeable.
              Getting this wrong is a real source of bugs.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">encodeURI()</span>
                <span>
                  Encodes a complete URL. Leaves structural characters intact:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">: / ? # [ ] @ ! $ & &apos; ( ) * + , ; =</code>.
                  Use when you have a full URL and need to make it safe for embedding in HTML
                  or an HTTP header.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">encodeURIComponent()</span>
                <span>
                  Encodes a URL <em>component</em> — a query parameter value, a path segment,
                  a fragment. Encodes everything including structural characters. Use this when
                  you&apos;re encoding a value that will be placed inside a URL, not the full URL
                  itself. If you use encodeURI() on a query value that contains{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;</code> or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">=</code>, those
                  characters won&apos;t be encoded and the URL will be parsed incorrectly.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="url-scenarios" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="url-scenarios" className="text-2xl font-semibold tracking-tight text-foreground">
              Common scenarios where encoding goes wrong
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Email in query string</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">user+tag@example.com</code>{' '}
                  — the <code className="text-xs bg-muted px-1 py-0.5 rounded">+</code> in the email becomes a space when decoded if you use encodeURI instead of encodeURIComponent. The email arrives garbled.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Search queries with special characters</span>
                <span>
                  A search query containing <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;</code> splits into multiple parameters. Always encodeURIComponent() search values.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Redirect URLs as parameters</span>
                <span>
                  Passing a full URL as a query parameter:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">?redirect=https://example.com/path?q=1</code>{' '}
                  — the inner URL&apos;s <code className="text-xs bg-muted px-1 py-0.5 rounded">?</code> and{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">=</code> will break the outer URL parser unless encodeURIComponent() is used on the value.
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
                  { name: "Base64 Encoder", path: "/tools/base64-encoder" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                ]}
              />
            </nav>
          </section>
        </article>`);
ensureImport('src/app/tools/url-encoder/page.tsx', 'import { RelatedTools } from "@/components/tools/related-tools"');

console.log('\nBatch-3 complete.');
