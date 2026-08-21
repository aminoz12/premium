import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/border-radius`

export const FAQ_ITEMS = [
  {
    q: "How do I use the Free CSS Border Radius Generator?",
    a: "Select your preferred unit — pixels (px) or percentages (%) — using the unit toggle. Adjust the corner radius sliders in linked mode for uniform rounding, or unlink them for independent corner control. Preview the result in real time and click Copy to grab the CSS code.",
  },
  {
    q: "What input formats and units are supported?",
    a: "The tool supports pixel values (px) for absolute corner curves and percentage values (%) for responsive, scaling curves. It also supports the advanced slash notation for elliptical corners with independent horizontal and vertical radii.",
  },
  {
    q: "What output does the generator provide?",
    a: "The tool outputs a complete CSS border-radius declaration in shorthand syntax. For linked corners, it outputs a single value. For unlinked corners, it outputs the four-value clockwise syntax. For elliptical curves, it includes the slash notation.",
  },
  {
    q: "Is my design work kept private?",
    a: "Yes. All border-radius calculations, preview rendering, and code generation happen entirely in your browser using client-side JavaScript. Your component designs, brand styles, and design system values are never uploaded to any server or stored in a database.",
  },
  {
    q: "What is the difference between px and % in border-radius?",
    a: "Pixels (px) create a static curve with a fixed radius that remains the same regardless of element dimensions. Percentages (%) create a relative curve based on the element's width and height, allowing the corner to scale responsively as the element resizes.",
  },
  {
    q: "Are there any usage limits on the free generator?",
    a: "The tool is completely free with unlimited border-radius generations, unit conversions, and code exports. There are no daily limits, watermarks, or feature restrictions. Use it for personal projects, client work, or commercial applications without any cost.",
  },
]

export const metadata: Metadata = {
  title: "Free CSS Border Radius Generator — Preview & Copy Code",
  description:
    "Generate CSS border-radius values visually. Adjust px or % units, preview corners, copy code — free, browser-based, private, no upload in 2026.",
  keywords: [
    "css border radius generator",
    "border radius online free",
    "css corner radius tool",
    "border radius preview browser",
    "generate css border radius free",
    "css rounded corners generator 2026",
    "online border radius calculator",
    "css border radius no upload",
    "free border radius code generator",
    "browser based border radius tool",
    "css rounded corners no login",
    "border radius px vs percent online",
    "free css corner tool browser",
    "border radius generator private",
    "css shape generator rounded corners",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free CSS Border Radius Generator — Live Preview & Code | TheFreeAITools",
    description:
      "Visually generate custom CSS border-radius values. Adjust corners individually, preview shapes, and copy production-ready CSS — free, no upload.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free CSS Border Radius Generator — Preview & Copy Code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Border Radius Free — Visual Generator & Code Copy",
    description:
      "Generate rounded corners visually with px or % units. Preview instantly and copy CSS code — free, private, browser-based, no login needed.",
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

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free CSS Border Radius Generator",
  url: TOOL_URL,
  description:
    "A free browser-based CSS border-radius generator that provides interactive visual controls for configuring rounded corners. Supports px and % units, linked and unlinked corners, elliptical curves, and one-click CSS code export.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires Chrome 88+, Firefox 85+, Safari 14+, or Edge 88+ with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time visual preview of border-radius modifications without page reloads",
    "Bidirectional linked and unlinked corner control for symmetrical or asymmetrical shapes",
    "Dual unit support with pixels (px) and percentages (%) for absolute and responsive curves",
    "Advanced slash notation for elliptical corners with independent horizontal and vertical radii",
    "Quick-preset radius library including Small, Medium, Large, and Pill shapes",
    "One-click CSS code copy in clean, production-ready shorthand syntax",
    "Client-side processing with zero server uploads for design privacy",
    "Universal browser compatibility across Windows, macOS, Linux, iOS, and Android",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate CSS Border Radius Values",
  description:
    "Use this free CSS border-radius generator to visually create rounded corners for web elements and export production-ready CSS code.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free CSS Border Radius Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select Your Unit",
      text: "Choose between pixels (px) for absolute curves or percentages (%) for responsive, fluid curves that scale with the element's size.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Adjust the Sliders",
      text: "Toggle the Linked option to adjust all corners equally, or unlink them to create unique, asymmetrical shapes by dragging individual sliders.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Shape",
      text: "Review the real-time visual preview to see exactly how your border-radius values affect the element's appearance before exporting.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy the CSS Code",
      text: "Click the Copy button to grab the clean, production-ready CSS border-radius declaration for your project stylesheet.",
      url: TOOL_URL,
    },
  ],
}

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
}

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
      name: "Free CSS Border Radius Generator",
      item: TOOL_URL,
    },
  ],
}

export default function BorderRadiusPage() {
  const schemas = [
    webApplicationSchema,
    howToSchema,
    faqPageSchema,
    breadcrumbSchema,
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <>
        <div className=" ">
          <header className="space-y-4 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Free CSS Border Radius Generator
            </h2>
            <QuickAnswer
              question="What CSS border-radius value creates a perfect circle?"
              answer="To create a perfect circle with CSS, set border-radius: 50% on an element with equal width and height (e.g. width: 100px; height: 100px; border-radius: 50%). For a pill/capsule shape on a rectangle, use border-radius: 9999px. For individual corners: the four-value shorthand follows clockwise order — top-left, top-right, bottom-right, bottom-left (TRouBLe mnemonic). For an elliptical corner, use the slash syntax: border-radius: 40px / 20px."
            />
            <img src="/images/border-radius.webp" alt="Free CSS Border Radius Generator — create rounded corners with live preview" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Visually create complex or simple rounded corners for your web
              elements. Adjust top, right, bottom, and left radii independently
              or lock them together, and get cross-browser compatible CSS code
              instantly.
            </p>
            <nav
              aria-label="Breadcrumb"
              className="text-xs text-muted-foreground"
            >
              <ol
                className="flex items-center gap-1"
                itemScope
                itemType="https://schema.org/BreadcrumbList"
              >
                <li
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <a
                    href={SITE_URL}
                    itemProp="item"
                    className="hover:underline"
                  >
                    <span itemProp="name">Home</span>
                  </a>
                  <meta itemProp="position" content="1" />
                </li>
                <li aria-hidden="true">›</li>
                <li
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <a
                    href={`${SITE_URL}/tools`}
                    itemProp="item"
                    className="hover:underline"
                  >
                    <span itemProp="name">Tools</span>
                  </a>
                  <meta itemProp="position" content="2" />
                </li>
                <li aria-hidden="true">›</li>
                <li
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <span itemProp="name">Free CSS Border Radius Generator</span>
                  <meta itemProp="item" content={TOOL_URL} />
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </nav>
          </header>

          <main>
            <ToolClient />
          </main>

          <hr className="border-border" />

          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="CSS Border Radius Generator: Shorthand Syntax and When to Use Each Shape" />
            <meta
              itemProp="description"
              content="The border-radius shorthand explained, the difference between a circle and a pill, and when the 8-value syntax is the only way to get the shape you want."
            />
            <meta itemProp="datePublished" content="2024-03-01" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* Shorthand syntax explained */}
            <section aria-labelledby="shorthand" className="space-y-4">
              <h2
                id="shorthand"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                The border-radius shorthand most developers get wrong
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius</code>{' '}
                accepts 1–4 values using the same TRouBLe (top-right-bottom-left) clockwise
                order as margin and padding — but with a twist. The property actually sets
                8 values: the horizontal and vertical radii of each corner independently.
                The slash syntax separates them:{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {'border-radius: 40px 10px / 20px 5px'}
                </code>{' '}
                sets top-left and bottom-right corners to 40px horizontal / 20px vertical,
                and top-right and bottom-left to 10px horizontal / 5px vertical — producing
                an elliptical corners effect that&apos;s impossible with single values.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                The common case — uniform rounded corners — is just one value:{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 8px</code>.
                Setting{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 50%</code>{' '}
                on a square element makes a perfect circle. On a non-square element (e.g.,
                a wide button), 50% produces an ellipse — use{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 9999px</code>{' '}
                for a consistent pill shape regardless of dimensions.
              </p>
            </section>

            {/* Shape reference */}
            <section
              aria-labelledby="shape-reference"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="shape-reference"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Quick reference for common shapes
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Shape</th>
                      <th className="border border-border p-2 text-left font-semibold">CSS</th>
                      <th className="border border-border p-2 text-left font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Slightly rounded card', 'border-radius: 6px', 'Standard card in most design systems'],
                      ['Rounded card (Material)', 'border-radius: 12px', 'Material Design 3 card default'],
                      ['Pill button', 'border-radius: 9999px', 'Works at any width'],
                      ['Circle (square element)', 'border-radius: 50%', 'Element must be square'],
                      ['Top-only rounding', 'border-radius: 12px 12px 0 0', 'Card attached to content below'],
                      ['Squircle approximation', 'border-radius: 30%', 'iOS app icon shape, close approximation'],
                      ['One corner only', 'border-radius: 0 0 0 16px', 'Bottom-left only (TRouBLe order)'],
                    ].map(([shape, css, notes]) => (
                      <tr key={shape}>
                        <td className="border border-border p-2 text-muted-foreground">{shape}</td>
                        <td className="border border-border p-2 font-mono text-xs text-foreground">{css}</td>
                        <td className="border border-border p-2 text-muted-foreground">{notes}</td>
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
                    { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                    { name: "Color Picker", path: "/tools/color-picker" },
                  ]}
                />
              </nav>
            </section>
          </article>

          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
            <p>
              <strong>
                TheFreeAITools — Free CSS Border Radius Generator
              </strong>{" "}
              is a fully private, browser-based tool for creating rounded corners
              and generating <strong>CSS border-radius</strong> code without any
              uploads. All processing happens locally on your device in 2026  ,
              your component designs and design system values are never
              transmitted to external servers. Supports pixel (px) and percentage
              (%) units, linked and unlinked corner control, elliptical slash
              notation, and one-click code export — completely free with no
              account or design software required.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}