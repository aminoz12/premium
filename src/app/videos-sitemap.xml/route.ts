import { NextResponse } from "next/server"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { liveTools } from "@/lib/tools/tools-config"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import { resolveToolVideo } from "@/lib/utils/tool-videos"

export const dynamic = "force-static"
export const revalidate = 3600

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function GET() {
  const urlEntries = liveTools
    .map((tool) => {
      const videos = resolveToolVideo(tool.id)
      if (!videos) return null

      // Every video sitemap entry needs a thumbnail.
      // We use the tool's primary image as the thumbnail.
      const thumbnailPath = getPrimaryToolImage(tool.id) || "/favicon-512x512.png"

      const pageUrl = buildAbsoluteUrl(tool.path)
      const videoUrl = buildAbsoluteUrl(videos.mp4)
      const thumbnailUrl = buildAbsoluteUrl(thumbnailPath)
      const publishedAt = new Date(`${tool.lastModified ?? "2026-04-17"}T00:00:00.000Z`).toISOString()

      const title = escapeXml(`${tool.name} - Free Online Tool Video`)
      const description = escapeXml(
        tool.description?.trim()
          ? `${tool.name}: ${tool.description.replace(/\s+/g, " ").trim()}`
          : `${tool.name} - free online tool video tutorial at The Free AI Tools`
      )
      const tags = [
        tool.name,
        tool.category,
        videos.source === "specific" ? "tool walkthrough" : `${tool.category} tools`,
        "free online tool",
        "browser based workflow",
      ].map(escapeXml)

      return `  <url>
    <loc>${pageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>${description}</video:description>
      <video:content_loc>${videoUrl}</video:content_loc>
      <video:publication_date>${publishedAt}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
      ${tags.map((tag) => `<video:tag>${tag}</video:tag>`).join("\n      ")}
    </video:video>
  </url>`
    })
    .filter(Boolean)
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
