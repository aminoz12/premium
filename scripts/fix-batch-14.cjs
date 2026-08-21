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

// ── 1. remove-bg ──────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/remove-bg/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Background Remover: How AI Segmentation Works and What It Gets Wrong" />
          <meta
            itemProp="description"
            content="How neural network background removal works in a browser, which subjects it handles well, and the four image types where it fails consistently."
          />
          <meta itemProp="datePublished" content="2024-04-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How AI background removal works in a browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Browser-based background removal uses a lightweight neural network model
              (typically a variant of U2-Net or RMBG) running in WebAssembly or via
              the Web AI APIs. The model performs semantic segmentation: it classifies
              each pixel as foreground (subject) or background, producing a mask.
              That mask is then applied to the original image to make background
              pixels transparent, outputting a PNG with an alpha channel.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The model runs entirely in your browser — your photo is not uploaded to
              a server. Processing time depends on image resolution and your device&apos;s
              GPU: a 1920×1080 photo typically takes 1–5 seconds on a modern laptop.
              The model weights are downloaded once and cached, so subsequent uses
              are faster.
            </p>
          </section>

          {/* What it handles well vs poorly */}
          <section
            aria-labelledby="accuracy"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="accuracy"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What the model handles well — and what it gets wrong
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>Works well:</strong> people on solid or simple backgrounds
              (the dominant training case), product photos on white or light-colored
              backgrounds, animals with clear silhouettes, and cars. These subjects
              have distinct color contrast at their edges and match the model&apos;s
              training distribution.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mt-4">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Hair and fur</span>
                <span>
                  Fine strands of hair and fur are the hardest case for segmentation.
                  The model often produces a rough silhouette that clips hair edges.
                  For professional product shots requiring perfect hair, use a
                  dedicated tool like Photoshop Select &amp; Mask or remove.bg&apos;s
                  paid tier, which uses higher-resolution models.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Transparent or glass objects</span>
                <span>
                  Wine glasses, bottles, and transparent objects confuse the model —
                  the background is visible through the subject, making the
                  foreground/background boundary undefined. Expect rough masks.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Complex backgrounds matching subject color</span>
                <span>
                  A person wearing a white shirt against a white wall, or a dark
                  object on a dark background — when subject and background share
                  similar colors, the model cannot find an edge to cut along.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Very busy or detailed backgrounds</span>
                <span>
                  Crowds, forests, and cluttered scenes with many overlapping objects
                  at the subject boundary produce noisy masks with artifacts.
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
              Related image tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Converter", path: "/tools/image-converter" },
                  { name: "Image Resizer", path: "/tools/image-resizer" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. video-to-audio ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/video-to-audio/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Video to Audio Extractor: Formats, Quality, and What the Browser Actually Does" />
          <meta
            itemProp="description"
            content="How browsers demux video to extract audio, which output formats preserve quality vs. which re-encode, and the file size difference between MP3 and M4A for the same content."
          />
          <meta itemProp="datePublished" content="2024-04-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How browser extraction works */}
          <section aria-labelledby="how-extraction-works" className="space-y-4">
            <h2
              id="how-extraction-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How browsers extract audio from video
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The Web Audio API and the browser&apos;s media pipeline can demultiplex video
              containers — separating the audio stream from the video stream — and
              re-encode or pass through the audio data. For an MP4 file containing
              AAC audio and H.264 video, the browser reads the audio track, decodes
              it to raw PCM samples, then re-encodes to the target format (MP3, WAV,
              or M4A). This processing happens in your browser tab — no video data
              is uploaded.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For large files (1 GB+ videos), the browser reads the file in chunks
              rather than loading the entire file into memory. Processing time scales
              with video duration, not file size: a 2-hour video takes roughly 30–60
              seconds to extract audio from, depending on the target format and
              encoding settings.
            </p>
          </section>

          {/* Format comparison */}
          <section
            aria-labelledby="format-comparison"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="format-comparison"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Output format comparison: MP3 vs. M4A vs. WAV
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Format</th>
                    <th className="border border-border p-2 text-left font-semibold">~Size for 1 hr audio</th>
                    <th className="border border-border p-2 text-left font-semibold">Quality</th>
                    <th className="border border-border p-2 text-left font-semibold">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MP3 (128 kbps)', '~56 MB', 'Good — audible artifacts on high-frequency content', 'Podcasts, speech, broad compatibility'],
                    ['MP3 (320 kbps)', '~140 MB', 'Excellent — near-transparent for most listeners', 'Music, archiving with compression'],
                    ['M4A / AAC (128 kbps)', '~56 MB', 'Better than MP3 at same bitrate — more efficient codec', 'Apple devices, streaming platforms'],
                    ['WAV (PCM)', '~600 MB', 'Lossless — exact copy of the decoded audio', 'Editing, archiving, professional use'],
                    ['OGG Vorbis (128 kbps)', '~56 MB', 'Comparable to AAC — open format', 'Web audio, open-source projects'],
                  ].map(([format, size, quality, bestFor]) => (
                    <tr key={format}>
                      <td className="border border-border p-2 font-medium text-foreground">{format}</td>
                      <td className="border border-border p-2 text-muted-foreground">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground">{quality}</td>
                      <td className="border border-border p-2 text-muted-foreground">{bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: if your source video already has lossy audio (AAC, MP3), re-encoding
              to another lossy format introduces generation loss — each encode slightly
              degrades quality. For archiving, use WAV once, then encode to your
              target format from the WAV master.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related media tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Audio Converter", path: "/tools/audio-converter" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Converter", path: "/tools/image-converter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. chat-with-pdf ──────────────────────────────────────────────────────────
replaceArticle('src/app/tools/chat-with-pdf/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Chat with PDF: How RAG Works and What It Gets Wrong" />
          <meta
            itemProp="description"
            content="How PDF Q&A tools use retrieval-augmented generation, why they hallucinate answers that aren't in the document, and how to prompt them to get accurate results."
          />
          <meta itemProp="datePublished" content="2024-04-25" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How RAG works */}
          <section aria-labelledby="how-rag-works" className="space-y-4">
            <h2
              id="how-rag-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How &quot;chat with PDF&quot; actually works under the hood
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              PDF Q&amp;A tools use Retrieval-Augmented Generation (RAG): the PDF text is
              split into chunks (typically 500–1000 tokens each), converted to vector
              embeddings, and stored in a local vector index. When you ask a question,
              the tool finds the chunks most semantically similar to your question,
              injects them into a prompt, and sends that to a language model. The
              model answers based only on those retrieved chunks — not the full document.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              This means the accuracy of the answer depends on two things: whether
              the relevant text was retrieved (retrieval accuracy), and whether the
              model correctly synthesized the retrieved text (generation accuracy).
              Both can fail independently — and when they fail, the tool often produces
              a confident-sounding wrong answer.
            </p>
          </section>

          {/* Why it hallucinates */}
          <section
            aria-labelledby="why-hallucinations"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="why-hallucinations"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why PDF Q&amp;A tools give wrong answers with confidence
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">The answer spans multiple sections</span>
                <span>
                  If the answer requires combining information from page 3 and page 47,
                  the retrieval step may only fetch one of those sections. The model
                  answers from incomplete context, filling the gap with plausible-sounding
                  but fabricated content.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">The question uses different words than the document</span>
                <span>
                  Vector similarity is not perfect synonym matching. Asking about
                  &quot;revenue&quot; when the document says &quot;sales&quot; may retrieve wrong chunks.
                  Rephrasing your question using the document&apos;s own terminology
                  dramatically improves retrieval accuracy.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">The document uses tables, charts, or images</span>
                <span>
                  Most RAG pipelines extract plain text. Data in tables is often
                  extracted poorly or incorrectly (merged cells, misaligned columns).
                  Charts and images are skipped entirely. Numerical answers from tables
                  are the highest-risk category for hallucination.
                </span>
              </li>
            </ul>
          </section>

          {/* How to get accurate results */}
          <section aria-labelledby="accurate-results" className="space-y-4">
            <h2
              id="accurate-results"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How to prompt for more accurate answers
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Ask the tool to quote the source passage: &quot;What does the document say
              about X? Quote the relevant section.&quot; If the tool can&apos;t quote it,
              the answer is likely hallucinated. For numerical data, ask for the
              page number or section: &quot;On what page is the revenue figure mentioned?&quot;
              Then verify manually. Treat every answer as a starting point for
              verification, not a final answer — especially for numbers, dates,
              names, and contractual terms.
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
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                  { name: "PDF Editor", path: "/tools/edit-pdf" },
                  { name: "Text Humanizer", path: "/tools/text-humanizer" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. ai-paraphrasing-tool-and-rewriter ──────────────────────────────────────
replaceArticle('src/app/tools/ai-paraphrasing-tool-and-rewriter/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="AI Paraphrasing Tool: When Rewriting Adds Value and When It Loses Meaning" />
          <meta
            itemProp="description"
            content="What a paraphrasing tool actually changes in your text, the three cases where it helps, and the two situations where automatic rewriting corrupts the original meaning."
          />
          <meta itemProp="datePublished" content="2024-04-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What it changes */}
          <section aria-labelledby="what-it-changes" className="space-y-4">
            <h2
              id="what-it-changes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a paraphrasing tool actually changes
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              An AI paraphrasing tool rewrites text by substituting synonyms, changing
              sentence structure, and varying grammatical construction while preserving
              the semantic meaning. At the word level: &quot;utilize&quot; becomes &quot;use&quot;,
              &quot;commence&quot; becomes &quot;start&quot;. At the sentence level: passive voice becomes
              active, or a complex compound sentence is split into two simpler ones.
              The model is optimizing for surface-level variation while keeping the
              propositional content intact.
            </p>
          </section>

          {/* When it helps */}
          <section
            aria-labelledby="when-helps"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="when-helps"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three situations where paraphrasing genuinely helps
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Simplifying dense text</span>
                <span>
                  Academic or legal writing often uses unnecessarily complex construction.
                  A paraphrase pass can reduce sentence length and replace jargon with
                  plain language — useful when adapting technical content for a
                  general audience.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Avoiding repetition</span>
                <span>
                  When the same phrase appears multiple times in a document, paraphrasing
                  provides alternative phrasing for the second and third occurrence —
                  improving readability without requiring the author to invent alternatives
                  from scratch.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Non-native language polishing</span>
                <span>
                  Writers working in a second language often produce grammatically
                  correct but unnaturally phrased text. A paraphrase pass naturalizes
                  phrasing to match native speaker patterns — faster than manually
                  looking up every expression.
                </span>
              </li>
            </ul>
          </section>

          {/* When it corrupts meaning */}
          <section aria-labelledby="when-corrupts" className="space-y-4">
            <h2
              id="when-corrupts"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Two cases where automatic rewriting corrupts the original meaning
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>Technical and precise content:</strong> a paraphrasing tool may
              substitute near-synonyms that are not actually equivalent in a technical
              context. &quot;The function returns null&quot; paraphrased as &quot;the function
              gives back nothing&quot; changes the data type from a specific value to an
              absence — meaningfully different in code. Always verify paraphrased
              technical content word by word.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>Hedged or qualified statements:</strong> academic and legal
              writing uses precise hedging (&quot;may,&quot; &quot;in some cases,&quot; &quot;under certain
              conditions&quot;). Paraphrasing tools frequently drop or change these qualifiers —
              turning a conditional claim into an absolute one. Check every hedge and
              qualifier in paraphrased scientific or contractual content.
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
                  { name: "Text Humanizer", path: "/tools/text-humanizer" },
                  { name: "Word Counter", path: "/tools/word-counter" },
                  { name: "Case Converter", path: "/tools/case-converter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. clean-text-using-ai ────────────────────────────────────────────────────
replaceArticle('src/app/tools/clean-text-using-ai/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="AI Text Cleaner: What It Strips, What It Fixes, and What to Check After" />
          <meta
            itemProp="description"
            content="What a text cleaning pass removes and corrects, the specific formatting artifacts that copy-paste introduces, and the three things to always verify manually after AI cleaning."
          />
          <meta itemProp="datePublished" content="2024-05-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What cleaning removes */}
          <section aria-labelledby="what-it-removes" className="space-y-4">
            <h2
              id="what-it-removes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What text cleaning actually removes
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Text copied from PDFs, Word documents, or web pages carries invisible
              formatting artifacts that cause problems when pasted into databases,
              APIs, or other documents. The most common artifacts:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mt-2">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Non-breaking spaces (U+00A0)</span>
                <span>
                  Copied from HTML where{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;nbsp;</code>{' '}
                  was used. Visually identical to a regular space but treated as a
                  different character in string comparisons and database storage —
                  a common cause of &quot;text looks right but doesn&apos;t match&quot; bugs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Smart quotes and typographic dashes</span>
                <span>
                  Word and macOS autocorrect &quot;straight quotes&quot; to curly &ldquo;smart quotes&rdquo;
                  and -- to —. In code contexts, these break JSON parsers, shell
                  scripts, and any system expecting ASCII punctuation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Extra whitespace and line breaks</span>
                <span>
                  PDF text extraction often produces hyphenation artifacts (split
                  words at line breaks), double spaces between sentences, and
                  inconsistent paragraph spacing.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Zero-width characters</span>
                <span>
                  Zero-width space (U+200B), zero-width non-joiner (U+200C), and
                  byte-order marks (U+FEFF) are invisible but can corrupt API
                  requests, break tokenization, and cause subtle database issues.
                  Common in text copied from web pages and certain document formats.
                </span>
              </li>
            </ul>
          </section>

          {/* What to check after */}
          <section
            aria-labelledby="what-to-check"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-to-check"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three things to verify manually after AI cleaning
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Intentional special characters</span>
                <span>
                  An AI cleaner may strip Unicode characters that look like artifacts
                  but are intentional — mathematical symbols, currency signs, or
                  technical notation. Check that domain-specific symbols survived.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Hyphenated words from PDF extraction</span>
                <span>
                  PDF line-break hyphens (&quot;for-\nmatted&quot;) should become
                  &quot;formatted&quot; — but the cleaner may not detect all cases, leaving
                  broken words in the output. Scan for unusual hyphenation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Quotation marks in code or data</span>
                <span>
                  If the text contains code examples, JSON, or CSV, smart-quote
                  normalization could corrupt the data. Verify that any
                  programmatic content retained its exact original punctuation.
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
                  { name: "Text Humanizer", path: "/tools/text-humanizer" },
                  { name: "HTML Escape", path: "/tools/html-escape" },
                  { name: "Word Counter", path: "/tools/word-counter" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nBatch 14 done (5 pages).');
