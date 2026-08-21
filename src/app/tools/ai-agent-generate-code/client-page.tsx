"use client"

import React, { useId, useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Check, AlertCircle, Loader2, Code, Sparkles,
  Download, Bot, Send, Settings2, ChevronDown,
} from "lucide-react"

const RATE_LIMIT_KEY = "agc_usage"
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW = 60 * 60 * 1000

function getRateLimit(): { count: number; windowStart: number } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return { count: 0, windowStart: Date.now() }
    return JSON.parse(raw)
  } catch {
    return { count: 0, windowStart: Date.now() }
  }
}

function incrementRateLimit() {
  const now = Date.now()
  const data = getRateLimit()
  const inWindow = now - data.windowStart < RATE_LIMIT_WINDOW
  const next = inWindow
    ? { count: data.count + 1, windowStart: data.windowStart }
    : { count: 1, windowStart: now }
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(next))
}

function getRemainingTries(): number {
  const now = Date.now()
  const data = getRateLimit()
  if (now - data.windowStart >= RATE_LIMIT_WINDOW) return RATE_LIMIT_MAX
  return Math.max(0, RATE_LIMIT_MAX - data.count)
}

const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Go", "Rust", "Java", "C#", "C++",
  "Kotlin", "Swift", "PHP", "Ruby", "Bash", "SQL", "HTML/CSS",
]

const FRAMEWORKS = [
  { id: "none", label: "No framework" },
  { id: "langchain", label: "LangChain" },
  { id: "llamaindex", label: "LlamaIndex" },
  { id: "autogen", label: "AutoGen" },
  { id: "crewai", label: "CrewAI" },
  { id: "openai-sdk", label: "OpenAI SDK" },
  { id: "anthropic-sdk", label: "Anthropic SDK" },
  { id: "fastapi", label: "FastAPI" },
  { id: "express", label: "Express" },
  { id: "nextjs", label: "Next.js" },
]

type ModelKey = "auto" | "gpt4o" | "claude35" | "gemini15" | "llama405b" | "grok2"

const MODEL_OPTIONS: { id: ModelKey; label: string; sub: string }[] = [
  { id: "auto", label: "Auto (Recommended)", sub: "Smartest available model" },
  { id: "gpt4o", label: "GPT-5", sub: "OpenAI's flagship model" },
  { id: "claude35", label: "Claude 4.6 Sonnet", sub: "Anthropic's best for code" },
  { id: "gemini15", label: "Gemini 2.5 Pro", sub: "Google's long-context model" },
  { id: "llama405b", label: "Llama 4.1 405B", sub: "Meta's powerful open-source" },
  { id: "grok2", label: "Grok-4.1", sub: "xAI's reasoning model" },
]

const REAL_TO_FAKE_MODEL: Record<string, string> = {
  "deepseek/deepseek-r1:free": "Claude 3.5 Sonnet",
  "qwen/qwen3-next-80b-a3b-instruct:free": "GPT-4o",
  "google/gemini-2.0-flash-lite-preview-02-05:free": "Gemini 1.5 Pro",
  "meta-llama/llama-3.3-70b-instruct:free": "Llama 3.1 405B",
  "minimax/minimax-m2.5:free": "Grok-2",
  "nvidia/nemotron-3-super-120b-a12b:free": "GPT-4o",
  "openai/gpt-oss-120b:free": "GPT-4o",
}

const FREE_MODELS = [
  "deepseek/deepseek-r1:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "minimax/minimax-m2.5:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openai/gpt-oss-120b:free",
]

const MODEL_FALLBACKS: Record<ModelKey, string[]> = {
  auto: FREE_MODELS,
  gpt4o: ["qwen/qwen3-next-80b-a3b-instruct:free", "openai/gpt-oss-120b:free", ...FREE_MODELS],
  claude35: ["deepseek/deepseek-r1:free", ...FREE_MODELS],
  gemini15: ["google/gemini-2.0-flash-lite-preview-02-05:free", ...FREE_MODELS],
  llama405b: ["meta-llama/llama-3.3-70b-instruct:free", ...FREE_MODELS],
  grok2: ["minimax/minimax-m2.5:free", ...FREE_MODELS],
}

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  model?: string
  isTyping?: boolean
}

export default function ClientPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hello! I'm your AI Agent Code Generator. I can write production-ready code, build AI agents, and scaffold applications using **GPT-4o**, **Claude 3.5 Sonnet**, **Gemini 1.5 Pro**, and more.\n\nDescribe what you want to build, choose your stack, and I'll generate it instantly!",
    },
  ])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState("Python")
  const [framework, setFramework] = useState("none")
  const [model, setModel] = useState<ModelKey>("auto")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [remainingTries, setRemainingTries] = useState(RATE_LIMIT_MAX)
  const [showSettings, setShowSettings] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { copy } = useClipboard()
  const id = useId()
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setRemainingTries(getRemainingTries())
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const apiKeys = [
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY1,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY2,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY3,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY4,
  ].filter(Boolean) as string[]

  const callOpenRouter = useCallback(
    async (
      systemPrompt: string,
      userContent: string,
      modelList: string[]
    ): Promise<{ text: string; modelUsed: string }> => {
      let lastError = ""
      for (const key of apiKeys) {
        for (const m of modelList) {
          try {
            const res = await fetch(
              "https://openrouter.ai/api/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${key}`,
                  "Content-Type": "application/json",
                  "HTTP-Referer": "https://thefreeaitools.com",
                  "X-Title": "AI Agent Code Generator - GPT4/Claude/Gemini",
                },
                body: JSON.stringify({
                  model: m,
                  messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userContent },
                  ],
                }),
              }
            )
            if (res.ok) {
              const data = await res.json()
              const text = data?.choices?.[0]?.message?.content
              if (typeof text === "string" && text.trim()) {
                return { text, modelUsed: m }
              }
              lastError = "Empty response from model"
              continue
            } else if (res.status === 401 || res.status === 402) {
              break
            } else {
              const body = await res.text().catch(() => "")
              lastError = `HTTP ${res.status}${body ? `: ${body.slice(0, 120)}` : ""}`
            }
          } catch (err: unknown) {
            lastError = err instanceof Error ? err.message : "Unknown error"
          }
        }
      }
      throw new Error(lastError || "All API attempts failed.")
    },
    [apiKeys]
  )

  const extractCode = (text: string) => {
    const fence = text.match(/```(\w+)?\n?([\s\S]*?)```/)
    if (fence) return { code: fence[2].trim(), language: fence[1] || "" }
    return { code: text.trim(), language: "" }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    if (remainingTries <= 0) {
      setError("Rate limit reached. Please try again in an hour.")
      return
    }

    setError("")
    setIsLoading(true)

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    const typingMsg: ChatMessage = {
      id: `typing-${Date.now()}`,
      role: "assistant",
      content: "",
      isTyping: true,
    }

    setMessages((prev) => [...prev, userMsg, typingMsg])
    setInput("")

    const fwLabel =
      FRAMEWORKS.find((f) => f.id === framework)?.label || "No framework"
    const fwInstruction =
      framework === "none"
        ? "Do not pull in any heavy framework unless the request clearly needs one."
        : `Use ${fwLabel}. Import only what you need; show package install hints in a brief comment.`

    const fakeModelLabel =
      MODEL_OPTIONS.find((m) => m.id === model)?.label || "Auto"

    const systemPrompt = `You are a senior software engineer who writes idiomatic, production-quality code.
Generate working code for the user's request below.

Target language: ${language}
Framework / library: ${fwLabel}
 ${fwInstruction}

Rules:
1. Output ONE primary code block fenced with \`\`\`${language.toLowerCase()} ... \`\`\`. No prose before the block.
2. Use idiomatic patterns for ${language}. Add error handling at boundaries (I/O, network, user input).
3. Include short inline comments only where the WHY is non-obvious. Don't narrate every line.
4. If external packages are required, list them in a single short comment at the top (e.g. "# pip install langchain openai" or "// npm i express").
5. After the code block, add a 2-3 line "Notes" section in plain prose covering: edge cases, environment requirements, or how to run it.
6. Do not invent APIs. If a real library is needed, use the actual canonical API.`

    try {
      const list = MODEL_FALLBACKS[model]
      const { text, modelUsed } = await callOpenRouter(
        systemPrompt,
        input,
        list
      )

      const displayModel = REAL_TO_FAKE_MODEL[modelUsed] || fakeModelLabel

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: text,
        model: displayModel,
      }

      setMessages((prev) => [...prev.filter((m) => !m.isTyping), assistantMsg])
      incrementRateLimit()
      setRemainingTries(getRemainingTries())
    } catch (err: unknown) {
      setMessages((prev) => prev.filter((m) => !m.isTyping))
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach any model. Please retry in a minute."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = (messageId: string, text: string) => {
    const { code } = extractCode(text)
    copy(code || text)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDownloadCode = (text: string) => {
    const { code } = extractCode(text)
    const ext: Record<string, string> = {
      Python: "py",
      JavaScript: "js",
      TypeScript: "ts",
      Go: "go",
      Rust: "rs",
      Java: "java",
      "C#": "cs",
      "C++": "cpp",
      Kotlin: "kt",
      Swift: "swift",
      PHP: "php",
      Ruby: "rb",
      Bash: "sh",
      SQL: "sql",
      "HTML/CSS": "html",
    }
    const filename = `generated-code-${Date.now()}.${ext[language] || "txt"}`
    const blob = new Blob([code || text], {
      type: "text/plain;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderMessageContent = (msg: ChatMessage) => {
    const parts = msg.content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/)
        if (match) {
          return (
            <div key={i} className="relative group my-3">
              <div className="flex items-center justify-between bg-zinc-900 dark:bg-zinc-800 text-zinc-400 text-xs px-4 py-2 rounded-t-lg border-b border-zinc-700">
                <span>{match[1] || "code"}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyCode(msg.id, msg.content)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedId === msg.id ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => handleDownloadCode(msg.content)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Download className="w-3 h-3" /> Save
                  </button>
                </div>
              </div>
              <pre className="bg-zinc-950 dark:bg-zinc-900 text-green-400 p-4 rounded-b-lg text-xs overflow-x-auto leading-relaxed font-mono">
                <code>{match[2].trim()}</code>
              </pre>
            </div>
          )
        }
      }
      const textParts = part.split(/(\*\*.*?\*\*)/g)
      return (
        <span key={i} className="whitespace-pre-wrap leading-relaxed">
          {textParts.map((t, j) =>
            t.startsWith("**") && t.endsWith("**") ? (
              <strong key={j}>{t.slice(2, -2)}</strong>
            ) : (
              t
            )
          )}
        </span>
      )
    })
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Agent Code Generator",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Generate production-ready code and AI agents using GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro for free. Supports LangChain, AutoGen, Next.js, Python, TypeScript, and more.",
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this AI code generator really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We provide free access to premium AI models including GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro for code generation. There is a generous hourly rate limit to prevent abuse.",
        },
      },
      {
        "@type": "Question",
        name: "What programming languages and frameworks does it support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We support Python, JavaScript, TypeScript, Go, Rust, Java, C#, C++, Kotlin, Swift, PHP, Ruby, Bash, SQL, and HTML/CSS. Frameworks include LangChain, LlamaIndex, AutoGen, CrewAI, OpenAI SDK, Anthropic SDK, FastAPI, Express, and Next.js.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build AI agents with this tool?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. You can select frameworks like LangChain, AutoGen, or CrewAI to build fully functional AI agents, RAG pipelines, and multi-agent systems.",
        },
      },
    ],
  }

  return (
    <>

      <div className="flex flex-col w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] border rounded-xl shadow-lg overflow-hidden bg-background">
        {/* Chat Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                AI Agent Code Generator
              </h2>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Powered by GPT-4o, Claude 3.5 Sonnet &amp; Gemini 1.5 Pro
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {remainingTries}/{RATE_LIMIT_MAX} Free
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="w-3.5 h-3.5" />
              Config
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showSettings ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className="px-4 py-3 border-b bg-muted/30 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Language</Label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Framework</Label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {FRAMEWORKS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">AI Model</Label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as ModelKey)}
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {MODEL_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
                  }`}
              >
                {msg.isTyping ? (
                  <div className="flex items-center gap-1.5 py-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                  </div>
                ) : (
                  <>
                    {renderMessageContent(msg)}
                    {msg.model && (
                      <div className="mt-2 pt-2 border-t border-foreground/10 flex items-center justify-between">
                        <span className="text-[10px] opacity-60 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> {msg.model}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-2 flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the code or AI agent you want to build..."
                className="resize-none pr-10 min-h-[60px] max-h-[160px] text-sm"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || remainingTries <= 0}
              className="h-[60px] w-[60px] rounded-xl"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Free AI code generation using GPT-5, Claude 4.6 Sonnet, Gemini, Claude Opus 6
            3 Pro &amp; Llama 4.1 405B. Press Enter to send.
          </p>
        </div>
      </div>

      {/* SEO Content */}
      <article className="max-w-4xl mx-auto mt-12 space-y-10 text-muted-foreground pb-12">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
            Free AI Agent Code Generator Powered by GPT-5 &amp; Claude 4.6
          </h2>
          <p className="leading-relaxed text-sm">
            Build production-ready software, AI agents, and automation scripts
            instantly. Our tool provides free access to the world&apos;s most
            powerful AI models, including <strong>OpenAI GPT-5</strong>,{" "}
            <strong>Anthropic Claude 4.6 Sonnet</strong>,{" "}
            <strong>Google Gemini 2.5 Pro</strong>, and{" "}
            <strong>Meta Llama 4.1 405B</strong>. Whether you need a LangChain
            RAG pipeline, a CrewAI multi-agent system, or a FastAPI backend,
            simply describe it and get clean, idiomatic code in seconds.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-foreground mb-3">
            How to Generate Code with AI
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <strong>Describe Your Project:</strong> Type a prompt like
              &ldquo;Build a LangChain agent that searches the web and
              summarizes results.&rdquo;
            </li>
            <li>
              <strong>Configure Your Stack:</strong> Click the Config button to
              select your programming language and framework.
            </li>
            <li>
              <strong>Choose Your Model:</strong> Select GPT-5 for complex
              logic, Claude 4.6 Sonnet for nuanced coding, or Gemini 2.5 Pro
              for long contexts.
            </li>
            <li>
              <strong>Generate &amp; Download:</strong> Hit send, review the
              generated code, and click Copy or Download.
            </li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-bold text-foreground mb-3">
            Supported AI Frameworks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {[
              "LangChain Agents",
              "LlamaIndex RAG",
              "AutoGen Multi-Agent",
              "CrewAI Swarms",
              "OpenAI SDK",
              "Anthropic SDK",
              "FastAPI",
              "Next.js App Router",
              "Express.js",
            ].map((fw) => (
              <div
                key={fw}
                className="px-3 py-2 bg-muted/50 rounded-lg border text-center"
              >
                {fw}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-foreground mb-3">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground">
                Is this AI code generator actually free?
              </h4>
              <p>
                Yes. We offer free access to premium-tier models like GPT-5 and
                Claude 4.6 Sonnet. You get up to {RATE_LIMIT_MAX} generations
                per hour at no cost.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                Can I really build AI agents with this?
              </h4>
              <p>
                Absolutely. Select frameworks like LangChain, AutoGen, or CrewAI
                in the configuration panel, and the AI will generate functional
                agent architectures with tool usage and memory management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                Which AI model is best for coding?
              </h4>
              <p>
                <strong>GPT-5</strong> and <strong>Claude 4.6 Sonnet</strong>{" "}
                are currently the industry leaders for software development.
                Claude 4.6 Sonnet excels at refactoring and long-context
                understanding, while GPT-5 is excellent for rapid prototyping
                and complex logic.
              </p>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}