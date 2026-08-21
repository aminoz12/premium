import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/edit-pdf"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

export const metadata: Metadata = {
  title: "Fill and Sign PDF Free — No Adobe, No Upload, No Account",
  description:
    "Fill PDF forms, add your signature, annotate, and redact text directly in your browser — free, no Adobe Acrobat, no file upload, no account required.",
  keywords: [
    "ai pdf editor online free",
    "free pdf editor online no signup",
    "free pdf editor",
    "edit pdf online free",
    "edit pdf in browser",
    "pdf editor no upload",
    "free online pdf editor no watermark",
    "edit pdf text online",
    "pdf annotation tool free",
    "pdf editor no login",
    "redact pdf online free",
    "sign pdf online free",
    "fill pdf form online",
    "free pdf editor no adobe",
    "browser pdf editor private",
    "edit pdf file free",
    "modify pdf online free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Fill and Sign PDF Free — No Adobe, No Upload, No Account",
    description:
      "Fill PDF forms, add your signature, annotate, and redact text directly in your browser. Free, private, no upload, no Adobe Acrobat needed.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free PDF Editor — Edit PDFs Online in Browser by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Editor — Edit PDFs Online in Browser",
    description:
      "Edit, annotate, redact, sign, and download PDFs privately in your browser. No upload, no account.",
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

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${TOOL_URL}#software`,
      name: "Free PDF Editor",
      url: TOOL_URL,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Any (browser-based)",
      browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
      description:
        "Browser-based PDF editor built on PDF.js. Edit text, add annotations, redact sensitive content, place signatures, insert images, and export the modified PDF — all client-side, no server upload.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Edit PDF text directly with click-to-edit overlay",
        "Highlight, underline, strikethrough, and freehand annotation",
        "Add text boxes, sticky notes, callouts, and stamps",
        "Insert images and signatures on any page",
        "Redact sensitive content with permanent blackout",
        "Whiteout text to delete content visually",
        "Page reorder, rotate, duplicate, and delete",
        "Merge multiple PDFs and add new pages",
        "100% client-side processing — no server upload",
        "No watermark, no account, no page or file-count limit",
      ],
      publisher: {
        "@type": "Organization",
        name: "TheFreeAITools",
        url: SITE_URL,
      },
    },
    {
      "@type": "HowTo",
      "@id": `${TOOL_URL}#howto`,
      name: "How to Edit a PDF Online Free",
      description:
        "Step-by-step guide to editing a PDF in your browser using the free PDF editor.",
      totalTime: "PT2M",
      tool: [{ "@type": "HowToTool", name: "TheFreeAITools PDF Editor" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload your PDF",
          text: "Drag a PDF onto the editor or click to browse. The file loads into your browser using PDF.js — nothing is uploaded to a server.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Edit text or add annotations",
          text: "Toggle Edit Text mode and click any text on the page to modify it. Or use the toolbar to add highlights, sticky notes, signatures, images, redactions, or freehand drawings.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Manage pages",
          text: "Reorder pages by dragging thumbnails, rotate or delete individual pages, or merge another PDF into the document.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Download the edited PDF",
          text: "Click Export to save the modified PDF to your device. The original file is never altered — only the new version you download contains your edits.",
          url: TOOL_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${TOOL_URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I edit a PDF online for free without uploading it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Open the free PDF editor, drag your PDF into the editor, and use the toolbar to edit text, annotate, redact, or sign. The PDF is loaded into your browser using PDF.js — no file is uploaded to a server. Click Export to download the edited version.",
          },
        },
        {
          "@type": "Question",
          name: "Can I edit existing PDF text or only add annotations on top?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Both. The editor supports direct text editing — toggle Edit Text mode, click any line of text on the page, and retype it. You can also add a layer of annotations (highlights, sticky notes, signatures, stamps, images) without changing the underlying text.",
          },
        },
        {
          "@type": "Question",
          name: "Is the PDF editor private — does my file get uploaded?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All editing happens in your browser using PDF.js. The PDF is loaded into your browser memory and never transmitted to a server. This makes the editor safe for contracts, financial reports, medical records, and other sensitive documents.",
          },
        },
        {
          "@type": "Question",
          name: "Can I redact sensitive information from a PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Use the Redact tool to draw permanent blackout boxes over sensitive text. When you export the PDF, the redacted areas are baked into the file — the underlying text cannot be recovered from the exported document.",
          },
        },
        {
          "@type": "Question",
          name: "Can I add a signature to a PDF in this editor?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Use the Sign tool to draw a signature with your mouse, trackpad, or touchscreen, then drag it to the correct location on the page. The signature is added as a transparent overlay and exported with the final PDF.",
          },
        },
        {
          "@type": "Question",
          name: "What is the maximum PDF file size I can edit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "There is no hard limit. The editor works well for PDFs up to 50 MB on most devices. Larger files (100+ MB) may slow rendering depending on your device's RAM, but they will still load.",
          },
        },
        {
          "@type": "Question",
          name: "Does the free PDF editor add a watermark to the exported file?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No watermark, no branding, no page limit. The exported PDF contains only your content and edits.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need a free PDF editor or an AI tool to summarize and chat with a PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the PDF editor to modify text, annotate, redact, or sign a PDF. For summarizing a long PDF or asking questions about its contents, use our Chat with PDF tool at /tools/chat-with-pdf — it pairs with this editor for AI-assisted reading.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${TOOL_URL}#breadcrumb`,
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
          item: `${SITE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "PDF Editor",
          item: TOOL_URL,
        },
      ],
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <div className="px-14 py-8">
        <header className="mb-6 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Fill and Sign PDF Free — No Adobe, No Upload, No Account
          </h1>

          <Image
            src="/images/edit-pdf.webp"
            alt="PDF editor interface showing text editing, annotations, and signature placement on a PDF page"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Edit PDF text, annotate, redact, sign, and add images directly in your
            browser. Built on PDF.js, the editor runs entirely on your device — no file
            upload, no account, no Adobe Acrobat subscription. Export the modified PDF
            with one click.
          </p>

          <QuickAnswer
            question="How do I fill out and sign a PDF form for free without Adobe?"
            answer="Open your PDF in this free browser-based editor. Click a form field to type in it, or use the signature tool to draw or type your signature. No Adobe Acrobat, no account, and the file never leaves your device — download the signed PDF when done."
          />

          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li>
                <a
                  href={`${SITE_URL}/`}
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a
                  href={`${SITE_URL}/tools`}
                  className="hover:text-foreground transition-colors"
                >
                  PDF Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">PDF Editor</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="PDF Editor">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article
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

          {/* Fill & sign use-cases table */}
          <section aria-labelledby="pdf-operations" className="space-y-4">
            <h2
              id="pdf-operations"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What you can do with this free PDF editor
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left font-semibold">Operation</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Works in browser?</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2">Fill form fields (text, checkbox, radio)</td>
                    <td className="border border-border px-3 py-2 text-green-600 font-medium">✓ Yes</td>
                    <td className="border border-border px-3 py-2">Works on interactive PDF forms</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">Add typed or drawn signature</td>
                    <td className="border border-border px-3 py-2 text-green-600 font-medium">✓ Yes</td>
                    <td className="border border-border px-3 py-2">Draw with mouse/stylus or type name</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Add text anywhere on page</td>
                    <td className="border border-border px-3 py-2 text-green-600 font-medium">✓ Yes</td>
                    <td className="border border-border px-3 py-2">Overlay text on any position</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">Highlight / underline / strikethrough</td>
                    <td className="border border-border px-3 py-2 text-green-600 font-medium">✓ Yes</td>
                    <td className="border border-border px-3 py-2">Annotation tools</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Redact (black out) text</td>
                    <td className="border border-border px-3 py-2 text-green-600 font-medium">✓ Yes</td>
                    <td className="border border-border px-3 py-2">Visually covers text; verify output before sharing</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">Add images / stamps</td>
                    <td className="border border-border px-3 py-2 text-green-600 font-medium">✓ Yes</td>
                    <td className="border border-border px-3 py-2">Insert logo or signature image</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Reflow / edit existing body text</td>
                    <td className="border border-border px-3 py-2 text-yellow-600 font-medium">~ Partial</td>
                    <td className="border border-border px-3 py-2">Works on simple text PDFs; complex layouts may shift</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">Rearrange or delete pages</td>
                    <td className="border border-border px-3 py-2 text-green-600 font-medium">✓ Yes</td>
                    <td className="border border-border px-3 py-2">Page-level operations are reliable</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Cryptographic digital signature (eIDAS)</td>
                    <td className="border border-border px-3 py-2 text-red-600 font-medium">✗ No</td>
                    <td className="border border-border px-3 py-2">Requires a certificate authority — use DocuSign/Adobe Sign</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">OCR scanned PDF text</td>
                    <td className="border border-border px-3 py-2 text-red-600 font-medium">✗ No</td>
                    <td className="border border-border px-3 py-2">Scanned pages are images — use our PDF to JPG tool first</td>
                  </tr>
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
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Free PDF Editor</strong> is a fully private,
            browser-based PDF editor built on PDF.js. Edit text, annotate, redact,
            sign, and add images to any PDF — no file upload, no Adobe Acrobat, no
            account. To summarize or ask questions about a PDF instead of editing it,
            use the{" "}
            <a
              href="/tools/chat-with-pdf"
              className="text-primary underline-offset-4 hover:underline"
            >
              Chat with PDF
            </a>{" "}
            tool.
          </p>
          <p>Last reviewed: 2026-05-11.</p>
        </footer>
      </div>
    </>
  )
}
