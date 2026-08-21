import { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/color-picker`

export const FAQ_ITEMS = [
  {
    q: "How do I use the Free Online Color Picker and Converter?",
    a: "Choose your preferred starting format using the HEX, RGB, or HSL tabs. Adjust the color by dragging the spectrum picker, using preset colors, or typing exact values. All formats update instantly — copy your chosen code with one click.",
  },
  {
    q: "What color formats and inputs are supported?",
    a: "The tool supports HEX (6-digit and 3-digit shorthand), RGB with integer values (0-255), HSL with degrees and percentages, and alpha channel transparency through RGBA and HSLA formats. It also accepts CSS named colors as input.",
  },
  {
    q: "What output formats does the tool provide?",
    a: "The tool simultaneously outputs HEX codes, RGB() and RGBA() functions, HSL() and HSLA() declarations, and complete CSS snippet strings. All values update in real time as you adjust the color selection.",
  },
  {
    q: "Is my color selection kept private?",
    a: "Yes. All color processing, conversion, and contrast calculation happens entirely in your browser using client-side JavaScript. Your color choices, brand values, and palette selections are never uploaded to any server or stored in a database.",
  },
  {
    q: "What is the difference between RGB and HSL color models?",
    a: "RGB represents colors as mixtures of red, green, and blue light on a scale of 0-255 — optimized for screen rendering but unintuitive for human adjustment. HSL represents colors as hue (color angle), saturation (color intensity), and lightness (brightness) — a model that aligns with how humans naturally think about color variation.",
  },
  {
    q: "Are there any usage limits or restrictions?",
    a: "The tool is completely free with unlimited color conversions, palette generations, and contrast checks. There are no daily limits, watermarks, or feature restrictions. Use it for personal projects, client work, or commercial applications without any cost.",
  },
]

export const metadata: Metadata = {
  title: "Free Color Picker — Convert HEX, RGB & HSL Online Free",
  description:
    "Pick colors visually and convert HEX, RGB, HSL instantly. Get CSS codes, check contrast — free, private, browser-based, zero upload in 2026.",
  keywords: [
    "color picker",
    "online color picker free",
    "hex to rgb converter",
    "hsl color picker online",
    "css color code generator",
    "color contrast checker free",
    "rgb to hex converter browser",
    "color palette generator online",
    "hex color picker no upload",
    "hsl to rgb converter free 2026",
    "web color picker tool",
    "color converter browser based",
    "free color code generator",
    "online color converter no login",
    "accessibility color checker free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Color Picker — Convert HEX, RGB & HSL Online | TheFreeAITools",
    description:
      "Visually pick colors and convert between HEX, RGB, and HSL instantly. Get CSS codes, check contrast, and generate palettes — free, no upload.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Color Picker — Convert HEX, RGB & HSL Online Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pick & Convert Colors Free — HEX, RGB, HSL Online",
    description:
      "Choose colors visually, convert between formats instantly, and get CSS-ready codes. Free, private, browser-based — no upload needed.",
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
  name: "Free Online Color Picker and Converter",
  url: TOOL_URL,
  description:
    "A free browser-based color picker and converter that translates between HEX, RGB, and HSL formats in real time. Includes accessibility contrast checking, alpha transparency support, and CSS code generation.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires Chrome 88+, Firefox 85+, Safari 14+, or Edge 88+ with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time bidirectional conversion between HEX, RGB, and HSL formats",
    "Automatic WCAG accessibility contrast ratio calculation",
    "Alpha channel transparency support with RGBA and HSLA output",
    "Visual spectrum picker with manual numerical precision input",
    "Quick-select preset color library for rapid palette creation",
    "One-click CSS code generation and clipboard copying",
    "Client-side processing with zero server uploads for privacy",
    "Universal browser compatibility across all major platforms",
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
  name: "How to Pick and Convert Colors Online",
  description:
    "Use this free online color picker to visually select colors and convert between HEX, RGB, and HSL formats for web design and development.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free Online Color Picker and Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select a Color Format",
      text: "Choose your preferred starting format using the HEX, RGB, or HSL tabs. This determines which visual picker and manual inputs are displayed.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Adjust the Color",
      text: "Drag the cursor around the color palette, use the quick-select preset colors, or manually type exact numerical values for precise control.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Contrast and Accessibility",
      text: "Check the automatic contrast preview to ensure your selected color meets WCAG accessibility standards with the recommended text color.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy the Color Code",
      text: "Instantly view your color converted into all major web formats. Use the one-click copy buttons to grab the HEX string, RGB function, or CSS snippet.",
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
      name: "Free Color Picker",
      item: TOOL_URL,
    },
  ],
}

export default function ColorPickerPage() {
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
              Free Online Color Picker &amp; Converter
            </h2>
            <QuickAnswer
              question="What is the difference between HEX, RGB, and HSL color formats in CSS?"
              answer="HEX (#RRGGBB) is the most compact — a 6-digit hexadecimal code where each pair represents red, green, and blue (0–255). RGB uses rgb(255, 0, 128) syntax with decimal integers — readable but verbose. HSL uses hsl(340, 100%, 50%) — Hue (0–360° color wheel angle), Saturation (0–100% color intensity), Lightness (0–100% brightness) — the most intuitive for creating tints, shades, and color variations. All three are fully equivalent and interconvertible; use whichever your design system prefers."
            />
            <img src="/images/color-picker.webp" alt="Free Color Picker — pick, convert, and copy hex, RGB, and HSL color codes" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              A comprehensive color selection and conversion tool for developers
              and designers. Visually choose colors, instantly translate between
              HEX, RGB, and HSL formats, adjust opacity, and get ready-to-use CSS
              codes.
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
                  <span itemProp="name">Free Color Picker</span>
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
            <meta itemProp="name" content="Color Picker: Convert Between HEX, RGB, HSL, and HSB" />
            <meta itemProp="description" content="Pick colors and convert between formats. Explains when each format is most useful, HSL for programmatic color manipulation, and accessibility contrast considerations." />
            <meta itemProp="datePublished" content="2024-01-18" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            <section aria-labelledby="color-formats" className="space-y-4">
              <h2 id="color-formats" className="text-2xl font-semibold tracking-tight text-foreground">
                When each color format actually helps
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                HEX is the format most designers and developers recognize: six hexadecimal digits
                that are easy to copy from design tools and paste into CSS. But HEX is opaque for
                color logic — if you want a 20% lighter version of a color, HEX math is not
                intuitive. HSL is.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                HSL (Hue, Saturation, Lightness) maps directly to how humans think about color.
                Hue is the color angle (0–360°). Saturation is how vivid it is. Lightness is
                how bright. To make a hover state that&apos;s 10% darker, just subtract 10 from the
                L value. To make a muted variant, lower the S. This is why CSS custom properties
                in design systems are often defined in HSL — it makes generating color scales in
                code straightforward.
              </p>
            </section>

            <section aria-labelledby="color-workflow" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
              <h2 id="color-workflow" className="text-2xl font-semibold tracking-tight text-foreground">
                A quick format reference
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Format</th>
                      <th className="border border-border p-2 text-left font-semibold">Example</th>
                      <th className="border border-border p-2 text-left font-semibold">Best used when</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['HEX', '#3B82F6', 'Copying from Figma/Sketch, CSS shorthand, design tokens'],
                      ['RGB', 'rgb(59, 130, 246)', 'Canvas API, WebGL, JavaScript color calculations'],
                      ['RGBA', 'rgba(59, 130, 246, 0.5)', 'CSS with opacity, overlay effects'],
                      ['HSL', 'hsl(217, 91%, 60%)', 'Programmatic color scales, theming, hover states'],
                      ['HSLA', 'hsla(217, 91%, 60%, 0.8)', 'HSL with alpha channel'],
                      ['HSB / HSV', 'hsb(217, 76%, 96%)', 'Photoshop/Illustrator; not native in CSS'],
                    ].map(([fmt, ex, when]) => (
                      <tr key={fmt}>
                        <td className="border border-border p-2 font-mono text-xs text-foreground">{fmt}</td>
                        <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{ex}</td>
                        <td className="border border-border p-2 text-muted-foreground">{when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="color-accessibility" className="space-y-4">
              <h2 id="color-accessibility" className="text-2xl font-semibold tracking-tight text-foreground">
                Contrast and accessibility — what to check
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                WCAG 2.1 AA requires a minimum contrast ratio of 4.5:1 for body text. But the
                ratio number alone is not the full picture — the same 4.5:1 pair that passes
                on a calibrated monitor may fail badly with screen glare or reduced brightness.
                I covered the specifics of where 4.5:1 still fails in{' '}
                <a href="/blog/color-contrast-wcag-what-it-means" className="text-black  dark:text-white hover:underline">
                  Color Contrast Ratios: What WCAG AA and AAA Actually Mean
                </a>
                . Use our{' '}
                <a href="/tools/contrast-checker" className="text-black  dark:text-white hover:underline">Contrast Checker</a>{' '}
                to test specific color combinations.
              </p>
            </section>

            <section aria-labelledby="related-tools-heading" className="space-y-4">
              <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
                Related design tools
              </h2>
              <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
                <RelatedTools
                  tools={[
                    { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                    { name: "CSS Box Shadow Generator", path: "/tools/css-box-shadow" },
                    { name: "Contrast Checker", path: "/tools/contrast-checker" },
                  ]}
                />
              </nav>
            </section>
          </article>

          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
            <p>
              <strong>
                TheFreeAITools — Free Online Color Picker &amp; Converter
              </strong>{" "}
              is a fully private, browser-based tool for selecting colors and
              converting between <strong>HEX</strong>, <strong>RGB</strong>, and{" "}
              <strong>HSL</strong> formats without any uploads. All processing
              happens locally on your device in 2026 — your color choices and
              brand values are never transmitted to external servers. Supports
              HEX shorthand, RGB integers, HSL degrees and percentages, RGBA and
              HSLA transparency, CSS named colors, and automatic WCAG contrast
              checking — completely free with no account or design software
              required.
            </p>
          </footer>
        </div>
     </>
    </>
  )
}