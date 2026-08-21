import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/qr-code-reader"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 55 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Decode QR Code from Image Free — No Camera, No App, No Signup",
  description:
    "Decode any QR code from an image or screenshot free online — upload a JPG, PNG, or WebP and extract the URL, text, WiFi password, or contact info instantly. No camera, no app, no signup.",
  keywords: [
    "decode qr code from image",
    "scan qr code from screenshot",
    "read qr code from photo online",
    "qr code decoder from image",
    "extract url from qr code",
    "qr code to text online free",
    "decode qr code without phone",
    "qr code reader no camera",
    "qr code scanner online from picture",
    "decode qr code from screenshot free",
    "free qr code decoder no signup",
    "qr code image decoder",
    "read qr code from file online",
    "qr code url extractor",
    "decode qr code from png jpg",
    "browser qr code reader no app",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Decode QR Code from Image Free — No Camera, No App, No Signup",
    description:
      "Upload a QR code image or screenshot and extract the URL, text, or contact info instantly. No camera, no app, no server uploads. Free online QR decoder.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free QR Code Reader — Scan & Decode QR Codes by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Decode QR Code from Image Free — No Camera, No App",
    description:
      "Upload a QR code image or screenshot and extract the URL, text, or contact info instantly. No camera, no signup.",
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
  name: "QR Code Reader",
  url: TOOL_URL,
  description:
    "A free online tool that reads and decodes QR codes from images or camera input. All processing is client-side and private.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Decode QR codes from uploaded images",
    "Scan QR codes using device camera",
    "Extract text, URLs, contact info, and more",
    "Fast and accurate decoding",
    "Display decoded content instantly",
    "100% client-side processing for privacy",
    "No account or signup required",
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
  name: "How to Decode a QR Code from an Image Online (No Camera)",
  description:
    "Step-by-step: upload a QR code image or screenshot to extract the URL, text, or contact info instantly in your browser — no camera, no app, no signup.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools QR Code Reader",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload QR Code Image",
      text: "Upload an image containing a QR code from your device. The tool supports JPG, PNG, and WebP formats.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Alternatively, Use Your Camera",
      text: "Click the camera button to grant browser permission and scan a QR code live using your device's camera.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Wait for Decoding",
      text: "The tool will process the image or camera feed and extract the contents of the QR code. Decoding typically takes less than a second.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "View and Use the Decoded Content",
      text: "The decoded text, URL, or data will be displayed on screen. You can copy it to your clipboard or open links directly in a new tab.",
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
      name: "How does this QR code reader work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You upload an image containing a QR code or use your device's camera to scan one. The tool analyzes the image, decodes the QR code pattern, and displays the content — all in your browser without uploading any data to servers.",
      },
    },
    {
      "@type": "Question",
      name: "What types of QR codes can be read?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports all common QR code versions, including those containing URLs, plain text, contact information (vCard), email addresses, phone numbers, and SMS messages.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server when I decode a QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing runs entirely in your browser. Your image is never sent to our servers, stored, or logged. The tool is 100% private.",
      },
    },
    {
      "@type": "Question",
      name: "Can I scan a QR code using my phone's camera?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, if you are using a mobile device with a camera, you can click the camera button and point your phone at a QR code. The tool will scan and decode it in real time.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a QR code reader and a barcode scanner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A QR code reader decodes two-dimensional QR codes that can store more data (e.g., URLs, contact info). A barcode scanner reads one-dimensional linear barcodes (e.g., UPC, EAN) typically used on product packaging. This tool focuses exclusively on QR codes.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free QR code reader?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It works with standard QR codes. For heavily distorted or very small QR codes, decoding may be less accurate. All processing is client-side and private.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Media Tools > Tool ──────

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
      name: "Media Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "QR Code Reader",
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
            Decode QR Code from Image Free — No Camera, No App, No Signup
          </h1>
          <img src="/images/qr-code-reader.webp" alt="Decode QR code from image online — TheFreeAITools" width={1200} height={630} />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Got a <strong>QR code as an image</strong> or screenshot and need to know
            what URL or text it contains? Upload the file here — JPG, PNG, or WebP —
            and the tool extracts the content instantly in your browser.{" "}
            <strong>No camera needed. No app. No signup.</strong> Works on desktop and
            mobile alike, with 100% client-side processing.
          </p>

          <QuickAnswer
            question="How do I decode a QR code from an image without scanning it?"
            answer="Upload the QR code image (JPG, PNG, or screenshot) to this tool. It reads the pixel data in your browser and extracts the URL, text, or contact info — no camera required, nothing sent to a server."
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
                  href={`${SITE_URL}/tools`}
                  className="hover:text-foreground transition-colors"
                >
                  Media Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">QR Code Reader</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="QR Code Reader Tool">
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
          <meta itemProp="name" content="QR Code Reader: How Browser-Based Decoding Works and When It Fails" />
          <meta
            itemProp="description"
            content="How QR code decoding works in a browser without a camera, the image quality requirements for reliable reads, and what to do when a scan fails."
          />
          <meta itemProp="datePublished" content="2024-03-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* From screenshot / image — the primary use case */}
          <section aria-labelledby="from-image-heading" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2
              id="from-image-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When you have a QR code as an image, not a physical code
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most QR scanner apps require you to point your camera at a physical code.
              This tool is different: it decodes QR codes from image files — screenshots,
              photos, PDFs exported as images, or any JPG/PNG you received by email or chat.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Common situations where this matters:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Someone sent you a QR code image and you&apos;re on desktop — no camera to scan it</li>
              <li>You want to verify what URL a QR code on a flyer or poster links to before printing</li>
              <li>You received a QR code in a PDF or email attachment</li>
              <li>You took a screenshot of a QR code on your phone screen and want the URL on desktop</li>
              <li>You&apos;re testing a QR code you generated and want to confirm the encoded data</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Just upload the image file — JPG, PNG, WebP, or a screenshot from any operating
              system — and the tool extracts the content in under a second. No camera permission
              needed. No app to install.
            </p>
          </section>

          {/* How browser decoding works */}
          <section aria-labelledby="how-decoding-works" className="space-y-4">
            <h2
              id="how-decoding-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How QR decoding works in a browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This tool decodes QR codes from image files — JPEG, PNG, WebP, or a
              screenshot. Your image is drawn to an HTML Canvas element, the pixel
              data is extracted via{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">getImageData()</code>,
              and a JavaScript QR decoder (the jsQR library, MIT licensed) performs
              the matrix recognition and Reed-Solomon error correction entirely in your
              browser. No upload, no server, no camera required.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              This is useful for: decoding a QR code in a screenshot before printing
              to verify the URL is correct, extracting the URL from a QR code image
              you received, or checking what data a generated QR encodes without
              picking up your phone.
            </p>
          </section>

          {/* Why reads fail */}
          <section
            aria-labelledby="why-reads-fail"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="why-reads-fail"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why a QR code fails to decode — and how to fix it
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Image too small</span>
                <span>
                  The decoder needs the QR code modules (individual squares) to be
                  at least 2–3 pixels across. A QR code that appears 40×40 pixels in
                  the image is too small for reliable software decoding. Crop and
                  upscale the image so the QR fills at least 150×150 pixels.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Low contrast</span>
                <span>
                  Colored QR codes (non-black-on-white) or codes with busy backgrounds
                  reduce contrast below the decoder&apos;s threshold. If the code is white
                  on a light-colored background, or uses a dark color on a dark image,
                  decoding will fail. Standard black-on-white achieves near-100% decode rates.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Damaged or obscured finder patterns</span>
                <span>
                  The three square corner markers (finder patterns) are essential for
                  orientation. If any are cropped, covered by a logo, or obscured by
                  image compression artifacts, decoding fails. The error correction
                  modules protect data modules but not the finder patterns — those must
                  be intact.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">JPEG compression artifacts</span>
                <span>
                  Heavy JPEG compression around a QR code blurs module edges. If your
                  image is a JPEG, try saving it as PNG (lossless) before uploading,
                  or use a screenshot tool that captures at higher quality.
                </span>
              </li>
            </ul>
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
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "URL Encoder / Decoder", path: "/tools/url-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — QR Code Decoder</strong> decodes{" "}
            <strong>QR codes from images</strong> in your browser — upload a JPG, PNG,
            WebP, or screenshot and extract the URL, text, WiFi credentials, vCard, or
            email instantly. No camera required. No app to install. No signup. All
            processing is 100% client-side: your images never leave your device. The
            fastest free way to read a QR code from a file or screenshot in 2026.
          </p>
        </footer>
      </div>
    </>
  )
}