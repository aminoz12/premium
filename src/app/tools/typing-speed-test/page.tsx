import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/typing-speed-test"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 56 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Typing Speed Test — Average WPM Benchmark, Improve to 70 WPM Free",
  description:
    "Test your typing speed WPM and compare to average benchmarks by skill level and profession. See exactly how fast you need to type for data entry, transcription, or admin jobs. Free, no signup.",
  keywords: [
    "typing speed test",
    "typing speed test online free no signup",
    "wpm test online free",
    "typing test",
    "words per minute test",
    "typing accuracy test",
    "free typing test",
    "online typing test",
    "wpm counter",
    "typing practice",
    "how fast can i type",
    "keyboard typing test",
    "touch typing test",
    "net wpm test",
    "typing speed checker",
    "free wpm test 2026",
    "no signup typing test",
    "accurate typing speed test 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Typing Speed Test — Measure WPM & Accuracy Online",
    description:
      "Test your typing speed for free. Measure WPM, accuracy, and net WPM in real time. Includes difficulty levels, history tracking, keyboard heatmap, and sound feedback.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Typing Speed Test — WPM & Accuracy by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Typing Speed Test — WPM & Accuracy Online",
    description:
      "Measure your typing speed with WPM, accuracy, and net WPM. Free typing test with difficulty levels, history tracking, and keyboard heatmap.",
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
  name: "Typing Speed Test — Free WPM Test",
  url: TOOL_URL,
  description:
    "A free online typing speed test that measures WPM, accuracy, and net WPM in real time. Includes difficulty levels, history tracking, keyboard heatmap, and sound feedback. No account required.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time WPM and accuracy measurement",
    "Gross WPM and Net WPM calculation",
    "Easy, Medium, Hard difficulty levels",
    "15s, 30s, 60s, 2min, 5min timer modes",
    "Test history and personal best tracking",
    "Keyboard error heatmap",
    "Dark and light mode",
    "Sound feedback",
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
  name: "How to Test Your Typing Speed Online",
  description:
    "A simple step-by-step guide to measuring your typing speed (WPM), accuracy, and net WPM using our free online typing test.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Typing Speed Test",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose Your Test Settings",
      text: "Select a difficulty level (Easy, Medium, or Hard) and a timer duration (15s, 30s, 60s, 2min, or 5min). Adjust the language and word list if needed.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Start Typing the Words",
      text: "Click the 'Start' button and begin typing the words displayed on the screen as quickly and accurately as possible. The timer will count down automatically.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Your Results",
      text: "When the timer reaches zero, the tool will instantly display your typing speed in WPM, your accuracy percentage, and your net WPM score. A keyboard heatmap shows which keys you missed most.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Track Your Progress Over Time",
      text: "Your results are saved locally in your browser, allowing you to track your personal bests and monitor your improvement over days or weeks.",
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
      name: "What is a good typing speed in WPM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The average professional types 40–60 WPM. A good target for office work is 65–75 WPM. Programmers and writers often aim for 80–100 WPM. Above 120 WPM puts you in the top 1% globally.",
      },
    },
    {
      "@type": "Question",
      name: "How is WPM calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WPM = (total correctly typed characters ÷ 5) ÷ elapsed minutes. Net WPM additionally subtracts one word per error per minute as a penalty.",
      },
    },
    {
      "@type": "Question",
      name: "Is this typing speed test free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely free. No account, no signup, no download required. Your results are stored locally in your browser and never leave your device.",
      },
    },
    {
      "@type": "Question",
      name: "How can I improve my typing speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Practice touch typing daily, use correct finger placement on the home row (ASDF JKL;), prioritize accuracy before speed, and practice 15–30 minutes per day consistently. Our heatmap helps identify your weakest keys.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between gross WPM and net WPM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gross WPM measures total speed including errors, while net WPM penalizes mistakes by subtracting one word from your total for every error made. Net WPM is a more accurate measure of real-world typing proficiency.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free typing test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. All features including difficulty levels, timer modes, history tracking, heatmap, and sound feedback are included. The only requirement is a modern web browser with JavaScript enabled.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Productivity Tools > Tool ──────

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
      name: "Productivity Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Typing Speed Test",
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
            Typing Speed Test — Average WPM Benchmark & How to Improve Free
          </h1>
          <img src="/images/typing-speed-test.webp" alt="Free Typing Speed Test — measure WPM, accuracy, and net WPM online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Test your typing speed for free. Measure your <strong>WPM</strong>,
            <strong>accuracy</strong>, and <strong>net WPM</strong> in real time. Includes
            difficulty levels, history tracking, a keyboard heatmap, and sound feedback.
            No account required — your data stays in your browser.
          </p>

          <QuickAnswer
            question="What is the average typing speed in WPM?"
            answer="The average typing speed for adults is 40–50 WPM with ~92% accuracy. Professional typists average 70–80 WPM. Data entry jobs typically require 45–60 WPM; transcriptionists need 75+ WPM. Take this test to see where you stand and track improvement over time."
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
                  Productivity Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Typing Speed Test</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Typing Speed Test Tool">
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
          <meta itemProp="name" content="Typing Speed Test: WPM Scores Explained and How to Improve" />
          <meta
            itemProp="description"
            content="What WPM and accuracy scores actually measure, average typing speeds by role, and the two techniques that reliably improve speed without sacrificing accuracy."
          />
          <meta itemProp="datePublished" content="2024-03-14" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What WPM means */}
          <section aria-labelledby="what-wpm-means" className="space-y-4">
            <h2
              id="what-wpm-means"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What WPM actually measures
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Words Per Minute (WPM) is calculated by dividing the number of characters
              typed by 5 (the standard &quot;word length&quot; used universally), then dividing
              by the time in minutes. This means WPM is really a character rate, not a
              word count — short words inflate it, long technical words deflate it.
              Most typing tests use this standardized measure so scores are comparable
              across different text samples.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Accuracy is measured separately: the percentage of keystrokes that were
              correct. A raw WPM of 80 at 95% accuracy is a net WPM of roughly 72
              (subtracting errors as penalty words). A test that doesn&apos;t show accuracy
              separately is missing half the picture — fast but inaccurate typing is
              slower in practice because of backspacing.
            </p>
          </section>

          {/* Speed reference */}
          <section
            aria-labelledby="speed-reference"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="speed-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Typing speed benchmarks by role
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Role / context</th>
                    <th className="border border-border p-2 text-left font-semibold">Average WPM</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['General population', '40–50 WPM', 'Two-finger or self-taught typists'],
                    ['Office worker', '55–65 WPM', 'Regular email and document typing'],
                    ['Software developer', '60–75 WPM', 'Code typing is slower due to symbols and syntax'],
                    ['Professional typist', '70–90 WPM', 'Data entry, transcription roles'],
                    ['Top competitive typists', '130–180 WPM', 'TypeRacer / Monkeytype leaderboard range'],
                  ].map(([role, wpm, notes]) => (
                    <tr key={role}>
                      <td className="border border-border p-2 text-muted-foreground">{role}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{wpm}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to improve */}
          <section aria-labelledby="how-to-improve" className="space-y-4">
            <h2
              id="how-to-improve"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Two techniques that actually improve speed
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>1. Slow down to remove errors.</strong> Counterintuitively, the
              fastest path to higher WPM is slowing down until your accuracy reaches
              98%+. Muscle memory for correct keystrokes builds faster than muscle
              memory for wrong-then-backspace. Practice at a pace where you rarely
              make errors for 2–3 weeks before pushing speed.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>2. Practice your problem keys, not random text.</strong> Most
              speed losses come from 5–10 specific letter combinations. Identify which
              bigrams (two-letter sequences) slow you down most — often keys like
              &quot;qu&quot;, &quot;th&quot; on a QWERTY layout when reaching with the wrong finger —
              and drill those specifically rather than practicing full paragraphs.
              Tools like Keybr.com auto-detect your weak spots and weight practice
              sessions accordingly.
            </p>
          </section>

          {/* WPM benchmarks by profession */}
          <section aria-labelledby="wpm-benchmarks" className="space-y-4">
            <h2
              id="wpm-benchmarks"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Typing speed requirements by job — WPM benchmarks
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Many jobs list a minimum WPM requirement. Here&apos;s what different roles
              actually expect — and how your score compares:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Role</th>
                    <th className="border border-border p-2 text-left font-semibold">Typical WPM requirement</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['General office / admin assistant', '40–50 WPM', 'Most entry-level office jobs; accuracy matters more than speed'],
                    ['Data entry clerk', '45–65 WPM', 'Often tested during hiring; numeric keypad speed also assessed separately'],
                    ['Customer service / chat support', '45–55 WPM', 'Must type while reading customer messages simultaneously'],
                    ['Legal secretary', '65–80 WPM', 'Accuracy is critical; legal documents have zero tolerance for errors'],
                    ['Medical transcriptionist', '75–100 WPM', 'Requires 98%+ accuracy; audio playback slows effective typing rate'],
                    ['Court reporter (stenograph)', '225+ WPM', 'Uses stenotype machine, not a standard keyboard'],
                    ['Software developer', 'Any speed', 'WPM rarely specified; most developers type 50–80 WPM naturally'],
                    ['Average adult (non-professional)', '40–50 WPM', 'Global average; mobile thumb-typing is typically 30–40 WPM'],
                    ['Average professional typist', '70–80 WPM', 'Trained typists with dedicated practice'],
                    ['Elite competitive typist', '120–200+ WPM', 'Top performers on TypeRacer, Monkeytype, etc.'],
                  ].map(([role, wpm, notes]) => (
                    <tr key={role}>
                      <td className="border border-border p-2 font-medium text-foreground">{role}</td>
                      <td className="border border-border p-2 font-bold text-foreground">{wpm}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
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
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Word Counter", path: "/tools/word-counter" },
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                  { name: "Case Converter", path: "/tools/case-converter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Typing Speed Test</strong> is a fully private,
            browser-based tool that measures your <strong>WPM</strong>, <strong>net WPM</strong>,
            and <strong>accuracy</strong> in real time. Includes difficulty levels, multiple
            timer modes, a keyboard heatmap, test history, and personal best tracking.
            All processing runs locally on your device — your typing data never leaves your
            computer. The fastest free way to test and improve your typing speed in 2026,
            with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}