import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Clock, ShieldCheck, Phone } from "lucide-react"
import { buildPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"
import { ContactForm } from "./contact-form"

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact The Free AI Tools for support, bug reports, feature requests, or business inquiries. We reply within 2 business days.",
  path: "/contact",
  keywords: ["contact The Free AI Tools", "tool support", "bug report", "feature request"],
})

const infoItems = [
  {
    Icon: MapPin,
    label: "Location",
    value: "Morocco",
  },
  {
    Icon: Phone,
    label: "Phone",
    value: "+212 755164113",
    href: "tel:+212755164113",
  },
  {
    Icon: Mail,
    label: "General email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    Icon: Clock,
    label: "Response time",
    value: "Within 2 business days",
  },
  {
    Icon: ShieldCheck,
    label: "Security reports",
    value: siteConfig.securityEmail ?? siteConfig.email,
    href: `mailto:${siteConfig.securityEmail ?? siteConfig.email}`,
  },
]

const contactChannels = [
  { purpose: "General enquiries", email: "hello@thefreeaitools.com" },
  { purpose: "Support & tool issues", email: "support@thefreeaitools.com" },
  { purpose: "Security disclosures", email: "security@thefreeaitools.com" },
  { purpose: "Other", email: "info@thefreeaitools.com" },
]

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-10 px-4 py-16">

      {/* ── Header ── */}
      <header>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          Contact
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-white">
          Get in Touch
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Have a question, found a bug, or want to suggest a new tool? Fill in the form below
          or email us directly. We typically reply within 2 business days.
        </p>
      </header>

      {/* ── Contact Form ── */}
      <ContactForm />

      {/* ── Info strip ── */}
      <section
        aria-label="Contact details"
        className="grid gap-3 sm:grid-cols-2"
      >
        {infoItems.map(({ Icon, label, value, href }) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="mt-0.5 block truncate text-sm font-medium text-black underline-offset-2 hover:underline dark:text-white"
                >
                  {value}
                </a>
              ) : (
                <p className="mt-0.5 text-sm text-black dark:text-white">{value}</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── Email directory ── */}
      <section aria-labelledby="email-dir-heading">
        <h2
          id="email-dir-heading"
          className="mb-3 text-base font-bold text-black dark:text-white"
        >
          Email directory
        </h2>
        <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {contactChannels.map(({ purpose, email }) => (
                <tr
                  key={email}
                  className="bg-white transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                >
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{purpose}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1.5 font-medium text-black underline-offset-2 hover:underline dark:text-white"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
                      {email}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Related pages ── */}
      <section aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="mb-3 text-base font-bold text-black dark:text-white"
        >
          Helpful links
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/disclaimer", label: "Disclaimer" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/security", label: "Security" },
            { href: "/acceptable-use", label: "Acceptable Use" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

    </main>
  )
}