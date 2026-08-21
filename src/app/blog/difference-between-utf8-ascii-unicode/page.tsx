import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "UTF-8, ASCII, Unicode: What's the Difference and Why Does It Matter?",
  description:
    "Encoding errors — mysterious box characters and mojibake — come from mismatches between these three. Here's the plain-English explanation with real examples.",
  path: "/blog/difference-between-utf8-ascii-unicode",
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
            <span>7 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            UTF-8, ASCII, Unicode: What&apos;s the Difference and Why Does It Matter?
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            The mysterious box characters, question marks, and garbled accented letters come from
            encoding mismatches. Here&apos;s what each term means and how to fix the problems they cause.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>The hierarchy in one sentence</h2>
          <p>
            Unicode is the standard that assigns a number to every character. UTF-8 is an encoding
            scheme that represents those numbers as bytes. ASCII is an older standard that works
            for only 128 characters — a subset of both.
          </p>

          <h2>ASCII: the original standard</h2>
          <p>
            ASCII (American Standard Code for Information Interchange) was defined in 1963. It
            maps 128 characters to numbers 0–127 — the English alphabet, digits, punctuation,
            and control characters. Every &quot;A&quot; is the number 65. Every &quot;a&quot; is 97.
          </p>
          <p>
            The limitation: 128 characters is only enough for English. No accented letters (é, ü, ñ),
            no Chinese, Arabic, Hebrew, or any other writing system. No emoji.
          </p>

          <h2>Unicode: the universal standard</h2>
          <p>
            Unicode was created in 1991 to assign a unique number — called a code point — to every
            character in every writing system. The current Unicode standard (15.1) defines over 149,000
            characters across 161 scripts, plus emoji.
          </p>
          <p>
            Examples:
          </p>
          <ul>
            <li>A → U+0041</li>
            <li>é → U+00E9</li>
            <li>中 → U+4E2D</li>
            <li>😀 → U+1F600</li>
          </ul>
          <p>
            Unicode defines the characters — it does not define how to store them as bytes in a file
            or transmit them over a network. That is what encoding schemes like UTF-8 are for.
          </p>

          <h2>UTF-8: the dominant encoding</h2>
          <p>
            UTF-8 is a variable-width encoding for Unicode. It represents each character using 1
            to 4 bytes:
          </p>
          <ul>
            <li>ASCII characters (U+0000 to U+007F): 1 byte — identical to ASCII representation</li>
            <li>Most Latin-script accented letters, Greek, Cyrillic: 2 bytes</li>
            <li>Most East Asian characters: 3 bytes</li>
            <li>Emoji, rare characters: 4 bytes</li>
          </ul>
          <p>
            The genius of UTF-8: it is fully backward-compatible with ASCII. Any file that only
            contains ASCII characters is a valid UTF-8 file. This is why UTF-8 became the
            universal encoding for the web — it works for every language while adding no overhead
            for English text.
          </p>
          <p>
            UTF-8 is the encoding for virtually all modern web content: HTML pages, JSON, CSS, most
            source code files, and most databases. If in doubt, use UTF-8.
          </p>

          <h2>UTF-16 and UTF-32</h2>
          <p>
            Other Unicode encodings exist:
          </p>
          <ul>
            <li><strong>UTF-16:</strong> uses 2 or 4 bytes per character. Used internally by Windows, Java, and JavaScript strings. Compact for East Asian text, wasteful for ASCII.</li>
            <li><strong>UTF-32:</strong> always 4 bytes per character. Simple but wastes space. Rarely used in practice.</li>
          </ul>

          <h2>Why encoding errors happen: the mismatch</h2>
          <p>
            An encoding error occurs when text written in one encoding is read in another. Common scenarios:
          </p>
          <ul>
            <li>
              <strong>CSV file saved as Latin-1 (ISO-8859-1) opened in a tool expecting UTF-8:</strong>
              accented characters like é (E9 in Latin-1) appear as garbled multi-byte sequences
            </li>
            <li>
              <strong>MySQL table set to latin1 but receiving UTF-8 data:</strong>
              characters above ASCII are stored incorrectly
            </li>
            <li>
              <strong>Email with no Content-Type charset declaration:</strong>
              mail clients guess the encoding and sometimes guess wrong
            </li>
          </ul>

          <h2>Mojibake: the encoding error you have seen</h2>
          <p>
            &quot;Mojibake&quot; (文字化け) is the Japanese term for garbled text from encoding mismatch.
            The classic example: é encoded as UTF-8 (0xC3 0xA9) read as Windows-1252 produces é.
          </p>
          <p>
            If you see é where é should be, or Â where nothing should be, the text was encoded
            as UTF-8 but decoded as Latin-1 or Windows-1252.
          </p>

          <h2>How to fix encoding problems</h2>
          <ul>
            <li>
              <strong>In HTML:</strong> always include <code>&lt;meta charset=&quot;UTF-8&quot;&gt;</code>
              in the <code>&lt;head&gt;</code>
            </li>
            <li>
              <strong>In MySQL:</strong> set the database, table, and column charset to <code>utf8mb4</code>
              (not <code>utf8</code>, which is MySQL&apos;s broken 3-byte implementation that can&apos;t store emoji)
            </li>
            <li>
              <strong>For CSV files:</strong> specify UTF-8 when opening in Excel (Import → File Origin → UTF-8)
            </li>
            <li>
              <strong>In Python:</strong> use <code>open(file, encoding='utf-8')</code> explicitly
            </li>
          </ul>

          <h2>Summary</h2>
          <ul>
            <li><strong>ASCII:</strong> 128 characters, English only, the original standard</li>
            <li><strong>Unicode:</strong> 149,000+ characters from all writing systems — assigns numbers, not bytes</li>
            <li><strong>UTF-8:</strong> the dominant encoding for Unicode — variable width, backward-compatible with ASCII, use this by default</li>
            <li>Encoding errors are caused by reading text with the wrong encoding — the fix is declaring the correct encoding explicitly everywhere</li>
          </ul>
          <p>
            Need to encode text for safe transport? The{" "}
            <Link href="/tools/base64-encoder">Base64 encoder</Link> and{" "}
            <Link href="/tools/url-encoder">URL encoder</Link> handle the most common
            encoding scenarios.
          </p>
        </div>
      </article>
    </main>
  )
}
