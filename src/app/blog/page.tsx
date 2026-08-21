import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { buildPageMetadata } from "@/lib/page-metadata"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo/schema"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { blogPosts } from "@/lib/blog/posts"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { RecentTools } from "@/components/tool/RecentTools"

export const metadata: Metadata = buildPageMetadata({
  title: "Blog — Browser Tools, Privacy & Developer Productivity | TheFreeAITools",
  description:
    "Practical guides on browser-based AI tools, image compression, audio conversion, PDF utilities, text tools, developer workflows, and building privacy-first web utilities. Free tools, no signup required. Written by Achraf A., founder of TheFreeAITools.",
  path: "/blog",
  keywords: [
    "free AI tools",
    "browser-based tools",
    "online developer tools",
    "image compression online",
    "audio converter browser",
    "PDF tools free",
    "privacy-first web tools",
    "developer productivity tools",
    "text tools online",
    "no signup tools",
    "open source web utilities",
    "AI writing tools",
    "code formatter online",
    "color palette generator",
    "JSON formatter free",
    "markdown editor online",
    "base64 encoder decoder",
    "URL encoder tool",
    "regex tester online",
    "frontend developer tools",
  ],
})

const posts = blogPosts

export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    name: `${siteConfig.name} Blog`,
    description:
      "Practical, hands-on guides on browser-based AI tools, privacy-first web utilities, image compression, audio conversion, PDF tools, and developer workflows.",
    url: buildAbsoluteUrl("/blog"),
    inLanguage: "en-US",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: [
      { "@type": "Thing", name: "Browser-based Tools" },
      { "@type": "Thing", name: "AI Tools" },
      { "@type": "Thing", name: "Developer Productivity" },
      { "@type": "Thing", name: "Privacy-first Web Utilities" },
      { "@type": "Thing", name: "Image Compression" },
      { "@type": "Thing", name: "Audio Conversion" },
      { "@type": "Thing", name: "PDF Utilities" },
    ],
    keywords:
      "free AI tools, browser tools, image compression, audio converter, PDF tools, developer utilities, privacy-first, no signup, online tools",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      url: buildAbsoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
      dateModified: post.date,
      keywords: post.tags.join(", "),
      articleSection: post.tags[0] ?? "Tutorials",
      inLanguage: "en-US",
      image: buildAbsoluteUrl(siteConfig.ogImage),
      author: {
        "@type": "Person",
        name: "Achraf A.",
        url: buildAbsoluteUrl("/about"),
      },
      publisher: { "@id": `${siteConfig.url}/#organization` },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": buildAbsoluteUrl(`/blog/${post.slug}`),
      },
    })),
  }

  // Blog-section FAQ — answers real "is this blog useful / who writes it" queries
  // and earns FAQ rich-result eligibility for the /blog landing page.
  const blogFaqs = [
    {
      question: "Who writes the TheFreeAITools blog?",
      answer:
        "Every article is written by Achraf A., founder of TheFreeAITools, based on hands-on experience building and using these browser-based tools daily. The guides favor specific, tested advice over generic overviews.",
    },
    {
      question: "Are the guides on this blog free to read?",
      answer:
        "Yes. Every article is free to read with no paywall, no signup, and no email required. Each guide links directly to the free browser-based tool it describes.",
    },
    {
      question: "What topics does this blog cover?",
      answer:
        "The blog covers practical guides on image compression and conversion, PDF tools, developer utilities (JSON, SQL, JWT, regex, Base64), text and writing tools, SEO, and privacy-first browser workflows — all tied to free tools you can use immediately.",
    },
    {
      question: "How often are new articles published?",
      answer:
        "New long-form guides are added regularly. Each post is dated and the newest articles appear first on this page, so you can always see the most recent additions at the top.",
    },
  ]

  const faqSchema = buildFaqSchema(blogFaqs)

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <JsonLd id="blog-schema" data={blogSchema} />
        <JsonLd id="blog-faq-schema" data={faqSchema} />
        <JsonLd
          id="blog-breadcrumb"
          data={buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ])}
        />

        {/* Breadcrumb — visible navigation matching the JSON-LD breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-black/50 dark:text-white/50">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-black hover:underline dark:hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-black dark:text-white">
              Blog
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-14 border-b border-black/10 pb-10 dark:border-white/10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-black dark:text-white">
            TheFreeAITools — Blog
          </p>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-black dark:text-white sm:text-5xl">
              Practical guides on browser tools &amp; developer workflows
            </h1>
            <p className="shrink-0 text-sm font-medium  text-black/60 dark:text-white/60 dark:text-white/50 sm:text-right">
              {posts.length} articles
            </p>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed  text-black/60 dark:text-white/60 dark:text-white/60">
            Free, hands-on guides on image compression, PDF tools, developer
            utilities (JSON, SQL, JWT, regex, Base64), text and writing tools, SEO,
            and privacy-first browser workflows. Every tutorial is written by
            Achraf A., founder of TheFreeAITools, and links straight to the free,
            no-signup tool it explains.
          </p>
        </header>

        {/* Featured post (first post, full width) */}
        {posts.length > 0 && (
          <div className="mb-8">
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group flex flex-col gap-5 rounded-2xl border border-black/10 bg-black p-8 transition-opacity hover:opacity-90 dark:border-white/10 dark:bg-white sm:flex-row sm:items-start sm:gap-10"
            >
              {/* Left: meta + title + summary */}
              <div className="flex-1">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white dark:border-black/20 dark:text-black">
                  ✦ Latest
                </div>
                <h2 className="text-2xl font-extrabold leading-snug text-white transition-opacity group-hover:opacity-80 dark:text-black sm:text-3xl">
                  {posts[0].title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70 dark: text-black/60 dark:text-white/60">
                  {posts[0].summary}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {posts[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/20 px-2.5 py-1 text-xs font-medium text-white/80 dark:border-black/20 dark:text-black/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: date + CTA */}
              <div className="flex shrink-0 flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-between">
                <div className="text-xs text-white/50 dark:text-black/40">
                  <time dateTime={posts[0].date}>
                    {new Date(posts[0].date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="ml-3 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {posts[0].readTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white transition-gap group-hover:gap-2.5 dark:text-black sm:mt-auto">
                  Read article{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Grid of remaining posts */}
        {posts.length > 1 && (
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(1).map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 transition-all hover:border-black/30 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30"
                >
                  {/* Meta */}
                  <div className="mb-3 flex items-center gap-3 text-xs font-medium text-black/40 dark:text-white/40">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold leading-snug text-black transition-opacity group-hover:opacity-70 dark:text-white sm:text-lg">
                    {post.title}
                  </h2>

                  {/* Summary */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-black/55 dark:text-white/55">
                    {post.summary}
                  </p>

                  {/* Tags + CTA */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-black/15 px-2 py-0.5 text-xs font-medium text-black/70 dark:border-white/15 dark:text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="rounded border border-black/15 px-2 py-0.5 text-xs font-medium text-black/40 dark:border-white/15 dark:text-white/40">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-black transition-all group-hover:gap-2 dark:text-white">
                      Read{" "}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}

        {/* Popular topics — internal linking to category hubs and cornerstone guides */}
        <section className="mt-16 border-t border-black/10 pt-10 dark:border-white/10" aria-labelledby="blog-topics-heading">
          <h2 id="blog-topics-heading" className="text-2xl font-extrabold tracking-tight text-black dark:text-white">
            Popular topics
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/55 dark:text-white/55">
            Jump straight to the free tools behind these guides, organised by topic.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Image tools", href: "/categories/image" },
              { label: "Developer tools", href: "/categories/developer" },
              { label: "Text & writing", href: "/categories/text" },
              { label: "SEO tools", href: "/categories/seo" },
              { label: "Security tools", href: "/categories/security" },
              { label: "Design & CSS", href: "/categories/design" },
            ].map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/30"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ — visible answers backed by FAQPage schema above */}
        <section className="mt-12 border-t border-black/10 pt-10 dark:border-white/10" aria-labelledby="blog-faq-heading">
          <h2 id="blog-faq-heading" className="text-2xl font-extrabold tracking-tight text-black dark:text-white">
            Frequently asked questions
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {blogFaqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-base font-bold text-black dark:text-white">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-black/60 dark:text-white/60">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

          <RecentTools />

      </main>
      <Footer />
    </>
  )
}
