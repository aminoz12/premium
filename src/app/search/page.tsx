import Link from "next/link"
import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/page-metadata"
import { searchTools, toolCategories } from "@/lib/tools/tools-config"

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q = "" } = await searchParams
  const query = q.trim()

  return buildPageMetadata({
    title: query ? `Search Results for ${query}` : "Search",
    description: query
      ? `Search results for ${query} across browser-based utilities, developer tools, SEO tools, text workflows, image tools, and calculators on The Free AI Tools.`
      : "Search The Free AI Tools for browser-based utilities across development, SEO, file workflows, accessibility, finance, and more.",
    path: "/search",
    follow: true,
    keywords: [
      "tool search",
      "privacy-first search",
      "browser tools search",
      ...(query ? [query] : []),
    ],
  })
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams
  const query = q.trim()
  const results = query ? searchTools(query).slice(0, 48) : []

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_200px]">
        <section className="min-w-0">
          <header className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Search The Free AI Tools</h1>
            <p className="max-w-2xl text-muted-foreground">
              Find browser-based tools by name, category, use case, or workflow keyword.
            </p>

            <form action="/search" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search tools, categories, and workflows"
                className="h-12 flex-1 rounded-xl border bg-background px-4 text-sm outline-none ring-0"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                Search
              </button>
            </form>
          </header>

          {query ? (
            <p className="mb-6 text-sm text-muted-foreground">
              Found {results.length} matching tools for <span className="font-medium text-foreground">{query}</span>.
            </p>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">
              Start with a tool name, category, or workflow like &quot;schema&quot;, &quot;image&quot;, or
              &quot;loan&quot;.
            </p>
          )}

          {!query ? (
            <div className="mb-8 rounded-2xl border bg-card/60 p-5">
              <h2 className="text-lg font-semibold">Popular categories</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                If you are not sure what to search for yet, start with a category page and drill into the tools from
                there.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {toolCategories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    prefetch={false}
                    className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted/30"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                prefetch={false}
                className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/20"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {query && results.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              No results yet. Try broader terms like &quot;SEO&quot;, &quot;image&quot;, &quot;finance&quot;, or
              &quot;accessibility&quot;.
            </div>
          ) : null}



         
        </section>

      
      </div>
    </div>
  )
}

