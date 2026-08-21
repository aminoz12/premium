"use client"

import { useState, useRef } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

const FORMSPREE_ID = "mzdqynry"

type Status = "idle" | "sending" | "success" | "error"

const inputBase =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black placeholder-neutral-400 transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-white dark:focus:ring-white"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
      if (res.ok) {
        setStatus("success")
        formRef.current?.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <CheckCircle className="h-10 w-10 text-black dark:text-white" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">Message sent</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Thanks for reaching out. We&apos;ll reply to your email within 2 business days.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800 md:p-8"
      noValidate
    >
      {/* Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Your name <span className="text-neutral-400" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            className={inputBase}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Your email <span className="text-neutral-400" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputBase}
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-black dark:text-white"
        >
          Topic <span className="text-neutral-400" aria-hidden="true">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          className={inputBase}
          defaultValue=""
        >
          <option value="" disabled>
            Select a topic…
          </option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="tool-suggestion">New Tool Suggestion</option>
          <option value="business">Business Inquiry</option>
          <option value="other">General Question</option>
        </select>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-black dark:text-white"
        >
          Message <span className="text-neutral-400" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={6}
          className={`${inputBase} resize-y`}
          placeholder="Describe your question, bug, or request. For bug reports: include the tool URL, your browser, and steps to reproduce."
        />
        <p className="text-xs text-neutral-400">Minimum 20 characters.</p>
      </div>

      {/* Error banner */}
      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
            aria-hidden="true"
          />
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Something went wrong. Please try again or email us directly at{" "}
            <a
              href="mailto:support@thefreeaitools.com"
              className="font-medium text-black underline underline-offset-2 dark:text-white"
            >
              support@thefreeaitools.com
            </a>
            .
          </p>
        </div>
      )}

      {/* Footer row */}
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Or email directly:{" "}
          <a
            href="mailto:hello@thefreeaitools.com"
            className="font-medium text-black underline-offset-2 hover:underline dark:text-white"
          >
            hello@thefreeaitools.com
          </a>
        </p>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  )
}