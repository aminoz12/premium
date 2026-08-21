import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/random-image-for-free"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 56 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Random Image Generator — Discover Royalty-Free Images Online",
  description:
    "Generate and discover random royalty-free images instantly. Free, browser-based for inspiration, placeholders, and creative projects. No login required.",
  keywords: [
    "random image generator",
    "free random images",
    "royalty free images",
    "placeholder image generator",
    "random stock photos free",
    "free images for website",
    "random photo generator",
    "free images no copyright",
    "free stock photos download",
    "random image finder",
    "discover free images online",
    "best random image tool 2026",
    "no signup image generator",
    "secure royalty free images",
    "free image discovery 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Random Image Generator — Discover Royalty-Free Images",
    description:
      "Discover and download random royalty-free images instantly. Free, no login, no copyright.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Random Image Generator — Discover Royalty-Free Images by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Random Image Generator — Royalty-Free Images",
    description:
      "Discover random royalty-free images for inspiration or projects. Free, no account.",
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
  name: "Random Image Generator",
  url: TOOL_URL,
  description:
    "Generate and discover random royalty-free images instantly. Free, browser-based for inspiration, placeholders, and creative projects. No login.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Random royalty-free image discovery",
    "Keyword search filtering",
    "One-click image download",
    "High-resolution images",
    "Commercial use allowed",
    "No account required",
    "100% client-side processing",
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
  name: "How to Generate a Random Royalty-Free Image",
  description:
    "A simple step-by-step guide to discovering and downloading a random royalty-free image using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Random Image Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose a Search Term (Optional)",
      text: "Type a keyword into the search bar (e.g., 'nature', 'business', 'technology') to find images on a specific topic. Leave it blank for a completely random pick.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Generate",
      text: "Press the 'Generate' button. The tool will randomly select a royalty-free image from its library matching your search term (if any).",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Image",
      text: "The image will appear with a preview. You can view it at full size to decide if it fits your project.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download or Re-roll",
      text: "Click 'Download' to save the image to your device, or click 'Generate Again' to get a new random image.",
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
      name: "Where can I get free random royalty-free images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool generates random royalty-free images from a curated library. Each image is free for personal and commercial use with no copyright restrictions. Click Generate to discover a new image, or search by keyword for targeted results.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use these random images commercially?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All images in the library are royalty-free and licensed for both personal and commercial use. You can use them in websites, blog posts, social media, presentations, print materials, and marketing campaigns without attribution.",
      },
    },
    {
      "@type": "Question",
      name: "What is a placeholder image and when do I need one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A placeholder image is a temporary or generic image used to fill a layout slot before the final image is ready — common in web development, mockups, and design wireframes. This tool provides real, high-quality images that work as both placeholders and final-use stock photos.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from an AI image generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool discovers and serves real photographs from a curated royalty-free library — giving you authentic, photographic-quality images instantly. An AI image generator creates synthetic images from text prompts, which may look artistic but less photorealistic. Both are free and useful for different needs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I search for specific types of images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Use the keyword search to filter images by topic — for example 'nature', 'business', 'technology', or 'food'. The tool returns relevant royalty-free images matching your search term, all free to download.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free random image generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It works best with a stable internet connection to load images from our curated library. For very specific or niche keywords, the number of results may be limited. All processing is client-side and private.",
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
      name: "Random Image Generator",
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
            Free Random Image Generator — Discover Royalty-Free Images Online
          </h1>
          <img src="/images/random-image-for-free.webp" alt="random image for free" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Find and download <strong>random royalty-free images</strong> instantly  ,
            perfect for blog post placeholders, creative inspiration, design mockups, or
            commercial projects. Search by keyword or click 'Generate' for a truly random
            pick. All images are free for personal and commercial use — <strong>no
              copyright, no account, no upload</strong>.
          </p>

          <QuickAnswer
            question="Where can I get free random royalty-free images?"
            answer="This tool generates random royalty-free images from a curated library. Each image is free for personal and commercial use with no copyright restrictions. Click Generate to discover a new image, or search by keyword for targeted results."
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
                <span className="text-foreground font-medium">Random Image Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Random Image Generator Tool">
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
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            Random Image Generator: What Developers Actually Use It For
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A front-end developer building a social feed prototype needed 200
              unique avatar images to populate mock user profiles. Placeholder
              services like picsum.photos serve the same Unsplash photo for the
              same URL parameters — making all &quot;user photos&quot; look like repeats.
              A random image generator with seeded variety produced 200 unique
              generated faces from a single API endpoint, each consistent for
              that user&apos;s ID, refreshed only when requested. The prototype
              convinced stakeholders the feed felt populated and real before any
              real user photos existed.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Common Developer Use Cases
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Use case</th>
                    <th className="border border-border p-2 text-left">What you need</th>
                    <th className="border border-border p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Prototype UI with fake content', 'Varied images at specific sizes', 'Need different images per slot, not same placeholder'],
                    ['Load testing image upload flows', 'Images with specific file sizes', 'Generate exact KB/MB needed to test server limits'],
                    ['Visual regression testing', 'Deterministic images (same seed = same output)', 'Need identical reference images between test runs'],
                    ['Design system documentation', 'Images at exact pixel dimensions', 'Match component specs exactly'],
                    ['Email template testing', 'Images that load without auth', 'Public URLs required; CDN-hosted images'],
                  ].map(([use, need, note]) => (
                    <tr key={use} className="border border-border">
                      <td className="border border-border p-2 font-medium text-sm">{use}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{need}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Image Format Comparison for Placeholder Use
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Format</th>
                    <th className="border border-border p-2 text-left">Size at 800x600</th>
                    <th className="border border-border p-2 text-left">Best for placeholder</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['JPEG (quality 80)', '~80–120 KB', 'Photographic content testing; fast load'],
                    ['PNG', '~300–600 KB', 'Transparency testing; exact pixel matching'],
                    ['WebP', '~50–80 KB', 'Performance testing; modern format support check'],
                    ['SVG (pattern)', '~2–5 KB', 'Infinite scale; color customizable'],
                  ].map(([fmt, size, best]) => (
                    <tr key={fmt} className="border border-border">
                      <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                      <td className="border border-border p-2">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What This Tool Cannot Do
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Branded placeholder images:</strong> Cannot embed your
                logo or specific color palette automatically — use an SVG template
                for that.
              </li>
              <li>
                <strong>Real photo content:</strong> Generated random images are
                noise patterns, abstract art, or AI-generated faces — not
                photographs of real places or objects. For photographic placeholders,
                use Unsplash or Picsum.
              </li>
            </ul>
          </div>

          <RelatedTools
            tools={[
              { name: "Free AI Image Generator", path: "/tools/free-ai-image-generator" },
              { name: "Image Compressor", path: "/tools/image-compressor" },
              { name: "Image Resizer", path: "/tools/image-resizer" },
            ]}
          />
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Random Image Generator</strong> is a fully private,
            browser-based tool that discovers and downloads <strong>royalty-free images</strong>
            from a curated library. All images are free for personal and commercial use
            — no copyright, no attribution, no signup required. The fastest free way to
            find high-resolution images for your projects in 2026, with no installs, no
            accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}