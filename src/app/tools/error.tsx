"use client"

import { ErrorFallback } from "@/components/site/error-fallback"

export default function ToolsError({
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
      title="This tool ran into an error"
      description="The tool shell is still available, and you can retry immediately or send a quick report with the details below."
    />
  )
}
