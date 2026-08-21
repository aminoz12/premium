import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "What Is a QR Code and How Does It Work? (The Non-Technical Explanation)",
  description:
    "What QR codes are, how they store data, why they always have three squares in the corners, and how to create one free with no subscription.",
  path: "/blog/what-is-a-qr-code-how-it-works",
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
            What Is a QR Code and How Does It Work? (The Non-Technical Explanation)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            QR codes are everywhere â€” restaurant menus, product packaging, business cards. Here&apos;s how they actually store and encode information, why they have those three corner squares, and how to make one for free.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What QR stands for</h2>
          <p>
            QR stands for &quot;Quick Response.&quot; QR codes were invented in 1994 by Masahiro Hara at Denso Wave, a subsidiary of Toyota, to track automotive parts during manufacturing. The goal was to read the code faster than a traditional barcode â€” hence &quot;quick response.&quot;
          </p>
          <p>
            The patent was filed but Denso Wave chose not to enforce it, allowing anyone to use the QR code standard freely. This open-access decision is why QR codes became ubiquitous rather than locked to one company&apos;s products.
          </p>

          <h2>How QR codes store information</h2>
          <p>
            A QR code is a two-dimensional matrix of black and white squares (modules). The pattern of dark and light squares encodes data in binary â€” each module represents a bit.
          </p>
          <p>
            The code stores data in several layers:
          </p>
          <ul>
            <li><strong>Data region:</strong> The actual encoded content (URL, text, contact info)</li>
            <li><strong>Error correction bytes:</strong> Redundant data that allows the code to be read even when partially damaged or obscured</li>
            <li><strong>Format information:</strong> Error correction level and mask pattern used in this specific code</li>
            <li><strong>Version information:</strong> Which version of the QR standard is used (versions 1â€“40, determining code size)</li>
          </ul>
          <p>
            A standard QR code (version 1) can store up to 41 characters of text. A version 40 code can store up to 7,089 numeric characters or 4,296 alphanumeric characters. Most URLs fit comfortably in a version 3â€“5 code.
          </p>

          <h2>The three corner squares (finder patterns)</h2>
          <p>
            The three large squares in the corners of every QR code are called <em>finder patterns</em>. They allow scanners to detect the code&apos;s position and orientation regardless of how it&apos;s photographed.
          </p>
          <p>
            A scanner can recognize a QR code upside down, at an angle, or on a curved surface because:
          </p>
          <ol>
            <li>The three finder patterns always appear at the top-left, top-right, and bottom-left corners</li>
            <li>The fourth corner (bottom-right) has a smaller <em>alignment pattern</em> that corrects for perspective distortion</li>
            <li>The ratio of the square&apos;s dark-to-light-to-dark pixel pattern (1:1:3:1:1) is unique â€” nothing else in the code or the surrounding environment will have this ratio</li>
          </ol>
          <p>
            The absence of a fourth corner square tells the scanner which direction is &quot;up&quot; â€” this is how it knows where to start reading the data.
          </p>

          <h2>Error correction levels</h2>
          <p>
            QR codes have four error correction levels that determine how much of the code can be obscured while still scanning:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Level</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Recovery capacity</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">L (Low)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~7% of data</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Clean digital displays, ideal conditions</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">M (Medium)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~15% of data</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Most general-purpose codes</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Q (Quartile)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~25% of data</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Industrial and manufacturing use</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">H (High)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~30% of data</td>
                  <td className="border border-gray-200 p-3 text-gray-600">When adding a logo; outdoor/damaged codes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Higher error correction means the code can survive more damage â€” but also makes the code denser (more modules needed for the same data). If you plan to add a logo in the center of your QR code, use level H â€” it can handle 30% obscuration while still scanning.
          </p>

          <h2>Static vs. dynamic QR codes</h2>
          <p>
            <strong>Static QR codes</strong> encode the URL or data directly in the pattern. The URL is permanent â€” if you need to change it, you need a new QR code. Static codes are free to generate and never expire.
          </p>
          <p>
            <strong>Dynamic QR codes</strong> encode a redirect URL (managed by a QR service) that points to your actual destination. You can change the destination without reprinting. But if you cancel your subscription to the QR service, the redirect breaks and your printed codes stop working.
          </p>
          <p>
            For most use cases â€” restaurant menus, business cards, product pages â€” a static QR code pointing to a URL you control is the better choice. If your URL ever changes, reprinting the QR code is cheap.
          </p>

          <h2>What QR codes can store</h2>
          <ul>
            <li><strong>URLs:</strong> The most common use â€” links to websites, app downloads, payment pages</li>
            <li><strong>Plain text:</strong> Any text string â€” Wi-Fi passwords, meeting notes, instructions</li>
            <li><strong>vCard contact info:</strong> Name, phone, email, address â€” scans directly into phone contacts</li>
            <li><strong>Email address:</strong> Opens a pre-addressed email compose window when scanned</li>
            <li><strong>Phone number:</strong> Taps to call directly</li>
            <li><strong>SMS:</strong> Opens a text message compose window</li>
            <li><strong>Wi-Fi credentials:</strong> Connects the device to a network automatically when scanned</li>
          </ul>

          <h2>Create a QR code for free</h2>
          <p>
            The <Link href="/tools/qr-code-generator">free QR code generator</Link> creates static QR codes for any of the above data types â€” no account, no subscription, no monthly fee, and the codes never expire. Download as PNG (for digital use) or SVG (for print â€” scales to any size without pixelation).
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/qr-code-generator">Free QR Code Generator</Link> â€” create permanent QR codes with no account</li>
            <li><Link href="/tools/url-shortener">Free URL Shortener</Link> â€” shorten long URLs before encoding them in a QR code</li>
          </ul>

          <hr className="my-8" />
          <p className="text-sm text-gray-400">
            Written by <Link href="/about" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Achraf A.</Link>, founder of TheFreeAITools.
          </p>
        </div>
      </article>
    </main>
  )
}
