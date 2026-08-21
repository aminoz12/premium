import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Make a Website Sitemap (XML and HTML) â€” Free Generator",
  description:
    "What a sitemap is, when Google actually needs one, how to generate XML and HTML sitemaps free, and how to submit it to Google Search Console.",
  path: "/blog/how-to-make-website-sitemap",
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
            How to Make a Website Sitemap (XML and HTML) â€” Free Generator
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            A sitemap tells search engines which pages your site has and when they were last updated. Here&apos;s when you actually need one, how to generate it free, and how to submit it to Google.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What a sitemap actually does</h2>
          <p>
            A sitemap is a file (usually XML) that lists the URLs on your website. It tells search engine crawlers where to find your pages and optionally when they were last updated and how often they change.
          </p>
          <p>
            Two types exist:
          </p>
          <ul>
            <li><strong>XML sitemap</strong> (<code>sitemap.xml</code>): Primarily for search engines. Contains URLs, last-modified dates, and change frequency.</li>
            <li><strong>HTML sitemap</strong>: A page on your site listing all pages. Primarily for human visitors who can&apos;t find what they&apos;re looking for via navigation.</li>
          </ul>

          <h2>When Google says you actually need a sitemap</h2>
          <p>
            According to Google&apos;s own documentation, you benefit from a sitemap if:
          </p>
          <ul>
            <li>Your site is <strong>large</strong> â€” more than a few hundred pages where Googlebot might miss some</li>
            <li>Your site is <strong>new</strong> â€” few external links pointing to it, so crawlers rarely visit</li>
            <li>You have <strong>rich media content</strong> â€” videos, images you want indexed in Google Images</li>
            <li>Your site has <strong>isolated pages</strong> â€” pages not well-linked from other pages on your site</li>
          </ul>
          <p>
            For small, well-linked sites (under 100 pages), a sitemap provides minimal SEO benefit. Googlebot will find your pages by following links. But having one doesn&apos;t hurt, and the setup takes 5 minutes.
          </p>

          <h2>XML sitemap format</h2>
          <pre><code>{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/blog/post-title</loc>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`}</code></pre>
          <p>
            Important notes on the fields:
          </p>
          <ul>
            <li><strong><code>loc</code>:</strong> Required. Must be a full URL including https://</li>
            <li><strong><code>lastmod</code>:</strong> Optional but recommended. Use the actual last modification date â€” don&apos;t set everything to today&apos;s date</li>
            <li><strong><code>changefreq</code>:</strong> Optional and largely ignored by Google â€” it&apos;s advisory only</li>
            <li><strong><code>priority</code>:</strong> Optional. Relative priority between 0.0 and 1.0. Google largely ignores this too â€” focus on having accurate <code>lastmod</code> instead</li>
          </ul>

          <h2>Generating a sitemap free</h2>
          <p>
            The <Link href="/tools/sitemap-generator">free sitemap generator</Link> creates XML sitemaps for any site â€” enter your domain and it will attempt to crawl and discover pages automatically:
          </p>
          <ol>
            <li>Enter your website URL</li>
            <li>Set the maximum pages to crawl (start with 500 for most sites)</li>
            <li>Click Generate â€” the tool crawls your site following internal links</li>
            <li>Download the generated <code>sitemap.xml</code></li>
            <li>Upload to your server at <code>https://yourdomain.com/sitemap.xml</code></li>
          </ol>

          <h2>Platform-specific sitemap generation</h2>
          <ul>
            <li><strong>WordPress:</strong> Yoast SEO and Rank Math both auto-generate sitemaps at <code>/sitemap_index.xml</code>. No manual work needed.</li>
            <li><strong>Shopify:</strong> Auto-generates at <code>/sitemap.xml</code>. Nothing to configure.</li>
            <li><strong>Wix:</strong> Auto-generates and submits to Google automatically in modern Wix.</li>
            <li><strong>Next.js:</strong> Use the <code>next-sitemap</code> package or the built-in Metadata API&apos;s <code>sitemap.ts</code> route.</li>
            <li><strong>Static sites:</strong> Generate during build with a script or plugin depending on your generator (Gatsby, Eleventy, Hugo all have sitemap plugins).</li>
          </ul>

          <h2>Submitting to Google Search Console</h2>
          <ol>
            <li>Go to <strong>Google Search Console</strong> (search.google.com/search-console)</li>
            <li>Select your property</li>
            <li>In the left sidebar: <strong>Indexing â†’ Sitemaps</strong></li>
            <li>Enter your sitemap URL (e.g., <code>sitemap.xml</code>) and click Submit</li>
          </ol>
          <p>
            Google will process the sitemap within hours and start crawling the listed URLs. You can return to the Sitemaps section to see how many URLs were discovered vs. indexed.
          </p>
          <p>
            Also add your sitemap URL to your <code>robots.txt</code> file:
          </p>
          <pre><code>{`User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`}</code></pre>

          <h2>Sitemap index files (for large sites)</h2>
          <p>
            A single sitemap file can contain up to 50,000 URLs and must be under 50 MB uncompressed. Large sites use a <em>sitemap index</em> â€” an XML file that lists multiple sitemaps:
          </p>
          <pre><code>{`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-blog.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
  </sitemap>
</sitemapindex>`}</code></pre>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/sitemap-generator">Free Sitemap Generator</Link> â€” crawl your site and generate a sitemap.xml instantly</li>
            <li><Link href="/tools/meta-tags">Free Meta Tag Generator</Link> â€” generate SEO meta tags for pages in your sitemap</li>
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
