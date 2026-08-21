import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, "..")
const embeddedDir = path.join(repoRoot, "public", "embedded-tools")
const outPath = path.join(embeddedDir, "sitemap.xml")

// Get all HTML files from embedded-tools directory
const htmlFiles = fs.readdirSync(embeddedDir)
  .filter(file => file.endsWith('.html') && file !== 'sitemap.xml')
  .sort()

// Get today's date in ISO format
const today = new Date().toISOString().split('T')[0]

// Generate URL entries for each HTML file
const urlEntries = htmlFiles
  .map(file => {
    const filename = file.replace('.html', '')
    return `  <url>
    <loc>https://www.thefreeaitools.com/embedded-tools/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

fs.mkdirSync(embeddedDir, { recursive: true })
fs.writeFileSync(outPath, xml, "utf8")
console.log(`[generate-embedded-tools-sitemap-xml] wrote ${outPath} (${htmlFiles.length} URLs)`)
