"use client"

import { useEffect, useState } from "react"
import { grantAnalyticsConsent, denyAnalyticsConsent } from "@/components/analytics/google-analytics"

const CONSENT_KEY = "thefreeaitools-cookie-consent"

/**
 * GDPR-compliant cookie consent banner.
 *
 * Required for AdSense approval and EU compliance.
 * Saves preference to localStorage so it only shows once.
 * Minimal, non-intrusive design at the bottom of the page.
 */
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Only show if consent hasn't been given yet
    try {
      const consent = localStorage.getItem(CONSENT_KEY)
      if (!consent) {
        // Small delay so it doesn't flash on load
        const timer = setTimeout(() => setShowBanner(true), 1500)
        return () => clearTimeout(timer)
      }
    } catch {
      // localStorage not available — skip
    }
  }, [])

  function handleAccept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted")
    } catch {
      // Silently handle if localStorage is unavailable
    }
    grantAnalyticsConsent()
    setShowBanner(false)
  }

  function handleDecline() {
    try {
      localStorage.setItem(CONSENT_KEY, "declined")
    } catch {
      // Silently handle
    }
    denyAnalyticsConsent()
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 px-4 py-4 shadow-lg backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm leading-6 text-muted-foreground">
          <p>
            We use cookies and similar technologies to serve ads, analyze
            traffic, and improve your experience.{" "}
            <a
              href="/privacy"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
