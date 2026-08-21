import fs from "fs"
import path from "path"
import { getToolById } from "@/lib/tools/tools-config"

const IMAGES_DIR = path.join(process.cwd(), "public", "images")

const CATEGORY_FALLBACKS: Record<string, string> = {
  accessibility: "accessibility",
  astronomy: "astronomy",
  audio: "audio",
  calculator: "calculator",
  data: "data",
  design: "design",
  developer: "developer",
  education: "education",
  engineering: "developer",
  file: "file",
  finance: "finance",
  image: "image",
  random: "random",
  security: "security",
  seo: "seo",
  text: "text",
}

/**
 * Returns all screenshot paths for a tool, ordered:
 *   /images/{id}.webp  → /images/{id}-1.webp  → /images/{id}-2.webp …
 * Falls back to the category image if no tool-specific image exists.
 * Runs at build-time (server component / generateStaticParams), never in the browser.
 */
export function getToolImages(toolId: string): string[] {
  try {
    const files = fs.readdirSync(IMAGES_DIR)
    const primary = `${toolId}.webp`
    const variantRe = new RegExp(`^${escapeRe(toolId)}-\\d+\\.webp$`, "i")

    const matched = files.filter(
      (f) => f.toLowerCase() === primary.toLowerCase() || variantRe.test(f)
    )

    if (matched.length > 0) {
      matched.sort((a, b) => {
        const aIsPrimary = a.toLowerCase() === primary.toLowerCase()
        const bIsPrimary = b.toLowerCase() === primary.toLowerCase()
        if (aIsPrimary) return -1
        if (bIsPrimary) return 1
        const aNum = parseInt(a.match(/-(\d+)\.webp$/i)?.[1] ?? "0", 10)
        const bNum = parseInt(b.match(/-(\d+)\.webp$/i)?.[1] ?? "0", 10)
        return aNum - bNum
      })
      return matched.map((f) => `/images/${f}`)
    }

    // No tool-specific image — fall back to the category image
    const tool = getToolById(toolId)
    if (tool) {
      const fallbackName = CATEGORY_FALLBACKS[tool.category]
      if (fallbackName) {
        const fallbackFile = `${fallbackName}.webp`
        if (files.some((f) => f.toLowerCase() === fallbackFile.toLowerCase())) {
          return [`/images/${fallbackFile}`]
        }
      }
    }

    return []
  } catch {
    return []
  }
}

/** Returns only the primary image path, or null if it doesn't exist. */
export function getPrimaryToolImage(toolId: string): string | null {
  return getToolImages(toolId)[0] ?? null
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
