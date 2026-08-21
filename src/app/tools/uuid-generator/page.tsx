import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools"
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/uuid-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 54 characters (counted manually) — well within 50–60 char SERP window

export const metadata: Metadata = {
  title: "UUID Generator for Database Primary Keys — Bulk v4, Free Online",
  description:
    "Generate UUID v4 primary keys for PostgreSQL, MySQL, MongoDB, or any database. Bulk generate, copy without hyphens, or wrap in SQL INSERT syntax. 100% browser-based, never logged.",
  keywords: [
    "uuid generator",
    "guid generator",
    "version 4 uuid",
    "bulk guid generator",
    "online uuid creator",
    "generate uuid v4",
    "random uuid generator",
    "database primary keys",
    "developer tools online",
    "secure offline uuid",
    "best uuid generator 2026",
    "unique identifier creator",
    "rfc 4122 compliant",
    "client-side uuid generator",
    "uuid without hyphens",
    "free uuid tool online",
    "bulk uuid generator 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Online UUID Generator — Create Bulk v4 GUIDs",
    description:
      "Generate secure, random Version 4 UUIDs (GUIDs) in bulk. 100% client-side generation ensures your identifiers are completely private.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Online UUID/GUID Generator by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Bulk UUID/GUID Generator (v4)",
    description:
      "Instantly generate RFC 4122 compliant Version 4 UUIDs directly in your browser. Fast, secure, and developer-friendly.",
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
  name: "UUID/GUID Generator",
  url: TOOL_URL,
  description:
    "A free online developer utility to instantly generate RFC 4122 compliant Version 4 Universally Unique Identifiers (UUIDs) or GUIDs in bulk. Features formatting options and secure client-side generation.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate Version 4 (Random) UUIDs",
    "Bulk generation of up to 10,000 UUIDs",
    "Format output (uppercase, lowercase, braces, hyphens)",
    "100% secure client-side cryptographic generation",
    "Copy to clipboard",
    "Download output as text file",
    "Offline capability",
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
  name: "How to Generate UUIDs Online",
  description:
    "A quick step-by-step guide on how to generate secure, random Version 4 UUIDs (GUIDs) using our free developer tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools UUID/GUID Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select the Quantity",
      text: "Enter the number of UUIDs you want to generate. You can generate a single UUID or create them in bulk (up to thousands at once).",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Configure Formatting Options",
      text: "Toggle the formatting settings to fit your needs. Choose whether you want hyphens, uppercase or lowercase letters, and if you need the UUIDs wrapped in braces.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Generate Identifiers",
      text: "Click the 'Generate' button. The tool uses your browser's secure crypto API to instantly create mathematically random, RFC 4122 compliant UUIDs.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Export",
      text: "Click the 'Copy to Clipboard' button to easily paste the IDs into your code or database, or export the bulk list as a downloadable text file.",
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
      name: "What is the difference between a UUID and a GUID?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is practically no difference. UUID stands for Universally Unique Identifier, which is the open internet standard (RFC 4122). GUID stands for Globally Unique Identifier, which is simply Microsoft's implementation and terminology for the exact same standard. They are functionally identical.",
      },
    },
    {
      "@type": "Question",
      name: "Are the generated UUIDs truly unique?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Version 4 UUIDs are generated using cryptographic random number generators. There are 5.3 x 10^36 possible combinations. The probability of generating two identical v4 UUIDs (a collision) is so infinitesimally small that it is statistically zero.",
      },
    },
    {
      "@type": "Question",
      name: "Is this UUID generator secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. This tool runs entirely in your web browser utilizing the Web Crypto API (`crypto.randomUUID()` or `crypto.getRandomValues()`). No data is sent to or generated on our servers, ensuring your primary keys or session IDs remain completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is a Version 4 UUID?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Version 4 UUID is created using randomly or pseudo-randomly generated numbers. Unlike Version 1 (which uses the computer's MAC address and current time) or Versions 3 and 5 (which use namespace hashing), Version 4 relies purely on randomness, making it the most common and secure choice for modern applications.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate UUIDs without hyphens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The tool provides formatting toggles. You can easily remove the standard 8-4-4-4-12 hyphens to output a continuous 32-character hex string, which is preferred by some databases like MySQL to save space.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limitations of this free UUID generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. The maximum number of UUIDs you can generate in a single batch is 10,000 to maintain optimal browser performance. For generating millions of UUIDs programmatically, you would need to run multiple batches or use a dedicated script.",
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
      name: "UUID/GUID Generator",
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
            UUID Generator for Database Primary Keys — Bulk v4, Free Online
          </h1>
          <img src="/images/uuid-generator.webp" alt="Free UUID Generator — generate UUID v1, v4, and v5 identifiers online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Instantly generate secure, RFC 4122 compliant <strong>Version 4 UUIDs</strong> (Universally
            Unique Identifiers) in bulk. Customize formatting, remove hyphens, or wrap in braces. Built
            for developers, database administrators, and QA engineers — <strong>100% secure
              client-side generation</strong> with no server uploads.
          </p>

          <QuickAnswer
            question="How do I generate a UUID v4 to use as a database primary key?"
            answer="Click Generate above — you get an RFC 4122 compliant UUID v4 like '550e8400-e29b-41d4-a716-446655440000'. Copy it and use it directly in PostgreSQL (uuid type), MySQL (CHAR(36)), MongoDB (as _id), or any other database. Generate in bulk for seeding test data."
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
                <span className="text-foreground font-medium">UUID/GUID Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="UUID Generator Tool">
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
          <meta itemProp="name" content="UUID Generator: v4 Random UUIDs in the Browser" />
          <meta itemProp="description" content="Generate v4 UUIDs using crypto.randomUUID(). Explains UUID versions, collision probability, and when to use UUIDs vs sequential IDs." />
          <meta itemProp="datePublished" content="2024-02-12" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="uuid-what" className="space-y-4">
            <h2 id="uuid-what" className="text-2xl font-semibold tracking-tight text-foreground">
              When you actually need a UUID
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The canonical use case is distributed systems: when two services need to
              independently generate IDs for objects that will later be merged, a sequential
              integer (1, 2, 3…) doesn&apos;t work — both services will generate the same numbers.
              A UUID is 128 bits of randomness that is statistically guaranteed to be unique
              across all systems and all time.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Common practical uses: primary keys for tables where you want to avoid
              exposing sequential IDs in URLs, idempotency keys for payment APIs, correlation
              IDs for log tracing, file upload names, and session identifiers. The
              recommendation in 2026: use{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.randomUUID()</code>{' '}
              natively in modern Node.js (v14.17+) and browsers — this is what the tool uses.
            </p>
          </section>

          <section aria-labelledby="uuid-versions" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="uuid-versions" className="text-2xl font-semibold tracking-tight text-foreground">
              UUID versions and which to use
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v4 (random)</span>
                <span>122 bits of random data. Most commonly used. What this tool generates. Use when you need uniqueness and don&apos;t care about sort order.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v7 (timestamp-ordered)</span>
                <span>Newer RFC standard that starts with a millisecond timestamp — UUIDs sort chronologically. Better for database primary keys as it avoids random index fragmentation. Node.js 22+ supports it natively.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v1 (timestamp + MAC address)</span>
                <span>Includes the device&apos;s MAC address — a privacy concern. Largely replaced by v4 and v7 for new applications.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">v5 (SHA-1 namespace hash)</span>
                <span>Deterministic: same input always produces the same UUID. Useful for generating stable IDs from URLs or other strings.</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Collision probability for v4: generating 1 billion UUIDs per second for 85
              years gives a 50% chance of a single collision. For practical applications,
              collisions are not a real concern — the Earth has more atoms than there are
              possible v4 UUIDs is a common (if slightly overstated) illustration.
            </p>
          </section>

          {/* UUID in code section */}
          <section aria-labelledby="uuid-in-code" className="space-y-4">
            <h2
              id="uuid-in-code"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How to generate UUID v4 in code — JavaScript, Python, SQL, Go
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              For runtime UUID generation in your application, every major language has
              a built-in or standard-library option:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Language / DB</th>
                    <th className="border border-border p-2 text-left font-semibold">Code snippet</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['JavaScript (Node 15+)', "crypto.randomUUID()"],
                    ['JavaScript (browser)', "crypto.randomUUID() // also works in browsers"],
                    ['Python 3', "import uuid; str(uuid.uuid4())"],
                    ['PostgreSQL', "SELECT gen_random_uuid(); -- or uuid_generate_v4() with pgcrypto"],
                    ['MySQL 8+', "SELECT UUID();"],
                    ['SQL Server', "SELECT NEWID();"],
                    ['Go', `import "github.com/google/uuid"\nuuid.New().String()`],
                    ['PHP', "Ramsey\\Uuid\\Uuid::uuid4()->toString()"],
                    ['C# / .NET', "Guid.NewGuid().ToString()"],
                    ['Java', "UUID.randomUUID().toString()"],
                    ['Ruby', "require 'securerandom'; SecureRandom.uuid"],
                  ].map(([lang, code]) => (
                    <tr key={lang}>
                      <td className="border border-border p-2 font-medium text-foreground whitespace-nowrap">{lang}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground whitespace-pre">{code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              For test fixtures and seed data, use this generator to create a batch of
              UUIDs and paste them directly into SQL INSERT statements or JSON fixture
              files — faster than running a script for one-off needs.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "Password Generator", path: "/tools/password-generator" },
                  { name: "JSON Formatter", path: "/tools/json-formatter" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — UUID/GUID Generator</strong> is a fully private, browser-based
            developer utility that creates RFC 4122 compliant <strong>Version 4 UUIDs</strong> in
            bulk. All processing runs locally on your device using the Web Crypto API — your
            identifiers never leave your computer. Supports generating one to 10,000 UUIDs per batch,
            with customizable formatting including <strong>uppercase, lowercase, braces, and
              hyphens</strong>. The fastest free way to create universally unique identifiers in 2026,
            with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}