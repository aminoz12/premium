import Link from "next/link"
import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { Badge } from "@/components/ui/badge"
import { ToolThumb } from "@/components/ui/tool-image"
import { buildPageMetadata } from "@/lib/page-metadata"
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildFaqSchema } from "@/lib/seo/schema"
import { siteConfig } from "@/lib/site-config"
import { getToolsByCategory, liveTools, toolCategories } from "@/lib/tools/tools-config"
import { getHubPages } from "@/lib/hubs"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"


const currentYear = new Date().getUTCFullYear()

export const metadata: Metadata = buildPageMetadata({
  title: `All Free Tool Categories (${currentYear}) — ${toolCategories.length} Categories, ${liveTools.length}+ Tools`,
  description: `Browse ${liveTools.length}+ free tools by category for ${currentYear}: SEO, developer, image, AI, security, text, file, and calculator tools. No signup, instant results.`,
  path: "/categories",
  keywords: [
    "free tool categories",
    "online tool categories",
    "free tools by category",
    "browser tools directory",
    "free online tools list",
    `free tools ${currentYear}`,
    "all free tools",
    "tool directory free",
    ...toolCategories.map((category) => `free ${category.name.toLowerCase()} tools`),
    ...toolCategories.map((category) => `${category.name.toLowerCase()} tools online`),
  ],
})

const categoriesFaqs = [
  {
    question: "How are the free tools organized into categories?",
    answer: `The ${liveTools.length}+ tools are grouped into ${toolCategories.length} categories — including developer, SEO, image, text, security, design, and calculator tools — so you can quickly find the right tool for your task. Every category page lists all of its free, browser-based tools.`,
  },
  {
    question: "Are all the tools in every category free?",
    answer: "Yes. Every tool in every category is 100% free, requires no account or signup, and runs entirely in your browser. There are no trial limits, no credit card, and no premium upgrade.",
  },
  {
    question: "Which category has the most free tools?",
    answer: `Browse the category cards below — each shows its exact tool count. The developer, calculator, and image categories are typically the largest, but all ${toolCategories.length} categories are actively maintained and growing.`,
  },
  {
    question: "Do I need to install anything to use the tools in a category?",
    answer: "No. Every tool is browser-based and works instantly on desktop and mobile — nothing to download, install, or configure. Open any category, pick a tool, and start using it.",
  },
]

const featuredHubSlugs = [
  "best-free-seo-tools",
  "free-developer-tools",
  "free-image-tools-online",
  "free-ai-writing-tools",
  "free-json-tools",
  "privacy-first-online-tools",
]
const featuredHubs = getHubPages().filter((page) => featuredHubSlugs.includes(page.slug))

const categoryDirectorySchema = [
  buildCollectionPageSchema({
    name: "The Free AI Tools categories",
    path: "/categories",
    description: `Browse all ${toolCategories.length} The Free AI Tools categories and discover ${liveTools.length}+ live browser-based tools.`,
    items: toolCategories.map((category) => ({
      name: category.name,
      path: `/categories/${category.id}`,
      description: category.description,
    })),
  }),
  buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
  ]),
  buildFaqSchema(categoriesFaqs),
]

export default function CategoriesIndexPage() {
  return (
    <>
      <JsonLd id="categories-directory-schema" data={categoryDirectorySchema} />
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
                <li aria-current="page" className="text-foreground">Categories</li>
              </ol>
            </nav>

            <QuickAnswer
              question="How many free tool categories are there?"
              answer={`TheFreeAITools organizes ${liveTools.length}+ free browser-based tools into ${toolCategories.length} categories — including developer, SEO, image, text, security, design, AI, and calculator tools. Every tool is free, runs in your browser, and needs no signup.`}
            />

            <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{toolCategories.length} categories</Badge>
                <Badge variant="outline">{liveTools.length} live tools</Badge>
                <Badge variant="outline">
                  Works in {siteConfig.supportedBrowsers.join(", ")}
                </Badge>
                <Badge variant="outline">No sign-up</Badge>
                <Badge variant="outline">100% free</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                All Free Tool Categories ({currentYear}) — {toolCategories.length} Categories, {liveTools.length}+ Tools
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                Browse {liveTools.length}+ free online tools by category: developer utilities, SEO tools, image
                workflows, AI tools, accessibility audits, calculators, finance tools, and more.
                Every tool is 100% free, runs in your browser, and requires no signup.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Browse all {liveTools.length} tools →
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted/40"
                >
                  Back to home
                </Link>
              </div>
            </header>



            <div className="grid gap-5 xl:grid-cols-2">
              {toolCategories.map((category) => {
                const items = getToolsByCategory(category.id)
                const topItems = items.slice(0, 4)

                return (
                    <article
                      key={category.id}
                      className="rounded-3xl border bg-card/60 p-5 transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold">
                            <Link href={`/categories/${category.id}`} className="hover:text-primary">
                              {category.name}
                            </Link>
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                        <Badge variant="outline">{items.length} tools</Badge>
                      </div>

                      <div className="mt-5 grid gap-3">
                        {topItems.map((tool) => {
                          const img = getPrimaryToolImage(tool.id)
                          return (
                            <Link
                              key={tool.id}
                              href={tool.path}
                              prefetch={false}
                              className="overflow-hidden rounded-2xl border bg-background transition-colors hover:border-primary/50 hover:bg-muted/20"
                            >
                              {img ? (
                                <ToolThumb src={img} toolName={tool.name} className="h-24 w-full rounded-t-2xl rounded-b-none" />
                              ) : (
                                <div className="flex h-16 w-full items-center justify-center rounded-t-2xl rounded-b-none bg-muted/30">
                                  <tool.icon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              <div className="px-4 py-3">
                                <p className="text-sm font-medium">{tool.name}</p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {tool.description}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      <div className="mt-5">
                        <Link
                          href={`/categories/${category.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View all {items.length} {category.name.toLowerCase()} tools →
                        </Link>
                      </div>
                    </article>
                )
              })}
            </div>

            {featuredHubs.length > 0 ? (
              <section className="mt-10 rounded-3xl border bg-card/60 p-6 md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Popular tool collections</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Curated, hand-picked sets of free tools for common jobs.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {featuredHubs.map((hubPage) => (
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

            <section className="mt-10 rounded-3xl border bg-card/60 p-6 md:p-8" aria-labelledby="categories-faq-heading">
              <h2 id="categories-faq-heading" className="text-2xl font-semibold tracking-tight">
                Free tool categories — frequently asked questions
              </h2>
              <div className="mt-6 space-y-6">
                {categoriesFaqs.map((faq, index) => (
                  <div key={`categories-faq-${index}`}>
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight">
                Ready to get started?
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                All {liveTools.length}+ tools are free, instant, browser-based, and require no sign-up.
                Pick a category above or jump straight into the full tools directory.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Explore all tools
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
                >
                  Suggest a tool
                </Link>
              </div>
            </section>
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-6 space-y-6">
              
              <div className="rounded-3xl border bg-card/60 p-5">
                <h2 className="text-base font-semibold">Quick links</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <Link href="/tools" className="block text-primary hover:underline">
                    All tools ({liveTools.length})
                  </Link>
                  {toolCategories.slice(0, 8).map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className="block text-primary hover:underline"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
