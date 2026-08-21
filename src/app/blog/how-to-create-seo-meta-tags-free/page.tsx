import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Create SEO Meta Tags for Free (With Preview of Google Results)",
  description:
    "Write meta tags without seeing how they'll look in search results is guesswork. Here's the format, limits, and how to preview exactly what Google shows before you publish.",
  path: "/blog/how-to-create-seo-meta-tags-free",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-30" />
        <meta itemProp="dateModified" content="2026-05-30" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-30">May 30, 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Create SEO Meta Tags for Free (With Preview of Google Results)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Meta tags are the first thing users see in search results — before they ever reach
            your page. Here&apos;s how to write them correctly and preview them before publishing.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Create and preview meta tags free</h2>
          <p>
            Use the <Link href="/tools/meta-tags">free meta tag generator</Link> to write
            your title and description while seeing a real-time preview of how they&apos;ll appear
            in Google search results — including truncation when you exceed the character limits.
          </p>

          <h2>The title tag</h2>
          <pre><code>{`<title>Primary Keyword — Secondary | Brand Name</title>`}</code></pre>
          <p>
            <strong>Limit:</strong> approximately 55–60 characters (600 pixels). Google measures
            pixel width, not characters — uppercase letters and wide characters like W and M take
            more space than i and l.
          </p>
          <p>
            <strong>Formula that works:</strong> [Primary keyword] — [what the page delivers] | [brand]
          </p>
          <p>
            Examples:
          </p>
          <ul>
            <li>Good: &quot;Free Image Compressor — Compress JPEG, PNG, WebP Online&quot;</li>
            <li>Bad: &quot;Image Compressor | Free Online Tool for Images | TheFreeAITools.com&quot;</li>
          </ul>
          <p>
            The bad example repeats &quot;image&quot; unnecessarily and buries the keyword in the middle.
          </p>

          <h2>The meta description</h2>
          <pre><code>{`<meta name="description" content="Your description here.">`}</code></pre>
          <p>
            <strong>Limit:</strong> approximately 155–160 characters for desktop, 120 for mobile.
          </p>
          <p>
            <strong>What it does:</strong> Google does not use meta descriptions as a ranking factor.
            But a well-written description increases click-through rate — which does signal quality
            to Google indirectly.
          </p>
          <p>
            <strong>Formula:</strong> [What the tool/page does] — [key benefit] — [social proof or
            differentiator]. Write it as an ad headline, not a description.
          </p>
          <p>
            Examples:
          </p>
          <ul>
            <li>Good: &quot;Compress JPEG, PNG, and WebP images free in your browser. No account, no upload limit, no quality loss. Files never leave your device.&quot;</li>
            <li>Bad: &quot;This page is about our free image compressor tool which compresses images.&quot;</li>
          </ul>

          <h2>Open Graph tags for social sharing</h2>
          <pre><code>{`<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description for sharing">
<meta property="og:image" content="https://yourdomain.com/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com/page">
<meta property="og:type" content="website">`}</code></pre>
          <p>
            The og:image must be at least 1200×630 pixels for large card display on Facebook and
            LinkedIn. Twitter requires the same dimensions for <code>summary_large_image</code>.
          </p>

          <h2>The full HTML head template</h2>
          <pre><code>{`<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Primary Keyword — What It Does | Brand</title>
  <meta name="description" content="155-character description here.">
  <link rel="canonical" href="https://yourdomain.com/page">

  <!-- Open Graph -->
  <meta property="og:title" content="Same as title tag">
  <meta property="og:description" content="Same as meta description">
  <meta property="og:image" content="https://yourdomain.com/og-image.jpg">
  <meta property="og:url" content="https://yourdomain.com/page">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Same as title tag">
  <meta name="twitter:description" content="Same as meta description">
  <meta name="twitter:image" content="https://yourdomain.com/og-image.jpg">
</head>`}</code></pre>

          <h2>Common mistakes to avoid</h2>
          <ul>
            <li><strong>Duplicate meta descriptions:</strong> use unique descriptions per page — Google may ignore duplicate descriptions</li>
            <li><strong>Keyword stuffing in titles:</strong> one or two keyword uses is enough — &quot;Free Image Compressor — Free Image Compressor Online Free&quot; reads as spam</li>
            <li><strong>Missing og:image:</strong> pages shared without an image get significantly lower engagement on social media</li>
            <li><strong>No canonical tag:</strong> URL variations (www vs non-www, trailing slash) should resolve to one canonical URL</li>
          </ul>

          <h2>Summary</h2>
          <p>
            Write your title (55 chars) and description (155 chars) while previewing the Google
            SERP result with the{" "}
            <Link href="/tools/meta-tags">free meta tag generator</Link>. Use Open Graph
            tags for social sharing. Add a canonical tag to consolidate duplicate URL variants.
            The description does not directly affect rankings — write it to earn the click.
          </p>
        </div>
      </article>
    </main>
  )
}
