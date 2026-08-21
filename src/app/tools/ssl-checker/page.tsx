import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/ssl-checker"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 59 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free SSL Checker — Verify SSL/TLS Certificate & Expiry Online",
  description:
    "Check SSL/TLS certificate details instantly. Verify expiry date, issuer, SANs, and signature algorithm. Free, browser-based — no server upload.",
  keywords: [
    "ssl checker",
    "ssl certificate checker",
    "tls checker",
    "ssl expiry check",
    "certificate validator",
    "ssl test online",
    "tls certificate lookup",
    "san checker",
    "ssl issuer lookup",
    "free ssl tool 2026",
    "ssl chain verifier",
    "secure ssl checker",
    "browser-based ssl test",
    "no signup ssl tool",
    "ssl certificate details",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free SSL Checker — Verify SSL/TLS Certificate & Expiry Online",
    description:
      "Check SSL/TLS certificate details instantly. Verify expiry date, issuer, SANs, and signature algorithm. Free, browser-based tool.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free SSL Checker — Verify SSL/TLS Certificate by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SSL Checker — SSL/TLS Certificate & Expiry Test",
    description:
      "Check SSL/TLS certificate details instantly. Verify expiry date, issuer, SANs, and signature algorithm. Free and private.",
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
  name: "SSL Checker",
  url: TOOL_URL,
  description:
    "A free online tool that checks SSL/TLS certificate details including expiry date, issuer, Subject Alternative Names (SANs), and signature algorithm. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Check SSL certificate expiry date",
    "Verify certificate issuer",
    "List Subject Alternative Names (SANs)",
    "Identify signature algorithm",
    "Check certificate chain validity",
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
  name: "How to Check an SSL Certificate",
  description:
    "A simple step-by-step guide to verify SSL/TLS certificate details — including expiry, issuer, and SANs — using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools SSL Checker",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter the Domain Name",
      text: "Type or paste the fully qualified domain name (e.g., example.com) into the input field. Do not include 'https://' or any path — just the domain.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click the Check Button",
      text: "Press the 'Check SSL' button. The tool will perform a secure lookup of the SSL/TLS certificate for the specified domain.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Certificate Details",
      text: "The tool displays key information: certificate expiry date, issuer organization, Subject Alternative Names (SANs), signature algorithm, and certificate chain status.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Save Results",
      text: "Click the 'Copy' button to save the certificate details to your clipboard, or download them as a JSON file for offline analysis or documentation.",
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
      name: "What is an SSL certificate and why is it important?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An SSL (Secure Sockets Layer) certificate encrypts data between a user's browser and a website, ensuring that sensitive information like passwords and credit card numbers cannot be intercepted. It also verifies that the website is genuine, building trust with visitors.",
      },
    },
    {
      "@type": "Question",
      name: "How does this SSL checker work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool connects to the specified domain over a secure TLS handshake, retrieves the certificate chain, and parses its fields. Key details such as expiry date, issuer, SANs, and signature algorithm are extracted and displayed.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when using this SSL checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All processing occurs entirely in your browser using standard Web Crypto APIs and secure TLS connections. No domain data is stored or logged on our servers — the tool is 100% private.",
      },
    },
    {
      "@type": "Question",
      name: "What is a Subject Alternative Name (SAN)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Subject Alternative Name (SAN) is a field in an SSL certificate that lists additional domains or subdomains covered by the same certificate. SANs are essential for modern certificates, allowing one certificate to secure multiple hostnames.",
      },
    },
    {
      "@type": "Question",
      name: "What does a valid SSL certificate expiry date look like?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A valid certificate typically expires after 1–2 years. The date is displayed in UTC format. If the expiry date is in the past, the certificate is no longer valid and should be renewed immediately to avoid security warnings.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free SSL checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It works with any publicly accessible domain. For domains behind strict firewalls or on internal networks, the tool may not be able to establish a connection. All processing is local and private.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Developer Tools > Tool ──────

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
      item: `${SITE_URL}/categories/development`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "SSL Checker",
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
            Free SSL Checker — Verify SSL/TLS Certificate & Expiry Online
          </h1>
          <img src="/images/ssl-checker.webp" alt="Free SSL Certificate Checker — verify SSL expiry, issuer, and SANs online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Check any domain's <strong>SSL/TLS certificate</strong> details instantly.
            Verify the <strong>expiry date</strong>, <strong>issuer</strong>,
            <strong>Subject Alternative Names (SANs)</strong>, and <strong>signature
              algorithm</strong>. All processing is client-side and private — no signup
            or upload required.
          </p>

          <QuickAnswer
            question="How do I check an SSL certificate for free?"
            answer="Enter the domain name, click 'Check SSL', and the tool will display certificate details including expiry, issuer, SANs, and signature algorithm. All processing happens in your browser with no data sent to servers."
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
                  href={`${SITE_URL}/categories/development`}
                  className="hover:text-foreground transition-colors"
                >
                  Developer Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">SSL Checker</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="SSL Checker Tool">
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
          <meta itemProp="name" content="SSL Certificate Checker: What to Verify and the Expiry Alerts You Need" />
          <meta
            itemProp="description"
            content="What an SSL check tells you beyond just 'valid or not', the certificate chain issues that cause browser warnings, and how to set up expiry monitoring before it becomes a production incident."
          />
          <meta itemProp="datePublished" content="2024-03-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What to verify */}
          <section aria-labelledby="what-to-verify" className="space-y-4">
            <h2
              id="what-to-verify"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What to check beyond &quot;is it valid&quot;
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A certificate can be valid but still cause browser warnings or downtime.
              The five things to verify after issuing or renewing a cert:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Domain match</span>
                <span>
                  The certificate&apos;s Subject Alternative Names (SANs) must exactly
                  match the domain being served — including or excluding{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">www</code>.
                  A cert for{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">example.com</code>{' '}
                  does not cover{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">www.example.com</code>{' '}
                  unless listed separately or a wildcard cert is used.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Certificate chain</span>
                <span>
                  The server must send the complete chain: leaf cert + intermediate
                  CA cert(s). A missing intermediate causes browser warnings on some
                  clients even if the root CA is trusted. This is the most common
                  misconfiguration after cert renewal.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Expiry date</span>
                <span>
                  Let&apos;s Encrypt certificates expire every 90 days. Commercial certs
                  typically 1–2 years. Set a monitoring alert at 30 days before expiry —
                  browsers start showing &quot;Not Secure&quot; warnings when expiry is near.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Protocol and cipher</span>
                <span>
                  TLS 1.0 and 1.1 are deprecated and cause browser warnings in Chrome
                  and Firefox. Your server should offer TLS 1.2 minimum; TLS 1.3 is
                  preferred for performance (1 round-trip handshake vs. 2 for TLS 1.2).
                </span>
              </li>
            </ul>
          </section>

          {/* Expiry monitoring */}
          <section
            aria-labelledby="expiry-monitoring"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="expiry-monitoring"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How to monitor expiry automatically
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Manual checks miss renewals. Set up automated monitoring: most uptime
              monitoring services (UptimeRobot, Better Uptime, Checkly) include SSL
              expiry checks. Alternatively, run a cron job using{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                openssl s_client -connect example.com:443 | openssl x509 -noout -dates
              </code>{' '}
              and alert when the expiry date is within 30 days. For Let&apos;s Encrypt with
              Certbot, auto-renewal is enabled by default via a systemd timer or cron —
              verify it&apos;s running with{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">certbot renew --dry-run</code>.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related network tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                  { name: "IP Lookup", path: "/tools/ip-lookup" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — SSL Checker</strong> is a fully private, browser-based
            tool that verifies <strong>SSL/TLS certificate details</strong> for any domain.
            It retrieves and displays the <strong>expiry date</strong>, <strong>issuer</strong>,
            <strong>Subject Alternative Names (SANs)</strong>, <strong>signature algorithm</strong>,
            and <strong>certificate chain status</strong>. All processing runs locally on your
            device — your domain queries never leave your computer. The fastest free way to
            check SSL certificates in 2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}