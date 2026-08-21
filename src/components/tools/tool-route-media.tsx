"use client"

import { usePathname } from "next/navigation"
import { ToolMediaShowcase } from "@/components/ui/tool-image"

type ToolRouteMediaItem = {
  name: string
  images: string[]
  video?: {
    mp4: string
  } | null
}

type ToolRouteMediaProps = {
  mediaBySlug: Record<string, ToolRouteMediaItem>
}

export function ToolRouteMedia({ mediaBySlug }: ToolRouteMediaProps) {
  const pathname = usePathname()
  const [, root, slug] = pathname.split("/")

  if (root !== "tools" || !slug) return null

  const media = mediaBySlug[decodeURIComponent(slug)]
  if (!media) return null

  return (
    <div className="container mx-auto px-4 pt-8">
      <ToolMediaShowcase
        images={media.images}
        toolName={media.name}
        video={media.video}
      />
    </div>
  )
}
