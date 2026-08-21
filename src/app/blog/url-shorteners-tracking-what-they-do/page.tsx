import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "URL Shorteners: What They Actually Track and When to Use Your Own",
  description:
    "Short links look clean, but they're also tracking infrastructure. Here's what click data gets collected, which use cases justify third-party shorteners, and when you should run your own to protect your audience.",
  path: "/blog/url-shorteners-tracking-what-they-do",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-04-25" />
        <meta itemProp="dateModified" content="2026-04-25" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-04-25">April 25, 2026</time>
            <span>·</span>
            <span>7 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            URL Shorteners: What They Actually Track and When to Use Your Own
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Short links look clean and perform well in print and social media. They&apos;re also
            tracking infrastructure that routes your audience through a third party&apos;s servers.
            Here&apos;s what gets collected, what happens when the service goes down, and when you
            should run your own.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What happens when someone clicks a short link</h2>
          <p>
            When a user clicks <code>bit.ly/abc123</code>, the sequence is:
          </p>
          <ol>
            <li>The browser sends a GET request to <code>bit.ly</code>.</li>
            <li>Bitly&apos;s server logs: the IP address, timestamp, User-Agent (browser/device), referrer URL, and country/city from IP geolocation.</li>
            <li>Bitly sends a 301 or 302 redirect to the destination URL.</li>
            <li>The browser follows the redirect to the destination.</li>
          </ol>
          <p>
            Step 2 is the tracking step. Before your audience reaches your content, they&apos;ve passed
            through a server that logged their device, location, and timestamp. For most marketing
            use cases this is the intended behavior — that&apos;s how you get click analytics. But it&apos;s
            worth being explicit about what&apos;s happening and who holds that data.
          </p>

          <h2>What major shorteners collect</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Data point</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Bitly (free)</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">TinyURL</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Custom domain</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Click timestamp</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes (paid only)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">You control</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">IP address</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes (hashed)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes</td>
                  <td className="border border-gray-200 p-3 text-gray-600">You control</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Country/city</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes (paid)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">You control</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Device/browser</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes</td>
                  <td className="border border-gray-200 p-3 text-gray-600">No</td>
                  <td className="border border-gray-200 p-3 text-gray-600">You control</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Referrer URL</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Yes</td>
                  <td className="border border-gray-200 p-3 text-gray-600">No</td>
                  <td className="border border-gray-200 p-3 text-gray-600">You control</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Data shared with advertisers</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Per privacy policy</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Per privacy policy</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Nobody</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>The 301 vs 302 redirect distinction</h2>
          <p>
            Most URL shorteners use 301 (Permanent) redirects. Browsers cache 301 redirects —
            after the first click, subsequent visits to the short URL go directly to the destination
            from the browser cache, bypassing the shortener&apos;s tracking entirely. This is good for
            your audience&apos;s privacy (faster, no tracking) but means your analytics will undercount
            repeat visitors.
          </p>
          <p>
            Services that need accurate click counts (marketing tools, A/B testing) use 302
            (Temporary) redirects. These are not cached. Every click goes through the server.
            This is why professional marketing shorteners specifically use 302 — accurate counts
            at the cost of a small speed penalty.
          </p>
          <p>
            The{" "}
            <Link href="/tools/url-shortener">URL shortener on this site</Link> uses 301 redirects
            because the primary use case is generating clean short URLs, not tracking clicks.
            If you need click tracking with analytics, use a marketing-focused service (Bitly Pro,
            Rebrandly, or your own redirect infrastructure with logging).
          </p>

          <h2>The link rot problem</h2>
          <p>
            URL shorteners create dependency. Your audience&apos;s ability to reach your content
            depends on the shortener staying operational. Link rot from shortener shutdowns is
            real:
          </p>
          <ul>
            <li>Google URL Shortener (goo.gl) was shut down in March 2019. All links broke.</li>
            <li>Vine&apos;s URL shortener went dark with the service.</li>
            <li>
              Several smaller services have gone offline without notice, breaking links in
              printed materials, books, academic papers, and archived social media posts.
            </li>
          </ul>
          <p>
            For links in printed materials (books, brochures, business cards, conference slides),
            prefer short paths on your own domain (<code>yourdomain.com/go/thing</code>) over
            third-party short URLs. Your own domain persists as long as you own it; a third-party
            service can disappear without warning.
          </p>

          <h2>UTM parameters: the right tracking mechanism</h2>
          <p>
            For marketing campaign tracking, UTM parameters on the destination URL are more
            reliable than click tracking on the short URL:
          </p>
          <pre><code>{`https://yoursite.com/product?utm_source=newsletter&utm_medium=email&utm_campaign=may2026`}</code></pre>
          <p>
            These parameters survive redirects, work with any analytics platform that reads them
            (Google Analytics, Plausible, Fathom), don&apos;t require a third-party service, and give
            you attribution data in your own analytics rather than in a shortener dashboard you
            might lose access to.
          </p>
          <p>
            If the long URL with UTM parameters is unwieldy, shorten it — but the tracking
            mechanism is in the UTM parameters, not the shortener. The shortener is just cosmetic.
          </p>

          <h2>When to use each option</h2>
          <ul>
            <li>
              <strong>Simple short link for readability (print, social):</strong> Any shortener
              works. Prefer one with a custom domain if you care about brand consistency.
            </li>
            <li>
              <strong>QR code that goes into a permanent printed item:</strong> Use your own domain.
              Never a third-party shortener for anything you&apos;re printing in bulk.
            </li>
            <li>
              <strong>Marketing campaign tracking:</strong> Add UTM parameters to the destination
              URL, then optionally shorten the resulting URL.
            </li>
            <li>
              <strong>Internal links in documentation:</strong> Skip the shortener entirely. Use
              meaningful relative paths.
            </li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li>
              <Link href="/tools/url-shortener">URL Shortener</Link>{" "}
              — create short redirect URLs without sign-up or tracking.
            </li>
            <li>
              <Link href="/tools/url-encoder">URL Encoder/Decoder</Link>{" "}
              — encode special characters in URLs so they&apos;re safe to use in query strings.
            </li>
            <li>
              <Link href="/tools/qr-code-generator">QR Code Generator</Link>{" "}
              — generate QR codes for URLs. Pair with URL shortener for cleaner codes.
            </li>
          </ul>

          <hr className="my-8" />

          <p className="text-sm text-gray-400">
            Written by{" "}
            <Link href="/about" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Achraf A.
            </Link>
            , founder of TheFreeAITools — built in Morocco. The URL shortener on this site was
            built specifically to avoid collecting any tracking data on clicks.
          </p>
        </div>
      </article>
    </main>
  )
}
