"use client"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { useRecentTools } from "@/hooks/useRecentTools"
import { tools } from "@/lib/tools/tools-config"

export function RecentTools() {
  const { recents } = useRecentTools()

  if (recents.length === 0) return null

  const recentToolObjects = recents
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean) as typeof tools

  if (recentToolObjects.length === 0) return null

  return (
    <section
      className="border-t border-gray-100 py-8"
      aria-labelledby="recent-tools-heading"
    >
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
        <h2
          id="recent-tools-heading"
          className="text-sm font-bold uppercase tracking-wider text-gray-400"
        >
          Recently used
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentToolObjects.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className=" dark:bg-black/20 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-400 hover:text-black  dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={`Reopen ${tool.name}`}
            title={tool.name}
          >
            <tool.icon className="h-3.5 w-3.5 shrink-0 text-black  dark:text-white" aria-hidden="true" />
            {tool.name}
          </Link>
        ))}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-400 transition-colors hover:border-blue-400 hover:text-black  dark:text-white"
          aria-label="Browse all free tools"
        >
          All tools
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
