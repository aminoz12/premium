import { Metadata } from "next"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ClientPage from "./client-page"

// ─── Absolute URLs ───────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const CATEGORY_SLUG = "tools"
const TOOL_SLUG = "error-message-solver"
const TOOL_URL = `${SITE_URL}/${CATEGORY_SLUG}/${TOOL_SLUG}`

// ─── FAQ data (8 questions) ──────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: "What is an error message solver?",
    a: "An error message solver is an AI tool that reads your error log or stack trace, identifies the root cause, and gives you step-by-step instructions to fix the problem — saving you from hours of Stack Overflow searching.",
  },
  {
    q: "Which error types and languages does this support?",
    a: "It supports errors from Python, JavaScript, TypeScript, Node.js, Java, C++, C#, Go, Rust, PHP, Ruby, and more. It also handles framework-specific errors from React, Next.js, Django, Spring, Laravel, and others.",
  },
  {
    q: "How much of the error log should I paste?",
    a: "Paste the full stack trace including the error type, message, and file/line references. The more context you provide, the more accurate the diagnosis. You can safely omit sensitive data like API keys or passwords.",
  },
  {
    q: "Will it give me a code fix?",
    a: "Yes. When possible, the AI provides a corrected code snippet or specific file/line changes alongside the explanation. Complex architectural issues get step-by-step remediation instructions instead.",
  },
  {
    q: "Is this error solver free?",
    a: "Yes. TheFreeAITools.com provides free error analysis with up to 5 diagnoses per hour. No account or subscription required.",
  },
  {
    q: "What if my error is from a library or package?",
    a: "Paste the full error including the library name. The AI understands popular npm, PyPI, Maven, and other package errors and can suggest the correct version, import fix, or configuration change.",
  },
  {
    q: "Can it help with CORS, 403, 404, and other HTTP errors?",
    a: "Yes. HTTP errors, API errors, and server logs are fully supported. Include the request URL, method, and any relevant response data for the best diagnosis.",
  },
  {
    q: "Does it work for build errors and CI failures?",
    a: "Yes. Paste build output from webpack, Vite, Next.js, Maven, Gradle, Cargo, or any CI pipeline and get targeted fix instructions.",
  },
]

// ─── Metadata ────────────────────────────────────────────────────────────────
const baseMetadata = buildToolMetadata(TOOL_SLUG)

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Free Error Message Solver — AI Debugger & Code Fixer", // 51 chars
  description:
    "Paste any error log and get instant root cause analysis and fixes. Supports Python, JavaScript, Java, TypeScript, Node.js, Ruby, Go, and more. Free.", // 160 chars
  keywords: [
    "error message solver",
    "fix error code ai",
    "stack trace analyzer",
    "ai error solver",
    "free error message solver",
    "debug error online",
    "error message explainer",
    "fix javascript error",
    "fix python error",
    "error log analyzer 2026",
    "browser-based error fixer",
    "no upload error solver",
    "ai debugging tool",
    "code error fix generator",
  ],
  alternates: {
    ...(baseMetadata.alternates as Record<string, unknown>),
    canonical: TOOL_URL,
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Free Error Message Solver — Instant AI Debugging & Fixes", // 55 chars
    description:
      "Paste any error or stack trace and get the root cause + step-by-step fix. Supports 20+ languages and frameworks. Free, no login.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Error Message Solver — AI Debugging Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    card: "summary_large_image",
    title: "Free Error Message Solver: Debug Instantly", // 40 chars
    description:
      "Paste your error log, get the root cause and a step-by-step fix. 20+ languages. Free AI debugger.",
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

// ─── JSON‑LD Structured Data ─────────────────────────────────────────────────
const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Error Message Solver",
  url: TOOL_URL,
  description:
    "AI-powered error message solver that diagnoses any stack trace or error log and provides root cause analysis with step-by-step fix instructions, supporting 20+ languages and frameworks.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with JavaScript enabled (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Instant root cause analysis from any error log or stack trace",
    "Step-by-step fix instructions with corrected code snippets",
    "Supports 22+ programming languages and frameworks",
    "Understands build errors, CI failures, HTTP errors, and package issues",
    "Free tier up to 5 diagnoses per hour; no account required",
    "Clean, minimal interface – just paste and click Solve",
    "Privacy‑friendly: no persistent storage or upload of error logs",
    "Handles multi‑line stack traces, compiler errors, and runtime exceptions",
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
  name: "How to Solve Error Messages with AI",
  description:
    "Use this free AI error solver to diagnose any error log and get step-by-step fix instructions in under a minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Error Message Solver",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your Error",
      text: "Copy the full error message or stack trace from your terminal, browser console, or CI log and paste it into the input field.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Your Stack (Optional)",
      text: "Choose your language or framework from the dropdown to help the AI give more targeted fix suggestions.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Solve This Error",
      text: "Press the 'Solve This Error' button to submit the error for AI diagnosis. The result appears instantly.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Apply the Fix",
      text: "Review the root cause, explanation, and step-by-step fix instructions. Apply the corrected code or configuration changes to resolve the error.",
      url: TOOL_URL,
    },
  ],
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
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
      item: `${SITE_URL}/${CATEGORY_SLUG}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Error Message Solver",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ──────────────────────────────────────────────────────────
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

      <ToolLayout toolId={TOOL_SLUG}>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <header className="mb-6 space-y-4 px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Free Error Message Solver — AI Debugging Assistant
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Paste any error log or stack trace and get an instant root cause analysis with step-by-step fix instructions.
              Supports <strong>Python</strong>, <strong>JavaScript</strong>, <strong>TypeScript</strong>,{" "}
              <strong>Java</strong>, <strong>Node.js</strong>, <strong>React</strong>, <strong>Next.js</strong>,{" "}
              and 20+ more languages and frameworks — completely free, no login required.
            </p>
            <QuickAnswer
              question="How does an AI error message solver work?"
              answer="Paste your full error message or stack trace. The AI identifies the root cause, explains why it happens, and provides step-by-step fix instructions with corrected code — in seconds."
            />
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <ol className="flex items-center gap-1.5">
                <li>
                  <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                    Home
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <a
                    href={`${SITE_URL}/${CATEGORY_SLUG}`}
                    className="hover:text-foreground transition-colors"
                  >
                    Developer Tools
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <span className="text-foreground font-medium">Error Message Solver</span>
                </li>
              </ol>
            </nav>
          </header>

          <main id="tool" aria-label="Error Message Solver">
            <ClientPage faqs={FAQ_ITEMS} />
          </main>

          <EmailCapture />

          <hr className="border-border my-12" />

          {/* ─── AdSense High‑Value Article ─── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="Error Message Solver: How to Read Stack Traces and Find the Root Cause" />
            <meta
              itemProp="description"
              content="The parts of an error message that actually matter, why the first line is often misleading, and a systematic approach to diagnosing errors you've never seen before."
            />
            <meta itemProp="datePublished" content="2024-04-15" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* How to read an error */}
            <section aria-labelledby="reading-errors" className="space-y-4">
              <h2
                id="reading-errors"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                The parts of an error message that actually matter
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Most error messages have three useful parts: the error type, the message,
                and the stack trace. New developers read the message and stop — experienced
                developers scan the stack trace first. The message describes what broke;
                the stack trace tells you where your code triggered it. The bottom of the
                stack is the framework or runtime internals (not your bug). Your code
                appears near the top — that&apos;s where to look.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                Example: a{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  TypeError: Cannot read properties of undefined (reading &apos;map&apos;)
                </code>{' '}
                tells you: something you expected to be an array is{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">undefined</code>.
                The stack trace shows the component and line number. The fix is not at
                the line where{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">.map()</code>{' '}
                is called — it&apos;s one level up, where the data was fetched or passed as a
                prop. The error location and the bug location are often different.
              </p>
            </section>

            {/* Systematic approach */}
            <section
              aria-labelledby="systematic-approach"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="systematic-approach"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                A systematic approach to errors you&apos;ve never seen
              </h2>
              <ol className="space-y-3 text-sm text-muted-foreground list-none">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">1.</span>
                  <span>
                    <strong>Copy the exact error message</strong> (not a paraphrase) and
                    search it with the library or framework name appended. Most errors
                    have existing GitHub issues, Stack Overflow answers, or documentation
                    notes with the exact fix.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">2.</span>
                  <span>
                    <strong>Check what changed last</strong>. If the code worked yesterday
                    and fails today, the cause is almost certainly in the recent change —
                    a dependency update, a config change, or new code. Git diff against
                    the last working commit.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">3.</span>
                  <span>
                    <strong>Reproduce in isolation</strong>. Strip the error down to the
                    minimum code that reproduces it. The process of isolating it often
                    reveals the cause before you find the answer.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground min-w-[1.5rem]">4.</span>
                  <span>
                    <strong>Check environment differences</strong>. Works on your machine
                    but not in CI? Fails in production but not locally? The bug is almost
                    certainly an environment variable, a missing dependency, or a Node.js
                    version difference.
                  </span>
                </li>
              </ol>
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
                    { name: "Regex Tester", path: "/tools/regex-tester" },
                    { name: "JSON Formatter", path: "/tools/json-formatter" },
                  ]}
                />
              </nav>
            </section>
          </article>

          {/* ─── Footer Summary ─── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — Error Message Solver</strong> is a free AI debugging tool that
              analyzes any error log, stack trace, or exception message and delivers root cause
              analysis with actionable fixes. Supports errors from <strong>Python, JavaScript,
                TypeScript, Node.js, React, Next.js, Java, Spring, C++, C#, .NET, Go, Rust, PHP,
                Laravel, Ruby, Rails, and Bash</strong>. It also handles <strong>build failures, CI
                  pipeline errors, HTTP status errors, and package/dependency issues</strong>. Paste your
              full stack trace, select your language or framework, and get a step‑by‑step fix
              explanation with corrected code snippets — in seconds, with no account or subscription
              required. In 2026, it remains the ultimate companion for developers who want to debug
              faster and learn continuously.
            </p>
            <p>
              Searches related to this tool:{" "}
              <em>
                fix error code ai, error message solver online, stack trace analyzer, ai debug
                assistant, fix javascript error free, python error solver, node error fixer, react
                error debugger, explain error message, fix error using ai, debug using chatgpt,
                error log analyzer online.
              </em>
            </p>
          </footer>
        </div>
      </ToolLayout>
    </>
  )
}