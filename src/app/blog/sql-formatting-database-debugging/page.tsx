import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "SQL Formatting as a Debugging Tool: Reading Queries You Didn't Write",
  description:
    "Unformatted SQL is where bugs hide. Here's how I use SQL formatting as the first step in diagnosing slow queries, wrong joins, and logic errors in queries written by others — or by me three months ago.",
  path: "/blog/sql-formatting-database-debugging",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-04-28" />
        <meta itemProp="dateModified" content="2026-04-28" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-04-28">April 28, 2026</time>
            <span>·</span>
            <span>8 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            SQL Formatting as a Debugging Tool: Reading Queries You Didn&apos;t Write
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Unformatted SQL is where bugs hide in plain sight. Here&apos;s how I use formatting as the
            first step when diagnosing slow queries, wrong JOIN behavior, and logic errors in
            queries written by ORMs, other developers, or my past self.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What ORM-generated SQL actually looks like</h2>
          <p>
            Most applications use an ORM (SQLAlchemy, Prisma, ActiveRecord, TypeORM, Django ORM)
            that generates SQL from your application code. When something goes wrong — wrong results,
            unexpected rows, N+1 query problems — you need to read the actual SQL. ORMs often emit
            queries that look like this in logs:
          </p>
          <pre><code>{`SELECT "users"."id","users"."name","users"."email","orders"."id" AS "order_id","orders"."total","orders"."created_at" FROM "users" LEFT JOIN "orders" ON "orders"."user_id"="users"."id" WHERE "users"."created_at" > '2025-01-01' AND "orders"."total" > 100 ORDER BY "orders"."created_at" DESC LIMIT 50`}</code></pre>
          <p>
            That&apos;s a single line with no whitespace. It&apos;s technically correct SQL. It&apos;s also nearly
            unreadable for debugging. After formatting:
          </p>
          <pre><code>{`SELECT
  "users"."id",
  "users"."name",
  "users"."email",
  "orders"."id" AS "order_id",
  "orders"."total",
  "orders"."created_at"
FROM "users"
LEFT JOIN "orders"
  ON "orders"."user_id" = "users"."id"
WHERE
  "users"."created_at" > '2025-01-01'
  AND "orders"."total" > 100
ORDER BY "orders"."created_at" DESC
LIMIT 50`}</code></pre>
          <p>
            Now you can see immediately: this is a LEFT JOIN, which means users with no qualifying
            orders will still appear in the results (with NULL order columns). If you expected only
            users with orders, you needed an INNER JOIN. That&apos;s a common bug that&apos;s invisible in
            the minified version and obvious in the formatted one.
          </p>

          <h2>The three bugs formatting reveals instantly</h2>

          <h3>1. Wrong JOIN type</h3>
          <p>
            LEFT JOIN, RIGHT JOIN, INNER JOIN, and CROSS JOIN produce fundamentally different
            result sets. In a single-line query, JOIN type is easy to miss. In formatted SQL with
            the JOIN on its own line with the ON condition indented below it, it&apos;s the first thing
            you see.
          </p>
          <p>
            Rule: any unexpected NULL columns in your result set → check the JOIN types first. A
            LEFT JOIN that should be INNER is the most common cause of &quot;results include rows I
            didn&apos;t expect&quot; bugs.
          </p>

          <h3>2. WHERE vs HAVING confusion</h3>
          <p>
            WHERE filters rows before aggregation. HAVING filters groups after aggregation. Using
            WHERE where you meant HAVING (or vice versa) produces wrong aggregates. In a long
            unformatted query with GROUP BY and HAVING buried in the middle, this is easy to miss.
            In formatted SQL, the structure is clear:
          </p>
          <pre><code>{`SELECT
  department_id,
  COUNT(*) AS employee_count,
  AVG(salary) AS avg_salary
FROM employees
WHERE hire_date > '2020-01-01'   -- filter ROWS before grouping
GROUP BY department_id
HAVING COUNT(*) > 5              -- filter GROUPS after aggregating`}</code></pre>

          <h3>3. Subquery scope issues</h3>
          <p>
            Correlated subqueries (subqueries that reference the outer query&apos;s tables) are
            particularly prone to scope errors. When the subquery is on a single line, it&apos;s
            hard to see which table aliases belong to which scope. Formatting with consistent
            indentation per nesting level makes scope boundaries visible.
          </p>

          <h2>The performance debugging workflow</h2>
          <p>
            When a query is slow, the format-first approach is:
          </p>
          <ol>
            <li>
              Copy the query from the ORM log or slow query log.
            </li>
            <li>
              Format it using the{" "}
              <Link href="/tools/sql-formatter">SQL formatter</Link>.
            </li>
            <li>
              Read the FROM and JOIN clauses. How many tables are being joined? Any CROSS JOINs
              (which produce Cartesian products)? Any subqueries in the FROM clause that could
              be materialized?
            </li>
            <li>
              Check the WHERE clause. Are the conditions on indexed columns? Are there function
              calls wrapping indexed columns (which prevent index use)?
            </li>
            <li>
              Run EXPLAIN (or EXPLAIN ANALYZE in PostgreSQL) with the formatted query to read
              the execution plan.
            </li>
          </ol>
          <p>
            Common function-call-on-indexed-column mistake:
          </p>
          <pre><code>{`-- Slow: YEAR() wrapping prevents index use on created_at
WHERE YEAR(created_at) = 2025

-- Fast: range condition allows index scan
WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'`}</code></pre>

          <h2>Dialect differences that bite you</h2>
          <p>
            SQL is not one language. PostgreSQL, MySQL, SQLite, and SQL Server have different
            syntax for common operations. This matters when you&apos;re formatting or copying queries
            between systems:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Operation</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">PostgreSQL</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">MySQL</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">SQL Server</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">String concat</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">{`||`}</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">CONCAT()</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">+</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Auto-increment</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">SERIAL / GENERATED</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">AUTO_INCREMENT</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">IDENTITY</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Limit rows</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">LIMIT N</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">LIMIT N</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">TOP N / FETCH FIRST</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Case sensitivity</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Case-sensitive by default</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Case-insensitive by default</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Depends on collation</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The SQL formatter handles PostgreSQL and MySQL syntax. Specify your dialect to get
            accurate keyword casing and formatting for your database.
          </p>

          <h2>N+1 queries: the problem you see in logs, not in code</h2>
          <p>
            An N+1 query problem means you&apos;re running 1 query to fetch a list, then N additional
            queries to fetch related data for each item — often without realizing it. An ORM that
            lazily loads a relationship will do this silently.
          </p>
          <p>
            Signs you have an N+1: your slow query log shows the same query pattern repeated
            dozens or hundreds of times with different ID values. Formatting one instance of the
            repeated query shows you exactly which relationship is being lazily loaded, which tells
            you where to add eager loading.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/sql-formatter">SQL Formatter</Link>{" "}
              — format and indent SQL queries for MySQL, PostgreSQL, SQLite, and SQL Server. No
              database connection required.
            </li>
            <li>
              <Link href="/tools/json-formatter">JSON Formatter</Link>{" "}
              — format JSON responses from database APIs or query results serialized to JSON.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. The ORM query example above is
            based on real queries I encountered during a PostgreSQL performance audit in 2025.
          </p>
        </div>
      </article>
    </main>
  )
}
