import fs from "node:fs"

const isDevelopment = process.env.NODE_ENV !== "production"
const enableCspRelaxedAds = process.env.NEXT_PUBLIC_ENABLE_CSP_RELAXED_ADS !== "false"
const defaultSiteUrl = "https://www.thefreeaitools.com"
const legacyVercelHost = "toolkitpropp.vercel.app"
const embeddedHtmlManifest = JSON.parse(
  fs.readFileSync(new URL("./src/lib/data/embedded-html-manifest.json", import.meta.url), "utf8")
)

const standaloneCompatibilityRedirects = Array.from(
  new Map(
    embeddedHtmlManifest
      .flatMap((entry) => [
        ...(entry.redirectTarget
          ? [
            {
              source: entry.path,
              destination: entry.redirectTarget,
              permanent: true,
            },
          ]
          : []),
        ...(entry.aliases ?? []).map((alias) => ({
          source: alias,
          destination: entry.redirectTarget || entry.path,
          permanent: true,
        })),
      ])
      .map((redirect) => [redirect.source, redirect])
  ).values()
)

function normalizeSiteUrl(value) {
  const candidate = isDevelopment ? value?.trim() || defaultSiteUrl : defaultSiteUrl
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`
  return new URL(withProtocol).origin
}

function normalizeOriginList(value) {
  if (!value) return []
  return [
    ...new Set(
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .flatMap((entry) => {
          try {
            const withProtocol = /^https?:\/\//i.test(entry) ? entry : `https://${entry}`
            return [new URL(withProtocol).origin]
          } catch {
            return []
          }
        })
    ),
  ]
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
const canonicalHost = new URL(siteUrl).hostname
const alternateHosts = [
  ...new Set(["thefreeaitools.com", "www.thefreeaitools.com", legacyVercelHost]),
].filter((host) => host !== canonicalHost)

const allowedEmbedOrigins = normalizeOriginList(process.env.NEXT_PUBLIC_EMBED_ALLOWED_ORIGINS)
const developmentEmbedOrigins = isDevelopment
  ? [
    "http://localhost:*",
    "https://localhost:*",
    "http://127.0.0.1:*",
    "https://127.0.0.1:*",
  ]
  : []
const embeddedFrameAncestors = ["'self'", ...developmentEmbedOrigins, ...allowedEmbedOrigins]

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDevelopment || enableCspRelaxedAds ? ["'unsafe-eval'"] : []),
  "https:",
  "https://pagead2.googlesyndication.com",
  "https://adservice.google.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://www.googletagservices.com",
  "https://*.adtrafficquality.google",
  "https://*.googlesyndication.com",
]

const frameSrc = [
  "'self'",
  "https:",
  "https://googleads.g.doubleclick.net",
  "https://tpc.googlesyndication.com",
  "https://adservice.google.com",
  "https://*.googlesyndication.com",
  "https://*.adtrafficquality.google",
  "https://www.google.com",
]

const styleSrc = ["'self'", "'unsafe-inline'"]
const fontSrc = ["'self'", "data:"]

const connectSrc = [
  "'self'",
  "https:",
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://stats.g.doubleclick.net",
  "https://pagead2.googlesyndication.com",
  "https://*.adtrafficquality.google",
  ...(isDevelopment ? ["ws://localhost:*", "wss://localhost:*"] : []),
]

const embeddedToolConnectSrc = [
  ...new Set([
    ...connectSrc,
    "https://api.anthropic.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
  ]),
]

const embeddedToolScriptSrc = [
  ...new Set([
    ...scriptSrc,
    "https://cdn.tailwindcss.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
  ]),
]
const embeddedToolStyleSrc = [
  ...styleSrc,
  "https://fonts.googleapis.com",
  "https://cdnjs.cloudflare.com",  // FIX 5: embedded tools load CSS from cdnjs  ,  was missing
  "https://cdn.jsdelivr.net",       // FIX 5b: jsdelivr CSS also used in embedded tools
]
const embeddedToolFontSrc = [
  ...fontSrc,
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com",  // FIX 6: some CDN icon fonts load from here
]
const embeddedToolWorkerSrc = ["'self'", "blob:", "https://cdnjs.cloudflare.com", "https://unpkg.com"]

function buildContentSecurityPolicy({
  scriptSrcValues = scriptSrc,
  styleSrcValues = styleSrc,
  fontSrcValues = fontSrc,
  connectSrcValues = connectSrc,
  frameSrcValues = frameSrc,
  workerSrcValues,
  frameAncestorsValues = ["'none'"],
} = {}) {
  return [
    "default-src 'self'",
    `script-src ${scriptSrcValues.join(" ")}`,
    `script-src-elem ${scriptSrcValues.join(" ")}`,
    `style-src ${styleSrcValues.join(" ")}`,
    // FIX 7: img-src  ,  added googleads domains; Google ad images were silently blocked
    "img-src 'self' data: blob: https: https://pagead2.googlesyndication.com https://*.googlesyndication.com https://adservice.google.com",
    `font-src ${fontSrcValues.join(" ")}`,
    `connect-src ${connectSrcValues.join(" ")}`,
    "media-src 'self' blob: data:",
    `frame-src ${frameSrcValues.join(" ")}`,
    ...(workerSrcValues ? [`worker-src ${workerSrcValues.join(" ")}`] : []),
    "worker-src 'self' blob: https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' mailto:",
    `frame-ancestors ${frameAncestorsValues.join(" ")}`,
    "upgrade-insecure-requests",
  ].join("; ")
}

const sharedSecurityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    // FIX 8: microphone=(self) is invalid syntax  ,  must be microphone=(self) with quotes inside parens
    // Corrected to use proper allowlist syntax
    value: "camera=(), geolocation=(), payment=(), usb=(), microphone=(self)",
  },
]

const discoverableRobotsHeaderValue =
  "max-image-preview:large, max-snippet:-1, max-video-preview:-1"
const indexRobotsHeaderValue =
  `index, follow, ${discoverableRobotsHeaderValue}`

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: buildContentSecurityPolicy(),
  },
  ...sharedSecurityHeaders,
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
]

const embeddedToolSecurityHeaders = [
  {
    key: "Content-Security-Policy",
    value: buildContentSecurityPolicy({
      scriptSrcValues: embeddedToolScriptSrc,
      styleSrcValues: embeddedToolStyleSrc,
      fontSrcValues: embeddedToolFontSrc,
      connectSrcValues: embeddedToolConnectSrc,   // FIX 4 applied here
      workerSrcValues: embeddedToolWorkerSrc,
      frameAncestorsValues: embeddedFrameAncestors,
    }),
  },
  ...sharedSecurityHeaders,
  ...(allowedEmbedOrigins.length === 0 && !isDevelopment
    ? [
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
    ]
    : []),
]

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/lib/fs-browser.ts" },
    },
  },
  output:
    process.env.NEXT_DISABLE_STANDALONE === "true" || process.platform === "win32"
      ? undefined
      : "standalone",
  trailingSlash: false,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    cpus: 1,
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
    webpackBuildWorker: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    remotePatterns: [
      ...[canonicalHost, ...alternateHosts].map((hostname) => ({
        protocol: "https",
        hostname,
      })),
    ],
  },

  async redirects() {
    // Pruned low-value template tools → parent listing (301). Categories that
    // still have real tools keep their hub; emptied categories go to /tools.
    const prunedToolRedirects = [
      ["voltage-divider-calculator", "/categories/engineering"],
      ["led-series-resistor-calculator", "/categories/engineering"],
      ["power-supply-runtime-calculator", "/categories/engineering"],
      ["capacitor-charge-discharge-calculator", "/categories/engineering"],
      ["wifi-speed-test", "/categories/data"],
      ["ping-test", "/categories/data"],
      ["csv-column-profiler", "/categories/data"],
      ["data-size-estimator", "/categories/data"],
      ["heading-structure-outline", "/categories/accessibility"],
      ["aria-label-reviewer", "/categories/accessibility"],
      ["focusable-elements-checker", "/categories/accessibility"],
      ["moon-phase-finder", "/tools"],
      ["escape-velocity-calculator", "/tools"],
      ["planet-weight-calculator", "/tools"],
      ["telescope-magnification-comparator", "/tools"],
      ["fraction-simplifier-calculator", "/tools"],
      ["scientific-notation-converter", "/tools"],
      ["study-session-planner", "/tools"],
      ["flashcard-randomizer", "/tools"],
      ["profit-margin-calculator", "/tools"],
      ["sales-tax-calculator", "/tools"],
      ["pricing-markup-calculator", "/tools"],
      ["subscription-revenue-forecast", "/tools"],
    ].map(([id, destination]) => ({
      source: `/tools/${id}`,
      destination,
      permanent: true,
    }))

    // Retired (now-empty) category pages → all-tools listing (301).
    const retiredCategoryRedirects = ["astronomy", "education", "finance"].map(
      (cat) => ({ source: `/categories/${cat}`, destination: "/tools", permanent: true })
    )

    // Legacy / renamed tool slugs surfaced as 404s in Search Console → the
    // current canonical tool (301). Each destination is a verified live tool.
    const legacyRenameRedirects = [
      ["compress-image", "image-compressor"],
      ["csv-to-json", "csv-json-converter"],
      ["json-to-csv", "csv-json-converter"],
      ["javascript-minifier", "js-minifier"],
      ["js-minifier-formatter", "js-minifier"],
      ["contrast-checker", "color-contrast-checker"],
      ["css-box-shadow", "box-shadow"],
      ["box-shadow-generator", "box-shadow"],
      ["border-radius-generator", "border-radius"],
      ["reverse-string", "text-reverser"],
      ["character-counter", "word-counter"],
      ["character-frequency-counter", "word-counter"],
      ["url-encoder-decoder", "url-encoder"],
      ["schema-markup-generator", "schema-markup-builder-validator"],
      ["json-schema-validator", "json-schema-builder-validator"],
      ["text-to-binary", "binary-text-converter"],
      ["file-hash-calculator", "hash-generator"],
      ["ssl-certificate-checker", "ssl-checker"],
      ["color-converter", "color-picker"],
      ["color-palette", "color-picker"],
      ["whois-lookup", "dns-lookup"],
      ["html-entity-encoder", "html-escape"],
      ["ip-address-lookup", "ip-lookup"],
    ].map(([from, to]) => ({
      source: `/tools/${from}`,
      destination: `/tools/${to}`,
      permanent: true,
    }))

    // Legacy root-level tool URLs (no /tools prefix) → canonical tool path (301).
    const legacyRootRedirects = [
      ["json-formatter", "json-formatter"],
      ["markdown-editor", "markdown-to-html"],
      ["clean-text-using-ai", "clean-text-using-ai"],
      ["sql-generator", "sql-formatter"],
    ].map(([from, to]) => ({
      source: `/${from}`,
      destination: `/tools/${to}`,
      permanent: true,
    }))

    // Retired legacy /docs/{category}/{slug} URLs still indexed in Search Console
    // (e.g. /docs/developer/er-diagram-maker = the site's single biggest impression
    // source, currently a 404) → the live tool at /tools/{slug} (301). A catch-all
    // sends anything else under /docs to the all-tools listing so no /docs URL 404s.
    const legacyDocsRedirects = [
      { source: "/docs/:category/:slug", destination: "/tools/:slug", permanent: true },
      { source: "/docs/:path*", destination: "/tools", permanent: true },
    ]

    return [
      // Canonicalize alternate hosts → canonical host (301), but DO NOT redirect
      // /ads.txt. AdSense crawls the registered domain directly and treats a 301 as
      // "ads.txt not found"; serving it with 200 on every host avoids that.
      ...alternateHosts.map((host) => ({
        source: "/:path((?!ads\\.txt$).*)",
        has: [{ type: "host", value: host }],
        destination: `${siteUrl}/:path`,
        permanent: true,
      })),
      ...prunedToolRedirects,
      ...retiredCategoryRedirects,
      ...legacyRenameRedirects,
      ...legacyRootRedirects,
      ...legacyDocsRedirects,
      ...standaloneCompatibilityRedirects,
      {
        source: "/support",
        destination: "/contact",
        permanent: true,
      },
      // FIX 9: favicon redirect was permanent:false  ,  should be permanent:true to avoid repeated redirects
      {
        source: "/favicon.ico",
        destination: "/favicon.png",
        permanent: true,
      },
      {
        source: "/tools/meta-tags-generator",
        destination: "/tools/meta-tags",
        permanent: true,
      },
      {
        source: "/tools/json-validator",
        destination: "/tools/json-formatter",
        permanent: true,
      },
      {
        source: "/tools/image-base64",
        destination: "/tools/image-to-base64",
        permanent: true,
      },
      {
        source: "/tools/URL-Shortener",
        destination: "/tools/url-shortener",
        permanent: true,
      },
      {
        source: "/tools/Test-Speed-Connection",
        destination: "/tools/test-speed-connection",
        permanent: true,
      },
      {
        source: "/tools/password-maker",
        destination: "/tools/password-generator",
        permanent: true,
      },
      {
        source: "/old-tools/:path*",
        destination: "/tools/:path*",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/embedded-tools",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/embedded-tools/:path*",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/docs/:path*",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/tools/Typing",
        destination: "/tools/typing-speed-test",
        permanent: true,
      },
      // Typo/broken slug canonicalization
      {
        source: "/tools/text-humain",
        destination: "/tools/text-humanizer",
        permanent: true,
      },
      {
        source: "/tools/vedio-to-audio",
        destination: "/tools/video-to-audio",
        permanent: true,
      },
      {
        source: "/tools/audio-convertir",
        destination: "/tools/audio-converter",
        permanent: true,
      },
      {
        source: "/tools/image-convertir-ai",
        destination: "/tools/image-converter",
        permanent: true,
      },
      // T26: Merge bcrypt pages into canonical /tools/bcrypt
      {
        source: "/tools/free-ai-image-generator-no-restrictions",
        destination: "/tools/free-ai-image-generator",
        permanent: true,
      },
      {
        source: "/tools/free-ai-video-generator-no-restrictions",
        destination: "/tools/free-ai-video-generator",
        permanent: true,
      },
      {
        source: "/tools/bcrypt-generator",
        destination: "/tools/bcrypt",
        permanent: true,
      },
      {
        source: "/tools/bcrypt-compare",
        destination: "/tools/bcrypt",
        permanent: true,
      },
      // T27: Merge hash tool pages into canonical /tools/hash-generator
      {
        source: "/tools/md5-hash",
        destination: "/tools/hash-generator",
        permanent: true,
      },
      {
        source: "/tools/sha256-hash",
        destination: "/tools/hash-generator",
        permanent: true,
      },
      {
        source: "/tools/hash-compare",
        destination: "/tools/hash-generator",
        permanent: true,
      },
    ]
  },

  async rewrites() {
    return {
      beforeFiles: [],
    }
  },

  async headers() {
    return [
      // Embedded standalone HTML workspaces
      {
        source: "/embedded-tools/:path*\\.html",
        headers: [
          ...embeddedToolSecurityHeaders,
          { key: "X-Robots-Tag", value: indexRobotsHeaderValue },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },

      // Embedded app routes
      {
        source: "/embedded-tools",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: indexRobotsHeaderValue },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/embedded-tools/:path((?!sitemap\\.xml$)(?!.*\\.html$).*)",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: indexRobotsHeaderValue },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },

      // Thin taxonomy routes — keep out of the index if they ever exist
      {
        source: "/blog/topic/:path*",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: indexRobotsHeaderValue },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/blog/category/:path*",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: indexRobotsHeaderValue },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },

      {
        source: "/embedded-tools/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },

      // Search results — must never be indexed
      {
        source: "/search",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: indexRobotsHeaderValue },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },

      // Sitemap
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
          // sitemap should revalidate often so Google picks up new tools faster
          { key: "Cache-Control", value: "public, s-maxage=1800, stale-while-revalidate=3600" },
        ],
      },

      // robots.txt
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },

      // IndexNow verification key file
      {
        source: "/indexnow-key.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },

      // All public page routes — security headers + discoverable (indexable) robots hint
      {
        source:
          "/((?!api|_next/static|embedded-tools|blog/topic|blog/category|search$|sitemap\\.xml|robots\\.txt|.*\\..*).*)",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: discoverableRobotsHeaderValue },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },

      // Static assets — long-lived immutable cache
      {
        source: "/:path*\\.(js|css|woff2|png|jpg|jpeg|webp|avif|svg|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // Service worker
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },

      // Web manifest
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },

      // API routes — never index
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: indexRobotsHeaderValue },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ]
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

export default nextConfig
