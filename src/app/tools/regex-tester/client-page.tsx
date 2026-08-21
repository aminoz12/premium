"use client"

import React, { useState, useMemo, useId, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ToolLayout } from "@/components/layout/tool-layout"
import {
  Copy, AlertCircle, CheckCircle2, Zap, Shield,
  HelpCircle, Code2, Terminal,
  Check, Info, Link2, AlertTriangle, BookOpen,
  ChevronDown,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ── Pattern library ────────────────────────────────────────────────────────────
const PATTERN_LIBRARY = [
  { label: "Email address", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "gi" },
  { label: "URL (http/https)", pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*", flags: "gi" },
  { label: "IPv4 address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "IPv6 address", pattern: "([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}", flags: "gi" },
  { label: "Phone (US)", pattern: "\\b(?:\\+1[\\s.]?)?\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}\\b", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b", flags: "g" },
  { label: "Time (HH:MM)", pattern: "\\b(?:[01]\\d|2[0-3]):[0-5]\\d\\b", flags: "g" },
  { label: "Hex color (#RRGGBB)", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", flags: "gi" },
  { label: "Credit card", pattern: "\\b(?:\\d{4}[\\s\\-]?){3}\\d{4}\\b", flags: "g" },
  { label: "ZIP code (US)", pattern: "\\b\\d{5}(?:-\\d{4})?\\b", flags: "g" },
  { label: "Postal code (UK)", pattern: "\\b[A-Z]{1,2}\\d[A-Z\\d]?\\s?\\d[A-Z]{2}\\b", flags: "gi" },
  { label: "HTML tag", pattern: "<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>.*?<\\/\\1>", flags: "gis" },
  { label: "JWT token", pattern: "eyJ[A-Za-z0-9_-]+\\.eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+", flags: "g" },
  { label: "UUID", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}", flags: "gi" },
  { label: "Semantic version", pattern: "\\bv?\\d+\\.\\d+\\.\\d+(?:-[\\w.]+)?(?:\\+[\\w.]+)?\\b", flags: "g" },
  { label: "Git commit hash", pattern: "\\b[0-9a-f]{7,40}\\b", flags: "g" },
  { label: "Markdown heading", pattern: "^#{1,6}\\s.+", flags: "gm" },
  { label: "Markdown link", pattern: "\\[([^\\]]+)\\]\\(([^)]+)\\)", flags: "g" },
  { label: "Words (letters only)", "pattern": "[a-zA-Z]+", flags: "g" },
  { label: "Numbers", pattern: "\\d+(?:\\.\\d+)?", flags: "g" },
]

// ── Backtracking detector ──────────────────────────────────────────────────────
function detectCatastrophicBacktracking(pattern: string): string | null {
  // Patterns like (a+)+ or (a*)*
  if (/\([^)]*[+*][^)]*\)[+*]/.test(pattern)) {
    return "Possible catastrophic backtracking: a quantified group is itself quantified (e.g., (a+)+). On a non-matching long string this can hang the browser."
  }
  // Patterns like (a|a)+ — alternation of identical options
  if (/\(([^|)]+)\|\1\)[+*]/.test(pattern)) {
    return "Possible catastrophic backtracking: alternation contains duplicate branches (e.g., (a|a)+)."
  }
  return null
}

// ── HTML escape ────────────────────────────────────────────────────────────────
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// ── URL codec ─────────────────────────────────────────────────────────────────
function encodeState(pattern: string, text: string, flagStr: string) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify({ p: pattern, t: text, f: flagStr }))))
  } catch {
    return ""
  }
}
function decodeState(raw: string) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw)))) as { p: string; t: string; f: string }
  } catch {
    return null
  }
}

export default function RegexTesterPage({ embedMode = false }: { embedMode?: boolean }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initial = useMemo(() => {
    const raw = searchParams.get("s")
    if (raw) return decodeState(raw)
    return null
  }, [searchParams])

  const [pattern, setPattern] = useState(initial?.p ?? "")
  const [text, setText] = useState(initial?.t ?? "")
  const [flags, setFlags] = useState({
    g: initial?.f?.includes("g") ?? true,
    i: initial?.f?.includes("i") ?? false,
    m: initial?.f?.includes("m") ?? false,
    s: initial?.f?.includes("s") ?? false,
  })
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  const id = useId()

  const flagString = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("")

  // ── Results ──────────────────────────────────────────────────────────────────
  const result = useMemo(() => {
    if (!pattern || !text) {
      return { error: "", matches: [] as Array<{ full: string; groups: string[] }>, highlighted: "" }
    }
    try {
      if (/^[\^$]*$/.test(pattern)) {
        return { error: "", matches: [], highlighted: escapeHtml(text) }
      }
      const regex = new RegExp(pattern, flagString)
      const matches: Array<{ full: string; groups: string[] }> = []
      let highlightedHTML = ""
      let lastIndex = 0

      if (flags.g) {
        const all = Array.from(text.matchAll(new RegExp(pattern, flagString)))
        if (all.length > 5000) throw new Error("Too many matches — refine your pattern.")
        for (const m of all) {
          if (m[0].length === 0 && m.index === lastIndex) continue
          matches.push({ full: m[0], groups: m.slice(1).map((g) => g ?? "(undefined)") })
          highlightedHTML += escapeHtml(text.slice(lastIndex, m.index))
          highlightedHTML += `<mark class="bg-primary/20 text-primary border border-primary/30 rounded px-1 font-semibold shadow-sm">${escapeHtml(m[0])}</mark>`
          lastIndex = (m.index ?? 0) + m[0].length
        }
        highlightedHTML += escapeHtml(text.slice(lastIndex))
      } else {
        const m = text.match(regex)
        if (m && m.index !== undefined) {
          matches.push({ full: m[0], groups: m.slice(1).map((g) => g ?? "(undefined)") })
          highlightedHTML += escapeHtml(text.slice(0, m.index))
          highlightedHTML += `<mark class="bg-primary/20 text-primary border border-primary/30 rounded px-1 font-semibold shadow-sm">${escapeHtml(m[0])}</mark>`
          highlightedHTML += escapeHtml(text.slice(m.index + m[0].length))
        } else {
          highlightedHTML = escapeHtml(text)
        }
      }
      return { error: "", matches, highlighted: highlightedHTML }
    } catch (err) {
      return { error: (err as Error).message, matches: [], highlighted: escapeHtml(text) }
    }
  }, [pattern, text, flags, flagString])

  const backtrackingWarning = useMemo(
    () => (pattern ? detectCatastrophicBacktracking(pattern) : null),
    [pattern]
  )

  // ── Copy helpers ──────────────────────────────────────────────────────────────
  const copyMatch = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch { }
  }

  const copyPermalink = useCallback(async () => {
    const encoded = encodeState(pattern, text, flagString)
    if (!encoded) return
    const url = `${window.location.origin}/tools/regex-tester?s=${encoded}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    } catch { }
  }, [pattern, text, flagString])

  // ── Pattern library ──────────────────────────────────────────────────────────
  function applyPattern(entry: typeof PATTERN_LIBRARY[0]) {
    setPattern(entry.pattern)
    const f = entry.flags
    setFlags({ g: f.includes("g"), i: f.includes("i"), m: f.includes("m"), s: f.includes("s") })
    setShowLibrary(false)
  }

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))
  }

  const content = (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">

      {/* Pattern library dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLibrary((v) => !v)}
          aria-expanded={showLibrary}
          aria-controls="pattern-library"
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Pattern library ({PATTERN_LIBRARY.length} patterns)
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showLibrary ? "rotate-180" : ""}`} aria-hidden="true" />
        </Button>

        {showLibrary && (
          <div
            id="pattern-library"
            role="listbox"
            aria-label="Common regex pattern library"
            className="absolute left-0 top-10 z-20 w-full max-w-xl rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
          >
            <p className="mb-2 px-1 text-xs text-gray-400">Click a pattern to load it</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PATTERN_LIBRARY.map((entry) => (
                <button
                  key={entry.label}
                  role="option"
                  aria-selected={pattern === entry.pattern}
                  onClick={() => applyPattern(entry)}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main two-column layout */}
      <section aria-label="Regex Testing Environment" className="grid gap-6 lg:grid-cols-2 items-start">

        {/* ── Input column ── */}
        <div className="space-y-5">

          {/* Pattern input */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-black  dark:text-white">Regular expression</h2>
            <div className="flex items-center overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <span className="border-r bg-gray-50 px-3 py-3 font-mono text-gray-400">/</span>
              <Input
                id={`${id}-pattern`}
                placeholder="e.g., [a-zA-Z0-9]+"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="rounded-none border-0 font-mono text-sm focus-visible:ring-0"
                aria-label="Regular expression pattern"
                spellCheck={false}
              />
              <span className="border-l bg-gray-50 px-3 py-3 font-mono text-gray-400">/</span>
              <span className="border-l bg-gray-50 px-2 py-3 font-mono text-xs text-black  dark:text-white">{flagString || " "}</span>
            </div>

            {/* Flags */}
            <div className="mt-4 flex flex-wrap gap-4">
              {(["g", "i", "m", "s"] as const).map((flag) => {
                const labels: Record<string, string> = {
                  g: "Global — find all matches",
                  i: "Ignore case",
                  m: "Multiline — ^ and $ match line boundaries",
                  s: "DotAll — dot matches newline",
                }
                return (
                  <label key={flag} className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600 hover:text-black  dark:text-white">
                    <Checkbox
                      checked={flags[flag]}
                      onCheckedChange={() => handleFlagChange(flag)}
                      aria-label={labels[flag]}
                    />
                    <code className="font-bold text-black  dark:text-white">{flag}</code>
                    <span className="text-gray-400"> ,  {labels[flag].split(" — ")[1] ?? labels[flag]}</span>
                  </label>
                )
              })}
            </div>

            {/* Backtracking warning */}
            {backtrackingWarning && (
              <Alert className="mt-4 border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                <AlertDescription className="text-xs text-amber-800">{backtrackingWarning}</AlertDescription>
              </Alert>
            )}

            {/* Syntax error */}
            {result.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription className="font-mono text-xs">{result.error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Test string */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <Label htmlFor={`${id}-text`} className="mb-3 block text-sm font-bold text-black  dark:text-white">
              Test string
            </Label>
            <Textarea
              id={`${id}-text`}
              placeholder="Paste the text you want to search through here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[220px] resize-y font-mono text-sm"
              aria-label="Text to test regex against"
              spellCheck={false}
            />
          </div>

          {/* Permalink */}
          <Button
            variant="outline"
            size="sm"
            onClick={copyPermalink}
            disabled={!pattern && !text}
            className="gap-2 w-full"
            aria-label="Copy shareable link to clipboard"
          >
            {copiedLink ? (
              <><Check className="h-4 w-4 text-green-600" aria-hidden="true" /> Link copied!</>
            ) : (
              <><Link2 className="h-4 w-4" aria-hidden="true" /> Copy shareable link</>
            )}
          </Button>
        </div>

        {/* ── Output column ── */}
        <div className="space-y-5 lg:sticky lg:top-6">

          {/* Highlighted preview */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-black  dark:text-white">Live match preview</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {result.matches.length} {result.matches.length === 1 ? "match" : "matches"}
              </span>
            </div>
            {!pattern || !text ? (
              <div className="flex min-h-[160px] items-center justify-center rounded-lg border-2 border-dashed border-gray-100 bg-gray-50">
                <p className="text-center text-xs text-gray-400">Enter a pattern and test string to see matches</p>
              </div>
            ) : (
              <div
                className="max-h-[280px] overflow-y-auto rounded-lg border bg-gray-50 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: result.highlighted || escapeHtml(text) }}
                aria-label="Highlighted regex matches"
              />
            )}
          </div>

          {/* Extracted matches with capture groups */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-black  dark:text-white">Extracted matches</h2>
            <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {result.matches.length > 0 ? (
                result.matches.map((match, index) => (
                  <div
                    key={index}
                    className="group rounded-lg border border-gray-100 bg-gray-50 p-3 hover:border-blue-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 rounded border bg-white px-1.5 py-0.5 text-[10px] font-bold text-black  dark:text-white shadow-sm">
                            #{index + 1}
                          </span>
                          <code className="truncate font-mono text-sm text-black  dark:text-white" title={match.full}>
                            {match.full || <span className="italic text-gray-400">&lt;empty string&gt;</span>}
                          </code>
                        </div>
                        {match.groups.length > 0 && (
                          <div className="mt-1.5 space-y-0.5 pl-8">
                            {match.groups.map((g, gi) => (
                              <div key={gi} className="text-[10px] text-gray-400">
                                <span className="font-semibold text-blue-500">Group {gi + 1}:</span>{" "}
                                <code className="font-mono">{g}</code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={() => copyMatch(match.full, index)}
                        aria-label={`Copy match ${index + 1}`}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 p-4 text-xs text-gray-400">
                  <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {pattern && text ? "No matches found for this pattern." : "Waiting for pattern and test string."}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Reference section */}
      <section className="mt-4 border-t border-gray-100 pt-8" aria-labelledby="ref-heading">
        <h2 id="ref-heading" className="mb-6 text-xl font-bold text-black  dark:text-white">Quick reference</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { token: ".", desc: "Any character except newline" },
            { token: "\\d", desc: "Digit [0-9]" },
            { token: "\\w", desc: "Word character [a-zA-Z0-9_]" },
            { token: "\\s", desc: "Whitespace (space, tab, newline)" },
            { token: "+", desc: "One or more of the preceding" },
            { token: "*", desc: "Zero or more of the preceding" },
            { token: "?", desc: "Zero or one of the preceding" },
            { token: "{n,m}", desc: "Between n and m repetitions" },
            { token: "^", desc: "Start of string (or line with m)" },
            { token: "$", desc: "End of string (or line with m)" },
            { token: "(abc)", desc: "Capture group" },
            { token: "(?:abc)", desc: "Non-capture group" },
            { token: "(?=abc)", desc: "Positive lookahead" },
            { token: "(?!abc)", desc: "Negative lookahead" },
            { token: "[abc]", desc: "Character class" },
            { token: "[^abc]", desc: "Negated character class" },
            { token: "a|b", desc: "Alternation: a or b" },
            { token: "\\b", desc: "Word boundary" },
          ].map(({ token, desc }) => (
            <div key={token} className="flex gap-3 rounded-lg border border-gray-100 bg-white p-3">
              <code
                className="shrink-0 rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 cursor-pointer hover:bg-blue-100"
                title="Click to load into pattern"
                onClick={() => setPattern(token)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setPattern(token)}
              >
                {token}
              </code>
              <span className="text-xs text-black  dark:text-white">{desc}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )

  if (embedMode) {
    return content
  }

  return (
    <ToolLayout toolId="regex-tester">
      {content}
    </ToolLayout>
  )
}
