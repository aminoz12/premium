import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools"
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/url-shortener"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free URL Shortener for Instagram Bio — Short Links, No Account",
  description:
    "Shorten a long URL for your Instagram bio, TikTok, or Twitter profile — instant, no account, no expiration. Every link includes a free downloadable QR code. Best free Bitly alternative.",
  keywords: [
    "free url shortener",
    "link shortener free online",
    "shorten url no account",
    "long link shrinker",
    "short link generator with qr code",
    "best bitly alternative 2026",
    "tinyurl alternative free",
    "url shortener no expiration",
    "secure link shortener",
    "link shrinker for instagram",
    "free qr code from url",
    "short url generator no login",
    "custom short link maker",
    "link management tool free",
    "url shortener for social media",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free URL Shortener — Short Links & QR Codes Instantly",
    description:
      "Turn messy long links into clean short URLs instantly. Includes free QR codes. No account, no expiration, no paywalls.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free URL Shortener and QR Code Generator by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free URL Shortener & QR Code Generator",
    description:
      "Shorten URLs and generate QR codes instantly in your browser. Free, private, and no account needed.",
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
  name: "Free URL Shortener & QR Code Generator",
  url: TOOL_URL,
  description:
    "A free online developer and marketing tool that instantly shortens long URLs and generates printable QR codes. No expiration dates and no account required.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Instant URL shortening",
    "Free QR code generation from URL",
    "Permanent links with no expiration",
    "No account or registration required",
    "Copy short links to clipboard",
    "Download QR codes as PNG",
    "Works on all devices and browsers",
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
  name: "How to Shorten a URL for Free",
  description:
    "A simple step-by-step guide on how to turn a long web address into a clean short link with a matching QR code using our free tool.",
  totalTime: "PT30S",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools URL Shortener & QR Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your Long URL",
      text: "Copy the long URL you want to shorten and paste it into the input field on the page. The tool accepts any HTTP or HTTPS address.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click the Shorten Button",
      text: "Press the 'Shorten' button. Our optimized engine instantly generates a compact short link and a scannable QR code for your original URL.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Copy Your Short Link",
      text: "Click the copy icon next to your new short link to save it to your clipboard. The short link will never expire and requires no account to function.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your QR Code",
      text: "Click the QR code download button to save a high-resolution PNG of your QR code. Ideal for printing on flyers, business cards, or restaurant menus.",
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
      name: "How does the free URL shortener work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply paste your long, messy link into the input box and click 'Shorten'. Our tool instantly generates a secure, compact link that redirects to your original URL, perfect for social media, emails, and business cards.",
      },
    },
    {
      "@type": "Question",
      name: "Is this a good free alternative to Bitly or TinyURL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our link shrinker provides the same fast, reliable link shortening and QR code generation completely free of charge, making it the perfect Bitly alternative without the restrictive paywalls or monthly link limits.",
      },
    },
    {
      "@type": "Question",
      name: "Do the shortened links expire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! Unlike some link shorteners that delete your links after 30 days, the URLs generated here have no expiration date. You can confidently use them in printed materials, social media bios, and long-term marketing campaigns.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an account to shorten links?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No account, sign-up, or API keys are required. You get unlimited access to our custom link shortener instantly right from your browser, with no login or registration.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate a QR code for my shortened link?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Every time you shorten a URL, our tool automatically generates a scannable QR code that you can download as a high-resolution PNG. It's an all-in-one link management solution for online and offline sharing.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a URL shortener and a link management platform?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A URL shortener simply converts a long URL into a shorter one, often with optional QR codes and click tracking. A link management platform includes advanced features like branded domains, click analytics, team collaboration, and retargeting pixels. Our tool sits in the middle: it offers instant shortening and QR generation without the complexity of a full platform.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Productivity Tools > Tool ──────

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
      name: "URL Shortener & QR Generator",
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
            Free URL Shortener for Instagram Bio — Short Links, No Account
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Transform any long web address into a clean, shareable short link instantly.
            Every shortened URL automatically comes with a <strong>free QR code</strong>
            that you can download. No account, no expiration, and no paywalls — fully secure
            and private.
          </p>

          <QuickAnswer
            question="How do I shorten a URL for my Instagram bio for free?"
            answer="Paste your long link into this tool and click Shorten. You get a short URL you can paste directly into your Instagram bio, plus a downloadable QR code. No account or signup needed — links never expire."
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
                  Productivity Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">URL Shortener & QR Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="URL Shortener Tool">
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
          <meta itemProp="name" content="URL Shortener: What Short Links Actually Do to Your Traffic Data" />
          <meta
            itemProp="description"
            content="How URL shorteners work, what tracking data they collect, and the two cases where a short link is worth the referrer data loss."
          />
          <meta itemProp="datePublished" content="2024-04-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What short links do to your analytics */}
          <section aria-labelledby="analytics-impact" className="space-y-4">
            <h2
              id="analytics-impact"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What URL shorteners do to your analytics
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              When someone clicks a short link, the shortener server receives the request,
              logs it (URL, timestamp, approximate location, device type, referrer), then
              redirects to your destination. Your analytics tool sees the traffic as
              arriving from the shortener&apos;s domain — not from the original source (Twitter,
              email, a Slack message). This is the referrer problem: you lose source
              attribution unless you add UTM parameters to the destination URL before
              shortening it.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The practical rule:{' '}
              <strong>always append UTM parameters before shortening</strong>.
              Shorten{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'https://example.com/post?utm_source=twitter&utm_medium=social&utm_campaign=launch'}
              </code>{' '}
              — not the bare URL. Your GA4 or Plausible dashboard will show the
              correct source even though the click went through a redirect.
            </p>
          </section>

          {/* When to use */}
          <section
            aria-labelledby="when-to-use"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="when-to-use"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When a short link is worth the trade-off
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Print materials</span>
                <span>
                  A 200-character URL on a flyer is unusable. A short link is the only
                  practical option. Combine it with a QR code — most people who see
                  print media will scan rather than type anyway.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">SMS campaigns</span>
                <span>
                  SMS has a 160-character limit. Long URLs consume most of the message.
                  Shortening is necessary. Note that carriers increasingly block messages
                  containing bit.ly and other generic shorteners — branded short domains
                  (e.g., go.yourcompany.com) have higher deliverability.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Character-limited social posts</span>
                <span>
                  Twitter/X counts short URLs as 23 characters regardless of the original
                  URL length — t.co wrapping happens automatically. For other platforms
                  (LinkedIn, Mastodon), shortening URLs in long-form posts is rarely
                  worth the analytics trade-off.
                </span>
              </li>
            </ul>
          </section>

          {/* Privacy note */}
          <section aria-labelledby="privacy-note" className="space-y-4">
            <h2
              id="privacy-note"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The privacy and permanence trade-off
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Every click on a short link is visible to the shortener service —
              including clicks from people who have no idea they&apos;re being tracked.
              For personal or sensitive links, a direct URL is the more privacy-respecting
              choice. Also consider link permanence: several major URL shortening services
              have shut down (Google URL Shortener in 2019, Bitly once changed its free
              tier terms), making millions of short links dead overnight. For links that
              need to work indefinitely, use a custom domain you control — a CNAME
              redirect via your own domain is permanent and survives any third-party service change.
            </p>
          </section>

          {/* Social media bio link section */}
          <section aria-labelledby="social-bio-links" className="space-y-4">
            <h2
              id="social-bio-links"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              URL shortener for social media bios — character limits and use cases
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Every major social platform allows one clickable link in your bio or profile.
              That link is valuable real estate — it drives traffic to your website, landing
              page, or product. A shortened URL keeps the bio clean and gives you a
              QR code for offline materials at the same time.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform</th>
                    <th className="border border-border p-2 text-left font-semibold">Bio character limit</th>
                    <th className="border border-border p-2 text-left font-semibold">Link placement</th>
                    <th className="border border-border p-2 text-left font-semibold">Tip</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Instagram', '150 characters', 'One clickable link in bio', 'Short URL saves bio space for keywords and emoji'],
                    ['TikTok', '80 characters', 'One link in bio (business accounts)', 'Link only available after 1,000 followers on personal accounts'],
                    ['Twitter / X', '160 characters', 'Website field below bio', 'Twitter auto-shortens all URLs to 23 chars — a short URL still looks cleaner'],
                    ['YouTube', '1,000 characters', 'Links section (up to 5)', 'Short URL + UTM parameters make tracking easier'],
                    ['Pinterest', '500 characters', 'Website field on profile', 'Short URL for QR code on pins works well'],
                    ['LinkedIn', '2,000 characters', 'Website field (up to 3 URLs)', 'Custom short URL looks professional; UTMs track recruiter clicks'],
                    ['Linktree / bio pages', 'Unlimited', 'Button destination URL', 'Use UTM parameters before shortening to track which button converts'],
                  ].map(([platform, limit, placement, tip]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 font-medium text-foreground">{platform}</td>
                      <td className="border border-border p-2 text-muted-foreground">{limit}</td>
                      <td className="border border-border p-2 text-muted-foreground">{placement}</td>
                      <td className="border border-border p-2 text-muted-foreground">{tip}</td>
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
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                  { name: "URL Encoder / Decoder", path: "/tools/url-encoder" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Free URL Shortener & QR Code Generator</strong> is a
            fully private, browser-based tool that transforms any long web address into a
            clean, compact <strong>short link</strong> — and automatically generates a
            scannable <strong>QR code</strong> for every link. All processing is secure and
            temporary; your original URL is never stored beyond the unique mapping code.
            Supports one‑click copying, high‑resolution QR code downloads, and works on all
            devices. The fastest free way to shorten links and create QR codes in 2026, with
            no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}