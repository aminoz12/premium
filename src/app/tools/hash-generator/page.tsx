import type { Metadata } from "next"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ClientPage from "./client-page"

// ─── Absolute URLs ───────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/hash-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── Metadata (merged with buildToolMetadata, overriding as needed) ──────────
const baseMetadata = buildToolMetadata("hash-generator")

export const metadata: Metadata = {
  ...baseMetadata,
  title: "SHA-256 Hash Generator — Verify File Checksum Free Online",
  description:
    "Generate SHA-256 hash from any text or file and verify checksums instantly. Compare expected vs. actual hash to confirm file integrity. 100% browser-based — your file never leaves your device.",
  keywords: [
    "sha256 hash generator",
    "sha-256 hash calculator",
    "free sha256 hashing tool",
    "sha256 online generator",
    "sha256 file hash generator",
    "sha256 text hash tool",
    "generate sha256 checksum",
    "online sha256 encoder",
    "browser-based sha256",
    "sha256 no upload",
    "sha256 privacy tool",
    "best sha256 generator 2026",
    "sha256 cryptographic hash",
  ],
  alternates: {
    ...(baseMetadata.alternates as Record<string, unknown>),
    canonical: TOOL_URL,
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Free SHA-256 Hash Generator — Create Hashes from Text or Files",
    description:
      "Instantly compute SHA-256 digests for any input. 100% client-side privacy , no file uploads. Supports text and file hashing, ideal for developers and security checks.",
    url: TOOL_URL,
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "SHA-256 Hash Generator — Free Online Calculator by TheFreeAITools",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    card: "summary_large_image",
    title: "Free SHA-256 Hash Tool: Generate Hashes Instantly",
    description:
      "Get SHA-256 hashes from text or files without uploading anything. Works offline in your browser , fast, secure, and completely free.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },
}

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────
const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SHA-256 Hash Generator",
  url: TOOL_URL,
  description:
    "A free, privacy-first browser tool that computes SHA-256 cryptographic hashes from text or files. No data is ever sent to a server , all processing stays on your device.",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with SubtleCrypto API support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Hash text strings instantly with one click",
    "Hash files of any size , processed locally, no uploads",
    "Displays SHA-256 digest in hexadecimal format",
    "Copy hash to clipboard with a single tap",
    "Supports drag-and-drop file hashing for convenience",
    "No server-side processing, ensuring complete data privacy",
    "Works offline once the page is loaded",
    "No account, no sign-up, no paywalls",
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
  name: "How to Generate a SHA-256 Hash",
  description:
    "Follow these four simple steps to create a SHA-256 hash from any text or file using our free online tool. The entire process takes less than a minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools SHA-256 Hash Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Text or Upload a File",
      text: "Type or paste your text into the input field, or drag & drop a file onto the upload area. The tool prepares the data entirely in your browser; nothing is transmitted.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Compute the Hash",
      text: "Click the 'Generate Hash' button. The browser’s SubtleCrypto API instantly computes the SHA-256 digest without any server interaction.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "View and Copy the Hash",
      text: "The resulting 64-character hexadecimal hash is displayed. Use the copy button to save it to your clipboard for later use in checksums or verifications.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Repeat or Verify",
      text: "Generate additional hashes by entering new text or uploading another file. Each computation is performed locally and instantly.",
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
      name: "How do I use the SHA-256 Hash Generator for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Just type or paste your text, or upload a file. The tool computes the SHA-256 hash locally in your browser and displays it instantly. No uploads, no fees, and no account are needed.",
      },
    },
    {
      "@type": "Question",
      name: "Can I hash a file, and is it safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can drag & drop any file onto the page. All processing happens inside your browser using the SubtleCrypto API. Your file never leaves your device, ensuring complete privacy.",
      },
    },
    {
      "@type": "Question",
      name: "What output format does the SHA-256 hash use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The hash is displayed as a 64-character hexadecimal string, which is the standard representation for SHA-256 digests. You can copy it directly for use in checksums or verifications.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool send my data to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. The entire SHA-256 computation runs locally in your browser. No text or file content is ever uploaded, transmitted, or stored on any server.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between SHA-256 and SHA-512?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both are secure cryptographic hash functions, but SHA-256 produces a 256-bit digest while SHA-512 produces a 512-bit digest (longer hash). SHA-256 is sufficient for most applications, offering excellent security with shorter output.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any file size limits for the hash generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No artificial limits are enforced. Because processing occurs on your device, the only practical limit is your browser's memory. Files of several gigabytes can be hashed on a modern machine without issue.",
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
      name: "Security Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "SHA-256 Hash Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* JSON-LD Scripts */}
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
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            SHA-256 Hash Generator — Verify File Checksum Free Online
          </h1>
          <QuickAnswer
            question="How do I verify the SHA-256 checksum of a downloaded file?"
            answer="Generate a SHA-256 hash of your downloaded file using this tool, then compare it against the hash published on the official download page. If both hashes match character-for-character, the file is authentic and unmodified. On Linux/macOS run: sha256sum filename. On Windows PowerShell: Get-FileHash filename -Algorithm SHA256. Any mismatch means the file may be corrupted or tampered with."
          />
          <img src="/images/hash-generator.webp" alt="Free SHA-256 Hash Generator — generate cryptographic hashes in your browser" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate SHA-256 cryptographic hashes from any text or file, right in your browser.
            All processing stays on your device , no uploads, no server, no logs. Copy your
            hexadecimal digest and verify file integrity in seconds.
          </p>

          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li>
                <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">
                  Security Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">SHA-256 Hash Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="SHA-256 Hash Generator">
           <ClientPage />
        </main>

        <hr className="border-border my-12" />

        {/* ── AdSense High-Value Article ── */}
        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Hash Generator: MD5, SHA-1, SHA-256, SHA-512 in the Browser" />
          <meta itemProp="description" content="Generate cryptographic hashes client-side. Explains what hashing is vs encryption, which algorithm to use, and honest limitations for each." />
          <meta itemProp="datePublished" content="2024-02-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="hash-what" className="space-y-4">
            <h2 id="hash-what" className="text-2xl font-semibold tracking-tight text-foreground">
              What hashing is — and why it&apos;s different from encryption
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Hashing is one-way: you can turn any input into a fixed-length digest, but
              you can&apos;t reverse the process. Encryption is two-way: you encrypt with a key
              and decrypt with a key. Hashing has no key — there is nothing to reverse with.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The practical consequence: if you hash a password and store the hash, you
              verify future logins by hashing the entered password and comparing the hashes.
              You never store the original password and never need it again. This is how
              secure authentication works. (Note: for passwords specifically, use bcrypt or
              Argon2 rather than SHA-256 — see the limitations section.)
            </p>
          </section>

          <section aria-labelledby="hash-which" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="hash-which" className="text-2xl font-semibold tracking-tight text-foreground">
              Which algorithm to use and when
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Algorithm</th>
                    <th className="border border-border p-2 text-left font-semibold">Output length</th>
                    <th className="border border-border p-2 text-left font-semibold">Good for</th>
                    <th className="border border-border p-2 text-left font-semibold">Avoid for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MD5', '128 bits (32 hex)', 'File integrity checksums (non-security)', 'Passwords, signatures, anything security-critical'],
                    ['SHA-1', '160 bits (40 hex)', 'Legacy checksums, Git commit IDs', 'New security applications (collision attacks exist)'],
                    ['SHA-256', '256 bits (64 hex)', 'File integrity, API request signing, token generation', 'Passwords (no work factor — use bcrypt)'],
                    ['SHA-512', '512 bits (128 hex)', 'When extra collision resistance is needed', 'Passwords (still too fast to brute-force)'],
                  ].map(([alg, len, good, avoid]) => (
                    <tr key={alg}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{alg}</td>
                      <td className="border border-border p-2 text-muted-foreground">{len}</td>
                      <td className="border border-border p-2 text-muted-foreground">{good}</td>
                      <td className="border border-border p-2 text-muted-foreground">{avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              The tool uses the Web Crypto API&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.subtle.digest()</code>{' '}
              — the browser&apos;s native, hardware-accelerated hash implementation. All processing
              is client-side; your input never leaves your device.
            </p>
          </section>

          <section aria-labelledby="hash-limits" className="space-y-4">
            <h2 id="hash-limits" className="text-2xl font-semibold tracking-tight text-foreground">
              When NOT to use SHA-256 for passwords
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              SHA-256 is very fast — modern GPUs can compute billions of SHA-256 hashes per
              second. For file integrity checks, this is fine. For passwords, it means an
              attacker with a GPU cluster can brute-force a SHA-256 password hash database
              in hours or days.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Password hashing functions like bcrypt, scrypt, and Argon2 are intentionally
              slow — they have a configurable work factor that makes each hash computation
              take 100ms or more. The same GPU that can compute billions of SHA-256 hashes
              per second can only compute thousands of bcrypt hashes per second. Use our{' '}
              <a href="/tools/bcrypt" className="text-black  dark:text-white hover:underline">Bcrypt tool</a>{' '}
              for password hashing.
            </p>
          </section>

          {/* File checksum verification section */}
          <section aria-labelledby="checksum-verify" className="space-y-4">
            <h2
              id="checksum-verify"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How to verify a file checksum with SHA-256
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Software publishers post expected SHA-256 checksums next to download links.
              After downloading, hash the file here and compare — if the hashes match,
              the file is intact and unmodified. If they differ, the file is corrupted
              or tampered. Here&apos;s where to find the published checksum for common downloads:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Software / source</th>
                    <th className="border border-border p-2 text-left font-semibold">Hash algorithm used</th>
                    <th className="border border-border p-2 text-left font-semibold">Where to find the expected hash</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Ubuntu ISO', 'SHA-256', 'SHA256SUMS file on the download page'],
                    ['Node.js release', 'SHA-256', 'SHASUMS256.txt file on nodejs.org/dist'],
                    ['Python release', 'MD5 + SHA-256', 'Table on python.org/downloads'],
                    ['Windows ISO (Microsoft)', 'SHA-256', 'Listed on the official ISO download page'],
                    ['macOS software (Homebrew)', 'SHA-256', 'Formula file in homebrew-core repo'],
                    ['GitHub release asset', 'SHA-256', 'checksums.txt attached to the release page'],
                    ['Docker image digest', 'SHA-256', 'docker inspect or Docker Hub → Tags tab'],
                  ].map(([software, algo, where]) => (
                    <tr key={software}>
                      <td className="border border-border p-2 font-medium text-foreground">{software}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{algo}</td>
                      <td className="border border-border p-2 text-muted-foreground">{where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              You can also verify from the terminal:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">sha256sum filename</code>{' '}
              on Linux/Mac or{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                Get-FileHash filename -Algorithm SHA256
              </code>{' '}
              in PowerShell. This browser tool is faster for one-off checks without opening a terminal.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related security tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Bcrypt Password Hasher", path: "/tools/bcrypt" },
                  { name: "Password Generator", path: "/tools/password-generator" },
                  { name: "Base64 Encoder", path: "/tools/base64-encoder" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Footer Summary ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools SHA-256 Hash Generator</strong> is a 100% client-side cryptographic
            utility that creates secure <strong>SHA-256 digests</strong> from any text or file directly in
            your browser. No data is ever uploaded to a server , your information stays on your device. In
            2026, it remains one of the fastest, most private ways to generate <strong>SHA-256 hashes</strong>,
            perfect for checksums, file integrity checks, and password verification.
          </p>
        </footer>
      </div>
    </>
  )
}