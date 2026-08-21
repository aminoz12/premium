import { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ClientPage from "./client-page"
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/word-counter"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── Metadata & Freshness ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  // Title is exactly 49 chars (Fits SERP perfectly)
  title: "Word Counter — Free Online Character & Text Tool",
  description:
    "Free online word counter, character counter, and text analyzer. Instantly calculate word count, reading time, and text statistics securely in your browser.",
  keywords: [
    "word counter",
    "character counter",
    "text analyzer",
    "letter counter",
    "reading time calculator",
    "word count tool",
    "online word tracker",
    "character counter with spaces",
    "paragraph counter",
    "sentence counter",
    "seo word count",
    "essay word counter",
    "best word counter 2026", // Year updated
    "free word counter online",
    "secure text counter",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Word Counter — Free Online Character & Text Tool",
    description:
      "Instantly calculate word count, characters, sentences, and reading time. 100% secure, private, and client-side text analysis.",
    type: "website",
    url: TOOL_URL,
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Word Counter — Free Online Tool by The Free AI Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Word & Character Counter Tool",
    description:
      "Check your word count and character limits instantly. Perfect for SEO, essays, and social media.",
    images: [`${TOOL_URL}/opengraph-image`],
  },
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Word Counter",
  url: TOOL_URL,
  description:
    "A free online utility for writers, students, and professionals to instantly calculate word counts, character limits, sentence totals, and estimated reading times.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Instant word counting",
    "Character count with and without spaces",
    "Sentence and paragraph counting",
    "Estimated reading and speaking time",
    "Keyword density analysis",
    "100% secure client-side processing",
    "Real-time text metrics",
  ],
}

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Count Words and Characters",
  description:
    "A quick step-by-step guide on how to track your text metrics, word count, and character limits using our free tool.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Input your Text",
      text: "Start typing directly into the text editor, or copy and paste your existing content from a Word document, Google Doc, or website.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "View Instant Metrics",
      text: "Look at the real-time statistics panel. The tool instantly calculates the total words, characters, sentences, and paragraphs as you type.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Check Reading Time",
      text: "Review the estimated reading time and speaking time metrics to ensure your content fits your target audience's attention span or presentation slot.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Edit and Refine",
      text: "Use the live metrics to trim down your text for social media limits, or expand your content to meet academic or SEO word count requirements.",
    },
  ],
}

// Zero Schema Duplication: No HTML Microdata used for FAQ
const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is my text secure when using this word counter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. Our Word Counter runs entirely in your browser using client-side JavaScript. Your text is never sent over the internet, stored on any server, or saved in any database.",
      },
    },
    {
      "@type": "Question",
      name: "How does the tool calculate reading time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The estimated reading time is calculated based on the average adult reading speed, which is approximately 225 to 250 words per minute. Speaking time is calculated at roughly 130 words per minute.",
      },
    },
    {
      "@type": "Question",
      name: "Does it count characters with or without spaces?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our tool calculates and displays both metrics simultaneously. You can easily see your total character count including spaces, as well as the exact character count excluding spaces.",
      },
    },
    {
      "@type": "Question",
      name: "Why is word count important for SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Search engines favor comprehensive, in-depth content. While there is no strict minimum, long-form articles (typically 1,000 to 2,000+ words) often rank higher because they tend to answer user queries more thoroughly and earn more backlinks.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Once the page has loaded in your browser, you can disconnect your internet connection and continue using the word and character counter indefinitely.",
      },
    },
  ],
}

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Text & AI Content", item: `${SITE_URL}/categories/text` },
    { "@type": "ListItem", position: 3, name: "Word Counter", item: TOOL_URL },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />


      <div className="px-12 py-4">

        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/categories/text" className="hover:text-foreground transition-colors">Text Tools</a></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-foreground font-medium">Word Counter</span></li>
          </ol>
        </nav>

        <header className="space-y-4 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Free Online Word & Character Counter
          </h1>

          <QuickAnswer
            question="What are the character limits for Twitter, LinkedIn, and SMS?"
            answer="Twitter/X: 280 characters per post. LinkedIn: 3,000 for posts, 300 for connection requests. SMS: 160 characters (GSM-7 encoding) or 70 characters (Unicode/emoji). YouTube descriptions: 5,000 characters. Meta descriptions: ~155–160 characters for Google display. Paste your text here to check exact counts instantly."
          />

          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Instantly track your word count, character limits, sentence totals, and estimated reading time.
            A <strong>100% secure</strong>, client-side text analyzer built for writers, students, SEO professionals, and marketers. No data is ever sent to our servers.
          </p>
        </header>
        <img src="/images/word-counter.webp" alt="Free Word Counter — count words, characters, and reading time online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />

        <main id="tool" aria-label="Word Counter Tool">
           <ClientPage />
        </main>

        <hr className="border-border" />

        {/* ── AdSense High Value Content Injection ── */}
        <article
          className="space-y-12"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Word Counter: How It Counts and Where It Differs from Word Processors" />
          <meta
            itemProp="description"
            content="The tool counts words by splitting on whitespace. It differs from Google Docs in one key way: it counts only what you paste, nothing more. Honest limitations included."
          />
          <meta itemProp="datePublished" content="2024-01-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* The problem */}
          <section aria-labelledby="problem-heading" className="space-y-4">
            <h2
              id="problem-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When word processors give you the wrong count
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Google Docs counts everything in the document — headers, footers, footnotes,
              captions — unless you manually select body text first and then check &quot;Selected
              text only.&quot; Most people don&apos;t do this. The result: you think you hit the 250-word
              abstract limit for your journal submission, but 40 of those words are in footnotes
              that the editor&apos;s system won&apos;t count.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              This tool counts exactly what you paste. Copy just the body text, paste it here,
              and get the count for that specific text. No headers, no hidden metadata, no
              document-level settings to toggle. It also handles cases where you need character
              counts with or without spaces — a metric Google Docs buries in a submenu, but
              which LinkedIn posts, Twitter/X, and SMS gateways actually enforce.
            </p>
          </section>

          {/* Character limits by platform */}
          <section
            aria-labelledby="platform-limits"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="platform-limits"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Character limits you actually need to know
            </h2>
            <p className="text-sm text-muted-foreground">
              Platform limits as of May 2026. When a platform says &quot;characters&quot; it usually
              means Unicode code points, not bytes — emoji count as 1, not 4.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform / Context</th>
                    <th className="border border-border p-2 text-left font-semibold">Limit</th>
                    <th className="border border-border p-2 text-left font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Twitter / X post', '280', 'characters (URLs count as 23)'],
                    ['LinkedIn post', '3,000', 'characters'],
                    ['LinkedIn article title', '150', 'characters'],
                    ['Instagram caption', '2,200', 'characters (only 125 shown before More)'],
                    ['Meta title tag', '50–60', 'characters (SERP display, not hard limit)'],
                    ['Meta description', '155–160', 'characters (SERP display, not hard limit)'],
                    ['SMS (GSM-7)', '160', 'characters per segment (multi-part above 160)'],
                    ['YouTube video title', '100', 'characters (60 shown in search)'],
                    ['Email subject line', '~60', 'characters shown in most clients'],
                  ].map(([platform, limit, type]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 text-muted-foreground">{platform}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{limit}</td>
                      <td className="border border-border p-2 text-muted-foreground">{type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How it counts — and where it differs */}
          <section aria-labelledby="how-counting-works" className="space-y-4">
            <h2
              id="how-counting-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How the counter works — and where you&apos;ll see differences
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Words are counted by splitting the text on whitespace sequences — the same
              approach used by Unix&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">wc -w</code> command.
              A &quot;word&quot; is any non-whitespace sequence. Reading time is estimated at 238 words
              per minute, which is the median silent reading speed for adults according to a
              2019 meta-analysis across 190 studies.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Three edge cases where counts differ between tools:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Hyphenated words</span>
                <span>
                  &quot;well-known&quot; counts as <em>one word</em> here (no space = one token). MS Word
                  and Google Docs also count it as one. Some academic style guides count it
                  as two. If your submission has a strict limit and uses hyphenated compounds,
                  check the style guide.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">URLs</span>
                <span>
                  A URL like{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">https://example.com/path?q=1</code>{' '}
                  counts as one word. In practice, a link in your text will inflate word count
                  by 1 but character count significantly.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Code blocks</span>
                <span>
                  If you paste code, every token (function name, variable, keyword) counts
                  as a word. A 10-line function might add 30–50 words to your count. Copy
                  prose sections separately from code if you need accurate word counts for
                  written content.
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
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                  { name: "Diff Checker", path: "/tools/diff-checker" },
                ]}
              />
            </nav>
          </section>
        </article>
      </div>
    </>
  )
}
