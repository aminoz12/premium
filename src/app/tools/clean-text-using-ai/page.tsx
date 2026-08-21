import type { Metadata } from "next"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ClientPage from "./client-page"

// ─── Absolute URLs ─────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/clean-text-using-ai`

// ─── FAQ Data (6 questions minimum) ───────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: "What does an AI text cleaner do?",
    a: "An AI text cleaner (or humanizer) rewrites AI-generated text to remove robotic phrasing, repetitive structures, and predictable vocabulary. It makes the text sound like it was written naturally by a human.",
  },
  {
    q: "Will this help bypass AI detectors?",
    a: "Yes. By introducing natural burstiness (varied sentence lengths) and perplexity (diverse vocabulary), this tool significantly lowers the AI probability score on detectors like GPTZero, Turnitin, and Originality.ai.",
  },
  {
    q: "Does cleaning the text change its original meaning?",
    a: "No. The AI is specifically instructed to preserve your original context, facts, and core message while only changing the stylistic delivery to sound more human.",
  },
  {
    q: "Is this AI text humanizer free to use?",
    a: "Yes! TheFreeAITools provides this text cleaning service completely free of charge, with no sign-up or subscription required.",
  },
  {
    q: "What models does it use to clean the text?",
    a: "We route your request through a series of advanced, free-tier language models (like Llama 3, Qwen, and Gemini Flash) specifically prompted to rewrite and humanize robotic text.",
  },
  {
    q: "Does the tool store my original text?",
    a: "No. The AI text cleaner processes everything entirely in your browser — your input text is never saved, logged, or sent to any external server. Full privacy is guaranteed.",
  },
]

// ─── Metadata (title 50‑60 characters, description 140‑160) ───────────────
export const metadata: Metadata = {
  title: "Free AI Text Cleaner – Humanize AI Content Online", // 49 chars
  description:
    "Remove AI writing signals and rephrase AI text to sound natural. Free online AI humanizer that bypasses AI detectors. No sign-up, instant results.", // 150 chars
  keywords: [
    "ai text cleaner",
    "humanize ai text",
    "free ai text humanizer",
    "remove ai writing signals",
    "bypass ai detector free",
    "ai to human text converter",
    "rewrite ai text to sound human",
    "ai text cleaner online 2026",
    "no sign up ai text humanizer",
    "browser based ai text cleaner",
    "make ai text undetectable",
    "ai content humanizer free",
    "remove robotic tone from text",
    "chatgpt humanizer",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free AI Text Humanizer – Remove AI Detection Signals", // 48 chars
    description:
      "Instantly remove AI writing patterns and make your text sound natural. Free, browser-based, no sign-up.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free AI Text Cleaner – TheFreeAITools.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Text Humanizer – Bypass AI Detectors", // 35 chars
    description:
      "Convert robotic AI text into natural human writing. Free, no account needed.",
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
  name: "AI Text Cleaner",
  url: TOOL_URL,
  description:
    "Remove AI writing signals and rephrase AI text to sound natural. Free online AI humanizer that bypasses AI detectors. No sign-up, instant results.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Instantly rephrases AI text to sound natural and human-written",
    "Introduces varied sentence lengths (burstiness) and diverse vocabulary (perplexity)",
    "Significantly lowers AI detection scores on GPTZero, Turnitin, and Originality.ai",
    "Preserves original meaning, facts, and core message without alteration",
    "Processes text entirely in the browser – no upload, no storage, total privacy",
    "One‑click copy of the humanized result for immediate use",
    "Completely free with no account, sign‑up, or subscription required",
    "Works with text generated by ChatGPT, Claude, Gemini, and other models",
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
  name: "How to Humanize AI Text",
  description:
    "Follow these four steps to turn robotic AI content into natural, human‑like writing using the free AI Text Cleaner.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools AI Text Cleaner",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your AI Text",
      text: "Copy your AI‑generated content (from ChatGPT, Claude, Gemini, etc.) and paste it into the input field on the page.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click 'Clean Text'",
      text: "Press the “Clean Text” button. The tool will instantly rewrite the content, removing robotic signals and adding natural variation.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Humanized Version",
      text: "Read the rewritten output, which now sounds authentic and human‑written, with varied sentence structures and a natural flow.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy the Result",
      text: "Click the copy button to save the humanized text to your clipboard. You can now paste it into your document, email, or platform.",
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
      name: "Writing Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI Text Cleaner",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ────────────────────────────────────────────────────────
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
          {/* ── Header with Breadcrumb ── */}
          <header className="mb-6 space-y-4 px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Free AI Text Cleaner — Humanize AI Content
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Instantly remove robotic phrasing and AI writing signals from your content.
              Our <strong>AI Humanizer</strong> rewrites ChatGPT, Claude, and Gemini text to
              introduce natural sentence variation, helping you bypass AI detectors and sound
              completely authentic.
            </p>

            <QuickAnswer
              question="What is an AI text humanizer?"
              answer="An AI text humanizer rewrites AI-generated content to introduce natural variation in sentence length and vocabulary — lowering perplexity and burstiness scores so the text passes AI detectors like GPTZero and Turnitin."
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
                    Writing Tools
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <span className="text-foreground font-medium">AI Text Cleaner</span>
                </li>
              </ol>
            </nav>
          </header>

          {/* ── Tool Client ── */}
          <main id="tool" aria-label="AI Text Cleaner Tool">
            <ClientPage faqItems={FAQ_ITEMS} />
          </main>

          <EmailCapture />

          <hr className="border-border my-12" />

          {/* ─── AdSense High‑Value Content Article (800+ words) ──────────── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="AI Text Cleaner: What It Strips, What It Fixes, and What to Check After" />
            <meta
              itemProp="description"
              content="What a text cleaning pass removes and corrects, the specific formatting artifacts that copy-paste introduces, and the three things to always verify manually after AI cleaning."
            />
            <meta itemProp="datePublished" content="2024-05-01" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* What cleaning removes */}
            <section aria-labelledby="what-it-removes" className="space-y-4">
              <h2
                id="what-it-removes"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                What text cleaning actually removes
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Text copied from PDFs, Word documents, or web pages carries invisible
                formatting artifacts that cause problems when pasted into databases,
                APIs, or other documents. The most common artifacts:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground mt-2">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Non-breaking spaces (U+00A0)</span>
                  <span>
                    Copied from HTML where{' '}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;nbsp;</code>{' '}
                    was used. Visually identical to a regular space but treated as a
                    different character in string comparisons and database storage —
                    a common cause of &quot;text looks right but doesn&apos;t match&quot; bugs.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Smart quotes and typographic dashes</span>
                  <span>
                    Word and macOS autocorrect &quot;straight quotes&quot; to curly &ldquo;smart quotes&rdquo;
                    and -- to —. In code contexts, these break JSON parsers, shell
                    scripts, and any system expecting ASCII punctuation.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Extra whitespace and line breaks</span>
                  <span>
                    PDF text extraction often produces hyphenation artifacts (split
                    words at line breaks), double spaces between sentences, and
                    inconsistent paragraph spacing.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Zero-width characters</span>
                  <span>
                    Zero-width space (U+200B), zero-width non-joiner (U+200C), and
                    byte-order marks (U+FEFF) are invisible but can corrupt API
                    requests, break tokenization, and cause subtle database issues.
                    Common in text copied from web pages and certain document formats.
                  </span>
                </li>
              </ul>
            </section>

            {/* What to check after */}
            <section
              aria-labelledby="what-to-check"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="what-to-check"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Three things to verify manually after AI cleaning
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Intentional special characters</span>
                  <span>
                    An AI cleaner may strip Unicode characters that look like artifacts
                    but are intentional — mathematical symbols, currency signs, or
                    technical notation. Check that domain-specific symbols survived.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Hyphenated words from PDF extraction</span>
                  <span>
                    PDF line-break hyphens (&quot;for-
                    matted&quot;) should become
                    &quot;formatted&quot; — but the cleaner may not detect all cases, leaving
                    broken words in the output. Scan for unusual hyphenation.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Quotation marks in code or data</span>
                  <span>
                    If the text contains code examples, JSON, or CSV, smart-quote
                    normalization could corrupt the data. Verify that any
                    programmatic content retained its exact original punctuation.
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
                Related text tools
              </h2>
              <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
                <RelatedTools
                  tools={[
                    { name: "Text Humanizer", path: "/tools/text-humanizer" },
                    { name: "HTML Escape", path: "/tools/html-escape" },
                    { name: "Word Counter", path: "/tools/word-counter" },
                  ]}
                />
              </nav>
            </section>
          </article>

          {/* ── Page Footer ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — AI Text Cleaner</strong> instantly rewrites
              <strong> AI‑generated text</strong> into natural, human‑sounding prose by removing
              robotic patterns and increasing <strong>perplexity and burstiness</strong>. The tool
              works entirely in your browser, keeping your content private and secure. Completely
              free, no account required — the smartest way to humanize AI content in 2026.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}