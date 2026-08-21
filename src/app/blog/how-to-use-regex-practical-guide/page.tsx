import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Use Regex: A Practical Guide for the Patterns You Actually Need",
  description:
    "10 regex patterns cover 90% of real use cases: email validation, URL matching, phone numbers, finding things in strings. Here they are with explanations.",
  path: "/blog/how-to-use-regex-practical-guide",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-30" />
        <meta itemProp="dateModified" content="2026-05-30" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-30">May 30, 2026</time>
            <span>·</span>
            <span>8 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Use Regex: A Practical Guide for the Patterns You Actually Need
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Regex looks like noise until you understand 10 core concepts. Once you do, you can
            write patterns for almost every real-world use case. Here&apos;s the practical guide —
            no theory, just patterns that work.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Test all patterns as you read this</h2>
          <p>
            Open the <Link href="/tools/regex-tester">free regex tester</Link> in a new tab.
            Paste any pattern from this article and test it against your own strings in real time.
          </p>

          <h2>The 10 building blocks</h2>
          <table>
            <thead>
              <tr><th>Symbol</th><th>Means</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr><td><code>.</code></td><td>Any character except newline</td><td><code>a.c</code> matches &quot;abc&quot;, &quot;a1c&quot;</td></tr>
              <tr><td><code>*</code></td><td>0 or more of previous</td><td><code>ab*c</code> matches &quot;ac&quot;, &quot;abc&quot;, &quot;abbc&quot;</td></tr>
              <tr><td><code>+</code></td><td>1 or more of previous</td><td><code>ab+c</code> matches &quot;abc&quot;, not &quot;ac&quot;</td></tr>
              <tr><td><code>?</code></td><td>0 or 1 of previous (optional)</td><td><code>colou?r</code> matches &quot;color&quot; and &quot;colour&quot;</td></tr>
              <tr><td><code>^</code></td><td>Start of string</td><td><code>^Hello</code> only matches if starts with &quot;Hello&quot;</td></tr>
              <tr><td><code>$</code></td><td>End of string</td><td><code>world$</code> only matches if ends with &quot;world&quot;</td></tr>
              <tr><td><code>[abc]</code></td><td>Any character in set</td><td><code>[aeiou]</code> matches any vowel</td></tr>
              <tr><td><code>[^abc]</code></td><td>Any character NOT in set</td><td><code>[^0-9]</code> matches any non-digit</td></tr>
              <tr><td><code>\d</code></td><td>Any digit (0-9)</td><td><code>\d+</code> matches one or more digits</td></tr>
              <tr><td><code>\w</code></td><td>Word character (letter, digit, _)</td><td><code>\w+</code> matches a word</td></tr>
            </tbody>
          </table>

          <h2>The patterns you will actually use</h2>

          <h3>Email validation</h3>
          <pre><code>{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`}</code></pre>
          <p>
            Validates the structure of an email address. Note: this does not verify the email
            exists — only that it looks like a valid format. For production, send a confirmation
            email instead of relying on validation alone.
          </p>

          <h3>URL matching</h3>
          <pre><code>{`/https?:\/\/[^\s]+/g`}</code></pre>
          <p>
            Matches http:// and https:// URLs. The <code>?</code> makes the &apos;s&apos; optional.
            The <code>[^\s]+</code> matches everything up to whitespace.
          </p>

          <h3>Phone numbers (flexible)</h3>
          <pre><code>{`/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/`}</code></pre>
          <p>
            Matches most international and US phone number formats. Phone number formats are
            famously inconsistent — consider normalizing before validating.
          </p>

          <h3>Numbers only</h3>
          <pre><code>{`/^\d+$/`}</code></pre>
          <p>
            Validates that a string contains only digits. Useful for ZIP codes, IDs, PINs.
          </p>

          <h3>Alphanumeric only</h3>
          <pre><code>{`/^[a-zA-Z0-9]+$/`}</code></pre>

          <h3>Strong password (8+ chars, upper, lower, digit, symbol)</h3>
          <pre><code>{`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`}</code></pre>
          <p>
            Uses lookaheads (<code>(?=...)</code>) to require each character class without
            specifying position.
          </p>

          <h3>Find all hashtags in text</h3>
          <pre><code>{`/#\w+/g`}</code></pre>
          <p>
            Matches # followed by word characters. The <code>g</code> flag finds all matches.
          </p>

          <h3>Extract content inside quotes</h3>
          <pre><code>{`/"([^"]+)"/g`}</code></pre>
          <p>
            Captures everything inside double quotes. The capturing group <code>([^"]+)</code>
            returns just the content without the quotes.
          </p>

          <h3>Trim leading and trailing whitespace</h3>
          <pre><code>{`/^\s+|\s+$/g`}</code></pre>
          <p>
            Replace with an empty string to trim. Note: in JavaScript, <code>str.trim()</code>
            does the same thing more readably — use the regex when you need more control.
          </p>

          <h3>Match hex color codes</h3>
          <pre><code>{`/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g`}</code></pre>
          <p>
            Matches 6-digit (#ffffff) and 3-digit (#fff) hex color codes.
          </p>

          <h2>Flags you need to know</h2>
          <ul>
            <li><code>g</code> — global: find all matches, not just the first</li>
            <li><code>i</code> — case-insensitive: treat A and a as the same</li>
            <li><code>m</code> — multiline: ^ and $ match the start/end of each line, not just the whole string</li>
            <li><code>s</code> — dotAll: make . match newlines too</li>
          </ul>

          <h2>Summary</h2>
          <p>
            The patterns above cover the majority of real-world regex use. Test them with the{" "}
            <Link href="/tools/regex-tester">free regex tester</Link> — paste the pattern,
            paste your test string, see matches highlighted in real time. For complex patterns,
            read them from left to right and break them into smaller pieces.
          </p>
        </div>
      </article>
    </main>
  )
}
