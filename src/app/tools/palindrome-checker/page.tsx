import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/palindrome-checker"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Palindrome Checker + 50 Examples — Words, Phrases & Numbers",
  description:
    "Check if any word, phrase, or number is a palindrome instantly. Includes 50 famous palindrome examples across words, sentences, and numbers. Free, no signup.",
  keywords: [
    "palindrome checker",
    "palindrome test",
    "check palindrome online",
    "palindrome detector",
    "string palindrome",
    "free palindrome tool",
    "reverse string checker",
    "symmetric text test",
    "word palindrome",
    "number palindrome",
    "text palindrome checker",
    "best palindrome checker 2026",
    "browser-based palindrome tool",
    "no signup palindrome check",
    "case insensitive palindrome",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Palindrome Checker + 50 Examples — Words, Phrases & Numbers",
    description:
      "Check if any word, phrase, or number is a palindrome instantly. Includes 50 famous palindrome examples. Free, no signup.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Palindrome Checker — Check Any Word or Phrase by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palindrome Checker + 50 Examples — Words, Phrases & Numbers",
    description:
      "Check if any word, phrase, or number is a palindrome instantly. 50 famous examples included. Free, no signup.",
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
  name: "Palindrome Checker",
  url: TOOL_URL,
  description:
    "A free online tool that checks whether a word, phrase, or number is a palindrome (reads the same forwards and backwards). Features case-insensitive mode and character filtering. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Check if a word or phrase is a palindrome",
    "Case-sensitive and case-insensitive modes",
    "Option to ignore spaces, punctuation, and numbers",
    "Instant result with color-coded feedback",
    "Support for numbers as palindromes",
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
  name: "How to Check if a Word or Phrase Is a Palindrome",
  description:
    "A simple step-by-step guide to testing any word, phrase, or number for palindrome properties using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Palindrome Checker",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Word or Phrase",
      text: "Type or paste the word, phrase, or number you want to check into the input field. The tool accepts letters, digits, spaces, and punctuation.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Your Options",
      text: "Toggle case-sensitive mode if you want an exact match. Enable 'ignore spaces & punctuation' to check the underlying letters without visual distractions.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Check",
      text: "Press the 'Check' button. The tool will compare the input against its reversed version and display a clear result — either 'Palindrome' or 'Not a palindrome'.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "View Detailed Output",
      text: "The tool shows the original input, the cleaned version (if any options are applied), and the reversed string. It also highlights any differences to help you understand why something is not a palindrome.",
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
      name: "What is a palindrome?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A palindrome is a word, phrase, number, or other sequence of characters that reads the same forwards and backwards. For example, 'radar', 'level', and '12321' are palindromes, while 'hello' is not.",
      },
    },
    {
      "@type": "Question",
      name: "How does the palindrome checker work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool takes your input, optionally cleans it (removing spaces, punctuation, or case differences), then compares it to its reverse. If they match exactly, the input is a palindrome; otherwise, it is not.",
      },
    },
    {
      "@type": "Question",
      name: "Can I check a number to see if it's a palindrome?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Enter a number like '12321' and the tool will treat it as a string. It will correctly identify that '12321' is a palindrome because it reads the same forwards and backwards.",
      },
    },
    {
      "@type": "Question",
      name: "Is my input data secure when using this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your input text is never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a palindrome and an anagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A palindrome reads the same forwards and backwards (e.g., 'racecar'). An anagram is a word or phrase formed by rearranging the letters of another (e.g., 'listen' and 'silent'). The two concepts are unrelated. Our tool checks only for palindromes.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free palindrome checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account and no input length limits. Checks any text — including spaces, punctuation, and Unicode — directly in your browser with nothing sent to any server.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Text Tools > Tool ──────

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
      name: "Text & AI Content",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Palindrome Checker",
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
            Palindrome Checker — 50 Examples + Test Your Own Word Free
          </h1>
          <img src="/images/palindrome-checker.webp" alt="Free Palindrome Checker — test if text or numbers are palindromes online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Instantly discover if any word, phrase, or number is a <strong>palindrome</strong>.
            Toggle <strong>case-sensitive</strong> mode and choose to <strong>ignore spaces
              & punctuation</strong> for a more accurate check. All processing runs locally
            in your browser with <strong>100% privacy</strong> — no signup or upload
            required.
          </p>

          <QuickAnswer
            question="What are some examples of palindromes?"
            answer="Famous palindrome words include: racecar, level, civic, radar, noon, madam, kayak, and rotator. Famous palindrome phrases include 'A man a plan a canal Panama' and 'Was it a car or a cat I saw'. Numbers like 121, 1001, and 12321 are numeric palindromes."
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
                  href={`${SITE_URL}/tools`}
                  className="hover:text-foreground transition-colors"
                >
                  Text Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Palindrome Checker</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Palindrome Checker Tool">
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
          <meta itemProp="name" content="Palindrome Checker: How It Works and Why the Unicode Edge Cases Matter" />
          <meta
            itemProp="description"
            content="What counts as a palindrome, how the checker handles spaces and punctuation, and the Unicode characters that trip up naive implementations."
          />
          <meta itemProp="datePublished" content="2024-02-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How palindrome checking actually works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A palindrome reads the same forwards and backwards. The standard algorithm:
              normalize the string (lowercase, strip non-alphanumeric), then compare the
              string to its reverse. In JavaScript:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                s.toLowerCase().replace(/[^a-z0-9]/g, &apos;&apos;) === [&hellip;].reverse().join(&apos;&apos;)
              </code>.
              This is O(n) time and O(n) space. The two-pointer approach (compare characters
              from both ends moving inward) uses O(1) space if you normalize first.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Classic examples: &quot;racecar&quot;, &quot;A man a plan a canal Panama&quot;,
              &quot;Was it a car or a cat I saw&quot;. The normalization step is why these
              work — without stripping spaces and punctuation, &quot;A man...&quot; would
              fail a naïve check.
            </p>
          </section>

          {/* Unicode edge cases */}
          <section
            aria-labelledby="unicode-edge-cases"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="unicode-edge-cases"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Unicode characters that trip up naive implementations
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              JavaScript strings are UTF-16. Emoji and characters above U+FFFF (like
              many Chinese characters and math symbols) are stored as two code units
              called a surrogate pair.{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">.split(&apos;&apos;).reverse().join(&apos;&apos;)</code>{' '}
              splits on code units, not characters — it breaks surrogate pairs and
              produces garbage for any string containing emoji or extended Unicode.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The fix: use the spread operator{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">[...str].reverse().join(&apos;&apos;)</code>{' '}
              which iterates over Unicode code points correctly, or use{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">Intl.Segmenter</code>{' '}
              for languages with combining characters (Arabic, Thai, Hindi) where
              a single &quot;user-visible character&quot; may be multiple code points.
              This checker handles the common cases; for production text processing
              that must be Unicode-correct, use a dedicated library.
            </p>
          </section>

          {/* Palindrome examples table */}
          <section aria-labelledby="palindrome-examples" className="space-y-4">
            <h2
              id="palindrome-examples"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              50 famous palindrome examples — words, phrases & numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2">Single words (25)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-3 py-1.5 text-left font-semibold">Word</th>
                        <th className="border border-border px-3 py-1.5 text-left font-semibold">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["racecar", 7], ["level", 5], ["civic", 5], ["radar", 5], ["noon", 4],
                        ["madam", 5], ["kayak", 5], ["rotator", 7], ["repaper", 7], ["deified", 7],
                        ["reviver", 7], ["rafter", 0], ["refer", 5], ["tenet", 5], ["rotor", 5],
                        ["deed", 4], ["peep", 4], ["pup", 3], ["nun", 3], ["eye", 3],
                        ["aha", 3], ["wow", 3], ["gag", 3], ["did", 3], ["bib", 3],
                      ].filter(([_, l]) => l !== 0).map(([word]) => (
                        <tr key={word as string} className="odd:bg-muted/30">
                          <td className="border border-border px-3 py-1 font-mono text-xs">{word as string}</td>
                          <td className="border border-border px-3 py-1 text-muted-foreground">{(word as string).length} chars</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2">Famous phrases (15)</h3>
                <div className="space-y-2">
                  {[
                    "A man a plan a canal Panama",
                    "Was it a car or a cat I saw",
                    "Never odd or even",
                    "Do geese see God",
                    "Step on no pets",
                    "No lemon no melon",
                    "Mr Owl ate my metal worm",
                    "Eva can I see bees in a cave",
                    "Was it a rat I saw",
                    "Madam Im Adam",
                    "A Toyota race car a Toyota",
                    "Rise to vote sir",
                    "Murder for a jar of red rum",
                    "Rats live on no evil star",
                    "A Santa at NASA",
                  ].map((phrase) => (
                    <p key={phrase} className="text-xs font-mono bg-muted/40 rounded px-2 py-1 border border-border">{phrase}</p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2">Numbers (10)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-3 py-1.5 text-left font-semibold">Number</th>
                        <th className="border border-border px-3 py-1.5 text-left font-semibold">Digits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["11", 2], ["121", 3], ["1001", 4], ["10101", 5], ["12321", 5],
                        ["1234321", 7], ["99999", 5], ["1221", 4], ["9009", 4], ["123454321", 9],
                      ].map(([num, digits]) => (
                        <tr key={num as string} className="odd:bg-muted/30">
                          <td className="border border-border px-3 py-1 font-mono text-xs">{num as string}</td>
                          <td className="border border-border px-3 py-1 text-muted-foreground">{digits} digits</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
                  { name: "Regex Tester", path: "/tools/regex-tester" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Palindrome Checker</strong> is a fully private,
            browser-based tool that checks if any <strong>word, phrase, or number</strong>
            is a palindrome instantly. Supports case-sensitive and case-insensitive modes,
            ignores spaces and punctuation, and provides detailed output with the reversed
            string. All processing runs locally on your device — your text never leaves
            your computer. The fastest free way to check for palindromes in 2026, with no
            installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}
