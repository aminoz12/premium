import fs from "node:fs"
import path from "node:path"
import { loadAllToolEntries } from "./lib/tool-inventory.mjs"

const repoRoot = process.cwd()
const metadataPath = path.join(repoRoot, "src/lib/seo/metadata.ts")
const dynamicToolRoutePath = path.join(repoRoot, "src/app/tools/[slug]/page.tsx")
const staticToolsDir = path.join(repoRoot, "src/app/tools")

function fail(message, details = []) {
  console.error(`\n[verify-seo-metadata] ${message}`)
  for (const detail of details) {
    console.error(`- ${detail}`)
  }
  process.exit(1)
}

function main() {
  const allTools = loadAllToolEntries(repoRoot)
  const staticTools = allTools.filter((tool) => tool.pageType !== "dynamic")
  const metadataSource = fs.readFileSync(metadataPath, "utf8")
  const dynamicToolRouteSource = fs.readFileSync(dynamicToolRoutePath, "utf8")

  const metadataFailures = []

  if (!metadataSource.includes("export const toolMetadataCatalog")) {
    metadataFailures.push("Missing `toolMetadataCatalog` export in src/lib/seo/metadata.ts.")
  }

  if (!metadataSource.includes("Object.fromEntries(tools.map")) {
    metadataFailures.push("Expected `toolMetadataCatalog` to be generated from the full tools collection.")
  }

  if (!metadataSource.includes("export const toolMetadataCatalogList")) {
    metadataFailures.push("Missing `toolMetadataCatalogList` export in src/lib/seo/metadata.ts.")
  }

  if (!metadataSource.includes("export function getToolMetadataCoverage()")) {
    metadataFailures.push("Missing `getToolMetadataCoverage` helper in src/lib/seo/metadata.ts.")
  }

  if (!dynamicToolRouteSource.includes("return buildToolMetadata(tool.id)")) {
    metadataFailures.push("Dynamic tool route is not delegating metadata generation through buildToolMetadata(tool.id).")
  }

  const wrapperFailures = []

  for (const tool of staticTools) {
    const pagePath = path.join(staticToolsDir, tool.id, "page.tsx")
    const clientPagePath = path.join(staticToolsDir, tool.id, "client-page.tsx")

    if (!fs.existsSync(pagePath)) {
      wrapperFailures.push(`${tool.id} -> missing src/app/tools/${tool.id}/page.tsx`)
      continue
    }

    const pageSource = fs.readFileSync(pagePath, "utf8")
    if (!pageSource.includes(`buildToolMetadata("${tool.id}")`)) {
      wrapperFailures.push(`${tool.id} -> missing buildToolMetadata("${tool.id}") in wrapper page`)
    }

    if (pageSource.includes('"use client"') || pageSource.includes("'use client'")) {
      wrapperFailures.push(`${tool.id} -> wrapper page should be a server component, but it still declares use client`)
    }

    if (!fs.existsSync(clientPagePath)) {
      wrapperFailures.push(`${tool.id} -> missing src/app/tools/${tool.id}/client-page.tsx`)
    }
  }

  if (metadataFailures.length) {
    fail("SEO metadata catalog verification failed.", metadataFailures)
  }

  if (wrapperFailures.length) {
    fail("Static tool metadata wrapper verification failed.", wrapperFailures)
  }

  console.log(
    `[verify-seo-metadata] SEO metadata coverage OK: ${allTools.length} tools, ${staticTools.length} static wrappers, dynamic route linked to shared metadata.`
  )
}

main()
