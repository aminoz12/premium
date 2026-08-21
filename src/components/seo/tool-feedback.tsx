"use client"
import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"

export function ToolFeedback({ toolName }: { toolName: string }) {
  const [voted, setVoted] = useState<"up" | "down" | null>(null)

  function handleVote(type: "up" | "down") {
    if (voted) return
    setVoted(type)
    // GA4 event
    if (typeof window !== "undefined" && "gtag" in window) {
      ;(window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "tool_feedback", {
        event_category: "engagement",
        event_label: toolName,
        value: type === "up" ? 1 : 0,
      })
    }
  }

  if (voted) {
    return (
      <p className="text-sm text-muted-foreground mt-4 text-center">
        {voted === "up" ? "Thanks! Glad it helped." : "Thanks for the feedback — we'll keep improving."}
      </p>
    )
  }

  return (
    <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
      <span>Was this tool helpful?</span>
      <button
        onClick={() => handleVote("up")}
        aria-label="Yes, helpful"
        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:border-green-500 hover:text-green-600 transition-colors"
      >
        <ThumbsUp className="h-4 w-4" />
        Yes
      </button>
      <button
        onClick={() => handleVote("down")}
        aria-label="No, not helpful"
        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:border-red-400 hover:text-red-600 transition-colors"
      >
        <ThumbsDown className="h-4 w-4" />
        No
      </button>
    </div>
  )
}
