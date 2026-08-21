"use client"

import { ErrorFallback } from "@/components/site/error-fallback"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="The page hit an unexpected error"
      description="We kept the rest of The Free AI Tools intact, but this screen needs a refresh or a quick bug report so we can tighten it up."
    />
  )
}
