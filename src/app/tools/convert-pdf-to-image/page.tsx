import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import Image from "next/image"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URLs ─────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/convert-pdf-to-image`

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "PDF to JPG Free — Extract Pages as High-Res Images, No Upload",
  description:
    "Convert PDF pages to high-quality JPG, PNG, or WebP images instantly in your browser. No upload, private, free. Select pages, set DPI, download ZIP.", // 143 characters
  keywords: [
    "pdf to image converter",
    "convert pdf to image",
    "pdf to jpg converter free",
    "pdf to png online no upload",
    "pdf to webp converter online",
    "free pdf to image converter 2026",
    "browser based pdf to image",
    "client side pdf to image",
    "pdf to image without watermark",
    "high resolution pdf to jpg",
    "convert pdf pages to images",
    "pdf to image zip download",
    "pdf page to image extractor",
    "private pdf to image tool",
    "no sign up pdf to image",
    "pdf to image for printing",
    "pdf to jpg with dpi control",
    "pdf to png custom resolution",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free PDF to Image Converter – JPG, PNG & WebP Online", // 52 characters
    description:
      "Convert every PDF page into a crisp JPG, PNG, or WebP image right in your browser. Full control over pages, DPI, and format. Download as ZIP — totally private.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PDF to Image Converter – Free Online Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to JPG / PNG / WebP Converter – Free & Private", // 44 characters
    description:
      "Turn PDF pages into images at any DPI. No upload, no account, no watermark. JPG, PNG, WebP output. All in your browser.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

// ─── JSON-LD Structured Data ───────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF to Image Converter",
  url: TOOL_URL,
  description:
    "A free, private, browser-based tool that converts PDF pages into high-resolution JPG, PNG, or WebP images. Supports custom DPI, page range, live previews, and ZIP download — all processed locally via PDF.js and Canvas API.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with Canvas API and JavaScript enabled (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert PDF pages to JPG, PNG, or WebP images",
    "Custom DPI control from 72 (web) to 600 (high-quality print)",
    "Select all pages or a custom page range for conversion",
    "Live thumbnail previews for each page before download",
    "Bulk ZIP download containing all converted pages in one archive",
    "Individual page download from any thumbnail",
    "100% client-side PDF rendering using PDF.js and HTML5 Canvas",
    "No file upload – PDF remains entirely on your device",
    "Output images contain no watermarks or branding",
    "Works offline after initial page load",
    "Handles password-protected PDFs where decryption also stays local",
    "No account, sign-up, or usage limits",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert PDF to Images",
  description:
    "Follow these four steps to turn any PDF page into a high-resolution JPG or PNG image using the free browser-based PDF to Image Converter.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools PDF to Image Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your PDF",
      text: "Click 'Choose PDF' or drag and drop a PDF file into the upload area. The file is opened locally and never sent to any server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Configure Output Settings",
      text: "Choose JPG, PNG, or WebP as the output format, set the desired DPI, and select whether to convert all pages or a specific range of pages.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Pages",
      text: "Live thumbnails of each page will render instantly so you can verify the content and quality before downloading.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Images",
      text: "Download all pages as a ZIP archive with one click, or download individual pages by clicking the download icon on any thumbnail.",
      url: TOOL_URL,
    },
  ],
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this PDF to image converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The PDF to Image Converter is 100% free with no account required, no watermarks on output images, and no page limits. It runs entirely in your browser using PDF.js.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats can I export to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JPG/JPEG, PNG, and WebP. JPG is compact for sharing, PNG is lossless for sharp text and diagrams, and WebP offers strong modern compression in supported browsers.",
      },
    },
    {
      "@type": "Question",
      name: "What DPI should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "72 DPI for web/email, 150 DPI for screen/presentations, 300 DPI for professional printing, 600 DPI for high-quality or large-format print. Higher DPI means larger, sharper files.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert only specific pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After uploading, switch from 'All Pages' to a custom page range (e.g. pages 2–5) so only those pages are rendered and included in the download.",
      },
    },
    {
      "@type": "Question",
      name: "Is my PDF uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The PDF is read directly in your browser using PDF.js and rendered on an HTML5 Canvas. Nothing is ever transmitted to a remote server — your documents stay completely private.",
      },
    },
    {
      "@type": "Question",
      name: "Why is browser-based rendering better than screenshots?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Screenshots capture your screen's native resolution and include viewer UI elements. This tool renders directly from PDF vector data at any DPI, producing consistently crisp output without artefacts.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert a password-protected PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Owner-restricted PDFs are handled automatically. User-password protected PDFs prompt you for the password — decryption also happens entirely in your browser with no data leaving your device.",
      },
    },
    {
      "@type": "Question",
      name: "How do I download all converted pages at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Click 'Download All as ZIP' after conversion. This bundles every rendered image into a single archive you can save and extract. You can also download individual pages from their thumbnails.",
      },
    },
  ],
}

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "PDF Tools",
      item: `${SITE_URL}/tools/pdf`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "PDF to Image Converter",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ─────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <>
        <div className="  px-4 py-8">
          {/* ── Breadcrumb (HTML mirrors JSON-LD) ── */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex items-center gap-1.5">
              <li>
                <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a
                  href={`${SITE_URL}/tools/pdf`}
                  className="hover:text-foreground transition-colors"
                >
                  PDF Tools
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-foreground font-medium">PDF to Image Converter</span>
              </li>
            </ol>
          </nav>

          {/* ── Hero ── */}
          <header className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              PDF to JPG Free — Extract Pages as High-Res Images, No Upload
            </h1>
            <Image
              src="/images/convert-pdf-to-image.webp"
              alt="PDF to image converter — render every PDF page as JPG, PNG, or WebP"
              width={1200}
              height={630}
              priority
              className="rounded-lg border max-w-3xl w-full h-auto"
            />
            <QuickAnswer
              question="How do I convert a PDF to JPG without losing quality?"
              answer="Set a high DPI (150–300 DPI) before converting. 150 DPI is fine for web display; 300 DPI is needed for print-quality images. This tool renders each PDF page using PDF.js and the browser Canvas API at your chosen resolution — no upload required, no server processing, and no quality loss from re-compression. Download individual pages or all pages as a ZIP."
            />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Convert every page of any PDF into high-quality <strong>JPG</strong> or{" "}
              <strong>PNG</strong> images (and WebP). Control the output{" "}
              <strong>DPI / resolution</strong>, select specific pages or convert them all at once,
              preview each page before downloading, and save everything as a{" "}
              <strong>ZIP archive</strong> with one click.{" "}
              <strong>No upload. No watermark. No account.</strong>
            </p>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Powered by <strong>PDF.js</strong> and the browser's native Canvas API — your PDF is
              processed entirely on your device and never transmitted to any server.
            </p>
          </header>

          {/* ── Tool ── */}
          <main id="tool" aria-label="PDF to Image Converter Tool">
            <ToolClient />
          </main>

          <hr className="border-border" />

          {/* ─── AdSense High-Value Content Article (800+ words) ──────────── */}
          <article
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

            {/* DPI and resolution guide */}
            <section aria-labelledby="pdf-image-dpi" className="space-y-4">
              <h2
                id="pdf-image-dpi"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                What DPI to use when extracting PDF pages as images
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                DPI (dots per inch) controls the output resolution. Higher DPI = larger
                file, sharper image. Here&apos;s what to choose for each use case:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Use case</th>
                      <th className="border border-border p-2 text-left font-semibold">Recommended DPI</th>
                      <th className="border border-border p-2 text-left font-semibold">Output size (A4 page)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Web display / website embed', '72–96 DPI', '~595×842 px — small file, fast to load'],
                      ['Email attachment thumbnail', '96–150 DPI', '~794×1123 px — clear on screen, compact'],
                      ['Presentation slide (PowerPoint/Keynote)', '150 DPI', '~1240×1754 px — crisp on most projectors'],
                      ['General on-screen use', '150 DPI', 'Good balance of quality and file size'],
                      ['Print-ready (standard quality)', '300 DPI', '~2480×3508 px — recommended for printing'],
                      ['High-quality archival / OCR input', '300–600 DPI', 'Maximum clarity for text recognition'],
                      ['Large-format print (poster)', '300+ DPI', 'Size depends on print dimensions; bigger = more pixels'],
                    ].map(([useCase, dpi, size]) => (
                      <tr key={useCase}>
                        <td className="border border-border p-2 font-medium text-foreground">{useCase}</td>
                        <td className="border border-border p-2 font-bold text-foreground">{dpi}</td>
                        <td className="border border-border p-2 text-muted-foreground">{size}</td>
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
          </article>

          {/* ── Page Footer ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — PDF to Image Converter</strong> converts PDF pages
              instantly into high-resolution <strong>JPG, PNG, or WebP</strong> images directly in
              your browser. Complete control over DPI, page range, and format, with bulk ZIP
              downloads — all while keeping your documents <strong>100% private</strong>. No file
              uploads, no watermarks, no account. The fastest free PDF-to-image solution in 2026.
            </p>
          </footer>
        </div>
     </>
    </>
  )
}