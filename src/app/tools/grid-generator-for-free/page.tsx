import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── Absolute URLs ─────────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/grid-generator-for-free"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── Metadata ──────────────────────────────────────────────────────────────────
// Title: "Free CSS Grid Generator — Visual CSS Layout Builder" = 51 chars ✓

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CSS Grid Template Areas Generator — Visual Layout Builder Free",
  description:
    "Generate grid-template-areas CSS visually — click cells to name areas, then copy complete CSS with columns, rows, and named child placement. Free, no account.",
  keywords: [
    "css grid generator",
    "free css grid generator online",
    "visual css grid layout builder",
    "css grid template generator free",
    "css grid area generator online",
    "generate css grid columns rows free",
    "responsive css grid builder browser",
    "css grid maker no account 2026",
    "grid template areas generator free",
    "visual grid layout builder online",
    "css grid code generator free",
    "css grid builder no signup",
    "css layout generator browser based",
    "css grid generator no upload",
    "free online css grid tool 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "CSS Grid Template Areas Generator — Visual Layout Builder Free",
    description:
      "Generate grid-template-areas CSS visually — click cells to name areas, then copy complete CSS with columns, rows, and named child placement. Free, no account.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free CSS Grid Generator — Visual CSS Layout Builder by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free CSS Grid Generator — Visual Layout Builder",
    description:
      "Visually build CSS grid layouts with columns, rows, and named areas — copy the generated CSS in one click. Free, no signup, works entirely in your browser.",
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
  name: "Free CSS Grid Generator",
  url: TOOL_URL,
  description:
    "A completely free, browser-based visual CSS grid generator that lets you define columns, rows, and named grid areas interactively, then outputs production-ready grid-template-columns, grid-template-rows, grid-template-areas, and grid-area CSS — no server uploads, no account required.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with CSS Grid and JavaScript support: Chrome 88+, Firefox 85+, Safari 14.1+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Visual drag-and-click grid area editor for defining named grid regions",
    "Real-time generation of grid-template-columns and grid-template-rows CSS properties",
    "Named grid-template-areas output with corresponding grid-area child values",
    "Configurable column and row counts with custom gap and unit settings",
    "One-click copy of complete, production-ready CSS grid code to clipboard",
    "Live visual preview of the grid layout as you build",
    "No account registration or sign-in required",
    "100% browser-based — no file uploads, no server processing, no data retention",
    "Cross-platform: works on Windows, macOS, and Linux in any modern browser",
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
  name: "How to Generate a CSS Grid Layout Visually for Free",
  description:
    "A simple 4-step guide to building a complete CSS grid layout using our free, browser-based visual grid generator. The entire process takes under one minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free CSS Grid Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Set Your Column and Row Count",
      text: "Use the column and row controls to define the grid structure. Enter the number of columns and rows you need, and optionally adjust the gap value and unit (px, rem, %) to match your design system.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Define Named Grid Areas",
      text: "Click on individual grid cells and assign area names — such as 'header', 'sidebar', 'main', and 'footer'. Adjacent cells sharing the same name are merged into a single named grid area, mirroring how grid-template-areas works in CSS.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Layout",
      text: "Review the live visual preview to verify that your grid areas are positioned and sized correctly. Adjust column widths, row heights, or area assignments until the layout matches your design intent.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy the Generated CSS",
      text: "Click the copy button to save the complete generated CSS — including grid-template-columns, grid-template-rows, grid-template-areas, gap, and individual grid-area values for each child element — directly to your clipboard for immediate use in your project.",
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
      name: "How do I generate a CSS grid layout for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Set your column and row counts using the controls, click cells to assign named grid areas, preview the layout in real time, then click copy to save the complete generated CSS — including grid-template-columns, grid-template-rows, and grid-template-areas — directly to your clipboard. No account or upload required.",
      },
    },
    {
      "@type": "Question",
      name: "What inputs does the CSS grid generator accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The generator accepts numeric column and row counts, a gap value with a selectable unit (px, rem, or %), optional fractional unit (fr) column and row sizes, and named area labels that you assign to individual cells by clicking. No file uploads are required — the entire input is handled through the visual interface.",
      },
    },
    {
      "@type": "Question",
      name: "What CSS grid properties does the tool generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The generator outputs grid-template-columns, grid-template-rows, grid-template-areas, and gap for the parent grid container, plus individual grid-area values for each named child element. This is everything you need to implement a complete CSS grid layout directly in your stylesheet without writing any CSS from scratch.",
      },
    },
    {
      "@type": "Question",
      name: "Is the generated CSS uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All grid generation and preview rendering happens entirely within your browser using JavaScript and CSS. No data is transmitted to or stored on any server. Your grid configuration and generated CSS code never leave your device.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between grid-template-areas and grid-template-columns?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "grid-template-columns defines the number and size of columns in the grid track — for example, '1fr 2fr 1fr' creates three columns where the middle is twice as wide. grid-template-areas defines a named map of how those columns and rows are occupied by child elements — for example, 'header header header' spanning the top row with a single element named header. Both properties work together: columns and rows define the grid tracks, while grid-template-areas assigns which tracks each named child element occupies.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on the grid size I can generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No enforced limits are imposed by the tool. You can define as many columns and rows as your browser can render in the preview panel. For practical purposes, most CSS grid layouts use between 2 and 12 columns and 2 and 8 rows, but the generator supports configurations beyond those ranges without restriction.",
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
      name: "Free CSS Grid Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ────────────────────────────────────────────────────────────

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
            CSS Grid Template Areas Generator — Visual Layout Builder Free
          </h1>
          <img src="/images/grid-generator.webp" alt="Free CSS Grid Generator — visual layout builder for columns, rows, and named grid areas" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Build CSS grid layouts visually without writing a single line of code. Define your
            columns, rows, and named grid areas by clicking, preview the layout in real time, and
            copy the complete generated CSS directly into your project. Completely free, no account
            required, runs entirely in your browser.
          </p>

          <QuickAnswer
            question="How does CSS grid-template-areas work?"
            answer="grid-template-areas lets you name regions of your grid using quoted strings. Example: grid-template-areas: 'header header' 'sidebar main' 'footer footer' — each string is a row, each word is a column cell. Then assign children with grid-area: header to place them. This generator writes that syntax for you visually."
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
                <span className="text-foreground font-medium">Free CSS Grid Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Free CSS Grid Generator Tool">
           <ClientPage />
        </main>

        {/* ── Email Capture ── */}
        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        {/* ──────────────────────────────────────────────────────────────────────
            AdSense High-Value Content — TechArticle Microdata on <article>
            only. FAQ section uses plain <dl>/<dt>/<dd> — zero Microdata.
        ────────────────────────────────────────────────────────────────────── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSS Grid Generator: The Properties That Actually Control Layout" />
          <meta
            itemProp="description"
            content="How CSS Grid's two axes work, the three properties that control most layouts, and when to use Grid vs. Flexbox."
          />
          <meta itemProp="datePublished" content="2024-04-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How the two axes work */}
          <section aria-labelledby="two-axes" className="space-y-4">
            <h2
              id="two-axes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How CSS Grid&apos;s two axes work
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              CSS Grid controls layout along two axes simultaneously: the row axis
              (block direction, top to bottom) and the column axis (inline direction,
              left to right). This two-dimensional control is the key difference
              from Flexbox, which only controls one direction at a time.{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">grid-template-columns</code>{' '}
              defines the column track sizes;{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">grid-template-rows</code>{' '}
              defines the row track sizes. Items are placed automatically into the
              grid cells left-to-right, top-to-bottom, unless explicitly positioned.
            </p>
          </section>

          {/* Three key properties */}
          <section
            aria-labelledby="key-properties"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="key-properties"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The three properties that handle most grid layouts
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground font-mono">repeat() + fr</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    grid-template-columns: repeat(3, 1fr)
                  </code>{' '}
                  creates 3 equal-width columns that share available space.{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">fr</code>{' '}
                  (fractional unit) distributes remaining space after fixed widths
                  are subtracted. Mixing fixed and fr:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    200px 1fr 1fr
                  </code>{' '}
                  — sidebar fixed at 200px, two content columns split the rest equally.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground font-mono">auto-fill + minmax()</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
                  </code>{' '}
                  creates as many columns as fit at minimum 250px wide, each growing
                  to fill available space. This is the responsive card grid pattern
                  that works at any viewport width with no media queries.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground font-mono">grid-column / grid-row span</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    grid-column: span 2
                  </code>{' '}
                  makes an item occupy two column tracks. Used for featured cards,
                  hero items, or sidebars that span the full row height. Combine
                  with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">grid-row: span 2</code>{' '}
                  for magazine-style masonry-like layouts.
                </span>
              </li>
            </ul>
          </section>

          {/* Grid vs Flexbox */}
          <section aria-labelledby="grid-vs-flex" className="space-y-4">
            <h2
              id="grid-vs-flex"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use Grid vs. Flexbox
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Use <strong>Grid</strong> when you&apos;re thinking in rows AND columns — page
              layout, card grids, dashboard panels, any layout where items need to
              align across both axes. Use <strong>Flexbox</strong> when you&apos;re thinking
              in one direction — a navigation bar, a row of buttons, centering a single
              item, distributing items along one axis. The rule of thumb: Grid for
              the macro layout (the page structure), Flexbox for the micro layout
              (the content inside each grid cell).
            </p>
          </section>

          {/* Common grid layout patterns */}
          <section aria-labelledby="grid-layout-patterns" className="space-y-4">
            <h2
              id="grid-layout-patterns"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Common CSS grid layout patterns with template areas
            </h2>
            <p className="text-sm text-muted-foreground">
              Paste these patterns into your CSS and adjust column sizes to match your design.
            </p>
            <div className="space-y-4">
              {[
                {
                  name: "Holy Grail Layout (header, sidebar, main, aside, footer)",
                  css: `.layout {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main    aside"
    "footer  footer  footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`,
                },
                {
                  name: "Dashboard (sidebar + top bar + content)",
                  css: `.dashboard {
  display: grid;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  grid-template-columns: 240px 1fr;
  grid-template-rows: 56px 1fr;
  min-height: 100vh;
}`,
                },
                {
                  name: "Blog post (hero, content, sidebar)",
                  css: `.blog {
  display: grid;
  grid-template-areas:
    "hero    hero"
    "content sidebar";
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}`,
                },
                {
                  name: "Card grid (auto-fill responsive)",
                  css: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
                },
              ].map(({ name, css }) => (
                <div key={name} className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{name}</p>
                  <pre className="text-xs font-mono bg-muted rounded-lg p-3 overflow-x-auto border border-border">{css}</pre>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related CSS tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "CSS Box Shadow Generator", path: "/tools/box-shadow" },
                  { name: "Border Radius Generator", path: "/tools/border-radius" },
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Free CSS Grid Generator</strong> is a fully private,
            browser-based visual layout builder that generates production-ready{" "}
            <strong>CSS Grid</strong> code — including{" "}
            <strong>grid-template-columns</strong>,{" "}
            <strong>grid-template-rows</strong>,{" "}
            <strong>grid-template-areas</strong>, and <strong>grid-area</strong> declarations for
            child elements — without sending any data to a server. Whether you are building a
            magazine layout, a SaaS dashboard, or a responsive card grid, the generator outputs
            specification-compliant CSS that works in all modern browsers at 97%+ global coverage
            in 2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}