import { hubPages, type HubPage } from "@/data/hub-pages"
import { getCategoryById, getToolById } from "@/lib/tools/tools-config"

export function getHubPages() {
  return [...hubPages]
}

export function getHubPageBySlug(slug: string) {
  return hubPages.find((page) => page.slug === slug) ?? null
}

export function getHubFeaturedTools(page: HubPage) {
  return page.featuredToolIds
    .map((toolId) => getToolById(toolId))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
}

export function getHubCategories(page: HubPage) {
  return page.categoryIds
    .map((categoryId) => getCategoryById(categoryId))
    .filter((category): category is NonNullable<typeof category> => Boolean(category))
}
