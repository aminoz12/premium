"use client"

import { usePathname } from "next/navigation"

export default function SupportButton() {
  const pathname = usePathname()
  const isToolEmbedRoute = !!pathname && pathname.startsWith("/tools/") && pathname.endsWith("/embed")

  if (isToolEmbedRoute) {
    return null
  }

  return (
    <a
      href="https://buymeacoffee.com/thefreeaitools"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-xl shadow"
    >
      ☕ Support Us
    </a>
  )
}
