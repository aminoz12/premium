import Link from "next/link"
import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"
import { buildPageMetadata } from "@/lib/page-metadata"
import { toolCategories } from "@/lib/tools/tools-config"

export const metadata: Metadata = buildPageMetadata({
  title: "Page Not Found",
  description:
    "The page you requested does not exist. Search The Free AI Tools or jump back to a popular tool category.",
  path: "/404",
})

export default function NotFound() {
  const popularCategories = toolCategories.slice(0, 6)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_200px]">
        <section className="min-w-0 rounded-[2rem] border bg-card/70 p-8 text-center shadow-sm md:p-12">
          <Badge variant="secondary" className="mb-4">
            404
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">We couldn&apos;t find that page</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            The route may have changed, the page may have been removed, or the link might be
            outdated. Use the recovery tools below to get back to a live category or search the
            catalog directly.
          </p>

          <form action="/search" className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="search"
              name="q"
              placeholder="Search for a tool, workflow, or category"
              className="h-12 flex-1 rounded-xl border bg-background px-4 text-sm"
              aria-label="Search The Free AI Tools"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Go home
            </Link>
            <Link
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium"
            >
              Browse search
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold">Popular categories</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  prefetch={false}
                  className="rounded-2xl border bg-background px-4 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted/20"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

         


        </section>

       
      </div>
    </div>
  )
}
