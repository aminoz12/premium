"use client"

import { FormEvent, useMemo, useState } from "react"
import { CheckCircle2, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type NewsletterSignupProps = {
  source: string
  title?: string
  description?: string
  compact?: boolean
  className?: string
}

type SubmitState = "idle" | "loading" | "success" | "error"

export function NewsletterSignup({
  source,
  title = "Get 1 free tool tip per week",
  description = "No spam. Unsubscribe anytime. Practical tips, SEO workflows, and useful tool updates.",
  compact = false,
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<SubmitState>("idle")
  const [message, setMessage] = useState("")
  const isLoading = state === "loading"

  const emailIsValid = useMemo(() => {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }, [email])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!emailIsValid || isLoading) return

    setState("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || "Unable to subscribe right now.")
      }

      setState("success")
      setMessage(payload.message || "Thanks. You're on the list.")
      setEmail("")
    } catch (error) {
      setState("error")
      setMessage(error instanceof Error ? error.message : "Unable to subscribe right now.")
    }
  }

  return (
    <section
      className={cn(
        "rounded-2xl border bg-card/70 p-5 md:p-6",
        compact ? "space-y-3" : "space-y-4",
        className
      )}
      aria-label="Newsletter signup"
    >
      <div className="space-y-1">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <Mail className="h-4 w-4" />
          Newsletter
        </p>
        <h2 className={cn("font-semibold tracking-tight", compact ? "text-lg" : "text-xl")}>
          {title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-label="Email address"
            required
          />
          <Button type="submit" disabled={!emailIsValid || isLoading} className="sm:min-w-[140px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        {state === "success" ? (
          <p className="inline-flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </p>
        ) : null}

        {state === "error" ? <p className="text-sm text-destructive">{message}</p> : null}
      </form>
    </section>
  )
}
