import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Convert PDF to JPG for Free (Every Page as a Separate Image)",
  description:
    "Extract every PDF page as a JPG image free in your browser â€” useful for thumbnails, presentations, and email. No account, no server upload.",
  path: "/blog/how-to-convert-pdf-to-jpg-free",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 text-black dark:text-white">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-06-02" />
        <meta itemProp="dateModified" content="2026-06-02" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60 ">
            <time dateTime="2026-06-02">June 2, 2026</time>
            <span>Â·</span>
            <span>4 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black dark:text-white underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white sm:text-4xl" itemProp="headline">
            How to Convert PDF to JPG for Free (Every Page as a Separate Image)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60 dark:text-white/60">
            Converting a PDF to images is useful for sharing slides, creating thumbnails, or embedding
            content in presentations. Here&apos;s how to do it free â€” and what resolution settings
            to use for different purposes.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Why convert PDF to JPG?</h2>
          <ul>
            <li>Share a specific document page as an image in a chat or email</li>
            <li>Create a thumbnail or preview image for a PDF file</li>
            <li>Import PDF content into a presentation tool that doesn&apos;t accept PDFs</li>
            <li>Upload a page from a PDF to social media or a form that only accepts images</li>
            <li>Display a PDF page as a static image on a website without a PDF viewer</li>
          </ul>

          <h2>How to convert PDF to JPG free</h2>
          <ol>
            <li>
              Open the <Link href="/tools/convert-pdf-to-image">free PDF to image converter</Link>
            </li>
            <li>Upload your PDF file</li>
            <li>Select JPG (or PNG for higher quality)</li>
            <li>Choose the resolution / DPI setting</li>
            <li>Download â€” each page is exported as a separate image file</li>
          </ol>
          <p>
            No account required. Processing happens locally in your browser â€” the PDF is never
            uploaded to any external server.
          </p>

          <h2>Which format to choose: JPG vs PNG</h2>
          <ul>
            <li>
              <strong>JPG:</strong> smaller file size â€” good for sharing, email, web display. Some
              compression artifacts on text-heavy pages at lower quality settings.
            </li>
            <li>
              <strong>PNG:</strong> lossless â€” larger files but perfect quality. Use for documents
              with text, technical diagrams, or any content where sharpness matters.
            </li>
          </ul>
          <p>
            For screenshot-style sharing of a PDF page: PNG. For photo-heavy PDFs or web thumbnails: JPG.
          </p>

          <h2>DPI / resolution guide</h2>
          <table>
            <thead>
              <tr><th>DPI</th><th>Use case</th><th>Approximate pixel size (A4 page)</th></tr>
            </thead>
            <tbody>
              <tr><td>72 DPI</td><td>Web thumbnails, previews</td><td>~595 Ã— 842 px</td></tr>
              <tr><td>150 DPI</td><td>Screen viewing, presentations</td><td>~1240 Ã— 1754 px</td></tr>
              <tr><td>300 DPI</td><td>Print quality, archiving</td><td>~2480 Ã— 3508 px</td></tr>
            </tbody>
          </table>
          <p>
            For most screen uses, 150 DPI produces sharp, readable images without unnecessarily
            large file sizes. Only use 300 DPI if the images will be printed.
          </p>

          <h2>Converting multiple pages</h2>
          <p>
            A multi-page PDF produces one image per page. Most converters produce a ZIP file
            containing all page images when you upload a multi-page PDF. Check your downloads
            folder for a zip archive if you don&apos;t see individual files.
          </p>

          <h2>Alternative: screenshot method</h2>
          <p>
            For a single page, the fastest method on any device:
          </p>
          <ol>
            <li>Open the PDF in your browser or any PDF viewer</li>
            <li>Zoom to the page you want</li>
            <li>Take a screenshot</li>
            <li>Crop to the page boundaries</li>
          </ol>
          <p>
            This is quick for one page but impractical for multi-page documents and produces
            lower resolution than a dedicated converter.
          </p>

          <h2>Going the other direction: image to PDF</h2>
          <p>
            To go the other way â€” converting a JPG or PNG to PDF â€” use the{" "}
            <Link href="/tools/convert-image-to-pdf">free image to PDF converter</Link>.
            Useful when you need to send an image as a PDF document for submission.
          </p>

          <h2>Summary</h2>
          <p>
            Convert PDF to JPG free with the{" "}
            <Link href="/tools/convert-pdf-to-image">PDF to image converter</Link> â€” no
            account, no upload. Use PNG for text-heavy documents, JPG for photos and thumbnails.
            150 DPI is the right setting for screen viewing; 300 DPI for print. Each page
            becomes a separate image file.
          </p>
        </div>
      </article>
    </main>
  )
}
