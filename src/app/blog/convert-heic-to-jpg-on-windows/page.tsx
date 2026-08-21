import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Convert HEIC to JPG on Windows (Free, 3 Methods)",
  description:
    "Convert iPhone HEIC photos to JPG on Windows â€” three free methods compared. No app purchase needed. Works on Windows 10 and Windows 11.",
  path: "/blog/convert-heic-to-jpg-on-windows",
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
            <span>6 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            How to Convert HEIC to JPG on Windows (Free, 3 Methods)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Windows can&apos;t open HEIC files without a codec â€” and the Microsoft Store version costs money in some regions. Here are three completely free methods that work on Windows 10 and 11.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Why Windows can&apos;t open HEIC files by default</h2>
          <p>
            HEIC (High Efficiency Image Container) is Apple&apos;s default photo format since iOS 11. It uses the HEVC (H.265) codec, which requires a license to decode. Windows doesn&apos;t include this codec by default because of licensing costs. The Photos app on Windows will show a blank thumbnail or an error when you try to open a HEIC file.
          </p>
          <p>
            Apple intentionally converts HEIC to JPEG when you AirDrop or cable-transfer photos to a non-Apple device in most cases â€” but this doesn&apos;t always work, especially when emailing or uploading directly from iCloud, or when using certain third-party apps to transfer files.
          </p>

          <h2>Method 1: Free online converter (fastest, no installation)</h2>
          <p>
            The quickest option is a browser-based converter â€” no installation, no purchase, works on any Windows version.
          </p>
          <ol>
            <li>Open the <Link href="/tools/image-converter">free image converter</Link> in any browser on your Windows PC</li>
            <li>Click &quot;Upload&quot; and select your .heic file</li>
            <li>Select &quot;JPEG&quot; as the output format</li>
            <li>Set quality to 85% (preserves quality, produces a reasonable file size)</li>
            <li>Click &quot;Convert&quot; and download the .jpg file</li>
          </ol>
          <p>
            The conversion happens in your browser â€” the file is not uploaded to any server. This method works for individual conversions or small batches. For large batches (100+ photos), Method 3 (command-line) is faster.
          </p>

          <h2>Method 2: Microsoft HEIF Image Extensions (built-in codec)</h2>
          <p>
            Microsoft offers a free HEIF codec on the Microsoft Store that lets the Windows Photos app open HEIC files natively. After installing it, you can open HEIC files in Photos and &quot;Save as&quot; JPEG without any additional software.
          </p>
          <ol>
            <li>Open the Microsoft Store (search &quot;Microsoft Store&quot; in the Start menu)</li>
            <li>Search for &quot;HEIF Image Extensions&quot;</li>
            <li>Install it (it&apos;s free â€” if your region shows a price, see note below)</li>
            <li>After installation, HEIC files open normally in Photos</li>
            <li>To convert: open the HEIC in Photos â†’ click the three-dot menu â†’ &quot;Save as&quot; â†’ choose JPEG</li>
          </ol>
          <p>
            <strong>Note on pricing:</strong> In some regions, Microsoft charges a small fee for the HEVC Video Extensions (a separate codec). The &quot;HEIF Image Extensions&quot; for photos is free â€” make sure you&apos;re installing that one, not the video codec. If it shows a price, use Method 1 or 3 instead.
          </p>

          <h2>Method 3: IrfanView (free app, batch conversion)</h2>
          <p>
            IrfanView is a free, lightweight image viewer that has supported HEIC files through its plugin since 2022. It&apos;s the best option for batch converting multiple HEIC files at once.
          </p>
          <ol>
            <li>Download IrfanView from irfanview.com (the main app is free, no Microsoft Store required)</li>
            <li>Also download the &quot;All Plugins&quot; package from the same page and install it â€” this includes the HEIC plugin</li>
            <li>For batch conversion: open IrfanView â†’ File â†’ Batch Conversion/Rename</li>
            <li>Add your HEIC files to the batch list</li>
            <li>Set output format to JPEG, set quality to 85â€“90</li>
            <li>Set the output folder and click &quot;Start Batch&quot;</li>
          </ol>
          <p>
            IrfanView can process hundreds of files in minutes. It&apos;s the right tool when you transfer a large photo collection from an iPhone and need to convert all of them.
          </p>

          <h2>Comparison of methods</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Method</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Installation</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Batch support</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Online converter</td>
                  <td className="border border-gray-200 p-3 text-gray-600">None</td>
                  <td className="border border-gray-200 p-3 text-gray-600">1 at a time</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Quick one-off conversions</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">HEIF Image Extensions</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Microsoft Store</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Limited (save-as)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Ongoing native support</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">IrfanView</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Download + plugin</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Excellent (hundreds of files)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Bulk conversion</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>How to stop your iPhone from saving photos as HEIC</h2>
          <p>
            If you regularly transfer photos to a Windows PC, the simplest fix is to change your iPhone to save photos as JPEG in the first place:
          </p>
          <ol>
            <li>Open Settings on your iPhone</li>
            <li>Scroll to Camera â†’ Formats</li>
            <li>Select &quot;Most Compatible&quot; (instead of &quot;High Efficiency&quot;)</li>
          </ol>
          <p>
            This saves new photos as JPEG. Note: it uses about twice the storage space per photo. Existing HEIC photos in your camera roll are not converted retroactively â€” only new photos are saved as JPEG going forward.
          </p>
          <p>
            Alternatively, when connecting your iPhone to a Windows PC via cable, go to your iPhone&apos;s Photos settings and ensure &quot;Transfer to Mac or PC&quot; is set to &quot;Automatic&quot; â€” this converts HEIC to JPEG automatically during the cable transfer.
          </p>

          <h2>Quality considerations when converting</h2>
          <p>
            HEIC at full quality and JPEG at 85% quality are visually indistinguishable on screen. HEIC is technically capable of storing more color depth and HDR information, but this advantage is invisible on most monitors and completely invisible after Instagram, WhatsApp, or any social platform re-compresses the image.
          </p>
          <p>
            For printing: if you&apos;re converting iPhone photos for a print lab, use JPEG quality 95â€“100 to preserve maximum information. The file will be larger but print labs work from the full file, not a screen preview.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/image-converter">Free Image Converter</Link> â€” convert HEIC to JPG (and other formats) in your browser</li>
            <li><Link href="/tools/image-compressor">Free Image Compressor</Link> â€” compress the resulting JPEG for web or email use</li>
          </ul>

          <hr className="my-8" />
          <p className="text-sm text-gray-400">
            Written by <Link href="/about" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Achraf A.</Link>, founder of TheFreeAITools. Tested on Windows 10 (22H2) and Windows 11 (23H2).
          </p>
        </div>
      </article>
    </main>
  )
}
