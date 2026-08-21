import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "Encoding vs Encryption vs Hashing: What's the Difference?",
  description:
    "Developers mix these up constantly â€” using the wrong one is a security vulnerability. Here's the exact difference with real examples and when to use each.",
  path: "/blog/what-is-encoding-vs-encryption-vs-hashing",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-06-01" />
        <meta itemProp="dateModified" content="2026-06-01" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-06-01">June 1, 2026</time>
            <span>Â·</span>
            <span>6 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            Encoding vs Encryption vs Hashing: What&apos;s the Difference?
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            These three terms are used interchangeably by developers who should know better â€” and
            the confusion leads to real security vulnerabilities. Here&apos;s the definitive distinction.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>The one-line summary</h2>
          <ul>
            <li><strong>Encoding:</strong> transforms data for compatibility â€” anyone can reverse it</li>
            <li><strong>Encryption:</strong> transforms data for confidentiality â€” only someone with the key can reverse it</li>
            <li><strong>Hashing:</strong> transforms data for integrity verification â€” cannot be reversed</li>
          </ul>

          <h2>Encoding</h2>
          <p>
            Encoding is a lossless transformation that changes the <em>representation</em> of data,
            not its meaning. It provides no security â€” anyone can decode it using the same scheme.
          </p>
          <p>
            Examples:
          </p>
          <ul>
            <li>
              <strong>Base64:</strong> converts binary data to printable ASCII characters so it
              can travel safely in systems that only handle text (emails, JSON, URLs). Decode
              any Base64 string instantly with the{" "}
              <Link href="/tools/base64-encoder">free Base64 decoder</Link>.
            </li>
            <li>
              <strong>URL encoding:</strong> converts special characters to percent-encoded form
              (<code>%20</code> for space) so they can appear safely in URLs.
            </li>
            <li>
              <strong>HTML encoding:</strong> converts <code>&lt;</code> to <code>&amp;lt;</code>
              so it appears as literal text in HTML rather than being interpreted as markup.
            </li>
          </ul>
          <p>
            <strong>The security mistake:</strong> storing Base64-encoded passwords in a database.
            Base64 is not security â€” it provides no confidentiality. Anyone with the encoded string
            can decode it in seconds.
          </p>

          <h2>Encryption</h2>
          <p>
            Encryption transforms data into ciphertext using a key. Without the correct key, the
            ciphertext is computationally impossible to reverse. With the correct key, the original
            data is fully recoverable.
          </p>
          <p>
            Two main types:
          </p>
          <ul>
            <li>
              <strong>Symmetric encryption (AES):</strong> the same key encrypts and decrypts.
              Fast, used for bulk data â€” encrypted files, HTTPS session data, database encryption.
            </li>
            <li>
              <strong>Asymmetric encryption (RSA, ECDSA):</strong> a public key encrypts, a private
              key decrypts. Used for key exchange, digital signatures, SSL/TLS handshakes.
            </li>
          </ul>
          <p>
            <strong>Use encryption when:</strong> data needs to be stored or transmitted confidentially
            and then recovered later â€” credit card numbers, private messages, files at rest.
          </p>

          <h2>Hashing</h2>
          <p>
            A hash function produces a fixed-length output from any input. It is one-way â€” you
            cannot reconstruct the original input from the hash. The same input always produces
            the same hash; different inputs produce different hashes (with negligible collision probability).
          </p>
          <p>
            Examples: MD5 (broken), SHA-256, SHA-3, bcrypt, Argon2.
          </p>
          <p>
            <strong>Use hashing when:</strong> you need to verify that something is what it claims
            to be, without storing the thing itself â€” passwords, file integrity, digital signatures.
          </p>
          <p>
            <strong>The password hashing mistake:</strong> storing passwords as MD5 or SHA-256
            hashes. These are designed to be fast â€” GPUs can test billions of guesses per second.
            Use bcrypt or Argon2 instead, which are deliberately slow. Generate a bcrypt hash
            with the <Link href="/tools/bcrypt">free bcrypt tool</Link>.
          </p>

          <h2>The dangerous confusions</h2>
          <table>
            <thead>
              <tr><th>Mistake</th><th>Why it&apos;s wrong</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Storing Base64-encoded passwords</td>
                <td>Base64 is encoding â€” anyone can decode it. Use bcrypt.</td>
              </tr>
              <tr>
                <td>Using MD5 for password hashing</td>
                <td>MD5 is a fast hash â€” GPU cracks it in seconds. Use bcrypt/Argon2.</td>
              </tr>
              <tr>
                <td>Using SHA-256 for password hashing</td>
                <td>SHA-256 is too fast for passwords. Use bcrypt/Argon2.</td>
              </tr>
              <tr>
                <td>Treating encryption as hashing</td>
                <td>If you need to recover the original data (sessions, tokens), use encryption. If you only need to verify, use hashing.</td>
              </tr>
            </tbody>
          </table>

          <h2>Quick reference</h2>
          <table>
            <thead>
              <tr><th>Operation</th><th>Reversible?</th><th>Key needed?</th><th>Use for</th></tr>
            </thead>
            <tbody>
              <tr><td>Base64 encoding</td><td>Yes</td><td>No</td><td>Data transport compatibility</td></tr>
              <tr><td>URL encoding</td><td>Yes</td><td>No</td><td>URL parameter safety</td></tr>
              <tr><td>AES encryption</td><td>Yes</td><td>Yes (secret key)</td><td>Confidential data storage/transport</td></tr>
              <tr><td>RSA encryption</td><td>Yes</td><td>Yes (public/private key pair)</td><td>Key exchange, digital signatures</td></tr>
              <tr><td>SHA-256 hash</td><td>No</td><td>No</td><td>File integrity, checksums</td></tr>
              <tr><td>bcrypt hash</td><td>No</td><td>No</td><td>Password storage</td></tr>
            </tbody>
          </table>

          <h2>Summary</h2>
          <p>
            Encode for compatibility (Base64, URL encoding). Encrypt for confidentiality when you
            need to recover the data (AES, RSA). Hash for verification when you don&apos;t need to
            recover the data (SHA-256 for files, bcrypt for passwords). Using the wrong one is not
            a stylistic choice â€” it is a security vulnerability.
          </p>
        </div>
      </article>
    </main>
  )
}
