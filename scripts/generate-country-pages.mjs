// Generates "Watch World Cup 2026 in <country>" static SEO pages.
//   public/world-cup-2026-iptv/<slug>/index.html
//   public/sitemap_countries.xml
// Run: node scripts/generate-country-pages.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const WC = join(ROOT, 'public', 'world-cup-2026-iptv')
const SITE = 'https://watchworldcup.us'
const WHATSAPP = '212723279328'
const TODAY = '2026-06-11'

const { countries } = JSON.parse(readFileSync(join(__dirname, 'wc2026-countries.json'), 'utf8'))

const GA = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-06ENLWJM67"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-06ENLWJM67');
    </script>`

const CSS = `
      :root{--bg:#0c0c0c;--card:#1e1e1e;--accent:#ff6b35;--accent2:#f7931e;--text:#fff;--muted:#a0a0a0;--border:#404040;--green:#25d366}
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
      a{color:inherit;text-decoration:none}
      .container{max-width:860px;margin:0 auto;padding:0 20px}
      .topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;max-width:1100px;margin:0 auto}
      .brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.1rem}
      .brand img{width:36px;height:36px;object-fit:contain;border-radius:8px}
      .brand b{color:var(--accent)}
      .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;border-radius:12px;font-weight:700;font-size:1rem;cursor:pointer;border:none;transition:all .25s ease}
      .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 10px 30px rgba(255,107,53,.35)}
      .btn-primary:hover{transform:translateY(-3px)}
      .btn-wa{background:var(--green);color:#fff;box-shadow:0 10px 30px rgba(37,211,102,.3)}
      .btn-wa:hover{transform:translateY(-3px)}
      .btn-sm{padding:10px 20px;font-size:.9rem}
      .hero{text-align:center;padding:48px 20px 40px;background:radial-gradient(900px 400px at 50% -10%,rgba(255,107,53,.16),transparent 60%)}
      .pill{display:inline-flex;align-items:center;gap:8px;background:rgba(255,107,53,.12);border:1px solid rgba(255,107,53,.4);color:#ffd0bb;padding:7px 15px;border-radius:999px;font-size:.82rem;font-weight:600;margin-bottom:20px}
      h1{font-size:2.3rem;font-weight:900;line-height:1.12;letter-spacing:-.5px;margin-bottom:14px}
      h1 .grad{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      .meta{color:var(--muted);font-size:1rem;margin-bottom:26px}
      .meta b{color:#fff}
      .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
      .trust{color:var(--muted);font-size:.85rem}
      .interlink{margin-top:14px;font-size:.9rem}
      .interlink a{color:var(--accent);font-weight:600}
      section{padding:30px 0}
      h2{font-size:1.45rem;font-weight:800;margin-bottom:14px}
      h2 .grad{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      p.body{color:var(--muted);margin-bottom:14px}
      .callout{background:var(--card);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:10px;padding:16px 18px;color:#ddd;margin-bottom:8px}
      ul.checks{list-style:none}
      ul.checks li{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;color:#ddd}
      ul.checks li::before{content:'✓';color:var(--accent);font-weight:900}
      .faq details{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:10px;overflow:hidden}
      .faq summary{padding:15px 18px;font-weight:700;cursor:pointer;font-size:.98rem}
      .faq p{padding:0 18px 16px;color:var(--muted);font-size:.95rem}
      .links{display:flex;flex-wrap:wrap;gap:8px}
      .links a{background:var(--card);border:1px solid var(--border);border-radius:999px;padding:8px 16px;font-size:.85rem;color:#ddd;transition:all .2s}
      .links a:hover{border-color:var(--accent);color:#fff}
      footer{border-top:1px solid var(--border);padding:28px 20px;text-align:center;color:var(--muted);font-size:.85rem;margin-top:30px}
      footer a{color:var(--accent)}
      .sticky-cta{position:fixed;bottom:0;left:0;right:0;background:rgba(12,12,12,.97);border-top:1px solid var(--border);padding:11px 14px;display:none;gap:10px;z-index:999}
      .sticky-cta .btn{flex:1}
      @media(max-width:760px){h1{font-size:1.6rem}.sticky-cta{display:flex}body{padding-bottom:70px}}`

const head = (title, desc, canonical) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#ff6b35">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
${GA}
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${canonical}">
    <link rel="alternate" hreflang="x-default" href="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${SITE}/og-image.jpg">
    <meta property="og:site_name" content="WatchWorldCup">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap">
    <style>${CSS}</style>
</head>`

const topbar = `
    <div class="topbar">
        <a href="/" class="brand"><img src="/assets/logo.png" alt="Premium IPTV logo"><span>Watch<b>WorldCup</b></span></a>
        <a href="/checkout" class="btn btn-primary btn-sm">⚡ Subscribe</a>
    </div>`

const footer = `
    <footer>
        <p><a href="/world-cup-2026-iptv/">World Cup IPTV</a> · <a href="/world-cup-2026-iptv/matches/">All Matches</a> · <a href="/world-cup-2026-iptv/teams/">All Teams</a> · <a href="/blog">Blog</a></p>
        <p style="margin-top:8px">© 2026 Premium IPTV — Watch the FIFA World Cup 2026 live in 4K on any device.</p>
        <p style="margin-top:6px;font-size:.78rem">Independent streaming service. Not affiliated with or endorsed by FIFA. Broadcaster names are property of their owners and are listed for information only.</p>
    </footer>`

const stickyCta = (msg) => `
    <div class="sticky-cta">
        <a href="/checkout" class="btn btn-primary btn-sm">⚡ Subscribe</a>
        <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener" class="btn btn-wa btn-sm">WhatsApp</a>
    </div>`

const otherCountries = (slug) => countries.filter((c) => c.slug !== slug)

const countryPage = (c) => {
  const url = `${SITE}/world-cup-2026-iptv/${c.slug}/`
  const title = `Watch World Cup 2026 in ${c.shortName} — Every Match Live in 4K | WatchWorldCup`
  const desc = `How to watch the FIFA World Cup 2026 in ${c.shortName}: official TV is ${c.broadcasters.replace(/<[^>]+>/g, '')}. Stream all 104 matches live in 4K from $25 on Smart TV, Firestick, Android & iPhone.`
  const waMsg = `Hi! I want to watch the World Cup 2026 in ${c.shortName} live in 4K. Please help me subscribe.`
  const teamLinks = c.teams.map((t) => `<a href="/world-cup-2026-iptv/teams/${t.slug}/">${t.name}</a>`)
  const teamLine = c.teams.length
    ? `<p class="body">Following <strong>${c.teams.map((t) => t.name).join(' and ')}</strong> at the tournament? See their full schedule and how to watch every game: ${teamLinks.join(' · ')}.</p>`
    : `<p class="body">${c.shortName} aren't competing at the 2026 World Cup — but you can still follow every nation, every match, live in 4K. <a href="/world-cup-2026-iptv/teams/" style="color:var(--accent);font-weight:600">Browse all 48 teams →</a></p>`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description: desc, inLanguage: 'en',
        about: { '@type': 'SportsEvent', name: 'FIFA World Cup 2026', startDate: '2026-06-11', endDate: '2026-07-19' }
      },
      {
        '@type': 'Service', name: `Premium IPTV — World Cup 2026 in ${c.shortName}`, serviceType: 'IPTV Streaming Service',
        areaServed: { '@type': 'Country', name: c.shortName }, provider: { '@type': 'Organization', name: 'Premium IPTV', url: SITE },
        offers: { '@type': 'Offer', price: '25', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: `${SITE}/checkout` }
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'World Cup 2026 IPTV', item: `${SITE}/world-cup-2026-iptv/` },
          { '@type': 'ListItem', position: 3, name: `Watch in ${c.shortName}`, item: url }
        ]
      },
      {
        '@type': 'FAQPage', mainEntity: [
          { '@type': 'Question', name: `How can I watch the World Cup 2026 in ${c.shortName}?`, acceptedAnswer: { '@type': 'Answer', text: `In ${c.shortName} the official broadcasters are ${c.broadcasters.replace(/<[^>]+>/g, '')}. For every one of the 104 matches in 4K on any device, a Premium IPTV subscription starts at $25 and activates in 1–5 minutes.` } },
          { '@type': 'Question', name: `Which channels show the World Cup in ${c.shortName}?`, acceptedAnswer: { '@type': 'Answer', text: `The 2026 World Cup in ${c.shortName} is shown on ${c.broadcasters.replace(/<[^>]+>/g, '')}. Premium IPTV includes the channels carrying the tournament plus international feeds, all in 4K.` } },
          { '@type': 'Question', name: `Can I watch every match in 4K in ${c.shortName}?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. Premium IPTV streams all 104 World Cup 2026 matches in up to 4K/8K with a free VPN, so you can watch from ${c.shortName} or anywhere, on Smart TV, Firestick, Android or iPhone.` } }
        ]
      }
    ]
  }

  return `${head(title, desc, url)}
<body>
${topbar}
    <header class="hero">
        <div class="pill">⚽ World Cup 2026 · ${c.shortName} · June 11 – July 19</div>
        <h1>Watch the <span class="grad">World Cup 2026</span> in ${c.shortName} — Live in 4K</h1>
        <p class="meta">Every one of the <b>104 matches</b> live in 4K on any device — from <b>$25</b>, instant activation.</p>
        <div class="cta-row">
            <a href="/checkout" class="btn btn-primary">⚡ Get Instant Access — From $25</a>
            <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}" target="_blank" rel="noopener" class="btn btn-wa">Order on WhatsApp</a>
        </div>
        <p class="trust">Activation in 1–5 min · 4K/8K quality · Free VPN · Works on every device</p>
    </header>

    <div class="container">
        <section>
            <h2>Official World Cup TV in <span class="grad">${c.shortName}</span></h2>
            <div class="callout">In ${c.name}, the 2026 FIFA World Cup is broadcast on <strong>${c.broadcasters}</strong>.</div>
            <p class="body">${c.pitch}</p>
            ${teamLine}
        </section>

        <section>
            <h2>Watch Every Match With <span class="grad">Premium IPTV</span></h2>
            <ul class="checks">
                <li>All 104 World Cup 2026 matches live — group stage to the final on July 19</li>
                <li>Up to 4K / 8K Ultra HD with stable, buffer-free servers</li>
                <li>The channels showing the World Cup in ${c.shortName}, plus every international feed</li>
                <li>35,000+ live channels, 147,000 movies and 62,000 series included</li>
                <li>Free VPN — watch from ${c.shortName} or anywhere, no geo-blocks</li>
                <li>Works on Smart TV, Firestick, Android, iPhone, iPad and PC</li>
                <li>Instant activation: login by email within 1–5 minutes</li>
            </ul>
            <div class="cta-row" style="justify-content:flex-start;margin-top:8px">
                <a href="/checkout" class="btn btn-primary">⚡ Subscribe — From $25</a>
            </div>
        </section>

        <section class="faq">
            <h2>FAQ — World Cup 2026 in <span class="grad">${c.shortName}</span></h2>
            <details open><summary>How can I watch the World Cup 2026 in ${c.shortName}?</summary><p>Official coverage is on ${c.broadcasters.replace(/<[^>]+>/g, '')}. For all 104 matches in 4K on any device, subscribe to Premium IPTV from $25 — your login arrives in 1–5 minutes.</p></details>
            <details><summary>Is it in 4K?</summary><p>Yes, up to 4K/8K on supported channels. We recommend a 25 Mbps connection for 4K.</p></details>
            <details><summary>Which devices work?</summary><p>Smart TVs, Amazon Firestick, Apple TV, Android, iPhone, iPad, tablets and PCs — one subscription covers them all.</p></details>
            <details><summary>Can I watch from outside ${c.shortName}?</summary><p>Yes — a free VPN is included, so you can watch ${c.shortName}'s coverage and every other feed from anywhere in the world.</p></details>
        </section>

        <section>
            <h2>Watch in <span class="grad">Other Countries</span></h2>
            <div class="links">
                ${otherCountries(c.slug).map((o) => `<a href="/world-cup-2026-iptv/${o.slug}/">World Cup in ${o.shortName}</a>`).join('\n                ')}
                <a href="/world-cup-2026-iptv/matches/">Full schedule →</a>
                <a href="/world-cup-2026-iptv/teams/">All teams →</a>
                <a href="/world-cup-2026-iptv/">World Cup IPTV package →</a>
            </div>
        </section>
    </div>
${footer}
${stickyCta(waMsg)}
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
</body>
</html>
`
}

// ---- generate ----
let n = 0
for (const c of countries) {
  const dir = join(WC, c.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), countryPage(c))
  n++
}

const u = (loc, pr) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${pr}</priority>\n  </url>`
writeFileSync(join(ROOT, 'public', 'sitemap_countries.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${countries.map((c) => u(`${SITE}/world-cup-2026-iptv/${c.slug}/`, '0.8')).join('\n')}
</urlset>
`)

console.log(`Generated ${n} country pages + sitemap_countries.xml`)
