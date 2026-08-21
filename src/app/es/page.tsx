import type { Metadata } from "next"
import Link from "next/link"
import { spanishHomeCopy, SPANISH_TOP_TOOL_IDS } from "@/lib/i18n/translations"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { getToolById } from "@/lib/tools/tools-config"

const canonicalPath = "/es"

export const metadata: Metadata = {
  title: `${spanishHomeCopy.title} | ${siteConfig.shortName}`,
  description: spanishHomeCopy.description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: buildAbsoluteUrl(canonicalPath),
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: buildAbsoluteUrl(canonicalPath),
    title: spanishHomeCopy.title,
    description: spanishHomeCopy.description,
  },
}

export default function LocalizedHomePage() {
  const featuredTools = SPANISH_TOP_TOOL_IDS.map((id) => getToolById(id)).filter(
    (tool): tool is NonNullable<typeof tool> => Boolean(tool)
  )

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10 rounded-3xl border bg-card p-8">
        <p className="mb-3 text-sm font-medium text-primary">Español / ES</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{spanishHomeCopy.title}</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">{spanishHomeCopy.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tools" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {spanishHomeCopy.ctaBrowseAll}
          </Link>
          <Link href="/" className="rounded-lg border px-4 py-2 text-sm font-semibold">
            English homepage
          </Link>
        </div>
      </header>

      <section aria-labelledby="top-tools-es">
        <h2 id="top-tools-es" className="text-2xl font-semibold">
          {spanishHomeCopy.topToolsHeading}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{spanishHomeCopy.topToolsDescription}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <article key={tool.id} className="rounded-2xl border bg-card p-5">
              <h3 className="font-semibold">{tool.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
              <Link
                href={`/es/tools/${tool.id}`}
                className="mt-4 inline-flex rounded-lg border px-3 py-1.5 text-sm font-medium hover:border-primary/50 hover:text-primary"
              >
                {spanishHomeCopy.ctaOpenTool}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
