const fs = require("fs")
const path = require("path")

/**
 * Extract quoted `slug: "..."` values from a source file.
 * Matches only quoted slugs, so the `slug: string` type declaration is ignored.
 * Returns [] on any read/parse error so sitemap generation never hard-fails.
 */
function readSlugs(relativePath) {
  try {
    const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")
    const matches = source.matchAll(/slug:\s*["']([a-z0-9-]+)["']/g)
    return Array.from(new Set(Array.from(matches, (m) => m[1])))
  } catch {
    return []
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.thefreeaitools.com",
  // robots.txt is served by the app route (src/app/robots.ts) — don't double-generate.
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  // Only exclude genuinely non-indexable routes. Indexable, ranking-relevant
  // pages (blog, hubs, tools, categories) must NOT be excluded.
  exclude: [
    "/admin/*",
    "/api/*",
    "/_next/*",
    "/embedded-tools",
    "/embedded-tools/*",
    "/search",
    "/acceptable-use",
    "/disclaimer",
    "/privacy",
    "/security",
    "/terms",
    "*/opengraph-image",
    "*/twitter-image",
  ],
  additionalPaths: async () => {
    const { loadAllToolEntries, loadToolCategories } = await import("./scripts/lib/tool-inventory.mjs")
    const tools = loadAllToolEntries(process.cwd())
    const categories = loadToolCategories(process.cwd())
    const hubSlugs = readSlugs("src/data/hub-pages.ts")
    const blogSlugs = readSlugs("src/lib/blog/posts.ts")
    const now = new Date().toISOString()

    return [
      { loc: "/", priority: 1, changefreq: "daily", lastmod: now },
      // High-value listing/landing pages
      { loc: "/tools", priority: 0.9, changefreq: "daily", lastmod: now },
      { loc: "/categories", priority: 0.8, changefreq: "weekly", lastmod: now },
      { loc: "/blog", priority: 0.7, changefreq: "weekly", lastmod: now },
      { loc: "/alternatives", priority: 0.7, changefreq: "weekly", lastmod: now },
      { loc: "/compare", priority: 0.7, changefreq: "weekly", lastmod: now },
      { loc: "/best", priority: 0.7, changefreq: "weekly", lastmod: now },
      { loc: "/about", priority: 0.5, changefreq: "monthly", lastmod: now },
      { loc: "/contact", priority: 0.4, changefreq: "monthly", lastmod: now },
      // Every hub page (derived from source so it never drifts)
      ...hubSlugs.map((slug) => ({
        loc: `/${slug}`,
        priority: 0.9,
        changefreq: "weekly",
        lastmod: now,
      })),
      // Every blog post
      ...blogSlugs.map((slug) => ({
        loc: `/blog/${slug}`,
        priority: 0.7,
        changefreq: "monthly",
        lastmod: now,
      })),
      // Every tool category
      ...categories.map((category) => ({
        loc: `/categories/${category.id}`,
        priority: 0.9,
        changefreq: "weekly",
        lastmod: now,
      })),
      // Every tool
      ...tools.map((tool) => ({
        loc: tool.path,
        priority: 0.8,
        changefreq: "weekly",
        lastmod: now,
      })),
    ]
  },
}
