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

// ── 1. text-to-pdf ────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/text-to-pdf/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Text to PDF Converter: When Plain Text Is the Right Starting Point" />
          <meta
            itemProp="description"
            content="Why generating a PDF from plain text is sometimes better than converting from Word, the formatting options that matter, and the line ending issue that breaks output."
          />
          <meta itemProp="datePublished" content="2024-03-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* When plain text to PDF is the right choice */}
          <section aria-labelledby="when-right-choice" className="space-y-4">
            <h2
              id="when-right-choice"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When plain text to PDF is the right approach
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Converting plain text directly to PDF is useful in specific scenarios:
              you have log output, code snippets, or terminal output you want to share
              as a non-editable document; you&apos;re generating a simple document from
              a script or API response where opening Word would be unnecessary overhead;
              or you have a Markdown or plain text file you want to share with someone
              who doesn&apos;t have a text editor configured to render it.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For documents that require rich formatting — headers, tables, images,
              precise typography — start in Word or a Markdown editor with export,
              not from plain text. The text-to-PDF path produces a monospaced or
              proportional-font document with no structural hierarchy beyond line breaks.
            </p>
          </section>

          {/* The line ending problem */}
          <section
            aria-labelledby="line-ending-issue"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="line-ending-issue"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The line ending issue that breaks output
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Windows uses{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">CRLF</code>{' '}
              (carriage return + line feed, <code className="text-xs bg-muted px-1 py-0.5 rounded">\r\n</code>)
              line endings. Unix/macOS uses{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">LF</code>{' '}
              (<code className="text-xs bg-muted px-1 py-0.5 rounded">\n</code>) only.
              If your text file was created on Windows and a converter only handles
              LF, the carriage return characters appear as{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">^M</code>{' '}
              symbols or cause lines to overwrite each other in the output.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              This tool normalizes line endings before converting, so both CRLF and
              LF input produce correct output. If you&apos;re using a script-based
              converter and see garbled output, add a normalization step:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                text.replace(/\r\n/g, '\n')
              </code>{' '}
              before passing text to the PDF generator.
            </p>
          </section>

          {/* Font and encoding note */}
          <section aria-labelledby="encoding-note" className="space-y-4">
            <h2
              id="encoding-note"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Unicode and character encoding
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Plain text files should be UTF-8 encoded for correct handling of
              non-ASCII characters (accented letters, Arabic, Chinese, emoji).
              If your PDF shows question marks or boxes where special characters
              should appear, the source file is likely Latin-1 or another legacy
              encoding. Re-save it as UTF-8 in your text editor before converting.
              The PDF font must also include the required Unicode ranges — a font
              that only covers Latin characters will not render Arabic or CJK text.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related conversion tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Word to PDF", path: "/tools/word-to-pdf" },
                  { name: "Convert Image to PDF", path: "/tools/convert-image-to-pdf" },
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. text-to-word ───────────────────────────────────────────────────────────
replaceArticle('src/app/tools/text-to-word/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Text to Word Converter: Creating .docx Files from Plain Text" />
          <meta
            itemProp="description"
            content="Why you might generate a .docx from plain text, what structure gets added automatically, and when this approach saves time vs. when to use a proper template."
          />
          <meta itemProp="datePublished" content="2024-03-12" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* When this is useful */}
          <section aria-labelledby="when-useful" className="space-y-4">
            <h2
              id="when-useful"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When generating .docx from plain text saves time
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The most common use case: you have data from an API, a database export,
              or a script output that needs to be delivered as a Word document to a
              non-technical recipient. Converting plain text to .docx programmatically
              avoids opening Word manually and copy-pasting. Other cases: quickly
              creating a .docx file from a Markdown note, or packaging log output into
              a format an operations team can annotate with Word comments.
            </p>
          </section>

          {/* What structure gets added */}
          <section
            aria-labelledby="structure-added"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="structure-added"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What the converter adds automatically
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A .docx file is a ZIP archive containing XML files — document content
              in{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">word/document.xml</code>,
              styles in{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">word/styles.xml</code>,
              and relationships in{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">_rels/</code>.
              The converter wraps your plain text in the required XML structure,
              applies default paragraph styles (typically Calibri 11pt, standard
              Word Normal style), and packages it into the correct archive format.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Each newline in your text becomes a paragraph break in Word. There is
              no automatic heading detection — line 1 will not become a title heading
              unless the converter explicitly applies heading styles. If you need
              structured documents with real heading hierarchy, generate from Markdown
              (which maps # to Heading 1, ## to Heading 2) using a Markdown-to-docx
              library like pandoc or docx.js.
            </p>
          </section>

          {/* Limitation */}
          <section aria-labelledby="when-use-template" className="space-y-4">
            <h2
              id="when-use-template"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use a template instead
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              If the output needs to match a specific corporate style (logo, header,
              footer, specific fonts and colors), a plain text converter is the wrong
              tool. Use a .docx template file and inject content into it programmatically
              using docxtemplater (Node.js) or python-docx — these preserve all
              template formatting while substituting your dynamic content.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related conversion tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Word to PDF", path: "/tools/word-to-pdf" },
                  { name: "Text to PDF", path: "/tools/text-to-pdf" },
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. convert-image-to-pdf ───────────────────────────────────────────────────
replaceArticle('src/app/tools/convert-image-to-pdf/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Image to PDF Converter: Page Size, DPI, and Multi-Image Documents" />
          <meta
            itemProp="description"
            content="How images are embedded in PDFs, why DPI matters for print quality, and how to combine multiple images into one PDF correctly."
          />
          <meta itemProp="datePublished" content="2024-03-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How images are embedded */}
          <section aria-labelledby="how-embedded" className="space-y-4">
            <h2
              id="how-embedded"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How images are embedded in PDFs
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              When you convert an image to PDF, the image data is embedded directly
              inside the PDF file. JPEG images can be embedded as-is (the PDF spec
              natively supports JPEG streams), keeping file size close to the original.
              PNG images are typically re-compressed or converted to JPEG during
              embedding — if your PNG has transparency, the transparent areas become
              white (PDF pages have no built-in transparency at the page level).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The PDF page size and the image size are separate: the page is an A4
              or Letter frame, and the image is scaled to fit within it. If your image
              is wider than tall, landscape orientation preserves more image area than
              portrait. Most converters detect aspect ratio automatically.
            </p>
          </section>

          {/* DPI for print */}
          <section
            aria-labelledby="dpi-print"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="dpi-print"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              DPI and print quality
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              DPI (dots per inch) determines print sharpness. A screen image at 72–96
              DPI looks fine on a monitor but prints blurry — at A4 size (8.27 × 11.69
              inches), 72 DPI yields only 595 × 842 pixels. For sharp print output,
              you need the source image to be at least 1240 × 1754 pixels (150 DPI on
              A4) or ideally 2480 × 3508 pixels (300 DPI — professional print standard).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              A web screenshot at 1920 × 1080 pixels embedded on an A4 PDF page prints
              at roughly 231 DPI — acceptable for office documents but below the 300
              DPI threshold for photographic print quality. If the output will be
              professionally printed, start with the highest resolution source image
              available.
            </p>
          </section>

          {/* Multiple images */}
          <section aria-labelledby="multiple-images" className="space-y-4">
            <h2
              id="multiple-images"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Combining multiple images into one PDF
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The most common use case for image-to-PDF conversion is scanning:
              photographing multiple pages of a document and combining them into
              a single PDF file. Each image becomes one page. The page order matches
              the order you upload or select the images — most tools allow drag-to-reorder
              before generating. For smartphone scans, dedicated scanning apps
              (Adobe Scan, Microsoft Lens) handle perspective correction and contrast
              enhancement before conversion, producing cleaner results than a direct
              photo-to-PDF.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related conversion tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                  { name: "Convert PDF to Image", path: "/tools/convert-pdf-to-image" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. convert-pdf-to-image ───────────────────────────────────────────────────
replaceArticle('src/app/tools/convert-pdf-to-image/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="PDF to Image Converter: Resolution, Format Choice, and Multi-Page PDFs" />
          <meta
            itemProp="description"
            content="How PDF-to-image rendering works, what DPI to use for different outputs, and why some PDFs render as blank images."
          />
          <meta itemProp="datePublished" content="2024-03-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How rendering works */}
          <section aria-labelledby="how-rendering" className="space-y-4">
            <h2
              id="how-rendering"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How PDF-to-image rendering works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              PDF rendering is a two-step process: parse the PDF&apos;s vector instructions
              (text positions, shapes, embedded images) then rasterize them to pixels
              at a target DPI. At 72 DPI, an A4 page becomes 595 × 842 pixels —
              fine for on-screen preview. At 150 DPI it&apos;s 1240 × 1754 — suitable for
              web display. At 300 DPI it&apos;s 2480 × 3508 — the threshold for professional
              printing. Higher DPI produces sharper text, especially for small fonts,
              at the cost of larger file size.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Browser-based PDF rendering uses PDF.js (Mozilla&apos;s open-source library,
              the same engine Firefox uses internally). It handles text fonts, embedded
              images, and most vector graphics correctly. Complex PDFs with unusual
              fonts, encryption, or advanced transparency features may render
              differently than in Adobe Acrobat.
            </p>
          </section>

          {/* Format choice */}
          <section
            aria-labelledby="format-choice"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="format-choice"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              PNG vs. JPEG for the output image
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Choose <strong>PNG</strong> when the PDF contains text, diagrams, or
              screenshots — lossless compression preserves sharp edges and readable
              text at any size. JPEG compression blurs edges and creates artifacts
              around high-contrast text (the dark letters on white background pattern
              is the worst case for JPEG&apos;s DCT algorithm).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Choose <strong>JPEG</strong> only for PDFs that are entirely photographic
              (scanned photos, image-heavy documents with no text). JPEG at quality 85+
              reduces file size by 60–70% vs. PNG with negligible visible quality loss
              on photographs. For a mixed document (text + photos), PNG is the safer
              choice.
            </p>
          </section>

          {/* Blank image issue */}
          <section aria-labelledby="blank-image" className="space-y-4">
            <h2
              id="blank-image"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why some PDFs render as blank images
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Three common causes: (1) <strong>Password-protected PDFs</strong> — the
              renderer cannot access content without the password. Remove protection
              in Acrobat or use a PDF unlocking tool first. (2){' '}
              <strong>PDFs with only scanned images</strong> — if the &quot;text&quot; in the PDF
              is actually a scanned image at very low contrast, it may appear blank
              when the contrast isn&apos;t boosted during rendering. (3){' '}
              <strong>Corrupted PDF structure</strong> — a partially downloaded or
              damaged PDF may parse with empty pages. Try opening in Acrobat to
              verify the file is intact before converting.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related conversion tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Convert Image to PDF", path: "/tools/convert-image-to-pdf" },
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. test-speed-connection ──────────────────────────────────────────────────
replaceArticle('src/app/tools/test-speed-connection/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Internet Speed Test: What Download, Upload, and Latency Numbers Mean" />
          <meta
            itemProp="description"
            content="What the three speed test metrics mean for real use cases, why your test result differs from your ISP's advertised speed, and how to get a more accurate baseline."
          />
          <meta itemProp="datePublished" content="2024-04-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What the numbers mean */}
          <section aria-labelledby="what-numbers-mean" className="space-y-4">
            <h2
              id="what-numbers-mean"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What download, upload, and latency actually mean
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Metric</th>
                    <th className="border border-border p-2 text-left font-semibold">What it measures</th>
                    <th className="border border-border p-2 text-left font-semibold">Matters most for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Download speed (Mbps)', 'How fast data arrives from the internet to your device', 'Streaming (4K needs ~25 Mbps), large file downloads, web browsing'],
                    ['Upload speed (Mbps)', 'How fast data leaves your device to the internet', 'Video calls (Zoom needs ~3 Mbps up), uploading files, sending email attachments'],
                    ['Latency / Ping (ms)', 'Round-trip time for a packet to reach a server and return', 'Online gaming (<50ms ideal), video calls, VoIP quality'],
                    ['Jitter (ms)', 'Variation in latency between packets', 'Video calls (high jitter = choppy audio), streaming (causes buffering)'],
                  ].map(([metric, measures, matters]) => (
                    <tr key={metric}>
                      <td className="border border-border p-2 font-medium text-foreground">{metric}</td>
                      <td className="border border-border p-2 text-muted-foreground">{measures}</td>
                      <td className="border border-border p-2 text-muted-foreground">{matters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why results differ from advertised speed */}
          <section
            aria-labelledby="why-different"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="why-different"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why your result is lower than the advertised speed
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              ISPs advertise &quot;up to&quot; speeds — the theoretical maximum under ideal
              conditions. Real-world factors that reduce speed: network congestion
              during peak hours (evenings and weekends), WiFi overhead and signal
              interference (a wired Ethernet connection is always faster and more
              consistent), the distance to the speed test server (closer servers
              = lower latency = higher measured throughput for short tests), and
              the number of devices sharing the connection.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For the most accurate baseline: run the test with a wired Ethernet
              connection, close other tabs and apps, run it three times at different
              times of day, and average the results. A single speed test result is
              a snapshot — the average across multiple tests is your true baseline.
              If your wired result is consistently below 80% of your advertised plan
              speed, contact your ISP with the test results as documentation.
            </p>
          </section>

          {/* Speed requirements reference */}
          <section aria-labelledby="speed-reference" className="space-y-4">
            <h2
              id="speed-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Minimum speeds for common activities
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              HD video streaming (Netflix, YouTube 1080p): 5–8 Mbps down per stream.
              4K streaming: 25 Mbps per stream. Zoom video call: 3 Mbps up and down
              for HD, 1.5 Mbps for 720p. Remote desktop (full-screen RDP/VNC): 5–10
              Mbps for smooth experience. Online gaming: download speed matters less
              than latency — 20 Mbps is more than enough; keep latency under 50ms and
              jitter under 10ms for competitive play.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related network tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                  { name: "IP Lookup", path: "/tools/ip-lookup" },
                  { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');
