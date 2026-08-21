/**
 * inject-canonical.mjs
 *
 * Injects <link rel="canonical"> tags into every /embedded-tools/*.html file.
 *
 * Mapping logic:
 *   - If the manifest entry has a relatedToolId → canonical = /tools/[relatedToolId]
 *   - Otherwise → self-canonical = /embedded-tools/[fileName]
 *
 * Usage: node scripts/inject-canonical.mjs
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SITE_URL = "https://www.thefreeaitools.com"

const manifestPath = path.join(ROOT, "src", "lib", "data", "embedded-html-manifest.json")
const embeddedToolsDir = path.join(ROOT, "public", "embedded-tools")

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

let injected = 0
let skipped = 0
let alreadyPresent = 0

for (const entry of manifest) {
  const filePath = path.join(embeddedToolsDir, entry.fileName)

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠  MISSING: ${entry.fileName}  ,  skipping`)
    skipped++
    continue
  }

  // Determine canonical URL
  const canonicalUrl = entry.relatedToolId
    ? `${SITE_URL}/tools/${entry.relatedToolId}`
    : `${SITE_URL}${entry.path}`

  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`

  let html = fs.readFileSync(filePath, "utf8")

  // Skip if a canonical already exists
  if (/<link[^>]+rel=["']canonical["'][^>]*>/i.test(html)) {
    console.log(`⏩  SKIP (already has canonical): ${entry.fileName}`)
    alreadyPresent++
    continue
  }

  // Inject before </head>  ,  fall back to before <body> if no </head>
  if (/<\/head>/i.test(html)) {
    html = html.replace(/(<\/head>)/i, `  ${canonicalTag}\n$1`)
  } else if (/<body/i.test(html)) {
    html = html.replace(/(<body[^>]*>)/i, `${canonicalTag}\n$1`)
  } else {
    console.warn(`⚠  No <\/head> or <body> in ${entry.fileName}  ,  prepending`)
    html = `${canonicalTag}\n` + html
  }

  fs.writeFileSync(filePath, html, "utf8")
  console.log(
    `✅  ${entry.fileName}  →  ${canonicalUrl}${entry.relatedToolId ? " (main tool page)" : " (self-canonical)"}`
  )
  injected++
}

console.log(`\nDone. Injected: ${injected}  |  Already present: ${alreadyPresent}  |  Skipped (missing): ${skipped}`)
