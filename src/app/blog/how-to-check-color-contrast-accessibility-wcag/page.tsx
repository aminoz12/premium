import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Check Color Contrast for Accessibility (WCAG AA and AAA Guide)",
  description:
    "Poor color contrast is the most common accessibility failure on the web. Here's what the WCAG ratios mean and how to check any color pair free in your browser.",
  path: "/blog/how-to-check-color-contrast-accessibility-wcag",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-31" />
        <meta itemProp="dateModified" content="2026-05-31" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-31">May 31, 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Check Color Contrast for Accessibility (WCAG AA and AAA Guide)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Poor color contrast is the most common accessibility failure found in web audits.
            Here&apos;s what the WCAG ratios actually mean, what passes and fails, and how to
            check any color combination free.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Check any color pair instantly</h2>
          <p>
            Use the <Link href="/tools/color-contrast-checker">free color contrast checker</Link> —
            enter any foreground and background color in hex format and get the contrast ratio plus
            AA and AAA pass/fail results. No account required.
          </p>

          <h2>Why contrast matters</h2>
          <p>
            Approximately 300 million people worldwide have color vision deficiency. Many more
            have low vision, read in bright sunlight, or use displays with poor calibration. Text
            that looks fine to a designer with a high-quality monitor can be completely unreadable
            to a significant portion of the actual audience.
          </p>
          <p>
            Beyond accessibility, contrast affects all users: outdoor reading, aging eyes, and
            fatigue all reduce effective contrast sensitivity. Good contrast makes content easier
            to read for everyone.
          </p>

          <h2>What the WCAG contrast ratio means</h2>
          <p>
            The contrast ratio compares the relative luminance (brightness) of two colors on a
            scale from 1:1 (identical colors, no contrast) to 21:1 (black text on white background,
            maximum contrast).
          </p>
          <p>
            WCAG 2.1 defines two conformance levels:
          </p>
          <table>
            <thead>
              <tr><th>Level</th><th>Normal text</th><th>Large text</th><th>UI components</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>AA</strong> (minimum)</td>
                <td>4.5:1 ratio</td>
                <td>3:1 ratio</td>
                <td>3:1 ratio</td>
              </tr>
              <tr>
                <td><strong>AAA</strong> (enhanced)</td>
                <td>7:1 ratio</td>
                <td>4.5:1 ratio</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Large text</strong> is defined as 18pt (24px) normal weight or 14pt (18.67px) bold.
            Text at larger sizes is easier to read with lower contrast, hence the relaxed requirement.
          </p>
          <p>
            <strong>UI components</strong> includes button borders, input focus indicators, icon outlines,
            and other graphical elements that convey meaning (but not decorative elements).
          </p>

          <h2>Common color combinations and their ratios</h2>
          <table>
            <thead>
              <tr><th>Text / Background</th><th>Ratio</th><th>AA text</th><th>AAA text</th></tr>
            </thead>
            <tbody>
              <tr><td>Black on white (#000 / #fff)</td><td>21:1</td><td>Pass</td><td>Pass</td></tr>
              <tr><td>Navy on white (#003366 / #fff)</td><td>11.8:1</td><td>Pass</td><td>Pass</td></tr>
              <tr><td>Gray on white (#767676 / #fff)</td><td>4.54:1</td><td>Pass</td><td>Fail</td></tr>
              <tr><td>Light gray on white (#aaa / #fff)</td><td>2.32:1</td><td>Fail</td><td>Fail</td></tr>
              <tr><td>White on blue (#fff / #0066cc)</td><td>5.1:1</td><td>Pass</td><td>Fail</td></tr>
              <tr><td>Yellow on white (#ffff00 / #fff)</td><td>1.07:1</td><td>Fail</td><td>Fail</td></tr>
            </tbody>
          </table>
          <p>
            The most common failure: light gray placeholder text, footer text, or captions on
            white backgrounds. Many designers use #999 or #aaa for secondary text — these fail
            AA for normal text sizes.
          </p>

          <h2>How to fix failing contrast</h2>
          <p>
            When a color pair fails, you have three options:
          </p>
          <ol>
            <li>
              <strong>Darken the foreground color:</strong> for light text on white, moving from
              #aaa to #767676 is the minimum for AA compliance. Verify with the checker as you
              adjust.
            </li>
            <li>
              <strong>Lighten the background:</strong> if the background is dark, lightening it
              increases contrast with dark text.
            </li>
            <li>
              <strong>Increase text size:</strong> large text (18px+ or 14px+ bold) has relaxed
              contrast requirements — 3:1 for AA instead of 4.5:1.
            </li>
          </ol>

          <h2>The gray minimum for body text</h2>
          <p>
            The minimum gray value for body text on a white background to pass WCAG AA is
            approximately <code>#767676</code> (ratio: 4.54:1). Anything lighter than this fails.
          </p>
          <p>
            For primary content, aim for <code>#595959</code> or darker for comfortable reading
            at normal sizes. Reserve the minimum-passing gray for secondary content like captions.
          </p>

          <h2>WCAG 3.0 and APCA</h2>
          <p>
            The upcoming WCAG 3.0 uses a different contrast algorithm called APCA (Advanced
            Perceptual Contrast Algorithm) that is more perceptually accurate — especially for
            dark mode and colored backgrounds. WCAG 3.0 is not yet the adopted standard, but
            APCA is worth evaluating for new design systems.
          </p>

          <h2>Summary</h2>
          <ul>
            <li>Normal text needs 4.5:1 contrast for AA, 7:1 for AAA</li>
            <li>Large text (18px+ or bold 14px+) needs 3:1 for AA</li>
            <li>The minimum gray for body text on white: #767676</li>
            <li>Yellow on white is essentially invisible — never use it for text</li>
            <li>Check any color pair with the <Link href="/tools/color-contrast-checker">free contrast checker</Link></li>
          </ul>
        </div>
      </article>
    </main>
  )
}
