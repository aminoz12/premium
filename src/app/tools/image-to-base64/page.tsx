import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/image-to-base64"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 46 characters — well within the 50–60 char SERP window

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Image to Base64 — Encode PNG/SVG for CSS & HTML Data URI Free",
  description:
    "Convert any image (PNG, JPG, SVG, WebP) to a Base64 data URI — ready to paste into CSS background-image, HTML img src, or JSON. Free, browser-based, no server upload.",
  keywords: [
    "image to base64 converter",
    "convert image to base64 online",
    "free base64 image encoder",
    "jpg to base64 converter free",
    "png to base64 online tool",
    "webp to base64 encoder 2026",
    "svg base64 converter browser",
    "image to base64 no upload",
    "client side image encoder",
    "base64 data uri generator",
    "online image encoder free",
    "convert photo to base64 string",
    "image to base64 for html css",
    "private image converter no server",
    "fast base64 encoder online 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Image to Base64 Converter — Free Online Encoder",
    description:
      "Instantly encode any image to Base64 directly in your browser. 100% client-side processing means your images never leave your device. Supports JPG, PNG, WebP, and SVG — no account required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Image to Base64 Converter — Free Online Encoder by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to Base64 Encoder & Data URI Generator",
    description:
      "Convert JPG, PNG, WebP, or SVG files to Base64 strings directly in your browser. No uploads, no accounts, no limits — completely free and private.",
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
  name: "Image to Base64 Converter",
  url: TOOL_URL,
  description:
    "A completely free, privacy-focused browser tool that converts image files (JPG, PNG, WebP, SVG) into Base64 encoded strings and Data URIs without any server uploads.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with FileReader API support (Chrome 76+, Firefox 68+, Safari 14+, Edge 79+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert JPG, PNG, WebP, and SVG images to Base64 encoded strings",
    "Generate ready-to-use CSS background-image Data URIs",
    "Generate HTML img src Data URIs for inline embedding",
    "100% client-side processing for total user privacy",
    "No server uploads — images never leave your device",
    "No file size limits or conversion quotas",
    "No account registration necessary",
    "Cross-platform: works on Windows, macOS, and Linux",
    "Instant encoding with real-time preview and copy-to-clipboard",
    "Download encoded output as a .txt file for offline use",
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
  name: "How to Convert an Image to Base64",
  description:
    "A simple 4-step guide to encoding any image file into a Base64 string using our free, browser-based converter. The entire process takes under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Image to Base64 Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Image File",
      text: "Click the upload zone or drag and drop your target image file (JPG, PNG, WebP, or SVG) into the designated area on the page. The file is loaded directly into your browser — nothing is sent to a server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Output Format",
      text: "Choose your desired output format. Select 'Plain Base64' for the raw encoded string, 'CSS Data URI' for a ready-to-use background-image property, or 'HTML Data URI' for a complete img tag with src attribute.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Encode the Image",
      text: "Click the 'Convert' button. The tool processes the image locally in your browser using the FileReader API to generate the Base64 representation. This step requires no internet upload and completes instantly.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download Result",
      text: "Once encoding is complete, click the copy button to save the Base64 string to your clipboard, or click download to save it as a .txt file directly to your device. Your original image file is not altered in any way.",
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
      name: "How do I convert an image to Base64 for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your image file using this browser-based converter. It processes the file locally on your device, encodes it into a Base64 string, and lets you copy or download the result — no server uploads, no account, and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats can I convert to Base64?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports the most common web image formats, including JPG/JPEG, PNG, WebP, and SVG. Simply upload your image and the converter will automatically detect the format and generate the corresponding Base64 output.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the Base64 output directly in HTML or CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can generate three output types: Plain Base64 for general use, CSS Data URI for background-image properties, and HTML Data URI for complete img src attributes. All formats are ready to paste directly into your code.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server when I convert it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing happens locally in your browser using the FileReader API and native JavaScript encoding. Your image file never leaves your device, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Base64 encoding and image compression?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Base64 encoding converts binary image data into a text string using 64 ASCII characters, making it safe to embed in text-based formats like HTML, CSS, or JSON. Image compression reduces file size by removing redundant data. This tool performs encoding, not compression — the output string will be roughly 33% larger than the original binary file.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any file size limits on the image I can upload?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Because all processing happens inside your browser and no file is uploaded to our servers, we do not impose any artificial file size limits. The only practical limit is your device's available RAM, which can comfortably handle most image files.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Developer Tools > Tool ─

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
      name: "Developer Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Image to Base64 Converter",
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
            Image to Base64 — Encode PNG/SVG for CSS & HTML Data URI Free
          </h1>
          <img src="/images/image-to-base64.webp" alt="Free Image to Base64 Converter — encode JPG, PNG, SVG to Base64 online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Convert any image file to a Base64 encoded string directly in your browser. Supports
            JPG, PNG, WebP, and SVG — output as plain text, CSS Data URI, or HTML img src. All
            processing runs locally on your device: no server uploads, no account, and no file
            size limits.
          </p>

          <QuickAnswer
            question="How do I use an image as a CSS background without an external file?"
            answer="Convert your image to Base64 and paste it as a data URI: background-image: url('data:image/png;base64,iVBORw0K…'). The image is embedded directly in the CSS file — no separate HTTP request needed. Best for small icons under 10 KB."
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
                  Developer Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Image to Base64 Converter</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Image to Base64 Converter Tool">
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
          <meta itemProp="name" content="Image to Base64 Converter: Data URIs, When to Use Them, and When Not To" />
          <meta
            itemProp="description"
            content="What a Base64 data URI is, the 33% size overhead, and the specific cases where inlining images as Base64 actually helps vs. hurts performance."
          />
          <meta itemProp="datePublished" content="2024-02-26" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What a data URI is */}
          <section aria-labelledby="what-data-uri" className="space-y-4">
            <h2
              id="what-data-uri"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a Base64 data URI is
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A data URI embeds a file directly in a text document — HTML, CSS, or
              JSON — using Base64 encoding. Format:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                data:[mime-type];base64,[encoded-data]
              </code>.
              A 100 KB PNG becomes roughly 133 KB of Base64 text (the 3:4 encoding
              ratio adds 33% overhead). The browser decodes it in memory without a
              separate network request.
            </p>
          </section>

          {/* When to use and when not to */}
          <section
            aria-labelledby="when-to-use"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="when-to-use"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When Base64 images actually help — and when they hurt
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Good use: small icons in CSS</span>
                <span>
                  Inline a 200-byte SVG icon or a 1 KB spinner in your CSS to eliminate
                  a network round-trip. At this size, the 33% overhead is negligible
                  and avoiding a separate HTTP request saves real time on constrained
                  connections. Bundlers like webpack can auto-inline images below a
                  size threshold (typically 8 KB) for this reason.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Good use: HTML email images</span>
                <span>
                  Some email clients block externally hosted images by default.
                  Inlining critical images (logo, header) as Base64 ensures they
                  render without user interaction. Be aware: this increases the raw
                  email size, which can trigger spam filters on large inlined images.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Bad use: large images in web pages</span>
                <span>
                  A 500 KB hero image as Base64 in HTML is 667 KB of inline text.
                  It bloats the HTML document, defeats browser caching (the image
                  re-downloads with every page load instead of being cached separately),
                  and delays the first meaningful paint. Serve large images as separate
                  files from a CDN.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Bad use: storing in a database</span>
                <span>
                  Base64 images in a database column create oversized rows, make
                  indexing slower, and complicate backup/restore. Store image files
                  in object storage (S3, Cloudflare R2, Supabase Storage) and save
                  only the URL in the database.
                </span>
              </li>
            </ul>
          </section>

          {/* CSS & HTML Data URI use-cases */}
          <section aria-labelledby="data-uri-usage" className="space-y-4">
            <h2
              id="data-uri-usage"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Where to use Base64 data URIs in CSS & HTML
            </h2>
            <p className="text-sm text-muted-foreground">
              Base64 embeds eliminate one HTTP request per image — valuable for tiny assets
              where the request overhead exceeds the file size.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left font-semibold">Use case</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Code pattern</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2">CSS background-image</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">background-image: url('data:image/png;base64,…')</td>
                    <td className="border border-border px-3 py-2">Small icons, patterns (&lt;10 KB)</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">HTML img src</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">&lt;img src="data:image/jpeg;base64,…"&gt;</td>
                    <td className="border border-border px-3 py-2">Email HTML, offline pages</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">CSS content (pseudo-element)</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">content: url('data:image/svg+xml;base64,…')</td>
                    <td className="border border-border px-3 py-2">Decorative SVG icons</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">SVG filter / feImage</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">xlink:href="data:image/png;base64,…"</td>
                    <td className="border border-border px-3 py-2">SVG filters referencing a raster image</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Canvas drawImage</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">img.src = "data:image/webp;base64,…"</td>
                    <td className="border border-border px-3 py-2">Dynamic canvas compositing</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">JSON API payload</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{"{ \"image\": \"data:image/png;base64,…\" }"}</td>
                    <td className="border border-border px-3 py-2">APIs that accept inline images (OpenAI Vision)</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">HTML email (cid alternative)</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">&lt;img src="data:image/gif;base64,…"&gt;</td>
                    <td className="border border-border px-3 py-2">Logo/signature that must display offline</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Size rule of thumb:</strong> Base64 inflates file size by ~33%. For images over 10 KB,
              a normal <code className="font-mono">&lt;img&gt;</code> with a cached URL is faster because the
              browser can cache individual resources.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Converter", path: "/tools/image-converter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Image to Base64 Converter</strong> is a fully private,
            browser-based tool that converts image files to Base64 encoded strings and Data URIs.
            All processing runs locally on your device using the browser's native FileReader API  ,
            your images never leave your computer. Supports <strong>JPG, PNG, WebP, and SVG</strong>  ,
            making it the fastest free way to encode images for HTML, CSS, and API use in 2026,
            with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}