import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { PlannedToolPage } from "@/components/tools/planned-tool-page"
import { DynamicToolLoader } from "@/components/tools/dynamic-tool-loader"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { isExpansionToolId } from "@/lib/tools/expansion-tool-ids"
import { dynamicToolIds, liveTools, getToolById } from "@/lib/tools/tools-config"
import { resolveLegacyToolSlug } from "@/lib/tools/legacy-slugs"

export const revalidate = 3600

export function generateStaticParams() {
  return liveTools
    .filter((tool) => dynamicToolIds.has(tool.id) && tool.pageType === "dynamic")
    .map((tool) => ({ slug: tool.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = resolveLegacyToolSlug(slug)
  const tool = getToolById(canonicalSlug)

  if (!tool) {
    return {}
  }

  return buildToolMetadata(tool.id)
}

export default async function DynamicToolRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const canonicalSlug = resolveLegacyToolSlug(slug)

  if (canonicalSlug !== slug) {
    const canonicalTool = getToolById(canonicalSlug)

    if (canonicalTool) {
      permanentRedirect(canonicalTool.path)
    }
  }

  const tool = getToolById(canonicalSlug)

  if (!tool || !dynamicToolIds.has(canonicalSlug) || tool.pageType !== "dynamic") {
    notFound()
  }

  if (tool.status === "preview" && !isExpansionToolId(canonicalSlug)) {
    return (
      <ToolLayout toolId={canonicalSlug}>
        <PlannedToolPage toolId={canonicalSlug} />
      </ToolLayout>
    )
  }

  const loaderCategory = isExpansionToolId(canonicalSlug)
    ? "expansion"
    : tool.category

  if (
    ![
      "expansion",
      "security",
      "developer",
      "text",
      "image",
      "design",
      "seo",
      "calculator",
      "random",
      "audio",
      "file",
      "data",
    ].includes(loaderCategory)
  ) {
    notFound()
  }

  return (
    <ToolLayout toolId={canonicalSlug}>
      <DynamicToolLoader
        category={
          loaderCategory as
            | "expansion"
            | "security"
            | "developer"
            | "text"
            | "image"
            | "design"
            | "seo"
            | "calculator"
            | "random"
            | "audio"
            | "file"
            | "data"
        }
        toolId={canonicalSlug}
      />
    </ToolLayout>
  )
}
