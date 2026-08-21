import type { Metadata } from "next"
import Image from "next/image"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ToolClient from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/image-converter"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`
const SUITE_URL = `${SITE_URL}/tools/image-convertir-ai`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Image Converter — JPG, PNG, WebP & GIF Online",
  description:
    "Convert images between JPG, PNG, WebP, and GIF instantly in your browser. Free, private, no upload. Transparent PNG to JPG fills white automatically.",
  keywords: [
    "image converter",
    "image format converter",
    "convert image online free",
    "jpg to png converter online",
    "png to jpg converter free",
    "png to webp converter free",
    "webp to png converter free",
    "jpg to webp converter free",
    "webp to jpg converter free",
    "gif to png converter free",
    "image converter no upload",
    "convert image without uploading",
    "free image format changer 2026",
    "browser image converter no signup",
    "client side image converter",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Image Converter — JPG, PNG, WebP & GIF Online",
    description:
      "Convert images between JPG, PNG, WebP, and GIF in your browser. Free, private, no upload, no account.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Image Converter — JPG, PNG, WebP, GIF by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Converter — JPG, PNG, WebP & GIF Online",
    description:
      "Convert images between JPG, PNG, WebP, and GIF in your browser. No upload, no watermark.",
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
      name: "Free Image Converter",
      url: TOOL_URL,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (browser-based)",
      browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
      description:
        "Browser-based image format converter using the HTML5 Canvas API. Convert between JPG, PNG, WebP, and GIF with automatic white-fill for transparent PNG to JPG conversion. All processing is client-side — no server upload.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Convert between JPG, PNG, WebP, and GIF",
        "Automatic white background fill when converting transparent PNG to JPG",
        "Real-time file size comparison after conversion",
        "100% client-side processing — image never leaves your device",
        "No watermark, no account, no per-file size limit",
        "Universal compatibility across Windows, macOS, Linux, iOS, Android",
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
      name: "How to Convert an Image Format Online Free",
      description:
        "Step-by-step guide to converting an image between JPG, PNG, WebP, or GIF in your browser.",
      totalTime: "PT1M",
      tool: [{ "@type": "HowToTool", name: "TheFreeAITools Image Converter" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload your source image",
          text: "Click the upload zone or drag and drop a JPG, PNG, WebP, GIF, or BMP file. The image loads into your browser — nothing is uploaded.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Select the target output format",
          text: "Pick JPG, PNG, WebP, or GIF from the format dropdown. Choose JPG for photos, PNG for transparent graphics, WebP for smaller web files, GIF for animations.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Convert in the browser",
          text: "Click Convert. The image is drawn to an HTML5 Canvas and re-encoded into the target format using the browser's native image encoder.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Preview and download",
          text: "Compare the original and converted file sizes, preview the result, then click Download. The original file is never modified.",
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
          name: "How do I convert an image format online for free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your image, select the target format (JPG, PNG, WebP, or GIF), click Convert, and download the result. All processing happens locally in your browser — no server upload, no account required.",
          },
        },
        {
          "@type": "Question",
          name: "Which image formats can this converter handle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Convert between JPG, PNG, WebP, and GIF. BMP and other browser-readable formats can be used as inputs. For SVG, ICO, PDF, TIFF, or AVIF conversion plus 40+ image editing tools, use our larger Image Tools Suite at /tools/image-convertir-ai.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to a transparent PNG when I convert it to JPG?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "JPEG does not support transparency. When converting a transparent PNG to JPG, the converter fills all transparent areas with solid white before encoding, preventing the black-fill artifact that naive Canvas converters produce.",
          },
        },
        {
          "@type": "Question",
          name: "Is the converter private — does my image get uploaded?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All conversion happens in your browser using the HTML5 Canvas API. The image is never transmitted to a server. Safe for confidential product photos, medical images, or any sensitive content.",
          },
        },
        {
          "@type": "Question",
          name: "Why should I convert images to WebP?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "WebP files are 25–35% smaller than equivalent JPG and up to 50% smaller than equivalent lossless PNG at the same visual quality. Every modern browser supports WebP, so converting site images to WebP cuts page weight and improves Core Web Vitals.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between lossy and lossless image formats?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lossy formats like JPG discard image data to shrink the file. Lossless formats like PNG preserve every pixel. WebP supports both modes. JPG is best for photos; PNG is best for graphics with sharp edges and transparency; WebP is the modern compromise for the web.",
          },
        },
        {
          "@type": "Question",
          name: "Are there any file size limits or watermarks?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No file size limits, no watermark, no per-day quota. Conversion runs entirely in your browser, so the only practical ceiling is your device's available RAM.",
          },
        },
        {
          "@type": "Question",
          name: "What if I also need to compress, resize, or apply filters?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the Image Compressor at /tools/image-compressor for size optimization, or the Image Tools Suite at /tools/image-convertir-ai for 50+ converters and editors including resize, crop, watermark, grayscale, and creative filters.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${TOOL_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Image Tools",
          item: `${SITE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Image Converter",
          item: TOOL_URL,
        },
      ],
    },
  ],
}

export default function ImageConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <div className=" ">
        <header className="space-y-4 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Free Image Converter — JPG, PNG, WebP &amp; GIF Online
          </h2>


          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Convert images between JPG, PNG, WebP, and GIF directly in your browser.
            Transparent PNG to JPG fills with white automatically, file sizes are
            compared side by side, and the converted file downloads in one click. No
            server upload, no account, no watermark.
          </p>

          <QuickAnswer
            question="How do I convert an image format online for free?"
            answer="Upload your image, select your target format (JPG, PNG, WebP, or GIF), click Convert, and download the result. All processing happens locally in your browser — no upload, no account."
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
                  Image Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Image Converter</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Free Image Converter">
          <ToolClient />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border" />

        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Image Format Converter: JPEG, PNG, WebP — Which Loses Quality and Which Doesn't" />
          <meta
            itemProp="description"
            content="The difference between lossy and lossless image conversion, which format changes always degrade quality, and the right format for each use case in 2026."
          />
          <meta itemProp="datePublished" content="2024-02-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Lossy vs lossless */}
          <section aria-labelledby="lossy-lossless" className="space-y-4">
            <h2
              id="lossy-lossless"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which conversions lose quality — and which don&apos;t
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Converting between lossless formats (PNG ↔ WebP lossless ↔ BMP) preserves
              every pixel — no quality loss. Converting from a lossy format (JPEG) to a
              lossless one (PNG) does not recover the quality lost during the original
              JPEG compression — it simply stores the already-degraded pixels losslessly.
              The file gets larger but no sharper.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Converting from PNG to JPEG always discards the alpha channel (transparency
              becomes white or black depending on the tool) and applies lossy compression.
              If your PNG has transparent areas that matter — a logo, an icon, a product
              shot on a transparent background — JPEG is the wrong target format. Use
              WebP or keep PNG.
            </p>
          </section>

          {/* Format guide */}
          <section
            aria-labelledby="format-guide"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="format-guide"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which format to use in 2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Scenario</th>
                    <th className="border border-border p-2 text-left font-semibold">Best format</th>
                    <th className="border border-border p-2 text-left font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Photography, hero images', 'WebP (lossy)', '25–34% smaller than JPEG at same visual quality'],
                    ['Logos, icons, illustrations', 'SVG (vector) or PNG', 'SVG scales; PNG preserves edges and transparency'],
                    ['Screenshots, UI mockups', 'PNG or WebP lossless', 'Crisp text; JPEG blurs edges'],
                    ['Email images', 'JPEG', 'Some email clients strip WebP; JPEG is universally safe'],
                    ['Images that will be edited further', 'PNG', 'Avoid generation loss from re-saving JPEG'],
                    ['iOS/macOS only targets', 'HEIC', 'Native Apple format; 40–50% smaller than JPEG'],
                    ['Print (300 DPI)', 'JPEG or TIFF at 300+ DPI', 'Web formats at 72 DPI look blurry in print'],
                  ].map(([scenario, format, why]) => (
                    <tr key={scenario}>
                      <td className="border border-border p-2 text-muted-foreground">{scenario}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{format}</td>
                      <td className="border border-border p-2 text-muted-foreground">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How this tool works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How conversion works in the browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Your image is decoded by the browser&apos;s native image decoder, drawn to an
              HTML Canvas element, then re-encoded to the target format using{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">canvas.toBlob()</code>{' '}
              with the target MIME type. WebP encoding uses the browser&apos;s built-in
              WebP encoder. PNG uses lossless compression. JPEG uses the browser&apos;s
              DCT encoder at the quality level you specify. Nothing is uploaded —
              conversion happens entirely on your device.
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
                  { name: "Background Remover", path: "/tools/remove-bg" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Free Image Converter</strong> is a focused,
            browser-based converter for the four most common web image formats: JPG,
            PNG, WebP, and GIF. All conversion runs locally on your device with no
            server upload. For more formats (SVG, ICO, PDF, TIFF, AVIF) plus 40+
            image editing tools, use the{" "}
            <a
              href={SUITE_URL}
              className="text-primary underline-offset-4 hover:underline"
            >
              Image Tools Suite
            </a>
            .
          </p>
          <p>Last reviewed: 2026-05-11.</p>
        </footer>
      </div>
    </>
  )
}
