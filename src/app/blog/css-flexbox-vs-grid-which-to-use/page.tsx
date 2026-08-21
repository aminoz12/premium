import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "CSS Flexbox vs Grid: Which One to Use and When",
  description:
    "Flexbox and Grid both handle layout but solve different problems. Here's the decision rule that ends the confusion â€” with the one case where you need both.",
  path: "/blog/css-flexbox-vs-grid-which-to-use",
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
            CSS Flexbox vs Grid: Which One to Use and When
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Flexbox and Grid are both excellent for layout â€” but they were designed for different
            purposes. The confusion comes from being able to use either for many tasks. Here&apos;s
            the mental model that makes the choice clear.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>The one-line rule</h2>
          <p>
            <strong>Flexbox</strong> is for one-dimensional layout â€” a row OR a column.
            <strong>Grid</strong> is for two-dimensional layout â€” rows AND columns simultaneously.
          </p>

          <h2>Flexbox: one direction at a time</h2>
          <p>
            Flexbox arranges items along a single axis â€” either horizontally (row) or vertically
            (column). The other axis is managed automatically. It excels at:
          </p>
          <ul>
            <li>Navigation bars â€” items in a row, space between them</li>
            <li>Centering a single item both horizontally and vertically</li>
            <li>Button groups and tag lists</li>
            <li>Distributing items with space-between or space-around</li>
            <li>Any layout where the number of items is dynamic (unknown at write-time)</li>
          </ul>
          <pre><code>{`.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`}</code></pre>
          <p>
            Flexbox is content-driven â€” the sizes and positions depend on the content. You start
            with items and arrange them.
          </p>

          <h2>Grid: two directions simultaneously</h2>
          <p>
            Grid defines a two-dimensional structure of rows and columns, then places items into
            that structure. It excels at:
          </p>
          <ul>
            <li>Page-level layouts â€” header, sidebar, main content, footer</li>
            <li>Card grids that need consistent column widths</li>
            <li>Complex layouts where items must align in both dimensions</li>
            <li>Any layout where the structure is defined independently of the content</li>
          </ul>
          <pre><code>{`.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`}</code></pre>
          <p>
            Grid is layout-first â€” you define the structure, then place content into it.
          </p>

          <h2>The decision table</h2>
          <table>
            <thead>
              <tr><th>Scenario</th><th>Use</th></tr>
            </thead>
            <tbody>
              <tr><td>Navigation bar with items spaced evenly</td><td>Flexbox</td></tr>
              <tr><td>Full page layout (sidebar + content)</td><td>Grid</td></tr>
              <tr><td>Card gallery with consistent column widths</td><td>Grid</td></tr>
              <tr><td>Center a button inside a div</td><td>Flexbox</td></tr>
              <tr><td>Form label + input aligned in a row</td><td>Flexbox</td></tr>
              <tr><td>Complex form with multiple columns and rows</td><td>Grid</td></tr>
              <tr><td>Tag list that wraps to multiple lines</td><td>Flexbox (with flex-wrap)</td></tr>
              <tr><td>Photo mosaic with items spanning multiple cells</td><td>Grid</td></tr>
            </tbody>
          </table>

          <h2>The case where you genuinely need both</h2>
          <p>
            A typical page layout uses Grid at the top level (page structure) and Flexbox inside
            components (navigation, card content, button groups). This is not a compromise â€”
            it is the intended usage:
          </p>
          <pre><code>{`/* Page layout: Grid */
.page {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

/* Inside each card: Flexbox */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}`}</code></pre>

          <h2>When either works (and which is simpler)</h2>
          <p>
            For a three-column equal-width layout, both work:
          </p>
          <pre><code>{`/* Grid approach */
.container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

/* Flexbox approach */
.container { display: flex; gap: 1rem; }
.item { flex: 1; }`}</code></pre>
          <p>
            Grid is slightly cleaner here. But for responsive layouts where columns should wrap
            automatically, Grid&apos;s <code>auto-fill</code> and <code>minmax()</code> are significantly
            more powerful:
          </p>
          <pre><code>{`/* Responsive grid â€” no media queries needed */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}`}</code></pre>
          <p>
            This creates as many columns as fit at 280px minimum, automatically wrapping to the
            next row. The equivalent in Flexbox requires more code.
          </p>

          <h2>Summary</h2>
          <ul>
            <li><strong>Flexbox:</strong> one axis, content-driven, dynamic item counts â€” nav, buttons, centering</li>
            <li><strong>Grid:</strong> two axes, layout-driven, fixed structure â€” page layout, card grids, complex forms</li>
            <li>Use Grid at the macro level, Flexbox inside components</li>
            <li>For responsive grids without media queries, Grid&apos;s <code>auto-fill</code> + <code>minmax()</code> is the best tool</li>
          </ul>
          <p>
            Generate visual CSS grid layouts with the{" "}
            <Link href="/tools/grid-generator-for-free">free CSS grid generator</Link> â€” adjust
            columns, rows, and gaps visually and copy the CSS.
          </p>
        </div>
      </article>
    </main>
  )
}
