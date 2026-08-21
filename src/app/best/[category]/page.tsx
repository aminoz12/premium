import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { getAllBestSlugs, getBestCategory } from "@/lib/seo/best-data"
import { toolCount } from "@/lib/tools/tools-config"
import { Check, X, ArrowRight, ExternalLink } from "lucide-react"

export function generateStaticParams() {
  return getAllBestSlugs()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: slug } = await params
  const cat = getBestCategory(slug)
  if (!cat) return {}

  const canonicalPath = `/best/${slug}`
  return {
    title: { absolute: `${cat.metaTitle} | ${siteConfig.shortName}` },
    description: cat.metaDescription,
    keywords: [cat.primaryKeyword, "free", "no account", "2026", "comparison", "ranked"],
    alternates: { canonical: buildAbsoluteUrl(canonicalPath) },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      url: buildAbsoluteUrl(canonicalPath),
      siteName: siteConfig.name,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: cat.metaTitle,
      description: cat.metaDescription,
      site: siteConfig.xHandle ?? undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function BestCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const cat = getBestCategory(slug)
  if (!cat) notFound()

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.title,
    description: cat.description,
    numberOfItems: cat.tools.length,
    itemListElement: cat.tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: tool.path.startsWith("/") ? buildAbsoluteUrl(tool.path) : tool.path,
      description: tool.tagline,
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: buildAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Best Tools", item: buildAbsoluteUrl("/best") },
      { "@type": "ListItem", position: 3, name: cat.title, item: buildAbsoluteUrl(`/best/${slug}`) },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container max-w-4xl mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex gap-1">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/best" className="hover:text-foreground">Best Tools</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-foreground">{cat.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {cat.title}
        </h1>
        <p className="text-muted-foreground mb-10 text-base leading-relaxed">{cat.description}</p>

        <div className="space-y-6">
          {cat.tools.map((tool) => {
            const isOurTool = tool.path.startsWith("/")
            return (
              <div
                key={tool.name}
                className={`rounded-lg border p-6 ${isOurTool ? "border-primary/40 bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {tool.rank}
                    </span>
                    <div>
                      <h2 className="text-base font-semibold leading-tight">{tool.name}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{tool.tagline}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tool.free ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {tool.free ? "Free" : "Paid"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${!tool.accountRequired ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-muted text-muted-foreground"}`}>
                      {tool.accountRequired ? "Account required" : "No account"}
                    </span>
                  </div>
                </div>

                <ul className="space-y-1 mb-4">
                  {tool.pros.map((pro) => (
                    <li key={pro} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>

                {isOurTool ? (
                  <Link
                    href={tool.path}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Try it free <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <a
                    href={tool.path}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit {tool.name.split(" — ")[0]} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )
          })}
        </div>

        <section className="mt-12 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">{toolCount}+ Free Tools — No Account Required</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Browse all free AI tools at TheFreeAITools.com. Every tool is browser-based and requires no signup.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse all tools <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </>
  )
}
