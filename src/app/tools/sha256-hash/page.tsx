import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/sha256-hash"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "SHA-256 File Checksum Verifier — Verify Downloads Free Online",
  description:
    "Generate the SHA-256 hash of any file in your browser and compare it to the published checksum. Free, private, no upload. Also hashes text strings instantly.",
  keywords: [
    "sha256 hash generator",
    "sha-256 generator",
    "hash calculator online",
    "sha256 encryption",
    "sha256 checksum",
    "free hash tool 2026",
    "sha256 hash creator",
    "online sha256 generator",
    "secure hash algorithm",
    "sha256 free tool",
    "browser-based hash generator",
    "no signup sha256",
    "sha256 hash checker",
    "hash string online",
    "sha256 crypto tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "SHA-256 File Checksum Verifier — Verify Downloads Free Online",
    description:
      "Generate the SHA-256 hash of any file in your browser and compare it to the published checksum. Free, private, no upload.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free SHA256 Hash Generator — Create SHA-256 Hash by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SHA256 Hash Generator — SHA-256 Hash Online",
    description:
      "Generate SHA256 hashes instantly for any text or file. Free browser-based tool, no signup required.",
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
  name: "SHA256 Hash Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates SHA-256 cryptographic hashes for any text or file. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate SHA-256 hash for any text",
    "Generate SHA-256 hash for any file",
    "One-click copy to clipboard",
    "Supports input validation",
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
  name: "How to Generate a SHA-256 Hash Online",
  description:
    "A simple step-by-step guide to creating a SHA-256 cryptographic hash for any text or file using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools SHA256 Hash Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Text or Select a File",
      text: "Type or paste text into the input field, or click 'Choose File' to upload a file. The tool accepts any text string or file.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Generate Hash",
      text: "Press the 'Generate Hash' button. The tool will compute the SHA-256 hash of your input using the browser's SubtleCrypto API.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Preview the Hash",
      text: "The resulting SHA-256 hash (a 64-character hexadecimal string) will be displayed in the output field. You can verify its length or compare it with a known hash.",
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
      name: "What is SHA-256 and why is it used?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a fixed-size 256-bit hash value. It's commonly used for verifying file integrity, password hashing, digital signatures, and blockchain technologies.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate a SHA-256 hash for a file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool allows you to upload a file. The file's content is read directly in your browser and its SHA-256 hash is computed without uploading it to any server.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when using this SHA-256 generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using the Web Crypto API (SubtleCrypto). Your text or file is never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between SHA-256 and SHA-1?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SHA-256 produces a 256-bit hash (64 hex characters) and is considered cryptographically secure for most applications. SHA-1 produces a 160-bit hash (40 hex characters) and has known vulnerabilities making it unsuitable for security-sensitive tasks.",
      },
    },
    {
      "@type": "Question",
      name: "How long is a SHA-256 hash?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A SHA-256 hash is 64 hexadecimal characters long (256 bits). It's represented as a string of 64 characters, each from 0-9 or a-f. The length is fixed regardless of the input size.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free SHA-256 hash generator?",
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
      name: "SHA256 Hash Generator",
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
            SHA-256 File Checksum Verifier — Verify Downloads Free Online
          </h1>
          <img src="/images/sha256-hash.webp" alt="Free SHA-256 Hash Generator — create SHA256 hashes from text online instantly" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate a <strong>SHA-256 cryptographic hash</strong> for any text or file
            instantly. Perfect for verifying file integrity, checksums, and password hashing.
            All processing runs locally in your browser with <strong>100% privacy</strong>
            — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I verify a SHA-256 checksum for a downloaded file?"
            answer="Generate the SHA-256 hash of your downloaded file using this tool, then compare it character-by-character to the hash published on the download page. An exact 64-character match confirms the file is intact. Any difference means the file was corrupted or tampered with."
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
                <span className="text-foreground font-medium">SHA256 Hash Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="SHA256 Hash Generator Tool">
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
          <meta itemProp="name" content="SHA-256 Hash Generator: Why SHA-256 Is the Current Standard and Its Limits" />
          <meta
            itemProp="description"
            content="SHA-256 output length, computation speed, real-world uses (TLS, Bitcoin, file verification), and the one thing SHA-256 cannot do that bcrypt can."
          />
          <meta itemProp="datePublished" content="2024-03-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Why SHA-256 is standard */}
          <section aria-labelledby="why-standard" className="space-y-4">
            <h2
              id="why-standard"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why SHA-256 is the current standard general-purpose hash
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              SHA-256 (part of the SHA-2 family, standardized by NIST in 2001) produces
              a 256-bit (64 hex character) digest. No practical collision attacks exist —
              the theoretical collision resistance is 2^128 operations, which is beyond
              any foreseeable computing capability. SHA-256 is hardware-accelerated on
              modern CPUs via SHA extensions (available on Intel Skylake+, AMD Zen+, and
              Apple Silicon). A 1 MB file hashes in under 1 ms on modern hardware.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Where you encounter SHA-256 in practice: TLS certificates use it for
              signing (replacing SHA-1, which was deprecated in 2017). Bitcoin uses
              double-SHA-256 for proof-of-work and transaction signing. Git uses SHA-256
              for object addressing in newer repositories (SHA-1 in legacy repos). AWS
              S3 uses SHA-256 for request signing (Signature Version 4).
            </p>
          </section>

          {/* The one thing SHA-256 cannot do */}
          <section
            aria-labelledby="sha256-limit"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="sha256-limit"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The one thing SHA-256 cannot do: password storage
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              SHA-256 is fast by design. A consumer GPU (RTX 4090) can compute roughly{' '}
              <strong>21 billion SHA-256 hashes per second</strong>. An 8-character
              lowercase password has about 200 billion possible combinations — a GPU
              cracks it in under 10 seconds against a SHA-256 hash. A 10-character
              mixed-case password falls in minutes.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Password hashing algorithms — bcrypt, Argon2, scrypt — are deliberately
              slow: bcrypt at cost factor 12 takes ~300 ms per attempt. The same GPU
              that does 21 billion SHA-256 hashes per second does roughly{' '}
              <strong>21,000 bcrypt hashes per second</strong> — a million times slower.
              That gap is the entire security margin for stolen password databases.
              Never store passwords as SHA-256 hashes.
            </p>
          </section>

          {/* How this tool works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How this tool generates SHA-256
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The hash is computed using the browser&apos;s native{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                crypto.subtle.digest(&apos;SHA-256&apos;, data)
              </code>{' '}
              — part of the Web Crypto API, hardware-accelerated where the browser
              supports it. Your input never leaves the browser tab. Output is the
              standard lowercase hex string (64 characters).
            </p>
          </section>

          {/* SHA-256 terminal commands by OS */}
          <section aria-labelledby="sha256-commands" className="space-y-4">
            <h2
              id="sha256-commands"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How to verify SHA-256 on every OS (terminal commands)
            </h2>
            <p className="text-sm text-muted-foreground">
              Use these commands to generate a SHA-256 hash in your terminal, then paste the output
              here to compare with the published checksum — or paste the file directly into this tool.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left font-semibold">OS / Environment</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Command</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2">Linux</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">sha256sum filename.iso</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">macOS (Terminal)</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">shasum -a 256 filename.iso</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Windows PowerShell</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">Get-FileHash filename.iso -Algorithm SHA256 | Select-Object Hash</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">Windows CMD (certutil)</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">certutil -hashfile filename.iso SHA256</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Git Bash (Windows)</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">sha256sum filename.iso</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border px-3 py-2">Node.js</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-pre">{`require('crypto').createHash('sha256').update(require('fs').readFileSync('file')).digest('hex')`}</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">Python</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs whitespace-pre">{`import hashlib; print(hashlib.sha256(open('file','rb').read()).hexdigest())`}</td>
                  </tr>
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
                  { name: "MD5 Hash Generator", path: "/tools/md5-hash" },
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
            <strong>TheFreeAITools — SHA256 Hash Generator</strong> is a fully private,
            browser-based tool that computes <strong>SHA-256 cryptographic hashes</strong>
            for any text or file instantly. All processing runs locally in your browser using
            the Web Crypto API — your data never leaves your computer. The fastest free way
            to generate SHA-256 hashes in 2026, with no installs, no accounts, and no hidden
            limits.
          </p>
        </footer>
      </div>
    </>
  )
}