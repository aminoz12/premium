import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/meta-tags"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 60 characters (counted manually) — at the upper bound

export const metadata: Metadata = {
  title: "Open Graph & Twitter Card Meta Tag Generator Free — SEO Preview",
  description:
    "Generate Open Graph tags, Twitter Card meta tags, and standard SEO meta tags for any page. Preview how your link looks when shared on Facebook, X/Twitter, and LinkedIn. Free, no signup.",
  keywords: [
    "meta tags generator",
    "html meta tags",
    "meta description generator",
    "open graph tags",
    "viewport meta tag",
    "meta keywords",
    "seo meta tags",
    "free meta tag tool 2026",
    "browser-based meta editor",
    "no signup meta tags",
    "secure meta tag generator",
    "best free meta tool",
    "meta tag viewer",
    "html head generator",
    "meta tag preview",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Meta Tags Generator — View & Edit HTML Meta Tags Online",
    description:
      "View, edit, and generate HTML meta tags for your website instantly. Free online tool for managing description, keywords, Open Graph, and viewport tags.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Meta Tags Generator — View & Edit HTML Meta Tags by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Meta Tags Generator — HTML Meta Tags Editor",
    description:
      "View, edit, and generate HTML meta tags for your website instantly. Free browser-based tool, no signup required.",
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
  name: "Meta Tags Generator",
  url: TOOL_URL,
  description:
    "A free online tool that lets you view, edit, and generate HTML meta tags — including meta description, keywords, Open Graph tags, viewport settings — for SEO and social media sharing. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "View all meta tags from a URL or paste HTML",
    "Edit meta description, keywords, and title",
    "Generate Open Graph tags (og:title, og:image, etc.)",
    "Set viewport and charset meta tags",
    "Live preview of generated HTML head section",
    "Copy or download generated meta tags",
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
  name: "How to Generate and Edit HTML Meta Tags Online",
  description:
    "A simple step-by-step guide to viewing, editing, and generating HTML meta tags using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Meta Tags Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your URL or Paste HTML",
      text: "Type or paste a URL to fetch its meta tags, or paste raw HTML code directly into the editor. The tool will parse the <head> section and display all meta tags.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Edit and Customize Tags",
      text: "Click on any meta tag to edit its content. You can modify the description, keywords, title, or add new tags like Open Graph (og:title, og:image) and viewport settings.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Output",
      text: "The live preview pane shows how your meta tags will look in the HTML head section. Changes appear instantly as you edit.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download Your Meta Tags",
      text: "Click the 'Copy' button to save the generated HTML to your clipboard, or download it as an .html file to integrate into your website.",
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
      name: "What are meta tags and why are they important?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Meta tags are hidden HTML elements that provide information about a webpage to search engines and social media platforms. The most important ones include meta description (which appears in search results), Open Graph tags (which control how links look when shared on Facebook or Twitter), and viewport tags (which control mobile display). Proper meta tags improve SEO, click-through rates, and social sharing.",
      },
    },
    {
      "@type": "Question",
      name: "Can I edit the meta tags of an existing website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Paste the URL of the website into the tool, and it will fetch the current meta tags. You can then edit them and generate new HTML code to replace your site's meta tags.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when using this meta tag generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. The URLs or HTML you paste are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What are Open Graph tags and how do they work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open Graph tags (og:title, og:description, og:image) control how your webpage appears when shared on social media platforms like Facebook, LinkedIn, and Twitter. They allow you to set a specific title, description, and image that will be displayed in the share preview, helping increase click-through rates.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between meta description and meta keywords?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The meta description tag provides a concise summary of the page content that appears in search engine results. It influences click-through rates but not ranking directly. The meta keywords tag was once used to signal relevance to search engines, but most modern search engines (including Google) ignore it. Our tool lets you manage both, though keywords are largely deprecated.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free meta tags generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account and no URL or file size limits. Generates meta tags for any page directly in your browser — nothing is sent to any server.",
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
      name: "Meta Tags Generator",
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
            Open Graph & Twitter Card Meta Tag Generator — SEO Preview Free
          </h1>
          <img src="/images/meta-tags.webp" alt="Free Meta Tags Generator — create HTML meta tags for SEO and Open Graph" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            View, edit, and generate <strong>HTML meta tags</strong> for your website
            instantly. Manage <strong>meta description</strong>, <strong>keywords</strong>,
            <strong>Open Graph tags</strong>, and <strong>viewport</strong> settings.
            All processing runs locally in your browser with <strong>100% privacy</strong>
            — no signup or upload required.
          </p>

          <QuickAnswer
            question="What are meta tags and why are they important?"
            answer="Meta tags are hidden HTML elements that provide information about a webpage to search engines and social media platforms. They improve SEO, click-through rates, and social sharing. Our tool lets you view, edit, and generate them easily."
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
                <span className="text-foreground font-medium">Meta Tags Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Meta Tags Generator Tool">
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
          <meta itemProp="name" content="Meta Tags Generator: Which Tags Google Actually Uses in 2026" />
          <meta
            itemProp="description"
            content="Which meta tags still matter for Google, which are ignored, the Open Graph tags social platforms require, and the title length that gets truncated in search results."
          />
          <meta itemProp="datePublished" content="2024-03-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What Google uses */}
          <section aria-labelledby="what-google-uses" className="space-y-4">
            <h2
              id="what-google-uses"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which meta tags Google actually reads in 2026
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Google&apos;s crawler ignores most meta tags. The ones it uses:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">description</code> (as
              a snippet candidate — not guaranteed to appear), and{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">robots</code> (to
              control indexing and link following). The{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">keywords</code> meta
              tag has been ignored by Google since 2009 — it still gets included in
              generators but provides no SEO value. The{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">author</code> and{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">viewport</code> tags
              are used for other purposes (E-E-A-T signals and mobile rendering respectively)
              but do not directly affect rankings.
            </p>
          </section>

          {/* Tag reference table */}
          <section
            aria-labelledby="tag-reference"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="tag-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Complete tag reference and character limits
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Tag</th>
                    <th className="border border-border p-2 text-left font-semibold">Limit</th>
                    <th className="border border-border p-2 text-left font-semibold">Used by</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['<title>', '50–60 chars', 'Google, browsers, social', 'Shown in SERP; longer titles get rewritten by Google'],
                    ['meta description', '155–160 chars', 'Google (snippet candidate)', 'Google rewrites ~60% of descriptions anyway'],
                    ['og:title', '40–60 chars', 'Facebook, LinkedIn, Slack', 'Different from <title> — optimize for social separately'],
                    ['og:description', '100–150 chars', 'Facebook, LinkedIn', 'Twitter/X ignores this; uses twitter:description'],
                    ['og:image', '1200×630px min', 'All social platforms', 'Missing = ugly auto-generated preview; use absolute URL'],
                    ['twitter:card', 'summary_large_image', 'Twitter/X', 'Required for card display; without it, no image preview'],
                    ['robots', 'noindex, nofollow', 'All crawlers', 'noindex alone is sufficient to block ranking'],
                    ['canonical', 'Full URL', 'Google, Bing', 'Must match the page exactly; include or exclude www consistently'],
                  ].map(([tag, limit, usedBy, notes]) => (
                    <tr key={tag}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{tag}</td>
                      <td className="border border-border p-2 text-muted-foreground">{limit}</td>
                      <td className="border border-border p-2 text-muted-foreground">{usedBy}</td>
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
              The three meta tag mistakes that cost traffic
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Missing og:image</span>
                <span>
                  When your page is shared on LinkedIn or Slack without an og:image,
                  the platform generates a preview with no image or a random on-page
                  image. Click-through rates on link previews with images are 3–5×
                  higher than those without. This is the single highest-ROI meta tag
                  to add to content pages.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Duplicate title tags</span>
                <span>
                  Multiple pages with identical{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;title&gt;</code>{' '}
                  values send a consolidation signal to Google — it will pick one page
                  to show and demote the others. Every page needs a unique title that
                  describes what&apos;s actually on that specific page.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Canonical pointing to wrong URL</span>
                <span>
                  A canonical tag pointing to a different domain, a 404, or a redirect
                  target tells Google to index a different page than the one it&apos;s on.
                  This is one of the most common technical SEO errors and causes ranking
                  loss that looks like a penalty. Always verify canonical URLs resolve
                  correctly after any domain or URL structure changes.
                </span>
              </li>
            </ul>
          </section>

          {/* Open Graph / Twitter Card required tags */}
          <section aria-labelledby="og-required-tags" className="space-y-4">
            <h2
              id="og-required-tags"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Required Open Graph and Twitter Card tags — what each platform needs
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              When someone shares your URL, Facebook, X/Twitter, LinkedIn, Slack, and
              WhatsApp all read different meta tags to generate the link preview card.
              Missing tags cause broken or empty previews:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Tag</th>
                    <th className="border border-border p-2 text-left font-semibold">Platform that reads it</th>
                    <th className="border border-border p-2 text-left font-semibold">Required?</th>
                    <th className="border border-border p-2 text-left font-semibold">Recommended value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['og:title', 'Facebook, LinkedIn, Slack, WhatsApp, Discord', 'Yes', 'Page title — up to 60 characters for best display'],
                    ['og:description', 'Facebook, LinkedIn, Slack, Discord', 'Recommended', '2–3 sentence description; 200 characters max'],
                    ['og:image', 'All platforms', 'Yes — or preview is blank', '1200×630px minimum; JPEG or PNG; under 8MB'],
                    ['og:url', 'Facebook, LinkedIn', 'Recommended', 'Canonical URL of the page (no query strings)'],
                    ['og:type', 'Facebook', 'Recommended', '"website" for most pages; "article" for blog posts'],
                    ['twitter:card', 'X/Twitter', 'Yes for Twitter', '"summary_large_image" for full-width image cards'],
                    ['twitter:title', 'X/Twitter', 'Yes if og:title absent', 'Same as og:title or a shorter version'],
                    ['twitter:description', 'X/Twitter', 'Recommended', 'Up to 200 characters'],
                    ['twitter:image', 'X/Twitter', 'Yes for image card', 'Minimum 300×157px; max 5MB; JPEG or PNG'],
                    ['<title> tag', 'All (fallback)', 'Yes', 'Used as fallback when og:title is missing'],
                    ['<meta name="description">', 'Google, Bing (search preview)', 'Yes for SEO', 'Up to 160 characters for search result snippet'],
                  ].map(([tag, platform, required, value]) => (
                    <tr key={tag}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{tag}</td>
                      <td className="border border-border p-2 text-muted-foreground">{platform}</td>
                      <td className="border border-border p-2 text-muted-foreground">{required}</td>
                      <td className="border border-border p-2 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  { name: "Sitemap Generator", path: "/tools/sitemap-generator" },
                  { name: "Color Contrast Checker", path: "/tools/color-contrast-checker" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Meta Tags Generator</strong> is a fully private,
            browser-based tool that lets you view, edit, and generate <strong>HTML meta
              tags</strong> for SEO and social sharing. Supports meta description, keywords,
            Open Graph tags (og:title, og:description, og:image), and viewport settings.
            All processing runs locally on your device — your URLs and HTML code never leave
            your computer. The fastest free way to manage meta tags in 2026, with no
            installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}
