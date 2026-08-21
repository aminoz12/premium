import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Generate a Sitemap.xml for Free (And How to Submit It to Google)",
  description:
    "A sitemap tells Google which pages exist and how often they change. Here's how to generate one free, what to include, and how to submit it in Search Console.",
  path: "/blog/how-to-generate-sitemap-xml-free",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-29" />
        <meta itemProp="dateModified" content="2026-05-29" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-29">May 29, 2026</time>
            <span>·</span>
            <span>6 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Generate a Sitemap.xml for Free (And How to Submit It to Google)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            A sitemap tells Google which pages exist on your site and which to prioritize. Here&apos;s
            how to generate one free and submit it — so new pages get indexed faster.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What a sitemap does</h2>
          <p>
            A sitemap.xml file lists all the URLs on your site that you want search engines to
            crawl and index. Google can discover pages without a sitemap by following links, but a
            sitemap:
          </p>
          <ul>
            <li>Speeds up indexing of new pages — especially pages with few inbound links</li>
            <li>Tells Google the last modification date of each page — useful for recrawl scheduling</li>
            <li>Communicates page priority (0.0 to 1.0) — though Google uses this as a hint, not a strict rule</li>
            <li>Is especially important for large sites, new sites, and sites with content updated frequently</li>
          </ul>

          <h2>Generate a sitemap free</h2>
          <p>
            Use the <Link href="/tools/sitemap-generator">free sitemap generator</Link> —
            enter your domain URL and it crawls your site to produce a sitemap.xml file.
            No account required.
          </p>
          <p>
            The generated sitemap follows the standard XML sitemap protocol (sitemaps.org) and
            is accepted by Google, Bing, and all major search engines.
          </p>

          <h2>What a sitemap looks like</h2>
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
    <lastmod>2026-05-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`}</code></pre>

          <h2>What to include in your sitemap</h2>
          <ul>
            <li>All important public pages — homepage, product pages, blog posts, tool pages</li>
            <li>Your canonical URLs (not duplicate versions of the same page)</li>
            <li>Only pages with indexable content — not admin pages, login pages, or pages with noindex tags</li>
          </ul>
          <p>
            Do not include:
          </p>
          <ul>
            <li>Pages blocked by robots.txt — including a URL in the sitemap that robots.txt disallows sends conflicting signals</li>
            <li>Redirected URLs — only include the final destination URL</li>
            <li>Paginated URLs beyond the first page (if you use rel=canonical to consolidate pagination)</li>
            <li>Duplicate content — only the canonical version</li>
          </ul>

          <h2>How to submit to Google Search Console</h2>
          <ol>
            <li>Go to <strong>search.google.com/search-console</strong></li>
            <li>Select your property (your website)</li>
            <li>In the left panel: <strong>Indexing → Sitemaps</strong></li>
            <li>Enter your sitemap URL — typically <code>https://yourdomain.com/sitemap.xml</code></li>
            <li>Click Submit</li>
          </ol>
          <p>
            Google will crawl the sitemap and start indexing the listed URLs. The &quot;Discovered URLs&quot;
            count in Search Console shows how many pages Google found. The &quot;Indexed&quot; count shows
            how many it actually indexed — the gap indicates pages Google chose not to index (typically
            thin content, duplicate content, or pages that compete with stronger URLs).
          </p>

          <h2>How often to update your sitemap</h2>
          <p>
            For static sites: generate and upload the sitemap once, then update whenever you add
            significant new pages.
          </p>
          <p>
            For dynamic sites (CMS, Next.js, WordPress): generate the sitemap programmatically
            so it updates automatically when new content is published. Most CMS platforms (WordPress
            + Yoast SEO, Shopify, Next.js with next-sitemap) generate sitemaps automatically.
          </p>
          <p>
            After major content additions — a new category, 20+ new blog posts, a new tool section —
            resubmit the sitemap URL in Search Console to prompt a fresh crawl.
          </p>

          <h2>Sitemap index files for large sites</h2>
          <p>
            A single sitemap.xml is limited to 50,000 URLs and 50MB. For large sites, use a
            sitemap index — a master file that links to multiple individual sitemaps:
          </p>
          <pre><code>{`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap-blog.xml</loc></sitemap>
  <sitemap><loc>https://example.com/sitemap-tools.xml</loc></sitemap>
  <sitemap><loc>https://example.com/sitemap-pages.xml</loc></sitemap>
</sitemapindex>`}</code></pre>

          <h2>Summary</h2>
          <p>
            Generate a sitemap.xml with the{" "}
            <Link href="/tools/sitemap-generator">free sitemap generator</Link>. Include
            all canonical, indexable pages. Submit in Google Search Console under Indexing →
            Sitemaps. For dynamic sites, generate it automatically so it stays current. Resubmit
            after major content additions.
          </p>
        </div>
      </article>
    </main>
  )
}
