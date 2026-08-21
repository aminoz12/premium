import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Analyze a Website Free Online (SEO, Speed, DNS, SSL)",
  description:
    "How to audit a website's SEO, DNS records, SSL certificate, meta tags, and performance free online — no account, no paid tools. Step-by-step with browser-based tools.",
  path: "/blog/how-to-analyze-website-free-online",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-06-13" />
        <meta itemProp="dateModified" content="2026-06-13" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-black/60 dark:text-white/60">
            <time dateTime="2026-06-13">June 13, 2026</time>
            <span>·</span>
            <span>7 min read</span>
            <span>·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            How to Analyze a Website Free Online (SEO, Speed, DNS, SSL)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            A complete website analysis covers four layers: technical infrastructure (DNS, SSL),
            on-page SEO (meta tags, canonical, schema), content quality, and performance. Here is
            how to do each layer for free, in the browser, without creating an account.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Layer 1: Technical infrastructure</h2>
          <p>
            Before auditing content, check that the infrastructure is sound. Issues here block
            Google from crawling the site regardless of how good the on-page SEO is.
          </p>

          <h3>DNS records</h3>
          <p>
            DNS issues cause domain resolution failures, email delivery problems, and subdomain
            conflicts that are invisible in the browser but visible to search crawlers. The{" "}
            <Link href="/tools/dns-lookup">free DNS lookup tool</Link> queries A, AAAA, CNAME, MX,
            NS, and TXT records for any domain in real time. Look for:
          </p>
          <ul>
            <li>A record pointing to the correct server IP</li>
            <li>No conflicting CNAME and A records on the same subdomain</li>
            <li>SPF and DKIM TXT records if email matters</li>
            <li>CAA records limiting which CAs can issue SSL certificates (optional but security-positive)</li>
          </ul>

          <h3>SSL certificate</h3>
          <p>
            HTTPS is a confirmed Google ranking signal. An expired or misconfigured certificate
            causes browser warnings that crater bounce rates and block crawlers. The{" "}
            <Link href="/tools/ssl-checker">SSL certificate checker</Link> shows:
          </p>
          <ul>
            <li>Expiry date — flag anything expiring in under 30 days</li>
            <li>Issuer and certificate chain validity</li>
            <li>Subject Alternative Names (SANs) — ensure both <code>example.com</code> and <code>www.example.com</code> are covered</li>
            <li>TLS version — TLS 1.0/1.1 are deprecated; you want TLS 1.2 minimum, 1.3 preferred</li>
          </ul>

          <h3>IP address and server location</h3>
          <p>
            The <Link href="/tools/ip-lookup">IP lookup tool</Link> identifies the server&apos;s
            geographic location, ASN (hosting provider), and whether the IP is flagged in any
            spam blocklists. Server location matters for local SEO — Google weighs proximity
            for location-specific queries.
          </p>

          <h2>Layer 2: On-page SEO</h2>

          <h3>Meta tags</h3>
          <p>
            Meta title and description are the two elements Google uses most directly to generate
            search snippets. Use the{" "}
            <Link href="/tools/meta-description-length-checker">meta description length checker</Link>{" "}
            to verify:
          </p>
          <ul>
            <li>Title is 50–60 characters (Google truncates at ~580px pixel width)</li>
            <li>Meta description is 145–155 characters</li>
            <li>Primary keyword appears in the title, preferably near the start</li>
            <li>No duplicate titles across pages — Google rewrites duplicates</li>
          </ul>
          <p>
            The <Link href="/tools/meta-tags">meta tag generator</Link> lets you preview and
            fine-tune your snippet exactly as it will appear in search results.
          </p>

          <h3>Canonical tag</h3>
          <p>
            A missing or wrong canonical tag causes Google to choose arbitrarily between duplicate
            URLs (with/without trailing slash, HTTP vs HTTPS, www vs non-www). The{" "}
            <Link href="/tools/canonical-tag-generator">canonical tag generator</Link> builds the
            correct element for any URL. Check that every page has exactly one canonical pointing
            to the preferred version.
          </p>

          <h3>Sitemap</h3>
          <p>
            A valid XML sitemap helps Google discover pages that aren&apos;t well-linked internally.
            Use the <Link href="/tools/sitemap-generator">sitemap generator</Link> to create one if
            yours is missing, or validate your existing sitemap by fetching it directly and checking
            for malformed URLs or missing <code>&lt;lastmod&gt;</code> dates.
          </p>

          <h2>Layer 3: Content quality signals</h2>

          <h3>Word count and content depth</h3>
          <p>
            Thin pages (under 300 words on a topic that warrants depth) consistently underperform.
            The <Link href="/tools/word-counter">word counter</Link> gives you a baseline — but
            word count alone is not a ranking signal. Content depth means: does the page answer
            the query better than the current top-ranking results? Count the H2s on the
            top-3 results and compare to yours.
          </p>

          <h3>Heading structure</h3>
          <p>
            Each page should have exactly one H1 that matches or is close to the target keyword.
            H2s should cover sub-questions users have. You can verify heading structure by
            opening browser DevTools and running{" "}
            <code>document.querySelectorAll(&apos;h1,h2,h3&apos;)</code> to see all headings
            without installing an extension.
          </p>

          <h2>Layer 4: Performance</h2>

          <h3>Core Web Vitals</h3>
          <p>
            Google&apos;s Core Web Vitals (LCP, INP, CLS) are ranking signals. The fastest
            free audit is Google&apos;s own PageSpeed Insights (pagespeed.web.dev) — no account
            required. It runs a Lighthouse audit and shows real-field data from the Chrome User
            Experience Report (CrUX) alongside the lab data.
          </p>

          <h3>Image optimization</h3>
          <p>
            Unoptimized images are the most common LCP killer. For any image over 100 KB:
            compress it with the{" "}
            <Link href="/tools/image-compressor">free image compressor</Link>, resize it to the
            actual display dimensions with the{" "}
            <Link href="/tools/image-resizer">image resizer</Link>, and serve WebP format where
            the browser supports it (all modern browsers do since 2020).
          </p>

          <h2>Full audit checklist</h2>
          <table>
            <thead>
              <tr>
                <th>Check</th>
                <th>Tool</th>
                <th>Pass condition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DNS resolves correctly</td>
                <td><Link href="/tools/dns-lookup">DNS Lookup</Link></td>
                <td>A record → correct IP; no CNAME conflicts</td>
              </tr>
              <tr>
                <td>SSL valid and not expiring</td>
                <td><Link href="/tools/ssl-checker">SSL Checker</Link></td>
                <td>Valid chain; expiry &gt;30 days; TLS 1.2+</td>
              </tr>
              <tr>
                <td>Meta title length</td>
                <td><Link href="/tools/meta-description-length-checker">Meta Length Checker</Link></td>
                <td>50–60 characters</td>
              </tr>
              <tr>
                <td>Meta description length</td>
                <td><Link href="/tools/meta-description-length-checker">Meta Length Checker</Link></td>
                <td>145–155 characters</td>
              </tr>
              <tr>
                <td>Canonical tag correct</td>
                <td><Link href="/tools/canonical-tag-generator">Canonical Generator</Link></td>
                <td>One canonical per page; points to preferred URL</td>
              </tr>
              <tr>
                <td>Sitemap present and valid</td>
                <td><Link href="/tools/sitemap-generator">Sitemap Generator</Link></td>
                <td>Accessible at /sitemap.xml; all URLs return 200</td>
              </tr>
              <tr>
                <td>Content depth</td>
                <td><Link href="/tools/word-counter">Word Counter</Link></td>
                <td>Comparable to top-3 results for the target query</td>
              </tr>
              <tr>
                <td>Core Web Vitals</td>
                <td>PageSpeed Insights (Google)</td>
                <td>LCP &lt;2.5s; INP &lt;200ms; CLS &lt;0.1</td>
              </tr>
              <tr>
                <td>Images optimized</td>
                <td><Link href="/tools/image-compressor">Image Compressor</Link></td>
                <td>No image over 100 KB at display size</td>
              </tr>
            </tbody>
          </table>

          <h2>Order of priority</h2>
          <p>
            Infrastructure first: DNS and SSL issues block everything else. Then on-page: meta
            tags and canonical are the fastest wins per hour of work. Performance last: Core
            Web Vitals matter but are rarely the primary reason a page isn&apos;t ranking — fix
            the content and authority gap first.
          </p>
        </div>
      </article>
    </main>
  )
}
