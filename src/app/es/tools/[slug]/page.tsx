import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSpanishToolCopy, SPANISH_TOP_TOOL_IDS } from "@/lib/i18n/translations"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { getToolById } from "@/lib/tools/tools-config"

type PageProps = {
  params: Promise<{ slug: string }>
}

const allowedToolIds = new Set<string>(SPANISH_TOP_TOOL_IDS)

export function generateStaticParams() {
  return SPANISH_TOP_TOOL_IDS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  if (!allowedToolIds.has(slug)) return {}

  const tool = getToolById(slug)
  const copy = getSpanishToolCopy(slug)
  if (!tool || !copy) return {}

  const canonicalPath = `/es/tools/${slug}`
  return {
    title: `${copy.title} | ${siteConfig.shortName}`,
    description: copy.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: buildAbsoluteUrl(canonicalPath),
    },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url: buildAbsoluteUrl(canonicalPath),
      title: copy.title,
      description: copy.description,
    },
  }
}

export default async function SpanishToolLandingPage({ params }: PageProps) {
  const { slug } = await params
  if (!allowedToolIds.has(slug)) {
    notFound()
  }

  const tool = getToolById(slug)
  const copy = getSpanishToolCopy(slug)
  if (!tool || !copy) {
    notFound()
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/es" className="hover:text-foreground">
          Español
        </Link>{" "}
        /{" "}
        <Link href="/es" className="hover:text-foreground">
          Herramientas
        </Link>{" "}
        / <span className="text-foreground">{tool.name}</span>
      </nav>

      <article className="rounded-3xl border bg-card p-8">
        <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-muted-foreground">{copy.description}</p>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Respuesta rápida</h2>
          <p className="text-muted-foreground">{copy.quickAnswer}</p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">Flujo recomendado</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Prepara la entrada que vas a procesar y elimina ruido innecesario.</li>
            <li>Ejecuta un primer resultado de prueba y valida calidad o formato.</li>
            <li>Guarda una versión final y reutiliza la misma configuración para consistencia.</li>
          </ol>
        </section>

        <div className="mt-8 rounded-2xl border bg-primary/5 p-5">
          <p className="text-sm text-muted-foreground">Herramienta original (interfaz completa):</p>
          <Link
            href={tool.path}
            className="mt-2 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Abrir {tool.name}
          </Link>
        </div>
      </article>
    </main>
  )
}
