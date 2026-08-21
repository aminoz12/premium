import fs from "node:fs"
import path from "node:path"

const repoRoot = process.cwd()

const publicPageChecks = [
  { route: "/", file: "src/app/page.tsx" },
  { route: "/about", file: "src/app/about/page.tsx" },
  { route: "/acceptable-use", file: "src/app/acceptable-use/page.tsx" },
  { route: "/categories", file: "src/app/categories/page.tsx" },
  { route: "/contact", file: "src/app/contact/page.tsx" },
  { route: "/search", file: "src/app/search/page.tsx" },
  { route: "/tools", file: "src/app/tools/page.tsx" },
  { route: "/embedded-tools", file: "src/app/embedded-tools/page.tsx" },
  { route: "/embedded-tools/password-generator", file: "src/app/embedded-tools/[slug]/page.tsx" },
  { route: "/privacy", file: "src/app/privacy/page.tsx" },
  { route: "/security", file: "src/app/security/page.tsx" },
  { route: "/terms", file: "src/app/terms/page.tsx" },
  { route: "/disclaimer", file: "src/app/disclaimer/page.tsx" },
  { route: "/robots.txt", file: "src/app/robots.ts" },
  { route: "/sitemap.xml", file: "src/app/sitemap.ts" },
  { route: "/image-sitemap.xml", file: "src/app/image-sitemap.xml/route.ts" },
  { route: "/videos-sitemap.xml", file: "src/app/videos-sitemap.xml/route.ts" },
  {
    route: "/vedios-sitemap.xml",
    file: "src/app/vedios-sitemap.xml/route.ts",
    expectStatus: 308,
    expectLocationSuffix: "/videos-sitemap.xml",
  },
  { route: "/tools/sitemap.xml", file: "src/app/tools/sitemap.ts" },
  { route: "/categories/sitemap.xml", file: "src/app/categories/sitemap.ts" },
  { route: "/blog/sitemap.xml", file: "src/app/blog/sitemap/route.ts" },
  { route: "/embedded-tools/sitemap.xml", file: "public/embedded-tools/sitemap.xml" },
  { route: "/manifest.webmanifest", file: "src/app/manifest.ts" },
  { route: "/.well-known/security.txt", file: "src/app/.well-known/security.txt/route.ts" },
  { route: "/404-check", file: "src/app/not-found.tsx", expectNotFound: true },
]

function fail(message, details = []) {
  console.error(`\n[verify-app-pages] ${message}`)
  for (const detail of details) {
    console.error(`- ${detail}`)
  }
  process.exit(1)
}

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

function verifyFilesExist() {
  const missing = publicPageChecks
    .filter((entry) => !fs.existsSync(path.join(repoRoot, entry.file)))
    .map((entry) => `${entry.route} -> ${entry.file}`)

  if (missing.length) {
    fail("Missing public page or metadata route files.", missing)
  }

  console.log(`[verify-app-pages] Route inventory OK: ${publicPageChecks.length} public routes checked.`)
}

async function verifyHttp(baseUrl) {
  const failures = []

  for (const entry of publicPageChecks) {
    const url = `${baseUrl.replace(/\/+$/, "")}${entry.route}`

    try {
      const response = await fetchWithTimeout(url)
      const expectedStatus = entry.expectStatus ?? (entry.expectNotFound ? 404 : 200)

      if (response.status !== expectedStatus) {
        failures.push(`${entry.route} -> expected ${expectedStatus}, received ${response.status}`)
      }

      if (entry.expectLocationSuffix) {
        const location = response.headers.get("location") || ""
        if (!location.endsWith(entry.expectLocationSuffix)) {
          failures.push(
            `${entry.route} -> expected Location to end with ${entry.expectLocationSuffix}, received ${location || "(missing)"}`
          )
        }
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error"
      failures.push(`${entry.route} -> ${reason}`)
    }
  }

  if (failures.length) {
    fail(`HTTP crawl failed for ${failures.length} public route(s).`, failures)
  }

  console.log(`[verify-app-pages] HTTP crawl OK: ${publicPageChecks.length} public routes responded as expected.`)
}

async function main() {
  verifyFilesExist()

  const baseUrl = process.env.APP_BASE_URL?.trim()
  if (!baseUrl) {
    return
  }

  await verifyHttp(baseUrl)
}

await main()
