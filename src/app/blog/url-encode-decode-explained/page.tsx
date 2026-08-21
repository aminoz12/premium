import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "URL Encoding and Decoding Explained (With Examples)",
  description:
    "What URL encoding is, why spaces become %20, when to use encodeURIComponent vs encodeURI, and how to decode URLs free online.",
  path: "/blog/url-encode-decode-explained",
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
            URL Encoding and Decoding Explained (With Examples)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Why does a space become %20? Why does &amp; break query strings? URL encoding explained clearly â€” with the JavaScript functions you should actually be using.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What URL encoding is</h2>
          <p>
            URLs can only contain a specific set of ASCII characters. Characters outside this set â€” spaces, special characters, non-ASCII Unicode â€” must be encoded before they can appear in a URL. URL encoding (also called percent encoding) replaces each unsafe character with a percent sign followed by its two-digit hexadecimal ASCII code.
          </p>
          <p>
            Examples:
          </p>
          <ul>
            <li>Space â†’ <code>%20</code> (ASCII 32 = hex 20)</li>
            <li><code>#</code> â†’ <code>%23</code> (ASCII 35 = hex 23)</li>
            <li><code>&amp;</code> â†’ <code>%26</code> (ASCII 38 = hex 26)</li>
            <li><code>=</code> â†’ <code>%3D</code> (ASCII 61 = hex 3D)</li>
            <li><code>+</code> â†’ <code>%2B</code> (ASCII 43 = hex 2B)</li>
          </ul>
          <p>
            Decode any URL-encoded string instantly with the <Link href="/tools/url-encoder">free URL encoder/decoder</Link>.
          </p>

          <h2>Which characters are safe in URLs?</h2>
          <p>
            RFC 3986 defines the characters that are safe in URLs without encoding:
          </p>
          <ul>
            <li>Unreserved characters (never need encoding): <code>Aâ€“Z aâ€“z 0â€“9 - _ . ~</code></li>
            <li>Reserved characters (safe in specific URL parts): <code>: / ? # [ ] @ ! $ &amp; &apos; ( ) * + , ; =</code></li>
          </ul>
          <p>
            Reserved characters have special meaning in URLs â€” <code>/</code> separates path segments, <code>?</code> starts the query string, <code>#</code> starts the fragment, <code>&amp;</code> separates query parameters. When these characters appear as data (not structure), they must be encoded.
          </p>

          <h2>The query string problem</h2>
          <p>
            Query strings are where URL encoding matters most in practice. Consider a search URL:
          </p>
          <pre><code>{`https://example.com/search?q=hello world&category=tools`}</code></pre>
          <p>
            This URL is broken because:
          </p>
          <ol>
            <li>The space in &quot;hello world&quot; is not valid â€” it should be <code>%20</code> or <code>+</code></li>
            <li>The <code>&amp;</code> separates query parameters, so the server sees <code>q=hello world</code> and <code>category=tools</code> as two separate parameters â€” which is actually correct here, but only by accident</li>
          </ol>
          <p>
            If the search query itself contained an <code>&amp;</code> character (searching for &quot;cats &amp; dogs&quot;), the URL becomes:
          </p>
          <pre><code>{`https://example.com/search?q=cats & dogs`}</code></pre>
          <p>
            The server would see <code>q=cats</code> and an unnamed parameter <code>dogs</code> â€” the search query is broken. The correct encoded version:
          </p>
          <pre><code>{`https://example.com/search?q=cats%20%26%20dogs`}</code></pre>

          <h2>JavaScript: encodeURI vs encodeURIComponent</h2>
          <p>
            JavaScript provides two encoding functions with different behavior â€” choosing the wrong one is a common bug:
          </p>
          <pre><code>{`encodeURI("https://example.com/search?q=cats & dogs")
// â†’ "https://example.com/search?q=cats%20&%20dogs"
// Does NOT encode & because & is a reserved character
// The & still breaks the query string!

encodeURIComponent("cats & dogs")
// â†’ "cats%20%26%20dogs"
// Encodes & correctly
// Safe to use as a query parameter value`}</code></pre>
          <p>
            The rule:
          </p>
          <ul>
            <li>Use <code>encodeURI()</code> for encoding a complete URL where you want to preserve the URL structure (don&apos;t encode <code>://</code>, <code>/</code>, <code>?</code>, <code>&amp;</code>)</li>
            <li>Use <code>encodeURIComponent()</code> for encoding individual query parameter values or any part of a URL that might contain special characters</li>
          </ul>
          <p>
            The corresponding decode functions are <code>decodeURI()</code> and <code>decodeURIComponent()</code>.
          </p>

          <h2>The + vs %20 difference</h2>
          <p>
            Spaces can be encoded two ways in URLs:
          </p>
          <ul>
            <li><code>%20</code> â€” the standard percent encoding, valid everywhere in a URL</li>
            <li><code>+</code> â€” shorthand for space, but only valid in query strings (not in path segments)</li>
          </ul>
          <p>
            HTML forms traditionally encode spaces as <code>+</code> in query strings (application/x-www-form-urlencoded format). Most servers handle both. But if you&apos;re constructing URLs programmatically, use <code>%20</code> consistently â€” it&apos;s unambiguous regardless of URL position.
          </p>

          <h2>Unicode characters in URLs</h2>
          <p>
            Non-ASCII characters (Chinese, Arabic, emoji, accented characters) must be UTF-8 encoded first, then percent-encoded.
          </p>
          <p>
            Example â€” the word &quot;caf&eacute;&quot;:
          </p>
          <ul>
            <li>&eacute; is U+00E9 in Unicode</li>
            <li>UTF-8 encoding of U+00E9: bytes 0xC3 0xA9</li>
            <li>Percent encoded: <code>%C3%A9</code></li>
            <li>Full encoded URL: <code>example.com/caf%C3%A9</code></li>
          </ul>
          <p>
            Modern browsers accept non-ASCII in the address bar and display them in readable form (internationalized domain names, Unicode paths). Behind the scenes, all the encoding is happening â€” the browser shows you the decoded display form.
          </p>
          <p>
            IDN (Internationalized Domain Names) use a different encoding called Punycode for the domain itself: <code>mÃ¼nchen.de</code> becomes <code>xn--mnchen-3ya.de</code> at the DNS level.
          </p>

          <h2>Decoding URLs you find in the wild</h2>
          <p>
            When you copy a URL from a browser or see a URL in network logs, it may contain percent-encoded characters. Decoding it makes it readable:
          </p>
          <p>
            Encoded:
          </p>
          <pre><code>{`https://example.com/search?q=best%20free%20tools%20for%20developers&sort=relevance`}</code></pre>
          <p>
            Decoded:
          </p>
          <pre><code>{`https://example.com/search?q=best free tools for developers&sort=relevance`}</code></pre>
          <p>
            Use the <Link href="/tools/url-encoder">free URL encoder/decoder</Link> to quickly decode any URL you encounter in logs, analytics exports, or API responses.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/url-encoder">Free URL Encoder/Decoder</Link> â€” encode and decode URLs instantly in your browser</li>
            <li><Link href="/tools/base64-encoder">Free Base64 Encoder/Decoder</Link> â€” encode binary data as text (different from URL encoding)</li>
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
