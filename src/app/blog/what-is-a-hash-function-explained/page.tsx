import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "What Is a Hash Function? A Plain-English Explanation With Real Examples",
  description:
    "Hash functions power passwords, file integrity, blockchain, and Git commits. Here's how they work, why they're one-way, and when to use which one.",
  path: "/blog/what-is-a-hash-function-explained",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-29" />
        <meta itemProp="dateModified" content="2026-05-29" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-29">May 29, 2026</time>
            <span>·</span>
            <span>6 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            What Is a Hash Function? A Plain-English Explanation With Real Examples
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Hash functions appear in passwords, file downloads, Git commits, and blockchain. They
            all use the same underlying idea. Here&apos;s what they do, why they are one-way,
            and when to use which one.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>The core idea</h2>
          <p>
            A hash function takes any input — a word, a file, a document — and produces a
            fixed-length output called a hash (or digest). No matter how big the input, the
            output is always the same length.
          </p>
          <p>
            For SHA-256, the output is always 64 hexadecimal characters (256 bits):
          </p>
          <ul>
            <li>Input: <code>&quot;hello&quot;</code> → <code>2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824</code></li>
            <li>Input: <code>&quot;hello world&quot;</code> → <code>b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576ece096b1c0c6e8e4</code> (completely different)</li>
            <li>Input: the entire works of Shakespeare → still 64 characters</li>
          </ul>

          <h2>The three properties that make hashes useful</h2>
          <p>
            <strong>1. Deterministic:</strong> the same input always produces the same output.
            Hash &quot;hello&quot; a billion times and you always get the same 64 characters.
          </p>
          <p>
            <strong>2. One-way (pre-image resistant):</strong> given the hash output, you cannot
            compute the original input. You can verify that an input matches a hash, but you
            cannot reverse the hash to get the input.
          </p>
          <p>
            <strong>3. Collision resistant:</strong> two different inputs should not produce the
            same hash. A good hash function makes finding a collision (two inputs with the same
            hash) computationally infeasible.
          </p>

          <h2>Real-world uses</h2>
          <h3>File integrity verification</h3>
          <p>
            When you download software, the website often publishes a SHA-256 hash of the file.
            You hash the downloaded file yourself and compare. If they match, the file was not
            tampered with in transit. If they differ, the download was corrupted or modified.
          </p>

          <h3>Password storage</h3>
          <p>
            Databases store a hash of your password, not the password itself. When you log in,
            the system hashes your input and compares it to the stored hash. The database never
            holds your actual password — if it is breached, the attacker gets hashes, not
            plaintext passwords.
          </p>
          <p>
            For passwords specifically, slow hashing algorithms like bcrypt are preferred — they
            are deliberately designed to be computationally expensive, making brute-force attacks
            slow.
          </p>

          <h3>Git commit IDs</h3>
          <p>
            Every Git commit has a SHA-1 hash (Git is migrating to SHA-256 in newer versions).
            This hash represents the exact state of the code, who made the commit, when, and the
            parent commit. Change any one character in the commit contents and the hash changes
            completely — ensuring the integrity of version history.
          </p>

          <h3>Blockchain</h3>
          <p>
            Each block in a blockchain contains the hash of the previous block. This creates a
            chain — changing any historical block changes its hash, which invalidates every
            subsequent block. The hash links are what make blockchain immutable.
          </p>

          <h2>Which hash function to use</h2>
          <table>
            <thead>
              <tr><th>Use case</th><th>Recommended</th><th>Avoid</th></tr>
            </thead>
            <tbody>
              <tr><td>Password storage</td><td>bcrypt, Argon2id, scrypt</td><td>MD5, SHA-1, SHA-256 (too fast)</td></tr>
              <tr><td>File integrity</td><td>SHA-256, SHA-3</td><td>MD5, SHA-1 (broken)</td></tr>
              <tr><td>Digital signatures</td><td>SHA-256, SHA-384</td><td>MD5, SHA-1</td></tr>
              <tr><td>Non-security checksums</td><td>CRC32, xxHash (fast)</td><td>N/A — any works</td></tr>
            </tbody>
          </table>

          <h2>Generate hashes free</h2>
          <p>
            Test hash functions with real input using these free tools:
          </p>
          <ul>
            <li><Link href="/tools/sha256-hash">SHA-256 hash generator</Link></li>
            <li><Link href="/tools/md5-hash">MD5 hash generator</Link></li>
            <li><Link href="/tools/bcrypt">Bcrypt generator and verifier</Link></li>
            <li><Link href="/tools/hash-generator">Multi-algorithm hash generator</Link> (MD5, SHA-1, SHA-256, SHA-512)</li>
          </ul>
          <p>
            All tools run in your browser — your input is never sent to any server.
          </p>

          <h2>Summary</h2>
          <ul>
            <li>A hash function converts any input to a fixed-length output</li>
            <li>They are deterministic, one-way, and collision resistant</li>
            <li>Used for file integrity, password storage, Git, and blockchain</li>
            <li>Use bcrypt/Argon2 for passwords; SHA-256 for file checksums and signatures</li>
            <li>MD5 and SHA-1 are broken for security purposes — do not use them for new systems</li>
          </ul>
        </div>
      </article>
    </main>
  )
}
