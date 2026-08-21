import type { SeoBreadcrumbItem } from "@/lib/seo/tool-content"

export function Breadcrumb({ items }: { items: SeoBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.url} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-foreground">{item.name}</span>
              ) : (
                <a href={item.url} className="hover:text-foreground">
                  {item.name}
                </a>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
