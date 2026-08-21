const fs = require('fs');
const content = fs.readFileSync('src/app/tools/json-formatter/page.tsx', 'utf8');

// The new article I want is the one at position 12874 (starts with 'space-y-12 max-w-4xl')
// The old article's final </article> is the LAST one in the file
// I need: preamble + new-article-correct-close + postamble

// Strategy: find where my NEW article block starts, find the LAST </article> in the file,
// then insert the correct new article replacing everything from start to last close.

const newArticle = `        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="JSON Formatter: Format, Validate, and Debug API Responses" />
          <meta
            itemProp="description"
            content="A browser-based JSON formatter that uses JSON.parse() locally — no server, no upload. Limitations: JSONC and NDJSON are not supported."
          />
          <meta itemProp="datePublished" content="2024-02-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* The problem this tool solves */}
          <section aria-labelledby="problem-heading" className="space-y-4">
            <h2
              id="problem-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The scenario this tool was built for
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              You get an error back from an API. The response body is one unbroken line —
              something like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'{"status":500,"error":{"code":"AUTH_EXPIRED","details":{"token_issued":1716...}}}'}
              </code>{' '}
              — 1,800 characters, no whitespace. You could open DevTools, but the Network tab
              wraps it awkwardly and you can&apos;t collapse sections. You paste it here.
              Two seconds later you have a fully indented, color-coded structure where you
              can immediately see that{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">details.token_issued</code>{' '}
              was three days ago — the session expired and your refresh logic didn&apos;t fire. Bug found.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              That&apos;s 90% of what this tool gets used for: quickly making a minified string
              readable during debugging. The secondary use is validation — pasting a
              hand-edited config or a JSON template to confirm you didn&apos;t accidentally leave
              a trailing comma or forget to close a bracket. Both take under 3 seconds.
            </p>
          </section>

          {/* How it actually works */}
          <section
            aria-labelledby="how-it-works"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What actually runs in your browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The formatter calls the browser&apos;s native{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">JSON.parse()</code>{' '}
              — the same engine Chrome DevTools and Node.js use internally. There is no server
              step. Your JSON string is parsed entirely in the V8 or SpiderMonkey JavaScript
              engine already running on your machine. Parsing a typical 500 KB API response
              takes under 20 ms in Chrome 124. A 5 MB file takes roughly 200 ms — perceptible
              but still fast for debugging.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              After parsing, the tool re-serializes the result using{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">JSON.stringify(parsed, null, 2)</code>{' '}
              for the formatted output. The tree view walks the parsed object recursively and
              renders each key-value pair as a collapsible DOM node. The CSV export flattens
              the top-level array (one object per row) and joins values with commas — standard
              spreadsheet import format, no library involved.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Nothing is sent to our servers. The Network tab in DevTools will show zero
              outbound requests when you click Format. If you&apos;re working with an API response
              that contains auth tokens, PII, or proprietary data, you can paste it safely —
              it never leaves the tab.
            </p>
          </section>

          {/* Honest limitations */}
          <section aria-labelledby="limitations-heading" className="space-y-4">
            <h2
              id="limitations-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What this tool can&apos;t do
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Knowing the limitations upfront saves time. Here&apos;s what won&apos;t work:
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">JSONC</span>
                <span>
                  JSON with comments — used in{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">tsconfig.json</code>,
                  VS Code settings, and some config files — is not valid JSON. The{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">//</code> or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/* */</code>{' '}
                  lines will cause a parse error. Strip comments first, or use a JSONC-aware
                  editor.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">NDJSON</span>
                <span>
                  Newline-delimited JSON (one object per line, used by log streams and some
                  databases) is multiple documents, not one. Paste one object at a time, or
                  split the file first.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Files over ~30 MB</span>
                <span>
                  The browser tab may become unresponsive. For large files, use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">jq</code> in the
                  terminal:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">cat file.json | jq .</code>{' '}
                  handles gigabyte-scale files without issue.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Schema validation</span>
                <span>
                  The tool checks <em>syntax</em> — whether the text is valid JSON — not{' '}
                  <em>semantics</em> — whether the data matches a JSON Schema definition. For
                  schema validation against a spec, use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">ajv</code> or similar.
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
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "YAML to JSON Converter", path: "/tools/yaml-json-converter" },
                  { name: "JSON to Excel Converter", path: "/tools/json-to-excel" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encode-decode" },
                ]}
              />
            </nav>
          </section>
        </article>`;

// Find the TechArticle article: look for the itemType attribute
const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
// Back up to find the opening <article tag
const articleStart = content.lastIndexOf('<article', techIdx);
// The LAST </article> in the file is the outer closing tag
const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;

console.log('Replacing from', articleStart, 'to', articleEnd, '(total file:', content.length, ')');

const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
fs.writeFileSync('src/app/tools/json-formatter/page.tsx', newContent, 'utf8');
console.log('Done. Lines written:', newContent.split('\n').length);
