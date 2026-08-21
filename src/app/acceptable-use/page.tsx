import Link from "next/link"
import { ContentPage } from "@/components/site/content-page"
import { ContactTable } from "@/components/site/contact-table"
import { buildPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"
import {
  Target,
  CheckCircle,
  XCircle,
  Bot,
  ShieldAlert,
  Mail,
} from "lucide-react"

export const metadata = buildPageMetadata({
  title: "Acceptable Use Policy",
  description:
    "Read the acceptable use rules for The Free AI Tools, covering what workflows are permitted and which uses are prohibited.",
  path: "/acceptable-use",
})

const sections = [
  { id: "purpose", label: "Intended Purpose" },
  { id: "permitted", label: "Permitted Uses" },
  { id: "prohibited", label: "Prohibited Uses" },
  { id: "ai", label: "AI Tools — Specific Expectations" },
  { id: "enforcement", label: "Policy Enforcement" },
  { id: "contact", label: "Contact" },
]

const permittedUses = [
  {
    title: "Productivity and development",
    body: "Formatting JSON, converting files, generating UUIDs, testing regular expressions, decoding Base64, building CSS, and similar day-to-day development and design tasks.",
  },
  {
    title: "Educational use",
    body: "Learning how encryption works, understanding hash algorithms, practicing regex patterns, exploring color theory, studying HTML structure — tools are appropriate for classrooms, self-teaching, and developer training.",
  },
  {
    title: "Defensive security work",
    body: "Checking the strength of passwords you control, testing SSL certificates on your own domains, running DNS lookups for your own infrastructure, decoding your own JWTs for debugging, generating test hashes for your own verification systems.",
  },
  {
    title: "Content creation",
    body: "Generating images, writing AI-assisted drafts, compressing photos for a blog post, creating QR codes for your own products, and building assets for your own websites and projects.",
  },
  {
    title: "Accessibility and compliance work",
    body: "Checking color contrast ratios, auditing heading structure, validating focus order, and testing ARIA attributes on your own web properties.",
  },
]

const prohibitedUses = [
  {
    title: "Unauthorized access",
    body: "Using any tool (network lookups, security tests, encoding/decoding tools, URL tools) against systems, services, or accounts you do not own or have explicit written permission to test.",
  },
  {
    title: "Phishing and impersonation",
    body: "Using AI writing tools, QR code generators, URL shorteners, or any other tool to create content designed to deceive people into revealing credentials, clicking malicious links, or trusting fraudulent identities.",
  },
  {
    title: "Spam",
    body: "Generating bulk content, email lists, or automated messages intended for unsolicited mass distribution.",
  },
  {
    title: "Malware and exploits",
    body: "Using tools to encode, obfuscate, or distribute malicious code; generating payloads for exploit kits; creating content designed to bypass security controls on systems you do not own.",
  },
  {
    title: "Financial fraud",
    body: "Using card data generators, identity generators, or any other tool output as real-world financial instruments, fake identities, or fraudulent payment credentials. Generated data is for testing legitimate payment systems you control only.",
  },
  {
    title: "Credential attacks",
    body: "Using hash tools, password tools, or encoding tools to attack, crack, or enumerate credentials belonging to others.",
  },
  {
    title: "Infrastructure abuse",
    body: "Using network tools (DNS lookup, SSL checker, IP lookup, speed test) in automated loops against third-party infrastructure in ways that constitute a denial-of-service or scanning attack.",
  },
  {
    title: "CSAM and harmful content",
    body: "Generating any content involving minors in sexual contexts, real people without their consent, or any content that is illegal in the user's or site's jurisdiction.",
  },
  {
    title: "Competitive scraping",
    body: "Automated scraping of tool outputs, configurations, or site content at scale for the purpose of building a competing product or database.",
  },
]

const aiExpectations = [
  "Do not input other people's personally identifiable information, private communications, or confidential documents without their consent.",
  "Do not use AI outputs to deceive, harass, defame, or harm specific individuals or organizations.",
  "AI image generation must not be used to generate realistic images of real identifiable people without their explicit consent.",
  "Do not attempt to jailbreak, prompt-inject, or bypass the safety guidelines of the underlying AI models.",
]

export default function AcceptableUsePage() {
  return (
    <ContentPage
      badge="Acceptable Use"
      title="Acceptable Use Policy"
      summary="The Free AI Tools is designed for legitimate productivity, educational, accessibility, and defensive development work. This policy describes in specific terms what is and is not acceptable use of the tools and services on this site."
      lastUpdated={siteConfig.legalLastUpdated}
    >
      {/* Table of Contents */}
      <nav
        aria-label="Acceptable use sections"
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

      {/* 1. Intended Purpose */}
      <section id="purpose" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Intended purpose</h2>
        </div>
        <p>
          This site provides browser-based utilities that help individuals and teams do everyday
          digital work faster: formatting data, converting files, generating secure credentials,
          compressing images, checking websites, writing with AI assistance, and dozens of other
          practical tasks. Every tool is designed for legitimate use by real people doing real work.
        </p>
        <p>
          We built these tools because we use them ourselves. The acceptable use policy exists
          to protect users, to protect the people whose systems might be targeted by misuse, and
          to keep the site available and safe for everyone.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 2. Permitted Uses */}
      <section id="permitted" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Permitted uses</h2>
        </div>
        <div className="not-prose space-y-3">
          {permittedUses.map(({ title, body }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">{title}</p>
                <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 3. Prohibited Uses */}
      <section id="prohibited" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Prohibited uses</h2>
        </div>
        <p>
          The following uses are explicitly prohibited. Attempting them may result in your
          access being blocked and, in serious cases, reports to relevant authorities.
        </p>
        <div className="not-prose mt-4 space-y-3">
          {prohibitedUses.map(({ title, body }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">{title}</p>
                <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 4. AI Tools */}
      <section id="ai" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">AI tools — specific expectations</h2>
        </div>
        <p>
          The AI-powered tools on this site (text humanizer, paraphraser, story generator, code
          converter, image generator, and similar) send content to third-party AI services. When
          using these tools:
        </p>
        <div className="not-prose mt-4 space-y-3">
          {aiExpectations.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                {i + 1}
              </span>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 5. Enforcement */}
      <section id="enforcement" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Policy enforcement</h2>
        </div>
        <p>
          We may change or remove tool features, block abusive usage patterns, or update this
          policy when necessary to reduce misuse, respond to legal concerns, or comply with the
          policies of third-party services we rely on. We do not actively monitor individual
          sessions, but we do monitor aggregate usage patterns and respond to abuse reports.
        </p>
        <p>
          To report a misuse of this site&apos;s tools by another party, or to ask a question about
          whether a specific use case is permitted, contact us via the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 6. Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Contact</h2>
        </div>
        <p>For questions about this policy or to report a violation:</p>
        <ContactTable />
      </section>
    </ContentPage>
  )
}