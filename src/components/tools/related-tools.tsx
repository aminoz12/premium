import Link from "next/link"

interface RelatedTool {
  name: string
  path: string
}

interface RelatedToolsProps {
  tools: RelatedTool[]
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools.length) return null

  return (
    <section className="mt-8 pt-6 border-t">
      <h2 className="text-sm font-semibold mb-3">Related Free Tools</h2>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            href={tool.path}
            className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted transition-colors"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
