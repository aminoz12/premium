import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { Badge } from "@/components/ui/badge"
import { buildPageMetadata } from "@/lib/page-metadata"
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema"
import { getAllBestSlugs, getBestCategory } from "@/lib/seo/best-data"
import { liveTools } from "@/lib/tools/tools-config"

const currentYear = new Date().getUTCFullYear()

const bestLists = getAllBestSlugs()
  .map(({ category }) => getBestCategory(category))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
  .sort((a, b) => a.title.localeCompare(b.title))

export const metadata: Metadata = buildPageMetadata({
  title: `Best Free Tools (${currentYear}) — Ranked & Compared, No Signup`,
  description: `${bestLists.length}+ ranked lists of the best free tools for ${currentYear} — AI detectors, image compressors, paraphrasers, and more. Honest rankings with free, no-account picks.`,
  path: "/best",
  keywords: [
    "best free tools",
    "best free online tools 2026",
    "best free tools no signup",
    ...bestLists.slice(0, 12).map((b) => b.primaryKeyword),
  ],
})

const directorySchema = [
  buildCollectionPageSchema({
    name: `Best Free Tools (${currentYear})`,
    path: "/best",
    description: `${bestLists.length}+ ranked, hand-curated lists of the best free tools — with honest pros, free status, and account requirements.`,
    items: bestLists.map((b) => ({
      name: b.title,
      path: `/best/${b.slug}`,
      description: b.description,
    })),
  }),
  buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Best Tools", path: "/best" },
  ]),
]

export default function BestIndexPage() {
  return (
    <>
      <JsonLd id="best-directory-schema" data={directorySchema} />
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">Best Tools</li>
          </ol>
        </nav>

        <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{bestLists.length} ranked lists</Badge>
            <Badge variant="outline">Free picks first</Badge>
            <Badge variant="outline">Updated {currentYear}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Best Free Tools ({currentYear})
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Hand-curated, ranked lists of the best free tools in each category — with honest pros,
            whether each tool is truly free, and whether it needs an account. Every list highlights
            a no-signup browser option.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bestLists.map((b) => (
            <Link
              key={b.slug}
              href={`/best/${b.slug}`}
              className="group rounded-2xl border bg-card/60 p-5 transition-colors hover:border-primary/50 hover:bg-muted/20"
            >
              <h2 className="font-semibold group-hover:text-primary">{b.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                {b.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                See the ranking <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">Explore every free tool</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {liveTools.length}+ browser-based tools — all free, no sign-up required.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Browse all tools
            </Link>
            <Link href="/categories" className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/40">
              All categories
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
