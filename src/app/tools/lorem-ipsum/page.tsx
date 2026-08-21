import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/lorem-ipsum"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 60 characters (counted manually) — at the upper bound

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator for Figma & HTML — Copy Placeholder Text Free",
  description:
    "Generate lorem ipsum placeholder text instantly — copy as plain text, HTML paragraphs, or word count. Perfect for Figma mockups, HTML layouts, and React prototypes. No signup.",
  keywords: [
    "lorem ipsum generator",
    "free lorem ipsum text",
    "placeholder text generator",
    "dummy text generator free",
    "lorem ipsum placeholder",
    "online lorem ipsum tool",
    "generate random dummy text",
    "lorem ipsum text creator",
    "free text generator 2026",
    "browser-based lorem ipsum",
    "no signup text generator",
    "secure placeholder text tool",
    "best lorem ipsum generator",
    "lorem ipsum paragraph generator",
    "lorem ipsum sentences",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Lorem Ipsum Generator — Create Dummy Text Online Instantly",
    description:
      "Generate Lorem Ipsum placeholder text instantly. Free online tool for designers, developers, and writers. Choose paragraphs, sentences, or lists. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Lorem Ipsum Generator — Create Dummy Text by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Lorem Ipsum Generator — Dummy Text Online",
    description:
      "Generate Lorem Ipsum placeholder text instantly. Free online tool for designers, developers, and writers. No signup required.",
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
  name: "Lorem Ipsum Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates Lorem Ipsum placeholder text (dummy text) for designers, developers, and writers. Users can customize the number of paragraphs, sentences, or lists. All processing is client-side and private.",
  applicationCategory: "WritingApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate Lorem Ipsum paragraphs (1–50)",
    "Generate a specific number of sentences (1–100)",
    "Generate bulleted or numbered lists",
    "Option to start with 'Lorem ipsum dolor sit amet'",
    "One-click copy to clipboard",
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
  name: "How to Generate Lorem Ipsum Text Online",
  description:
    "A simple step-by-step guide to generating Lorem Ipsum placeholder text for your design or writing project using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Lorem Ipsum Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose Your Output Format",
      text: "Select whether you want paragraphs, sentences, or a list. Adjust the quantity (e.g., 5 paragraphs or 20 sentences) using the slider.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Customize Options (Optional)",
      text: "Toggle the option to start with the traditional 'Lorem ipsum dolor sit amet' phrase. You can also choose between standard or more varied word lists.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Generate",
      text: "Press the 'Generate' button. The tool will instantly create the requested Lorem Ipsum text based on your settings.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click the 'Copy' button to save the generated text to your clipboard, or download it as a .txt file for use in your design or content.",
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
      name: "What is Lorem Ipsum and why is it used?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lorem Ipsum is a dummy text derived from a Latin passage by Cicero, used by designers and developers as a placeholder to demonstrate the visual effect of a typeface or layout without relying on meaningful content.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate a specific number of paragraphs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can choose the number of paragraphs from 1 to 50. The tool will generate exactly that many paragraphs of Lorem Ipsum text.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Lorem Ipsum and random text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lorem Ipsum is based on a real Latin passage, so it has a natural rhythm and word distribution that better simulates real text. Random text (e.g., random letters) does not look natural and is less effective as a placeholder. This tool generates authentic Lorem Ipsum.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when generating Lorem Ipsum text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your input settings and the generated text are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the origin of 'Lorem ipsum dolor sit amet'?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The phrase comes from a Latin text by Cicero, 'De Finibus Bonorum et Malorum', written in 45 BC. The passage begins with 'Lorem ipsum dolor sit amet' and has been used as placeholder text since the 1500s.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free Lorem Ipsum generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account required. Generates up to 50 paragraphs, 100 sentences, or any custom word count — all processed in your browser with nothing sent to any server.",
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
      name: "Lorem Ipsum Generator",
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
            Lorem Ipsum Generator for Figma & HTML — Copy Placeholder Text Free
          </h1>
          <img src="/images/lorem-ipsum.webp" alt="Free Lorem Ipsum Generator — generate placeholder text for designs online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate <strong>Lorem Ipsum placeholder text</strong> instantly for your
            designs, mockups, or content projects. Choose from <strong>paragraphs</strong>,
            <strong>sentences</strong>, or <strong>lists</strong> with a simple click.
            All processing runs locally in your browser with <strong>100% privacy</strong>
            — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I add lorem ipsum placeholder text to Figma?"
            answer="Generate your desired number of paragraphs or sentences here, then copy the plain text. In Figma, select a text frame and paste. For HTML, copy the HTML version and paste it directly into your markup — each paragraph is wrapped in a <p> tag."
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
                <span className="text-foreground font-medium">Lorem Ipsum Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Lorem Ipsum Generator Tool">
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
          <meta itemProp="name" content="Lorem Ipsum Generator: When to Use Placeholder Text and When Not To" />
          <meta
            itemProp="description"
            content="Why lorem ipsum exists, the mistake most designers make with it, and two cases where real content is always worth the extra effort."
          />
          <meta itemProp="datePublished" content="2024-02-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why it exists */}
          <section aria-labelledby="why-lorem" className="space-y-4">
            <h2
              id="why-lorem"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why lorem ipsum exists — and what it&apos;s actually for
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Lorem ipsum text dates to the 1500s, when a typesetter scrambled sections of
              Cicero&apos;s <em>de Finibus Bonorum et Malorum</em> to produce specimen sheets for
              fonts. The scrambling was deliberate: text that looks like Latin but reads as
              nonsense prevents the reader from focusing on the words instead of the layout.
              That&apos;s the entire point — you want the eye to evaluate spacing, line length,
              and typeface rhythm, not meaning.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The practical use today is the same: fill a mockup so stakeholders can react
              to visual hierarchy and proportions before real content exists. A landing page
              with real copy is almost impossible to critique for layout — people read the
              text. Lorem ipsum lets you have the layout conversation first.
            </p>
          </section>

          {/* When it leads you astray */}
          <section
            aria-labelledby="when-it-fails"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="when-it-fails"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Two situations where lorem ipsum leads you astray
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Navigation and UI labels</span>
                <span>
                  If you use lorem ipsum in button text or menu items, you design for
                  short Latin syllables. Real labels like &quot;Manage subscription preferences&quot;
                  are 35 characters — three times longer than typical filler. The layout
                  breaks on first real-content review. Use realistic label length in UI
                  components, even if the copy itself is placeholder.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Multilingual sites</span>
                <span>
                  German and Finnish words are substantially longer than English equivalents.
                  If your interface will be translated, test with realistic strings in the
                  target language from day one. A button that fits &quot;Subscribe&quot; will break
                  on &quot;Abonnieren&quot; — a 9-character difference that collapses the layout in
                  production.
                </span>
              </li>
            </ul>
          </section>

          {/* Practical note */}
          <section aria-labelledby="practical-note" className="space-y-4">
            <h2
              id="practical-note"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How this generator works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The generator assembles placeholder text from a local pool of classic lorem
              ipsum words — no network request. Paragraphs mode produces 4–6 sentence
              blocks. Sentences mode outputs individual sentences. Words mode gives you
              a flat word list for testing specific character counts. The &quot;Start with
              Lorem ipsum&quot; option preserves the traditional opening phrase
              ({'"Lorem ipsum dolor sit amet, consectetur adipiscing elit..."'}) that most
              designers recognize on sight as placeholder — useful if you want reviewers
              to immediately know the content is dummy text.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Everything runs locally in your browser. Nothing is logged or sent to a server.
            </p>
          </section>

          {/* Design tool usage section */}
          <section aria-labelledby="design-tools-usage" className="space-y-4">
            <h2
              id="design-tools-usage"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How to use lorem ipsum in Figma, HTML, and React
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Tool / context</th>
                    <th className="border border-border p-2 text-left font-semibold">Format to copy</th>
                    <th className="border border-border p-2 text-left font-semibold">How to paste</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Figma', 'Plain text', 'Double-click a text frame → Ctrl+A → paste. Or use the Figma plugin "Lorem ipsum" for in-app generation.'],
                    ['Adobe XD', 'Plain text', 'Select a text element → paste. XD also has a built-in Lorem Ipsum option under Type → Insert Lorem Ipsum.'],
                    ['Canva', 'Plain text', 'Click a text block → select all → paste. Canva does not have a built-in placeholder text feature.'],
                    ['HTML / plain .html file', 'HTML (wrapped in <p> tags)', 'Paste directly inside your <article>, <section>, or <div> — each paragraph arrives as a valid <p> element.'],
                    ['React component', 'Plain text', 'Assign to a const and render with {text} — or wrap in JSX <p> tags. Use a short paragraph count for readable JSX.'],
                    ['WordPress editor (Gutenberg)', 'Plain text', 'Add a paragraph block → paste. Gutenberg does not auto-wrap in <p> tags; each pasted paragraph becomes its own block.'],
                    ['CSS/Tailwind prototype', 'Plain text', 'Paste into any text node in your component. Use 1–2 paragraphs for body text blocks, 1 sentence for labels.'],
                  ].map(([tool, format, howTo]) => (
                    <tr key={tool}>
                      <td className="border border-border p-2 font-medium text-foreground">{tool}</td>
                      <td className="border border-border p-2 text-muted-foreground font-mono text-xs">{format}</td>
                      <td className="border border-border p-2 text-muted-foreground">{howTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              For developers: if you need lorem ipsum in a Node.js or Python script, the
              canonical library is{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">lorem-ipsum</code>{' '}
              (npm) or{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">lorem</code>{' '}
              (PyPI). Both generate configurable paragraph counts programmatically — useful
              for seeding databases or generating fixture files.
            </p>
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
                  { name: "Case Converter", path: "/tools/case-converter" },
                  { name: "Text to PDF", path: "/tools/text-to-pdf" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Lorem Ipsum Generator</strong> is a fully private,
            browser-based tool that generates <strong>Lorem Ipsum placeholder text</strong>
            instantly. Choose from paragraphs, sentences, or lists, and toggle the
            traditional starting phrase. All processing runs locally on your device  ,
            your settings and generated text never leave your computer. The fastest free
            way to create dummy text in 2026, with no installs, no accounts, and no hidden
            limits.
          </p>
        </footer>
      </div>
    </>
  )
}
