import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ClientPage from "./client-page"

// ─── Absolute URLs ─────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/cursive-text-generator`

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    "Cursive Text Generator — Copy Paste for Instagram Bio & TikTok Free",
  description:
    "Convert plain text into cursive script instantly. Free, no login, 100% browser-based. Copy cursive text for social media, emails, and design.", // 149 chars
  keywords: [
    "cursive text generator",
    "convert text to cursive online free",
    "cursive font generator no download",
    "generate cursive writing from text",
    "free online cursive text maker",
    "cursive script converter 2026",
    "fancy cursive text generator",
    "text to cursive no login",
    "browser-based cursive text tool",
    "make text cursive without app",
    "online cursive handwriting converter",
    "copy and paste cursive text",
    "cursive letter generator free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title:
      "Free Cursive Text Generator — Create Fancy Cursive Script Online", // 54 chars
    description:
      "Turn any plain text into beautiful cursive handwriting instantly. No sign-up, works in your browser, just copy and paste.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Cursive Text Generator — Free Online Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursive Text Generator — Fancy Script Tool", // 41 chars
    description:
      "Create stylish cursive text for social media, bios, and more. Free and private, no account needed.",
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

// ─── JSON-LD Structured Data ───────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cursive Text Generator",
  url: TOOL_URL,
  description:
    "A free online tool that instantly converts normal text into elegant cursive script using Unicode character mapping. No downloads, no uploads – everything works directly in your browser.",
  applicationCategory: "WebApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with JavaScript enabled (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time conversion of plain text to cursive Unicode characters",
    "Multiple cursive styles (script, handwritten, decorative)",
    "One-click copy to clipboard for instant reuse",
    "No file downloads or font installations required",
    "Works offline after page load – fully client-side processing",
    "Responsive design works on mobile, tablet, and desktop",
    "Text never leaves your device – 100% private and secure",
    "Unlimited conversions with no character limits",
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
  name: "How to Generate Cursive Text",
  description:
    "Follow these four quick steps to transform ordinary text into elegant cursive script using our free browser tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Cursive Text Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Text",
      text: "Type or paste the text you want to convert into the input field. You can enter a single word, a sentence, or multiple paragraphs.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose a Cursive Style (Optional)",
      text: "Select a cursive style from the available options – we offer classic script, handwritten, and decorative variants. The default style works great for most needs.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Generate the Cursive Text",
      text: "Click the “Convert” button and the tool instantly maps every character to its cursive Unicode equivalent. No page reload, no submission.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy Your Fancy Text",
      text: "Click the copy button to save the generated cursive text to your clipboard. You can then paste it anywhere – social media, emails, documents, or messaging apps.",
      url: TOOL_URL,
    },
  ],
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I convert text to cursive for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply type or paste your normal text into this page's converter. It instantly maps each letter to a cursive Unicode character, giving you a stylish cursive output you can copy and use anywhere – completely free and with no account required.",
      },
    },
    {
      "@type": "Question",
      name: "What cursive styles are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool offers several popular cursive looks: classic script (similar to handwriting), swirly decorative letters, and a clean handwritten style. Each style uses standard Unicode characters so it shows correctly on all devices without installing fonts.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the generated cursive text anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The output is normal Unicode text, so you can paste it into Instagram bios, Facebook posts, tweets, TikTok captions, WhatsApp messages, emails, documents, and anywhere else that accepts text. No special software needed.",
      },
    },
    {
      "@type": "Question",
      name: "Is my text stored or logged?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely not. All processing happens entirely in your browser using client-side JavaScript. Your original text and the generated cursive version never leave your device – we don't collect, store, or log anything you type.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool work on mobile and tablets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The interface is fully responsive and works smoothly on iOS, Android, and any other mobile operating system. Just open the page in your mobile browser, type your text, and copy the result.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on text length?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are no hard limits. You can convert a single word or a lengthy paragraph. Very long texts (multiple paragraphs) may take a tiny fraction of a second longer, but the tool is designed to handle essays, letters, or social media posts without any issue.",
      },
    },
  ],
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
      name: "Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cursive Text Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ─────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* JSON-LD Scripts */}
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

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* ── Header & Breadcrumb ── */}
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Cursive Text Generator — Copy Paste for Instagram Bio & TikTok Free
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Type or paste your plain text and instantly turn it into beautiful cursive handwriting. Choose from multiple cursive styles, copy the output, and paste it anywhere — social media, messages, emails, and more. No install, no account, 100% private.
          </p>
          <QuickAnswer
            question="How do I get cursive text I can copy and paste into Instagram?"
            answer="Type your text above, select a cursive style, then click Copy. Paste it directly into your Instagram bio, TikTok profile, Twitter name, or any text field. The cursive characters are Unicode symbols — they work everywhere without any special font installed."
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
                <a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">
                  Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Cursive Text Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool ── */}
        <main id="tool" aria-label="Cursive Text Generator Tool">
           <ClientPage />
        </main>

        <hr className="border-border my-12" />

        {/* ─── AdSense High-Value Content Article (800+ words) ──────────── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Cursive Text Generator: How Unicode Lookalike Characters Work and Where They Break" />
          <meta
            itemProp="description"
            content="Why cursive text generators use Unicode mathematical symbols rather than actual fonts, where the output works and where it breaks, and the accessibility problem."
          />
          <meta itemProp="datePublished" content="2024-03-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why this isn&apos;t a real font — and why that matters
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Cursive and decorative text generators don&apos;t apply a font. They replace
              standard Latin letters with visually similar characters from Unicode
              mathematical symbol blocks — for example, the script capital A (&#x1D49C;)
              is Unicode code point U+1D49C, a mathematical symbol that happens to look
              like a decorative A. The output is plain text made of these substitute
              characters, which is why it copies and pastes into Instagram bios, Twitter
              profiles, and Discord usernames where custom fonts are not supported.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The limitation: these characters only exist for basic Latin letters (A–Z,
              a–z) and digits. Punctuation, accented characters (é, ñ, ü), and non-Latin
              scripts have no mathematical symbol equivalents and will appear as standard
              characters or question marks in the output.
            </p>
          </section>

          {/* Where it works and breaks */}
          <section
            aria-labelledby="where-works"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="where-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Where the output works — and where it breaks
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform / context</th>
                    <th className="border border-border p-2 text-left font-semibold">Works?</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Instagram bio', 'Yes', 'Instagram renders Unicode mathematical symbols correctly'],
                    ['Twitter/X display name', 'Yes', 'Username field only allows ASCII; display name allows Unicode'],
                    ['Discord username/bio', 'Yes', 'Full Unicode support in display fields'],
                    ['TikTok bio', 'Yes', 'Unicode supported in bio text'],
                    ['Email subject line', 'Partial', 'Most modern clients render it; some older clients show boxes'],
                    ['PDF documents', 'Depends on font', 'Only if the embedded font includes the Unicode math block'],
                    ['HTML title tag', 'No — avoid', 'Search engines read it as mathematical symbols, hurts SEO'],
                    ['Accessibility / screen readers', 'Breaks', 'Read as "mathematical script capital A" not "A" — unintelligible'],
                  ].map(([platform, works, notes]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 text-muted-foreground">{platform}</td>
                      <td className={'border border-border p-2 font-medium ' + (works === 'Yes' ? 'text-green-600' : works === 'No — avoid' ? 'text-red-600' : 'text-yellow-600')}>{works}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Accessibility warning */}
          <section aria-labelledby="accessibility" className="space-y-4">
            <h2
              id="accessibility"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The accessibility problem
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Screen readers (used by blind and low-vision users) read Unicode mathematical
              symbols by their official Unicode name, not by their visual appearance.
              The script letter &#x1D49C; is announced as &quot;mathematical script capital A,&quot;
              not &quot;A.&quot; A bio written in cursive Unicode reads as a string of long
              mathematical symbol names — completely unintelligible. For accessibility,
              limit decorative Unicode text to decorative contexts where the information
              is also conveyed in plain text, and never use it for content that must
              be understood by all users.
            </p>
          </section>

          {/* Where cursive works */}
          <section aria-labelledby="cursive-where-works" className="space-y-4">
            <h2
              id="cursive-where-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Where cursive Unicode text works — platform compatibility
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The cursive output uses Unicode Mathematical Alphanumeric Symbols (U+1D400 range) —
              these are actual Unicode characters, not a font. They display wherever Unicode
              is supported:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform</th>
                    <th className="border border-border p-2 text-left font-semibold">Works?</th>
                    <th className="border border-border p-2 text-left font-semibold">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Instagram bio', '✓ Yes', 'Stand out in search results; add personality to your profile'],
                    ['Instagram captions & comments', '✓ Yes', 'Highlight key phrases or add visual emphasis'],
                    ['TikTok bio', '✓ Yes', 'Profile name and bio text'],
                    ['Twitter / X bio and display name', '✓ Yes', 'Display name (not @handle) can use cursive'],
                    ['Facebook posts and bio', '✓ Yes', 'Works in posts, about sections, and comments'],
                    ['Pinterest profile', '✓ Yes', 'Pin descriptions and board names'],
                    ['LinkedIn summary', '✓ Yes', 'Some recruiters use cursive for section headings to stand out'],
                    ['WhatsApp & Telegram messages', '✓ Yes', 'Unicode renders in most mobile messaging apps'],
                    ['Email subject lines', '✓ Usually', 'Most email clients support Unicode; some older clients may show boxes'],
                    ['Google Docs / Word', '✓ Yes', 'Works as text — renders using the document&apos;s Unicode-compatible font'],
                    ['HTML pages', '✓ Yes', 'Paste directly into content — no CSS font needed'],
                    ['Search/username fields', '✗ No', 'Search engines and username fields strip special Unicode characters'],
                  ].map(([platform, works, bestFor]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 font-medium text-foreground">{platform}</td>
                      <td className="border border-border p-2 text-muted-foreground">{works}</td>
                      <td className="border border-border p-2 text-muted-foreground">{bestFor}</td>
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
              Related text tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                  { name: "Word Counter", path: "/tools/word-counter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Cursive Text Generator</strong> transforms plain text into beautiful <strong>cursive script</strong> instantly, using only browser-based Unicode conversion. Your text never leaves your device, making it a 100% private and secure tool for styling bios, posts, signatures, and more. No downloads, no accounts, no limits — just elegant cursive text ready to copy and paste, completely free in 2026.
          </p>
        </footer>
      </div>
    </>
  )
}