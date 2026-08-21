"use client"

import * as React from "react"
import { toast } from "sonner"

function legacyCopy(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "true")
  textarea.style.position = "absolute"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  const successful = document.execCommand("copy")
  document.body.removeChild(textarea)
  return successful
}

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copy = React.useCallback(
    async (text: string) => {
      if (!text) {
        toast.error("Nothing to copy yet.")
        return false
      }

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
        } else if (!legacyCopy(text)) {
          throw new Error("Legacy clipboard copy failed")
        }

        setCopied(true)
        toast.success("Copied to clipboard.")

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => setCopied(false), timeout)
        return true
      } catch {
        toast.error("Clipboard access was blocked. Try copying manually.")
        return false
      }
    },
    [timeout]
  )

  return { copy, copied }
}
