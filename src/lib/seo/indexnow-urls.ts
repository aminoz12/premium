import { getHubPages } from "@/lib/hubs"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { liveTools, toolCategories } from "@/lib/tools/tools-config"

export function getCanonicalIndexNowUrls() {
  const staticPaths = [
    "/",
    "/about",
    "/acceptable-use",
    "/categories",
    "/contact",
    "/disclaimer",
    "/privacy",
    "/security",
    "/terms",
    "/tools",
  ]

  const urls = [
    ...staticPaths,
    ...liveTools.map((tool) => tool.path),
    ...toolCategories.map((category) => `/categories/${category.id}`),
    ...getHubPages().map((page) => `/${page.slug}`),
  ]

  return Array.from(new Set(urls))
    .map((pathname) => buildAbsoluteUrl(pathname))
    .sort((first, second) => first.localeCompare(second))
}
