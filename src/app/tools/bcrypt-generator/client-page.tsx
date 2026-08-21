"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Lock, ShieldCheck, AlertCircle, CheckCircle2, XCircle,
  Clock, Shield, Info, Search,
} from "lucide-react"
import bcrypt from "bcryptjs"

// ── Cost factor timing estimates (typical modern server hardware, 2024) ────────
const COST_FACTOR_INFO: Record<number, { ms: string; label: string; owasp: string }> = {
  4: { ms: "< 1ms", label: "Testing only", owasp: "too_fast" },
  6: { ms: "~1ms", label: "Testing only", owasp: "too_fast" },
  8: { ms: "~5ms", label: "Borderline", owasp: "below_min" },
  10: { ms: "~20ms", label: "OWASP minimum", owasp: "minimum" },
  12: { ms: "~80ms", label: "Recommended", owasp: "recommended" },
  14: { ms: "~320ms", label: "High security", owasp: "good" },
  16: { ms: "~1.3s", label: "Very high", owasp: "good" },
}

const COST_LEVELS = [4, 6, 8, 10, 12, 14, 16]

// ── Algorithm comparison table ─────────────────────────────────────────────────
const ALGO_TABLE = [
  {
    name: "bcrypt",
    type: "Password hashing",
    memory: "4 KB (fixed)",
    parallelism: "No",
    owasp: "Acceptable (cost ≥ 10)",
    notes: "Widely supported. Max 72-byte password limit. Use cost ≥ 12 for new systems.",
    recommended: false,
  },
  {
    name: "Argon2id",
    type: "Password hashing",
    memory: "19–64 MB",
    parallelism: "Yes",
    owasp: "First choice",
    notes: "OWASP #1 recommendation. Resistant to GPU and side-channel attacks. Winner of PHC 2015.",
    recommended: true,
  },
  {
    name: "scrypt",
    type: "Password hashing",
    memory: "16–64 MB",
    parallelism: "Limited",
    owasp: "Acceptable",
    notes: "Memory-hard like Argon2. N=32768, r=8, p=1 is the OWASP baseline. Less common library support.",
    recommended: false,
  },
  {
    name: "PBKDF2",
    type: "Key derivation",
    memory: "Negligible",
    parallelism: "No",
    owasp: "Acceptable (≥ 600k iterations)",
    notes: "FIPS-approved. Native in Node.js crypto module. GPU-parallelizable — requires very high iteration count.",
    recommended: false,
  },
  {
    name: "MD5 / SHA-1",
    type: "General hashing",
    memory: "Negligible",
    parallelism: "N/A",
    owasp: "NEVER use",
    notes: "Cryptographically broken. No work factor. Billions of hashes/second on commodity GPU. For reference only.",
    recommended: false,
  },
]

// ── bcrypt hash detector ───────────────────────────────────────────────────────
function detectBcryptHash(input: string): {
  valid: boolean
  version?: string
  cost?: number
  salt?: string
  hash?: string
  error?: string
} {
  const trimmed = input.trim()
  if (!trimmed) return { valid: false }

  // Bcrypt format: $2a$10$[22 chars salt][31 chars hash]
  const match = trimmed.match(/^\$(2[abxy])\$(\d{2})\$(.{53})$/)
  if (!match) {
    return { valid: false, error: "Not a valid bcrypt hash. bcrypt hashes start with $2b$, $2a$, $2y$, or $2x$ followed by a 2-digit cost factor." }
  }

  const version = match[1]
  const cost = parseInt(match[2], 10)
  const rest = match[3]
  const salt = rest.slice(0, 22)
  const hashPart = rest.slice(22)

  return { valid: true, version, cost, salt, hash: hashPart }
}

export default function ToolClient() {
  const [password, setPassword] = useState("")
  const [hash, setHash] = useState("")
  const [salt, setSalt] = useState("")
  const [rounds, setRounds] = useState(12)

  const [comparePassword, setComparePassword] = useState("")
  const [compareHash, setCompareHash] = useState("")
  const [compareResult, setCompareResult] = useState<boolean | null>(null)

  const [detectInput, setDetectInput] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { copy, copied } = useClipboard()

  const costInfo = COST_FACTOR_INFO[rounds]

  const generateHash = useCallback(async () => {
    if (!password.trim()) {
      setError("Please enter a password to hash.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await new Promise((r) => setTimeout(r, 50))
      const generatedSalt = await bcrypt.genSalt(rounds)
      const generatedHash = await bcrypt.hash(password, generatedSalt)
      setHash(generatedHash)
      setSalt(generatedSalt)
    } catch {
      setError("An error occurred while generating the hash.")
    } finally {
      setLoading(false)
    }
  }, [password, rounds])

  const verifyHash = useCallback(async () => {
    if (!comparePassword.trim() || !compareHash.trim()) {
      setError("Both password and hash are required.")
      return
    }
    setLoading(true)
    setError("")
    setCompareResult(null)
    try {
      await new Promise((r) => setTimeout(r, 50))
      const result = await bcrypt.compare(comparePassword, compareHash)
      setCompareResult(result)
    } catch {
      setCompareResult(false)
    } finally {
      setLoading(false)
    }
  }, [comparePassword, compareHash])

  const detected = useMemo(() => detectBcryptHash(detectInput), [detectInput])

  return (
    <section aria-label="Bcrypt Hash Generator & Verifier" className="w-full space-y-6">
      <Tabs
        defaultValue="generate"
        className="w-full"
        onValueChange={() => { setError(""); setCompareResult(null) }}
      >
        <TabsList className="mb-6 grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="generate">Generate Hash</TabsTrigger>
          <TabsTrigger value="compare">Verify Hash</TabsTrigger>
          <TabsTrigger value="detect">Hash Detector</TabsTrigger>
        </TabsList>

        {/* ── Generate tab ────────────────────────────────────────────────── */}
        <TabsContent value="generate" className="space-y-6 focus-visible:outline-none">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <ToolCard title="Configuration">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="gen-password">Plain Text Password</Label>
                  <Input
                    id="gen-password"
                    type="password"
                    placeholder="Enter password to hash…"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError("") }}
                  />
                  <p className="text-xs text-muted-foreground">
                    bcrypt silently truncates passwords longer than 72 bytes.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salt-rounds">Cost Factor (Work Factor)</Label>
                  <Select value={rounds.toString()} onValueChange={(v) => setRounds(Number(v))}>
                    <SelectTrigger id="salt-rounds">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COST_LEVELS.map((r) => {
                        const info = COST_FACTOR_INFO[r]
                        return (
                          <SelectItem key={r} value={r.toString()}>
                            {r} — {info.label} ({info.ms})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>

                  {/* Cost factor context banner */}
                  <div className={`mt-2 flex items-start gap-2 rounded-lg p-3 text-sm ${costInfo.owasp === "too_fast" || costInfo.owasp === "below_min"
                      ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
                      : costInfo.owasp === "minimum"
                        ? "bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                        : "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300"
                    }`}>
                    <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">Cost {rounds}: ~{costInfo.ms} per hash</p>
                      <p className="mt-0.5 text-xs opacity-80">
                        {costInfo.owasp === "too_fast"
                          ? "Too fast for production — use cost ≥ 10."
                          : costInfo.owasp === "below_min"
                            ? "Below OWASP minimum. Use cost ≥ 10 for any production data."
                            : costInfo.owasp === "minimum"
                              ? "OWASP minimum. Cost 12 is recommended for new systems."
                              : "Meets or exceeds OWASP recommendation."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={generateHash} className="w-full" disabled={loading} size="lg">
                  {loading ? (
                    "Generating…"
                  ) : (
                    <><Lock className="mr-2 h-4 w-4" /> Generate Bcrypt Hash</>
                  )}
                </Button>
              </div>
            </ToolCard>

            <ToolCard title="Output">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="output-hash">Generated Hash</Label>
                  <div className="relative">
                    <Textarea
                      id="output-hash"
                      value={hash}
                      readOnly
                      placeholder="Hash will appear here…"
                      className="min-h-[100px] bg-muted/30 font-mono text-sm focus-visible:ring-0"
                      aria-live="polite"
                    />
                    {hash && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-3 right-3"
                        onClick={() => copy(hash)}
                      >
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="output-salt">Extracted Salt</Label>
                  <div className="relative">
                    <Input
                      id="output-salt"
                      value={salt}
                      readOnly
                      placeholder="Salt will appear here…"
                      className="bg-muted/30 font-mono text-sm focus-visible:ring-0 pr-10"
                      aria-live="polite"
                    />
                    {salt && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1 h-7 w-7"
                        onClick={() => copy(salt)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {hash && (
                  <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
                    <p><span className="font-medium text-foreground">Version:</span> $2b (bcryptjs)</p>
                    <p><span className="font-medium text-foreground">Cost factor:</span> {rounds}</p>
                    <p><span className="font-medium text-foreground">Hash length:</span> 60 characters</p>
                  </div>
                )}
              </div>
            </ToolCard>
          </div>

          {/* OWASP guidance */}
          <ToolCard title="OWASP Security Guidance">
            <div className="flex items-start gap-3 text-sm">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-2 text-muted-foreground">
                <p>
                  The{" "}
                  <a
                    href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    OWASP Password Storage Cheat Sheet
                  </a>{" "}
                  recommends bcrypt with a <strong className="text-foreground">minimum cost factor of 10</strong>, targeting
                  approximately 1 second of computation on the authentication server. Increase the cost
                  factor over time as hardware improves.
                </p>
                <p>
                  For new systems, prefer <strong className="text-foreground">Argon2id</strong> (see algorithm comparison below)  ,
                  it offers better memory-hardness and resistance to GPU attacks compared to bcrypt.
                </p>
                <p>
                  The <strong className="text-foreground">72-byte password limit</strong> in bcrypt is a well-known limitation.
                  Passwords longer than 72 bytes are silently truncated. Consider pre-hashing with SHA-256
                  if users may have very long passwords (though this introduces its own tradeoffs).
                </p>
              </div>
            </div>
          </ToolCard>
        </TabsContent>

        {/* ── Compare tab ─────────────────────────────────────────────────── */}
        <TabsContent value="compare" className="space-y-6 focus-visible:outline-none">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <ToolCard title="Verification Input">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cmp-password">Plain Text Password</Label>
                  <Input
                    id="cmp-password"
                    type="password"
                    placeholder="Enter password to verify…"
                    value={comparePassword}
                    onChange={(e) => { setComparePassword(e.target.value); setError("") }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cmp-hash">Bcrypt Hash</Label>
                  <Textarea
                    id="cmp-hash"
                    placeholder="Paste bcrypt hash (e.g. $2b$12$...)"
                    value={compareHash}
                    onChange={(e) => { setCompareHash(e.target.value); setError("") }}
                    className="min-h-[100px] font-mono text-sm"
                  />
                </div>
                <Button onClick={verifyHash} className="w-full" disabled={loading} size="lg">
                  {loading ? (
                    "Verifying…"
                  ) : (
                    <><ShieldCheck className="mr-2 h-4 w-4" /> Verify Password</>
                  )}
                </Button>
              </div>
            </ToolCard>

            <ToolCard title="Result">
              <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/10">
                {compareResult === null ? (
                  <div className="p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-40" />
                    <p className="font-medium text-muted-foreground">Awaiting verification</p>
                    <p className="mt-1 max-w-[220px] text-sm text-muted-foreground">
                      Enter a password and hash, then click Verify.
                    </p>
                  </div>
                ) : compareResult ? (
                  <div className="p-6 text-center" role="status">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-4 ring-green-50 dark:bg-green-900/30 dark:ring-green-900/20">
                      <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-green-600 dark:text-green-500">
                      Password Matches
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The password is valid against this hash.
                    </p>
                  </div>
                ) : (
                  <div className="p-6 text-center" role="status">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/5">
                      <XCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-destructive">No Match</h3>
                    <p className="text-sm text-muted-foreground">
                      The password does not match the provided hash.
                    </p>
                  </div>
                )}
              </div>
            </ToolCard>
          </div>
        </TabsContent>

        {/* ── Detect tab ──────────────────────────────────────────────────── */}
        <TabsContent value="detect" className="space-y-6 focus-visible:outline-none">
          <ToolCard title="Bcrypt Hash Detector">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Paste any string to check if it is a valid bcrypt hash and extract its metadata.
              </p>
              <div className="space-y-2">
                <Label htmlFor="detect-input">Hash String</Label>
                <div className="relative">
                  <Textarea
                    id="detect-input"
                    placeholder="Paste a hash here, e.g. $2b$12$..."
                    value={detectInput}
                    onChange={(e) => setDetectInput(e.target.value)}
                    className="min-h-[80px] font-mono text-sm pr-10"
                  />
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {detectInput.trim() && (
                <div className={`rounded-xl border p-4 ${detected.valid
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                    : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
                  }`}>
                  {detected.valid ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5" />
                        Valid bcrypt hash
                      </div>
                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Algorithm Version</p>
                          <p className="font-mono font-semibold">${detected.version}$</p>
                          <p className="text-xs text-muted-foreground">
                            {detected.version === "2b"
                              ? "Standard (recommended)"
                              : detected.version === "2a"
                                ? "Legacy — generated by PHP or older libs"
                                : detected.version === "2y"
                                  ? "PHP-specific variant — functionally identical to $2b$"
                                  : "Rare variant"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cost Factor</p>
                          <p className="font-mono font-semibold">{detected.cost}</p>
                          <p className="text-xs text-muted-foreground">
                            {detected.cost !== undefined && COST_FACTOR_INFO[detected.cost]
                              ? `${COST_FACTOR_INFO[detected.cost].label} — ${COST_FACTOR_INFO[detected.cost].ms}`
                              : detected.cost !== undefined && detected.cost < 10
                                ? "Below OWASP minimum (cost ≥ 10)"
                                : "Meets OWASP recommendation"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Embedded Salt (base64)</p>
                          <p className="break-all font-mono text-xs">{detected.salt}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hash Portion (base64)</p>
                          <p className="break-all font-mono text-xs">{detected.hash}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                      <Info className="mt-0.5 h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Not a valid bcrypt hash</p>
                        {detected.error && (
                          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400/80">{detected.error}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ToolCard>
        </TabsContent>
      </Tabs>

      {/* Algorithm comparison table */}
      <ToolCard title="Password Hashing Algorithm Comparison">
        <p className="mb-5 text-sm text-muted-foreground">
          bcrypt is widely supported, but it is not the only option. Use this table to choose the
          right algorithm for your project.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Algorithm</th>
                <th className="pb-3 pr-4 font-semibold">Memory</th>
                <th className="pb-3 pr-4 font-semibold">Parallelism</th>
                <th className="pb-3 pr-4 font-semibold">OWASP Rating</th>
                <th className="pb-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ALGO_TABLE.map((row) => (
                <tr
                  key={row.name}
                  className={row.recommended ? "bg-green-50 dark:bg-green-950/20" : ""}
                >
                  <td className="py-3 pr-4">
                    <span className="font-mono font-semibold">{row.name}</span>
                    {row.recommended && (
                      <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-green-700 dark:bg-green-900 dark:text-green-300">
                        Best choice
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.memory}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.parallelism}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-medium ${row.owasp.includes("NEVER")
                        ? "text-destructive"
                        : row.owasp.includes("First")
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}>
                      {row.owasp}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">OWASP recommendation (2024):</strong> Use{" "}
            <strong className="text-foreground">Argon2id</strong> for new systems with minimum
            parameters: 19 MB memory, 2 iterations, 1 thread. For bcrypt: minimum cost 10, target
            cost 12+. Never use MD5, SHA-1, or unsalted hashes for password storage.
          </p>
        </div>
      </ToolCard>
    </section>
  )
}
