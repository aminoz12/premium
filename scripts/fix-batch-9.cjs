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

// ── 1. md5-hash ───────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/md5-hash/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="MD5 Hash Generator: What MD5 Is Still Good For and What It Isn't" />
          <meta
            itemProp="description"
            content="MD5 is broken for security but still useful for checksums and deduplication. Concrete collision numbers, what SHA-256 adds, and when to use each."
          />
          <meta itemProp="datePublished" content="2024-03-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What MD5 still does well */}
          <section aria-labelledby="what-md5-does" className="space-y-4">
            <h2
              id="what-md5-does"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What MD5 is still useful for in 2026
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              MD5 produces a 128-bit (32 hex character) digest in under 1 ms for most
              inputs. It is not secure for cryptographic purposes — collisions (two
              different inputs producing the same hash) have been demonstrated since 2004
              and can be engineered on consumer hardware. But for non-security uses, it
              remains practical:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">File integrity checksums</span>
                <span>
                  Verifying a downloaded file matches the published MD5 confirms the
                  file was not corrupted in transit. It does not protect against a
                  malicious server — for that, use SHA-256. MD5 is fine for detecting
                  accidental corruption (disk errors, truncated downloads).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Deduplication keys</span>
                <span>
                  Hashing file contents with MD5 to detect duplicates in a storage
                  system is safe — an attacker cannot force a collision in this context.
                  The collision attack requires crafting two specific files, not finding
                  a collision for an arbitrary existing file.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Cache busting</span>
                <span>
                  Appending an MD5 hash of a CSS or JS file to its URL forces browser
                  cache invalidation when the file changes. Webpack, Vite, and Next.js
                  use content hashes (often SHA-256 or xxHash) for this, but MD5 works
                  and was historically common.
                </span>
              </li>
            </ul>
          </section>

          {/* Why MD5 is broken for security */}
          <section
            aria-labelledby="why-broken"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="why-broken"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why MD5 is broken for security — with specific numbers
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              In 2008, researchers demonstrated an MD5 collision attack in under 30
              seconds on a standard laptop. In 2012, the Flame malware used an MD5
              collision to forge a Microsoft code-signing certificate — meaning software
              signed with that forged cert appeared valid to Windows. This is not a
              theoretical risk: real malware exploited it.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For passwords: MD5 is extremely fast — a modern GPU can compute{' '}
              <strong>60 billion MD5 hashes per second</strong>. An 8-character
              password hashed with MD5 can be brute-forced in minutes. Never store
              passwords as MD5 hashes. Use bcrypt (this site has a bcrypt tool),
              Argon2, or scrypt — algorithms specifically designed to be slow.
            </p>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How this tool generates the hash
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The hash is computed using the Web Crypto API&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.subtle.digest()</code>{' '}
              where available, or a pure-JavaScript fallback. The computation happens
              entirely in your browser — your input text is never sent to a server.
              Output is the standard lowercase hex representation.
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
                  { name: "SHA-256 Hash Generator", path: "/tools/sha256-hash" },
                  { name: "Hash Generator (multi-algorithm)", path: "/tools/hash-generator" },
                  { name: "Bcrypt Hash Generator", path: "/tools/bcrypt" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. sha256-hash ────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/sha256-hash/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="SHA-256 Hash Generator: Why SHA-256 Is the Current Standard and Its Limits" />
          <meta
            itemProp="description"
            content="SHA-256 output length, computation speed, real-world uses (TLS, Bitcoin, file verification), and the one thing SHA-256 cannot do that bcrypt can."
          />
          <meta itemProp="datePublished" content="2024-03-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why SHA-256 is standard */}
          <section aria-labelledby="why-standard" className="space-y-4">
            <h2
              id="why-standard"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why SHA-256 is the current standard general-purpose hash
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              SHA-256 (part of the SHA-2 family, standardized by NIST in 2001) produces
              a 256-bit (64 hex character) digest. No practical collision attacks exist —
              the theoretical collision resistance is 2^128 operations, which is beyond
              any foreseeable computing capability. SHA-256 is hardware-accelerated on
              modern CPUs via SHA extensions (available on Intel Skylake+, AMD Zen+, and
              Apple Silicon). A 1 MB file hashes in under 1 ms on modern hardware.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Where you encounter SHA-256 in practice: TLS certificates use it for
              signing (replacing SHA-1, which was deprecated in 2017). Bitcoin uses
              double-SHA-256 for proof-of-work and transaction signing. Git uses SHA-256
              for object addressing in newer repositories (SHA-1 in legacy repos). AWS
              S3 uses SHA-256 for request signing (Signature Version 4).
            </p>
          </section>

          {/* The one thing SHA-256 cannot do */}
          <section
            aria-labelledby="sha256-limit"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="sha256-limit"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The one thing SHA-256 cannot do: password storage
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              SHA-256 is fast by design. A consumer GPU (RTX 4090) can compute roughly{' '}
              <strong>21 billion SHA-256 hashes per second</strong>. An 8-character
              lowercase password has about 200 billion possible combinations — a GPU
              cracks it in under 10 seconds against a SHA-256 hash. A 10-character
              mixed-case password falls in minutes.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Password hashing algorithms — bcrypt, Argon2, scrypt — are deliberately
              slow: bcrypt at cost factor 12 takes ~300 ms per attempt. The same GPU
              that does 21 billion SHA-256 hashes per second does roughly{' '}
              <strong>21,000 bcrypt hashes per second</strong> — a million times slower.
              That gap is the entire security margin for stolen password databases.
              Never store passwords as SHA-256 hashes.
            </p>
          </section>

          {/* How this tool works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How this tool generates SHA-256
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The hash is computed using the browser&apos;s native{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                crypto.subtle.digest(&apos;SHA-256&apos;, data)
              </code>{' '}
              — part of the Web Crypto API, hardware-accelerated where the browser
              supports it. Your input never leaves the browser tab. Output is the
              standard lowercase hex string (64 characters).
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
                  { name: "MD5 Hash Generator", path: "/tools/md5-hash" },
                  { name: "Hash Generator (multi-algorithm)", path: "/tools/hash-generator" },
                  { name: "Bcrypt Hash Generator", path: "/tools/bcrypt" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. qr-code-reader ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/qr-code-reader/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="QR Code Reader: How Browser-Based Decoding Works and When It Fails" />
          <meta
            itemProp="description"
            content="How QR code decoding works in a browser without a camera, the image quality requirements for reliable reads, and what to do when a scan fails."
          />
          <meta itemProp="datePublished" content="2024-03-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How browser decoding works */}
          <section aria-labelledby="how-decoding-works" className="space-y-4">
            <h2
              id="how-decoding-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How QR decoding works in a browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This tool decodes QR codes from image files — JPEG, PNG, WebP, or a
              screenshot. Your image is drawn to an HTML Canvas element, the pixel
              data is extracted via{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">getImageData()</code>,
              and a JavaScript QR decoder (the jsQR library, MIT licensed) performs
              the matrix recognition and Reed-Solomon error correction entirely in your
              browser. No upload, no server, no camera required.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              This is useful for: decoding a QR code in a screenshot before printing
              to verify the URL is correct, extracting the URL from a QR code image
              you received, or checking what data a generated QR encodes without
              picking up your phone.
            </p>
          </section>

          {/* Why reads fail */}
          <section
            aria-labelledby="why-reads-fail"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="why-reads-fail"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why a QR code fails to decode — and how to fix it
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Image too small</span>
                <span>
                  The decoder needs the QR code modules (individual squares) to be
                  at least 2–3 pixels across. A QR code that appears 40×40 pixels in
                  the image is too small for reliable software decoding. Crop and
                  upscale the image so the QR fills at least 150×150 pixels.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Low contrast</span>
                <span>
                  Colored QR codes (non-black-on-white) or codes with busy backgrounds
                  reduce contrast below the decoder&apos;s threshold. If the code is white
                  on a light-colored background, or uses a dark color on a dark image,
                  decoding will fail. Standard black-on-white achieves near-100% decode rates.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Damaged or obscured finder patterns</span>
                <span>
                  The three square corner markers (finder patterns) are essential for
                  orientation. If any are cropped, covered by a logo, or obscured by
                  image compression artifacts, decoding fails. The error correction
                  modules protect data modules but not the finder patterns — those must
                  be intact.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">JPEG compression artifacts</span>
                <span>
                  Heavy JPEG compression around a QR code blurs module edges. If your
                  image is a JPEG, try saving it as PNG (lossless) before uploading,
                  or use a screenshot tool that captures at higher quality.
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
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "URL Encoder / Decoder", path: "/tools/url-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. pdf-to-word ────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/pdf-to-word/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="PDF to Word Converter: What Gets Preserved and What Gets Lost" />
          <meta
            itemProp="description"
            content="Why PDF-to-Word conversion is imperfect by design, which content types survive well vs. poorly, and when to use the output vs. when to retype."
          />
          <meta itemProp="datePublished" content="2024-02-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why conversion is imperfect */}
          <section aria-labelledby="why-imperfect" className="space-y-4">
            <h2
              id="why-imperfect"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why PDF-to-Word conversion is imperfect by design
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              PDF is a fixed-layout format — it describes exactly where each character
              appears on the page as absolute coordinates. Word (.docx) is a flow layout
              — text reflows based on margins, font size, and styles. Converting between
              them requires inferring structure: which groups of characters form a
              paragraph, which are headings, which text belongs to a table cell. This
              inference is imperfect for complex layouts and fails completely for
              scanned PDFs (which are just images with no text layer at all).
            </p>
          </section>

          {/* What survives well vs. poorly */}
          <section
            aria-labelledby="what-survives"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-survives"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What converts well and what doesn&apos;t
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Content type</th>
                    <th className="border border-border p-2 text-left font-semibold">Conversion quality</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Plain body text', 'Good', 'Paragraphs and line breaks usually preserved'],
                    ['Simple headings', 'Good', 'Detected from font size differences'],
                    ['Numbered/bulleted lists', 'Moderate', 'Sometimes collapses to plain paragraphs'],
                    ['Simple tables', 'Moderate', 'Cell boundaries often misidentified in complex tables'],
                    ['Multi-column layouts', 'Poor', 'Columns frequently merge into single-column output'],
                    ['Headers and footers', 'Poor', 'Often appear as body text at top/bottom of pages'],
                    ['Embedded images', 'Good', 'Usually extracted and placed inline'],
                    ['Mathematical formulas', 'Poor', 'Rendered as images or garbled text'],
                    ['Scanned PDFs (no text layer)', 'Fails', 'Requires OCR — use a separate OCR tool first'],
                  ].map(([content, quality, notes]) => (
                    <tr key={content}>
                      <td className="border border-border p-2 text-muted-foreground">{content}</td>
                      <td className={'border border-border p-2 font-medium ' + (quality === 'Good' ? 'text-green-600' : quality === 'Moderate' ? 'text-yellow-600' : 'text-red-600')}>{quality}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* When to retype instead */}
          <section aria-labelledby="when-retype" className="space-y-4">
            <h2
              id="when-retype"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to retype instead of converting
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              If your PDF has complex multi-column layouts, tables with merged cells,
              or heavy use of text boxes and shapes, the conversion output will require
              more cleanup time than retyping the relevant sections from scratch.
              A practical threshold: if the output needs more than 20 minutes of
              formatting fixes, manual reentry is faster and produces cleaner Word
              structure for future editing.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For scanned PDFs (photographed or printed-then-scanned documents), you need
              OCR (Optical Character Recognition) before conversion. Google Docs can
              open a scanned PDF and run OCR automatically — upload the PDF to Drive,
              right-click, open with Google Docs.
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
                  { name: "Text to PDF", path: "/tools/text-to-pdf" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. word-to-pdf ────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/word-to-pdf/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Word to PDF Converter: Why PDF and What Gets Preserved" />
          <meta
            itemProp="description"
            content="Why PDF is the right format for sharing documents, what Word features survive conversion, and the font embedding issue that makes PDFs look wrong on other machines."
          />
          <meta itemProp="datePublished" content="2024-03-02" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why PDF for sharing */}
          <section aria-labelledby="why-pdf" className="space-y-4">
            <h2
              id="why-pdf"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why PDF is better than .docx for sharing documents
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A Word document displays differently depending on the version of Word,
              the operating system, the installed fonts, and the page size configured
              on the recipient&apos;s machine. A carefully formatted resume that looks
              perfect on your MacBook can arrive with shifted margins, substituted
              fonts, and broken table borders on a Windows PC running an older Office
              version. PDF locks the layout: every character, every line break, every
              image position is fixed as absolute coordinates. The recipient sees exactly
              what you intended regardless of their software.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              PDF is also universally readable — every modern browser opens PDFs natively,
              no application install required. For anything you don&apos;t want edited (resumes,
              invoices, contracts, reports), PDF is the correct format.
            </p>
          </section>

          {/* What gets preserved */}
          <section
            aria-labelledby="what-preserved"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-preserved"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What Word features survive PDF conversion
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Text and formatting</span>
                <span>
                  Bold, italic, underline, font size, and color all convert reliably.
                  Paragraph spacing and indentation are preserved as fixed positions
                  in the PDF coordinate system.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Images and shapes</span>
                <span>
                  Embedded images convert with no quality loss. Shapes and drawing
                  objects are rasterized or preserved as vector paths depending on
                  the converter.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Hyperlinks</span>
                <span>
                  Clickable links are preserved in the PDF and remain clickable in
                  PDF readers. Useful for documents with references or navigation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">What does NOT convert</span>
                <span>
                  Comments, track changes, and revision history are not included in
                  the PDF output (by design — you typically don&apos;t want reviewers seeing
                  these). Macros and form fields may or may not convert depending on
                  the converter.
                </span>
              </li>
            </ul>
          </section>

          {/* Font embedding */}
          <section aria-labelledby="font-embedding" className="space-y-4">
            <h2
              id="font-embedding"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The font issue that makes PDFs look wrong
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              If your Word document uses a font that isn&apos;t embedded in the PDF output
              and isn&apos;t installed on the recipient&apos;s machine, the PDF reader substitutes
              a fallback font — typically a generic serif or sans-serif. This changes
              character spacing and can reflow text or break the layout. Good converters
              embed all fonts used in the document into the PDF file, making it
              self-contained. If your PDF looks different on another machine, open it
              in Acrobat Reader, go to File → Properties → Fonts, and verify all fonts
              are listed as &quot;Embedded Subset&quot;.
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
                  { name: "Text to PDF", path: "/tools/text-to-pdf" },
                  { name: "Convert Image to PDF", path: "/tools/convert-image-to-pdf" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');
