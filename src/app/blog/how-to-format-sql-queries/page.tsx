import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Format SQL Queries: Style Rules That Actually Matter",
  description:
    "SQL formatting rules that improve readability and catch bugs â€” capitalization, indentation, JOIN alignment, and when to break long lines. Free formatter included.",
  path: "/blog/how-to-format-sql-queries",
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
            How to Format SQL Queries: Style Rules That Actually Matter
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Unformatted SQL is one of the leading causes of debugging time wasted on bugs that were visible all along. Here are the rules that make queries readable â€” and how to format them instantly for free.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Why SQL formatting matters</h2>
          <p>
            SQL is read far more often than it is written. A query is written once and reviewed, debugged, optimized, and inherited by colleagues dozens of times. Poorly formatted SQL hides logic bugs, makes JOINs hard to audit, and turns 30-second debug tasks into 10-minute hunts.
          </p>
          <p>
            Unlike application code, SQL doesn&apos;t have a universal formatter enforced by a linter in CI pipelines. Formatting is discretionary â€” which means it varies wildly between developers and databases. These rules represent the most widely agreed-upon conventions.
          </p>

          <h2>The fundamental rules</h2>

          <h3>1. Capitalize SQL keywords</h3>
          <p>
            SQL is case-insensitive for keywords â€” <code>select</code> and <code>SELECT</code> both work. But capitalizing keywords creates an immediate visual separation between SQL structure and your own identifiers:
          </p>
          <pre><code>{`-- Bad
select id, name, email from users where active = 1

-- Good
SELECT id, name, email FROM users WHERE active = 1`}</code></pre>

          <h3>2. One clause per line</h3>
          <p>
            Each major clause (<code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>, <code>ORDER BY</code>) starts on its own line:
          </p>
          <pre><code>{`-- Bad
SELECT id, name FROM users WHERE active = 1 ORDER BY name

-- Good
SELECT id, name
FROM users
WHERE active = 1
ORDER BY name`}</code></pre>
          <p>
            This makes it immediately obvious how many clauses the query has and lets you spot a missing <code>WHERE</code> before accidentally running an unfiltered query.
          </p>

          <h3>3. Align SELECT columns and JOIN conditions</h3>
          <p>
            When selecting multiple columns, align them vertically so you can scan the list quickly:
          </p>
          <pre><code>{`SELECT
  u.id,
  u.name,
  u.email,
  o.total,
  o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.active = 1`}</code></pre>
          <p>
            The leading comma style (comma at the start of the line) makes it easy to comment out a single column during debugging without touching adjacent lines.
          </p>

          <h3>4. Indent subqueries</h3>
          <p>
            Subqueries should be indented relative to their parent:
          </p>
          <pre><code>{`SELECT *
FROM users
WHERE id IN (
  SELECT user_id
  FROM orders
  WHERE total > 100
)`}</code></pre>
          <p>
            Without indentation, the subquery boundary is invisible in long queries and the logic becomes impossible to follow.
          </p>

          <h3>5. Alias meaningfully</h3>
          <p>
            Table aliases should be predictable abbreviations, not single letters (except for trivial self-joins):
          </p>
          <pre><code>{`-- Bad
SELECT a.id, b.name FROM users a JOIN orders b ON a.id = b.user_id

-- Good
SELECT usr.id, ord.name
FROM users usr
JOIN orders ord ON usr.id = ord.user_id`}</code></pre>

          <h2>JOIN formatting</h2>
          <p>
            JOINs are where query complexity lives â€” and where bugs hide. Format them consistently:
          </p>
          <pre><code>{`SELECT
  u.name,
  p.title,
  c.name AS category
FROM users u
INNER JOIN posts p ON u.id = p.author_id
INNER JOIN categories c ON p.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
WHERE u.active = 1
  AND p.published = 1`}</code></pre>
          <p>
            Each JOIN is on its own line. The <code>ON</code> condition appears on the same line as the JOIN for short conditions, or indented below for long ones. The JOIN type (<code>INNER</code>, <code>LEFT</code>, <code>RIGHT</code>) is always explicit â€” never just <code>JOIN</code> without the type qualifier.
          </p>

          <h2>WHERE clause formatting</h2>
          <p>
            Boolean conditions in <code>WHERE</code> are aligned with each condition on its own line:
          </p>
          <pre><code>{`WHERE u.active = 1
  AND u.created_at > '2025-01-01'
  AND (
    u.country = 'US'
    OR u.country = 'CA'
  )`}</code></pre>
          <p>
            The leading <code>AND</code>/<code>OR</code> makes it easy to comment out individual conditions during debugging. Grouped conditions use explicit parentheses even when not strictly required â€” operator precedence bugs from missing parentheses are common.
          </p>

          <h2>When to use the online formatter</h2>
          <p>
            The <Link href="/tools/sql-formatter">free SQL formatter</Link> is useful for:
          </p>
          <ul>
            <li><strong>Inherited queries:</strong> When you receive a minified or poorly formatted query from a log, ORM output, or a colleague and need to read it immediately</li>
            <li><strong>Code review:</strong> Paste raw SQL from a PR, format it, and review the logic with proper visual structure</li>
            <li><strong>Database console output:</strong> Some database clients export queries in a single-line format â€” paste and format before analyzing</li>
            <li><strong>Documentation:</strong> Format queries before pasting them into README files, Confluence pages, or Notion docs</li>
          </ul>

          <h2>SQL formatting in different databases</h2>
          <p>
            The rules above apply universally. Dialect-specific variations to be aware of:
          </p>
          <ul>
            <li><strong>MySQL:</strong> Backtick identifiers (<code>`column`</code>) instead of double quotes. LIMIT at the end instead of TOP at the start.</li>
            <li><strong>PostgreSQL:</strong> Double-quote identifiers (<code>"Column"</code>). Dollar-quoting for functions (<code>$$...$$</code>).</li>
            <li><strong>SQL Server:</strong> Square bracket identifiers (<code>[Column]</code>). <code>TOP n</code> instead of <code>LIMIT n</code>.</li>
            <li><strong>SQLite:</strong> Generally lenient â€” accepts most syntax variants but lacks some advanced features.</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/sql-formatter">Free SQL Formatter</Link> â€” format and beautify SQL queries instantly in your browser</li>
            <li><Link href="/tools/json-formatter">Free JSON Formatter</Link> â€” format JSON responses from database APIs</li>
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
