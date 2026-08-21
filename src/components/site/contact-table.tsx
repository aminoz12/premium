// components/site/contact-table.tsx
// Reusable contact block for all legal/info pages
// Replaces the broken "text-white on white bg" email dump across 5 pages

import { Mail, ExternalLink } from "lucide-react"
import Link from "next/link"

const CONTACTS = [
  { purpose: "General enquiries", email: "hello@thefreeaitools.com" },
  { purpose: "Support & tool issues", email: "support@thefreeaitools.com" },
  { purpose: "Security disclosures", email: "security@thefreeaitools.com" },
  { purpose: "Other", email: "info@thefreeaitools.com" },
] as const

interface ContactTableProps {
  showContactLink?: boolean
}

export function ContactTable({ showContactLink = true }: ContactTableProps) {
  return (
    <div className="not-prose mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
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
          {CONTACTS.map(({ purpose, email }) => (
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
      {showContactLink && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-black underline-offset-2 hover:underline dark:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Or use the contact form
          </Link>
        </div>
      )}
    </div>
  )
}