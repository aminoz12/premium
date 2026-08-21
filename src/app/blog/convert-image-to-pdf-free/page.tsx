import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Convert an Image to PDF for Free (JPG, PNG, WebP)",
  description:
    "Convert any image to PDF in under 30 seconds — free, no account. Here's how to control page size, margins, and what to do when you have multiple images.",
  path: "/blog/convert-image-to-pdf-free",
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
            <span>4 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Convert an Image to PDF for Free (JPG, PNG, WebP)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Need to send a photo or screenshot as a PDF? Here&apos;s how to convert any image to
            PDF in under 30 seconds — free, no account, no file upload required.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Why convert an image to PDF?</h2>
          <p>
            The most common reasons:
          </p>
          <ul>
            <li>A form or submission portal only accepts PDF files</li>
            <li>You need to combine multiple images into a single document</li>
            <li>You scanned a document with your phone and need it in PDF format</li>
            <li>You need to send a screenshot or photo in a professional format</li>
            <li>A service requires a document in A4 or letter page format</li>
          </ul>

          <h2>How to convert JPG/PNG to PDF free</h2>
          <ol>
            <li>
              Open the <Link href="/tools/convert-image-to-pdf">free image to PDF converter</Link>
            </li>
            <li>Upload your image (JPG, PNG, or WebP)</li>
            <li>Select the page size (A4 for international use, Letter for US)</li>
            <li>Choose margin settings if needed</li>
            <li>Click Convert and download your PDF</li>
          </ol>
          <p>
            No account required. Processing is done in your browser — the image is never uploaded.
          </p>

          <h2>Page size guide</h2>
          <table>
            <thead>
              <tr>
                <th>Page size</th>
                <th>Dimensions</th>
                <th>When to use</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>A4</td><td>210 × 297 mm</td><td>International documents, most of Europe and Asia</td></tr>
              <tr><td>Letter</td><td>215.9 × 279.4 mm</td><td>United States and Canada</td></tr>
              <tr><td>Legal</td><td>215.9 × 355.6 mm</td><td>US legal documents</td></tr>
              <tr><td>Fit to image</td><td>Same as image dimensions</td><td>When you want no white borders</td></tr>
            </tbody>
          </table>

          <h2>Tips for the best result</h2>
          <ul>
            <li>
              <strong>Use &quot;Fit to image&quot; for photos:</strong> if the image is a photo
              (not a document scan), fitting the PDF to the image size avoids white borders and
              keeps the aspect ratio natural.
            </li>
            <li>
              <strong>Use A4 or Letter for document scans:</strong> if the image is a scan of a
              page — a receipt, contract, or form — use the matching standard page size so it
              looks like a proper document.
            </li>
            <li>
              <strong>Compress the image first:</strong> if your source image is very large (over
              5MB), <Link href="/tools/image-compressor">compress it first</Link> before
              converting — this keeps the final PDF file size manageable.
            </li>
          </ul>

          <h2>Converting multiple images to a single PDF</h2>
          <p>
            If you have multiple images to combine into one PDF (multiple scanned pages, a photo
            series), most single-image converters require you to convert each separately and then
            merge the PDFs.
          </p>
          <p>
            The fastest workflow for multiple images:
          </p>
          <ol>
            <li>Convert each image to PDF individually</li>
            <li>Merge the resulting PDFs using a PDF merge tool (iLovePDF and PDF24 both offer this free)</li>
          </ol>

          <h2>Alternative: print to PDF from any image viewer</h2>
          <p>
            On any modern operating system, you can right-click any image file and choose
            &quot;Print,&quot; then select &quot;Save as PDF&quot; or &quot;Microsoft Print to PDF&quot;
            (Windows) or &quot;PDF&quot; from the print dialog (Mac). This works without any tool and
            produces a PDF sized to the paper format you select.
          </p>
          <p>
            The limitation: less control over margins and image scaling compared to a dedicated
            converter.
          </p>

          <h2>Summary</h2>
          <p>
            Convert any image to PDF for free using the{" "}
            <Link href="/tools/convert-image-to-pdf">image to PDF converter</Link> — no
            account, no upload. Use A4/Letter for document scans and &quot;fit to image&quot; for photos.
            For multiple images, convert each separately then merge.
          </p>
        </div>
      </article>
    </main>
  )
}
