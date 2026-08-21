import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Check Internal Links Free (Find Broken Links & Orphan Pages)",
  description:
    "How to audit internal links on any website free — find broken links, orphan pages, and thin link equity distribution. Methods that work without installing software.",
  path: "/blog/how-to-check-internal-links-free",
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
            How to Check Internal Links Free (Find Broken Links &amp; Orphan Pages)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Internal links pass PageRank between pages, help Google understand your site structure,
            and keep users on-site longer. A broken internal link or an orphan page (no links
            pointing to it) quietly drags rankings down. Here is how to find both for free.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Why internal links matter for SEO</h2>
          <p>
            Google uses internal links to discover pages, understand which pages are most important
            (based on how many links point to them), and determine what a page is about (based on
            the anchor text of links pointing to it). Three structural problems reduce the value of
            your internal link graph:
          </p>
          <ul>
            <li>
              <strong>Broken internal links (404s)</strong> — waste crawl budget and leak PageRank
              into dead ends. Google treats a broken link the same as a missing page.
            </li>
            <li>
              <strong>Orphan pages</strong> — pages Google cannot find through crawling because no
              internal link points to them. They can only be indexed if they are in your sitemap,
              and even then they may rank poorly because Google infers low importance.
            </li>
            <li>
              <strong>Shallow link depth</strong> — important pages buried 4+ clicks from the
              homepage receive significantly less PageRank than pages 1–2 clicks deep.
            </li>
          </ul>

          <h2>Method 1: Google Search Console (free, owns-site-only)</h2>
          <p>
            If you have GSC access to the site, the <strong>Pages → Not indexed</strong> report
            shows pages that were crawled but not indexed — often orphan pages that lack internal
            links and therefore appear low-quality to Google. The{" "}
            <strong>Links → Internal links</strong> report shows which pages have the most internal
            links pointing to them. Sort ascending to find the pages with the fewest links —
            those are your candidates for adding internal links.
          </p>
          <p>
            GSC does not show broken internal links directly. For that you need a crawler.
          </p>

          <h2>Method 2: Screaming Frog SEO Spider (free up to 500 URLs)</h2>
          <p>
            Screaming Frog is a desktop crawler that maps every link on your site. The free tier
            handles up to 500 URLs — enough for small sites and targeted audits of specific
            sections. After crawling:
          </p>
          <ol>
            <li>Filter the <strong>Response Codes</strong> tab to show 4xx — these are your broken internal links.</li>
            <li>Export the <strong>Inlinks</strong> for any broken URL to see exactly which page contains the broken link.</li>
            <li>Check the <strong>Crawl Depth</strong> column to see which pages are buried deepest.</li>
          </ol>
          <p>
            For sites over 500 pages, you need Screaming Frog paid or an alternative crawler.
          </p>

          <h2>Method 3: Browser DevTools quick check (no install)</h2>
          <p>
            For a quick audit of a single page, open the browser console and run:
          </p>
          <pre><code>{`// Get all internal links on the current page
const links = [...document.querySelectorAll('a[href]')]
  .map(a => a.href)
  .filter(href => href.startsWith(location.origin));

// Check each link's status code
const results = await Promise.all(
  links.map(url =>
    fetch(url, { method: 'HEAD' })
      .then(r => ({ url, status: r.status }))
      .catch(() => ({ url, status: 'error' }))
  )
);

// Print broken links
results.filter(r => r.status >= 400).forEach(r =>
  console.log(r.status, r.url)
);`}</code></pre>
          <p>
            This checks all internal links on the current page. Run it on your homepage to find
            broken links there. It does not crawl deeper — use Screaming Frog for a full audit.
          </p>

          <h2>Method 4: XML sitemap cross-check (find orphan pages)</h2>
          <p>
            An orphan page is one that appears in your sitemap but has zero internal links from
            the rest of the site. To find them:
          </p>
          <ol>
            <li>Fetch your <code>sitemap.xml</code> and extract all URLs.</li>
            <li>Crawl your site (via Screaming Frog or a script) and collect all URLs found through internal links.</li>
            <li>Any URL in the sitemap that was <em>not</em> found through crawling is an orphan page.</li>
          </ol>
          <p>
            In a Next.js or similar SSG site, orphan pages commonly appear when:
          </p>
          <ul>
            <li>A programmatically generated page (compare/alternatives/best) is in the sitemap but never linked from a hub page or navigation</li>
            <li>A blog post is published but never mentioned in the blog index (missing from the posts registry)</li>
            <li>A redirect target has no links pointing directly to the new URL</li>
          </ul>

          <h2>How to fix the problems you find</h2>
          <table>
            <thead>
              <tr>
                <th>Issue</th>
                <th>Fix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Broken internal link (404)</td>
                <td>Update the link to the correct URL, or set up a 301 redirect from the old URL</td>
              </tr>
              <tr>
                <td>Orphan page (important content)</td>
                <td>Add internal links from 2–3 relevant pages; add to a hub page or navigation</td>
              </tr>
              <tr>
                <td>Orphan page (thin content)</td>
                <td>Noindex it or merge it into a stronger page</td>
              </tr>
              <tr>
                <td>Important page buried at depth 4+</td>
                <td>Add a link from the homepage, category page, or nav to bring it within 2–3 clicks</td>
              </tr>
              <tr>
                <td>Poor anchor text ("click here", "read more")</td>
                <td>Rewrite anchors to use descriptive keywords matching the target page</td>
              </tr>
            </tbody>
          </table>

          <h2>What to prioritize</h2>
          <p>
            Fix broken links first — they are unambiguously negative and fast to repair. Then
            address orphan pages for your most important content (tools, blog posts, landing pages
            that already have impressions in GSC). Shallow link depth and anchor text are lower
            priority but worth fixing when refactoring navigation.
          </p>

          <h2>How often to run an internal link audit</h2>
          <p>
            On an actively published site, run a crawl monthly. On a stable site with infrequent
            changes, quarterly is enough. The fastest trigger for an immediate audit is any time
            you restructure URLs, rename pages, or delete a section — those are the moments when
            broken links proliferate.
          </p>

          <h2>Related checks</h2>
          <p>
            After fixing internal links, the next audit to run is a DNS and SSL check — infrastructure
            issues are the other common reason pages don&apos;t rank despite good on-page SEO. The{" "}
            <Link href="/tools/dns-lookup">DNS lookup tool</Link> and{" "}
            <Link href="/tools/ssl-checker">SSL checker</Link> both run in-browser without an
            account.
          </p>
        </div>
      </article>
    </main>
  )
}
