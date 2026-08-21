import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { Badge } from "@/components/ui/badge"
import { buildPageMetadata } from "@/lib/page-metadata"
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema"
import { USE_CASES } from "@/lib/seo/use-cases-data"
import { liveTools } from "@/lib/tools/tools-config"

const currentYear = new Date().getUTCFullYear()

const useCases = [...USE_CASES].sort((a, b) => a.title.localeCompare(b.title))

export const metadata: Metadata = buildPageMetadata({
  title: `How-To Guides & Use Cases (${currentYear}) — Free Tools for Real Tasks`,
  description: `${useCases.length}+ step-by-step guides showing how to get a real task done with a free, no-signup browser tool — from detecting AI essays to converting code and cleaning data.`,
  path: "/use-cases",
  keywords: [
    "how-to guides",
    "tool use cases",
    "free online tool tutorials",
    `step by step guides ${currentYear}`,
    ...useCases.slice(0, 12).map((u) => u.primaryKeyword),
  ],
})

const directorySchema = [
  buildCollectionPageSchema({
    name: `How-To Guides & Use Cases (${currentYear})`,
    path: "/use-cases",
    description: `${useCases.length}+ step-by-step guides for getting real tasks done with free, browser-based tools.`,
    items: useCases.map((u) => ({
      name: u.title,
      path: `/use-cases/${u.slug}`,
      description: u.intro,
    })),
  }),
  buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use Cases", path: "/use-cases" },
  ]),
]

export default function UseCasesIndexPage() {
  return (
    <>
      <JsonLd id="use-cases-directory-schema" data={directorySchema} />
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">Use Cases</li>
          </ol>
        </nav>

        <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{useCases.length} guides</Badge>
            <Badge variant="outline">Step-by-step</Badge>
            <Badge variant="outline">Updated {currentYear}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            How-To Guides &amp; Use Cases ({currentYear})
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Practical, step-by-step guides for getting a real task done — each one paired with a
            free, browser-based tool that needs no account and no install.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <Link
              key={u.slug}
              href={`/use-cases/${u.slug}`}
              className="group rounded-2xl border bg-card/60 p-5 transition-colors hover:border-primary/50 hover:bg-muted/20"
            >
              <h2 className="font-semibold group-hover:text-primary">{u.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                {u.intro}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Read the guide <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">Just want the tools?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {liveTools.length}+ free, browser-based tools with no account and no subscription.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Browse all tools
            </Link>
            <Link href="/compare" className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/40">
              Tool comparisons
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
