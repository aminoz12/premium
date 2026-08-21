const DEFAULT_SITE_URL = "https://www.thefreeaitools.com"
const DEFAULT_SAMPLE_TOOL_PATH = "/tools/password-generator"

function normalizeBaseUrl(value) {
  const raw = value?.trim() || DEFAULT_SITE_URL
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, "")
}

async function request(url, { method = "GET" } = {}) {
  try {
    const response = await fetch(url, { method, redirect: "follow" })
    const body = method === "HEAD" ? "" : await response.text()
    return { response, body, usedFallback: false }
  } catch (error) {
    if (method !== "HEAD") {
      throw error
    }

    const fallbackResponse = await fetch(url, { method: "GET", redirect: "follow" })
    return { response: fallbackResponse, body: "", usedFallback: true }
  }
}

function printLine(label, value) {
  console.log(`${label} ${value}`)
}

async function run() {
  const siteUrl = normalizeBaseUrl(process.env.SITE_URL)
  const sampleToolPath = process.env.SEO_SAMPLE_TOOL_PATH || DEFAULT_SAMPLE_TOOL_PATH
  const sampleToolUrl = `${siteUrl}${sampleToolPath.startsWith("/") ? sampleToolPath : `/${sampleToolPath}`}`

  console.log("=== MONTHLY SEO AUDIT ===")
  console.log(`Site: ${siteUrl}`)
  console.log("")

  console.log("1. Homepage status:")
  try {
    const { response, usedFallback } = await request(siteUrl, { method: "HEAD" })
    printLine("HTTP", String(response.status))
    if (usedFallback) {
      printLine("NOTE", "HEAD failed, used GET fallback")
    }
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n2. Robots.txt preview:")
  try {
    const { response, body } = await request(`${siteUrl}/robots.txt`)
    printLine("HTTP", String(response.status))
    body
      .split(/\r?\n/)
      .slice(0, 8)
      .forEach((line) => console.log(line))
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n3. Sitemap status:")
  try {
    const { response, usedFallback } = await request(`${siteUrl}/sitemap.xml`, { method: "HEAD" })
    printLine("HTTP", String(response.status))
    if (usedFallback) {
      printLine("NOTE", "HEAD failed, used GET fallback")
    }
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n4. No noindex on homepage:")
  try {
    const [{ response: headResponse }, { body }] = await Promise.all([
      request(siteUrl, { method: "HEAD" }),
      request(siteUrl),
    ])
    const hasNoindexHeader = /noindex/i.test(headResponse.headers.get("x-robots-tag") || "")
    const hasNoindexMeta = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(body)
    if (hasNoindexHeader || hasNoindexMeta) {
      console.log("WARNING: noindex found")
    } else {
      console.log("OK")
    }
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n5. Canonical on homepage:")
  try {
    const { body } = await request(siteUrl)
    const canonicalMatch = body.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)
    console.log(canonicalMatch ? canonicalMatch[0] : "Canonical not found")
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n6. Tool page sample:")
  try {
    const { response, usedFallback } = await request(sampleToolUrl, { method: "HEAD" })
    printLine("HTTP", String(response.status))
    if (usedFallback) {
      printLine("NOTE", "HEAD failed, used GET fallback")
    }
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n7. Tools hub status:")
  try {
    const { response, usedFallback } = await request(`${siteUrl}/tools`, { method: "HEAD" })
    printLine("HTTP", String(response.status))
    if (usedFallback) {
      printLine("NOTE", "HEAD failed, used GET fallback")
    }
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n8. X-Robots-Tag header:")
  try {
    const { response } = await request(siteUrl, { method: "HEAD" })
    const header = response.headers.get("x-robots-tag")
    console.log(header || "No X-Robots-Tag header found")
  } catch (error) {
    printLine("ERROR", error instanceof Error ? error.message : String(error))
  }

  console.log("\n=== AUDIT COMPLETE ===")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
