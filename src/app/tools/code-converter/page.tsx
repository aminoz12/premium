import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ClientPage from "./client-page"
import type { Metadata } from "next"

// ─── Absolute URL constants ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/code-converter`

// ─── FAQ data (single source of truth — mirrors JSON-LD exactly) ───────────
export const FAQ_ITEMS = [
  {
    q: "How do I use the AI code converter?",
    a: "Select your source language from the first dropdown, pick your target language from the second, paste your code snippet into the input field, then click 'Convert Code'. The AI returns idiomatic code in the target language along with notes on key differences such as null handling and standard library changes.",
  },
  {
    q: "Which programming language conversions are supported?",
    a: "Supported conversions include Python ↔ JavaScript, Python ↔ TypeScript, JavaScript ↔ TypeScript, Java ↔ Kotlin, Java ↔ C#, Python ↔ Go, Python ↔ Rust, JavaScript ↔ PHP, and SQL dialect conversions across MySQL, PostgreSQL, SQLite, SQL Server (T-SQL), and Oracle SQL — covering 15+ languages and 100+ language pair combinations.",
  },
  {
    q: "Does it produce idiomatic code or just translate syntax?",
    a: "The AI produces idiomatic code in the target language — using the right data structures, conventions, and patterns for that language. For example, converting Python list comprehensions to JavaScript produces proper .map()/.filter() chains, not for-loop equivalents. Conversion notes flag non-obvious differences like error handling and null semantics.",
  },
  {
    q: "How long can the code be, and are there any limits?",
    a: "The tool works best with individual functions, classes, or modules up to approximately 200 lines. For larger files, convert section by section for the best results. Free usage allows up to 5 conversions per hour with no account required.",
  },
  {
    q: "Is the converted code reviewed before being sent to a server?",
    a: "Your code is sent securely to the AI model for conversion and is not stored, logged, or shared. No account is required and no data is retained after the conversion is returned to your browser.",
  },
  {
    q: "What is the difference between syntax translation and idiomatic conversion?",
    a: "Syntax translation is a mechanical line-by-line swap that preserves the original language's structure — the result often looks foreign and awkward in the target language. Idiomatic conversion rewrites code using the target language's natural patterns, data structures, and conventions, producing code that a native developer of that language would actually write.",
  },
  {
    q: "Is this code converter free to use?",
    a: "Yes. TheFreeAITools.com provides free code conversion with up to 5 conversions per hour. No account, subscription, or credit card is required.",
  },
  {
    q: "Can it convert SQL between dialects and config formats like JSON to YAML?",
    a: "Yes on both counts. SQL conversion handles dialect differences including date functions, string concatenation, and LIMIT/TOP syntax between MySQL, PostgreSQL, SQLite, SQL Server, and Oracle. For configuration files, select the source and target formats — JSON, YAML, TOML, and similar structured data formats are all supported.",
  },
]

// ─── Metadata ──────────────────────────────────────────────────────────────
// Title: "Free Code Converter: AI Language Translation Tool" = 54 characters ✓
export const metadata: Metadata = {
  ...buildToolMetadata("code-converter"),
  title: "Free Code Converter: AI Language Translation Tool",
  description:
    "Convert Python to JavaScript, Java to C#, TypeScript to Python, and 100+ pairs. Free AI code converter — idiomatic output, not just syntax swaps.",
  keywords: [
    "code converter",
    "convert code online",
    "python to javascript converter",
    "javascript to typescript converter",
    "java to kotlin converter",
    "java to csharp converter",
    "python to go converter",
    "python to rust converter",
    "ai code converter free",
    "code language converter online",
    "translate code between languages ai",
    "convert code without login",
    "browser-based code converter",
    "sql dialect converter online",
    "idiomatic code converter 2026",
    "free code migration tool",
    "typescript to python converter",
    "python to typescript online",
    "code porting tool free",
    "convert code using ai no upload",
    "language to language code converter",
    "code translator online free",
    "convert json to yaml online",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free AI Code Converter — Python to JS, Java to C# & 100+ Pairs",
    description:
      "Instantly convert code between 15+ languages with idiomatic output — not just a syntax swap. Supports Python, TypeScript, Java, Go, Rust, SQL dialects & more. Free, no login.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Code Converter — TheFreeAITools.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Code Converter: Python→JS, Java→C# & More | TheFreeAITools",
    description:
      "Convert code between 15+ languages in seconds. AI produces idiomatic output — not literal syntax translation. Free, no account.",
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

// ─── JSON-LD schemas ───────────────────────────────────────────────────────
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Code Converter",
  url: TOOL_URL,
  description:
    "AI-powered code converter that translates code between programming languages with idiomatic output. Supports Python, JavaScript, TypeScript, Java, C#, Go, Rust, Kotlin, PHP, Ruby, SQL dialects, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires JavaScript. Chrome 88+, Firefox 85+, Safari 14+, Edge 88+.",
  featureList: [
    "15+ programming languages including Python, JavaScript, TypeScript, Java, Go, Rust, Kotlin, C#, PHP, Ruby, Swift, Bash",
    "SQL dialect conversion: MySQL, PostgreSQL, SQLite, SQL Server (T-SQL), Oracle SQL",
    "Idiomatic output — uses target language conventions, not literal syntax swap",
    "Quick-select popular language pairs for one-click conversion setup",
    "Conversion notes and warnings for null handling, error handling, and library differences",
    "Configuration file conversion: JSON, YAML, TOML",
    "No account, login, or subscription required — up to 5 free conversions per hour",
    "Instant in-browser conversion with no file upload needed",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert Code Between Languages with AI",
  description:
    "Use this free AI code converter to translate any code snippet to another programming language in under a minute.",
  totalTime: "PT1M",
  tool: [{ "@type": "HowToTool", name: "TheFreeAITools Code Converter" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select Your Source Language",
      text: "Open the source language dropdown and choose the programming language your code is currently written in, such as Python, Java, or TypeScript.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Your Target Language",
      text: "Open the target language dropdown and choose the language you want to convert your code into, such as JavaScript, Go, or C#.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Paste Your Code",
      text: "Paste the code snippet, function, class, or module you want to convert into the left-hand input panel. The tool works best with snippets up to ~200 lines.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Click Convert Code and Review",
      text: "Press the 'Convert Code' button. Review the AI-generated idiomatic conversion in the right panel, along with any notes on key differences such as error handling or null semantics.",
      url: TOOL_URL,
    },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
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
      name: "Developer Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Code Converter",
      item: TOOL_URL,
    },
  ],
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
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

      <>
        <header className="mb-6 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Code Converter — Convert Code Between Languages with AI
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Instantly convert <strong>Python to JavaScript</strong>,{" "}
            <strong>Java to C#</strong>,{" "}
            <strong>TypeScript to Python</strong>, and 100+ other language
            combinations. The AI produces idiomatic code in the target language
            — not just a syntax swap — with notes on key differences. Free, no
            login required.
          </p>
          <QuickAnswer
            question="What is an AI code converter?"
            answer="An AI code converter translates code from one programming language to another, producing idiomatic output that follows the conventions of the target language — not just a line-by-line syntax swap."
          />
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex items-center gap-1">
              <li>
                <a
                  href={`${SITE_URL}/`}
                  className="hover:underline"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a
                  href={`${SITE_URL}/tools`}
                  className="hover:underline"
                >
                  Developer Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">Code Converter</li>
            </ol>
          </nav>
        </header>

        <ClientPage faqs={FAQ_ITEMS} />

        <EmailCapture />

        <hr className="my-10 border-border" />

        {/* ── Rich article for AdSense content quality ── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Code Converter: What Translates Well Between Languages and What Doesn't" />
          <meta
            itemProp="description"
            content="Which code patterns translate accurately between languages, where automatic conversion always needs human review, and the three language pairs that convert most reliably."
          />
          <meta itemProp="datePublished" content="2024-04-12" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What translates well */}
          <section aria-labelledby="what-translates" className="space-y-4">
            <h2
              id="what-translates"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What translates well between languages
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Algorithms with straightforward control flow — loops, conditionals,
              arithmetic, string manipulation — translate accurately between most
              mainstream languages. A Python function that sorts a list, filters by
              condition, and returns a transformed result maps cleanly to JavaScript,
              TypeScript, Java, or Go. The logic is language-agnostic; only the
              syntax differs.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The most reliable language pairs: <strong>JavaScript ↔ TypeScript</strong>
              (same runtime, TypeScript is a superset), <strong>Python ↔ JavaScript</strong>
              for data processing logic (similar high-level constructs), and{' '}
              <strong>Java ↔ C#</strong> (similar OOP model, similar standard library
              patterns). These pairs produce output that requires minimal manual cleanup.
            </p>
          </section>

          {/* What always needs review */}
          <section
            aria-labelledby="needs-review"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="needs-review"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What always needs human review after conversion
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Memory management</span>
                <span>
                  Languages with manual memory management (C, C++, Rust) require
                  explicit allocation and deallocation that has no equivalent in
                  garbage-collected languages. Conversion produces functionally correct
                  code but may introduce memory leaks or dangling pointer risks that
                  a converter cannot handle automatically.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Concurrency models</span>
                <span>
                  Python&apos;s GIL, JavaScript&apos;s event loop, Go&apos;s goroutines, and Java&apos;s
                  threads are fundamentally different. Concurrent code that works
                  correctly in one language may be semantically wrong or unsafe
                  after direct translation to another.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Standard library differences</span>
                <span>
                  A Python function that uses{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">datetime.strptime()</code>{' '}
                  doesn&apos;t directly map to JavaScript&apos;s{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Date</code> API —
                  the format strings are different and the timezone handling is inconsistent.
                  Library-dependent code always needs manual verification.
                </span>
              </li>
            </ul>
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
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "Error Message Solver", path: "/tools/error-message-solver" },
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>TheFreeAITools — Code Converter</strong> is a free AI tool
            that translates code between programming languages with idiomatic
            output — not a literal syntax swap. Supports{" "}
            <strong>
              Python, JavaScript, TypeScript, Java, Kotlin, C, C++, C#, Go,
              Rust, Ruby, PHP, Swift, Bash
            </strong>
            , plus SQL dialect conversion between{" "}
            <strong>MySQL, PostgreSQL, SQLite, SQL Server, and Oracle SQL</strong>
            . Configuration file conversion between{" "}
            <strong>JSON, YAML, and TOML</strong> is also supported. Your code
            is never stored or logged — conversions are processed securely and
            returned directly to your browser. Updated for 2026.
          </p>
        </footer>
      </>
    </>
  )
}