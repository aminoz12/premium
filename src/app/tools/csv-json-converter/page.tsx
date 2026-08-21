import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URLs ─────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/csv-json-converter`

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    "Free CSV to JSON & JSON to CSV Converter – Private & Free", // 57 chars
  description:
    "Convert CSV to JSON and JSON to CSV instantly in your browser. 100% client-side, private, and free. No uploads, no account required.", // 131 chars
  keywords: [
    "csv to json converter",
    "convert csv to json online free",
    "csv to json converter no upload",
    "json to csv converter browser",
    "free online csv to json tool",
    "csv to json array converter 2026",
    "csv to json parser private",
    "developer data format converter",
    "csv to json converter tool",
    "online csv to json free",
    "json to csv file converter",
    "client-side csv converter",
    "csv to json no sign up",
    "bi-directional csv json tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title:
      "Free CSV to JSON Converter – Bi-Directional Online Tool", // 51 chars
    description:
      "Convert between CSV and JSON formats instantly in your browser. No file uploads – all processing stays on your device. Free and private.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "CSV to JSON Converter – Free Online Developer Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV ↔ JSON Converter – Free & Private", // 33 chars
    description:
      "Convert CSV to JSON or flatten JSON to CSV directly in your browser. No uploads, no sign‑up. Fast, free, private.",
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

// ─── JSON‑LD Structured Data ───────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSV to JSON Converter",
  url: TOOL_URL,
  description:
    "A free, private, browser‑based tool to convert CSV data to JSON arrays and flatten JSON objects back to CSV files. No server uploads, all processing happens locally on your device.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert CSV to JSON array of objects with automatic header‑to‑key mapping",
    "Flatten JSON arrays into CSV tables with consistent column ordering",
    "Handle embedded commas, newlines, and quotes inside CSV cells",
    "Upload CSV/JSON files via HTML5 FileReader – no server round‑trips",
    "Instant bi‑directional conversion with real‑time preview",
    "Copy output to clipboard or download as .csv / .json file",
    "100% client‑side processing – your data never leaves your device",
    "Robust error reporting with clear messages for malformed input",
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
  name: "How to Convert Between CSV and JSON",
  description:
    "Convert a CSV file to JSON or flatten JSON to CSV in under a minute using this free browser tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools CSV to JSON Converter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste or Upload Your Data",
      text: "Type or paste your CSV / JSON text directly, or use the file upload button to load a .csv or .json file from your device.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Conversion Direction",
      text: "Select the CSV → JSON tab to parse tabular data into an array of objects, or the JSON → CSV tab to flatten structured data into a table.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Convert",
      text: "Hit the “Convert” button. The tool instantly processes your data and displays the transformed output in the preview panel.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download the Result",
      text: "Copy the converted text to your clipboard with one click, or download it as a .csv or .json file ready for use in your applications.",
      url: TOOL_URL,
    },
  ],
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I convert CSV to JSON using this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply paste your CSV data (or upload a .csv file) into the input area, make sure the CSV → JSON tab is active, and click Convert. The tool parses the first row as headers and returns an array of JSON objects. You can then copy or download the result.",
      },
    },
    {
      "@type": "Question",
      name: "What CSV and JSON formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The converter follows the RFC 4180 standard for CSV, using commas as delimiters and double‑quotes for escaping. It expects JSON input to be a valid array of objects where each object represents a row. Malformed JSON or non‑compliant CSV will trigger a clear error message.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the converted data as a file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After conversion, you can download the output as a .csv or .json file directly. The download button preserves accurate formatting so the file works immediately in other tools or applications.",
      },
    },
    {
      "@type": "Question",
      name: "Are my uploaded files sent to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The tool uses the HTML5 FileReader API to read files directly into your browser's memory. All processing happens locally on your device, and your data never travels over the internet. This guarantees complete privacy for sensitive datasets.",
      },
    },
    {
      "@type": "Question",
      name: "Why must JSON be an array of objects for CSV conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CSV represents a two‑dimensional table of rows and columns. A JSON array of objects naturally maps to that structure: each object becomes a row, and the object keys become the column headers. A single flat JSON object cannot be turned into a multi‑row table, so the converter requires the array format.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a file size limit for conversions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are no hard file‑size limits because processing happens in your browser. Performance depends on your device's RAM and CPU. Typically, files up to 10 MB convert almost instantly. Very large files (100+ MB) may cause temporary browser lag.",
      },
    },
  ],
}

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
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "CSV to JSON Converter",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ─────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* JSON‑LD Scripts */}
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

      <div className="  px-4 py-8">
        {/* ── Header with Breadcrumb ── */}
        <header className="space-y-4 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Free CSV ↔ JSON Converter
          </h2>
          <QuickAnswer
            question="How do I convert a CSV file to JSON format?"
            answer={"To convert CSV to JSON: paste your CSV data into the input (including the header row), select 'CSV → JSON' mode, and click Convert. Each CSV row becomes a JSON object with keys taken from the header row. For example: Name,Age / Alice,30 becomes [{\"Name\":\"Alice\",\"Age\":\"30\"}]. To reverse (JSON → CSV), paste a JSON array of objects and select 'JSON → CSV' — the tool extracts keys as headers automatically. All conversion runs in your browser with no file upload."}
          />
          <img src="/images/csv-json-converter.webp" alt="Free CSV to JSON Converter — convert CSV files to JSON format online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            A fast, bi‑directional data conversion tool for developers and data analysts.
            Translate CSV data into structured JSON arrays, or flatten JSON objects back into
            readable CSV files — all securely in your browser.
          </p>

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
                  Developer Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">CSV to JSON Converter</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool ── */}
        <main>
          <ToolClient />
        </main>

        <hr className="border-border" />

        {/* ─── AdSense High‑Value Content Article (800+ words) ──────────── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSV to JSON Converter: Data Type Inference, Edge Cases, and What Gets Lost" />
          <meta
            itemProp="description"
            content="Why CSV-to-JSON conversion is trickier than it looks, the edge cases that silently corrupt data, and when to use the tool vs. a parsing library."
          />
          <meta itemProp="datePublished" content="2024-03-25" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why conversion is tricky */}
          <section aria-labelledby="why-tricky" className="space-y-4">
            <h2
              id="why-tricky"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why CSV-to-JSON is trickier than it looks
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              CSV has no formal type system — every value is text. A converter has to
              guess whether{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">42</code>{' '}
              should become the JSON number{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">42</code>{' '}
              or the string{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">"42"</code>,
              and whether{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">true</code>{' '}
              is a boolean or a value in a column called &quot;Status&quot;. The wrong guess
              silently corrupts data — a leading-zero zip code{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">01234</code>{' '}
              parsed as a number becomes{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">1234</code>.
              Phone numbers, ID codes, and version strings all suffer the same problem.
            </p>
          </section>

          {/* Edge cases */}
          <section
            aria-labelledby="edge-cases"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="edge-cases"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Edge cases that silently corrupt your data
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Quoted fields with embedded commas</span>
                <span>
                  CSV spec (RFC 4180) allows comma-containing values if wrapped in
                  double quotes:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{'"New York, NY"'}</code>.
                  A naive splitter on{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">,</code>{' '}
                  breaks this into two fields. Always verify the converter handles quoted fields.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Newlines inside quoted fields</span>
                <span>
                  A CSV field can contain a literal newline if quoted:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">&quot;line1\nline2&quot;</code>.
                  Converters that split on line breaks first will produce a corrupt
                  parse for multi-line values.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Leading zeros</span>
                <span>
                  US zip codes, ISBNs, product codes, and phone numbers often have
                  leading zeros. Auto-typed as numbers, the zeros are dropped. Treat
                  all ID and code columns as strings — check the output values
                  carefully before using in production.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Inconsistent row length</span>
                <span>
                  Some CSV exports produce rows with fewer columns than the header.
                  The converter should fill missing fields with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">null</code>{' '}
                  or omit the key entirely — verify which behavior your downstream
                  code expects.
                </span>
              </li>
            </ul>
          </section>

          {/* When to use a library */}
          <section aria-labelledby="use-library" className="space-y-4">
            <h2
              id="use-library"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use a parsing library instead
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              For one-off exploration or small files, this tool is the fastest option.
              For production code that ingests CSV (user uploads, data pipelines, ETL),
              use a proper parsing library:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">Papa Parse</code>{' '}
              in the browser (handles all RFC 4180 edge cases, streams large files),{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">csv-parse</code>{' '}
              in Node.js, or{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">pandas.read_csv()</code>{' '}
              in Python. These handle quoted fields, multi-line values, and encoding
              issues that simple implementations miss.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related data tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "YAML to JSON Converter", path: "/tools/yaml-json-converter" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — CSV to JSON Converter</strong> is a fully private,
            browser‑based developer tool that instantly converts between
            <strong> CSV (tabular data) and JSON (structured arrays)</strong>. Bi‑directional,
            supports file uploads, handles complex parsing, and never uploads your data to a
            server — making it the safest free converter for sensitive datasets in 2026.
          </p>
        </footer>
      </div>
    </>
  )
}