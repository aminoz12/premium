import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Check if a Website Is Down for Everyone or Just You",
  description:
    "When a site won't load, is it down everywhere or just for you? Here's how to diagnose in 60 seconds and what the different failure modes mean.",
  path: "/blog/how-to-check-if-website-is-down",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-31" />
        <meta itemProp="dateModified" content="2026-05-31" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-31">May 31, 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Check if a Website Is Down for Everyone or Just You
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Before spending an hour debugging a site that is actually fine, check whether the
            problem is on their end or yours. Here&apos;s the 60-second diagnosis workflow.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>The fastest check</h2>
          <ol>
            <li>Go to <strong>downforeveryoneorjustme.com</strong> or <strong>isup.me</strong></li>
            <li>Enter the domain</li>
            <li>If it says &quot;It&apos;s not just you&quot; — the site is down globally. Wait.</li>
            <li>If it says &quot;It&apos;s just you&quot; — the site is up. Your connection or local DNS is the problem.</li>
          </ol>

          <h2>Diagnosing &quot;it&apos;s just you&quot; — five causes</h2>
          <h3>1. DNS cache</h3>
          <p>
            Your computer caches DNS lookups to avoid repeated lookups. An old cached IP can send
            you to a server that no longer exists or has moved.
          </p>
          <p>Fix: flush your DNS cache.</p>
          <ul>
            <li>Windows: <code>ipconfig /flushdns</code></li>
            <li>Mac: <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code></li>
            <li>Chrome: navigate to <code>chrome://net-internals/#dns</code> → Clear host cache</li>
          </ul>

          <h3>2. Browser cache</h3>
          <p>
            A cached broken response or redirect can block the site. Open an incognito window and
            try the URL there. If it loads, the issue is browser cache — clear it with Ctrl+Shift+Delete.
          </p>

          <h3>3. ISP or DNS resolver</h3>
          <p>
            Your ISP&apos;s DNS resolver may have a stale or incorrect record. Try a different DNS:
          </p>
          <ul>
            <li>Change your DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1) temporarily</li>
            <li>Or try the URL on your phone&apos;s mobile data (which uses a different DNS and network)</li>
          </ul>
          <p>
            Check DNS records for the domain with the{" "}
            <Link href="/tools/dns-lookup">free DNS lookup tool</Link> to see if they resolve
            correctly.
          </p>

          <h3>4. Your firewall or security software</h3>
          <p>
            Antivirus, corporate firewalls, or parental controls can block specific domains or
            categories. Temporarily disabling security software for a test tells you if it&apos;s
            the cause.
          </p>

          <h3>5. Geographic restriction or CDN routing</h3>
          <p>
            Some sites restrict access by country (geo-blocking) or have CDN nodes that are down
            in specific regions. A site accessible in the US may be unavailable in Europe at the
            same time. A VPN can test whether it&apos;s a regional issue.
          </p>

          <h2>Diagnosing &quot;it&apos;s down globally&quot;</h2>
          <p>
            If the site is down for everyone, the causes are typically:
          </p>
          <ul>
            <li><strong>Server outage:</strong> hosting provider issue, out of resources, or crashed server</li>
            <li><strong>Expired SSL certificate:</strong> browsers block sites with expired certs even if the server is running — check with the <Link href="/tools/ssl-checker">SSL checker</Link></li>
            <li><strong>DNS misconfiguration:</strong> the domain&apos;s DNS records point to the wrong server or expired</li>
            <li><strong>DDoS attack:</strong> the server is overwhelmed by malicious traffic</li>
            <li><strong>Domain expiry:</strong> the domain registration lapsed</li>
          </ul>

          <h2>For site owners: quick health checks</h2>
          <p>
            If it is your own site that is down, check in this order:
          </p>
          <ol>
            <li><Link href="/tools/ssl-checker">SSL certificate</Link> — is it valid and not expired?</li>
            <li><Link href="/tools/dns-lookup">DNS records</Link> — does the A record point to the correct IP?</li>
            <li>Server status — is the hosting provider reporting an outage?</li>
            <li>HTTP status — does the server return a 200 or an error code?</li>
          </ol>

          <h2>HTTP status codes you might see</h2>
          <table>
            <thead>
              <tr><th>Status</th><th>Meaning</th></tr>
            </thead>
            <tbody>
              <tr><td>200 OK</td><td>Working normally</td></tr>
              <tr><td>301/302</td><td>Redirect — may loop or point to wrong destination</td></tr>
              <tr><td>403 Forbidden</td><td>Server is up but blocking access (IP ban, auth required)</td></tr>
              <tr><td>404 Not Found</td><td>Server is up, URL doesn&apos;t exist</td></tr>
              <tr><td>500 Server Error</td><td>Server is up, application crashed</td></tr>
              <tr><td>502/503/504</td><td>Server is overloaded or upstream is down</td></tr>
            </tbody>
          </table>

          <h2>Summary</h2>
          <p>
            Check <em>downforeveryoneorjustme.com</em> first. If it&apos;s just you: flush DNS cache,
            try incognito, try mobile data. If it&apos;s globally down: wait, check your hosting provider
            status page, verify SSL and DNS with the free tools. For site owners, check SSL first —
            expired certificates are one of the most common causes of &quot;site is down&quot; reports.
          </p>
        </div>
      </article>
    </main>
  )
}
