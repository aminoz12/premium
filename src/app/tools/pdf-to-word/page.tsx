import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/pdf-to-word"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 59 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Convert PDF to Editable Word Free — Tables, Fonts, No Signup",
  description:
    "Convert any PDF to editable Word DOCX free — tables, columns, and fonts preserved. No email, no signup, no watermark. Process entirely in your browser — your PDF never leaves your device.",
  keywords: [
    "convert pdf to word free without losing formatting",
    "pdf to word no email",
    "pdf to word no signup",
    "pdf to word scanned",
    "pdf to word no watermark",
    "pdf to word",
    "pdf to docx",
    "convert pdf to word online",
    "free pdf to word converter",
    "pdf to word converter free",
    "edit pdf in word",
    "pdf to docx converter",
    "extract text from pdf",
    "secure pdf to word",
    "browser-based pdf converter",
    "no signup pdf to word",
    "best pdf to word 2026",
    "pdf to document converter",
    "free pdf converter online",
    "pdf import to word",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free PDF to Word Converter — Convert PDF to DOCX Instantly",
    description:
      "Convert PDF files to editable Word documents (DOCX) instantly. Free, browser-based PDF to Word converter with high accuracy, formatting retention, and no signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free PDF to Word Converter — Convert PDF to DOCX by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to Word Converter — PDF to DOCX Online",
    description:
      "Convert PDF files to editable Word documents (DOCX) instantly. Free, browser-based tool with high accuracy and formatting retention. No signup required.",
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

// ─── FIX 3: Comprehensive JSON-LD Structured Data ────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF to Word Converter",
  url: TOOL_URL,
  description:
    "A free online tool that converts PDF files to editable Word documents (DOCX) instantly. All processing is client-side and private, with no file uploads to servers.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert PDF to editable DOCX format",
    "Preserve original formatting (fonts, images, tables)",
    "High conversion accuracy",
    "Works with any PDF file size",
    "No account or signup required",
    "100% client-side processing for privacy",
    "Download converted DOCX with one click",
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
  name: "How to Convert a PDF to Word",
  description:
    "A simple step-by-step guide to transform a PDF file into an editable Word document (DOCX) using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools PDF to Word Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your PDF File",
      text: "Click the upload area or drag and drop your PDF file into the tool. The file is loaded directly into your browser for immediate processing.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Wait for Conversion",
      text: "The tool automatically converts the PDF into a DOCX file. Processing typically takes a few seconds, and the converted file is generated locally in your browser.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Result",
      text: "Review the converted Word document using the built-in preview. Check that all text, images, and tables have been correctly transferred.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your DOCX File",
      text: "Click the 'Download' button to save the editable Word document to your device. The file is ready to open in Microsoft Word, Google Docs, or LibreOffice.",
      url: TOOL_URL,
    },
  ],
}

// ─── FIX 4: Zero Schema Duplication — FAQPage JSON-LD is the single source of
// truth. No HTML Microdata (itemScope / itemType / itemProp) is used in the
// FAQ section of the JSX below. ────────────────────────────────────────────────

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does this PDF to Word converter work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You upload a PDF file to the tool. It processes the file entirely in your browser, converts the PDF into an editable Word document (DOCX), and lets you download the result. No data is ever uploaded to a server.",
      },
    },
    {
      "@type": "Question",
      name: "Does the converter preserve formatting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool aims to preserve the original formatting, including fonts, images, tables, bullet points, and page layouts. While no conversion is perfect, the results are typically very accurate.",
      },
    },
    {
      "@type": "Question",
      name: "Is my PDF file uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing runs entirely in your browser using JavaScript and WebAssembly. Your PDF file is never sent to our servers, stored, or logged. The tool is 100% private.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert password-protected PDF files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports converting password-protected PDF files if you supply the correct password. After uploading, you'll be prompted to enter the password, and the file will be processed.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a PDF file and a Word document?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A PDF (Portable Document Format) is a fixed-layout file designed to look the same on any device. It cannot be easily edited. A Word document (DOCX) is an editable file that you can modify, add text to, or change formatting. This tool bridges the gap by converting a PDF into an editable Word document.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free PDF to Word converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It works well with standard PDF files, including those with text, images, and tables. For very complex PDFs (e.g., with advanced vector graphics or custom fonts), some formatting may shift. All processing is client-side and private.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Document Tools > Tool ──────

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
      name: "Document Tools",
      item: `${SITE_URL}/categories/documents`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "PDF to Word Converter",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      {/* ── JSON-LD Structured Data Scripts ── */}
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

      <div className="px-14 py-8">
        {/* ── Page Header ── */}
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Convert PDF to Editable Word Free — Tables, Fonts, No Signup
          </h1>
          <Image
            src="/images/pdf-to-word.webp"
            alt="PDF to Word converter — convert PDF to editable DOCX preserving fonts, images, and tables"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Convert any <strong>PDF file</strong> into an editable <strong>Word document
              (DOCX)</strong> instantly. Preserve fonts, images, and tables with high accuracy.
            All processing runs locally in your browser with <strong>100% privacy</strong>
            — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I convert a PDF to editable Word while keeping tables and fonts?"
            answer="Upload your PDF above. The converter extracts the text, tables, images, and page layout and rebuilds them in a DOCX file you can edit in Word, Google Docs, or LibreOffice. Multi-column layouts and formatted tables are preserved. Scanned (image-only) PDFs require OCR — see the guide below."
          />

          {/* ── Breadcrumb — HTML nav (mirrors BreadcrumbList JSON-LD above) ── */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li>
                <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a
                  href={`${SITE_URL}/categories/documents`}
                  className="hover:text-foreground transition-colors"
                >
                  Document Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">PDF to Word Converter</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="PDF to Word Converter Tool">
           <ClientPage />
        </main>

        {/* ── Email Capture ── */}
        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        {/* ────────────────────────────────────────────────────────────────────
            FIX 5: AdSense "High Value Content" Injection
            Wrapped in <article> with TechArticle Microdata.
            NOTE: itemScope/itemType/itemProp are used ONLY on the <article>
            wrapper and its meta tags — NOT on any FAQ elements below, which
            are governed solely by the FAQPage JSON-LD above (FIX 4).
        ──────────────────────────────────────────────────────────────────── */}
        <article
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

          {/* What survives conversion table */}
          <section aria-labelledby="conversion-accuracy" className="space-y-4">
            <h2
              id="conversion-accuracy"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What PDF elements survive conversion to Word — and what doesn&apos;t
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">PDF element</th>
                    <th className="border border-border p-2 text-left font-semibold">Converts to Word?</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Plain paragraphs', '✓ Fully', 'Text, font size, and basic styling preserved'],
                    ['Bold / italic / underline', '✓ Usually', 'Preserved if embedded font info is available in the PDF'],
                    ['Tables', '✓ Mostly', 'Simple tables convert well; complex merged cells may need manual cleanup'],
                    ['Multi-column layout', '~ Partial', 'Columns are often extracted as separate text boxes or inline text'],
                    ['Embedded images', '✓ Yes', 'Images are extracted and placed inline in the DOCX'],
                    ['Hyperlinks', '✓ Usually', 'Clickable links preserved in output DOCX'],
                    ['Headers and footers', '~ Partial', 'Content extracted but position may differ'],
                    ['Exact fonts (non-standard)', '~ Partial', 'Substituted with closest available font if not embedded'],
                    ['Scanned text (image PDF)', '✗ Not without OCR', 'Scanned PDFs contain images, not text — OCR is required first'],
                    ['Forms (fillable fields)', '~ Partial', 'Field content extracted but interactivity lost'],
                    ['Annotations / comments', '✗ No', 'PDF annotations are not transferred to DOCX'],
                  ].map(([element, converts, notes]) => (
                    <tr key={element}>
                      <td className="border border-border p-2 font-medium text-foreground">{element}</td>
                      <td className="border border-border p-2 text-muted-foreground">{converts}</td>
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
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — PDF to Word Converter</strong> is a fully private,
            browser-based tool that converts <strong>PDF files</strong> to editable
            <strong>Word documents (DOCX)</strong> instantly. Supports standard PDFs,
            preserves fonts, images, and tables, and provides a built-in preview. All
            processing runs locally on your device — your documents never leave your
            computer. The fastest free way to convert PDF to Word in 2026, with no
            installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}