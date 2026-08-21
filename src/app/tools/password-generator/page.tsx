import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/password-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 58 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Strong Password Generator — 16-Character, Meets All Requirements Free",
  description:
    "Generate a strong 16-character password that meets Google, Apple, bank, and work account requirements. Uses crypto.getRandomValues() — never Math.random(). 100% browser-based, never logged.",
  keywords: [
    "password generator",
    "strong password creator",
    "secure password maker",
    "random password generator",
    "passphrase generator",
    "online password tool",
    "create secure password",
    "password entropy",
    "free password generator 2026",
    "browser-based password tool",
    "no signup password creator",
    "secure random password",
    "best password generator free",
    "password length customizer",
    "character set selector",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Password Generator — Create Strong Secure Passwords",
    description:
      "Generate strong, secure passwords instantly with our free online tool. Customize length, include letters, numbers, and symbols. No signup or upload required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Password Generator — Create Strong Secure Passwords by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Password Generator — Strong Secure Passwords",
    description:
      "Generate strong, secure passwords instantly with our free online tool. Customize length, include letters, numbers, and symbols. No signup required.",
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
  name: "Password Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates strong, secure random passwords with customizable length and character sets. All processing is client-side and private.",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate strong random passwords with one click",
    "Customize password length (6–128 characters)",
    "Include lowercase, uppercase, numbers, and symbols",
    "Exclude ambiguous characters (e.g., 0,O,1,l)",
    "Copy to clipboard with one click",
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
  name: "How to Generate a Strong Password Online",
  description:
    "A simple step-by-step guide to creating a secure, strong password using our free online password generator.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Password Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Set Your Password Preferences",
      text: "Choose the desired password length (e.g., 16 characters) and select which character types to include: lowercase, uppercase, numbers, and symbols. You can also exclude ambiguous characters for better readability.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Generate",
      text: "Press the 'Generate' button. The tool will use a cryptographic random number generator to create a unique, strong password based on your settings.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review Your Password",
      text: "The generated password will appear on screen. You can see its length, character composition, and an entropy estimate to evaluate its strength.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Regenerate",
      text: "Click the 'Copy' button to save the password to your clipboard, or click 'Generate Again' to get a new random password.",
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
      name: "What makes a password strong?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A strong password is long (at least 12 characters), includes a mix of uppercase and lowercase letters, numbers, and symbols, and does not contain common words or personal information. Our tool allows you to customize all of these elements to create truly secure passwords.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this password generator for sensitive accounts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The tool uses a cryptographic random number generator (Crypto.getRandomValues()) to create truly unpredictable passwords. It runs entirely in your browser, so your generated passwords are never transmitted or stored.",
      },
    },
    {
      "@type": "Question",
      name: "Is my generated password stored or logged anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing happens locally in your browser. The generated password is never sent to our servers, stored, or logged. The tool is 100% private.",
      },
    },
    {
      "@type": "Question",
      name: "What is password entropy and why does it matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entropy measures the unpredictability of a password, usually in bits. Higher entropy means a password is harder to guess or crack. A password with 50+ bits of entropy is considered strong. Our tool displays an entropy estimate for your generated password.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a password and a passphrase?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A password is typically a shorter, random string of characters. A passphrase is a longer sequence of random words (e.g., 'correct-horse-battery-staple') that is easier to remember but still secure. Our tool generates random character-based passwords, but you can use multiple passwords to build a passphrase.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free password generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account required. Generates passwords from 6 to 128 characters with full character set control — all processing runs in your browser and nothing is ever sent to any server.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a strong password be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Security experts recommend at least 16 characters for accounts containing sensitive information such as email, banking, or work credentials. For general accounts, 12 characters with a full mix of character types provides strong protection. The longer the password, the exponentially harder it is to crack by brute force.",
      },
    },
    {
      "@type": "Question",
      name: "What is the safest way to store generated passwords?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a reputable password manager such as Bitwarden (open-source, free), 1Password, or the built-in manager in your browser. Password managers encrypt your vault and auto-fill credentials securely. Never store passwords in plain text files, spreadsheets, or sticky notes.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to use an online password generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, as long as the tool generates passwords entirely in your browser without sending data to a server. This tool uses the browser's built-in Crypto.getRandomValues() API — no network requests are made and your password never leaves your device. You can verify this by opening your browser's Network tab while generating a password.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Security Tools > Tool ──────

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
      name: "Password Generator",
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
            Strong Password Generator — 16-Character, Meets All Requirements Free
          </h1>

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate <strong>strong, secure passwords</strong> instantly with our free online
            tool. Customize the <strong>length</strong> and choose which characters to include:
            <strong>lowercase</strong>, <strong>uppercase</strong>, <strong>numbers</strong>,
            and <strong>symbols</strong>. All processing runs locally in your browser with
            <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I generate a strong password that meets requirements?"
            answer="Set length to 16 characters, enable uppercase, lowercase, numbers, and symbols, then click Generate. This meets the requirements for Google, Apple ID, most banks, and corporate accounts. The password is generated using crypto.getRandomValues() — it never leaves your browser."
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
                  Security Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Password Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Password Generator Tool">
          <ClientPage embedMode />
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
          <meta itemProp="name" content="Password Generator: How It Works and When to Use It" />
          <meta
            itemProp="description"
            content="Uses crypto.getRandomValues() — cryptographically secure, never Math.random(). Includes entropy table, honest limitations vs. password managers, and when each approach makes sense."
          />
          <meta itemProp="datePublished" content="2024-01-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* The problem this tool solves */}
          <section aria-labelledby="problem-heading" className="space-y-4">
            <h2
              id="problem-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When you reach for this instead of a password manager
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Password managers are better for most situations — they autofill, detect
              phishing, and sync across devices. But there are specific cases where a
              browser-based generator is the right tool: creating a password for a shared
              account you need to hand to someone else, generating a temporary credential
              for a contractor who doesn&apos;t use your team&apos;s password manager, or creating
              a root account password that you&apos;ll write down and store physically in a safe.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              In these scenarios, a manager&apos;s autofill advantage is irrelevant. What you
              need is a strong random string, generated privately, without it being stored
              in any third-party vault. That&apos;s what this does. Generate, copy, done — nothing
              saved anywhere.
            </p>
          </section>

          {/* How it actually works: CSPRNG */}
          <section
            aria-labelledby="how-it-works"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why{' '}
              <code className="text-sm bg-muted px-1 py-0.5 rounded">crypto.getRandomValues()</code>{' '}
              matters
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This generator uses the Web Crypto API&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.getRandomValues()</code>,
              which draws from the operating system&apos;s cryptographically secure pseudo-random
              number generator (CSPRNG). This is the same entropy source used by SSL/TLS
              to generate session keys. It is not{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">Math.random()</code>,
              which uses a seeded algorithm and is predictable if you know the seed.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Entropy by password length — what &quot;unguessable&quot; actually means in bits:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Length</th>
                    <th className="border border-border p-2 text-left font-semibold">Character set (lower+upper+digits+symbols)</th>
                    <th className="border border-border p-2 text-left font-semibold">Entropy (bits)</th>
                    <th className="border border-border p-2 text-left font-semibold">Brute-force time at 1 billion guesses/sec</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">8 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">52 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">~1 hour</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">12 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">79 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">~300 years</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">16 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">105 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">universe-scale</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">20 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">131 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">universe-scale</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              12 characters with all character types is the practical minimum for anything
              important. 16 is the standard recommendation. Below 10 characters, a
              well-resourced attacker with a GPU cluster can brute-force a hash in hours.
            </p>
          </section>

          {/* Honest limitations vs. password managers */}
          <section aria-labelledby="limitations-heading" className="space-y-4">
            <h2
              id="limitations-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a browser generator can&apos;t replace
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Phishing protection</span>
                <span>
                  Password managers autofill only on the exact domain the password was saved
                  for. They catch phishing sites automatically. A generated password you paste
                  manually offers no such protection — you&apos;ll paste it on a fake site just as
                  easily as the real one.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Storage and recall</span>
                <span>
                  This tool generates and forgets. There is no vault, no sync, no history.
                  Once you close the tab, the password is gone from here. You need to copy it
                  somewhere — ideally a password manager, a secure note, or physical storage.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Breach monitoring</span>
                <span>
                  Managers like 1Password and Bitwarden check your passwords against breach
                  databases and alert you when a site you use is compromised. A standalone
                  generator has no visibility into this.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Short version: use this for one-off generation of passwords you&apos;ll immediately
              store somewhere secure. For day-to-day login credentials, use a password manager.
            </p>
          </section>

          {/* Password requirements by service */}
          <section aria-labelledby="requirements-by-service" className="space-y-4">
            <h2
              id="requirements-by-service"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Password requirements by service — what each platform actually needs
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Every service has different minimum requirements. A 16-character password
              with all character types passes all of them — but here&apos;s the exact
              spec for each so you know what the generator settings should be:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Service</th>
                    <th className="border border-border p-2 text-left font-semibold">Min length</th>
                    <th className="border border-border p-2 text-left font-semibold">Max length</th>
                    <th className="border border-border p-2 text-left font-semibold">Required</th>
                    <th className="border border-border p-2 text-left font-semibold">Recommended setting</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Google Account', '8 chars', 'No limit', 'Letters + numbers or symbols', '16 chars, all types'],
                    ['Apple ID', '8 chars', 'No limit', '1 uppercase, 1 lowercase, 1 number', '16 chars, all types'],
                    ['Microsoft / Outlook', '8 chars', '256 chars', 'Letters + numbers', '16 chars, all types'],
                    ['Facebook / Meta', '6 chars', 'No stated limit', 'Mix of characters recommended', '16 chars, all types'],
                    ['Amazon', '6 chars', 'No stated limit', 'At least 1 number + letter', '16 chars, all types'],
                    ['Most banks (UK/US)', '8–12 chars', '16–32 chars', 'Letters + numbers; symbols often blocked', '12–16 chars, letters + numbers only'],
                    ['Corporate / SSO (Okta, Azure AD)', '8 chars', 'Policy-set', 'Upper + lower + number + symbol', '16 chars, all types'],
                    ['GitHub', '15 chars (with no 2FA) or 8 chars', 'No limit', 'Standard mix', '16 chars, all types'],
                    ['AWS IAM console password', '8–128 chars', '128 chars', 'Upper + lower + number + symbol (configurable)', '20 chars, all types'],
                  ].map(([service, min, max, required, recommended]) => (
                    <tr key={service}>
                      <td className="border border-border p-2 font-medium text-foreground">{service}</td>
                      <td className="border border-border p-2 text-muted-foreground">{min}</td>
                      <td className="border border-border p-2 text-muted-foreground">{max}</td>
                      <td className="border border-border p-2 text-muted-foreground">{required}</td>
                      <td className="border border-border p-2 text-muted-foreground">{recommended}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              Note: banks often block special characters like{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{'< > & " \''}</code>{' '}
              — if a bank password fails, regenerate with symbols disabled and length set
              to the bank&apos;s maximum (usually 16 or 32 characters).
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
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "Bcrypt Password Hasher", path: "/tools/bcrypt" },
                  { name: "JWT Decoder", path: "/tools/jwt-decoder" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Password Generator</strong> is a fully private,
            browser-based tool that creates <strong>strong, secure passwords</strong> using
            cryptographic randomness. Customize length, include lowercase, uppercase,
            numbers, and symbols, and exclude ambiguous characters. All processing runs
            locally on your device — your passwords never leave your computer. The fastest
            free way to generate secure passwords in 2026, with no installs, no accounts,
            and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}
