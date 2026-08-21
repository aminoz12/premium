import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/js-minifier"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "JavaScript Minifier — Reduce Bundle Size for Lighthouse Free",
  description:
    "Minify JavaScript instantly to reduce bundle size and fix 'Reduce unused JavaScript' Lighthouse warnings. Removes whitespace and comments — no login, no upload, browser-based.",
  keywords: [
    "javascript minifier",
    "js minifier",
    "minify javascript online",
    "js compressor",
    "javascript obfuscator",
    "reduce js file size",
    "compress javascript",
    "js minifier free",
    "online javascript minifier",
    "browser-based js minifier",
    "no signup javascript tool",
    "secure js minifier 2026",
    "best free js compressor",
    "javascript code optimizer",
    "js shrinker free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free JavaScript Minifier — Minify JS Code Online Instantly",
    description:
      "Minify JavaScript code instantly with our free online tool. Reduce file size by removing whitespace and comments — perfect for production deployments. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free JavaScript Minifier — Minify JS Code by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JavaScript Minifier — JS Code Compressor",
    description:
      "Minify JavaScript code instantly. Free online tool to reduce JS file size. No signup required.",
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
  name: "JavaScript Minifier",
  url: TOOL_URL,
  description:
    "A free online tool that minifies JavaScript code by removing whitespace, comments, and unnecessary characters, reducing file size for production deployments. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Minify JavaScript code instantly",
    "Remove whitespace and comments",
    "Option to preserve variable names",
    "Copy minified code to clipboard",
    "Download as .js file",
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
  name: "How to Minify JavaScript Code",
  description:
    "A simple step-by-step guide to minifying JavaScript code using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools JavaScript Minifier",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your JavaScript Code",
      text: "Copy your raw JavaScript code and paste it into the input field. The tool accepts any valid JavaScript syntax.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Your Minification Options",
      text: "Select whether to remove all whitespace and comments, or preserve variable names for readability. You can also enable obfuscation for additional security.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Minify",
      text: "Press the 'Minify' button. The tool will process your code, removing unnecessary characters and outputting a compact JavaScript file.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click the 'Copy' button to save the minified code to your clipboard, or download it as a .js file for use in your production environment.",
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
      name: "What is JavaScript minification and why is it useful?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JavaScript minification is the process of removing unnecessary characters (whitespace, comments, line breaks) from JavaScript code to reduce its file size. This leads to faster download times and improved performance in production, especially for mobile users.",
      },
    },
    {
      "@type": "Question",
      name: "Does minification change the behavior of my code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Minification only removes characters that are not required for execution. The semantics and behavior of your JavaScript code remain exactly the same. It is a safe and widely used practice in production deployments.",
      },
    },
    {
      "@type": "Question",
      name: "Is my JavaScript code secure when using this minifier?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your code is never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between minification and obfuscation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minification removes whitespace and comments to reduce file size without changing the code's behavior. Obfuscation renames variables and functions to make the code harder to read and reverse-engineer. Our tool offers both basic minification and optional obfuscation.",
      },
    },
    {
      "@type": "Question",
      name: "Can I undo minification?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but not fully. Minification is reversible in the sense that you can add whitespace and line breaks back (pretty-printing), but any comments stripped out during the process cannot be recovered. Always keep the original source code as a backup.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free JavaScript minifier?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account, no daily limits, and no file size cap. Minifies JavaScript of any size directly in your browser — your code is never sent to any server.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Developer Tools > Tool ──────

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
      name: "Developer Tools",
      item: `${SITE_URL}/categories/development`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "JavaScript Minifier",
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
            JavaScript Minifier — Reduce Bundle Size for Lighthouse Free
          </h1>
          <img src="/images/js-minifier.webp" alt="Free JavaScript Minifier — compress and minify JS code online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Minify your <strong>JavaScript code</strong> instantly to reduce file size
            and improve performance. Remove <strong>whitespace</strong>, <strong>comments</strong>,
            and unnecessary characters with a single click. All processing runs locally
            in your browser with <strong>100% privacy</strong> — no signup or upload
            required.
          </p>

          <QuickAnswer
            question="How do I fix the 'Reduce unused JavaScript' Lighthouse warning?"
            answer="The Lighthouse 'Reduce unused JavaScript' audit fires when JS files contain code that's never executed on that page. Minification alone won't fix it — you need tree-shaking (webpack/Rollup/Vite removes dead code at build time) or code splitting (load only the JS each page needs). Minify here to eliminate whitespace/comments; use your bundler for deeper size reduction."
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
                  href={`${SITE_URL}/categories/development`}
                  className="hover:text-foreground transition-colors"
                >
                  Developer Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">JavaScript Minifier</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="JavaScript Minifier Tool">
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
          <meta itemProp="name" content="JavaScript Minifier: What Gets Removed, What Stays, and the Sourcemap You Need" />
          <meta
            itemProp="description"
            content="The transformations a JS minifier applies, real size numbers from minifying common libraries, and why you always need a source map for production debugging."
          />
          <meta itemProp="datePublished" content="2024-03-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What minification does */}
          <section aria-labelledby="what-it-does" className="space-y-4">
            <h2
              id="what-it-does"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a JS minifier actually removes — and what it can&apos;t touch
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A JavaScript minifier strips whitespace, removes comments, shortens variable
              names, and collapses redundant syntax. The transformations that reliably
              reduce size: whitespace/newline removal (10–20% on average), comment
              stripping (varies widely — heavily commented code can save 5–15%),
              and identifier renaming (the big win for large files — renaming{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">longDescriptiveVariableName</code>{' '}
              to{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">a</code>{' '}
              throughout a file compounds quickly).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              What can&apos;t be removed safely:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">eval()</code>{' '}
              calls (variable references inside eval strings can&apos;t be renamed),
              and property names accessed via bracket notation like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">obj[&apos;name&apos;]</code>{' '}
              (the string might be dynamic). Real-world size reductions: React 18.2 (unminified
              693 KB → minified 142 KB; gzipped 46 KB). Lodash 4.17 (542 KB → 72 KB minified;
              gzipped 25 KB).
            </p>
          </section>

          {/* Source maps */}
          <section
            aria-labelledby="source-maps"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="source-maps"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why you always need a source map for production
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A source map is a JSON file that maps positions in your minified code back
              to the original source. Without it, a production error in your bug tracker
              shows:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">TypeError at a.b.c:1:4821</code>{' '}
              — useless for debugging. With a source map, the same error shows the
              original file name and line number.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Source maps can be served publicly (which exposes your original source code
              to anyone who looks in DevTools) or privately (served only to your error
              monitoring service via a token-protected endpoint). Sentry, Datadog, and
              Rollbar all support private source map uploads. For production code,
              private upload is the right choice — expose the map only to your error
              monitoring infrastructure, not to the public.
            </p>
          </section>

          {/* When to use a bundler */}
          <section aria-labelledby="use-bundler" className="space-y-4">
            <h2
              id="use-bundler"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              This tool vs. your build pipeline
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This minifier is for one-off tasks: minifying a script you&apos;re embedding in
              an HTML email, compressing a small utility you&apos;re pasting into a third-party
              system, or quickly checking what a minified version looks like. For any
              project with a build step, use the bundler&apos;s built-in minifier — Vite
              uses esbuild, Next.js uses SWC, webpack can use Terser — all of which run
              automatically on{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">npm run build</code>{' '}
              and generate source maps as part of the output.
            </p>
          </section>

          {/* JS bundle size / Lighthouse section */}
          <section aria-labelledby="lighthouse-js" className="space-y-4">
            <h2
              id="lighthouse-js"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              JS bundle size and Lighthouse — what actually matters
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Lighthouse&apos;s JavaScript-related audits measure different things.
              Minification helps some — but tree-shaking and code splitting help more:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Lighthouse audit</th>
                    <th className="border border-border p-2 text-left font-semibold">Does minifying fix it?</th>
                    <th className="border border-border p-2 text-left font-semibold">What actually fixes it</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Minify JavaScript', 'Yes — completely', 'Run this minifier and replace the file'],
                    ['Reduce unused JavaScript', 'Partially (removes comments only)', 'Tree-shaking with webpack/Rollup/Vite; remove unused dependencies'],
                    ['Avoid enormous network payloads', 'Yes — reduces file size 30–50%', 'Minify + code-split; lazy-load non-critical JS'],
                    ['Reduce JavaScript execution time', 'No — minification does not change logic', 'Profile with Chrome DevTools; optimize loops, defer non-critical scripts'],
                    ['Eliminate render-blocking resources', 'No — that\'s about script placement', 'Move <script> tags to bottom of <body> or use defer/async attribute'],
                    ['Legacy JavaScript', 'No — that\'s about ES version', 'Use Babel/esbuild to transpile modern JS only when needed; drop IE11 support'],
                  ].map(([audit, minifyFix, actualFix]) => (
                    <tr key={audit}>
                      <td className="border border-border p-2 font-medium text-foreground">{audit}</td>
                      <td className="border border-border p-2 text-muted-foreground">{minifyFix}</td>
                      <td className="border border-border p-2 text-muted-foreground">{actualFix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              A typical unminified JavaScript file compresses 30–50% from whitespace
              and comment removal alone. A React component tree minified with esbuild
              or Terser (which both do more than whitespace removal) typically shrinks
              60–70%. Use this tool for quick one-off minification; integrate esbuild
              or Terser in your CI/CD pipeline for consistent production builds.
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
                  { name: "CSS Minifier", path: "/tools/css-minifier" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — JavaScript Minifier</strong> is a fully private,
            browser-based tool that minifies <strong>JavaScript code</strong> instantly,
            reducing file size by removing whitespace, comments, and unnecessary characters.
            Supports optional obfuscation, one-click copy, and download as a .js file.
            All processing runs locally on your device — your code never leaves your computer.
            The fastest free way to minify JavaScript in 2026, with no installs, no accounts,
            and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}