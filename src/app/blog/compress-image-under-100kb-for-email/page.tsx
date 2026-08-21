import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Compress an Image to Under 100 KB for Email (Without It Looking Terrible)",
  description:
    "Get any photo under 100 KB for email while keeping it sharp: the quality setting that matters, when to switch to WebP, and the resize-first trick most people miss.",
  path: "/blog/compress-image-under-100kb-for-email",
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
            <span>6 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            How to Compress an Image to Under 100 KB for Email (Without It Looking Terrible)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            A 4 MB phone photo bounces off attachment limits and makes your email load slowly inline.
            Here&apos;s how I reliably get an image under 100 KB while keeping it sharp — the one
            setting that actually controls file size, and the resize-first trick most guides skip.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Why 100 KB, and why it&apos;s usually easy</h2>
          <p>
            Under 100 KB is the sweet spot for email: it sends instantly, displays inline without a
            &quot;download&quot; step, and won&apos;t trip spam filters that flag heavy attachments. The
            good news is that a typical 3–4 MB photo can drop to under 100 KB — a 97% reduction —
            usually with no visible difference at the size it&apos;ll actually be viewed.
          </p>
          <p>
            The reason that works: phone cameras produce far more resolution and data than an email
            recipient ever sees. You&apos;re not throwing away quality they&apos;d notice; you&apos;re
            throwing away pixels and precision they were never going to see.
          </p>

          <h2>The resize-first trick (the step most people skip)</h2>
          <p>
            Everyone reaches for the quality slider. But the biggest lever is <strong>dimensions</strong>,
            not quality. A 4032×3024 phone photo has 12 million pixels. For an email, nobody needs more
            than about 1200 px on the long edge. Resizing from 4032 px to 1200 px alone cuts the pixel
            count by ~90% before you touch compression at all.
          </p>
          <p>
            So the order that works: <strong>resize first, then compress.</strong> Use the{" "}
            <Link href="/tools/image-resizer">image resizer</Link> to bring the long edge down to
            1200 px (or 800 px if it&apos;s just a thumbnail), then run it through the{" "}
            <Link href="/tools/image-compressor">image compressor</Link>. After resizing, you&apos;ll
            often be under 100 KB at high quality without compressing aggressively at all.
          </p>

          <h2>The quality setting that matters</h2>
          <p>
            For JPEG, quality <strong>75–80</strong> is the practical floor where compression artifacts
            stay invisible on photographs. Below ~70 you start seeing blocky patches in skies and
            smooth gradients; above ~85 you&apos;re adding file size for quality nobody perceives. Start
            at 80, check the preview, and only drop lower if you&apos;re still over budget.
          </p>

          <h2>When to switch formats</h2>
          <ul>
            <li>
              <strong>Photographs → JPEG or WebP.</strong> WebP gets you ~25–35% smaller files than
              JPEG at the same visible quality. If your recipient&apos;s email client is modern (most
              are in 2026), WebP is the better choice. If you&apos;re unsure, JPEG is the safe
              universal option.
            </li>
            <li>
              <strong>Screenshots, logos, text, line art → PNG.</strong> JPEG mangles sharp edges and
              text into fuzzy artifacts. PNG keeps them crisp. A screenshot compressed as JPEG looks
              noticeably worse; as PNG it stays clean (and often compresses well anyway because of the
              flat color areas).
            </li>
          </ul>
          <p>
            Need to change format? The <Link href="/tools/image-converter">image converter</Link>{" "}
            handles JPEG, PNG, and WebP in either direction.
          </p>

          <h2>A worked example</h2>
          <p>
            Take a 3.8 MB, 4032×3024 JPEG straight off a phone:
          </p>
          <ul>
            <li>Resize the long edge to 1200 px → roughly 350 KB before any compression.</li>
            <li>Compress at JPEG quality 80 → around 80–95 KB.</li>
            <li>Convert to WebP at the same quality instead → around 55–70 KB.</li>
          </ul>
          <p>
            That&apos;s under 100 KB with no visible loss at the size it&apos;s viewed — and it all runs
            in your browser, so the photo never uploads to a server.
          </p>

          <h2>Bottom line</h2>
          <p>
            Resize before you compress, keep JPEG quality around 80, and switch to PNG for anything with
            text or sharp edges. Do that and getting under 100 KB is almost automatic — no app, no
            account, and your image stays on your device the whole time.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/image-compressor">Image Compressor</Link> — reduce file size with a
              live quality preview.
            </li>
            <li>
              <Link href="/tools/image-resizer">Image Resizer</Link> — shrink dimensions before
              compressing.
            </li>
            <li>
              <Link href="/tools/image-converter">Image Converter</Link> — convert between JPEG, PNG,
              and WebP.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — privacy-first, browser-based utilities.
          </p>
        </div>
      </article>
    </main>
  )
}
