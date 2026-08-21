import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Write Markdown: A Practical Guide (With Cheat Sheet)",
  description:
    "Markdown powers GitHub READMEs, docs, and most blogging platforms. Here's every syntax you need â€” and the formatting choices that break rendering unexpectedly.",
  path: "/blog/how-to-write-markdown-guide",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-06-01" />
        <meta itemProp="dateModified" content="2026-06-01" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-06-01">June 1, 2026</time>
            <span>Â·</span>
            <span>6 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Write Markdown: A Practical Guide (With Cheat Sheet)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Markdown is the writing format for GitHub, documentation, README files, and most
            blogging platforms. Here&apos;s every syntax element you actually need.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What Markdown is</h2>
          <p>
            Markdown is a lightweight markup language â€” plain text with formatting symbols that
            converts to HTML. A # becomes an h1, ** around text makes it bold, - starts a list
            item. The philosophy: the text should look good even when not rendered, and the
            formatting syntax should be intuitive.
          </p>

          <h2>The complete cheat sheet</h2>
          <h3>Headings</h3>
          <pre><code>{`# H1 â€” page title
## H2 â€” main section
### H3 â€” subsection
#### H4 â€” rarely needed`}</code></pre>

          <h3>Text formatting</h3>
          <pre><code>{`**bold text**
*italic text*
~~strikethrough~~
\`inline code\`
> blockquote`}</code></pre>

          <h3>Links and images</h3>
          <pre><code>{`[Link text](https://example.com)
![Alt text](image.jpg)
[Link with title](https://example.com "Hover title")`}</code></pre>

          <h3>Lists</h3>
          <pre><code>{`- Unordered item
- Another item
  - Nested item (2 spaces indent)

1. Ordered item
2. Another item
   1. Nested ordered item`}</code></pre>

          <h3>Code blocks</h3>
          <pre><code>{`\`\`\`javascript
const name = "World";
console.log(\`Hello, \${name}\`);
\`\`\``}</code></pre>
          <p>
            The language name after the opening backticks enables syntax highlighting on most
            platforms (GitHub, GitLab, many blog engines).
          </p>

          <h3>Tables</h3>
          <pre><code>{`| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell     | Cell     | Cell     |
| Cell     | Cell     | Cell     |`}</code></pre>

          <h3>Horizontal rule</h3>
          <pre><code>{`---
(three or more dashes on their own line)`}</code></pre>

          <h3>Task list (GitHub Flavored Markdown)</h3>
          <pre><code>{`- [x] Completed task
- [ ] Incomplete task`}</code></pre>

          <h2>The formatting choices that break rendering</h2>
          <h3>Blank lines between elements</h3>
          <p>
            Markdown requires a blank line between most elements. A heading immediately followed
            by a paragraph may not render correctly on some parsers. Always add a blank line
            between headings, paragraphs, lists, and code blocks.
          </p>

          <h3>Indentation for nested lists</h3>
          <p>
            Nested list items must be indented by exactly 2 or 4 spaces (parsers vary). A single
            space does not create nesting on most platforms.
          </p>

          <h3>Line breaks inside paragraphs</h3>
          <p>
            A single newline within a paragraph is ignored â€” the text continues on the same line.
            To force a line break within a paragraph, end the line with two spaces before pressing
            Enter. This is one of Markdown&apos;s least intuitive behaviors.
          </p>

          <h3>Special characters</h3>
          <p>
            To display literal Markdown syntax characters (*, #, [], etc.), escape them with a
            backslash: <code>\*</code> renders as *, <code>\#</code> renders as #.
          </p>

          <h2>GitHub Flavored Markdown (GFM) vs CommonMark</h2>
          <p>
            There is no single Markdown standard. CommonMark is the most widely adopted
            specification. GitHub uses GitHub Flavored Markdown (GFM) which adds tables, task
            lists, strikethrough, and autolinks. Most platforms (GitLab, Notion, Obsidian) support
            similar supersets of CommonMark.
          </p>
          <p>
            Features that vary by platform:
          </p>
          <ul>
            <li>Tables â€” GFM only, not in basic CommonMark</li>
            <li>Task lists (checkboxes) â€” GitHub and some others</li>
            <li>Footnotes â€” Pandoc and some platforms</li>
            <li>Math expressions â€” platforms with KaTeX/MathJax support</li>
          </ul>

          <h2>Summary â€” the 10 things you use 90% of the time</h2>
          <pre><code>{`# Heading 1
## Heading 2
**bold** *italic*
[link](url) ![image](url)
- list item
1. ordered item
\`code\`
\`\`\`language
code block
\`\`\`
> blockquote
---`}</code></pre>
          <p>
            That covers nearly all Markdown you will need for README files, documentation, and blog posts.
          </p>
        </div>
      </article>
    </main>
  )
}
