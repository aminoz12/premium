import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "Word Count as a Writing Tool: How Counting Characters Changed How I Write",
  description:
    "Word counters seem trivial until you use them seriously. Here's how I use character counts, reading time estimates, and density metrics to actually improve the quality of what I write — not just hit targets.",
  path: "/blog/word-count-writing-workflow",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-01" />
        <meta itemProp="dateModified" content="2026-05-01" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-01">May 1, 2026</time>
            <span>·</span>
            <span>7 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            Word Count as a Writing Tool: How Counting Characters Changed How I Write
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Word counters look like a trivial utility — you count words, done. Used intentionally,
            they&apos;re a feedback loop that reveals patterns in your writing you can&apos;t see any
            other way. Here&apos;s how I actually use them.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The immediate use: hitting targets</h2>
          <p>
            The obvious use case is the assignment with a word limit. Most word processors show a
            count in the corner. The browser-based word counter is useful when you&apos;re working in a
            system that doesn&apos;t — a CMS text field, a customer support ticket, a markdown editor, a
            Google Docs alternative. Paste your text, count, adjust.
          </p>
          <p>
            Character counts matter more than word counts in certain contexts. Twitter/X limits are
            280 characters. LinkedIn article summaries have a character limit. SMS messages are 160
            characters per segment (with longer messages split into multiple segments and billed
            separately). Meta description fields in SEO tools should be kept under 155–160
            characters to avoid truncation in search results. The{" "}
            <Link href="/tools/word-counter">word counter</Link> shows both simultaneously.
          </p>

          <h2>The less obvious use: sentence length analysis</h2>
          <p>
            Average sentence length is a rough proxy for readability. Writing researchers generally
            find that texts with average sentences of 15–20 words are easier to read than those with
            25–30 word averages, holding content complexity constant.
          </p>
          <p>
            My personal pattern: I write long sentences when I&apos;m uncertain. When I&apos;m not sure of
            something, I hedge and qualify and add clauses, which makes sentences grow. When I&apos;m
            confident, I write short ones.
          </p>
          <p>
            Checking my average sentence length after a draft is a quick test of my own confidence
            in what I wrote. If the average is over 25 words, I re-read looking for hedging and
            unnecessary qualifications. Usually I find them.
          </p>

          <h2>Character count vs. word count: when each matters</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Context</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Metric that matters</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">SEO meta description</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Characters</td>
                  <td className="border border-gray-200 p-3 text-gray-600">155–160</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">SEO title tag</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Characters</td>
                  <td className="border border-gray-200 p-3 text-gray-600">50–60</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Twitter/X post</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Characters</td>
                  <td className="border border-gray-200 p-3 text-gray-600">280</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">SMS message</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Characters</td>
                  <td className="border border-gray-200 p-3 text-gray-600">160 per segment</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Essay / academic paper</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Words</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Per assignment</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Blog post (for SEO)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Words</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1,500+ for competitive topics</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Email subject line</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Characters</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~50 (mobile preview)</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Push notification</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Characters</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~100 (iOS/Android)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Reading time estimates: accurate enough to be useful</h2>
          <p>
            Reading time is calculated from word count using the average adult reading speed of
            200–250 words per minute. The{" "}
            <Link href="/tools/word-counter">word counter</Link> shows an estimate based on 225
            words per minute, which is a reasonable middle value.
          </p>
          <p>
            These estimates are directionally correct but not precise. Technical writing (code
            docs, legal text, complex analysis) is read slower — assume 150–180 WPM. Casual blog
            posts are closer to 250 WPM. Fiction can be faster still for fluent readers.
          </p>
          <p>
            The estimate is useful for calibrating length against reader time expectations. A
            30-minute read requires a strong reason for the reader to commit. A 5-minute read
            can be published more casually. I target 7–10 minutes for technical posts on this
            blog — long enough to be comprehensive, short enough to fit a coffee break.
          </p>

          <h2>Using word count to identify padding</h2>
          <p>
            Padding is the enemy of good writing. When I finish a draft and check the word count,
            if it&apos;s significantly over my target, I read through looking for:
          </p>
          <ul>
            <li>
              Sentences that restate what the previous sentence already said (a common first-draft
              habit when you&apos;re not sure you made your point).
            </li>
            <li>
              Transitions that add words but no information (&quot;In order to understand X, we
              must first look at Y...&quot; vs just &quot;Y is relevant here because...&quot;).
            </li>
            <li>
              Qualifications that hedge statements without adding meaning (&quot;It is worth noting
              that in many cases, this approach can sometimes be seen as...&quot; vs &quot;This
              approach often works because...&quot;).
            </li>
          </ul>
          <p>
            A reliable technique: after writing, set a target word count that is 20% lower than
            the current count, and edit to hit it. You will almost always end up with a stronger
            draft because you&apos;ll be forced to eliminate the weakest sentences.
          </p>

          <h2>What word count doesn&apos;t tell you</h2>
          <p>
            Word count is a proxy metric. It tells you how much you wrote, not whether what you
            wrote is any good. The failure mode is optimizing for the metric at the expense of
            the actual goal.
          </p>
          <p>
            For SEO specifically: a 2,000-word post that repeats itself and lacks specific
            information is less valuable (to readers and to Google) than a focused 900-word post
            that fully answers one question. The minimum word count targets used in content SEO
            are evidence-based for average content at average quality — they don&apos;t guarantee
            that any given post will rank just by hitting the number.
          </p>
          <p>
            The honest test: read the draft and ask &quot;does this paragraph add something the
            reader didn&apos;t know from the paragraph before?&quot; If not, remove it. The word count
            will drop. The quality will rise.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/word-counter">Word Counter</Link>{" "}
              — word count, character count, sentence count, paragraph count, and reading time.
            </li>
            <li>
              <Link href="/tools/meta-tags">Meta Tags Generator</Link>{" "}
              — write title tags and meta descriptions with live character counting and search preview.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. I wrote the first version of the
            word counter because the CMS I was using at the time showed character count but not
            word count, and I needed both simultaneously for SEO work.
          </p>
        </div>
      </article>
    </main>
  )
}
