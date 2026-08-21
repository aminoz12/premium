"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "email_capture_dismissed"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY)
      setDismissed(val === "1")
    } catch {
      setDismissed(false)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes("@")) return
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "email-capture" }),
      })
      const data = (await res.json()) as { ok: boolean; message?: string }

      if (data.ok) {
        setSubmitted(true)
        try { localStorage.setItem(STORAGE_KEY, "1") } catch { /* ignore */ }
      } else {
        setError(data.message || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleDismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // ignore
    }
  }

  if (dismissed) return null

  return (
    <div className="mt-6 rounded-md border bg-gradient-to-r from-primary/5 to-primary/10 p-4 relative">
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-lg leading-none"
      >
        ×
      </button>

      {submitted ? (
        <div className="py-2">
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">You're in!</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            We'll let you know when higher limits and new tools launch.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold pr-6">Get early access to higher limits</p>
          <p className="text-xs text-muted-foreground mb-3">
            Enter your email — free forever, no credit card.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              className="flex-1 rounded-md border px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? "..." : "Notify me"}
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </>
      )}
    </div>
  )
}
