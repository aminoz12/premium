import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, BarChart2, Search, Globe, ShieldCheck, Rss } from "lucide-react"
import { buildPageMetadata } from "@/lib/page-metadata"
import { liveTools, toolCategories } from "@/lib/tools/tools-config"
import { blogPosts } from "@/lib/blog/posts"

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Site Status & Monitoring - TheFreeAITools",
    description:
      "Real-time monitoring links, SEO health metrics, and site statistics for TheFreeAITools.com.",
    path: "/status",
  }),
  robots: { index: true, follow: true },
}

const monitoringLinks = [
  {
    label: "Google Search Console",
    href: "https://search.google.com/search-console",
    description: "Impressions, clicks, CTR, crawl errors, sitemap status",
    icon: Search,
  },
  {
    label: "Google Analytics 4",
    href: "https://analytics.google.com",
    description: "Visitors/day, bounce rate, top pages, conversion events",
    icon: BarChart2,
  },
  {
    label: "PageSpeed Insights",
    href: "https://pagespeed.web.dev/report?url=https%3A%2F%2Fwww.thefreeaitools.com",
    description: "Core Web Vitals: LCP, CLS, FID, mobile/desktop scores",
    icon: Globe,
  },
  {
    label: "Rich Results Test",
    href: "https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.thefreeaitools.com%2Ftools%2Fjson-formatter",
    description: "Verify structured data / JSON-LD schema on key pages",
    icon: ShieldCheck,
  },
  {
    label: "Sitemap.xml",
    href: "/sitemap.xml",
    description: "All indexed URLs - submit this URL in GSC after changes",
    icon: Rss,
  },
]

const seoTargets = [
  { label: "Visitors/day", target: "300+ organic", context: "AdSense minimum" },
  { label: "GSC crawl errors", target: "< 10", context: "Check weekly" },
  { label: "Referring domains", target: "50+", context: "90-day goal" },
  { label: "Average position", target: "< 40", context: "From > 50 current" },
  { label: "AdSense approval", target: "Submitted", context: "After all prerequisites" },
]

export default function StatusPage() {
  const blogPostCount = blogPosts.length

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-black dark:text-white mb-2">
          Operational dashboard
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white md:text-4xl">
          Site Status &amp; Monitoring
        </h1>
        <p className="mt-3 text-base text-black dark:text-white">
          Quick links for weekly SEO health checks, sitemap review, and performance monitoring.
        </p>
      </header>

      {/* Stats */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-xl font-bold text-black dark:text-white mb-4">
          Current Site Stats
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Live tools", value: liveTools.length.toString() },
            { label: "Categories", value: toolCategories.length.toString() },
            { label: "Blog posts", value: blogPostCount.toString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-2xl font-extrabold text-black dark:text-white">{value}</p>
              <p className="text-sm text-black dark:text-white mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Monitoring Links */}
      <section aria-labelledby="monitoring-heading">
        <h2 id="monitoring-heading" className="text-xl font-bold text-black dark:text-white mb-4">
          Monitoring Links
        </h2>
        <div className="space-y-3">
          {monitoringLinks.map(({ label, href, description, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-400 transition-colors"
            >
              <div className="shrink-0 mt-0.5 rounded-lg bg-blue-50 p-2 text-black dark:text-white">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 font-semibold text-black dark:text-white text-sm">
                  {label}
                  <ExternalLink className="h-3 w-3 text-gray-400 shrink-0" />
                </div>
                <p className="text-xs text-black dark:text-white mt-0.5">{description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SEO Targets */}
      <section aria-labelledby="targets-heading">
        <h2 id="targets-heading" className="text-xl font-bold text-black dark:text-white mb-4">
          90-Day SEO Targets
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Metric</th>
                <th className="text-left p-3 font-semibold text-gray-700">Target</th>
                <th className="text-left p-3 font-semibold text-gray-700">Context</th>
              </tr>
            </thead>
            <tbody>
              {seoTargets.map(({ label, target, context }, i) => (
                <tr key={label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="p-3 font-medium text-black dark:text-white">{label}</td>
                  <td className="p-3 text-black dark:text-white font-semibold">{target}</td>
                  <td className="p-3 text-black dark:text-white">{context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-xl font-bold text-black dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/sitemap.xml"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-black dark:text-white transition-colors"
          >
            View sitemap.xml
          </Link>
          <Link
            href="/robots.txt"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-black dark:text-white transition-colors"
          >
            View robots.txt
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-black dark:text-white transition-colors"
          >
            About page (E-E-A-T)
          </Link>
        </div>
      </section>
    </main>
  )
}
