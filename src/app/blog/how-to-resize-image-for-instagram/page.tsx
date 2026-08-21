import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Resize an Image for Instagram (All Formats, 2026)",
  description:
    "Exact Instagram image dimensions for feed posts, Reels, and Stories. Resize free in your browser â€” no app, no account, no watermark.",
  path: "/blog/how-to-resize-image-for-instagram",
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
            <span>5 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            How to Resize an Image for Instagram (All Formats, 2026)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Instagram crops images that aren&apos;t the right ratio â€” cutting off your subject or adding ugly white bars. Here are the exact dimensions for every format and how to resize free before you upload.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Instagram image dimensions: the complete reference</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Format</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Recommended size</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Aspect ratio</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Feed â€” Square</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1080 Ã— 1080 px</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Classic, works for everything</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Feed â€” Portrait</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1080 Ã— 1350 px</td>
                  <td className="border border-gray-200 p-3 text-gray-600">4:5</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Most screen space in feed</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Feed â€” Landscape</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1080 Ã— 566 px</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1.91:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Least feed space, panoramic</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Stories</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1080 Ã— 1920 px</td>
                  <td className="border border-gray-200 p-3 text-gray-600">9:16</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Full screen vertical</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Reels (vertical)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1080 Ã— 1920 px</td>
                  <td className="border border-gray-200 p-3 text-gray-600">9:16</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Same as Stories</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Profile photo</td>
                  <td className="border border-gray-200 p-3 text-gray-600">320 Ã— 320 px</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Displayed as circle at 110px</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Carousel cards</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1080 Ã— 1080 px</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1:1</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Use consistent ratio across all cards</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Which format gets the most engagement?</h2>
          <p>
            Portrait (4:5, 1080Ã—1350px) consistently outperforms other formats in feed engagement for most account types. The reason is physical: a portrait image takes up more vertical space in the scroll, which means it occupies the screen longer. Users spend more time looking at it â€” which the algorithm interprets as engagement.
          </p>
          <p>
            The trade-off: portrait format isn&apos;t right for every image. Landscape photography, group shots, and architectural photos look awkward cropped to 4:5. Use the format that fits the content, not just the one with the highest average engagement.
          </p>
          <p>
            Stories and Reels are full-screen (9:16). If you&apos;re repurposing a feed image as a Story, you&apos;ll have significant empty space at the top and bottom â€” typically filled with a blurred background of the image itself, which you can do in Instagram&apos;s story editor.
          </p>

          <h2>How to resize an image for Instagram free</h2>
          <p>
            Use the <Link href="/tools/image-resizer">free image resizer</Link> â€” browser-based, no account, no watermark.
          </p>
          <ol>
            <li>Upload your image (JPEG, PNG, or WebP)</li>
            <li>Enter the target dimensions from the table above (e.g., 1080 Ã— 1350 for portrait feed)</li>
            <li>If maintaining aspect ratio would distort the image, disable &quot;Maintain aspect ratio&quot; and use canvas fill or crop to fit the target size</li>
            <li>Download as JPEG (recommended â€” Instagram recompresses all images anyway, and JPEG produces smaller files)</li>
          </ol>

          <h2>The hidden quality problem: Instagram&apos;s re-compression</h2>
          <p>
            Instagram recompresses every uploaded image. If you upload a correctly-sized image, Instagram&apos;s compression has less work to do and produces a better result. If you upload an oversized image (e.g., 4000Ã—5000px), Instagram scales it down and compresses it more aggressively â€” resulting in a lower-quality final image.
          </p>
          <p>
            Best practice: resize to exactly 1080px wide (the display width) before uploading. Instagram won&apos;t upscale or downscale, and the compression step is minimal. A JPEG at 1080Ã—1350px uploaded at 80% quality will survive Instagram&apos;s recompression in noticeably better shape than the same image uploaded at 4000Ã—5000px.
          </p>

          <h2>Recommended file format for Instagram</h2>
          <p>
            Instagram accepts JPEG, PNG, and (for some formats) HEIC. JPEG is recommended for photographs â€” it&apos;s what Instagram expects and produces the smallest files. PNG is appropriate for graphics, screenshots, and images with text overlays where sharpness at edges matters.
          </p>
          <p>
            Instagram converts PNG to JPEG during processing anyway, so uploading as JPEG from the start gives you more control over the starting quality. Use the <Link href="/tools/image-converter">image converter</Link> to convert PNG to JPEG before uploading if your source is a PNG photograph.
          </p>

          <h2>Common mistakes and how to avoid them</h2>
          <ul>
            <li><strong>Uploading raw camera files without resizing.</strong> A 6000Ã—4000px raw export will be scaled down and compressed more aggressively. Always resize to 1080px wide first.</li>
            <li><strong>Using PNG for photographs.</strong> PNG files for photos are typically 3â€“5Ã— larger than JPEG at equivalent visual quality. Instagram recompresses them more heavily as a result.</li>
            <li><strong>Not accounting for the safe zone in Stories.</strong> For Stories with text or key visual elements, keep them within the center safe zone (1080Ã—1420px, centered) â€” the top and bottom 250px are covered by the UI (story progress bar, username, and swipe-up area).</li>
            <li><strong>Using the wrong ratio for carousel.</strong> Carousel images must all be the same ratio â€” if the first image is square, the rest must be square. Mixed ratios cause Instagram to crop to the most restrictive ratio.</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/image-resizer">Free Image Resizer</Link> â€” resize to exact Instagram dimensions</li>
            <li><Link href="/tools/image-compressor">Free Image Compressor</Link> â€” compress before upload for best Instagram recompression results</li>
            <li><Link href="/tools/image-converter">Free Image Converter</Link> â€” convert PNG to JPEG for feed posts</li>
          </ul>

          <hr className="my-8" />
          <p className="text-sm text-gray-400">
            Written by <Link href="/about" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Achraf A.</Link>, founder of TheFreeAITools. Dimensions verified against Instagram&apos;s technical specifications, June 2026.
          </p>
        </div>
      </article>
    </main>
  )
}
