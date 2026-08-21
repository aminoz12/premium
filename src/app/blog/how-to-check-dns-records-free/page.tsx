import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Check DNS Records Online for Free (A, CNAME, MX, TXT Explained)",
  description:
    "DNS records control where your domain points, email delivery, and domain verification. Here's how to look up any record type and what each one does.",
  path: "/blog/how-to-check-dns-records-free",
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
            <span>6 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Check DNS Records Online for Free (A, CNAME, MX, TXT Explained)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            DNS records control where your domain points, how email is routed, and how services
            verify domain ownership. Here&apos;s how to look up any record and what each type means.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>How to look up DNS records for any domain</h2>
          <p>
            Use the <Link href="/tools/dns-lookup">free DNS lookup tool</Link> — enter any
            domain name and select the record type you want to check. Results show the current
            live DNS values as seen from public DNS servers. No account required.
          </p>

          <h2>DNS record types explained</h2>
          <h3>A record (Address)</h3>
          <p>
            Maps a domain to an IPv4 address. This is the most fundamental record — it says
            &quot;example.com points to IP address 93.184.216.34.&quot;
          </p>
          <p>
            <strong>Check this when:</strong> a domain is not loading, you recently changed
            hosting, or you want to verify where a domain resolves.
          </p>

          <h3>AAAA record</h3>
          <p>
            Like an A record but for IPv6 addresses. Modern sites serve both A and AAAA records
            for full IPv4 and IPv6 compatibility.
          </p>

          <h3>CNAME record (Canonical Name)</h3>
          <p>
            Points a subdomain to another domain name (not an IP address). Example:
            <code>www.example.com</code> CNAME → <code>example.com</code>. Used extensively
            by CDNs (Cloudflare, Fastly), hosting platforms, and services like Shopify and
            Squarespace to route your subdomain through their infrastructure.
          </p>
          <p>
            <strong>Check this when:</strong> a subdomain is not working after adding a service,
            or you need to verify a CDN configuration.
          </p>

          <h3>MX record (Mail Exchange)</h3>
          <p>
            Specifies which mail servers handle email for the domain. MX records have a priority
            number — lower number = higher priority. Example:
          </p>
          <pre><code>{`10 mail1.example.com
20 mail2.example.com (backup)`}</code></pre>
          <p>
            <strong>Check this when:</strong> email is not delivering, you have migrated email
            providers, or you need to verify your email hosting setup (Google Workspace,
            Microsoft 365, etc.).
          </p>

          <h3>TXT record</h3>
          <p>
            Text records that store arbitrary string data. Used for many purposes:
          </p>
          <ul>
            <li><strong>SPF:</strong> lists authorized mail servers to prevent email spoofing</li>
            <li><strong>DKIM:</strong> stores a public key for cryptographic email signing</li>
            <li><strong>DMARC:</strong> email authentication policy</li>
            <li><strong>Domain verification:</strong> Google Search Console, Microsoft 365, Stripe, and many services ask you to add a TXT record to prove domain ownership</li>
          </ul>
          <p>
            <strong>Check this when:</strong> verifying email authentication, troubleshooting
            email deliverability, or confirming a domain verification record was added correctly.
          </p>

          <h3>NS record (Name Server)</h3>
          <p>
            Specifies which DNS servers are authoritative for the domain — i.e., which servers
            hold the actual DNS records. Changing your hosting or DNS provider involves updating NS
            records.
          </p>
          <p>
            <strong>Check this when:</strong> diagnosing why DNS changes are not propagating, or
            verifying which DNS provider controls a domain.
          </p>

          <h2>DNS propagation</h2>
          <p>
            When you change a DNS record, the change does not take effect everywhere immediately.
            DNS records have a TTL (Time To Live) — the number of seconds other DNS servers cache
            the record before checking again. A TTL of 3600 means the old record may be cached
            for up to one hour after you change it.
          </p>
          <p>
            Global propagation — the change being visible from most DNS resolvers worldwide —
            takes 1–48 hours depending on TTL settings and resolver refresh schedules.
          </p>
          <p>
            The DNS lookup tool shows the current value from the authoritative name server, which
            updates immediately after a change — even before propagation completes everywhere.
          </p>

          <h2>Common DNS debugging scenarios</h2>
          <table>
            <thead>
              <tr><th>Problem</th><th>Record to check</th></tr>
            </thead>
            <tbody>
              <tr><td>Website not loading</td><td>A record — does it point to the right IP?</td></tr>
              <tr><td>Email not receiving</td><td>MX record — is it set correctly?</td></tr>
              <tr><td>Email going to spam</td><td>TXT record — are SPF, DKIM, DMARC set?</td></tr>
              <tr><td>Subdomain not working</td><td>CNAME record — does it point to the right target?</td></tr>
              <tr><td>Domain verification failing</td><td>TXT record — was the verification string added?</td></tr>
            </tbody>
          </table>

          <h2>Summary</h2>
          <p>
            Check any DNS record with the{" "}
            <Link href="/tools/dns-lookup">free DNS lookup tool</Link> — no account.
            A records control where domains point. MX records control email routing. TXT records
            handle verification and email authentication. CNAME records alias subdomains. Allow
            1–48 hours after a change for full global propagation.
          </p>
        </div>
      </article>
    </main>
  )
}
