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

// ── 1. border-radius ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/border-radius/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSS Border Radius Generator: Shorthand Syntax and When to Use Each Shape" />
          <meta
            itemProp="description"
            content="The border-radius shorthand explained, the difference between a circle and a pill, and when the 8-value syntax is the only way to get the shape you want."
          />
          <meta itemProp="datePublished" content="2024-03-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Shorthand syntax explained */}
          <section aria-labelledby="shorthand" className="space-y-4">
            <h2
              id="shorthand"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The border-radius shorthand most developers get wrong
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius</code>{' '}
              accepts 1–4 values using the same TRouBLe (top-right-bottom-left) clockwise
              order as margin and padding — but with a twist. The property actually sets
              8 values: the horizontal and vertical radii of each corner independently.
              The slash syntax separates them:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'border-radius: 40px 10px / 20px 5px'}
              </code>{' '}
              sets top-left and bottom-right corners to 40px horizontal / 20px vertical,
              and top-right and bottom-left to 10px horizontal / 5px vertical — producing
              an elliptical corners effect that&apos;s impossible with single values.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The common case — uniform rounded corners — is just one value:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 8px</code>.
              Setting{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 50%</code>{' '}
              on a square element makes a perfect circle. On a non-square element (e.g.,
              a wide button), 50% produces an ellipse — use{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 9999px</code>{' '}
              for a consistent pill shape regardless of dimensions.
            </p>
          </section>

          {/* Shape reference */}
          <section
            aria-labelledby="shape-reference"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="shape-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Quick reference for common shapes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Shape</th>
                    <th className="border border-border p-2 text-left font-semibold">CSS</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Slightly rounded card', 'border-radius: 6px', 'Standard card in most design systems'],
                    ['Rounded card (Material)', 'border-radius: 12px', 'Material Design 3 card default'],
                    ['Pill button', 'border-radius: 9999px', 'Works at any width'],
                    ['Circle (square element)', 'border-radius: 50%', 'Element must be square'],
                    ['Top-only rounding', 'border-radius: 12px 12px 0 0', 'Card attached to content below'],
                    ['Squircle approximation', 'border-radius: 30%', 'iOS app icon shape, close approximation'],
                    ['One corner only', 'border-radius: 0 0 0 16px', 'Bottom-left only (TRouBLe order)'],
                  ].map(([shape, css, notes]) => (
                    <tr key={shape}>
                      <td className="border border-border p-2 text-muted-foreground">{shape}</td>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{css}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related CSS tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "CSS Box Shadow Generator", path: "/tools/box-shadow" },
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                  { name: "Color Picker", path: "/tools/color-picker" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. html-escape ───────────────────────────────────────────────────────────
replaceArticle('src/app/tools/html-escape/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="HTML Escape / Unescape: The XSS Prevention You Can't Skip" />
          <meta
            itemProp="description"
            content="What HTML escaping does, which characters must always be escaped, and the difference between escaping for HTML content vs. HTML attributes."
          />
          <meta itemProp="datePublished" content="2024-02-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why this matters */}
          <section aria-labelledby="why-escape" className="space-y-4">
            <h2
              id="why-escape"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why HTML escaping prevents XSS
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Cross-site scripting (XSS) happens when user-supplied text is rendered
              as HTML instead of text. If a user submits{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'<script>document.cookie</script>'}
              </code>{' '}
              and your server inserts it into the page without escaping, the browser
              executes it as code. Escaping converts{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{'<'}</code>{' '}
              to{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{'&lt;'}</code>{' '}
              — the browser then renders a literal angle bracket instead of interpreting
              a tag boundary. The script never executes.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Modern frameworks (React, Vue, Angular) escape HTML in their template systems
              by default. The risk is in places where you bypass the framework: raw{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">innerHTML</code>{' '}
              assignments, server-side template strings,{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">dangerouslySetInnerHTML</code>{' '}
              in React — anywhere user text is inserted into HTML without the framework&apos;s
              sanitization layer.
            </p>
          </section>

          {/* Character reference */}
          <section
            aria-labelledby="char-reference"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="char-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The five characters that must always be escaped
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Character</th>
                    <th className="border border-border p-2 text-left font-semibold">Entity</th>
                    <th className="border border-border p-2 text-left font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['< (less than)', '&lt;', 'Opens an HTML tag; enables tag injection'],
                    ['> (greater than)', '&gt;', 'Closes tags; not always dangerous but consistent escaping is safer'],
                    ['& (ampersand)', '&amp;', 'Starts HTML entity sequences; double-escaping bugs if not escaped'],
                    ['" (double quote)', '&quot;', 'Closes attribute values in double-quoted attributes'],
                    ["' (single quote)", '&#x27; or &apos;', 'Closes attribute values in single-quoted attributes'],
                  ].map(([char, entity, why]) => (
                    <tr key={char}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{char}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{entity}</td>
                      <td className="border border-border p-2 text-muted-foreground">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              Escaping for HTML attributes requires escaping both{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">&quot;</code>{' '}
              and{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">&#x27;</code>{' '}
              in addition to the others — an unescaped quote inside an attribute value
              closes the attribute and allows attribute injection (a vector for event
              handler injection like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">onclick=</code>).
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related encoding tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "URL Encoder / Decoder", path: "/tools/url-encoder" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. js-minifier ───────────────────────────────────────────────────────────
replaceArticle('src/app/tools/js-minifier/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="JavaScript Minifier: What Gets Removed, What Stays, and the Sourcemap You Need" />
          <meta
            itemProp="description"
            content="The transformations a JS minifier applies, real size numbers from minifying common libraries, and why you always need a source map for production debugging."
          />
          <meta itemProp="datePublished" content="2024-03-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What minification does */}
          <section aria-labelledby="what-it-does" className="space-y-4">
            <h2
              id="what-it-does"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a JS minifier actually removes — and what it can&apos;t touch
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A JavaScript minifier strips whitespace, removes comments, shortens variable
              names, and collapses redundant syntax. The transformations that reliably
              reduce size: whitespace/newline removal (10–20% on average), comment
              stripping (varies widely — heavily commented code can save 5–15%),
              and identifier renaming (the big win for large files — renaming{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">longDescriptiveVariableName</code>{' '}
              to{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">a</code>{' '}
              throughout a file compounds quickly).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              What can&apos;t be removed safely:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">eval()</code>{' '}
              calls (variable references inside eval strings can&apos;t be renamed),
              and property names accessed via bracket notation like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">obj[&apos;name&apos;]</code>{' '}
              (the string might be dynamic). Real-world size reductions: React 18.2 (unminified
              693 KB → minified 142 KB; gzipped 46 KB). Lodash 4.17 (542 KB → 72 KB minified;
              gzipped 25 KB).
            </p>
          </section>

          {/* Source maps */}
          <section
            aria-labelledby="source-maps"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="source-maps"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why you always need a source map for production
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A source map is a JSON file that maps positions in your minified code back
              to the original source. Without it, a production error in your bug tracker
              shows:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">TypeError at a.b.c:1:4821</code>{' '}
              — useless for debugging. With a source map, the same error shows the
              original file name and line number.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Source maps can be served publicly (which exposes your original source code
              to anyone who looks in DevTools) or privately (served only to your error
              monitoring service via a token-protected endpoint). Sentry, Datadog, and
              Rollbar all support private source map uploads. For production code,
              private upload is the right choice — expose the map only to your error
              monitoring infrastructure, not to the public.
            </p>
          </section>

          {/* When to use a bundler */}
          <section aria-labelledby="use-bundler" className="space-y-4">
            <h2
              id="use-bundler"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              This tool vs. your build pipeline
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This minifier is for one-off tasks: minifying a script you&apos;re embedding in
              an HTML email, compressing a small utility you&apos;re pasting into a third-party
              system, or quickly checking what a minified version looks like. For any
              project with a build step, use the bundler&apos;s built-in minifier — Vite
              uses esbuild, Next.js uses SWC, webpack can use Terser — all of which run
              automatically on{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">npm run build</code>{' '}
              and generate source maps as part of the output.
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
                  { name: "CSS Minifier", path: "/tools/css-minifier" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. csv-json-converter ────────────────────────────────────────────────────
replaceArticle('src/app/tools/csv-json-converter/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSV to JSON Converter: Data Type Inference, Edge Cases, and What Gets Lost" />
          <meta
            itemProp="description"
            content="Why CSV-to-JSON conversion is trickier than it looks, the edge cases that silently corrupt data, and when to use the tool vs. a parsing library."
          />
          <meta itemProp="datePublished" content="2024-03-25" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why conversion is tricky */}
          <section aria-labelledby="why-tricky" className="space-y-4">
            <h2
              id="why-tricky"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why CSV-to-JSON is trickier than it looks
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              CSV has no formal type system — every value is text. A converter has to
              guess whether{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">42</code>{' '}
              should become the JSON number{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">42</code>{' '}
              or the string{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">"42"</code>,
              and whether{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">true</code>{' '}
              is a boolean or a value in a column called &quot;Status&quot;. The wrong guess
              silently corrupts data — a leading-zero zip code{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">01234</code>{' '}
              parsed as a number becomes{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">1234</code>.
              Phone numbers, ID codes, and version strings all suffer the same problem.
            </p>
          </section>

          {/* Edge cases */}
          <section
            aria-labelledby="edge-cases"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="edge-cases"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Edge cases that silently corrupt your data
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Quoted fields with embedded commas</span>
                <span>
                  CSV spec (RFC 4180) allows comma-containing values if wrapped in
                  double quotes:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{'"New York, NY"'}</code>.
                  A naive splitter on{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">,</code>{' '}
                  breaks this into two fields. Always verify the converter handles quoted fields.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Newlines inside quoted fields</span>
                <span>
                  A CSV field can contain a literal newline if quoted:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{'"line1\nline2"'}</code>.
                  Converters that split on line breaks first will produce a corrupt
                  parse for multi-line values.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Leading zeros</span>
                <span>
                  US zip codes, ISBNs, product codes, and phone numbers often have
                  leading zeros. Auto-typed as numbers, the zeros are dropped. Treat
                  all ID and code columns as strings — check the output values
                  carefully before using in production.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Inconsistent row length</span>
                <span>
                  Some CSV exports produce rows with fewer columns than the header.
                  The converter should fill missing fields with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">null</code>{' '}
                  or omit the key entirely — verify which behavior your downstream
                  code expects.
                </span>
              </li>
            </ul>
          </section>

          {/* When to use a library */}
          <section aria-labelledby="use-library" className="space-y-4">
            <h2
              id="use-library"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use a parsing library instead
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              For one-off exploration or small files, this tool is the fastest option.
              For production code that ingests CSV (user uploads, data pipelines, ETL),
              use a proper parsing library:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">Papa Parse</code>{' '}
              in the browser (handles all RFC 4180 edge cases, streams large files),{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">csv-parse</code>{' '}
              in Node.js, or{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">pandas.read_csv()</code>{' '}
              in Python. These handle quoted fields, multi-line values, and encoding
              issues that simple implementations miss.
            </p>
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
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "YAML to JSON Converter", path: "/tools/yaml-json-converter" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. image-converter ───────────────────────────────────────────────────────
replaceArticle('src/app/tools/image-converter/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Image Format Converter: JPEG, PNG, WebP — Which Loses Quality and Which Doesn't" />
          <meta
            itemProp="description"
            content="The difference between lossy and lossless image conversion, which format changes always degrade quality, and the right format for each use case in 2026."
          />
          <meta itemProp="datePublished" content="2024-02-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Lossy vs lossless */}
          <section aria-labelledby="lossy-lossless" className="space-y-4">
            <h2
              id="lossy-lossless"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which conversions lose quality — and which don&apos;t
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Converting between lossless formats (PNG ↔ WebP lossless ↔ BMP) preserves
              every pixel — no quality loss. Converting from a lossy format (JPEG) to a
              lossless one (PNG) does not recover the quality lost during the original
              JPEG compression — it simply stores the already-degraded pixels losslessly.
              The file gets larger but no sharper.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Converting from PNG to JPEG always discards the alpha channel (transparency
              becomes white or black depending on the tool) and applies lossy compression.
              If your PNG has transparent areas that matter — a logo, an icon, a product
              shot on a transparent background — JPEG is the wrong target format. Use
              WebP or keep PNG.
            </p>
          </section>

          {/* Format guide */}
          <section
            aria-labelledby="format-guide"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="format-guide"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which format to use in 2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Scenario</th>
                    <th className="border border-border p-2 text-left font-semibold">Best format</th>
                    <th className="border border-border p-2 text-left font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Photography, hero images', 'WebP (lossy)', '25–34% smaller than JPEG at same visual quality'],
                    ['Logos, icons, illustrations', 'SVG (vector) or PNG', 'SVG scales; PNG preserves edges and transparency'],
                    ['Screenshots, UI mockups', 'PNG or WebP lossless', 'Crisp text; JPEG blurs edges'],
                    ['Email images', 'JPEG', 'Some email clients strip WebP; JPEG is universally safe'],
                    ['Images that will be edited further', 'PNG', 'Avoid generation loss from re-saving JPEG'],
                    ['iOS/macOS only targets', 'HEIC', 'Native Apple format; 40–50% smaller than JPEG'],
                    ['Print (300 DPI)', 'JPEG or TIFF at 300+ DPI', 'Web formats at 72 DPI look blurry in print'],
                  ].map(([scenario, format, why]) => (
                    <tr key={scenario}>
                      <td className="border border-border p-2 text-muted-foreground">{scenario}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{format}</td>
                      <td className="border border-border p-2 text-muted-foreground">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How this tool works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How conversion works in the browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Your image is decoded by the browser&apos;s native image decoder, drawn to an
              HTML Canvas element, then re-encoded to the target format using{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">canvas.toBlob()</code>{' '}
              with the target MIME type. WebP encoding uses the browser&apos;s built-in
              WebP encoder. PNG uses lossless compression. JPEG uses the browser&apos;s
              DCT encoder at the quality level you specify. Nothing is uploaded —
              conversion happens entirely on your device.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related image tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Resizer", path: "/tools/image-resizer" },
                  { name: "Background Remover", path: "/tools/remove-bg" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');
