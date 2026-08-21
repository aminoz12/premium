const DEFAULT_SITE_URL = "https://www.thefreeaitools.com"
const DEFAULT_NON_WWW_URL = "https://thefreeaitools.com"
const DEFAULT_PREVIEW_URL = "https://toolkitpropp.vercel.app"
const DEFAULT_SAMPLE_TOOL_PATH = "/tools/password-generator"

function normalizeBaseUrl(value) {
  const raw = value?.trim() || DEFAULT_SITE_URL
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, "")
}

function trimPreview(text, maxLength = 320) {
  const normalized = text.replace(/\s+/g, " ").trim()
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized
}

async function request(url, { method = "GET", follow = true, headers } = {}) {
  try {
    const response = await fetch(url, {
      method,
      redirect: follow ? "follow" : "manual",
      headers,
    })

    const body = method === "HEAD" ? "" : await response.text()
    return { response, body, usedFallback: false }
  } catch (error) {
    if (method !== "HEAD") {
      throw error
    }

    const fallbackResponse = await fetch(url, {
      method: "GET",
      redirect: follow ? "follow" : "manual",
      headers,
    })

    return { response: fallbackResponse, body: "", usedFallback: true }
  }
}

function printHeader(name, value) {
  console.log(`- ${name}: ${value ?? "(missing)"}`)
}

function hasMetaRobotsNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)
}

function extractCanonicalTag(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ?? "(missing)"
}

async function run() {
  const canonicalBaseUrl = normalizeBaseUrl(process.env.SITE_URL)
  const nonWwwUrl = normalizeBaseUrl(process.env.NON_WWW_URL || DEFAULT_NON_WWW_URL)
  const previewUrl = normalizeBaseUrl(process.env.PREVIEW_URL || DEFAULT_PREVIEW_URL)
  const sampleToolPath = process.env.SEO_SAMPLE_TOOL_PATH || DEFAULT_SAMPLE_TOOL_PATH
  const sampleEmbeddedPath =
    process.env.SEO_SAMPLE_EMBEDDED_PATH ||
    sampleToolPath.replace(/^\/tools\//, "/embedded-tools/")
  const sampleStandaloneHtmlPath =
    process.env.SEO_SAMPLE_STANDALONE_HTML_PATH || "/embedded-tools/generate-password.html"

  console.log("=== SEO PRE-FLIGHT DIAGNOSTICS ===")
  console.log(`Canonical URL: ${canonicalBaseUrl}`)
  console.log(`Non-www URL:   ${nonWwwUrl}`)
  console.log(`Preview URL:   ${previewUrl}`)
  console.log(`Sample tool:   ${sampleToolPath}`)

  console.log("\n1) Canonical host HEAD")
  try {
    const { response, usedFallback } = await request(canonicalBaseUrl, { method: "HEAD" })
    console.log(`- HTTP ${response.status} (${response.url})`)
    if (usedFallback) {
      console.log("- HEAD fallback: GET used because HEAD request failed")
    }
    printHeader("x-robots-tag", response.headers.get("x-robots-tag"))
    printHeader("content-type", response.headers.get("content-type"))
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n2) Non-www redirect check (must resolve to canonical)")
  try {
    const { response, usedFallback } = await request(nonWwwUrl, { method: "HEAD", follow: false })
    console.log(`- HTTP ${response.status} (${response.url})`)
    if (usedFallback) {
      console.log("- HEAD fallback: GET used because HEAD request failed")
    }
    printHeader("location", response.headers.get("location"))
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n3) Preview host redirect check (must resolve to canonical)")
  try {
    const { response, usedFallback } = await request(previewUrl, { method: "HEAD", follow: false })
    console.log(`- HTTP ${response.status} (${response.url})`)
    if (usedFallback) {
      console.log("- HEAD fallback: GET used because HEAD request failed")
    }
    printHeader("location", response.headers.get("location"))
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n4) robots.txt check")
  try {
    const { response, body } = await request(`${canonicalBaseUrl}/robots.txt`)
    const hasGlobalBlock = /disallow:\s*\/\s*$/gim.test(body)
    console.log(`- HTTP ${response.status}`)
    console.log(`- Global block found: ${hasGlobalBlock ? "YES (RISK)" : "NO"}`)
    console.log("- Preview:")
    body
      .split(/\r?\n/)
      .slice(0, 12)
      .forEach((line) => console.log(`  ${line}`))
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n5) Homepage noindex checks")
  try {
    const [{ response: headResponse }, { body }] = await Promise.all([
      request(canonicalBaseUrl, { method: "HEAD" }),
      request(canonicalBaseUrl),
    ])
    const hasNoindexMeta = hasMetaRobotsNoindex(body)
    const hasNoindexWord = /noindex/i.test(body)
    printHeader("x-robots-tag", headResponse.headers.get("x-robots-tag"))
    console.log(`- <meta robots noindex>: ${hasNoindexMeta ? "FOUND (RISK)" : "not found"}`)
    console.log(`- "noindex" token in HTML: ${hasNoindexWord ? "FOUND (review)" : "not found"}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n6) Googlebot render snapshot")
  try {
    const { response, body } = await request(canonicalBaseUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    })
    const hasH1 = /<h1[\s>]/i.test(body)
    const hasJsonLd = /application\/ld\+json/i.test(body)
    const hasDescription = /<meta[^>]+name=["']description["']/i.test(body)
    console.log(`- HTTP ${response.status}`)
    console.log(`- h1 present: ${hasH1 ? "yes" : "no"}`)
    console.log(`- JSON-LD present: ${hasJsonLd ? "yes" : "no"}`)
    console.log(`- meta description present: ${hasDescription ? "yes" : "no"}`)
    console.log(`- HTML preview: ${trimPreview(body)}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n7) Sitemap checks")
  try {
    const { response, body } = await request(`${canonicalBaseUrl}/sitemap.xml`)
    const looksXml = /<\?xml|<sitemapindex|<urlset/i.test(body)
    console.log(`- HTTP ${response.status}`)
    console.log(`- XML detected: ${looksXml ? "yes" : "no (RISK)"}`)
    console.log("- Preview:")
    body
      .split(/\r?\n/)
      .slice(0, 8)
      .forEach((line) => console.log(`  ${line}`))
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n8) Canonical tag check")
  try {
    const { body } = await request(canonicalBaseUrl)
    console.log(`- Canonical tag: ${extractCanonicalTag(body)}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n9) Sample tool page HEAD")
  try {
    const sampleUrl = `${canonicalBaseUrl}${sampleToolPath.startsWith("/") ? sampleToolPath : `/${sampleToolPath}`}`
    const { response, usedFallback } = await request(sampleUrl, { method: "HEAD" })
    console.log(`- HTTP ${response.status} (${response.url})`)
    if (usedFallback) {
      console.log("- HEAD fallback: GET used because HEAD request failed")
    }
    printHeader("x-robots-tag", response.headers.get("x-robots-tag"))
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n10) Search landing page crawl check")
  try {
    const [{ response: headResponse }, { body }] = await Promise.all([
      request(`${canonicalBaseUrl}/search`, { method: "HEAD" }),
      request(`${canonicalBaseUrl}/search`),
    ])
    printHeader("x-robots-tag", headResponse.headers.get("x-robots-tag"))
    console.log(`- <meta robots noindex>: ${hasMetaRobotsNoindex(body) ? "FOUND (RISK)" : "not found (expected)"}`)
    console.log(`- Canonical tag: ${extractCanonicalTag(body)}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n11) Search results page crawl check")
  try {
    const { body } = await request(`${canonicalBaseUrl}/search?q=password`)
    console.log(`- <meta robots noindex>: ${hasMetaRobotsNoindex(body) ? "FOUND (RISK)" : "not found (expected)"}`)
    console.log(`- Canonical tag: ${extractCanonicalTag(body)}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n12) Tools hub HEAD")
  try {
    const { response, usedFallback } = await request(`${canonicalBaseUrl}/tools`, { method: "HEAD" })
    console.log(`- HTTP ${response.status} (${response.url})`)
    if (usedFallback) {
      console.log("- HEAD fallback: GET used because HEAD request failed")
    }
    printHeader("x-robots-tag", response.headers.get("x-robots-tag"))
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n13) Embedded tools home check")
  try {
    const [{ response: headResponse }, { body }] = await Promise.all([
      request(`${canonicalBaseUrl}/embedded-tools`, { method: "HEAD" }),
      request(`${canonicalBaseUrl}/embedded-tools`),
    ])
    console.log(`- HTTP ${headResponse.status} (${headResponse.url})`)
    printHeader("x-robots-tag", headResponse.headers.get("x-robots-tag"))
    console.log(`- <meta robots noindex>: ${hasMetaRobotsNoindex(body) ? "FOUND (RISK)" : "not found (expected)"}`)
    console.log(`- Canonical tag: ${extractCanonicalTag(body)}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n14) Sample embedded wrapper check")
  try {
    const sampleUrl = `${canonicalBaseUrl}${sampleEmbeddedPath.startsWith("/") ? sampleEmbeddedPath : `/${sampleEmbeddedPath}`}`
    const [{ response: headResponse }, { body }] = await Promise.all([
      request(sampleUrl, { method: "HEAD" }),
      request(sampleUrl),
    ])
    console.log(`- HTTP ${headResponse.status} (${headResponse.url})`)
    printHeader("x-robots-tag", headResponse.headers.get("x-robots-tag"))
    console.log(`- <meta robots noindex>: ${hasMetaRobotsNoindex(body) ? "FOUND (RISK)" : "not found (expected)"}`)
    console.log(`- Canonical tag: ${extractCanonicalTag(body)}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n15) Standalone embedded HTML check")
  try {
    const standaloneUrl = `${canonicalBaseUrl}${sampleStandaloneHtmlPath.startsWith("/") ? sampleStandaloneHtmlPath : `/${sampleStandaloneHtmlPath}`}`
    const [{ response: headResponse, usedFallback }, { body }] = await Promise.all([
      request(standaloneUrl, { method: "HEAD" }),
      request(standaloneUrl),
    ])
    console.log(`- HTTP ${headResponse.status} (${headResponse.url})`)
    if (usedFallback) {
      console.log("- HEAD fallback: GET used because HEAD request failed")
    }
    printHeader("x-robots-tag", headResponse.headers.get("x-robots-tag"))
    console.log(`- <meta robots noindex>: ${hasMetaRobotsNoindex(body) ? "FOUND (RISK)" : "not found (expected)"}`)
    console.log(`- Canonical tag: ${extractCanonicalTag(body)}`)
  } catch (error) {
    console.log(`- ERROR: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log("\n=== END SEO PRE-FLIGHT ===")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
