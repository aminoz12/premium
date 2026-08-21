import Link from "next/link"
import { ContentPage } from "@/components/site/content-page"
import { buildPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"
import { Mail, AlertCircle, Shield, Cpu, Link2, CheckCircle, User } from "lucide-react"

export const metadata = buildPageMetadata({
  title: "Disclaimer",
  description:
    "Read the general disclaimer for The Free AI Tools, covering educational-use limits, AI output accuracy, professional boundaries, and third-party services.",
  path: "/disclaimer",
  keywords: ["The Free AI Tools disclaimer", "educational use disclaimer", "tool output disclaimer"],
})

const sections = [
  { id: "general", label: "General Information" },
  { id: "no-professional-advice", label: "No Professional Advice" },
  { id: "ai-content", label: "AI-Generated Content" },
  { id: "security-tools", label: "Security & Technical Tools" },
  { id: "third-party", label: "Third-Party Links" },
  { id: "accuracy", label: "Accuracy of Outputs" },
  { id: "your-responsibility", label: "Your Responsibility" },
  { id: "contact", label: "Contact Us" },
]

export default function DisclaimerPage() {
  return (
    <ContentPage
      badge="Disclaimer"
      title="Disclaimer"
      summary="The Free AI Tools provides browser-based utilities for educational and productivity purposes. Tool outputs are a starting point, not a substitute for professional judgment. Please read this page carefully if you plan to use results in high-stakes contexts."
      lastUpdated={siteConfig.legalLastUpdated}
    >
      {/* Table of Contents */}
      <nav
        aria-label="Disclaimer sections"
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
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:group-hover:bg-white dark:group-hover:text-black">
                  {i + 1}
                </span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. General Information */}
      <section id="general" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">General information disclaimer</h2>
        </div>
        <p>
          Information and tool outputs on The Free AI Tools are provided in good faith for general
          educational and productivity purposes. While we maintain and test these tools regularly,
          we make no guarantee that every result is complete, accurate, current, or suitable for
          every situation. The web platform changes, browsers update, file formats evolve — a tool
          that produces a correct result today may behave differently on a different browser
          version, operating system, or input type.
        </p>
        <p>
          You should always validate tool outputs before using them in any production system,
          published document, or professional workflow. This is especially important for outputs
          that will be submitted to institutions, clients, or automated systems.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 2. No Professional Advice */}
      <section id="no-professional-advice" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">No professional advice</h2>
        </div>
        <p>
          Tool outputs on this site do not constitute legal, financial, medical, tax, engineering,
          or compliance advice. The following examples illustrate where this matters most:
        </p>
        <ul className="mt-4 space-y-4">
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">
              Calculators (BMI, loan, currency, unit conversion)
            </strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Results are approximations based on standard formulas. Do not make financial or
              medical decisions solely based on calculator outputs. Consult a qualified
              professional for personalized advice.
            </p>
          </li>
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">
              SEO tools (meta tags, structured data, robots.txt)
            </strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Outputs follow common best-practice standards but search engine behavior changes
              frequently. An SEO specialist or developer should review generated metadata before
              deploying to production.
            </p>
          </li>
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">
              Security tools (password generators, hash tools, JWT decoders)
            </strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              These tools are provided for educational and legitimate security work. Generated
              passwords are as strong as the browser&apos;s cryptographic random number generator.
              Always verify security implementations independently before deploying them to
              protect real user data.
            </p>
          </li>
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">
              Legal or compliance content
            </strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              No tool on this site generates legally-binding documents, contracts, or compliance
              certifications. If you need documents with legal weight, consult a qualified attorney.
            </p>
          </li>
        </ul>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 3. AI-Generated Content */}
      <section id="ai-content" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">AI-generated content disclaimer</h2>
        </div>
        <p>
          Several tools on this site use AI language models to generate text, code, summaries,
          or creative content. AI-generated outputs have well-known limitations:
        </p>
        <ul className="mt-4 space-y-4">
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">Hallucinations</strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              AI models can generate plausible-sounding but factually incorrect information.
              Never publish AI-generated content without fact-checking it against authoritative
              sources.
            </p>
          </li>
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">Bias</strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              AI models may reflect biases present in their training data. Review outputs for
              fairness and accuracy before using them publicly.
            </p>
          </li>
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">Code accuracy</strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              AI-generated code may contain bugs, security vulnerabilities, or deprecated
              patterns. Always review and test generated code in a safe environment before
              deploying it.
            </p>
          </li>
          <li className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <strong className="text-sm font-semibold text-black dark:text-white">
              No guarantee of uniqueness
            </strong>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              AI-generated text may not be unique. Run important content through plagiarism
              detection tools before submitting it for academic or professional purposes.
            </p>
          </li>
        </ul>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 4. Security Tools */}
      <section id="security-tools" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Security and technical tools</h2>
        </div>
        <p>
          Security, encoding, conversion, and diagnostic tools are intended for legitimate,
          authorized, and educational use only. Examples of appropriate use include: checking
          whether your own password hashes are secure, decoding your own JWT tokens for
          debugging, testing your own website&apos;s SSL certificate, and running DNS lookups
          to diagnose your own infrastructure.
        </p>
        <div className="mt-4 rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm font-medium text-black dark:text-white">
            These tools must not be used for unauthorized access, credential testing against
            systems you do not own, phishing, deception, or any other activity that violates
            applicable law or the rights of others. Misuse may be reported to relevant
            authorities.
          </p>
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 5. Third-Party Links */}
      <section id="third-party" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Link2 className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Third-party links and services</h2>
        </div>
        <p>
          The Free AI Tools references external documentation, open-source libraries, and
          third-party websites. We do not control those third parties and cannot guarantee their
          accuracy, availability, or continued operation. Links to external services are provided
          for convenience and do not constitute an endorsement.
        </p>
        <p>
          AI-powered tools on this site route requests through third-party services including
          OpenRouter (openrouter.ai). We are not responsible for the uptime, accuracy, or
          data-handling practices of these external services beyond what is described in our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 6. Accuracy */}
      <section id="accuracy" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Accuracy of tool outputs</h2>
        </div>
        <p>
          We test tools against common use cases and standard browser environments. However,
          edge cases exist in every tool category — unusual file types, extreme input sizes,
          rare character encodings, and non-standard network conditions. If a tool produces an
          unexpected result, we encourage you to report it via the{" "}
          <Link href="/contact">contact page</Link> so we can investigate and improve.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 7. Your Responsibility */}
      <section id="your-responsibility" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Your responsibility</h2>
        </div>
        <p>
          You are responsible for verifying that tool outputs are compatible, correct, and
          compliant with the requirements of your specific workflow, organization, or
          jurisdiction. The Free AI Tools provides a convenience layer — it does not replace
          professional review for high-stakes decisions.
        </p>
        <p>
          If you need clarification about any tool&apos;s behavior or limitations, contact us
          via the <Link href="/contact">contact page</Link>.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 8. Contact — single, clean block */}
      <section id="contact" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Contact us</h2>
        </div>
        <p>
          For questions about this disclaimer, to report a tool issue, or for any other inquiry,
          reach out to us:
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
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
              {[
                { purpose: "General enquiries", email: "hello@thefreeaitools.com" },
                { purpose: "Support & tool issues", email: "support@thefreeaitools.com" },
                { purpose: "Security disclosures", email: "security@thefreeaitools.com" },
                { purpose: "Other", email: "info@thefreeaitools.com" },
              ].map(({ purpose, email }) => (
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
    </ContentPage>
  )
}