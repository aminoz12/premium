import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ClientPage from "./client-page"
import type { Metadata } from "next"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/ai-agent-builder`

// ─── FAQ Items ────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: "What is the AI Page Builder Agent?",
    a: "The AI Page Builder Agent is an advanced browser-based tool that transforms plain-text descriptions into complete, professional HTML pages. It generates landing pages, portfolios, dashboards, SaaS pages, e-commerce pages, and more — with live preview, code export, and optional 3D (Three.js), charting (Chart.js), and animation (GSAP, AOS) libraries built in.",
  },
  {
    q: "What types of pages can I build?",
    a: "You can generate landing pages, developer portfolios, analytics dashboards, SaaS marketing pages, blog/editorial pages, e-commerce storefronts, immersive 3D pages using Three.js, data visualization dashboards using Chart.js, and richly animated pages using GSAP and AOS scroll effects. Simply select the template type and describe what you need.",
  },
  {
    q: "What CSS frameworks and libraries are supported?",
    a: "The builder supports three CSS frameworks: Tailwind CSS (CDN), vanilla hand-crafted CSS, and Bootstrap 5. For JavaScript libraries, you can optionally enable Three.js r128 for 3D scenes, Chart.js for data charts, GSAP 3 for animations, and AOS for scroll-triggered reveal effects. The AI integrates all chosen libraries into the generated page automatically.",
  },
  {
    q: "Can I preview and download the generated page?",
    a: "Yes. Every generated page renders instantly in a live sandboxed preview iframe. You can switch to the Code tab to view the raw HTML source, copy it to your clipboard with one click, or download it as a standalone .html file that you can open in any browser or deploy to any web host.",
  },
  {
    q: "How does the AI optimize my prompt?",
    a: "The builder automatically enhances your description with professional front-end engineering guidelines: it adds structure requirements (semantic HTML5, ARIA accessibility), visual style directives (typography, color palette, motion design), library integration instructions, and strict security requirements (CSP headers, no eval(), sandboxed code). You get expert-level output even from a simple one-sentence prompt.",
  },
  {
    q: "Is the generated code secure?",
    a: "Yes. Every generated page includes a Content-Security-Policy meta tag, avoids eval() and new Function(), uses addEventListener instead of inline event handlers, loads all external resources over HTTPS from trusted CDNs, and sanitizes dynamic content. The preview iframe runs in sandbox mode for additional isolation.",
  },
  {
    q: "Do I need an account, API key, or credit card?",
    a: "No. The tool is completely free to use with no registration, login, or payment required. An intelligent rate limit (10 generations per hour) ensures fair access for all users. Your prompts and generated pages are never permanently stored on our servers.",
  },
  {
    q: "Can I regenerate or refine a page?",
    a: "Yes. Your last 10 generations are saved in the History tab during your session. Click any history entry to reload that page's HTML, prompt, template, and style settings, then modify the prompt and generate a new version. You can also click 'New' to start fresh at any time.",
  },
  {
    q: "What visual styles are available?",
    a: "Six curated design systems are available: Modern Dark (dark background, neon accents, glassmorphism cards), Clean Light (white professional layout), Glassmorphism (frosted glass on gradient backgrounds), Minimal (editorial whitespace-first), Brutalist (bold borders and raw typography), and Luxury (deep dark with gold serif accents). Each style applies a complete design language to the generated page.",
  },
  {
    q: "Can I use the generated pages commercially?",
    a: "The HTML code generated is yours to use freely, including for commercial projects. The pages use open-source libraries (Tailwind CSS, Bootstrap, Three.js, Chart.js, GSAP, AOS) distributed under their respective licenses. Review each library's license before commercial use, especially GSAP which has specific commercial licensing terms.",
  },
]

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  ...buildToolMetadata("ai-page-builder"),
  title: "Free AI Page Builder Agent — Generate Landing Pages, Portfolios & Dashboards",
  description:
    "Build any web page with AI in seconds. Generate landing pages, portfolios, dashboards, SaaS pages — live preview, viewport testing (mobile/tablet/desktop), HTML export, Three.js, GSAP. Free, no account.",
  keywords: [
    "ai page builder free",
    "ai agent builder online",
    "free ai agent builder no login",
    "build ai agent no code",
    "ai landing page generator",
    "ai portfolio generator online",
    "ai dashboard builder no code",
    "html page generator ai 2026",
    "generate landing page from description",
    "three.js page generator ai",
    "chart.js dashboard generator",
    "gsap animation page builder",
    "tailwind css page generator ai",
    "saas landing page ai builder",
    "ecommerce page generator free",
    "ai website builder no login",
    "professional landing page generator",
    "html export ai page creator",
    "no code ai web builder",
    "ai frontend code generator",
    "live preview html builder",
    "free ai portfolio website creator",
    "animated website builder ai",
    "ai web page generator from text",
    "create website with ai free",
    "ai html generator 2026",
    "no code landing page builder ai",
    "ai page builder chatgpt style",
    "responsive web page generator ai",
    "ai website creator free no signup",
    "build web pages with artificial intelligence",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free AI Page Builder — Landing Pages, Portfolios & Dashboards in Seconds",
    description:
      "Describe your page and watch AI build it live. Landing pages, portfolios, dashboards, 3D scenes with Three.js, charts with Chart.js, GSAP animations — export clean HTML instantly.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "AI Page Builder — Generate professional web pages from text descriptions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Page Builder — Generate Pro Pages from Text, Instantly Free",
    description:
      "Type a description, get a complete professional HTML page. Three.js 3D, Chart.js charts, GSAP animations, Tailwind CSS. Live preview + one-click download.",
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

// ─── Structured Data ──────────────────────────────────────────────────────────
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Page Builder Agent",
  url: TOOL_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 90+, Firefox 88+, Safari 14+, Edge 90+",
  description:
    "A free browser-based AI agent that generates complete, professional HTML pages from text descriptions. Supports landing pages, portfolios, dashboards, SaaS pages, 3D pages (Three.js), data dashboards (Chart.js), and animated pages (GSAP, AOS). Includes live preview, code copy, and HTML download.",
  featureList: [
    "9 professional page templates: landing, portfolio, dashboard, SaaS, blog, e-commerce, 3D, charts, animated",
    "6 design style systems: Modern Dark, Clean Light, Glassmorphism, Minimal, Brutalist, Luxury",
    "3 CSS framework options: Tailwind CSS, Vanilla CSS, Bootstrap 5",
    "Three.js r128 integration for interactive 3D particle and geometry scenes",
    "Chart.js integration for beautiful data visualization dashboards",
    "GSAP 3 animation integration for smooth entrance and scroll animations",
    "AOS (Animate On Scroll) integration for scroll-triggered reveal effects",
    "Live sandboxed iframe preview of generated pages",
    "One-click HTML code copy with clipboard API",
    "Single-file HTML download for immediate deployment",
    "Session history with last 10 generations for comparison and refinement",
    "AI prompt optimization — enhances basic descriptions into detailed engineering specs",
    "Security-first output: CSP headers, no eval(), sandboxed preview, HTTPS CDNs only",
    "Rate-limited free access — no account, API key, or payment required",
    "Mobile-responsive generated pages with proper breakpoints",
    "Accessibility-compliant output with semantic HTML5, ARIA attributes, and proper heading hierarchy",
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
  name: "How to Generate a Professional Web Page with AI",
  description: "Step-by-step guide to building a complete professional HTML page using the AI Page Builder Agent",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select a page template",
      text: "Choose from 9 templates: Landing Page, Portfolio, Dashboard, SaaS, Blog, E-Commerce, 3D, Charts, or Animated. The template sets the AI's structural focus and example content.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Describe your page",
      text: "Type a detailed description of what you want. Include your product or service name, color preferences, key sections, tone, and any specific features. The more detail you provide, the more tailored the result.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Choose your visual style and framework",
      text: "Select a design style (Modern Dark, Glassmorphism, Luxury, etc.) and a CSS framework (Tailwind, Vanilla CSS, Bootstrap 5). Optionally enable advanced libraries like Three.js for 3D, Chart.js for charts, or GSAP for animations.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Generate and preview",
      text: "Click Build Page. The AI generates a complete self-contained HTML file in seconds. The page renders immediately in the live Preview tab so you can see exactly how it looks.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Copy or download your page",
      text: "Switch to the Code tab to inspect the raw HTML source, use the Copy button to copy it to your clipboard, or click Download to save the .html file. Open it in any browser or deploy it to any web host.",
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

// ─── Page Component ───────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ToolLayout
        title="AI Page Builder Agent"
        description="Generate professional landing pages, portfolios, dashboards, and more from a text description. Live preview, HTML export, and optional Three.js 3D, Chart.js, and GSAP animations — free, no account needed."
        toolId="ai-agent-builder"
      >
        <QuickAnswer
          question="How do I generate a landing page with AI in seconds?"
          answer="Type a plain-text description of the page you want (e.g., 'A SaaS landing page for a project management tool, dark theme, hero with CTA button, features grid, pricing table'), select a CSS framework (Tailwind, Bootstrap, or Vanilla CSS), optionally enable Three.js 3D or GSAP animations, then click Generate. The AI returns a complete, deployable HTML file with live preview — download it or copy the source code directly."
        />
        <ClientPage />
        <article className="prose prose-sm max-w-none space-y-10">

          {/* ── What is it ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">What is the AI Page Builder Agent?</h2>
            <p className="text-muted-foreground leading-relaxed">
              The AI Page Builder Agent is a free, browser-based tool that converts plain-text descriptions into
              complete, production-ready HTML web pages in seconds. Unlike generic website builders, this agent
              generates fully custom code tailored precisely to your description — with real sections, realistic
              content, professional typography, and the visual style you choose.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you need a dark-themed SaaS landing page with a Three.js particle background, a luxury
              portfolio with gold serif typography, or a financial analytics dashboard with Chart.js visualizations,
              simply describe it and the AI builds it for you. Every generated page is a single, self-contained HTML
              file you can preview live, copy, and deploy anywhere.
            </p>
          </section>

          {/* ── How it works ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "Pick a template",
                  desc: "Select from 9 page types — the template focuses the AI on the right structural pattern for your use case.",
                },
                {
                  step: "02",
                  title: "Describe your page",
                  desc: "Write a natural-language description. Include your brand, sections, tone, and any features. More detail = better output.",
                },
                {
                  step: "03",
                  title: "Choose style & libraries",
                  desc: "Pick a design system (Modern Dark, Glassmorphism, Luxury, etc.) and optionally add Three.js, Chart.js, or GSAP.",
                },
                {
                  step: "04",
                  title: "AI builds your page",
                  desc: "The AI expands your description into a detailed engineering specification and generates complete, secure HTML.",
                },
                {
                  step: "05",
                  title: "Preview live",
                  desc: "Your page renders instantly in a sandboxed iframe preview. Inspect it, scroll through, and interact with all elements.",
                },
                {
                  step: "06",
                  title: "Export & deploy",
                  desc: "Copy the HTML to your clipboard or download the .html file. Open in a browser or push to any web host immediately.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-lg border p-4 space-y-2">
                  <div className="text-2xl font-bold text-primary/30">{item.step}</div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Page types ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Page Types & Templates</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Landing Page",
                  desc: "Hero section, feature grid, social proof, pricing table, and CTA footer. Ideal for product launches, startups, and marketing campaigns. Generates compelling copy, animated headlines, and conversion-optimized layouts.",
                },
                {
                  title: "Portfolio",
                  desc: "Project gallery, skills showcase, work experience timeline, and contact form. Designed for designers, developers, and creatives. Includes filterable project grids and smooth hover transitions.",
                },
                {
                  title: "Dashboard",
                  desc: "Sidebar navigation, metric cards, data tables, and chart sections. Perfect for admin panels and analytics UIs. Integrates Chart.js charts with realistic data visualizations.",
                },
                {
                  title: "SaaS Page",
                  desc: "Feature comparison, testimonials carousel, pricing toggle (monthly/annual), FAQ accordion, and integration logos. Optimized for software product marketing with trust-building social proof sections.",
                },
                {
                  title: "Blog / Article",
                  desc: "Featured post hero, category navigation, article card grid, author bio, and newsletter signup. Typography-first layout with reading-optimized line lengths and spacing.",
                },
                {
                  title: "E-Commerce",
                  desc: "Product grid, category filters, promotional banners, cart sidebar, and footer with trust badges. Generates realistic product names, prices, and descriptions for immediate visual evaluation.",
                },
                {
                  title: "3D / Three.js",
                  desc: "Immersive pages with interactive Three.js scenes — particle systems, floating geometry, animated backgrounds, and mouse-responsive 3D elements. The 3D scene is mouse-interactive and performance-optimized.",
                },
                {
                  title: "Data Charts",
                  desc: "Chart.js-powered dashboards with line charts for trends, bar charts for comparisons, doughnut charts for distributions, and scatter plots for correlations. Data and colors are themed to match the page style.",
                },
                {
                  title: "Animated",
                  desc: "Pages with GSAP-orchestrated entrance animations, staggered element reveals, scroll-triggered AOS effects, parallax sections, animated text, and micro-interactions on every interactive element.",
                },
              ].map((item) => (
                <article key={item.title} className="rounded-lg border p-4 space-y-2">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Library guide ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Advanced Libraries Guide</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <article className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold text-sm">Three.js — Interactive 3D Scenes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When enabled, the AI creates a fully interactive Three.js r128 scene embedded in your page.
                  Common outputs include particle constellations that respond to mouse movement, rotating 3D geometry
                  in the hero section, animated 3D text, and abstract background scenes. The renderer is performance-optimized
                  with requestAnimationFrame and proper scene disposal.
                </p>
              </article>
              <article className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold text-sm">Chart.js — Data Visualizations</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Chart.js integration generates 2–3 thematic charts with realistic mock data. Line charts for trend analysis,
                  bar charts for comparisons, doughnut/pie charts for distributions, and radar charts for multi-dimensional data.
                  Colors are automatically matched to the page's design style and theme.
                </p>
              </article>
              <article className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold text-sm">GSAP 3 — Professional Animations</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  GSAP (GreenSock Animation Platform) adds cinema-quality animations: staggered entrance sequences on page load,
                  smooth element transitions, timeline-orchestrated reveals, and hover micro-interactions. The AI uses
                  gsap.from(), gsap.timeline(), and stagger parameters to create polished animation choreography.
                </p>
              </article>
              <article className="rounded-lg border p-4 space-y-2">
                <h3 className="font-semibold text-sm">AOS — Scroll-Triggered Effects</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AOS (Animate On Scroll) adds scroll-triggered animations to each page section. As users scroll down,
                  elements fade in, slide up, zoom in, or flip into view. The AI adds appropriate data-aos attributes to
                  every major content block and initializes AOS with optimized settings for smooth performance.
                </p>
              </article>
            </div>
          </section>

          {/* ── Security ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Security Architecture</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every generated page is built with security as a first-class concern. The AI is instructed to follow strict
              security guidelines on every generation:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "CSP Headers", desc: "Content-Security-Policy meta tag restricts resource loading to trusted origins only." },
                { title: "No eval() / Function()", desc: "Zero use of dynamic code execution APIs that enable code injection attacks." },
                { title: "Sandboxed Preview", desc: "The preview iframe uses the sandbox attribute to isolate generated code from the parent page." },
                { title: "HTTPS CDNs only", desc: "All external libraries loaded exclusively over HTTPS from cdnjs, jsDelivr, and unpkg." },
                { title: "Event listeners only", desc: "All interactivity uses addEventListener — no unsafe inline event handlers (onclick='...')." },
                { title: "No data storage", desc: "Generated pages never phone home, log keystrokes, or store user data." },
              ].map((item) => (
                <div key={item.title} className="rounded-md border p-3 space-y-1">
                  <h3 className="font-semibold text-xs">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <dl className="space-y-4 text-sm">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="rounded-md border p-4">
                  <dt className="font-semibold mb-1">{item.q}</dt>
                  <dd className="text-muted-foreground leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Prompt tips ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Writing Effective Prompts</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold text-sm text-green-700">✓ Effective prompt example</h3>
                <p className="text-xs bg-green-50 text-green-900 p-3 rounded border border-green-200 font-mono leading-relaxed">
                  "Dark SaaS landing page for 'Veloxi' — an AI-powered code review tool. Include: sticky nav with logo and CTA button, hero with animated gradient headline and code snippet mockup, 3-column features grid, animated stats bar (10k+ users, 99.9% uptime, 2x faster reviews), pricing cards (Free/Pro/Enterprise), customer logos strip, and email signup footer. Use indigo/cyan accent palette."
                </p>
              </div>
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold text-sm text-red-700">✗ Vague prompt (less effective)</h3>
                <p className="text-xs bg-red-50 text-red-900 p-3 rounded border border-red-200 font-mono leading-relaxed">
                  "Make a nice website for my tool."
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Include: product/company name, target audience, key sections, visual style preferences, color palette,
                  specific features or interactions, and the tone (professional, playful, luxury, technical, etc.).
                </p>
              </div>
            </div>
          </section>

          {/* ── Related tools ── */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Related AI Tools</h2>
            <RelatedTools tools={[
              { name: "AI Prompt Generator", path: "/tools/ai-prompt-generator" },
              { name: "Free AI Image Generator", path: "/tools/free-ai-image-generator" },
              { name: "AI Code Assistant", path: "/tools/ai-code-assistant" },
              { name: "AI Logo Generator", path: "/tools/ai-logo-generator" },
              { name: "AI Color Palette Generator", path: "/tools/ai-color-palette-generator" },
            ]} />
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>TheFreeAITools — AI Page Builder Agent</strong> is a free browser-based tool that generates
            complete, professional HTML web pages from text descriptions. Build{" "}
            <strong>landing pages, portfolios, dashboards, SaaS pages, e-commerce storefronts</strong>, and more  ,
            with optional <strong>Three.js 3D scenes, Chart.js data visualizations, GSAP animations</strong>, and
            AOS scroll effects. Live preview, one-click HTML export. No account, no API key, no installation required.
            All generated pages follow security best practices with CSP headers, no eval(), and sandboxed execution.
          </p>
          <p>
            Searches related to this tool:{" "}
            <em>
              ai landing page generator free, ai portfolio builder no code, html page generator from description,
              three.js page builder ai, chart.js dashboard generator, gsap animation website builder,
              tailwind css ai generator, professional landing page creator ai, saas page builder ai 2026,
              free html code generator ai, no login website builder ai, ai frontend developer tool.
            </em>
          </p>
        </footer>
      </ToolLayout>
    </>
  )
}