import type { MetadataRoute } from "next"
import { getHubPages } from "@/lib/hubs"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { getAllAlternativeParams } from "@/lib/seo/alternatives-content"
import { getAllCompareSlugs } from "@/lib/seo/compare-data"
import { getAllBestSlugs } from "@/lib/seo/best-data"
import { getAllUseCaseSlugs } from "@/lib/seo/use-cases-data"
import { liveTools, toolCategories } from "@/lib/tools/tools-config"
import { blogPosts } from "@/lib/blog/posts"

export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static high-value pages that were missing from crawl
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: buildAbsoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: buildAbsoluteUrl("/tools"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: buildAbsoluteUrl("/categories"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: buildAbsoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: buildAbsoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: buildAbsoluteUrl("/alternatives"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: buildAbsoluteUrl("/compare"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: buildAbsoluteUrl("/best"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: buildAbsoluteUrl("/use-cases"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: buildAbsoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    // Trust / policy pages — AdSense and search engines expect these discoverable.
    { url: buildAbsoluteUrl("/security"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: buildAbsoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: buildAbsoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: buildAbsoluteUrl("/disclaimer"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: buildAbsoluteUrl("/acceptable-use"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const blogRoutes = blogPosts.map((post) => ({
    url: buildAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(`${post.date}T00:00:00.000Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const toolRoutes = liveTools.map((tool) => ({
    url: buildAbsoluteUrl(tool.path),
    lastModified: new Date(`${tool.lastModified ?? "2026-05-13"}T00:00:00.000Z`),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryRoutes = toolCategories.map((category) => ({
    url: buildAbsoluteUrl(`/categories/${category.id}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const hubRoutes = getHubPages().map((page) => ({
    url: buildAbsoluteUrl(`/${page.slug}`),
    lastModified: page.updatedAt ? new Date(`${page.updatedAt}T00:00:00.000Z`) : now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const alternativeRoutes = getAllAlternativeParams().map(({ competitor }) => ({
    url: buildAbsoluteUrl(`/alternatives/${competitor}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  const compareRoutes = getAllCompareSlugs().map(({ pair }) => ({
    url: buildAbsoluteUrl(`/compare/${pair}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const bestRoutes = getAllBestSlugs().map(({ category }) => ({
    url: buildAbsoluteUrl(`/best/${category}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  const useCaseRoutes = getAllUseCaseSlugs().map(({ useCase }) => ({
    url: buildAbsoluteUrl(`/use-cases/${useCase}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...toolRoutes,
    ...categoryRoutes,
    ...hubRoutes,
    ...alternativeRoutes,
    ...compareRoutes,
    ...bestRoutes,
    ...useCaseRoutes,
  ]
}
