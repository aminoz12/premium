import fs from "node:fs"
import path from "node:path"
import { loadAllToolEntries } from "./lib/tool-inventory.mjs"

const repoRoot = process.cwd()
const manifestPath = path.join(repoRoot, "src", "lib", "data", "embedded-html-manifest.json")
const embeddedDir = path.join(repoRoot, "public", "embedded-tools")

const defaultSiteUrl = "https://www.thefreeaitools.com"
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
const candidateSiteUrl = rawSiteUrl || defaultSiteUrl
const siteOrigin = new URL(
  /^https?:\/\//i.test(candidateSiteUrl) ? candidateSiteUrl : `https://${candidateSiteUrl}`
).origin

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
const toolEntries = loadAllToolEntries(repoRoot)
const toolPathById = new Map(toolEntries.map((tool) => [tool.id, tool.path]))
const manualCanonicalPathByEntryId = {
  "diagramm-generator": "/tools/flowchart-maker",
  "generator-grid": "/tools/css-grid-template-generator",
  home: "/tools",
  page: "/tools",
  uml: "/tools/class-diagram-maker",
}

function upsertTag(source, matcher, replacement) {
  const flags = matcher.flags.includes("g") ? matcher.flags : `${matcher.flags}g`
  const globalMatcher = new RegExp(matcher.source, flags)
  let nextSource = source.replace(globalMatcher, "").replace(/\n{3,}/g, "\n\n")
  const headClose = source.match(/<\/head>/i)
  if (!headClose) {
    return nextSource
  }

  const updatedHeadClose = nextSource.match(/<\/head>/i)
  if (!updatedHeadClose) {
    return nextSource
  }

  return `${nextSource.slice(0, updatedHeadClose.index)}${replacement}\n${nextSource.slice(
    updatedHeadClose.index
  )}`
}

let updatedFiles = 0

for (const entry of manifest) {
  const htmlPath = path.join(embeddedDir, entry.fileName)
  if (!fs.existsSync(htmlPath)) {
    continue
  }

  const relatedToolPath =
    (entry.relatedToolId ? toolPathById.get(entry.relatedToolId) : null) ??
    toolPathById.get(entry.id) ??
    manualCanonicalPathByEntryId[entry.id] ??
    "/tools"
  const canonicalUrl = `${siteOrigin}${relatedToolPath}`
  const canonicalTag = `  <link rel="canonical" href="${canonicalUrl}" data-managed-seo="true">`
  const robotsTag = `  <meta name="robots" content="index,follow" data-managed-seo="true">`
  const googlebotTag = `  <meta name="googlebot" content="index,follow" data-managed-seo="true">`

  const originalSource = fs.readFileSync(htmlPath, "utf8")
  let nextSource = upsertTag(
    originalSource,
    /<link[^>]+rel=["']canonical["'][^>]*>/i,
    canonicalTag
  )
  nextSource = upsertTag(
    nextSource,
    /<meta[^>]+name=["']robots["'][^>]*>/i,
    robotsTag
  )
  nextSource = upsertTag(
    nextSource,
    /<meta[^>]+name=["']googlebot["'][^>]*>/i,
    googlebotTag
  )

  if (nextSource !== originalSource) {
    fs.writeFileSync(htmlPath, nextSource, "utf8")
    updatedFiles += 1
  }
}

console.log(`[optimize-embedded-html-head] updated ${updatedFiles} embedded HTML files`)
