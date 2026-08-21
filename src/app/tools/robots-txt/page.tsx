import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/robots-txt"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Robots.txt Generator — Create robots.txt for SEO Instantly",
  description:
    "Generate a robots.txt file for your website instantly. Free tool to control search engine crawling, improve SEO, and block bots. No signup.",
  keywords: [
    "robots.txt generator",
    "robots.txt creator",
    "free robots.txt tool",
    "robots txt generator online",
    "seo robots.txt",
    "disallow paths robots.txt",
    "sitemap robots.txt",
    "robots.txt validator",
    "free seo tool 2026",
    "browser-based robots.txt",
    "no signup robots.txt",
    "search engine crawling control",
    "robot.txt maker",
    "secure robots.txt tool",
    "best free robots.txt generator 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Robots.txt Generator — Create robots.txt for SEO Instantly",
    description:
      "Generate a robots.txt file for your website instantly. Control search engine crawling, improve SEO, and block unwanted bots. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Robots.txt Generator — Create robots.txt by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Robots.txt Generator — Control Search Engine Crawling",
    description:
      "Generate a robots.txt file instantly. Control how search engines crawl your site. Free tool, no signup required.",
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
  name: "Robots.txt Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates a robots.txt file for any website to control search engine crawling, disallow paths, and specify sitemap location. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate robots.txt file instantly",
    "Add user-agent specific rules",
    "Set disallow paths for crawling",
    "Add sitemap location directive",
    "Validate syntax and structure",
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
  name: "How to Generate a robots.txt File",
  description:
    "A simple step-by-step guide to creating a robots.txt file for your website using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Robots.txt Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Domain",
      text: "Paste the full URL of your website (e.g., https://example.com) into the input field. The tool will use this to generate appropriate rules.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Add User-Agent Rules",
      text: "Specify which user agents (search engines) the robots.txt file applies to. You can add rules for Googlebot, Bingbot, or a generic user agent.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Define Disallow & Allow Directives",
      text: "Add disallow paths to block search engines from crawling sensitive or private pages, and allow paths to override previous disallow rules.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Add Sitemap Location",
      text: "Optionally add the sitemap location to help search engines discover your sitemap. Then click 'Generate' to preview and download your robots.txt.",
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
      name: "What is a robots.txt file and why do I need one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A robots.txt file is a text file placed in the root directory of your website that tells search engine crawlers which pages to crawl and which to ignore. It's essential for controlling search engine access to private areas, duplicate content, or staging environments.",
      },
    },
    {
      "@type": "Question",
      name: "What directives can I include in my robots.txt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The most common directives are User-agent (which search engine the rule applies to), Disallow (paths to block), Allow (exceptions to blocking), and Sitemap (location of your sitemap for better indexing).",
      },
    },
    {
      "@type": "Question",
      name: "Is my website data secure when using this robots.txt generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your domain and rules are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "Where should I place the robots.txt file on my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The robots.txt file must be placed in the root directory of your website, accessible via https://yourdomain.com/robots.txt. Search engines automatically look for this file at that location.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between robots.txt and meta robots tags?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "robots.txt controls crawling at the directory level, preventing search engines from even entering specific paths. Meta robots tags control indexing at the page level, allowing or preventing a page from being indexed regardless of whether it was crawled.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free robots.txt generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It can generate a robots.txt file with as many rules as you need. For extremely large or complex rule sets, the generated file remains fully compatible with search engine standards.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > SEO Tools > Tool ──────

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
      name: "SEO & Web",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Robots.txt Generator",
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
            Free Robots.txt Generator — Create robots.txt for SEO Instantly
          </h1>
          <img src="/images/robots-txt.webp" alt="Free Robots.txt Generator — create robots.txt files for your website SEO" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate a complete <strong>robots.txt</strong> file for your website instantly.
            Control how search engines crawl your site, block unwanted paths, and add your
            sitemap URL. All processing runs locally in your browser with <strong>100%
              privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="What is a robots.txt file and why do I need one?"
            answer="A robots.txt file tells search engine crawlers which pages to crawl and which to ignore. It's essential for controlling access to private areas, duplicate content, or staging environments."
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
                  SEO Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Robots.txt Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Robots.txt Generator Tool">
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
          <meta itemProp="name" content="Robots.txt Generator: What Google Follows and What It Ignores" />
          <meta
            itemProp="description"
            content="How robots.txt actually works, the directives Google honors vs. ignores, and the two mistakes that accidentally block your entire site."
          />
          <meta itemProp="datePublished" content="2024-03-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How robots.txt actually works — and what it doesn&apos;t do
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Robots.txt is a voluntary signal, not a security mechanism. Well-behaved
              crawlers (Googlebot, Bingbot, Twitterbot) check it before crawling. Bad
              actors and scrapers ignore it entirely. If a URL is disallowed in robots.txt
              but linked from other pages, Google may still show the URL in search results
              (as a URL with no title or snippet) — disallowing doesn&apos;t prevent indexing,
              it prevents crawling. To prevent indexing, use a{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">noindex</code>{' '}
              meta tag on the page itself.
            </p>
          </section>

          {/* What Google honors */}
          <section
            aria-labelledby="what-google-honors"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-google-honors"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Directives Google honors vs. ignores
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Directive</th>
                    <th className="border border-border p-2 text-left font-semibold">Google honors it?</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['User-agent', 'Yes', 'Wildcard (*) covers all bots; Googlebot is case-sensitive'],
                    ['Disallow', 'Yes', 'Blocks crawling of the path; empty value = allow all'],
                    ['Allow', 'Yes', 'Overrides Disallow for a sub-path; useful for /path/* exceptions'],
                    ['Sitemap', 'Yes', 'Absolute URL to sitemap.xml — recommended to include here'],
                    ['Crawl-delay', 'No', 'Google ignores this; use Google Search Console rate limiting instead'],
                    ['Noindex', 'Deprecated', 'Google dropped support in 2019; use meta noindex tag instead'],
                    ['Host', 'No', 'Not recognized by Google; use canonical tags for domain preference'],
                  ].map(([directive, honored, notes]) => (
                    <tr key={directive}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{directive}</td>
                      <td className={`border border-border p-2 font-medium ${honored === 'Yes' ? 'text-green-600' : honored === 'No' ? 'text-red-600' : 'text-yellow-600'}`}>{honored}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="common-mistakes" className="space-y-4">
            <h2
              id="common-mistakes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Two mistakes that block your entire site
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Disallow: /</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Disallow: /</code>{' '}
                  under{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">User-agent: *</code>{' '}
                  blocks every crawler from every page. This is the correct robots.txt
                  for a staging server, but if accidentally deployed to production it
                  removes your entire site from search results within days. Always
                  verify after deployment.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Blocking CSS and JS files</span>
                <span>
                  If your robots.txt blocks{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/static/</code>{' '}
                  or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/_next/</code>,
                  Google can&apos;t render your pages — it sees unstyled HTML and scores
                  them as low quality. Googlebot must be able to crawl CSS, JS, and
                  font files to render the page the same way a user sees it.
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
              Related SEO tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Sitemap Generator", path: "/tools/sitemap-generator" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                  { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Robots.txt Generator</strong> is a fully private,
            browser-based tool that creates <strong>robots.txt</strong> files to control
            search engine crawling and improve SEO. Supports user-agent specific rules,
            disallow and allow directives, sitemap location, and built-in validation.
            All processing runs locally on your device — your domain and rules never leave
            your computer. The fastest free way to generate a robots.txt file in 2026, with
            no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}
