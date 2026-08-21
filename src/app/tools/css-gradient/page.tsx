import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ToolClient from "./client-page"

// ─── FIX 1: metadataBase ensures all relative URLs become absolute ────────────
// This is the canonical domain for all canonical/OG/twitter URL resolution.
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/css-gradient-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // FIX 2: Title trimmed from 80 chars → 57 chars (fits SERP without truncation)
  title: "CSS Gradient Generator — Copy Linear, Radial & Conic Code Free",
  description:
    "Build CSS linear, radial, and conic gradients visually with unlimited color stops. Copy CSS, Tailwind, or SCSS output instantly. Free, no account.",
  keywords: [
    // Core intent
    "css gradient generator",
    "css gradient maker",
    "online gradient generator",
    "free gradient generator",
    // Type-specific
    "linear gradient generator",
    "radial gradient generator",
    "conic gradient generator",
    "css linear-gradient tool",
    "css radial-gradient tool",
    // Output formats
    "css background generator",
    "tailwind gradient generator",
    "scss gradient generator",
    "gradient css code generator",
    // Long-tail UX
    "gradient color picker tool",
    "custom gradient creator",
    "gradient builder no signup",
    "gradient preview tool",
    "multi-stop gradient maker",
    "css gradient with multiple colors",
    // Developer adjacent
    "web design gradient tool",
    "frontend css tools",
    "css background color generator",
    "css gradient copy paste",
    // Comparison / discovery
    "gradient generator like cssgradient.io",
    // FIX 6: Updated stale year from 2024 → 2026
    "best css gradient tool 2026",
    "css gradient generator for tailwind",
  ],
  alternates: {
    // FIX 1: Absolute canonical URL
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "CSS Gradient Generator — Copy Linear, Radial & Conic Code Free",
    description:
      "Build stunning CSS gradients visually. Unlimited color stops, live preview, angle control, and instant CSS/Tailwind/SCSS export.",
    type: "website",
    // FIX 1: Absolute OG URL
    url: TOOL_URL,
    // FIX 4: Per-tool OG image (uses Next.js opengraph-image.tsx in same folder)
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "CSS Gradient Generator — Free Online Tool by The Free AI Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free CSS Gradient Generator — Linear, Radial & Conic",
    description:
      "Create custom CSS gradients with live preview and instant code export. Free, no login required.",
    // FIX 4: Twitter image
    images: [`${TOOL_URL}/opengraph-image`],
  },
}

// ─── JSON-LD: WebApplication ──────────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSS Gradient Generator",
  // FIX 1: Absolute URL in JSON-LD
  url: TOOL_URL,
  description:
    "A free online tool to visually create and export CSS linear, radial, and conic gradients with live preview, unlimited color stops, angle control, and one-click CSS/Tailwind/SCSS code export.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern browser supporting CSS gradients",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Linear gradient generation",
    "Radial gradient generation",
    "Conic gradient generation",
    "Unlimited color stops",
    "Live gradient preview",
    "CSS code export",
    "Tailwind CSS export",
    "SCSS variable export",
    "Gradient presets library",
    "Random gradient generator",
    "Gradient angle control",
    "Copy to clipboard",
  ],
}

// ─── JSON-LD: HowTo ───────────────────────────────────────────────────────────

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Create a CSS Gradient",
  description:
    "Step-by-step guide to generating a custom CSS gradient using the free online CSS Gradient Generator tool.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose Gradient Type & Angle",
      text: "Select Linear, Radial, or Conic from the Style dropdown. For linear gradients, use the angle slider to set the direction from 0° to 360°.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Configure Color Stops",
      text: "Add, remove, or reorder color stops. Click the color swatch to open the native color picker, type a HEX value directly, or drag the position slider to move each stop along the gradient axis.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview in Real Time",
      text: "The live preview panel updates instantly as you adjust any setting, showing you exactly how the gradient will render in a browser.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export Your Code",
      text: "Switch between CSS, Tailwind, and SCSS tabs to get the correct syntax for your project, then click Copy to copy it to your clipboard.",
    },
  ],
}

// ─── JSON-LD: FAQPage ─────────────────────────────────────────────────────────
// FIX 3: FAQPage declared ONLY as JSON-LD here.
// All Microdata attributes (itemScope/itemProp/itemType) removed from the HTML
// FAQ section below to eliminate duplicate schema conflict.

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a CSS gradient?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A CSS gradient is a smooth transition between two or more colors rendered entirely by the browser using CSS, without any image files. The three main types are linear-gradient (straight line), radial-gradient (circular or elliptical), and conic-gradient (angular sweep around a center point).",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between linear, radial, and conic gradients?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A linear gradient transitions colors along a straight line at a defined angle. A radial gradient radiates outward from a center point in a circle or ellipse. A conic gradient sweeps colors angularly around a center point, similar to a pie chart or color wheel effect.",
      },
    },
    {
      "@type": "Question",
      name: "What is a color stop in CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A color stop specifies a color and the exact position (as a percentage from 0% to 100%) at which that color is fully rendered. Between stops, the browser smoothly interpolates the transition. Setting two consecutive stops at the same percentage creates a hard edge with no blending.",
      },
    },
    {
      "@type": "Question",
      name: "Are CSS gradients bad for performance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. CSS gradients are generated by the browser's GPU-accelerated rendering engine, making them far faster to load than equivalent raster images (PNG, JPG). They are resolution-independent, scale perfectly on retina displays, and add zero bytes to your network payload.",
      },
    },
    {
      "@type": "Question",
      name: "How do I use a gradient on text in CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Apply the gradient to the element's background property, then add background-clip: text and -webkit-background-clip: text along with color: transparent and -webkit-text-fill-color: transparent. This reveals the gradient through the text shape.",
      },
    },
    {
      "@type": "Question",
      name: "How do I create a hard color stop in CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Position two different color stops at the same percentage value — for example, red at 50% and blue at 50%. The browser creates an instantaneous switch with no blending between the two colors at that point.",
      },
    },
    {
      "@type": "Question",
      name: "How do I export the gradient to Tailwind CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After building your gradient, click the 'Tailwind' tab in the code output section. The tool generates the correct bg-gradient-to-* with from-*, via-*, and to-* utility classes, or a JIT arbitrary value for complex gradients.",
      },
    },
    {
      "@type": "Question",
      name: "Is this CSS gradient generator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The CSS Gradient Generator is completely free with no account required. You can create unlimited gradients, use all presets, and export code in any format at no cost.",
      },
    },
  ],
}

// ─── JSON-LD: BreadcrumbList ──────────────────────────────────────────────────

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    // FIX 1: All item values are now absolute URLs
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Design & UI Tools", item: `${SITE_URL}/categories/design` },
    { "@type": "ListItem", position: 3, name: "CSS Gradient Generator", item: TOOL_URL },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CSSGradientPage() {
  return (
    <>
      {/* ── Structured Data ── */}
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
        <div className=" ">

          {/* ── Breadcrumb (visual nav — Microdata kept here, separate from JSON-LD above) ── */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex items-center gap-1.5">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/categories/design" className="hover:text-foreground transition-colors">
                  Design & UI Tools
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-foreground font-medium">CSS Gradient Generator</span>
              </li>
            </ol>
          </nav>

          {/* ── Hero Header ── */}
          <header className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              CSS Gradient Generator — Copy Linear, Radial & Conic Code Free
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Build stunning <strong>linear</strong>, <strong>radial</strong>, and <strong>conic</strong> CSS gradients visually
              with unlimited color stops, precise angle control, and instant export to <strong>CSS</strong>,{" "}
              <strong>Tailwind CSS</strong>, and <strong>SCSS</strong>. No account. No watermarks. Completely free.
            </p>

            <QuickAnswer
              question="How do I write a CSS gradient with multiple colors?"
              answer="Use linear-gradient() with multiple color stops: background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 50%, #6bcb77 100%). Each stop is a color followed by a percentage position. Add as many stops as you need. This generator builds the syntax visually and copies it for you."
            />

            <p className="max-w-2xl text-sm text-muted-foreground">
              Used by frontend developers, UI designers, and no-code builders to create pixel-perfect
              background gradients without writing a single line of CSS by hand.
            </p>
          </header>

          {/* ── Interactive Tool ── */}
          <main id="tool" aria-label="CSS Gradient Generator Tool">
            <ToolClient />
          </main>

          <hr className="border-border" />

          {/* ── Content Article ── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="CSS Gradient Generator: Linear, Radial, Conic — and the Color Stop Mistake Everyone Makes" />
            <meta
              itemProp="description"
              content="How each CSS gradient type works, the gray dead zone that appears in two-color gradients, and how to fix it with a mid-point color stop."
            />
            <meta itemProp="datePublished" content="2024-03-20" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* The gray dead zone problem */}
            <section aria-labelledby="gray-zone" className="space-y-4">
              <h2
                id="gray-zone"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                The gray dead zone in two-color gradients
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                If you build a gradient between two saturated complementary colors —
                say, blue (#3B82F6) to orange (#F97316) — the midpoint interpolates
                through gray in sRGB color space. The gradient looks muddy or washed out
                in the middle. This is not a rendering bug; it&apos;s how sRGB linear
                interpolation works between colors that are opposite on the hue wheel.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                The fix: add a mid-point color stop at 50% using a saturated color that
                sits between the two hues on the wheel. For blue-to-orange, that&apos;s
                roughly purple (#7C3AED) or magenta. Alternatively, use{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">oklch</code>{' '}
                color interpolation (supported in Chrome 111+ and Safari 16.2):
                {' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {'background: linear-gradient(in oklch, #3B82F6, #F97316)'}
                </code>{' '}
                — the OKLCH color space interpolates through perceptually uniform
                hues, avoiding the gray dead zone entirely.
              </p>
            </section>

            {/* Gradient types */}
            <section
              aria-labelledby="gradient-types"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="gradient-types"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                When to use linear, radial, and conic
              </h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">linear-gradient</span>
                  <span>
                    Color transitions along a straight line at any angle. Use for
                    hero backgrounds, button hover states, and directional highlights.
                    The angle{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">to bottom right</code>{' '}
                    is equivalent to{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">135deg</code>{' '}
                    — both are valid.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">radial-gradient</span>
                  <span>
                    Color radiates outward from a center point. Use for spotlight
                    effects, circular element backgrounds, and vignette overlays on
                    images. Control shape with{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">circle</code>{' '}
                    or{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">ellipse</code>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">conic-gradient</span>
                  <span>
                    Color sweeps around a center point like a clock face. Use for
                    pie charts, color wheels, and angular segment indicators. Often
                    combined with{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 50%</code>{' '}
                    to render a circle. Browser support is universal as of 2023.
                  </span>
                </li>
              </ul>
            </section>

            {/* Performance note */}
            <section aria-labelledby="perf-note" className="space-y-4">
              <h2
                id="perf-note"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                CSS gradients vs. image backgrounds for performance
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                CSS gradients are rendered by the GPU on every paint. A simple two-stop
                linear gradient has essentially zero performance cost. A complex
                multi-stop radial gradient on a large element that repaints frequently
                (e.g., inside a scroll animation) can cause paint bottlenecks on
                low-end hardware. For static decorative backgrounds, CSS gradients
                are always faster than image files — no network request, no decode step,
                scalable at any resolution.
              </p>
            </section>

            {/* Ready-to-use gradient examples */}
            <section aria-labelledby="gradient-examples" className="space-y-4">
              <h2
                id="gradient-examples"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                10 popular CSS gradient examples — copy and paste
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-3 py-2 text-left font-semibold">Name</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">CSS</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Sunset", "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "#f093fb, #f5576c"],
                      ["Ocean", "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "#667eea, #764ba2"],
                      ["Forest", "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", "#11998e, #38ef7d"],
                      ["Fire", "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", "#f7971e, #ffd200"],
                      ["Midnight", "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)", "#2c3e50, #4ca1af"],
                      ["Rose Gold", "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", "#f6d365, #fda085"],
                      ["Radial center", "radial-gradient(circle, #6a11cb 0%, #2575fc 100%)", "#6a11cb, #2575fc"],
                      ["Mesh (conic)", "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #ff6b6b)", "multi"],
                      ["Diagonal stripe", "repeating-linear-gradient(45deg, #f8f9fa, #f8f9fa 10px, #dee2e6 10px, #dee2e6 20px)", "stripes"],
                      ["Diagonal fade", "linear-gradient(to bottom right, rgba(255,255,255,0) 40%, rgba(99,102,241,0.3) 100%)", "rgba fade"],
                    ].map(([name, css, colors]) => (
                      <tr key={name as string} className="odd:bg-muted/30">
                        <td className="border border-border px-3 py-2 font-medium">{name as string}</td>
                        <td className="border border-border px-3 py-2 font-mono text-xs">{css as string}</td>
                        <td className="border border-border px-3 py-2 text-xs text-muted-foreground">{colors as string}</td>
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
                Related CSS tools
              </h2>
              <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
                <RelatedTools
                  tools={[
                    { name: "CSS Box Shadow Generator", path: "/tools/box-shadow" },
                    { name: "Color Picker", path: "/tools/color-picker" },
                    { name: "Color Contrast Checker", path: "/tools/color-contrast-checker" },
                  ]}
                />
              </nav>
            </section>
          </article>
        </div>
      </>
    </>
  )
}