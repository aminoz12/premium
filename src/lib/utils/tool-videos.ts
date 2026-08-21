import fs from "fs"
import path from "path"
import { getToolById } from "@/lib/tools/tools-config"

const VIDEOS_MP4_DIR = path.join(process.cwd(), "public", "videos-mp4")
const DEFAULT_VIDEO_BASES = ["security"]

export interface ToolVideos {
  mp4: string
}

export interface ToolVideoResolution extends ToolVideos {
  baseName: string
  source: "specific" | "category" | "default"
}

let cachedMp4Files: string[] | null = null
let cachedMp4Set: Set<string> | null = null

function getVideoCatalog() {
  if (!cachedMp4Files || !cachedMp4Set) {
    cachedMp4Files = fs.readdirSync(VIDEOS_MP4_DIR)
    cachedMp4Set = new Set(cachedMp4Files.map((file) => file.toLowerCase()))
  }

  return {
    mp4Files: cachedMp4Files,
    hasMp4: (fileName: string) => cachedMp4Set?.has(fileName.toLowerCase()) ?? false,
  }
}

/**
 * Returns the video paths for a tool in mp4 format.
 * Fallback priority:
 * 1. Specific tool video (e.g. `qr-code-generator.mp4`)
 * 2. Default fallback (e.g. `security.mp4`)
 */
export function resolveToolVideo(toolId: string): ToolVideoResolution | null {
  try {
    const catalog = getVideoCatalog()
    const tool = getToolById(toolId)
    if (!tool) return null

    // Helper to check if format exist
    const getIfExist = (
      basename: string,
      source: ToolVideoResolution["source"]
    ): ToolVideoResolution | null => {
      const mp4Name = `${basename}.mp4`

      if (catalog.hasMp4(mp4Name)) {
        return {
          baseName: basename,
          source,
          mp4: `/videos-mp4/${mp4Name}`,
        }
      }
      return null
    }

    // 1. Try specific tool video
    const specificMatch = getIfExist(toolId, "specific")
    if (specificMatch) return specificMatch

    // 2. Fallback default video
    for (const fallback of DEFAULT_VIDEO_BASES) {
      const fbMatch = getIfExist(fallback, "default")
      if (fbMatch) return fbMatch
    }

    return null
  } catch {
    return null
  }
}

export function getToolVideo(toolId: string): ToolVideos | null {
  const video = resolveToolVideo(toolId)
  if (!video) return null

  return {
    mp4: video.mp4,
  }
}
