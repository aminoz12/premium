import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URL constants ────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/box-shadow-generator`

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Title: "CSS Box Shadow Generator — Free & Live Preview" = 50 chars ✓
export const metadata: Metadata = {
  title: "CSS Box Shadow Generator — Free & Live Preview",
  description:
    "Generate CSS box-shadow code visually. Adjust offsets, blur, spread, color, and inset with live preview. Copy ready CSS — free, no signup.",
  keywords: [
    "css box shadow generator",
    "box shadow online free",
    "css drop shadow tool",
    "css box shadow code generator",
    "box shadow live preview online",
    "inset box shadow generator free",
    "generate box shadow css 2026",
    "css shadow generator browser",
    "box shadow rgba generator",
    "css box shadow no download",
    "box shadow offset blur spread",
    "online css box shadow maker",
    "box shadow copy css code",
    "free css tools online",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free CSS Box Shadow Generator — Live Preview & Instant CSS Code",
    description:
      "Visually build CSS box-shadow properties in real time. Adjust offsets, blur, spread, and RGBA color — then copy the generated code in one click.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "CSS Box Shadow Generator — TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thefreeaitools",
    title: "CSS Box Shadow Generator | Free Live Preview | No Signup",
    description:
      "Build CSS box-shadow code visually — adjust blur, spread, offset, and opacity in real time. Copy and go.",
    images: [`${TOOL_URL}/opengraph-image`],
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

// ─── JSON-LD: WebApplication ───────────────────────────────────────────────────
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSS Box Shadow Generator",
  url: TOOL_URL,
  description:
    "A free, browser-based CSS box-shadow generator that lets you visually adjust offsets, blur, spread, color, and inset settings and instantly copies the generated CSS code to your clipboard.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+, Opera 74+",
  featureList: [
    "Real-time live preview of box-shadow on a sample UI element",
    "Separate X and Y offset sliders with pixel-level precision",
    "Blur radius control from 0px (hard edge) to 100px (diffused)",
    "Spread radius control to expand or shrink the shadow footprint",
    "HEX-to-RGBA color conversion with independent opacity slider",
    "Inset shadow toggle for sunken or inner-glow effects",
    "One-click preset library (subtle elevation, hard drop, large diffused)",
    "One-click copy of the complete CSS box-shadow declaration",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

// ─── JSON-LD: HowTo ────────────────────────────────────────────────────────────
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate a CSS Box Shadow in Under a Minute",
  description:
    "Use the TheFreeAITools CSS Box Shadow Generator to create and copy a custom box-shadow CSS declaration without writing a line of code.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools CSS Box Shadow Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Set the shadow position",
      text: "Use the X Offset and Y Offset sliders to move the shadow horizontally and vertically relative to the element. Positive X moves the shadow right; positive Y moves it down.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Adjust blur and spread",
      text: "Drag the Blur Radius slider to soften the shadow edges, and drag the Spread Radius slider to make the shadow larger or smaller than the element itself.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Choose a color and opacity",
      text: "Pick a shadow color using the color picker and fine-tune its transparency with the Opacity slider. The tool outputs a clean RGBA value automatically.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy the generated CSS",
      text: "Once the live preview matches your design, click the Copy CSS button to copy the complete box-shadow declaration to your clipboard, ready to paste into your stylesheet.",
      url: TOOL_URL,
    },
  ],
}

// ─── JSON-LD: FAQPage ──────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I use the CSS Box Shadow Generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the X and Y offset sliders to position the shadow, then adjust blur and spread to control softness and size. Pick a color and opacity, toggle inset if needed, and click Copy CSS to copy the finished declaration to your clipboard.",
      },
    },
    {
      "@type": "Question",
      name: "What CSS properties can I control with this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The generator controls all five box-shadow parameters: horizontal offset (X), vertical offset (Y), blur radius, spread radius, and shadow color including alpha transparency via an RGBA output. You can also toggle the inset keyword.",
      },
    },
    {
      "@type": "Question",
      name: "What does the generated output look like?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool outputs a single CSS declaration ready to paste into any stylesheet, for example: box-shadow: 4px 6px 12px 2px rgba(0, 0, 0, 0.25). For inset shadows it prepends the inset keyword. The value is cross-browser compatible and requires no vendor prefixes in modern browsers.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool upload anything to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The CSS Box Shadow Generator runs entirely in your browser. There are no server requests and nothing is uploaded or stored. Your design choices remain completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between blur radius and spread radius?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Blur radius controls how soft or sharp the shadow edges are — a value of 0px produces a crisp, hard-edged shadow while higher values feather the edges. Spread radius controls the overall size of the shadow: positive values expand it beyond the element's bounding box, negative values shrink it inward.",
      },
    },
    {
      "@type": "Question",
      name: "Can I create multiple box shadows on one element?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CSS natively supports multiple shadows on a single element by comma-separating declarations, for example: box-shadow: 2px 2px 5px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.5). This generator produces one shadow at a time, which you can then manually combine in your stylesheet.",
      },
    },
  ],
}

// ─── JSON-LD: BreadcrumbList ───────────────────────────────────────────────────
const breadcrumbSchema = {
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
      name: "Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "CSS Box Shadow Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page component ────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* ── Structured data (four scripts, first children) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className=" ">
        <header className="space-y-4 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Free CSS Box Shadow Generator
          </h2>
          <QuickAnswer
            question="What is the CSS box-shadow syntax and what does each value do?"
            answer="The CSS box-shadow shorthand is: box-shadow: [inset] offset-x offset-y [blur-radius] [spread-radius] [color]. offset-x moves the shadow right (+) or left (−). offset-y moves it down (+) or up (−). blur-radius (default 0) controls softness — higher = softer. spread-radius expands (+) or contracts (−) the shadow size. inset makes the shadow appear inside the element. Example: box-shadow: 2px 4px 12px rgba(0,0,0,0.15) creates a soft outer drop shadow. Layer multiple shadows with commas: box-shadow: shadow1, shadow2."
          />
          <img src="/images/box-shadow.webp" alt="Free CSS Box Shadow Generator — create drop shadows with live CSS preview" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Create beautiful and layered shadows for your web elements. Visually
            adjust X and Y offsets, blur radius, spread radius, color, and
            opacity to generate cross-browser compatible CSS instantly.
          </p>

          {/* Breadcrumb nav — mirrors BreadcrumbList JSON-LD exactly (3 levels, no Microdata) */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex items-center gap-1">
              <li>
                <a href={`${SITE_URL}/`} className="hover:underline">
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href={`${SITE_URL}/tools`} className="hover:underline">
                  Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">CSS Box Shadow Generator</li>
            </ol>
          </nav>
        </header>

        {/* ── Tool UI (client component — unchanged) ── */}
        <main>
          <ToolClient />
        </main>

        <hr className="border-border" />

        {/* ── AdSense high-value content article ── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSS Box Shadow Generator: Why Most Box Shadows Look Wrong" />
          <meta
            itemProp="description"
            content="The reason generated shadows feel unnatural, the two properties that fix it, and a reference table for realistic shadow presets based on common elevation levels."
          />
          <meta itemProp="datePublished" content="2024-03-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why shadows look wrong */}
          <section aria-labelledby="why-wrong" className="space-y-4">
            <h2
              id="why-wrong"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why most generated shadows look wrong
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The default shadow from most generators is symmetrical:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">box-shadow: 0 4px 6px rgba(0,0,0,0.1)</code>.
              It renders correctly but looks flat and artificial. Real shadows are
              directional — light comes from above, so shadows fall below and slightly
              to one side. They also soften as objects rise higher from the surface:
              a card at 2dp elevation has a tight, dark shadow; a modal at 24dp has a
              large, diffuse one.{' '}
              <a href="/blog/css-box-shadow-real-numbers" className="text-black  dark:text-white hover:underline">
                Full write-up on shadow realism here.
              </a>
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The two most impactful fixes: (1) Add a small positive Y offset (2–4px for
              low elevations) to simulate light from above. (2) Use two layered shadows —
              one tight and dark for the direct shadow, one wide and lighter for ambient
              light diffusion. Google&apos;s Material Design uses exactly this technique for all
              elevation levels.
            </p>
          </section>

          {/* Elevation reference table */}
          <section
            aria-labelledby="elevation-table"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="elevation-table"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Shadow presets by elevation level
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Component</th>
                    <th className="border border-border p-2 text-left font-semibold">Elevation</th>
                    <th className="border border-border p-2 text-left font-semibold">CSS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Subtle card border', 'Near 0', '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)'],
                    ['Button (resting)', 'Low', '0 2px 4px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.08)'],
                    ['Dropdown / popover', 'Medium', '0 4px 12px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.08)'],
                    ['Card (hovering)', 'Medium-high', '0 8px 24px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.08)'],
                    ['Modal / dialog', 'High', '0 20px 48px rgba(0,0,0,.18), 0 8px 16px rgba(0,0,0,.10)'],
                  ].map(([component, elevation, css]) => (
                    <tr key={component}>
                      <td className="border border-border p-2 font-medium text-foreground">{component}</td>
                      <td className="border border-border p-2 text-muted-foreground">{elevation}</td>
                      <td className="border border-border p-2 text-muted-foreground font-mono text-xs">{css}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              These are starting points. Adjust opacity based on your background color:
              shadows on white need less opacity than shadows on light-grey surfaces.
              Dark mode requires higher opacity (0.3–0.5) because contrast ratios flip.
            </p>
          </section>

          {/* Color shadows */}
          <section aria-labelledby="color-shadows" className="space-y-4">
            <h2
              id="color-shadows"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use colored shadows
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Colored shadows work well when the surface casting the shadow has a strong
              hue — a blue card with a blue-tinted shadow, for example. The trick is
              to use a muted, desaturated version of the color at low opacity rather
              than the full saturated value. A button with{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">background: #6366f1</code>{' '}
              (Indigo-500) reads well with{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">box-shadow: 0 4px 14px rgba(99,102,241,0.4)</code>.
              Using the full saturation without reducing opacity makes the shadow
              look like a glow effect, not an elevation shadow.
            </p>
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
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                  { name: "Border Radius Generator", path: "/tools/border-radius" },
                  { name: "Color Picker", path: "/tools/color-picker" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page footer ── */}
        <footer className="mt-12 pt-6 border-t text-xs text-muted-foreground max-w-4xl">
          <p>
            The <strong>CSS Box Shadow Generator</strong> on TheFreeAITools
            lets you visually build and copy <strong>box-shadow</strong> CSS
            declarations — controlling <strong>X/Y offsets</strong>,{" "}
            <strong>blur</strong>, <strong>spread</strong>,{" "}
            <strong>RGBA color</strong>, and the <strong>inset</strong> keyword
           — entirely in your browser with no server uploads and no account
            required. Updated and tested across all major browsers in 2026.
          </p>
        </footer>
      </div>
    </>
  )
}