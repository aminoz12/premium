type FaqItem = {
  question: string
  answer: string
}

type FAQSectionProps = {
  faqs: FaqItem[]
  title?: string
  description?: string
}

export default function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  description = "Everything you need to know about using the free tools.",
}: FAQSectionProps) {
  return (
    <section
      className="mt-12 rounded-3xl border bg-card/60 p-6 md:p-8"
      aria-labelledby="faq-heading"
    >
      <div className="mb-8">
        <h2
          id="faq-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      </div>

      {/* ✅ Two column layout on larger screens */}
      <div className="grid gap-4 lg:grid-cols-2">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-2xl border bg-background p-5 open:border-primary/30"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-foreground">
              <span>{faq.question}</span>
              {/* ✅ Visual indicator */}
              <span
                className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}