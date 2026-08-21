import Link from "next/link"
import { ContentPage } from "@/components/site/content-page"
import { ContactTable } from "@/components/site/contact-table"
import { buildPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"
import {
  FileCheck,
  Layers,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copyright,
  RefreshCw,
  ShieldOff,
  Scale,
  Mail,
} from "lucide-react"

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Review the terms governing the use of The Free AI Tools, including licensing, disclaimers, acceptable usage, and how we may update the service.",
  path: "/terms",
  keywords: ["terms of service", "The Free AI Tools terms", "online tools terms"],
})

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "what-is", label: "What the Service Is" },
  { id: "permitted", label: "Permitted Use" },
  { id: "prohibited", label: "Prohibited Use" },
  { id: "outputs", label: "Tool Outputs & Responsibility" },
  { id: "ip", label: "Intellectual Property" },
  { id: "availability", label: "Service Availability" },
  { id: "warranties", label: "Disclaimer of Warranties" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "law", label: "Governing Law" },
  { id: "contact", label: "Questions" },
]

export default function TermsPage() {
  return (
    <ContentPage
      badge="Terms"
      title="Terms of Service"
      summary="These terms describe the rules for using The Free AI Tools. By using the site you accept these terms. They cover what you may and may not do, what we promise, what we cannot guarantee, and how this relationship works."
      lastUpdated={siteConfig.legalLastUpdated}
    >
      {/* Table of Contents */}
      <nav
        aria-label="Terms sections"
        className="not-prose mb-10 rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          On this page
        </p>
        <ol className="grid gap-1.5 sm:grid-cols-2">
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

      {/* 1. Acceptance */}
      <section id="acceptance" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <FileCheck className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Acceptance of terms</h2>
        </div>
        <p>
          By accessing and using The Free AI Tools (thefreeaitools.com), you agree to be bound
          by these Terms of Service and all applicable laws and regulations. If you do not agree
          with any part of these terms, you should stop using the service immediately. These
          terms apply to all visitors, registered users (newsletter subscribers), and any other
          person who accesses or uses the service.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 2. What the Service Is */}
      <section id="what-is" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">What the service is</h2>
        </div>
        <p>
          The Free AI Tools is a free, browser-based utility directory. Most tools process your
          data entirely in your browser using JavaScript — no server receives your files, text,
          or passwords. A subset of tools (AI writing tools, Chat with PDF, AI image generation)
          require calls to third-party APIs to function. Those interactions are governed by both
          these terms and the terms of the relevant third-party service.
        </p>
        <p>
          The service is free to use and is supported by non-intrusive display advertising from
          Google AdSense and other ad partners such as Adsterra. No premium tier, subscription,
          or payment is required to access any tool.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 3. Permitted Use */}
      <section id="permitted" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Permitted use</h2>
        </div>
        <div className="not-prose space-y-3">
          {[
            {
              title: "Personal, educational, and commercial productivity",
              body: "You may use the tools for lawful personal, educational, creative, or commercial productivity purposes.",
            },
            {
              title: "Linking and sharing",
              body: "You may link to, embed, or share tool pages for non-commercial purposes, provided you make clear the tools are hosted on thefreeaitools.com.",
            },
            {
              title: "Using tool outputs",
              body: "You may use outputs from the tools (formatted code, generated passwords, converted files, etc.) in your own projects. Tool outputs are not copyrighted by us.",
            },
            {
              title: "Automated access",
              body: "You may access the service using automated scripts or bots for personal, non-abusive purposes, provided you do not overload the hosting infrastructure.",
            },
          ].map(({ title, body }) => (
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

      {/* 4. Prohibited Use */}
      <section id="prohibited" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Prohibited use</h2>
        </div>
        <div className="not-prose space-y-3">
          {[
            {
              title: "Fraud and illegal activity",
              body: "You may not use the service for fraud, phishing, credential theft, spam, malware distribution, or any other illegal activity.",
            },
            {
              title: "Deception with AI outputs",
              body: "You may not use AI-generated outputs to deceive, impersonate, or harm other people or organizations.",
            },
            {
              title: "Reverse engineering or scraping",
              body: "You may not attempt to reverse-engineer, scrape at scale, or interfere with the availability of the site for other users.",
            },
            {
              title: "Fraudulent instruments",
              body: "You may not use generated card data, identity-style data, or test credentials as real-world financial or identity instruments.",
            },
            {
              title: "Unauthorized security testing",
              body: "You may not use network or security tools against systems you do not own or have explicit written permission to test.",
            },
          ].map(({ title, body }) => (
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
        <p className="mt-4">
          Violations may result in your IP or network being blocked from the service and, in
          serious cases, may be reported to relevant authorities.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 5. Tool Outputs */}
      <section id="outputs" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Tool outputs and your responsibility</h2>
        </div>
        <p>
          Tool outputs are provided for convenience and as a starting point for your own work.
          We do not guarantee that every result is correct, complete, up to date, or appropriate
          for high-stakes decisions. You are responsible for reviewing and validating results
          before using them in production systems, legal documents, financial calculations,
          medical contexts, or any other professional setting.
        </p>
        <p>
          AI-generated text, code, or images may contain errors, biases, or hallucinations.
          Always review AI outputs before publishing or distributing them.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 6. Intellectual Property */}
      <section id="ip" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Copyright className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Intellectual property</h2>
        </div>
        <p>
          The design, code, and non-tool content of thefreeaitools.com are owned by The Free AI
          Tools and its creator. Open-source libraries used in the tools are credited on their
          respective tool pages and are subject to their own licenses. You may not copy or
          redistribute the site design or codebase without permission.
        </p>
        <p>
          You retain ownership of any content you input into the tools. We do not claim any
          rights over files, text, or data you process using the service.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 7. Availability */}
      <section id="availability" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Service availability and changes</h2>
        </div>
        <p>
          We aim to keep The Free AI Tools available and accurate at all times, but we do not
          guarantee uninterrupted access, error-free results, or permanent availability of any
          specific tool. Tools may be updated, renamed, replaced, or removed as the product
          evolves. Third-party AI models used in the AI tools may change without notice based
          on availability and cost.
        </p>
        <p>
          We may update these terms at any time. Material changes will be reflected in the
          &quot;Last updated&quot; date at the top of this page. Continued use of the service
          after a change means you accept the revised terms.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 8. Warranties */}
      <section id="warranties" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <ShieldOff className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Disclaimer of warranties</h2>
        </div>
        <div className="not-prose rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            The service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
            warranty of any kind, express or implied. We make no warranty that the service will
            meet your specific requirements, be uninterrupted, timely, secure, or free of errors.
            Use the service at your own discretion.
          </p>
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 9. Liability */}
      <section id="liability" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Scale className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Limitation of liability</h2>
        </div>
        <p>
          To the maximum extent permitted by applicable law, The Free AI Tools and its creator
          shall not be liable for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of or inability to use the service, even if advised of
          the possibility of such damage.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 10. Governing Law */}
      <section id="law" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Scale className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Governing law</h2>
        </div>
        <p>
          These terms are governed by and construed in accordance with applicable law. Any
          dispute arising from these terms will be resolved in good faith through direct
          communication before any formal proceedings.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 11. Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Questions</h2>
        </div>
        <p>
          If you have questions about these terms or need to report a violation, reach out via
          the appropriate channel below or use the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
        <ContactTable />
      </section>
    </ContentPage>
  )
}
