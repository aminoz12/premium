import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { getAllCompareSlugs, getComparePair } from "@/lib/seo/compare-data"
import { Check, X, ArrowRight, ExternalLink } from "lucide-react"

export function generateStaticParams() {
  return getAllCompareSlugs()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>
}): Promise<Metadata> {
  const { pair: slug } = await params
  const pair = getComparePair(slug)
  if (!pair) return {}

  const canonicalPath = `/compare/${slug}`
  return {
    title: { absolute: `${pair.a.name} vs ${pair.b.name} — Full Comparison 2026 | ${siteConfig.shortName}` },
    description: pair.description,
    keywords: [pair.primaryKeyword, `${pair.a.name} alternative`, `${pair.b.name} alternative`, "free online", "comparison 2026"],
    alternates: { canonical: buildAbsoluteUrl(canonicalPath) },
    openGraph: {
      title: `${pair.a.name} vs ${pair.b.name} — Full Comparison 2026`,
      description: pair.description,
      url: buildAbsoluteUrl(canonicalPath),
      siteName: siteConfig.name,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pair.a.name} vs ${pair.b.name}`,
      description: pair.description,
      site: siteConfig.xHandle ?? undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair: slug } = await params
  const pair = getComparePair(slug)
  if (!pair) notFound()

  // Build FAQ answers that add information beyond the intro/verdict already on
  // the page, so the FAQ is not duplicate on-page content. The "difference"
  // answer pulls in the top comparison points; the "better" answer adds the
  // free-alternative angle where one exists.
  const topPoints = (pair.comparisonPoints as { aspect: string; aValue: string; bValue: string }[])
    .slice(0, 3)
    .map((row) => `${row.aspect} — ${pair.a.name}: ${row.aValue}; ${pair.b.name}: ${row.bValue}`)
    .join(". ")
  const differenceAnswer = `${pair.description} On the points that matter most: ${topPoints}.`
  const betterAnswer = pair.ourToolPath
    ? `${pair.verdict} If you mainly need the core feature without a subscription or signup, ${pair.ourToolName} is a free alternative to both.`
    : pair.verdict

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the difference between ${pair.a.name} and ${pair.b.name}?`,
        acceptedAnswer: { "@type": "Answer", text: differenceAnswer },
      },
      {
        "@type": "Question",
        name: `Is ${pair.a.name} better than ${pair.b.name}?`,
        acceptedAnswer: { "@type": "Answer", text: betterAnswer },
      },
      ...(pair.ourToolPath
        ? [
            {
              "@type": "Question",
              name: `Is there a free alternative to both ${pair.a.name} and ${pair.b.name}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `Yes — ${pair.ourToolName} is completely free with no account required, and works in your browser as an alternative to both ${pair.a.name} and ${pair.b.name}.`,
              },
            },
          ]
        : []),
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: buildAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Compare", item: buildAbsoluteUrl("/compare") },
      { "@type": "ListItem", position: 3, name: `${pair.a.name} vs ${pair.b.name}`, item: buildAbsoluteUrl(`/compare/${slug}`) },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-muted-foreground mb-6 flex gap-1">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-foreground">Compare</Link>
          <span>/</span>
          <span>{pair.a.name} vs {pair.b.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {pair.a.name} vs {pair.b.name}
        </h1>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed">{pair.description}</p>

        {/* Side by Side cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[pair.a, pair.b].map((tool) => (
            <div key={tool.name} className="rounded-lg border p-5">
              <h2 className="text-lg font-semibold mb-1">{tool.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Visit {tool.name} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Feature Comparison</h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Feature</th>
                  <th className="text-left px-4 py-3 font-medium">{pair.a.name}</th>
                  <th className="text-left px-4 py-3 font-medium">{pair.b.name}</th>
                  {pair.ourToolName && (
                    <th className="text-left px-4 py-3 font-semibold text-primary">
                      {pair.ourToolName}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pair.comparisonPoints.map((row: any, i: number) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="px-4 py-3 font-medium text-muted-foreground">{row.aspect}</td>
                    <td className="px-4 py-3">{row.aValue}</td>
                    <td className="px-4 py-3">{row.bValue}</td>
                    {pair.ourToolName && (
                      <td className="px-4 py-3 font-medium text-primary bg-primary/5">
                        {row.ourValue ?? "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verdict */}
        <section className="mb-10 rounded-lg border-l-4 border-primary bg-primary/5 px-5 py-4">
          <h2 className="text-base font-semibold mb-2">Verdict</h2>
          <p className="text-sm leading-relaxed">{pair.verdict}</p>
        </section>

        {/* Affiliate CTA — rendered only when affiliate URLs are populated */}
        {(pair.affiliateAUrl || pair.affiliateBUrl) && (
          <section className="mb-10 rounded-lg border p-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Need the pro version?
            </p>
            <h2 className="text-base font-semibold mb-3">Upgrade to a paid plan</h2>
            <div className="flex flex-wrap gap-3">
              {pair.affiliateAUrl && (
                <a
                  href={pair.affiliateAUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  Get {pair.a.name} Pro <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {pair.affiliateBUrl && (
                <a
                  href={pair.affiliateBUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  Get {pair.b.name} Pro <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Affiliate disclosure: we may earn a commission at no extra cost to you.
            </p>
          </section>
        )}

        {/* Our free alternative */}
        {pair.ourToolPath && (
          <section className="mb-10 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Free Alternative</p>
            <h2 className="text-lg font-semibold mb-2">{pair.ourToolName}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Skip both — try our free alternative with no account, no credit card, and no usage limits.
            </p>
            <Link
              href={pair.ourToolPath}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try it free <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-2">What is the difference between {pair.a.name} and {pair.b.name}?</h3>
              <p className="text-sm text-muted-foreground">{differenceAnswer}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-2">Is {pair.a.name} better than {pair.b.name}?</h3>
              <p className="text-sm text-muted-foreground">{betterAnswer}</p>
            </div>
            {pair.ourToolPath && (
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-2">Is there a free alternative to both {pair.a.name} and {pair.b.name}?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes — our{" "}
                  <Link href={pair.ourToolPath} className="text-primary hover:underline">
                    {pair.ourToolName}
                  </Link>{" "}
                  is completely free with no account required.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
