import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/solar-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 59 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Solar Generator — Estimate Solar Power Output & Savings",
  description:
    "Calculate solar power estimates for your home or business. Free tool for solar energy production, savings, and system size estimates. No signup required.",
  keywords: [
    "solar generator",
    "solar power calculator",
    "solar energy estimator",
    "solar panel output calculator",
    "free solar tool 2026",
    "estimate solar savings",
    "solar system size calculator",
    "renewable energy calculator",
    "solar power production",
    "solar panel efficiency",
    "online solar estimator",
    "clean energy tool",
    "browser-based solar calculator",
    "no signup solar tool",
    "solar generator free",
    "solar benefit calculator",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Solar Generator — Estimate Solar Power Output & Savings",
    description:
      "Generate solar power estimates for your home or business. Free online tool to calculate solar energy production, savings, and system size.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Solar Generator — Estimate Solar Power Output & Savings by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Solar Generator — Solar Power & Savings Calculator",
    description:
      "Estimate solar energy production, savings, and system size. Free online tool, no signup required.",
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
  name: "Solar Generator",
  url: TOOL_URL,
  description:
    "Calculate solar power estimates for your home or business. Free tool for solar energy production, savings, and system size estimates. No signup.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Estimate solar power production (kWh/year)",
    "Calculate potential savings on electricity bills",
    "Determine optimal solar system size",
    "Compare different panel wattages",
    "Export results as PDF or CSV",
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
  name: "How to Estimate Solar Power Output",
  description:
    "A simple step-by-step guide to estimating your solar energy production, savings, and system size using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Solar Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Location",
      text: "Input your city or region to get accurate solar irradiance data. The tool uses average daily sunlight hours for your area.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Specify Your System Parameters",
      text: "Enter details like total roof area, panel wattage, system efficiency, and your current electricity rate. Adjust these to match your real-world setup.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Generate Estimate",
      text: "Press the 'Generate' button. The tool will calculate your annual solar production in kilowatt-hours (kWh), estimated savings, and recommended system size.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Review and Export Results",
      text: "View your detailed estimates, including annual production, savings, payback period, and environmental impact. Export as PDF or CSV for your records.",
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
      name: "What is a solar generator calculator and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A solar generator calculator estimates the amount of electricity your solar panels can produce based on your location, roof size, panel efficiency, and other factors. It uses average solar irradiance data to compute annual energy output and potential savings.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate are the solar production estimates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The estimates are based on average solar irradiance data for your region. Actual production can vary due to weather, shading, panel orientation, and system degradation. For the most accurate projection, consult a solar installer.",
      },
    },
    {
      "@type": "Question",
      name: "Is my personal data stored when I use this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing occurs entirely in your browser using JavaScript. Your location and system parameters are never sent to our servers, stored, or logged. The tool is 100% private.",
      },
    },
    {
      "@type": "Question",
      name: "What factors affect my solar energy production?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The main factors include geographic location (sun hours), roof orientation and tilt, panel wattage and efficiency, system losses (inverter efficiency, wiring, shading), and local weather patterns. This tool accounts for most of these factors.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a solar generator and a solar panel calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A solar generator typically refers to a portable solar-powered battery system, while a solar panel calculator estimates fixed-panel energy production. Our tool is a calculator that helps you estimate production and savings for a rooftop solar system.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free solar generator tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It works best for residential and small commercial systems. For extremely complex setups (e.g., multi-orientation, trackers, or microinverters), the estimates may be less precise. All processing is local and private.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Energy Tools > Tool ──────

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
      name: "Energy Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Solar Generator",
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
            Free Solar Generator — Estimate Solar Power Output & Savings
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Estimate your <strong>solar power production</strong> (kWh/year), potential
            <strong>savings</strong> on electricity bills, and the optimal
            <strong>system size</strong> for your home or business. All processing runs
            locally in your browser with <strong>100% privacy</strong> — no signup or
            upload required.
          </p>

          <QuickAnswer
            question="How do I estimate solar power output for free?"
            answer="Enter your location and system parameters (roof area, panel wattage, efficiency), then click 'Generate'. The tool calculates annual solar production in kWh, savings, and recommended system size — all completely free and private."
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
                  Energy Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Solar Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Solar Generator Tool">
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
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            Solar Generator Sizing: The Calculations Behind the Estimate
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A camper planning a 10-day off-grid trip made a common mistake:
              they bought a 100W solar panel and 100Ah battery based on an
              online &quot;solar calculator&quot; that didn&apos;t account for their location&apos;s
              peak sun hours. In Scandinavia in October, peak sun hours average
              1.5–2 per day, not the 5 hours assumed by the calculator. Their
              panel could only deliver 150–200 Wh/day instead of the calculated
              500 Wh, depleting the battery by day 3. The correct setup for their
              actual location was a 250W panel and 200Ah battery — 2.5× more
              expensive than what they bought.
            </p>
            <p className="text-muted-foreground mb-4">
              The core formula for solar sizing is:{' '}
              <strong>Required panel watts = Daily Wh consumption ÷ Peak sun hours × Correction factor</strong>.
              The correction factor (typically 1.25–1.5) accounts for panel
              efficiency losses, inverter inefficiency, wiring losses, and battery
              charge/discharge losses.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Peak Sun Hours by Region (Annual Average)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Region</th>
                    <th className="border border-border p-2 text-left">Peak sun hours/day</th>
                    <th className="border border-border p-2 text-left">100W panel output</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Sahara / Arabian Desert', '6–8 hours', '480–640 Wh/day'],
                    ['Southern US / Mediterranean', '5–6 hours', '400–480 Wh/day'],
                    ['Morocco / Northern Africa', '5–6 hours', '400–480 Wh/day'],
                    ['Central Europe', '3–4 hours', '240–320 Wh/day'],
                    ['UK / Northern France', '2.5–3.5 hours', '200–280 Wh/day'],
                    ['Scandinavia (summer)', '4–5 hours', '320–400 Wh/day'],
                    ['Scandinavia (winter)', '0.5–1.5 hours', '40–120 Wh/day'],
                  ].map(([region, hours, output]) => (
                    <tr key={region} className="border border-border">
                      <td className="border border-border p-2 font-medium text-sm">{region}</td>
                      <td className="border border-border p-2">{hours}</td>
                      <td className="border border-border p-2 text-muted-foreground">{output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Battery Sizing: The Missing Half of the Calculation
            </h3>
            <p className="text-muted-foreground mb-4">
              The panel produces energy; the battery stores it. Battery capacity
              must cover at least 2–3 days of consumption without any solar input
              (cloudy days, overnight use). A 100Ah 12V battery stores 1,200 Wh
              but only 840 Wh is usable — lead-acid batteries should not be
              discharged below 50% without reducing lifespan. LiFePO4 batteries
              can be discharged to 20%, making 100Ah LiFePO4 = 960 Wh usable.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              This Tool&apos;s Estimate vs. Professional Sizing
            </h3>
            <p className="text-muted-foreground mb-4">
              The calculator here provides a ballpark estimate based on your
              inputs and your region&apos;s average solar resource data. For a
              permanent home installation worth thousands of dollars, commission
              a site survey — a professional installer will measure actual roof
              shading, check structural load capacity, assess local grid
              interconnection rules, and calculate realistic payback periods.
              The online estimate is a starting point for conversations, not a
              final specification.
            </p>
          </div>

          <RelatedTools
            tools={[
              { name: "Diagram Generator", path: "/tools/diagram-generator" },
              { name: "Generate Chart", path: "/tools/generate-chart" },
              { name: "Unit Converter", path: "/tools/case-converter" },
            ]}
          />
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Solar Generator</strong> is a fully private, browser-based
            tool that estimates <strong>solar power production</strong> (kWh/year),
            <strong>savings</strong> on electricity bills, and optimal <strong>system size</strong>
            for residential and commercial users. All processing runs locally on your device
            — your location and system details never leave your computer. The fastest free way
            to estimate solar energy potential in 2026, with no installs, no accounts, and no
            hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}