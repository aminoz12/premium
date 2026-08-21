import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { Badge } from "@/components/ui/badge"
import { buildPageMetadata } from "@/lib/page-metadata"
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema"
import { getAllCompareSlugs, getComparePair } from "@/lib/seo/compare-data"
import { liveTools } from "@/lib/tools/tools-config"

const currentYear = new Date().getUTCFullYear()

const comparisons = getAllCompareSlugs()
  .map(({ pair }) => getComparePair(pair))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
  .sort((a, b) => a.a.name.localeCompare(b.a.name))

export const metadata: Metadata = buildPageMetadata({
  title: `Tool Comparisons (${currentYear}) — Side-by-Side Feature Breakdowns`,
  description: `${comparisons.length}+ honest, side-by-side tool comparisons for ${currentYear}. See how popular tools and formats stack up on features, pricing, and privacy — plus free alternatives.`,
  path: "/compare",
  keywords: [
    "tool comparisons",
    "vs comparison",
    "software comparison 2026",
    ...comparisons.slice(0, 12).map((c) => c.primaryKeyword),
  ],
})

const directorySchema = [
  buildCollectionPageSchema({
    name: `Tool Comparisons (${currentYear})`,
    path: "/compare",
    description: `${comparisons.length}+ side-by-side comparisons of popular tools and formats — features, pricing, and free alternatives.`,
    items: comparisons.map((c) => ({
      name: `${c.a.name} vs ${c.b.name}`,
      path: `/compare/${c.slug}`,
      description: c.description,
    })),
  }),
  buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
  ]),
]

export default function CompareIndexPage() {
  return (
    <>
      <JsonLd id="compare-directory-schema" data={directorySchema} />
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">Compare</li>
          </ol>
        </nav>

        <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{comparisons.length} comparisons</Badge>
            <Badge variant="outline">Side-by-side</Badge>
            <Badge variant="outline">Updated {currentYear}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tool Comparisons ({currentYear})
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Honest, side-by-side breakdowns of popular tools and formats — compared on features,
            pricing, privacy, and use case. Where one exists, we also point you to a free,
            no-signup alternative.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group rounded-2xl border bg-card/60 p-5 transition-colors hover:border-primary/50 hover:bg-muted/20"
            >
              <h2 className="font-semibold group-hover:text-primary">
                {c.a.name} <span className="text-muted-foreground">vs</span> {c.b.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                {c.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                View comparison <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">Skip the comparison — go free</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {liveTools.length}+ free, browser-based tools with no account and no subscription.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Browse all tools
            </Link>
            <Link href="/alternatives" className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/40">
              Free alternatives
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
