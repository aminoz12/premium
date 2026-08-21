import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { Suspense } from "react"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/regex-tester"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 54 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Regex Tester — Test Regular Expressions Online",
  description:
    "Test and debug regular expressions instantly. Live matching, syntax highlighting, and detailed match info. Free, browser-based tool with no signup.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex debugger",
    "online regex test",
    "regex matcher",
    "regex cheat sheet",
    "regex validator",
    "javascript regex tester",
    "regex replace tool",
    "free regex tool 2026",
    "browser-based regex tester",
    "no signup regex",
    "secure regex tester",
    "regular expression test online",
    "regexr alternative",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Regex Tester — Test Regular Expressions Online Instantly",
    description:
      "Test and debug regular expressions instantly. Live matching, syntax highlighting, and detailed match info. Free browser-based tool, no signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Regex Tester — Test Regular Expressions by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Regex Tester — Test Regular Expressions Online",
    description:
      "Test and debug regular expressions instantly. Live matching, syntax highlighting, and detailed match info. Free browser-based tool, no signup required.",
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
  name: "Regex Tester",
  url: TOOL_URL,
  description:
    "A free online tool to test and debug regular expressions. Provides live matching, syntax highlighting, detailed match info, and replace functionality. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Live regex matching with highlighted matches",
    "Detailed match information (groups, indices, captures)",
    "Replace functionality with preview",
    "Syntax highlighting for regex patterns",
    "Cheat sheet reference",
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
  name: "How to Test a Regular Expression",
  description:
    "A simple step-by-step guide to testing and debugging regular expressions using our free online regex tester.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Regex Tester",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Regex Pattern",
      text: "Type or paste your regular expression pattern into the regex input field. The tool supports JavaScript regex syntax, including flags like i, g, m, s, and u.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter Your Test String",
      text: "Paste or type the text you want to match against. The tool will instantly highlight all matches in the string as you type.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Matches & Details",
      text: "In the output panel, you'll see a list of all matches with their start and end indices, captured groups, and other details. Use this to debug your pattern.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Replace or Reuse",
      text: "If you need to replace matches, use the Replace tab. Enter your replacement text and preview the result before copying it to your code.",
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
      name: "What is a regex tester and why would I use one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A regex tester is an online tool that lets you write, test, and debug regular expressions against sample text. It highlights matches, shows capture groups, and provides detailed match information. It's essential for developers learning regex or debugging complex patterns.",
      },
    },
    {
      "@type": "Question",
      name: "Which regex syntax does this tool support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports JavaScript regex syntax (ECMAScript), including all common flags (i, g, m, s, u, y). It also supports lookaheads, lookbehinds, capture groups, and named groups.",
      },
    },
    {
      "@type": "Question",
      name: "Is my regex data secure when using this tester?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your regex patterns and test strings are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "Can I test regex across multiple lines?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can enable the 's' flag (dotAll) or 'm' flag (multiline) to match across line breaks. The tool respects all standard regex flags.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between regex testing and validation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Regex testing is the process of applying a pattern to a string to see what matches. Regex validation typically checks whether a string is a valid email, phone number, or other format. Our tool focuses on testing — helping you see exactly what the regex does, which is crucial for debugging.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free regex tester?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account required and no test-string limits. Handles complex patterns and large inputs directly in your browser — no data is sent to any server.",
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
      name: "Regex Tester",
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
            Free Regex Tester — Test Regular Expressions Online Instantly
          </h1>
          <img src="/images/regex-tester.webp" alt="Free Regex Tester — test regular expressions with live match highlighting online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Test and debug <strong>regular expressions</strong> instantly with live
            matching, syntax highlighting, and detailed match information. Perfect for
            developers, data analysts, and anyone learning regex. All processing runs
            locally in your browser with <strong>100% privacy</strong> — no signup or
            upload required.
          </p>

          <QuickAnswer
            question="What is a regex tester and why would I use one?"
            answer="A regex tester is an online tool that lets you write, test, and debug regular expressions against sample text. It highlights matches, shows capture groups, and provides detailed match information — essential for debugging patterns."
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
                <span className="text-foreground font-medium">Regex Tester</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Regex Tester Tool">
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground">Loading regex tester...</div>}>
            <ClientPage />
          </Suspense>
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
          <meta itemProp="name" content="Regex Tester: Live Pattern Matching with Real Test Cases" />
          <meta itemProp="description" content="Test regex patterns against live input with match highlighting. Includes the 5-step workflow to avoid silent production bugs." />
          <meta itemProp="datePublished" content="2024-02-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="regex-problem" className="space-y-4">
            <h2 id="regex-problem" className="text-2xl font-semibold tracking-tight text-foreground">
              The silent failure problem with regex
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most code errors announce themselves — a null reference, a type mismatch, a
              failed build. Regex errors are silent. A pattern that is slightly wrong may
              match 99% of inputs correctly and fail only on edge cases: international phone
              formats, email addresses with plus signs, URLs with query strings. These cases
              show up from real users in production, not in unit tests written by the
              developer who designed the pattern.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              I wrote about a specific case in{' '}
              <a href="/blog/regex-testing-workflow" className="text-black  dark:text-white hover:underline">
                How I Test Regex Before It Breaks Production
              </a>
              {' '}— a phone validator that silently rejected every Moroccan number (+212XXXXXXXXX)
              for two months because the length range was off by one. The fix was one
              character. The tool here would have caught it in 30 seconds if I&apos;d tested the
              edge case before shipping.
            </p>
          </section>

          <section aria-labelledby="regex-workflow" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="regex-workflow" className="text-2xl font-semibold tracking-tight text-foreground">
              The three test categories every regex needs
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Before shipping any regex, test three categories of strings — not just
              strings you expect to match:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Happy path</span>
                <span>5–10 strings that should match. If any fail, the pattern is wrong.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Rejection cases</span>
                <span>Strings that should NOT match. If any slip through, the pattern is too permissive.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Edge cases</span>
                <span>
                  Strings that could go either way — decide your intent first, then verify the
                  pattern behaves accordingly. This is where most bugs hide.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Also test for catastrophic backtracking: nested quantifiers like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">(a+)+</code> can cause
              exponential slowdown on certain inputs. Paste a 50-character string that partially
              matches but ultimately fails — if the match takes more than 100 ms, you have a
              ReDoS vulnerability.
            </p>
          </section>

          <section aria-labelledby="regex-flags" className="space-y-4">
            <h2 id="regex-flags" className="text-2xl font-semibold tracking-tight text-foreground">
              The flags that change behavior in non-obvious ways
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">m (multiline)</span>
                <span>
                  Makes <code className="text-xs bg-muted px-1 py-0.5 rounded">^</code> and{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">$</code> match the
                  start/end of each line, not the whole string. A validator with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">^...$</code> and the{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">m</code> flag will
                  accept multiline input when it shouldn&apos;t.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">s (dotAll)</span>
                <span>
                  Makes <code className="text-xs bg-muted px-1 py-0.5 rounded">.</code> match
                  newlines. Without this flag, a pattern designed to match &quot;any character&quot;
                  stops at line breaks.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">u (Unicode)</span>
                <span>
                  Enables proper handling of Unicode code points above U+FFFF (emoji, certain
                  scripts). Without it, emoji and some international characters can cause
                  unexpected behavior in character class ranges.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "Cron Expression Parser", path: "/tools/cron-parser" },
                  { name: "JWT Decoder", path: "/tools/jwt-decoder" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Regex Tester</strong> is a fully private, browser-based
            tool for testing and debugging <strong>regular expressions</strong> instantly.
            Supports live matching, syntax highlighting, detailed match info (groups,
            indices, captures), and replace preview. All processing runs locally on your
            device — your regex patterns and test strings never leave your computer.
            The fastest free way to test regex in 2026, with no installs, no accounts, and
            no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}