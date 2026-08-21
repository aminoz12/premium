import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/seo/json-ld"
import { buildCategoryMetadata } from "@/lib/seo/metadata"
import { buildBreadcrumbSchema, buildCategorySchema, buildFaqSchema } from "@/lib/seo/schema"
import {
  getCategoryById,
  getToolsByCategory,
  toolCategories,
  liveTools,
} from "@/lib/tools/tools-config"
import { getHubPages } from "@/lib/hubs"
import { getCategoryHubContent } from "@/lib/seo/category-content"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryImage, ToolThumb } from "@/components/ui/tool-image"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import fs from "fs"
import path from "path"

function getCategoryImageSrc(categoryId: string): string | null {
  const p = path.join(process.cwd(), "public", "images", `${categoryId}.webp`)
  return fs.existsSync(p) ? `/images/${categoryId}.webp` : null
}

export function generateStaticParams() {
  return toolCategories.map((category) => ({ category: category.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: categoryId } = await params
  const category = getCategoryById(categoryId)

  if (!category) {
    return {}
  }

  return buildCategoryMetadata(category.id)
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categoryId } = await params
  const category = getCategoryById(categoryId)

  if (!category) {
    notFound()
  }

  const categoryTools = getToolsByCategory(category.id)
  const liveCategoryTools = categoryTools.filter((tool) => tool.status !== "preview")
  const previewCount = categoryTools.length - liveCategoryTools.length
  const hub = getCategoryHubContent(category.id)
  const categoryImageSrc = getCategoryImageSrc(category.id)

  // Hub collections that feature this category — internal links that pass
  // category authority into the cornerstone hub pages.
  const relatedHubs = getHubPages()
    .filter((page) => page.categoryIds.includes(category.id))
    .slice(0, 6)

  const lastModified = new Date().toISOString().slice(0, 10)

  // Enrich the CollectionPage with a freshness signal (Google rewards recency
  // on directory-style pages). FAQ is emitted as JSON-LD only — the visible FAQ
  // below uses plain markup to avoid duplicate FAQPage structured data.
  const categorySchema = {
    ...buildCategorySchema(category, liveCategoryTools),
    dateModified: lastModified,
  }

  const schemas: Record<string, unknown>[] = [
    categorySchema,
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Categories", path: "/categories" },
      { name: category.name, path: `/categories/${category.id}` },
    ]),
  ]
  if (hub) {
    schemas.push(buildFaqSchema(hub.faqs))
  }

  return (
    <>
      <JsonLd id={`category-schema-${category.id}`} data={schemas} />
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_200px]">
          <section className="min-w-0">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/categories" className="hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground">{category.name}</li>
              </ol>
            </nav>

            <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
              <CategoryImage src={categoryImageSrc} categoryName={category.name} className="mb-5 h-40 w-full" />
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{category.name}</Badge>
                <Badge variant="outline">{liveCategoryTools.length} live tools</Badge>
                {previewCount > 0 ? <Badge variant="outline">{previewCount} upcoming</Badge> : null}
                <Badge variant="outline">Free online</Badge>
                <Badge variant="outline">No sign-up</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {hub ? hub.h1 : `${category.name} Tools`}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                {category.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Browse all {liveTools.length} tools →
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted/40"
                >
                  All categories
                </Link>
              </div>
            </header>

            {hub ? (
              <section className="mb-8 rounded-3xl border bg-card/60 p-6 md:p-8">
                <p className="text-base leading-7 text-muted-foreground">{hub.intro}</p>
              </section>
            ) : null}



            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  prefetch={false}
                  className="hover:text-primary"
                >
                  <article className="rounded-2xl border bg-card transition-colors hover:border-primary/50 hover:bg-muted/20">
                    <ToolThumb src={getPrimaryToolImage(tool.id)} toolName={tool.name} className="h-36 w-full rounded-t-2xl rounded-b-none" />
                    <div className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                          <tool.icon className="h-5 w-5" />
                        </div>
                        {tool.status === "preview" ? (
                          <Badge variant="outline">Preview</Badge>
                        ) : null}
                      </div>
                      <h2 className="text-lg font-semibold">{tool.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {hub ? (
              <section className="mt-10 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      What can you do with free {category.name.toLowerCase()} tools?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {hub.useCases.map((useCase, index) => (
                        <div key={`${category.id}-uc-${index}`}>
                          <h3 className="font-semibold">{useCase.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {useCase.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <section
                  aria-labelledby={`${category.id}-faq-heading`}
                  className="rounded-3xl border bg-card/60 p-6 md:p-8"
                >
                  <h2
                    id={`${category.id}-faq-heading`}
                    className="text-2xl font-semibold tracking-tight"
                  >
                    {category.name} tools — frequently asked questions
                  </h2>
                  <div className="mt-6 space-y-6">
                    {hub.faqs.map((faq, index) => (
                      <div key={`${category.id}-faq-${index}`}>
                        <h3 className="font-semibold">{faq.question}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </section>
            ) : null}

            {relatedHubs.length > 0 ? (
              <section className="mt-10 rounded-3xl border bg-card/60 p-6 md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Curated {category.name.toLowerCase()} tool collections
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Hand-picked sets of free tools and guides related to {category.name.toLowerCase()}.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {relatedHubs.map((hubPage) => (
                    <Link
                      key={hubPage.slug}
                      href={`/${hubPage.slug}`}
                      className="rounded-xl border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-muted/20"
                    >
                      <span className="block font-medium">{hubPage.h1}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {hubPage.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-10 rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight">
                Explore more free tools
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {liveTools.length}+ browser-based tools across {toolCategories.length} categories — all free, no sign-up required.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Browse all tools
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
                >
                  All categories
                </Link>
              </div>
            </section>
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-6 space-y-6">
              
              <div className="rounded-3xl border bg-card/60 p-5">
                <h2 className="text-base font-semibold">Other categories</h2>
                <div className="mt-4 space-y-2 text-sm">
                  {toolCategories
                    .filter((cat) => cat.id !== category.id)
                    .slice(0, 8)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.id}`}
                        className="block text-primary hover:underline"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  <Link href="/categories" className="block font-medium text-primary hover:underline">
                    All categories →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
