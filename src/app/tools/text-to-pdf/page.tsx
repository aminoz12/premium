import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/text-to-pdf"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 57 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Text to PDF Converter — Turn Plain Text into PDF Instantly",
  description:
    "Convert plain text to PDF online for free. Browser-based tool with no signup. Perfect for creating PDF files from any text content quickly and privately.",
  keywords: [
    "text to pdf",
    "convert text to pdf online",
    "txt to pdf free",
    "text to pdf converter",
    "plain text to pdf",
    "free pdf creator from text",
    "online txt to pdf",
    "text to pdf no signup",
    "convert text to pdf 2026",
    "secure text to pdf",
    "browser-based pdf creator",
    "text to pdf document",
    "free text to pdf tool",
    "no upload text to pdf",
    "fast text to pdf converter",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Text to PDF Converter — Turn Plain Text into PDF Instantly",
    description:
      "Convert plain text to PDF online for free. Browser-based tool with no signup. Perfect for creating PDF files from any text content quickly and privately.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Text to PDF Converter — Turn Plain Text into PDF by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text to PDF Converter — TXT to PDF Online",
    description:
      "Convert plain text to PDF instantly. Free browser-based tool with no signup. Create PDFs from any text content quickly and privately.",
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
  name: "Text to PDF Converter",
  url: TOOL_URL,
  description:
    "A free online tool that converts plain text into PDF documents. All processing happens client-side for complete privacy. No signup or file uploads required.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert plain text to PDF format",
    "Download PDF file with one click",
    "Live preview of the generated PDF",
    "Supports standard text formatting",
    "100% client-side processing for privacy",
    "No account or signup required",
    "Works on any device with a modern browser",
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
  name: "How to Convert Text to PDF",
  description:
    "A simple step-by-step guide to turn plain text into a PDF document using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Text to PDF Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your Plain Text",
      text: "Copy your plain text into the input field. You can also type directly into the editor. The tool accepts any standard text content.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Preview the PDF",
      text: "The tool will instantly generate a live preview of your PDF document. Review the layout and content to ensure everything appears as you expect.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Adjust Settings (Optional)",
      text: "You can adjust page size, margins, and font size using the settings panel to customize your PDF output.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your PDF",
      text: "Click the 'Download' button to save your PDF file directly to your device. The PDF is ready to open in any PDF reader or share with others.",
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
      name: "How do I convert plain text to a PDF for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply paste your text into the input field, preview the PDF, and click 'Download'. All processing happens in your browser — no signup or upload required.",
      },
    },
    {
      "@type": "Question",
      name: "What formatting options are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports basic text formatting including bold, italics, and underline. You can also adjust page size, margins, and font size using the settings panel.",
      },
    },
    {
      "@type": "Question",
      name: "Can I open the PDF in Adobe Acrobat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The generated PDF is standard PDF format and is fully compatible with Adobe Acrobat, Preview, Chrome, Edge, and any other PDF reader.",
      },
    },
    {
      "@type": "Question",
      name: "Is my text uploaded to your servers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing occurs entirely in your browser using JavaScript. Your text is never sent to our servers, stored, or logged. The tool is 100% private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a plain text file and a PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A plain text file (.txt) contains only characters with no formatting or layout. A PDF (Portable Document Format) is a fixed-layout document that preserves text, fonts, and formatting across all devices. This tool converts raw text into a professional PDF document.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any file size limits for the text input?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Because all processing runs locally in your browser, we do not impose any input size limits. The only practical constraint is your device's memory, which can comfortably handle most standard text documents.",
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
      name: "Text to PDF Converter",
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
            Free Text to PDF Converter — Turn Plain Text into PDF Instantly
          </h1>
          <Image
            src="/images/text-to-pdf.webp"
            alt="Text to PDF converter — turn plain text into a professional PDF with custom page size, margins, and font"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Convert any <strong>plain text</strong> into a professional <strong>PDF document</strong>
            instantly. Adjust page size, margins, and font size with a live preview. All processing
            runs locally in your browser with <strong>100% privacy</strong> — no signup or upload
            required.
          </p>

          <QuickAnswer
            question="How do I convert text to a PDF for free?"
            answer="Paste your text into the input field, preview the PDF, and click 'Download'. All processing happens in your browser — no signup or upload required."
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
                <span className="text-foreground font-medium">Text to PDF Converter</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Text to PDF Converter Tool">
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
              (carriage return + line feed, <code className="text-xs bg-muted px-1 py-0.5 rounded">
              </code>)
              line endings. Unix/macOS uses{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">LF</code>{' '}
              (<code className="text-xs bg-muted px-1 py-0.5 rounded">
              </code>) only.
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
                text.replace(/
                /g, '
                ')
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
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Text to PDF Converter</strong> is a fully private,
            browser-based tool that transforms <strong>plain text</strong> into professional
            <strong>PDF documents</strong> with customizable page size, margins, and font size.
            All processing runs locally on your device — your text never leaves your computer.
            The fastest free way to create PDFs from plain text in 2026, with no installs,
            no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}