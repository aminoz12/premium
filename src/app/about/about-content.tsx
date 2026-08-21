"use client"

import Link from "next/link"
import { Shield, Zap, Heart, Github, Mail, ExternalLink } from "lucide-react"
import { ContactTable } from "@/components/site/contact-table"
import { siteConfig } from "@/lib/site-config"
import { toolCount, toolCategories } from "@/lib/tools/tools-config"

const LAUNCH_YEAR = 2024

const stats = [
  {
    value: `${toolCount}+`,
    label: "Free tools",
    sub: `Across ${toolCategories.length} categories: developer, SEO, image, text, calculator, security, and more.`,
  },
  {
    value: String(LAUNCH_YEAR),
    label: "Year launched",
    sub: "Maintained actively since launch. New tools added regularly based on user requests and real workflow gaps.",
  },
  {
    value: "0",
    label: "Server uploads",
    sub: "Most tools run entirely in your browser. Your text, files, and passwords never leave your device.",
  },
  {
    value: "0",
    label: "Required accounts",
    sub: "No sign-up, no subscription, no email capture. Open any tool and start immediately.",
  },
]

const values = [
  {
    Icon: Shield,
    title: "Privacy first",
    body: "Tools process inputs locally in your browser wherever possible. Sensitive data — passwords, API keys, private text — never leaves your device.",
  },
  {
    Icon: Zap,
    title: "Genuinely useful",
    body: "Every tool page does real work: schema markup, accurate descriptions, related tools, and keyboard shortcuts. No thin wrapper pages.",
  },
  {
    Icon: Heart,
    title: "Built by someone who uses them",
    body: "Each tool was built because I needed it myself: JWT debugging, Regex testing, color contrast checking, cron parsing, and more.",
  },
]

export function AboutPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">

      {/* ── Hero ── */}
      <header className="mb-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          About
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white md:text-5xl">
          The Free AI Tools
        </h1>
        <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          {toolCount}+ browser-based utilities built for real work. No accounts, no server
          uploads, no paywalls.
        </p>
      </header>

      {/* ── Who built this ── */}
      <section className="mb-14" aria-labelledby="who-heading">
        <h2
          id="who-heading"
          className="mb-5 text-2xl font-bold text-black dark:text-white"
        >
          Who built this
        </h2>
        <div className="rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative h-20 w-20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/founder.jpg"
                alt="Achraf — Founder of The Free AI Tools"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.style.display = "none"
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = "flex"
                }}
              />
              <span
                className="absolute inset-0 hidden h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-extrabold text-white dark:bg-white dark:text-black"
                aria-hidden="true"
              >
                A
              </span>
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-lg font-bold text-black dark:text-white">Achraf A.</p>
              <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
                Full-Stack Developer · Morocco 🇲🇦 · Web tools &amp; browser APIs
              </p>
              <p className="mb-4 mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
                I built The Free AI Tools because I kept running into the same problem during
                freelance and side projects: simple tasks like formatting JSON, generating secure
                passwords, or checking color contrast meant opening five tabs of ad-heavy sites
                and hoping none of them uploaded my data somewhere. I wanted one place where
                everything ran locally in the browser, loaded instantly, and just worked. That
                became this site.
              </p>
              <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
                The first tool I built was the JSON Formatter — I was debugging a REST API
                response at 1 AM and every formatter I found either uploaded my payload to a
                server or wrapped it in so many ads I could barely see the output. I wrote my
                own in an afternoon and shipped it. Three years later there are {toolCount}+
                tools and I still use most of them daily.
              </p>
              <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
                I have been building web tools and browser-side applications since{" "}
                {LAUNCH_YEAR - 3}. My focus is on developer tooling, privacy-respecting
                utilities, and tools that do exactly what they say without hidden complexity.
              </p>

              {/* Social links — properly visible in both themes */}
              <div className="mt-6 flex flex-wrap gap-3">
                {siteConfig.social.github && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-neutral-500"
                    aria-label="View GitHub profile"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    GitHub
                  </a>
                )}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-neutral-500"
                  aria-label={`Email ${siteConfig.email}`}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The project ── */}
      <section className="mb-14" aria-labelledby="project-heading">
        <h2
          id="project-heading"
          className="mb-5 text-2xl font-bold text-black dark:text-white"
        >
          The project
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map(({ value, label, sub }) => (
            <div
              key={label}
              className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
            >
              <p className="mb-1 text-3xl font-extrabold text-black dark:text-white">{value}</p>
              <p className="text-sm font-semibold text-black dark:text-white">{label}</p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="mb-14" aria-labelledby="values-heading">
        <h2
          id="values-heading"
          className="mb-5 text-2xl font-bold text-black dark:text-white"
        >
          What guides every tool
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {values.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
            >
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black"
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-sm font-bold text-black dark:text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy commitment ── */}
      <section
        className="mb-14 rounded-xl border border-neutral-200 p-8 dark:border-neutral-800"
        aria-labelledby="privacy-heading"
      >
        <h2
          id="privacy-heading"
          className="mb-3 text-xl font-bold text-black dark:text-white"
        >
          Privacy commitment
        </h2>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          All {toolCount}+ tools are browser-side applications. No files, passwords, personal
          data, or code snippets are ever sent to any server. The only external service used
          is Google Analytics for anonymous page-view counts — no cross-site tracking, no
          personal identifiers. We do not sell, share, or store user data of any kind.
          Questions?{" "}
          <a
            href={`mailto:${siteConfig.securityEmail}`}
            className="font-semibold text-black underline underline-offset-2 dark:text-white"
          >
            {siteConfig.securityEmail}
          </a>
        </p>

        {/* Related pages */}
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/security", label: "Security" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/acceptable-use", label: "Acceptable Use" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-neutral-500"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section aria-labelledby="contact-heading">
        <h2
          id="contact-heading"
          className="mb-5 text-2xl font-bold text-black dark:text-white"
        >
          Get in touch
        </h2>
        <p className="mb-1 text-neutral-600 dark:text-neutral-400">
          Have a tool suggestion, spotted a bug, or want to collaborate? Use the right channel
          below.
        </p>
        <ContactTable />
      </section>
    </main>
  )
}