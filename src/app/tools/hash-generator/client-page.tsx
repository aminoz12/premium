"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { Copy, Hash, Trash2, CheckCircle2, XCircle, AlertCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Algorithm definitions ─────────────────────────────────────────────────────

type AlgorithmId = "SHA-256" | "SHA-384" | "SHA-512" | "MD5"

const ALGORITHMS: { id: AlgorithmId; label: string; bits: number; safe: boolean; note: string }[] = [
  { id: "SHA-256", label: "SHA-256", bits: 256, safe: true, note: "64 hex chars · NIST standard · recommended" },
  { id: "SHA-384", label: "SHA-384", bits: 384, safe: true, note: "96 hex chars · stronger variant" },
  { id: "SHA-512", label: "SHA-512", bits: 512, safe: true, note: "128 hex chars · highest security" },
  { id: "MD5", label: "MD5", bits: 128, safe: false, note: "32 hex chars · legacy only — do not use for security" },
]

// ── SubtleCrypto hash (SHA-*) ─────────────────────────────────────────────────

async function hashWithSubtle(text: string, algorithm: "SHA-256" | "SHA-384" | "SHA-512"): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buffer = await crypto.subtle.digest(algorithm, data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// ── Real MD5 implementation ───────────────────────────────────────────────────
// Standard RFC 1321 MD5 — deterministic and correct

function md5(input: string): string {
  function safeAdd(x: number, y: number) { return (x + y) | 0 }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  function utf8Encode(str: string): Uint8Array {
    return new TextEncoder().encode(str)
  }

  const bytes = utf8Encode(input)
  const origLen = bytes.length * 8

  // Padding
  const padLen = bytes.length % 64 < 56 ? 56 - (bytes.length % 64) : 120 - (bytes.length % 64)
  const padded = new Uint8Array(bytes.length + padLen + 8)
  padded.set(bytes)
  padded[bytes.length] = 0x80

  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, origLen & 0xffffffff, true)
  view.setUint32(padded.length - 4, Math.floor(origLen / 0x100000000), true)

  // Process blocks
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476

  for (let i = 0; i < padded.length; i += 64) {
    const M: number[] = []
    for (let j = 0; j < 16; j++) {
      M[j] = view.getInt32(i + j * 4, true)
    }

    let [aa, bb, cc, dd] = [a, b, c, d]

    // Round 1
    a = md5ff(a, b, c, d, M[0], 7, -680876936); d = md5ff(d, a, b, c, M[1], 12, -389564586)
    c = md5ff(c, d, a, b, M[2], 17, 606105819); b = md5ff(b, c, d, a, M[3], 22, -1044525330)
    a = md5ff(a, b, c, d, M[4], 7, -176418897); d = md5ff(d, a, b, c, M[5], 12, 1200080426)
    c = md5ff(c, d, a, b, M[6], 17, -1473231341); b = md5ff(b, c, d, a, M[7], 22, -45705983)
    a = md5ff(a, b, c, d, M[8], 7, 1770035416); d = md5ff(d, a, b, c, M[9], 12, -1958414417)
    c = md5ff(c, d, a, b, M[10], 17, -42063); b = md5ff(b, c, d, a, M[11], 22, -1990404162)
    a = md5ff(a, b, c, d, M[12], 7, 1804603682); d = md5ff(d, a, b, c, M[13], 12, -40341101)
    c = md5ff(c, d, a, b, M[14], 17, -1502002290); b = md5ff(b, c, d, a, M[15], 22, 1236535329)

    // Round 2
    a = md5gg(a, b, c, d, M[1], 5, -165796510); d = md5gg(d, a, b, c, M[6], 9, -1069501632)
    c = md5gg(c, d, a, b, M[11], 14, 643717713); b = md5gg(b, c, d, a, M[0], 20, -373897302)
    a = md5gg(a, b, c, d, M[5], 5, -701558691); d = md5gg(d, a, b, c, M[10], 9, 38016083)
    c = md5gg(c, d, a, b, M[15], 14, -660478335); b = md5gg(b, c, d, a, M[4], 20, -405537848)
    a = md5gg(a, b, c, d, M[9], 5, 568446438); d = md5gg(d, a, b, c, M[14], 9, -1019803690)
    c = md5gg(c, d, a, b, M[3], 14, -187363961); b = md5gg(b, c, d, a, M[8], 20, 1163531501)
    a = md5gg(a, b, c, d, M[13], 5, -1444681467); d = md5gg(d, a, b, c, M[2], 9, -51403784)
    c = md5gg(c, d, a, b, M[7], 14, 1735328473); b = md5gg(b, c, d, a, M[12], 20, -1926607734)

    // Round 3
    a = md5hh(a, b, c, d, M[5], 4, -378558); d = md5hh(d, a, b, c, M[8], 11, -2022574463)
    c = md5hh(c, d, a, b, M[11], 16, 1839030562); b = md5hh(b, c, d, a, M[14], 23, -35309556)
    a = md5hh(a, b, c, d, M[1], 4, -1530992060); d = md5hh(d, a, b, c, M[4], 11, 1272893353)
    c = md5hh(c, d, a, b, M[7], 16, -155497632); b = md5hh(b, c, d, a, M[10], 23, -1094730640)
    a = md5hh(a, b, c, d, M[13], 4, 681279174); d = md5hh(d, a, b, c, M[0], 11, -358537222)
    c = md5hh(c, d, a, b, M[3], 16, -722521979); b = md5hh(b, c, d, a, M[6], 23, 76029189)
    a = md5hh(a, b, c, d, M[9], 4, -640364487); d = md5hh(d, a, b, c, M[12], 11, -421815835)
    c = md5hh(c, d, a, b, M[15], 16, 530742520); b = md5hh(b, c, d, a, M[2], 23, -995338651)

    // Round 4
    a = md5ii(a, b, c, d, M[0], 6, -198630844); d = md5ii(d, a, b, c, M[7], 10, 1126891415)
    c = md5ii(c, d, a, b, M[14], 15, -1416354905); b = md5ii(b, c, d, a, M[5], 21, -57434055)
    a = md5ii(a, b, c, d, M[12], 6, 1700485571); d = md5ii(d, a, b, c, M[3], 10, -1894986606)
    c = md5ii(c, d, a, b, M[10], 15, -1051523); b = md5ii(b, c, d, a, M[1], 21, -2054922799)
    a = md5ii(a, b, c, d, M[8], 6, 1873313359); d = md5ii(d, a, b, c, M[15], 10, -30611744)
    c = md5ii(c, d, a, b, M[6], 15, -1560198380); b = md5ii(b, c, d, a, M[13], 21, 1309151649)
    a = md5ii(a, b, c, d, M[4], 6, -145523070); d = md5ii(d, a, b, c, M[11], 10, -1120210379)
    c = md5ii(c, d, a, b, M[2], 15, 718787259); b = md5ii(b, c, d, a, M[9], 21, -343485551)

    a = safeAdd(a, aa); b = safeAdd(b, bb); c = safeAdd(c, cc); d = safeAdd(d, dd)
  }

  return [a, b, c, d]
    .map((n) => {
      const hex = ((n >>> 0) + 0x100000000).toString(16)
      // little-endian byte swap for MD5 output
      const bytes = hex.slice(-8)
      return bytes.match(/../g)!.reverse().join("")
    })
    .join("")
}

// ── Hash dispatcher ───────────────────────────────────────────────────────────

async function computeHash(text: string, algorithm: AlgorithmId): Promise<string> {
  if (!text) return ""
  if (algorithm === "MD5") return md5(text)
  return hashWithSubtle(text, algorithm)
}

// ── Algorithm info ────────────────────────────────────────────────────────────

const ALGO_INFO: Record<AlgorithmId, string> = {
  "SHA-256": "SHA-256 is part of the SHA-2 family (NIST FIPS 180-4). Produces a 256-bit (32-byte) digest. Widely used for digital signatures, TLS certificates, Bitcoin PoW, and file integrity verification. Considered secure as of 2024.",
  "SHA-384": "SHA-384 produces a 384-bit digest and is a truncated variant of SHA-512. Used in TLS 1.3 cipher suites and as a stronger alternative to SHA-256 when larger hash sizes are required.",
  "SHA-512": "SHA-512 produces a 512-bit (64-byte) digest. Faster than SHA-256 on 64-bit hardware due to 64-bit word operations. Preferred for applications requiring maximum pre-image resistance.",
  "MD5": "MD5 produces a 128-bit digest. Cryptographically broken — collision attacks (finding two inputs with the same hash) are trivial on modern hardware. Use only for legacy checksums and non-security purposes.",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ToolClient() {
  const [algorithm, setAlgorithm] = useState<AlgorithmId>("SHA-256")
  const [input, setInput] = useState("")
  const [salt, setSalt] = useState("")
  const [hash, setHash] = useState("")
  const [uppercase, setUppercase] = useState(false)

  // Compare tab
  const [hashA, setHashA] = useState("")
  const [hashB, setHashB] = useState("")

  const { copy, copied } = useClipboard()

  // Recompute hash when input, salt, or algorithm changes
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      const text = salt ? `${salt}${input}` : input
      const result = await computeHash(text, algorithm)
      if (!cancelled) setHash(result)
    }, 100)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [input, salt, algorithm])

  const displayHash = uppercase ? hash.toUpperCase() : hash
  const algoMeta = ALGORITHMS.find((a) => a.id === algorithm)!

  const compareResult = hashA.trim() && hashB.trim()
    ? hashA.trim().toLowerCase() === hashB.trim().toLowerCase()
    : null

  return (
    <>
      <div className="space-y-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="generate">Generate Hash</TabsTrigger>
            <TabsTrigger value="compare">Compare Hashes</TabsTrigger>
          </TabsList>

          {/* ── Generate tab ──────────────────────────────────────────── */}
          <TabsContent value="generate" className="space-y-6 focus-visible:outline-none">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard title="Input">
                <div className="space-y-4">
                  {/* Algorithm selector */}
                  <div className="space-y-2">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmId)}>
                      <SelectTrigger id="algorithm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALGORITHMS.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            <span className="flex items-center gap-2">
                              {a.label}
                              {!a.safe && (
                                <span className="text-xs text-amber-600">(legacy)</span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{algoMeta.note}</p>
                  </div>

                  {/* Input text */}
                  <div className="space-y-2">
                    <Label htmlFor="hash-input">Text to Hash</Label>
                    <Textarea
                      id="hash-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter text to hash…"
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </div>

                  {/* Optional salt */}
                  <div className="space-y-2">
                    <Label htmlFor="hash-salt">
                      Salt{" "}
                      <span className="font-normal text-muted-foreground">(optional prefix)</span>
                    </Label>
                    <Input
                      id="hash-salt"
                      value={salt}
                      onChange={(e) => setSalt(e.target.value)}
                      placeholder="Prepend a salt value…"
                      className="font-mono"
                    />
                    {salt && (
                      <p className="text-xs text-muted-foreground">
                        Hashing: <code className="rounded bg-muted px-1">{salt}[input]</code>
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setInput(""); setSalt(""); setHash("") }}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </Button>
                </div>
              </ToolCard>

              <ToolCard title="Hash Output">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hash-output">
                        {algorithm} Hash
                      </Label>
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={uppercase}
                          onChange={(e) => setUppercase(e.target.checked)}
                          className="accent-primary"
                        />
                        Uppercase
                      </label>
                    </div>
                    <div className="relative">
                      <Textarea
                        id="hash-output"
                        value={displayHash}
                        readOnly
                        placeholder="Hash will appear here…"
                        className="min-h-[100px] bg-muted/30 font-mono text-sm focus-visible:ring-0"
                        aria-live="polite"
                      />
                      {hash && (
                        <Button
                          size="sm"
                          variant={copied ? "default" : "secondary"}
                          className="absolute bottom-3 right-3"
                          onClick={() => copy(displayHash)}
                        >
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {hash && (
                    <div className="rounded-lg border bg-muted/20 p-3 space-y-1 text-xs text-muted-foreground">
                      <p><span className="font-medium text-foreground">Algorithm:</span> {algorithm}</p>
                      <p><span className="font-medium text-foreground">Length:</span> {hash.length} hex chars ({algoMeta.bits} bits)</p>
                      <p><span className="font-medium text-foreground">Input length:</span> {(salt + input).length} bytes</p>
                    </div>
                  )}

                  {/* Security note for MD5 */}
                  {algorithm === "MD5" && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        MD5 is cryptographically broken. Collisions can be generated in seconds.
                        Use only for non-security purposes (legacy checksums, data fingerprinting).
                      </p>
                    </div>
                  )}
                </div>
              </ToolCard>
            </div>

            {/* Algorithm info */}
            <ToolCard title="About this algorithm">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p>{ALGO_INFO[algorithm]}</p>
              </div>
            </ToolCard>

            {/* Algorithm comparison table */}
            <ToolCard title="Algorithm Comparison">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-4 font-semibold">Algorithm</th>
                      <th className="pb-2 pr-4 font-semibold">Output</th>
                      <th className="pb-2 pr-4 font-semibold">Security</th>
                      <th className="pb-2 font-semibold">Use case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ALGORITHMS.map((a) => (
                      <tr
                        key={a.id}
                        className={cn(
                          a.id === algorithm && "bg-primary/5 font-medium"
                        )}
                      >
                        <td className="py-2 pr-4 font-mono">{a.label}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{a.bits} bits</td>
                        <td className="py-2 pr-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
                            a.safe
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {a.safe ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {a.safe ? "Secure" : "Broken"}
                          </span>
                        </td>
                        <td className="py-2 text-muted-foreground text-xs">{a.note.split("·").slice(1).join("·").trim()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ToolCard>
          </TabsContent>

          {/* ── Compare tab ────────────────────────────────────────────── */}
          <TabsContent value="compare" className="space-y-6 focus-visible:outline-none">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard title="Hash A">
                <div className="space-y-2">
                  <Label htmlFor="hash-a">First hash</Label>
                  <Textarea
                    id="hash-a"
                    value={hashA}
                    onChange={(e) => setHashA(e.target.value)}
                    placeholder="Paste first hash…"
                    className="min-h-[80px] font-mono text-sm"
                  />
                </div>
              </ToolCard>

              <ToolCard title="Hash B">
                <div className="space-y-2">
                  <Label htmlFor="hash-b">Second hash</Label>
                  <Textarea
                    id="hash-b"
                    value={hashB}
                    onChange={(e) => setHashB(e.target.value)}
                    placeholder="Paste second hash…"
                    className="min-h-[80px] font-mono text-sm"
                  />
                </div>
              </ToolCard>
            </div>

            {compareResult !== null && (
              <ToolCard>
                <div className="flex min-h-[120px] flex-col items-center justify-center gap-3">
                  {compareResult ? (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        Hashes match
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Both values are identical (case-insensitive).
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <XCircle className="h-7 w-7 text-destructive" />
                      </div>
                      <p className="text-lg font-semibold text-destructive">Hashes do not match</p>
                      <p className="text-sm text-muted-foreground">
                        The values differ. Check for trailing spaces, encoding differences, or
                        different algorithm outputs.
                      </p>
                    </>
                  )}
                </div>
              </ToolCard>
            )}

            <ToolCard title="Usage tips">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  Comparison is case-insensitive — <code className="rounded bg-muted px-1">abcd1234</code> and{" "}
                  <code className="rounded bg-muted px-1">ABCD1234</code> are treated as equal.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  To verify file integrity: download the file, run it through the Generate tab with the same algorithm, then compare the output here.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  If comparing a hash from an untrusted source, use SHA-256 or higher — MD5 hashes can be forged.
                </li>
              </ul>
            </ToolCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
