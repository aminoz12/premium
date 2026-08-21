import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Check and Generate a Robots.txt File (And What the Rules Mean)",
  description:
    "A misconfigured robots.txt can block Google from your entire site. Here's how to check, read, and fix one — plus how to generate a correct one free.",
  path: "/blog/how-to-check-robots-txt",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-28" />
        <meta itemProp="dateModified" content="2026-05-28" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-28">May 28, 2026</time>
            <span>·</span>
            <span>6 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Check and Generate a Robots.txt File (And What the Rules Mean)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Robots.txt tells search engine crawlers which pages to visit. A single wrong line
            can block Google from your entire site — and you might not notice for weeks.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What robots.txt does</h2>
          <p>
            Robots.txt is a text file placed at your domain root (<code>yourdomain.com/robots.txt</code>).
            It tells well-behaved crawlers — Googlebot, Bing, and other search engine bots —
            which pages they are allowed to access. It is a set of instructions, not a security
            measure: bots that choose to ignore it can still access those URLs.
          </p>

          <h2>How to check your robots.txt</h2>
          <p>
            The fastest check: type your domain followed by <code>/robots.txt</code> in your
            browser:
          </p>
          <pre><code>https://yourdomain.com/robots.txt</code></pre>
          <p>
            If you get a 404, your site has no robots.txt — this is fine. Without a robots.txt,
            all crawlers have full access to everything.
          </p>
          <p>
            Use the <Link href="/tools/robots-txt">free robots.txt generator and checker</Link>{" "}
            to generate a properly formatted file or validate an existing one.
          </p>

          <h2>Reading robots.txt syntax</h2>
          <pre><code>{`User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/
Sitemap: https://yourdomain.com/sitemap.xml`}</code></pre>
          <p>
            Line by line:
          </p>
          <ul>
            <li><code>User-agent: *</code> — applies to all crawlers. Use a specific bot name (<code>Googlebot</code>, <code>Bingbot</code>) to target one crawler only.</li>
            <li><code>Disallow: /admin/</code> — block access to the /admin/ directory and all URLs under it</li>
            <li><code>Disallow: /private/</code> — block /private/ and everything under it</li>
            <li><code>Allow: /public/</code> — explicitly allow /public/ (useful to override a broader Disallow)</li>
            <li><code>Sitemap:</code> — tells crawlers where your sitemap is (recommended on all robots.txt files)</li>
          </ul>

          <h2>The most dangerous robots.txt mistake</h2>
          <p>
            The single worst robots.txt line is:
          </p>
          <pre><code>{`Disallow: /`}</code></pre>
          <p>
            This blocks all crawlers from all URLs on the site. It is the correct setting during
            development — and a catastrophic setting in production. Developers sometimes push a
            development robots.txt to production by mistake. If your site suddenly drops from
            search results, check your robots.txt first.
          </p>

          <h2>What to block and what to allow</h2>
          <p>
            <strong>Block from crawlers:</strong>
          </p>
          <ul>
            <li><code>/admin/</code> — admin dashboards, CMS backends</li>
            <li><code>/api/</code> — API endpoints that return JSON (no SEO value)</li>
            <li><code>/checkout/</code>, <code>/cart/</code> — e-commerce flows (no ranking value)</li>
            <li><code>/?s=</code> — WordPress search result pages (duplicate content)</li>
            <li><code>/login</code>, <code>/register</code> — authentication pages</li>
          </ul>
          <p>
            <strong>Never block from crawlers:</strong>
          </p>
          <ul>
            <li>Your CSS and JavaScript files — Google needs them to render pages correctly</li>
            <li>Images used on pages you want indexed — Google Images is a traffic source</li>
            <li>Your sitemap URL — it should be accessible to all crawlers</li>
            <li>Any page you want to rank in search results</li>
          </ul>

          <h2>Robots.txt for AI crawlers</h2>
          <p>
            In 2026, AI companies send their own crawlers to collect training data and power AI
            search features. These follow robots.txt if you specify them:
          </p>
          <pre><code>{`User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /`}</code></pre>
          <p>
            Add <code>Allow: /</code> instead if you want AI crawlers to access your content —
            being included in AI training data and AI search results (ChatGPT Browse, Perplexity)
            is increasingly a traffic source.
          </p>

          <h2>Summary</h2>
          <p>
            Check your robots.txt at <code>yourdomain.com/robots.txt</code>. Generate or validate
            one with the <Link href="/tools/robots-txt">free robots.txt tool</Link>.
            Never block <code>/</code> in production. Always include your sitemap URL. Block admin
            panels, API endpoints, and checkout flows — not your CSS, JS, or content pages.
          </p>
        </div>
      </article>
    </main>
  )
}
