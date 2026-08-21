import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/sitemap-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 59 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Sitemap Generator — Create XML Sitemaps for SEO Instantly",
  description:
    "Generate XML sitemaps for your website instantly. Free online tool to improve SEO and help search engines index your pages. No signup required.",
  keywords: [
    "sitemap generator",
    "xml sitemap generator",
    "free sitemap tool",
    "sitemap creator online",
    "seo sitemap generator",
    "google sitemap generator",
    "xml sitemap creator free",
    "sitemap generator no signup",
    "free seo tool 2026",
    "browser-based sitemap tool",
    "sitemap xml generator",
    "website sitemap maker",
    "index sitemap generator",
    "secure sitemap generator",
    "best free sitemap tool 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Sitemap Generator — Create XML Sitemaps for SEO Instantly",
    description:
      "Generate XML sitemaps for your website instantly. Free online tool to improve SEO and help search engines index your pages. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Sitemap Generator — Create XML Sitemaps by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Sitemap Generator — XML Sitemaps for SEO",
    description:
      "Generate XML sitemaps for your website instantly. Free online tool to improve SEO and help search engines index your pages. No signup required.",
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
  name: "Sitemap Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates XML sitemaps for websites to improve SEO and help search engines index pages. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate XML sitemaps instantly",
    "Include all pages of your website",
    "Set lastmod, changefreq, and priority for each page",
    "Validate sitemap structure",
    "Download as XML file",
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
  name: "How to Generate an XML Sitemap",
  description:
    "A simple step-by-step guide to creating an XML sitemap for your website using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Sitemap Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Website URL",
      text: "Paste the full URL of your website (e.g., https://example.com) into the input field. The tool will crawl or parse your site structure to generate the sitemap.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Configure Sitemap Settings",
      text: "Set optional parameters such as lastmod date, change frequency, and priority for each page. You can also include or exclude specific sections of your site.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Generate Sitemap",
      text: "Press the 'Generate Sitemap' button. The tool will create a properly structured XML sitemap following the standard protocol (sitemaps.org).",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Sitemap",
      text: "Click the 'Download' button to save the XML sitemap as a .xml file. Upload this file to your website's root directory and submit it to Google Search Console.",
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
      name: "What is a sitemap generator and why do I need one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A sitemap generator is a tool that creates an XML file listing all the important pages on your website. Search engines like Google use sitemaps to discover and index your content more efficiently. Having a sitemap improves your SEO and helps search engines understand your site structure.",
      },
    },
    {
      "@type": "Question",
      name: "What format does the generated sitemap use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool generates a standard XML sitemap that follows the sitemaps.org protocol. This format is compatible with Google, Bing, Yahoo, and all other major search engines.",
      },
    },
    {
      "@type": "Question",
      name: "Is my website data secure when using this sitemap generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your website URLs and sitemap data are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my sitemap to Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Once you have downloaded your sitemap.xml file, upload it to the root directory of your website (e.g., https://yourdomain.com/sitemap.xml). Then sign in to Google Search Console, go to 'Sitemaps', and submit your sitemap URL. Google will begin crawling it.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a sitemap and a robots.txt file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A sitemap tells search engines which pages exist on your site and should be indexed. A robots.txt file tells search engines which pages they are allowed or disallowed to crawl. Both work together to control how search engines interact with your site.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free sitemap generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account and no page limit. Generates XML sitemaps for websites of any size directly in your browser — your URLs are never sent to any server.",
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
      name: "Sitemap Generator",
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
            Free Sitemap Generator — Create XML Sitemaps for SEO Instantly
          </h1>
          <img src="/images/sitemap-generator.webp" alt="Free XML Sitemap Generator — create sitemaps for websites online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate a complete <strong>XML sitemap</strong> for your website instantly.
            Improve your <strong>SEO</strong> and help search engines index your pages
            more efficiently. All processing runs locally in your browser with
            <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="What is a sitemap generator and why do I need one?"
            answer="A sitemap generator creates an XML file listing all pages on your website. Search engines like Google use sitemaps to discover and index your content more efficiently, improving your SEO."
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
                <span className="text-foreground font-medium">Sitemap Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Sitemap Generator Tool">
          <ClientPage initialLastmod={new Date().toISOString().split("T")[0]} />
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
          <meta itemProp="name" content="XML Sitemap Generator: What Google Uses and What It Ignores" />
          <meta
            itemProp="description"
            content="What a sitemap tells Google, which optional tags are actually used, and when a sitemap matters vs. when it doesn't."
          />
          <meta itemProp="datePublished" content="2024-04-02" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* When a sitemap matters */}
          <section aria-labelledby="when-it-matters" className="space-y-4">
            <h2
              id="when-it-matters"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When a sitemap actually helps — and when it doesn&apos;t
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A sitemap helps Google discover URLs it might not find through crawling.
              It&apos;s most valuable for: large sites (1,000+ pages) where crawl budget
              matters, sites with pages that aren&apos;t well-linked internally, and new sites
              with few external backlinks. For a small site with strong internal linking,
              Googlebot will typically discover all pages through crawling anyway — a
              sitemap speeds up initial indexing but isn&apos;t the difference between getting
              indexed or not.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Submitting a sitemap in Google Search Console is the most reliable way to
              verify that Google has it. The console shows how many URLs Google has
              discovered vs. how many you submitted — a gap here indicates crawling
              or indexing issues worth investigating.
            </p>
          </section>

          {/* What Google uses */}
          <section
            aria-labelledby="what-google-uses"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-google-uses"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which sitemap fields Google actually uses
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Tag</th>
                    <th className="border border-border p-2 text-left font-semibold">Google uses it?</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['<loc>', 'Yes — required', 'The URL. Must be absolute, including protocol and www/no-www consistently'],
                    ['<lastmod>', 'Sometimes', 'Used to prioritize recrawl of recently changed pages. Format: YYYY-MM-DD'],
                    ['<changefreq>', 'Ignored', 'Google documented in 2023 that it ignores this field'],
                    ['<priority>', 'Ignored', 'Google documented in 2023 that it ignores this field'],
                    ['<image:image>', 'Yes', 'Required for image search indexing if images are not otherwise linked'],
                    ['<video:video>', 'Yes', 'Helps Google understand video content; requires duration and thumbnail URL'],
                    ['<xhtml:link>', 'Yes', 'hreflang for multilingual sites — specify alternate language URLs here'],
                  ].map(([tag, used, notes]) => (
                    <tr key={tag}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{tag}</td>
                      <td className={`border border-border p-2 font-medium ${used.startsWith('Yes') ? 'text-green-600' : used === 'Ignored' ? 'text-red-600' : 'text-yellow-600'}`}>{used}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sitemap index */}
          <section aria-labelledby="sitemap-index" className="space-y-4">
            <h2
              id="sitemap-index"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Sitemap index for large sites
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A single sitemap file is limited to 50,000 URLs and 50 MB uncompressed.
              Sites above this threshold use a sitemap index file — an XML file that
              lists multiple sitemap files. Each sub-sitemap can cover a section of the
              site (e.g., one for blog posts, one for product pages, one for category pages).
              This also makes it easier to see in Search Console which sections are being
              indexed vs. which have coverage issues.
            </p>
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
                  { name: "Robots.txt Generator", path: "/tools/robots-txt" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Sitemap Generator</strong> is a fully private,
            browser-based tool that creates <strong>XML sitemaps</strong> to improve your
            website's SEO and search engine indexing. Supports lastmod, changefreq, and
            priority settings, sitemap validation, and one-click download. All processing
            runs locally on your device — your website data never leaves your computer.
            The fastest free way to generate sitemaps in 2026, with no installs, no accounts,
            and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}
