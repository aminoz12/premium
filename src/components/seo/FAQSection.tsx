import type { ToolFaqItem } from "@/lib/seo/tool-content"

export function FAQSection({
  faqs,
  title,
}: {
  faqs: ToolFaqItem[]
  title?: string
}) {
  if (faqs.length === 0) {
    return null
  }

  return (
    <section className="mt-10 space-y-4" aria-labelledby="tool-faqs-heading">
      <div>
        <h2 id="tool-faqs-heading" className="text-2xl font-semibold tracking-tight">
          {title ?? "Frequently asked questions"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Quick answers about the workflow, privacy, and where this tool fits in a broader job.
        </p>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-2xl border bg-card/60 p-5">
            <summary className="cursor-pointer list-none text-base font-semibold">
              {faq.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
