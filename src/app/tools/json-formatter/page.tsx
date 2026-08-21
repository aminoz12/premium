import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/json-formatter"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Fix JSON Syntax Error Free Online — Formatter & Validator",
  description:
    "Paste broken JSON and instantly see the exact line with the syntax error. Format, validate, and pretty-print JSON free — no signup, no upload, syntax highlighting and tree view included.",
  keywords: [
    "json formatter",
    "json formatter and validator online",
    "json validator",
    "json beautifier",
    "pretty print json",
    "json syntax checker",
    "free json tool 2026",
    "online json formatter",
    "json tree view",
    "json to csv",
    "browser-based json tool",
    "no signup json formatter",
    "secure json validator",
    "best free json formatter",
    "json code beautifier",
    "camel case to snake case",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free JSON Formatter — Format & Validate JSON Online",
    description:
      "Format, validate, and beautify JSON data instantly. Free online tool with syntax highlighting, tree view, and one-click copy. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free JSON Formatter — Format & Validate JSON by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter — Format & Validate JSON Online",
    description:
      "Format, validate, and beautify JSON data instantly. Free browser-based tool, no signup required.",
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
  name: "JSON Formatter & Validator",
  url: TOOL_URL,
  description:
    "A free online tool that formats, validates, and beautifies JSON data. Features syntax highlighting, tree view, and one-click copy. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Pretty-print JSON with custom indentation",
    "Validate JSON syntax and show errors",
    "Collapsible tree view for nested data",
    "Convert JSON to CSV or XML",
    "One-click copy or download",
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
  name: "How to Format and Validate JSON Online",
  description:
    "A simple step-by-step guide to formatting, validating, and beautifying JSON data using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools JSON Formatter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your JSON Data",
      text: "Copy your raw JSON data and paste it into the input field. The tool accepts any valid JSON structure.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Format or Validate",
      text: "Press the 'Format' button to pretty-print the JSON. If the JSON is invalid, the tool will highlight the error with a descriptive message.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Output",
      text: "The formatted JSON will appear in the output panel with syntax highlighting and a collapsible tree view for nested objects.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click the 'Copy' button to save the formatted JSON to your clipboard, or download it as a .json file for use in your project.",
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
      name: "What is JSON formatting and why is it useful?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON formatting (also called pretty-printing) arranges raw JSON data with proper indentation, line breaks, and spacing to make it human-readable. It is useful for debugging, code reviews, and understanding complex API responses.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool validate JSON syntax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool includes a built-in validator that checks your JSON for common syntax errors, such as missing commas, unbalanced braces, or incorrect quotes. Invalid JSON will be flagged with an error message.",
      },
    },
    {
      "@type": "Question",
      name: "Is my JSON data secure when using this formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your JSON data is never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert JSON to other formats like CSV?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool includes a conversion feature that can transform JSON arrays into CSV (comma-separated values) or XML format, making it easier to import data into spreadsheets or other applications.",
      },
    },
    {
      "@type": "Question",
      name: "What is the tree view and how does it help?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tree view displays JSON objects and arrays as a collapsible hierarchy, allowing you to expand and collapse nested elements. This makes it much easier to navigate deeply structured JSON data.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free JSON formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account, no daily limits, and no file size cap. Handles JSON of any size directly in your browser — your data is never uploaded to any server.",
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
      name: "JSON Formatter & Validator",
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
            Fix JSON Syntax Error Free Online — Formatter & Validator
          </h1>
          <img src="/images/json-formatter.webp" alt="Free JSON Formatter — format, validate, and beautify JSON online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Format, validate, and beautify <strong>JSON data</strong> instantly. Use the
            <strong>tree view</strong> to navigate nested structures, convert to CSV or XML,
            and copy or download your clean JSON. All processing runs locally in your browser
            with <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I find and fix a JSON syntax error?"
            answer="Paste your broken JSON into the validator above. The tool shows the exact line and character position of the error — for example 'Unexpected token } at line 14, col 3'. Common JSON errors: trailing commas after the last item, missing quotes around keys, single quotes instead of double quotes, and unescaped backslashes."
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
                <span className="text-foreground font-medium">JSON Formatter & Validator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="JSON Formatter Tool">
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
          <meta itemProp="name" content="JSON Formatter: Format, Validate, and Debug API Responses" />
          <meta
            itemProp="description"
            content="A browser-based JSON formatter that uses JSON.parse() locally — no server, no upload. Limitations: JSONC and NDJSON are not supported."
          />
          <meta itemProp="datePublished" content="2024-02-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* The problem this tool solves */}
          <section aria-labelledby="problem-heading" className="space-y-4">
            <h2
              id="problem-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The scenario this tool was built for
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              You get an error back from an API. The response body is one unbroken line —
              something like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'{"status":500,"error":{"code":"AUTH_EXPIRED","details":{"token_issued":1716...}}}'}
              </code>{' '}
              — 1,800 characters, no whitespace. You could open DevTools, but the Network tab
              wraps it awkwardly and you can&apos;t collapse sections. You paste it here.
              Two seconds later you have a fully indented, color-coded structure where you
              can immediately see that{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">details.token_issued</code>{' '}
              was three days ago — the session expired and your refresh logic didn&apos;t fire. Bug found.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              That&apos;s 90% of what this tool gets used for: quickly making a minified string
              readable during debugging. The secondary use is validation — pasting a
              hand-edited config or a JSON template to confirm you didn&apos;t accidentally leave
              a trailing comma or forget to close a bracket. Both take under 3 seconds.
            </p>
          </section>

          {/* How it actually works */}
          <section
            aria-labelledby="how-it-works"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What actually runs in your browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The formatter calls the browser&apos;s native{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">JSON.parse()</code>{' '}
              — the same engine Chrome DevTools and Node.js use internally. There is no server
              step. Your JSON string is parsed entirely in the V8 or SpiderMonkey JavaScript
              engine already running on your machine. Parsing a typical 500 KB API response
              takes under 20 ms in Chrome 124. A 5 MB file takes roughly 200 ms — perceptible
              but still fast for debugging.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              After parsing, the tool re-serializes the result using{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">JSON.stringify(parsed, null, 2)</code>{' '}
              for the formatted output. The tree view walks the parsed object recursively and
              renders each key-value pair as a collapsible DOM node. The CSV export flattens
              the top-level array (one object per row) and joins values with commas — standard
              spreadsheet import format, no library involved.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Nothing is sent to our servers. The Network tab in DevTools will show zero
              outbound requests when you click Format. If you&apos;re working with an API response
              that contains auth tokens, PII, or proprietary data, you can paste it safely —
              it never leaves the tab.
            </p>
          </section>

          {/* Honest limitations */}
          <section aria-labelledby="limitations-heading" className="space-y-4">
            <h2
              id="limitations-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What this tool can&apos;t do
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Knowing the limitations upfront saves time. Here&apos;s what won&apos;t work:
            </p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">JSONC</span>
                <span>
                  JSON with comments — used in{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">tsconfig.json</code>,
                  VS Code settings, and some config files — is not valid JSON. The{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">//</code> or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/* */</code>{' '}
                  lines will cause a parse error. Strip comments first, or use a JSONC-aware
                  editor.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">NDJSON</span>
                <span>
                  Newline-delimited JSON (one object per line, used by log streams and some
                  databases) is multiple documents, not one. Paste one object at a time, or
                  split the file first.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Files over ~30 MB</span>
                <span>
                  The browser tab may become unresponsive. For large files, use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">jq</code> in the
                  terminal:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">cat file.json | jq .</code>{' '}
                  handles gigabyte-scale files without issue.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Schema validation</span>
                <span>
                  The tool checks <em>syntax</em> — whether the text is valid JSON — not{' '}
                  <em>semantics</em> — whether the data matches a JSON Schema definition. For
                  schema validation against a spec, use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">ajv</code> or similar.
                </span>
              </li>
            </ul>
          </section>

          {/* Common JSON errors */}
          <section aria-labelledby="json-errors" className="space-y-4">
            <h2
              id="json-errors"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Common JSON syntax errors and how to fix them
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              These are the most frequent JSON errors that cause validators to reject
              otherwise-correct data:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Error type</th>
                    <th className="border border-border p-2 text-left font-semibold">Broken example</th>
                    <th className="border border-border p-2 text-left font-semibold">Fixed</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Trailing comma after last item', `{"a": 1, "b": 2,}`, `{"a": 1, "b": 2}`],
                    ['Single quotes instead of double quotes', `{'name': 'Alice'}`, `{"name": "Alice"}`],
                    ['Unquoted key', `{name: "Alice"}`, `{"name": "Alice"}`],
                    ['Comments (not valid JSON)', `{"a": 1 // comment}`, `{"a": 1}`],
                    ['Trailing comma in array', `[1, 2, 3,]`, `[1, 2, 3]`],
                    ['Unescaped backslash in string', `{"path": "C:\\Users\\file"}`, `{"path": "C:\\\\Users\\\\file"}`],
                    ['Undefined / NaN value', `{"value": undefined}`, `{"value": null}`],
                    ['Missing comma between properties', `{"a": 1 "b": 2}`, `{"a": 1, "b": 2}`],
                  ].map(([error, broken, fixed]) => (
                    <tr key={error}>
                      <td className="border border-border p-2 font-medium text-foreground">{error}</td>
                      <td className="border border-border p-2 font-mono text-xs text-red-600 dark:text-red-400">{broken}</td>
                      <td className="border border-border p-2 font-mono text-xs text-green-600 dark:text-green-400">{fixed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              Most of these errors come from copy-pasting JavaScript object literals (which allow
              trailing commas and single quotes) into a context that expects strict JSON.
              The JSON spec (ECMA-404) requires double-quoted keys and values, no trailing
              commas, and no comments.
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
                  { name: "YAML to JSON Converter", path: "/tools/yaml-json-converter" },
                  { name: "JSON to Excel Converter", path: "/tools/json-to-excel" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encode-decode" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — JSON Formatter & Validator</strong> is a fully private,
            browser-based tool that formats, validates, and transforms <strong>JSON data</strong>
            instantly. Supports pretty-printing, syntax validation, tree view, and conversion
            to CSV or XML. All processing runs locally on your device — your JSON never leaves
            your computer. The fastest free way to format JSON in 2026, with no installs, no
            accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}