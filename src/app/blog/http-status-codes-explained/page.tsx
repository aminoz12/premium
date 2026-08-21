import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "HTTP Status Codes Explained: 200, 301, 404, 500 and the Rest",
  description:
    "What HTTP status codes mean, why 301 vs 302 matters for SEO, when 404 vs 410 is correct, and the codes every developer encounters in API debugging.",
  path: "/blog/http-status-codes-explained",
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
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            HTTP Status Codes Explained: 200, 301, 404, 500 and the Rest
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Every HTTP response carries a 3-digit status code. Here&apos;s what the five families mean, the codes you actually encounter in API debugging and SEO, and the differences that matter.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The five families</h2>
          <p>
            HTTP status codes are grouped by their first digit:
          </p>
          <ul>
            <li><strong>1xx â€” Informational:</strong> Request received, continuing process. Rarely seen in practice.</li>
            <li><strong>2xx â€” Success:</strong> The request was successfully received, understood, and accepted.</li>
            <li><strong>3xx â€” Redirection:</strong> Further action needed to complete the request.</li>
            <li><strong>4xx â€” Client error:</strong> The request contained bad syntax or cannot be fulfilled.</li>
            <li><strong>5xx â€” Server error:</strong> The server failed to fulfill a valid request.</li>
          </ul>

          <h2>2xx â€” Success codes</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Code</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Name</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">When it&apos;s used</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">200</td><td className="border border-gray-200 p-3 text-gray-600">OK</td><td className="border border-gray-200 p-3 text-gray-600">Standard success â€” GET and POST responses</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">201</td><td className="border border-gray-200 p-3 text-gray-600">Created</td><td className="border border-gray-200 p-3 text-gray-600">POST created a new resource (e.g., new user, new post)</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">204</td><td className="border border-gray-200 p-3 text-gray-600">No Content</td><td className="border border-gray-200 p-3 text-gray-600">Success but no response body â€” DELETE, some PUTs</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">206</td><td className="border border-gray-200 p-3 text-gray-600">Partial Content</td><td className="border border-gray-200 p-3 text-gray-600">Range request â€” video streaming, resumable downloads</td></tr>
              </tbody>
            </table>
          </div>

          <h2>3xx â€” Redirects (and why 301 vs 302 matters)</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Code</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Name</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">SEO/behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">301</td><td className="border border-gray-200 p-3 text-gray-600">Moved Permanently</td><td className="border border-gray-200 p-3 text-gray-600">Google transfers most link equity. Browser caches the redirect.</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">302</td><td className="border border-gray-200 p-3 text-gray-600">Found (Temporary)</td><td className="border border-gray-200 p-3 text-gray-600">Google keeps original URL indexed. Link equity not transferred.</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">307</td><td className="border border-gray-200 p-3 text-gray-600">Temporary Redirect</td><td className="border border-gray-200 p-3 text-gray-600">Like 302 but preserves HTTP method (POST stays POST)</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">308</td><td className="border border-gray-200 p-3 text-gray-600">Permanent Redirect</td><td className="border border-gray-200 p-3 text-gray-600">Like 301 but preserves HTTP method</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>The 301 vs 302 SEO rule:</strong> Use 301 when you&apos;ve permanently moved a URL â€” Google will update its index and transfer PageRank. Use 302 for temporary redirects (A/B tests, maintenance pages, login redirects). Using 302 when you mean 301 causes Google to keep indexing the old URL indefinitely.
          </p>
          <p>
            <strong>The 301 browser cache problem:</strong> 301s are cached aggressively by browsers. If you redirect A â†’ B using 301 and later need A to go somewhere else, users who visited before will see the cached old redirect until they clear their cache. Use 302 during testing; switch to 301 when permanent.
          </p>

          <h2>4xx â€” Client errors</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Code</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Name</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">When it occurs</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">400</td><td className="border border-gray-200 p-3 text-gray-600">Bad Request</td><td className="border border-gray-200 p-3 text-gray-600">Malformed request syntax â€” bad JSON body, missing required field</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">401</td><td className="border border-gray-200 p-3 text-gray-600">Unauthorized</td><td className="border border-gray-200 p-3 text-gray-600">Not authenticated â€” no token or invalid token</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">403</td><td className="border border-gray-200 p-3 text-gray-600">Forbidden</td><td className="border border-gray-200 p-3 text-gray-600">Authenticated but not authorized â€” wrong role, wrong permissions</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">404</td><td className="border border-gray-200 p-3 text-gray-600">Not Found</td><td className="border border-gray-200 p-3 text-gray-600">Resource doesn&apos;t exist at this URL</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">405</td><td className="border border-gray-200 p-3 text-gray-600">Method Not Allowed</td><td className="border border-gray-200 p-3 text-gray-600">POST to a GET-only endpoint</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">409</td><td className="border border-gray-200 p-3 text-gray-600">Conflict</td><td className="border border-gray-200 p-3 text-gray-600">Resource conflict â€” duplicate email, version mismatch</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">410</td><td className="border border-gray-200 p-3 text-gray-600">Gone</td><td className="border border-gray-200 p-3 text-gray-600">Resource permanently deleted â€” tells Google to deindex faster</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">422</td><td className="border border-gray-200 p-3 text-gray-600">Unprocessable Entity</td><td className="border border-gray-200 p-3 text-gray-600">Request is syntactically valid but semantically invalid</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">429</td><td className="border border-gray-200 p-3 text-gray-600">Too Many Requests</td><td className="border border-gray-200 p-3 text-gray-600">Rate limit exceeded â€” API throttling</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>401 vs 403:</strong> 401 means &quot;you need to log in.&quot; 403 means &quot;you are logged in but not allowed.&quot; Returning 403 for unauthenticated users reveals that a resource exists â€” some APIs return 404 for security-sensitive resources even when the issue is authentication.
          </p>
          <p>
            <strong>404 vs 410 for SEO:</strong> 404 tells Google &quot;this page isn&apos;t found â€” try again later.&quot; 410 tells Google &quot;this page is permanently gone â€” remove it from the index.&quot; If you delete a URL permanently, 410 accelerates deindexing compared to 404.
          </p>

          <h2>5xx â€” Server errors</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Code</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Name</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Typical cause</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">500</td><td className="border border-gray-200 p-3 text-gray-600">Internal Server Error</td><td className="border border-gray-200 p-3 text-gray-600">Unhandled exception â€” check server logs</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">502</td><td className="border border-gray-200 p-3 text-gray-600">Bad Gateway</td><td className="border border-gray-200 p-3 text-gray-600">Reverse proxy got invalid response from upstream</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">503</td><td className="border border-gray-200 p-3 text-gray-600">Service Unavailable</td><td className="border border-gray-200 p-3 text-gray-600">Server overloaded or down for maintenance</td></tr>
                <tr><td className="border border-gray-200 p-3 font-mono text-gray-600">504</td><td className="border border-gray-200 p-3 text-gray-600">Gateway Timeout</td><td className="border border-gray-200 p-3 text-gray-600">Upstream server didn&apos;t respond in time</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>502 vs 504:</strong> Both involve a reverse proxy (nginx, Cloudflare) failing to communicate with an upstream service. 502 means the upstream returned something invalid; 504 means it didn&apos;t respond at all (timeout). Both are usually caused by the upstream service crashing or being overloaded â€” not the proxy itself.
          </p>

          <h2>Debugging with JSON in API responses</h2>
          <p>
            Most REST APIs include a JSON body with error details alongside the status code. Format any API JSON error response for readability with the <Link href="/tools/json-formatter">free JSON formatter</Link> â€” paste the response body and instantly see the error structure.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/json-formatter">Free JSON Formatter</Link> â€” format API error responses for debugging</li>
            <li><Link href="/tools/ssl-checker">Free SSL Checker</Link> â€” check if HTTPS certificate issues are causing connection errors</li>
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
