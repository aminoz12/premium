"use client"
import { useEffect, useState } from "react"

const STORAGE_KEY = "recent_tools"
const MAX_RECENT = 5

export function useRecentTools() {
  const [recents, setRecents] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
      if (Array.isArray(stored)) setRecents(stored)
    } catch {}
  }, [])

  function addTool(slug: string) {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
      const updated = [slug, ...stored.filter((s) => s !== slug)].slice(0, MAX_RECENT)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setRecents(updated)
    } catch {}
  }

  return { recents, addTool }
}
