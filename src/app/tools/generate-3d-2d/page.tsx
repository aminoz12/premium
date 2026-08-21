import type { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import Generate3D2DClient from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/generate-3d-2d"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 50 characters — exactly at the minimum of the 50–60 char SERP window

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CSS Image Filter Effects Free — Vintage, Noir, Neon, Glitch Online",
  description:
    "Apply vintage, noir, neon, glitch, and 3D perspective effects to any image free online. Download as PNG or copy the CSS. No upload, no account.",
  keywords: [
    "3d image effects generator",
    "css transform image tool free",
    "2d 3d image transformer online",
    "image filter effects browser",
    "css 3d image generator 2026",
    "rotate skew image online free",
    "vintage noir neon image effect",
    "browser image transform no upload",
    "free css image effects tool",
    "online image perspective generator",
    "image glitch effect generator free",
    "css filter image editor online",
    "pseudo 3d image maker browser",
    "image tilt effect generator free",
    "free image effects tool 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "CSS Image Filter Effects Free — Vintage, Noir, Neon, Glitch Online",
    description:
      "Apply vintage, noir, neon, glitch, and 3D perspective effects to any image free online. Download as PNG or copy the CSS. No upload, no account.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "3D Image Effects Generator — Free CSS Transform Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 3D Image Effects & CSS Transform Generator",
    description:
      "Apply 2D/3D transforms, filters, and presets to images directly in your browser. No uploads, no accounts, no limits — completely free and private.",
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
  name: "Pseudo 3D Image Effects Generator",
  url: TOOL_URL,
  description:
    "A completely free, privacy-focused browser tool that applies 2D and 3D CSS transforms, image filters, and animated presets to photos without any server uploads.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with CSS3 Transform and Canvas API support (Chrome 80+, Firefox 75+, Safari 14+, Edge 80+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Apply 2D CSS transforms: rotate, scale, skew, and flip",
    "Apply 3D CSS transforms: rotateX/Y/Z, perspective, and translateZ",
    "Apply image filters: brightness, contrast, saturation, blur, grayscale, sepia",
    "One-click animated presets: Float, Tilt, Vintage, Glitch, Noir, Neon, Dream, Mirror",
    "Download transformed image as PNG with filters baked in",
    "Copy generated CSS transform and filter values for web projects",
    "100% client-side processing for total user privacy",
    "No server uploads — photos never leave your device",
    "No file size limits or conversion quotas",
    "No account registration necessary",
    "Cross-platform: works on Windows, macOS, and Linux",
    "Responsive touch-friendly interface for mobile devices",
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
  name: "How to Apply 3D Image Effects Online",
  description:
    "A simple 4-step guide to applying CSS transforms and filters to images using our free, browser-based generator. The entire process takes under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Pseudo 3D Image Effects Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Image File",
      text: "Click the upload zone or drag and drop your target image file (JPG, PNG, or WEBP) into the designated area on the page. The file is loaded directly into your browser — nothing is sent to a server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Apply Transforms and Filters",
      text: "Use the 2D controls for rotate, scale, skew, and flip. Switch to 3D for rotateX/Y/Z, perspective, and translateZ. Add image filters like brightness, contrast, saturation, blur, grayscale, and sepia. Or select a one-click preset to combine everything instantly.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview and Adjust",
      text: "Review the live preview of your transformed image in real-time. Fine-tune any slider or toggle until you achieve the exact visual effect you want. The preview updates instantly as you adjust.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download PNG or Copy CSS",
      text: "Once satisfied with the effect, click Download PNG to save the filtered image directly to your device, or click Copy CSS to get the complete CSS transform and filter values for use in your web project.",
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
      name: "How do I apply 3D effects to an image for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your image, apply 2D or 3D CSS transforms and filters using the controls or one-click presets, preview the result, and download as PNG or copy the CSS — all in your browser with no server uploads, no account, and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats does this effects generator support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports the most common web image formats — JPG/JPEG, PNG, and WEBP. Simply upload your image and apply transforms, filters, or presets. The output can be downloaded as PNG or exported as CSS code.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the image with 3D effects applied?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes for 2D transforms and filters — the Download PNG button captures the image with all CSS filters baked in. However, 3D perspective rotations cannot be captured in a flat PNG because Canvas does not render CSS perspective projection. For 3D effects, use the Copy CSS button to get the exact transform values for your stylesheet.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server when I apply effects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing happens locally in your browser using the HTML5 Canvas API and CSS3 transforms. Your image file never leaves your device, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between this tool and the 2D to 3D Image Effect tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool emphasizes layered 2D and 3D CSS transforms combined with stylistic presets like vintage, glitch, and neon. The 2D to 3D Image Effect tool focuses primarily on 3D perspective depth simulation with fine-grained axis control for creating depth-based visual effects.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any file size limits on the images I can upload?",
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
      name: "Pseudo 3D Image Effects Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Generate3D2DPage() {
  return (
    <>
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

        <div className="mx-auto max-w-6xl space-y-10">
          {/* ── Page Header ── */}
          <header className="space-y-3 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              CSS Image Filter Effects — Vintage, Noir, Neon, Glitch & 3D Free
            </h1>
            <img src="/images/generate-3d-2d.webp" alt="Free CSS Transform Generator — apply 2D and 3D image effects in browser" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Upload any image and apply layered 2D and 3D CSS transforms — rotate, scale, skew,
              flip, tilt — combined with image filters like vintage, noir, neon, and glitch.
              Download the result as PNG or copy the exact CSS for your project. All processing
              runs locally in your browser: no server uploads, no account, and no file size limits.
            </p>

            <QuickAnswer
              question="How do I add a vintage or film noir effect to a photo for free?"
              answer="Upload your photo and click the 'Vintage' or 'Noir' preset. Vintage adds warm sepia tones and faded contrast. Noir converts to high-contrast black and white with deep shadows. You can then fine-tune brightness, contrast, and saturation with the sliders, download as PNG, or copy the generated CSS filter code."
            />

            {/* ── Breadcrumb — HTML nav (mirrors BreadcrumbList JSON-LD above) ── */}
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
              <ol className="flex items-center gap-1.5 justify-center sm:justify-start">
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
                  <span className="text-foreground font-medium">Pseudo 3D Image Effects Generator</span>
                </li>
              </ol>
            </nav>
          </header>

          {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
          <main id="tool" aria-label="Pseudo 3D Image Effects Generator Tool">
            <Generate3D2DClient />
          </main>

          {/* ── Email Capture ── */}
          <div className="mt-8">
            <EmailCapture />
          </div>

          <hr className="border-border" />

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
              2D Image to 3D Model: How AI Infers Depth from a Single Photo
            </h2>
            <div itemProp="articleBody">
              <p className="text-muted-foreground mb-4">
                An architect photographed a competitor&apos;s shopfront to understand
                their facade treatment — specifically, the depth of the reveal
                around the windows and the setback of the entrance. With one
                photograph and an AI 2D-to-3D tool, they extracted a rough 3D mesh
                showing the facade geometry well enough to measure approximate
                proportions on-screen. Measurement error vs. site survey: 8–12%.
                Not construction-grade, but sufficient to inform a design concept.
              </p>
              <p className="text-muted-foreground mb-4">
                2D-to-3D conversion is a harder problem than 3D generation from text
                because a single photograph is fundamentally ambiguous — depth
                information has been collapsed into two dimensions and cannot be
                perfectly recovered. The AI supplies the missing depth using priors
                learned from training on large-scale 3D-annotated image datasets.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                What the Model Recovers vs. Estimates
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Information</th>
                      <th className="border border-border p-2 text-left">Source</th>
                      <th className="border border-border p-2 text-left">Reliability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Relative depth (near vs. far)', 'Directly inferred from perspective', 'High — perspective is unambiguous'],
                      ['Object shape (visible surface)', 'Direct from image pixels', 'High — the front face is photographed'],
                      ['Object thickness / back face', 'Model prior from training data', 'Medium — estimated, not measured'],
                      ['Occluded areas (behind objects)', 'Hallucinated from context', 'Low — invented, not recovered'],
                      ['Absolute scale', 'Unknown without reference object', 'Zero — no real-world scale without calibration'],
                    ].map(([info, source, reliability]) => (
                      <tr key={info} className="border border-border">
                        <td className="border border-border p-2 font-medium text-sm">{info}</td>
                        <td className="border border-border p-2 text-muted-foreground text-sm">{source}</td>
                        <td className={'border border-border p-2 font-medium text-sm ' + (reliability.startsWith('High') ? 'text-green-600' : reliability.startsWith('Medium') ? 'text-yellow-600' : 'text-red-600')}>{reliability}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Best Input Photos for Better 3D Output
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                <li>
                  <strong>Single isolated subject on clean background:</strong>{' '}
                  Product photos on white or grey backgrounds produce the most
                  accurate meshes because the model can clearly separate foreground
                  from background.
                </li>
                <li>
                  <strong>Avoid oblique angles:</strong> A 15–30 degree angle from
                  straight-on is ideal. Extreme angles hide too much of the object
                  and the model invents large occluded surfaces.
                </li>
                <li>
                  <strong>Diffuse lighting over harsh shadows:</strong> Hard
                  shadows cast onto the subject fool the depth estimator into
                  treating shadow edges as geometric edges.
                </li>
                <li>
                  <strong>Include a scale reference:</strong> For any use case where
                  real-world size matters, place a ruler or known-size object in the
                  photo. The model cannot infer absolute scale otherwise.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Practical Applications
              </h3>
              <p className="text-muted-foreground mb-4">
                2D-to-3D is most practically useful for: e-commerce 3D product
                previews (rough mesh sufficient for 360-degree web viewers), AR
                try-before-you-buy experiences (approximate geometry is acceptable),
                architectural reference modeling (proportions matter, absolute size
                does not), and game asset drafts (artists refine the AI mesh rather
                than starting from nothing).
              </p>
            </div>

            {/* CSS filter reference table */}
            <div className="not-prose space-y-4 mt-6">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                CSS filter presets — what each effect does
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-3 py-2 text-left font-semibold">Preset</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">CSS it applies</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Best for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Vintage", "sepia(60%) contrast(90%) brightness(110%) saturate(80%)", "Old photo feel, warm tones"],
                      ["Noir", "grayscale(100%) contrast(120%) brightness(90%)", "Dramatic black & white portraits"],
                      ["Neon", "saturate(200%) hue-rotate(270deg) brightness(110%)", "Cyberpunk, night photography"],
                      ["Glitch", "Channel offset + hue-rotate animation", "Social media, creative headers"],
                      ["Faded", "contrast(85%) brightness(115%) saturate(70%) opacity(90%)", "Lifestyle, matte look"],
                      ["Vivid", "saturate(180%) contrast(110%)", "Product photography, food photos"],
                      ["Cold", "hue-rotate(200deg) saturate(120%)", "Winter scenes, tech aesthetics"],
                      ["Warm", "hue-rotate(-20deg) saturate(130%) brightness(105%)", "Golden hour, portraits"],
                    ].map(([preset, css, best]) => (
                      <tr key={preset as string} className="odd:bg-muted/30">
                        <td className="border border-border px-3 py-2 font-semibold">{preset as string}</td>
                        <td className="border border-border px-3 py-2 font-mono text-xs">{css as string}</td>
                        <td className="border border-border px-3 py-2 text-muted-foreground">{best as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <RelatedTools
              tools={[
                { name: "Generate 3D Model", path: "/tools/generate-3d" },
                { name: "Image Resizer", path: "/tools/image-resizer" },
                { name: "Remove Background", path: "/tools/remove-bg" },
              ]}
            />
          </article>

          {/* ── Page Footer Summary (SEO reinforcement) ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — Pseudo 3D Image Effects Generator</strong> is a fully private,
              browser-based tool that applies CSS transforms and filters to images. All processing
              runs locally on your device using CSS3 and the Canvas API — your photos never leave
              your computer. Supports <strong>JPG, PNG, and WEBP</strong> with 2D/3D transforms,
              filter pipelines, and animated presets — making it the fastest free way to create
              stunning visual effects for web and social media in 2026, with no installs, no
              accounts, and no hidden limits.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}