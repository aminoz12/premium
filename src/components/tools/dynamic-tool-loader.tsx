"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const loadingFallback = () => (
  <p className="text-sm text-muted-foreground">Loading tool interface...</p>
)

type ToolCategoryComponent = ComponentType<{ toolId: string }>
type ToolCategoryModule = { default?: ToolCategoryComponent }

const DynamicToolLoadError: ToolCategoryComponent = () => (
  <p className="text-sm text-destructive">
    Unable to load this tool right now. Please refresh and try again.
  </p>
)

function loadCategoryComponent(
  category: string,
  loader: () => Promise<ToolCategoryModule>
) {
  return dynamic<{ toolId: string }>(
    async () => {
      try {
        const loadedModule = await loader()
        if (typeof loadedModule.default === "function") {
          return loadedModule.default
        }
        console.error(
          `[DynamicToolLoader] Missing default export for "${category}" category.`
        )
        return DynamicToolLoadError
      } catch (error) {
        console.error(
          `[DynamicToolLoader] Failed to load "${category}" category module.`,
          error
        )
        return DynamicToolLoadError
      }
    },
    {
      ssr: false,
      loading: loadingFallback,
    }
  )
}

const dynamicCategoryComponents = {
  expansion: loadCategoryComponent("expansion", () =>
    import("@/components/tools/dynamic-tool-expansion")
  ),
  security: loadCategoryComponent("security", () =>
    import("@/components/tools/dynamic-tool-security")
  ),
  developer: loadCategoryComponent("developer", () =>
    import("@/components/tools/dynamic-tool-developer")
  ),
  text: loadCategoryComponent("text", () =>
    import("@/components/tools/dynamic-tool-text")
  ),
  image: loadCategoryComponent("image", () =>
    import("@/components/tools/dynamic-tool-image")
  ),
  design: loadCategoryComponent("design", () =>
    import("@/components/tools/dynamic-tool-design")
  ),
  seo: loadCategoryComponent("seo", () =>
    import("@/components/tools/dynamic-tool-seo")
  ),
  calculator: loadCategoryComponent("calculator", () =>
    import("@/components/tools/dynamic-tool-calculator")
  ),
  random: loadCategoryComponent("random", () =>
    import("@/components/tools/dynamic-tool-random")
  ),
  audio: loadCategoryComponent("audio", () =>
    import("@/components/tools/dynamic-tool-audio")
  ),
  file: loadCategoryComponent("file", () =>
    import("@/components/tools/dynamic-tool-file")
  ),
  data: loadCategoryComponent("data", () =>
    import("@/components/tools/dynamic-tool-data")
  ),
} as const

export function DynamicToolLoader({
  category,
  toolId,
}: {
  category: keyof typeof dynamicCategoryComponents
  toolId: string
}) {
  const ToolComponent = dynamicCategoryComponents[category]

  if (!ToolComponent) {
    return null
  }

  return <ToolComponent toolId={toolId} />
}
