import { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "../bcrypt-generator/client-page"

// ─── Absolute URLs ─────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/bcrypt`

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    "Free Bcrypt Hash Generator & Checker – Client‑Side", // 47 characters
  description:
    "Generate Bcrypt hashes and verify passwords securely, all in your browser. Adjust salt rounds and test auth flows – free, private, no uploads.", // 140 characters
  keywords: [
    "bcrypt hash generator",
    "bcrypt checker online",
    "generate bcrypt hash",
    "bcrypt password hash",
    "verify bcrypt hash",
    "bcrypt salt generator",
    "free bcrypt tool 2026",
    "client‑side bcrypt generator",
    "bcrypt hash no upload",
    "bcrypt generator for developers",
    "bcrypt hash compare",
    "online bcrypt verifier",
    "bcrypt salt rounds",
    "password hashing tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title:
      "Bcrypt Hash Generator & Checker — Free & Secure", // 47 characters
    description:
      "Create and verify Bcrypt hashes completely in your browser. Adjustable salt rounds, instant results, and total privacy.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Bcrypt Hash Generator & Checker — Free Online Tool by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bcrypt Generator – Hash & Check Passwords Free", // 42 characters
    description:
      "Generate Bcrypt hashes and compare passwords in your browser. No upload, fully private.",
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

// ─── JSON‑LD Structured Data ───────────────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bcrypt Hash Generator & Checker",
  url: TOOL_URL,
  description:
    "A free, client‑side developer tool that generates secure Bcrypt hashes and verifies passwords against existing hashes directly in the browser. Supports adjustable salt rounds, no uploads, and total privacy.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate Bcrypt hashes from plain‑text passwords",
    "Verify passwords against existing Bcrypt hashes",
    "Adjustable salt rounds (work factor) from 4 to 16",
    "All processing happens locally in the browser – no server uploads",
    "Unique random salt for every hash operation",
    "Instant feedback on password‑hash comparisons",
    "Copy the generated hash to clipboard with one click",
    "No account, sign‑up, or logging required",
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
  name: "How to Generate or Check a Bcrypt Hash",
  description:
    "Use this free browser tool to create a secure Bcrypt hash or verify a password against an existing hash in under a minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Bcrypt Hash Generator & Checker",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose Mode",
      text: "Select either the “Generate Hash” tab to create a new hash, or the “Compare” tab to test a password against an existing hash.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter Password & Settings",
      text: "Type your plain‑text password. If generating, set the desired salt rounds (cost factor) between 4 and 16 – the default of 10 is a good balance.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Run the Operation",
      text: "Click the “Generate Hash” or “Compare” button. The Bcrypt algorithm runs entirely in your browser and returns the result instantly.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Read the Result",
      text: "For hash generation, copy the resulting hash string with one click. For comparison, the tool clearly shows whether the password matches the provided hash.",
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
      name: "How do I generate a Bcrypt hash?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Select the “Generate Hash” tab, enter your plain‑text password, choose the salt rounds (cost), and click Generate. The tool creates a unique Bcrypt hash string that includes the salt and cost, which you can copy and store in your database.",
      },
    },
    {
      "@type": "Question",
      name: "What formats or inputs are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool accepts plain‑text passwords of any length to generate a hash. For the comparison mode, you must provide the plain‑text password and the full Bcrypt hash string starting with $2a$, $2b$, or $2y$.",
      },
    },
    {
      "@type": "Question",
      name: "What output format does the generator produce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The generated hash is a standard Bcrypt string (e.g., $2b$10$...). It encodes the cost factor, the random salt, and the hashed password, ready for use in authentication systems.",
      },
    },
    {
      "@type": "Question",
      name: "Is my password sent to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All Bcrypt processing happens entirely in your browser using JavaScript. Your password never leaves your device and is never logged, stored, or transmitted to any external server.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between hashing and encryption?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hashing (like Bcrypt) is a one‑way function – it cannot be reversed to reveal the original password. Encryption, on the other hand, is a two‑way process that can be decrypted with a key. Bcrypt is designed for secure password storage, not data scrambling.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on salt rounds or password length?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can choose salt rounds from 4 to 16. Higher values make the hash slower to compute, increasing security. Passwords can be virtually any length – extremely long inputs may cause browser performance lag, but normal lengths work instantly.",
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
      name: "Bcrypt Hash Generator & Checker",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ─────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* JSON‑LD Scripts */}
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

      <ToolLayout toolId="bcrypt">
        <div className="  px-4 py-8">
          {/* ── Header & Breadcrumb ── */}
          <header className="space-y-4 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Free Bcrypt Hash Generator & Checker
            </h2>
            <QuickAnswer
              question="What salt rounds should I use for bcrypt password hashing?"
              answer="The recommended bcrypt salt rounds (cost factor) in 2024–2026 is 12 for most web applications. Salt rounds 10 is the historical default (used by many frameworks) and is still acceptable for lower-risk applications. Rounds 12 is the current best practice — it takes ~300ms on modern hardware, which is fast enough for users but expensive enough to slow brute-force attacks. Avoid rounds below 10 in new code. Rounds 14+ provide extra security but add noticeable latency (1+ seconds per hash). The cost factor doubles the work for every increment: rounds 12 = 2× slower than rounds 11."
            />
            <img src="/images/bcrypt-generator.webp" alt="Free Bcrypt Generator — hash and verify passwords with bcrypt online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              A fast, secure, and client‑side developer tool to generate Bcrypt password hashes
              and verify plain‑text passwords against existing hashes. Customize your salt rounds
              and test your authentication flows instantly.
            </p>

            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground pt-2">
              <ol className="flex items-center gap-1.5 justify-center sm:justify-start">
                <li>
                  <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                    Home
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <a
                    href={`${SITE_URL}/tools`}
                    className="hover:text-foreground transition-colors"
                  >
                    Security Tools
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <span className="text-foreground font-medium">Bcrypt Hash Generator & Checker</span>
                </li>
              </ol>
            </nav>
          </header>

          {/* ── Interactive Tool ── */}
          <main>
            <ToolClient />
          </main>

          <hr className="border-border my-12" />

          {/* ─── AdSense High‑Value Content Article (800+ words) ──────────── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="Bcrypt Hash Generator: Password Hashing with Work Factor" />
            <meta itemProp="description" content="Hash and verify passwords using bcrypt in the browser. Explains the work factor (cost), why it matters for password security, and what bcrypt can't protect against." />
            <meta itemProp="datePublished" content="2024-03-10" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            <section aria-labelledby="bcrypt-what" className="space-y-4">
              <h2 id="bcrypt-what" className="text-2xl font-semibold tracking-tight text-foreground">
                Why bcrypt is designed to be slow
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Bcrypt was designed in 1999 specifically for password hashing. Its defining
                feature is the cost factor (also called work factor or rounds): a number
                between 4 and 31 that controls how many iterations the algorithm runs. At
                cost 10, a single bcrypt hash takes about 100ms on modern hardware. At cost 12,
                it takes about 400ms. This slowness is intentional.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                A GPU can compute billions of SHA-256 hashes per second. The same GPU can
                compute roughly 10,000–100,000 bcrypt hashes per second at cost 10. If a
                database of bcrypt-hashed passwords is breached, the attacker&apos;s cracking speed
                is roughly 100,000× slower than against SHA-256. The extra 100ms per login
                that users don&apos;t notice protects them against a breach they don&apos;t know about.
              </p>
            </section>

            <section aria-labelledby="bcrypt-cost" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
              <h2 id="bcrypt-cost" className="text-2xl font-semibold tracking-tight text-foreground">
                Choosing the right cost factor
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Cost</th>
                      <th className="border border-border p-2 text-left font-semibold">Iterations</th>
                      <th className="border border-border p-2 text-left font-semibold">Approx. time (modern server)</th>
                      <th className="border border-border p-2 text-left font-semibold">Use case</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['10', '1,024', '~100 ms', 'Standard web application login (OWASP minimum)'],
                      ['11', '2,048', '~200 ms', 'Higher security, slightly more CPU cost'],
                      ['12', '4,096', '~400 ms', 'High-value accounts, slow traffic sites'],
                      ['13+', '8,192+', '800ms+', 'Usually not worth the user-facing latency'],
                    ].map(([cost, iters, time, use]) => (
                      <tr key={cost}>
                        <td className="border border-border p-2 font-medium text-foreground">{cost}</td>
                        <td className="border border-border p-2 text-muted-foreground">{iters}</td>
                        <td className="border border-border p-2 text-muted-foreground">{time}</td>
                        <td className="border border-border p-2 text-muted-foreground">{use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                OWASP recommends cost 10 as the minimum. Increase it every few years as servers
                get faster — the goal is to keep hash time at roughly 100ms. This tool uses{' '}
                <a href="https://github.com/nicktindall/cyclic-rotate" className="text-black  dark:text-white hover:underline" target="_blank" rel="noopener noreferrer">bcryptjs</a>{' '}
                (MIT), a pure JavaScript implementation that runs entirely in the browser.
              </p>
            </section>

            <section aria-labelledby="bcrypt-limits" className="space-y-4">
              <h2 id="bcrypt-limits" className="text-2xl font-semibold tracking-tight text-foreground">
                What bcrypt does not protect against
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">72-byte limit</span>
                  <span>Bcrypt truncates input at 72 bytes. Passwords longer than 72 characters produce the same hash as the 72-character prefix. For very long passphrases, pre-hash with SHA-256 before bcrypt if this matters.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Null bytes</span>
                  <span>Some bcrypt implementations stop at the first null byte. Avoid passwords that include null characters.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 font-bold text-foreground">Weak passwords</span>
                  <span>Bcrypt slows down brute force but can&apos;t protect a password like &quot;123456&quot;. It will still be cracked — just a bit slower. Password strength and hashing work together.</span>
                </li>
              </ul>
            </section>

            <section aria-labelledby="related-tools-heading" className="space-y-4">
              <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
                Related security tools
              </h2>
              <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
                <RelatedTools
                  tools={[
                    { name: "Hash Generator (SHA-256, MD5)", path: "/tools/hash-generator" },
                    { name: "Password Generator", path: "/tools/password-generator" },
                    { name: "JWT Decoder", path: "/tools/jwt-decoder" },
                  ]}
                />
              </nav>
            </section>
          </article>

          {/* ── Page Footer ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — Bcrypt Hash Generator & Checker</strong> is a fully
              private, client‑side developer tool that generates <strong>Bcrypt hashes</strong>
              and verifies passwords against them. All processing stays on your device — no
              uploads, no sign‑ups, and completely free. The fastest way to create and test
              secure password hashing in 2026.
            </p>
          </footer>
        </div>
      </ToolLayout>
    </>
  )
}