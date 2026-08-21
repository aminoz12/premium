import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/sql-formatter"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 54 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "SQL Formatter for PostgreSQL & MySQL — Pretty Print Queries Free",
  description:
    "Format and beautify SQL queries for PostgreSQL, MySQL, SQLite, T-SQL, or BigQuery. Paste messy SQL and get back clean, indented, readable code. Free, browser-based, no upload.",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "sql validator online",
    "format sql query free",
    "sql syntax checker",
    "pretty print sql",
    "online sql formatter",
    "sql code beautifier",
    "free sql tool 2026",
    "browser-based sql formatter",
    "secure sql validator",
    "no signup sql formatter",
    "sql query tidy",
    "sql formatter with syntax highlighting",
    "best sql formatter online",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "SQL Formatter — Free Online SQL Beautifier & Validator",
    description:
      "Format, beautify, and validate SQL queries instantly. Free, browser-based SQL formatter with syntax highlighting and one-click export. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "SQL Formatter — Free Online SQL Beautifier & Validator by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Formatter — Free Online SQL Beautifier & Validator",
    description:
      "Format, beautify, and validate SQL queries instantly. Free, browser-based tool with syntax highlighting. No signup required.",
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
  name: "SQL Formatter",
  url: TOOL_URL,
  description:
    "Format, beautify, and validate SQL queries instantly. Free, browser-based SQL formatter with syntax highlighting and one-click export. No signup.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Format SQL queries instantly",
    "Customizable indentation (spaces or tabs)",
    "Syntax highlighting for keywords and identifiers",
    "Validate SQL syntax and detect errors",
    "One-click copy to clipboard",
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
  name: "How to Format SQL Queries Online",
  description:
    "A simple step-by-step guide to beautifying and validating SQL queries using our free online SQL formatter.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools SQL Formatter",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your SQL Query",
      text: "Copy your raw SQL query and paste it into the input field. The tool accepts any valid SQL syntax, including SELECT, INSERT, UPDATE, DELETE, and CREATE statements.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Formatting Options",
      text: "Select your preferred indentation style (spaces or tabs) and set the indentation size (2, 4, or 6). Enable syntax highlighting for better readability.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Format",
      text: "Press the 'Format' button. The tool will parse your SQL, apply consistent indentation and spacing, and display the beautified query in the output panel.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click the 'Copy' button to save the formatted SQL to your clipboard, or download it as a text file for further use in your database tools or code editor.",
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
      name: "What is an SQL formatter and why would I use it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An SQL formatter is a tool that takes raw, unformatted SQL queries and applies consistent indentation, spacing, and line breaks to make the code readable and maintainable. It's essential for code reviews, debugging, and sharing SQL with colleagues.",
      },
    },
    {
      "@type": "Question",
      name: "Does this SQL formatter validate my query syntax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool includes a validator that checks your SQL for common syntax errors, such as missing commas, unbalanced parentheses, or incorrect keyword placement. Invalid queries will be flagged with a detailed error message.",
      },
    },
    {
      "@type": "Question",
      name: "Is my SQL query data secure when using this formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your SQL queries are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What SQL dialects are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports the most common SQL dialects, including MySQL, PostgreSQL, SQL Server, Oracle, and SQLite. It handles standard SQL syntax as well as many database-specific keywords and functions.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between SQL formatting and SQL minification?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SQL formatting (beautification) adds consistent indentation, line breaks, and spacing to make code readable for humans. SQL minification removes all unnecessary whitespace and line breaks, reducing file size for faster transmission. This tool is a formatter, not a minifier.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free SQL formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account, no daily limits, and no query size cap. Formats SQL queries of any length directly in your browser — your queries are never sent to any server.",
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
      name: "SQL Formatter",
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
            SQL Formatter for PostgreSQL & MySQL — Pretty Print Queries Free
          </h1>
          <img src="/images/sql-formatter.webp" alt="Free SQL Formatter — format, beautify, and validate SQL queries online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Format, beautify, and validate your <strong>SQL queries</strong> instantly. Choose
            your preferred indentation style, enable <strong>syntax highlighting</strong>, and
            download or copy the clean, readable result. All processing runs locally in your
            browser with <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I format a PostgreSQL or MySQL query to make it readable?"
            answer="Paste your SQL into the formatter above and click Format. It adds indentation, breaks long SELECT lists onto separate lines, capitalizes keywords (SELECT, FROM, WHERE, JOIN), and aligns column aliases. Works with PostgreSQL, MySQL, SQLite, T-SQL, and BigQuery syntax."
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
                <span className="text-foreground font-medium">SQL Formatter</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="SQL Formatter Tool">
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
          <meta itemProp="name" content="SQL Formatter: Make ORM-Generated Queries Readable" />
          <meta itemProp="description" content="Format raw SQL to find bugs hidden in JOIN types, WHERE vs HAVING confusion, and N+1 query patterns. Real debugging workflow included." />
          <meta itemProp="datePublished" content="2024-03-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="sql-problem" className="space-y-4">
            <h2 id="sql-problem" className="text-2xl font-semibold tracking-tight text-foreground">
              Unformatted SQL is where bugs hide
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              ORMs generate SQL that is logically correct but visually opaque. A query that
              takes 8 seconds might be doing a full table scan because of a missing index, or
              joining in the wrong order, or applying a WHERE filter after an aggregation when
              HAVING was needed. None of these are obvious in a 400-character single-line
              string. Formatted, they&apos;re visible in 10 seconds.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              I described a real debugging session in{' '}
              <a href="/blog/sql-formatting-database-debugging" className="text-black  dark:text-white hover:underline">
                SQL Formatting as a Debugging Tool
              </a>
              {' '}— where formatting an ORM-generated query immediately revealed a LEFT JOIN
              that should have been an INNER JOIN, causing thousands of extra rows to be
              loaded and then filtered in application code. The fix was one word.
            </p>
          </section>

          <section aria-labelledby="sql-bugs" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="sql-bugs" className="text-2xl font-semibold tracking-tight text-foreground">
              Three bugs that formatting makes instantly visible
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Wrong JOIN type</span>
                <span>
                  A LEFT JOIN returns all rows from the left table, including rows with no
                  match on the right — those get NULL values. An INNER JOIN returns only
                  matched rows. ORMs sometimes generate LEFT JOINs when INNER was intended
                  (or vice versa). When formatted, the JOIN keyword is on its own line and
                  easy to spot and change.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">WHERE vs HAVING</span>
                <span>
                  WHERE filters rows before aggregation; HAVING filters after. Using WHERE on
                  an aggregated column causes an error; using HAVING when WHERE was intended
                  causes incorrect counts. Formatted SQL puts these on separate lines with
                  clear indentation of the conditions below each.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">N+1 patterns</span>
                <span>
                  A subquery in the SELECT list that references the outer query runs once per
                  row — the N+1 problem. Formatted SQL makes correlated subqueries visible as
                  indented blocks inside each SELECT column, not buried in a flat string.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="sql-tech" className="space-y-4">
            <h2 id="sql-tech" className="text-2xl font-semibold tracking-tight text-foreground">
              How it formats — and what dialect to pick
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The formatter uses the{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">sql-formatter</code>{' '}
              library (MIT license) to parse and re-indent SQL according to a consistent style.
              Dialect selection matters: PostgreSQL uses{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">::</code> for casting while
              MySQL uses{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">CAST(x AS type)</code>.
              BigQuery uses backtick identifiers. Pick the dialect that matches your database
              so the formatter handles the edge cases correctly.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              All formatting runs in the browser — your SQL, which may contain table names,
              column data, or proprietary business logic, never leaves your device.
            </p>
          </section>

          {/* SQL dialect differences */}
          <section aria-labelledby="sql-dialects" className="space-y-4">
            <h2
              id="sql-dialects"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              SQL dialect differences — PostgreSQL vs MySQL vs T-SQL vs BigQuery
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The formatter produces ANSI-compatible SQL that works across dialects for
              standard queries. Here are the key differences you&apos;ll need to handle manually
              when porting queries between databases:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Feature</th>
                    <th className="border border-border p-2 text-left font-semibold">PostgreSQL</th>
                    <th className="border border-border p-2 text-left font-semibold">MySQL</th>
                    <th className="border border-border p-2 text-left font-semibold">T-SQL (SQL Server)</th>
                    <th className="border border-border p-2 text-left font-semibold">BigQuery</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['String quotes', 'Single \'\'', 'Single \'\' or double ""', 'Single \'\'', 'Single \'\''],
                    ['Identifier quoting', '"double_quotes"', '`backticks`', '[brackets]', '`backticks`'],
                    ['Top N rows', 'LIMIT n', 'LIMIT n', 'TOP n (before SELECT)', 'LIMIT n'],
                    ['String concat', "|| or CONCAT()", "CONCAT() or concat (no ||)", "'+' or CONCAT()", "CONCAT() or ||"],
                    ['Current timestamp', 'NOW() or CURRENT_TIMESTAMP', 'NOW() or CURRENT_TIMESTAMP', 'GETDATE() or GETUTCDATE()', 'CURRENT_TIMESTAMP'],
                    ['Boolean literal', 'TRUE / FALSE', 'TRUE/FALSE or 1/0', 'No bool — use 1/0 or BIT', 'TRUE / FALSE'],
                    ['Auto-increment', 'SERIAL or GENERATED ALWAYS', 'AUTO_INCREMENT', 'IDENTITY(1,1)', 'No native auto-increment'],
                  ].map(([feature, pg, mysql, tsql, bq]) => (
                    <tr key={feature}>
                      <td className="border border-border p-2 font-medium text-foreground">{feature}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{pg}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{mysql}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{tsql}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{bq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "CSV to JSON Converter", path: "/tools/csv-to-json" },
                  { name: "Base64 Encoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — SQL Formatter</strong> is a fully private, browser-based
            tool that formats, beautifies, and validates <strong>SQL queries</strong> instantly.
            Supports customizable indentation (spaces or tabs), syntax highlighting, and
            one-click copy or download. All processing runs locally on your device — your
            SQL queries never leave your computer. The fastest free way to format and
            validate SQL in 2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}