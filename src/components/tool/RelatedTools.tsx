import Link from "next/link"
import type { Tool } from "@/lib/tools/tools-config"

export function RelatedTools({
  tools,
  currentSlug,
}: {
  tools: Tool[]
  currentSlug: string
}) {
  const visibleTools = tools.filter((tool) => tool.id !== currentSlug).slice(0, 5)

  if (visibleTools.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="related-tools-heading" className="mt-10">
      <div className="mb-4">
        <h2 id="related-tools-heading" className="text-2xl font-semibold tracking-tight">
          Related Free Online Tools
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Keep the workflow moving with nearby tools that solve the next likely step.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleTools.map((tool) => (
          <li key={tool.id}>
            <Link
              href={tool.path}
              prefetch={false}
              title={`Free ${tool.name} online`}
              className="block rounded-2xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/20"
            >
              <p className="text-base font-semibold">{tool.name}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">
                Explore free {tool.name.toLowerCase()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
