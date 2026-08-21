import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Generate a CSS Gradient for Free (Linear, Radial, and Conic)",
  description:
    "CSS gradients follow a simple pattern once you understand the syntax. Here's how to create any gradient type â€” plus the free visual generator that outputs ready-to-paste CSS.",
  path: "/blog/how-to-generate-css-gradient-free",
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
            How to Generate a CSS Gradient for Free (Linear, Radial, and Conic)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            CSS gradients look like magic in code but follow a consistent pattern. Here&apos;s
            the syntax for every type â€” and the free visual tool to generate them without
            writing any CSS manually.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Generate gradients visually</h2>
          <p>
            Use the <Link href="/tools/css-gradient">free CSS gradient generator</Link> â€”
            pick your colors, adjust the direction and type, and copy the ready-to-use CSS.
            No account required.
          </p>

          <h2>Linear gradients</h2>
          <p>
            The most common type â€” transitions colors in a straight line:
          </p>
          <pre><code>{`/* Simple two-color */
background: linear-gradient(to right, #ff6600, #ffcc00);

/* With direction in degrees */
background: linear-gradient(135deg, #667eea, #764ba2);

/* Multi-color with stops */
background: linear-gradient(to bottom, #ff0000 0%, #ff6600 50%, #ffcc00 100%);`}</code></pre>
          <p>
            The direction can be: <code>to right</code>, <code>to bottom</code>, <code>to top left</code>,
            or an angle in degrees (<code>135deg</code> = diagonal from top-left to bottom-right).
          </p>

          <h2>Radial gradients</h2>
          <p>
            Radiates from a center point outward:
          </p>
          <pre><code>{`/* Circle from center */
background: radial-gradient(circle, #ff6600, #ffcc00);

/* Ellipse from custom position */
background: radial-gradient(ellipse at top left, #667eea, #764ba2);

/* With stops */
background: radial-gradient(circle at center, #ffffff 0%, #e0e0e0 50%, #999 100%);`}</code></pre>
          <p>
            Use <code>circle</code> for a perfectly circular gradient or <code>ellipse</code>
            (default) to follow the element&apos;s shape.
          </p>

          <h2>Conic gradients</h2>
          <p>
            Rotates colors around a center point â€” like a color wheel or pie chart:
          </p>
          <pre><code>{`/* Color wheel */
background: conic-gradient(red, yellow, green, blue, red);

/* Pie chart segment */
background: conic-gradient(#4CAF50 0deg 90deg, #2196F3 90deg 180deg, #FF5722 180deg 360deg);`}</code></pre>
          <p>
            Conic gradients are newer (supported in all modern browsers since 2021) and excellent
            for pie charts and color wheel effects.
          </p>

          <h2>Making gradients look natural</h2>
          <p>
            A common problem: harsh-looking gradient transitions. Three techniques that help:
          </p>
          <ol>
            <li>
              <strong>Add a middle color stop:</strong> instead of jumping directly from color A
              to B, add an intermediate mixed color at 50% to smooth the transition.
            </li>
            <li>
              <strong>Use HSL colors:</strong> gradients between HSL values often look more
              natural than RGB because HSL represents how humans perceive color.
              <code>hsl(0, 100%, 50%)</code> â†’ <code>hsl(60, 100%, 50%)</code> produces a
              clean warm gradient.
            </li>
            <li>
              <strong>Avoid complementary color pairs:</strong> opposite colors on the color
              wheel (red/green, blue/orange) produce muddy brown in the middle. Adjust the middle
              stop or add a warm/cool neutral to bridge the gap.
            </li>
          </ol>

          <h2>Gradient text</h2>
          <p>
            You can apply gradients to text using a clip:
          </p>
          <pre><code>{`h1 {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`}</code></pre>
          <p>
            Works in all modern browsers. The <code>-webkit-</code> prefix is still needed for
            Safari compatibility.
          </p>

          <h2>Repeating gradients</h2>
          <p>
            For stripe patterns and repeating textures:
          </p>
          <pre><code>{`/* Diagonal stripes */
background: repeating-linear-gradient(
  45deg,
  #f0f0f0,
  #f0f0f0 10px,
  #e0e0e0 10px,
  #e0e0e0 20px
);`}</code></pre>

          <h2>Summary</h2>
          <p>
            CSS gradients use <code>linear-gradient()</code>, <code>radial-gradient()</code>,
            and <code>conic-gradient()</code>. Each takes a direction/shape and a list of color
            stops. For complex gradients, use the{" "}
            <Link href="/tools/css-gradient">free CSS gradient generator</Link> to design
            visually and copy the code rather than writing stops manually.
          </p>
        </div>
      </article>
    </main>
  )
}
