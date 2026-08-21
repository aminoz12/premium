import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Generate a UUID Online for Free (v4, v1, and What the Difference Is)",
  description:
    "UUIDs v4 and v1 are generated completely differently with different privacy implications. Here's what the versions mean, when each is appropriate, and how to generate them free.",
  path: "/blog/how-to-generate-uuid-free",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-31" />
        <meta itemProp="dateModified" content="2026-05-31" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-31">May 31, 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Generate a UUID Online for Free (v4, v1, and What the Difference Is)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            UUID versions look similar but are generated differently — v1 embeds your MAC address
            and timestamp, which has privacy implications. Here&apos;s what to use and when.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What a UUID is</h2>
          <p>
            A UUID (Universally Unique Identifier) is a 128-bit value formatted as 32 hexadecimal
            digits in five groups: <code>550e8400-e29b-41d4-a716-446655440000</code>.
          </p>
          <p>
            UUIDs are used as database primary keys, session identifiers, file names, API tokens,
            and anywhere you need a unique value that can be generated without a central
            coordination system. Two independently generated UUIDs have an astronomically small
            probability of collision.
          </p>

          <h2>UUID versions explained</h2>
          <h3>Version 4 (v4) — Random</h3>
          <p>
            UUID v4 is generated from 122 bits of cryptographic randomness. The remaining 6 bits
            indicate the version and variant. Example:
          </p>
          <pre><code>f47ac10b-58cc-4372-a567-0e02b2c3d479</code></pre>
          <p>
            Version indicator: the <code>4</code> in the third group is always 4 for v4.
          </p>
          <p>
            <strong>Use v4 for:</strong> database primary keys, session IDs, file identifiers,
            API keys — any situation where you need a unique identifier and sortability by
            creation time is not required.
          </p>

          <h3>Version 1 (v1) — Timestamp + MAC address</h3>
          <p>
            UUID v1 embeds the current timestamp (100-nanosecond intervals since October 15, 1582)
            and the MAC address of the generating machine. Example:
          </p>
          <pre><code>6ba7b810-9dad-11d1-80b4-00c04fd430c8</code></pre>
          <p>
            <strong>Privacy concern:</strong> v1 UUIDs reveal when they were generated and can
            reveal the MAC address of the server that generated them. In 2023, this was implicated
            in identifying servers in several security disclosures.
          </p>
          <p>
            <strong>Use v1 for:</strong> distributed systems where time-ordering of events matters
            and privacy is not a concern — for example, internal event logs where knowing the
            generation order is useful.
          </p>

          <h3>Version 7 (v7) — The modern choice</h3>
          <p>
            UUID v7 (standardized in 2022) combines a Unix timestamp prefix with random bits.
            It is sortable by creation time (like v1) but uses random bits instead of MAC
            addresses (safe like v4). It is the recommended choice for new systems that need
            time-ordered UUIDs.
          </p>
          <p>
            Example: <code>018e6180-abcd-7abc-8def-012345678901</code> — the first 12 hex digits
            encode the Unix timestamp in milliseconds.
          </p>

          <h2>How to generate a UUID free</h2>
          <ol>
            <li>Open the <Link href="/tools/uuid-generator">free UUID generator</Link></li>
            <li>Select the version (v4 for most uses, v1 if you need timestamp ordering)</li>
            <li>Click Generate or copy one of the generated UUIDs</li>
          </ol>
          <p>
            UUIDs are generated in your browser using the Web Crypto API
            (<code>crypto.randomUUID()</code> for v4) — nothing is sent to any server.
          </p>

          <h2>Using UUIDs as database primary keys</h2>
          <p>
            UUID primary keys have tradeoffs compared to sequential integer IDs:
          </p>
          <ul>
            <li>
              <strong>Pro:</strong> can be generated client-side before a database insert —
              useful for offline-capable apps and distributed systems
            </li>
            <li>
              <strong>Pro:</strong> does not reveal record count or creation order (security advantage)
            </li>
            <li>
              <strong>Con:</strong> larger storage size (16 bytes vs 4 bytes for int)
            </li>
            <li>
              <strong>Con:</strong> random UUIDs (v4) cause B-tree index fragmentation — inserts
              are slower on large tables. UUID v7 fixes this because its timestamp prefix keeps
              insertions roughly sequential.
            </li>
          </ul>

          <h2>Validating a UUID</h2>
          <p>
            A valid UUID matches this regex pattern:
          </p>
          <pre><code>{`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`}</code></pre>
          <p>
            Test UUID strings and other patterns with the{" "}
            <Link href="/tools/regex-tester">free regex tester</Link>.
          </p>

          <h2>Summary</h2>
          <ul>
            <li><strong>v4:</strong> random, private, no ordering — use for most identifiers</li>
            <li><strong>v1:</strong> timestamp + MAC address — time-ordered but reveals server identity</li>
            <li><strong>v7:</strong> timestamp prefix + random — best of both, use for new systems needing time-sortable IDs</li>
            <li>Generate UUIDs free with the <Link href="/tools/uuid-generator">UUID generator</Link> — runs in your browser</li>
          </ul>
        </div>
      </article>
    </main>
  )
}
