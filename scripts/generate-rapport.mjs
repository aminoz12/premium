import fs from "node:fs"
import path from "node:path"
import { loadAllToolEntries, loadToolCategories } from "./lib/tool-inventory.mjs"

const repoRoot = process.cwd()
const reportPath = path.join(repoRoot, "rapport.md")
const appDir = path.join(repoRoot, "src/app")

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8")
}

function unique(values) {
  return [...new Set(values)]
}

function toPosix(relativePath) {
  return relativePath.replace(/\\/g, "/")
}

function walkFiles(directory, collector = []) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      walkFiles(absolutePath, collector)
    } else {
      collector.push(absolutePath)
    }
  }

  return collector
}

function extractMatches(source, regex, groupIndex = 1) {
  return [...source.matchAll(regex)].map((match) => match[groupIndex]).filter(Boolean)
}

function formatTable(rows, headers) {
  const lines = [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`]
  for (const row of rows) {
    lines.push(`| ${row.join(" | ")} |`)
  }
  return lines.join("\n")
}

function routeTypeLabel(tool) {
  if (tool.status === "preview") {
    return "dynamic preview route"
  }
  return tool.pageType === "dynamic" ? "dynamic live route" : "static wrapper + client page"
}

function toolImplementationFiles(tool) {
  if (tool.pageType === "dynamic") {
    return ["src/app/tools/[slug]/page.tsx", "src/components/tools/dynamic-tool-loader.tsx"]
  }

  const staticPagePath = `src/app/tools/${tool.id}/page.tsx`
  const clientPagePath = `src/app/tools/${tool.id}/client-page.tsx`

  return [staticPagePath, clientPagePath].filter((relativePath) =>
    fs.existsSync(path.join(repoRoot, relativePath))
  )
}

function toRoutePattern(relativePath) {
  const normalized = toPosix(relativePath)
  const segments = normalized.split("/")
  const fileName = segments.pop()
  const cleanedSegments = segments.filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))

  if (fileName === "page.tsx") {
    return `/${cleanedSegments.join("/")}`.replace(/\/+/g, "/")
  }

  if (fileName === "route.ts") {
    return `/${cleanedSegments.join("/")}`.replace(/\/+/g, "/")
  }

  if (fileName === "sitemap.ts") {
    if (cleanedSegments.length === 0) {
      return "/sitemap.xml"
    }
    return `/${cleanedSegments.join("/")}/sitemap.xml`.replace(/\/+/g, "/")
  }

  if (fileName === "robots.ts") {
    return "/robots.txt"
  }

  if (fileName === "manifest.ts") {
    return "/manifest.webmanifest"
  }

  if (fileName === "opengraph-image.tsx") {
    if (cleanedSegments.length === 0) {
      return "/opengraph-image"
    }
    return `/${cleanedSegments.join("/")}/opengraph-image`.replace(/\/+/g, "/")
  }

  return null
}

function scanAppPublicRouteFiles() {
  const publicRouteFilePattern =
    /(^|\/)(page\.tsx|route\.ts|sitemap\.ts|robots\.ts|manifest\.ts|opengraph-image\.tsx)$/

  const absoluteFiles = walkFiles(appDir)
    .filter((absolutePath) => publicRouteFilePattern.test(toPosix(absolutePath)))
    .sort((first, second) => first.localeCompare(second))

  return absoluteFiles
    .map((absolutePath) => {
      const relativePath = toPosix(path.relative(repoRoot, absolutePath))
      const appRelativePath = toPosix(path.relative(appDir, absolutePath))
      const routePattern = toRoutePattern(appRelativePath)
      if (!routePattern) {
        return null
      }

      return {
        routePattern,
        file: relativePath,
        type: path.basename(absolutePath),
      }
    })
    .filter(Boolean)
    .sort((first, second) => {
      if (first.routePattern !== second.routePattern) {
        return first.routePattern.localeCompare(second.routePattern)
      }
      return first.file.localeCompare(second.file)
    })
}

function buildAbsoluteUrl(baseUrl, pathname) {
  try {
    return new URL(pathname, baseUrl).toString()
  } catch {
    return `${baseUrl}${pathname}`
  }
}

function formatPathList(paths, baseUrl) {
  return paths.map((pathname) => `- \`${pathname}\` -> ${buildAbsoluteUrl(baseUrl, pathname)}`)
}

function formatToolPathLine(tool, baseUrl) {
  return `- \`${tool.path}\` -> ${buildAbsoluteUrl(baseUrl, tool.path)} (${tool.name}; ${tool.pageType}; ${tool.status})`
}

function formatRedirectLine(source, destination, baseUrl) {
  const destinationUrl = destination.startsWith("/") ? buildAbsoluteUrl(baseUrl, destination) : destination
  return `- \`${source}\` -> \`${destination}\` (${destinationUrl})`
}

function main() {
  const generatedAt = new Date().toISOString()

  const siteConfigSource = readText("src/lib/site-config.ts")
  const nextConfigSource = readText("next.config.mjs")
  const hubPagesSource = readText("src/data/hub-pages.ts")
  const blogCategoriesSource = readText("src/app/blog/Blog/lib/Blogcategories.ts")
  const blogTopicsSource = readText("src/app/blog/Blog/lib/Blogtopics.ts")
  const legacySlugsSource = readText("src/lib/tools/legacy-slugs.ts")

  const defaultSiteUrl =
    siteConfigSource.match(/const DEFAULT_SITE_URL = "([^"]+)"/)?.[1] ?? "https://www.thefreeaitools.com"
  const canonicalHost = new URL(defaultSiteUrl).hostname
  const configuredHosts = unique([
    ...extractMatches(siteConfigSource, /"([a-z0-9.-]+\.[a-z]{2,})"/gi),
    ...extractMatches(nextConfigSource, /"([a-z0-9.-]+\.[a-z]{2,})"/gi),
  ])
  const alternateHosts = configuredHosts.filter((host) => host !== canonicalHost)

  const categories = loadToolCategories(repoRoot)
  const tools = loadAllToolEntries(repoRoot)
  const liveTools = tools.filter((tool) => tool.status !== "preview")
  const previewTools = tools.filter((tool) => tool.status === "preview")
  const staticTools = tools.filter((tool) => tool.pageType !== "dynamic")
  const dynamicTools = tools.filter((tool) => tool.pageType === "dynamic")

  const toolsByCategory = new Map(categories.map((category) => [category.id, []]))
  for (const tool of tools) {
    if (!toolsByCategory.has(tool.category)) {
      toolsByCategory.set(tool.category, [])
    }
    toolsByCategory.get(tool.category).push(tool)
  }
  for (const categoryTools of toolsByCategory.values()) {
    categoryTools.sort((first, second) => first.name.localeCompare(second.name))
  }

  const hubSlugs = unique(extractMatches(hubPagesSource, /slug:\s*"([^"]+)"/g))
  const blogCategorySlugs = unique(extractMatches(blogCategoriesSource, /slug:\s*'([^']+)'/g))
  const blogTopicSlugs = unique(extractMatches(blogTopicsSource, /t\('([^']+)'/g))

  const embeddedHtmlFiles = fs
    .readdirSync(path.join(repoRoot, "public/embedded-tools"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => `/embedded-tools/${entry.name}`)
    .sort((first, second) => first.localeCompare(second))

  const publicFileUrls = walkFiles(path.join(repoRoot, "public"))
    .map((absolutePath) => `/${toPosix(path.relative(path.join(repoRoot, "public"), absolutePath))}`)
    .map((pathname) => pathname.replace(/\/+/g, "/"))
    .sort((first, second) => first.localeCompare(second))

  const appRouteEntries = scanAppPublicRouteFiles()

  const redirectPairs = unique(
    [...nextConfigSource.matchAll(/source:\s*"([^"]+)"[\s\S]*?destination:\s*(?:"([^"]+)"|`([^`]+)`)/g)].map(
      (match) => `${match[1]}|||${match[2] ?? match[3]}`
    )
  )
    .map((combined) => {
      const [source, destination] = combined.split("|||")
      return { source, destination }
    })
    .sort((first, second) => first.source.localeCompare(second.source))

  const legacyRedirects = [...legacySlugsSource.matchAll(/"([^"]+)":\s*"([^"]+)"/g)]
    .map((match) => ({
      source: `/tools/${match[1]}`,
      destination: `/tools/${match[2]}`,
    }))
    .sort((first, second) => first.source.localeCompare(second.source))

  const corePaths = [
    "/",
    "/about",
    "/acceptable-use",
    "/categories",
    "/contact",
    "/disclaimer",
    "/embedded-tools",
    "/privacy",
    "/search",
    "/security",
    "/terms",
    "/blog",
    "/tools",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/.well-known/security.txt",
    "/opengraph-image",
    "/tools/sitemap.xml",
    "/categories/sitemap.xml",
    "/blog/sitemap.xml",
    "/api",
    "/api/network/benchmark",
  ]

  const hubPaths = hubSlugs.map((slug) => `/${slug}`).sort((first, second) => first.localeCompare(second))
  const categoryPaths = categories
    .map((category) => `/categories/${category.id}`)
    .sort((first, second) => first.localeCompare(second))
  const toolPaths = tools.map((tool) => tool.path).sort((first, second) => first.localeCompare(second))
  const embeddedToolPaths = liveTools
    .map((tool) => `/embedded-tools/${tool.id}`)
    .sort((first, second) => first.localeCompare(second))
  const blogCategoryPaths = blogCategorySlugs
    .map((slug) => `/blog/category/${slug}`)
    .sort((first, second) => first.localeCompare(second))
  const blogTopicPaths = blogTopicSlugs
    .map((slug) => `/blog/topic/${slug}`)
    .sort((first, second) => first.localeCompare(second))

  const lines = [
    "# The Free AI Tools - Full SEO, Architecture, Paths, and URLs Report",
    "",
    `Generated from source on ${generatedAt}.`,
    "",
    "## Executive Summary",
    "",
    `- Framework: Next.js App Router (src/app).`,
    `- Canonical site URL: ${defaultSiteUrl}.`,
    `- Canonical host: ${canonicalHost}.`,
    `- Alternate hosts discovered in config: ${alternateHosts.length}.`,
    `- App route patterns discovered from file-based routing: ${appRouteEntries.length}.`,
    `- Tool categories: ${categories.length}.`,
    `- Total tools: ${tools.length} (live: ${liveTools.length}, preview: ${previewTools.length}, static wrappers: ${staticTools.length}, dynamic tools: ${dynamicTools.length}).`,
    `- Hub pages: ${hubPaths.length}.`,
    `- Blog categories: ${blogCategoryPaths.length}.`,
    `- Blog topics (unique): ${blogTopicPaths.length}.`,
    `- Embedded tool access routes: ${embeddedToolPaths.length}.`,
    `- Standalone embedded HTML files: ${embeddedHtmlFiles.length}.`,
    `- Next.js redirects discovered in next.config.mjs: ${redirectPairs.length}.`,
    `- Legacy tool slug redirects in src/lib/tools/legacy-slugs.ts: ${legacyRedirects.length}.`,
    "",
    "## Project Architecture",
    "",
    "- `src/app`: Next.js App Router entry points, route handlers, sitemaps, robots, and Open Graph image routes.",
    "- `src/components`: shared UI, SEO components (`JsonLd`, breadcrumb, FAQ, schema blocks), analytics, ads, and tool shells.",
    "- `src/lib/tools`: source-of-truth tool registry (`tools-config.ts`), expansion inventory, and legacy slug mapping.",
    "- `src/lib/seo`: metadata strategy (`metadata.ts`), schema builders (`schema.ts`), and per-tool SEO content (`tool-content.ts`).",
    "- `src/data`: hub landing page definitions and other static content sources.",
    "- `src/app/blog/Blog`: blog-specific metadata, topic/category registries, and JSON-LD builders.",
    "- `public`: static files, including `ads.txt`, icons, service worker, and standalone embedded HTML pages.",
    "- `scripts`: verification and reporting scripts that keep route and metadata coverage synchronized with source.",
    "",
    "## SEO Methods Implemented",
    "",
    "- Centralized metadata generation for home, categories, and tools via `src/lib/seo/metadata.ts` and `src/lib/page-metadata.ts`.",
    "- Site-wide metadata in `src/app/layout.tsx`: title templates, description, keywords, canonical, Open Graph, Twitter card, robots, verification, manifest, and icons.",
    "- Dynamic per-route metadata via `generateMetadata` on dynamic pages: tools, categories, hubs, embedded routes, and blog routes.",
    "- Canonical URL handling with `buildAbsoluteUrl` in `src/lib/site-config.ts` and `alternates.canonical` across major pages.",
    "- Open Graph image generation routes: `src/app/opengraph-image.tsx` and `src/app/tools/[slug]/opengraph-image.tsx`.",
    "- Structured data (JSON-LD) strategy across the site via `src/lib/seo/schema.ts`, `src/components/seo/SchemaMarkup.tsx`, and blog JSON-LD files.",
    "- Schema coverage includes Organization, WebSite (with SearchAction), SoftwareApplication/WebApplication, CollectionPage, BreadcrumbList, FAQPage, HowTo, WebPage, TechArticle, and ItemList.",
    "- Dynamic XML sitemap routes: root (`src/app/sitemap.ts`), tools (`src/app/tools/sitemap.ts`), categories (`src/app/categories/sitemap.ts`), embedded tools (`src/app/embedded-tools/sitemap.ts`, intentionally empty), blog (`src/app/blog/sitemap.ts`).",
    "- Dynamic robots route in `src/app/robots.ts` with explicit sitemap references and crawler rules.",
    "- URL canonicalization and redirect strategy in `next.config.mjs` (host normalization plus route-level redirects).",
    "- Legacy slug migration in `src/lib/tools/legacy-slugs.ts` with permanent redirects from `src/app/tools/[slug]/page.tsx`.",
    "- HTTP-level crawl directives via `X-Robots-Tag` headers in `next.config.mjs` for HTML pages and embedded HTML endpoints.",
    "- Indexing guardrails for preview tools through conditional `noIndex` support in `buildToolMetadata`.",
    "- Extensive keyword strategy automation in `src/lib/seo/metadata.ts` and `src/lib/seo/tool-content.ts` (primary + secondary + long-tail generation).",
    "- Strong internal linking architecture across home, category, tool, hub, embedded, and blog pages.",
    "- Pre-rendering strategy with `generateStaticParams` on dynamic routes and revalidation controls (`revalidate = 3600`) on sitemap/tool surfaces.",
    "- Crawl/content consistency checks via `scripts/verify-seo-metadata.mjs`, `scripts/verify-app-pages.mjs`, and `scripts/verify-tool-pages.mjs`.",
    "",
    "## File-Based Route Patterns",
    "",
    formatTable(
      appRouteEntries.map((entry) => [
        `\`${entry.routePattern}\``,
        `\`${entry.file}\``,
        `\`${entry.type}\``,
      ]),
      ["Path Pattern", "Source File", "Route File Type"]
    ),
    "",
    "## Redirect and Canonicalization Rules",
    "",
    "### Canonical Host Strategy",
    "",
    `- Canonical host: \`${canonicalHost}\` (${defaultSiteUrl}).`,
    `- Non-canonical hosts configured for redirect handling: ${alternateHosts.map((host) => `\`${host}\``).join(", ") || "none"}.`,
    "",
    "### Redirects in next.config.mjs",
    "",
    ...redirectPairs.map((redirect) =>
      formatRedirectLine(redirect.source, redirect.destination, defaultSiteUrl)
    ),
    "",
    `### Legacy Tool Slug Redirects (\`${legacyRedirects.length}\` rules)`,
    "",
    ...legacyRedirects.map((redirect) =>
      formatRedirectLine(redirect.source, redirect.destination, defaultSiteUrl)
    ),
    "",
    "## Core URL Inventory",
    "",
    ...formatPathList(corePaths, defaultSiteUrl),
    "",
    "## Hub Page URLs",
    "",
    ...formatPathList(hubPaths, defaultSiteUrl),
    "",
    "## Category URLs",
    "",
    ...categories.flatMap((category) => {
      const categoryPath = `/categories/${category.id}`
      return [
        `- \`${categoryPath}\` -> ${buildAbsoluteUrl(defaultSiteUrl, categoryPath)} (${category.name})`,
      ]
    }),
    "",
    "## Tool URLs (All Tools)",
    "",
    ...categories.flatMap((category) => {
      const categoryTools = toolsByCategory.get(category.id) ?? []
      return [
        `### ${category.name} (\`${categoryTools.length}\` tools)`,
        "",
        ...categoryTools.map((tool) => formatToolPathLine(tool, defaultSiteUrl)),
        "",
      ]
    }),
    "## Embedded Tool Access URLs (All Live Tools)",
    "",
    ...formatPathList(embeddedToolPaths, defaultSiteUrl),
    "",
    "## Standalone Embedded HTML URLs",
    "",
    ...formatPathList(embeddedHtmlFiles, defaultSiteUrl),
    "",
    "## Blog Category URLs",
    "",
    ...formatPathList(blogCategoryPaths, defaultSiteUrl),
    "",
    "## Blog Topic URLs (Complete List)",
    "",
    ...formatPathList(blogTopicPaths, defaultSiteUrl),
    "",
    "## Public Static File URLs",
    "",
    ...formatPathList(publicFileUrls, defaultSiteUrl),
    "",
    "## Notes",
    "",
    "- This report is generated from source files and reflects the current in-repo route and SEO architecture.",
    "- If routes, tool inventory, or blog topic/category data change, rerun `npm run report` to refresh this document.",
    "",
  ]

  fs.writeFileSync(reportPath, `${lines.join("\n").trimEnd()}\n`)
  console.log(`[generate-rapport] Report written to ${path.relative(repoRoot, reportPath)}.`)
}

main()
