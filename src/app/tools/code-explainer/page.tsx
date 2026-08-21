import type { Metadata } from "next"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ClientPage from "./client-page"

// ─── Absolute URLs ─────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/code-explainer`

export const FAQ_ITEMS = [
  {
    q: "What is a code explainer tool?",
    a: "A code explainer is an AI tool that reads any code snippet and produces a plain-English explanation of what it does, how it works, and what patterns it uses — so you can understand unfamiliar code in seconds.",
  },
  {
    q: "Which programming languages does this support?",
    a: "Our AI code explainer supports Python, JavaScript, TypeScript, Java, C, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, Bash, HTML, CSS, and more. It can also explain configuration files like JSON, YAML, and Dockerfile.",
  },
  {
    q: "Can it explain complex or legacy code?",
    a: "Yes. Paste any code — from modern React hooks to legacy COBOL snippets — and the AI will analyze the logic, identify patterns, and break it down at your chosen explanation level.",
  },
  {
    q: "What does the explanation level mean?",
    a: "Beginner explanations use plain English and avoid jargon. Intermediate assumes programming knowledge but explains patterns. Expert mode focuses on architecture, performance implications, and edge cases without over-explaining basics.",
  },
  {
    q: "Is this code explainer free?",
    a: "Yes. TheFreeAITools.com provides free code explanation with up to 5 analyses per hour. No account or subscription required.",
  },
  {
    q: "Can I use this for code reviews?",
    a: "Absolutely. Paste any function you're reviewing to instantly get a summary of what it does, key patterns used, and potential issues — great for faster pull request reviews.",
  },
  {
    q: "Will it explain code with bugs?",
    a: "Yes — the explainer describes what the code does as written, including logic errors if present. For dedicated debugging help, use our Error Message Solver tool instead.",
  },
  {
    q: "Can I explain code from Stack Overflow?",
    a: "Yes. Paste any code snippet from Stack Overflow, GitHub, or documentation and get an instant explanation. This is one of the most popular use cases — understand answers before copying them.",
  },
]

// ─── Metadata (title 50‑60 chars, description 140‑160) ─────────────────────
export const metadata: Metadata = {
  title: "Free Code Explainer – Understand Code with AI", // 45 characters
  description:
    "Paste any code and get a plain-English explanation. Supports 20+ languages and 3 depth levels. Free, private AI code explainer — no login needed.", // 158 characters
  keywords: [
    "code explainer",
    "ai code explainer",
    "explain code online free",
    "code explanation tool",
    "understand code snippets",
    "free code analyzer 2026",
    "plain English code breakdown",
    "explain python code",
    "explain javascript code",
    "code review assistant",
    "AI code explanation",
    "what does this code do",
    "code to English translator",
    "explain stack overflow code",
    "learn code from examples",
    "code explainer for beginners",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free AI Code Explainer – Understand Code Instantly", // 50 characters
    description:
      "Get a plain‑English explanation of any code snippet. Supports 20+ languages, 3 explanation levels. Free, no account needed.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Code Explainer – TheFreeAITools.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Explainer – AI‑Powered Code Breakdown", // 44 characters
    description:
      "Paste code, get a plain‑English explanation. 20+ languages, beginner to expert. Free AI tool.",
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
  name: "Code Explainer",
  url: TOOL_URL,
  description:
    "An AI‑powered code explainer that translates any code snippet into plain‑English explanations. Supports 22+ programming languages and offers three explanation levels for beginners, intermediates, and experts.",
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
    "Instant plain‑English code explanations",
    "Beginner, Intermediate, and Expert explanation levels",
    "22+ programming languages supported",
    "Auto‑detection of programming language from syntax",
    "Explanation includes key concepts and step‑by‑step logic",
    "No account or subscription required",
    "Free to use with generous rate limits",
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
  name: "How to Explain Code with AI",
  description:
    "Use this free AI code explainer to understand any code snippet in plain English in under a minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Code Explainer",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your Code",
      text: "Copy the code snippet you want to understand and paste it into the input field. The tool automatically detects the programming language.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Explanation Level",
      text: "Choose Beginner, Intermediate, or Expert depending on your programming knowledge and the depth of explanation you need.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click 'Explain Code'",
      text: "Press the Explain Code button to submit your snippet for AI analysis. The response appears instantly.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Read the Explanation",
      text: "Review the plain‑English breakdown covering what the code does, the key concepts involved, and a step‑by‑step walkthrough of the logic.",
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
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Code Explainer",
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

      <>
        <div className="  px-4 py-8">
          {/* ── Header & Breadcrumb (HTML mirrors JSON‑LD) ── */}
          <header className="mb-6 space-y-4 px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Free Code Explainer — AI Code Analysis in Plain English
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Paste any code snippet and instantly understand what it does. Supports{" "}
              <strong>Python</strong>, <strong>JavaScript</strong>, <strong>TypeScript</strong>,{" "}
              <strong>Java</strong>, <strong>C++</strong>, <strong>Go</strong>, <strong>Rust</strong>,{" "}
              <strong>SQL</strong>, and 20+ more. Choose your explanation depth — beginner‑friendly
              to expert‑level analysis.
            </p>

            <QuickAnswer
              question="What does a code explainer do?"
              answer="A code explainer uses AI to translate any code snippet into plain English, breaking down what it does, the key concepts it uses, and how each part works — no programming experience required."
            />

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
                    href={`${SITE_URL}/tools`}
                    className="hover:text-foreground transition-colors"
                  >
                    Developer Tools
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <span className="text-foreground font-medium">Code Explainer</span>
                </li>
              </ol>
            </nav>
          </header>

          {/* ── Interactive Tool (Client Component) ── */}
          <main id="tool" aria-label="Code Explainer Tool">
            <ClientPage faqs={FAQ_ITEMS} />
          </main>

          <EmailCapture />

          <hr className="border-border my-12" />

          {/* ─── AdSense High‑Value Content Article (800+ words) ──────────── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="Code Explainer: How to Use AI Explanations Without Losing Understanding" />
            <meta
              itemProp="description"
              content="What AI code explanations are good for, the three cases where they mislead you, and how to use them as a learning tool rather than a shortcut."
            />
            <meta itemProp="datePublished" content="2024-04-18" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* What AI explanations are good for */}
            <section aria-labelledby="what-good-for" className="space-y-4">
              <h2
                id="what-good-for"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                What AI code explanations are actually good for
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                AI explanations excel at three tasks: translating unfamiliar syntax into
                plain language (&quot;what does this arrow function with destructuring do?&quot;),
                summarizing what a function does at a high level when you&apos;re reading
                someone else&apos;s codebase, and identifying the general pattern being
                used (&quot;this is a memoization cache with a fixed-size eviction policy&quot;).
                These are orientation tasks — the explanation gets you to the right
                conceptual frame faster than reading documentation from scratch.
              </p>
            </section>

            {/* Where they mislead */}
            <section
              aria-labelledby="where-mislead"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="where-mislead"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Three cases where AI explanations mislead you
              </h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Domain-specific business logic</span>
                  <span>
                    An AI explaining a function named{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">calculateSettlementFee()</code>{' '}
                    will describe what the math does, not why the business rule exists.
                    Understanding the intent requires reading the spec, the ticket, or
                    asking the original author — the AI doesn&apos;t have that context.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Side effects and state mutations</span>
                  <span>
                    AI explanations tend to describe what a function returns but
                    understate what it changes globally — database writes, cache
                    invalidations, external API calls, event emissions. These side
                    effects are often more important than the return value and are
                    easily missed in a summary.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Confident explanations of buggy code</span>
                  <span>
                    If you paste code that has a subtle bug, an AI explanation often
                    describes what the code was intended to do, not what it actually
                    does wrong. It explains the logic as if it were correct. Always
                    test the code; don&apos;t rely on an explanation to verify correctness.
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
                    { name: "Code Converter", path: "/tools/code-converter" },
                    { name: "Error Message Solver", path: "/tools/error-message-solver" },
                    { name: "Regex Tester", path: "/tools/regex-tester" },
                  ]}
                />
              </nav>
            </section>
          </article>

          {/* ── Page Footer ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — Code Explainer</strong> turns any code snippet into a
              plain‑English explanation in seconds. Use it to decode Stack Overflow answers,
              accelerate code reviews, learn new programming languages, and understand legacy
              code — all for free in 2026. No account required, just paste and learn.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}