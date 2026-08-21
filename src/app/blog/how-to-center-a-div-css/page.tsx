import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Center a Div in CSS (Every Method, 2026)",
  description:
    "Flexbox, Grid, absolute positioning, and margin: auto â€” every way to center a div in CSS, with the modern approach you should use for each situation.",
  path: "/blog/how-to-center-a-div-css",
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
            How to Center a Div in CSS (Every Method, 2026)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Centering used to be genuinely hard. In 2026 it&apos;s easy â€” but there are still five different ways to do it, each right for a different context. Here&apos;s which to use when.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Method 1: Flexbox (use this for most cases)</h2>
          <p>
            The modern default. Apply flex to the parent, then center both axes:
          </p>
          <pre><code>{`.parent {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
}

/* The child needs no special CSS */
.child {
  /* nothing required */
}`}</code></pre>
          <p>
            Requires the parent to have a defined height for vertical centering. If the parent wraps to content height, there&apos;s no extra space to center in vertically â€” add <code>min-height: 100vh</code> or a fixed height.
          </p>

          <h2>Method 2: CSS Grid</h2>
          <pre><code>{`.parent {
  display: grid;
  place-items: center;   /* shorthand for align-items + justify-items */
}

/* For a single child, this is the most concise method */`}</code></pre>
          <p>
            <code>place-items: center</code> is the most concise centering solution in CSS. One line. Works for both axes simultaneously. Use Grid when you&apos;re already using Grid for layout; use Flexbox otherwise.
          </p>

          <h2>Method 3: Absolute positioning + transform</h2>
          <pre><code>{`.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`}</code></pre>
          <p>
            Works regardless of the child&apos;s dimensions â€” the transform shifts the element back by half its own width and height. Use this when:
          </p>
          <ul>
            <li>The child must overlap other content (positioned on top of something)</li>
            <li>You need to center something inside a parent that can&apos;t be flex/grid (rare)</li>
            <li>You&apos;re centering a loading spinner or modal overlay on the viewport</li>
          </ul>

          <h2>Method 4: margin: auto (horizontal only)</h2>
          <pre><code>{`.child {
  width: 600px;        /* must have explicit width */
  margin-left: auto;
  margin-right: auto;
  /* shorthand: margin: 0 auto; */
}`}</code></pre>
          <p>
            The classic technique â€” still correct for horizontally centering a block element with a known width. Common for page content containers:
          </p>
          <pre><code>{`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}`}</code></pre>
          <p>
            Does not center vertically. Use this for page layout wrappers, article containers, and any block that should be horizontally centered with defined max-width.
          </p>

          <h2>Method 5: text-align: center (inline elements)</h2>
          <pre><code>{`.parent {
  text-align: center;
}

/* Centers inline/inline-block children: text, images, buttons */`}</code></pre>
          <p>
            Only works for inline and inline-block elements (text, <code>&lt;img&gt;</code>, <code>&lt;button&gt;</code>, inline-block <code>&lt;div&gt;</code>). It does not center block-level divs â€” those need margin auto or flex/grid.
          </p>

          <h2>Centering full-screen (modal overlays)</h2>
          <pre><code>{`.overlay {
  position: fixed;
  inset: 0;                  /* top: 0; right: 0; bottom: 0; left: 0; */
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  /* no special centering needed â€” flex parent handles it */
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}`}</code></pre>
          <p>
            <code>inset: 0</code> is the modern shorthand for setting all four sides to zero â€” making the overlay fill the entire viewport. Combined with flex centering on the parent, the modal is centered regardless of its size.
          </p>

          <h2>Centering vertically within the viewport</h2>
          <pre><code>{`/* Simple full-page centering */
body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

/* Or with grid: */
body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  margin: 0;
}`}</code></pre>

          <h2>The decision guide</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Situation</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Method</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Center inside a container (general case)</td><td className="border border-gray-200 p-3 font-mono text-gray-600">display: flex + justify-content/align-items: center</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Single item in a grid cell</td><td className="border border-gray-200 p-3 font-mono text-gray-600">display: grid + place-items: center</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Page content wrapper (horizontal only)</td><td className="border border-gray-200 p-3 font-mono text-gray-600">max-width + margin: 0 auto</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Overlay / modal on top of content</td><td className="border border-gray-200 p-3 font-mono text-gray-600">position: fixed + inset: 0 + flex center</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Center text or inline elements</td><td className="border border-gray-200 p-3 font-mono text-gray-600">text-align: center on parent</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Center element of unknown size on parent</td><td className="border border-gray-200 p-3 font-mono text-gray-600">position: absolute + transform: translate(-50%, -50%)</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/css-minifier">Free CSS Minifier</Link> â€” minify your CSS after building your layout</li>
            <li><Link href="/tools/css-gradient-generator">CSS Gradient Generator</Link> â€” add gradients to your centered containers</li>
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
