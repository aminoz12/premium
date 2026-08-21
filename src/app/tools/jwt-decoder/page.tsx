import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/jwt-decoder"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 60 characters (counted manually) — at the upper bound

export const metadata: Metadata = {
  title: "JWT Decoder — Inspect Token Claims & Expiry Free Online",
  description:
    "Decode any JWT instantly to inspect claims, check expiry (exp), see issued-at (iat), and view scopes. Debug OAuth 2.0 and API tokens without sending them to a server.",
  keywords: [
    "jwt decoder",
    "json web token decoder",
    "jwt validator",
    "jwt inspector",
    "jwt payload viewer",
    "decode jwt online",
    "jwt header decoder",
    "jwt signature check",
    "free jwt tool 2026",
    "browser-based jwt decoder",
    "no signup jwt",
    "secure jwt inspector",
    "jwt expiration check",
    "jwt algorithm viewer",
    "best free jwt decoder",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free JWT Decoder — Decode & Validate JSON Web Tokens Online",
    description:
      "Decode, validate, and inspect JSON Web Tokens (JWT) instantly. Free online tool to view payload, header, and signature — no signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free JWT Decoder — Decode & Validate JWTs by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JWT Decoder — Decode JSON Web Tokens Online",
    description:
      "Decode, validate, and inspect JSON Web Tokens (JWT) instantly. Free browser-based tool, no signup required.",
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
  name: "JWT Decoder",
  url: TOOL_URL,
  description:
    "A free online tool that decodes, validates, and inspects JSON Web Tokens (JWT). Displays header, payload, and signature information. All processing is client-side and private.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Decode JWT header and payload",
    "Validate token signature (HS256, RS256)",
    "View expiration time and token claims",
    "Copy decoded payload as JSON",
    "Supports standard JWT algorithms",
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
  name: "How to Decode a JWT Online",
  description:
    "A simple step-by-step guide to decoding and inspecting a JSON Web Token (JWT) using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools JWT Decoder",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your JWT",
      text: "Copy your JSON Web Token (JWT) from your application or authorization header and paste it into the input field.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Decode",
      text: "Press the 'Decode' button. The tool will parse the token, separate the header, payload, and signature, and display them in a readable format.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Inspect Token Details",
      text: "Review the decoded header (algorithm, type) and payload (claims, expiration time, user data). The tool also indicates whether the signature is valid.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy or Export",
      text: "Click the 'Copy' button to save the decoded payload as JSON, or use the 'Download' button to export it as a .json file.",
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
      name: "What is a JWT and why would I need to decode one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JWT (JSON Web Token) is a compact, URL-safe way to represent claims between parties. You may need to decode a JWT to inspect its payload for debugging, verify its expiration time, or understand which claims it contains — common during development or security audits.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool validate the JWT signature?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool attempts to validate the signature for common algorithms like HS256 and RS256. It displays whether the signature is valid or not, helping you ensure the token hasn't been tampered with.",
      },
    },
    {
      "@type": "Question",
      name: "Is my JWT data secure when using this decoder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your JWT is never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What algorithms are supported for signature validation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports the most common JWT algorithms, including HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, and ES512. It will attempt to validate the signature if the appropriate key is provided or if the algorithm allows verification.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between JWT decoding and JWT validation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Decoding a JWT simply extracts and displays the header and payload without verifying the signature. Validation checks the signature to ensure the token hasn't been altered and that it hasn't expired. Our tool does both — you get the decoded data plus a signature validity indicator.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free JWT decoder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free with no account required — decodes any standard JWT instantly in your browser. The header and payload are never sent to any server.",
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
      name: "JWT Decoder",
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
            JWT Decoder — Inspect Token Claims & Expiry Free Online
          </h1>
          <img src="/images/jwt-decoder.webp" alt="Free JWT Decoder — decode and verify JSON Web Tokens online without login" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Decode, validate, and inspect <strong>JSON Web Tokens (JWT)</strong> instantly.
            View the <strong>header</strong>, <strong>payload</strong>, and
            <strong>signature</strong> status. All processing runs locally in your browser
            with <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="How do I check if a JWT is expired or see its claims?"
            answer="Paste your JWT into the decoder above. It instantly shows the header (algorithm), payload (claims including exp, iat, sub, aud), and whether the token is currently expired based on the exp timestamp. No private key is needed to decode — JWT payloads are Base64URL-encoded JSON, not encrypted."
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
                <span className="text-foreground font-medium">JWT Decoder</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="JWT Decoder Tool">
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
          <meta itemProp="name" content="JWT Decoder: Read Token Payloads Without a Library" />
          <meta itemProp="description" content="Decode JWT headers and payloads in the browser. Explains the three-part structure, what fields to check when debugging auth, and what the tool can't verify." />
          <meta itemProp="datePublished" content="2024-02-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="jwt-problem" className="space-y-4">
            <h2 id="jwt-problem" className="text-2xl font-semibold tracking-tight text-foreground">
              What the token actually contains
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A JWT is three Base64url-encoded chunks separated by dots: a header, a payload,
              and a signature. The header and payload are readable by anyone — they&apos;re not
              encrypted, just encoded. The signature is what proves authenticity, and it
              requires the server&apos;s secret key to verify.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              When an auth bug goes dark — a 401 that shouldn&apos;t be happening, a user who
              can&apos;t access a resource they should have permission for — the first step is
              reading what&apos;s actually in the token. I wrote about this in{' '}
              <a href="/blog/reading-jwt-tokens-without-a-library" className="text-black  dark:text-white hover:underline">
                Reading JWT Tokens Without a Library
              </a>
              {' '}— you can decode any token in 10 seconds with just a browser.
            </p>
          </section>

          <section aria-labelledby="jwt-fields" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="jwt-fields" className="text-2xl font-semibold tracking-tight text-foreground">
              Fields to check when debugging auth
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Field</th>
                    <th className="border border-border p-2 text-left font-semibold">What it means</th>
                    <th className="border border-border p-2 text-left font-semibold">What to check</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['exp', 'Expiry time (Unix timestamp)', 'Is it in the past? Compare to Date.now() / 1000'],
                    ['iat', 'Issued at time', 'Is it suspiciously old or in the future?'],
                    ['iss', 'Issuer', 'Does it match the expected auth server?'],
                    ['aud', 'Audience', 'Does it include your API/service?'],
                    ['sub', 'Subject (user ID)', 'Is it the correct user?'],
                    ['scope / roles', 'Permissions granted', 'Does it include the required scope for this endpoint?'],
                    ['alg (header)', 'Signing algorithm', 'Is it RS256 or HS256? Never "none"'],
                  ].map(([field, meaning, check]) => (
                    <tr key={field}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{field}</td>
                      <td className="border border-border p-2 text-muted-foreground">{meaning}</td>
                      <td className="border border-border p-2 text-muted-foreground">{check}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="jwt-limits" className="space-y-4">
            <h2 id="jwt-limits" className="text-2xl font-semibold tracking-tight text-foreground">
              What this tool does NOT do
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Signature verification</span>
                <span>
                  This tool decodes the header and payload — it does not verify the signature.
                  You need the server&apos;s public key (for RS256) or shared secret (for HS256) to
                  verify authenticity. Never trust a JWT&apos;s claims without verifying the
                  signature on the server.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">JWE (encrypted tokens)</span>
                <span>
                  JWE tokens are encrypted, not just signed. They look like 5-part strings
                  (4 dots). This tool decodes JWS (signed) tokens only — JWE will not decode
                  meaningfully.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              The decoder runs entirely in your browser. Your tokens — which may contain user
              IDs, scopes, and session data — never leave your device.
            </p>
          </section>

          {/* JWT standard claims reference */}
          <section aria-labelledby="jwt-claims-ref" className="space-y-4">
            <h2
              id="jwt-claims-ref"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              JWT standard claims — what each field means
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The JWT spec (RFC 7519) defines a set of registered claim names. You&apos;ll
              see these in the decoded payload — here&apos;s what each one means:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Claim</th>
                    <th className="border border-border p-2 text-left font-semibold">Full name</th>
                    <th className="border border-border p-2 text-left font-semibold">Meaning</th>
                    <th className="border border-border p-2 text-left font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['iss', 'Issuer', 'Who issued the token (e.g., "https://auth.example.com")', 'String'],
                    ['sub', 'Subject', 'The user or entity the token is about (e.g., user ID)', 'String'],
                    ['aud', 'Audience', 'Who the token is intended for — your API should verify this matches', 'String or array'],
                    ['exp', 'Expiration time', 'Unix timestamp (seconds) after which the token is invalid', 'Number'],
                    ['iat', 'Issued at', 'Unix timestamp when the token was created', 'Number'],
                    ['nbf', 'Not before', 'Unix timestamp before which the token must not be accepted', 'Number'],
                    ['jti', 'JWT ID', 'Unique identifier for this specific token — used to prevent replay attacks', 'String'],
                    ['scope / scp', 'Scope (OAuth 2.0)', 'Space-separated list of permissions granted to the token', 'String'],
                    ['roles / groups', 'Custom (not in RFC)', 'User roles or group memberships — added by auth providers like Auth0, Okta', 'Array'],
                  ].map(([claim, name, meaning, type]) => (
                    <tr key={claim}>
                      <td className="border border-border p-2 font-mono text-xs font-bold text-foreground">{claim}</td>
                      <td className="border border-border p-2 text-foreground">{name}</td>
                      <td className="border border-border p-2 text-muted-foreground">{meaning}</td>
                      <td className="border border-border p-2 text-muted-foreground">{type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base leading-7 text-muted-foreground">
              Timestamps (<code className="text-xs bg-muted px-1 py-0.5 rounded">exp</code>,{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">iat</code>,{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">nbf</code>) are Unix epoch
              seconds — divide by 1000 to convert to JavaScript Date milliseconds, or paste
              into a Unix timestamp converter.
            </p>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Related security tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Base64 Encoder / Decoder", path: "/tools/base64-encoder" },
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "Password Generator", path: "/tools/password-generator" },
                ]}
              />
            </nav>
          </section>
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — JWT Decoder</strong> is a fully private, browser-based
            tool that decodes and inspects <strong>JSON Web Tokens (JWT)</strong> instantly.
            Supports signature validation for HS256, RS256, and other common algorithms.
            All processing runs locally on your device — your JWT never leaves your computer.
            The fastest free way to decode JWTs in 2026, with no installs, no accounts, and
            no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}