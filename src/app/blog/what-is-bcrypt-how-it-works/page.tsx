import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "What Is Bcrypt and How Does It Work? A Plain-English Explanation",
  description:
    "Bcrypt shows up in every authentication system, but docs assume you know why slow hashing matters. Here's how it works, what the cost factor does, and why SHA-256 is wrong for passwords.",
  path: "/blog/what-is-bcrypt-how-it-works",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-28" />
        <meta itemProp="dateModified" content="2026-05-28" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-28">May 28, 2026</time>
            <span>·</span>
            <span>8 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            What Is Bcrypt and How Does It Work? (A Plain-English Explanation)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Bcrypt is in every authentication tutorial but rarely explained. Here&apos;s how it
            works, why &quot;slow&quot; is a feature, and the one mistake developers make that
            makes it pointless.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Why you need a special algorithm for passwords</h2>
          <p>
            When a user creates a password, you should never store the password itself — you store
            a hash of it. When they log in, you hash their input and compare it to the stored hash.
          </p>
          <p>
            The problem: not all hashes are created equal for this purpose. A general-purpose
            cryptographic hash like SHA-256 is designed to be fast — it can hash millions of values
            per second on modern hardware. That speed is the enemy of password security.
          </p>
          <p>
            If your database is breached and an attacker gets your stored hashes, they can try
            billions of password guesses per second against a SHA-256 hash. The entire list of
            common passwords, every word in every dictionary, and many short random strings can be
            tested in minutes on a modern GPU.
          </p>

          <h2>Bcrypt&apos;s key innovation: deliberate slowness</h2>
          <p>
            Bcrypt was designed in 1999 by Niels Provos and David Mazières specifically as a
            password hashing function. Its key design goal: be configurable slow.
          </p>
          <p>
            Bcrypt introduces a <strong>cost factor</strong> (also called work factor) — an integer
            that controls how many iterations the algorithm runs. Each increase of 1 in the cost
            factor doubles the computation time:
          </p>
          <ul>
            <li>Cost 10: ~100ms per hash on a modern server</li>
            <li>Cost 12: ~400ms per hash</li>
            <li>Cost 14: ~1.6 seconds per hash</li>
          </ul>
          <p>
            For a legitimate user logging in, waiting 100–400ms is imperceptible. For an attacker
            trying billions of guesses, that 100ms per attempt means ~10 guesses per second instead
            of billions. A billion-guess attack that takes 1 second against SHA-256 takes 3 years
            against bcrypt cost 10.
          </p>

          <h2>What a bcrypt hash looks like</h2>
          <p>
            A bcrypt hash is always 60 characters long:
          </p>
          <pre><code>$2b$12$eImiTXuWVxfM37uY4JANjQ.VedKfP9mYGCvbdGLMhfD6z0yXkQxYW</code></pre>
          <p>
            The parts:
          </p>
          <ul>
            <li><code>$2b$</code> — algorithm version (2b is current)</li>
            <li><code>12$</code> — cost factor (12 here)</li>
            <li>Next 22 characters — the salt (random, generated automatically)</li>
            <li>Final 31 characters — the actual hash</li>
          </ul>
          <p>
            The salt is embedded in the hash itself — you do not need to store it separately.
            This also means two hashes of the same password will be different (different random
            salts), which prevents rainbow table attacks.
          </p>

          <h2>The salt: why the same password hashes differently every time</h2>
          <p>
            A salt is a random value added to the input before hashing. Bcrypt generates a new
            random 128-bit salt for every hash operation.
          </p>
          <p>
            Without salts: if two users have the password &quot;abc123,&quot; their hashes are identical.
            An attacker who cracks one cracks both. Pre-computed rainbow tables (massive lookup
            tables of password→hash mappings) work instantly.
          </p>
          <p>
            With salts: &quot;abc123&quot; + salt_A produces a different hash than &quot;abc123&quot; + salt_B.
            Every hash is unique. Rainbow tables are useless.
          </p>

          <h2>Choosing the right cost factor</h2>
          <p>
            The right cost factor is the highest value where hashing stays under your acceptable
            response time — typically 100–300ms for a login endpoint.
          </p>
          <ul>
            <li>Most applications use cost 10–12</li>
            <li>High-security applications use 12–14</li>
            <li>As servers get faster, incrementing the cost factor keeps pace — this is why the factor is configurable</li>
          </ul>
          <p>
            Test bcrypt at different cost factors using the{" "}
            <Link href="/tools/bcrypt">free bcrypt generator and verifier</Link> — it shows
            the hash output and lets you verify a password against a stored hash.
          </p>

          <h2>Bcrypt vs SHA-256 for passwords</h2>
          <p>
            SHA-256 should never be used to hash passwords, even with a salt. The reason is speed:
            a GPU can compute 8 billion SHA-256 operations per second. A bcrypt at cost 12 is
            limited to about 250 per second on the same hardware. The difference is 32 million to 1.
          </p>

          <h2>Bcrypt vs Argon2</h2>
          <p>
            Argon2 is the winner of the Password Hashing Competition (2015) and is the current
            recommended algorithm. It is memory-hard in addition to being computationally slow —
            GPU and ASIC attacks that excel at computation are less effective when they also
            need large amounts of memory per guess.
          </p>
          <p>
            If you are building a new system, prefer Argon2id. For existing bcrypt implementations,
            there is no urgent need to migrate — bcrypt is still secure when used correctly.
          </p>

          <h2>Summary</h2>
          <ul>
            <li>Bcrypt is deliberately slow — each increase in cost factor doubles computation time</li>
            <li>It generates a random salt automatically and embeds it in the hash</li>
            <li>Always use a cost factor of at least 10 for production</li>
            <li>Never use SHA-256, MD5, or any fast hash for passwords</li>
            <li>For new systems, consider Argon2id instead</li>
            <li>Test and generate hashes with the <Link href="/tools/bcrypt">free bcrypt tool</Link></li>
          </ul>
        </div>
      </article>
    </main>
  )
}
