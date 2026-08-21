import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Count Words in Google Docs (All Methods)",
  description:
    "Google Docs word count shortcut, live word count display, and how to get character count and reading time â€” all the methods explained.",
  path: "/blog/how-to-count-words-in-google-docs",
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
            <span>5 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            How to Count Words in Google Docs (All Methods)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            The shortcut, the live toolbar display, character counts, and how to get reading time and sentence count that Google Docs doesn&apos;t show you.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The keyboard shortcut</h2>
          <p>
            The fastest way to check word count in Google Docs:
          </p>
          <ul>
            <li><strong>Windows / Linux:</strong> <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></li>
            <li><strong>Mac:</strong> <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></li>
          </ul>
          <p>
            This opens the Word Count dialog showing: words, characters (with spaces), characters (without spaces), and pages. Close it with <kbd>Escape</kbd> or by clicking anywhere outside the dialog.
          </p>
          <p>
            You can also access it via the menu: Tools â†’ Word count.
          </p>

          <h2>Live word count in the toolbar</h2>
          <p>
            If you&apos;re writing toward a target word count, a live count that updates as you type is more useful than opening the dialog repeatedly.
          </p>
          <ol>
            <li>Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> (or Tools â†’ Word count)</li>
            <li>In the dialog, check the box: &quot;Display word count while typing&quot;</li>
            <li>Click OK</li>
          </ol>
          <p>
            A small word count display appears in the bottom-left corner of the document, next to the page count. It updates in real time as you type. Click on it to toggle between showing words, characters with spaces, and characters without spaces.
          </p>

          <h2>Count words for a selection only</h2>
          <p>
            To count words in a specific section (a paragraph, a heading, a portion of the document):
          </p>
          <ol>
            <li>Select the text you want to count</li>
            <li>Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></li>
          </ol>
          <p>
            The Word Count dialog will show the count for the selected text. The dialog title changes from &quot;Word count&quot; to &quot;Word count (selection)&quot; to confirm you&apos;re counting selected text only.
          </p>

          <h2>What Google Docs word count includes (and what it doesn&apos;t)</h2>
          <p>
            Google Docs counts words in the main body of the document. It does NOT count words in:
          </p>
          <ul>
            <li>Headers and footers</li>
            <li>Footnotes (unless you specifically select and count them)</li>
            <li>Comments and suggestions in the margin</li>
            <li>Text inside charts or drawings embedded in the doc</li>
          </ul>
          <p>
            For essays, this matters: if your assignment has a word limit that includes footnotes, you need to count them separately. Select the footnote text, check the count, and add it to the main body count.
          </p>

          <h2>Getting character count and reading time</h2>
          <p>
            Google Docs shows character count (with and without spaces) in the Word Count dialog. What it doesn&apos;t show:
          </p>
          <ul>
            <li>Reading time estimate</li>
            <li>Sentence count</li>
            <li>Average word length</li>
            <li>Paragraph count</li>
            <li>Flesch reading ease score</li>
          </ul>
          <p>
            For these, select all (<kbd>Ctrl</kbd>+<kbd>A</kbd>), copy, and paste into the <Link href="/tools/word-counter">free word counter</Link>. It shows all of these metrics instantly, no account needed.
          </p>
          <p>
            Reading time is useful for blog posts (tell readers how long an article takes to read), speeches (know if your speech fits your time slot), and academic writing (estimate how long a review committee spends reading your submission).
          </p>

          <h2>Character counts for specific limits</h2>
          <p>
            If you&apos;re writing content with character limits (meta descriptions, tweets, SMS messages, LinkedIn bios), the word counter is more useful than Google Docs for this:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Platform / use case</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Character limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Meta title (SEO)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">50â€“60 characters</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Meta description (SEO)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">150â€“160 characters</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Twitter / X post</td>
                  <td className="border border-gray-200 p-3 text-gray-600">280 characters</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">LinkedIn bio</td>
                  <td className="border border-gray-200 p-3 text-gray-600">2,000 characters</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">SMS message</td>
                  <td className="border border-gray-200 p-3 text-gray-600">160 characters (single segment)</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Instagram caption</td>
                  <td className="border border-gray-200 p-3 text-gray-600">2,200 characters (but only 125 visible before &quot;more&quot;)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Word count targets for common writing tasks</h2>
          <p>
            Knowing if your document is the right length matters for most professional writing contexts:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Document type</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Typical word count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Blog post (short)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">800â€“1,200 words</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Blog post (long-form / SEO)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1,500â€“3,000 words</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Email newsletter</td>
                  <td className="border border-gray-200 p-3 text-gray-600">200â€“500 words</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Research paper (undergrad)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">2,000â€“5,000 words</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">5-minute speech</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~650â€“700 words</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Resume</td>
                  <td className="border border-gray-200 p-3 text-gray-600">400â€“600 words (1 page)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/word-counter">Free Word Counter</Link> â€” reading time, character count, sentence count, and more</li>
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
