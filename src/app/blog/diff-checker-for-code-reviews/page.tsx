import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "Diff Checker for Code Reviews: How to Compare Text and Code Changes",
  description:
    "How diff tools work, when to use an online diff checker vs. git diff, and how to read unified diff output during code reviews.",
  path: "/blog/diff-checker-for-code-reviews",
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
            Diff Checker for Code Reviews: How to Compare Text and Code Changes
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Diff tools show you exactly what changed between two versions of text or code. Here&apos;s how they work, how to read diff output, and when a browser-based diff checker is the right tool.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What diff tools actually do</h2>
          <p>
            A diff tool compares two versions of a text and identifies the minimum set of changes (insertions and deletions) needed to transform one into the other. This is the Longest Common Subsequence (LCS) problem â€” finding the longest shared sequence of lines between two texts.
          </p>
          <p>
            The result highlights:
          </p>
          <ul>
            <li><strong>Lines added</strong> â€” present in the new version but not the old (typically shown in green)</li>
            <li><strong>Lines removed</strong> â€” present in the old version but not the new (typically shown in red)</li>
            <li><strong>Lines unchanged</strong> â€” present in both versions (shown without color, sometimes hidden for compactness)</li>
          </ul>
          <p>
            Compare any two text files with the <Link href="/tools/diff-checker">free diff checker</Link> â€” paste two versions and see the changes highlighted instantly.
          </p>

          <h2>Reading unified diff format</h2>
          <p>
            Git and most diff tools output &quot;unified diff&quot; format. Here&apos;s how to read it:
          </p>
          <pre><code>{`--- a/config.js
+++ b/config.js
@@ -12,7 +12,8 @@ const config = {
   timeout: 5000,
-  retries: 3,
+  retries: 5,
+  retryDelay: 1000,
   debug: false,
 }`}</code></pre>
          <ul>
            <li><code>---</code> and <code>+++</code> identify the old and new files</li>
            <li><code>@@ -12,7 +12,8 @@</code> is the &quot;hunk header&quot; â€” <code>-12,7</code> means starting at line 12, showing 7 lines from the old file; <code>+12,8</code> means starting at line 12, showing 8 lines in the new file (one line added)</li>
            <li>Lines starting with <code>-</code> were removed</li>
            <li>Lines starting with <code>+</code> were added</li>
            <li>Lines starting with a space are context (unchanged)</li>
          </ul>

          <h2>Diff tools and code review</h2>
          <p>
            Code review is fundamentally a diff review â€” you&apos;re examining what changed, not re-reading unchanged code. Pull request interfaces on GitHub, GitLab, and Bitbucket are all diff views with comment capabilities layered on top.
          </p>
          <p>
            When reviewing code:
          </p>
          <ul>
            <li><strong>Read the removed lines first.</strong> Understanding what was there before helps you evaluate whether the replacement makes sense and whether something important was accidentally deleted.</li>
            <li><strong>Check the context lines.</strong> The unchanged lines around changes tell you where in the code the change lives â€” a change to <code>retries: 3</code> inside a retry config object is very different from the same change inside an unrelated function.</li>
            <li><strong>Count the lines changed vs. lines affected.</strong> A one-line change to a function that&apos;s called 50 places in the codebase deserves more scrutiny than a 50-line change to a function called once.</li>
          </ul>

          <h2>When to use an online diff checker vs. git diff</h2>
          <p>
            Use <code>git diff</code> when:
          </p>
          <ul>
            <li>Comparing uncommitted changes to the last commit (<code>git diff HEAD</code>)</li>
            <li>Comparing two branches (<code>git diff main..feature-branch</code>)</li>
            <li>Comparing two commits (<code>git diff abc1234..def5678</code>)</li>
            <li>Working in a project with Git â€” it&apos;s built-in and the right tool</li>
          </ul>
          <p>
            Use an <Link href="/tools/diff-checker">online diff checker</Link> when:
          </p>
          <ul>
            <li>Comparing two versions of a text document, config file, or JSON payload that aren&apos;t in a Git repository</li>
            <li>Comparing content from two different systems (e.g., production config vs. staging config copied from a server)</li>
            <li>Comparing API responses before and after a change</li>
            <li>Sharing a visual diff with a non-technical stakeholder via screenshot</li>
            <li>Comparing two versions of a long document (legal text, contract revisions)</li>
          </ul>

          <h2>Diff for non-code use cases</h2>
          <p>
            Diff tools aren&apos;t only for code. Practical non-code uses:
          </p>
          <ul>
            <li><strong>Contract and legal document review.</strong> When a contract is revised, a diff shows exactly what changed â€” faster and more reliable than reading the whole document twice.</li>
            <li><strong>Configuration file changes.</strong> Comparing nginx.conf, .env, or JSON config files before and after a deployment or migration.</li>
            <li><strong>Database query comparison.</strong> Checking if two SQL queries are identical or finding exactly where they differ.</li>
            <li><strong>API response comparison.</strong> Comparing JSON responses from two environments to find discrepancies.</li>
            <li><strong>Translated text review.</strong> Comparing source text and translated text side-by-side to ensure completeness.</li>
          </ul>

          <h2>Word-level vs. line-level diff</h2>
          <p>
            Standard diff operates at the line level â€” a line with any change is shown as deleted and re-added. This is unhelpful for changes in the middle of a long line:
          </p>
          <pre><code>{`- const baseUrl = "https://api.production.example.com/v2/users";
+ const baseUrl = "https://api.staging.example.com/v2/users";`}</code></pre>
          <p>
            Only the word &quot;production&quot; changed, but the whole line is shown as replaced. Word-level (or character-level) diff highlights just the word that changed. The free diff checker supports word-level diffing, which makes single-word changes in long lines much easier to spot.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/diff-checker">Free Diff Checker</Link> â€” compare two texts side-by-side with line and word-level diff highlighting</li>
            <li><Link href="/tools/json-formatter">Free JSON Formatter</Link> â€” format JSON before comparing for a clean diff</li>
            <li><Link href="/tools/sql-formatter">Free SQL Formatter</Link> â€” format SQL queries before comparing</li>
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
