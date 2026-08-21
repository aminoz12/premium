"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getToolById } from "@/lib/tools/tools-config"

interface SerializableTool {
  id: string
  name: string
  description: string
  path: string
}

interface SerializableCategory {
  category: {
    id: string
    name: string
    description?: string
  }
  items: SerializableTool[]
}

const INITIAL_CATEGORIES = 3
const LOAD_MORE_COUNT = 4

export function LazyCategories({ categoriesWithTools }: { categoriesWithTools: SerializableCategory[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_CATEGORIES)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visibleCount >= categoriesWithTools.length) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, categoriesWithTools.length))
        }
      },
      { rootMargin: "500px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, categoriesWithTools.length])

  const visible = categoriesWithTools.slice(0, visibleCount)
  const remaining = categoriesWithTools.length - visibleCount

  return (
    <div className="space-y-8">
      {visible.map(({ category, items }) => (
        <section
          key={category.id}
          id={`category-${category.id}`}
          className="rounded-3xl border bg-card/60 p-6 md:p-8"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
              {category.description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>
            <Badge variant="outline">{items.length} live tools</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((tool) => {
              const toolData = getToolById(tool.id)
              const Icon = toolData?.icon
              return (
                <Link key={tool.id} href={tool.path} prefetch={false} className="hover:text-primary">
                  <article className="rounded-2xl border bg-background p-5 transition-colors hover:border-primary/50 hover:bg-muted/20">
                    {Icon && (
                      <div className="mb-4 w-fit rounded-xl bg-primary/10 p-2 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{tool.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                  </article>
                </Link>
              )
            })}
          </div>

          <div className="mt-5">
            <Link
              href={`/categories/${category.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View the full {category.name.toLowerCase()} category page
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      ))}

      {visibleCount < categoriesWithTools.length && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-3 text-sm text-muted-foreground">
            {remaining} more {remaining === 1 ? "category" : "categories"} loading…
          </span>
        </div>
      )}
    </div>
  )
}
