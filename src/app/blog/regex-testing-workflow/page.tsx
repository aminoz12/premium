import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How I Test Regex Before It Breaks Production: A Practical Workflow",
  description:
    "Regular expressions are the one code construct where a single wrong character silently changes behavior with no compile error. Here's the workflow I use to test regex safely before it ships.",
  path: "/blog/regex-testing-workflow",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-03" />
        <meta itemProp="dateModified" content="2026-05-03" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-03">May 3, 2026</time>
            <span>·</span>
            <span>9 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            How I Test Regex Before It Breaks Production: A Practical Workflow
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Regular expressions are the one code construct where a single wrong character silently
            changes behavior — no compile error, no runtime exception, just wrong results in
            production three months later. Here&apos;s the workflow I use every time I write or modify
            a regex.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The bug that took 6 hours to trace</h2>
          <p>
            I had a regex for validating phone numbers that I thought was correct. It had been
            in production for two months. Then a user with a phone number starting with +212 (Morocco)
            couldn&apos;t submit a form. The regex was <code>{"/^\\+?[1-9]\\d{9,14}$/"}</code>. It rejected
            +212XXXXXXXXX because 12 digits is one more than my range allowed for numbers with a
            country code. It had been silently rejecting every Moroccan phone number since deployment.
          </p>
          <p>
            The fix was one character. The problem was I had written the regex in isolation without
            testing edge cases. I had tested it on US and UK numbers, which fell within the length
            range. Moroccan numbers with the country code are 12 digits — just over the limit I had
            assumed was correct.
          </p>

          <h2>Why regex is uniquely risky</h2>
          <p>
            Most code errors announce themselves. A null reference throws an exception. A wrong
            function name fails at parse time. A typo in a variable breaks the build.
          </p>
          <p>
            Regex errors are silent. A pattern that is slightly wrong may match 99% of inputs
            correctly and fail only on edge cases that your test data doesn&apos;t include — international
            phone formats, special characters in email addresses, Unicode characters in usernames,
            file paths with spaces, URLs with query strings. These cases show up in production from
            real users, not in unit tests written by the developer who designed the pattern.
          </p>

          <h2>The five-step workflow</h2>

          <h3>Step 1: Write the happy path cases first</h3>
          <p>
            Before writing the regex, write out 5–10 examples of strings that SHOULD match. For
            a phone number validator:
          </p>
          <ul>
            <li><code>+1 555 123 4567</code></li>
            <li><code>+44 20 7946 0958</code></li>
            <li><code>+212 600 123456</code></li>
            <li><code>555-123-4567</code></li>
            <li><code>(555) 123-4567</code></li>
          </ul>
          <p>
            This forces you to think about the scope of the problem before you start writing
            symbols. Most regex bugs come from writers who start with the syntax and forget a
            format variant.
          </p>

          <h3>Step 2: Write the rejection cases</h3>
          <p>
            Write 5–10 examples that should NOT match and explain why each one fails:
          </p>
          <ul>
            <li><code>not-a-phone</code> — obviously invalid</li>
            <li><code>12345</code> — too short</li>
            <li><code>+0 555 123 4567</code> — leading zero in country code</li>
            <li><code>555 123 4567 ext 42</code> — extension not in scope</li>
            <li><code>++1 555 123 4567</code> — double plus</li>
          </ul>

          <h3>Step 3: Write the edge cases that could go either way</h3>
          <p>
            The edge cases are where most bugs live. Document your decision for each one:
          </p>
          <ul>
            <li><code>+1(555)1234567</code> — no spaces, no separators: should this match?</li>
            <li><code>+1 555 123 45 67</code> — unusual grouping: yes or no?</li>
            <li><code>555.123.4567</code> — period separators: in scope?</li>
          </ul>
          <p>
            Deciding edge cases before writing the regex prevents you from accidentally writing
            a pattern that handles them one way when you intended the other.
          </p>

          <h3>Step 4: Test in the regex tester with all three categories</h3>
          <p>
            Open the{" "}
            <Link href="/tools/regex-tester">regex tester</Link> and paste all three categories
            of test strings. Check:
          </p>
          <ul>
            <li>Every happy path string matches (green)</li>
            <li>Every rejection string does not match (no highlight)</li>
            <li>Edge cases behave according to your documented decision</li>
          </ul>
          <p>
            If any happy path string fails, your regex is wrong. If any rejection string matches,
            your regex is too permissive.
          </p>

          <h3>Step 5: Test for catastrophic backtracking</h3>
          <p>
            Regex engines can be exponentially slow on certain patterns when given malicious or
            unexpected input. This is called ReDoS (Regular Expression Denial of Service). Patterns
            with nested quantifiers are particularly vulnerable: <code>(a+)+</code>,{" "}
            <code>(a*)*</code>, <code>([a-zA-Z]+)*</code>.
          </p>
          <p>
            Test your regex with a long string of characters that partially match but ultimately
            fail. For example, if your email regex uses <code>[a-zA-Z0-9._%+-]+</code> for the
            local part, test it with a 50-character string that ends with an invalid character
            (e.g., 50 letters followed by a space). If the browser pauses or the test takes more
            than 100ms, you have a backtracking problem.
          </p>

          <h2>The five regex patterns I use most often (and their gotchas)</h2>

          <h3>Email validation</h3>
          <p>
            <code>{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/`}</code>
          </p>
          <p>
            Gotcha: This rejects technically valid email addresses with quotes or IP addresses
            in the domain (<code>&quot;user name&quot;@example.com</code>, <code>user@[127.0.0.1]</code>).
            For 99% of web forms, these are acceptable false negatives. For systems that must
            accept any RFC 5321-compliant address, use a dedicated email parsing library instead.
          </p>

          <h3>URL validation (permissive)</h3>
          <p>
            <code>{`/^https?:\\/\\/[^\\s/$.?#].[^\\s]*$/`}</code>
          </p>
          <p>
            Gotcha: This accepts malformed URLs that browsers would reject. For form validation
            where you want to catch obvious mistakes, it&apos;s fine. For systems that will fetch the
            URL, use <code>new URL(input)</code> in JavaScript — it throws on invalid URLs and is
            maintained by the browser engine.
          </p>

          <h3>Slug validation (URL-safe strings)</h3>
          <p>
            <code>{`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`}</code>
          </p>
          <p>
            Gotcha: Does not allow leading or trailing hyphens, does not allow consecutive hyphens.
            This is intentional for URL slugs. If you need to allow consecutive hyphens (e.g., for
            CSS class names), use <code>/^[a-z0-9-]+$/</code> instead.
          </p>

          <h3>IPv4 address</h3>
          <p>
            <code>{`/^(25[0-5]|2[0-4]\\d|1?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|1?\\d{1,2})){3}$/`}</code>
          </p>
          <p>
            Gotcha: Most simple IPv4 patterns accept invalid octets like 999. This pattern
            validates the numeric range (0–255) per octet. It does not validate that the IP is
            routable or that it&apos;s not a reserved range.
          </p>

          <h2>Regex flags to know</h2>
          <p>
            JavaScript regex supports flags that fundamentally change behavior:
          </p>
          <ul>
            <li><code>g</code> — global: find all matches, not just the first.</li>
            <li><code>i</code> — case-insensitive: <code>/abc/i</code> matches ABC, abc, Abc.</li>
            <li><code>m</code> — multiline: <code>^</code> and <code>$</code> match start/end of
              each line, not just the full string.</li>
            <li><code>s</code> — dotAll: <code>.</code> matches newlines (by default it doesn&apos;t).</li>
            <li><code>u</code> — Unicode: enables proper handling of Unicode code points above U+FFFF.</li>
          </ul>
          <p>
            The <code>m</code> flag is a common source of bugs: a pattern with <code>^</code> and{" "}
            <code>$</code> designed to validate a single-line string will pass multiline input if
            the <code>m</code> flag is on, because <code>^</code> matches the start of any line,
            not the start of the full string.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/regex-tester">Regex Tester</Link>{" "}
              — test regex patterns against multiple strings with live highlighting and match details.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. The phone number bug described above
            happened in November 2024; the fix took 30 seconds once traced.
          </p>
        </div>
      </article>
    </main>
  )
}
