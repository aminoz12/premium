import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URL constants ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/case-converter`

// ─── FAQ data (single source of truth — mirrors JSON-LD exactly) ───────────
const FAQ_ITEMS = [
  {
    q: "How do I use the case converter?",
    a: "Paste or type your text into the input area, then click any of the 11 case format buttons below the tool — such as UPPERCASE, camelCase, or snake_case. The converted result appears instantly in the output box. Click 'Copy' to save it to your clipboard or 'Download' to save it as a .txt file.",
  },
  {
    q: "Which text case formats are supported?",
    a: "The tool supports 11 formats: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, aLtErNaTiNg cAsE, and tOGGLE cASE — covering every standard writing and programming case convention.",
  },
  {
    q: "What output formats are available — can I download the converted text?",
    a: "Yes. Once your text is converted, you can copy it to your clipboard with one click or download it as a plain .txt file. Real-time word, character, and line counts are displayed as you type.",
  },
  {
    q: "Is my text sent to a server or stored anywhere?",
    a: "No. The entire conversion runs locally in your browser using JavaScript. Your text is never sent to any server, never stored, and never shared — making the tool safe for confidential documents, legal text, and private writing.",
  },
  {
    q: "What is the difference between camelCase, PascalCase, snake_case, and kebab-case?",
    a: "camelCase starts lowercase with each subsequent word capitalised (myVariableName) — used in JavaScript and Java. PascalCase capitalises every word (MyClassName) — used for class names in most languages. snake_case uses underscores (my_variable) — standard in Python. kebab-case uses hyphens (my-variable) — standard for URLs and CSS class names.",
  },
  {
    q: "Is there a limit to how much text I can convert?",
    a: "There is no hard character limit. Because all processing runs locally in your browser, the practical limit is your device's available memory. Most users can process tens of thousands of words instantly without any lag.",
  },
  {
    q: "Is this case converter free to use?",
    a: "Yes, completely free. No account, no subscription, and no credit card is required. All 11 text case formats are available without any restrictions.",
  },
  {
    q: "Can I fix text accidentally typed with Caps Lock on?",
    a: "Yes — this is one of the most common uses. Paste your ALL-CAPS text into the tool and click 'Sentence case' or 'lowercase' to correct it instantly. Toggle Case will also invert every letter's capitalisation, which reverses shift-key mistakes character by character.",
  },
]

// ─── Metadata ──────────────────────────────────────────────────────────────
// Title: "Free Case Converter: Change Text Case Online" = 49 characters ✓
export const metadata: Metadata = {
  title: "Free Case Converter: Change Text Case Online",
  description:
    "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and 5 more formats. Free, browser-based, no login needed.",
  keywords: [
    "case converter",
    "text case changer",
    "uppercase to lowercase",
    "title case generator",
    "camel case converter online",
    "snake case generator free",
    "kebab case converter",
    "alternating case generator",
    "toggle case tool",
    "pascal case converter",
    "constant case generator",
    "sentence case converter online",
    "change text case free",
    "text formatter no login",
    "browser-based case converter",
    "case converter no upload 2026",
    "fix caps lock text online",
    "developer text case tool free",
    "camelcase snake case kebab case converter",
    "word counter text formatter",
    "online text case tool free",
    "convert variable names case online",
    "text capitalisation tool free",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    type: "website",
    url: TOOL_URL,
    title: "Free Case Converter — UPPERCASE, camelCase, snake_case & 8 More",
    description:
      "Paste your text and convert it to any of 11 case formats instantly. Covers every writing and programming convention — free, private, no account needed.",
    siteName: "TheFreeAITools",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Case Converter Tool — TheFreeAITools.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Case Converter: 11 Formats — camelCase, snake_case & More",
    description:
      "Switch text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and 6 more in one click. Free, browser-only, no account.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },
  robots: { index: true, follow: true },
}

// ─── JSON-LD schemas ───────────────────────────────────────────────────────
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Case Converter",
  url: TOOL_URL,
  description:
    "Browser-based text case converter supporting 11 formats: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, alternating case, and toggle case. Free, private, no account required.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires JavaScript. Chrome 88+, Firefox 85+, Safari 14+, Edge 88+.",
  featureList: [
    "11 text case formats: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, alternating case, toggle case",
    "Real-time character, word, and line count as you type",
    "One-click copy to clipboard",
    "Download converted text as a .txt file",
    "100% browser-based processing — text never sent to a server",
    "No character limit — handles tens of thousands of words instantly",
    "No account, login, or subscription required",
    "Instant conversion with zero page reload",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert Text Case Online",
  description:
    "Use the free case converter to change your text to any of 11 case formats in under a minute.",
  totalTime: "PT1M",
  tool: [{ "@type": "HowToTool", name: "TheFreeAITools Case Converter" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your Text",
      text: "Type or paste the text you want to convert into the main input area. The real-time counter immediately shows your character, word, and line counts.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select a Case Format",
      text: "Click any of the 11 case format buttons — such as UPPERCASE, camelCase, snake_case, or Title Case — displayed below the input area.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Converted Output",
      text: "The converted text appears instantly in the output box. Review the result to confirm it matches the format you need.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click 'Copy' to save the converted text to your clipboard, or click 'Download' to save it as a .txt file for use in any application.",
      url: TOOL_URL,
    },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
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
      name: "Developer Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Case Converter",
      item: TOOL_URL,
    },
  ],
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function CaseConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <>
        <div className=" ">
          <header className="space-y-4 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Free Online Case Converter
            </h2>
            <QuickAnswer
              question="What is the difference between camelCase, PascalCase, snake_case, and kebab-case?"
              answer="camelCase starts lowercase with each subsequent word capitalised (myVariableName) — standard in JavaScript and Java. PascalCase capitalises every word (MyClassName) — used for class and component names. snake_case uses underscores (my_variable_name) — standard in Python and database columns. kebab-case uses hyphens (my-variable-name) — standard for URLs, CSS class names, and HTML attributes. CONSTANT_CASE (MY_CONSTANT) is snake_case in all-caps, used for constants and environment variables."
            />
            <img src="/images/case-converter.webp" alt="Free Text Case Converter — change text to uppercase, lowercase, title case online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Instantly format your text or code into 11 different cases including
              uppercase, lowercase, Title Case, camelCase, snake_case, and more.
              Featuring real-time word counting, one-click copy, and text file
              downloads.
            </p>
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <ol className="flex items-center gap-1">
                <li>
                  <a href={`${SITE_URL}/`} className="hover:underline">
                    Home
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <a href={`${SITE_URL}/tools`} className="hover:underline">
                    Developer Tools
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li aria-current="page">Case Converter</li>
              </ol>
            </nav>
          </header>

          <main>
            <ToolClient />
          </main>

          <hr className="border-border" />

          {/* ── Rich article for AdSense content quality ── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="Text Case Converter: Which Case Convention to Use in Code and Content" />
            <meta
              itemProp="description"
              content="A practical reference for camelCase, snake_case, PascalCase, and kebab-case — which language or context each belongs to and why mixing them in a codebase causes silent bugs."
            />
            <meta itemProp="datePublished" content="2024-02-22" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* Case convention reference */}
            <section aria-labelledby="convention-reference" className="space-y-4">
              <h2
                id="convention-reference"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Which case convention belongs where
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Convention</th>
                      <th className="border border-border p-2 text-left font-semibold">Example</th>
                      <th className="border border-border p-2 text-left font-semibold">Used in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['camelCase', 'getUserById', 'JavaScript/TypeScript variables and functions, JSON keys in APIs'],
                      ['PascalCase', 'UserProfile', 'React components, TypeScript interfaces/types, class names'],
                      ['snake_case', 'user_profile_id', 'Python variables/functions, PostgreSQL column names, Ruby'],
                      ['SCREAMING_SNAKE', 'MAX_RETRY_COUNT', 'Constants in most languages, environment variables'],
                      ['kebab-case', 'user-profile', 'CSS classes, HTML attributes, URL slugs, file names'],
                      ['dot.case', 'app.settings.theme', 'Config keys (dotenv, properties files), namespace paths'],
                    ].map(([convention, example, usedIn]) => (
                      <tr key={convention}>
                        <td className="border border-border p-2 font-medium text-foreground">{convention}</td>
                        <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{example}</td>
                        <td className="border border-border p-2 text-muted-foreground">{usedIn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Why mixing causes bugs */}
            <section
              aria-labelledby="mixing-bugs"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="mixing-bugs"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Why mixing cases causes silent bugs
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                The most common bug pattern: a REST API returns{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">user_id</code>{' '}
                (snake_case), your frontend code expects{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">userId</code>{' '}
                (camelCase), and the value silently becomes{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">undefined</code>.
                No error, no warning — just missing data. JavaScript property access is
                case-sensitive:{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">obj.userId</code>{' '}
                and{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">obj.user_id</code>{' '}
                are different keys.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                CSS has the same issue in the opposite direction:{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">className="userProfile"</code>{' '}
                won&apos;t match a stylesheet rule for{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">.user-profile</code>.
                Establish a convention per layer — API responses, database columns, frontend
                variables, CSS classes — and enforce it with a linter or code review
                checklist rather than relying on memory.
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
                    { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum" },
                    { name: "Word Counter", path: "/tools/word-counter" },
                    { name: "Regex Tester", path: "/tools/regex-tester" },
                  ]}
                />
              </nav>
            </section>
          </article>

          <footer className="pt-6 border-t space-y-3 text-xs text-muted-foreground">
            <p>
              <strong>TheFreeAITools — Case Converter</strong> is a free,
              browser-based text formatting tool that converts text between 11
              case formats: <strong>UPPERCASE</strong>,{" "}
              <strong>lowercase</strong>, <strong>Title Case</strong>,{" "}
              <strong>Sentence case</strong>, <strong>camelCase</strong>,{" "}
              <strong>PascalCase</strong>, <strong>snake_case</strong>,{" "}
              <strong>kebab-case</strong>, <strong>CONSTANT_CASE</strong>,
              alternating case, and toggle case. All conversion runs locally in
              your browser — your text is never sent to any server, never stored,
              and never shared. Includes real-time word and character counting,
              one-click clipboard copy, and .txt file download. Fully free with
              no account required, maintained through 2026.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}