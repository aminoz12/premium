import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "HTML Entity Encoder: What HTML Entities Are and When to Use Them",
  description:
    "HTML entities explained â€” &amp;lt;, &amp;gt;, &amp;amp;, &amp;nbsp; and the rest. When the browser needs them and when it doesn't. Free encoder included.",
  path: "/blog/html-entity-encoder-explained",
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
            HTML Entity Encoder: What HTML Entities Are and When to Use Them
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            &amp;lt; looks like nonsense but it&apos;s how you display &lt; in HTML without the browser treating it as a tag. Here&apos;s the complete guide to HTML entities and when you actually need them.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Why HTML entities exist</h2>
          <p>
            HTML uses angle brackets <code>&lt;</code> and <code>&gt;</code> for tags, and the ampersand <code>&amp;</code> for entities themselves. If you want to display these characters as literal text on a page â€” not as HTML structure â€” you need to escape them:
          </p>
          <ul>
            <li><code>&amp;lt;</code> displays as: &lt;</li>
            <li><code>&amp;gt;</code> displays as: &gt;</li>
            <li><code>&amp;amp;</code> displays as: &amp;</li>
            <li><code>&amp;quot;</code> displays as: &quot;</li>
            <li><code>&amp;apos;</code> displays as: &apos; (HTML5 only; use <code>&amp;#39;</code> for broader support)</li>
          </ul>
          <p>
            Without escaping, <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> written in page content would execute as JavaScript â€” this is how XSS (Cross-Site Scripting) attacks work. Properly escaping user-supplied content before rendering it in HTML is a critical security practice.
          </p>
          <p>
            Encode HTML entities instantly with the <Link href="/tools/html-escape">free HTML entity encoder</Link>.
          </p>

          <h2>The five critical characters to always escape</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Character</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Entity name</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Numeric entity</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Why escape it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&lt;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;lt;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;#60;</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Opens HTML tags</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&gt;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;gt;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;#62;</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Closes HTML tags</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;amp;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;#38;</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Starts entities</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&quot;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;quot;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;#34;</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Breaks quoted attributes</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&apos;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;#39;</td>
                  <td className="border border-gray-200 p-3 font-mono text-gray-600">&amp;#39;</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Breaks single-quoted attributes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Named entities for special characters</h2>
          <p>
            HTML also provides named entities for characters that don&apos;t require escaping but are common typographic needs:
          </p>
          <ul>
            <li><code>&amp;nbsp;</code> â€” non-breaking space (prevents line break between two words)</li>
            <li><code>&amp;copy;</code> â€” Â© copyright symbol</li>
            <li><code>&amp;reg;</code> â€” Â® registered trademark</li>
            <li><code>&amp;trade;</code> â€” â„¢ trademark</li>
            <li><code>&amp;mdash;</code> â€” â€” em dash (the long dash)</li>
            <li><code>&amp;ndash;</code> â€” â€“ en dash</li>
            <li><code>&amp;hellip;</code> â€” â€¦ horizontal ellipsis</li>
            <li><code>&amp;euro;</code> â€” â‚¬ euro sign</li>
            <li><code>&amp;pound;</code> â€” Â£ pound sign</li>
          </ul>

          <h2>When you DON&apos;T need entities</h2>
          <p>
            A common mistake: over-encoding everything. If your HTML file is saved as UTF-8 (which it should be in 2026), you can include most special characters directly:
          </p>
          <ul>
            <li><code>Â© 2026</code> works fine in UTF-8 HTML â€” no need for <code>&amp;copy; 2026</code></li>
            <li>Accented characters like <code>Ã©</code>, <code>Ã±</code>, <code>Ã¼</code> can be written directly</li>
            <li>Emoji work directly in UTF-8 HTML (though some email clients are different)</li>
          </ul>
          <p>
            You only need entities for:
          </p>
          <ol>
            <li>The five critical characters that have syntactic meaning in HTML (<code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code>, <code>&quot;</code>, <code>&apos;</code>)</li>
            <li>Characters that aren&apos;t reliably available in the document&apos;s character encoding (rare for UTF-8)</li>
            <li>Non-breaking space (<code>&amp;nbsp;</code>) and similar typographic controls</li>
          </ol>

          <h2>XSS prevention: the security angle</h2>
          <p>
            Cross-Site Scripting (XSS) is one of the most common web vulnerabilities. It occurs when user-supplied data is included in HTML output without escaping.
          </p>
          <p>
            Unsafe pattern:
          </p>
          <pre><code>{`<!-- User searched for: <script>alert('xss')</script> -->
<p>Search results for: {{ user_query }}</p>`}</code></pre>
          <p>
            If <code>user_query</code> isn&apos;t escaped, the browser executes the script. Safe:
          </p>
          <pre><code>{`<p>Search results for: &lt;script&gt;alert(&apos;xss&apos;)&lt;/script&gt;</p>`}</code></pre>
          <p>
            Most modern web frameworks (React, Vue, Angular, Django, Rails) auto-escape by default. The danger is when you bypass this with &quot;raw&quot; or &quot;unsafe&quot; output functions â€” <code>dangerouslySetInnerHTML</code> in React, <code>v-html</code> in Vue, <code>|safe</code> in Django templates. Use these only when you control the content and have verified it doesn&apos;t contain user input.
          </p>

          <h2>Numeric entities</h2>
          <p>
            Every character can be referenced by its Unicode code point as a numeric entity:
          </p>
          <ul>
            <li>Decimal: <code>&amp;#65;</code> = A (Unicode code point 65)</li>
            <li>Hexadecimal: <code>&amp;#x41;</code> = A (0x41 hex = 65 decimal)</li>
          </ul>
          <p>
            Numeric entities work for any Unicode character regardless of whether there&apos;s a named entity for it. They&apos;re useful for obscure symbols and special characters where the named entity isn&apos;t widely known.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/html-escape">Free HTML Entity Encoder/Decoder</Link> â€” encode HTML special characters for safe display</li>
            <li><Link href="/tools/url-encoder">Free URL Encoder/Decoder</Link> â€” percent-encode strings for URLs (different from HTML encoding)</li>
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
