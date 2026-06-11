// Generates static SEO match pages for World Cup 2026 from wc2026-fixtures.json
// Output: public/world-cup-2026-iptv/matches/<slug>/index.html
//         public/world-cup-2026-iptv/matches/index.html  (all-matches hub)
//         public/sitemap_matches.xml
// Run: node scripts/generate-match-pages.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'world-cup-2026-iptv', 'matches')
const SITE = 'https://watchworldcup.us'
const WHATSAPP = '212723279328'
const TODAY = '2026-06-11'

const { matches } = JSON.parse(readFileSync(join(__dirname, 'wc2026-fixtures.json'), 'utf8'))

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const matchSlug = (m) => `${slugify(m.home)}-vs-${slugify(m.away)}`
const prettyDate = (iso) => {
  const [y, mo, d] = iso.split('-').map(Number)
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return `${months[mo - 1]} ${d}, ${y}`
}

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
      h1{font-size:2.4rem;font-weight:900;line-height:1.12;letter-spacing:-.5px;margin-bottom:14px}
      h1 .grad{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      .meta{color:var(--muted);font-size:1rem;margin-bottom:26px}
      .meta b{color:#fff}
      .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
      .trust{color:var(--muted);font-size:.85rem}
      section{padding:34px 0}
      h2{font-size:1.5rem;font-weight:800;margin-bottom:16px}
      h2 .grad{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      ul.checks{list-style:none}
      ul.checks li{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;color:#ddd}
      ul.checks li::before{content:'✓';color:var(--accent);font-weight:900}
      .faq details{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:10px;overflow:hidden}
      .faq summary{padding:15px 18px;font-weight:700;cursor:pointer;font-size:.98rem}
      .faq p{padding:0 18px 16px;color:var(--muted);font-size:.95rem}
      .links{display:flex;flex-wrap:wrap;gap:8px}
      .links a{background:var(--card);border:1px solid var(--border);border-radius:999px;padding:8px 16px;font-size:.85rem;color:#ddd;transition:all .2s}
      .links a:hover{border-color:var(--accent);color:#fff}
      table{width:100%;border-collapse:collapse;font-size:.92rem}
      th,td{padding:11px 12px;text-align:left;border-bottom:1px solid var(--border)}
      th{color:var(--accent);text-transform:uppercase;font-size:.75rem;letter-spacing:.5px}
      td a{color:var(--accent);font-weight:600}
      footer{border-top:1px solid var(--border);padding:28px 20px;text-align:center;color:var(--muted);font-size:.85rem;margin-top:30px}
      .sticky-cta{position:fixed;bottom:0;left:0;right:0;background:rgba(12,12,12,.97);border-top:1px solid var(--border);padding:11px 14px;display:none;gap:10px;z-index:999}
      .sticky-cta .btn{flex:1}
      @media(max-width:760px){h1{font-size:1.7rem}.sticky-cta{display:flex}body{padding-bottom:70px}}`

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
        <p>© 2026 Premium IPTV — Watch the FIFA World Cup 2026 live in 4K on any device.</p>
        <p style="margin-top:6px;font-size:.78rem">Independent streaming service. Not affiliated with or endorsed by FIFA.</p>
    </footer>`

const stickyCta = (msg) => `
    <div class="sticky-cta">
        <a href="/checkout" class="btn btn-primary btn-sm">⚡ Subscribe</a>
        <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener" class="btn btn-wa btn-sm">WhatsApp</a>
    </div>`

const matchPage = (m) => {
  const slug = matchSlug(m)
  const url = `${SITE}/world-cup-2026-iptv/matches/${slug}/`
  const vs = `${m.home} vs ${m.away}`
  const date = prettyDate(m.date)
  const title = `${vs} Live Stream in 4K — World Cup 2026 (${date}) | WatchWorldCup`
  const desc = `Watch ${vs} live in 4K — FIFA World Cup 2026 Group ${m.group}, ${date} in ${m.city}. Stream on Smart TV, Firestick, Android & iPhone. Instant IPTV activation from $25.`
  const waMsg = `Hi! I want to watch ${vs} (World Cup 2026) live in 4K. Please help me subscribe.`
  const sameGroup = matches.filter((x) => x.group === m.group && matchSlug(x) !== slug)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SportsEvent',
        '@id': `${url}#event`,
        name: `${vs} — FIFA World Cup 2026 Group ${m.group}`,
        description: desc,
        startDate: m.date,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        sport: 'Football',
        competitor: [
          { '@type': 'SportsTeam', name: m.home },
          { '@type': 'SportsTeam', name: m.away }
        ],
        location: { '@type': 'Place', name: m.city },
        organizer: { '@type': 'Organization', name: 'FIFA' },
        offers: {
          '@type': 'Offer',
          name: 'Premium IPTV World Cup Package',
          price: '25', priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${SITE}/checkout`
        }
      },
      {
        '@type': 'BroadcastEvent',
        isLiveBroadcast: true,
        videoFormat: '4K',
        broadcastOfEvent: { '@id': `${url}#event` },
        startDate: m.date
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'World Cup 2026 IPTV', item: `${SITE}/world-cup-2026-iptv/` },
          { '@type': 'ListItem', position: 3, name: 'Matches', item: `${SITE}/world-cup-2026-iptv/matches/` },
          { '@type': 'ListItem', position: 4, name: vs, item: url }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How can I watch ${vs} live?`,
            acceptedAnswer: { '@type': 'Answer', text: `You can watch ${vs} live in 4K with a Premium IPTV subscription from $25. The match is played on ${date} in ${m.city} (World Cup 2026 Group ${m.group}). Activation takes 1–5 minutes — works on Smart TV, Firestick, Android and iPhone.` }
          },
          {
            '@type': 'Question',
            name: `Can I stream ${vs} in 4K?`,
            acceptedAnswer: { '@type': 'Answer', text: `Yes. Premium IPTV streams every FIFA World Cup 2026 match, including ${vs}, in up to 4K/8K quality with stable, buffer-free servers and a free VPN included.` }
          },
          {
            '@type': 'Question',
            name: `What devices can I use to watch ${vs}?`,
            acceptedAnswer: { '@type': 'Answer', text: `Smart TVs (Samsung, LG, Android TV), Amazon Firestick, Apple TV, iPhone, iPad, Android phones, tablets and PCs. One subscription covers the full tournament — all 104 matches.` }
          }
        ]
      }
    ]
  }

  return `${head(title, desc, url)}
<body>
${topbar}
    <header class="hero">
        <div class="pill">⚽ World Cup 2026 · Group ${m.group} · ${date}</div>
        <h1>Watch <span class="grad">${vs}</span> Live in 4K</h1>
        <p class="meta"><b>${date}</b> · ${m.city} · FIFA World Cup 2026 — Group ${m.group}</p>
        <div class="cta-row">
            <a href="/checkout" class="btn btn-primary">⚡ Get Instant Access — From $25</a>
            <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}" target="_blank" rel="noopener" class="btn btn-wa">Order on WhatsApp</a>
        </div>
        <p class="trust">Activation in 1–5 min · 4K/8K quality · Free VPN · All 104 matches included</p>
    </header>

    <div class="container">
        <section>
            <h2>How to Watch <span class="grad">${vs}</span></h2>
            <p style="color:var(--muted);margin-bottom:16px">${m.home} face ${m.away} on ${date} in ${m.city}, in Group ${m.group} of the FIFA World Cup 2026. With Premium IPTV you stream it live in crystal-clear 4K — plus every other match of the tournament — on any device, from anywhere in the world.</p>
            <ul class="checks">
                <li>Every World Cup 2026 match live — group stage to the final on July 19</li>
                <li>4K / 8K Ultra HD quality with buffer-free, stable servers</li>
                <li>Commentary in English, French, Spanish, German, Arabic and more</li>
                <li>Works on Smart TV, Firestick, Android, iPhone, iPad and PC</li>
                <li>Free VPN included — watch from any country, no geo-blocks</li>
                <li>Instant activation: login details by email within 1–5 minutes</li>
            </ul>
        </section>

        <section class="faq">
            <h2>FAQ — <span class="grad">${vs}</span></h2>
            <details open><summary>How can I watch ${vs} live?</summary><p>Subscribe to Premium IPTV (from $25), receive your login in 1–5 minutes, open any IPTV app on your device and watch ${vs} live in 4K on ${date}.</p></details>
            <details><summary>Can I stream it in 4K?</summary><p>Yes — every World Cup 2026 match streams in up to 4K/8K on supported channels. We recommend a 25 Mbps connection for 4K.</p></details>
            <details><summary>Which devices are supported?</summary><p>Smart TVs, Amazon Firestick, Apple TV, Android, iPhone, iPad, tablets and PCs. One subscription, all your devices.</p></details>
        </section>

        <section>
            <h2>More Group ${m.group} <span class="grad">Matches</span></h2>
            <div class="links">
                ${sameGroup.map((x) => `<a href="/world-cup-2026-iptv/matches/${matchSlug(x)}/">${x.home} vs ${x.away} · ${prettyDate(x.date).replace(', 2026', '')}</a>`).join('\n                ')}
                <a href="/world-cup-2026-iptv/matches/">All 2026 matches →</a>
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

const indexPage = () => {
  const url = `${SITE}/world-cup-2026-iptv/matches/`
  const title = 'World Cup 2026 Match Schedule — Watch Every Game Live in 4K | WatchWorldCup'
  const desc = 'Full FIFA World Cup 2026 match schedule with live 4K streams for every game. All 72 group-stage fixtures June 11–27, then knockouts to the final on July 19. From $25.'
  const byDate = [...matches].sort((a, b) => a.date.localeCompare(b.date) || a.group.localeCompare(b.group))

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'FIFA World Cup 2026 Group Stage Matches',
        numberOfItems: matches.length,
        itemListElement: byDate.map((m, i) => ({
          '@type': 'ListItem', position: i + 1,
          name: `${m.home} vs ${m.away}`,
          url: `${SITE}/world-cup-2026-iptv/matches/${matchSlug(m)}/`
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'World Cup 2026 IPTV', item: `${SITE}/world-cup-2026-iptv/` },
          { '@type': 'ListItem', position: 3, name: 'Matches', item: url }
        ]
      }
    ]
  }

  const rows = byDate.map((m) => `<tr><td>${prettyDate(m.date).replace(', 2026', '')}</td><td><a href="/world-cup-2026-iptv/matches/${matchSlug(m)}/">${m.home} vs ${m.away}</a></td><td>Group ${m.group}</td><td>${m.city}</td></tr>`).join('\n                ')

  return `${head(title, desc, url)}
<body>
${topbar}
    <header class="hero">
        <div class="pill">⚽ FIFA World Cup 2026 · June 11 – July 19</div>
        <h1>World Cup 2026 <span class="grad">Match Schedule</span> — Watch Live in 4K</h1>
        <p class="meta">Every fixture, every group, every goal. One subscription covers <b>all 104 matches</b>.</p>
        <div class="cta-row">
            <a href="/checkout" class="btn btn-primary">⚡ Get Instant Access — From $25</a>
            <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi! I want to watch the World Cup 2026 live in 4K.')}" target="_blank" rel="noopener" class="btn btn-wa">Order on WhatsApp</a>
        </div>
    </header>
    <div class="container">
        <section>
            <h2>Group Stage <span class="grad">Fixtures</span> (June 11–27)</h2>
            <div style="overflow-x:auto;border:1px solid var(--border);border-radius:12px">
            <table>
                <thead><tr><th>Date</th><th>Match</th><th>Group</th><th>City</th></tr></thead>
                <tbody>
                ${rows}
                </tbody>
            </table>
            </div>
            <p style="color:var(--muted);margin-top:14px;font-size:.9rem">Knockout rounds (Round of 32 from June 28 to the Final on July 19 at MetLife Stadium) are added as pairings are confirmed. Every knockout match is included in your subscription.</p>
        </section>
        <section>
            <h2>Why Fans Watch With <span class="grad">Premium IPTV</span></h2>
            <ul class="checks">
                <li>All 104 World Cup matches live in 4K/8K — no blackouts, no regional limits</li>
                <li>35,000+ channels, 147,000 movies and 62,000 series included</li>
                <li>Free VPN, instant activation, 24/7 WhatsApp support</li>
                <li>Works on Smart TV, Firestick, Android, iPhone, iPad and PC</li>
            </ul>
            <p style="margin-top:18px"><a href="/world-cup-2026-iptv/" style="color:var(--accent);font-weight:700">See the full World Cup IPTV package →</a></p>
        </section>
    </div>
${footer}
${stickyCta('Hi! I want a World Cup 2026 IPTV subscription.')}
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
</body>
</html>
`
}

// ---- generate ----
mkdirSync(OUT, { recursive: true })

let count = 0
for (const m of matches) {
  const dir = join(OUT, matchSlug(m))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), matchPage(m))
  count++
}
writeFileSync(join(OUT, 'index.html'), indexPage())

// sitemap
const urls = [
  `  <url>\n    <loc>${SITE}/world-cup-2026-iptv/matches/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
  ...matches.map((m) => `  <url>\n    <loc>${SITE}/world-cup-2026-iptv/matches/${matchSlug(m)}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`)
]
writeFileSync(join(ROOT, 'public', 'sitemap_matches.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`)

console.log(`Generated ${count} match pages + matches index + sitemap_matches.xml`)
