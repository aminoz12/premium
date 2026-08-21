import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "../bcrypt-generator/client-page"

// ─── Absolute URL constants ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/bcrypt-generator`

// ─── FAQ data (single source of truth — mirrors JSON-LD exactly) ───────────
const FAQ_ITEMS = [
  {
    q: "How do I use the bcrypt generator?",
    a: "Type or paste the password or string you want to hash into the input field, then select a cost factor (work factor) between 4 and 31 using the slider. Click 'Generate Hash' and the bcrypt hash appears instantly in the output box. Click 'Copy' to save it to your clipboard.",
  },
  {
    q: "Which input types and string formats are supported?",
    a: "Any UTF-8 string up to 72 bytes is supported — passwords, passphrases, API secrets, or arbitrary text. Strings longer than 72 bytes are silently truncated by the bcrypt algorithm itself, which is standard behaviour across all bcrypt implementations.",
  },
  {
    q: "What does the output hash look like and what do the parts mean?",
    a: "A bcrypt hash looks like: $2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW. The '$2b$' is the algorithm identifier, '12' is the cost factor (rounds), the next 22 characters are the salt, and the remaining 31 characters are the hash. The full string is self-contained — you do not need to store the salt separately.",
  },
  {
    q: "Is the password sent to a server when I generate a hash?",
    a: "No. All hashing runs entirely in your browser using the bcryptjs JavaScript library compiled to WebAssembly. Your password or secret string is never transmitted, never logged, and never stored on any server. This makes the tool safe for testing real credentials.",
  },
  {
    q: "What is the difference between bcrypt and SHA-256 or MD5?",
    a: "SHA-256 and MD5 are general-purpose cryptographic hash functions — fast by design, which makes them unsuitable for password hashing because attackers can compute billions of hashes per second. bcrypt is a password-specific hash function with a tunable cost factor that deliberately slows computation, making brute-force and dictionary attacks computationally expensive regardless of hardware advances.",
  },
  {
    q: "What cost factor should I use, and is there a limit?",
    a: "A cost factor of 10–12 is the current industry standard for most production applications — high enough to be secure, low enough to hash in under 100ms on modern hardware. Cost factor 4 is the minimum (used only for testing). Cost factor 31 is the maximum but will take minutes to compute. Each increment doubles the computation time: cost 12 takes twice as long as cost 11.",
  },
  {
    q: "Can I verify a password against an existing bcrypt hash?",
    a: "Yes. Paste the plaintext password into the input field and the existing bcrypt hash into the verify field, then click 'Verify'. The tool runs bcrypt's compare function in your browser and tells you whether the password matches the hash — no server required.",
  },
  {
    q: "Is this bcrypt generator free to use?",
    a: "Yes, completely free. No account, no subscription, and no credit card is required. The generator and verifier are both fully available with no usage limits.",
  },
]

// ─── Metadata ──────────────────────────────────────────────────────────────
// Title: "Free Bcrypt Generator: Hash & Verify Passwords" = 50 characters ✓
export const metadata: Metadata = {
  ...buildToolMetadata("bcrypt-generator"),
  title: "Bcrypt Hash Generator — Choose Cost Factor, Hash & Verify Free",
  description:
    "Generate and verify bcrypt password hashes free — no signup, no upload, passwords stay in your browser. Choose cost factor 4–31. Instant, 100% private.",
  keywords: [
    "bcrypt generator",
    "bcrypt hash generator online",
    "bcrypt password hasher free",
    "hash password bcrypt browser",
    "bcrypt verify password online",
    "bcrypt cost factor calculator",
    "password hash generator free",
    "bcrypt generator no signup",
    "online bcrypt tool browser-based",
    "bcrypt generator 2026",
    "bcrypt vs sha256 password hashing",
    "secure password hash generator",
    "bcrypt rounds generator free",
    "generate bcrypt hash no upload",
    "password hashing tool online free",
    "bcrypt work factor generator",
    "bcryptjs online tool",
    "test bcrypt hash online",
    "password security tool free",
    "cryptographic hash generator online",
    "bcrypt salt generator free",
    "compare bcrypt hash online",
    "developer password tool free",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    type: "website",
    url: TOOL_URL,
    title: "Free Bcrypt Generator — Hash & Verify Passwords in Your Browser",
    description:
      "Generate bcrypt hashes with tunable cost factors (4–31) and verify passwords against existing hashes. 100% browser-based — your credentials never leave your device. Free, no account.",
    siteName: "TheFreeAITools",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Bcrypt Generator — TheFreeAITools.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Bcrypt Hash Generator: Secure Passwords in Seconds",
    description:
      "Hash and verify passwords with bcrypt in your browser — cost factor 4–31, instant output, nothing sent to a server. Free, no account.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },
  robots: { index: true, follow: true },
}

// ─── JSON-LD schemas ───────────────────────────────────────────────────────
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Bcrypt Generator",
  url: TOOL_URL,
  description:
    "Browser-based bcrypt hash generator and verifier. Generate secure password hashes with a tunable cost factor from 4 to 31, and verify plaintext passwords against existing bcrypt hashes — entirely in your browser, no server involved.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires JavaScript. Chrome 88+, Firefox 85+, Safari 14+, Edge 88+.",
  featureList: [
    "Bcrypt hash generation with adjustable cost factor from 4 to 31",
    "Password verification — compare a plaintext string against any bcrypt hash",
    "Automatic random salt generation embedded in every output hash",
    "100% browser-based via bcryptjs — password never transmitted to a server",
    "One-click clipboard copy of the generated hash",
    "Real-time cost factor preview showing estimated computation time",
    "Supports any UTF-8 string up to 72 bytes including passphrases and API secrets",
    "No account, login, or subscription required — fully free with no usage limits",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate a Bcrypt Hash Online",
  description:
    "Use the free browser-based bcrypt generator to hash any password or string with a tunable cost factor in under a minute.",
  totalTime: "PT1M",
  tool: [{ "@type": "HowToTool", name: "TheFreeAITools Bcrypt Generator" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Password or String",
      text: "Type or paste the password, passphrase, or arbitrary string you want to hash into the input field. The tool accepts any UTF-8 string up to 72 bytes.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select a Cost Factor",
      text: "Use the cost factor slider to choose a rounds value between 4 and 31. For most production use cases, 10–12 is the recommended range. Each increment doubles the computation time.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Generate the Hash",
      text: "Click the 'Generate Hash' button. The bcrypt library runs entirely in your browser and returns the complete hash string — including algorithm version, cost factor, salt, and digest — in the output box.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Verify",
      text: "Click 'Copy' to save the hash to your clipboard for use in your application. Alternatively, paste an existing bcrypt hash into the verify field and click 'Verify' to test a password against it.",
      url: TOOL_URL,
    },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

const breadcrumbSchema = {
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
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Bcrypt Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <>
        <div className=" ">
          <header className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Bcrypt Hash Generator — Choose Cost Factor, Hash & Verify Free
            </h1>
            <QuickAnswer
              question="What cost factor should I use for bcrypt in production?"
              answer="Use cost factor 10–12 for most production applications. Cost 12 takes roughly 250–400ms to compute on modern hardware — fast enough for user login but slow enough to make brute-force attacks expensive. Cost 4 is for testing only (too fast). Each increment doubles computation time: cost 13 takes twice as long as cost 12. OWASP recommends a minimum of cost 10 as of 2024."
            />
            <img src="/images/bcrypt-generator.webp" alt="Free Bcrypt Generator — hash and verify bcrypt passwords in your browser" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Generate secure <strong>bcrypt password hashes</strong> with a
              tunable cost factor (4–31) and verify plaintext passwords against
              existing hashes — entirely in your browser. Your password is never
              transmitted to any server. Free, no account required.
            </p>
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <ol className="flex items-center gap-1">
                <li>
                  <a href={`${SITE_URL}/`} className="hover:underline">
                    Home
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <a href={`${SITE_URL}/tools`} className="hover:underline">
                    Developer Tools
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li aria-current="page">Bcrypt Generator</li>
              </ol>
            </nav>
          </header>

          <main>
            <ToolClient />
          </main>

          <hr className="border-border" />

          {/* ── Rich article for AdSense content quality ── */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="Bcrypt Generator: Cost Factor, Salt, and Why Identical Passwords Hash Differently" />
            <meta
              itemProp="description"
              content="How bcrypt's salt prevents rainbow table attacks, why the same password produces a different hash every time, and how to pick the right cost factor for your server."
            />
            <meta itemProp="datePublished" content="2024-03-20" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* Why identical passwords hash differently */}
            <section aria-labelledby="salt-explanation" className="space-y-4">
              <h2
                id="salt-explanation"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Why the same password produces a different hash every time
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Every bcrypt hash includes a randomly generated 128-bit salt embedded
                directly in the output string. When you hash the password{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">hunter2</code>{' '}
                twice, you get two completely different 60-character strings — but both
                verify correctly against the original password. The salt is stored
                inside the hash output itself, so you never need to store it separately.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                The salt defeats precomputed rainbow table attacks. Without a salt, an
                attacker with a table of pre-hashed common passwords can look up{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">hunter2</code>{' '}
                instantly. With a unique salt per hash, they would need a separate table
                for every possible salt — computationally infeasible. This is why bcrypt
                hashes from this tool are safe to store even if your database is breached,
                provided the cost factor is high enough.
              </p>
            </section>

            {/* Cost factor guide */}
            <section
              aria-labelledby="cost-factor"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="cost-factor"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Choosing the right cost factor
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                The cost factor (rounds) doubles the computation time for each increment.
                Cost 10 takes ~100 ms on a modern server CPU. Cost 12 takes ~400 ms.
                Cost 14 takes ~1.6 seconds. The OWASP recommendation for new systems in
                2026 is cost factor 10 minimum — enough to limit an attacker with a
                stolen database to roughly 10,000 attempts per second per GPU, compared
                to billions per second for unsalted SHA-256.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Cost factor</th>
                      <th className="border border-border p-2 text-left font-semibold">Time on modern server</th>
                      <th className="border border-border p-2 text-left font-semibold">Use when</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['10', '~100 ms', 'Default — OWASP minimum, good for most web apps'],
                      ['11', '~200 ms', 'Slightly stricter, still fast enough for login flows'],
                      ['12', '~400 ms', 'High-security apps, acceptable if login UX allows'],
                      ['13', '~800 ms', 'Financial or healthcare apps with infrequent logins'],
                      ['14+', '1.6 s+', 'Specialized high-security systems — test UX carefully'],
                    ].map(([cost, time, use]) => (
                      <tr key={cost}>
                        <td className="border border-border p-2 font-mono font-bold text-foreground">{cost}</td>
                        <td className="border border-border p-2 text-muted-foreground">{time}</td>
                        <td className="border border-border p-2 text-muted-foreground">{use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Reading the hash string */}
            <section aria-labelledby="hash-anatomy" className="space-y-4">
              <h2
                id="hash-anatomy"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Anatomy of a bcrypt hash string
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                A bcrypt output like{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                  $2b$12$LQv3c1yqBwEHxPvonuf.eOTI.CVLBPZc5BCHQukO0p5Y3UQPOpvAi
                </code>{' '}
                encodes three things:{' '}
                <strong>$2b$</strong> = algorithm version (2b is current),{' '}
                <strong>12$</strong> = cost factor, and the remaining 53 characters
                contain the 128-bit salt (22 chars) followed by the 184-bit hash (31 chars),
                both encoded in a modified Base64. The full string is self-contained —
                you pass it directly to{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">bcrypt.compare()</code>{' '}
                along with the candidate password to verify.
              </p>
            </section>

            {/* Cost factor guide */}
            <section aria-labelledby="cost-factor-guide" className="space-y-4">
              <h2
                id="cost-factor-guide"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                How many bcrypt rounds (cost factor) should you use?
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                The cost factor controls how slow bcrypt is — doubling it doubles the
                computation time. More rounds = harder to brute-force, but also slower
                login. The right value depends on your server hardware and your
                acceptable response time:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">Cost factor</th>
                      <th className="border border-border p-2 text-left font-semibold">Approx. time on modern server</th>
                      <th className="border border-border p-2 text-left font-semibold">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['10 (bcrypt default)', '~100ms', 'Minimum for any production use — most frameworks default to 10'],
                      ['11', '~200ms', 'Slightly more resistant; imperceptible to users on fast connections'],
                      ['12 ★ recommended', '~400ms', 'Current OWASP recommendation — strong balance of security vs. speed'],
                      ['13', '~800ms', 'Good for high-value accounts (admin, payment); users notice on mobile'],
                      ['14', '~1.6s', 'High-value only — acceptable for infrequent logins (banking, healthcare)'],
                      ['≥15', '>3s', 'Too slow for most web apps — DoS risk if many concurrent logins; research/offline use'],
                    ].map(([factor, time, rec]) => (
                      <tr key={factor}>
                        <td className="border border-border p-2 font-mono text-xs font-bold text-foreground">{factor}</td>
                        <td className="border border-border p-2 text-muted-foreground">{time}</td>
                        <td className="border border-border p-2 text-muted-foreground">{rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-base leading-7 text-muted-foreground">
                OWASP recommends cost factor 12 as the 2026 baseline. Hardware gets faster
                every year — increase your cost factor by 1 every 2–3 years to maintain
                equivalent protection. Most bcrypt libraries (bcryptjs, Spring Security,
                Devise, Django) allow configuring the cost factor without changing stored hashes.
              </p>
            </section>

            {/* Related Tools */}
            <section aria-labelledby="related-tools-heading" className="space-y-4">
              <h2
                id="related-tools-heading"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Related security tools
              </h2>
              <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
                <RelatedTools
                  tools={[
                    { name: "Password Generator", path: "/tools/password-generator" },
                    { name: "Hash Generator", path: "/tools/hash-generator" },
                    { name: "SHA-256 Hash Generator", path: "/tools/sha256-hash" },
                  ]}
                />
              </nav>
            </section>
          </article>

          <footer className="pt-6 border-t space-y-3 text-xs text-muted-foreground">
            <p>
              <strong>TheFreeAITools — Bcrypt Generator</strong> is a free,
              browser-based developer tool for generating and verifying{" "}
              <strong>bcrypt password hashes</strong> with a tunable{" "}
              <strong>cost factor</strong> from 4 to 31. All computation runs
              locally via the <strong>bcryptjs</strong> library — your password
              or secret string is never sent to any server, never stored, and
              never logged, making it safe to use with real application
              credentials. Compatible with <strong>Node.js</strong>,{" "}
              <strong>Python</strong>, <strong>PHP</strong>,{" "}
              <strong>Ruby</strong>, <strong>Java</strong>, and all other
              frameworks that implement the standard{" "}
              <strong>$2b$ Modular Crypt Format</strong>. Fully free with no
              account required, maintained and updated through 2026.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}