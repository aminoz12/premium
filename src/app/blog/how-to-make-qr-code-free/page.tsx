import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Make a QR Code for Free (That Never Expires)",
  description:
    "Generate a permanent QR code free â€” no account, no subscription to keep it active. Plus the size and error correction settings that actually scan reliably.",
  path: "/blog/how-to-make-qr-code-free",
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
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-06-02">June 2, 2026</time>
            <span>Â·</span>
            <span>5 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Make a QR Code for Free (That Never Expires)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Most QR code services make codes that expire when you stop paying. Here&apos;s how to
            generate a permanent one free in under 60 seconds â€” and what settings actually matter
            for reliable scanning.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Static vs dynamic QR codes â€” and why most free ones expire</h2>
          <p>
            A <strong>static QR code</strong> encodes the destination URL directly into the code.
            It points to exactly one address, cannot be changed, but never expires â€” because
            there&apos;s no service maintaining it. It will scan correctly as long as the URL it
            points to is live.
          </p>
          <p>
            A <strong>dynamic QR code</strong> encodes a short URL owned by the QR service.
            That short URL redirects to your destination. This lets you change the destination
            without reprinting the code â€” but it requires the QR service&apos;s servers to keep
            running. When you stop paying, the service kills the redirect and the code stops working.
          </p>
          <p>
            For most use cases â€” business cards, menus, flyers, packaging â€” a static code pointing
            directly to your URL is the right choice. It is permanent, free, and requires no
            subscription.
          </p>

          <h2>How to generate a free permanent QR code</h2>
          <ol>
            <li>
              Open the <Link href="/tools/qr-code-generator">free QR code generator</Link>
            </li>
            <li>Paste your URL or enter the text you want encoded</li>
            <li>Choose error correction level (more on this below)</li>
            <li>Download the QR code as PNG or SVG</li>
            <li>Test it by scanning with your phone before using it anywhere</li>
          </ol>
          <p>
            No account required. The code is generated in your browser and downloaded directly â€”
            no data is sent to any server.
          </p>

          <h2>The error correction setting that most people ignore</h2>
          <p>
            QR codes have a built-in redundancy system that lets them scan even when part of the
            code is damaged or covered. There are four levels:
          </p>
          <ul>
            <li><strong>L (7%):</strong> smallest file, least redundancy â€” use only for ideal print conditions</li>
            <li><strong>M (15%):</strong> good for most uses â€” standard choice</li>
            <li><strong>Q (25%):</strong> useful if the code might get dirty or partially worn</li>
            <li><strong>H (30%):</strong> required if you plan to put a logo in the center of the QR code</li>
          </ul>
          <p>
            Higher error correction means the QR code is slightly denser (more squares) and slightly
            larger. For print materials, use H if you are adding a logo. Use M for everything else.
          </p>

          <h2>Minimum size for reliable scanning</h2>
          <p>
            The most common QR code failure is making it too small. The minimum reliable size depends
            on scanning distance:
          </p>
          <ul>
            <li><strong>Business card (held in hand):</strong> minimum 2 cm Ã— 2 cm (about 0.8 in)</li>
            <li><strong>Flyer or poster (read at arm&apos;s length):</strong> minimum 3â€“4 cm</li>
            <li><strong>Signage (read from 1â€“3 meters):</strong> scale up proportionally â€” roughly 1 cm per 10 cm of reading distance</li>
            <li><strong>Outdoor (read from a car or across a room):</strong> 15 cm+ minimum</li>
          </ul>
          <p>
            Download the SVG version for print â€” it scales to any size without pixelation.
            PNG is fine for digital use on screens.
          </p>

          <h2>What URL to point your QR code to</h2>
          <p>
            Since a static QR code cannot be changed after printing, the URL choice matters.
            Best practices:
          </p>
          <ul>
            <li>
              <strong>Point to a URL you own and control.</strong> If you point to your Facebook
              page and Facebook changes the URL structure, your QR code breaks. Point to
              yourbusiness.com instead, and redirect from there.
            </li>
            <li>
              <strong>Use a short URL.</strong> Shorter URLs produce simpler QR codes with fewer
              squares â€” easier to scan and can be printed smaller. You can shorten any URL with the{" "}
              <Link href="/tools/url-shortener">free URL shortener</Link> first.
            </li>
            <li>
              <strong>Use HTTPS.</strong> Some QR scanners warn users before opening HTTP links.
              Ensure your destination uses a valid SSL certificate.
            </li>
          </ul>

          <h2>Adding a logo to your QR code</h2>
          <p>
            You can overlay a logo in the center of a QR code. The rule: keep the logo under 25%
            of the total code area. Above that, you exceed the error correction budget and the code
            stops scanning.
          </p>
          <p>
            To do this after generating the code: download the SVG, open it in any vector editor
            (Figma, Inkscape, Illustrator), place your logo image in the center, and export the
            final combined image. Always test the final version before printing.
          </p>

          <h2>Summary</h2>
          <p>
            Generate a permanent, free QR code using the{" "}
            <Link href="/tools/qr-code-generator">QR code generator</Link> â€” no account,
            no expiry. Use static codes for anything printed. Use H error correction if you&apos;re
            adding a logo. Download SVG for print. Test before printing.
          </p>
        </div>
      </article>
    </main>
  )
}
