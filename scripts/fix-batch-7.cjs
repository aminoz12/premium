const fs = require('fs');

function replaceArticle(filePath, newArticle) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('RelatedTools')) {
    const firstNL = content.indexOf('\n');
    content = content.slice(0, firstNL + 1) +
      'import { RelatedTools } from "@/components/tools/related-tools"\n' +
      content.slice(firstNL + 1);
  }
  const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
  const articleStart = content.lastIndexOf('<article', techIdx);
  const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;
  console.log(filePath + ': replacing ' + articleStart + '-' + articleEnd + ' of ' + content.length);
  const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Done. Lines: ' + newContent.split('\n').length);
}

// ── 1. dns-lookup ─────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/dns-lookup/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="DNS Lookup Tool: Record Types, TTL, and How to Debug Propagation Issues" />
          <meta
            itemProp="description"
            content="What each DNS record type does, why DNS changes take time to propagate, and the two commands that tell you whether a change has reached a specific resolver."
          />
          <meta itemProp="datePublished" content="2024-03-12" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Record type reference */}
          <section aria-labelledby="record-types" className="space-y-4">
            <h2
              id="record-types"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              DNS record types and what they control
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Record</th>
                    <th className="border border-border p-2 text-left font-semibold">Points to</th>
                    <th className="border border-border p-2 text-left font-semibold">Common use</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['A', 'IPv4 address (e.g. 93.184.216.34)', 'Root domain and subdomains to a server'],
                    ['AAAA', 'IPv6 address', 'IPv6 server address — increasingly common with CDNs'],
                    ['CNAME', 'Another hostname', 'www → apex, or custom domain → CDN hostname'],
                    ['MX', 'Mail server hostname + priority', 'Email routing — required for receiving email'],
                    ['TXT', 'Arbitrary text', 'SPF, DKIM, DMARC, domain verification tokens'],
                    ['NS', 'Nameserver hostname', 'Delegates DNS authority to a specific provider'],
                    ['SOA', 'Zone metadata', 'Start of authority — read-only, set by registrar'],
                    ['CAA', 'Certificate Authority name', 'Restricts which CAs can issue SSL certs for the domain'],
                  ].map(([record, pointsTo, use]) => (
                    <tr key={record}>
                      <td className="border border-border p-2 font-mono text-xs font-bold text-foreground">{record}</td>
                      <td className="border border-border p-2 text-muted-foreground">{pointsTo}</td>
                      <td className="border border-border p-2 text-muted-foreground">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TTL and propagation */}
          <section
            aria-labelledby="ttl-propagation"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="ttl-propagation"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              TTL and why DNS propagation takes time
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              TTL (Time To Live) is the number of seconds a resolver caches your DNS record
              before re-querying the authoritative nameserver. A TTL of 3600 means resolvers
              keep your old record for up to one hour after you change it. This is why
              &quot;DNS propagation&quot; takes time — every recursive resolver worldwide has its own
              cache, and they expire independently.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Best practice before a planned DNS change: lower your TTL to 300 (5 minutes)
              at least 24 hours before making the change. After the change is verified, raise
              the TTL back to 3600 or higher. Lower TTL = more DNS queries (slightly more
              load) but faster propagation. Production A records typically run at 3600;
              records you change frequently (like CNAME for feature flags) can stay at 300.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              To check whether a DNS change has reached a specific resolver, use:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                dig @8.8.8.8 example.com A
              </code>{' '}
              (queries Google&apos;s resolver) or{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                dig @1.1.1.1 example.com A
              </code>{' '}
              (queries Cloudflare). Seeing different results from different resolvers is
              expected during propagation — it just means their caches haven&apos;t expired yet.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related network tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                  { name: "IP Lookup", path: "/tools/ip-lookup" },
                  { name: "Sitemap Generator", path: "/tools/sitemap-generator" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. ip-lookup ──────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/ip-lookup/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="IP Lookup: What Geolocation Data Is Accurate and What Isn't" />
          <meta
            itemProp="description"
            content="What IP geolocation can and cannot tell you, the accuracy gap between city-level and country-level data, and the two cases where IP lookup is the wrong tool."
          />
          <meta itemProp="datePublished" content="2024-03-18" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What IP geolocation is and isn't */}
          <section aria-labelledby="accuracy" className="space-y-4">
            <h2
              id="accuracy"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What IP geolocation data is actually accurate
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              IP geolocation maps an IP address to a geographic location using databases
              maintained by organizations like MaxMind and IPinfo. Accuracy varies by
              precision level: country-level accuracy is ~99.9% for most databases.
              Region/state accuracy is ~80–90%. City-level accuracy is 50–75% for consumer
              IPs — the city returned may be the nearest major city to the user&apos;s actual
              location, the city where their ISP&apos;s regional hub is, or a data center city
              that serves their area.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Corporate IPs (office networks, VPNs, cloud servers) are often geolocated
              to their ISP&apos;s headquarters, not the physical location of the user. Mobile
              carrier IPs frequently resolve to a carrier&apos;s regional gateway, not the
              device&apos;s city. For precise location, browser Geolocation API (which uses GPS
              + WiFi triangulation) is far more accurate than IP — but requires explicit
              user permission.
            </p>
          </section>

          {/* What this tool shows */}
          <section
            aria-labelledby="what-it-shows"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-it-shows"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What the lookup result tells you
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">ASN (Autonomous System Number)</span>
                <span>
                  Identifies the network operator — the ISP, cloud provider, or
                  organization that controls the IP range. Useful for identifying
                  data center IPs (AWS, Google Cloud, Cloudflare) vs. residential ISP IPs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Reverse DNS (PTR record)</span>
                <span>
                  The hostname associated with the IP, if configured. Mail servers
                  use this for spam checking — a sending IP without a PTR record is
                  treated as suspicious by many mail filters.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">IP type (residential vs. datacenter)</span>
                <span>
                  Geolocation databases flag known data center, VPN, proxy, and Tor
                  exit node IPs. Useful for fraud detection and access control,
                  but not foolproof — IP ranges shift between categories.
                </span>
              </li>
            </ul>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related network tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                  { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                  { name: "User Agent Parser", path: "/tools/user-agent-parser" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. ssl-checker ────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/ssl-checker/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="SSL Certificate Checker: What to Verify and the Expiry Alerts You Need" />
          <meta
            itemProp="description"
            content="What an SSL check tells you beyond just 'valid or not', the certificate chain issues that cause browser warnings, and how to set up expiry monitoring before it becomes a production incident."
          />
          <meta itemProp="datePublished" content="2024-03-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What to verify */}
          <section aria-labelledby="what-to-verify" className="space-y-4">
            <h2
              id="what-to-verify"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What to check beyond &quot;is it valid&quot;
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A certificate can be valid but still cause browser warnings or downtime.
              The five things to verify after issuing or renewing a cert:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Domain match</span>
                <span>
                  The certificate&apos;s Subject Alternative Names (SANs) must exactly
                  match the domain being served — including or excluding{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">www</code>.
                  A cert for{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">example.com</code>{' '}
                  does not cover{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">www.example.com</code>{' '}
                  unless listed separately or a wildcard cert is used.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Certificate chain</span>
                <span>
                  The server must send the complete chain: leaf cert + intermediate
                  CA cert(s). A missing intermediate causes browser warnings on some
                  clients even if the root CA is trusted. This is the most common
                  misconfiguration after cert renewal.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Expiry date</span>
                <span>
                  Let&apos;s Encrypt certificates expire every 90 days. Commercial certs
                  typically 1–2 years. Set a monitoring alert at 30 days before expiry —
                  browsers start showing &quot;Not Secure&quot; warnings when expiry is near.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Protocol and cipher</span>
                <span>
                  TLS 1.0 and 1.1 are deprecated and cause browser warnings in Chrome
                  and Firefox. Your server should offer TLS 1.2 minimum; TLS 1.3 is
                  preferred for performance (1 round-trip handshake vs. 2 for TLS 1.2).
                </span>
              </li>
            </ul>
          </section>

          {/* Expiry monitoring */}
          <section
            aria-labelledby="expiry-monitoring"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="expiry-monitoring"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How to monitor expiry automatically
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Manual checks miss renewals. Set up automated monitoring: most uptime
              monitoring services (UptimeRobot, Better Uptime, Checkly) include SSL
              expiry checks. Alternatively, run a cron job using{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                openssl s_client -connect example.com:443 | openssl x509 -noout -dates
              </code>{' '}
              and alert when the expiry date is within 30 days. For Let&apos;s Encrypt with
              Certbot, auto-renewal is enabled by default via a systemd timer or cron —
              verify it&apos;s running with{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">certbot renew --dry-run</code>.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related network tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                  { name: "IP Lookup", path: "/tools/ip-lookup" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. robots-txt ─────────────────────────────────────────────────────────────
replaceArticle('src/app/tools/robots-txt/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Robots.txt Generator: What Google Follows and What It Ignores" />
          <meta
            itemProp="description"
            content="How robots.txt actually works, the directives Google honors vs. ignores, and the two mistakes that accidentally block your entire site."
          />
          <meta itemProp="datePublished" content="2024-03-28" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How robots.txt actually works — and what it doesn&apos;t do
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Robots.txt is a voluntary signal, not a security mechanism. Well-behaved
              crawlers (Googlebot, Bingbot, Twitterbot) check it before crawling. Bad
              actors and scrapers ignore it entirely. If a URL is disallowed in robots.txt
              but linked from other pages, Google may still show the URL in search results
              (as a URL with no title or snippet) — disallowing doesn&apos;t prevent indexing,
              it prevents crawling. To prevent indexing, use a{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">noindex</code>{' '}
              meta tag on the page itself.
            </p>
          </section>

          {/* What Google honors */}
          <section
            aria-labelledby="what-google-honors"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-google-honors"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Directives Google honors vs. ignores
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Directive</th>
                    <th className="border border-border p-2 text-left font-semibold">Google honors it?</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['User-agent', 'Yes', 'Wildcard (*) covers all bots; Googlebot is case-sensitive'],
                    ['Disallow', 'Yes', 'Blocks crawling of the path; empty value = allow all'],
                    ['Allow', 'Yes', 'Overrides Disallow for a sub-path; useful for /path/* exceptions'],
                    ['Sitemap', 'Yes', 'Absolute URL to sitemap.xml — recommended to include here'],
                    ['Crawl-delay', 'No', 'Google ignores this; use Google Search Console rate limiting instead'],
                    ['Noindex', 'Deprecated', 'Google dropped support in 2019; use meta noindex tag instead'],
                    ['Host', 'No', 'Not recognized by Google; use canonical tags for domain preference'],
                  ].map(([directive, honored, notes]) => (
                    <tr key={directive}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{directive}</td>
                      <td className={\`border border-border p-2 font-medium \${honored === 'Yes' ? 'text-green-600' : honored === 'No' ? 'text-red-600' : 'text-yellow-600'}\`}>{honored}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="common-mistakes" className="space-y-4">
            <h2
              id="common-mistakes"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Two mistakes that block your entire site
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Disallow: /</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">Disallow: /</code>{' '}
                  under{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">User-agent: *</code>{' '}
                  blocks every crawler from every page. This is the correct robots.txt
                  for a staging server, but if accidentally deployed to production it
                  removes your entire site from search results within days. Always
                  verify after deployment.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Blocking CSS and JS files</span>
                <span>
                  If your robots.txt blocks{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/static/</code>{' '}
                  or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/_next/</code>,
                  Google can&apos;t render your pages — it sees unstyled HTML and scores
                  them as low quality. Googlebot must be able to crawl CSS, JS, and
                  font files to render the page the same way a user sees it.
                </span>
              </li>
            </ul>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related SEO tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Sitemap Generator", path: "/tools/sitemap-generator" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                  { name: "SSL Certificate Checker", path: "/tools/ssl-checker" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. sitemap-generator ──────────────────────────────────────────────────────
replaceArticle('src/app/tools/sitemap-generator/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="XML Sitemap Generator: What Google Uses and What It Ignores" />
          <meta
            itemProp="description"
            content="What a sitemap tells Google, which optional tags are actually used, and when a sitemap matters vs. when it doesn't."
          />
          <meta itemProp="datePublished" content="2024-04-02" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* When a sitemap matters */}
          <section aria-labelledby="when-it-matters" className="space-y-4">
            <h2
              id="when-it-matters"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When a sitemap actually helps — and when it doesn&apos;t
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A sitemap helps Google discover URLs it might not find through crawling.
              It&apos;s most valuable for: large sites (1,000+ pages) where crawl budget
              matters, sites with pages that aren&apos;t well-linked internally, and new sites
              with few external backlinks. For a small site with strong internal linking,
              Googlebot will typically discover all pages through crawling anyway — a
              sitemap speeds up initial indexing but isn&apos;t the difference between getting
              indexed or not.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Submitting a sitemap in Google Search Console is the most reliable way to
              verify that Google has it. The console shows how many URLs Google has
              discovered vs. how many you submitted — a gap here indicates crawling
              or indexing issues worth investigating.
            </p>
          </section>

          {/* What Google uses */}
          <section
            aria-labelledby="what-google-uses"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="what-google-uses"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Which sitemap fields Google actually uses
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Tag</th>
                    <th className="border border-border p-2 text-left font-semibold">Google uses it?</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['<loc>', 'Yes — required', 'The URL. Must be absolute, including protocol and www/no-www consistently'],
                    ['<lastmod>', 'Sometimes', 'Used to prioritize recrawl of recently changed pages. Format: YYYY-MM-DD'],
                    ['<changefreq>', 'Ignored', 'Google documented in 2023 that it ignores this field'],
                    ['<priority>', 'Ignored', 'Google documented in 2023 that it ignores this field'],
                    ['<image:image>', 'Yes', 'Required for image search indexing if images are not otherwise linked'],
                    ['<video:video>', 'Yes', 'Helps Google understand video content; requires duration and thumbnail URL'],
                    ['<xhtml:link>', 'Yes', 'hreflang for multilingual sites — specify alternate language URLs here'],
                  ].map(([tag, used, notes]) => (
                    <tr key={tag}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{tag}</td>
                      <td className={\`border border-border p-2 font-medium \${used.startsWith('Yes') ? 'text-green-600' : used === 'Ignored' ? 'text-red-600' : 'text-yellow-600'}\`}>{used}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sitemap index */}
          <section aria-labelledby="sitemap-index" className="space-y-4">
            <h2
              id="sitemap-index"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Sitemap index for large sites
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A single sitemap file is limited to 50,000 URLs and 50 MB uncompressed.
              Sites above this threshold use a sitemap index file — an XML file that
              lists multiple sitemap files. Each sub-sitemap can cover a section of the
              site (e.g., one for blog posts, one for product pages, one for category pages).
              This also makes it easier to see in Search Console which sections are being
              indexed vs. which have coverage issues.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related SEO tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Robots.txt Generator", path: "/tools/robots-txt" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                  { name: "DNS Lookup", path: "/tools/dns-lookup" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');
