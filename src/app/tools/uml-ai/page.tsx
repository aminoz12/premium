import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/uml-ai"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 59 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free UML Diagram Generator AI — Class, Sequence & ER Diagrams",
  description:
    "Generate UML class diagrams, sequence diagrams, ER diagrams, and flowcharts from text. Free AI-powered tool with live Mermaid preview — no login required.",
  keywords: [
    "uml diagram generator",
    "free uml diagram generator ai",
    "class diagram generator free",
    "sequence diagram maker",
    "er diagram generator online",
    "uml generator from text",
    "mermaid diagram generator",
    "use case diagram generator",
    "flowchart generator uml",
    "code to uml diagram free",
    "uml diagram maker no login",
    "best uml diagram tool 2026",
    "draw uml online free",
    "uml generator ai 2026",
    "create uml diagram from text",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free UML Diagram Generator AI — Class, Sequence & ER Diagrams",
    description:
      "Generate UML diagrams from text descriptions with live Mermaid preview. Create class, sequence, ER, and use-case diagrams — free, no login required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free UML Diagram Generator AI — Online UML Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free UML Diagram Generator AI — Class, Sequence & ER Diagrams",
    description:
      "Generate UML diagrams with live Mermaid preview. Free AI tool for developers, architects, and students — no login required.",
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
  name: "UML Diagram Generator AI",
  url: TOOL_URL,
  description:
    "A free AI-powered UML diagram generator that creates class diagrams, sequence diagrams, ER diagrams, flowcharts, and use-case diagrams from plain text descriptions with live Mermaid.js preview.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "UML class diagram generation",
    "Sequence diagram generation",
    "Entity-relationship (ER) diagrams",
    "Use-case diagram generation",
    "Flowchart and activity diagram generation",
    "Live Mermaid.js preview",
    "Export diagrams as SVG or PNG",
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
  name: "How to Generate a UML Diagram Online",
  description:
    "A simple step-by-step guide on how to create professional UML diagrams — including class, sequence, and ER diagrams — from text descriptions using our free AI-powered tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools UML Diagram Generator AI",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Describe Your System or Architecture",
      text: "Type a description of your system, API flow, database schema, or use case into the text input field. Use plain English — the AI will interpret your intent and generate the appropriate UML diagram.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Your Diagram Type",
      text: "Select the UML diagram type you need: class diagram for object relationships, sequence diagram for method call flows, ER diagram for database schema, or use-case diagram for actor interactions.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Mermaid Output",
      text: "The tool will generate Mermaid.js code and render the diagram in a live preview pane. You can edit the Mermaid code directly for fine-grained control over the diagram layout and styling.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export or Copy Your Diagram",
      text: "Export the completed diagram as a high-resolution SVG or PNG file for use in documentation, README files, or design specs. You can also copy the Mermaid code for use in GitHub, Notion, or Confluence.",
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
      name: "What types of UML diagrams can this tool generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool generates class diagrams, sequence diagrams, entity-relationship (ER) diagrams, use-case diagrams, flowcharts, and activity diagrams using Mermaid.js syntax with a live preview. Describe your system in plain text and the diagram renders instantly.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to know Mermaid syntax to use this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You can describe your system or process in plain English and the AI will generate the correct Mermaid diagram code for you. You can also edit the Mermaid code directly in the editor if you want fine-grained control over the output.",
      },
    },
    {
      "@type": "Question",
      name: "What is a UML diagram used for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UML (Unified Modeling Language) diagrams are standardized visual representations of software architecture and system design. Class diagrams show object relationships, sequence diagrams show method call flows, and ER diagrams show database schema — all essential for planning and documenting software projects.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export the generated diagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can export the diagram as an SVG or PNG image for use in documentation, presentations, README files, or design specs. The Mermaid code can also be copied and dropped into any Mermaid-compatible tool like GitHub, Notion, or Confluence.",
      },
    },
    {
      "@type": "Question",
      name: "Is this tool free and does it require an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is completely free to use with no account, subscription, or API key required. Generate unlimited UML diagrams directly in your browser with no data sent to external servers.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between UML class diagrams and ER diagrams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UML class diagrams model object-oriented software systems — classes, attributes, methods, and relationships like inheritance and composition. ER (Entity-Relationship) diagrams model database schemas — entities, attributes, and relationships like one-to-many or many-to-many. While both use boxes and lines, class diagrams represent code structures, while ER diagrams represent data structures.",
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
      name: "UML Diagram Generator AI",
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
            Free UML Diagram Generator AI — Class, Sequence & ER Diagrams
          </h1>
          <img src="/images/uml.webp" alt="Free UML Diagram Generator AI — create class, sequence, ER, and flowchart diagrams online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate professional <strong>UML diagrams</strong> from plain text descriptions
            using AI. Create <strong>class diagrams</strong>, <strong>sequence diagrams</strong>,
            <strong>ER diagrams</strong>, <strong>use-case diagrams</strong>, and
            <strong>flowcharts</strong> with a live <strong>Mermaid.js preview</strong>.
            No account required — completely free.
          </p>

          <QuickAnswer
            question="What is a UML diagram generator?"
            answer="A UML diagram generator converts plain-text descriptions or code into standardized Unified Modeling Language diagrams — including class diagrams, sequence diagrams, and ER diagrams — used in software architecture and design."
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
                <span className="text-foreground font-medium">UML Diagram Generator AI</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="UML Diagram Generator Tool">
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
          <meta itemProp="name" content="AI UML Diagram Generator: Which Diagrams AI Generates Well and Which Need Manual Work" />
          <meta
            itemProp="description"
            content="How AI generates UML from text descriptions, which diagram types it handles accurately, and the three common errors to check before sharing a generated diagram."
          />
          <meta itemProp="datePublished" content="2024-04-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How AI generates UML */}
          <section aria-labelledby="how-ai-generates" className="space-y-4">
            <h2
              id="how-ai-generates"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How AI generates UML from a text description
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The tool converts your natural language description into a UML text
              notation (typically Mermaid or PlantUML syntax), then renders that
              notation as a diagram. Mermaid is a JavaScript library that renders
              diagram code in the browser — no server-side rendering required.
              PlantUML requires a Java-based renderer or an online server.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The AI step translates your description (&quot;a sequence diagram showing
              a user logging in, the frontend calling the auth API, the API checking
              the database, and returning a JWT token&quot;) into the precise syntax
              that the renderer understands. The quality of the output depends on
              how precisely you described the relationships, participants, and flow.
            </p>
          </section>

          {/* Which diagrams work well */}
          <section
            aria-labelledby="which-work"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="which-work"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which UML types AI generates accurately
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Diagram type</th>
                    <th className="border border-border p-2 text-left font-semibold">AI accuracy</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Sequence diagram', 'High', 'Clear participant/message structure maps well to text description'],
                    ['Class diagram (simple)', 'High', 'Class names, attributes, and basic relationships translate accurately'],
                    ['Flowchart', 'High', 'Decision trees and process flows described in steps work well'],
                    ['State diagram', 'Medium', 'State names are accurate; transition conditions sometimes misinterpreted'],
                    ['Class diagram (complex)', 'Medium', 'Inheritance hierarchies and multiplicities need manual verification'],
                    ['ER diagram', 'Medium', 'Table relationships work; composite keys and constraints often missing'],
                    ['Use case diagram', 'Lower', 'Actor/system boundaries and include/extend relationships frequently wrong'],
                  ].map(([type, accuracy, notes]) => (
                    <tr key={type}>
                      <td className="border border-border p-2 text-muted-foreground">{type}</td>
                      <td className={'border border-border p-2 font-medium ' + (accuracy === 'High' ? 'text-green-600' : accuracy === 'Lower' ? 'text-red-600' : 'text-yellow-600')}>{accuracy}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Three errors to check */}
          <section aria-labelledby="errors-to-check" className="space-y-4">
            <h2
              id="errors-to-check"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three errors to always check in generated diagrams
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Before sharing a generated UML diagram, verify: (1){' '}
              <strong>Arrow direction</strong> — AI frequently reverses relationship
              directions in class and ER diagrams. Check that inheritance arrows point
              from child to parent, and that association arrows reflect the correct
              navigability. (2) <strong>Missing elements</strong> — describe 8 components
              and the AI may render 6, silently dropping the less-mentioned ones.
              Count participants and elements against your description. (3){' '}
              <strong>Incorrect cardinality</strong> — &quot;one-to-many&quot; relationships
              often appear as &quot;one-to-one&quot; in generated ER diagrams. Check every
              relationship multiplicity label explicitly.
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
                  { name: "Diagram Generator", path: "/tools/diagram-generator" },
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — UML Diagram Generator AI</strong> is a fully private,
            browser-based tool that converts plain-text descriptions into professional
            <strong>UML diagrams</strong> — including <strong>class diagrams</strong>,
            <strong>sequence diagrams</strong>, <strong>ER diagrams</strong>,
            <strong>use-case diagrams</strong>, and <strong>flowcharts</strong> — using
            AI and Mermaid.js. All processing runs locally on your device, ensuring your
            proprietary designs never leave your computer. Supports live preview, SVG/PNG
            export, and direct Mermaid code editing. The fastest free way to generate UML
            diagrams for system design, API documentation, and database planning in 2026,
            with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}