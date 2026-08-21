import type { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ToolClient from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── Absolute URLs ─────────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/html-escape"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── Metadata ──────────────────────────────────────────────────────────────────
// Title: "Free HTML Escape & Unescape Tool — Encode Entities" = 50 chars ✓

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free HTML Escape & Unescape Tool — Encode Entities",
  description:
    "Escape and unescape HTML entities in your browser. Convert special characters to safe HTML or decode back to plain text — free, no login.",
  keywords: [
    "html escape tool",
    "html unescape online free",
    "html entity encoder online",
    "html entity decoder free",
    "escape html characters online",
    "unescape html entities browser",
    "convert special characters html entities",
    "free html escape tool 2026",
    "html encode decode no upload",
    "browser based html entity tool",
    "html escape tool for developers",
    "online html entity converter free",
    "encode html entities instantly",
    "html unescape tool no account",
    "client side html escape encoder",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free HTML Escape & Unescape Tool — Encode Entities Online",
    description:
      "Instantly encode special characters into HTML-safe entities or decode them back to plain text. 100% client-side — your text never leaves your browser. No account, no limits, free.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free HTML Escape & Unescape Tool — Encode Entities by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML Escape & Unescape — Free Entity Encoder Online",
    description:
      "Encode special characters into HTML entities or decode them back to plain text — instantly, privately, and free. No uploads, no accounts, no limits.",
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

// ─── JSON-LD: WebApplication ───────────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free HTML Escape & Unescape Tool",
  url: TOOL_URL,
  description:
    "A completely free, privacy-focused browser tool that escapes special characters into HTML-safe entities and unescapes HTML entities back to plain text. All processing occurs locally in your browser using native JavaScript — no server uploads, no data retention.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with native JavaScript support: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Escape special characters (&, <, >, \", ') into their HTML entity equivalents",
    "Unescape HTML entities back into their original plain-text characters",
    "100% client-side processing — your text never leaves your browser",
    "Strict entity mapping covering all standard HTML5 named and numeric entities",
    "Instant one-click copy of escaped or unescaped output to clipboard",
    "No character limit — process large code blocks, JSON payloads, or full HTML documents",
    "No account registration or sign-in required",
    "Cross-platform: works on Windows, macOS, and Linux via any modern browser",
    "Useful for XSS testing, code display in blogs, and sanitising user input",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

// ─── JSON-LD: HowTo ────────────────────────────────────────────────────────────

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Escape or Unescape HTML Entities Online for Free",
  description:
    "A simple 4-step guide to encoding special characters into HTML-safe entities or decoding HTML entities back to plain text using our free, browser-based HTML escape tool. The entire process takes under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free HTML Escape & Unescape Tool",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select Your Operation Mode",
      text: "Choose 'Escape' mode if you want to convert special characters into safe HTML entities, or choose 'Unescape' mode if you need to decode HTML entities back into their original readable characters.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Paste Your Input Text",
      text: "Paste your raw text, HTML snippet, code block, or JSON payload into the input text area. The tool handles large volumes of text instantly without any size restrictions.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Run the Conversion",
      text: "Click the 'Escape' or 'Unescape' action button. The tool processes your input entirely within your browser using native JavaScript string manipulation, completing the operation in milliseconds.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Use the Output",
      text: "The correctly escaped or unescaped text appears instantly in the output panel. Click the copy button to save the result to your clipboard, then paste it directly into your code editor, CMS, or terminal.",
      url: TOOL_URL,
    },
  ],
}

// ─── JSON-LD: FAQPage ──────────────────────────────────────────────────────────

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I escape or unescape HTML entities online for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Select your mode (Escape or Unescape), paste your text into the input area, click the action button, and copy the output — all processed locally in your browser with no server uploads, no account required, and completely free.",
      },
    },
    {
      "@type": "Question",
      name: "Which characters does the HTML escape tool encode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool encodes the five characters that have special meaning in HTML: the ampersand (&) becomes &amp;, the less-than sign (<) becomes &lt;, the greater-than sign (>) becomes &gt;, the double quote (\") becomes &quot;, and the single quote (') becomes &#39;. These five cover the full set required for safe HTML rendering and XSS prevention.",
      },
    },
    {
      "@type": "Question",
      name: "What output formats does the tool produce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool produces standard HTML named entities (&amp;, &lt;, &gt;, &quot;) and numeric entities (&#39;) for characters without a widely supported named form. The output is ready to paste directly into HTML documents, blog post editors, CMS content fields, or code display blocks.",
      },
    },
    {
      "@type": "Question",
      name: "Is my text uploaded to a server when I use this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All escaping and unescaping operations are performed entirely within your browser using native JavaScript. Your text never leaves your device — no data is transmitted to or stored on any server, ensuring complete privacy for sensitive code, credentials, or proprietary content.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between HTML escaping and URL encoding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HTML escaping converts special characters into HTML named or numeric entities (e.g., < becomes &lt;) so they display correctly inside an HTML document without being parsed as markup. URL encoding replaces unsafe characters with a percent sign followed by two hexadecimal digits (e.g., a space becomes %20) so they can be safely transmitted in a URL. They serve different contexts and are not interchangeable.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on how much text I can escape or unescape?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Because all processing runs entirely in your browser and no text is uploaded to our servers, we impose no character limits or usage quotas. The only practical ceiling is your browser's available memory, which can comfortably handle multi-megabyte text payloads in modern browsers.",
      },
    },
  ],
}

// ─── JSON-LD: BreadcrumbList (exactly 3 levels) ───────────────────────────────

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
      name: "Free HTML Escape & Unescape Tool",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function HTMLEscapePage() {
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

      <div className=" ">
        {/* ── Page Header ── */}
        <header className="space-y-4 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Free HTML Escape &amp; Unescape Tool — Encode Entities Online
          </h2>
          <img src="/images/html-escape.webp" alt="Free HTML Escape Tool — escape and unescape HTML entities in your browser" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Instantly convert special characters into HTML-safe entities (escape) or decode HTML
            entities back into plain text (unescape). Supports all five core HTML characters  ,
            ampersand, angle brackets, and quotes — processed entirely in your browser with no
            server uploads, no account, and no character limits.
          </p>

          <QuickAnswer
            question="How do I escape or unescape HTML entities online for free?"
            answer="Select Escape or Unescape mode, paste your text into the input area, click the action button, and copy the output — all processed locally in your browser with no server uploads and no account required."
          />

          {/* ── Breadcrumb nav — mirrors BreadcrumbList JSON-LD (3 levels) ── */}
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
                <span className="text-foreground font-medium">
                  Free HTML Escape &amp; Unescape Tool
                </span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Free HTML Escape and Unescape Tool">
          <ToolClient />
        </main>

        {/* ── Email Capture ── */}
        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border" />

        {/* ──────────────────────────────────────────────────────────────────────
            AdSense High-Value Content — TechArticle Microdata on <article>
            only. FAQ section uses plain <dl>/<dt>/<dd> — zero Microdata.
        ────────────────────────────────────────────────────────────────────── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="HTML Escape / Unescape: The XSS Prevention You Can't Skip" />
          <meta
            itemProp="description"
            content="What HTML escaping does, which characters must always be escaped, and the difference between escaping for HTML content vs. HTML attributes."
          />
          <meta itemProp="datePublished" content="2024-02-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why this matters */}
          <section aria-labelledby="why-escape" className="space-y-4">
            <h2
              id="why-escape"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why HTML escaping prevents XSS
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Cross-site scripting (XSS) happens when user-supplied text is rendered
              as HTML instead of text. If a user submits{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'<script>document.cookie</script>'}
              </code>{' '}
              and your server inserts it into the page without escaping, the browser
              executes it as code. Escaping converts{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{'<'}</code>{' '}
              to{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{'&lt;'}</code>{' '}
              — the browser then renders a literal angle bracket instead of interpreting
              a tag boundary. The script never executes.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Modern frameworks (React, Vue, Angular) escape HTML in their template systems
              by default. The risk is in places where you bypass the framework: raw{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">innerHTML</code>{' '}
              assignments, server-side template strings,{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">dangerouslySetInnerHTML</code>{' '}
              in React — anywhere user text is inserted into HTML without the framework&apos;s
              sanitization layer.
            </p>
          </section>

          {/* Character reference */}
          <section
            aria-labelledby="char-reference"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="char-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The five characters that must always be escaped
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Character</th>
                    <th className="border border-border p-2 text-left font-semibold">Entity</th>
                    <th className="border border-border p-2 text-left font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['< (less than)', '&lt;', 'Opens an HTML tag; enables tag injection'],
                    ['> (greater than)', '&gt;', 'Closes tags; not always dangerous but consistent escaping is safer'],
                    ['& (ampersand)', '&amp;', 'Starts HTML entity sequences; double-escaping bugs if not escaped'],
                    ['" (double quote)', '&quot;', 'Closes attribute values in double-quoted attributes'],
                    ["' (single quote)", '&#x27; or &apos;', 'Closes attribute values in single-quoted attributes'],
                  ].map(([char, entity, why]) => (
                    <tr key={char}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{char}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{entity}</td>
                      <td className="border border-border p-2 text-muted-foreground">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              Escaping for HTML attributes requires escaping both{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">&quot;</code>{' '}
              and{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">&#x27;</code>{' '}
              in addition to the others — an unescaped quote inside an attribute value
              closes the attribute and allows attribute injection (a vector for event
              handler injection like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">onclick=</code>).
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related encoding tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "URL Encoder / Decoder", path: "/tools/url-encoder" },
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Free HTML Escape &amp; Unescape Tool</strong> is a fully
            private, browser-based utility that encodes special characters into{" "}
            <strong>HTML entities</strong> and decodes them back to plain text using native
            JavaScript — meaning your text never leaves your device. Supports all five core HTML
            escape characters: <strong>&amp;</strong>, <strong>&lt;</strong>,{" "}
            <strong>&gt;</strong>, <strong>&quot;</strong>, and <strong>&apos;</strong> — making
            it the fastest free way to safely encode and decode HTML content for web development,
            security research, and content publishing workflows in 2026, with no installs, no
            accounts, no server uploads, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}