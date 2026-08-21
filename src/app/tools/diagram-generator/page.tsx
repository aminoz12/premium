import type { Metadata } from "next"
import ClientPage from "../diagramm-generator-ai/client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/diagram-generator`

export const metadata: Metadata = {
  title:
    "Free AI Diagram Generator — Create Flowcharts & Diagrams",
  description:
    "Generate flowcharts, mind maps, and process diagrams from text descriptions. Free, no account, works entirely in your browser. Export as PNG or SVG.",
  keywords: [
    "ai diagram generator",
    "free ai diagram generator",
    "flowchart maker online free",
    "create diagram from text",
    "mind map generator ai",
    "ai flowchart generator free",
    "diagram generator no login",
    "process flow diagram maker",
    "free diagram creator 2026",
    "online diagram tool",
    "generate diagrams from description",
    "ai chart maker",
    "free flowchart software",
    "diagram from text ai",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title:
      "Free AI Diagram Generator — Create Flowcharts & Mind Maps",
    description:
      "Create professional diagrams instantly from text. No account, free, browser-based. Export as PNG or SVG.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free AI Diagram Generator — Create Flowcharts, Mind Maps & More",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Diagram Generator — Flowcharts, Mind Maps & More",
    description:
      "Create professional diagrams instantly from text. No account, free, browser-based. Export as PNG or SVG.",
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

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Diagram Generator",
  url: TOOL_URL,
  description:
    "A free AI-powered diagram and flowchart generator that creates professional visual maps, process flows, and mind maps from text descriptions — directly in the browser.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate flowcharts, mind maps, process flows, and org charts from text",
    "AI-powered diagram layout and formatting",
    "Export diagrams as high-resolution PNG images",
    "Export as scalable SVG for further editing",
    "Instant preview with live editing",
    "No account or software installation required",
    "All processing in-browser — private and secure",
    "Supports multiple diagram types automatically detected from description",
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
  name: "How to Create a Diagram with AI",
  description:
    "Generate a professional diagram from text in under a minute using our free browser tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools AI Diagram Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Describe Your Diagram",
      text: "Type a plain-text description of the flowchart, mind map, or process you need — e.g., 'customer order processing workflow'.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Generate the Diagram",
      text: "Click the generate button and the AI will analyse your description and produce a professional diagram layout.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review and Edit",
      text: "Preview the generated diagram; you can edit the code directly if you need fine-tuning, or regenerate with modified instructions.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export Your Diagram",
      text: "Download your diagram as a PNG image or SVG vector file, ready for use in presentations, documents, or websites.",
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
      name: "What is an AI diagram generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI diagram generator converts plain text descriptions into professional visual diagrams — flowcharts, mind maps, process flows, and organizational charts — automatically. No design skills or manual drawing tools are needed.",
      },
    },
    {
      "@type": "Question",
      name: "What types of diagrams can this tool create?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool creates flowcharts, mind maps, process and workflow diagrams, organizational charts, decision trees, and concept maps. Describe your process or idea in plain English and the AI selects the most appropriate diagram type and layout.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export the generated diagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can export diagrams as PNG or SVG images, which can be inserted into presentations, documentation, wiki pages, README files, or printed materials. SVG format preserves full scalability for any size output.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from the UML diagram generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool focuses on general-purpose diagrams — flowcharts, mind maps, and process flows — described in natural language. The UML generator is specialized for software engineering diagrams (class, sequence, ER) using Mermaid syntax. Both tools are free and complement each other.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to know any diagramming syntax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No syntax knowledge is required. Simply describe your process, concept, or system in plain text and the AI generates the appropriate diagram automatically. If you want to fine-tune the output, you can edit the generated diagram code directly.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on how many diagrams I can create?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. There are no limits on the number of diagrams you can generate. The tool is completely free, requires no account, and runs in your browser — create as many diagrams as you need without restrictions.",
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
      name: "Productivity Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI Diagram Generator",
      item: TOOL_URL,
    },
  ],
}

export default function Page() {
  return (
    <>
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
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free AI Diagram Generator — Create Flowcharts & Diagrams
          </h1>
          <img src="/images/diagramm-generator-ai.webp" alt="Free AI Diagram Generator — create flowcharts, mind maps, and process diagrams online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Describe your process, workflow, or concept in plain text and let AI generate a professional diagram instantly. Supports flowcharts, mind maps, process diagrams, and organizational charts — export as PNG or SVG. Completely free, no design skills or account required.
          </p>

          <QuickAnswer
            question="What is an AI diagram generator?"
            answer="An AI diagram generator converts plain text descriptions into professional visual diagrams — flowcharts, mind maps, or process flows — automatically. No design skills or diagramming syntax knowledge is needed."
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
                  Productivity Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">AI Diagram Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="AI Diagram Generator Tool">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Diagram Generator: Which Diagram Type to Use and When" />
          <meta
            itemProp="description"
            content="A practical guide to choosing between flowcharts, sequence diagrams, ER diagrams, and architecture diagrams — and the diagram mistake that adds confusion instead of clarity."
          />
          <meta itemProp="datePublished" content="2024-04-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Which diagram for which purpose */}
          <section aria-labelledby="which-diagram" className="space-y-4">
            <h2
              id="which-diagram"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which diagram type to use for each purpose
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Diagram type</th>
                    <th className="border border-border p-2 text-left font-semibold">Use when</th>
                    <th className="border border-border p-2 text-left font-semibold">Don&apos;t use when</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Flowchart', 'Showing a decision process or algorithm with branching paths', 'Showing system components — use architecture diagram instead'],
                    ['Sequence diagram', 'Showing the order of messages/calls between components over time', 'Showing static structure — use class or ER diagram'],
                    ['ER diagram', 'Showing database tables and their relationships (foreign keys)', 'Showing API flows — use sequence diagram'],
                    ['Architecture diagram', 'Showing how systems, services, and infrastructure connect', 'Showing code-level class relationships — use class diagram'],
                    ['Class diagram', 'Showing OOP classes, interfaces, and inheritance', 'Showing runtime message flow — use sequence diagram'],
                    ['State diagram', 'Showing how an object transitions between states', 'Showing multi-component interactions — use sequence diagram'],
                  ].map(([type, useWhen, dontUse]) => (
                    <tr key={type}>
                      <td className="border border-border p-2 font-medium text-foreground">{type}</td>
                      <td className="border border-border p-2 text-muted-foreground">{useWhen}</td>
                      <td className="border border-border p-2 text-muted-foreground">{dontUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* The diagram mistake */}
          <section
            aria-labelledby="diagram-mistake"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="diagram-mistake"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The diagram mistake that adds confusion instead of clarity
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The most common diagram mistake: putting too much in one diagram.
              A single diagram that shows database schema, API endpoints, UI components,
              and infrastructure all at once is unreadable — every reader sees different
              things and leaves with different mental models. The rule of thumb: one
              diagram, one audience, one question. An architecture diagram for a new
              engineer answers &quot;how do the systems connect?&quot;. A sequence diagram for
              a code reviewer answers &quot;what happens during checkout?&quot;. They are
              different diagrams for different questions.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Diagrams generated from text (Mermaid, PlantUML, Graphviz) age better
              than hand-drawn diagrams — they live next to the code in version control
              and update when the description updates. A PNG exported from a drawing
              tool and attached to a Confluence page will be out of date within three
              months.
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
                  { name: "Code Explainer", path: "/tools/code-explainer" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — AI Diagram Generator</strong> turns plain-language descriptions into professional visual diagrams instantly. Create <strong>flowcharts</strong> for decision logic, <strong>mind maps</strong> for brainstorming, <strong>process diagrams</strong> for workflows, and <strong>organizational charts</strong> for team structures — all exportable as PNG or SVG. No Visio license, no Lucidchart subscription, no design skills required. Completely free and private in 2026.
          </p>
        </footer>
      </div>
    </>
  )
}
