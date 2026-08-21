import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── Absolute URLs ────────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/text-to-word"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Title: 59 chars — within 50–60 char SERP window
export const metadata: Metadata = {
  title: "Free Text to Word Converter — Create Formatted DOCX Online",
  description:
    "Convert plain text to Word (.docx) instantly. Add bold, italic, headings & lists. Free, browser-based, 100% private — no signup. Works with Microsoft Word, Google Docs & LibreOffice.",
  keywords: [
    // Core transactional
    "text to word converter",
    "text to docx converter",
    "convert text to word online free",
    "plain text to word document",
    "txt to docx free",
    // Formatter-specific (new tool features)
    "text to word with formatting",
    "bold italic headings word converter",
    "rich text to docx online",
    // Long-tail & GEO variants
    "text to word converter Morocco",
    "convertisseur texte en word gratuit",
    "convert text to microsoft word online 2026",
    "browser based docx creator no signup",
    "free word document generator online",
    // Related intent
    "create word document from text",
    "online docx editor download",
    "word file creator free",
    "text to word no upload privacy",
    "free text to docx browser tool",
  ],
  alternates: {
    canonical: TOOL_URL,
    // GEO hreflang signals
    languages: {
      "en-US": `${TOOL_URL}`,
      "en-GB": `${TOOL_URL}`,
      "fr-FR": `${TOOL_URL}`,
      "fr-MA": `${TOOL_URL}`,
      "ar-MA": `${TOOL_URL}`,
    },
  },
  openGraph: {
    title: "Free Text to Word Converter — Bold, Headings & Lists → .docx",
    description:
      "Turn any plain text into a formatted Word document with bold, italic, headings, and lists. Free, private, browser-based. Download .docx instantly — no signup.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Text to Word Converter with bold, headings & lists — TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text to Word Converter — Create .docx Online Instantly",
    description:
      "Add bold, italic, headings & lists. Download as .docx. Free, 100% private, no signup.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
    creator: "@thefreeaitools",
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

// ─── JSON-LD: WebApplication ──────────────────────────────────────────────────
const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${TOOL_URL}#webapp`,
  name: "Free Text to Word Converter",
  alternateName: ["Text to DOCX Converter", "Online Word Document Creator"],
  url: TOOL_URL,
  description:
    "A free online tool that converts plain text into formatted Microsoft Word documents (.docx). Supports bold, italic, underline, H1–H3 headings, bullet and numbered lists, custom fonts, A4/US Letter page sizes, and optional page numbers. All processing is 100% client-side — your text never leaves your browser.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  inLanguage: ["en", "fr", "ar"],
  availableOnDevice: ["Desktop", "Mobile", "Tablet"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Bold, italic, and underline text formatting",
    "Heading levels H1, H2, H3",
    "Bullet and numbered lists",
    "Left, center, and right text alignment",
    "Font family picker: Calibri, Arial, Times New Roman, Georgia, Cambria, Verdana",
    "Font size: 10pt, 11pt, 12pt, 14pt, 16pt",
    "A4 and US Letter page sizes",
    "Optional page numbers in footer",
    "Optional date header",
    "Live document preview",
    "Multi-line paste auto-splits into blocks",
    "100% client-side processing — no uploads",
    "Download as .docx — compatible with Microsoft Word, Google Docs, LibreOffice, Apple Pages",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.ico`,
    },
  },
}

// ─── JSON-LD: HowTo ───────────────────────────────────────────────────────────
const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${TOOL_URL}#howto`,
  name: "How to Convert Text to a Formatted Word Document Online",
  description:
    "Step-by-step guide to turning plain text into a professionally formatted .docx file using the free TheFreeAITools Text to Word Converter.",
  totalTime: "PT1M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
  tool: [{ "@type": "HowToTool", name: "TheFreeAITools Text to Word Converter", url: TOOL_URL }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Add your content blocks",
      text: "Click 'Add Paragraph', 'Add H1 Heading', 'Add Bullet', or any other block type to start building your document. You can also paste multi-line text directly — it auto-splits into individual paragraph blocks.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Apply formatting",
      text: "Select the block type (paragraph, H1, H2, H3, bullet, numbered) and toggle bold, italic, or underline. Change text alignment (left, center, right) using the toolbar per block.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Configure export settings",
      text: "Choose your preferred font (Calibri, Arial, Times New Roman, etc.), font size (10–16pt), page size (A4 or US Letter), and optional extras like page numbers or a date header.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Preview your document",
      text: "Click 'Show live preview' to see an on-screen rendering of how your document will look before downloading.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Download your .docx file",
      text: "Click 'Download .docx' to save your file. Open it immediately in Microsoft Word, Google Docs, LibreOffice, or Apple Pages.",
      url: TOOL_URL,
    },
  ],
}

// ─── JSON-LD: FAQPage ─────────────────────────────────────────────────────────
const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${TOOL_URL}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I convert plain text to a Word document for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Add your text in the block editor, apply any formatting (bold, headings, lists), choose your font and page size, then click 'Download .docx'. The file is generated entirely in your browser — no signup, no upload, and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "What formatting options does the converter support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports bold, italic, and underline text runs; heading levels H1, H2, and H3; bullet lists and numbered lists; left/center/right alignment; six font families (Calibri, Arial, Times New Roman, Georgia, Cambria, Verdana); five font sizes (10–16pt); A4 and US Letter page sizes; optional page numbers; and an optional date header.",
      },
    },
    {
      "@type": "Question",
      name: "Is my text sent to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing happens entirely in your browser using the docx.js library. Your text is never transmitted to any server, stored, or shared with third parties.",
      },
    },
    {
      "@type": "Question",
      name: "Can I open the downloaded .docx file in Google Docs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The generated .docx file is a standard Office Open XML document, fully compatible with Microsoft Word (all versions), Google Docs, LibreOffice Writer, Apple Pages, and WPS Office.",
      },
    },
    {
      "@type": "Question",
      name: "What page sizes are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports A4 (ISO 216 standard, 210 × 297 mm) and US Letter (8.5 × 11 inches). A4 is the default and is standard in Europe, Africa, and most of the world. US Letter is standard in North America.",
      },
    },
    {
      "@type": "Question",
      name: "Can I paste multi-line text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When you paste multi-line text (text with newline characters) into the editor area, the tool automatically splits each line into a separate paragraph block, so you can format each one independently.",
      },
    },
    {
      "@type": "Question",
      name: "Does the converter work on mobile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The tool is fully responsive and works on smartphones and tablets in any modern mobile browser, including Safari on iOS and Chrome on Android.",
      },
    },
    {
      "@type": "Question",
      name: "Comment convertir du texte en Word en ligne gratuitement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ajoutez votre texte dans l'éditeur de blocs, appliquez la mise en forme souhaitée (gras, titres, listes), puis cliquez sur 'Télécharger .docx'. Le fichier est généré directement dans votre navigateur — sans inscription et sans envoi de données sur un serveur.",
      },
    },
  ],
}

// ─── JSON-LD: BreadcrumbList ───────────────────────────────────────────────────
const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${TOOL_URL}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Document Tools", item: `${SITE_URL}/categories/documents` },
    { "@type": "ListItem", position: 3, name: "Text to Word Converter", item: TOOL_URL },
  ],
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TextToWordPage() {
  return (
    <>
      {/* JSON-LD schemas */}
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

      <div className="flex flex-col gap-12   py-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">Home</a></li>
            <li aria-hidden="true">›</li>
            <li><a href={`${SITE_URL}/categories/documents`} className="hover:text-foreground transition-colors">Document Tools</a></li>
            <li aria-hidden="true">›</li>
            <li><span className="text-foreground font-medium">Text to Word Converter</span></li>
          </ol>
        </nav>

        {/* QuickAnswer for featured snippet */}
        <QuickAnswer
          question="How do I convert text to a Word document for free?"
          answer="Add your text into the block editor, apply formatting (bold, headings, lists), choose your font and page size, then click 'Download .docx'. The file is created entirely in your browser — no upload, no signup, and 100% free."
        />

        {/* ── Interactive Tool ──────────────────────────────────────────────── */}
        <main id="tool" aria-label="Text to Word Converter Tool">
           <ClientPage />
        </main>

        {/* Email capture */}
        <div className="mt-4">
          <EmailCapture />
        </div>

        <hr className="border-border my-6" />

        {/* ── SEO Article ───────────────────────────────────────────────────── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Text to Word Converter: Rich Formatting, Fonts & Layout Options" />
          <meta itemProp="description" content="How to convert plain text to a formatted Word .docx file with bold, italic, headings, lists, and custom fonts — all in your browser, free." />
          <meta itemProp="datePublished" content="2024-03-12" />
          <meta itemProp="dateModified" content="2026-06-01" />
          <meta itemProp="author" content="TheFreeAITools Team" />

          {/* ── When this tool saves time ──────────────────────────────────── */}
          <section aria-labelledby="use-cases" className="space-y-4">
            <h2 id="use-cases" className="text-2xl font-semibold tracking-tight text-foreground">
              When does a browser-based text-to-Word converter save time?
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The most common scenario: you have a draft in a notes app, a clipboard full of copied content, or an export from another tool — and you need to deliver it as a{" "}
              <strong className="text-foreground">.docx file</strong> immediately. Instead of opening Microsoft Word, pasting, applying styles manually, and saving, this tool lets you build a structured document with proper headings and lists in under a minute, then download the file.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Other high-value use cases include: packaging meeting notes or lecture summaries into a Word document, creating a quick one-page brief for a client, preparing a formatted CV draft, or generating a structured template for a report. Because the tool is entirely browser-based, it works offline after the page loads and requires no installation.
            </p>
          </section>

          {/* ── What the tool generates ──────────────────────────────────────── */}
          <section
            aria-labelledby="technical-output"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2 id="technical-output" className="text-2xl font-semibold tracking-tight text-foreground">
              What exactly gets generated?
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">.docx</code>{" "}
              file is an Office Open XML archive. Under the hood, the tool uses{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">docx.js</code>{" "}
              to build the XML structure client-side — including{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">word/document.xml</code>{" "}
              for content,{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">word/styles.xml</code>{" "}
              for typography, and numbering definitions for lists — then zips it into a valid{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">.docx</code>{" "}
              archive in memory and triggers a browser download.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The generated file faithfully implements Word's native heading styles (Heading 1, Heading 2, Heading 3) with proper outline levels, which means Word's built-in Navigation Pane and Table of Contents features will recognise them. Bullet and numbered lists use Word's native numbering engine, not unicode bullet characters, ensuring correct rendering across all platforms.
            </p>
          </section>

          {/* ── Formatting guide ─────────────────────────────────────────────── */}
          <section aria-labelledby="formatting-guide" className="space-y-4">
            <h2 id="formatting-guide" className="text-2xl font-semibold tracking-tight text-foreground">
              How to use the formatting options
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Each content block has its own independent toolbar. You can mix block types freely: start with an H1 heading for your document title, follow with an H2 for a section, then add paragraph text and a bullet list. Each block's formatting is isolated, so making a heading bold in block 2 does not affect block 1.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[
                { label: "Bold", use: "Key terms, document titles, important values." },
                { label: "Italic", use: "Book titles, foreign words, definitions, emphasis." },
                { label: "Underline", use: "Hyperlink-style emphasis, formal document fields." },
                { label: "H1 Heading", use: "Document title — one per document, largest type." },
                { label: "H2 Heading", use: "Major section titles — navigable in Word's sidebar." },
                { label: "H3 Heading", use: "Sub-sections under an H2." },
                { label: "Bullet list", use: "Unordered items, feature lists, key points." },
                { label: "Numbered list", use: "Steps, rankings, ordered procedures." },
              ].map(({ label, use }) => (
                <div key={label} className="flex gap-3 p-3 rounded-lg border border-border/40 bg-card">
                  <code className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-1 rounded h-fit whitespace-nowrap flex-shrink-0">
                    {label}
                  </code>
                  <p className="text-sm text-muted-foreground leading-relaxed">{use}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Compatibility & GEO ──────────────────────────────────────────── */}
          <section aria-labelledby="compatibility" className="space-y-4">
            <h2 id="compatibility" className="text-2xl font-semibold tracking-tight text-foreground">
              Compatibility — where can I open the .docx file?
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The downloaded file is a standard Office Open XML document and opens without issues in:
            </p>
            <div className="flex flex-wrap gap-3 mt-1">
              {[
                { name: "Microsoft Word", note: "2013 → 365" },
                { name: "Google Docs", note: "Upload or import" },
                { name: "LibreOffice Writer", note: "Free, open-source" },
                { name: "Apple Pages", note: "macOS & iOS" },
                { name: "WPS Office", note: "Windows / Android" },
                { name: "OnlyOffice", note: "Self-hosted option" },
              ].map(({ name, note }) => (
                <div key={name} className="flex flex-col px-3 py-2.5 rounded-lg border border-border/50 bg-card text-sm">
                  <span className="font-semibold text-foreground">{name}</span>
                  <span className="text-xs text-muted-foreground">{note}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              The tool supports <strong className="text-foreground">A4 page size</strong> (standard in Europe, Africa — including Morocco, France, Germany — and most of the world) and <strong className="text-foreground">US Letter</strong> (standard in the United States, Canada, and Mexico). Choose the page size that matches your target printer or organisation standard.
            </p>
          </section>

          {/* ── FAQ Section ───────────────────────────────────────────────────── */}
          <section aria-labelledby="faq-heading" className="space-y-4">
            <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {[
                {
                  q: "Is this text-to-Word converter really free?",
                  a: "Yes, completely. There are no subscription tiers, no per-document limits, and no premium paywalls. The tool is monetised via display advertising, not by charging users.",
                },
                {
                  q: "Comment convertir du texte en fichier Word gratuitement en ligne ?",
                  a: "Ajoutez vos blocs de texte dans l'éditeur, appliquez vos mises en forme (gras, titres, listes), configurez la police et le format de page, puis cliquez sur « Télécharger .docx ». Le fichier est créé directement dans votre navigateur, sans envoi sur un serveur.",
                },
                {
                  q: "Can I use it to create a CV or resume?",
                  a: "For a basic, text-only CV structure, yes. The tool handles headings, bullet lists, bold names, and contact details. For a polished, multi-column CV with tables and precise layout, a dedicated CV builder would be better suited.",
                },
                {
                  q: "Does it work offline?",
                  a: "After the page and the docx.js library load, document generation works without an active internet connection. The download is triggered in your browser's memory.",
                },
                {
                  q: "What is the maximum document size?",
                  a: "There is no hard limit imposed by the tool. In practice, very large documents (thousands of blocks) may be slower to generate depending on your device's processing power.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-border/40 pb-5 last:border-0 last:pb-0">
                  <dt className="font-semibold text-foreground text-base mb-1.5">{q}</dt>
                  <dd className="text-muted-foreground leading-relaxed text-sm">{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Related Tools ─────────────────────────────────────────────────── */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related document conversion tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Word to PDF", path: "/tools/word-to-pdf" },
                  { name: "Text to PDF", path: "/tools/text-to-pdf" },
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                  { name: "Markdown to DOCX", path: "/tools/markdown-to-docx" },
                  { name: "Online Text Editor", path: "/tools/text-editor" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* Page footer */}

      </div>
    </>
  )
}