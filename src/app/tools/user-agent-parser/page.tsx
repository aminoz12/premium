import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools"
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/user-agent-parser"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 57 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free User Agent Parser — Analyze Any UA String Online",
  description:
    "Parse any user agent string to identify browser, OS, device, and engine. Free, client-side tool for developers, SEOs, and QA engineers. No uploads.",
  keywords: [
    "user agent parser",
    "ua parser",
    "user agent analyzer",
    "browser detection tool",
    "parse user agent string online",
    "identify browser by user agent",
    "detect os from user agent",
    "device detection tool",
    "free user agent lookup",
    "user agent to device mapper",
    "browser version detector",
    "seo user agent checker",
    "client-side ua parser 2026",
    "bot detection tool",
    "analyze ua string",
    "ua lookup online free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "User Agent Parser — Free Online UA String Analyzer",
    description:
      "Decode any user agent string in milliseconds. Identify browser, operating system, device, and rendering engine with 100% accuracy. All processing is local and private.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free User Agent Parser — Online UA String Analyzer by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free User Agent Parser — Fast UA String Analyzer",
    description:
      "Decode browser, OS, device, and more from any user agent string. Free, private, and client-side.",
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
  name: "User Agent Parser",
  url: TOOL_URL,
  description:
    "A free online developer tool to instantly parse and analyze any user agent string, identifying the browser, operating system, device model, and rendering engine.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Parse user agent strings instantly",
    "Identify browser name and version",
    "Detect operating system and version",
    "Identify device type (mobile, tablet, desktop)",
    "Detect rendering engine (Blink, Gecko, WebKit)",
    "100% client-side privacy",
    "Copy parsed data to clipboard",
    "Free and unlimited usage",
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
  name: "How to Parse a User Agent String",
  description:
    "A quick step-by-step guide to analyzing any user agent string and extracting browser, OS, and device information using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools User Agent Parser",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste or Input the User Agent String",
      text: "Copy the full user agent string from your browser's developer console, a log file, or your analytics platform. Paste it into the input field of our tool.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click the Parse Button",
      text: "Click the 'Parse' button or press Enter. The tool will instantly process the string using a local JavaScript library, no data leaves your device.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Parsed Results",
      text: "The tool will display a clean, organized breakdown of the user agent, showing the browser, version, operating system, device type, and rendering engine.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy the Parsed Data",
      text: "Click the 'Copy' button to copy the parsed information as JSON to your clipboard, or download the results as a text file for further analysis.",
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
      name: "What is a user agent string?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A user agent string is a text string that a web browser sends to a website to identify itself and its capabilities. It includes information about the browser name, version, the operating system, the device type, and often the rendering engine. It's essential for web analytics, content negotiation, and bot detection.",
      },
    },
    {
      "@type": "Question",
      name: "Is my user agent data secure when using this parser?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. This tool runs entirely in your browser using client-side JavaScript. The user agent string you paste is never sent to our servers, stored in databases, or logged anywhere.",
      },
    },
    {
      "@type": "Question",
      name: "Can I parse a user agent string from an older browser?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool supports parsing user agent strings from legacy browsers such as Internet Explorer 11, older versions of Chrome and Firefox, and even niche or discontinued browsers. The library used is updated regularly.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool detect bots and crawlers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The parser can identify user agent strings belonging to common search engine bots (Googlebot, Bingbot, Applebot, YandexBot) and many other crawlers, making it useful for testing `robots.txt` and server logs.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between user agent parsing and client hints?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "User agent parsing interprets the UA string provided by the browser, which can be accurate but is sometimes intentionally spoofed for privacy. Client Hints (like `Sec-CH-UA`) are a newer, more reliable HTTP header system that sends structured browser and device data. Our tool parses the UA string only.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limitations of this free user agent parser?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It parses standard user agent strings and can identify most common browsers, OS versions, and device types. For extremely obscure or custom UA strings, the results may be less accurate.",
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
      name: "User Agent Parser",
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
            Free User Agent Parser — Analyze Any UA String Instantly
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Paste any <strong>user agent string</strong> and instantly identify the
            <strong>browser</strong>, <strong>operating system</strong>, <strong>device</strong>,
            and <strong>rendering engine</strong>. All processing runs locally in your browser
            with 100% privacy — no data is ever uploaded.
          </p>

          <QuickAnswer
            question="How do I parse a user agent string for free?"
            answer="Paste the user agent string into the input field and click 'Parse'. The tool will instantly decode the browser, OS, device, and engine. All processing is client-side and private."
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
                <span className="text-foreground font-medium">User Agent Parser</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="User Agent Parser Tool">
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
          <meta itemProp="name" content="User Agent Parser: What Browser Strings Actually Mean and Why They're Unreliable" />
          <meta
            itemProp="description"
            content="Why user agent strings look like a mess of contradictions, what you can and can't reliably detect from them, and the modern alternative that's more accurate."
          />
          <meta itemProp="datePublished" content="2024-04-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why UA strings are a mess */}
          <section aria-labelledby="why-mess" className="space-y-4">
            <h2
              id="why-mess"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why user agent strings look like contradictions
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A modern Chrome user agent looks like:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded text-wrap break-all">
                Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
              </code>.
              It claims to be Mozilla, Apple WebKit, and Safari — even though it&apos;s Chrome.
              This is historical: early browsers added &quot;Mozilla/5.0&quot; because web servers
              used that prefix to identify capable browsers. Every subsequent browser
              copied it to avoid being served degraded content. The pattern compounded
              over decades. Firefox says &quot;Gecko&quot;. Chrome says &quot;AppleWebKit&quot; and
              &quot;Safari&quot;. Edge says &quot;Chrome&quot; and &quot;Safari&quot;.
            </p>
          </section>

          {/* What to detect and what not to */}
          <section
            aria-labelledby="what-to-detect"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-to-detect"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What you can and can&apos;t reliably detect
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Reasonably reliable</span>
                <span>
                  Mobile vs. desktop (look for &quot;Mobile&quot; token), OS family (Windows / Mac /
                  Linux / Android / iOS), rendering engine (Gecko vs. WebKit vs. Blink).
                  These change slowly and are present in most real browsers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Unreliable</span>
                <span>
                  Exact browser version (easily spoofed), bot detection (good bots
                  identify themselves; bad bots fake Chrome), exact device model on
                  Android (fragmented across manufacturers).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Better alternative</span>
                <span>
                  For feature detection, use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">navigator.userAgentData</code>{' '}
                  (User-Agent Client Hints, available in Chrome/Edge). For feature support,
                  use{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">CSS.supports()</code>{' '}
                  or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">if (&apos;fetch&apos; in window)</code>{' '}
                  — test the capability, not the browser identity.
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
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "IP Lookup", path: "/tools/ip-lookup" },
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — User Agent Parser</strong> is a fully private, browser-based
            utility that decodes <strong>user agent strings</strong> into actionable insights
            about browser, operating system, device, and rendering engine. All processing runs
            locally on your device with JavaScript — your user agent strings never leave your
            computer. The fastest free way to analyze UA strings in 2026, with no installs, no
            accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}