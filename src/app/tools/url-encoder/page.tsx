import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools"
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/url-encoder"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 56 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free URL Encoder — Encode URL Strings Online Instantly",
  description:
    "Encode any URL or query string instantly for web use. Free, client-side URL encoder with live preview and one-click copy. No server uploads, 100% private.",
  keywords: [
    "url encoder",
    "encode url",
    "url encode online",
    "query string encoder",
    "url encoding tool",
    "percent encoding",
    "encode uri component",
    "url encoder free",
    "secure url encoder",
    "online url encoder 2026",
    "browser-based url encoder",
    "url escape tool",
    "encode special characters url",
    "url string encoder",
    "client-side url encoder",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free URL Encoder — Encode URL Strings Online Instantly",
    description:
      "Encode any URL or query string instantly for web use. Free, client-side URL encoder with live preview and one-click copy. No server uploads, 100% private.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free URL Encoder — Encode URL Strings Online by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free URL Encoder — Encode URL Strings Instantly",
    description:
      "Encode any URL or query string instantly for web use. Free, client-side URL encoder with live preview and one-click copy. No server uploads, 100% private.",
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
  name: "URL Encoder",
  url: TOOL_URL,
  description:
    "A free online developer tool to instantly encode any URL or query string using percent-encoding (RFC 3986), with live preview and client-side processing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Encode URL strings instantly",
    "Percent-encoding according to RFC 3986",
    "Live encoding preview",
    "One-click copy to clipboard",
    "100% client-side processing for privacy",
    "No server uploads or logging",
    "Works offline once loaded",
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
  name: "How to Encode a URL Online",
  description:
    "A quick step-by-step guide to encoding any URL or query string using percent-encoding with our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools URL Encoder",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your URL or Query String",
      text: "Copy the URL or query string you want to encode and paste it into the input field. The tool accepts any text string that needs to be percent-encoded for web use.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click the Encode Button",
      text: "Press the 'Encode' button. Our tool instantly applies percent-encoding (RFC 3986) to all reserved characters and spaces in your string, making it safe for use in URLs.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Encoded Output",
      text: "The encoded string will appear in the output field. You can preview the result and compare it with the original input to ensure it meets your requirements.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Use the Encoded String",
      text: "Click the 'Copy' button to save the encoded string to your clipboard, ready to be pasted into your code, API request, or web application.",
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
      name: "What is URL encoding and why is it needed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URL encoding (also called percent-encoding) converts characters that are unsafe or reserved in URLs into a format that can be safely transmitted over the internet. For example, spaces become '%20', and question marks become '%3F'. It is essential for sending query parameters, form data, and special characters in URLs.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when using this URL encoder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. This tool runs entirely in your browser using client-side JavaScript. The URL or query string you encode is never sent to our servers, stored in databases, or logged anywhere.",
      },
    },
    {
      "@type": "Question",
      name: "Does this encoder follow RFC 3986 standards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our encoder implements percent-encoding according to RFC 3986, which is the official standard for URIs. This ensures that your encoded strings are compatible with all modern web browsers, servers, and APIs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I decode a URL with this tool as well?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this tool also provides URL decoding functionality. Simply paste an encoded URL into the decoder field, and it will revert the percent-encoded characters back to their original form.",
      },
    },
    {
      "@type": "Question",
      name: "What characters are encoded in URL encoding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URL encoding converts reserved characters (such as ':', '/', '?', '#', '@', '&', '=', '+', '$', ','), unsafe characters (such as spaces, '<', '>', '%', '{', '}', '|', '\\', '^', '[', ']', '`'), and any non-ASCII characters into a %XX format where XX represents the hexadecimal value of the character.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limitations of this free URL encoder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account, no daily limits, and no string length cap. Encodes and decodes URLs of any length directly in your browser — nothing is uploaded to any server.",
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
      name: "URL Encoder",
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
            Free URL Encoder — Encode Any URL or Query String Instantly
          </h1>
          <img src="/images/url-encoder.webp" alt="Free URL Encoder and Decoder — encode or decode URLs and query strings online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Encode any <strong>URL</strong> or <strong>query string</strong> instantly for web
            use using percent-encoding (RFC 3986). All processing runs locally in your browser
            with <strong>100% privacy</strong> — no data is ever uploaded.
          </p>

          <QuickAnswer
            question="How do I encode a URL for free?"
            answer="Paste your URL or query string into the input field and click 'Encode'. The tool instantly applies percent-encoding to all reserved characters and spaces, making it safe for use in web addresses and APIs."
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
                <span className="text-foreground font-medium">URL Encoder</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="URL Encoder Tool">
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
          <meta itemProp="name" content="URL Encoder / Decoder: When to Encode and What Each Function Does" />
          <meta itemProp="description" content="Explains the difference between encodeURI and encodeURIComponent, common encoding mistakes, and specific scenarios where encoding matters." />
          <meta itemProp="datePublished" content="2024-02-08" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="url-why" className="space-y-4">
            <h2 id="url-why" className="text-2xl font-semibold tracking-tight text-foreground">
              The two functions that solve different problems
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              JavaScript has two URL encoding functions and they are not interchangeable.
              Getting this wrong is a real source of bugs.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">encodeURI()</span>
                <span>
                  Encodes a complete URL. Leaves structural characters intact:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">: / ? # [ ] @ ! $ & &apos; ( ) * + , ; =</code>.
                  Use when you have a full URL and need to make it safe for embedding in HTML
                  or an HTTP header.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">encodeURIComponent()</span>
                <span>
                  Encodes a URL <em>component</em> — a query parameter value, a path segment,
                  a fragment. Encodes everything including structural characters. Use this when
                  you&apos;re encoding a value that will be placed inside a URL, not the full URL
                  itself. If you use encodeURI() on a query value that contains{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;</code> or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">=</code>, those
                  characters won&apos;t be encoded and the URL will be parsed incorrectly.
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="url-scenarios" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="url-scenarios" className="text-2xl font-semibold tracking-tight text-foreground">
              Common scenarios where encoding goes wrong
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Email in query string</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">user+tag@example.com</code>{' '}
                  — the <code className="text-xs bg-muted px-1 py-0.5 rounded">+</code> in the email becomes a space when decoded if you use encodeURI instead of encodeURIComponent. The email arrives garbled.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Search queries with special characters</span>
                <span>
                  A search query containing <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;</code> splits into multiple parameters. Always encodeURIComponent() search values.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Redirect URLs as parameters</span>
                <span>
                  Passing a full URL as a query parameter:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">?redirect=https://example.com/path?q=1</code>{' '}
                  — the inner URL&apos;s <code className="text-xs bg-muted px-1 py-0.5 rounded">?</code> and{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">=</code> will break the outer URL parser unless encodeURIComponent() is used on the value.
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
                  { name: "Base64 Encoder", path: "/tools/base64-encoder" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — URL Encoder</strong> is a fully private, browser-based
            utility that applies <strong>percent-encoding</strong> (RFC 3986) to any URL or
            query string instantly. All processing runs locally on your device with JavaScript
            — your sensitive strings never leave your computer. Supports live preview,
            one-click copying, and includes a built-in decoder for two-way transformation.
            The fastest free way to encode URLs for web development in 2026, with no installs,
            no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}