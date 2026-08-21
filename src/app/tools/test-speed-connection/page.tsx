import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/test-speed-connection"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Internet Speed Test — Check Download, Upload & Ping Online Free",
  description:
    "Check your internet speed in your browser. Measures download, upload, ping, and jitter. No plugin, no signup, instant results on any device.",
  keywords: [
    "internet speed test",
    "free speed test",
    "wifi speed test",
    "download speed test",
    "upload speed test",
    "ping test",
    "broadband speed checker",
    "network speed test",
    "5g speed test",
    "fiber speed test",
    "jitter test",
    "connection speed",
    "download speed test online",
    "upload speed test free",
    "best speed test 2026",
    "privacy first speed test",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Internet Speed Test — Check Download, Upload & Ping Online",
    description:
      "Measure your real download speed, upload speed, ping, and jitter — directly in your browser. No registration, no software required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Internet Speed Test — Check Download, Upload & Ping by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Internet Speed Test — Check Download, Upload & Ping",
    description:
      "Check your internet speed in seconds. Measures download, upload, ping & jitter. 100% free & private.",
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
  name: "Internet Speed Test — Download, Upload, Ping & Jitter",
  url: TOOL_URL,
  description:
    "A free, accurate browser-based tool to measure your real internet connection speed including download speed, upload speed, ping (latency), and jitter. All processing is client-side and private.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real download speed measurement (Mbps)",
    "Real upload speed measurement (Mbps)",
    "Ping (latency) test in milliseconds",
    "Jitter measurement for connection stability",
    "Connection stabilization before test",
    "Local test history stored in browser",
    "Dark and light mode support",
    "No registration or data logging",
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
  name: "How to Test Your Internet Speed",
  description:
    "A step-by-step guide to measuring your download speed, upload speed, ping, and jitter using our free online speed test.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Internet Speed Test",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Close Background Applications",
      text: "Close other browser tabs and pause any downloads, streaming, or background updates to get the most accurate reading. Connect via Ethernet for best results.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click START TEST",
      text: "Press the START TEST button or hit the Space bar. The tool will first stabilize your connection before beginning the measurement phase.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Wait for the Measurement to Complete",
      text: "The tool will sequentially measure your download speed, upload speed, ping, and jitter. The process takes approximately 30–60 seconds.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Review Your Results",
      text: "View your download speed (Mbps), upload speed (Mbps), ping (ms), and jitter (ms). Results are saved automatically in your browser's local storage for future reference.",
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
      name: "How accurate is this internet speed test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool measures real download and upload throughput by fetching and uploading data against a public CDN endpoint, then computing actual transfer rates from elapsed time. For best accuracy, close other browser tabs and connect via Ethernet.",
      },
    },
    {
      "@type": "Question",
      name: "Why does the tool wait before starting the measurement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A short stabilization phase lets your browser and network settle before timing begins, which reduces the impact of connection ramp-up and produces more reliable results.",
      },
    },
    {
      "@type": "Question",
      name: "What is a good internet download speed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Basic browsing: 5–10 Mbps. HD video streaming: 25+ Mbps. 4K streaming or online gaming: 50–100+ Mbps. Professional or multi-user households: 200+ Mbps. Fiber connections can reach 1,000 Mbps.",
      },
    },
    {
      "@type": "Question",
      name: "What is ping and why does it matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ping (latency) is the round-trip time in milliseconds between your device and the server. Low ping (under 30 ms) is essential for real-time applications like video calls and online gaming. High ping causes noticeable lag.",
      },
    },
    {
      "@type": "Question",
      name: "What is jitter and how does it affect my connection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jitter is the variation in ping over time. Low jitter (under 10 ms) means a stable connection. High jitter causes choppy audio/video calls and unstable gaming performance even when average ping seems acceptable.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private during the speed test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We do not log your IP address or personal information. Test results are stored only in your own browser's localStorage if you choose to keep history, and are never sent to our servers.",
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
      name: "Internet Speed Test",
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
            Free Internet Speed Test — Check Download, Upload & Ping Online
          </h1>
          <img src="/images/security.webp" alt="Free Internet Speed Test — check download, upload, ping, and jitter online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Measure your real <strong>download speed</strong>, <strong>upload speed</strong>,
            <strong>ping</strong>, and <strong>jitter</strong> in seconds — directly in your browser.
            No plugin, no registration, no data logging. 100% free and private.
          </p>

          <QuickAnswer
            question="How do I test my internet speed?"
            answer="Click 'START TEST' below. The tool measures your actual download and upload throughput by transferring data against a CDN endpoint and computing the real transfer rate. Results include download speed (Mbps), upload speed (Mbps), ping (ms), and jitter (ms)."
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
                <span className="text-foreground font-medium">Internet Speed Test</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Internet Speed Test Tool">
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
          <meta itemProp="name" content="Internet Speed Test: What Download, Upload, and Latency Numbers Mean" />
          <meta
            itemProp="description"
            content="What the three speed test metrics mean for real use cases, why your test result differs from your ISP's advertised speed, and how to get a more accurate baseline."
          />
          <meta itemProp="datePublished" content="2024-04-10" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What the numbers mean */}
          <section aria-labelledby="what-numbers-mean" className="space-y-4">
            <h2
              id="what-numbers-mean"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What download, upload, and latency actually mean
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Metric</th>
                    <th className="border border-border p-2 text-left font-semibold">What it measures</th>
                    <th className="border border-border p-2 text-left font-semibold">Matters most for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Download speed (Mbps)', 'How fast data arrives from the internet to your device', 'Streaming (4K needs ~25 Mbps), large file downloads, web browsing'],
                    ['Upload speed (Mbps)', 'How fast data leaves your device to the internet', 'Video calls (Zoom needs ~3 Mbps up), uploading files, sending email attachments'],
                    ['Latency / Ping (ms)', 'Round-trip time for a packet to reach a server and return', 'Online gaming (<50ms ideal), video calls, VoIP quality'],
                    ['Jitter (ms)', 'Variation in latency between packets', 'Video calls (high jitter = choppy audio), streaming (causes buffering)'],
                  ].map(([metric, measures, matters]) => (
                    <tr key={metric}>
                      <td className="border border-border p-2 font-medium text-foreground">{metric}</td>
                      <td className="border border-border p-2 text-muted-foreground">{measures}</td>
                      <td className="border border-border p-2 text-muted-foreground">{matters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why results differ from advertised speed */}
          <section
            aria-labelledby="why-different"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="why-different"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why your result is lower than the advertised speed
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              ISPs advertise &quot;up to&quot; speeds — the theoretical maximum under ideal
              conditions. Real-world factors that reduce speed: network congestion
              during peak hours (evenings and weekends), WiFi overhead and signal
              interference (a wired Ethernet connection is always faster and more
              consistent), the distance to the speed test server (closer servers
              = lower latency = higher measured throughput for short tests), and
              the number of devices sharing the connection.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For the most accurate baseline: run the test with a wired Ethernet
              connection, close other tabs and apps, run it three times at different
              times of day, and average the results. A single speed test result is
              a snapshot — the average across multiple tests is your true baseline.
              If your wired result is consistently below 80% of your advertised plan
              speed, contact your ISP with the test results as documentation.
            </p>
          </section>

          {/* Speed requirements reference */}
          <section aria-labelledby="speed-reference" className="space-y-4">
            <h2
              id="speed-reference"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Minimum speeds for common activities
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              HD video streaming (Netflix, YouTube 1080p): 5–8 Mbps down per stream.
              4K streaming: 25 Mbps per stream. Zoom video call: 3 Mbps up and down
              for HD, 1.5 Mbps for 720p. Remote desktop (full-screen RDP/VNC): 5–10
              Mbps for smooth experience. Online gaming: download speed matters less
              than latency — 20 Mbps is more than enough; keep latency under 50ms and
              jitter under 10ms for competitive play.
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
                  { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Internet Speed Test</strong> is a fully private,
            browser-based tool that measures your real internet connection performance  ,
            including <strong>download speed</strong>, <strong>upload speed</strong>,
            <strong>ping (latency)</strong>, and <strong>jitter</strong> — using HTTP
            throughput testing against a CDN endpoint. All processing runs locally on your
            device — your IP address and test results never leave your computer. The fastest
            free way to check your internet speed in 2026, with no installs, no accounts,
            and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}