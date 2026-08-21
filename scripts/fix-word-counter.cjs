const fs = require('fs');
const content = fs.readFileSync('src/app/tools/word-counter/page.tsx', 'utf8');

// Find the inner article (after the outer one with the h2 heading)
// The template article is the one with itemScope TechArticle
const articleStart = content.indexOf('<article\n          className="space-y-12');
if (articleStart === -1) {
  // Try different spacing
  const alt = content.indexOf('<article\n        className="space-y-12');
  console.log('Alt start:', alt);
  // Just find the TechArticle one
  const techStart = content.indexOf('itemType="https://schema.org/TechArticle"');
  console.log('TechArticle at:', techStart);
  // Back up to find <article
  const articleIdx = content.lastIndexOf('<article', techStart);
  console.log('article tag at:', articleIdx);
  process.exit(1);
}

const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;
console.log('Article starts at:', articleStart, 'ends at:', articleEnd);

const newArticle = `<article
          className="space-y-12"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Word Counter: How It Counts and Where It Differs from Word Processors" />
          <meta
            itemProp="description"
            content="The tool counts words by splitting on whitespace. It differs from Google Docs in one key way: it counts only what you paste, nothing more. Honest limitations included."
          />
          <meta itemProp="datePublished" content="2024-01-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* The problem */}
          <section aria-labelledby="problem-heading" className="space-y-4">
            <h2
              id="problem-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When word processors give you the wrong count
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Google Docs counts everything in the document — headers, footers, footnotes,
              captions — unless you manually select body text first and then check &quot;Selected
              text only.&quot; Most people don&apos;t do this. The result: you think you hit the 250-word
              abstract limit for your journal submission, but 40 of those words are in footnotes
              that the editor&apos;s system won&apos;t count.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              This tool counts exactly what you paste. Copy just the body text, paste it here,
              and get the count for that specific text. No headers, no hidden metadata, no
              document-level settings to toggle. It also handles cases where you need character
              counts with or without spaces — a metric Google Docs buries in a submenu, but
              which LinkedIn posts, Twitter/X, and SMS gateways actually enforce.
            </p>
          </section>

          {/* Character limits by platform */}
          <section
            aria-labelledby="platform-limits"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="platform-limits"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Character limits you actually need to know
            </h2>
            <p className="text-sm text-muted-foreground">
              Platform limits as of May 2026. When a platform says &quot;characters&quot; it usually
              means Unicode code points, not bytes — emoji count as 1, not 4.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform / Context</th>
                    <th className="border border-border p-2 text-left font-semibold">Limit</th>
                    <th className="border border-border p-2 text-left font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Twitter / X post', '280', 'characters (URLs count as 23)'],
                    ['LinkedIn post', '3,000', 'characters'],
                    ['LinkedIn article title', '150', 'characters'],
                    ['Instagram caption', '2,200', 'characters (only 125 shown before More)'],
                    ['Meta title tag', '50–60', 'characters (SERP display, not hard limit)'],
                    ['Meta description', '155–160', 'characters (SERP display, not hard limit)'],
                    ['SMS (GSM-7)', '160', 'characters per segment (multi-part above 160)'],
                    ['YouTube video title', '100', 'characters (60 shown in search)'],
                    ['Email subject line', '~60', 'characters shown in most clients'],
                  ].map(([platform, limit, type]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 text-muted-foreground">{platform}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{limit}</td>
                      <td className="border border-border p-2 text-muted-foreground">{type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How it counts — and where it differs */}
          <section aria-labelledby="how-counting-works" className="space-y-4">
            <h2
              id="how-counting-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How the counter works — and where you&apos;ll see differences
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Words are counted by splitting the text on whitespace sequences — the same
              approach used by Unix&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">wc -w</code> command.
              A &quot;word&quot; is any non-whitespace sequence. Reading time is estimated at 238 words
              per minute, which is the median silent reading speed for adults according to a
              2019 meta-analysis across 190 studies.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Three edge cases where counts differ between tools:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Hyphenated words</span>
                <span>
                  &quot;well-known&quot; counts as <em>one word</em> here (no space = one token). MS Word
                  and Google Docs also count it as one. Some academic style guides count it
                  as two. If your submission has a strict limit and uses hyphenated compounds,
                  check the style guide.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">URLs</span>
                <span>
                  A URL like{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">https://example.com/path?q=1</code>{' '}
                  counts as one word. In practice, a link in your text will inflate word count
                  by 1 but character count significantly.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Code blocks</span>
                <span>
                  If you paste code, every token (function name, variable, keyword) counts
                  as a word. A 10-line function might add 30–50 words to your count. Copy
                  prose sections separately from code if you need accurate word counts for
                  written content.
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
              Related text tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                  { name: "Diff Checker", path: "/tools/diff-checker" },
                ]}
              />
            </nav>
          </section>
        </article>`;

// Find the TechArticle article block
const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
const articleTagStart = content.lastIndexOf('<article', techIdx);
const articleTagEnd = content.lastIndexOf('</article>') + '</article>'.length;

console.log('Replacing from', articleTagStart, 'to', articleTagEnd);

const newContent = content.slice(0, articleTagStart) + newArticle + content.slice(articleTagEnd);
fs.writeFileSync('src/app/tools/word-counter/page.tsx', newContent, 'utf8');
console.log('Done. Lines written:', newContent.split('\n').length);
