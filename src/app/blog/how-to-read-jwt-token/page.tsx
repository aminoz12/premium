import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Read a JWT Token: Decoding the Header, Payload, and Signature",
  description:
    "JWT tokens look like random text but contain readable JSON. Here's how to decode the three parts, what the claims mean, and how to inspect tokens free online.",
  path: "/blog/how-to-read-jwt-token",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-06-02" />
        <meta itemProp="dateModified" content="2026-06-02" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-black/60 dark:text-white/60">
            <time dateTime="2026-06-02">June 2, 2026</time>
            <span>Â·</span>
            <span>6 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Read a JWT Token: Decoding the Header, Payload, and Signature
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            JWT tokens appear in every modern API â€” in Authorization headers, cookies, and URL parameters. Here&apos;s what the three parts contain, how to read them, and what the common claims mean.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What a JWT looks like</h2>
          <p>
            A JSON Web Token is three Base64URL-encoded strings separated by dots:
          </p>
          <pre><code>{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}</code></pre>
          <p>
            The three parts are: <strong>header</strong> . <strong>payload</strong> . <strong>signature</strong>
          </p>
          <p>
            Decode any JWT instantly with the <Link href="/tools/jwt-decoder">free JWT decoder</Link> â€” paste the token and see the decoded header and payload in readable JSON format.
          </p>

          <h2>Part 1: The header</h2>
          <p>
            The header contains metadata about the token â€” specifically which algorithm was used to sign it. Decoding the first part of the example above:
          </p>
          <pre><code>{`{
  "alg": "HS256",
  "typ": "JWT"
}`}</code></pre>
          <p>
            Common <code>alg</code> values:
          </p>
          <ul>
            <li><code>HS256</code> â€” HMAC-SHA256 (symmetric â€” same secret signs and verifies)</li>
            <li><code>RS256</code> â€” RSA-SHA256 (asymmetric â€” private key signs, public key verifies)</li>
            <li><code>ES256</code> â€” ECDSA-SHA256 (asymmetric, more compact than RSA)</li>
            <li><code>none</code> â€” No signature. <strong>Never accept this in production</strong> â€” it&apos;s a known attack vector where an attacker removes the signature and sets alg to "none" to forge tokens</li>
          </ul>

          <h2>Part 2: The payload (claims)</h2>
          <p>
            The payload contains the actual data â€” user ID, roles, expiration time, etc. Decoding the second part:
          </p>
          <pre><code>{`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`}</code></pre>
          <p>
            Standard registered claims (defined in RFC 7519):
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Claim</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Name</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono">sub</td><td className="border border-gray-200 p-3 text-gray-600">Subject</td><td className="border border-gray-200 p-3 text-gray-600">Who the token is about (usually user ID)</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">iss</td><td className="border border-gray-200 p-3 text-gray-600">Issuer</td><td className="border border-gray-200 p-3 text-gray-600">Who created the token (your auth server)</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">aud</td><td className="border border-gray-200 p-3 text-gray-600">Audience</td><td className="border border-gray-200 p-3 text-gray-600">Who the token is intended for (your API)</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">exp</td><td className="border border-gray-200 p-3 text-gray-600">Expiration</td><td className="border border-gray-200 p-3 text-gray-600">Unix timestamp when the token expires</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">iat</td><td className="border border-gray-200 p-3 text-gray-600">Issued At</td><td className="border border-gray-200 p-3 text-gray-600">Unix timestamp when the token was created</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">nbf</td><td className="border border-gray-200 p-3 text-gray-600">Not Before</td><td className="border border-gray-200 p-3 text-gray-600">Token is invalid before this Unix timestamp</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">jti</td><td className="border border-gray-200 p-3 text-gray-600">JWT ID</td><td className="border border-gray-200 p-3 text-gray-600">Unique identifier for this token (prevents replay)</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The <code>exp</code> claim is the most critical for security. If your server doesn&apos;t validate expiration, tokens that should be expired remain valid indefinitely. The <Link href="/tools/jwt-decoder">JWT decoder</Link> shows the expiration as a human-readable date so you can quickly check whether a token has expired.
          </p>

          <h2>Part 3: The signature</h2>
          <p>
            The signature is created by combining the encoded header and payload, then signing them with the secret key:
          </p>
          <pre><code>{`HMACSHA256(
  base64url(header) + "." + base64url(payload),
  secret
)`}</code></pre>
          <p>
            The signature is what makes JWTs trustworthy. Anyone can read the header and payload â€” they&apos;re just Base64-encoded, not encrypted. But only the server that knows the secret key can create a valid signature. If an attacker modifies the payload (changing the user ID or role), the signature no longer matches, and any server that verifies the signature will reject the token.
          </p>
          <p>
            <strong>Critical point:</strong> The payload is readable by anyone. Never put sensitive data in a JWT payload â€” no passwords, no credit card numbers, no SSNs. JWTs provide <em>integrity</em> (tamper detection) but not <em>confidentiality</em> (secrecy).
          </p>

          <h2>How to decode a JWT manually</h2>
          <p>
            In a browser console:
          </p>
          <pre><code>{`const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
const [header, payload] = token.split('.');
console.log(JSON.parse(atob(header)));    // Header object
console.log(JSON.parse(atob(payload)));   // Payload object`}</code></pre>
          <p>
            Note: <code>atob()</code> only handles standard Base64. Base64URL uses <code>-</code> instead of <code>+</code> and <code>_</code> instead of <code>/</code>. For tokens with these characters in the payload, you need to replace them before decoding:
          </p>
          <pre><code>{`const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
JSON.parse(atob(base64));`}</code></pre>

          <h2>Where JWTs appear in API requests</h2>
          <ul>
            <li><strong>Authorization header (most common):</strong> <code>Authorization: Bearer eyJ...</code></li>
            <li><strong>Cookie:</strong> <code>Cookie: token=eyJ...</code> â€” common for browser-based apps (HTTP-only cookies prevent JavaScript access)</li>
            <li><strong>Query parameter (avoid):</strong> <code>?token=eyJ...</code> â€” tokens in URLs appear in server logs and browser history</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/jwt-decoder">Free JWT Decoder</Link> â€” decode and inspect JWT tokens in your browser</li>
            <li><Link href="/tools/base64-encoder">Free Base64 Encoder/Decoder</Link> â€” decode the individual parts of a JWT manually</li>
            <li><Link href="/tools/unix-timestamp-converter">Free Unix Timestamp Converter</Link> â€” convert the exp and iat timestamps to readable dates</li>
          </ul>

          <hr className="my-8" />
          <p className="text-sm text-gray-400">
            Written by <Link href="/about" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Achraf A.</Link>, founder of TheFreeAITools.
          </p>
        </div>
      </article>
    </main>
  )
}
