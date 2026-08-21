import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "Unix Timestamp to Date: What Unix Time Is and How to Convert It",
  description:
    "Unix timestamps explained â€” what 1748822400 means, why January 1 1970, the 2038 problem, and how to convert timestamps to human-readable dates free.",
  path: "/blog/unix-timestamp-to-date-guide",
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
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            Unix Timestamp to Date: What Unix Time Is and How to Convert It
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Unix timestamps are everywhere in APIs, logs, and databases â€” but they&apos;re just a number of seconds since January 1, 1970. Here&apos;s everything you need to understand and convert them.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What is a Unix timestamp?</h2>
          <p>
            A Unix timestamp (also called Unix time, POSIX time, or epoch time) is the number of seconds that have elapsed since <strong>January 1, 1970, 00:00:00 UTC</strong>. This reference point is called the &quot;Unix epoch.&quot;
          </p>
          <p>
            As of June 2026, the current Unix timestamp is approximately <strong>1,748,822,400</strong>. Every second, this number increases by 1.
          </p>
          <p>
            Unix timestamps are timezone-independent by design â€” they always measure seconds from the UTC epoch. When you convert to a human-readable date, timezone conversion is a separate step.
          </p>
          <p>
            Convert any Unix timestamp to a human-readable date with the <Link href="/tools/unix-timestamp-converter">free Unix timestamp converter</Link>.
          </p>

          <h2>Why January 1, 1970?</h2>
          <p>
            Unix was developed at Bell Labs in the late 1960s. When the development team needed a reference point for time, they chose January 1, 1970 â€” a recent, round date that was near the start of the Unix development era. The choice was somewhat arbitrary, but it has been the standard for all Unix-derived systems (Linux, macOS, iOS, Android) ever since.
          </p>
          <p>
            Windows uses a different epoch: January 1, 1601 (the start of a 400-year Gregorian calendar cycle). The .NET DateTime type also uses 1601. This is why converting timestamps between Windows and Unix systems requires adding or subtracting the difference (11644473600 seconds).
          </p>

          <h2>Milliseconds vs. seconds</h2>
          <p>
            A critical distinction: some systems store Unix timestamps in <strong>seconds</strong> (13 digits in 2026 â€” e.g., 1748822400), and others store them in <strong>milliseconds</strong> (16 digits â€” e.g., 1748822400000).
          </p>
          <p>
            JavaScript&apos;s <code>Date.now()</code> returns milliseconds. Most Unix system calls and APIs return seconds. If you see an unusually large timestamp (16 digits) or an unusually small one (10 digits) when you expected the other, this is usually the cause.
          </p>
          <p>
            Quick check in JavaScript:
          </p>
          <pre><code>{`// Seconds (10 digits in 2026)
Math.floor(Date.now() / 1000)  // â†’ 1748822400

// Milliseconds (13 digits in 2026)
Date.now()  // â†’ 1748822400000`}</code></pre>

          <h2>Converting Unix timestamps in code</h2>
          <p>
            In JavaScript:
          </p>
          <pre><code>{`// Timestamp to readable date
const timestamp = 1748822400;
const date = new Date(timestamp * 1000);  // convert seconds to ms
console.log(date.toISOString());  // "2025-06-02T00:00:00.000Z"
console.log(date.toLocaleDateString());  // locale-dependent format

// Current timestamp (seconds)
const now = Math.floor(Date.now() / 1000);`}</code></pre>
          <p>
            In Python:
          </p>
          <pre><code>{`from datetime import datetime, timezone

timestamp = 1748822400
dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
print(dt.isoformat())  # "2025-06-02T00:00:00+00:00"

# Current timestamp
import time
now = int(time.time())`}</code></pre>
          <p>
            In SQL (MySQL):
          </p>
          <pre><code>{`-- Convert timestamp column to readable date
SELECT FROM_UNIXTIME(created_at) FROM users;

-- Convert date to timestamp
SELECT UNIX_TIMESTAMP('2026-06-02 00:00:00');`}</code></pre>

          <h2>The 2038 problem</h2>
          <p>
            32-bit signed integers can store values up to 2,147,483,647. Unix timestamps stored as 32-bit integers will overflow on <strong>January 19, 2038, at 03:14:07 UTC</strong>. After this point, a 32-bit timestamp would roll over to a negative number, causing systems to interpret the date as December 13, 1901.
          </p>
          <p>
            This is the &quot;Year 2038 problem&quot; (Y2K38), analogous to the Y2K problem of 2000.
          </p>
          <p>
            The solution: use 64-bit integers for timestamp storage. A signed 64-bit integer won&apos;t overflow for approximately 292 billion years. Most modern systems (Linux since kernel 5.1 on 32-bit ARM, databases with BIGINT timestamp columns, 64-bit applications) already use 64-bit time storage.
          </p>
          <p>
            Where 2038 is still a concern: embedded systems, legacy 32-bit firmware, old databases using INT columns for timestamps, and some older programming languages that default to 32-bit integers.
          </p>

          <h2>Unix timestamps in APIs and databases</h2>
          <p>
            Unix timestamps are ubiquitous in technical systems:
          </p>
          <ul>
            <li><strong>Database columns:</strong> Many databases store <code>created_at</code> and <code>updated_at</code> as Unix timestamps (integers) for efficient comparison and arithmetic, even when the display format is human-readable.</li>
            <li><strong>API responses:</strong> REST APIs frequently return timestamps as integers (e.g., Stripe, Twilio, GitHub, Slack). Always check whether the API returns seconds or milliseconds â€” documentation usually specifies.</li>
            <li><strong>Log files:</strong> System logs, Apache/Nginx access logs, and application logs often include Unix timestamps for precise event ordering.</li>
            <li><strong>JWT tokens:</strong> The <code>exp</code> (expiration), <code>iat</code> (issued at), and <code>nbf</code> (not before) claims in JWT tokens are Unix timestamps in seconds.</li>
          </ul>

          <h2>Negative timestamps</h2>
          <p>
            Timestamps before January 1, 1970 are negative. The timestamp for January 1, 1900 would be approximately -2,208,988,800. Most systems handle negative timestamps correctly for modern use cases.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/unix-timestamp-converter">Free Unix Timestamp Converter</Link> â€” convert between Unix timestamps and human-readable dates in any timezone</li>
            <li><Link href="/tools/json-formatter">Free JSON Formatter</Link> â€” format API responses containing timestamps for easy reading</li>
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
