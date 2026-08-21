import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ExternalLink } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo/schema"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { getToolById } from "@/lib/tools/tools-config"
import { getAllUseCaseParams, getUseCase, getUseCasesForTool } from "@/lib/tools/use-cases"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function generateStaticParams() {
  return getAllUseCaseParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; usecase: string }>
}): Promise<Metadata> {
  const { slug, usecase } = await params
  const tool = getToolById(slug)
  const uc = getUseCase(slug, usecase)

  if (!tool || !uc) return {}

  const canonicalPath = `/tools/${slug}/${usecase}`

  return {
    title: { absolute: `${uc.metaTitle} | ${siteConfig.shortName}` },
    description: uc.intro.slice(0, 160),
    keywords: [uc.keyword, tool.name.toLowerCase(), "free online", "no sign up", ...tool.keywords],
    alternates: { canonical: buildAbsoluteUrl(canonicalPath) },
    openGraph: {
      title: uc.metaTitle,
      description: uc.intro.slice(0, 160),
      url: buildAbsoluteUrl(canonicalPath),
      type: "website",
    },
    robots: { index: true, follow: true },
  }
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string; usecase: string }>
}) {
  const { slug, usecase } = await params
  const tool = getToolById(slug)
  const uc = getUseCase(slug, usecase)

  if (!tool || !uc) notFound()

  const otherUseCases = getUseCasesForTool(slug).filter((u) => u.slug !== usecase).slice(0, 3)

  const schemas = [
    buildFaqSchema(uc.faqs),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: tool.name, path: tool.path },
      { name: uc.h1, path: `/tools/${slug}/${usecase}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${buildAbsoluteUrl(`/tools/${slug}/${usecase}`)}#webpage`,
      name: uc.h1,
      description: uc.intro.slice(0, 160),
      url: buildAbsoluteUrl(`/tools/${slug}/${usecase}`),
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#organization` },
    },
  ]

  return (
    <>
      <JsonLd id={`usecase-schema-${slug}-${usecase}`} data={schemas} />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/tools" className="hover:text-foreground">Tools</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={tool.path} className="hover:text-foreground">{tool.name}</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{uc.keyword}</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{tool.name}</Badge>
              <Badge variant="default">Free online</Badge>
              <Badge variant="outline">No sign-up</Badge>
              <Badge variant="outline">No upload</Badge>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <tool.icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  {uc.h1}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  {uc.intro}
                </p>
              </div>
            </div>
          </header>

          {/* CTA to main tool */}
          <Link
            href={tool.path}
            className="mb-8 flex items-center justify-between gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 transition-colors hover:border-primary/40 hover:bg-primary/10"
          >
            <div>
              <p className="font-semibold text-primary">Open the free {tool.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                No account required · Runs in your browser · Instant results
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
          </Link>

          {/* Use-case body */}
          <section className="mb-8 rounded-3xl border bg-card/60 p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold">
              {tool.name} — {uc.keyword}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">{uc.body}</p>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium">
                <span className="text-primary">Quick tip: </span>
                {uc.tip}
              </p>
            </div>
          </section>

          {/* FAQ section */}
          <section
            aria-labelledby="faq-heading"
            className="mb-8 rounded-3xl border bg-card/60 p-6 md:p-8"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            <h2 id="faq-heading" className="mb-6 text-xl font-semibold">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {uc.faqs.map((faq, index) => (
                <div
                  key={`faq-${index}`}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="font-medium" itemProp="name">
                    {faq.question}
                  </h3>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p className="mt-2 text-sm leading-7 text-muted-foreground" itemProp="text">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related use cases + tool link */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Back to main tool */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Use the full {tool.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Access all features of the {tool.name} — free, browser-based, no account required.
                </p>
                <Link
                  href={tool.path}
                  className="flex items-center gap-2 font-medium text-primary hover:underline"
                >
                  Open {tool.name}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>

            {/* Other use cases */}
            {otherUseCases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">More {tool.name} guides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {otherUseCases.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/tools/${slug}/${other.slug}`}
                      className="block text-sm font-medium text-primary hover:underline"
                    >
                      {other.h1}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Related tools */}
          {uc.relatedToolIds.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">You might also need</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {uc.relatedToolIds.map((relatedId) => {
                  const relatedTool = getToolById(relatedId)
                  if (!relatedTool) return null
                  return (
                    <Link
                      key={relatedId}
                      href={relatedTool.path}
                      prefetch={false}
                      className="block rounded-xl border p-4 text-sm transition-colors hover:border-primary/50 hover:bg-muted/20"
                    >
                      <div className="flex items-center gap-2">
                        <relatedTool.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{relatedTool.name}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {relatedTool.description}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
