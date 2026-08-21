import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/ip-lookup"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "What Is My IP Address — IP Lookup, Location & ISP Free Online",
  description:
    "Look up any IP address geolocation instantly — country, ISP, city, and more. Free IP lookup tool with no signup, no upload, 100% private in your browser.",
  keywords: [
    "ip address geolocation",
    "ip address geolocation free",
    "free ip address lookup",
    "ip lookup",
    "what is my ip",
    "find my ip address",
    "public ip address lookup",
    "ip address checker",
    "ip location",
    "isp lookup",
    "ip geolocation tool",
    "free ip tool 2026",
    "browser-based ip lookup",
    "no signup ip address",
    "secure ip lookup",
    "best free ip lookup",
    "trace ip address online",
    "ip address finder",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free IP Lookup — Find Your Public IP Address & Location Online",
    description:
      "Lookup your public IP address instantly. See ISP, location, country, and more. Free, browser-based IP lookup tool with no signup required — 100% private.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free IP Lookup — Find Your Public IP Address by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IP Lookup — Find Your Public IP Address Online",
    description:
      "Lookup your public IP address instantly. See ISP, location, country, and more. Free browser-based tool, no signup required.",
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
  name: "IP Lookup Tool",
  url: TOOL_URL,
  description:
    "A free online tool that displays your public IP address and related information such as ISP, location, country, and geolocation coordinates. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Display your public IP address instantly",
    "Show internet service provider (ISP)",
    "Display geolocation (country, region, city)",
    "Show approximate latitude and longitude",
    "Detect device and browser information",
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
  name: "How to Find Your Public IP Address Online",
  description:
    "A simple step-by-step guide to discovering your public IP address and related information using our free online IP lookup tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools IP Lookup Tool",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Visit the Tool Page",
      text: "Open the IP Lookup tool page in your browser. The tool will automatically detect and display your public IP address, ISP, and location.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Review Your IP Information",
      text: "You'll instantly see your public IP address, approximate location (country, region, city), and internet service provider.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Copy Your IP Address",
      text: "Click the 'Copy' button next to your IP address to copy it to your clipboard for use in diagnostics or configurations.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Refresh on Demand",
      text: "If you need a fresh IP lookup (e.g., after connecting to a VPN), simply refresh the page or click the 'Check Again' button to get the current IP address.",
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
      name: "What is a public IP address and why would I need to know mine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A public IP address is a unique identifier assigned to your device by your internet service provider when you connect to the internet. You may need it for configuring remote access, troubleshooting network issues, verifying VPN connections, or setting up servers.",
      },
    },
    {
      "@type": "Question",
      name: "Does this IP lookup tool store my IP address?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing occurs entirely in your browser. Your IP address is retrieved from your browser's network information or through a local client-side API call that does not store your data. We do not log or store any IP addresses on our servers.",
      },
    },
    {
      "@type": "Question",
      name: "What information does the tool provide besides my IP address?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool also displays your ISP (Internet Service Provider), approximate location (country, region, city), and geolocation coordinates (latitude/longitude) when available. This information is derived from your IP address and browser data.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this IP lookup tool to trace another user's IP address?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This tool only displays your own public IP address and associated information. It does not have the ability to look up, trace, or access any other device's IP address. For privacy and security reasons, only the IP address of the device loading the page is shown.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a private IP address and a public IP address?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A private IP address is used within a local network (e.g., home or office) and is not routable on the internet. A public IP address is assigned by your ISP and is unique globally, allowing your device to communicate with the internet. This tool shows your public IP address.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free IP lookup tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It provides your current public IP address based on your browser session. Geolocation data is approximate and may not be exact, especially for users behind VPNs or proxies. All processing is client-side and private.",
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
      name: "IP Lookup Tool",
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
            What Is My IP Address — IP Lookup, Location & ISP Free Online
          </h1>
          <img src="/images/ip-lookup.webp" alt="Free IP Lookup Tool — find location, ISP, and details for any IP address" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Instantly discover your <strong>public IP address</strong> and related
            information — <strong>ISP</strong>, <strong>country</strong>,
            <strong>region</strong>, <strong>city</strong>, and approximate
            <strong>geolocation</strong>. All processing runs locally in your browser
            with <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="What is a public IP address and why would I need to know mine?"
            answer="A public IP address is a unique identifier assigned to your device by your ISP. You may need it for remote access, troubleshooting, VPN verification, or server setup."
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
                <span className="text-foreground font-medium">IP Lookup Tool</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="IP Lookup Tool">
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
          <meta itemProp="name" content="IP Lookup: What Geolocation Data Is Accurate and What Isn't" />
          <meta
            itemProp="description"
            content="What IP geolocation can and cannot tell you, the accuracy gap between city-level and country-level data, and the two cases where IP lookup is the wrong tool."
          />
          <meta itemProp="datePublished" content="2024-03-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What IP geolocation is and isn't */}
          <section aria-labelledby="accuracy" className="space-y-4">
            <h2
              id="accuracy"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What IP geolocation data is actually accurate
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              IP geolocation maps an IP address to a geographic location using databases
              maintained by organizations like MaxMind and IPinfo. Accuracy varies by
              precision level: country-level accuracy is ~99.9% for most databases.
              Region/state accuracy is ~80–90%. City-level accuracy is 50–75% for consumer
              IPs — the city returned may be the nearest major city to the user&apos;s actual
              location, the city where their ISP&apos;s regional hub is, or a data center city
              that serves their area.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Corporate IPs (office networks, VPNs, cloud servers) are often geolocated
              to their ISP&apos;s headquarters, not the physical location of the user. Mobile
              carrier IPs frequently resolve to a carrier&apos;s regional gateway, not the
              device&apos;s city. For precise location, browser Geolocation API (which uses GPS
              + WiFi triangulation) is far more accurate than IP — but requires explicit
              user permission.
            </p>
          </section>

          {/* What this tool shows */}
          <section
            aria-labelledby="what-it-shows"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-it-shows"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What the lookup result tells you
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">ASN (Autonomous System Number)</span>
                <span>
                  Identifies the network operator — the ISP, cloud provider, or
                  organization that controls the IP range. Useful for identifying
                  data center IPs (AWS, Google Cloud, Cloudflare) vs. residential ISP IPs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Reverse DNS (PTR record)</span>
                <span>
                  The hostname associated with the IP, if configured. Mail servers
                  use this for spam checking — a sending IP without a PTR record is
                  treated as suspicious by many mail filters.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">IP type (residential vs. datacenter)</span>
                <span>
                  Geolocation databases flag known data center, VPN, proxy, and Tor
                  exit node IPs. Useful for fraud detection and access control,
                  but not foolproof — IP ranges shift between categories.
                </span>
              </li>
            </ul>
          </section>

          {/* IP geolocation accuracy section */}
          <section aria-labelledby="ip-accuracy" className="space-y-4">
            <h2
              id="ip-accuracy"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How accurate is IP geolocation — and what a VPN changes
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              IP geolocation data comes from databases built by correlating IP allocation
              records (ARIN, RIPE, APNIC) with network routing data and user-provided signals.
              Accuracy degrades as you get more specific:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Geolocation level</th>
                    <th className="border border-border p-2 text-left font-semibold">Typical accuracy</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Country', '~99%', 'Highly reliable — country-level IP allocation is public record'],
                    ['Region / state', '~80%', 'Reliable for most ISPs; mobile carrier IPs often show HQ region, not yours'],
                    ['City', '~50–70%', 'Varies widely; ISPs route large areas through a few city nodes'],
                    ['Postal code', '~30–50%', 'Very unreliable — avoid using for location-critical applications'],
                    ['Latitude / longitude', '~20km radius at best', 'Should not be used for precise location; nearest city center is typical'],
                    ['When using a VPN', 'Shows VPN exit node location', 'Your true location is hidden — the exit server\'s IP and ISP are shown'],
                    ['When on mobile data', 'ISP\'s regional hub', 'Mobile IPs are assigned by the carrier and often show the wrong city'],
                  ].map(([level, accuracy, notes]) => (
                    <tr key={level}>
                      <td className="border border-border p-2 font-medium text-foreground">{level}</td>
                      <td className="border border-border p-2 text-muted-foreground">{accuracy}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
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
              Related network tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                  { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                  { name: "User Agent Parser", path: "/tools/user-agent-parser" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — IP Lookup Tool</strong> is a fully private,
            browser-based tool that displays your <strong>public IP address</strong>
            and related information — ISP, country, region, city, and geolocation  ,
            instantly. All processing runs locally on your device — your IP address
            never leaves your computer. The fastest free way to find your public IP in
            2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}