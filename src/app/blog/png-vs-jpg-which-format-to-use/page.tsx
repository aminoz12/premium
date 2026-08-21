import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "PNG vs JPG: Which Image Format Should You Use and When?",
  description:
    "Picking the wrong format can triple your file size or destroy quality. Here's the exact decision rule — plus the exception that trips up most developers.",
  path: "/blog/png-vs-jpg-which-format-to-use",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-30" />
        <meta itemProp="dateModified" content="2026-05-30" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-30">May 30, 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            PNG vs JPG: Which Image Format Should You Use and When?
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Picking the wrong format doesn&apos;t just waste file size — it actively degrades image
            quality in ways that look bad to users. Here&apos;s the decision rule I use, and the one
            exception that catches most developers off guard.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The short answer</h2>
          <p>
            Use <strong>JPG for photographs</strong>. Use <strong>PNG for graphics, logos,
              screenshots, and anything with transparency</strong>.
          </p>
          <p>
            That rule handles 90% of cases correctly. The rest of this post is about why it works,
            what happens when you get it wrong, and the edge cases where the rule breaks down.
          </p>

          <h2>What JPG actually does to your image</h2>
          <p>
            JPG uses lossy compression — it permanently discards visual information to make the file
            smaller. The algorithm exploits the fact that human eyes are less sensitive to fine color
            detail than to brightness differences. So it blurs color slightly, which you barely
            notice in a photograph, and drops that data entirely.
          </p>
          <p>
            The result: a 4 MB photo from your phone might compress to 300 KB as a JPG at quality
            85, with no visible difference when viewed at normal size. That&apos;s why every photo on
            the web is a JPG.
          </p>
          <p>
            The problem is sharp edges. When JPG compresses a graphic with hard borders — text on a
            white background, a logo with crisp lines — those edges become fuzzy. You get a halo of
            compressed artifacts around every sharp transition. On a photograph it&apos;s invisible.
            On a logo it looks terrible.
          </p>

          <h2>What PNG does instead</h2>
          <p>
            PNG uses lossless compression — it makes the file smaller without discarding any
            information. Every pixel in the original is preserved exactly. When you open the file
            and save it again, the pixel values are identical.
          </p>
          <p>
            For graphics with flat colors, solid fills, and sharp edges, PNG compression is
            extremely effective — a logo with a transparent background might be 50 KB as a PNG and
            look perfect. The same logo as a JPG would be smaller but have visible artifacts around
            the text.
          </p>
          <p>
            For photographs, PNG is a disaster. A photo that is 300 KB as a JPG might be 3–5 MB as
            a PNG. The lossless compression doesn&apos;t help much with the complex, noisy pixel
            data in a photograph. You get a huge file with no visible quality improvement.
          </p>

          <h2>The transparency rule</h2>
          <p>
            JPG does not support transparency. If you have an image that needs a transparent
            background — a logo to overlay on a colored header, a product image for an e-commerce
            site, an icon for a UI — it must be a PNG (or WebP).
          </p>
          <p>
            If you save a transparent image as a JPG, the transparent areas become white. You
            then can&apos;t use that image on anything except a white background.
          </p>

          <h2>The exception that catches most developers</h2>
          <p>
            The trap: you have a logo with a transparent background, so you correctly save it as a
            PNG. But then someone places it on a dark blue background and the edges look wrong — a
            faint white halo around the logo. What happened?
          </p>
          <p>
            The logo was previously exported with white background anti-aliasing. The edges of the
            letters were blended with white before the background was made transparent. When placed
            on dark blue, those blended white pixels show up as a halo.
          </p>
          <p>
            The fix: export the original SVG or vector file against a transparent background from
            scratch, or against the target background color. The format was right (PNG); the export
            process was wrong.
          </p>

          <h2>What about WebP?</h2>
          <p>
            WebP is Google&apos;s modern format that is smaller than both PNG and JPG at equivalent
            quality. It supports transparency (like PNG) and lossy compression (like JPG). All
            major browsers support it now.
          </p>
          <p>
            The practical limitation: email clients, many design tools, and older systems don&apos;t
            handle WebP. For the web, WebP is excellent. For anything that goes beyond a browser
            (email, Slack, apps, print), stick with PNG or JPG.
          </p>
          <p>
            You can convert between formats — JPG to WebP, PNG to WebP, and back — using the{" "}
            <Link href="/tools/image-converter">free image converter</Link>.
          </p>

          <h2>Quick decision table</h2>
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Photograph for a website</td><td>JPG</td></tr>
              <tr><td>Logo with transparent background</td><td>PNG</td></tr>
              <tr><td>Screenshot of UI or code</td><td>PNG</td></tr>
              <tr><td>Hero image or background photo</td><td>JPG (or WebP)</td></tr>
              <tr><td>Icon or graphic with flat colors</td><td>PNG (or SVG)</td></tr>
              <tr><td>Product image on white background</td><td>JPG</td></tr>
              <tr><td>Product image with transparent bg</td><td>PNG</td></tr>
              <tr><td>Email attachment (any photo)</td><td>JPG — keep under 1MB</td></tr>
            </tbody>
          </table>

          <h2>File size at a glance</h2>
          <p>
            As a rough benchmark: a 2000×1500 pixel photograph is typically 300–600 KB as JPG at
            quality 85, and 3–8 MB as PNG. A 500×500 pixel logo with transparency is typically
            30–100 KB as PNG, and would be a similar size as JPG but with edge artifacts and no
            transparency.
          </p>
          <p>
            If you need to reduce a JPG&apos;s file size further without switching formats, the{" "}
            <Link href="/tools/image-compressor">free image compressor</Link> lets you
            adjust quality and see the file size result in real time.
          </p>

          <h2>When you receive the wrong format</h2>
          <p>
            If a client sends you a logo as a JPG, don&apos;t just convert it to PNG — the JPG
            artifacts are already baked in. Ask for the original vector (SVG, AI, EPS) or a clean
            PNG export from the source file. Converting a JPG to PNG just gives you a large file
            with the same JPG artifacts preserved losslessly.
          </p>

          <h2>Summary</h2>
          <ul>
            <li><strong>JPG:</strong> photos, backgrounds, anything where transparency is not needed and file size matters</li>
            <li><strong>PNG:</strong> logos, graphics, screenshots, anything with transparency or sharp edges</li>
            <li><strong>WebP:</strong> modern web contexts where you control the environment and need the smallest files</li>
          </ul>
          <p>
            Need to convert between formats?{" "}
            <Link href="/tools/image-converter">Convert JPG to PNG, PNG to WebP</Link>, or any
            other combination free in your browser — no upload required.
          </p>
        </div>
      </article>
    </main>
  )
}
