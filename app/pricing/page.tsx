import { ArrowRightIcon } from "../_components/Icons";
import Link from "next/link";
import PageShell from "../_components/PageShell";
import CommercialPlanCards from "../_components/CommercialPlanCards";
import { BreadcrumbSchema, FAQSchema } from "../schema";
import { pageMetadata } from "@/lib/seo";
const path = "/pricing";
export const metadata = pageMetadata({
  title: "IPTV Subscription Pricing & Plans | WATCHWORLDCUP",
  description:
    "WATCHWORLDCUP IPTV plans: $25 for 3 months, $38 for 6 months, $62 for 1 year. Confirm device compatibility and availability on WhatsApp before payment.",
  path,
});
const faqs = [
  {
    question: "What are the WATCHWORLDCUP IPTV prices?",
    answer:
      "The listed prices are $25 for 3 months, $38 for 6 months, and $62 for 1 year.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Choose a plan and use the WhatsApp button. Confirm current availability, device/app compatibility, delivery, payment and applicable terms before paying.",
  },
  {
    question: "Are channel or VOD totals guaranteed?",
    answer:
      "No catalog counts are published without a connected, dated inventory source. Ask for current availability relevant to your needs.",
  },
  {
    question: "Which payment methods are accepted?",
    answer:
      "No payment-provider claim is published on this page. Confirm the available payment method and order terms directly before sending payment.",
  },
];
export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Pricing", path },
        ]}
      />
      <FAQSchema faqs={faqs} path={path} />
      <PageShell
        eyebrow="Listed plan durations and prices"
        title="Choose your IPTV subscription."
        description="Select a 3-month, 6-month or 1-year WATCHWORLDCUP IPTV / M3U plan. Before payment, confirm the current content scope, intended device and app, credential format, delivery process and applicable terms."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      >
        <CommercialPlanCards />
        <section className="mt-14 grid gap-5 lg:grid-cols-3">
          <article className="premium-card glass rounded-2xl p-7">
            <p className="eyebrow">Included in the ordering flow</p>
            <h2 className="mt-3 text-2xl font-black">
              Subscription and setup details
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The selected subscription duration, IPTV/M3U access details,
              compatibility questions and setup guidance are handled through the
              ordering conversation.
            </p>
          </article>
          <article className="premium-card glass rounded-2xl p-7">
            <p className="eyebrow">Confirm before payment</p>
            <h2 className="mt-3 text-2xl font-black">Current availability</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Ask about the exact content types, country, languages, device,
              IPTV application, quality and account or connection limits
              relevant to your order.
            </p>
          </article>
          <article className="premium-card glass rounded-2xl p-7">
            <p className="eyebrow">Not claimed here</p>
            <h2 className="mt-3 text-2xl font-black">
              No invented totals or guarantees
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              This page does not publish unsupported channel counts, movie
              counts, uptime, ratings, payment logos, official-rights claims or
              universal device compatibility.
            </p>
          </article>
        </section>
        <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow">Ordering steps</p>
            <h2 className="mt-3 text-3xl font-black">
              Complete the compatibility check first
            </h2>
            <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              {[
                "Choose the subscription duration.",
                "Tell support your country, content priorities, language, exact device and intended IPTV app.",
                "Request the current availability, credential format, delivery process and written terms.",
                "Confirm the payment method and refund/cancellation terms.",
                "After delivery, follow the setup guide and keep subscription credentials private.",
              ].map((step, index) => (
                <li key={step} className="glass flex gap-4 rounded-xl p-5">
                  <span className="font-black text-red-400">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <aside className="glass h-fit rounded-2xl p-7">
            <p className="eyebrow">Need setup context?</p>
            <h2 className="mt-3 text-2xl font-black">
              Review the M3U setup workflow
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Understand what information to prepare and which device/app
              details to confirm before ordering.
            </p>
            <div className="mt-5 grid gap-3 font-black">
              <Link href="/order" className="text-red-400">
                Prepare a guided order
                <ArrowRightIcon className="ml-2 inline h-4 w-4" />
              </Link>
              <Link href="/setup-guides" className="text-red-400">
                Open setup guides
                <ArrowRightIcon className="ml-2 inline h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
        <section className="mt-16 max-w-4xl">
          <h2 className="text-3xl font-black">Pricing questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="glass rounded-2xl p-6">
                <summary className="cursor-pointer font-bold">
                  {f.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </PageShell>
    </>
  );
}
