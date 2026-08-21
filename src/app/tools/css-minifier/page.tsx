import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/css-minifier`

export const FAQ_ITEMS = [
  {
    q: "How do I use the Free CSS Minifier and Formatter?",
    a: "Copy your CSS code and paste it into the input text area. Click Minify CSS to compress the code for production, or click Format CSS to beautify it for editing. Review the live size metrics, then copy or download your result.",
  },
  {
    q: "What CSS formats and syntax are supported?",
    a: "The tool supports standard CSS3, CSS4 draft features, CSS custom properties, calc() and clamp() functions, @media and @supports queries, @keyframes animations, container queries, and modern color syntax including oklch() and color-mix().",
  },
  {
    q: "What output formats does the tool provide?",
    a: "The tool outputs minified CSS with all whitespace and comments removed, or formatted CSS with proper indentation, line breaks, and normalized semicolons. Both outputs can be copied to clipboard or downloaded as .css files.",
  },
  {
    q: "Is my CSS code kept private during processing?",
    a: "Yes. All CSS minification and formatting happens entirely in your browser using client-side JavaScript. Your code is never uploaded to any external server, stored in a database, or transmitted over the network.",
  },
  {
    q: "What is the difference between minifying and formatting CSS?",
    a: "Minifying CSS removes all unnecessary characters — whitespace, comments, newlines, and redundant semicolons — to create the smallest possible file for production. Formatting CSS adds back indentation, line breaks, and spacing to make compressed code readable and editable for human developers.",
  },
  {
    q: "Are there any file size or usage limits?",
    a: "The tool handles CSS files of any length limited only by your browser's available memory. Most stylesheets under 1 MB process instantly. There are no daily usage limits, watermarks, or feature restrictions — completely free and unlimited.",
  },
]

export const metadata: Metadata = {
  title: "CSS Minifier for Lighthouse Score — Remove Render-Blocking CSS Free",
  description:
    "Minify CSS online free — reduce file size, boost page speed, or beautify compressed code. No signup, no upload, browser-based. Instant results in 2026.",
  keywords: [
    "css minifier",
    "minify css online free",
    "minify css",
    "css minifier online",
    "css formatter online free",
    "compress css file browser",
    "beautify minified css code",
    "css optimizer no upload",
    "unminify css online 2026",
    "css compressor free tool",
    "format css code online",
    "minify css without server",
    "css beautifier browser based",
    "reduce css file size free",
    "css minifier no login",
    "online css formatter developer",
    "compress stylesheet browser tool",
    "css code cleaner online free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free CSS Minifier — Compress & Format CSS Online | TheFreeAITools",
    description:
      "Minify CSS for faster page loads or beautify compressed code for editing. Browser-based, instant, free — no upload required.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free CSS Minifier — Compress & Format CSS Online Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress CSS Free — Minify & Format Stylesheets Online",
    description:
      "Minify CSS to boost page speed or format minified code for editing. Browser-based, instant, free — no upload needed.",
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
  name: "Free CSS Minifier and Formatter",
  url: TOOL_URL,
  description:
    "A free browser-based CSS minifier and formatter that compresses stylesheets for production or beautifies minified code for editing. Supports CSS3, CSS4, custom properties, and modern color syntax.",
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
    "Bidirectional CSS transformation — minify and format in one tool",
    "Client-side processing with zero server uploads for code privacy",
    "Live file size savings metrics with percentage reduction display",
    "Smart formatting with nested scope and media query resolution",
    "Universal CSS3 and CSS4 draft syntax support including container queries",
    "One-click copy to clipboard and .css file download export",
    "Support for CSS custom properties, calc(), clamp(), and oklch() color",
    "No account registration or subscription required for full access",
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
  name: "How to Minify or Format CSS Online",
  description:
    "Use this free browser-based CSS minifier and formatter to compress stylesheets for production or beautify minified code for editing in under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free CSS Minifier and Formatter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your CSS Code",
      text: "Copy your raw CSS stylesheet and paste it into the input text area. The tool handles everything from basic class selectors to complex nested media queries.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Minify or Format",
      text: "Click Minify CSS to compress the code for production environments, or click Format CSS to beautify it with proper indentation for debugging and development.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Size Metrics",
      text: "Check the live savings dashboard to see your original file size, minified size, and exact percentage of data reduced before exporting your result.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download Result",
      text: "Click Copy to save the output to your clipboard, or click Download to save it as a standard .css file ready for production deployment.",
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
      name: "Free CSS Minifier",
      item: TOOL_URL,
    },
  ],
}

export default function CSSMinifierPage() {
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              CSS Minifier for Lighthouse Score — Remove Render-Blocking CSS Free
            </h1>
            <QuickAnswer
              question="How do I reduce CSS file size to improve my Lighthouse performance score?"
              answer="Minify your CSS by removing whitespace, comments, and redundant declarations. A typical stylesheet shrinks 20–40% after minification. Paste your CSS here and click Minify — the output is production-ready. For further gains: inline critical CSS in your <head>, defer non-critical stylesheets with media=print trick, and remove unused selectors with PurgeCSS."
            />
            <img src="/images/css-minifier.webp" alt="Free CSS Minifier — compress and minify CSS code online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Optimize your website&apos;s performance by compressing CSS to its smallest
              possible size, or format messy, unreadable CSS code into a clean, beautifully
              indented structure.
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
                  <span itemProp="name">Free CSS Minifier</span>
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
            <meta itemProp="name" content="CSS Minifier: What Gets Removed, What Stays, and How Much Size Reduction to Expect" />
            <meta
              itemProp="description"
              content="Concrete size reduction numbers from minifying production CSS, the specific transformations applied, and when to use a minifier vs. a bundler."
            />
            <meta itemProp="datePublished" content="2024-02-25" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* Actual size reductions */}
            <section aria-labelledby="size-numbers" className="space-y-4">
              <h2
                id="size-numbers"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                How much CSS minification actually reduces file size
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Real-world CSS minification numbers depend heavily on how the original
                was written. Developer-formatted CSS with comments, blank lines, and
                long property names typically compresses 20–35%. A verbose CSS framework
                like a hand-written utility class file might compress 15–25%. Tailwind
                CSS output (which is already generated) typically compresses less because
                class names are short and there&apos;s little whitespace to remove. For
                comparison:{' '}
                <strong>Bootstrap 5.3 full CSS: 231 KB → 197 KB minified</strong>{' '}
                (15% reduction), but <strong>gzipped it drops to 26 KB</strong> —
                the takeaway: Gzip or Brotli compression on the server is worth far more
                than minification alone for large stylesheets.
              </p>
            </section>

            {/* What gets transformed */}
            <section
              aria-labelledby="transformations"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="transformations"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                What the minifier actually does to your CSS
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Whitespace removal</span>
                  <span>
                    All newlines, tabs, and multiple spaces are replaced with a single
                    space or removed entirely. Spaces inside selectors and around
                    combinators are removed where safe.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Comment stripping</span>
                  <span>
                    All{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{'/* comments */'}</code>{' '}
                    are removed. Exception: license comments starting with{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">/*!</code>{' '}
                    are preserved by most minifiers to comply with open-source license
                    requirements.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Color shortening</span>
                  <span>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">#ffffff</code>{' '}
                    becomes{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">#fff</code>.{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">rgb(0, 0, 0)</code>{' '}
                    becomes{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">#000</code>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Zero value simplification</span>
                  <span>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">0px</code>,{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">0em</code>, and{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">0%</code>{' '}
                    all become{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">0</code>{' '}
                    — units on zero values are redundant in CSS.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Last semicolon removal</span>
                  <span>
                    The final semicolon before a closing brace is optional in CSS.
                    Minifiers remove it. Safe in all browsers.
                  </span>
                </li>
              </ul>
            </section>

            {/* When to use a bundler instead */}
            <section aria-labelledby="bundler-vs-minifier" className="space-y-4">
              <h2
                id="bundler-vs-minifier"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                When to use a bundler instead
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                This tool is for one-off minification of a finished stylesheet — a vendor
                file you&apos;re shipping as-is, or a CSS snippet you&apos;re inlining in an email.
                For production builds in a Next.js, Vite, or webpack project, minification
                happens automatically as part of the build step. Running a stylesheet through
                this tool before committing it adds no value in those setups — the bundler
                will minify it anyway (and do more, like dead-code elimination via PurgeCSS
                or Tailwind&apos;s JIT tree-shaking).
              </p>
            </section>

            {/* Lighthouse / render-blocking CSS section */}
            <section aria-labelledby="lighthouse-css" className="space-y-4">
              <h2
                id="lighthouse-css"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                How minifying CSS improves your Lighthouse score
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Lighthouse and PageSpeed Insights flag two CSS-related performance issues:
                &quot;Eliminate render-blocking resources&quot; and &quot;Minify CSS&quot;.
                Both have the same fix: compress your CSS and deliver it as efficiently
                as possible. Here&apos;s what each Lighthouse audit is actually measuring:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Lighthouse audit</th>
                      <th className="border border-border p-2 text-left font-semibold">What it checks</th>
                      <th className="border border-border p-2 text-left font-semibold">Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Minify CSS', 'Whether CSS files contain whitespace and comments that add bytes without adding function', 'Minify CSS here → replace your existing .css file with the output'],
                      ['Eliminate render-blocking resources', 'CSS loaded in <head> blocks paint until fully downloaded', 'Inline critical CSS; defer non-critical CSS with media="print" + onload swap'],
                      ['Unused CSS', 'Selectors present in the CSS that match no elements on the page', 'Use PurgeCSS or Tailwind JIT after minifying — this tool handles whitespace, not dead code'],
                      ['Reduce initial server response time', 'TTFB — how fast the server sends the first byte', 'Minified CSS loaded from a CDN reduces TTFB for assets; enable gzip/Brotli compression on your server'],
                    ].map(([audit, checks, fix]) => (
                      <tr key={audit}>
                        <td className="border border-border p-2 font-medium text-foreground">{audit}</td>
                        <td className="border border-border p-2 text-muted-foreground">{checks}</td>
                        <td className="border border-border p-2 text-muted-foreground">{fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-base leading-7 text-muted-foreground">
                For WordPress sites: install a caching plugin (LiteSpeed Cache, W3 Total Cache,
                or WP Rocket) that minifies CSS automatically on each page load. Manually
                minifying theme CSS here is useful for theme files you maintain directly — paste
                the minified output back into your theme&apos;s style.css.
              </p>
            </section>

            {/* Related Tools */}
            <section aria-labelledby="related-tools-heading" className="space-y-4">
              <h2
                id="related-tools-heading"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Related developer tools
              </h2>
              <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
                <RelatedTools
                  tools={[
                    { name: "JS Minifier", path: "/tools/js-minifier" },
                    { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                    { name: "HTML Escape", path: "/tools/html-escape" },
                  ]}
                />
              </nav>
            </section>
          </article>

          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
            <p>
              <strong>TheFreeAITools — Free CSS Minifier &amp; Formatter</strong> is a
              fully private, browser-based tool for compressing and beautifying{" "}
              <strong>CSS</strong> stylesheets without any file uploads. All processing
              happens locally on your device in 2026 — your code is never transmitted to
              external servers. This makes it safe for proprietary themes, client
              projects, and internal design systems. Supports standard CSS3, CSS4 draft
              features, custom properties, calc(), clamp(), @media queries, @keyframes,
              container queries, and modern color syntax — completely free with no
              account or build tool required.
            </p>
          </footer>
        </div>
     </>
    </>
  )
}