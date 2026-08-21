import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "CSS Box Shadows That Look Natural: The Numbers Behind the Effect",
  description:
    "Most box shadow tutorials give you a single value. Real shadows don't work that way. Here's a breakdown of the five parameters, why ambient and key layers should be separate, and the specific values I use in production.",
  path: "/blog/css-box-shadow-real-numbers",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-15" />
        <meta itemProp="dateModified" content="2026-05-15" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-15">May 15, 2026</time>
            <span>·</span>
            <span>8 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            CSS Box Shadows That Look Natural: The Numbers Behind the Effect
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Most CSS box shadow tutorials hand you one value and move on. Real shadows in physical
            reality aren&apos;t that simple — they have two distinct components that require different
            parameters. Here&apos;s how to build shadows that actually look right.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Why most CSS shadows look slightly off</h2>
          <p>
            The default shadow you see in most tutorials is something like{" "}
            <code>box-shadow: 0 4px 6px rgba(0,0,0,0.1);</code>. It works. It&apos;s inoffensive.
            But it doesn&apos;t look like a real shadow — it looks like a grey blur blob attached to
            the bottom of a card.
          </p>
          <p>
            The reason is that physical shadows have two distinct components that CSS treats as one:
          </p>
          <ul>
            <li>
              <strong>The key shadow</strong> — cast by the primary light source (usually above or
              slightly in front of the object). This shadow is directional, relatively sharp, and
              darker close to the object.
            </li>
            <li>
              <strong>The ambient shadow</strong> — from the diffuse light bouncing off the
              environment. This shadow is non-directional, has a large spread, and is very soft
              and light.
            </li>
          </ul>
          <p>
            Single-layer CSS shadows reproduce only one of these, which is why they look &quot;digital&quot;
            rather than physical. The fix is to use multiple box-shadow values (CSS allows
            comma-separated stacking).
          </p>

          <h2>The five parameters</h2>
          <p>
            CSS <code>box-shadow</code> takes: <code>offset-x offset-y blur-radius spread-radius color</code>
          </p>
          <ul>
            <li>
              <strong><code>offset-x</code>:</strong> Horizontal position. Positive = shadow moves
              right (light source is on the left). Negative = shadow moves left.
            </li>
            <li>
              <strong><code>offset-y</code>:</strong> Vertical position. Positive = shadow moves
              down (light source is above). Most web designs have light from above, so this is
              almost always positive.
            </li>
            <li>
              <strong><code>blur-radius</code>:</strong> How much the shadow blurs. 0 = hard edge.
              Larger values = softer, more diffuse shadow. This controls perceived distance from
              the surface.
            </li>
            <li>
              <strong><code>spread-radius</code>:</strong> Expands or contracts the shadow before
              blurring. Positive values = shadow larger than the element. Negative values = smaller.
              Useful for creating tight, close shadows.
            </li>
            <li>
              <strong><code>color</code>:</strong> The shadow color. Black (<code>rgba(0,0,0,x)</code>)
              is the default, but in real lighting, shadows are rarely pure black — they&apos;re a
              dark, slightly warm or cool version of the surface color.
            </li>
          </ul>

          <h2>A two-layer shadow system that works</h2>
          <p>
            Here&apos;s the structure I use in production for card components with varying elevation levels:
          </p>
          <pre><code>{`/* Elevation 1 — resting on a surface, barely lifted */
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.07),   /* ambient */
  0 1px 1px rgba(0, 0, 0, 0.04);   /* key */

/* Elevation 2 — standard card at rest */
box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.07),   /* ambient */
  0 1px 3px rgba(0, 0, 0, 0.06);   /* key */

/* Elevation 3 — hovered card, slightly lifted */
box-shadow:
  0 10px 15px rgba(0, 0, 0, 0.08),  /* ambient */
  0 4px 6px rgba(0, 0, 0, 0.05);    /* key */

/* Elevation 4 — modal or dropdown, clearly above surface */
box-shadow:
  0 20px 25px rgba(0, 0, 0, 0.10),  /* ambient */
  0 10px 10px rgba(0, 0, 0, 0.04);  /* key */`}</code></pre>
          <p>
            The ambient layer has a larger blur radius and lower offset — it&apos;s the soft halo
            around the object. The key layer has a smaller blur radius but slightly more Y offset
            and higher opacity — it&apos;s the directional shadow directly beneath the object.
          </p>

          <h2>Numbers from real design systems</h2>
          <p>
            I looked at the box-shadow values used by four production design systems to see
            whether the two-layer approach is the norm:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">System</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Shadow layers</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Opacity range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Tailwind CSS shadow-md</td>
                  <td className="border border-gray-200 p-3 text-gray-600">2</td>
                  <td className="border border-gray-200 p-3 text-gray-600">7%–10%</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Material Design 3 (elevation 2)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">2</td>
                  <td className="border border-gray-200 p-3 text-gray-600">12%–30%</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Apple HIG card shadow</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1 (large blur)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">18%</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Stripe dashboard card</td>
                  <td className="border border-gray-200 p-3 text-gray-600">3</td>
                  <td className="border border-gray-200 p-3 text-gray-600">6%–8%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Material Design uses higher opacity because it&apos;s designed for Android where screens
            often have higher ambient light. Web UIs generally work better with lower opacity
            shadows (6–12%) because monitors have a dark background of their own that increases
            perceived contrast.
          </p>

          <h2>Dark mode shadows: the invisible problem</h2>
          <p>
            Dark mode breaks box shadows. On a dark background, a dark shadow is invisible — the
            shadow color blends into the background before the blur can create contrast. Two
            solutions:
          </p>
          <ul>
            <li>
              <strong>Switch to a slightly lighter shadow color:</strong> Instead of{" "}
              <code>rgba(0,0,0,0.1)</code>, use <code>rgba(0,0,0,0.4)</code> in dark mode. The
              background is darker, so you need more opacity to create the same perceived depth.
            </li>
            <li>
              <strong>Use a border instead:</strong> Many well-designed dark interfaces (Linear,
              Vercel, GitHub dark mode) replace shadows with a subtle 1px border in a slightly
              lighter tone than the background. This creates separation without relying on shadow
              contrast. <code>border: 1px solid rgba(255,255,255,0.08)</code> on a dark card is
              often cleaner than a shadow.
            </li>
          </ul>

          <h2>Colored shadows: the neon glow effect</h2>
          <p>
            Using a colored shadow (instead of black) is how the &quot;neon glow&quot; effect works in
            dark-mode dashboards. The shadow color matches or complements the element&apos;s own color:
          </p>
          <pre><code>{`/* Blue button with glow */
box-shadow: 0 0 20px rgba(96, 165, 250, 0.5);

/* Card with colored key shadow (warm card on warm background) */
box-shadow:
  0 10px 15px rgba(59, 130, 246, 0.15),
  0 4px 6px rgba(139, 92, 246, 0.10);`}</code></pre>
          <p>
            Colored shadows read as light emission rather than shadow, which is why they work for
            buttons and interactive elements in dark interfaces. They don&apos;t work for cards in light
            mode — the colored haze looks odd against white backgrounds.
          </p>

          <h2>Spread radius for inset shadows</h2>
          <p>
            <code>inset</code> moves the shadow inside the element. A negative spread radius on an
            inset shadow is how you create the &quot;pressed button&quot; effect:
          </p>
          <pre><code>{`/* Normal state */
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

/* Pressed state */
box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);`}</code></pre>
          <p>
            Inset shadows are also useful for input fields — a subtle inset shadow on focus
            reinforces the &quot;input well&quot; visual metaphor better than a border color change alone.
          </p>

          <h2>Using the box shadow generator</h2>
          <p>
            Tweaking five parameters across two layers is tedious by hand. The{" "}
            <Link href="/tools/box-shadow-generator">box shadow generator</Link> lets you adjust
            all parameters visually with live preview — switch to dark mode preview to check your
            shadows look right on dark backgrounds before shipping them.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/box-shadow-generator">Box Shadow Generator</Link>{" "}
              — build multi-layer CSS shadows visually with real-time preview.
            </li>
            <li>
              <Link href="/tools/color-picker">Color Picker</Link>{" "}
              — pick the exact RGBA values for shadow colors with opacity control.
            </li>
            <li>
              <Link href="/tools/css-gradient-generator">CSS Gradient Generator</Link>{" "}
              — combine shadows with background gradients for depth effects.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. The elevation system described above
            is adapted from the one I use in this site&apos;s own UI components.
          </p>
        </div>
      </article>
    </main>
  )
}
