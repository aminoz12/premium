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

// ── 1. error-message-solver ───────────────────────────────────────────────────
replaceArticle('src/app/tools/error-message-solver/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Error Message Solver: How to Read Stack Traces and Find the Root Cause" />
          <meta
            itemProp="description"
            content="The parts of an error message that actually matter, why the first line is often misleading, and a systematic approach to diagnosing errors you've never seen before."
          />
          <meta itemProp="datePublished" content="2024-04-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How to read an error */}
          <section aria-labelledby="reading-errors" className="space-y-4">
            <h2
              id="reading-errors"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The parts of an error message that actually matter
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most error messages have three useful parts: the error type, the message,
              and the stack trace. New developers read the message and stop — experienced
              developers scan the stack trace first. The message describes what broke;
              the stack trace tells you where your code triggered it. The bottom of the
              stack is the framework or runtime internals (not your bug). Your code
              appears near the top — that&apos;s where to look.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Example: a{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                TypeError: Cannot read properties of undefined (reading &apos;map&apos;)
              </code>{' '}
              tells you: something you expected to be an array is{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">undefined</code>.
              The stack trace shows the component and line number. The fix is not at
              the line where{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">.map()</code>{' '}
              is called — it&apos;s one level up, where the data was fetched or passed as a
              prop. The error location and the bug location are often different.
            </p>
          </section>

          {/* Systematic approach */}
          <section
            aria-labelledby="systematic-approach"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="systematic-approach"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              A systematic approach to errors you&apos;ve never seen
            </h2>
            <ol className="space-y-3 text-sm text-muted-foreground list-none">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">1.</span>
                <span>
                  <strong>Copy the exact error message</strong> (not a paraphrase) and
                  search it with the library or framework name appended. Most errors
                  have existing GitHub issues, Stack Overflow answers, or documentation
                  notes with the exact fix.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">2.</span>
                <span>
                  <strong>Check what changed last</strong>. If the code worked yesterday
                  and fails today, the cause is almost certainly in the recent change —
                  a dependency update, a config change, or new code. Git diff against
                  the last working commit.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">3.</span>
                <span>
                  <strong>Reproduce in isolation</strong>. Strip the error down to the
                  minimum code that reproduces it. The process of isolating it often
                  reveals the cause before you find the answer.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">4.</span>
                <span>
                  <strong>Check environment differences</strong>. Works on your machine
                  but not in CI? Fails in production but not locally? The bug is almost
                  certainly an environment variable, a missing dependency, or a Node.js
                  version difference.
                </span>
              </li>
            </ol>
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
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. code-converter ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/code-converter/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Code Converter: What Translates Well Between Languages and What Doesn't" />
          <meta
            itemProp="description"
            content="Which code patterns translate accurately between languages, where automatic conversion always needs human review, and the three language pairs that convert most reliably."
          />
          <meta itemProp="datePublished" content="2024-04-12" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What translates well */}
          <section aria-labelledby="what-translates" className="space-y-4">
            <h2
              id="what-translates"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What translates well between languages
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Algorithms with straightforward control flow — loops, conditionals,
              arithmetic, string manipulation — translate accurately between most
              mainstream languages. A Python function that sorts a list, filters by
              condition, and returns a transformed result maps cleanly to JavaScript,
              TypeScript, Java, or Go. The logic is language-agnostic; only the
              syntax differs.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The most reliable language pairs: <strong>JavaScript ↔ TypeScript</strong>
              (same runtime, TypeScript is a superset), <strong>Python ↔ JavaScript</strong>
              for data processing logic (similar high-level constructs), and{' '}
              <strong>Java ↔ C#</strong> (similar OOP model, similar standard library
              patterns). These pairs produce output that requires minimal manual cleanup.
            </p>
          </section>

          {/* What always needs review */}
          <section
            aria-labelledby="needs-review"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="needs-review"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What always needs human review after conversion
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Memory management</span>
                <span>
                  Languages with manual memory management (C, C++, Rust) require
                  explicit allocation and deallocation that has no equivalent in
                  garbage-collected languages. Conversion produces functionally correct
                  code but may introduce memory leaks or dangling pointer risks that
                  a converter cannot handle automatically.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Concurrency models</span>
                <span>
                  Python&apos;s GIL, JavaScript&apos;s event loop, Go&apos;s goroutines, and Java&apos;s
                  threads are fundamentally different. Concurrent code that works
                  correctly in one language may be semantically wrong or unsafe
                  after direct translation to another.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Standard library differences</span>
                <span>
                  A Python function that uses{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">datetime.strptime()</code>{' '}
                  doesn&apos;t directly map to JavaScript&apos;s{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Date</code> API —
                  the format strings are different and the timezone handling is inconsistent.
                  Library-dependent code always needs manual verification.
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
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "Error Message Solver", path: "/tools/error-message-solver" },
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. code-explainer ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/code-explainer/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Code Explainer: How to Use AI Explanations Without Losing Understanding" />
          <meta
            itemProp="description"
            content="What AI code explanations are good for, the three cases where they mislead you, and how to use them as a learning tool rather than a shortcut."
          />
          <meta itemProp="datePublished" content="2024-04-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What AI explanations are good for */}
          <section aria-labelledby="what-good-for" className="space-y-4">
            <h2
              id="what-good-for"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What AI code explanations are actually good for
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              AI explanations excel at three tasks: translating unfamiliar syntax into
              plain language (&quot;what does this arrow function with destructuring do?&quot;),
              summarizing what a function does at a high level when you&apos;re reading
              someone else&apos;s codebase, and identifying the general pattern being
              used (&quot;this is a memoization cache with a fixed-size eviction policy&quot;).
              These are orientation tasks — the explanation gets you to the right
              conceptual frame faster than reading documentation from scratch.
            </p>
          </section>

          {/* Where they mislead */}
          <section
            aria-labelledby="where-mislead"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="where-mislead"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three cases where AI explanations mislead you
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Domain-specific business logic</span>
                <span>
                  An AI explaining a function named{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">calculateSettlementFee()</code>{' '}
                  will describe what the math does, not why the business rule exists.
                  Understanding the intent requires reading the spec, the ticket, or
                  asking the original author — the AI doesn&apos;t have that context.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Side effects and state mutations</span>
                <span>
                  AI explanations tend to describe what a function returns but
                  understate what it changes globally — database writes, cache
                  invalidations, external API calls, event emissions. These side
                  effects are often more important than the return value and are
                  easily missed in a summary.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Confident explanations of buggy code</span>
                <span>
                  If you paste code that has a subtle bug, an AI explanation often
                  describes what the code was intended to do, not what it actually
                  does wrong. It explains the logic as if it were correct. Always
                  test the code; don&apos;t rely on an explanation to verify correctness.
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
                  { name: "Code Converter", path: "/tools/code-converter" },
                  { name: "Error Message Solver", path: "/tools/error-message-solver" },
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. diagram-generator ──────────────────────────────────────────────────────
replaceArticle('src/app/tools/diagram-generator/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Diagram Generator: Which Diagram Type to Use and When" />
          <meta
            itemProp="description"
            content="A practical guide to choosing between flowcharts, sequence diagrams, ER diagrams, and architecture diagrams — and the diagram mistake that adds confusion instead of clarity."
          />
          <meta itemProp="datePublished" content="2024-04-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Which diagram for which purpose */}
          <section aria-labelledby="which-diagram" className="space-y-4">
            <h2
              id="which-diagram"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which diagram type to use for each purpose
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Diagram type</th>
                    <th className="border border-border p-2 text-left font-semibold">Use when</th>
                    <th className="border border-border p-2 text-left font-semibold">Don&apos;t use when</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Flowchart', 'Showing a decision process or algorithm with branching paths', 'Showing system components — use architecture diagram instead'],
                    ['Sequence diagram', 'Showing the order of messages/calls between components over time', 'Showing static structure — use class or ER diagram'],
                    ['ER diagram', 'Showing database tables and their relationships (foreign keys)', 'Showing API flows — use sequence diagram'],
                    ['Architecture diagram', 'Showing how systems, services, and infrastructure connect', 'Showing code-level class relationships — use class diagram'],
                    ['Class diagram', 'Showing OOP classes, interfaces, and inheritance', 'Showing runtime message flow — use sequence diagram'],
                    ['State diagram', 'Showing how an object transitions between states', 'Showing multi-component interactions — use sequence diagram'],
                  ].map(([type, useWhen, dontUse]) => (
                    <tr key={type}>
                      <td className="border border-border p-2 font-medium text-foreground">{type}</td>
                      <td className="border border-border p-2 text-muted-foreground">{useWhen}</td>
                      <td className="border border-border p-2 text-muted-foreground">{dontUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* The diagram mistake */}
          <section
            aria-labelledby="diagram-mistake"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="diagram-mistake"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The diagram mistake that adds confusion instead of clarity
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The most common diagram mistake: putting too much in one diagram.
              A single diagram that shows database schema, API endpoints, UI components,
              and infrastructure all at once is unreadable — every reader sees different
              things and leaves with different mental models. The rule of thumb: one
              diagram, one audience, one question. An architecture diagram for a new
              engineer answers &quot;how do the systems connect?&quot;. A sequence diagram for
              a code reviewer answers &quot;what happens during checkout?&quot;. They are
              different diagrams for different questions.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Diagrams generated from text (Mermaid, PlantUML, Graphviz) age better
              than hand-drawn diagrams — they live next to the code in version control
              and update when the description updates. A PNG exported from a drawing
              tool and attached to a Confluence page will be out of date within three
              months.
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
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. grid-generator-for-free ────────────────────────────────────────────────
replaceArticle('src/app/tools/grid-generator-for-free/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSS Grid Generator: The Properties That Actually Control Layout" />
          <meta
            itemProp="description"
            content="How CSS Grid's two axes work, the three properties that control most layouts, and when to use Grid vs. Flexbox."
          />
          <meta itemProp="datePublished" content="2024-04-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How the two axes work */}
          <section aria-labelledby="two-axes" className="space-y-4">
            <h2
              id="two-axes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How CSS Grid&apos;s two axes work
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              CSS Grid controls layout along two axes simultaneously: the row axis
              (block direction, top to bottom) and the column axis (inline direction,
              left to right). This two-dimensional control is the key difference
              from Flexbox, which only controls one direction at a time.{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">grid-template-columns</code>{' '}
              defines the column track sizes;{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">grid-template-rows</code>{' '}
              defines the row track sizes. Items are placed automatically into the
              grid cells left-to-right, top-to-bottom, unless explicitly positioned.
            </p>
          </section>

          {/* Three key properties */}
          <section
            aria-labelledby="key-properties"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="key-properties"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The three properties that handle most grid layouts
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground font-mono">repeat() + fr</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    grid-template-columns: repeat(3, 1fr)
                  </code>{' '}
                  creates 3 equal-width columns that share available space.{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">fr</code>{' '}
                  (fractional unit) distributes remaining space after fixed widths
                  are subtracted. Mixing fixed and fr:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    200px 1fr 1fr
                  </code>{' '}
                  — sidebar fixed at 200px, two content columns split the rest equally.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground font-mono">auto-fill + minmax()</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
                  </code>{' '}
                  creates as many columns as fit at minimum 250px wide, each growing
                  to fill available space. This is the responsive card grid pattern
                  that works at any viewport width with no media queries.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground font-mono">grid-column / grid-row span</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    grid-column: span 2
                  </code>{' '}
                  makes an item occupy two column tracks. Used for featured cards,
                  hero items, or sidebars that span the full row height. Combine
                  with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">grid-row: span 2</code>{' '}
                  for magazine-style masonry-like layouts.
                </span>
              </li>
            </ul>
          </section>

          {/* Grid vs Flexbox */}
          <section aria-labelledby="grid-vs-flex" className="space-y-4">
            <h2
              id="grid-vs-flex"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use Grid vs. Flexbox
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Use <strong>Grid</strong> when you&apos;re thinking in rows AND columns — page
              layout, card grids, dashboard panels, any layout where items need to
              align across both axes. Use <strong>Flexbox</strong> when you&apos;re thinking
              in one direction — a navigation bar, a row of buttons, centering a single
              item, distributing items along one axis. The rule of thumb: Grid for
              the macro layout (the page structure), Flexbox for the micro layout
              (the content inside each grid cell).
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
                  { name: "CSS Box Shadow Generator", path: "/tools/box-shadow" },
                  { name: "Border Radius Generator", path: "/tools/border-radius" },
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');
