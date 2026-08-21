import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Check If a Website's SSL Certificate Is Valid (And What to Look For)",
  description:
    "A padlock icon doesn't mean a site is safe — it only means the connection is encrypted. Here's how to check an SSL certificate properly and what the fields mean.",
  path: "/blog/how-to-check-ssl-certificate",
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
            How to Check If a Website&apos;s SSL Certificate Is Valid (And What to Look For)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            A padlock icon only means the connection is encrypted — not that the site is
            trustworthy. Here&apos;s how to check what a certificate actually says and the fields
            that matter for security and trust.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What the padlock icon actually means</h2>
          <p>
            When you see a padlock in the browser address bar, it means the connection between
            your browser and the server is encrypted using TLS (Transport Layer Security).
            This prevents eavesdropping — your ISP, router, or anyone on the same Wi-Fi network
            cannot read the traffic.
          </p>
          <p>
            What it does not mean: that the site is legitimate, that the organization is who
            they say they are, or that you are on the right domain. A phishing site can have
            a perfectly valid SSL certificate — scammers get free certificates from Let&apos;s Encrypt
            just like legitimate sites do.
          </p>

          <h2>How to check an SSL certificate in the browser</h2>
          <ol>
            <li>Click the padlock icon (or the &quot;Not secure&quot; warning) in the address bar</li>
            <li>Click &quot;Connection is secure&quot; or &quot;Certificate is valid&quot;</li>
            <li>Click &quot;Certificate&quot; or &quot;More information&quot;</li>
            <li>You will see the certificate details panel</li>
          </ol>
          <p>
            In Chrome, click the padlock → &quot;Connection is secure&quot; → &quot;Certificate is valid.&quot;
            In Firefox, click the padlock → &quot;More information&quot; → &quot;View Certificate.&quot;
          </p>

          <h2>The fields that actually matter</h2>
          <p>
            <strong>Issued to (Subject):</strong> The domain name or organization the certificate
            was issued for. It must match the domain you are visiting exactly. Wildcards are allowed
            (*.example.com covers all subdomains).
          </p>
          <p>
            <strong>Issued by (Issuer):</strong> The Certificate Authority (CA) that vouched for
            the certificate. Trusted CAs include DigiCert, Sectigo, Let&apos;s Encrypt, GlobalSign.
            If you see an unknown issuer or &quot;Self-signed,&quot; the certificate has not been
            verified by any trusted authority.
          </p>
          <p>
            <strong>Valid from / Valid to:</strong> The certificate&apos;s validity period. An
            expired certificate means the connection is still encrypted but the identity verification
            has lapsed. Most browsers block access to sites with expired certificates.
          </p>
          <p>
            <strong>Certificate type:</strong>
          </p>
          <ul>
            <li><strong>DV (Domain Validation):</strong> only verifies domain ownership — easiest to get, used by most sites including Let&apos;s Encrypt</li>
            <li><strong>OV (Organization Validation):</strong> verifies the organization exists and owns the domain</li>
            <li><strong>EV (Extended Validation):</strong> most thorough verification — organization identity manually checked by the CA. Was shown with a green address bar in older browsers.</li>
          </ul>

          <h2>Using an SSL checker tool</h2>
          <p>
            For a technical check without navigating browser menus, the{" "}
            <Link href="/tools/ssl-checker">free SSL checker tool</Link> shows the full
            certificate chain, expiry date, protocol version, cipher suite, and any warnings —
            useful for checking your own site or a site you are about to integrate with.
          </p>
          <p>
            It shows:
          </p>
          <ul>
            <li>Certificate expiry date and days remaining</li>
            <li>Full certificate chain (root CA → intermediate → leaf)</li>
            <li>TLS protocol version (TLS 1.2 vs 1.3 — 1.3 is preferred)</li>
            <li>Whether the certificate covers www and non-www</li>
            <li>Subject Alternative Names (other domains covered)</li>
          </ul>

          <h2>Common SSL errors and what they mean</h2>
          <table>
            <thead>
              <tr>
                <th>Error</th>
                <th>Cause</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Certificate expired</td><td>Owner forgot to renew</td><td>Medium — encryption works but identity unverified</td></tr>
              <tr><td>Name mismatch</td><td>Certificate is for a different domain</td><td>High — possible redirect to wrong server</td></tr>
              <tr><td>Self-signed certificate</td><td>No CA verification</td><td>High on public sites, normal for internal tools</td></tr>
              <tr><td>Untrusted issuer</td><td>CA not in browser trust store</td><td>High — avoid</td></tr>
              <tr><td>Certificate revoked</td><td>CA invalidated the certificate</td><td>High — the domain&apos;s cert was compromised</td></tr>
            </tbody>
          </table>

          <h2>Setting a certificate expiry reminder</h2>
          <p>
            Let&apos;s Encrypt certificates expire every 90 days. Most hosting platforms auto-renew,
            but a misconfigured renewal job is a common source of outages. Set a calendar reminder
            30 days before expiry and check the{" "}
            <Link href="/tools/ssl-checker">SSL checker</Link> regularly for your own domains.
          </p>

          <h2>Summary</h2>
          <ul>
            <li>The padlock means encrypted — not trusted or legitimate</li>
            <li>Check: Issued to (matches domain?), Issued by (trusted CA?), Valid to (not expired?)</li>
            <li>DV certificates are fine for most sites — they prove domain ownership, not organization identity</li>
            <li>Use the <Link href="/tools/ssl-checker">free SSL checker</Link> to inspect any domain&apos;s full certificate chain</li>
          </ul>
        </div>
      </article>
    </main>
  )
}
