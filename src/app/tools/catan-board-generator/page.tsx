import { ToolLayout } from "@/components/layout/tool-layout-server"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { buildToolMetadata } from "@/lib/seo/metadata"
import ClientPage from "./client-page"
import type { Metadata } from "next"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/catan-board-generator`

export const FAQ_ITEMS = [
  {
    q: "How do I use the Free Catan Board Generator?",
    a: "Click the Generate Board button to create a randomized Catan layout. The tool automatically arranges terrain tiles, places number tokens, and positions ports according to algorithmic fairness rules. Review the generated board and click regenerate if you want a different configuration.",
  },
  {
    q: "What game formats and expansions are supported?",
    a: "The tool supports the base Settlers of Catan game with the standard 19-hex island layout. It handles the classic 3-4 player configuration with five resource types, the desert tile, and standard port distribution.",
  },
  {
    q: "What output does the board generator provide?",
    a: "The tool outputs a complete visual board layout showing all 19 hexagonal terrain tiles, their assigned number tokens, and port placements around the perimeter. The layout can be screenshotted, printed, or shared digitally with your play group.",
  },
  {
    q: "Is my board configuration kept private?",
    a: "Yes. All board generation, randomization, and validation happens entirely in your browser using client-side JavaScript. Your game configurations, house rules, and tournament setups are never uploaded to any server or stored in a database.",
  },
  {
    q: "What is the difference between random and balanced board generation?",
    a: "Random generation simply shuffles tiles and tokens without validation, often creating unplayable boards with clustered resources or adjacent red numbers. Balanced generation applies algorithmic fairness rules to ensure competitive parity while maintaining sufficient randomness for replayability.",
  },
  {
    q: "Are there any usage limits on the free generator?",
    a: "The tool is completely free with unlimited board generations, configuration iterations, and layout exports. There are no daily limits, watermarks, or feature restrictions. Use it for casual play, competitive tournaments, or content creation without any cost.",
  },
]

export const metadata: Metadata = {
  ...buildToolMetadata("catan-board-generator"),
  title: "Catan Board Randomizer — Balanced Setup, No Adjacent 6/8 Free",
  description:
    "Randomize your Catan board with balanced resources and no adjacent 6 or 8 tokens. Free, browser-based generator for 3-4 and 5-6 player setups. No account needed.",
  keywords: [
    "catan board generator",
    "settlers of catan randomizer",
    "free catan map generator",
    "catan board setup tool online",
    "random catan board generator free",
    "catan hex layout generator 2026",
    "settlers board randomizer browser",
    "catan number token generator",
    "online catan board setup",
    "catan fair board generator",
    "browser based catan randomizer",
    "free settlers board setup tool",
    "catan tournament board generator",
    "catan map randomizer no upload",
    "catan board configuration tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Catan Board Randomizer — Balanced Setup, No Adjacent 6/8 Free",
    description:
      "Randomize your Catan board with balanced resources and no adjacent 6 or 8 tokens. Free, browser-based generator for 3-4 and 5-6 player setups.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Catan Board Generator — Randomize Settlers Maps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Randomize Catan Boards Free — Balanced Settlers Layouts",
    description:
      "Generate fair Catan board layouts with balanced resources and no adjacent red numbers. Free, private, browser-based — no app needed.",
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

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Catan Board Generator",
  url: TOOL_URL,
  description:
    "A free browser-based Catan board generator that creates randomized, balanced layouts for the Settlers of Catan board game. Ensures fair resource distribution, prevents adjacent red numbers, and optimizes port placement.",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires Chrome 88+, Firefox 85+, Safari 14+, or Edge 88+ with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Algorithmic fairness engine preventing terrain clustering and resource imbalance",
    "Red number adjacency prevention for 6 and 8 tokens on adjacent hexes",
    "Balanced number token distribution across different terrain types",
    "Even port placement optimization around the board perimeter",
    "Desert tile position validation maintaining board connectivity",
    "One-click board regeneration with instant layout iteration",
    "Client-side processing with zero server uploads for privacy",
    "Universal browser compatibility across all major platforms",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate a Balanced Catan Board",
  description:
    "Use this free Catan board generator to create randomized, fair layouts for the Settlers of Catan board game with balanced resources and no adjacent red numbers.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free Catan Board Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Open the Board Generator",
      text: "Navigate to the Free Catan Board Generator in any modern web browser. No installation, account, or board game companion app is required.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Generate Board",
      text: "Press the Generate Board button to create a randomized layout. The tool arranges terrain tiles, places number tokens, and positions ports using algorithmic fairness rules.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Generated Layout",
      text: "Visually inspect the board to verify terrain distribution, number token placement, and port positioning. Check that no red numbers are adjacent and resources are evenly spread.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export or Share the Board",
      text: "Screenshot the generated layout to share with your play group, print it for offline reference, or click regenerate to iterate through alternative configurations.",
      url: TOOL_URL,
    },
  ],
}

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
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
      name: "Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Free Catan Board Generator",
      item: TOOL_URL,
    },
  ],
}

export default function Page() {
  const schemas = [
    webApplicationSchema,
    howToSchema,
    faqPageSchema,
    breadcrumbSchema,
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <header className="mb-6 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Catan Board Randomizer — Balanced Setup, No Adjacent 6/8 Free
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Generate balanced, randomized board layouts for the Settlers of Catan.
              Fair resource distribution, no adjacent red numbers, optimized port
              placement — completely free, no upload required.
            </p>

            <QuickAnswer
              question="How do I set up a balanced Catan board?"
              answer="Click Generate to get a randomized layout where 6 and 8 tokens are never adjacent, resources are spread across the board, and ports are positioned fairly. The algorithm applies tournament-standard constraints so no starting position has an overwhelming advantage. Regenerate until you find a layout your group likes."
            />
            <nav
              aria-label="Breadcrumb"
              className="text-xs text-muted-foreground"
            >
              <ol
                className="flex items-center gap-1"
                itemScope
                itemType="https://schema.org/BreadcrumbList"
              >
                <li
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <a
                    href={SITE_URL}
                    itemProp="item"
                    className="hover:underline"
                  >
                    <span itemProp="name">Home</span>
                  </a>
                  <meta itemProp="position" content="1" />
                </li>
                <li aria-hidden="true">›</li>
                <li
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <a
                    href={`${SITE_URL}/tools`}
                    itemProp="item"
                    className="hover:underline"
                  >
                    <span itemProp="name">Tools</span>
                  </a>
                  <meta itemProp="position" content="2" />
                </li>
                <li aria-hidden="true">›</li>
                <li
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <span itemProp="name">Free Catan Board Generator</span>
                  <meta itemProp="item" content={TOOL_URL} />
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </nav>
          </header>

          <main>
            <ClientPage />
          </main>

          <hr className="my-12 border-border" />

          <article
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="author" content="Achraf A." />
            <meta itemProp="datePublished" content="2025-01-01" />
            <meta itemProp="dateModified" content="2026-05-01" />

            <h2 className="text-2xl font-bold mb-4" itemProp="headline">
              Catan Board Randomization: Balancing Fairness vs. True Randomness
            </h2>
            <div itemProp="articleBody">
              <p className="text-muted-foreground mb-4">
                The standard Settlers of Catan beginner layout — fixed terrain and
                numbers — gives every player the same experience. After a few games,
                experienced players memorize the optimal first settlements (the
                5-6 cluster near ore and grain) and the board stops producing
                interesting decisions. A randomized board restores that initial
                tension of analysis under uncertainty.
              </p>
              <p className="text-muted-foreground mb-4">
                True randomness, however, produces boards that are mathematically
                unfair: the 6 and 8 tokens (highest probability after 7) might land
                on adjacent tiles, concentrating value in one corner. Tournament
                Catan uses constrained randomization — random layout with rules that
                prevent clustering of high-value numbers. This generator applies
                those constraints.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                The Probability Math Behind the Tokens
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Token number</th>
                      <th className="border border-border p-2 text-left">Ways to roll (2d6)</th>
                      <th className="border border-border p-2 text-left">Probability</th>
                      <th className="border border-border p-2 text-left">Pips on token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['2', '1', '2.78%', '1'],
                      ['3', '2', '5.56%', '2'],
                      ['4', '3', '8.33%', '3'],
                      ['5', '4', '11.11%', '4'],
                      ['6', '5', '13.89%', '5'],
                      ['7', '6', '16.67%', 'Robber — no token'],
                      ['8', '5', '13.89%', '5'],
                      ['9', '4', '11.11%', '4'],
                      ['10', '3', '8.33%', '3'],
                      ['11', '2', '5.56%', '2'],
                      ['12', '1', '2.78%', '1'],
                    ].map(([num, ways, prob, pips]) => (
                      <tr key={num} className={'border border-border ' + (num === '6' || num === '8' ? 'bg-red-50 dark:bg-red-950/20' : '')}>
                        <td className={'border border-border p-2 font-bold ' + (num === '6' || num === '8' ? 'text-red-600' : '')}>{num}</td>
                        <td className="border border-border p-2">{ways}</td>
                        <td className="border border-border p-2">{prob}</td>
                        <td className="border border-border p-2">{pips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                What Constrained Randomization Prevents
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                <li>
                  <strong>Adjacent 6-8 tokens:</strong> Two high-probability
                  resources on touching tiles means one settlement can access both,
                  giving a first-mover advantage that compounds throughout the game.
                  The generator ensures 6 and 8 are never adjacent.
                </li>
                <li>
                  <strong>Resource type clustering:</strong> Three ore tiles
                  adjacent to each other and all carrying medium-to-high numbers
                  makes ore the dominant resource, collapsing strategy diversity.
                  The generator spreads resource types evenly.
                </li>
                <li>
                  <strong>Port misalignment:</strong> A 2:1 wood port adjacent to
                  a desert tile is useless. The generator optionally considers
                  port adjacency when placing terrain.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Variants Supported
              </h3>
              <p className="text-muted-foreground mb-4">
                Beyond the base 3–4 player hexagonal layout (19 tiles, 18 tokens),
                the generator supports the 5–6 player extension (30 tiles, 28
                tokens), Seafarers island boards, and custom hex counts for
                print-and-play expansions. Each variant adjusts the constraint
                rules to maintain fairness at different board sizes.
              </p>
            </div>

            {/* Catan number token probability table */}
            <section className="space-y-4 not-prose">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Catan number token probabilities — dice roll odds
              </h3>
              <p className="text-sm text-muted-foreground">
                Understanding roll probabilities helps you evaluate any generated board.
                Two dice (2d6) produce these outcomes out of 36 total combinations:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-3 py-2 text-left font-semibold">Token number</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Combos out of 36</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Probability</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Pips (dots on tile)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["2", "1", "2.8%", "●"],
                      ["3", "2", "5.6%", "●●"],
                      ["4", "3", "8.3%", "●●●"],
                      ["5", "4", "11.1%", "●●●●"],
                      ["6", "5", "13.9%", "●●●●● (red)"],
                      ["7", "6", "16.7%", "Robber — no tile"],
                      ["8", "5", "13.9%", "●●●●● (red)"],
                      ["9", "4", "11.1%", "●●●●"],
                      ["10", "3", "8.3%", "●●●"],
                      ["11", "2", "5.6%", "●●"],
                      ["12", "1", "2.8%", "●"],
                    ].map(([num, combos, prob, pips]) => (
                      <tr key={num} className={num === "7" ? "bg-yellow-50 dark:bg-yellow-950/20" : "odd:bg-muted/30"}>
                        <td className="border border-border px-3 py-2 font-mono font-bold">{num}</td>
                        <td className="border border-border px-3 py-2">{combos}/36</td>
                        <td className="border border-border px-3 py-2">{prob}</td>
                        <td className="border border-border px-3 py-2 text-xs">{pips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                Red numbers (6 and 8) have the highest production probability after 7 — placing them adjacent concentrates almost 28% of all non-robber production on two tiles. This generator prevents that.
              </p>
            </section>

            <RelatedTools
              tools={[
                { name: "Random Image Generator", path: "/tools/random-image-for-free" },
                { name: "Diagram Generator", path: "/tools/diagram-generator" },
                { name: "Generate Chart", path: "/tools/generate-chart" },
              ]}
            />
          </article>

          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
            <p>
              <strong>
                TheFreeAITools — Free Catan Board Generator
              </strong>{" "}
              is a fully private, browser-based tool for creating randomized,
              balanced <strong>Settlers of Catan</strong> board layouts without
              any uploads. All generation and validation happens locally on your
              device in 2026 — your game configurations and house rules are never
              transmitted to external servers. Supports the standard 19-hex base
              game with fair resource distribution, red number adjacency
              prevention, balanced token placement, and optimized port positioning
             — completely free with no account or companion app required.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}