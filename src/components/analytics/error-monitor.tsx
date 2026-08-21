"use client"

import { useEffect } from "react"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-BH64CGM0QJ"

function stringifyErrorArg(arg: unknown) {
  if (arg instanceof Error) {
    return `${arg.name}: ${arg.message}`
  }

  if (typeof arg === "string") {
    return arg
  }

  try {
    return JSON.stringify(arg)
  } catch {
    return String(arg)
  }
}

function reportException(description: string, fatal = false) {
  if (typeof window === "undefined" || !GA_ID || !window.gtag) {
    return
  }

  window.gtag("event", "exception", {
    description,
    fatal,
  })
}

export function ErrorMonitor() {
  useEffect(() => {
    const originalConsoleError = console.error

    const handleWindowError = (event: ErrorEvent) => {
      reportException(`[window.error] ${event.message}`, true)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportException(`[unhandledrejection] ${stringifyErrorArg(event.reason)}`, true)
    }

    console.error = (...args: unknown[]) => {
      originalConsoleError(...args)
      reportException(`[console.error] ${args.map(stringifyErrorArg).join(" | ")}`)
    }

    window.addEventListener("error", handleWindowError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      console.error = originalConsoleError
      window.removeEventListener("error", handleWindowError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}
