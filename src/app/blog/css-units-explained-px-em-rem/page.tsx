import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "CSS Units Explained: px, em, rem, vh, vw â€” When to Use Each",
  description:
    "CSS has 15+ units for sizing. Here's the practical guide: when to use px vs rem vs em, what vh and vw actually mean, and why rem is the modern default.",
  path: "/blog/css-units-explained-px-em-rem",
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
            <span>7 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            CSS Units Explained: px, em, rem, vh, vw â€” When to Use Each
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            CSS has absolute units (px, pt, cm) and relative units (em, rem, %, vh, vw). Mixing them wrong causes layouts that break on mobile or ignore user accessibility preferences. Here&apos;s the decision guide.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>px â€” pixels (absolute)</h2>
          <p>
            <code>px</code> is the most intuitive unit â€” one pixel on the screen. It&apos;s absolute: <code>16px</code> is always 16 pixels regardless of screen size, parent size, or user font preferences.
          </p>
          <p>
            <strong>When to use px:</strong>
          </p>
          <ul>
            <li>Borders: <code>border: 1px solid</code> â€” you always want a 1-pixel line</li>
            <li>Shadows: <code>box-shadow: 0 2px 4px rgba(0,0,0,0.1)</code></li>
            <li>Minimum sizes: <code>min-width: 320px</code> for a mobile breakpoint</li>
            <li>Media queries: <code>@media (max-width: 768px)</code></li>
          </ul>
          <p>
            <strong>When NOT to use px for font-size:</strong> If a user has set their browser default font to 20px (for accessibility), <code>font-size: 16px</code> overrides their preference. Use <code>rem</code> for font sizes instead.
          </p>

          <h2>rem â€” root em (relative to root)</h2>
          <p>
            <code>rem</code> is relative to the root element&apos;s (<code>&lt;html&gt;</code>) font size. By default, browsers set the root font size to 16px â€” so <code>1rem = 16px</code> by default.
          </p>
          <pre><code>{`/* Default browser: 1rem = 16px */
font-size: 1rem;     /* 16px */
font-size: 1.5rem;   /* 24px */
font-size: 0.875rem; /* 14px */

/* If user changes browser default to 20px: */
font-size: 1rem;     /* 20px â€” respects user preference */`}</code></pre>
          <p>
            <strong>When to use rem:</strong>
          </p>
          <ul>
            <li>Font sizes â€” <code>rem</code> respects the user&apos;s browser font preference</li>
            <li>Spacing (padding, margin) when you want it to scale with font size</li>
            <li>Component sizes that should be consistent regardless of nesting depth</li>
          </ul>
          <p>
            A common pattern: set <code>{"html { font-size: 62.5%; }"}</code> so that <code>1rem = 10px</code> â€” making the math intuitive (<code>1.6rem = 16px</code>, <code>2.4rem = 24px</code>).
          </p>

          <h2>em â€” relative to parent</h2>
          <p>
            <code>em</code> is relative to the <em>current element&apos;s</em> font size (or the parent&apos;s font size when used for font-size itself). This is where it gets confusing â€” <code>em</code> compounds through nesting.
          </p>
          <pre><code>{`/* Parent: font-size: 16px */
.parent {
  font-size: 16px;
}
/* Child: 1.5em = 24px (1.5 Ã— 16) */
.child {
  font-size: 1.5em;
}
/* Grandchild: 1.5em = 36px (1.5 Ã— 24) â€” compounded! */
.grandchild {
  font-size: 1.5em;
}`}</code></pre>
          <p>
            <strong>When to use em:</strong>
          </p>
          <ul>
            <li>Padding on buttons â€” <code>padding: 0.5em 1em</code> scales with the button&apos;s own font size, making the button proportional regardless of font size</li>
            <li>Line height â€” <code>line-height: 1.6</code> (unitless) or <code>1.6em</code> scales with the element&apos;s font size</li>
            <li>Components that should scale with their own font size</li>
          </ul>
          <p>
            Avoid <code>em</code> for font sizes in deeply nested structures â€” the compounding effect creates unexpected results.
          </p>

          <h2>% â€” percentage</h2>
          <p>
            Percentage is relative to the parent element&apos;s value for most properties:
          </p>
          <pre><code>{`/* Width: 50% of parent's width */
width: 50%;

/* Font size: 125% of parent's font size */
font-size: 125%;

/* Padding/margin: % of parent's WIDTH (even for top/bottom) */
padding-top: 10%; /* 10% of parent's width â€” useful for aspect ratio */`}</code></pre>
          <p>
            <strong>Key quirk:</strong> Percentage values for <code>padding</code> and <code>margin</code> are always relative to the parent&apos;s <em>width</em> â€” even for top and bottom padding. This is used intentionally to create aspect-ratio boxes.
          </p>

          <h2>vh and vw â€” viewport units</h2>
          <p>
            Viewport units are relative to the browser window size:
          </p>
          <ul>
            <li><code>1vh</code> = 1% of the viewport height</li>
            <li><code>1vw</code> = 1% of the viewport width</li>
            <li><code>1vmin</code> = 1% of the smaller of vh or vw</li>
            <li><code>1vmax</code> = 1% of the larger of vh or vw</li>
          </ul>
          <pre><code>{`/* Full-screen hero section */
height: 100vh;

/* Full-width element regardless of parent */
width: 100vw;

/* Responsive font that scales with viewport */
font-size: clamp(1rem, 2.5vw, 2rem);`}</code></pre>
          <p>
            <strong>Mobile caveat:</strong> On mobile browsers, <code>100vh</code> includes the browser&apos;s address bar, which appears and disappears as the user scrolls. This causes layout jumps. The fix: use <code>100svh</code> (small viewport height) in modern CSS â€” it excludes the browser chrome.
          </p>

          <h2>The modern unit decision guide</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Property</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Recommended unit</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Font size (body)</td><td className="border border-gray-200 p-3 text-gray-600">rem</td><td className="border border-gray-200 p-3 text-gray-600">Respects user browser preference</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Font size (component-relative)</td><td className="border border-gray-200 p-3 text-gray-600">em</td><td className="border border-gray-200 p-3 text-gray-600">Scales with component's own font size</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Spacing (margin, padding)</td><td className="border border-gray-200 p-3 text-gray-600">rem or px</td><td className="border border-gray-200 p-3 text-gray-600">rem for type-related spacing; px for fixed gaps</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Border</td><td className="border border-gray-200 p-3 text-gray-600">px</td><td className="border border-gray-200 p-3 text-gray-600">Always 1px â€” doesn't need to scale</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Width (layout)</td><td className="border border-gray-200 p-3 text-gray-600">% or vw</td><td className="border border-gray-200 p-3 text-gray-600">Responsive to container/viewport</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Height (full screen)</td><td className="border border-gray-200 p-3 text-gray-600">100svh</td><td className="border border-gray-200 p-3 text-gray-600">Excludes mobile browser chrome</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Media queries</td><td className="border border-gray-200 p-3 text-gray-600">px or rem</td><td className="border border-gray-200 p-3 text-gray-600">rem-based queries respect font zoom</td></tr>
              </tbody>
            </table>
          </div>

          <h2>clamp() â€” responsive without media queries</h2>
          <p>
            The <code>clamp(min, preferred, max)</code> function creates fluid values that scale between a minimum and maximum:
          </p>
          <pre><code>{`/* Font scales from 1rem to 2rem based on viewport */
font-size: clamp(1rem, 2.5vw, 2rem);

/* Padding scales from 1rem to 4rem */
padding: clamp(1rem, 5vw, 4rem);

/* Width between 300px and 600px */
width: clamp(300px, 50%, 600px);`}</code></pre>
          <p>
            This eliminates many breakpoint-based media queries for typography and spacing â€” the value adapts continuously rather than jumping at defined widths.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/css-minifier">Free CSS Minifier</Link> â€” minify your CSS after building out your unit system</li>
            <li><Link href="/tools/color-contrast-checker">Color Contrast Checker</Link> â€” verify text meets WCAG contrast at any font size</li>
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
