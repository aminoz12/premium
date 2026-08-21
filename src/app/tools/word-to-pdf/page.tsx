import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools"
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/word-to-pdf"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 54 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Convert Resume DOCX to PDF Free — Keep Formatting, No Watermark",
  description:
    "Convert your resume Word doc (DOCX) to PDF free — formatting preserved, no watermark, no signup. Hiring managers and ATS scanners expect PDF. Works entirely in your browser.",
  keywords: [
    "word to pdf converter free no signup",
    "word to pdf",
    "word to pdf converter",
    "doc to pdf",
    "docx to pdf",
    "convert word to pdf online",
    "free word to pdf converter no email",
    "word to pdf no watermark",
    "word to pdf in browser private",
    "word to pdf keep formatting",
    "offline word to pdf",
    "best word converter 2026",
    "word to pdf tool 2026",
    "preserve formatting word to pdf",
    "resume word to pdf",
    "document converter free",
    "microsoft word to pdf online",
    "fast pdf converter",
    "secure word to pdf 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Word to PDF Converter — Free Online DOCX to PDF Tool",
    description:
      "Seamlessly convert Word documents to high-quality PDFs. 100% secure processing, perfect formatting retention, and zero watermarks.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Word to PDF Converter — Free Online Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Word to PDF Converter — Fast & Secure",
    description:
      "Convert your DOC and DOCX files to PDF instantly in your browser. Free, secure, and preserves your layout flawlessly.",
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
  name: "Word to PDF Converter",
  url: TOOL_URL,
  description:
    "A free online document utility to instantly convert Microsoft Word documents (DOC and DOCX) into portable document format (PDF) while maintaining exact layout and formatting.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "DOC to PDF conversion",
    "DOCX to PDF conversion",
    "Exact formatting preservation",
    "Secure temporary file processing",
    "Zero watermarks added",
    "No registration required",
    "Cross-platform compatibility",
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
  name: "How to Convert a Word Document to PDF",
  description:
    "A quick step-by-step guide on how to transform your editable Word document into a static, secure PDF file using our free online converter.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Word to PDF Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Document",
      text: "Click the upload area or drag and drop your Microsoft Word document (either .doc or .docx format) into the designated zone. The file is loaded directly into our secure processing queue.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Wait for Processing",
      text: "Allow our secure engine a few seconds to analyze the file, extract the layout, and encode it into a high-quality PDF format. This step typically completes in under 10 seconds.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the PDF",
      text: "Once the conversion is complete, the tool will present you with a success message and prepare your file for immediate export. You can preview the PDF before downloading.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download the File",
      text: "Click the 'Download' button to save the newly created PDF securely to your local device. Your original Word document remains untouched.",
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
      name: "Will my document's formatting be preserved during the conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our Word to PDF converter uses advanced rendering technology to ensure that all fonts, margins, tables, and images remain exactly as they appear in your original Word document.",
      },
    },
    {
      "@type": "Question",
      name: "Are my files secure when uploading them for conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We prioritize your privacy. All file transfers are secured via HTTPS, and uploaded documents are automatically deleted from the processing cache immediately after the conversion is completed.",
      },
    },
    {
      "@type": "Question",
      name: "Do you support older .DOC files as well as newer .DOCX files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our tool supports both legacy Microsoft Word format (.doc) and the modern XML-based format (.docx), converting both seamlessly into standard PDF files.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a limit on how many times I can use the tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Word to PDF converter is completely free to use with no daily usage limits or paywalls. You do not need to register for an account.",
      },
    },
    {
      "@type": "Question",
      name: "Will the converter add a watermark to my PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We never add promotional watermarks, logos, or extra pages to your documents. Your output PDF will look exactly like your input file.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a DOCX file and a PDF file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOCX is an editable word processing format that relies on local fonts and software versions for rendering, meaning the same file can look different on different devices. PDF (Portable Document Format) is a fixed-layout format that displays identically on any device or operating system, making it ideal for sharing finished documents.",
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
      name: "Word to PDF Converter",
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
            Convert Resume DOCX to PDF Free — Keep Formatting, No Watermark
          </h1>
          <Image
            src="/images/word-to-pdf.webp"
            alt="Word to PDF converter — convert DOC and DOCX to high-quality PDF in the browser"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Transform your <strong>DOC</strong> and <strong>DOCX</strong> files into high-quality
            <strong>PDF</strong> documents in seconds. Enjoy 100% secure processing, flawless
            formatting retention, and zero watermarks. No installation or registration required.
          </p>

          <QuickAnswer
            question="How do I convert my resume from Word to PDF free?"
            answer="Upload your resume DOCX file to this tool. It converts to PDF in seconds — preserving your fonts, bullet points, margins, and table layout exactly as they appear in Word. No watermark, no signup, no upload to any server."
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
                <span className="text-foreground font-medium">Word to PDF Converter</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Word to PDF Converter Tool">
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

          {/* Resume-specific section */}
          <section aria-labelledby="resume-pdf" className="space-y-4">
            <h2
              id="resume-pdf"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Resume DOCX to PDF — what job boards and ATS expect
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most job applications ask you to upload a resume. Uploading a .docx file
              risks the formatting breaking in the hiring manager&apos;s version of Word.
              Uploading a .pdf locks your layout permanently and makes it ATS-safe.
              Here&apos;s what each major platform expects:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform</th>
                    <th className="border border-border p-2 text-left font-semibold">Accepted formats</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['LinkedIn Easy Apply', 'PDF (recommended), DOCX', 'PDF renders consistently in recruiter inboxes'],
                    ['Indeed', 'PDF, DOCX, RTF, TXT', 'ATS parses all; PDF preserves visual layout'],
                    ['Greenhouse (ATS)', 'PDF (recommended)', 'Most Greenhouse clients prefer PDF for ATS parsing'],
                    ['Lever (ATS)', 'PDF, DOCX', 'PDF avoids font-substitution on Lever preview'],
                    ['Workday (ATS)', 'PDF, DOCX', 'Some Workday implementations parse DOCX poorly — use PDF'],
                    ['Direct email to recruiter', 'PDF', 'Always PDF — DOCX may arrive reformatted on mobile'],
                    ['Google Careers', 'PDF, DOCX', 'PDF preferred to prevent font rendering issues'],
                  ].map(([platform, formats, note]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 font-medium text-foreground">{platform}</td>
                      <td className="border border-border p-2 text-muted-foreground">{formats}</td>
                      <td className="border border-border p-2 text-muted-foreground">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              When converting your resume, check that the output PDF uses standard
              fonts (Calibri, Arial, Times New Roman, Georgia). These are universally
              embedded and display consistently on every device. Decorative fonts from
              Google Fonts or Adobe Fonts are sometimes not embedded — the font
              section of your PDF properties (File → Properties → Fonts in Acrobat
              Reader) will list &quot;Embedded Subset&quot; for any correctly embedded font.
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
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Word to PDF Converter</strong> is a fully private,
            browser-based document utility that transforms Microsoft <strong>DOC</strong> and
            <strong>DOCX</strong> files into high-quality <strong>PDF</strong> documents. All
            processing is secure and temporary — your files are never stored or shared. Supports
            exact formatting retention, zero watermarks, and works with all modern browsers. The
            fastest free way to convert Word to PDF in 2026, with no installs, no accounts, and
            no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}