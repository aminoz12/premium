import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "SVG File Format Explained: When to Use Vector Over Raster",
  description:
    "What SVG files are, how they work, why logos must be SVG, and when PNG or JPEG is still the better choice. Free image converter included.",
  path: "/blog/svg-file-format-explained",
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
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            SVG File Format Explained: When to Use Vector Over Raster
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            SVG is the only image format that stays perfectly sharp at any size â€” and it&apos;s just XML text, which means you can style it with CSS and animate it with JavaScript. Here&apos;s when to use it.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What SVG actually is</h2>
          <p>
            SVG stands for Scalable Vector Graphics. Unlike JPEG or PNG â€” which store color values for every pixel â€” SVG stores a mathematical description of shapes: &quot;draw a circle at coordinates (50, 50) with radius 30, filled with red.&quot; When the browser renders this, it draws the shape at whatever resolution it needs.
          </p>
          <p>
            An SVG file is XML text. Open any .svg file in a text editor and you&apos;ll see markup like this:
          </p>
          <pre><code>{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#FF6B6B" />
  <text x="50" y="55" text-anchor="middle" font-size="16">Hi</text>
</svg>`}</code></pre>
          <p>
            This is a complete SVG file â€” a red circle with text. You can paste this directly into HTML and the browser renders it.
          </p>

          <h2>Why logos must be SVG</h2>
          <p>
            A PNG logo is a grid of pixels at a fixed size â€” say, 200Ã—60 pixels. Display it at 400Ã—120 and the browser has to scale up: interpolating between pixels produces blurriness. At 4K resolution or on a Retina display, your PNG logo looks fuzzy while everything else is sharp.
          </p>
          <p>
            An SVG logo renders at whatever pixel density the screen uses â€” 1x, 2x, 4x â€” because it&apos;s recalculated mathematically for each size. The circle at 50,50 with radius 30 is always perfectly crisp.
          </p>
          <p>
            Other situations where SVG is mandatory:
          </p>
          <ul>
            <li>Icons that appear at multiple sizes in a UI</li>
            <li>Charts and data visualizations (D3.js generates SVG)</li>
            <li>Animated graphics (CSS and JavaScript can animate SVG properties)</li>
            <li>Interactive graphics (SVG elements respond to click and hover events)</li>
          </ul>

          <h2>SVG advantages in web development</h2>

          <h3>Styling with CSS</h3>
          <pre><code>{`/* In your stylesheet */
.logo-icon circle {
  fill: #FF6B6B;
}
.logo-icon:hover circle {
  fill: #4ECDC4;
  transition: fill 0.2s;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .logo-icon path {
    fill: white;
  }
}`}</code></pre>

          <h3>No extra HTTP request (inline SVG)</h3>
          <p>
            Paste SVG markup directly into your HTML â€” no image request, instant render, and the SVG is part of the DOM (styleable and scriptable):
          </p>
          <pre><code>{`<button class="icon-button">
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M5 12l5 5L19 7" stroke="currentColor" fill="none"/>
  </svg>
  Save
</button>`}</code></pre>
          <p>
            Using <code>stroke="currentColor"</code> makes the SVG inherit the element&apos;s CSS <code>color</code> property â€” the icon color changes automatically for hover states, focus, and dark mode.
          </p>

          <h3>File size for simple graphics</h3>
          <p>
            A simple logo as SVG: 2â€“8 KB. The same logo as PNG at retina resolution (@2x): 30â€“200 KB. For icons and simple graphics, SVG is dramatically smaller.
          </p>
          <p>
            SVG can be gzip-compressed (SVGZ) for additional savings â€” typically 60â€“80% reduction. Web servers serve SVGZ with <code>Content-Encoding: gzip</code>.
          </p>

          <h2>When NOT to use SVG</h2>
          <ul>
            <li><strong>Photographs.</strong> Photos have millions of colors changing gradually â€” you can&apos;t describe a photograph as geometric shapes. JPEG or WebP is always right for photos.</li>
            <li><strong>Complex illustrations with many paths.</strong> A highly detailed SVG illustration with thousands of paths can be larger than an equivalent PNG and slower to render. Profile before assuming SVG is smaller.</li>
            <li><strong>Images displayed only at one fixed size.</strong> An icon that always appears at 16Ã—16px can be a PNG sprite â€” the size advantage of SVG disappears at small, fixed sizes.</li>
          </ul>

          <h2>Exporting SVG correctly</h2>
          <p>
            When exporting SVG from Figma, Illustrator, or Inkscape:
          </p>
          <ul>
            <li><strong>Flatten complex effects.</strong> Drop shadows, blurs, and certain gradients don&apos;t export cleanly to SVG from all tools â€” check the output in a browser</li>
            <li><strong>Use &quot;Outline text.&quot;</strong> Text in SVG requires the font to be available â€” outline (convert to paths) to avoid font dependency</li>
            <li><strong>Remove hidden layers.</strong> Invisible layers still add file size â€” delete them before export</li>
            <li><strong>Use SVGO.</strong> The SVG Optimizer tool removes redundant metadata, precision decimals, and unused elements â€” typically 30â€“60% file reduction</li>
          </ul>

          <h2>Converting SVG to PNG or vice versa</h2>
          <p>
            Sometimes you need a raster version of an SVG â€” for email, older apps, or APIs that don&apos;t accept SVG. The <Link href="/tools/image-converter">free image converter</Link> handles SVG-to-PNG conversion at any resolution you specify. For the reverse (PNG to SVG), note that auto-tracing a raster image produces approximate vector paths â€” it works for simple logos but not for photographs.
          </p>
          <p>
            For QR codes specifically: download as SVG for print (infinite resolution), PNG for digital display. The <Link href="/tools/qr-code-generator">QR code generator</Link> offers both.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/image-converter">Free Image Converter</Link> â€” convert between SVG, PNG, JPEG, and WebP</li>
            <li><Link href="/tools/qr-code-generator">Free QR Code Generator</Link> â€” download QR codes as SVG for print use</li>
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
