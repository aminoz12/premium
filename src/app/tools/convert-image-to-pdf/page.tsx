import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import Image from "next/image"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URLs ─────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/convert-image-to-pdf`

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    "Combine Multiple Images into One PDF Free — JPG PNG WebP, No Upload",
  description:
    "Convert JPG, PNG, WebP, GIF, BMP, and SVG images into a single PDF with custom page size, orientation, margins, and fit. 100% private, free, no watermark.", // 140 chars
  keywords: [
    "image to pdf converter",
    "convert image to pdf online free",
    "jpg to pdf merge images",
    "png to pdf converter browser",
    "webp to pdf no upload 2026",
    "free image to pdf without watermark",
    "combine images into one pdf",
    "batch image to pdf tool",
    "image to pdf page size a4",
    "client side image to pdf",
    "private image to pdf converter",
    "image to pdf no sign up",
    "photo to pdf free online",
    "scan images into pdf",
    "image to pdf orientation portrait",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Image to PDF Converter – Combine Images into PDF", // 52 chars
    description:
      "Merge JPG, PNG, WebP, GIF, BMP, and SVG into one PDF with full control over page layout. No upload, private, entirely browser-based.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Image to PDF Converter – Combine Images into One PDF by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PDF Converter – Free, Private & No Watermark", // 46 chars
    description:
      "Convert multiple images to one PDF in your browser. No upload, no account, no watermark. JPG, PNG, WebP, and more.",
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
  name: "Image to PDF Converter",
  url: TOOL_URL,
  description:
    "A free, private, browser-based tool that converts multiple JPG, PNG, WebP, GIF, BMP, and SVG images into one PDF document with customizable page size, orientation, margins, image fit, and background. No files ever leave your device.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with Canvas API and JavaScript (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert JPG, PNG, WebP, GIF, BMP, and SVG images to PDF",
    "Combine multiple images into one multi-page PDF document",
    "Select A4, Letter, Legal, A3, A5 page sizes",
    "Choose portrait or landscape orientation",
    "Set custom page margins (small, normal, large, or custom)",
    "Control how each image fits the page: contain, cover, stretch, or original size",
    "Add a plain white, black, or custom background color to pages",
    "Drag-and-drop image reordering before conversion",
    "Instant PDF generation — no file upload, fully client-side",
    "No watermarks, no account, no file size limits",
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
  name: "How to Convert Images to a PDF",
  description:
    "Learn how to turn JPG, PNG, WebP, and other images into one polished PDF file using the free browser-based Image to PDF Converter.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Image to PDF Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Add Your Images",
      text: "Click the upload area or drag and drop JPG, PNG, WebP, GIF, BMP, or SVG files. The images are loaded directly into your browser — nothing is sent to a server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Arrange and Configure",
      text: "Drag the thumbnails to reorder the pages. Choose the page size (e.g., A4), orientation, margins, image fit mode, and background color from the settings panel.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Convert to PDF",
      text: "Click the 'Convert to PDF' button. The tool instantly generates the PDF using your browser's Canvas API and a PDF rendering library — all locally.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your PDF",
      text: "Once the PDF is ready, a download button appears. Click it to save the high-quality PDF to your device. No watermark is added.",
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
      name: "How do I convert images to PDF for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Just drag and drop your JPG, PNG, WebP, GIF, BMP, or SVG files into the upload area. Arrange them, pick your page settings, and click Convert to PDF. The PDF is created instantly in your browser, completely free, with no watermarks or account required.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The converter supports all common image formats that can be decoded by modern browsers: JPG / JPEG, PNG, WebP, GIF, BMP, and SVG. Any image your browser can display can be converted into a PDF page.",
      },
    },
    {
      "@type": "Question",
      name: "What page size and layout options are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can choose from A4, Letter, Legal, A3, and A5 page sizes, set portrait or landscape orientation, adjust margins, and control how the image fits the page — options include contain (scale to fit), cover (fill without gaps), stretch, or original size. You can also pick a background color for the page.",
      },
    },
    {
      "@type": "Question",
      name: "Are my images uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The tool works entirely inside your web browser. Images are decoded using the browser's native decoders and the PDF is generated locally via the Canvas API. No data is ever transmitted or stored on a remote server.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from using desktop software or online services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike desktop programs, you don't need to install anything. Compared to typical online converters, no upload is required — your files stay private. The tool combines the speed of a local app with the convenience of a web page, without sacrificing privacy.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a limit on how many images I can convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is no set limit. Because everything happens on your device, you can add as many images as your browser's memory comfortably handles. You can also control the output quality to keep the final PDF file size manageable.",
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
      name: "Image to PDF Converter",
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
                <span className="text-foreground font-medium">Image to PDF Converter</span>
              </li>
            </ol>
          </nav>

          {/* ── Hero ── */}
          <header className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Combine Multiple Images into One PDF Free — JPG PNG WebP, No Upload
            </h1>
            <QuickAnswer
              question="How do I combine multiple images into one PDF for free?"
              answer="Upload your JPG, PNG, or WebP images here, arrange them in order by dragging the thumbnails, choose your page size (A4, Letter, Legal, etc.) and orientation, then click Generate PDF. All images are merged into a single PDF directly in your browser — no upload, no server, no watermark. Download the finished PDF with one click."
            />
            <Image
              src="/images/convert-image-to-pdf.webp"
              alt="Image to PDF converter interface — bundle JPG, PNG, WebP, GIF, BMP, and SVG into a single PDF"
              width={1200}
              height={630}
              priority
              className="rounded-lg border max-w-3xl w-full h-auto"
            />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Convert <strong>JPG</strong>, <strong>PNG</strong>, <strong>WebP</strong>, GIF, BMP, and SVG images into a single, polished PDF. Choose page size, orientation, margins, image fit, and background — all in your browser. No upload, no watermark, no account required.
            </p>
          </header>

          {/* ── Tool Client ── */}
          <main id="tool" aria-label="Image to PDF Converter Tool">
            <ToolClient />
          </main>

          <hr className="border-border" />

          {/* ─── AdSense High-Value Content Article (800+ words) ──────────── */}
          <article
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

            {/* Use-cases for image-to-PDF */}
            <section aria-labelledby="image-to-pdf-usecases" className="space-y-4">
              <h2
                id="image-to-pdf-usecases"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                When to combine images into a PDF — common use cases
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Use case</th>
                      <th className="border border-border p-2 text-left font-semibold">Images to combine</th>
                      <th className="border border-border p-2 text-left font-semibold">Recommended settings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Submit scanned documents (passport, ID, utility bill)', 'JPG scans of each page', 'A4 portrait, fit image to page, no margins'],
                      ['Send multiple screenshots as one file', 'PNG screenshots', 'Letter size or A4, default margins for readability'],
                      ['Combine product photos for a catalogue', 'High-res JPG product images', 'A4 landscape, tight margins, one image per page'],
                      ['Submit assignment scans to a school/university portal', 'JPG photos of handwritten pages', 'A4 portrait, greyscale if supported, max quality'],
                      ['Bundle receipt photos for expense report', 'Phone camera JPGs', 'Multiple per page or one per page depending on size'],
                      ['Create a photo book or storyboard PDF', 'JPG or PNG images', 'Custom page size matching your print specs'],
                      ['Archive printed invoices (scanned)', 'JPG scans', 'A4 portrait, lossless quality for archival'],
                    ].map(([useCase, images, settings]) => (
                      <tr key={useCase}>
                        <td className="border border-border p-2 font-medium text-foreground">{useCase}</td>
                        <td className="border border-border p-2 text-muted-foreground">{images}</td>
                        <td className="border border-border p-2 text-muted-foreground">{settings}</td>
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
                    { name: "PDF to Word", path: "/tools/pdf-to-word" },
                    { name: "Convert PDF to Image", path: "/tools/convert-pdf-to-image" },
                    { name: "Image Compressor", path: "/tools/image-compressor" },
                  ]}
                />
              </nav>
            </section>
          </article>

          {/* ── Page Footer ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — Image to PDF Converter</strong> transforms your <strong>JPG, PNG, WebP, GIF, BMP, and SVG</strong> files into a single, professionally formatted <strong>PDF</strong> document. Customize page size, orientation, margins, image fit, and background — all without uploading a single byte. No watermarks, no account, and complete privacy make it the smartest way to create PDFs from images in 2026.
            </p>
          </footer>
        </div>
     </>
    </>
  )
}