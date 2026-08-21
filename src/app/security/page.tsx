import Link from "next/link"
import { ContentPage } from "@/components/site/content-page"
import { ContactTable } from "@/components/site/contact-table"
import { buildPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"
import {
  ShieldCheck,
  Swords,
  Monitor,
  Bell,
  AlertTriangle,
  BookOpen,
  Mail,
} from "lucide-react"

export const metadata = buildPageMetadata({
  title: "Security",
  description:
    "Review The Free AI Tools security controls, browser support targets, remote-request safeguards, and responsible disclosure details.",
  path: "/security",
})

const sections = [
  { id: "posture", label: "Security Posture" },
  { id: "threats", label: "Threats We Reduce" },
  { id: "browser", label: "Browser Support" },
  { id: "disclosure", label: "Responsible Disclosure" },
  { id: "note", label: "Important Note" },
  { id: "related", label: "Related Pages" },
  { id: "contact", label: "Contact" },
]

export default function SecurityPage() {
  return (
    <ContentPage
      badge="Security"
      title="Security & Responsible Disclosure"
      summary="The Free AI Tools emphasizes local processing, browser hardening headers, sanitized previews, and careful handling of remote lookups. This page outlines the current security posture and how to report vulnerabilities."
      lastUpdated={siteConfig.legalLastUpdated}
    >
      {/* Table of Contents */}
      <nav
        aria-label="Security page sections"
        className="not-prose mb-10 rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          On this page
        </p>
        <ol className="space-y-1.5">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-600 transition-colors group-hover:bg-black group-hover:text-white dark:bg-neutral-700 dark:text-neutral-300 dark:group-hover:bg-white dark:group-hover:text-black">
                  {i + 1}
                </span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. Security Posture */}
      <section id="posture" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Security posture</h2>
        </div>
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          {[
            "Most tools process content locally in the browser — your files and inputs are never uploaded to an app server.",
            "Security headers are configured for clickjacking protection, MIME sniffing prevention, referrer policy, and content restrictions.",
            "User-controlled HTML preview paths are sanitized before rendering.",
            "Remote-request tools block local, private, and reserved hosts to prevent server-side request forgery.",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black">
                ✓
              </span>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 2. Threats */}
      <section id="threats" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Swords className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Threats we actively reduce</h2>
        </div>
        <div className="not-prose overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Threat
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Mitigation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {[
                {
                  threat: "XSS",
                  mitigation:
                    "Sanitized previews and safer highlighting/rendering paths throughout.",
                },
                {
                  threat: "SSRF-style abuse",
                  mitigation:
                    "Localhost, RFC1918, link-local, and reserved targets are rejected in browser lookup tools.",
                },
                {
                  threat: "Unsafe XML/tag output",
                  mitigation:
                    "Tool output is escaped before rendering or download.",
                },
                {
                  threat: "Unnecessary attack surface",
                  mitigation:
                    "Placeholder endpoints and unsupported public links have been removed from production.",
                },
              ].map(({ threat, mitigation }) => (
                <tr
                  key={threat}
                  className="bg-white transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                >
                  <td className="px-4 py-3 font-medium text-black dark:text-white">{threat}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 3. Browser Support */}
      <section id="browser" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Browser support target</h2>
        </div>
        <p>
          The app is designed for current evergreen versions of{" "}
          {siteConfig.supportedBrowsers.join(", ")}. Some advanced tools depend on Web Crypto,
          Canvas, MediaRecorder, AudioContext, Clipboard, or File APIs, so behavior can vary in
          older or restricted browsers.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 4. Disclosure */}
      <section id="disclosure" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Responsible disclosure</h2>
        </div>
        <p>
          If you believe you have found a security issue, please contact us at{" "}
          <a href={`mailto:${siteConfig.securityEmail}`} className="font-medium underline underline-offset-2">
            {siteConfig.securityEmail}
          </a>
          . Provide a clear description of the issue, the steps to reproduce it, and any
          relevant screenshots or proof-of-concept.
        </p>
        <div className="not-prose mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-2 text-sm font-semibold text-black dark:text-white">
            Please avoid the following during disclosure testing:
          </p>
          <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
            {[
              "Destructive or irreversible testing",
              "Social engineering of any person",
              "Denial-of-service attempts",
              "Accessing data that does not belong to you",
            ].map((rule) => (
              <li key={rule} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4">
          The published policy is also available at{" "}
          <a href="/.well-known/security.txt" className="font-medium underline underline-offset-2">
            /.well-known/security.txt
          </a>
          .
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 5. Important Note */}
      <section id="note" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Important note</h2>
        </div>
        <div className="not-prose rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            This page describes engineering controls, not a legal guarantee or certification.
            If you need formal compliance review, please conduct an independent security and
            legal assessment for your deployment context.
          </p>
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 6. Related Pages */}
      <section id="related" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Related pages</h2>
        </div>
        <div className="not-prose flex flex-wrap gap-3">
          {[
            { href: "/acceptable-use", label: "Acceptable Use Policy" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 7. Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Contact</h2>
        </div>
        <p>For security disclosures or general inquiries, use the appropriate channel below:</p>
        <ContactTable />
      </section>
    </ContentPage>
  )
}