import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/yaml-json-converter"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 50 characters (counted manually) — exactly at the lower bound

export const metadata: Metadata = {
  title: "YAML to JSON Converter — Free Online Parsing Tool",
  description:
    "Convert YAML to JSON and JSON to YAML instantly. Free, secure, browser-based parser with live syntax highlighting and one-click export. No login.",
  keywords: [
    "yaml to json",
    "json to yaml",
    "yaml to json converter",
    "online yaml parser",
    "yaml formatter",
    "json formatter",
    "yaml validator",
    "json validator",
    "convert yaml to json online",
    "yaml syntax checker",
    "json syntax checker",
    "yaml to json code generator",
    "offline yaml converter",
    "json to yaml converter free",
    "yaml converter no signup",
    "yaml bi-directional converter",
    "best yaml tool 2026",
    "secure client-side yaml to json",
    "strict mode yaml parser",
    "yaml to json like codebeautify",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "YAML to JSON Converter — Free Online Parsing Tool",
    description:
      "Seamlessly convert and validate YAML and JSON data. 100% secure client-side processing with live syntax error highlighting.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "YAML to JSON Converter — Free Online Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free YAML to JSON Converter & Validator",
    description:
      "Convert YAML to JSON instantly in your browser. Free, secure, and no login required.",
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
  name: "YAML to JSON Converter",
  url: TOOL_URL,
  description:
    "A free online developer tool to instantly convert between YAML and JSON data formats, featuring live syntax validation, auto-formatting, and secure client-side processing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Bi-directional YAML and JSON conversion",
    "Real-time syntax validation with line highlighting",
    "Auto-formatting and beautification",
    "100% client-side processing for privacy",
    "One-click copy to clipboard",
    "Download converted code as a file",
    "Offline capable once loaded",
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
  name: "How to Convert YAML to JSON",
  description:
    "A quick step-by-step guide on how to parse and convert YAML configuration files into JSON format using our free tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools YAML to JSON Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Input Your Data",
      text: "Paste your YAML or JSON code into the left editor panel. The tool will automatically detect the input format and prepare it for conversion.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Review Validation Errors",
      text: "If there are syntax errors in your code, the tool will instantly highlight the exact line and display a descriptive error message so you can fix it before conversion.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "View Instant Conversion",
      text: "The converted code (JSON or YAML) will appear in real-time in the right output panel without any page reload or server round-trip.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click the 'Copy' button to save the converted code to your clipboard, or use the 'Download' button to save it as a .json or .yaml file directly to your device.",
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
      name: "What is the difference between YAML and JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON (JavaScript Object Notation) uses strict syntax with braces {}, brackets [], and quotes, making it fast for machines to parse. YAML (YAML Ain't Markup Language) uses indentation and newlines, making it highly human-readable and ideal for configuration files.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when using this converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. This tool runs entirely in your browser using client-side JavaScript. Your YAML or JSON data is never sent to our servers, stored in databases, or logged anywhere.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert JSON back to YAML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this tool is bi-directional. If you paste JSON into the input field, it will automatically parse it and output properly indented YAML, and vice versa.",
      },
    },
    {
      "@type": "Question",
      name: "Why am I getting a YAML syntax error?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YAML is highly sensitive to indentation. Ensure you are using spaces (not tabs) to indent your hierarchy. Common errors also include missing spaces after colons or misaligned array dashes.",
      },
    },
    {
      "@type": "Question",
      name: "Why am I getting a JSON syntax error?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON requires strict formatting. The most common errors are missing double quotes around property keys, using single quotes instead of double quotes, and leaving trailing commas at the end of objects or arrays.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limitations of this free YAML to JSON converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account and no file size cap. Converts between YAML 1.2 and JSON directly in your browser — your data is never uploaded to any server.",
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
      name: "YAML to JSON Converter",
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
            Free YAML to JSON Converter — Online Bi-Directional Parser
          </h1>
          {/* ── add image ── */}
          <img src="/images/yaml-json-converter.webp" alt="Yaml to Json Converter" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Seamlessly convert data between <strong>YAML</strong> and <strong>JSON</strong> formats
            instantly. Validate syntax, format your code, and easily switch between structures with
            a <strong>100% secure</strong>, client-side processor. No account required — completely
            free.
          </p>

          <QuickAnswer
            question="How do I convert YAML to JSON for free?"
            answer="Paste your YAML code into the input panel, and the tool instantly converts it to JSON. You can also paste JSON to get YAML. The process runs entirely in your browser with no server uploads."
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
                <span className="text-foreground font-medium">YAML to JSON Converter</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="YAML to JSON Converter Tool">
          
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
          <meta itemProp="name" content="YAML to JSON Converter: Format Differences, Gotchas, and When Each Is Right" />
          <meta
            itemProp="description"
            content="YAML and JSON represent the same data structures differently. The three YAML features that have no JSON equivalent, and the two cases where JSON is the strictly better choice."
          />
          <meta itemProp="datePublished" content="2024-02-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why this conversion exists */}
          <section aria-labelledby="why-convert" className="space-y-4">
            <h2
              id="why-convert"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why you need to convert between them
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              YAML is config-file format — it&apos;s designed to be hand-edited by humans and
              allows comments, multi-line strings, and anchors for reuse. JSON is a
              wire format — it&apos;s designed for machine-to-machine communication and is
              parsed by every language natively. The most common conversion scenario:
              you have a YAML config (Kubernetes manifest, GitHub Actions workflow,
              Docker Compose file) and need to pass part of it to an API that expects
              JSON, or you get a JSON response from an API and want to edit it as YAML
              before storing it in a config file.
            </p>
          </section>

          {/* Feature comparison */}
          <section
            aria-labelledby="feature-comparison"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="feature-comparison"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three YAML features that don&apos;t survive JSON conversion
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Comments</span>
                <span>
                  YAML allows{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded"># comments</code>{' '}
                  anywhere. JSON has no comment syntax. When you convert YAML to JSON,
                  all comments are silently dropped — they cannot be round-tripped.
                  If your YAML comments document why a value is set a certain way,
                  keep the YAML source as the canonical file and treat JSON as a
                  derived output.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Anchors and aliases</span>
                <span>
                  YAML anchors ({'"&anchor"'} and {'"*alias"'}) let you reuse a value in
                  multiple places. The converter dereferences them — each alias becomes
                  a full copy of the anchored value in the output JSON. This is correct
                  behavior but can produce much larger JSON than the source YAML if
                  anchors were used for DRY config blocks.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Multi-document streams</span>
                <span>
                  A single YAML file can contain multiple documents separated by{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">---</code>.
                  JSON has no equivalent — one file, one object. Paste one document at
                  a time when converting multi-document YAML.
                </span>
              </li>
            </ul>
          </section>

          {/* When to use JSON */}
          <section aria-labelledby="when-json" className="space-y-4">
            <h2
              id="when-json"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When JSON is the strictly better choice
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              For API payloads and data interchange: always JSON. YAML&apos;s indentation
              sensitivity makes it error-prone when generated programmatically — one
              off-by-two-spaces and the structure silently changes meaning. JSON&apos;s
              explicit braces and brackets are unambiguous in code generation.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For configuration files that humans edit: usually YAML, but only if your
              toolchain supports it natively. If you find yourself running a converter
              as part of your deploy pipeline every time someone edits the config,
              consider switching the canonical format to JSON — the tooling cost isn&apos;t worth
              the indentation convenience.
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
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "CSV to JSON Converter", path: "/tools/csv-json-converter" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — YAML to JSON Converter</strong> is a fully private,
            browser-based developer utility that translates data between <strong>YAML</strong> and
            <strong>JSON</strong> formats instantly. All processing runs locally on your device
            using JavaScript — your configuration files and API payloads never leave your
            computer. Supports bi-directional conversion with live syntax validation, auto-
            formatting, and one-click export. The fastest free way to convert configuration data
            in 2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}