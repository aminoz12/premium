import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "What Is a URL Shortener and How Does It Work?",
  description:
    "How URL shorteners redirect traffic, what tracking data they collect, when to use one, and how to create short links free with no account.",
  path: "/blog/what-is-a-url-shortener-how-it-works",
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
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            What Is a URL Shortener and How Does It Work?
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            A URL shortener turns a long link into a short one â€” but the mechanics behind the redirect, the tracking it enables, and when to avoid it are worth understanding before you click.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>How URL shorteners work</h2>
          <p>
            When you shorten a URL, the service creates a record in its database mapping a short code (like <code>bit.ly/abc123</code>) to your original URL. When someone clicks the short link, their browser makes an HTTP request to the shortener&apos;s server. The server looks up the code in its database and returns an HTTP redirect â€” either a 301 (permanent) or 302 (temporary) â€” pointing to your original URL. The browser follows the redirect automatically in milliseconds.
          </p>
          <p>
            This is why the redirect feels instant â€” it&apos;s just two HTTP requests: one to the shortener, one to the destination.
          </p>

          <h2>What URL shorteners track</h2>
          <p>
            The redirect step is where tracking happens. Before the server sends the redirect response, it can log:
          </p>
          <ul>
            <li>The timestamp of the click</li>
            <li>The visitor&apos;s IP address (from which location data is derived)</li>
            <li>The User-Agent string (browser, OS, device type)</li>
            <li>The Referer header (which page they clicked the link from)</li>
          </ul>
          <p>
            This is the data that powers the analytics dashboards in Bitly, TinyURL Pro, and similar services. It&apos;s also why privacy-focused users avoid clicking unknown shortened URLs â€” the shortener operator sees every click, not just the destination site.
          </p>
          <p>
            The <Link href="/tools/url-shortener">free URL shortener</Link> creates short redirect links with no tracking data collected â€” clicks go directly to the destination without logging visitor IP addresses.
          </p>

          <h2>301 vs. 302 redirects: why it matters for SEO</h2>
          <p>
            URL shorteners typically use one of two HTTP redirect types:
          </p>
          <ul>
            <li><strong>301 (Permanent Redirect):</strong> Tells browsers and search engines the move is permanent. Google transfers most of the original URL&apos;s PageRank to the destination. Use 301 for links that won&apos;t change.</li>
            <li><strong>302 (Temporary Redirect):</strong> Tells search engines the redirect is temporary. PageRank is not fully transferred. Many URL shorteners default to 302 so they can change the destination â€” and so they retain more control over the traffic analytics.</li>
          </ul>
          <p>
            For links you share in social media posts, emails, and printed materials, the redirect type doesn&apos;t matter â€” Google doesn&apos;t index short URLs in social posts. For links embedded in web pages that you want to pass SEO value, use a direct link or a 301 redirect on your own domain.
          </p>

          <h2>When to use a URL shortener</h2>
          <ul>
            <li><strong>Print and physical materials:</strong> Business cards, posters, packaging â€” where a 200-character URL is impossible to type and a 20-character short link is practical</li>
            <li><strong>Social media character limits:</strong> Twitter/X counts URL characters regardless of length (all URLs are shortened to 23 characters by Twitter), but for platforms without automatic shortening, a short URL is cleaner in posts</li>
            <li><strong>QR codes:</strong> Shorter URLs encode into simpler QR patterns with fewer modules â€” easier to scan at smaller sizes</li>
            <li><strong>UTM tracking links:</strong> A URL with UTM parameters like <code>utm_source=email&utm_medium=newsletter&utm_campaign=q2</code> adds 80+ characters â€” a short link hides the tracking parameters from the user while keeping them functional</li>
            <li><strong>Sharing in chat:</strong> Preventing a long URL from breaking across lines in messaging apps</li>
          </ul>

          <h2>When NOT to use a URL shortener</h2>
          <ul>
            <li><strong>In web page content for SEO:</strong> Always use direct URLs in your own web pages â€” short links add a redirect hop and pass less link equity than direct links</li>
            <li><strong>For permanent brand links:</strong> If the shortener service shuts down, every shortened link breaks. Use your own domain for permanent redirects (e.g., <code>yourbrand.com/product</code> â†’ actual URL)</li>
            <li><strong>For sensitive destinations:</strong> Phishing attacks use URL shorteners to hide malicious destinations. Recipients can&apos;t see where the link goes before clicking â€” which makes short links less trustworthy in professional contexts</li>
          </ul>

          <h2>Checking where a short link leads before clicking</h2>
          <p>
            To see the destination of a short link without clicking it:
          </p>
          <ul>
            <li><strong>Bitly links:</strong> Add a <code>+</code> to the URL (e.g., <code>bit.ly/abc123+</code>) to see the link preview page</li>
            <li><strong>Any link:</strong> Add the URL to a browser and hover over it â€” the destination appears in the status bar. Or use a link expander service to follow the redirects without your browser loading the destination</li>
            <li><strong>Cursor hover:</strong> In most desktop email clients and browsers, hovering over a link shows the actual destination URL in the bottom status bar</li>
          </ul>

          <h2>Creating short links for free</h2>
          <p>
            The <Link href="/tools/url-shortener">free URL shortener</Link> creates short links with no account, no monthly limit, and no tracking data collected on your visitors. Paste a long URL and get a short link instantly.
          </p>
          <p>
            For business use where you need analytics (click counts, location data, device breakdown), Bitly&apos;s free tier offers 10 short links/month with basic analytics. Their paid plans start at $8/month for unlimited links.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/url-shortener">Free URL Shortener</Link> â€” create short links with no account</li>
            <li><Link href="/tools/qr-code-generator">Free QR Code Generator</Link> â€” encode your short URL as a scannable QR code</li>
            <li><Link href="/tools/url-encoder">Free URL Encoder</Link> â€” encode special characters in URLs before shortening</li>
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
