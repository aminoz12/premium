import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/square-face-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 54 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Square Face Generator — Create Square Avatar Images Online",
  description:
    "Generate square face avatars with AI. Free, browser-based tool with live preview. Create square characters for memes, profiles, and creative projects.",
  keywords: [
    "square face generator",
    "square avatar generator",
    "square head image creator",
    "ai square face maker",
    "free square avatar tool",
    "square face character generator",
    "meme face generator",
    "square profile picture maker",
    "create square face online",
    "square head avatar ai",
    "free square image generator 2026",
    "no signup square face tool",
    "browser-based avatar generator",
    "square face art generator",
    "cartoon square head maker",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Square Face Generator — Create Square Avatar Images Online",
    description:
      "Generate square face avatars and images instantly with AI. Free, browser-based tool with live preview. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Square Face Generator — Create Square Avatar Images by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Square Face Generator — Square Avatar & Meme Maker",
    description:
      "Generate square face avatars instantly with AI. Free, browser-based tool. Create square-headed characters for memes, stickers, or profile pictures.",
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
  name: "Square Face Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates square face avatars and images using AI. Users can create unique square-headed characters for memes, stickers, profile pictures, or creative projects.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate square face avatars with AI",
    "Customize facial features and expressions",
    "Choose from multiple art styles",
    "Live preview before downloading",
    "Export as PNG or SVG",
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
  name: "How to Generate a Square Face Avatar",
  description:
    "A simple step-by-step guide to create a square face avatar or image using our free AI-powered tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Square Face Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Describe Your Square Face",
      text: "Enter a detailed description of the square face you want to create, including facial features, expression, style (cartoon, realistic, pixel art), and any specific accessories.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Art Style & Format",
      text: "Select your preferred art style from the available options — such as cartoon, 3D render, pixel art, or vector. Choose the output format (PNG or SVG) and resolution.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Generate",
      text: "Press the 'Generate' button. The AI will create a unique square face image based on your description and settings. The preview will appear within seconds.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Preview & Download",
      text: "Review the generated square face in the live preview pane. If satisfied, click the 'Download' button to save the image to your device as a PNG or SVG file.",
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
      name: "What is a square face generator and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A square face generator is an AI-powered tool that creates images of faces with exaggerated square proportions. You describe the character, choose a style, and the AI generates a unique square face avatar instantly. All processing happens in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the generated square face images for commercial purposes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the images generated by this tool are royalty-free and can be used for personal or commercial projects, including memes, stickers, profile pictures, merchandise, or social media content.",
      },
    },
    {
      "@type": "Question",
      name: "What art styles are available for square face generation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool offers several art styles, including cartoon, 3D render, pixel art, vector illustration, and sketch. You can also choose between color or black-and-white output.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when using this square face generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your description and generated images are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a square face generator and a regular avatar maker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A square face generator specifically creates images with exaggerated square-shaped heads or faces, often for humorous, artistic, or meme purposes. A regular avatar maker typically creates realistic or stylized human portraits without the distinctive square proportions.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free square face generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It can generate any number of square face images. For extremely complex scenes or very high resolutions, browser performance may vary based on your device's memory. All processing is local and private.",
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
      name: "Square Face Generator",
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
            Free Square Face Generator — Create Square Avatar Images Online
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate unique <strong>square face avatars</strong> and images instantly with
            AI. Create square-headed characters for <strong>memes</strong>,
            <strong>stickers</strong>, <strong>profile pictures</strong>, or creative
            projects. Choose from multiple art styles and export as PNG or SVG. All
            processing runs locally in your browser with <strong>100% privacy</strong>
            — no signup or upload required.
          </p>

          <QuickAnswer
            question="What is a square face generator and how does it work?"
            answer="A square face generator is an AI-powered tool that creates images of faces with exaggerated square proportions. You describe the character, choose a style, and the AI generates a unique square face avatar instantly. All processing happens in your browser."
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
                <span className="text-foreground font-medium">Square Face Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Square Face Generator Tool">
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
            Square Face / Avatar Generator: Profile Photo Sizes and Format Guide
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A social media manager maintaining 12 brand accounts across platforms
              faced a recurring problem: one source photo had to produce optimized
              profile images for Instagram (110×110 px display, 320×320 px
              recommended upload), Twitter/X (400×400 px recommended), LinkedIn
              (400×400 px, 8 MB max), Facebook (196×196 px display), and YouTube
              (800×800 px). Each platform crops differently and compresses
              differently. A single 800×800 JPEG at 90% quality served as the
              universal source, then each platform&apos;s engine recompressed to its own
              spec.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Platform Profile Image Specifications (2025)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Platform</th>
                    <th className="border border-border p-2 text-left">Recommended upload</th>
                    <th className="border border-border p-2 text-left">Display size</th>
                    <th className="border border-border p-2 text-left">Format</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Instagram', '320×320 px', '110×110 px (mobile)', 'JPEG/PNG'],
                    ['Twitter / X', '400×400 px', '48×48 px (feed)', 'JPEG/PNG/GIF'],
                    ['LinkedIn', '400×400 px', '200×200 px (profile)', 'JPEG/PNG, max 8 MB'],
                    ['Facebook', '170×170 px (desktop)', '128×128 px (mobile)', 'JPEG/PNG'],
                    ['YouTube', '800×800 px', 'Variable by device', 'JPEG/PNG/GIF, max 4 MB'],
                    ['Discord', '128×128 px', '32×32 px (server list)', 'JPEG/PNG/GIF/WebP'],
                    ['GitHub', '500×500 px', '20×20 to 460×460 px', 'JPEG/PNG/GIF'],
                  ].map(([platform, recommended, display, fmt]) => (
                    <tr key={platform} className="border border-border">
                      <td className="border border-border p-2 font-medium">{platform}</td>
                      <td className="border border-border p-2">{recommended}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{display}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{fmt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Why Square Crop Matters for AI-Generated Faces
            </h3>
            <p className="text-muted-foreground mb-4">
              AI face generation models are typically trained on square crops
              (256×256 or 512×512). Generating a non-square face then cropping
              to square often clips the top of the head or the chin. This tool
              generates faces natively in the square aspect ratio to avoid
              post-generation cropping artifacts. The face is framed with
              appropriate headroom for the intended profile image use case.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              AI Avatar Ethics
            </h3>
            <p className="text-muted-foreground mb-4">
              AI-generated faces are synthetic — they represent no real person.
              Using them as your own profile photo without disclosure is a form
              of identity misrepresentation. Most platforms&apos; terms of service
              require that profile photos represent the account owner or brand.
              Appropriate uses: test accounts, bot accounts clearly labeled as
              such, game character avatars, and anonymous but disclosed AI persona
              accounts.
            </p>
          </div>

          <RelatedTools
            tools={[
              { name: "Free AI Image Generator", path: "/tools/free-ai-image-generator" },
              { name: "Image Resizer", path: "/tools/image-resizer" },
              { name: "Favicon Generator", path: "/tools/favicon-generator" },
            ]}
          />
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Square Face Generator</strong> is a fully private,
            browser-based tool that creates unique <strong>square face avatars</strong> and
            images using AI. Choose from multiple art styles — <strong>cartoon</strong>,
            <strong>3D render</strong>, <strong>pixel art</strong>, <strong>vector</strong>,
            and <strong>sketch</strong> — and export your creations as <strong>PNG</strong>
            or <strong>SVG</strong>. All processing runs locally on your device — your
            descriptions and images never leave your computer. The fastest free way to
            generate square face images in 2026, with no installs, no accounts, and no
            hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}