import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/image-resizer"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 46 characters — well within the 50–60 char SERP window

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Resize Image for Instagram Free — Social Media Sizes, No Upload",
  description:
    "Resize images to exact Instagram, LinkedIn, and Twitter dimensions free online — 1080×1080, 1080×1920, 1200×627, and more. No upload to servers, no signup, instant download.",
  keywords: [
    "resize image for instagram free",
    "resize image for linkedin free",
    "resize image for twitter free",
    "instagram image size resizer online",
    "resize photo to 1080x1080 free",
    "resize image for instagram story free",
    "social media image resizer free",
    "resize image to exact dimensions free",
    "image resizer no upload",
    "resize image for linkedin profile picture",
    "resize photo online free no signup",
    "resize image for facebook free",
    "resize jpg png webp free browser",
    "crop and resize image for instagram free",
    "image resizer for social media 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Image Resizer — Online Photo Resizer Tool",
    description:
      "Instantly resize any image to exact pixel dimensions directly in your browser. 100% client-side processing means your photos never leave your device. Supports JPG, PNG, WebP, and GIF — no account required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Image Resizer — Online Photo Resizer Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image Resizer & Photo Dimension Tool",
    description:
      "Resize JPG, PNG, WebP, or GIF files to exact dimensions directly in your browser. No uploads, no accounts, no limits — completely free and private.",
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
  name: "Image Resizer",
  url: TOOL_URL,
  description:
    "A completely free, privacy-focused browser tool that resizes image files (JPG, PNG, WebP, GIF) to custom pixel dimensions without any server uploads or quality loss.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with HTML5 Canvas API support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Resize JPG, PNG, WebP, and GIF images to exact custom dimensions",
    "Maintain original aspect ratio with optional lock/unlock toggle",
    "Choose between pixel-perfect resizing or percentage-based scaling",
    "Preview resized image in real-time before downloading",
    "100% client-side processing for total user privacy",
    "No server uploads — photos never leave your device",
    "No file size limits or conversion quotas",
    "No account registration necessary",
    "Cross-platform: works on Windows, macOS, and Linux",
    "Download resized images in original format or convert to PNG/JPG",
    "Batch resize multiple images simultaneously",
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
  name: "How to Resize an Image Online",
  description:
    "A simple 4-step guide to resizing any image file to your desired dimensions using our free, browser-based resizer. The entire process takes under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Image Resizer",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Image File",
      text: "Click the upload zone or drag and drop your target image file (JPG, PNG, WebP, or GIF) into the designated area on the page. The file is loaded directly into your browser — nothing is sent to a server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Set Your Target Dimensions",
      text: "Enter your desired width and height in pixels, or use the percentage slider to scale proportionally. Toggle the aspect ratio lock to maintain the original proportions and prevent distortion.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview and Adjust",
      text: "Click the 'Resize' button to generate a real-time preview of your resized image. Review the output quality and dimensions, and make further adjustments if needed before finalizing.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Resized Image",
      text: "Once satisfied with the preview, click the download button to save your resized image directly to your device. Choose to keep the original format or convert to PNG or JPG. Your original file is not altered.",
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
      name: "How do I resize an image for free online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your image file using this browser-based resizer. It processes the file locally on your device, scales it to your chosen dimensions, and lets you download the result — no server uploads, no account, and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats can I resize?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports the most common web image formats, including JPG/JPEG, PNG, WebP, and GIF. Simply upload your image, set your target dimensions, and the resizer will process it while preserving visual quality.",
      },
    },
    {
      "@type": "Question",
      name: "Can I resize an image without losing quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When downsizing (making an image smaller), the tool uses high-quality bicubic resampling to maintain sharpness and clarity. For upscaling, the tool applies intelligent interpolation, though enlarging beyond the original resolution will always introduce some softness. For best results, always start from the highest resolution source available.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server when I resize it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing happens locally in your browser using the HTML5 Canvas API and native JavaScript image manipulation. Your image file never leaves your device, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between resizing and compressing an image?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Resizing changes the physical pixel dimensions of an image — for example, converting a 4000×3000 photo to 800×600 for web use. Compression reduces the file size without changing dimensions by removing redundant data or lowering quality. This tool performs resizing; you can then use our separate Image Compressor tool to further reduce file size if needed.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any file size limits on the image I can upload?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Because all processing happens inside your browser and no file is uploaded to our servers, we do not impose any artificial file size limits. The only practical limit is your device's available RAM, which can comfortably handle most standard image files.",
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
      name: "Image Resizer",
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
            Resize Image for Instagram Free — Social Media Sizes, No Upload
          </h1>
          <img src="/images/image-resizer.webp" alt="Resize image for Instagram, LinkedIn, Twitter — free online resizer, no upload" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Need to resize a photo to <strong>1080×1080 for an Instagram post</strong>, 1080×1920
            for a Story, or 1200×627 for LinkedIn? Enter the target dimensions, download instantly.
            Works for all social media sizes — JPG, PNG, WebP, GIF supported.{" "}
            <strong>No upload to any server. No signup. No watermark.</strong>
          </p>

          <QuickAnswer
            question="What size should I resize my image for Instagram?"
            answer="Instagram square post: 1080×1080 px. Instagram Story or Reel: 1080×1920 px. Instagram landscape post: 1080×566 px. Enter your target dimensions in the resizer — the tool runs in your browser, no upload needed."
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
                  Media Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Image Resizer</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Image Resizer Tool">
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
          <meta itemProp="name" content="Image Resizer: Common Dimensions for Web, Social, and Print" />
          <meta
            itemProp="description"
            content="A reference table for the image dimensions that actually matter, why upscaling degrades quality, and when browser-side resizing is enough vs. when to use a build pipeline."
          />
          <meta itemProp="datePublished" content="2024-02-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Social media sizes — primary section */}
          <section aria-labelledby="social-media-sizes" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2
              id="social-media-sizes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Exact image sizes for every social media platform (2026)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform &amp; format</th>
                    <th className="border border-border p-2 text-left font-semibold">Recommended size</th>
                    <th className="border border-border p-2 text-left font-semibold">Aspect ratio</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Instagram — square post", "1080×1080 px", "1:1", "Displayed at 510×510 in feed; upload at 1080 for crisp retina"],
                    ["Instagram — portrait post", "1080×1350 px", "4:5", "Maximum vertical space in feed — more engagement than square"],
                    ["Instagram — landscape post", "1080×566 px", "1.91:1", "Minimum 1080×566; cropped to this if wider"],
                    ["Instagram — Story / Reel", "1080×1920 px", "9:16", "Full-screen vertical; keep main content in center 1080×1420"],
                    ["Instagram — profile photo", "320×320 px", "1:1", "Displayed as circle; keep face/logo centered"],
                    ["LinkedIn — post / share image", "1200×627 px", "1.91:1", "Also correct size for og:image link preview"],
                    ["LinkedIn — profile photo", "400×400 px", "1:1", "Minimum 200×200; 400×400 recommended"],
                    ["LinkedIn — cover / banner", "1584×396 px", "4:1", "Displayed at narrower widths on mobile — keep text centered"],
                    ["Twitter / X — post image", "1200×675 px", "16:9", "summary_large_image card; side-by-side posts use 600×335"],
                    ["Twitter / X — profile photo", "400×400 px", "1:1", "Displayed as circle"],
                    ["Twitter / X — header image", "1500×500 px", "3:1", "Cropped on mobile — keep key content in center"],
                    ["Facebook — post image", "1200×630 px", "1.91:1", "Also used for link preview og:image"],
                    ["Facebook — story", "1080×1920 px", "9:16", "Same as Instagram Story"],
                    ["YouTube — thumbnail", "1280×720 px", "16:9", "Minimum 640×360; 1280×720 recommended for HiDPI"],
                    ["Pinterest — pin", "1000×1500 px", "2:3", "Taller pins get more feed space; 1:2.1 is max ratio"],
                  ].map(([platform, size, ratio, notes]) => (
                    <tr key={String(platform)}>
                      <td className="border border-border p-2 font-medium text-sm">{platform}</td>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground text-xs">{ratio}</td>
                      <td className="border border-border p-2 text-muted-foreground text-xs">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the target width and height from this table into the resizer above, upload your
              photo, and download. All resizing runs in your browser — no upload, no signup.
            </p>
          </section>

          {/* Dimension reference */}
          <section aria-labelledby="dimension-ref" className="space-y-4">
            <h2
              id="dimension-ref"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Common image dimensions by use case
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Use case</th>
                    <th className="border border-border p-2 text-left font-semibold">Recommended size</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Blog hero image', '1200×630 px', 'Also works as og:image for social sharing'],
                    ['Twitter/X post image', '1200×675 px (16:9)', 'summary_large_image card'],
                    ['LinkedIn post image', '1200×627 px', 'Appears as link preview thumbnail'],
                    ['Instagram square post', '1080×1080 px', 'Displayed at 510×510 in feed'],
                    ['Instagram story', '1080×1920 px (9:16)', 'Fills full screen vertically'],
                    ['Product thumbnail (e-commerce)', '800×800 px', 'Square, consistent grid appearance'],
                    ['Avatar / profile photo', '400×400 px', 'Downscaled to 40–80px on most UIs'],
                    ['Full-screen background', '1920×1080 px', 'HiDPI: 2560×1440 for retina'],
                  ].map(([useCase, size, notes]) => (
                    <tr key={useCase}>
                      <td className="border border-border p-2 text-muted-foreground">{useCase}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Upscaling quality note */}
          <section
            aria-labelledby="upscaling"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="upscaling"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why upscaling always degrades quality
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Resizing a 400×400 image to 1200×1200 doesn&apos;t add detail — it interpolates
              pixels, producing a blurry result. This is a hard constraint of raster
              images: information destroyed during capture or prior downscaling cannot be
              recovered by resizing. The browser Canvas API uses bilinear interpolation
              by default, which produces smoother edges than nearest-neighbor but still
              blurs high-contrast detail.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For logos and icons that need to scale up cleanly, use SVG — a vector
              format that renders at any size without quality loss. This tool handles
              raster images (JPEG, PNG, WebP). If your source image looks blurry after
              upscaling, the only real fix is to obtain a higher-resolution source.
            </p>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Browser resizing vs. server-side pipeline
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This tool resizes your image locally using an HTML Canvas element — no
              upload, no server, instant preview. It&apos;s the right choice for one-off
              resizing tasks. For a website that needs to serve responsive images at
              multiple breakpoints automatically, use a build pipeline: Next.js Image
              component,{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">sharp</code>{' '}
              in Node.js, or an image CDN (Cloudinary, Imgix). These generate all
              sizes at build/request time and serve the appropriate size via{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">srcset</code>{' '}
              — saving bandwidth and improving Core Web Vitals automatically.
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
                  { name: "Image Converter", path: "/tools/image-converter" },
                  { name: "Favicon Generator", path: "/tools/favicon-generator" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Image Resizer</strong> is a fully private, browser-based tool
            that resizes image files to custom pixel dimensions. All processing runs locally on your
            device using the browser's native Canvas API — your photos never leave your computer.
            Supports <strong>JPG, PNG, WebP, and GIF</strong> — making it the fastest free way to
            resize images for web, social media, and print use in 2026, with no installs, no
            accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}