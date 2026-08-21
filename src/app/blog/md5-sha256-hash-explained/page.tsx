import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "MD5 vs SHA-256: Hash Functions Explained (And When Not to Use MD5)",
  description:
    "What MD5 and SHA-256 hash functions do, why MD5 is broken for security, and when each is appropriate. Free hash generator included.",
  path: "/blog/md5-sha256-hash-explained",
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
            <span>7 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            MD5 vs SHA-256: Hash Functions Explained (And When Not to Use MD5)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Both MD5 and SHA-256 produce a fixed-length fingerprint of any input. One is cryptographically broken. Here&apos;s what hashing is, how they differ, and which to use.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What hash functions do</h2>
          <p>
            A cryptographic hash function takes any input (a string, a file, a password) and produces a fixed-length output called a hash or digest. Properties:
          </p>
          <ul>
            <li><strong>Deterministic:</strong> The same input always produces the same hash</li>
            <li><strong>One-way:</strong> You cannot reconstruct the original input from the hash</li>
            <li><strong>Avalanche effect:</strong> A tiny change in input produces a completely different hash</li>
            <li><strong>Fixed length:</strong> The output length is constant regardless of input length</li>
          </ul>
          <p>
            MD5 produces a 128-bit (32 hex character) hash. SHA-256 produces a 256-bit (64 hex character) hash.
          </p>
          <p>
            Generate both types of hashes with the <Link href="/tools/sha256-hash">free SHA-256 hash generator</Link>.
          </p>

          <h2>MD5: what it is and why it&apos;s broken for security</h2>
          <p>
            MD5 (Message Digest 5) was designed in 1991 as a cryptographic hash function. For decades it was used for password hashing, digital signatures, and file integrity checking.
          </p>
          <p>
            The problem: MD5 is vulnerable to collision attacks. A collision means two different inputs produce the same MD5 hash. In 2004, researchers demonstrated the first practical MD5 collisions. By 2008, researchers had used MD5 collisions to forge a rogue SSL certificate â€” proving the attack was practical and dangerous.
          </p>
          <p>
            A collision attack means: an attacker can create a malicious file that has the same MD5 hash as a legitimate file. If you&apos;re using MD5 to verify file integrity (&quot;is this the file I expect?&quot;), a collision attack defeats that check. An attacker can substitute the malicious file and your check passes.
          </p>
          <p>
            MD5 has no known collision resistance â€” and hasn&apos;t for 20 years.
          </p>

          <h2>SHA-256: the current standard</h2>
          <p>
            SHA-256 (Secure Hash Algorithm 256-bit) is part of the SHA-2 family, designed by the NSA and published by NIST in 2001. It produces a 256-bit hash with no known practical collision attacks or pre-image attacks as of 2026.
          </p>
          <p>
            SHA-256 is used in:
          </p>
          <ul>
            <li>TLS certificates (HTTPS)</li>
            <li>Bitcoin (mining and transaction hashing)</li>
            <li>Code signing and software integrity verification</li>
            <li>HMAC-SHA256 for API authentication signatures</li>
            <li>Git (object addressing â€” though Git 2.42+ is migrating to SHA-256 as the new default)</li>
          </ul>

          <h2>When MD5 is still acceptable</h2>
          <p>
            Despite its cryptographic weakness, MD5 is still used and acceptable in specific non-security contexts:
          </p>
          <ul>
            <li><strong>Non-security checksums for accidental corruption.</strong> When you download a large file and want to verify it wasn&apos;t corrupted during transfer (not tampered with), MD5 is fine. Accidental corruption is detected; intentional tampering is not.</li>
            <li><strong>De-duplication.</strong> Hashing file contents to find duplicates in a local file system. No security implications â€” you just want to detect identical content.</li>
            <li><strong>Cache keys and database lookups.</strong> Using an MD5 hash of a string as a cache key or database identifier. The collision risk in this context is negligible and there are no security implications.</li>
            <li><strong>Legacy system compatibility.</strong> Some older APIs and protocols require MD5. Use it when required; document that it&apos;s not for security.</li>
          </ul>

          <h2>When to use SHA-256 instead</h2>
          <ul>
            <li><strong>File integrity for security-sensitive downloads.</strong> Software signatures, firmware verification, OS images. Use SHA-256.</li>
            <li><strong>API request signing.</strong> HMAC-SHA256 is the standard for AWS, Stripe, GitHub webhooks, and most modern APIs.</li>
            <li><strong>Digital signatures and certificates.</strong> SHA-256 is the minimum. SHA-384 and SHA-512 are used for long-lived certificates.</li>
            <li><strong>Any cryptographic protocol.</strong> MD5 should not appear in any new security design.</li>
          </ul>

          <h2>Password hashing: use neither MD5 nor SHA-256</h2>
          <p>
            This is the most important point: do not use MD5 or SHA-256 to hash passwords. Both are fast hash functions â€” fast is exactly the wrong property for password hashing.
          </p>
          <p>
            A modern GPU can compute 68 billion MD5 hashes per second. If an attacker obtains a database of MD5-hashed passwords, they can attempt all common passwords and dictionary words against every hash in seconds.
          </p>
          <p>
            For passwords, use a deliberately slow key-derivation function:
          </p>
          <ul>
            <li><strong>bcrypt</strong> â€” standard, widely supported, proven in practice</li>
            <li><strong>Argon2id</strong> â€” NIST recommended, memory-hard (resists GPU/ASIC attacks), current best practice</li>
            <li><strong>scrypt</strong> â€” memory-hard, good for older systems that can&apos;t use Argon2</li>
          </ul>
          <p>
            These algorithms are specifically designed to be slow and to require significant memory â€” making brute-force attacks computationally infeasible even after a database breach.
          </p>

          <h2>Comparing the outputs</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Algorithm</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Output length</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Hash of &quot;hello&quot;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">MD5</td>
                  <td className="border border-gray-200 p-3 text-gray-600">32 hex chars (128 bits)</td>
                  <td className="border border-gray-200 p-3 font-mono text-xs text-gray-600">5d41402abc4b2a76b9719d911017c592</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">SHA-1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">40 hex chars (160 bits)</td>
                  <td className="border border-gray-200 p-3 font-mono text-xs text-gray-600">aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">SHA-256</td>
                  <td className="border border-gray-200 p-3 text-gray-600">64 hex chars (256 bits)</td>
                  <td className="border border-gray-200 p-3 font-mono text-xs text-gray-600">2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Notice that changing a single character in the input (&quot;hello&quot; vs &quot;Hello&quot;) produces completely different hashes â€” this is the avalanche effect in action.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/sha256-hash">Free SHA-256 Hash Generator</Link> â€” generate SHA-256 and MD5 hashes for any text</li>
            <li><Link href="/tools/password-generator">Free Password Generator</Link> â€” generate cryptographically random passwords</li>
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
