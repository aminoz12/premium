interface QuickAnswerProps {
  question: string
  answer: string
}

export function QuickAnswer({ question, answer }: QuickAnswerProps) {
  return (
    <div
      id="quick-answer"
      className="mb-6 rounded-md border-l-4 border-primary bg-primary/5 px-4 py-3"
      role="note"
      aria-label="Quick Answer"
    >
      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Quick Answer</p>
      <p className="text-sm font-medium">{question}</p>
      <p className="text-sm text-muted-foreground mt-1">{answer}</p>
    </div>
  )
}
