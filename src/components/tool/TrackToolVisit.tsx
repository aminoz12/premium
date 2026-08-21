"use client"
import { useEffect } from "react"
import { useRecentTools } from "@/hooks/useRecentTools"

export function TrackToolVisit({ toolId }: { toolId: string }) {
  const { addTool } = useRecentTools()

  useEffect(() => {
    addTool(toolId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId])

  return null
}
