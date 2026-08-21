"use client"

import { useEffect, useState } from "react"

interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Auto-generated Table of Contents for blog posts.
 *
 * SEO benefit: helps Google generate Featured Snippets from structured headings.
 * UX benefit: improves page navigation for long-form content → higher session duration → more ad impressions.
 */
export function TableOfContents({ contentSelector = "article" }: { contentSelector?: string }) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const container = document.querySelector(contentSelector)
    if (!container) return

    const headings = container.querySelectorAll("h2, h3")
    const tocItems: TocItem[] = []

    headings.forEach((heading) => {
      const el = heading as HTMLElement
      // Auto-generate ID if missing
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim() ?? ""
      }

      if (el.id) {
        tocItems.push({
          id: el.id,
          text: el.textContent?.trim() ?? "",
          level: el.tagName === "H2" ? 2 : 3,
        })
      }
    })

    setItems(tocItems)
  }, [contentSelector])

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="mb-8 rounded-2xl border bg-card/60 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Table of Contents
      </h2>
      <ol className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "ml-4" : ""}
          >
            <a
              href={`#${item.id}`}
              className={`block rounded-lg px-3 py-1.5 transition-colors hover:bg-muted/50 ${
                activeId === item.id
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
