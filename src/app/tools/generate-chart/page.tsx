import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URLs ───────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/generate-chart"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

export const metadata: Metadata = {
  title: "Free Online Chart Maker | Graph Generator from CSV & JSON", // 57 chars
  description:
    "Free online chart maker. Create bar, line, pie & doughnut charts from CSV or JSON. No uploads, no account. Download PNG instantly.", // 130 chars
  keywords: [
    "online chart maker",
    "free chart generator",
    "csv to chart",
    "json to chart",
    "create pie chart online",
    "bar chart maker free",
    "line graph generator",
    "data visualization tool",
    "chart creator no sign up",
    "browser chart maker",
    "convert csv to graph online",
    "free graph generator 2026",
    "no upload chart tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Online Chart Maker — Create Graphs from CSV & JSON",
    description:
      "Turn raw CSV or JSON data into stunning charts instantly. No uploads, completely free. Bar, line, pie, doughnut, radar, and polar area charts with custom palettes.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Online Chart Maker — Graph Generator by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Chart Generator: Visualize Data Instantly",
    description:
      "Transform raw data into beautiful charts without uploading to any server. Supports CSV, JSON, bar, line, pie, and more. Download as PNG.",
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

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────
const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Online Chart Maker",
  url: TOOL_URL,
  description:
    "A free, privacy-first browser tool that creates charts and graphs from CSV or JSON data. Supports multiple chart types, color palettes, and downloads as PNG , all processed on your device.",
  applicationCategory: "DataVisualizationApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with HTML5 Canvas support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Supports CSV and JSON data input via file upload or text paste",
    "Generates bar, line, pie, doughnut, radar, and polar area charts",
    "Real‑time preview and customization of chart types and color palettes",
    "Download high‑resolution PNG images of generated charts",
    "100% client‑side processing , data never leaves your device",
    "Smart data parsing with automatic header and value detection",
    "Responsive and interactive chart rendering",
    "No account, no sign‑up, no paywalls",
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
  name: "How to Create a Chart from CSV or JSON",
  description:
    "Follow these four simple steps to turn your raw data into a professional chart using our free online chart generator. The whole process takes less than a minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Online Chart Maker",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Load Your Data",
      text: "Paste your CSV or JSON text directly into the editor, or click the file upload button to import a .csv, .json, or .txt file from your device. The tool automatically detects the format and parsing rules.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Chart Type & Color Palette",
      text: "Choose your desired chart style: bar, line, pie, doughnut, radar, or polar area. Then pick a pre-designed color palette , Vibrant, Pastel, Ocean, Sunset, or Neon , to instantly apply a professional look.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Generate & Preview the Chart",
      text: "Click the 'Generate' button to render your chart. The interactive preview appears immediately, allowing you to check labels, values, and colors before finalizing.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Chart",
      text: "Once satisfied, click the download button to save the chart as a high‑resolution PNG image file. Your original data remains private and is never uploaded.",
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
      name: "How do I create a chart from CSV or JSON data for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste your data or upload a file into our browser-based chart maker. It parses the data instantly, lets you pick a chart type and color palette, and then generates a downloadable PNG , all without any cost or uploads to a server.",
      },
    },
    {
      "@type": "Question",
      name: "What chart types can I generate with this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can create six chart types: bar charts for comparing categories, line graphs for trends over time, pie and doughnut charts for proportions, radar charts for multivariate comparisons, and polar area charts for radial data visualization.",
      },
    },
    {
      "@type": "Question",
      name: "Can I upload my own data files, or do I have to paste them?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both methods are supported. You can paste CSV or JSON text directly into the editor, or use the built-in file uploader to load .csv, .json, or .txt files. The tool parses the contents automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Are my data and charts uploaded to any server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All data parsing, chart rendering, and image generation happen entirely inside your web browser. Your files and data never leave your device, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a pie chart and a doughnut chart?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both display parts of a whole, but a doughnut chart has a hollow center that can be used to show additional information (like a total value), while a pie chart is a full circle. Doughnut charts are often preferred for cleaner, modern presentations.",
      },
    },
    {
      "@type": "Question",
      name: "Is there any limit on the amount of data I can visualize?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No hard limits exist because all processing runs locally. However, for readability, we recommend aggregating data into 5–15 categories. Charts with hundreds of data points may become cluttered, but the tool will still render them.",
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
      name: "Data Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Online Chart Maker",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ──────────────────────────────────────────────────────────
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

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
        <header className="space-y-4 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Free Online Chart & Graph Maker
          </h2>
          <QuickAnswer
            question="What chart type should I use for comparing values, trends, and proportions?"
            answer="Use a Bar chart to compare values across categories (sales by region, scores by student). Use a Line chart to show trends over time (revenue per month, temperature over a week). Use a Pie or Doughnut chart to show proportions of a whole (market share percentages) — limit to 5–7 slices. Use a Radar chart to compare multiple metrics across categories (performance reviews, product attributes). Use a Scatter plot for correlation between two numeric variables. Rule of thumb: if you have time on the X axis, use line; if you have categories, use bar."
          />
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Instantly turn your raw data into stunning, responsive charts and graphs. Upload a CSV or JSON file, or paste your text directly to generate bar, line, pie, radar, and doughnut charts. Customize your palette and download high‑resolution images instantly.
          </p>

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
                  Data Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Online Chart Maker</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Online Chart Maker Tool">
          <ToolClient />
        </main>

        <hr className="border-border" />

        {/* ── AdSense High‑Value Article ── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Chart Generator: Which Chart Type Fits Your Data and Which Misleads" />
          <meta
            itemProp="description"
            content="A practical guide to choosing between bar, line, pie, and scatter charts — and the three chart patterns that misrepresent data even when the numbers are accurate."
          />
          <meta itemProp="datePublished" content="2024-04-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Chart type selection */}
          <section aria-labelledby="chart-selection" className="space-y-4">
            <h2
              id="chart-selection"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Choosing the right chart type for your data
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Chart type</th>
                    <th className="border border-border p-2 text-left font-semibold">Best for</th>
                    <th className="border border-border p-2 text-left font-semibold">Don&apos;t use for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Bar chart (vertical)', 'Comparing discrete categories — revenue by product, users by country', 'Time series with many data points — use line chart'],
                    ['Line chart', 'Trends over time — monthly active users, temperature over a year', 'Unordered categories — use bar chart'],
                    ['Pie / donut chart', 'Part-to-whole with 2–5 slices and one slice clearly dominant', 'More than 5 categories, or when exact values matter'],
                    ['Scatter plot', 'Correlation between two variables — ad spend vs. revenue', 'Categorical data with no numeric relationship'],
                    ['Area chart', 'Volume over time, especially for stacked totals', 'Negative values — area below zero is visually confusing'],
                    ['Histogram', 'Distribution of a single variable — response times, age ranges', 'Comparing separate groups — use grouped bar chart'],
                  ].map(([chart, bestFor, avoid]) => (
                    <tr key={chart}>
                      <td className="border border-border p-2 font-medium text-foreground">{chart}</td>
                      <td className="border border-border p-2 text-muted-foreground">{bestFor}</td>
                      <td className="border border-border p-2 text-muted-foreground">{avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Three misleading patterns */}
          <section
            aria-labelledby="misleading-patterns"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="misleading-patterns"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Three chart patterns that misrepresent data
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Truncated Y-axis</span>
                <span>
                  Starting a bar chart&apos;s Y-axis at 95 instead of 0 makes a 1% difference
                  look like a 100% difference visually. The bars appear to show a dramatic
                  change when the actual values are nearly identical. Y-axes for bar charts
                  should always start at zero. Line charts are more forgiving — a truncated
                  axis can legitimately show trend detail.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Pie charts with too many slices</span>
                <span>
                  A pie chart with 8 slices — especially when several are similar sizes —
                  makes it impossible to compare values. The human eye cannot judge angles
                  accurately for adjacent slices. Beyond 4–5 slices, group the smallest
                  values into &quot;Other&quot; or switch to a bar chart ranked by value.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Dual Y-axes implying correlation</span>
                <span>
                  Plotting two unrelated datasets on dual Y-axes can make them appear
                  correlated by adjusting the scale of each axis. A famous example: a
                  line showing ice cream sales and a line showing drowning deaths tracked
                  on separate scales — both peak in summer, but one doesn&apos;t cause the other.
                  Dual-axis charts are legitimate when the relationship is real and explained.
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
              Related data tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "CSV to JSON Converter", path: "/tools/csv-json-converter" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                  { name: "SQL Formatter", path: "/tools/sql-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Footer Summary ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools Online Chart Maker</strong> is a 100% private, client‑side data
            visualization utility that transforms <strong>CSV</strong> and <strong>JSON</strong> data into
            bar, line, pie, and five other chart types in your browser. No server uploads, no sign‑up, and no
            file size limits , your data stays on your device. In 2026, it remains one of the fastest free
            ways to create publication‑ready charts for business, education, and personal projects, all with
            a single click.
          </p>
        </footer>
      </div>
    </>
  )
}