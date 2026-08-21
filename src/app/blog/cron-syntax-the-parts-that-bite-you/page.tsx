import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "Cron Syntax: The Parts That Bite You (And How to Test Before Deploying)",
  description:
    "Cron expressions look simple until your scheduled job runs at 3 AM on a Tuesday instead of every Tuesday at 3 AM. Here's a breakdown of every field, the common mistakes, and how to validate before going live.",
  path: "/blog/cron-syntax-the-parts-that-bite-you",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-11" />
        <meta itemProp="dateModified" content="2026-05-11" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-11">May 11, 2026</time>
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
            Cron Syntax: The Parts That Bite You (And How to Test Before Deploying)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Cron expressions look deceptively simple. Five fields, numbers and asterisks. Then your
            scheduled job runs every minute for a week and your database hits 100% CPU. Here&apos;s a
            field-by-field breakdown, the traps I&apos;ve personally fallen into, and how to validate
            a cron expression before it goes anywhere near production.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The incident that made me build a cron parser</h2>
          <p>
            The tool I built for this was motivated by a specific mistake. I had a background job
            that was supposed to run once per hour. I wrote <code>* */1 * * *</code>. What I meant
            was &quot;every hour.&quot; What I wrote was &quot;every minute of every hour,&quot; which is just
            every minute. The job ran 60× more than intended.
          </p>
          <p>
            The correct expression is <code>0 * * * *</code> — &quot;at minute 0 of every hour.&quot;
            The distinction matters: the first field is minutes, not hours. I had confused the
            field order under time pressure.
          </p>

          <h2>The five (or six) fields</h2>
          <p>
            Standard cron (Unix/Linux cron, cronie) has five fields:
          </p>
          <pre><code>{`┌───────────── minute (0–59)
│ ┌───────────── hour (0–23)
│ │ ┌───────────── day of month (1–31)
│ │ │ ┌───────────── month (1–12)
│ │ │ │ ┌───────────── day of week (0–6, 0 = Sunday)
│ │ │ │ │
* * * * *`}</code></pre>
          <p>
            Some systems (AWS EventBridge, Quartz scheduler in Java) add a sixth field for seconds
            at the beginning: <code>second minute hour day-of-month month day-of-week</code>. If
            your cron expression isn&apos;t firing when expected, check whether your scheduler uses
            5 or 6 fields.
          </p>

          <h2>Special characters</h2>
          <ul>
            <li>
              <code>*</code> — &quot;any value&quot;. In the minute field, <code>*</code> means
              every minute. In the hour field, <code>*</code> means every hour.
            </li>
            <li>
              <code>,</code> — value list. <code>1,15,30</code> in the minute field means
              &quot;at minute 1, 15, and 30.&quot;
            </li>
            <li>
              <code>-</code> — range. <code>9-17</code> in the hour field means
              &quot;from 9 AM to 5 PM inclusive.&quot;
            </li>
            <li>
              <code>/</code> — step. <code>*/15</code> in the minute field means
              &quot;every 15 minutes&quot; (0, 15, 30, 45). <code>0/15</code> means the same thing.
            </li>
          </ul>

          <h2>The five mistakes I see most often</h2>

          <h3>1. Using <code>*/1</code> instead of just <code>*</code></h3>
          <p>
            <code>*/1</code> means &quot;every 1 unit&quot; — equivalent to <code>*</code>. It does not
            mean &quot;every 1 hour&quot; if it&apos;s in the minute field. It means &quot;every 1 minute.&quot;
            I wrote <code>* */1 * * *</code> thinking it meant &quot;hourly.&quot; It runs every minute.
          </p>

          <h3>2. Day of week indexing (0 vs 7 for Sunday)</h3>
          <p>
            Standard Unix cron accepts 0–6 for Sunday through Saturday. It also accepts 7 as
            Sunday (so both 0 and 7 = Sunday). But some schedulers only accept 0–6. And some
            use 1–7 (1 = Monday, 7 = Sunday), which is the ISO 8601 weekday numbering.
          </p>
          <p>
            If a job should run on Sundays only and you write <code>* * * * 7</code>, it may
            not fire at all on schedulers that reject 7 as out of range. Write <code>0</code>
            for Sunday to be safe.
          </p>

          <h3>3. Day of month AND day of week conflict</h3>
          <p>
            Most cron implementations OR the day-of-month and day-of-week fields — a job fires
            if either condition is true. <code>0 9 1 * 1</code> does not mean &quot;9 AM on the
            first Monday of the month.&quot; It means &quot;9 AM on the 1st of the month OR 9 AM every
            Monday.&quot;
          </p>
          <p>
            This is one of the most surprising behaviors in cron. If you want &quot;first Monday of
            the month,&quot; you need to handle it in the job itself (check if today is both the
            correct day of week and within the first 7 days of the month).
          </p>

          <h3>4. Timezone blindness</h3>
          <p>
            Standard cron runs in the timezone of the system it&apos;s installed on. If your server
            is in UTC (very common on cloud hosts), a job scheduled for <code>0 9 * * *</code>
            runs at 9 AM UTC — which is 11 AM in Germany, 4 AM in New York, and midnight in
            Los Angeles.
          </p>
          <p>
            AWS EventBridge cron, GitHub Actions scheduled workflows, and most SaaS schedulers
            also use UTC by default. Document the timezone for every cron expression in comments.
            Cron expressions without timezone context are a maintenance hazard.
          </p>

          <h3>5. Forgetting that cron has no &quot;every N months&quot; syntax</h3>
          <p>
            <code>*/3</code> in the month field means &quot;months 3, 6, 9, 12&quot; — not &quot;every 3
            months from now.&quot; There is no way to express &quot;every 90 days&quot; or &quot;every 3 months
            from a specific starting month&quot; in standard cron syntax. You either hardcode specific
            months or handle the logic in the job itself.
          </p>

          <h2>Common expressions and what they actually mean</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Expression</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">0 * * * *</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Every hour, at minute 0</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">*/15 * * * *</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Every 15 minutes (0, 15, 30, 45)</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">0 9 * * 1-5</td>
                  <td className="border border-gray-200 p-3 text-gray-600">9 AM every weekday (Mon–Fri)</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">0 0 1 * *</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Midnight on the 1st of every month</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">0 0 * * 0</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Midnight every Sunday</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">30 6 1,15 * *</td>
                  <td className="border border-gray-200 p-3 text-gray-600">6:30 AM on the 1st and 15th of every month</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">0 9-17 * * 1-5</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Every hour from 9 AM to 5 PM, Monday–Friday</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>How to test a cron expression before it causes damage</h2>
          <p>
            Before deploying any cron job to production:
          </p>
          <ol>
            <li>
              Use the{" "}
              <Link href="/tools/cron-parser">cron parser</Link> to see the next 10 scheduled
              times in human-readable format. If the next fire time is &quot;in 1 second,&quot; you
              wrote <code>* * * * *</code> accidentally.
            </li>
            <li>
              Add a comment above every cron expression in your code:
              <pre><code>{`# Every day at 9 AM UTC (= 11 AM Europe/Paris, 4 AM New York)
0 9 * * *`}</code></pre>
              This comment will save the next developer (usually future-you) from reverse-engineering
              the intent.
            </li>
            <li>
              Run the job manually once before enabling the schedule. If it&apos;s a database job,
              wrap it in a transaction that you can roll back.
            </li>
            <li>
              For jobs that run more frequently than daily, test in a staging environment with
              a looser expression first (e.g., every 5 minutes instead of every 15) to verify
              the job completes within its window before the next run starts.
            </li>
          </ol>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/cron-parser">Cron Expression Parser</Link>{" "}
              — enter a cron expression and see the next 10 scheduled times, field-by-field
              explanation, and human-readable description.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. The incident described is real;
            the job was a data sync script I was running on a DigitalOcean droplet in 2024.
          </p>
        </div>
      </article>
    </main>
  )
}
