import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "Base64 Is Not Encryption: The Security Mistake I See in Code Reviews Every Week",
  description:
    "Base64-encoded strings look scrambled, and that trips up a surprising number of developers. Here's what Base64 actually does, where it belongs, and what to use when you need real security.",
  path: "/blog/base64-is-not-encryption",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />


      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-24" />
        <meta itemProp="dateModified" content="2026-05-24" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-24">May 24, 2026</time>
            <span>·</span>
            <span>7 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 dark:text-white underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            Base64 Is Not Encryption: The Security Mistake I See in Code Reviews Every Week
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Base64-encoded strings look scrambled, which trips up a surprising number of developers
            into treating them as protected data. Here&apos;s what Base64 actually does, where it
            legitimately belongs, and what to reach for when you need data that&apos;s actually secure.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The code review that started this</h2>
          <p>
            I was reviewing a pull request for a small internal tool. The developer had stored an
            API key in a config file. To &quot;protect&quot; it, they had Base64-encoded the key and stored
            the encoded version. The comment in the code said: <em>encoded for security</em>.
          </p>
          <p>
            The encoded string looked like <code>c2VjcmV0X2tleV8xMjM0NQ==</code>. It took me
            four seconds to decode it back to <code>secret_key_12345</code> using the browser.
            The &quot;protection&quot; was zero. Anyone who found the config file could read the key in
            the same four seconds.
          </p>
          <p>
            This pattern — using Base64 as if it were a security layer — is more common than I
            expected when I started doing code reviews regularly. I see it with API keys, with
            passwords, with internal URLs that someone wanted to &quot;hide,&quot; and occasionally with
            entire JSON payloads containing sensitive user data.
          </p>

          <h2>What Base64 actually is</h2>
          <p>
            Base64 is an encoding scheme, not an encryption scheme. The distinction is fundamental:
          </p>
          <ul>
            <li>
              <strong>Encoding</strong> transforms data from one representation to another. It is
              reversible by anyone with knowledge of the scheme. There is no secret key. Anyone who
              knows the scheme (Base64 is public and standardized) can decode the data.
            </li>
            <li>
              <strong>Encryption</strong> transforms data in a way that can only be reversed with a
              secret key. Without the key, the data is unrecoverable (if the encryption is strong).
            </li>
          </ul>
          <p>
            Base64 was invented to solve a specific problem: binary data can&apos;t always be safely
            transmitted through systems designed for text (email, HTTP headers, URLs). Base64 converts
            binary bytes into a subset of 64 ASCII characters (A-Z, a-z, 0-9, +, /) that are safe
            in any text context. The tradeoff is that encoded data is about 33% larger than the
            original.
          </p>
          <p>
            That&apos;s the whole story. Base64 was never designed to hide data. It makes binary data
            text-safe. It makes text look unfamiliar. It does not protect anything.
          </p>

          <h2>Where Base64 actually belongs</h2>
          <p>
            Base64 is a useful and correct tool in specific situations:
          </p>
          <ul>
            <li>
              <strong>Embedding binary data in JSON or HTML.</strong> If you want to embed an image
              in a JSON API response, you Base64-encode the binary image bytes so they can sit in
              a JSON string field. Same for embedding a font in CSS via <code>data:</code> URLs.
            </li>
            <li>
              <strong>HTTP Basic Authentication headers.</strong> The HTTP spec defines Basic Auth
              as the username:password string encoded in Base64 and sent in the{" "}
              <code>Authorization: Basic</code> header. This is for format compatibility, not security.
              Basic Auth is only safe over HTTPS, which provides the actual encryption.
            </li>
            <li>
              <strong>JWT tokens.</strong> A JSON Web Token is three Base64url-encoded chunks
              (header, payload, signature) joined by dots. The header and payload are not
              encrypted — they&apos;re just encoded, and anyone can read them. The security in a JWT
              comes from the signature, which proves the token hasn&apos;t been tampered with.
            </li>
            <li>
              <strong>Email attachments.</strong> MIME email attachments are Base64-encoded so
              binary files can travel through the text-based email infrastructure.
            </li>
          </ul>

          <h2>How to decode Base64 in 10 seconds</h2>
          <p>
            To illustrate how trivial decoding is, here are three ways to decode any Base64
            string immediately:
          </p>
          <ul>
            <li>
              <strong>Browser console:</strong> Open DevTools (F12), go to the Console tab, and
              type <code>atob(&apos;your-base64-string-here&apos;)</code>. The decoded string appears
              instantly. <code>atob()</code> is a built-in browser function. No library needed.
            </li>
            <li>
              <strong>Browser tool:</strong>{" "}
              <Link href="/tools/base64-encoder">Paste it here</Link> and click Decode. Done in
              two clicks.
            </li>
            <li>
              <strong>Terminal:</strong> <code>echo &apos;your-base64-string&apos; | base64 -d</code> on
              macOS/Linux.
            </li>
          </ul>
          <p>
            There is nothing to crack. There is no password to guess. Base64 decoding is not
            reversing encryption — it&apos;s applying a publicly documented lookup table.
          </p>

          <h2>What to use instead</h2>
          <p>
            The right tool depends on what you actually need:
          </p>
          <p>
            <strong>Storing a secret (API key, password, token) in a config file or database:</strong>{" "}
            Don&apos;t store it in plaintext in source code at all. Use environment variables
            (<code>process.env.API_KEY</code>) and inject them at runtime. For production secrets,
            use a secrets manager: AWS Secrets Manager, HashiCorp Vault, Vercel environment
            variables, or similar. These systems handle access control, rotation, and audit logs.
          </p>
          <p>
            <strong>Storing a user password in a database:</strong> Hash it with a slow hashing
            algorithm. bcrypt, scrypt, or Argon2id are the current standards. Never store
            plaintext or Base64-encoded passwords. The{" "}
            <Link href="/tools/bcrypt">bcrypt tool</Link> on this site lets you hash and compare
            passwords in the browser to understand how the output looks. A bcrypt hash includes
            the salt and cost factor — the hash is deliberately slow to compute so brute-force
            attacks are impractical.
          </p>
          <p>
            <strong>Sending sensitive data over a network:</strong> Use HTTPS (TLS). The transport
            layer handles encryption. You don&apos;t need to encrypt the data yourself before sending
            it over HTTPS, though you may want to for defense-in-depth.
          </p>
          <p>
            <strong>Encrypting data at rest:</strong> Use AES-256 (symmetric) or RSA/ECDSA
            (asymmetric) depending on whether you need one or two keys. The Web Crypto API
            (<code>window.crypto.subtle</code>) provides browser-native AES-GCM encryption
            without any library.
          </p>

          <h2>The URL-safe variant (Base64url)</h2>
          <p>
            Standard Base64 uses <code>+</code> and <code>/</code> characters, which have special
            meaning in URLs (+ means space in query strings, / is a path separator). Base64url
            replaces these with <code>-</code> and <code>_</code>, and drops the <code>=</code>{" "}
            padding. This is the variant used in JWT tokens and many modern APIs.
          </p>
          <p>
            If you try to decode a Base64url string with <code>atob()</code> in the browser, it
            will fail because of the character difference. The fix is to replace{" "}
            <code>-</code> with <code>+</code> and <code>_</code> with <code>/</code> before
            decoding. Or use the{" "}
            <Link href="/tools/base64-encoder">base64 tool</Link>, which handles both variants
            automatically.
          </p>

          <h2>The SHA-256 confusion</h2>
          <p>
            A related misconception: SHA-256 hashes are sometimes displayed as Base64, and
            developers occasionally confuse the Base64 encoding with the security property.
            The security comes from SHA-256 (a one-way cryptographic hash), not from the Base64
            display format. The same hash displayed in hexadecimal is equally secure — or equally
            insecure if used incorrectly.
          </p>
          <p>
            SHA-256 is appropriate for verifying file integrity and signing tokens. It is{" "}
            <em>not</em> appropriate for hashing passwords (it&apos;s too fast — purpose-built
            password hashing functions are intentionally slow). Use the{" "}
            <Link href="/tools/hash-generator">hash generator</Link> to see what SHA-256, SHA-512,
            and MD5 output looks like for a given input.
          </p>

          <h2>What to actually do when you see this in a codebase</h2>
          <p>
            If you find Base64-encoded sensitive data in a codebase you&apos;re reviewing:
          </p>
          <ol>
            <li>
              Decode it to verify what&apos;s actually stored (you can do this in the browser console).
            </li>
            <li>
              Treat the underlying secret as compromised if it&apos;s been in any shared repository,
              even a private one with multiple contributors. Rotate it.
            </li>
            <li>
              Move the secret to environment variables or a secrets manager before the next deploy.
            </li>
            <li>
              Check git history — <code>git log -p --all -S &apos;the-base64-string&apos;</code> — to see
              how far back the exposure goes. If it was committed, the history persists even after
              deletion.
            </li>
          </ol>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/base64-encoder">Base64 encoder/decoder</Link>{" "}
              — encode or decode Base64 and Base64url strings locally in your browser.
            </li>
            <li>
              <Link href="/tools/hash-generator">Hash generator</Link>{" "}
              — generate MD5, SHA-1, SHA-256, SHA-512 hashes of any string or file.
            </li>
            <li>
              <Link href="/tools/bcrypt">Bcrypt tool</Link>{" "}
              — hash and compare passwords using the bcrypt algorithm.
            </li>
            <li>
              <Link href="/tools/jwt-decoder">JWT decoder</Link>{" "}
              — decode and inspect any JSON Web Token (header, payload, expiry) without sending it
              anywhere.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. The code review incident described
            above happened in early 2025 on a real project; details changed to protect the team.
          </p>
        </div>
      </article>
    </main>
  )
}
