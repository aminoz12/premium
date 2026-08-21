import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "Hex to RGB and RGB to Hex: The Color Conversion Guide (With Calculator)",
  description:
    "CSS uses both hex (#ff6600) and RGB (255,102,0) for the same colors. Here's how to convert between them â€” formula, mental shortcut, and free tool that outputs HSL too.",
  path: "/blog/hex-to-rgb-rgb-to-hex-color-converter",
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
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-06-02">June 2, 2026</time>
            <span>Â·</span>
            <span>4 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            Hex to RGB and RGB to Hex: The Color Conversion Guide (With Calculator)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            CSS accepts both <code>#ff6600</code> and <code>rgb(255, 102, 0)</code> for the same
            color. Design tools often give you one format when you need the other. Here&apos;s
            the conversion formula and the fastest free tool.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Convert any color instantly</h2>
          <p>
            Use the <Link href="/tools/color-picker">free color picker</Link> â€” enter any hex
            color and it shows the RGB, HSL, and HSB equivalents instantly. No account required.
          </p>

          <h2>How hex colors work</h2>
          <p>
            A hex color like <code>#ff6600</code> encodes three values â€” red, green, blue â€”
            each as two hexadecimal digits:
          </p>
          <ul>
            <li><code>ff</code> = red channel</li>
            <li><code>66</code> = green channel</li>
            <li><code>00</code> = blue channel</li>
          </ul>
          <p>
            Hexadecimal (base 16) uses digits 0â€“9 and letters aâ€“f. Each two-digit pair represents
            a value from 0 (00 in hex) to 255 (ff in hex).
          </p>

          <h2>The conversion formula: hex to RGB</h2>
          <p>
            Convert each two-digit hex pair to decimal:
          </p>
          <ul>
            <li><code>ff</code> hex â†’ 15 Ã— 16 + 15 = <strong>255</strong></li>
            <li><code>66</code> hex â†’ 6 Ã— 16 + 6 = <strong>102</strong></li>
            <li><code>00</code> hex â†’ 0 Ã— 16 + 0 = <strong>0</strong></li>
          </ul>
          <p>
            So <code>#ff6600</code> = <code>rgb(255, 102, 0)</code>.
          </p>
          <p>
            In JavaScript: <code>parseInt(&apos;ff&apos;, 16)</code> converts any hex pair to decimal.
          </p>

          <h2>The conversion formula: RGB to hex</h2>
          <p>
            Convert each decimal value (0â€“255) to two-digit hexadecimal:
          </p>
          <ul>
            <li>255 Ã· 16 = 15 remainder 15 â†’ ff</li>
            <li>102 Ã· 16 = 6 remainder 6 â†’ 66</li>
            <li>0 Ã· 16 = 0 remainder 0 â†’ 00</li>
          </ul>
          <p>
            In JavaScript: <code>(255).toString(16)</code> returns <code>&apos;ff&apos;</code>.
            Pad single-digit results with a leading zero: <code>(6).toString(16).padStart(2, &apos;0&apos;)</code>
            returns <code>&apos;06&apos;</code>.
          </p>

          <h2>Shorthand hex (#rgb)</h2>
          <p>
            When both digits of each channel are identical, hex colors can be shortened:
          </p>
          <ul>
            <li><code>#ffffff</code> â†’ <code>#fff</code></li>
            <li><code>#000000</code> â†’ <code>#000</code></li>
            <li><code>#ff6600</code> cannot be shortened (66 would be 6, but 66 â‰  6)</li>
            <li><code>#ff6633</code> â†’ <code>#f63</code></li>
          </ul>
          <p>
            Shorthand only works when each pair is a repeated digit. Browsers expand <code>#f63</code>
            to <code>#ff6633</code>.
          </p>

          <h2>Hex with opacity: #RRGGBBAA</h2>
          <p>
            Modern CSS supports 8-digit hex for opacity: <code>#ff660080</code> where the last two
            digits (80 = 128 in decimal = 50% opacity) represent the alpha channel. This is
            equivalent to <code>rgba(255, 102, 0, 0.5)</code>.
          </p>

          <h2>Quick reference: common colors</h2>
          <table>
            <thead>
              <tr><th>Color</th><th>Hex</th><th>RGB</th></tr>
            </thead>
            <tbody>
              <tr><td>White</td><td>#ffffff</td><td>rgb(255, 255, 255)</td></tr>
              <tr><td>Black</td><td>#000000</td><td>rgb(0, 0, 0)</td></tr>
              <tr><td>Red</td><td>#ff0000</td><td>rgb(255, 0, 0)</td></tr>
              <tr><td>Green</td><td>#00ff00</td><td>rgb(0, 255, 0)</td></tr>
              <tr><td>Blue</td><td>#0000ff</td><td>rgb(0, 0, 255)</td></tr>
              <tr><td>Gray (50%)</td><td>#808080</td><td>rgb(128, 128, 128)</td></tr>
              <tr><td>Transparent</td><td>#00000000</td><td>rgba(0, 0, 0, 0)</td></tr>
            </tbody>
          </table>

          <h2>Why CSS has both formats</h2>
          <p>
            Hex colors came from HTML in the 1990s and are more compact. RGB and HSL were added
            later as CSS became a design language â€” they are more readable and easier to manipulate
            programmatically. Both are equally valid in CSS today.
          </p>
          <p>
            HSL (Hue, Saturation, Lightness) is the most human-readable format:
            <code>hsl(24, 100%, 50%)</code> means &quot;warm orange, fully saturated, medium brightness.&quot;
            Easy to adjust by eye. Use the{" "}
            <Link href="/tools/color-picker">color picker</Link> to get all three formats
            for any color simultaneously.
          </p>

          <h2>Summary</h2>
          <ul>
            <li>Hex: <code>#RRGGBB</code> â€” each pair is the channel value in hex (00â€“ff = 0â€“255)</li>
            <li>RGB: <code>rgb(R, G, B)</code> â€” each value is 0â€“255 in decimal</li>
            <li>Convert hex to decimal: <code>parseInt(hexPair, 16)</code></li>
            <li>Convert decimal to hex: <code>value.toString(16).padStart(2, &apos;0&apos;)</code></li>
            <li>Use the <Link href="/tools/color-picker">color picker</Link> to skip the math</li>
          </ul>
        </div>
      </article>
    </main>
  )
}
