import Link from "next/link"
import { ContentPage } from "@/components/site/content-page"
import { ContactTable } from "@/components/site/contact-table"
import { buildPageMetadata } from "@/lib/page-metadata"
import { siteConfig } from "@/lib/site-config"
import {
  Zap,
  Database,
  EyeOff,
  Cpu,
  BarChart2,
  Cookie,
  UserCheck,
  RefreshCw,
  Mail,
} from "lucide-react"

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how The Free AI Tools handles privacy, client-side processing, cookies, analytics, AI APIs, and third-party requests.",
  path: "/privacy",
  keywords: ["privacy policy", "client-side processing", "The Free AI Tools privacy"],
})

const sections = [
  { id: "short", label: "The Short Version" },
  { id: "collect", label: "What We Collect" },
  { id: "not-collect", label: "What We Don't Collect" },
  { id: "ai-tools", label: "AI Tools & Server-Side Processing" },
  { id: "adsense", label: "Advertising" },
  { id: "cookies", label: "Cookies" },
  { id: "rights", label: "Your Rights" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact" },
]

export default function PrivacyPage() {
  return (
    <ContentPage
      badge="Privacy"
      title="Privacy Policy"
      summary="The Free AI Tools is built around browser-side processing and minimal data handling. This page explains exactly what is processed locally in your browser, what limited data leaves your device, which third-party services we use, and how to exercise your privacy rights."
      lastUpdated={siteConfig.legalLastUpdated}
    >
      {/* Table of Contents */}
      <nav
        aria-label="Privacy policy sections"
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

      {/* 1. Short version */}
      <section id="short" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">The short version</h2>
        </div>
        <div className="not-prose rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            The vast majority of tools on this site — image compression, JSON formatting,
            password generation, hash generation, color picking, CSS tools, text processing,
            file conversion, and hundreds more — run entirely in your browser. Your files,
            passwords, and text inputs are processed locally and are{" "}
            <strong className="text-black dark:text-white">never transmitted to any server we operate</strong>.
          </p>
        </div>
        <p className="mt-4">
          A small number of tools require an internet connection because they call external
          services — for example, the Chat with PDF tool uses an AI language model to answer
          questions about your document, and the DNS Lookup tool queries public DNS resolvers.
          These exceptions are listed clearly below.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 2. What We Collect */}
      <section id="collect" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">What we collect</h2>
        </div>
        <div className="not-prose space-y-3">
          {[
            {
              title: "Analytics (Google Analytics 4)",
              body: "We collect anonymous page-view data, session counts, and general device/browser information. This data is aggregated and not linked to any personally identifiable information. You can opt out via the Google Analytics Opt-out Browser Add-on.",
              link: { href: "https://tools.google.com/dlpage/gaoptout", label: "GA Opt-out Add-on" },
            },
            {
              title: "Preference data",
              body: "Your theme choice (light or dark mode) is stored in your browser's local storage. This data never leaves your device.",
            },
            {
              title: "Newsletter (optional)",
              body: "If you subscribe to the newsletter, your email address is stored to send you periodic tool tips. You can unsubscribe at any time via the link in any email.",
            },
            {
              title: "Hosting and server logs",
              body: "Our hosting provider (Vercel) may collect standard request logs — IP addresses, request paths, timestamps — for security and uptime monitoring, per Vercel's standard data retention policy.",
            },
          ].map(({ title, body, link }) => (
            <div
              key={title}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-sm font-semibold text-black dark:text-white">{title}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {body}{" "}
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-black underline underline-offset-2 dark:text-white"
                  >
                    {link.label}
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 3. What We Don't Collect */}
      <section id="not-collect" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <EyeOff className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">What we do not collect</h2>
        </div>
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          {[
            "Files, images, text, or passwords you process with client-side tools — that data stays in your browser tab.",
            "Account information — no sign-up is required for any tool on this site.",
            "Sold, rented, or shared user data with advertisers or data brokers.",
            "Individual visitor profiles or cross-site tracking beyond anonymous Google Analytics.",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black">
                ✗
              </span>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 4. AI Tools */}
      <section id="ai-tools" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">AI tools and server-side processing</h2>
        </div>
        <p>
          The following tools send data to third-party AI services to generate a response. When
          you use these tools, the content you submit is transmitted to the named service:
        </p>
        <div className="not-prose mt-4 space-y-3">
          {[
            {
              title: "Chat with PDF",
              body: "The text extracted from your PDF and your chat questions are sent to OpenRouter (openrouter.ai), which routes the request to a language model. Your PDF content is not stored by us beyond the current session. OpenRouter's privacy policy applies.",
            },
            {
              title: "AI writing tools (Text Humanizer, Paraphraser, Code Converter, Story Generator, etc.)",
              body: "These tools call OpenRouter to access language models. The text you submit is processed by the model and not retained on our servers.",
            },
            {
              title: "AI Image Generator",
              body: "Image generation requests are sent to an external image generation API. The prompt you enter is transmitted to that service. Generated images are returned to your browser and not stored by us.",
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-sm font-semibold text-black dark:text-white">{title}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{body}</p>
            </div>
          ))}
        </div>
        <div className="not-prose mt-4 rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            If you are processing sensitive information — confidential documents, private
            communications, proprietary code — we recommend using the client-side tools only
            and avoiding the AI-powered tools listed above.
          </p>
        </div>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 5. AdSense */}
      <section id="adsense" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Advertising — display ad networks</h2>
        </div>
        <p>
          This website uses <strong>Google AdSense</strong> and other display ad network
          partners, including Adsterra placements such as popunders, banners, and native
          widgets. These services use cookies and similar identifiers to serve and measure ads
          based on your visits to this website and other websites on the internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Google Ad Settings
          </a>
          {" "}or opt out of third-party vendor cookies at{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            aboutads.info
          </a>
          . For more information on how Google uses data from partner sites, see{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>
        <p>
          Ads are displayed only in clearly marked sections and are never injected into tool
          interfaces. All tool functionality works identically whether ads are visible or blocked.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 6. Cookies */}
      <section id="cookies" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Cookie className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Cookies</h2>
        </div>
        <p>This site uses the following types of cookies:</p>
        <div className="not-prose mt-4 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Can Disable?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {[
                {
                  type: "Essential",
                  purpose: "Theme preference, session state. Required for the site to function correctly.",
                  disable: "No",
                },
                {
                  type: "Analytics",
                  purpose: "Set by Google Analytics to measure anonymous site usage. No PII collected.",
                  disable: "Yes",
                },
                {
                  type: "Advertising",
                  purpose: "Set by Google AdSense, DoubleClick, and other ad partners for personalized ads and measurement.",
                  disable: "Yes",
                },
              ].map(({ type, purpose, disable }) => (
                <tr
                  key={type}
                  className="bg-white transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                >
                  <td className="px-4 py-3 font-medium text-black dark:text-white">{type}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{purpose}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{disable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Disabling advertising or analytics cookies does not affect your ability to use any
          tool — all tools remain fully functional.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 7. Your Rights */}
      <section id="rights" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <UserCheck className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Your rights</h2>
        </div>
        <p>
          Depending on your location, you may have rights under GDPR, CCPA, or similar privacy
          laws — including the right to access, correct, or delete data we hold about you.
          Because we collect very little personally identifiable information, most requests can
          be addressed by clearing your browser&apos;s cookies and local storage.
        </p>
        <p>To opt out of specific third-party services:</p>
        <div className="not-prose mt-4 space-y-2">
          {[
            {
              label: "Google personalized ads",
              href: "https://www.google.com/settings/ads",
              display: "google.com/settings/ads",
            },
            {
              label: "Third-party ad networks",
              href: "https://www.aboutads.info/choices/",
              display: "aboutads.info/choices",
            },
            {
              label: "Google Analytics",
              href: "https://tools.google.com/dlpage/gaoptout",
              display: "GA Opt-out Add-on",
            },
          ].map(({ label, href, display }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-black underline underline-offset-2 dark:text-white"
              >
                {display}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-4">
          For any privacy question, data request, or to report a concern, contact us via the{" "}
          <Link href="/contact">contact page</Link>. We aim to respond within 5 business days.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 8. Changes */}
      <section id="changes" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Changes to this policy</h2>
        </div>
        <p>
          We may update this policy as we add new tools or integrate new third-party services.
          Material changes will be reflected in the &quot;Last updated&quot; date at the top
          of this page. Continued use of the site after a policy update constitutes acceptance
          of the updated policy.
        </p>
      </section>

      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />

      {/* 9. Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <h2 className="!my-0">Contact</h2>
        </div>
        <p>For privacy questions or data requests, reach us through the appropriate channel:</p>
        <ContactTable />
      </section>
    </ContentPage>
  )
}
