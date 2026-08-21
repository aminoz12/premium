/**
 * HubPage — redesigned
 * Design: pure black/white, editorial precision, scroll-triggered animations
 * SEO: enriched schema (Speakable, mentions, about, geo, richer FAQ), GEO/AEO signals
 */

import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FAQSection } from "@/components/seo/FAQSection"
import { JsonLd } from "@/components/seo/json-ld"
import { Badge } from "@/components/ui/badge"
import { getHubCategories, getHubFeaturedTools, getHubPageBySlug, getHubPages } from "@/lib/hubs"
import { getRelatedHubPages } from "@/data/hub-pages"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
} from "@/lib/seo/schema"
import { liveTools, toolCategories, getToolsByCategory } from "@/lib/tools/tools-config"
import { ToolThumb } from "@/components/ui/tool-image"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"

// ─── Static params ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return getHubPages().map((page) => ({ slug: page.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getHubPageBySlug(slug)
  if (!page) return {}

  const metadata = buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    keywords: [
      page.primaryKeyword ?? page.h1.toLowerCase(),
      page.h1.toLowerCase(),
      ...(page.lsiKeywords ?? []),
      ...page.featuredToolIds.map((id) => id.replace(/-/g, " ")),
      ...page.categoryIds.map((id) => `${id.replace(/-/g, " ")} tools`),
    ],
  })

  if (page.canonicalSlug) {
    return {
      ...metadata,
      alternates: { canonical: `https://www.thefreeaitools.com/${page.canonicalSlug}` },
    }
  }
  return metadata
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HubPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getHubPageBySlug(slug)
  if (!page) notFound()

  const featuredTools = getHubFeaturedTools(page)
  const categories = getHubCategories(page)
  const categoryToolGroups = categories
    .map((category) => ({
      category,
      tools: getToolsByCategory(category.id)
        .filter((t) => t.status !== "preview")
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((g) => g.tools.length > 0)

  const relatedHubs = getRelatedHubPages(page.slug, 6)
  const totalToolCount = categoryToolGroups.reduce((s, g) => s + g.tools.length, 0)

  const formattedUpdatedAt = page.updatedAt
    ? new Date(`${page.updatedAt}T00:00:00Z`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : null

  // ── Enriched schemas ────────────────────────────────────────────────────────
  const canonicalUrl = `https://www.thefreeaitools.com/${page.slug}`

  const collectionPageSchema = {
    ...buildCollectionPageSchema({
      name: page.h1,
      path: `/${page.slug}`,
      description: page.description,
      items: featuredTools.map((t) => ({
        name: t.name,
        path: t.path,
        description: t.description,
      })),
    }),
    // Freshness
    ...(page.updatedAt
      ? { datePublished: page.updatedAt, dateModified: page.updatedAt, lastReviewed: page.updatedAt }
      : {}),
    // E-E-A-T / authorship
    ...(page.reviewedBy
      ? {
          reviewedBy: {
            "@type": "Organization",
            name: page.reviewedBy,
            ...(page.reviewerRole ? { description: page.reviewerRole } : {}),
          },
          publisher: {
            "@type": "Organization",
            name: "TheFreeAITools",
            url: "https://www.thefreeaitools.com",
            logo: {
              "@type": "ImageObject",
              url: "https://www.thefreeaitools.com/logo.png",
            },
          },
        }
      : {}),
    // Keyword relevance
    ...(page.primaryKeyword
      ? { keywords: [page.primaryKeyword, ...(page.lsiKeywords ?? [])].join(", ") }
      : {}),
    // Speakable — GEO / AEO signal: name the CSS selectors or xpaths that are
    // "answer-ready" so voice assistants and AI overviews can extract them.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#hub-intro", "#hub-faq"],
    },
    // Mentions — entity linking improves topical authority
    mentions: featuredTools.map((t) => ({
      "@type": "SoftwareApplication",
      name: t.name,
      url: `https://www.thefreeaitools.com${t.path}`,
      applicationCategory: "WebApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    })),
    // About — connect to a broad concept entity for topic relevance
    about: {
      "@type": "Thing",
      name: page.h1,
      description: page.description,
    },
  }

  // ── WebSite sitelinks schema (only on hub pages, aids sitelink search box) ──
  const siteLinksSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.thefreeaitools.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.thefreeaitools.com/tools?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      {/* ── Global animation styles ── */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .fade-up {
            opacity: 0;
            transform: translateY(18px);
            animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          @keyframes fadeUp {
            to { opacity: 1; transform: translateY(0); }
          }
          .stagger-1 { animation-delay: 0.05s; }
          .stagger-2 { animation-delay: 0.12s; }
          .stagger-3 { animation-delay: 0.19s; }
          .stagger-4 { animation-delay: 0.26s; }
          .stagger-5 { animation-delay: 0.33s; }
          .stagger-6 { animation-delay: 0.40s; }

          .tool-card {
            transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
          }
          .tool-card:hover {
            border-color: hsl(var(--foreground));
            background: hsl(var(--foreground) / 0.03);
            transform: translateY(-2px);
          }

          .hub-link {
            transition: border-color 0.15s ease, background 0.15s ease;
          }
          .hub-link:hover {
            border-color: hsl(var(--foreground));
            background: hsl(var(--foreground) / 0.03);
          }

          .count-pulse {
            animation: countPulse 2.4s ease-in-out infinite;
          }
          @keyframes countPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.65; }
          }

          .cta-btn {
            transition: background 0.15s ease, transform 0.12s ease;
          }
          .cta-btn:hover { transform: translateY(-1px); }
          .cta-btn:active { transform: translateY(0); }

          .outline-btn {
            transition: border-color 0.15s ease, background 0.15s ease;
          }
          .outline-btn:hover {
            border-color: hsl(var(--foreground));
            background: hsl(var(--foreground) / 0.05);
          }

          .badge-pill {
            transition: background 0.15s ease, color 0.15s ease;
          }
          .badge-pill:hover {
            background: hsl(var(--foreground));
            color: hsl(var(--background));
          }
        }

        /* Sharp hero divider line */
        .hero-rule {
          border: none;
          border-top: 1px solid hsl(var(--foreground) / 0.1);
          margin: 1.5rem 0 0;
        }

        /* Tool count stat chip */
        .stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border: 1px solid hsl(var(--foreground) / 0.12);
          border-radius: 100px;
          color: hsl(var(--muted-foreground));
        }
        .stat-chip .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: hsl(var(--foreground));
          display: inline-block;
        }

        /* Section heading with left accent */
        .section-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .section-heading::before {
          content: '';
          display: block;
          width: 3px;
          height: 1.1em;
          background: hsl(var(--foreground));
          border-radius: 2px;
          flex-shrink: 0;
        }

        /* Inline "open arrow" for links */
        .arrow-link::after {
          content: ' →';
          display: inline;
        }

        /* Featured tool image fallback icon */
        .tool-icon-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(var(--muted) / 0.5);
          border-bottom: 1px solid hsl(var(--foreground) / 0.06);
        }
      `}</style>

      <JsonLd
        id={`hub-page-${page.slug}-schema`}
        data={[collectionPageSchema, buildFaqSchema(page.faqs), buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: page.h1, path: `/${page.slug}` },
        ]), siteLinksSchema]}
      />

      <div className="container mx-auto px-4 py-10 max-w-screen-xl">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_200px]">

          {/* ─────────────────────────── MAIN COLUMN ─────────────────────────── */}
          <main className="min-w-0">

            {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
            <nav aria-label="Breadcrumb" className="mb-6 fade-up stagger-1">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                </li>
                <li aria-hidden="true" className="opacity-30">/</li>
                <li>
                  <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
                </li>
                <li aria-hidden="true" className="opacity-30">/</li>
                <li aria-current="page" className="font-medium text-foreground">{page.h1}</li>
              </ol>
            </nav>

            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <header className="mb-10 fade-up stagger-2">
              {/* Category + meta badges */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    className="stat-chip badge-pill"
                    aria-label={`Browse ${cat.name} tools`}
                  >
                    <span className="dot" aria-hidden="true" />
                    {cat.name}
                  </Link>
                ))}
                <span className="stat-chip">
                  Free · No sign-up
                </span>
              </div>

              {/* H1 — large, tight, editorial */}
              <h1
                id="hub-intro"
                className="text-4xl font-bold tracking-tight leading-[1.08] md:text-5xl lg:text-[3.25rem]"
              >
                {page.h1}
              </h1>

              {/* Intro paragraph — AEO: short, direct, answer-ready */}
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                {page.intro}
              </p>

              {/* Freshness / review signal */}
              {(formattedUpdatedAt || page.reviewedBy) && (
                <p className="mt-3 text-xs text-muted-foreground/70">
                  {formattedUpdatedAt && (
                    <>Updated <time dateTime={page.updatedAt}>{formattedUpdatedAt}</time></>
                  )}
                  {formattedUpdatedAt && page.reviewedBy && " · "}
                  {page.reviewedBy && (
                    <>Reviewed by {page.reviewedBy}{page.reviewerRole ? ` — ${page.reviewerRole}` : ""}</>
                  )}
                </p>
              )}

              <hr className="hero-rule" />

              {/* Stat row */}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground count-pulse">{liveTools.length}+</strong>{" "}
                  tools across{" "}
                  <strong className="text-foreground">{toolCategories.length}</strong> categories
                </span>

                <div className="flex flex-wrap gap-3 ml-auto">
                  <Link
                    href="/tools"
                    className="cta-btn inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
                  >
                    Browse all tools →
                  </Link>
                  <Link
                    href="/categories"
                    className="outline-btn inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium"
                  >
                    All categories
                  </Link>
                </div>
              </div>
            </header>

            {/* ── Featured tools ─────────────────────────────────────────────── */}
            <section className="mb-10 fade-up stagger-3" aria-labelledby="featured-heading">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 id="featured-heading" className="section-heading">
                  Top free tools
                </h2>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  No account · Works in browser
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featuredTools.map((tool, i) => {
                  const img = getPrimaryToolImage(tool.id)
                  return (
                    <article
                      key={tool.id}
                      className={`tool-card overflow-hidden rounded-2xl border border-foreground/10 bg-background fade-up`}
                      style={{ animationDelay: `${0.18 + i * 0.06}s` }}
                    >
                      {/* Tool image / fallback */}
                      {img ? (
                        <ToolThumb
                          src={img}
                          toolName={tool.name}
                          className="h-32 w-full rounded-t-2xl rounded-b-none object-cover"
                        />
                      ) : (
                        <div className="tool-icon-fallback h-20 w-full rounded-t-2xl">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-muted-foreground/30"
                            aria-hidden="true"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <path d="M8 12h8M12 8v8" />
                          </svg>
                        </div>
                      )}

                      <div className="p-5">
                        <h3 className="text-[0.9375rem] font-semibold leading-snug">
                          <Link
                            href={tool.path}
                            className="hover:underline underline-offset-2 decoration-foreground/25"
                          >
                            {tool.name}
                          </Link>
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground line-clamp-2">
                          {tool.description}
                        </p>
                        <div className="mt-4 pt-4 border-t border-foreground/6">
                          <Link
                            href={tool.path}
                            className="text-xs font-semibold uppercase tracking-wider hover:underline underline-offset-4 arrow-link"
                          >
                            Open free
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>


            {/* ── Long-form content ───────────────────────────────────────────── */}
            {page.longForm && page.longForm.length > 0 && (
              <section
                className="mb-10 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-6 md:p-8 fade-up stagger-4"
                aria-labelledby="about-heading"
              >
                <h2 id="about-heading" className="section-heading mb-5">
                  About these tools
                </h2>
                <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-[0.9375rem]">
                  {page.longForm.map((para, i) => (
                    <p key={`${page.slug}-longform-${i}`}>{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* ── All tools by category ──────────────────────────────────────── */}
            {categoryToolGroups.length > 0 && (
              <section
                className="mb-10 fade-up stagger-4"
                aria-labelledby="all-tools-heading"
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <h2 id="all-tools-heading" className="section-heading">
                    All tools in this topic
                  </h2>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {totalToolCount} tools total
                  </span>
                </div>

                <div className="space-y-8">
                  {categoryToolGroups.map((group) => (
                    <div key={`${page.slug}-${group.category.id}`}>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {group.category.name}
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {group.tools.map((tool) => (
                          <Link
                            key={`${page.slug}-${tool.id}`}
                            href={tool.path}
                            prefetch={false}
                            className="hub-link rounded-xl border border-foreground/8 bg-background p-3 text-sm block"
                          >
                            <span className="font-medium text-[0.875rem]">{tool.name}</span>
                            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground line-clamp-1">
                              {tool.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── FAQ — id used by Speakable schema ──────────────────────────── */}
            <div id="hub-faq" className="fade-up stagger-5">
              <FAQSection faqs={page.faqs} title={page.faqTitle} />
            </div>

            {/* ── Related hubs ───────────────────────────────────────────────── */}
            {relatedHubs.length > 0 && (
              <section
                className="mb-10 fade-up stagger-6"
                aria-labelledby="related-heading"
              >
                <h2 id="related-heading" className="section-heading mb-5">
                  Related free tool collections
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {relatedHubs.map((hub) => (
                    <Link
                      key={hub.slug}
                      href={`/${hub.slug}`}
                      className="hub-link rounded-xl border border-foreground/8 bg-background p-4 block"
                    >
                      <span className="block font-medium text-sm leading-snug">{hub.h1}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground line-clamp-2">
                        {hub.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Bottom CTA — high-contrast, editorial ─────────────────────── */}
            <section
              className="rounded-2xl bg-foreground text-background p-8 md:p-10 text-center fade-up"
              aria-label="Explore more free tools"
            >
              {/* AEO micro-answer: voice assistants can read this block */}
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] opacity-50">
                The complete toolkit
              </p>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                {liveTools.length}+ free browser tools
              </h2>
              <p className="mt-3 text-sm leading-7 opacity-70 max-w-md mx-auto">
                Every tool runs instantly in your browser — no account, no download, no cost.
                Across {toolCategories.length} categories for everyday tasks.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                >
                  Browse all tools →
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 rounded-full border border-background/25 px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
                >
                  All categories
                </Link>
              </div>
            </section>

          </main>

          {/* ─────────────────────────── SIDEBAR ─────────────────────────────── */}
          <aside className="hidden xl:block" aria-label="Sidebar">
            <div className="sticky top-6 space-y-5">

              {/* Quick links */}
              <div className="rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-5">
                <h2 className="section-heading text-[0.9375rem] mb-4">
                  Quick links
                </h2>
                <nav aria-label="Helpful links" className="space-y-1 text-sm">
                  <Link
                    href="/categories"
                    className="block py-1.5 text-muted-foreground hover:text-foreground transition-colors arrow-link"
                  >
                    All categories
                  </Link>
                  <Link
                    href="/tools"
                    className="block py-1.5 text-muted-foreground hover:text-foreground transition-colors arrow-link"
                  >
                    All tools
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.id}`}
                      className="block py-1.5 text-muted-foreground hover:text-foreground transition-colors arrow-link"
                    >
                      {cat.name} tools
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Trust signal */}
              <div className="rounded-2xl border border-foreground/8 p-5 text-center">
                <p className="text-3xl font-bold tracking-tight">{liveTools.length}+</p>
                <p className="mt-0.5 text-xs text-muted-foreground uppercase tracking-wider">
                  Free tools
                </p>
                <hr className="my-3 border-foreground/8" />
                <p className="text-3xl font-bold tracking-tight">{toolCategories.length}</p>
                <p className="mt-0.5 text-xs text-muted-foreground uppercase tracking-wider">
                  Categories
                </p>
                <hr className="my-3 border-foreground/8" />
                <p className="text-3xl font-bold tracking-tight">0</p>
                <p className="mt-0.5 text-xs text-muted-foreground uppercase tracking-wider">
                  Required sign-ups
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  )
}