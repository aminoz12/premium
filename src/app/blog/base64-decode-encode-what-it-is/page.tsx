import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "Base64 Encode and Decode: What It Is and When You Actually Use It",
  description:
    "Base64 explained clearly â€” what it does, what it doesn't do (it's not encryption), and the real use cases in APIs, emails, and web development.",
  path: "/blog/base64-decode-encode-what-it-is",
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
            Base64 Encode and Decode: What It Is and When You Actually Use It
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Base64 is not encryption. It&apos;s not compression. It&apos;s a way to represent binary data as plain text â€” and understanding when to use it (and when not to) saves you debugging time.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What Base64 actually does</h2>
          <p>
            Base64 is an encoding scheme that converts binary data (bytes) into a string of 64 printable ASCII characters: Aâ€“Z, aâ€“z, 0â€“9, +, and /. The name comes from the 64 characters used.
          </p>
          <p>
            Every 3 bytes of binary input becomes 4 Base64 characters. Because 4/3 = 1.33, Base64-encoded data is always 33% larger than the original. If you encode a 1 MB image as Base64, the result is a 1.33 MB string.
          </p>
          <p>
            The encoding is completely reversible â€” you can decode Base64 back to the original bytes with no information loss. This is what makes it an encoding, not a compression algorithm.
          </p>
          <p>
            The &quot;=&quot; characters you see at the end of Base64 strings are padding â€” added to make the output length a multiple of 4 characters when the input isn&apos;t divisible by 3.
          </p>
          <p>
            Encode and decode Base64 instantly with the <Link href="/tools/base64-encoder">free Base64 encoder/decoder</Link>.
          </p>

          <h2>Why binary data needs encoding at all</h2>
          <p>
            Many text-based protocols â€” email (SMTP), HTTP headers, HTML, JSON, XML â€” were designed to handle text, not arbitrary binary data. Binary data contains bytes that can be interpreted as control characters, line endings, null bytes, or non-printable characters. These break text protocols in unpredictable ways.
          </p>
          <p>
            Base64 converts any binary data into a safe subset of printable ASCII characters. Those 64 characters are guaranteed to pass through any text-based system without corruption.
          </p>

          <h2>Real use cases</h2>

          <h3>1. Email attachments (MIME)</h3>
          <p>
            Email uses SMTP, a text protocol. When you attach a PDF or image to an email, your email client Base64-encodes the binary file and embeds it in the email body. The recipient&apos;s client decodes it back to the file. You never see this â€” it happens automatically â€” but it&apos;s why email attachments are 33% larger than the original files.
          </p>

          <h3>2. Inline images in HTML and CSS</h3>
          <p>
            You can embed an image directly in HTML or CSS using a data URI:
          </p>
          <pre><code>{`<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." />`}</code></pre>
          <p>
            This eliminates the HTTP request for the image â€” the image data is included in the HTML itself. Useful for small icons, loading spinners, and images that must load synchronously with the page. The trade-off: the encoded data is 33% larger and isn&apos;t cached separately by the browser.
          </p>

          <h3>3. API authentication</h3>
          <p>
            HTTP Basic Authentication encodes credentials as Base64. When you include a header like:
          </p>
          <pre><code>{`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=`}</code></pre>
          <p>
            ...the string after &quot;Basic&quot; is Base64-encoded <code>username:password</code>. Decode it with any Base64 decoder to see the original credentials. <strong>This is not secure</strong> â€” it&apos;s only encoding, not encryption. Use HTTPS (which encrypts the transport layer) to protect Basic Auth credentials in transit.
          </p>

          <h3>4. JSON Web Tokens (JWT)</h3>
          <p>
            JWTs have three parts separated by dots: header, payload, and signature. The header and payload are Base64URL-encoded JSON (Base64URL is a variant that replaces + with - and / with _ to be URL-safe). The signature is a cryptographic hash.
          </p>
          <p>
            The header and payload are <em>not encrypted</em> â€” they&apos;re just encoded. Anyone can decode the payload and read the claims. The signature verifies that the payload hasn&apos;t been tampered with. This is a common misconception about JWTs â€” they provide integrity, not confidentiality.
          </p>

          <h3>5. Storing binary data in JSON or XML</h3>
          <p>
            JSON and XML are text formats that can&apos;t include raw binary data. If an API needs to return binary content (a generated image, a PDF, audio data) in a JSON response, it Base64-encodes the binary and includes it as a string field:
          </p>
          <pre><code>{`{
  "file_type": "image/png",
  "data": "iVBORw0KGgoAAAANSUhEUg..."
}`}</code></pre>

          <h2>Base64 vs URL encoding â€” what&apos;s the difference?</h2>
          <p>
            URL encoding (percent encoding) and Base64 solve different problems:
          </p>
          <ul>
            <li><strong>URL encoding</strong> makes arbitrary characters safe for use in a URL by replacing unsafe characters with %XX hex codes. For example, a space becomes %20. It&apos;s not for binary data â€” it&apos;s for text that contains special characters.</li>
            <li><strong>Base64</strong> makes arbitrary binary data safe for text contexts. It&apos;s not for URLs specifically â€” the standard + and / characters in Base64 are URL-unsafe (use Base64URL variant for URLs).</li>
          </ul>
          <p>
            Encode and decode URL-encoded strings with the <Link href="/tools/url-encoder">free URL encoder/decoder</Link>.
          </p>

          <h2>Common mistakes</h2>
          <ul>
            <li><strong>&quot;I&apos;ll store the password as Base64 for security.&quot;</strong> Base64 is not encryption. Anyone with a decoder (or a browser console) can read it. Store passwords with a proper hashing algorithm (bcrypt, Argon2, scrypt).</li>
            <li><strong>Base64-encoding already-Base64 data.</strong> If you encode a string that&apos;s already Base64, you get double-encoded data. Decoders will fail unless the recipient decodes twice. This happens when libraries auto-encode and you add another encoding layer manually.</li>
            <li><strong>Using Base64 when you need encryption.</strong> Base64 is reversible without a key. Encryption requires a secret. If the goal is confidentiality, use AES encryption, not Base64.</li>
          </ul>

          <h2>How to Base64 encode/decode quickly</h2>
          <p>
            In a browser console (press F12 â†’ Console tab):
          </p>
          <pre><code>{`// Encode
btoa("hello world")  // â†’ "aGVsbG8gd29ybGQ="

// Decode
atob("aGVsbG8gd29ybGQ=")  // â†’ "hello world"`}</code></pre>
          <p>
            Note: <code>btoa</code>/<code>atob</code> only handle ASCII strings. For Unicode text, you need a more robust approach. The <Link href="/tools/base64-encoder">free Base64 encoder</Link> handles Unicode correctly.
          </p>
          <p>
            In Python:
          </p>
          <pre><code>{`import base64
base64.b64encode(b"hello world")  # b'aGVsbG8gd29ybGQ='
base64.b64decode(b"aGVsbG8gd29ybGQ=")  # b'hello world'`}</code></pre>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/base64-encoder">Free Base64 Encoder/Decoder</Link> â€” encode and decode Base64 strings in your browser</li>
            <li><Link href="/tools/url-encoder">Free URL Encoder/Decoder</Link> â€” percent-encode strings for URLs</li>
            <li><Link href="/tools/jwt-decoder">Free JWT Decoder</Link> â€” decode and inspect JWT tokens</li>
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
