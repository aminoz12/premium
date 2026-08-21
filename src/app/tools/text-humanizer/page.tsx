import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/text-humanizer"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 59 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "AI Text Humanizer — Make AI Text Sound More Natural & Human",
  description:
    "Humanize AI-generated text instantly. Make content sound natural, engaging, and humanlike. Free, browser-based AI text humanizer — no login needed.",
  keywords: [
    "text humanizer",
    "ai text humanizer",
    "humanize text online free",
    "ai to human text converter",
    "make ai text sound human",
    "humanize ai content",
    "free text humanizer 2026",
    "ai text to human writing",
    "humanize chatgpt text",
    "improve ai writing",
    "natural ai text converter",
    "ai content humanizer free",
    "no signup text humanizer",
    "browser-based ai humanizer",
    "secure text humanizer tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free AI Text Humanizer — Make AI Text Sound More Natural",
    description:
      "Humanize AI-generated text instantly. Make content sound more natural, engaging, and humanlike. Free, browser-based tool with no signup.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free AI Text Humanizer — Make AI Text Sound More Natural by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Text Humanizer — Turn AI Writing into Human Text",
    description:
      "Make AI-generated content sound more natural and engaging. Free browser-based tool, no signup required.",
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
  name: "AI Text Humanizer",
  url: TOOL_URL,
  description:
    "A free online tool that humanizes AI-generated text, making it sound more natural, engaging, and humanlike. All processing happens client-side for complete privacy.",
  applicationCategory: "WritingApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Humanize AI-generated text instantly",
    "Make content sound more natural and engaging",
    "Improve readability and flow",
    "Remove robotic or repetitive patterns",
    "100% client-side processing for privacy",
    "No account or signup required",
    "Works on any device with a modern browser",
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
    "A simple step-by-step guide to transform AI-generated content into natural, humanlike text using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Text Humanizer",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your AI-Generated Text",
      text: "Copy your AI-generated text (from ChatGPT, Claude, or any other AI tool) and paste it into the input field. The tool accepts any text content.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Humanize",
      text: "Click the 'Humanize' button. The tool will analyze your text and apply algorithms to make it sound more natural, engaging, and humanlike.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Humanized Output",
      text: "The humanized version of your text will appear in the output field. Review the changes and compare them with the original.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click the 'Copy' button to save the humanized text to your clipboard, or download it as a text file for further use.",
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
      name: "What is an AI text humanizer and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI text humanizer is a tool that takes AI-generated content and makes it sound more natural, engaging, and humanlike. It works by analyzing the text for robotic patterns, repetitive phrases, and unnatural structures, then applying algorithms to improve readability and flow.",
      },
    },
    {
      "@type": "Question",
      name: "Is my text uploaded to your servers when I humanize it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing occurs entirely in your browser using JavaScript. Your text is never sent to our servers, stored, or logged. The tool is 100% private.",
      },
    },
    {
      "@type": "Question",
      name: "What types of AI text can this tool humanize?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool can humanize text from any AI generator, including ChatGPT, Claude, Gemini, Jasper, and others. It works with various content types such as articles, emails, social media posts, and creative writing.",
      },
    },
    {
      "@type": "Question",
      name: "Is this AI text humanizer free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely free. No account, no signup, no subscription required. You can humanize as much text as you want, with no limits or paywalls.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between AI-generated text and humanized text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI-generated text often follows predictable patterns, uses repetitive phrasing, and can sound robotic or formulaic. Humanized text is more natural, varies sentence structure, uses colloquial language appropriately, and flows like a human writer.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free AI text humanizer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account and no document length limits. Rewrites AI-generated text to sound human directly in your browser — your content is never stored or sent to any server.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Writing Tools > Tool ──────

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
      item: `${SITE_URL}/categories/writing`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI Text Humanizer",
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
            Free AI Text Humanizer — Make AI Text Sound More Natural & Human
          </h1>
          <img src="/images/text-humain.webp" alt="Free AI Text Humanizer — make AI-generated text sound natural and human" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Transform AI-generated content into <strong>natural, engaging, and humanlike</strong>
            text instantly. Improve readability, remove robotic patterns, and make your writing
            sound more authentic. All processing runs locally in your browser with
            <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="What is an AI text humanizer and how does it work?"
            answer="An AI text humanizer takes AI-generated content and makes it sound more natural, engaging, and humanlike. It works by analyzing the text for robotic patterns and applying algorithms to improve readability and flow — all in your browser."
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
                  href={`${SITE_URL}/categories/writing`}
                  className="hover:text-foreground transition-colors"
                >
                  Writing Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">AI Text Humanizer</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="AI Text Humanizer Tool">
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
          <meta itemProp="name" content="AI Text Humanizer: What It Changes, What It Can't Fix, and Where It Helps Most" />
          <meta
            itemProp="description"
            content="What patterns make AI-generated text detectable, which transformations a humanizer applies, and the two contexts where it genuinely improves output vs. where it doesn't help."
          />
          <meta itemProp="datePublished" content="2024-04-14" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What makes AI text detectable */}
          <section aria-labelledby="what-makes-detectable" className="space-y-4">
            <h2
              id="what-makes-detectable"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What patterns make AI-generated text detectable
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              AI language models generate text by predicting the most statistically
              likely next token. This creates detectable patterns: uniform sentence
              length (most sentences cluster around 15–25 words), excessive use of
              transition phrases (&quot;Furthermore,&quot; &quot;Moreover,&quot; &quot;It is important to note&quot;),
              consistent paragraph structure where every paragraph has the same
              arc (claim → evidence → conclusion), and low lexical diversity (the same
              words reused where a human writer would vary).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              AI detectors look for these statistical regularities. A humanizer tool
              introduces variation: sentence length variance, synonym substitution,
              structural rearrangement, and removal of stock transition phrases. The
              result is statistically less uniform — closer to what human writing
              looks like in aggregate.
            </p>
          </section>

          {/* Where it helps most */}
          <section
            aria-labelledby="where-helps"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="where-helps"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Where humanizing AI text genuinely improves it
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Drafts as a starting point</span>
                <span>
                  AI-generated first drafts are often verbose and structurally
                  repetitive. A humanizer pass that shortens sentences, removes
                  filler phrases, and introduces structural variety makes the draft
                  faster to edit into a final piece — even if you plan to rewrite
                  most of it manually.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Technical content with flat tone</span>
                <span>
                  AI documentation and explanatory text tends to be technically
                  accurate but tonally flat — every sentence carries equal weight.
                  A humanizer can vary sentence rhythm so key points land harder
                  than supporting detail, improving reader comprehension.
                </span>
              </li>
            </ul>
          </section>

          {/* What it can't fix */}
          <section aria-labelledby="cant-fix" className="space-y-4">
            <h2
              id="cant-fix"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a humanizer cannot fix
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A humanizer works on surface-level patterns — word choice, sentence
              length, transitions. It cannot add original insights, first-person
              experience, or specific examples that only a real person would know.
              AI detectors increasingly look for content originality and specificity
              (real numbers, named sources, personal perspective) rather than just
              surface patterns. A humanized version of generic AI content is still
              generic. The strongest signal of human writing is the presence of
              specific, verifiable, opinionated content — a humanizer tool cannot
              generate that.
            </p>
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
                  { name: "Word Counter", path: "/tools/word-counter" },
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — AI Text Humanizer</strong> is a fully private,
            browser-based tool that transforms <strong>AI-generated text</strong> into
            <strong>natural, engaging, and humanlike</strong> content. All processing runs
            locally on your device — your text never leaves your computer. The fastest free
            way to humanize AI writing in 2026, with no installs, no accounts, and no hidden
            limits.
          </p>
        </footer>
      </div>
    </>
  )
}