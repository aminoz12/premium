

import { ToolRouteMedia } from "@/components/tools/tool-route-media"
import { liveTools } from "@/lib/tools/tools-config"
import { getToolImages } from "@/lib/utils/tool-images"
import { getToolVideo } from "@/lib/utils/tool-videos"

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const mediaBySlug = Object.fromEntries(
    liveTools.map((tool) => [
      tool.id,
      {
        name: tool.name,
        images: getToolImages(tool.id),
        video: getToolVideo(tool.id),
      },
    ])
  )

  return (
    <>
    
      {children}
     
      <ToolRouteMedia mediaBySlug={mediaBySlug} />

    </>
  )
}
