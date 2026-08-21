import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Generate a QR Code for a Restaurant Menu (Free, No Subscription)",
  description:
    "Create a QR code for your restaurant menu in under 2 minutes â€” free, no monthly fee, no dynamic QR subscription. The QR code never expires.",
  path: "/blog/how-to-generate-qr-code-restaurant-menu",
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
            How to Generate a QR Code for a Restaurant Menu (Free, No Subscription)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Many QR code services charge monthly fees and threaten to deactivate your codes if you stop paying. Here&apos;s how to create a permanent, free QR code for your restaurant menu that never expires.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Static vs. dynamic QR codes: what restaurants actually need</h2>
          <p>
            The QR code industry has created a distinction between &quot;static&quot; and &quot;dynamic&quot; QR codes to justify subscription pricing. Here&apos;s the actual difference:
          </p>
          <ul>
            <li><strong>Static QR code:</strong> The URL is encoded directly in the QR pattern. The code points to one specific URL â€” forever, for free. If you need to change the URL, you generate a new QR code and reprint.</li>
            <li><strong>Dynamic QR code:</strong> The code points to a redirect URL owned by the QR service. You can change the destination URL without reprinting. But if you cancel your subscription, the codes stop working.</li>
          </ul>
          <p>
            For a restaurant menu, dynamic QR codes are almost never necessary. Here&apos;s why:
          </p>
          <p>
            If your menu is a PDF, you upload the PDF to your website or Google Drive once and get a permanent URL. That URL goes in the QR code. If your menu changes, you replace the PDF at the same URL â€” the QR code still works. If you need a new URL (because you moved to a different hosting), you reprint the QR code, which costs pennies at a print shop. The $20/month &quot;dynamic QR&quot; subscription is not solving a real problem for most restaurants.
          </p>

          <h2>Step 1: Host your menu somewhere permanent</h2>
          <p>
            The QR code needs to point to a URL. Your menu options:
          </p>
          <ul>
            <li><strong>Google Drive PDF:</strong> Upload your menu PDF to Google Drive â†’ right-click â†’ Get link â†’ change sharing to &quot;Anyone with the link can view.&quot; Copy the link. This is free and permanent as long as you keep the Google account.</li>
            <li><strong>Your restaurant website:</strong> Upload the menu PDF to your website (WordPress, Squarespace, Wix) and get the direct URL. Best option if you have a site â€” keeps everything under your control.</li>
            <li><strong>Dropbox or OneDrive:</strong> Same approach as Google Drive. Create a public share link. Both are free for basic storage.</li>
            <li><strong>A dedicated menu URL:</strong> If you use a restaurant platform like Toast or Square, they generate a menu URL automatically. Use that.</li>
          </ul>
          <p>
            Do not use a URL shortener for the QR code destination â€” if the shortener service shuts down or you stop paying, your QR codes become dead links. Use the direct URL to your file or page.
          </p>

          <h2>Step 2: Generate the QR code</h2>
          <p>
            Use the <Link href="/tools/qr-code-generator">free QR code generator</Link> â€” no account, no subscription, no monthly fee. The code is generated in your browser and the URL is encoded directly into the QR pattern (static QR code). It never expires.
          </p>
          <ol>
            <li>Paste your menu URL into the QR code generator</li>
            <li>Set error correction to <strong>High (H)</strong> â€” this allows up to 30% of the code to be obscured while still scanning. Restaurant environments have variable lighting and sometimes the code gets smudged or covered by a sticker or logo.</li>
            <li>Set the size to at least 300Ã—300 pixels for display â€” or use the SVG download for print (SVG scales to any size without pixelation)</li>
            <li>Download as PNG for digital use, SVG for print</li>
          </ol>

          <h2>Step 3: Print and placement</h2>
          <p>
            Minimum print size for reliable scanning: <strong>2.5 cm Ã— 2.5 cm (about 1 inch)</strong>. Smaller codes work in ideal lighting conditions, but in a dim restaurant with a customer holding a phone at arm&apos;s length, a larger code scans more reliably.
          </p>
          <p>
            Recommended print sizes by placement:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Placement</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Recommended size</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Table tent / card</td>
                  <td className="border border-gray-200 p-3 text-gray-600">4â€“6 cm</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Customers scan from ~30 cm distance</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Sticker on table</td>
                  <td className="border border-gray-200 p-3 text-gray-600">5â€“8 cm</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Allow for laminate thickness</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Window / door sign</td>
                  <td className="border border-gray-200 p-3 text-gray-600">10â€“15 cm</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Customers scan from 50â€“80 cm</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Poster / menu board</td>
                  <td className="border border-gray-200 p-3 text-gray-600">15â€“20 cm</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Viewed from 1â€“2 meters</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Always include a short instruction near the code: &quot;Scan for menu&quot; or &quot;Scan with your phone camera.&quot; Most modern smartphones (iOS 11+ and Android 8+) scan QR codes directly from the camera app without needing a separate QR app â€” but some customers don&apos;t know this.
          </p>

          <h2>What if your menu URL changes?</h2>
          <p>
            If you move your menu to a new URL (new website, new Google Drive account), you have two options:
          </p>
          <ol>
            <li><strong>Generate a new QR code and reprint.</strong> Most print shops charge pennies per sticker or table card. This is the simplest approach for small changes.</li>
            <li><strong>Set up a redirect at your domain.</strong> If you have a website, set up a short redirect URL like <code>yourrestaurant.com/menu</code> that redirects to wherever your menu lives. Point the QR code to that redirect URL. Now you can change the underlying menu URL anytime by updating the redirect â€” no reprinting needed. This is the &quot;dynamic QR&quot; benefit, but done yourself for free.</li>
          </ol>

          <h2>Adding a logo to the QR code</h2>
          <p>
            QR codes with &quot;High&quot; error correction can have up to 30% of the pattern obscured and still scan correctly. This means you can overlay your restaurant logo in the center of the code.
          </p>
          <p>
            To do this: download the QR code as SVG, open it in Canva or Figma, and place a small (under 20% of the code area) version of your logo in the center. Test the final design with 3â€“4 different phone models before printing â€” some logo placements interfere with the finder patterns (the three corner squares) and prevent scanning.
          </p>

          <h2>Testing before you print</h2>
          <p>
            Before printing 50 table cards, test the QR code on:
          </p>
          <ul>
            <li>An iPhone (using the built-in Camera app)</li>
            <li>An Android phone (using Google Lens or the Camera app)</li>
            <li>In low light (simulate dim restaurant conditions)</li>
            <li>At the distance customers will actually scan from</li>
          </ul>
          <p>
            If it doesn&apos;t scan reliably in any of these conditions, increase the print size or regenerate with a higher error correction level.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/qr-code-generator">Free QR Code Generator</Link> â€” create static QR codes that never expire, no account needed</li>
            <li><Link href="/tools/url-shortener">Free URL Shortener</Link> â€” create a short redirect URL to use as the QR code destination</li>
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
