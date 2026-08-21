import { ToolLayout as ToolLayoutBase } from "./tool-layout"
import { SchemaMarkup } from "@/components/seo/SchemaMarkup"
import { getToolSeoContent } from "@/lib/seo/tool-content"

type Props = {
  toolId: string
  title?: string
  description?: string
  children: React.ReactNode
}

export async function ToolLayout({ toolId, ...rest }: Props) {
  const seo = getToolSeoContent(toolId)

  if (!seo) {
    return <ToolLayoutBase toolId={toolId} {...rest} />
  }

  return (
    <>
      <SchemaMarkup tool={seo} />
      <ToolLayoutBase toolId={toolId} {...rest} />
    </>
  )
}

export { ToolCard, ToolEmptyState } from "./tool-layout"
