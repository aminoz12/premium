import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "Reading JWT Tokens Without a Library: What Your Auth Headers Actually Contain",
  description:
    "A JWT is three Base64url-encoded chunks separated by dots. Once you know that, you can read any token in a browser tab in 10 seconds. Here's how, and what to check when auth bugs go dark.",
  path: "/blog/reading-jwt-tokens-without-a-library",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-22" />
        <meta itemProp="dateModified" content="2026-05-22" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-22">May 22, 2026</time>
            <span>·</span>
            <span>8 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            Reading JWT Tokens Without a Library: What Your Auth Headers Actually Contain
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            A JWT is three Base64url-encoded JSON strings separated by dots. Once you internalize
            that, you can read any auth token in your browser console in 10 seconds — no library,
            no external tool. Here&apos;s the full breakdown, plus what to check when an auth bug
            goes silent.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The situation that makes this matter</h2>
          <p>
            An API call is returning 401 Unauthorized. The token looks valid. The expiry timestamp
            looks right. The logs show the request hitting the server with a token that the auth
            middleware rejects. The bug is somewhere between the token being issued and the token
            being validated, and you don&apos;t know which claim is wrong.
          </p>
          <p>
            In this situation, reading the token directly is the fastest way to narrow down the
            problem. What role is encoded in it? Is the <code>iss</code> (issuer) correct? Is the{" "}
            <code>aud</code> (audience) what the server expects? Is the expiry actually in the
            future, or has someone accidentally set a token with a 30-second lifetime?
          </p>
          <p>
            If you know how to read a JWT token, this debug loop takes under a minute. If you
            don&apos;t, it can take an hour.
          </p>

          <h2>The structure of a JWT</h2>
          <p>
            A JWT looks like this:
          </p>
          <p>
            <code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code>
          </p>
          <p>
            Three chunks separated by two dots. That&apos;s all it is. Each chunk is Base64url-encoded:
          </p>
          <ul>
            <li>
              <strong>Chunk 1 — Header:</strong> Metadata about the token itself. Almost always
              contains <code>alg</code> (the signing algorithm, e.g., HS256, RS256) and{" "}
              <code>typ</code> (always <code>&quot;JWT&quot;</code>).
            </li>
            <li>
              <strong>Chunk 2 — Payload:</strong> The actual claims — the useful data. This is
              where you find the user ID, email, roles, expiry time, issuer, audience, and any
              custom claims your system adds.
            </li>
            <li>
              <strong>Chunk 3 — Signature:</strong> A cryptographic signature over the first two
              chunks. This proves the token was issued by someone who holds the secret key and
              hasn&apos;t been tampered with since.
            </li>
          </ul>

          <h2>Reading the payload in the browser console</h2>
          <p>
            Copy any JWT token. Open your browser console (F12 → Console). Paste this:
          </p>
          <pre><code>{`const token = "your.jwt.token.here"
const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
console.log(payload)`}</code></pre>
          <p>
            That&apos;s it. The <code>atob()</code> function decodes Base64. The{" "}
            <code>replace</code> calls convert Base64url characters (<code>-</code> and{" "}
            <code>_</code>) to standard Base64 (<code>+</code> and <code>/</code>) so{" "}
            <code>atob()</code> can handle it. <code>JSON.parse</code> gives you a JavaScript
            object you can inspect.
          </p>
          <p>
            You can do the same with the header by replacing <code>split(&apos;.&apos;)[1]</code> with{" "}
            <code>split(&apos;.&apos;)[0]</code>. The signature (chunk 2, index 2) is a binary hash — it
            won&apos;t decode to readable text; don&apos;t try.
          </p>

          <h2>What to look at when debugging auth</h2>
          <p>
            Here are the payload fields I check first when an auth bug is unclear:
          </p>
          <ul>
            <li>
              <code>exp</code> — Expiry timestamp, as a Unix timestamp (seconds since epoch). If
              this is in the past, the token is expired. Convert it:{" "}
              <code>new Date(payload.exp * 1000)</code> gives you a human-readable date.
            </li>
            <li>
              <code>iat</code> — Issued At. When the token was generated. If{" "}
              <code>exp - iat</code> is 30 (seconds), your token lifetime is 30 seconds. That&apos;s
              probably not intentional.
            </li>
            <li>
              <code>iss</code> — Issuer. The URL or identifier of the auth server that issued this
              token. If this doesn&apos;t match what your resource server expects, the request will
              fail even if the signature is valid.
            </li>
            <li>
              <code>aud</code> — Audience. Who the token is intended for. Resource servers
              validate that <code>aud</code> matches their own identifier. Tokens issued for
              one service will be rejected by another if audience validation is enabled.
            </li>
            <li>
              <code>sub</code> — Subject. The user ID or entity the token represents. Check this
              if you&apos;re seeing authorization bugs where requests succeed but the wrong user&apos;s
              data is returned.
            </li>
            <li>
              <code>scope</code> or custom role claims — Many auth systems include a{" "}
              <code>scope</code> field (OAuth 2.0) or a custom <code>roles</code> array. If your
              middleware checks role claims and the user is getting a 403, this is where to look.
            </li>
          </ul>

          <h2>Checking expiry without writing code</h2>
          <p>
            The <code>exp</code> field is a Unix timestamp. To convert it in your head: Unix
            timestamps count seconds since January 1, 1970 UTC. As of mid-2026, a current timestamp
            is around 1,750,000,000. An <code>exp</code> value significantly below that is expired.
            An <code>exp</code> value of 0 or missing means no expiry is set (some auth systems
            issue non-expiring tokens deliberately).
          </p>
          <p>
            To check quickly: <code>new Date(payload.exp * 1000).toISOString()</code> gives you
            ISO 8601 format. If the date is yesterday, the token is expired.
          </p>

          <h2>What the signature does and doesn&apos;t protect</h2>
          <p>
            The signature proves that the first two chunks haven&apos;t been modified since the token
            was issued by someone holding the secret key. It does not:
          </p>
          <ul>
            <li>Encrypt the payload. Anyone who intercepts the token can read the claims.</li>
            <li>Prove the user is currently authorized — only that the token was validly issued.</li>
            <li>Prevent token replay if the token is stolen (that&apos;s what the <code>exp</code> is for).</li>
          </ul>
          <p>
            This is why JWTs containing sensitive claims should only travel over HTTPS, and why
            the payload should contain the minimum necessary information. User roles are usually
            fine in a JWT payload. User passwords, credit card numbers, and SSNs are not.
          </p>

          <h2>Algorithm confusion attacks (the one thing to know about <code>alg</code>)</h2>
          <p>
            The header contains an <code>alg</code> field. In early JWT library implementations,
            attackers could modify a token&apos;s <code>alg</code> field from <code>RS256</code> (RSA
            asymmetric — requires a private key to sign) to <code>HS256</code> (HMAC symmetric —
            signs with a shared secret) and then sign the token with the server&apos;s public key,
            which is often publicly available. Some early libraries would accept this as valid.
          </p>
          <p>
            This vulnerability was common in 2016–2018. Modern JWT libraries (jsonwebtoken v9+,
            jose, python-jwt 2.x+) require you to specify the expected algorithm explicitly and
            reject tokens whose header claims a different one. If you&apos;re using a JWT library that
            doesn&apos;t require you to specify the expected algorithm, update it.
          </p>

          <h2>Reading tokens safely</h2>
          <p>
            Since the payload is Base64-encoded text, not encrypted, you should be careful about
            where you decode tokens for debugging. Pasting a production auth token into a random
            online JWT decoder sends the token to that service&apos;s server. If the token is still
            valid, you&apos;ve just handed someone a working credential.
          </p>
          <p>
            Use the browser console (described above) or the{" "}
            <Link href="/tools/jwt-decoder">JWT decoder tool</Link> on this site — it runs entirely
            in your browser, nothing is sent to any server.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/jwt-decoder">JWT decoder</Link>{" "}
              — paste any JWT to inspect its header, payload, and expiry without sending it
              anywhere.
            </li>
            <li>
              <Link href="/tools/base64-encoder">Base64 encoder/decoder</Link>{" "}
              — decode individual Base64url chunks manually.
            </li>
            <li>
              <Link href="/tools/json-formatter">JSON formatter</Link>{" "}
              — format the decoded payload for easier reading if it&apos;s a large or deeply nested
              object.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. The browser console technique above
            is the one I actually use when debugging auth in staging environments.
          </p>
        </div>
      </article>
    </main>
  )
}
