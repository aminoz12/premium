import manifestJson from "@/lib/data/embedded-html-manifest.json"

export type EmbeddedHtmlManifestCategory =
  | "content"
  | "developer"
  | "document"
  | "image"
  | "media"
  | "network"
  | "portal"
  | "productivity"
  | "security"
  | "text"

export type EmbeddedHtmlManifestStatus = "active" | "duplicate" | "legacy"

export type EmbeddedHtmlManifestEntry = {
  id: string
  fileName: string
  path: string
  canonicalPath: string
  title: string
  description: string
  category: EmbeddedHtmlManifestCategory
  status: EmbeddedHtmlManifestStatus
  primaryFeatures: string[]
  indexable: boolean
  directoryListed: boolean
  requiresExternalApi: boolean | null
  containsThirdPartyAds: boolean | null
  aliases: string[]
  relatedToolId: string | null
  redirectTarget?: string
}

export const embeddedHtmlCategoryLabels: Record<
  EmbeddedHtmlManifestCategory,
  string
> = {
  content: "Content & Reading",
  developer: "Developer & Diagramming",
  document: "Document & PDF",
  image: "Image & Creative",
  media: "Audio & Media",
  network: "Network & Diagnostics",
  portal: "Portal & Directory",
  productivity: "Productivity",
  security: "Security & Utility",
  text: "Text & Writing",
}

export const embeddedHtmlManifest =
  manifestJson as EmbeddedHtmlManifestEntry[]

export const directoryEmbeddedHtmlManifest = embeddedHtmlManifest.filter(
  (entry) => entry.directoryListed
)

export const indexableEmbeddedHtmlManifest = embeddedHtmlManifest.filter(
  (entry) => entry.indexable
)

export function getEmbeddedHtmlManifestEntryByFileName(fileName: string) {
  return embeddedHtmlManifest.find((entry) => entry.fileName === fileName) ?? null
}

export function getEmbeddedHtmlManifestEntryByPath(path: string) {
  return embeddedHtmlManifest.find((entry) => entry.path === path) ?? null
}
