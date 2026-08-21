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

// ── 1. edit-image ─────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/edit-image/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Online Image Editor: What Browser-Based Editing Can and Can't Do" />
          <meta
            itemProp="description"
            content="Which image editing tasks work well in a browser, where the quality gap with desktop software is significant, and the non-destructive editing principle that saves you from mistakes."
          />
          <meta itemProp="datePublished" content="2024-04-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What works well in a browser */}
          <section aria-labelledby="what-works" className="space-y-4">
            <h2
              id="what-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What browser-based image editing handles well
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Browser image editors use the HTML Canvas API for pixel operations —
              the same rendering engine that powers web graphics. Tasks that work well:
              cropping and resizing (Canvas scaling is fast and accurate), brightness
              and contrast adjustments (pixel-level arithmetic, no quality loss beyond
              the rounding inherent in 8-bit channels), rotating and flipping (lossless
              for 90° increments, slight quality loss for arbitrary angles due to
              interpolation), and adding text or simple shapes as overlays.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              These are the tasks that represent 80% of everyday image editing needs —
              resizing a photo for a blog post, cropping a product shot, adding a
              watermark, or adjusting the exposure on a screenshot. For these,
              a browser tool is fast enough and produces acceptable output without
              installing software.
            </p>
          </section>

          {/* Where quality gaps exist */}
          <section
            aria-labelledby="quality-gaps"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="quality-gaps"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Where browser editors fall short of desktop software
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Layer-based compositing</span>
                <span>
                  Desktop tools like Photoshop and GIMP work with non-destructive
                  layers — you can adjust, mask, and reorder elements at any time.
                  Most browser editors flatten operations to the Canvas on each step,
                  making changes permanent. The only exception is purpose-built browser
                  tools like Photopea, which implements full layer support.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">16-bit and RAW files</span>
                <span>
                  Browser Canvas operates in 8-bit per channel (0–255 per RGB channel).
                  16-bit images from professional cameras are downsampled on import,
                  losing precision in highlights and shadows. RAW files require a
                  dedicated decoder that browsers don&apos;t include.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Large files (&gt;50 MB)</span>
                <span>
                  Browser memory limits can cause the tab to crash when working with
                  very large source images, especially during operations that require
                  multiple copies of the image in memory simultaneously.
                </span>
              </li>
            </ul>
          </section>

          {/* Non-destructive principle */}
          <section aria-labelledby="non-destructive" className="space-y-4">
            <h2
              id="non-destructive"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Always keep your original
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The most important rule for any image editing workflow: never overwrite
              your original file. Save edited versions as new files with descriptive
              names (e.g.,{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">hero-cropped-1200x630.jpg</code>).
              This is especially important in browser editors where many operations
              are destructive — once you flatten a canvas or close the tab, the
              intermediate state is gone. Keep originals in their highest-quality
              format (PNG or original JPEG before any re-compression) and export
              final versions at the target quality.
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
                  { name: "Image Converter", path: "/tools/image-converter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. edit-pdf ───────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/edit-pdf/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="PDF Editor: What You Can Actually Edit in a PDF and What You Can't" />
          <meta
            itemProp="description"
            content="Why editing a PDF is harder than editing a Word document, which operations work reliably in browser PDF editors, and when to go back to the source file."
          />
          <meta itemProp="datePublished" content="2024-04-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why PDF editing is hard */}
          <section aria-labelledby="why-hard" className="space-y-4">
            <h2
              id="why-hard"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why editing a PDF is harder than it should be
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              PDF was designed for faithful reproduction of a fixed layout, not for
              editing. Text in a PDF is stored as positioned character sequences with
              absolute coordinates — there are no paragraph objects, no flowing text
              blocks, no document structure that knows a sentence continues on the
              next line. Changing one word can require repositioning every character
              that follows it on the same line, since the PDF engine doesn&apos;t
              automatically reflow text.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              This is why PDF editors add text by placing a new text box on top of
              the existing content, rather than truly editing in-place. For small
              corrections (changing a number, fixing a typo in a single word), this
              works well. For structural changes (adding a paragraph, restructuring
              a section), it breaks down quickly.
            </p>
          </section>

          {/* What works reliably */}
          <section
            aria-labelledby="what-works"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What browser PDF editors handle reliably
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Adding text annotations</span>
                <span>
                  Placing new text boxes on top of existing content — for adding
                  notes, filling in form fields, or inserting a signature date.
                  The original content is not modified.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Highlighting and markup</span>
                <span>
                  Highlight, underline, and strikethrough annotations work correctly
                  in most browser PDF editors and are preserved when the PDF is
                  opened in Acrobat or other readers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Adding images and signatures</span>
                <span>
                  Inserting a signature image (PNG with transparent background) or
                  a stamp/logo over existing content. Standard use case: signing
                  contracts without printing.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Rotating and reordering pages</span>
                <span>
                  Page-level operations — rotating a landscape page to portrait,
                  moving pages, or deleting pages — work reliably since they operate
                  on whole page objects, not individual content elements.
                </span>
              </li>
            </ul>
          </section>

          {/* When to use the source file */}
          <section aria-labelledby="use-source" className="space-y-4">
            <h2
              id="use-source"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to edit the source file instead
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              If you need to change a sentence, restructure a section, or update
              formatting across multiple pages, editing the original source document
              (Word, InDesign, Google Docs, or whatever generated the PDF) and
              re-exporting to PDF is almost always faster and produces a cleaner
              result. PDF editing is for small corrections and annotations on documents
              where you don&apos;t have access to the source. If you have the source, use it.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related PDF tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                  { name: "Word to PDF", path: "/tools/word-to-pdf" },
                  { name: "Convert Image to PDF", path: "/tools/convert-image-to-pdf" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. text-humanizer ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/text-humanizer/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="AI Text Humanizer: What It Changes, What It Can't Fix, and Where It Helps Most" />
          <meta
            itemProp="description"
            content="What patterns make AI-generated text detectable, which transformations a humanizer applies, and the two contexts where it genuinely improves output vs. where it doesn't help."
          />
          <meta itemProp="datePublished" content="2024-04-14" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What makes AI text detectable */}
          <section aria-labelledby="what-makes-detectable" className="space-y-4">
            <h2
              id="what-makes-detectable"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What patterns make AI-generated text detectable
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              AI language models generate text by predicting the most statistically
              likely next token. This creates detectable patterns: uniform sentence
              length (most sentences cluster around 15–25 words), excessive use of
              transition phrases (&quot;Furthermore,&quot; &quot;Moreover,&quot; &quot;It is important to note&quot;),
              consistent paragraph structure where every paragraph has the same
              arc (claim → evidence → conclusion), and low lexical diversity (the same
              words reused where a human writer would vary).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              AI detectors look for these statistical regularities. A humanizer tool
              introduces variation: sentence length variance, synonym substitution,
              structural rearrangement, and removal of stock transition phrases. The
              result is statistically less uniform — closer to what human writing
              looks like in aggregate.
            </p>
          </section>

          {/* Where it helps most */}
          <section
            aria-labelledby="where-helps"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="where-helps"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Where humanizing AI text genuinely improves it
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Drafts as a starting point</span>
                <span>
                  AI-generated first drafts are often verbose and structurally
                  repetitive. A humanizer pass that shortens sentences, removes
                  filler phrases, and introduces structural variety makes the draft
                  faster to edit into a final piece — even if you plan to rewrite
                  most of it manually.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Technical content with flat tone</span>
                <span>
                  AI documentation and explanatory text tends to be technically
                  accurate but tonally flat — every sentence carries equal weight.
                  A humanizer can vary sentence rhythm so key points land harder
                  than supporting detail, improving reader comprehension.
                </span>
              </li>
            </ul>
          </section>

          {/* What it can't fix */}
          <section aria-labelledby="cant-fix" className="space-y-4">
            <h2
              id="cant-fix"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a humanizer cannot fix
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A humanizer works on surface-level patterns — word choice, sentence
              length, transitions. It cannot add original insights, first-person
              experience, or specific examples that only a real person would know.
              AI detectors increasingly look for content originality and specificity
              (real numbers, named sources, personal perspective) rather than just
              surface patterns. A humanized version of generic AI content is still
              generic. The strongest signal of human writing is the presence of
              specific, verifiable, opinionated content — a humanizer tool cannot
              generate that.
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
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. uml-ai ─────────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/uml-ai/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="AI UML Diagram Generator: Which Diagrams AI Generates Well and Which Need Manual Work" />
          <meta
            itemProp="description"
            content="How AI generates UML from text descriptions, which diagram types it handles accurately, and the three common errors to check before sharing a generated diagram."
          />
          <meta itemProp="datePublished" content="2024-04-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How AI generates UML */}
          <section aria-labelledby="how-ai-generates" className="space-y-4">
            <h2
              id="how-ai-generates"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How AI generates UML from a text description
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The tool converts your natural language description into a UML text
              notation (typically Mermaid or PlantUML syntax), then renders that
              notation as a diagram. Mermaid is a JavaScript library that renders
              diagram code in the browser — no server-side rendering required.
              PlantUML requires a Java-based renderer or an online server.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The AI step translates your description (&quot;a sequence diagram showing
              a user logging in, the frontend calling the auth API, the API checking
              the database, and returning a JWT token&quot;) into the precise syntax
              that the renderer understands. The quality of the output depends on
              how precisely you described the relationships, participants, and flow.
            </p>
          </section>

          {/* Which diagrams work well */}
          <section
            aria-labelledby="which-work"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="which-work"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which UML types AI generates accurately
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Diagram type</th>
                    <th className="border border-border p-2 text-left font-semibold">AI accuracy</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Sequence diagram', 'High', 'Clear participant/message structure maps well to text description'],
                    ['Class diagram (simple)', 'High', 'Class names, attributes, and basic relationships translate accurately'],
                    ['Flowchart', 'High', 'Decision trees and process flows described in steps work well'],
                    ['State diagram', 'Medium', 'State names are accurate; transition conditions sometimes misinterpreted'],
                    ['Class diagram (complex)', 'Medium', 'Inheritance hierarchies and multiplicities need manual verification'],
                    ['ER diagram', 'Medium', 'Table relationships work; composite keys and constraints often missing'],
                    ['Use case diagram', 'Lower', 'Actor/system boundaries and include/extend relationships frequently wrong'],
                  ].map(([type, accuracy, notes]) => (
                    <tr key={type}>
                      <td className="border border-border p-2 text-muted-foreground">{type}</td>
                      <td className={'border border-border p-2 font-medium ' + (accuracy === 'High' ? 'text-green-600' : accuracy === 'Lower' ? 'text-red-600' : 'text-yellow-600')}>{accuracy}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Three errors to check */}
          <section aria-labelledby="errors-to-check" className="space-y-4">
            <h2
              id="errors-to-check"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three errors to always check in generated diagrams
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Before sharing a generated UML diagram, verify: (1){' '}
              <strong>Arrow direction</strong> — AI frequently reverses relationship
              directions in class and ER diagrams. Check that inheritance arrows point
              from child to parent, and that association arrows reflect the correct
              navigability. (2) <strong>Missing elements</strong> — describe 8 components
              and the AI may render 6, silently dropping the less-mentioned ones.
              Count participants and elements against your description. (3){' '}
              <strong>Incorrect cardinality</strong> — &quot;one-to-many&quot; relationships
              often appear as &quot;one-to-one&quot; in generated ER diagrams. Check every
              relationship multiplicity label explicitly.
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
                  { name: "Diagram Generator", path: "/tools/diagram-generator" },
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nBatch 13 done (4 pages).');
