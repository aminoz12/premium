import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "Regex Cheat Sheet for Beginners: The Patterns You'll Actually Use",
  description:
    "The regex patterns every developer uses â€” character classes, quantifiers, anchors, groups, and lookaheads â€” with examples and a free live tester.",
  path: "/blog/regex-cheat-sheet-beginners",
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
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            Regex Cheat Sheet for Beginners: The Patterns You&apos;ll Actually Use
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            90% of regex use cases are covered by the same 20 patterns. Here&apos;s the practical subset â€” not an exhaustive reference â€” with real examples and a live tester to try them immediately.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <p>
            Test every pattern in this guide using the <Link href="/tools/regex-tester">free regex tester</Link> â€” paste the pattern, enter test strings, and see matches highlighted instantly.
          </p>

          <h2>Character classes</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Pattern</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Matches</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono">\d</td><td className="border border-gray-200 p-3 text-gray-600">Any digit (0â€“9)</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\d+ matches "42" in "abc42"</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">\D</td><td className="border border-gray-200 p-3 text-gray-600">Any non-digit</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\D+ matches "abc" in "abc42"</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">\w</td><td className="border border-gray-200 p-3 text-gray-600">Word char: [a-zA-Z0-9_]</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\w+ matches "hello_world"</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">\W</td><td className="border border-gray-200 p-3 text-gray-600">Non-word character</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\W matches spaces, punctuation</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">\s</td><td className="border border-gray-200 p-3 text-gray-600">Whitespace (space, tab, newline)</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\s+ collapses multiple spaces</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">.</td><td className="border border-gray-200 p-3 text-gray-600">Any character except newline</td><td className="border border-gray-200 p-3 font-mono text-gray-600">c.t matches "cat", "cut", "c4t"</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">[abc]</td><td className="border border-gray-200 p-3 text-gray-600">a, b, or c</td><td className="border border-gray-200 p-3 font-mono text-gray-600">[aeiou] matches vowels</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">[^abc]</td><td className="border border-gray-200 p-3 text-gray-600">NOT a, b, or c</td><td className="border border-gray-200 p-3 font-mono text-gray-600">[^0-9] matches non-digits</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">[a-z]</td><td className="border border-gray-200 p-3 text-gray-600">Lowercase a through z</td><td className="border border-gray-200 p-3 font-mono text-gray-600">[a-zA-Z] matches any letter</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Quantifiers</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Quantifier</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Meaning</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono">*</td><td className="border border-gray-200 p-3 text-gray-600">0 or more</td><td className="border border-gray-200 p-3 font-mono text-gray-600">ab* matches "a", "ab", "abbb"</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">+</td><td className="border border-gray-200 p-3 text-gray-600">1 or more</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\d+ matches one or more digits</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">?</td><td className="border border-gray-200 p-3 text-gray-600">0 or 1 (optional)</td><td className="border border-gray-200 p-3 font-mono text-gray-600">colou?r matches "color" and "colour"</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">{"{n}"}</td><td className="border border-gray-200 p-3 text-gray-600">Exactly n times</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\d{"{4}"} matches exactly 4 digits</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">{"{n,}"}</td><td className="border border-gray-200 p-3 text-gray-600">n or more times</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\d{"{3,}"} matches 3+ digits</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">{"{n,m}"}</td><td className="border border-gray-200 p-3 text-gray-600">Between n and m times</td><td className="border border-gray-200 p-3 font-mono text-gray-600">\d{"{2,4}"} matches 2, 3, or 4 digits</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Anchors and boundaries</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Pattern</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono">^</td><td className="border border-gray-200 p-3 text-gray-600">Start of string (or line in multiline mode)</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">$</td><td className="border border-gray-200 p-3 text-gray-600">End of string (or line in multiline mode)</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">\b</td><td className="border border-gray-200 p-3 text-gray-600">Word boundary â€” between \w and \W</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono">\B</td><td className="border border-gray-200 p-3 text-gray-600">Non-word boundary</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <code>^\d+$</code> matches a string that contains only digits (nothing else). Without anchors, <code>\d+</code> would match the digits inside any string, including strings with other characters.
          </p>

          <h2>Groups and alternation</h2>
          <pre><code>{`(cat|dog)      # Matches "cat" or "dog"
(https?)       # Matches "http" or "https" (s is optional)
(?:abc)        # Non-capturing group â€” groups without creating a backreference
(\\w+)@(\\w+) # Capture groups â€” \\1 = username, \\2 = domain`}</code></pre>
          <p>
            Non-capturing groups <code>(?:...)</code> are useful when you need to group for alternation but don&apos;t need the matched text â€” they&apos;re slightly faster and don&apos;t pollute your backreference list.
          </p>

          <h2>The patterns you&apos;ll use most</h2>
          <pre><code>{`# Email (basic â€” full RFC 5322 compliance is impractical)
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$

# URL
https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b[-a-zA-Z0-9@:%_+.~#?&/=]*

# IPv4 address
^(\\d{1,3}\\.){3}\\d{1,3}$

# Date (YYYY-MM-DD)
^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$

# US phone number
^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$

# Hex color
^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$

# Slug (URL-safe string)
^[a-z0-9]+(?:-[a-z0-9]+)*$

# Whitespace trimmer (replace with empty string)
^\\s+|\\s+$

# HTML tag stripper (remove all tags)
<[^>]*>`}</code></pre>

          <h2>Flags that change matching behavior</h2>
          <ul>
            <li><strong><code>i</code> (case-insensitive):</strong> <code>/hello/i</code> matches "Hello", "HELLO", "hello"</li>
            <li><strong><code>g</code> (global):</strong> Find all matches, not just the first one</li>
            <li><strong><code>m</code> (multiline):</strong> <code>^</code> and <code>$</code> match start/end of each line, not just the whole string</li>
            <li><strong><code>s</code> (dotAll):</strong> <code>.</code> matches newlines too</li>
          </ul>

          <h2>Common mistakes</h2>
          <ul>
            <li><strong>Forgetting to escape dots.</strong> <code>.</code> in regex means "any character." To match a literal dot, use <code>\.</code>. The regex <code>thefreeaitools.com</code> also matches "thefreeaitools_com" â€” use <code>thefreeaitools\.com</code>.</li>
            <li><strong>Greedy vs. lazy matching.</strong> <code>&lt;.+&gt;</code> is greedy â€” it matches from the first <code>&lt;</code> to the LAST <code>&gt;</code>. Use <code>&lt;.+?&gt;</code> for lazy matching (shortest possible match).</li>
            <li><strong>Catastrophic backtracking.</strong> Nested quantifiers like <code>(a+)+</code> on a string that doesn&apos;t match can cause exponential backtracking and hang the browser. Avoid patterns with nested quantifiers on large inputs.</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/regex-tester">Free Regex Tester</Link> â€” test patterns against real strings with live highlighting</li>
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
