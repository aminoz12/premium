import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "Color Contrast Ratios: What WCAG AA and AAA Actually Mean in Practice",
  description:
    "The 4.5:1 minimum ratio passes WCAG AA — but it can still fail on real screens with glare, aging eyes, or low brightness. Here's how I test contrast in practice and where the spec falls short.",
  path: "/blog/color-contrast-wcag-what-it-means",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-13" />
        <meta itemProp="dateModified" content="2026-05-13" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-13">May 13, 2026</time>
            <span>·</span>
            <span>7 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            Color Contrast Ratios: What WCAG AA and AAA Actually Mean in Practice
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            The WCAG 4.5:1 minimum ratio is a legal compliance floor, not a usability guarantee.
            I&apos;ve seen AA-compliant designs that were genuinely difficult to read in real conditions.
            Here&apos;s what the numbers mean, where the spec gets complicated, and how I test in practice.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The contrast ratio formula</h2>
          <p>
            WCAG contrast ratio is calculated as <code>(L1 + 0.05) / (L2 + 0.05)</code>, where L1
            is the relative luminance of the lighter color and L2 is the relative luminance of the
            darker color. Luminance is calculated from the RGB values using a gamma-correction formula
            that approximates how the human eye perceives light.
          </p>
          <p>
            The result is a ratio. Black on white = 21:1 (maximum). White on white = 1:1 (no contrast).
            The WCAG standards are:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Level</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Normal text (&lt;18pt)</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Large text (≥18pt or 14pt bold)</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">UI components</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">WCAG AA</td>
                  <td className="border border-gray-200 p-3 text-gray-600">4.5:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">3:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">3:1</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">WCAG AAA</td>
                  <td className="border border-gray-200 p-3 text-gray-600">7:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">4.5:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">No requirement</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Note: WCAG AAA is rarely required by law. Most accessibility mandates (ADA, Section 508,
            EN 301 549 in the EU) reference WCAG 2.1 AA. AAA is a voluntary enhancement.
          </p>

          <h2>Where 4.5:1 fails in real conditions</h2>
          <p>
            4.5:1 was derived from studies of people with moderately low vision — specifically,
            people with roughly 20/80 vision using standard displays at standard conditions. In
            practice, these conditions are rarely standard:
          </p>
          <ul>
            <li>
              <strong>Screen glare.</strong> Ambient light reflecting off a laptop screen can drop
              effective contrast dramatically. A 4.5:1 ratio on a non-glossy display in a
              controlled lab can feel like 2:1 on a glossy screen in a coffee shop by a window.
              WCAG doesn&apos;t account for ambient lighting.
            </li>
            <li>
              <strong>Aging eyes.</strong> Contrast sensitivity decreases with age. A 60-year-old
              requires roughly 2× the contrast of a 20-year-old to perceive the same level of
              clarity. 4.5:1 is calibrated for impaired young users, not typical older users.
            </li>
            <li>
              <strong>Low-brightness phone screens.</strong> Phone batteries last longer at low
              brightness. Many users browse with screens at 30–50% brightness, which compresses
              the effective contrast range.
            </li>
            <li>
              <strong>AMOLED display characteristics.</strong> OLED screens can display true
              black (0 nits) while IPS displays have a minimum brightness floor. The same CSS
              colors display at different effective contrast ratios on these two panel types.
            </li>
          </ul>

          <h2>The grey text problem</h2>
          <p>
            The most common accessibility failure I see in design reviews is grey body text on
            white backgrounds. Grey text is visually fashionable — it creates a hierarchy between
            headings and body — but it frequently fails at small sizes.
          </p>
          <p>
            Specific values I&apos;ve checked:
          </p>
          <ul>
            <li>
              <code>#6B7280</code> (Tailwind gray-500) on white: <strong>4.63:1</strong> — barely
              AA compliant, fails in adverse conditions.
            </li>
            <li>
              <code>#9CA3AF</code> (Tailwind gray-400) on white: <strong>2.85:1</strong> — fails AA
              for normal text. Passes for large decorative text only.
            </li>
            <li>
              <code>#374151</code> (Tailwind gray-700) on white: <strong>10.65:1</strong> — solid,
              close to AAA. This is what I use for body text.
            </li>
            <li>
              <code>#6B7280</code> (gray-500) on <code>#F9FAFB</code> (gray-50): <strong>4.17:1</strong> —
              fails AA. A common pattern that looks fine in Figma but fails in production.
            </li>
          </ul>
          <p>
            The lesson: don&apos;t check your text color against pure white if your actual background is
            light grey. Check against the actual background color you&apos;re shipping.
          </p>

          <h2>The large text exception is misused</h2>
          <p>
            The 3:1 ratio for &quot;large text&quot; (18pt or 14pt bold, approximately 24px regular or
            18px bold in CSS) is meant for headings that are genuinely large — paragraph titles,
            section headers, page titles. I regularly see it applied to any text that&apos;s slightly
            bigger than the smallest font on the page, which is not the intent.
          </p>
          <p>
            14px bold hero text in a light grey color, justified as &quot;large text,&quot; and then
            checked against 3:1 — I&apos;ve seen this in multiple design systems. If the text is
            below 18px (24pt) regular weight, it needs 4.5:1 regardless of whether it&apos;s bold.
          </p>

          <h2>UI components at 3:1</h2>
          <p>
            WCAG 1.4.11 (Non-Text Contrast, Level AA) requires a 3:1 ratio for UI components
            like buttons, form inputs, and icons. This applies to the component boundary against
            its background — for example, the border of an input field against the page background.
          </p>
          <p>
            Common failure: a white button on a light background with only a 1px border in
            <code>#E5E7EB</code> (gray-200). The border-to-background contrast is around 1.5:1.
            The button is visually present for most users but fails WCAG 1.4.11. Fix: darken the
            border to <code>#9CA3AF</code> (gray-400) at minimum, which gets you to 2.85:1 — still
            technically a fail, so push to <code>#6B7280</code> (gray-500) for 4.17:1 to leave a margin.
          </p>

          <h2>APCA: the upcoming replacement for the WCAG contrast formula</h2>
          <p>
            The WCAG contrast ratio formula has known issues — it&apos;s based on color science from
            the 1980s and doesn&apos;t accurately model how modern displays render color or how the
            human visual system processes contrast for text. The W3C is developing WCAG 3.0 with
            a new algorithm called APCA (Advanced Perceptual Contrast Algorithm) that accounts
            for font weight, font size, and display polarity (dark-on-light vs light-on-dark)
            separately.
          </p>
          <p>
            APCA isn&apos;t finalized or legally mandated yet, but it&apos;s worth knowing it exists. For
            now, WCAG 2.1 AA is the standard to comply with, and WCAG 3.0/APCA is where the
            conversation is heading.
          </p>

          <h2>How I test contrast in practice</h2>
          <p>
            Three checks I do before shipping any new color combination:
          </p>
          <ol>
            <li>
              Check the exact foreground/background hex values using the{" "}
              <Link href="/tools/color-contrast-checker">contrast checker</Link>. Not an
              approximation — the actual CSS values that will ship.
            </li>
            <li>
              View the design at 50% screen brightness on a laptop, in a room with a window behind
              me (to simulate glare). If it&apos;s still easy to read, I&apos;m satisfied.
            </li>
            <li>
              Check on a phone. Phones render fonts differently than desktops, and the smaller
              screen size means text often renders at effectively smaller sizes.
            </li>
          </ol>
          <p>
            If the color passes WCAG AA and all three of the above, I ship it. If it only barely
            passes AA (under 5:1) and is used for body text, I push the foreground darker until
            I hit at least 6:1, which gives me a buffer for real-world conditions.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/color-contrast-checker">Color Contrast Checker</Link>{" "}
              — check any foreground/background pair against WCAG AA and AAA instantly.
            </li>
            <li>
              <Link href="/tools/color-picker">Color Picker</Link>{" "}
              — pick colors and copy them in hex, RGB, or HSL format.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. Contrast ratios cited were measured
            using the tool on this site and verified against the WebAIM contrast checker.
          </p>
        </div>
      </article>
    </main>
  )
}
