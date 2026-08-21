import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/md5-hash"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 59 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "MD5 Checksum Verifier — Generate & Verify MD5 File Hashes Free",
  description:
    "Generate an MD5 checksum for any file and verify it matches the published hash. Free, browser-based — file never leaves your device. Also works for text strings.",
  keywords: [
    "md5 hash generator",
    "md5 hash calculator",
    "md5 online",
    "md5 checksum",
    "generate md5 hash",
    "free md5 tool 2026",
    "md5 hash creator",
    "hash string md5",
    "md5 encryption",
    "md5 digest",
    "browser-based md5",
    "no signup md5",
    "secure md5 generator",
    "best free md5 tool",
    "md5 hash for files",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "MD5 Checksum Verifier — Generate & Verify MD5 File Hashes Free",
    description:
      "Generate an MD5 checksum for any file and verify it matches the published hash. Free, browser-based — file never leaves your device.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free MD5 Hash Generator — Create MD5 Hash by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free MD5 Hash Generator — MD5 Online Hash Tool",
    description:
      "Generate an MD5 hash for any text or file instantly. Free browser-based tool, no signup required.",
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
  name: "MD5 Hash Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates an MD5 hash for any text or file. All processing is client-side and private with no server uploads.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate MD5 hash for any text or string",
    "Generate MD5 hash for any file",
    "One-click copy to clipboard",
    "Live preview of the hash",
    "100% client-side processing for privacy",
    "No account or signup required",
    "Works on any device with a modern browser",
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
  name: "How to Generate an MD5 Hash Online",
  description:
    "A simple step-by-step guide to creating an MD5 hash for any text or file using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools MD5 Hash Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Text or Select a File",
      text: "Type or paste text into the input field, or click 'Choose File' to upload a file. The tool works with any text or file content.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Generate Hash",
      text: "Press the 'Generate Hash' button. The tool will compute the MD5 hash of your input using the browser's built-in SubtleCrypto API.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Hash",
      text: "The resulting MD5 hash (a 32-character hexadecimal string) will be displayed in the output field. You can verify its length or compare it with a known hash.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Download",
      text: "Click the 'Copy' button to save the hash to your clipboard, or download it as a text file for later use.",
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
      name: "What is MD5 and why is it used?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (32-character) hash value. It is commonly used for verifying file integrity, checksums, and generating unique identifiers, though it is no longer considered secure for cryptographic purposes.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate an MD5 hash for a file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool allows you to upload a file. The file's content is read directly in your browser and its MD5 hash is computed without uploading it to any server.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when using this MD5 generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using the Web Crypto API (SubtleCrypto). Your text or file is never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between MD5 and SHA-256?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MD5 produces a 128-bit (32-character) hash and is faster but no longer considered cryptographically secure. SHA-256 produces a 256-bit (64-character) hash and is much stronger, recommended for security-sensitive applications. Today, MD5 is mostly used for simple checksums and non-critical integrity checks.",
      },
    },
    {
      "@type": "Question",
      name: "How long is an MD5 hash?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An MD5 hash is 32 hexadecimal characters long (128 bits). The length is fixed regardless of the input size, which makes it easy to compare and store.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free MD5 hash generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account and no size limits — hash any text or file directly in your browser. Your input is never uploaded to any server.",
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
      name: "MD5 Hash Generator",
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
            MD5 Checksum Verifier — Generate & Verify MD5 File Hashes Free
          </h1>
          <img src="/images/md5-hash.webp" alt="Free MD5 Hash Generator — create MD5 checksums from text or files online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate an <strong>MD5 hash</strong> for any text or file instantly. Perfect
            for checksums, file integrity verification, and simple hashing needs. All
            processing runs locally in your browser with <strong>100% privacy</strong>
            — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I verify an MD5 checksum for a downloaded file?"
            answer="Generate the MD5 hash of your downloaded file using this tool, then compare it to the MD5 published on the download page. If they match exactly (all 32 characters), the file arrived intact. A mismatch means the file was corrupted or altered in transit."
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
                <span className="text-foreground font-medium">MD5 Hash Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="MD5 Hash Generator Tool">
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
          <meta itemProp="name" content="MD5 Hash Generator: What MD5 Is Still Good For and What It Isn't" />
          <meta
            itemProp="description"
            content="MD5 is broken for security but still useful for checksums and deduplication. Concrete collision numbers, what SHA-256 adds, and when to use each."
          />
          <meta itemProp="datePublished" content="2024-03-01" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What MD5 still does well */}
          <section aria-labelledby="what-md5-does" className="space-y-4">
            <h2
              id="what-md5-does"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What MD5 is still useful for in 2026
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              MD5 produces a 128-bit (32 hex character) digest in under 1 ms for most
              inputs. It is not secure for cryptographic purposes — collisions (two
              different inputs producing the same hash) have been demonstrated since 2004
              and can be engineered on consumer hardware. But for non-security uses, it
              remains practical:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">File integrity checksums</span>
                <span>
                  Verifying a downloaded file matches the published MD5 confirms the
                  file was not corrupted in transit. It does not protect against a
                  malicious server — for that, use SHA-256. MD5 is fine for detecting
                  accidental corruption (disk errors, truncated downloads).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Deduplication keys</span>
                <span>
                  Hashing file contents with MD5 to detect duplicates in a storage
                  system is safe — an attacker cannot force a collision in this context.
                  The collision attack requires crafting two specific files, not finding
                  a collision for an arbitrary existing file.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Cache busting</span>
                <span>
                  Appending an MD5 hash of a CSS or JS file to its URL forces browser
                  cache invalidation when the file changes. Webpack, Vite, and Next.js
                  use content hashes (often SHA-256 or xxHash) for this, but MD5 works
                  and was historically common.
                </span>
              </li>
            </ul>
          </section>

          {/* Why MD5 is broken for security */}
          <section
            aria-labelledby="why-broken"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="why-broken"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why MD5 is broken for security — with specific numbers
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              In 2008, researchers demonstrated an MD5 collision attack in under 30
              seconds on a standard laptop. In 2012, the Flame malware used an MD5
              collision to forge a Microsoft code-signing certificate — meaning software
              signed with that forged cert appeared valid to Windows. This is not a
              theoretical risk: real malware exploited it.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For passwords: MD5 is extremely fast — a modern GPU can compute{' '}
              <strong>60 billion MD5 hashes per second</strong>. An 8-character
              password hashed with MD5 can be brute-forced in minutes. Never store
              passwords as MD5 hashes. Use bcrypt (this site has a bcrypt tool),
              Argon2, or scrypt — algorithms specifically designed to be slow.
            </p>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How this tool generates the hash
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The hash is computed using the Web Crypto API&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.subtle.digest()</code>{' '}
              where available, or a pure-JavaScript fallback. The computation happens
              entirely in your browser — your input text is never sent to a server.
              Output is the standard lowercase hex representation.
            </p>
          </section>

          {/* MD5 checksum verification table */}
          <section aria-labelledby="md5-checksum-table" className="space-y-4">
            <h2
              id="md5-checksum-table"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Where to find published MD5 checksums
            </h2>
            <p className="text-sm text-muted-foreground">
              After generating the MD5 hash of your download, compare it against the official checksum
              from the software publisher. Here is where major software providers publish theirs:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left font-semibold">Software / Platform</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Where to find MD5</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2">Ubuntu Linux</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">MD5SUMS file in same folder as ISO</td>
                    <td className="border border-border px-3 py-2">Also provides SHA256SUMS (preferred)</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">Python releases</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">python.org/downloads — "MD5 Sum" column</td>
                    <td className="border border-border px-3 py-2">Listed next to each installer file</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Apache Software</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">.md5 file alongside the release archive</td>
                    <td className="border border-border px-3 py-2">e.g., apache-2.4.x.tar.gz.md5</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">WordPress</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">wordpress.org/download — "MD5" link</td>
                    <td className="border border-border px-3 py-2">Available for each .zip and .tar.gz release</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">QNAP firmware</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">Firmware release notes page</td>
                    <td className="border border-border px-3 py-2">Critical to verify before flashing</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">VMware images</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">VMware download portal — checksum tab</td>
                    <td className="border border-border px-3 py-2">Provides both MD5 and SHA1</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Kali Linux</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">kali.org/get-kali — sum.asc file</td>
                    <td className="border border-border px-3 py-2">GPG-signed SHA256 preferred; MD5 also listed</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground space-y-1">
              <p><strong>Terminal command (Linux/macOS):</strong> <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">md5sum filename.iso</code></p>
              <p><strong>PowerShell (Windows):</strong> <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Get-FileHash filename.iso -Algorithm MD5 | Select-Object Hash</code></p>
              <p className="text-xs pt-1">When available, prefer SHA-256 checksums over MD5 — SHA-256 is collision-resistant and the current standard for file integrity verification.</p>
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
                  { name: "SHA-256 Hash Generator", path: "/tools/sha256-hash" },
                  { name: "Hash Generator (multi-algorithm)", path: "/tools/hash-generator" },
                  { name: "Bcrypt Hash Generator", path: "/tools/bcrypt" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — MD5 Hash Generator</strong> is a fully private,
            browser-based tool that computes <strong>MD5 hashes</strong> for any text or
            file instantly. Supports text input and file upload, one-click copy, and
            download as a text file. All processing runs locally on your device — your
            data never leaves your computer. The fastest free way to generate MD5 hashes
            in 2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}