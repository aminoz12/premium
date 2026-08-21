"use client"

import { useEffect } from "react"

const editableSelector =
  "input, textarea, select, [contenteditable=''], [contenteditable='true'], [data-allow-copy='true']"

function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest(editableSelector))
}

function isBlockedShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase()
  const hasPrimaryModifier = event.ctrlKey || event.metaKey

  if (key === "f12") {
    return true
  }

  if (!hasPrimaryModifier) {
    return false
  }

  if (key === "u") {
    return true
  }

  if (["s", "p"].includes(key)) {
    return true
  }

  if (event.shiftKey && ["c", "i", "j"].includes(key)) {
    return true
  }

  return false
}

export default function SourceProtection() {
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      event.preventDefault()
    }

    const handleClipboard = (event: ClipboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      event.preventDefault()
    }

    const handleDragStart = (event: DragEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      event.preventDefault()
    }

    const handleSelectStart = (event: Event) => {
      if (isEditableTarget(event.target)) {
        return
      }

      event.preventDefault()
    }

    const handleBeforePrint = () => {
      // Print-to-PDF can be used to extract full content quickly.
      window.stop()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      if (isBlockedShortcut(event)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener("contextmenu", handleContextMenu, true)
    document.addEventListener("copy", handleClipboard, true)
    document.addEventListener("cut", handleClipboard, true)
    document.addEventListener("dragstart", handleDragStart, true)
    document.addEventListener("selectstart", handleSelectStart, true)
    document.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("beforeprint", handleBeforePrint)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true)
      document.removeEventListener("copy", handleClipboard, true)
      document.removeEventListener("cut", handleClipboard, true)
      document.removeEventListener("dragstart", handleDragStart, true)
      document.removeEventListener("selectstart", handleSelectStart, true)
      document.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("beforeprint", handleBeforePrint)
    }
  }, [])

  return null
}
