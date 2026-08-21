import type { MetadataRoute } from "next"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { toolCategories } from "@/lib/tools/tools-config"

export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  return toolCategories.map((category) => ({
    url: buildAbsoluteUrl(`/categories/${category.id}`),
    lastModified: new Date("2026-04-17T00:00:00.000Z"),
    changeFrequency: "weekly",
    priority: 0.9,
  }))
}
