import { buildToolMetadata } from "@/lib/seo/metadata"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ClientPage from "./client-page"
import type { Metadata } from "next"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/color-contrast-checker`

export const FAQ_ITEMS = [
  {
    q: "How do I use the Free Color Contrast Checker?",
    a: "Enter your foreground text color and background color in the input fields using HEX, RGB, or HSL format. The tool instantly calculates the contrast ratio and displays WCAG Level AA and Level AAA pass/fail results for normal text, large text, and UI components.",
  },
  {
    q: "What color formats and inputs are supported?",
    a: "The tool accepts HEX codes (with or without hashtag), RGB values in integer or percentage format, HSL declarations with degrees and percentages, and CSS named colors. Both input fields support any valid CSS color syntax.",
  },
  {
    q: "What output does the contrast checker provide?",
    a: "The tool outputs the exact contrast ratio to two decimal places, pass/fail grades for WCAG 2.1 Level AA and Level AAA standards, visual text preview on the selected background, and color blindness simulation previews for four types of deficiency.",
  },
  {
    q: "Is my color data kept private?",
    a: "Yes. All contrast calculations, color parsing, and accessibility analysis happen entirely in your browser using client-side JavaScript. Your brand colors, design palettes, and test results are never uploaded to any server or stored in a database.",
  },
  {
    q: "What is the difference between Level AA and Level AAA contrast?",
    a: "Level AA is the minimum accessibility standard required by most regulations, requiring 4.5:1 contrast for normal text and 3:1 for large text. Level AAA is the highest standard, requiring 7:1 for normal text and 4.5:1 for large text — providing enhanced readability for users with significant vision impairment.",
  },
  {
    q: "Are there any usage limits on the free checker?",
    a: "The tool is completely free with unlimited contrast checks, color format conversions, and accessibility simulations. There are no daily limits, watermarks, or feature restrictions. Use it for personal projects, client audits, or commercial applications without any cost.",
  },
]

export const metadata: Metadata = {
  ...buildToolMetadata("color-contrast-checker"),
  title: "WCAG Color Contrast Checker — Test Text on Background Free",
  description:
    "Check text-on-background contrast ratio for WCAG 2.1 AA and AAA compliance. Test button colors, heading combinations, and UI components instantly. Free, browser-based, no upload.",
  keywords: [
    "color contrast checker",
    "wcag contrast checker free",
    "online color contrast tool",
    "accessibility contrast ratio checker",
    "hex contrast checker browser",
    "free wcag compliance checker 2026",
    "color accessibility tester online",
    "text contrast checker no upload",
    "aa aaa contrast checker free",
    "web accessibility color tool",
    "contrast ratio calculator online",
    "color blindness contrast checker",
    "browser based contrast checker",
    "free contrast checker no login",
    "ui component contrast validator",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Color Contrast Checker — WCAG AA & AAA Compliance",
    description:
      "Test any two colors for WCAG accessibility compliance instantly. Get contrast ratios, pass/fail grades, and color blindness previews — free, no upload.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Color Contrast Checker — WCAG Accessibility Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Check Color Contrast Free — WCAG AA & AAA Online",
    description:
      "Test text and background colors for accessibility compliance. Get instant contrast ratios, pass/fail grades, and previews — free, private, no login.",
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
  name: "Free Color Contrast Checker",
  url: TOOL_URL,
  description:
    "A free browser-based WCAG color contrast checker that calculates accessibility ratios between text and background colors. Supports HEX, RGB, and HSL formats with Level AA and Level AAA grading.",
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
    "Instant WCAG contrast ratio calculation to two decimal places",
    "Level AA and Level AAA pass/fail grading for text and UI components",
    "Multi-format color input support for HEX, RGB, and HSL values",
    "Color blindness simulation preview for four types of deficiency",
    "Real-time text preview on selected background combinations",
    "One-click color adjustment suggestions for failing combinations",
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
  name: "How to Check Color Contrast for WCAG Compliance",
  description:
    "Use this free color contrast checker to test text and background color combinations against WCAG 2.1 accessibility standards.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free Color Contrast Checker",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Text Color",
      text: "Type or paste your foreground text color into the first input field using HEX, RGB, or HSL format. The tool accepts any valid CSS color value.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter Your Background Color",
      text: "Type or paste your background color into the second input field. Use the same or a different format — the tool automatically parses and normalizes both values.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Contrast Results",
      text: "View the calculated contrast ratio and WCAG Level AA and Level AAA pass/fail grades for normal text, large text, and UI components.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Test Color Blindness Preview",
      text: "Switch to the simulation tab to see how your color pair appears to users with protanopia, deuteranopia, tritanopia, and achromatopsia.",
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
      name: "Free Color Contrast Checker",
      item: TOOL_URL,
    },
  ],
}

export default function Page() {
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

      <div className="  px-4 py-8">
        <header className="space-y-4 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            WCAG Color Contrast Checker — Test Text on Background Free
          </h1>
          <QuickAnswer
            question="What contrast ratio do I need to pass WCAG AA accessibility?"
            answer="WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal-sized text (under 18pt / 14pt bold) and 3:1 for large text (18pt+ / 14pt+ bold). For UI components and icons: 3:1. Level AAA requires 7:1 for normal text and 4.5:1 for large text. Enter your foreground and background colors above to get an instant pass/fail result."
          />
          <img src="/images/color-contrast-checker.webp" alt="Free Color Contrast Checker — check WCAG accessibility contrast ratios online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Instantly test any two colors for <strong>WCAG 2.1</strong> accessibility
            compliance. Calculate contrast ratios, get Level AA and Level AAA
            pass/fail grades, preview text readability, and simulate color blindness
            — completely free, no upload required.
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
                <span itemProp="name">Free Color Contrast Checker</span>
                <meta itemProp="item" content={TOOL_URL} />
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
        </header>

        <main>
           <ClientPage />
        </main>

        <hr className="border-border" />

        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Color Contrast Checker: WCAG Ratios, What They Mean, and What Actually Fails" />
          <meta
            itemProp="description"
            content="The WCAG contrast ratios explained with real examples, plus the gray-text patterns that fail most often in production and why automated tools miss them."
          />
          <meta itemProp="datePublished" content="2024-04-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What the ratio means */}
          <section aria-labelledby="what-ratio-means" className="space-y-4">
            <h2
              id="what-ratio-means"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a 4.5:1 contrast ratio actually means
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              WCAG 2.1 requires a 4.5:1 contrast ratio for normal text (under 18pt) at
              Level AA — the legal standard in the US, EU, and UK for public-facing
              websites. The ratio is calculated from the relative luminance of each color,
              where pure white is 1.0 and pure black is 0. The formula weights the R, G,
              and B channels non-linearly to approximate how human vision perceives
              brightness differences.{' '}
              <a href="/blog/color-contrast-wcag-what-it-means" className="text-black  dark:text-white hover:underline">
                Full explanation with worked examples here.
              </a>
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              In practice: black text (#000) on white (#fff) is 21:1 — the maximum.
              The popular &quot;gray on white&quot; pattern ({'"#767676 on #ffffff"'}) is exactly 4.54:1 —
              just barely passing. One step lighter, #777, drops to 4.48:1 and fails.
              This is the zone where most accessibility violations live in production:
              designers choose gray text for visual hierarchy, then pick a shade that&apos;s
              two hex values too light.
            </p>
          </section>

          {/* Common failures */}
          <section
            aria-labelledby="common-failures"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="common-failures"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The patterns that fail most often
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Pattern</th>
                    <th className="border border-border p-2 text-left font-semibold">Typical ratio</th>
                    <th className="border border-border p-2 text-left font-semibold">Pass/Fail AA</th>
                    <th className="border border-border p-2 text-left font-semibold">Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Placeholder text (#9CA3AF on white)', '2.4:1', 'FAIL', 'Use #6B7280 or darker'],
                    ['Secondary text (#6B7280 on white)', '4.6:1', 'PASS (barely)', 'Avoid on off-white backgrounds'],
                    ['Disabled button (#9CA3AF on #F3F4F6)', '2.0:1', 'FAIL', 'WCAG exempts disabled elements'],
                    ['White on brand blue (#3B82F6)', '3.0:1', 'FAIL', 'Darken to #1D4ED8 for white text'],
                    ['White on green (#22C55E)', '2.3:1', 'FAIL', 'Use dark text or darken to #15803D'],
                    ['Yellow text on white', '1.1–1.8:1', 'FAIL', 'Yellow is near-invisible on white'],
                  ].map(([pattern, ratio, result, fix]) => (
                    <tr key={pattern}>
                      <td className="border border-border p-2 text-muted-foreground">{pattern}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{ratio}</td>
                      <td className={`border border-border p-2 font-medium ${result === 'FAIL' ? 'text-red-600' : 'text-green-600'}`}>{result}</td>
                      <td className="border border-border p-2 text-muted-foreground">{fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* What automated tools miss */}
          <section aria-labelledby="what-tools-miss" className="space-y-4">
            <h2
              id="what-tools-miss"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What automated checkers can&apos;t catch
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This checker evaluates flat color pairs. It cannot check text on gradient
              backgrounds, text over images, or text where color changes on hover/focus.
              For gradients, check both the lightest and darkest points of the gradient
              against your text color and use the lower (worse) ratio as your reference.
              For images, the 1:1 rule of thumb: if the background contains a range of
              tones, a semi-transparent dark overlay behind the text is usually more
              reliable than trying to find a single text color that passes everywhere.
            </p>
          </section>

          {/* WCAG-compliant color combinations */}
          <section aria-labelledby="wcag-combinations" className="space-y-4">
            <h2
              id="wcag-combinations"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              WCAG AA-passing color combinations — ready to use
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text
              and 3:1 for large text (18pt+) and UI components. These combinations all pass:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Text color</th>
                    <th className="border border-border p-2 text-left font-semibold">Background</th>
                    <th className="border border-border p-2 text-left font-semibold">Contrast ratio</th>
                    <th className="border border-border p-2 text-left font-semibold">Use case</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['#000000 (Black)', '#FFFFFF (White)', '21:1 ✓ AAA', 'Body text, high-readability documents'],
                    ['#FFFFFF (White)', '#000000 (Black)', '21:1 ✓ AAA', 'Dark mode body text'],
                    ['#1A1A2E (Dark navy)', '#FFFFFF (White)', '16.1:1 ✓ AAA', 'Heading text on white backgrounds'],
                    ['#FFFFFF (White)', '#0057B8 (Blue)', '5.1:1 ✓ AA', 'Primary CTA buttons'],
                    ['#FFFFFF (White)', '#2E7D32 (Green)', '5.1:1 ✓ AA', 'Success state buttons'],
                    ['#FFFFFF (White)', '#B71C1C (Dark red)', '5.9:1 ✓ AA', 'Error/danger buttons'],
                    ['#212121 (Near black)', '#F5F5F5 (Light grey)', '15.3:1 ✓ AAA', 'Card content on light backgrounds'],
                    ['#1B5E20 (Dark green)', '#E8F5E9 (Light green)', '7.2:1 ✓ AAA', 'Success alerts / banners'],
                    ['#B71C1C (Dark red)', '#FFEBEE (Light red)', '5.8:1 ✓ AA', 'Error alerts / banners'],
                    ['#FFFFFF (White)', '#333333 (Dark grey)', '12.6:1 ✓ AAA', 'Dark headers, nav bars'],
                  ].map(([text, bg, ratio, use]) => (
                    <tr key={text + bg}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{text}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{bg}</td>
                      <td className="border border-border p-2 text-muted-foreground">{ratio}</td>
                      <td className="border border-border p-2 text-muted-foreground">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              Paste any pair above into the checker to see the live preview and confirm the
              ratio for your specific context. Note: these ratios apply to text only — icons
              and non-text UI components need a 3:1 ratio (WCAG 1.4.11 Non-text Contrast).
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related design tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Color Picker", path: "/tools/color-picker" },
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>
              TheFreeAITools — Free Color Contrast Checker
            </strong>{" "}
            is a fully private, browser-based tool for testing color contrast
            ratios against <strong>WCAG 2.1</strong> accessibility standards
            without any uploads. All calculations happen locally on your device
            in 2026 — your brand colors and design palettes are never
            transmitted to external servers. Supports <strong>HEX</strong>,{" "}
            <strong>RGB</strong>, and <strong>HSL</strong> color formats with
            Level AA and Level AAA grading, text preview, and color blindness
            simulation — completely free with no account or design software
            required.
          </p>
        </footer>
      </div>
    </>
  )
}