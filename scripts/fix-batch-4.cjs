const fs = require('fs');

function replaceArticle(filePath, newArticle, ensureImport) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (ensureImport && !content.includes('related-tools')) {
    content = content.replace(
      /^(import { buildToolMetadata )/m,
      'import { RelatedTools } from "@/components/tools/related-tools"\n$1'
    );
  }
  const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
  const articleStart = content.lastIndexOf('<article', techIdx);
  const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;
  console.log(filePath + ': replacing ' + articleStart + '-' + articleEnd + ' of ' + content.length);
  const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Done. Lines: ' + newContent.split('\n').length);
}

// ── 1. lorem-ipsum ───────────────────────────────────────────────────────────
replaceArticle('src/app/tools/lorem-ipsum/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Lorem Ipsum Generator: When to Use Placeholder Text and When Not To" />
          <meta
            itemProp="description"
            content="Why lorem ipsum exists, the mistake most designers make with it, and two cases where real content is always worth the extra effort."
          />
          <meta itemProp="datePublished" content="2024-02-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why it exists */}
          <section aria-labelledby="why-lorem" className="space-y-4">
            <h2
              id="why-lorem"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why lorem ipsum exists — and what it&apos;s actually for
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Lorem ipsum text dates to the 1500s, when a typesetter scrambled sections of
              Cicero&apos;s <em>de Finibus Bonorum et Malorum</em> to produce specimen sheets for
              fonts. The scrambling was deliberate: text that looks like Latin but reads as
              nonsense prevents the reader from focusing on the words instead of the layout.
              That&apos;s the entire point — you want the eye to evaluate spacing, line length,
              and typeface rhythm, not meaning.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The practical use today is the same: fill a mockup so stakeholders can react
              to visual hierarchy and proportions before real content exists. A landing page
              with real copy is almost impossible to critique for layout — people read the
              text. Lorem ipsum lets you have the layout conversation first.
            </p>
          </section>

          {/* When it leads you astray */}
          <section
            aria-labelledby="when-it-fails"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="when-it-fails"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Two situations where lorem ipsum leads you astray
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Navigation and UI labels</span>
                <span>
                  If you use lorem ipsum in button text or menu items, you design for
                  short Latin syllables. Real labels like &quot;Manage subscription preferences&quot;
                  are 35 characters — three times longer than typical filler. The layout
                  breaks on first real-content review. Use realistic label length in UI
                  components, even if the copy itself is placeholder.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Multilingual sites</span>
                <span>
                  German and Finnish words are substantially longer than English equivalents.
                  If your interface will be translated, test with realistic strings in the
                  target language from day one. A button that fits &quot;Subscribe&quot; will break
                  on &quot;Abonnieren&quot; — a 9-character difference that collapses the layout in
                  production.
                </span>
              </li>
            </ul>
          </section>

          {/* Practical note */}
          <section aria-labelledby="practical-note" className="space-y-4">
            <h2
              id="practical-note"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How this generator works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The generator assembles placeholder text from a local pool of classic lorem
              ipsum words — no network request. Paragraphs mode produces 4–6 sentence
              blocks. Sentences mode outputs individual sentences. Words mode gives you
              a flat word list for testing specific character counts. The &quot;Start with
              Lorem ipsum&quot; option preserves the traditional opening phrase
              ({'"Lorem ipsum dolor sit amet, consectetur adipiscing elit..."'}) that most
              designers recognize on sight as placeholder — useful if you want reviewers
              to immediately know the content is dummy text.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Everything runs locally in your browser. Nothing is logged or sent to a server.
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
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Text to PDF", path: "/tools/text-to-pdf" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. box-shadow ────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/box-shadow/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSS Box Shadow Generator: Why Most Box Shadows Look Wrong" />
          <meta
            itemProp="description"
            content="The reason generated shadows feel unnatural, the two properties that fix it, and a reference table for realistic shadow presets based on common elevation levels."
          />
          <meta itemProp="datePublished" content="2024-03-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why shadows look wrong */}
          <section aria-labelledby="why-wrong" className="space-y-4">
            <h2
              id="why-wrong"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why most generated shadows look wrong
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The default shadow from most generators is symmetrical:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">box-shadow: 0 4px 6px rgba(0,0,0,0.1)</code>.
              It renders correctly but looks flat and artificial. Real shadows are
              directional — light comes from above, so shadows fall below and slightly
              to one side. They also soften as objects rise higher from the surface:
              a card at 2dp elevation has a tight, dark shadow; a modal at 24dp has a
              large, diffuse one.{' '}
              <a href="/blog/css-box-shadow-real-numbers" className="text-black  dark:text-white hover:underline">
                Full write-up on shadow realism here.
              </a>
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The two most impactful fixes: (1) Add a small positive Y offset (2–4px for
              low elevations) to simulate light from above. (2) Use two layered shadows —
              one tight and dark for the direct shadow, one wide and lighter for ambient
              light diffusion. Google&apos;s Material Design uses exactly this technique for all
              elevation levels.
            </p>
          </section>

          {/* Elevation reference table */}
          <section
            aria-labelledby="elevation-table"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="elevation-table"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Shadow presets by elevation level
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Component</th>
                    <th className="border border-border p-2 text-left font-semibold">Elevation</th>
                    <th className="border border-border p-2 text-left font-semibold">CSS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Subtle card border', 'Near 0', '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)'],
                    ['Button (resting)', 'Low', '0 2px 4px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.08)'],
                    ['Dropdown / popover', 'Medium', '0 4px 12px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.08)'],
                    ['Card (hovering)', 'Medium-high', '0 8px 24px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.08)'],
                    ['Modal / dialog', 'High', '0 20px 48px rgba(0,0,0,.18), 0 8px 16px rgba(0,0,0,.10)'],
                  ].map(([component, elevation, css]) => (
                    <tr key={component}>
                      <td className="border border-border p-2 font-medium text-foreground">{component}</td>
                      <td className="border border-border p-2 text-muted-foreground">{elevation}</td>
                      <td className="border border-border p-2 text-muted-foreground font-mono text-xs">{css}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              These are starting points. Adjust opacity based on your background color:
              shadows on white need less opacity than shadows on light-grey surfaces.
              Dark mode requires higher opacity (0.3–0.5) because contrast ratios flip.
            </p>
          </section>

          {/* Color shadows */}
          <section aria-labelledby="color-shadows" className="space-y-4">
            <h2
              id="color-shadows"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use colored shadows
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Colored shadows work well when the surface casting the shadow has a strong
              hue — a blue card with a blue-tinted shadow, for example. The trick is
              to use a muted, desaturated version of the color at low opacity rather
              than the full saturated value. A button with{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">background: #6366f1</code>{' '}
              (Indigo-500) reads well with{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">box-shadow: 0 4px 14px rgba(99,102,241,0.4)</code>.
              Using the full saturation without reducing opacity makes the shadow
              look like a glow effect, not an elevation shadow.
            </p>
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
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                  { name: "Border Radius Generator", path: "/tools/border-radius" },
                  { name: "Color Picker", path: "/tools/color-picker" },
                ]}
              />
            </nav>
          </section>
        </article>`, true);

// ── 3. color-contrast-checker ────────────────────────────────────────────────
replaceArticle('src/app/tools/color-contrast-checker/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Color Contrast Checker: WCAG Ratios, What They Mean, and What Actually Fails" />
          <meta
            itemProp="description"
            content="The WCAG contrast ratios explained with real examples, plus the gray-text patterns that fail most often in production and why automated tools miss them."
          />
          <meta itemProp="datePublished" content="2024-04-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What the ratio means */}
          <section aria-labelledby="what-ratio-means" className="space-y-4">
            <h2
              id="what-ratio-means"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a 4.5:1 contrast ratio actually means
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              WCAG 2.1 requires a 4.5:1 contrast ratio for normal text (under 18pt) at
              Level AA — the legal standard in the US, EU, and UK for public-facing
              websites. The ratio is calculated from the relative luminance of each color,
              where pure white is 1.0 and pure black is 0. The formula weights the R, G,
              and B channels non-linearly to approximate how human vision perceives
              brightness differences.{' '}
              <a href="/blog/color-contrast-wcag-what-it-means" className="text-black  dark:text-white hover:underline">
                Full explanation with worked examples here.
              </a>
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              In practice: black text (#000) on white (#fff) is 21:1 — the maximum.
              The popular &quot;gray on white&quot; pattern ({'"#767676 on #ffffff"'}) is exactly 4.54:1 —
              just barely passing. One step lighter, #777, drops to 4.48:1 and fails.
              This is the zone where most accessibility violations live in production:
              designers choose gray text for visual hierarchy, then pick a shade that&apos;s
              two hex values too light.
            </p>
          </section>

          {/* Common failures */}
          <section
            aria-labelledby="common-failures"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="common-failures"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The patterns that fail most often
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Pattern</th>
                    <th className="border border-border p-2 text-left font-semibold">Typical ratio</th>
                    <th className="border border-border p-2 text-left font-semibold">Pass/Fail AA</th>
                    <th className="border border-border p-2 text-left font-semibold">Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Placeholder text (#9CA3AF on white)', '2.4:1', 'FAIL', 'Use #6B7280 or darker'],
                    ['Secondary text (#6B7280 on white)', '4.6:1', 'PASS (barely)', 'Avoid on off-white backgrounds'],
                    ['Disabled button (#9CA3AF on #F3F4F6)', '2.0:1', 'FAIL', 'WCAG exempts disabled elements'],
                    ['White on brand blue (#3B82F6)', '3.0:1', 'FAIL', 'Darken to #1D4ED8 for white text'],
                    ['White on green (#22C55E)', '2.3:1', 'FAIL', 'Use dark text or darken to #15803D'],
                    ['Yellow text on white', '1.1–1.8:1', 'FAIL', 'Yellow is near-invisible on white'],
                  ].map(([pattern, ratio, result, fix]) => (
                    <tr key={pattern}>
                      <td className="border border-border p-2 text-muted-foreground">{pattern}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{ratio}</td>
                      <td className={\`border border-border p-2 font-medium \${result === 'FAIL' ? 'text-red-600' : 'text-green-600'}\`}>{result}</td>
                      <td className="border border-border p-2 text-muted-foreground">{fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* What automated tools miss */}
          <section aria-labelledby="what-tools-miss" className="space-y-4">
            <h2
              id="what-tools-miss"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What automated checkers can&apos;t catch
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This checker evaluates flat color pairs. It cannot check text on gradient
              backgrounds, text over images, or text where color changes on hover/focus.
              For gradients, check both the lightest and darkest points of the gradient
              against your text color and use the lower (worse) ratio as your reference.
              For images, the 1:1 rule of thumb: if the background contains a range of
              tones, a semi-transparent dark overlay behind the text is usually more
              reliable than trying to find a single text color that passes everywhere.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related design tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Color Picker", path: "/tools/color-picker" },
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                ]}
              />
            </nav>
          </section>
        </article>`, true);

// ── 4. yaml-json-converter ───────────────────────────────────────────────────
replaceArticle('src/app/tools/yaml-json-converter/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="YAML to JSON Converter: Format Differences, Gotchas, and When Each Is Right" />
          <meta
            itemProp="description"
            content="YAML and JSON represent the same data structures differently. The three YAML features that have no JSON equivalent, and the two cases where JSON is the strictly better choice."
          />
          <meta itemProp="datePublished" content="2024-02-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why this conversion exists */}
          <section aria-labelledby="why-convert" className="space-y-4">
            <h2
              id="why-convert"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why you need to convert between them
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              YAML is config-file format — it&apos;s designed to be hand-edited by humans and
              allows comments, multi-line strings, and anchors for reuse. JSON is a
              wire format — it&apos;s designed for machine-to-machine communication and is
              parsed by every language natively. The most common conversion scenario:
              you have a YAML config (Kubernetes manifest, GitHub Actions workflow,
              Docker Compose file) and need to pass part of it to an API that expects
              JSON, or you get a JSON response from an API and want to edit it as YAML
              before storing it in a config file.
            </p>
          </section>

          {/* Feature comparison */}
          <section
            aria-labelledby="feature-comparison"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="feature-comparison"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three YAML features that don&apos;t survive JSON conversion
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Comments</span>
                <span>
                  YAML allows{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded"># comments</code>{' '}
                  anywhere. JSON has no comment syntax. When you convert YAML to JSON,
                  all comments are silently dropped — they cannot be round-tripped.
                  If your YAML comments document why a value is set a certain way,
                  keep the YAML source as the canonical file and treat JSON as a
                  derived output.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Anchors and aliases</span>
                <span>
                  YAML anchors ({'"&anchor"'} and {'"*alias"'}) let you reuse a value in
                  multiple places. The converter dereferences them — each alias becomes
                  a full copy of the anchored value in the output JSON. This is correct
                  behavior but can produce much larger JSON than the source YAML if
                  anchors were used for DRY config blocks.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Multi-document streams</span>
                <span>
                  A single YAML file can contain multiple documents separated by{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">---</code>.
                  JSON has no equivalent — one file, one object. Paste one document at
                  a time when converting multi-document YAML.
                </span>
              </li>
            </ul>
          </section>

          {/* When to use JSON */}
          <section aria-labelledby="when-json" className="space-y-4">
            <h2
              id="when-json"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When JSON is the strictly better choice
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              For API payloads and data interchange: always JSON. YAML&apos;s indentation
              sensitivity makes it error-prone when generated programmatically — one
              off-by-two-spaces and the structure silently changes meaning. JSON&apos;s
              explicit braces and brackets are unambiguous in code generation.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For configuration files that humans edit: usually YAML, but only if your
              toolchain supports it natively. If you find yourself running a converter
              as part of your deploy pipeline every time someone edits the config,
              consider switching the canonical format to JSON — the tooling cost isn&apos;t worth
              the indentation convenience.
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
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "CSV to JSON Converter", path: "/tools/csv-json-converter" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. meta-tags ─────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/meta-tags/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Meta Tags Generator: Which Tags Google Actually Uses in 2026" />
          <meta
            itemProp="description"
            content="Which meta tags still matter for Google, which are ignored, the Open Graph tags social platforms require, and the title length that gets truncated in search results."
          />
          <meta itemProp="datePublished" content="2024-03-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What Google uses */}
          <section aria-labelledby="what-google-uses" className="space-y-4">
            <h2
              id="what-google-uses"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which meta tags Google actually reads in 2026
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Google&apos;s crawler ignores most meta tags. The ones it uses:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">description</code> (as
              a snippet candidate — not guaranteed to appear), and{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">robots</code> (to
              control indexing and link following). The{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">keywords</code> meta
              tag has been ignored by Google since 2009 — it still gets included in
              generators but provides no SEO value. The{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">author</code> and{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">viewport</code> tags
              are used for other purposes (E-E-A-T signals and mobile rendering respectively)
              but do not directly affect rankings.
            </p>
          </section>

          {/* Tag reference table */}
          <section
            aria-labelledby="tag-reference"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="tag-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Complete tag reference and character limits
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Tag</th>
                    <th className="border border-border p-2 text-left font-semibold">Limit</th>
                    <th className="border border-border p-2 text-left font-semibold">Used by</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['<title>', '50–60 chars', 'Google, browsers, social', 'Shown in SERP; longer titles get rewritten by Google'],
                    ['meta description', '155–160 chars', 'Google (snippet candidate)', 'Google rewrites ~60% of descriptions anyway'],
                    ['og:title', '40–60 chars', 'Facebook, LinkedIn, Slack', 'Different from <title> — optimize for social separately'],
                    ['og:description', '100–150 chars', 'Facebook, LinkedIn', 'Twitter/X ignores this; uses twitter:description'],
                    ['og:image', '1200×630px min', 'All social platforms', 'Missing = ugly auto-generated preview; use absolute URL'],
                    ['twitter:card', 'summary_large_image', 'Twitter/X', 'Required for card display; without it, no image preview'],
                    ['robots', 'noindex, nofollow', 'All crawlers', 'noindex alone is sufficient to block ranking'],
                    ['canonical', 'Full URL', 'Google, Bing', 'Must match the page exactly; include or exclude www consistently'],
                  ].map(([tag, limit, usedBy, notes]) => (
                    <tr key={tag}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{tag}</td>
                      <td className="border border-border p-2 text-muted-foreground">{limit}</td>
                      <td className="border border-border p-2 text-muted-foreground">{usedBy}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="common-mistakes" className="space-y-4">
            <h2
              id="common-mistakes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The three meta tag mistakes that cost traffic
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Missing og:image</span>
                <span>
                  When your page is shared on LinkedIn or Slack without an og:image,
                  the platform generates a preview with no image or a random on-page
                  image. Click-through rates on link previews with images are 3–5×
                  higher than those without. This is the single highest-ROI meta tag
                  to add to content pages.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Duplicate title tags</span>
                <span>
                  Multiple pages with identical{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;title&gt;</code>{' '}
                  values send a consolidation signal to Google — it will pick one page
                  to show and demote the others. Every page needs a unique title that
                  describes what&apos;s actually on that specific page.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Canonical pointing to wrong URL</span>
                <span>
                  A canonical tag pointing to a different domain, a 404, or a redirect
                  target tells Google to index a different page than the one it&apos;s on.
                  This is one of the most common technical SEO errors and causes ranking
                  loss that looks like a penalty. Always verify canonical URLs resolve
                  correctly after any domain or URL structure changes.
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
              Related SEO tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Robots.txt Generator", path: "/tools/robots-txt" },
                  { name: "Sitemap Generator", path: "/tools/sitemap-generator" },
                  { name: "Color Contrast Checker", path: "/tools/color-contrast-checker" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');
