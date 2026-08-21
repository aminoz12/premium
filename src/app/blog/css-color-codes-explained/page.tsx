import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "CSS Color Codes Explained: HEX, RGB, HSL, and When to Use Each",
  description:
    "CSS has four ways to specify the same color â€” HEX, RGB, RGBA, HSL, and HSLA. Here's what each means and which to use in different situations.",
  path: "/blog/css-color-codes-explained",
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
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            CSS Color Codes Explained: HEX, RGB, HSL, and When to Use Each
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            CSS has four main ways to specify the same color â€” and each has a different use case. Here&apos;s when to use HEX, RGB, RGBA, HSL, and HSLA, and how to convert between them free.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>HEX color codes</h2>
          <p>
            HEX (hexadecimal) colors are the most widely used format in CSS â€” the familiar <code>#FF6B6B</code> format. Each pair of hex digits represents one color channel: Red, Green, Blue.
          </p>
          <pre><code>{`color: #FF6B6B;   /* Red=FF (255), Green=6B (107), Blue=6B (107) */
color: #000000;   /* Black */
color: #FFFFFF;   /* White */
color: #000;      /* Shorthand for #000000 */
color: #F60;      /* Shorthand for #FF6600 */`}</code></pre>
          <p>
            The 3-digit shorthand works when both digits of each channel are the same: <code>#F60</code> expands to <code>#FF6600</code>. If they&apos;re different (like <code>#F67</code> expanding to <code>#FF6677</code>), the shorthand doesn&apos;t exist.
          </p>
          <p>
            <strong>When to use HEX:</strong> Design-to-code handoffs (Figma, Sketch export hex by default), brand color specifications in style guides, any context where you&apos;re copying a color from a tool.
          </p>
          <p>
            Convert HEX to RGB and HSL with the <Link href="/tools/color-picker">free color picker</Link>.
          </p>

          <h2>RGB and RGBA</h2>
          <p>
            RGB specifies colors as three numbers from 0â€“255 â€” the same values as HEX, just in decimal:
          </p>
          <pre><code>{`color: rgb(255, 107, 107);      /* Same as #FF6B6B */
color: rgb(0, 0, 0);           /* Black */
color: rgb(255, 255, 255);     /* White */

/* RGBA adds a fourth value: alpha (0=transparent, 1=opaque) */
color: rgba(255, 107, 107, 0.5);   /* 50% transparent red */
color: rgba(0, 0, 0, 0.8);        /* 80% opaque black overlay */`}</code></pre>
          <p>
            <strong>When to use RGB/RGBA:</strong> Any time you need transparency â€” semi-transparent overlays, shadows with opacity, dimmed backgrounds. The alpha channel (<code>rgba</code>) is the reason to choose this format over HEX.
          </p>
          <p>
            Note: Modern CSS also supports 8-digit HEX for transparency: <code>#FF6B6B80</code> (the last two digits are the alpha). But RGBA is more readable.
          </p>

          <h2>HSL and HSLA</h2>
          <p>
            HSL stands for Hue, Saturation, Lightness â€” a more intuitive way to think about colors:
          </p>
          <pre><code>{`/* hsl(hue, saturation, lightness) */
color: hsl(0, 100%, 50%);     /* Pure red */
color: hsl(120, 100%, 50%);   /* Pure green */
color: hsl(240, 100%, 50%);   /* Pure blue */

/* Adjusting lightness: easy to create shades */
color: hsl(0, 100%, 70%);     /* Lighter red */
color: hsl(0, 100%, 30%);     /* Darker red */

/* HSLA adds transparency */
color: hsla(0, 100%, 50%, 0.5);  /* 50% transparent red */`}</code></pre>
          <p>
            Hue is a degree on the color wheel (0â€“360): 0/360 = red, 120 = green, 240 = blue. Saturation is how vivid the color is (0% = grey, 100% = full color). Lightness is how light or dark it is (0% = black, 100% = white, 50% = the &quot;pure&quot; color).
          </p>
          <p>
            <strong>When to use HSL:</strong> When you want to programmatically create color variations â€” lighter/darker versions of the same hue, color palettes from a single base color, hover states and focus rings that are predictably related to the base color.
          </p>

          <h2>The practical guide: which format for what</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Situation</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Format to use</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Static brand colors in CSS variables</td><td className="border border-gray-200 p-3 text-gray-600">HEX</td><td className="border border-gray-200 p-3 text-gray-600">Standard format from design tools</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Semi-transparent overlay or shadow</td><td className="border border-gray-200 p-3 text-gray-600">RGBA or HSLA</td><td className="border border-gray-200 p-3 text-gray-600">Alpha channel support</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Generating a color palette from one base hue</td><td className="border border-gray-200 p-3 text-gray-600">HSL</td><td className="border border-gray-200 p-3 text-gray-600">Lightness/saturation easy to manipulate</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Hover/focus states (slightly darker/lighter)</td><td className="border border-gray-200 p-3 text-gray-600">HSL</td><td className="border border-gray-200 p-3 text-gray-600">Adjust lightness from a variable</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Copying a color from Chrome DevTools</td><td className="border border-gray-200 p-3 text-gray-600">Any (DevTools shows all formats)</td><td className="border border-gray-200 p-3 text-gray-600">Click the color swatch to cycle formats</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">CSS custom properties for theming</td><td className="border border-gray-200 p-3 text-gray-600">HSL channel values</td><td className="border border-gray-200 p-3 text-gray-600">Allows opacity override via <code>hsl(var(--h) var(--s) var(--l) / 50%)</code></td></tr>
              </tbody>
            </table>
          </div>

          <h2>CSS color keywords</h2>
          <p>
            CSS also supports 140+ named color keywords â€” <code>red</code>, <code>blue</code>, <code>tomato</code>, <code>rebeccapurple</code>, <code>cornflowerblue</code>. These are fine for quick prototyping but not for production â€” the actual RGB values behind keywords aren&apos;t always intuitive, and they don&apos;t convey the same precision as a specific hex code.
          </p>
          <p>
            One special keyword: <code>transparent</code> = <code>rgba(0,0,0,0)</code>. Use it for fully transparent colors (e.g., transparent button backgrounds, transparent borders for focus ring tricks).
          </p>

          <h2>Modern CSS: color-mix() and oklch</h2>
          <p>
            CSS is evolving with two new color capabilities in 2026:
          </p>
          <ul>
            <li><strong><code>color-mix(in srgb, red 50%, blue)</code></strong> â€” mix two colors in CSS without JavaScript. Supported in Chrome 111+, Firefox 113+, Safari 16.2+.</li>
            <li><strong>OKLCH</strong> â€” a perceptually uniform color space where equal steps in lightness look equally different to the human eye (unlike HSL, where equal steps in lightness can look uneven). Good for generating accessible color palettes.</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/color-picker">Free Color Picker</Link> â€” pick colors and convert between HEX, RGB, and HSL</li>
            <li><Link href="/tools/color-contrast-checker">Color Contrast Checker</Link> â€” verify any color combination meets WCAG accessibility requirements</li>
            <li><Link href="/tools/css-gradient-generator">CSS Gradient Generator</Link> â€” create gradients using any color format</li>
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
