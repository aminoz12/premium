import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Create a Favicon for Your Website for Free (16Ã—16 to 512Ã—512)",
  description:
    "Most websites get the favicon wrong â€” wrong size, wrong format, missing sizes for mobile. Here's how to generate one correctly for all devices, free.",
  path: "/blog/how-to-create-favicon-free",
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
            <span>5 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Create a Favicon for Your Website for Free (16Ã—16 to 512Ã—512)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            A favicon is the small icon in the browser tab and bookmarks bar. Most developers
            upload one 32Ã—32 PNG and call it done â€” but modern browsers expect multiple sizes
            for different contexts. Here&apos;s how to do it right.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What sizes you actually need</h2>
          <p>
            A properly implemented favicon package covers multiple sizes:
          </p>
          <table>
            <thead>
              <tr><th>Size</th><th>Used by</th></tr>
            </thead>
            <tbody>
              <tr><td>16Ã—16</td><td>Browser tabs (small)</td></tr>
              <tr><td>32Ã—32</td><td>Browser tabs (standard), Windows taskbar</td></tr>
              <tr><td>180Ã—180</td><td>Apple Touch Icon (iPhone bookmark)</td></tr>
              <tr><td>192Ã—192</td><td>Android Chrome home screen shortcut</td></tr>
              <tr><td>512Ã—512</td><td>Android Chrome splash screen, PWA</td></tr>
            </tbody>
          </table>
          <p>
            At minimum, a 32Ã—32 .ico or .png file handles most browsers. Add the Apple Touch Icon
            (180Ã—180) and Android icons (192Ã—512) if mobile bookmarking matters for your site.
          </p>

          <h2>How to generate a favicon free</h2>
          <ol>
            <li>
              Open the <Link href="/tools/favicon-generator">free favicon generator</Link>
            </li>
            <li>Upload your logo, icon, or any image â€” PNG works best; SVG is ideal</li>
            <li>The tool generates all required sizes automatically</li>
            <li>Download the favicon package</li>
            <li>Place the files in your website&apos;s root directory</li>
            <li>Add the HTML tags to your <code>&lt;head&gt;</code></li>
          </ol>

          <h2>The HTML you need in your head tag</h2>
          <pre><code>{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`}</code></pre>
          <p>
            The <code>site.webmanifest</code> file declares your 192Ã—192 and 512Ã—512 icons for
            Android. A basic one looks like:
          </p>
          <pre><code>{`{
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`}</code></pre>

          <h2>What makes a good favicon design</h2>
          <p>
            A favicon is displayed at very small sizes â€” 16Ã—16 pixels in most browser tabs.
            Design principles for small sizes:
          </p>
          <ul>
            <li>
              <strong>Simple shapes only:</strong> complex logos with text do not read at 16px.
              Extract one letter, a symbol, or a simplified mark from your full logo.
            </li>
            <li>
              <strong>High contrast:</strong> the favicon appears on both light (most browsers)
              and dark mode tabs. Test it on both.
            </li>
            <li>
              <strong>No thin lines:</strong> lines under 2px disappear or become blurry at small
              sizes. Use bold, thick shapes.
            </li>
            <li>
              <strong>Transparent background:</strong> export with a transparent background so it
              looks natural on any tab color.
            </li>
          </ul>

          <h2>ICO vs PNG vs SVG for favicons</h2>
          <ul>
            <li>
              <strong>.ico format:</strong> the original favicon format, contains multiple sizes
              in one file. Still recommended for the root <code>/favicon.ico</code> for maximum
              compatibility â€” old browsers and some tools specifically look for this file.
            </li>
            <li>
              <strong>PNG:</strong> the modern standard for sized favicon links. Clear, widely
              supported, and easy to generate.
            </li>
            <li>
              <strong>SVG favicon:</strong> supported by most modern browsers (<code>rel=&quot;icon&quot; type=&quot;image/svg+xml&quot;</code>).
              Scales perfectly to any size. Use it as an additional <code>&lt;link&gt;</code>
              alongside PNG fallbacks.
            </li>
          </ul>

          <h2>Testing your favicon</h2>
          <p>
            After adding the favicon, test it:
          </p>
          <ul>
            <li>Open your site in an incognito window (cache won&apos;t serve the old favicon)</li>
            <li>Check the browser tab â€” the 32Ã—32 icon should appear</li>
            <li>Bookmark the page â€” check the bookmark icon</li>
            <li>On an iPhone: add to Home Screen â€” the 180Ã—180 Apple Touch Icon appears</li>
          </ul>

          <h2>Summary</h2>
          <p>
            Generate a complete favicon package with the{" "}
            <Link href="/tools/favicon-generator">free favicon generator</Link> â€” no account.
            Use a simple, high-contrast mark at small sizes. Provide at minimum 16Ã—16, 32Ã—32,
            and 180Ã—180 sizes. Add a <code>/favicon.ico</code> in the root for maximum backward
            compatibility.
          </p>
        </div>
      </article>
    </main>
  )
}
