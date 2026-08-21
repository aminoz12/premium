import Link from "next/link"
import { ArrowRight } from "lucide-react"

type AffiliateEntry = {
  label: string
  url: string | null
  description: string
  badge?: string
}

// Map each tool category to a relevant premium affiliate offer.
// Set url to null (or leave at null) to disable the CTA for that category.
// Only set url when you have a real affiliate link — placeholder "#" URLs will be ignored.
const AFFILIATE_BY_CATEGORY: Record<string, AffiliateEntry> = {
  image: {
    label: "Try Canva Pro",
    url: null, // e.g. "https://partner.canva.com/your-id"
    description: "Design with 100M+ stock photos, templates, and AI tools",
    badge: "30-day free trial",
  },
  seo: {
    label: "Try Ahrefs Webmaster Tools",
    url: null, // e.g. "https://ahrefs.com/webmaster-tools?ref=thefreeaitools"
    description: "Free site audit, backlink index, and keyword rankings for your domain",
    badge: "Free plan available",
  },
  developer: {
    label: "Explore GitHub Copilot",
    url: null, // e.g. "https://github.com/features/copilot"
    description: "AI pair programmer that suggests code completions in real time",
    badge: "Free for students",
  },
  text: {
    label: "Try Grammarly",
    url: null, // e.g. "https://www.grammarly.com/affiliate"
    description: "AI writing assistant for grammar, clarity, and tone",
    badge: "Free basic plan",
  },
  security: {
    label: "Try 1Password",
    url: null, // e.g. "https://1password.com/referral"
    description: "Password manager trusted by 100,000+ businesses",
    badge: "14-day free trial",
  },
  design: {
    label: "Try Figma",
    url: null, // e.g. "https://figma.com/pricing"
    description: "Collaborative design tool for UI, prototypes, and presentations",
    badge: "Free starter plan",
  },
  audio: {
    label: "Try Descript",
    url: null, // e.g. "https://www.descript.com/affiliate"
    description: "Record, transcribe, and edit audio and video as easily as text",
    badge: "Free plan available",
  },
  file: {
    label: "Try Adobe Acrobat",
    url: null,
    description: "The gold standard for PDF editing, signing, and conversion",
    badge: "7-day free trial",
  },
}

interface AffiliateCTAProps {
  categoryId: string
}

export function AffiliateCTA({ categoryId }: AffiliateCTAProps) {
  const entry = AFFILIATE_BY_CATEGORY[categoryId]

  // Render nothing if no entry, no URL, or URL is a placeholder
  if (!entry || !entry.url || entry.url === "#") {
    return null
  }

  return (
    <section className="mt-10 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            Sponsored — goes beyond the free version
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">{entry.label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
          {entry.badge ? (
            <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
              {entry.badge}
            </span>
          ) : null}
        </div>
        <Link
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          {entry.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
