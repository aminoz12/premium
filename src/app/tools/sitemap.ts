import type { MetadataRoute } from "next"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { liveTools } from "@/lib/tools/tools-config"

export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  return liveTools.map((tool) => ({
    url: buildAbsoluteUrl(tool.path),
    lastModified: new Date(`${tool.lastModified ?? "2026-04-17"}T00:00:00.000Z`),
    changeFrequency: "weekly",
    priority: 0.8,
  }))
}
