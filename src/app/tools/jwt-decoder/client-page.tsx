"use client"

import React, { useState, useMemo, useId, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout } from "@/components/layout/tool-layout"
import {
  Copy, KeyRound, AlertCircle, Check, Shield,
  Clock, AlertTriangle, Info, Trash2, Lock,
  CheckCircle2, XCircle,
} from "lucide-react"

// ── Standard claim definitions ────────────────────────────────────────────────
const CLAIM_DOCS: Record<string, { name: string; desc: string }> = {
  iss: { name: "Issuer", desc: "Identifies the principal that issued the JWT." },
  sub: { name: "Subject", desc: "Identifies the principal that is the subject of the JWT (usually a user ID)." },
  aud: { name: "Audience", desc: "Identifies the recipients that the JWT is intended for." },
  exp: { name: "Expiration Time", desc: "Unix timestamp after which the JWT must not be accepted." },
  nbf: { name: "Not Before", desc: "Unix timestamp before which the JWT must not be accepted." },
  iat: { name: "Issued At", desc: "Unix timestamp at which the JWT was issued." },
  jti: { name: "JWT ID", desc: "Unique identifier for this token to prevent replay attacks." },
  name: { name: "Full Name", desc: "User's full name (OpenID Connect standard claim)." },
  email: { name: "Email", desc: "User's email address (OpenID Connect standard claim)." },
  picture: { name: "Picture URL", desc: "URL of the user's profile picture (OpenID Connect standard claim)." },
  role: { name: "Role", desc: "User role or permission level (application-specific claim)." },
  roles: { name: "Roles", desc: "Array of user roles (application-specific claim)." },
  scope: { name: "Scope", desc: "OAuth 2.0 scope — the permissions granted by this token." },
  azp: { name: "Authorized Party", desc: "Client ID of the application the token was issued to." },
  sid: { name: "Session ID", desc: "Session identifier; can be used to bind token to a session." },
}

// ── Algorithm explanations ────────────────────────────────────────────────────
const ALG_DOCS: Record<string, { type: string; desc: string; safe: boolean }> = {
  HS256: { type: "HMAC", desc: "HMAC with SHA-256. Symmetric: same secret signs and verifies. Simple but secret must be shared.", safe: true },
  HS384: { type: "HMAC", desc: "HMAC with SHA-384. Same as HS256 but larger hash. Rarely needed.", safe: true },
  HS512: { type: "HMAC", desc: "HMAC with SHA-512. Same as HS256 but largest hash.", safe: true },
  RS256: { type: "RSA", desc: "RSA with SHA-256. Asymmetric: private key signs, public key verifies. Preferred for public APIs.", safe: true },
  RS384: { type: "RSA", desc: "RSA with SHA-384.", safe: true },
  RS512: { type: "RSA", desc: "RSA with SHA-512.", safe: true },
  ES256: { type: "ECDSA", desc: "ECDSA with P-256 and SHA-256. Smaller keys than RSA, same security. Preferred for mobile.", safe: true },
  ES384: { type: "ECDSA", desc: "ECDSA with P-384 and SHA-384.", safe: true },
  ES512: { type: "ECDSA", desc: "ECDSA with P-521 and SHA-512.", safe: true },
  none: { type: "None", desc: "No signature. The token is completely unsigned and unverifiable.", safe: false },
  PS256: { type: "RSA-PSS", desc: "RSASSA-PSS with SHA-256. More secure than RS256, recommended for new systems.", safe: true },
}

// ── Time helpers ──────────────────────────────────────────────────────────────
function formatUnix(ts: number): string {
  return new Date(ts * 1000).toLocaleString(undefined, {
    dateStyle: "medium", timeStyle: "short",
  })
}

function formatCountdown(ts: number): { label: string; expired: boolean } {
  const diff = ts - Math.floor(Date.now() / 1000)
  if (diff <= 0) return { label: "Expired", expired: true }
  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  if (d > 0) return { label: `Expires in ${d}d ${h}h`, expired: false }
  if (h > 0) return { label: `Expires in ${h}h ${m}m`, expired: false }
  if (m > 0) return { label: `Expires in ${m}m ${s}s`, expired: false }
  return { label: `Expires in ${s}s`, expired: false }
}

// ── Base64url decoder ─────────────────────────────────────────────────────────
function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), "=")
  return decodeURIComponent(
    atob(padded).split("").map((c) =>
      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join("")
  )
}

// ── HMAC verify (SubtleCrypto) ────────────────────────────────────────────────
async function verifyHmac(token: string, secret: string, alg: string): Promise<boolean> {
  const hashMap: Record<string, string> = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" }
  const hash = hashMap[alg]
  if (!hash) throw new Error(`Algorithm ${alg} is not HMAC — use HS256, HS384, or HS512 for HMAC verification.`)
  const parts = token.split(".")
  if (parts.length !== 3) throw new Error("Invalid token structure.")
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash },
    false, ["verify"]
  )
  const data = enc.encode(`${parts[0]}.${parts[1]}`)
  const sig = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))
  return crypto.subtle.verify("HMAC", key, sig, data)
}

// ── Claim row component ───────────────────────────────────────────────────────
function ClaimRow({ k, v, nowSec }: { k: string; v: unknown; nowSec: number }) {
  const [tip, setTip] = useState(false)
  const doc = CLAIM_DOCS[k]
  const isTimestamp = (k === "exp" || k === "nbf" || k === "iat") && typeof v === "number"

  return (
    <div className="flex items-start gap-2 rounded-lg border border-gray-100 bg-white p-3 text-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <code className="font-mono font-bold text-blue-700">{k}</code>
          {doc && (
            <button
              onClick={() => setTip((t) => !t)}
              className="text-gray-400 hover:text-gray-700"
              aria-label={`What is ${k}?`}
              title={doc.desc}
            >
              <Info className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {doc && (
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              {doc.name}
            </span>
          )}
          {k === "exp" && typeof v === "number" && (() => {
            const { label, expired } = formatCountdown(v)
            return (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${expired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {label}
              </span>
            )
          })()}
        </div>
        {tip && doc && (
          <p className="mt-1 text-xs text-black  dark:text-white">{doc.desc}</p>
        )}
        <div className="mt-1 font-mono text-xs text-gray-700 break-all">
          {isTimestamp ? (
            <span>{String(v)} <span className="text-gray-400 font-sans">→ {formatUnix(v as number)}</span></span>
          ) : (
            <span>{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function JWTDecoderPage() {
  const [token, setToken] = useState("")
  const [secret, setSecret] = useState("")
  const [verifyResult, setVerifyResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [tab, setTab] = useState<"decode" | "verify">("decode")
  const [copiedHeader, setCopiedHeader] = useState(false)
  const [copiedPayload, setCopiedPayload] = useState(false)
  const id = useId()
  const nowSec = Math.floor(Date.now() / 1000)

  // ── Decode ──────────────────────────────────────────────────────────────────
  const decoded = useMemo(() => {
    if (!token.trim()) return null
    try {
      const parts = token.trim().split(".")
      if (parts.length !== 3) return { error: "A JWT must have exactly 3 parts separated by dots." }
      const headerObj = JSON.parse(decodeBase64Url(parts[0]))
      const payloadObj = JSON.parse(decodeBase64Url(parts[1]))
      return { header: headerObj, payload: payloadObj, sig: parts[2] }
    } catch {
      return { error: "Invalid or malformed JWT — check the token string." }
    }
  }, [token])

  const algKey = decoded && !("error" in decoded) ? decoded.header?.alg ?? "" : ""
  const algDoc = ALG_DOCS[algKey]
  const isAlgNone = algKey.toLowerCase() === "none"
  const expClaim = decoded && !("error" in decoded) ? decoded.payload?.exp : undefined
  const isExpired = typeof expClaim === "number" && expClaim < nowSec
  const isHmac = ["HS256", "HS384", "HS512"].includes(algKey)

  const copy = async (text: string, setDone: (v: boolean) => void) => {
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000) } catch { }
  }

  const handleVerify = useCallback(async () => {
    if (!token || !secret) return
    setVerifying(true)
    setVerifyResult(null)
    try {
      const ok = await verifyHmac(token.trim(), secret, algKey)
      setVerifyResult({ ok, msg: ok ? "Signature is valid." : "Signature does NOT match — token may be tampered." })
    } catch (e) {
      setVerifyResult({ ok: false, msg: (e as Error).message })
    } finally {
      setVerifying(false)
    }
  }, [token, secret, algKey])

  return (
    <>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">

        {/* Tab bar */}
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
          {(["decode", "verify"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-white text-black  dark:text-white shadow-sm" : "text-black  dark:text-white hover:text-gray-700"}`}
            >
              {t === "decode" ? "Decode" : "Verify Signature"}
            </button>
          ))}
        </div>

        {/* Token input */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <Label htmlFor={`${id}-token`} className="text-sm font-bold text-black  dark:text-white">
              JWT token
            </Label>
            <Button variant="ghost" size="sm" onClick={() => { setToken(""); setVerifyResult(null) }} disabled={!token} className="h-7 gap-1 text-xs text-gray-400 hover:text-red-500">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear
            </Button>
          </div>
          <Textarea
            id={`${id}-token`}
            placeholder="Paste your JWT here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            value={token}
            onChange={(e) => { setToken(e.target.value); setVerifyResult(null) }}
            className="min-h-[100px] font-mono text-xs break-all"
            spellCheck={false}
            aria-label="JWT input"
          />
        </div>

        {/* Error */}
        {decoded && "error" in decoded && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{decoded.error}</AlertDescription>
          </Alert>
        )}

        {decoded && !("error" in decoded) && (
          <>
            {/* ── alg:none warning ── */}
            {isAlgNone && (
              <Alert className="border-red-300 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" aria-hidden="true" />
                <AlertDescription className="text-red-800 font-semibold">
                  alg:none — This token has NO signature. It cannot be trusted. The alg:none attack allows anyone to forge tokens without a secret key. Never accept alg:none tokens in production (CVE-2015-9235).
                </AlertDescription>
              </Alert>
            )}

            {/* ── Expiry banner ── */}
            {typeof expClaim === "number" && (
              <div className={`flex items-center gap-3 rounded-xl border p-4 ${isExpired ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                {isExpired
                  ? <XCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                  : <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />}
                <div>
                  <p className={`text-sm font-bold ${isExpired ? "text-red-800" : "text-green-800"}`}>
                    {isExpired ? "Token has expired" : "Token is valid (not expired)"}
                  </p>
                  <p className="text-xs text-black  dark:text-white mt-0.5">
                    {isExpired ? `Expired ${formatUnix(expClaim)}` : formatCountdown(expClaim).label + ` · ${formatUnix(expClaim)}`}
                  </p>
                </div>
              </div>
            )}

            {/* ── Algorithm info ── */}
            {algDoc && (
              <div className={`flex items-start gap-3 rounded-xl border p-4 ${!algDoc.safe ? "border-red-200 bg-red-50" : "border-blue-100 bg-blue-50"}`}>
                <Info className={`h-4 w-4 mt-0.5 shrink-0 ${!algDoc.safe ? "text-red-600" : "text-black  dark:text-white"}`} aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-black  dark:text-white">
                    Algorithm: <code className="font-mono">{algKey}</code> <span className="font-normal text-black  dark:text-white">({algDoc.type})</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{algDoc.desc}</p>
                </div>
              </div>
            )}

            {/* ── Decode tab ── */}
            {tab === "decode" && (
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Header */}
                <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="JWT Header">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-black  dark:text-white">Header</h2>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => copy(JSON.stringify(decoded.header, null, 2), setCopiedHeader)}>
                      {copiedHeader ? <><Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" /> Copied</> : <><Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy JSON</>}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(decoded.header).map(([k, v]) => (
                      <ClaimRow key={k} k={k} v={v} nowSec={nowSec} />
                    ))}
                  </div>
                </section>

                {/* Payload */}
                <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="JWT Payload">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-black  dark:text-white">Payload <span className="font-normal text-gray-400 text-xs">(claims)</span></h2>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => copy(JSON.stringify(decoded.payload, null, 2), setCopiedPayload)}>
                      {copiedPayload ? <><Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" /> Copied</> : <><Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy JSON</>}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(decoded.payload).map(([k, v]) => (
                      <ClaimRow key={k} k={k} v={v} nowSec={nowSec} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ── Verify tab ── */}
            {tab === "verify" && (
              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-1 text-sm font-bold text-black  dark:text-white">Verify HMAC signature</h2>
                <p className="mb-4 text-xs text-black  dark:text-white">
                  Works for HS256, HS384, HS512 tokens only. Paste your HMAC secret — verification runs entirely in your browser via SubtleCrypto. The secret is never sent anywhere.
                </p>

                {!isHmac && (
                  <Alert className="mb-4 border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                    <AlertDescription className="text-xs text-amber-800">
                      This token uses <strong>{algKey}</strong> (not HMAC). HMAC verification only works for HS256/HS384/HS512. For RSA/ECDSA tokens, verify on your backend using the public key.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor={`${id}-secret`} className="mb-1.5 block text-xs font-semibold text-gray-700">
                      HMAC secret
                    </Label>
                    <Input
                      id={`${id}-secret`}
                      type="password"
                      placeholder="your-secret-key"
                      value={secret}
                      onChange={(e) => { setSecret(e.target.value); setVerifyResult(null) }}
                      className="font-mono text-sm"
                      aria-label="HMAC secret for signature verification"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleVerify} disabled={!secret || !isHmac || verifying} className="gap-2">
                      <Lock className="h-4 w-4" aria-hidden="true" />
                      {verifying ? "Verifying…" : "Verify"}
                    </Button>
                  </div>
                </div>

                {verifyResult && (
                  <div className={`mt-4 flex items-center gap-3 rounded-lg border p-4 ${verifyResult.ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                    {verifyResult.ok
                      ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
                      : <XCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />}
                    <p className={`text-sm font-semibold ${verifyResult.ok ? "text-green-800" : "text-red-800"}`}>
                      {verifyResult.msg}
                    </p>
                  </div>
                )}

                <Alert className="mt-5 border-amber-200 bg-amber-50">
                  <Shield className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  <AlertDescription className="text-xs text-amber-800">
                    Never enter production secrets into browser tools for anything other than debugging. Your HMAC secret stays local — it is processed in memory by the browser's SubtleCrypto API and is not transmitted.
                  </AlertDescription>
                </Alert>
              </section>
            )}

            {/* Security note */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Shield className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Decode ≠ Verify.</strong> This tool decodes the base64url encoding to make claims readable. It does not validate the signature unless you use the Verify tab. Always validate signatures on your backend before trusting any claim.
              </p>
            </div>
          </>
        )}

        {/* Standard claims reference */}
        <section className="mt-4 border-t border-gray-100 pt-8" aria-labelledby="claims-ref-heading">
          <h2 id="claims-ref-heading" className="mb-5 text-lg font-bold text-black  dark:text-white">Standard JWT claim reference</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CLAIM_DOCS).map(([k, { name, desc }]) => (
              <div key={k} className="rounded-lg border border-gray-100 bg-white p-3">
                <div className="flex items-center gap-2 mb-1">
                  <code className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-xs font-bold text-blue-700">{k}</code>
                  <span className="text-xs font-semibold text-gray-600">{name}</span>
                </div>
                <p className="text-xs text-gray-400 leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Algorithm comparison */}
        <section className="border-t border-gray-100 pt-8" aria-labelledby="alg-ref-heading">
          <h2 id="alg-ref-heading" className="mb-4 text-lg font-bold text-black  dark:text-white">JWT algorithm comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-black  dark:text-white uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Algorithm</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Use case</th>
                  <th className="px-4 py-3 text-left">Safe?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(ALG_DOCS).map(([alg, { type, desc, safe }]) => (
                  <tr key={alg} className={`${alg === algKey ? "bg-blue-50" : "bg-white"}`}>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{alg}</td>
                    <td className="px-4 py-3 text-gray-600">{type}</td>
                    <td className="px-4 py-3 text-black  dark:text-white text-xs max-w-xs">{desc}</td>
                    <td className="px-4 py-3">
                      {safe
                        ? <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Yes</span>
                        : <span className="inline-flex items-center gap-1 text-red-700 text-xs font-semibold"><XCircle className="h-3.5 w-3.5" aria-hidden="true" /> Dangerous</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  )
}
