import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/image-convertir-ai"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`
const FOCUSED_CONVERTER_URL = `${SITE_URL}/tools/image-converter`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Image Tools Suite — 50+ Converters, Editors & Filters Free",
  description:
    "50+ free online image tools: convert PNG, JPG, WebP, ICO, PDF, TIFF, GIF. Resize, compress, crop, watermark, and filter. Browser-based, no login.",
  keywords: [
    "image tools suite",
    "online image editor",
    "50 image tools",
    "png to svg converter free",
    "svg to png converter free",
    "png to ico favicon generator",
    "image to pdf converter free",
    "tiff to jpg converter free",
    "avif converter online",
    "bmp converter online",
    "image resize online free",
    "image compressor browser",
    "image watermark online",
    "ascii art generator free",
    "glitch effect online",
    "halftone effect online",
    "pencil sketch from photo",
    "free image filters online",
    "image converter no upload",
    "all in one image tools",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Image Tools Suite — 50+ Converters, Editors & Filters Free",
    description:
      "50+ free online image tools — convert PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF, GIF, plus resize, compress, crop, watermark, and creative filters. Browser-based, no upload.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Image Tools Suite — 50+ Free Online Tools by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Tools Suite — 50+ Free Online Tools",
    description:
      "Convert PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF, GIF. Resize, compress, crop, watermark, filters. No upload, no account.",
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
      name: "Image Tools Suite",
      url: TOOL_URL,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (browser-based)",
      browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
      description:
        "An all-in-one suite of 50+ browser-based image tools: format conversion (PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF, GIF), resize, compress, crop, rotate, flip, watermark, grayscale, sepia, invert, vintage, pixelate, posterize, duotone, glitch, halftone, ASCII art, pencil sketch. All processing is client-side via the HTML5 Canvas API.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Convert between PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF, and GIF",
        "Generate ICO favicons with multiple resolutions",
        "Resize, crop, rotate, and flip images",
        "Compress images with adjustable JPEG/WebP quality",
        "Add text and image watermarks",
        "Apply filters: grayscale, sepia, invert, vintage, vignette, blur, emboss, edge detect, posterize, duotone, pixelate",
        "Creative canvas effects: glitch RGB-split, halftone dot pattern, ASCII text art, pencil-sketch effect",
        "Round corners, add borders, add drop shadow",
        "Image to Base64 and Data URL export",
        "100% client-side — files never leave your device",
        "No watermark on output, no account, no per-file size limit",
      ],
      publisher: {
        "@type": "Organization",
        name: "TheFreeAITools",
        url: SITE_URL,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${TOOL_URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What does the Image Tools Suite include?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "50+ tools across four categories: format converters (PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF, GIF, Base64), image editors (resize, crop, rotate, flip, compress, watermark, round corners, drop shadow), photo filters (grayscale, sepia, invert, vintage, vignette, blur, emboss, edge detect, posterize, duotone, pixelate), and creative effects (glitch, halftone, ASCII art, pencil sketch).",
          },
        },
        {
          "@type": "Question",
          name: "Does the suite use real AI for image processing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The suite uses the HTML5 Canvas API for all processing — no LLMs, no machine learning models, no neural networks. The 'AI-style' filters (glitch, halftone, ASCII art, pencil sketch) are deterministic canvas effects that produce results visually similar to AI-generated art. For real AI image generation, see /tools/free-ai-image-generator. For AI background removal, see /tools/remove-background-change-ai.",
          },
        },
        {
          "@type": "Question",
          name: "Which image formats can the suite convert between?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Convert between PNG, JPG/JPEG, WebP, SVG, ICO, PDF, BMP, TIFF, AVIF, and GIF. The most common conversions are PNG↔JPG, PNG↔WebP, WebP↔JPG, PNG→ICO, image→PDF, and SVG→PNG/WebP.",
          },
        },
        {
          "@type": "Question",
          name: "Is the Image Tools Suite private — does my file get uploaded?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All processing happens in your browser using the HTML5 Canvas API and the jsPDF library (for PDF export). No file is uploaded to a server. Your image never leaves your device.",
          },
        },
        {
          "@type": "Question",
          name: "Should I use the Image Tools Suite or the focused Image Converter?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the focused Image Converter at /tools/image-converter when you only need to convert between JPG, PNG, WebP, and GIF. Use the Image Tools Suite when you need additional formats (SVG, ICO, PDF, BMP, TIFF, AVIF) or want to resize, crop, watermark, or apply filters in the same workflow.",
          },
        },
        {
          "@type": "Question",
          name: "How do the 'AI-style' filters work without AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Glitch separates the red/green/blue channels and offsets them to mimic the RGB-split aesthetic. Halftone samples brightness and draws sized dots. ASCII art maps pixel brightness to characters like @, %, #, *. Pencil sketch inverts, blurs, and dodges the image. All four are classic canvas effects — no model inference, no external API.",
          },
        },
        {
          "@type": "Question",
          name: "Are there any file size limits or watermarks on output?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No watermark, no per-file size cap, no daily quota. Processing runs entirely in your browser — the only practical limit is your device's available RAM.",
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
          name: "Image Tools Suite",
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
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Image Tools Suite — 50+ Free Online Converters, Editors &amp; Filters
          </h1>

          <Image
            src="/images/image-convertir.webp"
            alt="Image Tools Suite interface — 50+ free browser-based image converters, editors, and creative filters"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            One page, 50+ image tools. Convert between PNG, SVG, JPG, WebP, ICO, PDF,
            BMP, TIFF, AVIF, and GIF. Resize, crop, rotate, compress, watermark, and
            apply 15+ filters and creative effects. All processing runs locally in
            your browser using the HTML5 Canvas API — no upload, no account, no
            watermark on the output.
          </p>

          <QuickAnswer
            question="Is there a free online image tools suite that does converting and editing in one place?"
            answer="Yes. The Image Tools Suite bundles 50+ browser-based tools: format conversion between PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF, GIF, plus resize, crop, rotate, compress, watermark, and 15+ filters. All processing happens locally — no upload, no signup."
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
                <span className="text-foreground font-medium">Image Tools Suite</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Image Tools Suite">
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
          <meta
            itemProp="name"
            content="The Complete Guide to the Free Online Image Tools Suite"
          />
          <meta
            itemProp="description"
            content="Learn what's inside a 50+ tool browser-based image suite — format converters, editors, filters, and creative effects — and how to pick the right tool for each task."
          />
          <meta itemProp="datePublished" content="2024-02-10" />
          <meta itemProp="dateModified" content="2026-05-11" />
          <meta itemProp="author" content="Achraf A." />

          {/* At a Glance */}
          <section aria-labelledby="at-a-glance" className="space-y-4">
            <h2
              id="at-a-glance"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Image Tools Suite at a Glance
            </h2>
            <dl className="grid gap-4 sm:grid-cols-3 rounded-xl border bg-card p-6">
              <div>
                <dt className="text-sm font-semibold text-foreground">What it is</dt>
                <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  A single-page suite of 50+ browser-based image tools — converters,
                  editors, and filters — built on the HTML5 Canvas API and jsPDF.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Who it&apos;s for</dt>
                <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Designers, developers, e-commerce sellers, and anyone who needs more
                  than just a single format conversion — resize, watermark, filter, and
                  export in one workflow.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">When to use the focused converter</dt>
                <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  For one-off JPG/PNG/WebP/GIF conversions only, use the simpler{" "}
                  <a
                    href={FOCUSED_CONVERTER_URL}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Image Converter
                  </a>
                  .
                </dd>
              </div>
            </dl>
          </section>

          {/* The "AI" honesty section */}
          <section aria-labelledby="ai-honesty" className="space-y-4">
            <h2
              id="ai-honesty"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              About the &quot;AI&quot; in the URL: An Honest Note
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The URL contains <code>-ai</code> because four of the 50+ tools produce
              creative effects that <em>look</em> AI-generated: Glitch (RGB
              channel-split), Halftone (dot-pattern print effect), ASCII Art (text-art
              from pixel brightness), and Pencil Sketch (invert-blur-dodge composite).
              All four are deterministic <strong>canvas-pixel effects</strong>, not
              machine-learning models. No LLM, no neural network, no model weights.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For genuine AI image processing, use the dedicated AI tools:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                <a
                  href="/tools/free-ai-image-generator"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Free AI Image Generator
                </a>{" "}
                — text-to-image with real generative models
              </li>
              <li>
                <a
                  href="/tools/remove-background-change-ai"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  AI Background Remover
                </a>{" "}
                — segmentation model for hair, fur, and complex backgrounds
              </li>
              <li>
                <a
                  href="/tools/fix-old-image-ai"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Fix Old Image AI
                </a>{" "}
                — AI restoration of old or low-quality photos
              </li>
            </ul>
          </section>

          {/* Tools categories */}
          <section aria-labelledby="categories" className="space-y-4">
            <h2
              id="categories"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What&apos;s Inside the Suite
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Format Converters (20+)
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  PNG ↔ JPG, PNG ↔ WebP, JPG ↔ WebP, WebP ↔ JPG, GIF → PNG/JPG/WebP,
                  AVIF → JPG/PNG, SVG → PNG/JPG/WebP, BMP → JPG/PNG, TIFF → JPG/PNG,
                  PNG → ICO favicon, Image → PDF, Image → Base64, Image → Data URL.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Image Editors (12+)
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Resize, crop, rotate, flip, compress with quality slider, add text
                  watermark, add image watermark, round corners, add border, add drop
                  shadow, adjust brightness/contrast.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Photo Filters (10+)
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Grayscale, sepia, invert (negative), vintage, vignette, blur,
                  emboss, edge detect, posterize, duotone, pixelate.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Creative Canvas Effects (4)
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Glitch (RGB-split art), Halftone (dot-print effect), ASCII Art (text
                  art from pixel brightness), Pencil Sketch (invert-blur-dodge). All
                  deterministic, no ML.
                </p>
              </article>
            </div>
          </section>

          {/* Picking the right tool */}
          <section aria-labelledby="comparison" className="space-y-4">
            <h2
              id="comparison"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Suite vs Focused Converter: Which Should You Use?
            </h2>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left p-3 font-semibold">Task</th>
                    <th className="text-left p-3 font-semibold">
                      <a
                        href={FOCUSED_CONVERTER_URL}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Image Converter (focused)
                      </a>
                    </th>
                    <th className="text-left p-3 font-semibold">
                      Image Tools Suite (this page)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 text-muted-foreground">JPG/PNG/WebP/GIF conversion</td>
                    <td className="p-3">Yes — focused, fast UI</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">SVG / ICO / PDF / BMP / TIFF / AVIF</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Resize / crop / rotate</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Watermark / round corners / border</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Filters (grayscale, sepia, blur, etc.)</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-muted-foreground">Creative canvas effects</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes — glitch, halftone, ASCII, sketch</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Use Cases */}
          <section aria-labelledby="use-cases" className="space-y-6">
            <h2
              id="use-cases"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Who Uses the Image Tools Suite?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Web Developers &amp; SEO Specialists
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Convert site assets to WebP or AVIF for Core Web Vitals,
                  generate ICO favicons in multiple sizes, and export Base64-encoded
                  inline images — all in one place.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Designers Preparing Asset Handoffs
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Export SVG → PNG variants, add transparent watermarks to client
                  proofs, round corners on mockup screenshots, and bundle exports
                  into a PDF for delivery.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  E-Commerce Sellers
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Standardize supplier images: resize to a fixed dimension, compress
                  with quality control, watermark with the brand mark, and export as
                  WebP for the storefront.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Content Creators &amp; Social Managers
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Apply vintage or duotone filters to match brand mood, generate
                  glitch-art thumbnails for video covers, and crop to platform aspect
                  ratios — without opening Photoshop.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Print &amp; Documentation Workflows
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Convert TIFF scans to web JPG/WebP, halftone for print mockups,
                  or bundle a folder of screenshots into a single multi-page PDF.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Privacy-Conscious Users
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Process sensitive images — legal exhibits, medical scans, client
                  IP — without uploading to a third-party server. Every tool runs in
                  your browser only.
                </p>
              </article>
            </div>
          </section>

          {/* FAQ */}
          <section
            aria-labelledby="faq-heading"
            className="space-y-6 rounded-2xl bg-muted/30 p-6 md:p-8"
          >
            <h2
              id="faq-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Frequently Asked Questions
            </h2>
            <dl className="grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-base font-semibold text-foreground">
                  What does the Image Tools Suite include?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  50+ tools: format converters (PNG, SVG, JPG, WebP, ICO, PDF, BMP,
                  TIFF, AVIF, GIF, Base64), image editors (resize, crop, rotate, flip,
                  compress, watermark, round corners, drop shadow), photo filters
                  (grayscale, sepia, invert, vintage, vignette, blur, emboss, edge
                  detect, posterize, duotone, pixelate), and creative canvas effects
                  (glitch, halftone, ASCII art, pencil sketch).
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Does the suite use real AI for image processing?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  No. The suite uses the HTML5 Canvas API for all processing — no
                  LLMs, no machine learning, no neural networks. The &quot;AI-style&quot;
                  filters are deterministic canvas effects. For real AI image work, use{" "}
                  <a
                    href="/tools/free-ai-image-generator"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Free AI Image Generator
                  </a>{" "}
                  or{" "}
                  <a
                    href="/tools/remove-background-change-ai"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    AI Background Remover
                  </a>
                  .
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Which image formats can the suite convert between?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  PNG, JPG/JPEG, WebP, SVG, ICO, PDF, BMP, TIFF, AVIF, and GIF. The
                  most common conversions are PNG↔JPG, PNG↔WebP, WebP↔JPG, PNG→ICO,
                  Image→PDF, and SVG→PNG/WebP.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Is the Image Tools Suite private — does my file get uploaded?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  All processing happens in your browser using the HTML5 Canvas API
                  and the jsPDF library (for PDF export). No file is uploaded to a
                  server. Your image never leaves your device.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Should I use the suite or the focused Image Converter?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Use the focused{" "}
                  <a
                    href={FOCUSED_CONVERTER_URL}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Image Converter
                  </a>{" "}
                  for JPG/PNG/WebP/GIF only. Use this suite when you need additional
                  formats (SVG, ICO, PDF, BMP, TIFF, AVIF) or want to resize, crop,
                  watermark, or apply filters in the same workflow.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  How do the &quot;AI-style&quot; filters work without AI?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Glitch separates the red/green/blue channels and offsets them.
                  Halftone samples brightness and draws sized dots. ASCII art maps
                  pixel brightness to characters like @, %, #, *. Pencil sketch
                  inverts, blurs, and dodges the image. All four are classic canvas
                  effects.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Are there any file size limits or watermarks on output?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  No watermark on the output, no per-file size cap, no daily quota.
                  Processing runs entirely in your browser — the only practical limit
                  is your device&apos;s available RAM.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Can I batch-process multiple images at once?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  The suite is built for single-image workflows. For batch processing,
                  process each image sequentially through the same tool — the
                  browser-based pipeline is fast enough that 10–50 images is
                  comfortable.
                </dd>
              </div>
            </dl>
          </section>

          {/* Related */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related Image &amp; AI Tools
            </h2>
            <p className="text-sm text-muted-foreground">
              Real AI image tools and the focused converter for single-format work.
            </p>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  {
                    name: "Image Converter (focused JPG/PNG/WebP/GIF)",
                    path: "/tools/image-converter",
                  },
                  {
                    name: "Free AI Image Generator (real generative AI)",
                    path: "/tools/free-ai-image-generator",
                  },
                  {
                    name: "AI Background Remover (real AI)",
                    path: "/tools/remove-background-change-ai",
                  },
                  { name: "Fix Old Image AI", path: "/tools/fix-old-image-ai" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Image Tools Suite</strong> bundles 50+
            browser-based image tools into a single workspace: format conversion
            (PNG, SVG, JPG, WebP, ICO, PDF, BMP, TIFF, AVIF, GIF), resize, crop,
            rotate, compress, watermark, and 15+ filters and creative effects. All
            processing runs locally on your device with no server upload. For
            single-format conversions only, the focused{" "}
            <a
              href={FOCUSED_CONVERTER_URL}
              className="text-primary underline-offset-4 hover:underline"
            >
              Image Converter
            </a>{" "}
            is faster. For real AI image work, see the dedicated AI tools.
          </p>
          <p>Last reviewed: 2026-05-11.</p>
        </footer>
      </div>
    </>
  )
}
