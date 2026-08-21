import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { Badge } from "@/components/ui/badge"
import { buildPageMetadata } from "@/lib/page-metadata"
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema"
import { getAllAlternativeParams, getAlternativeContent } from "@/lib/seo/alternatives-content"
import { liveTools } from "@/lib/tools/tools-config"

const currentYear = new Date().getUTCFullYear()

const alternatives = getAllAlternativeParams()
  .map(({ competitor }) => getAlternativeContent(competitor))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
  .sort((a, b) => a.competitorName.localeCompare(b.competitorName))

export const metadata: Metadata = buildPageMetadata({
  title: `Free Alternatives to Popular Tools (${currentYear}) — No Signup`,
  description: `Free, browser-based alternatives to ${alternatives.length}+ popular paid tools for ${currentYear} — no account, no subscription, no upload limits. Compare features and switch in seconds.`,
  path: "/alternatives",
  keywords: [
    "free alternatives",
    "free tool alternatives",
    "free online alternatives no signup",
    ...alternatives.slice(0, 12).map((a) => `${a.competitorName.toLowerCase()} alternative free`),
  ],
})

const directorySchema = [
  buildCollectionPageSchema({
    name: `Free Alternatives to Popular Tools (${currentYear})`,
    path: "/alternatives",
    description: `Free, browser-based alternatives to ${alternatives.length}+ popular paid tools — no account required.`,
    items: alternatives.map((a) => ({
      name: `${a.competitorName} Alternative`,
      path: `/alternatives/${a.competitor}`,
      description: a.metaDescription,
    })),
  }),
  buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Alternatives", path: "/alternatives" },
  ]),
]

export default function AlternativesIndexPage() {
  return (
    <>
      <JsonLd id="alternatives-directory-schema" data={directorySchema} />
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{alternatives.length} free alternatives</Badge>
            <Badge variant="outline">No sign-up</Badge>
            <Badge variant="outline">No subscription</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Free Alternatives to Popular Tools ({currentYear})
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Looking for a free alternative to a paid tool? Each guide below compares features
            side-by-side and shows you a browser-based option that needs no account, no subscription,
            and no upload limits — backed by {liveTools.length}+ free tools.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((a) => (
            <Link
              key={a.competitor}
              href={`/alternatives/${a.competitor}`}
              className="group rounded-2xl border bg-card/60 p-5 transition-colors hover:border-primary/50 hover:bg-muted/20"
            >
              <h2 className="font-semibold group-hover:text-primary">{a.competitorName} alternative</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">
                {a.metaDescription}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Compare <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">Browse all free tools</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {liveTools.length}+ browser-based tools — all free, no sign-up required.
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
