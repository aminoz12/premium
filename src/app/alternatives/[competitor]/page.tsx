import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check, X } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo/schema"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { getToolById } from "@/lib/tools/tools-config"
import { getAllAlternativeParams, getAlternativeContent } from "@/lib/seo/alternatives-content"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function generateStaticParams() {
  return getAllAlternativeParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>
}): Promise<Metadata> {
  const { competitor } = await params
  const ac = getAlternativeContent(competitor)

  if (!ac) return {}

  const canonicalPath = `/alternatives/${competitor}`

  return {
    title: { absolute: `${ac.metaTitle} | ${siteConfig.shortName}` },
    description: ac.metaDescription,
    keywords: [ac.keyword, `${ac.competitorName} alternative`, "free online", "no sign up"],
    alternates: { canonical: buildAbsoluteUrl(canonicalPath) },
    openGraph: {
      title: ac.metaTitle,
      description: ac.metaDescription,
      url: buildAbsoluteUrl(canonicalPath),
      type: "website",
    },
    robots: { index: true, follow: true },
  }
}

export default async function AlternativePage({
  params,
}: {
  params: Promise<{ competitor: string }>
}) {
  const { competitor } = await params
  const ac = getAlternativeContent(competitor)

  if (!ac) notFound()

  const ourTool = getToolById(ac.ourToolId)

  const schemas = [
    buildFaqSchema(ac.faqs),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Alternatives", path: "/alternatives" },
      { name: ac.h1, path: `/alternatives/${competitor}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${buildAbsoluteUrl(`/alternatives/${competitor}`)}#webpage`,
      name: ac.h1,
      description: ac.metaDescription,
      url: buildAbsoluteUrl(`/alternatives/${competitor}`),
      dateModified: new Date().toISOString().slice(0, 10),
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#organization` },
    },
  ]

  return (
    <>
      <JsonLd id={`alternative-schema-${competitor}`} data={schemas} />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/alternatives" className="hover:text-foreground">Alternatives</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{ac.competitorName}</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{ac.competitorName} Alternative</Badge>
              <Badge variant="default">Free online</Badge>
              <Badge variant="outline">No sign-up</Badge>
              <Badge variant="outline">No account</Badge>
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              {ac.h1}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              {ac.intro}
            </p>
          </header>

          {/* CTA to our tool */}
          <Link
            href={ac.ourToolPath}
            className="mb-8 flex items-center justify-between gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 transition-colors hover:border-primary/40 hover:bg-primary/10"
          >
            <div>
              <p className="font-semibold text-primary">Try the free {ac.ourToolName} now</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                No account required · Runs in your browser · Instant results
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
          </Link>

          {/* Comparison table */}
          <section className="mb-8 rounded-3xl border bg-card/60 p-6 md:p-8">
            <h2 className="mb-6 text-xl font-semibold">
              {ac.competitorName} vs thefreeaitools.com — feature comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-semibold">Feature</th>
                    <th className="pb-3 text-left font-semibold text-muted-foreground">
                      {ac.competitorName}
                    </th>
                    <th className="pb-3 text-left font-semibold text-primary">
                      thefreeaitools.com
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ac.comparison.map((row, index) => (
                    <tr key={`row-${index}`}>
                      <td className="py-3 pr-4 font-medium">{row.feature}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{row.competitor}</td>
                      <td className="py-3 text-foreground">{row.ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Advantages */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              Why choose thefreeaitools.com over {ac.competitorName}?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ac.advantages.map((adv, index) => (
                <div
                  key={`adv-${index}`}
                  className="rounded-2xl border bg-card/60 p-5"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="font-semibold">{adv.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{adv.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing */}
          <section className="mb-8 rounded-3xl border bg-card/60 p-6 md:p-8">
            <p className="text-sm leading-7 text-muted-foreground">{ac.closing}</p>
            <div className="mt-5">
              <Link
                href={ac.ourToolPath}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Open the free {ac.ourToolName}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* FAQ — JSON-LD already emitted above; plain markup avoids duplicate FAQPage schema */}
          <section
            aria-labelledby="faq-heading"
            className="mb-8 rounded-3xl border bg-card/60 p-6 md:p-8"
          >
            <h2 id="faq-heading" className="mb-6 text-xl font-semibold">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {ac.faqs.map((faq, index) => (
                <div key={`faq-${index}`}>
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Our tool card */}
          {ourTool && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Try the {ourTool.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ourTool.icon className="h-4 w-4 text-primary" />
                  <p>{ourTool.description}</p>
                </div>
                <ul className="space-y-1.5 text-muted-foreground">
                  {[
                    "Permanently free — no plans or tiers",
                    "No account or sign-up required",
                    "Runs entirely in your browser",
                    "Files never leave your device",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={ac.ourToolPath}
                  className="flex items-center gap-2 font-medium text-primary hover:underline"
                >
                  Open {ourTool.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
