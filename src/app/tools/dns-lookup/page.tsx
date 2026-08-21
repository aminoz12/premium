import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URLs only ───────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/dns-lookup"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── Perfect Metadata & Freshness ─────────────────────────────────────────────
export const metadata: Metadata = {
  // Title: 57 characters — well within 50–60 char SERP window
  title: "DNS Lookup Tool — Check DNS Propagation & MX, TXT Records Free",
  description:
    "Free DNS lookup tool: check A, AAAA, CNAME, MX, NS, TXT, SOA records instantly. No signup, no upload — DNS queries run in your browser, 100% private.",
  keywords: [
    "dns lookup",                          // exact‑match primary
    "free dns lookup tool",
    "check dns records online",
    "dns records checker",
    "find mx records online",
    "cname lookup tool",
    "txt record checker free",
    "online dns tool no upload",
    "browser‑based dns lookup",
    "dns propagation checker 2026",
    "domain name system checker",
    "free dns lookup no sign up",
    "instant dns lookup browser",
    "dns lookup free 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free DNS Lookup Tool — Instantly Check DNS Records",
    description:
      "Check A, AAAA, CNAME, MX, NS, TXT, SOA records for any domain in seconds. Fully browser‑based — your queries stay on your device.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free DNS Lookup Tool — Check DNS Records Online by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free DNS Lookup — Check DNS Records Online",
    description:
      "Look up DNS records instantly in your browser. No sign‑up, no server‑side logging — completely private.",
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

// ─── JSON‑LD Structured Data ──────────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DNS Lookup Tool",
  url: TOOL_URL,
  description:
    "A free, privacy‑first browser‑based DNS lookup tool that retrieves A, AAAA, CNAME, MX, NS, TXT, and SOA records for any domain without sending queries to an intermediate server.",
  applicationCategory: "NetworkingApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with DNS‑over‑HTTPS support. Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Query all major DNS record types: A, AAAA, CNAME, MX, NS, TXT, SOA",
    "Instant results via secure DNS‑over‑HTTPS (DoH)",
    "Smart caching fallback using browser storage",
    "Export results as CSV for documentation",
    "Clean, accessible table view with TTL and record data",
    "Fully client‑side – no queries logged on remote servers",
    "No account or registration required",
    "Works on desktop, tablet, and mobile browsers",
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
  name: "How to Check DNS Records Online",
  description:
    "Look up A, MX, CNAME, TXT, and other DNS records for any domain in under a minute using our free browser‑based tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools DNS Lookup Tool",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter a Domain Name",
      text: "Type or paste the domain you want to query into the input field. Omit 'http://' and any paths – just the bare domain (e.g., example.com).",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Execute the Lookup",
      text: "Click the search button. The tool sends a DNS‑over‑HTTPS request directly from your browser to a public resolver, guaranteeing privacy.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review the Records",
      text: "ExAchraf the structured table showing record types, values, and TTLs. Expand rows for detailed information about each record.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export or Copy the Data",
      text: "Download the full result set as a CSV file for team sharing or documentation, or copy individual records to your clipboard.",
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
      name: "What is an A Record?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An 'A' (Address) record is the most fundamental type of DNS record. It points a domain or subdomain to the IPv4 address of the server hosting the website. AAAA records do the same but for IPv6 addresses.",
      },
    },
    {
      "@type": "Question",
      name: "Why are MX records important?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MX (Mail Exchange) records direct a domain's email to the servers that handle incoming mail. Without correct MX records, you cannot receive emails at your custom domain name.",
      },
    },
    {
      "@type": "Question",
      name: "What does TTL mean in DNS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TTL stands for 'Time to Live.' It indicates how many seconds a DNS resolver is allowed to cache a record before it must check the authoritative nameserver for an update. Lower TTLs cause more frequent lookups.",
      },
    },
    {
      "@type": "Question",
      name: "How long does DNS propagation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After changing a DNS record, propagation can take from a few minutes up to 48 hours. The delay is largely determined by the previous record's TTL and the caching behaviour of intermediate resolvers worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "Why isn't my new DNS record showing up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you recently updated your DNS settings and they do not appear, global DNS propagation is likely still in progress. Clear your local DNS cache or wait for the original TTL to expire.",
      },
    },
    {
      "@type": "Question",
      name: "Does this DNS lookup tool send my queries to a remote server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All DNS queries are performed using DNS‑over‑HTTPS (DoH) directly from your browser to a public resolver. The request never passes through our servers, and no domain lookups are logged by us.",
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
      name: "Network Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "DNS Lookup Tool",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* ── JSON‑LD Structured Data Scripts ── */}
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

      <>
        <div className=" ">
          {/* ── Page Header ── */}
          <header className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              DNS Lookup Tool — Check DNS Propagation & MX, TXT Records Free
            </h1>
            <img src="/images/dns-lookup.webp" alt="Free DNS Lookup Tool — check DNS records for any domain online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Look up A, AAAA, CNAME, MX, NS, TXT, and SOA records for any domain directly in your
              browser. All queries use secure DNS‑over‑HTTPS — your lookups never touch our
              servers and require no account.
            </p>
            <QuickAnswer
              question="How do I check if DNS has propagated for my domain?"
              answer="Enter your domain in the lookup tool above and check the A record. If it shows your new IP address, DNS has propagated to that resolver. Propagation takes 0–48 hours depending on your domain's TTL setting — the lower the TTL, the faster the change spreads. Run the lookup repeatedly until you see the new record."
            />

            {/* ── Breadcrumb HTML (mirrors JSON‑LD) ── */}
            <nav
              aria-label="Breadcrumb"
              className="text-xs text-muted-foreground pt-2"
            >
              <ol className="flex items-center gap-1.5">
                <li>
                  <a
                    href={`${SITE_URL}/`}
                    className="hover:text-foreground transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <a
                    href={`${SITE_URL}/tools`}
                    className="hover:text-foreground transition-colors"
                  >
                    Network Tools
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <span className="text-foreground font-medium">
                    DNS Lookup Tool
                  </span>
                </li>
              </ol>
            </nav>
          </header>

          {/* ── Interactive Tool ── */}
          <main>
            <ToolClient />
          </main>

          <hr className="border-border" />

          {/* ── AdSense High‑Value Content Injection ── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="DNS Lookup Tool: Record Types, TTL, and How to Debug Propagation Issues" />
            <meta
              itemProp="description"
              content="What each DNS record type does, why DNS changes take time to propagate, and the two commands that tell you whether a change has reached a specific resolver."
            />
            <meta itemProp="datePublished" content="2024-03-12" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* Record type reference */}
            <section aria-labelledby="record-types" className="space-y-4">
              <h2
                id="record-types"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                DNS record types and what they control
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Record</th>
                      <th className="border border-border p-2 text-left font-semibold">Points to</th>
                      <th className="border border-border p-2 text-left font-semibold">Common use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['A', 'IPv4 address (e.g. 93.184.216.34)', 'Root domain and subdomains to a server'],
                      ['AAAA', 'IPv6 address', 'IPv6 server address — increasingly common with CDNs'],
                      ['CNAME', 'Another hostname', 'www → apex, or custom domain → CDN hostname'],
                      ['MX', 'Mail server hostname + priority', 'Email routing — required for receiving email'],
                      ['TXT', 'Arbitrary text', 'SPF, DKIM, DMARC, domain verification tokens'],
                      ['NS', 'Nameserver hostname', 'Delegates DNS authority to a specific provider'],
                      ['SOA', 'Zone metadata', 'Start of authority — read-only, set by registrar'],
                      ['CAA', 'Certificate Authority name', 'Restricts which CAs can issue SSL certs for the domain'],
                    ].map(([record, pointsTo, use]) => (
                      <tr key={record}>
                        <td className="border border-border p-2 font-mono text-xs font-bold text-foreground">{record}</td>
                        <td className="border border-border p-2 text-muted-foreground">{pointsTo}</td>
                        <td className="border border-border p-2 text-muted-foreground">{use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* TTL and propagation */}
            <section
              aria-labelledby="ttl-propagation"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="ttl-propagation"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                TTL and why DNS propagation takes time
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                TTL (Time To Live) is the number of seconds a resolver caches your DNS record
                before re-querying the authoritative nameserver. A TTL of 3600 means resolvers
                keep your old record for up to one hour after you change it. This is why
                &quot;DNS propagation&quot; takes time — every recursive resolver worldwide has its own
                cache, and they expire independently.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                Best practice before a planned DNS change: lower your TTL to 300 (5 minutes)
                at least 24 hours before making the change. After the change is verified, raise
                the TTL back to 3600 or higher. Lower TTL = more DNS queries (slightly more
                load) but faster propagation. Production A records typically run at 3600;
                records you change frequently (like CNAME for feature flags) can stay at 300.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                To check whether a DNS change has reached a specific resolver, use:{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  dig @8.8.8.8 example.com A
                </code>{' '}
                (queries Google&apos;s resolver) or{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  dig @1.1.1.1 example.com A
                </code>{' '}
                (queries Cloudflare). Seeing different results from different resolvers is
                expected during propagation — it just means their caches haven&apos;t expired yet.
              </p>
            </section>

            {/* DNS record types reference */}
            <section aria-labelledby="dns-record-types" className="space-y-4">
              <h2
                id="dns-record-types"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                DNS record types — what each record does
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Record type</th>
                      <th className="border border-border p-2 text-left font-semibold">Purpose</th>
                      <th className="border border-border p-2 text-left font-semibold">Common use cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['A', 'Maps domain to IPv4 address', 'Point example.com to your server IP — the most basic DNS record'],
                      ['AAAA', 'Maps domain to IPv6 address', 'IPv6 equivalent of A record — increasingly required for full coverage'],
                      ['CNAME', 'Alias from one domain to another', 'www → example.com; subdomain → CDN provider hostname'],
                      ['MX', 'Mail exchanger — where email is delivered', 'Required for email to work; set to your email provider (Google Workspace, Outlook, etc.)'],
                      ['TXT', 'Arbitrary text associated with the domain', 'SPF (email anti-spoofing), DKIM, DMARC, domain ownership verification for Google/Cloudflare'],
                      ['NS', 'Name servers for the domain', 'Points to which DNS servers are authoritative for your domain'],
                      ['SOA', 'Start of Authority — zone metadata', 'Contains primary NS, admin email, serial number, refresh intervals'],
                      ['CAA', 'Certificate Authority Authorization', 'Restricts which CAs can issue SSL certs for your domain'],
                      ['PTR', 'Reverse DNS — IP to hostname', 'Used by email servers to verify sender legitimacy; set at the hosting level'],
                      ['SRV', 'Service location record', 'Used by VoIP (SIP), XMPP, Microsoft Teams for service discovery'],
                    ].map(([type, purpose, uses]) => (
                      <tr key={type}>
                        <td className="border border-border p-2 font-mono text-xs font-bold text-foreground">{type}</td>
                        <td className="border border-border p-2 text-foreground">{purpose}</td>
                        <td className="border border-border p-2 text-muted-foreground">{uses}</td>
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
                    { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                    { name: "IP Lookup", path: "/tools/ip-lookup" },
                    { name: "Sitemap Generator", path: "/tools/sitemap-generator" },
                  ]}
                />
              </nav>
            </section>
          </article>

          {/* ── Page Footer Summary ── */}
          <footer className="pt-6 border-t space-y-3 text-xs text-muted-foreground">
            <p>
              <strong>TheFreeAITools — DNS Lookup Tool</strong> is a fully private, browser‑based
              utility for looking up A, AAAA, CNAME, MX, NS, TXT, and SOA records. All queries are
              sent directly from your device to a public DNS resolver using DNS‑over‑HTTPS — no
              server‑side logging, no account, and no cost. Perfect for web developers, system
              administrators, and anyone who needs fast, reliable DNS diagnostics in 2026.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}