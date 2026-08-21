import fs from "node:fs"
import path from "node:path"
import { loadAllToolEntries } from "./lib/tool-inventory.mjs"

const repoRoot = process.cwd()
const appToolsDir = path.join(repoRoot, "src/app/tools")
const dynamicRoutePath = path.join(appToolsDir, "[slug]/page.tsx")

async function fetchWithTimeout(url, timeoutMs = 120000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

function fail(message, details = []) {
  console.error(`\n[verify-tool-pages] ${message}`)
  for (const detail of details) {
    console.error(`- ${detail}`)
  }
  process.exit(1)
}

async function main() {
  if (!fs.existsSync(dynamicRoutePath)) {
    fail("Missing dynamic tool route file.", [dynamicRoutePath])
  }

  const tools = loadAllToolEntries(repoRoot)
  const staticTools = tools.filter((tool) => tool.pageType !== "dynamic")
  const dynamicTools = tools.filter((tool) => tool.pageType === "dynamic")
  const staticDirEntries = fs
    .readdirSync(appToolsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "[slug]")
    .map((entry) => entry.name)
    .sort()

  const missingStaticPages = staticTools
    .filter((tool) => !fs.existsSync(path.join(appToolsDir, tool.id, "page.tsx")))
    .map((tool) => `${tool.id} -> src/app/tools/${tool.id}/page.tsx`)

  const unexpectedStaticDirectories = staticDirEntries.filter((dir) => !tools.some((tool) => tool.id === dir))
  const conflictingDynamicPages = dynamicTools
    .filter((tool) => fs.existsSync(path.join(appToolsDir, tool.id, "page.tsx")))
    .map((tool) => `${tool.id} -> src/app/tools/${tool.id}/page.tsx`)

  if (missingStaticPages.length) {
    fail("Some static tools are missing page files.", missingStaticPages)
  }

  if (unexpectedStaticDirectories.length) {
    console.warn(
      "[verify-tool-pages] Warning: Found static tool directories not present in tools-config:",
      unexpectedStaticDirectories.map((dir) => `src/app/tools/${dir}`)
    )
  }

  if (conflictingDynamicPages.length) {
    console.warn(
      "[verify-tool-pages] Warning: Some dynamic tools also have static page files (possible route conflicts).",
      conflictingDynamicPages
    )
  }

  console.log(
    `[verify-tool-pages] Route coverage OK: ${tools.length} tools (${staticTools.length} static, ${dynamicTools.length} dynamic).`
  )

  const baseUrl = process.env.TOOL_PAGES_BASE_URL?.trim()
  if (!baseUrl) {
    return
  }

  const failures = []

  for (const tool of tools) {
    const url = `${baseUrl.replace(/\/+$/, "")}${tool.path}`

    try {
      const response = await fetchWithTimeout(url)
      if (response.status >= 300 && response.status < 400) {
        failures.push(
          `${tool.id} -> ${response.status} redirect to ${response.headers.get("location") ?? "(missing location)"}`
        )
      } else if (!response.ok) {
        failures.push(`${tool.id} -> ${response.status}`)
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error"
      failures.push(`${tool.id} -> ${reason}`)
    }
  }

  if (failures.length) {
    fail(`HTTP crawl failed for ${failures.length} tool page(s).`, failures)
  }

  console.log(`[verify-tool-pages] HTTP crawl OK: ${tools.length} tool pages responded with 200.`)
}

await main()
