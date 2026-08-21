import { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/generator-rex"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 50 characters — exactly at the minimum of the 50–60 char SERP window

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Regex Generator — Email, Phone, URL Patterns Free Online",
  description:
    "Generate regex patterns for email, phone number, URL, date, IP, and more from plain English. Free, browser-based, no upload. Includes common regex cheat sheet.",
  keywords: [
    "regex generator",
    "free regex pattern generator",
    "online regex builder free",
    "generate regular expressions",
    "regex creator tool online",
    "regex generator no upload 2026",
    "client side regex builder",
    "regex pattern maker free",
    "online regex generator private",
    "build regex patterns browser",
    "regex generator for developers",
    "free regex tool online 2026",
    "regex expression generator",
    "regex builder no account",
    "automatic regex generator free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Regex Generator — Email, Phone, URL Patterns Free Online",
    description:
      "Generate regex patterns for email, phone number, URL, date, IP, and more from plain English. Free, browser-based, no upload. Common regex cheat sheet included.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Regex Pattern Generator — Online Builder Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Regex Generator & Pattern Builder Online",
    description:
      "Generate regular expressions from descriptions or examples directly in your browser. No uploads, no accounts, no limits — completely free and private.",
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
  name: "Regex Pattern Generator",
  url: TOOL_URL,
  description:
    "A completely free, privacy-focused browser tool that generates regular expression patterns from natural language descriptions or text examples without any server uploads.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript ES2020+ support (Chrome 80+, Firefox 75+, Safari 14+, Edge 80+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate regular expressions from natural language descriptions",
    "Build regex patterns from positive and negative text examples",
    "Real-time regex testing with live match highlighting",
    "Support for common regex flavors including JavaScript, Python, and PCRE",
    "Copy generated regex patterns ready for immediate use in code",
    "100% client-side processing for total user privacy",
    "No server uploads — your data never leaves your device",
    "No account registration necessary",
    "Cross-platform: works on Windows, macOS, and Linux",
    "Export regex with explanation of each pattern component",
    "Interactive regex cheat sheet and syntax reference",
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
  name: "How to Generate a Regex Pattern Online",
  description:
    "A simple 4-step guide to creating regular expression patterns using our free, browser-based generator. The entire process takes under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Regex Pattern Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Describe Your Pattern or Provide Examples",
      text: "Enter a natural language description of what you want to match — for example, 'an email address' or 'a phone number' — or paste sample text that should match and text that should not match. All input stays in your browser.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Your Target Regex Flavor",
      text: "Choose the programming language or engine your regex will run in — JavaScript, Python, PCRE, Java, or .NET. Each flavor has subtle syntax differences, and the generator tailors the output to match your chosen environment.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Generate and Review the Pattern",
      text: "Click the 'Generate' button to produce a regular expression based on your description or examples. Review the generated pattern, its component breakdown, and test it against live sample data to verify it matches correctly.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy and Use Your Regex",
      text: "Once satisfied with the generated pattern, click the copy button to save it to your clipboard. Paste it directly into your codebase, IDE, or text editor. The tool also provides an escaped version for string literals if needed.",
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
      name: "How do I generate a regex pattern for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Describe what you want to match in plain English or provide example text, select your target programming language, and click generate. The tool creates a regular expression instantly — no server uploads, no account, and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "What regex flavors does this generator support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports the most common regex engines including JavaScript/ECMAScript, Python, PCRE (PHP), Java, and .NET. Each flavor has subtle syntax differences in areas like lookahead assertions, named groups, and escape sequences — the generator tailors output to your chosen environment.",
      },
    },
    {
      "@type": "Question",
      name: "Can I test the generated regex before using it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The tool includes a built-in regex tester where you can paste sample text and see live match highlighting, capture groups, and replacement previews. This lets you verify the pattern works correctly before copying it into your project.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data uploaded to a server when I generate regex?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing happens locally in your browser using native JavaScript regex engines. Your descriptions, examples, and test data never leave your device, ensuring complete privacy and security — safe even for proprietary or sensitive text patterns.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a regex generator and a regex tester?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A regex generator creates a regular expression pattern for you based on input criteria — descriptions, examples, or constraints — automating the complex syntax construction. A regex tester validates an existing pattern you already wrote by running it against sample text and showing matches. This tool performs generation; you can then use its built-in tester to validate the output.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on the complexity of regex I can generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No artificial limits. Because all processing occurs in your browser, you can generate patterns of any complexity your device can handle. Extremely complex patterns with dozens of capture groups or nested lookaheads may require more processing time, but there are no paywalls or quotas restricting usage.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Developer Tools > Tool ─

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
      name: "Regex Pattern Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
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

        <div className="mx-auto max-w-6xl space-y-12">
          {/* ── Page Header ── */}
          <header className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Regex Generator — Email, Phone & URL Patterns Free
            </h1>
            <img src="/images/generator-rex.webp" alt="Free Regex Generator AI — generate regular expressions from descriptions online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Generate regular expressions instantly from natural language descriptions or text
              examples. Supports JavaScript, Python, PCRE, Java, and .NET flavors — test patterns
              live before copying. All processing runs locally in your browser: no server uploads,
              no account, and no usage limits.
            </p>

            <QuickAnswer
              question="What is the regex pattern for email addresses?"
              answer="A commonly used email regex is: ^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$ — but no single regex fully covers RFC 5322. For most web forms, the browser's built-in <input type='email'> validation is more reliable. Use the generator below to build a pattern matched to your exact requirements."
            />

            {/* ── Breadcrumb — HTML nav (mirrors BreadcrumbList JSON-LD above) ── */}
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
                  <span className="text-foreground font-medium">Regex Pattern Generator</span>
                </li>
              </ol>
            </nav>
          </header>

          {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
          <main id="tool" aria-label="Regex Pattern Generator Tool">
            <ClientPage />
          </main>

          {/* ── Email Capture ── */}
          <div className="mt-8">
            <EmailCapture />
          </div>

          <hr className="border-border" />

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
            <meta itemProp="name" content="AI Regex Generator: What to Test After Getting a Generated Pattern" />
            <meta
              itemProp="description"
              content="Why AI-generated regex patterns need systematic testing, the three test categories that catch silent failures, and the ReDoS risk in patterns with nested quantifiers."
            />
            <meta itemProp="datePublished" content="2024-04-05" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* Why generated patterns need testing */}
            <section aria-labelledby="why-test" className="space-y-4">
              <h2
                id="why-test"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Why every generated regex pattern needs systematic testing
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                An AI-generated regex will match the examples you gave it — that&apos;s the
                easy part. What it often gets wrong: the boundaries. A pattern generated
                to match email addresses might accept{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">user@</code>{' '}
                (no domain) or reject{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">user+tag@example.co.uk</code>{' '}
                (valid but unusual format). The pattern works for the happy path you
                described and fails silently for real-world edge cases you didn&apos;t mention.
              </p>
            </section>

            {/* Three test categories */}
            <section
              aria-labelledby="test-categories"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="test-categories"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Three test categories every regex pattern needs
              </h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">1. Happy path</span>
                  <span>
                    Your canonical valid examples — the inputs you gave the AI to generate
                    the pattern. These should all match. If any don&apos;t, the generation failed
                    immediately.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">2. Rejection cases</span>
                  <span>
                    Inputs that must NOT match: near-misses, truncated versions, wrong
                    formats. For a phone number pattern, test{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">123</code>{' '}
                    (too short),{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">abc-def-ghij</code>{' '}
                    (letters), and an empty string. A pattern that matches everything
                    is not useful.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">3. Edge cases</span>
                  <span>
                    The real-world variations your examples didn&apos;t cover: leading/trailing
                    whitespace, Unicode characters, maximum-length inputs, inputs with
                    only special characters. These are the cases that cause production bugs
                    months after deployment.
                  </span>
                </li>
              </ul>
            </section>

            {/* ReDoS warning */}
            <section aria-labelledby="redos-warning" className="space-y-4">
              <h2
                id="redos-warning"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                The ReDoS risk in AI-generated patterns
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                ReDoS (Regular Expression Denial of Service) occurs when a regex with
                nested quantifiers — patterns like{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{'(a+)+'}</code>{' '}
                or{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{'(a|aa)+'}</code>{' '}
                — is given a carefully crafted input that causes exponential backtracking.
                A 50-character input can lock a Node.js server for seconds. AI-generated
                patterns occasionally produce these structures, especially for complex
                formats like email or URL validation. After generating a pattern, paste
                a 40–50 character string of repeated similar characters (e.g.,
                <code className="text-xs bg-muted px-1 py-0.5 rounded">aaaaaaaaaaaaaaaaaaaab</code>)
                and measure how long it takes to evaluate — if it hangs, the pattern
                is unsafe for production use.
              </p>
            </section>

            {/* Common regex cheat sheet */}
            <section aria-labelledby="regex-cheatsheet" className="space-y-4">
              <h2
                id="regex-cheatsheet"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Common regex patterns cheat sheet
              </h2>
              <p className="text-sm text-muted-foreground">
                Copy these patterns directly or paste them into the generator to customize. All patterns use JavaScript/PCRE syntax.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-3 py-2 text-left font-semibold">What to match</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Regex pattern</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-3 py-2">Email address</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^[\\w.%+\\-]+@[\\w.\\-]+\\.[a-z]{2,}$`}</td>
                      <td className="border border-border px-3 py-2">Case-insensitive flag required</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2">US phone (flexible)</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^[+]?1?[\\s\\-.]?\\(?\\d{3}\\)?[\\s\\-.]?\\d{3}[\\s\\-.]?\\d{4}$`}</td>
                      <td className="border border-border px-3 py-2">Matches 555-123-4567, (555) 123-4567, +1…</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2">URL (http/https)</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\/?#]\\S*)?$`}</td>
                      <td className="border border-border px-3 py-2">Does not match bare IPs</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2">IPv4 address</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^(\\d{1,3}\\.){3}\\d{1,3}$`}</td>
                      <td className="border border-border px-3 py-2">Matches 0.0.0.0 to 999.999.999.999; validate range separately</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2">Date (YYYY-MM-DD)</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$`}</td>
                      <td className="border border-border px-3 py-2">ISO 8601 format; does not validate Feb 30</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2">Hex color (#RGB or #RRGGBB)</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$`}</td>
                      <td className="border border-border px-3 py-2">Does not match 8-digit #RRGGBBAA</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2">UUID v4</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`}</td>
                      <td className="border border-border px-3 py-2">Case-insensitive flag recommended</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2">Slug (URL-safe)</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^[a-z0-9]+(?:-[a-z0-9]+)*$`}</td>
                      <td className="border border-border px-3 py-2">Lowercase letters, numbers, hyphens; no leading/trailing hyphen</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2">Credit card number (generic)</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^\\d{4}[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}$`}</td>
                      <td className="border border-border px-3 py-2">Format only — use Luhn check for validation</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2">Postal code (US ZIP)</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs whitespace-nowrap">{`^\\d{5}(-\\d{4})?$`}</td>
                      <td className="border border-border px-3 py-2">Matches 12345 and 12345-6789</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                    { name: "Regex Tester", path: "/tools/regex-tester" },
                    { name: "Code Explainer", path: "/tools/code-explainer" },
                    { name: "Error Message Solver", path: "/tools/error-message-solver" },
                  ]}
                />
              </nav>
            </section>
          </article>

          {/* ── Page Footer Summary (SEO reinforcement) ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — Regex Pattern Generator</strong> is a fully private,
              browser-based tool that creates regular expressions from descriptions or examples.
              All processing runs locally on your device using native JavaScript regex engines  ,
              your data never leaves your computer. Supports <strong>JavaScript, Python, PCRE,
                Java, and .NET</strong> flavors — making it the fastest free way to build and test
              regex patterns in 2026, with no installs, no accounts, and no hidden limits.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}