import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Optimize Meta Tags for SEO (Title, Description, and What Actually Matters)",
  description:
    "Meta tags still matter in 2026 â€” but not all of them. Here's which Google uses, the character limits that prevent truncation, and how to preview before publishing.",
  path: "/blog/how-to-optimize-meta-tags-for-seo",
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
            <span>7 min read</span>
            <span>Â·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Optimize Meta Tags for SEO (Title, Description, and What Actually Matters)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Not all meta tags affect SEO. Here&apos;s which ones Google uses, what the practical limits
            are, and how to write them to improve click-through rates from search results.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>The meta tags that actually matter for SEO</h2>
          <p>
            Most meta tags have no direct effect on search rankings. The ones that matter:
          </p>
          <ul>
            <li><strong>Title tag</strong> â€” the most important on-page SEO element</li>
            <li><strong>Meta description</strong> â€” affects click-through rate, not ranking directly</li>
            <li><strong>Canonical tag</strong> â€” tells Google which version of a page is authoritative</li>
            <li><strong>Robots meta tag</strong> â€” controls whether the page is indexed</li>
          </ul>
          <p>
            Meta keywords (<code>&lt;meta name=&quot;keywords&quot;&gt;</code>) have been ignored by Google
            since 2009. Adding them wastes time without any SEO benefit.
          </p>

          <h2>The title tag</h2>
          <p>
            The title tag is the blue clickable headline in search results. It is the most
            significant on-page ranking factor after the page&apos;s content itself.
          </p>
          <p>
            <strong>Format:</strong> Primary Keyword â€” Secondary Keyword | Brand Name
          </p>
          <p>
            <strong>Length:</strong> Google displays approximately 50â€“60 characters (roughly 600 pixels).
            Titles longer than this are truncated with an ellipsis. Exact limits vary because
            Google measures pixel width, not characters â€” wide letters (W, M) take more space
            than narrow ones (i, l).
          </p>
          <p>
            Best practices:
          </p>
          <ul>
            <li>Put the primary keyword near the beginning â€” earlier keywords get more weight</li>
            <li>Make it descriptive and specific â€” vague titles get lower click-through rates</li>
            <li>Do not keyword-stuff â€” one or two keyword variations is enough</li>
            <li>Note: Google may rewrite your title tag in search results if it determines the rewrite better matches search intent</li>
          </ul>

          <h2>The meta description</h2>
          <p>
            The meta description appears as the grey text below the title in search results. Google
            does not use it as a ranking factor directly, but it affects click-through rate â€” which
            indirectly signals quality to Google.
          </p>
          <p>
            <strong>Length:</strong> approximately 155â€“160 characters for desktop, 120 characters
            for mobile. Longer descriptions are cut off mid-sentence.
          </p>
          <p>
            Best practices:
          </p>
          <ul>
            <li>Include the primary keyword â€” Google bolds it in results when it matches the search query</li>
            <li>Write a complete sentence that would make someone click â€” it is essentially an ad headline</li>
            <li>Be specific about what the page offers â€” vague descriptions reduce CTR</li>
            <li>Do not duplicate the same description across multiple pages â€” Google may ignore it</li>
          </ul>

          <h2>Preview your meta tags before publishing</h2>
          <p>
            Writing meta tags without seeing how they appear in search results is guesswork. The{" "}
            <Link href="/tools/meta-tags">free meta tag generator and preview tool</Link>{" "}
            shows a real-time preview of how your title and description will appear in Google
            search results, including truncation warnings when you exceed the character limits.
          </p>

          <h2>Open Graph tags (for social sharing)</h2>
          <p>
            Open Graph tags control how your page appears when shared on social media â€” Facebook,
            LinkedIn, X (Twitter), Slack:
          </p>
          <pre><code>{`<meta property="og:title" content="Page Title Here">
<meta property="og:description" content="Page description for social sharing">
<meta property="og:image" content="https://yourdomain.com/image.jpg">
<meta property="og:url" content="https://yourdomain.com/page">`}</code></pre>
          <p>
            The <code>og:image</code> should be 1200Ã—630 pixels for optimal display. Without an
            og:image, social platforms show no image with your link â€” significantly reducing engagement.
          </p>

          <h2>Twitter Card tags</h2>
          <p>
            Twitter (X) uses its own card tags in addition to Open Graph:
          </p>
          <pre><code>{`<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://yourdomain.com/image.jpg">`}</code></pre>
          <p>
            <code>summary_large_image</code> shows a large image card â€” better for content pages.
            <code>summary</code> shows a small thumbnail â€” better for tool and product pages.
          </p>

          <h2>The canonical tag</h2>
          <p>
            The canonical tag prevents duplicate content issues:
          </p>
          <pre><code>{`<link rel="canonical" href="https://yourdomain.com/page">`}</code></pre>
          <p>
            If the same content is accessible at multiple URLs (with/without www, with/without
            trailing slash, with tracking parameters), the canonical tells Google which version
            to index. Without it, Google may split ranking signals across multiple URLs or
            choose the wrong one.
          </p>

          <h2>Summary</h2>
          <ul>
            <li>Title tag: 50â€“60 characters, primary keyword near the start, descriptive and specific</li>
            <li>Meta description: 155â€“160 characters, include keyword, write to earn the click</li>
            <li>Add Open Graph and Twitter Card tags for social sharing</li>
            <li>Add canonical tags to prevent duplicate content issues</li>
            <li>Preview with the <Link href="/tools/meta-tags">free meta tag preview tool</Link> before publishing</li>
          </ul>
        </div>
      </article>
    </main>
  )
}
