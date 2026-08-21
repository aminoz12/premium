import { NextResponse } from "next/server"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { liveTools } from "@/lib/tools/tools-config"
import { getToolImages } from "@/lib/utils/tool-images"

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
      const images = getToolImages(tool.id)
      if (images.length === 0) return null

      const pageUrl = buildAbsoluteUrl(tool.path)

      const imageNodes = images
        .map((imgPath, idx) => {
          const imgUrl = buildAbsoluteUrl(imgPath)
          const title =
            idx === 0
              ? escapeXml(`${tool.name} — Free Online Tool`)
              : escapeXml(`${tool.name} — screenshot ${idx + 1}`)
          // Use the tool's real description as the caption so Google Images has
          // unique, descriptive context per tool instead of a boilerplate line.
          const caption = escapeXml(
            tool.description?.trim()
              ? `${tool.name}: ${tool.description.replace(/\s+/g, " ").trim()}`
              : `${tool.name} — free online tool at The Free AI Tools`
          )
          return `    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${caption}</image:caption>
    </image:image>`
        })
        .join("\n")

      return `  <url>
    <loc>${pageUrl}</loc>
${imageNodes}
  </url>`
    })
    .filter(Boolean)
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
