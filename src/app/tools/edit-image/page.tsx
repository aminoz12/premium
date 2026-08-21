import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/edit-image"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 51 characters — well within the 50–60 char SERP window

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Online Image Editor — Crop, Resize, Brightness & Filters",
  description:
    "Edit images free in your browser — crop, resize, adjust brightness and contrast, add text, and apply filters. No upload, no account, no software to install.",
  keywords: [
    "pdf editor",
    "free pdf editor online",
    "edit pdf without uploading",
    "ai pdf editor free online",
    "pdf document editor browser",
    "pdf editor no login 2026",
    "annotate pdf online free",
    "extract text from pdf free",
    "pdf summarizer ai tool",
    "client side pdf editor",
    "edit pdf text online free",
    "pdf annotation tool private",
    "modify pdf no upload free",
    "pdf editor no watermark",
    "free ai pdf editor 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Online Image Editor — Crop, Resize, Brightness & Filters",
    description:
      "Edit images free in your browser — crop, resize, adjust brightness and contrast, add text, and apply filters. No upload, no account.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "AI PDF Editor Online — Free No Upload Document Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI PDF Editor — Edit Documents Online",
    description:
      "Edit, annotate, and summarize PDF files directly in your browser. No uploads, no accounts, no limits — completely free and private.",
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
  name: "AI PDF Editor",
  url: TOOL_URL,
  description:
    "A completely free, privacy-focused browser tool that edits, annotates, extracts text from, and summarizes PDF documents with AI assistance without any server uploads.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript and PDF.js support (Chrome 80+, Firefox 78+, Safari 14+, Edge 80+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Edit PDF text content directly in the browser",
    "Add annotations, highlights, and comments to PDF pages",
    "Extract text from PDF documents for copying or analysis",
    "AI-assisted summarization of document content",
    "Fill PDF forms and add digital signatures",
    "100% client-side processing for total user privacy",
    "No server uploads — documents never leave your device",
    "No file size limits or editing quotas",
    "No account registration necessary",
    "Cross-platform: works on Windows, macOS, and Linux",
    "Download edited PDF with all modifications preserved",
    "Support for standard PDF files including scanned documents",
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
  name: "How to Edit a PDF Document Online",
  description:
    "A simple 4-step guide to editing PDF documents using our free, browser-based editor. The entire process takes under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools AI PDF Editor",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your PDF Document",
      text: "Click the upload zone or drag and drop your PDF file into the designated area on the page. The file is loaded directly into your browser using PDF.js — nothing is sent to a server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Edit Text and Add Annotations",
      text: "Click on any text block to edit content directly, or use the annotation tools to add highlights, comments, and sticky notes. Use the AI assistant to summarize sections or suggest edits.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Extract or Summarize Content",
      text: "Select text to extract it for copying, or use the AI summarization feature to generate concise summaries of long documents. All processing happens locally without transmitting document content externally.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Edited PDF",
      text: "Once editing is complete, click the download button to save your modified PDF directly to your device. All annotations, text edits, and form fills are preserved in the output file.",
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
      name: "How do I edit a PDF online for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your PDF file using this browser-based editor. Edit text, add annotations, extract content, and download the modified document — all processing happens locally on your device with no server uploads, no account, and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "What can I do with this AI PDF editor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can edit PDF text content, add annotations and highlights, extract specific sections, fill forms, add digital signatures, and summarize document content with AI assistance. The tool supports common PDF editing tasks without requiring Adobe Acrobat or any desktop software.",
      },
    },
    {
      "@type": "Question",
      name: "Can I edit a PDF without uploading it to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This browser-based PDF editor processes your file locally on your device using PDF.js — no files are sent to any external server. Edit content, annotate, and download the modified file, all for free with no login.",
      },
    },
    {
      "@type": "Question",
      name: "Is my PDF document kept private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All PDF processing happens entirely in your browser. Your document is never uploaded to any external server or stored in the cloud. This makes it safe for editing confidential contracts, legal documents, financial reports, and personal files.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between this tool and Adobe Acrobat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Adobe Acrobat is expensive desktop software that requires installation and a subscription. This tool performs the most common PDF editing tasks — text editing, annotation, extraction, and AI summarization — directly in your browser without any software installation, subscription, or file uploads. It is free and completely private.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any file size limits on the PDFs I can edit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No artificial limits. Because all processing occurs in your browser and no file is uploaded to our servers, we do not impose any file size restrictions. For very large documents (100+ MB), processing may be slower depending on your device's available memory. For best results, work with PDFs under 50 MB.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Productivity Tools > Tool

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
      name: "Productivity Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI PDF Editor",
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
            Free Online Image Editor — Crop, Resize, Brightness & Filters
          </h1>
          <img src="/images/edit-image.webp" alt="Free Online Image Editor — crop, resize, adjust brightness and apply filters" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Edit images directly in your browser — crop, resize, adjust brightness, contrast and
            saturation, add text overlays, apply filters, and download the result. All processing
            uses the HTML5 Canvas API on your device — no upload, no account, completely free.
          </p>

          <QuickAnswer
            question="How do I edit an image online for free without software?"
            answer="Upload your image to this browser-based editor, use the tools to crop, resize, adjust brightness/contrast, add text, or apply filters, then download the result. Everything runs locally — your file never leaves your device, and no software installation is needed."
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
                <a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">
                  Productivity Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">AI PDF Editor</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="AI PDF Editor Tool">
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
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — AI PDF Editor</strong> is a fully private, browser-based tool
            for editing, annotating, extracting, and summarizing PDF documents. All processing runs
            locally on your device using PDF.js and client-side AI — your files never leave your
            computer. Supports <strong>standard PDF files including scanned documents</strong>  ,
            making it the fastest free way to edit PDFs in 2026, with no installs, no accounts,
            and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}