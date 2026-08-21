import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Encode and Decode URLs Online for Free (And Why It Matters)",
  description:
    "URL encoding converts special characters to a safe format. Here's when encoding is necessary, what %20 means, and the free tool to encode or decode any URL.",
  path: "/blog/how-to-encode-decode-url-free",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-27" />
        <meta itemProp="dateModified" content="2026-05-27" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-27">May 27, 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Encode and Decode URLs Online for Free (And Why It Matters)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            URLs can only contain a limited set of characters. Everything else must be encoded.
            Here&apos;s what percent-encoding is, when you need it, and how to encode or decode
            any string free.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What URL encoding is</h2>
          <p>
            URLs are restricted to a small set of safe characters: letters (A–Z, a–z), digits
            (0–9), and a few symbols (<code>- _ . ~</code>). Every other character must be
            &quot;percent-encoded&quot; — replaced with a % sign followed by the two-character
            hexadecimal ASCII code.
          </p>
          <p>
            Common examples:
          </p>
          <ul>
            <li>Space → <code>%20</code></li>
            <li>& → <code>%26</code></li>
            <li>= → <code>%3D</code></li>
            <li>? → <code>%3F</code></li>
            <li>/ → <code>%2F</code></li>
            <li># → <code>%23</code></li>
            <li>+ → <code>%2B</code></li>
          </ul>
          <p>
            So a search query like <code>hello world &amp; more</code> becomes
            <code>hello%20world%20%26%20more</code> when placed inside a URL parameter.
          </p>

          <h2>Encode and decode URLs free</h2>
          <p>
            Use the <Link href="/tools/url-encoder">free URL encoder and decoder</Link> —
            paste any string to encode it for safe URL use, or paste an encoded URL to decode
            it back to readable form. No account, no upload.
          </p>

          <h2>When you need URL encoding</h2>
          <h3>Query parameters</h3>
          <p>
            The most common case. When building a URL with user-supplied input in a query
            parameter, the value must be encoded:
          </p>
          <pre><code>{`https://example.com/search?q=hello world`}</code></pre>
          <p>becomes:</p>
          <pre><code>{`https://example.com/search?q=hello%20world`}</code></pre>
          <p>
            In most programming languages, the built-in URL or HTTP library handles this
            automatically. Problems arise when developers concatenate strings manually instead
            of using URL-building functions.
          </p>

          <h3>Internationalized domain names and paths</h3>
          <p>
            Non-ASCII characters in paths (accented letters, Cyrillic, Arabic, Chinese) must
            be encoded. A French URL like
            <code>https://example.fr/catégorie</code> becomes
            <code>https://example.fr/cat%C3%A9gorie</code>.
          </p>

          <h3>Decoding encoded URLs you receive</h3>
          <p>
            Encoded URLs from API responses, logs, or redirect parameters are hard to read at a
            glance. Paste them into the URL decoder to see the human-readable version.
          </p>

          <h2>Encoding vs encoding for forms (+)</h2>
          <p>
            There are two standards:
          </p>
          <ul>
            <li>
              <strong>RFC 3986 (standard URL encoding):</strong> encodes spaces as <code>%20</code>.
              Used in URLs, HTTP headers, most modern APIs.
            </li>
            <li>
              <strong>application/x-www-form-urlencoded:</strong> encodes spaces as <code>+</code>.
              Used in HTML form submissions (POST body). This is why some encoded URLs have +
              instead of %20 in form data.
            </li>
          </ul>
          <p>
            When in doubt, use <code>%20</code> — it is unambiguous and correct in all contexts.
            Use <code>+</code> only in form data where the server expects form encoding.
          </p>

          <h2>Security: why encoding matters</h2>
          <p>
            Failing to encode user input before inserting it into a URL is a source of security
            vulnerabilities. If a user types <code>&amp;admin=true</code> and it is inserted raw
            into a query string, it could add an unintended parameter to the request.
          </p>
          <p>
            Always use your language&apos;s URL-building library rather than string concatenation:
          </p>
          <ul>
            <li>JavaScript: <code>new URL()</code> + <code>searchParams.set()</code>, or <code>encodeURIComponent()</code></li>
            <li>Python: <code>urllib.parse.urlencode()</code></li>
            <li>PHP: <code>urlencode()</code> or <code>http_build_query()</code></li>
          </ul>

          <h2>Summary</h2>
          <p>
            URL encoding converts special characters to percent-encoded form so they can travel
            safely in URLs. Encode and decode any string with the{" "}
            <Link href="/tools/url-encoder">free URL encoder</Link>. Use
            <code>encodeURIComponent()</code> in code when building URLs with user input. Spaces
            encode as <code>%20</code> in standard URLs and <code>+</code> in form data.
          </p>
        </div>
      </article>
    </main>
  )
}
