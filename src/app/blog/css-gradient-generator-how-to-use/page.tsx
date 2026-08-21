import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "CSS Gradient Generator: How to Create Linear, Radial, and Conic Gradients",
  description:
    "How CSS gradients work â€” linear, radial, and conic â€” with the syntax explained and a free visual generator to create gradient CSS code.",
  path: "/blog/css-gradient-generator-how-to-use",
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
            CSS Gradient Generator: How to Create Linear, Radial, and Conic Gradients
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            CSS gradients are pure CSS â€” no images needed. Here&apos;s how the three types work, how to write the syntax, and how to generate gradient code visually for free.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Why CSS gradients (not images)</h2>
          <p>
            Before CSS gradients, backgrounds required image files â€” a performance cost and a maintenance headache. CSS gradients generate the visual directly in the browser with no HTTP request, scale to any size without pixelation, and are easily changed via code without editing image files.
          </p>
          <p>
            CSS gradients are a value type, not a property â€” they&apos;re used anywhere a <code>&lt;gradient&gt;</code> value is accepted, primarily <code>background-image</code> and <code>background</code>. A gradient is technically treated as an image of infinite resolution.
          </p>

          <h2>Linear gradients</h2>
          <p>
            The most common type â€” colors transition along a straight line.
          </p>
          <pre><code>{`/* Basic: top to bottom */
background: linear-gradient(#ff6b6b, #4ecdc4);

/* With direction */
background: linear-gradient(to right, #ff6b6b, #4ecdc4);
background: linear-gradient(45deg, #ff6b6b, #4ecdc4);

/* Multiple color stops */
background: linear-gradient(to right, #ff6b6b, #feca57, #4ecdc4);

/* Positioned color stops */
background: linear-gradient(to right, #ff6b6b 0%, #feca57 40%, #4ecdc4 100%);

/* Hard color stops (no transition) */
background: linear-gradient(to right, #ff6b6b 50%, #4ecdc4 50%);`}</code></pre>
          <p>
            The direction can be a keyword (<code>to right</code>, <code>to bottom right</code>) or an angle in degrees. <code>0deg</code> is bottom-to-top; degrees increase clockwise. <code>90deg</code> is left-to-right.
          </p>

          <h2>Radial gradients</h2>
          <p>
            Colors radiate from a center point â€” creating circular or elliptical patterns.
          </p>
          <pre><code>{`/* Default: circle at center */
background: radial-gradient(#ff6b6b, #4ecdc4);

/* Explicit shape */
background: radial-gradient(circle, #ff6b6b, #4ecdc4);
background: radial-gradient(ellipse, #ff6b6b, #4ecdc4);

/* Positioned center */
background: radial-gradient(circle at top left, #ff6b6b, #4ecdc4);
background: radial-gradient(circle at 30% 70%, #ff6b6b, #4ecdc4);

/* Multiple stops */
background: radial-gradient(circle, #ff6b6b 20%, #feca57 60%, #4ecdc4 100%);`}</code></pre>
          <p>
            The position after <code>at</code> accepts keywords (<code>center</code>, <code>top left</code>) or percentages. This controls where the gradient emanates from.
          </p>

          <h2>Conic gradients</h2>
          <p>
            Colors rotate around a center point â€” like a pie chart or color wheel.
          </p>
          <pre><code>{`/* Basic conic */
background: conic-gradient(#ff6b6b, #4ecdc4);

/* From a specific angle */
background: conic-gradient(from 90deg, #ff6b6b, #4ecdc4);

/* Pie chart effect */
background: conic-gradient(
  #ff6b6b 0% 25%,    /* 25% red */
  #feca57 25% 60%,   /* 35% yellow */
  #4ecdc4 60% 100%   /* 40% teal */
);

/* Color wheel */
background: conic-gradient(
  red, yellow, lime, cyan, blue, magenta, red
);`}</code></pre>
          <p>
            Conic gradients are supported in all modern browsers (Chrome 69+, Firefox 83+, Safari 12.1+). Use <code>@supports</code> to provide a fallback for older browsers if needed.
          </p>

          <h2>Repeating gradients</h2>
          <p>
            All three gradient types have repeating variants that tile the gradient:
          </p>
          <pre><code>{`/* Striped pattern */
background: repeating-linear-gradient(
  45deg,
  #ff6b6b,
  #ff6b6b 10px,
  #4ecdc4 10px,
  #4ecdc4 20px
);

/* Repeating radial rings */
background: repeating-radial-gradient(
  circle,
  #ff6b6b 0px,
  #ff6b6b 5px,
  transparent 5px,
  transparent 15px
);`}</code></pre>

          <h2>Layering gradients</h2>
          <p>
            Multiple gradients can be layered using comma separation in <code>background</code> â€” the first gradient listed is on top:
          </p>
          <pre><code>{`background:
  linear-gradient(rgba(255,107,107,0.5), transparent),
  radial-gradient(circle at 80% 20%, #4ecdc4, transparent 60%),
  #1a1a2e;`}</code></pre>
          <p>
            Using <code>rgba()</code> or <code>transparent</code> in gradients allows lower layers to show through.
          </p>

          <h2>Using the CSS gradient generator</h2>
          <p>
            Writing gradient syntax manually is tedious, especially for multi-stop or angled gradients. The <Link href="/tools/css-gradient-generator">free CSS gradient generator</Link> lets you:
          </p>
          <ul>
            <li>Pick colors visually with a color picker</li>
            <li>Add and position multiple color stops by dragging</li>
            <li>Choose gradient type (linear, radial, conic)</li>
            <li>Adjust angle and position interactively</li>
            <li>Copy the generated CSS code directly</li>
          </ul>
          <p>
            The generated code works in all modern browsers without vendor prefixes â€” <code>-webkit-linear-gradient</code> prefix support is no longer needed for any browser in active support as of 2026.
          </p>

          <h2>Gradient color strategies</h2>
          <p>
            A few gradient patterns that work reliably in UI design:
          </p>
          <ul>
            <li><strong>Monochromatic:</strong> Two shades of the same hue â€” safe, always cohesive. Example: <code>linear-gradient(#3b82f6, #1d4ed8)</code>.</li>
            <li><strong>Analogous:</strong> Colors adjacent on the color wheel â€” natural, pleasing. Blue â†’ teal, pink â†’ orange.</li>
            <li><strong>Semi-transparent overlay:</strong> A gradient from a brand color to transparent over a photo background. Ensures text readability while showing the image.</li>
            <li><strong>Subtle background:</strong> Near-white to white gradient. Adds depth without visible color â€” <code>linear-gradient(135deg, #f8fafc, #ffffff)</code>.</li>
          </ul>
          <p>
            Avoid complementary color gradients (directly opposite on the color wheel â€” red to green, blue to orange) â€” the transition passes through grey in the middle and looks muddy.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/css-gradient-generator">Free CSS Gradient Generator</Link> â€” visual gradient builder with copy-paste CSS output</li>
            <li><Link href="/tools/color-picker">Free Color Picker</Link> â€” pick and convert colors to HEX, RGB, and HSL</li>
            <li><Link href="/tools/color-contrast-checker">Color Contrast Checker</Link> â€” verify your gradient meets WCAG accessibility requirements</li>
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
