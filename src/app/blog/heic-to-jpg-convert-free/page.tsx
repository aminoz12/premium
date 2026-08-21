import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Convert HEIC to JPG for Free (iPhone Photos on Windows and Web)",
  description:
    "iPhone photos save as HEIC by default, which Windows and most websites don't support. Here's how to convert HEIC to JPG in seconds â€” free, no app needed.",
  path: "/blog/heic-to-jpg-convert-free",
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
            <span>4 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Convert HEIC to JPG for Free (iPhone Photos on Windows and Web)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Since iOS 11, iPhones save photos in HEIC format by default. It&apos;s more efficient
            than JPG â€” but most of the world doesn&apos;t support it yet. Here&apos;s how to convert.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Why HEIC causes problems</h2>
          <p>
            HEIC (High Efficiency Image Container) is Apple&apos;s format based on the HEVC codec.
            It produces files roughly 50% smaller than JPEG at equivalent quality â€” a significant
            advantage on phones with limited storage.
          </p>
          <p>
            The problem: HEIC is not universally supported. Platforms that commonly reject or
            mishandle HEIC:
          </p>
          <ul>
            <li>Windows (without the HEVC codec extension installed)</li>
            <li>Many website upload fields and CMS platforms</li>
            <li>Most Android phones</li>
            <li>Email attachments opened in Outlook and Gmail on non-Apple devices</li>
            <li>Many social media platforms (they convert it server-side, but not always correctly)</li>
            <li>Design tools not updated to handle HEIC</li>
          </ul>

          <h2>Method 1: Convert in your browser (no download)</h2>
          <p>
            Use the <Link href="/tools/image-converter">free image converter</Link> â€”
            upload your HEIC file and select JPG as the output. No account, no app download,
            no file upload to external servers. Processing runs locally in your browser.
          </p>
          <p>
            Note: HEIC support in browsers depends on your operating system. Chrome on Mac
            handles HEIC natively. Chrome on Windows may require the Microsoft HEVC extension
            (available free from the Microsoft Store) for browser-based conversion to work.
          </p>

          <h2>Method 2: Stop your iPhone saving as HEIC</h2>
          <p>
            The best long-term solution is to make your iPhone save in JPG from the start:
          </p>
          <ol>
            <li>Settings â†’ Camera</li>
            <li>Formats</li>
            <li>Select <strong>Most Compatible</strong> (saves as JPEG and H.264)</li>
          </ol>
          <p>
            This increases file size but eliminates the compatibility problem entirely. Future
            photos are saved as standard JPG.
          </p>

          <h2>Method 3: Transfer as JPG from iPhone</h2>
          <p>
            When transferring photos from iPhone to Windows via USB, you can configure automatic
            conversion:
          </p>
          <ol>
            <li>Settings â†’ Photos</li>
            <li>Scroll to &quot;Transfer to Mac or PC&quot;</li>
            <li>Select <strong>Automatic</strong> â€” photos convert to JPG during transfer to Windows</li>
          </ol>
          <p>
            Photos remain as HEIC on the iPhone (saving storage) but transfer as JPG to Windows.
          </p>

          <h2>Method 4: iCloud.com download</h2>
          <p>
            If your photos are in iCloud:
          </p>
          <ol>
            <li>Go to icloud.com/photos in a browser</li>
            <li>Select the photos</li>
            <li>Download â€” iCloud automatically converts HEIC to JPG for browser downloads</li>
          </ol>

          <h2>Quality loss when converting HEIC to JPG</h2>
          <p>
            HEIC is a more efficient codec than JPEG â€” at the same visual quality, HEIC is roughly
            50% smaller. Converting to JPEG increases file size and, at low quality settings,
            introduces some compression artifacts.
          </p>
          <p>
            At quality 85â€“90%, the JPG output is visually indistinguishable from the HEIC original
            for most photos. Use the quality slider in the image converter to balance file size
            and quality for your use case.
          </p>

          <h2>Summary</h2>
          <p>
            For one-off conversions: use the{" "}
            <Link href="/tools/image-converter">free image converter</Link>. For preventing
            the problem: switch iPhone Camera settings to &quot;Most Compatible&quot; or configure
            &quot;Automatic&quot; transfer conversion. For iCloud photos: download via icloud.com.
          </p>
        </div>
      </article>
    </main>
  )
}
