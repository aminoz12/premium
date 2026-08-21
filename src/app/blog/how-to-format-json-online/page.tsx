import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Format and Validate JSON Online (And Fix the Most Common Errors)",
  description:
    "Malformed JSON breaks APIs silently. Here's how to format and validate JSON in seconds â€” and the three errors that cause 80% of JSON parse failures.",
  path: "/blog/how-to-format-json-online",
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
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-06-02">June 2, 2026</time>
            <span>Â·</span>
            <span>5 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Format and Validate JSON Online (And Fix the Most Common Errors)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Malformed JSON fails silently or throws cryptic parse errors. Here&apos;s how to
            format and validate JSON in seconds â€” and the three mistakes that cause most
            JSON failures.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Why JSON errors are frustrating</h2>
          <p>
            A single misplaced comma or a trailing comma after the last array element causes the
            entire JSON to fail parsing. The error message â€” &quot;Unexpected token &rbrace;&quot; or
            &quot;SyntaxError: JSON Parse error&quot; â€” often points to the wrong line because
            the parser only discovers the error when it hits an unexpected character, not where
            the actual mistake was.
          </p>
          <p>
            A proper JSON formatter parses the input and highlights exactly where the error is,
            making debugging fast.
          </p>

          <h2>How to format JSON in seconds</h2>
          <ol>
            <li>Open the <Link href="/tools/json-formatter">free JSON formatter</Link></li>
            <li>Paste your JSON string</li>
            <li>Click Format â€” valid JSON is pretty-printed with 2-space indentation and syntax highlighting</li>
            <li>If invalid, the error message shows the exact position of the problem</li>
          </ol>
          <p>
            No account required. All processing happens in your browser â€” API responses, database
            exports, and configuration files containing sensitive data are never uploaded anywhere.
          </p>

          <h2>The three errors that cause 80% of JSON failures</h2>
          <h3>1. Trailing commas</h3>
          <p>
            This is valid in JavaScript objects and in languages like Python (trailing commas
            in tuples and lists are allowed). It is not valid in JSON:
          </p>
          <pre><code>{`{
  "name": "Alice",
  "age": 30,   â† trailing comma after last property
}`}</code></pre>
          <p>The comma after 30 is illegal. Remove it.</p>

          <h3>2. Single quotes instead of double quotes</h3>
          <p>
            JSON requires double quotes around all strings â€” keys and values. Single quotes
            are not valid JSON, even though they work in JavaScript:
          </p>
          <pre><code>{`{ 'name': 'Alice' }  â† invalid JSON`}</code></pre>
          <pre><code>{`{ "name": "Alice" }  â† valid JSON`}</code></pre>

          <h3>3. Comments</h3>
          <p>
            JSON does not support comments. This is valid JavaScript but invalid JSON:
          </p>
          <pre><code>{`{
  // user data
  "name": "Alice"
}`}</code></pre>
          <p>
            If you have JSON with comments (sometimes called JSONC â€” used in VS Code config files),
            strip the comments before parsing standard JSON.
          </p>

          <h2>Minifying JSON for production</h2>
          <p>
            The same formatter also minifies JSON â€” removing all whitespace to produce the most
            compact representation. This is useful for:
          </p>
          <ul>
            <li>Reducing API response payload size</li>
            <li>Embedding JSON in HTML without wasted space</li>
            <li>Comparing two JSON strings for equality (minified strings can be compared directly)</li>
          </ul>

          <h2>Validating JSON without formatting</h2>
          <p>
            If you just need to know whether a string is valid JSON without reformatting it, the
            formatter shows a validation result at the top: &quot;Valid JSON&quot; or the specific
            error with position. This is useful for quick validation of API responses without
            needing to read the formatted output.
          </p>

          <h2>JSON vs JavaScript object notation</h2>
          <p>
            A common source of confusion: JavaScript object notation and JSON look almost identical
            but are not the same format. JSON is a strict subset:
          </p>
          <ul>
            <li>JSON requires double quotes; JS allows single and backtick quotes</li>
            <li>JSON doesn&apos;t allow trailing commas; JS does</li>
            <li>JSON doesn&apos;t allow comments; JS does</li>
            <li>JSON doesn&apos;t allow undefined, NaN, or Infinity as values; JS does</li>
            <li>JSON keys must be quoted; JS allows unquoted identifiers</li>
          </ul>

          <h2>Summary</h2>
          <p>
            Format and validate JSON with the{" "}
            <Link href="/tools/json-formatter">free JSON formatter</Link> â€” no account,
            no upload. The three most common errors are trailing commas, single quotes, and
            comments â€” all invalid in JSON. Use the minifier to compress JSON for production
            payloads.
          </p>
        </div>
      </article>
    </main>
  )
}
