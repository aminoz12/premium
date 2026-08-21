import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "Binary to Text Conversion: How Computers Encode Characters",
  description:
    "How binary numbers represent text, how ASCII and Unicode work, and how to convert binary to text and back with a free online converter.",
  path: "/blog/binary-to-text-conversion-guide",
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
            Binary to Text Conversion: How Computers Encode Characters
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Every character you type is stored as a number, which is stored as binary. Here&apos;s how that works â€” from ASCII to Unicode â€” and how to convert binary to text free online.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>How binary represents numbers</h2>
          <p>
            Binary is base-2 â€” each digit (bit) is either 0 or 1. To understand binary values, compare with decimal (base-10):
          </p>
          <ul>
            <li>In decimal, each position is a power of 10: ones, tens, hundreds...</li>
            <li>In binary, each position is a power of 2: ones, twos, fours, eights, sixteens...</li>
          </ul>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Binary</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Calculation</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Decimal</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">0000 0001</td><td className="border border-gray-200 p-3 text-gray-600">1</td><td className="border border-gray-200 p-3 text-gray-600">1</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">0000 0010</td><td className="border border-gray-200 p-3 text-gray-600">2</td><td className="border border-gray-200 p-3 text-gray-600">2</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">0100 0001</td><td className="border border-gray-200 p-3 text-gray-600">64 + 1</td><td className="border border-gray-200 p-3 text-gray-600">65</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">0110 0001</td><td className="border border-gray-200 p-3 text-gray-600">64 + 32 + 1</td><td className="border border-gray-200 p-3 text-gray-600">97</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">1111 1111</td><td className="border border-gray-200 p-3 text-gray-600">128+64+32+16+8+4+2+1</td><td className="border border-gray-200 p-3 text-gray-600">255</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            8 bits = 1 byte. A byte can represent 256 values (0â€“255). This is why bytes are the fundamental unit of computer data.
          </p>

          <h2>ASCII: the original text encoding</h2>
          <p>
            ASCII (American Standard Code for Information Interchange) was developed in 1963 and assigns a number to each printable character and control code. It uses 7 bits (128 values, 0â€“127):
          </p>
          <ul>
            <li>0â€“31: Control characters (carriage return, newline, tab...)</li>
            <li>32: Space</li>
            <li>48â€“57: Digits 0â€“9</li>
            <li>65â€“90: Uppercase Aâ€“Z (65 = &apos;A&apos;, 90 = &apos;Z&apos;)</li>
            <li>97â€“122: Lowercase aâ€“z (97 = &apos;a&apos;, 122 = &apos;z&apos;)</li>
          </ul>
          <p>
            So &apos;A&apos; = 65 decimal = 01000001 binary. &apos;a&apos; = 97 decimal = 01100001 binary. Notice that lowercase letters are exactly 32 more than their uppercase equivalents â€” this is why toggling bit 5 (decimal 32) switches between upper and lowercase in ASCII.
          </p>
          <p>
            The word &quot;Hello&quot; in binary:
          </p>
          <pre><code>{`H = 72  = 01001000
e = 101 = 01100101
l = 108 = 01101100
l = 108 = 01101100
o = 111 = 01101111`}</code></pre>
          <p>
            Convert any text to binary (and back) with the <Link href="/tools/binary-to-text">free binary to text converter</Link>.
          </p>

          <h2>Extended ASCII and code pages</h2>
          <p>
            ASCII only covers English characters. To support other Western European languages (Ã©, Ã¼, Ã±...), &quot;extended ASCII&quot; used the 8th bit to add 128 more characters (128â€“255). Different countries used different &quot;code pages&quot; â€” mapping numbers 128â€“255 to their local characters.
          </p>
          <p>
            The problem: a document encoded with ISO-8859-1 (Western European) would display as garbage on a system using ISO-8859-5 (Cyrillic). This &quot;character encoding mismatch&quot; was a persistent headache through the 1990s.
          </p>

          <h2>Unicode: the universal standard</h2>
          <p>
            Unicode assigns a unique code point to every character in every human writing system â€” over 149,000 characters as of Unicode 15 (2022). Code points are written as U+XXXX (e.g., U+0041 = &apos;A&apos;, U+00E9 = &apos;Ã©&apos;, U+1F600 = &apos;ðŸ˜€&apos;).
          </p>
          <p>
            Unicode defines the characters. UTF-8 (the most common encoding) is how those code points are stored as bytes:
          </p>
          <ul>
            <li>Code points 0â€“127: stored as 1 byte (identical to ASCII â€” backwards compatible)</li>
            <li>Code points 128â€“2047: stored as 2 bytes</li>
            <li>Code points 2048â€“65535: stored as 3 bytes</li>
            <li>Code points 65536+: stored as 4 bytes (emoji, rare historic scripts)</li>
          </ul>
          <p>
            UTF-8&apos;s backwards compatibility with ASCII means ASCII-encoded text is also valid UTF-8 â€” which made the transition from ASCII to Unicode smooth for most systems.
          </p>

          <h2>Binary in programming contexts</h2>
          <p>
            You rarely write raw binary in code â€” programmers use hexadecimal (hex) instead. Hex (base-16) uses digits 0â€“9 and Aâ€“F, and each hex digit represents exactly 4 bits (one nibble). This makes the mapping to bytes natural:
          </p>
          <ul>
            <li>1 byte = 2 hex digits = 8 binary digits</li>
            <li><code>FF</code> (hex) = <code>1111 1111</code> (binary) = 255 (decimal)</li>
            <li><code>41</code> (hex) = <code>0100 0001</code> (binary) = 65 (decimal) = &apos;A&apos; (ASCII)</li>
          </ul>
          <p>
            Memory addresses, color codes (CSS <code>#FF6B6B</code>), cryptographic hashes, and network protocols are all typically expressed in hexadecimal.
          </p>

          <h2>Why this matters practically</h2>
          <p>
            Understanding binary-to-text encoding matters when:
          </p>
          <ul>
            <li>Debugging character encoding issues (&quot;mojibake&quot; â€” garbled text from encoding mismatches)</li>
            <li>Working with binary file formats or network protocols at the byte level</li>
            <li>Understanding why emoji take more bytes than ASCII characters in databases (a UTF-8 emoji is 4 bytes; a letter is 1 byte)</li>
            <li>Investigating why a database column is &quot;too long&quot; when the character count looks fine (byte count vs. character count)</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/binary-to-text">Free Binary to Text Converter</Link> â€” convert between binary, text, hex, and decimal</li>
            <li><Link href="/tools/base64-encoder">Free Base64 Encoder</Link> â€” encode binary data as text (different encoding)</li>
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
