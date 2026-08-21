import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import ClientPage from "./client-page"
import type { Metadata } from "next"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/detect-text-ai`

export const FAQ_ITEMS = [
  {
    q: "How do I use the Free AI Text Detector?",
    a: "Copy the text you want to analyze and paste it into the input field, then click the Detect AI Content button. The tool will analyze your text and display an AI probability score, perplexity metrics, burstiness analysis, and detailed visual charts within seconds.",
  },
  {
    q: "What text formats and inputs are supported?",
    a: "The detector accepts plain text pasted directly into the input field. It works with essays, articles, emails, cover letters, social media posts, and any text content between 50 and 5,000 characters for optimal accuracy.",
  },
  {
    q: "What output does the AI detector provide?",
    a: "The tool outputs an AI probability percentage, perplexity score, burstiness measurement, multi-model cross-validation results, and interactive visual charts. It also provides a one-click humanize rewrite option for AI-detected content.",
  },
  {
    q: "Is my text kept private during analysis?",
    a: "Yes. All text processing happens through encrypted connections without storing your content on our servers. Your essays, reports, and sensitive documents are never logged, retained, or used for model training.",
  },
  {
    q: "What is the difference between perplexity and burstiness?",
    a: "Perplexity measures how predictable your text is — AI tends to produce highly predictable, low-entropy prose. Burstiness measures variation in sentence structure — humans naturally mix short and long sentences while AI often produces uniform rhythmic patterns.",
  },
  {
    q: "Are there any usage limits on the free detector?",
    a: "The free tier allows 3 text analyses per 3-hour window with no account required. This rate limit ensures service availability while providing sufficient capacity for individual educators, students, and content reviewers.",
  },
]

export const metadata: Metadata = {
  ...buildToolMetadata("detect-text-ai"),
  title: "Free AI Text Detector — Detect ChatGPT & Claude Content",
  description:
    "Instantly detect ChatGPT, Claude & Gemini text with our free AI detector. Get probability scores, perplexity & humanize rewrite — no login, fully private.",
  keywords: [
    "ai text detector",
    "detect ai generated content free",
    "free ai content checker online",
    "chatgpt detector no login",
    "claude ai text detector online",
    "gemini content detection tool",
    "ai writing checker browser",
    "detect ai essay free 2026",
    "perplexity burstiness analyzer",
    "humanize ai text online free",
    "check if text is ai written",
    "ai plagiarism detector free",
    "online ai authorship checker",
    "browser based ai detector",
    "free ai text analyzer no upload",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free AI Text Detector — Detect ChatGPT, Claude & Gemini Content",
    description:
      "Paste any text and instantly find out if it was written by AI. Multi-model detection, visual charts, and a one-click humanizer. Free, no login needed.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free AI Text Detector — Detect ChatGPT, Claude & Gemini Content",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Detect AI Writing Free — ChatGPT, Claude & Gemini Checker",
    description:
      "Check any text for AI authorship in seconds. Visual charts, perplexity scores, burstiness analysis, and a humanizer — 100% free, no sign-up.",
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

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free AI Text Detector",
  url: TOOL_URL,
  description:
    "A free AI-generated text detector that analyzes content for AI authorship using perplexity, burstiness, and multi-model cross-validation. Supports ChatGPT, Claude, Gemini, Copilot, Llama, Mistral, and DeepSeek.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires Chrome 88+, Firefox 85+, Safari 14+, or Edge 88+ with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Multi-model cross-validation against ChatGPT, Claude, Gemini, and other LLMs",
    "Real-time perplexity analysis using entropy-based calculations",
    "Dynamic burstiness visualization for sentence structure variation",
    "One-click AI text humanizer with natural rhythmic rewriting",
    "Interactive probability charts including doughnut and radar visualizations",
    "Zero-upload privacy processing with encrypted API connections",
    "No account registration or subscription required for free tier",
    "Visual dashboard with bar graphs and multi-dimensional AI signal analysis",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Detect AI-Generated Text",
  description:
    "Use this free AI text detector to find out if content was written by ChatGPT, Claude, Gemini, or another AI model in under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free AI Text Detector",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your Text",
      text: "Copy the text you want to analyze and paste it into the input field on the AI text detector tool.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Detect AI Content",
      text: "Press the Detect AI Content button to submit your text for multi-model analysis and statistical evaluation.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Your Results",
      text: "View your AI probability score, perplexity level, burstiness score, and detailed explanation in the Analysis tab.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Humanize If Needed",
      text: "If the text is detected as AI-generated, click Make It Human to get a rewritten version with natural human writing patterns.",
      url: TOOL_URL,
    },
  ],
}

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
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
      name: "Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Free AI Text Detector",
      item: TOOL_URL,
    },
  ],
}

export default function Page() {
  const schemas = [
    webApplicationSchema,
    howToSchema,
    faqPageSchema,
    breadcrumbSchema,
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <>
        <header className="mb-6 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free AI Text Detector — Check If Text Is AI-Generated
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Instantly analyze any text to detect <strong>ChatGPT</strong>,{" "}
            <strong>Claude</strong>, <strong>Gemini</strong>, or other AI authorship. Get a
            probability score, perplexity and burstiness metrics, visual charts, and a one-click
            humanizer — completely free, no sign-up required.
          </p>
          <QuickAnswer
            question="What is an AI text detector?"
            answer="An AI text detector analyzes perplexity and burstiness in writing to estimate the probability that text was generated by ChatGPT, Claude, Gemini, or another AI model. Scores above 70% indicate likely AI authorship."
          />
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-muted-foreground"
          >
            <ol
              className="flex items-center gap-1"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <a href={SITE_URL} itemProp="item" className="hover:underline">
                  <span itemProp="name">Home</span>
                </a>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true">›</li>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <a
                  href={`${SITE_URL}/tools`}
                  itemProp="item"
                  className="hover:underline"
                >
                  <span itemProp="name">Tools</span>
                </a>
                <meta itemProp="position" content="2" />
              </li>
              <li aria-hidden="true">›</li>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <span itemProp="name">Free AI Text Detector</span>
                <meta itemProp="item" content={TOOL_URL} />
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
        </header>

        <main>
          <ClientPage faqs={FAQ_ITEMS} />
        </main>

        <EmailCapture />

        <hr className="my-12 border-border" />

        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            How AI Text Detection Works — And Why It Has a High False Positive Rate
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A university professor submitted a paragraph from a 1987 academic
              paper about thermodynamics to three leading AI text detectors.
              GPTZero classified it as 94% AI-generated. Originality.ai: 88%
              AI-generated. The text was written entirely by a human, 37 years
              before ChatGPT existed. This is not a fringe failure; research from
              Stanford (2024) found false positive rates of 9–16% on
              non-native English writing and formal academic prose — precisely
              the text that most resembles LLM output.
            </p>
            <p className="text-muted-foreground mb-4">
              Understanding why this happens makes the detection score
              interpretable rather than just a verdict.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              The Two Detection Mechanisms
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Method</th>
                    <th className="border border-border p-2 text-left">How it works</th>
                    <th className="border border-border p-2 text-left">Weakness</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Perplexity scoring', 'Measures how surprising each word choice is. LLMs choose predictable words; humans make surprising choices.', 'Formal, precise writing is also low-perplexity — it trips false positives on academic and legal text'],
                    ['Burstiness analysis', 'Human writing alternates between short and long sentences irregularly. LLM writing is more uniform.', 'Professional editors smooth out burstiness; edited human writing looks more AI-like'],
                    ['Watermark detection', 'Detects cryptographic watermarks embedded by some LLMs at generation time.', 'Only works if the original model embedded a watermark — most public APIs do not'],
                  ].map(([method, how, weakness]) => (
                    <tr key={method} className="border border-border">
                      <td className="border border-border p-2 font-medium">{method}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{how}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What the Score Actually Means
            </h3>
            <p className="text-muted-foreground mb-4">
              A score of &quot;85% AI-generated&quot; does not mean 85% of the text was
              generated by AI. It means the statistical properties of the text
              fall in the region of the detector&apos;s training distribution that
              corresponds to AI output — 85% of the way from the human cluster to
              the AI cluster. Two pieces of text can receive the same score for
              completely different reasons: one because it was actually AI-written,
              one because the human author writes in a clear, structured style.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              When to Trust the Score
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>High confidence (above 90%):</strong> On informal,
                conversational text (forum posts, casual emails, personal
                narratives), a 90%+ score is a meaningful signal — humans in
                these registers are highly variable, so hitting the AI pattern is
                unlikely by accident.
              </li>
              <li>
                <strong>Low confidence (50–80%):</strong> The score is ambiguous.
                Do not use it as evidence in an academic integrity case.
              </li>
              <li>
                <strong>Academic or technical prose:</strong> Treat any score
                under 95% as noise. The false positive risk is too high.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Limitations
            </h3>
            <p className="text-muted-foreground mb-4">
              The detector is blind to paraphrased AI content (AI output
              rewritten by a human), mixed authorship (human outline + AI
              expansion + human edit), and content generated by models released
              after the detector&apos;s training cutoff. It is a probabilistic screen,
              not forensic evidence.
            </p>
          </div>

          <RelatedTools
            tools={[
              { name: "AI Text Humanizer", path: "/tools/text-humanizer" },
              { name: "AI Paraphrasing Tool", path: "/tools/ai-paraphrasing-tool-and-rewriter" },
              { name: "Clean Text with AI", path: "/tools/clean-text-using-ai" },
            ]}
          />
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>TheFreeAITools — Free AI Text Detector</strong> is a browser-based tool for detecting AI-generated content in essays, articles, emails, cover letters, and more. It supports detection of text produced by <strong>ChatGPT (GPT-4, GPT-4o, GPT-3.5)</strong>, <strong>Claude (Anthropic)</strong>, <strong>Google Gemini</strong>, <strong>Microsoft Copilot</strong>, <strong>Llama</strong>, <strong>Mistral</strong>, <strong>DeepSeek</strong>, and other large language models. All analysis happens through encrypted connections with zero content storage in 2026. Use it for academic integrity checks, SEO content auditing, editorial review, and employment screening — completely free with no account required.
          </p>
          <p>
            Searches related to this tool:{" "}
            <em>
              detect AI text free, AI content checker, detect using ai, check using chatgpt, how to tell if text is AI written, is this essay AI generated, ChatGPT detector online, AI writing checker for teachers, free AI plagiarism detector, check AI percentage, perplexity burstiness AI, humanize AI text online, using claude ai, detect text using ai.
            </em>
          </p>
        </footer>
      </>
    </>
  )
}