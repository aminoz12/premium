import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"

export function ContentPage({
  badge,
  title,
  summary,
  lastUpdated,
  children,
}: {
  badge: string
  title: string
  summary: string
  lastUpdated?: string
  children: ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_200px]">
        <article className="min-w-0">
          <Badge variant="secondary" className="mb-4">
            {badge}
          </Badge>
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{summary}</p>
          {lastUpdated ? (
            <p className="mt-4 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          ) : null}
          <div className="my-8">
            
          </div>
          <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">{children}</div>
          <div className="mt-10">
            
          </div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-6">
            
            
          </div>
        </aside>
      </div>
    </div>
  )
}
