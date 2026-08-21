import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { getAllUseCaseSlugs, getUseCase } from "@/lib/seo/use-cases-data"
import { ArrowRight, CheckCircle } from "lucide-react"

export function generateStaticParams() {
  return getAllUseCaseSlugs()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ useCase: string }>
}): Promise<Metadata> {
  const { useCase: slug } = await params
  const uc = getUseCase(slug)
  if (!uc) return {}

  const canonicalPath = `/use-cases/${slug}`
  return {
    title: { absolute: `${uc.metaTitle} | ${siteConfig.shortName}` },
    description: uc.metaDescription,
    keywords: [uc.primaryKeyword, "free", "no account", "online", "2026"],
    alternates: { canonical: buildAbsoluteUrl(canonicalPath) },
    openGraph: {
      title: uc.metaTitle,
      description: uc.metaDescription,
      url: buildAbsoluteUrl(canonicalPath),
      siteName: siteConfig.name,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: uc.metaTitle,
      description: uc.metaDescription,
      site: siteConfig.xHandle ?? undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ useCase: string }>
}) {
  const { useCase: slug } = await params
  const uc = getUseCase(slug)
  if (!uc) notFound()

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: uc.title,
    description: uc.intro,
    tool: {
      "@type": "HowToTool",
      name: uc.toolName,
      url: buildAbsoluteUrl(uc.toolPath),
    },
    step: uc.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.detail,
    })),
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: uc.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: buildAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Use Cases", item: buildAbsoluteUrl("/use-cases") },
      { "@type": "ListItem", position: 3, name: uc.title, item: buildAbsoluteUrl(`/use-cases/${slug}`) },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-muted-foreground mb-6 flex gap-1">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="hover:text-foreground">Use Cases</span>
          <span>/</span>
          <span>{uc.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {uc.title}
        </h1>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed">{uc.intro}</p>

        {/* Tool CTA */}
        <div className="mb-8 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">Free Tool</p>
            <p className="text-base font-semibold">{uc.toolName}</p>
            <p className="text-xs text-muted-foreground">No account required · Free forever</p>
          </div>
          <Link
            href={uc.toolPath}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            Try it free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Steps */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-5">Step-by-Step Guide</h2>
          <ol className="space-y-4">
            {uc.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Who it's for */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Who This Is For</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {uc.whoItsFor.map((item) => (
              <div key={item.role} className="rounded-lg border p-4 text-sm">
                <p className="font-semibold mb-1">{item.role}</p>
                <p className="text-muted-foreground">{item.scenario}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {uc.faq.map((item) => (
              <div key={item.q} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">{uc.toolName}</h2>
          <p className="text-sm text-muted-foreground mb-4">Free · No account · No limits</p>
          <Link
            href={uc.toolPath}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Use the tool now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
