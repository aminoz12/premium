"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Activity,
  Globe,
  Loader2,
  Play,
  RefreshCw,
  Signal,
  Waves,
  Zap,
} from "lucide-react"
import { ToolCard } from "@/components/layout/tool-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { normalizePublicHttpUrl } from "@/lib/security"

type ConnectionSnapshot = {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

type WifiMetrics = {
  downloadMbps: number
  uploadMbps: number
  pingMs: number
  jitterMs: number
  downloadBytes: number
  uploadBytes: number
}

type TestPhase =
  | "idle"
  | "starting"
  | "ping"
  | "download"
  | "upload"
  | "complete"

function nativeSelectClasses() {
  return "mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
}

function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((total, value) => total + value, 0) / values.length
}

function calculateJitter(values: number[]) {
  if (values.length < 2) return 0
  const mean = average(values)
  const variance = average(values.map((value) => (value - mean) ** 2))
  return Math.sqrt(variance)
}

function formatMbps(value: number) {
  return value.toFixed(2)
}

function formatMs(value: number) {
  return Math.round(value).toString()
}

function classifyConnection(metrics: WifiMetrics) {
  if (
    metrics.downloadMbps >= 100 &&
    metrics.uploadMbps >= 20 &&
    metrics.pingMs <= 20
  ) {
    return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500" }
  }
  if (
    metrics.downloadMbps >= 40 &&
    metrics.uploadMbps >= 10 &&
    metrics.pingMs <= 40
  ) {
    return { label: "Good", color: "text-green-500", bg: "bg-green-500" }
  }
  if (
    metrics.downloadMbps >= 10 &&
    metrics.uploadMbps >= 3 &&
    metrics.pingMs <= 80
  ) {
    return { label: "Fair", color: "text-yellow-500", bg: "bg-yellow-500" }
  }
  return { label: "Poor", color: "text-red-500", bg: "bg-red-500" }
}

function describeUseCases(metrics: WifiMetrics) {
  if (metrics.downloadMbps >= 100 && metrics.uploadMbps >= 20) {
    return [
      "4K streaming",
      "large downloads",
      "competitive gaming",
      "HD video calls",
    ]
  }
  if (metrics.downloadMbps >= 40 && metrics.uploadMbps >= 10) {
    return [
      "HD streaming",
      "remote work",
      "cloud backups",
      "video meetings",
    ]
  }
  if (metrics.downloadMbps >= 10 && metrics.uploadMbps >= 3) {
    return [
      "web browsing",
      "music streaming",
      "standard video calls",
      "light uploads",
    ]
  }
  return [
    "email",
    "basic browsing",
    "messaging",
    "small file downloads",
  ]
}

async function runDownloadBenchmark(bytes: number) {
  const startedAt = performance.now()
  const response = await fetch(
    `/api/network/benchmark?bytes=${bytes}&nonce=${Date.now()}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error(
      "The download benchmark route did not respond successfully."
    )
  }

  const payload = await response.arrayBuffer()
  const elapsedMs = performance.now() - startedAt

  return {
    elapsedMs,
    bytes: payload.byteLength,
    mbps:
      (payload.byteLength * 8) /
      (Math.max(elapsedMs, 1) / 1000) /
      1_000_000,
  }
}

async function runUploadBenchmark(bytes: number) {
  const payload = new Uint8Array(bytes)

  for (let index = 0; index < payload.length; index += 1) {
    payload[index] = (index * 13 + 29) % 251
  }

  const startedAt = performance.now()
  const response = await fetch("/api/network/benchmark", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/octet-stream" },
    body: payload,
  })

  if (!response.ok) {
    throw new Error(
      "The upload benchmark route did not respond successfully."
    )
  }

  const result = (await response.json()) as { receivedBytes?: number }
  const elapsedMs = performance.now() - startedAt
  const transferredBytes = result.receivedBytes || bytes

  return {
    elapsedMs,
    bytes: transferredBytes,
    mbps:
      (transferredBytes * 8) /
      (Math.max(elapsedMs, 1) / 1000) /
      1_000_000,
  }
}

async function runPingSeries(
  url: string,
  runs: number,
  mode: RequestMode = "cors"
) {
  const values: number[] = []

  for (let attempt = 0; attempt < runs; attempt += 1) {
    const separator = url.includes("?") ? "&" : "?"
    const pingUrl = `${url}${separator}pingRun=${attempt + 1}&nonce=${Date.now()}`
    const startedAt = performance.now()
    await fetch(pingUrl, { cache: "no-store", mode })
    values.push(performance.now() - startedAt)
  }

  return values
}

function getConnectionSnapshot(): ConnectionSnapshot | null {
  if (typeof navigator === "undefined") return null

  const connection = (
    navigator as Navigator & { connection?: ConnectionSnapshot }
  ).connection

  if (!connection) return null

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  }
}

/* ────────────────────────────────────────────────────────────── */
/*  Animated counter – car-counter / odometer style              */
/* ────────────────────────────────────────────────────────────── */

function AnimatedCounter({
  value,
  duration = 1200,
}: {
  value: number
  duration?: number
}) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<{ time: number; from: number } | null>(null)

  useEffect(() => {
    const from = display
    startRef.current = { time: performance.now(), from }

    const tick = (now: number) => {
      if (!startRef.current) return
      const elapsed = now - startRef.current.time
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(startRef.current.from + (value - startRef.current.from) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return <>{display.toFixed(2)}</>
}

/* ────────────────────────────────────────────────────────────── */
/*  Speedometer gauge (SVG)                                      */
/* ────────────────────────────────────────────────────────────── */

function SpeedGauge({
  value,
  max,
  label,
  unit,
  icon: Icon,
  accentClass,
  phase,
  active,
}: {
  value: number
  max: number
  label: string
  unit: string
  icon: React.ElementType
  accentClass: string
  phase: TestPhase
  active: boolean
}) {
  const radius = 70
  const stroke = 10
  const normalizedRadius = radius - stroke / 2
  const circumference = Math.PI * normalizedRadius // half circle
  const clamped = Math.min(value, max)
  const progress = max > 0 ? clamped / max : 0
  const offset = circumference * (1 - progress)

  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl border p-6 transition-all duration-500 ${active
          ? "border-primary/40 shadow-lg shadow-primary/5 scale-[1.02]"
          : "bg-muted/10"
        }`}
    >
      {/* pulse ring while active */}
      {active && (
        <span className="absolute -inset-px animate-pulse rounded-2xl border border-primary/20" />
      )}

      <svg
        width={radius * 2}
        height={radius + 10}
        className="overflow-visible"
      >
        {/* track */}
        <path
          d={`M ${stroke / 2},${radius} A ${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke / 2},${radius}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/30"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d={`M ${stroke / 2},${radius} A ${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - stroke / 2},${radius}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={accentClass}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-4xl font-bold tabular-nums tracking-tighter">
          <AnimatedCounter value={Number(value.toFixed(2))} />
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {unit}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      {active && phase !== "complete" && (
        <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  Phase stepper                                                 */
/* ────────────────────────────────────────────────────────────── */

const phases: { key: TestPhase; label: string }[] = [
  { key: "ping", label: "Ping" },
  { key: "download", label: "Download" },
  { key: "upload", label: "Upload" },
]

function PhaseStepper({ current }: { current: TestPhase }) {
  const idx = phases.findIndex((p) => p.key === current)

  return (
    <div className="flex items-center justify-center gap-2">
      {phases.map((p, i) => {
        const done = current === "complete" || (idx >= 0 && i < idx)
        const active = p.key === current

        return (
          <div key={p.key} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500 ${done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-primary/20 text-primary ring-2 ring-primary/40"
                    : "bg-muted text-muted-foreground"
                }`}
            >
              {done ? "✓" : i + 1}
            </div>
            <span
              className={`text-sm font-medium ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              {p.label}
            </span>
            {i < phases.length - 1 && (
              <div
                className={`mx-1 h-px w-8 transition-colors duration-500 ${done ? "bg-primary" : "bg-muted"
                  }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  Main component                                                */
/* ────────────────────────────────────────────────────────────── */

export default function DataTools({ toolId }: { toolId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [wifiMetrics, setWifiMetrics] = useState<WifiMetrics | null>(null)
  const [phase, setPhase] = useState<TestPhase>("idle")
  const [liveDownload, setLiveDownload] = useState(0)
  const [liveUpload, setLiveUpload] = useState(0)
  const [livePing, setLivePing] = useState(0)
  const [liveJitter, setLiveJitter] = useState(0)

  const [pingTargetMode, setPingTargetMode] = useState<
    "same-origin" | "custom"
  >("same-origin")
  const [pingTarget, setPingTarget] = useState("https://example.com")
  const [pingSamples, setPingSamples] = useState<number[]>([])
  const [connectionSnapshot, setConnectionSnapshot] =
    useState<ConnectionSnapshot | null>(null)

  const hasRun = useRef(false)

  const connectionInfo = useMemo(() => {
    if (!wifiMetrics) return null
    return classifyConnection(wifiMetrics)
  }, [wifiMetrics])

  const wifiUseCases = useMemo(() => {
    if (!wifiMetrics) return []
    return describeUseCases(wifiMetrics)
  }, [wifiMetrics])

  /* ── WiFi speed test runner ── */

  const runWifiBenchmark = useCallback(async () => {
    setLoading(true)
    setError("")
    setWifiMetrics(null)
    setLiveDownload(0)
    setLiveUpload(0)
    setLivePing(0)
    setLiveJitter(0)

    try {
      // Phase 1 – Ping
      setPhase("ping")
      const latencySamples = await runPingSeries(
        "/api/network/benchmark?bytes=4096",
        5
      )
      const avgPing = average(latencySamples)
      const jitter = calculateJitter(latencySamples)
      setLivePing(avgPing)
      setLiveJitter(jitter)

      // Phase 2 – Download
      setPhase("download")
      const downloadSmall = await runDownloadBenchmark(512 * 1024)
      setLiveDownload(downloadSmall.mbps)
      const downloadLarge = await runDownloadBenchmark(2 * 1024 * 1024)
      const avgDownload = average([downloadSmall.mbps, downloadLarge.mbps])
      setLiveDownload(avgDownload)

      // Phase 3 – Upload
      setPhase("upload")
      const uploadResult = await runUploadBenchmark(768 * 1024)
      setLiveUpload(uploadResult.mbps)

      // Done
      setPhase("complete")
      setWifiMetrics({
        downloadMbps: avgDownload,
        uploadMbps: uploadResult.mbps,
        pingMs: avgPing,
        jitterMs: jitter,
        downloadBytes: downloadSmall.bytes + downloadLarge.bytes,
        uploadBytes: uploadResult.bytes,
      })
      setConnectionSnapshot(getConnectionSnapshot())
    } catch (benchmarkError) {
      setError(
        benchmarkError instanceof Error
          ? benchmarkError.message
          : "The WiFi speed test could not complete."
      )
      setPhase("idle")
    } finally {
      setLoading(false)
    }
  }, [])

  /* ── Auto-run on mount ── */

  useEffect(() => {
    if (toolId === "wifi-speed-test" && !hasRun.current) {
      hasRun.current = true
      runWifiBenchmark()
    }
  }, [toolId, runWifiBenchmark])

  /* ────────────────────────────────────────────────────── */
  /*  WiFi Speed Test UI                                    */
  /* ────────────────────────────────────────────────────── */

  if (toolId === "wifi-speed-test") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <ToolCard title="WiFi Speed Test">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-2xl text-sm text-muted-foreground">
              Browser-safe benchmark measuring download, upload, ping &amp;
              jitter against same-origin payloads. The test starts
              automatically — hit the button to re-run.
            </p>
            <Button
              onClick={runWifiBenchmark}
              disabled={loading}
              size="lg"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {loading ? "Testing…" : wifiMetrics ? "Re-run" : "Start Test"}
            </Button>
          </div>
        </ToolCard>

        {/* Phase stepper */}
        {phase !== "idle" && (
          <div className="flex justify-center">
            <PhaseStepper current={phase} />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Live gauges – always visible after start */}
        {phase !== "idle" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SpeedGauge
              value={liveDownload}
              max={200}
              label="Download"
              unit="Mbps"
              icon={ArrowDown}
              accentClass="text-blue-500"
              phase={phase}
              active={phase === "download"}
            />
            <SpeedGauge
              value={liveUpload}
              max={100}
              label="Upload"
              unit="Mbps"
              icon={ArrowUp}
              accentClass="text-violet-500"
              phase={phase}
              active={phase === "upload"}
            />
            <SpeedGauge
              value={livePing}
              max={200}
              label="Ping"
              unit="ms"
              icon={Activity}
              accentClass="text-amber-500"
              phase={phase}
              active={phase === "ping"}
            />
            <SpeedGauge
              value={liveJitter}
              max={100}
              label="Jitter"
              unit="ms"
              icon={Zap}
              accentClass="text-rose-500"
              phase={phase}
              active={phase === "ping"}
            />
          </div>
        )}

        {/* Results – shown after completion */}
        {wifiMetrics && phase === "complete" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Connection quality */}
            <ToolCard title="Connection Quality">
              <div className="space-y-5">
                <div className="flex items-center gap-4 rounded-2xl border bg-background p-5">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${connectionInfo?.bg}/15`}
                  >
                    <Signal
                      className={`h-7 w-7 ${connectionInfo?.color}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Overall rating
                    </p>
                    <p
                      className={`text-3xl font-bold tracking-tight ${connectionInfo?.color}`}
                    >
                      {connectionInfo?.label}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">
                    Great for
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {wifiUseCases.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Raw numbers */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border p-3">
                    <span className="text-muted-foreground">
                      Downloaded
                    </span>
                    <p className="mt-1 font-semibold">
                      {(
                        wifiMetrics.downloadBytes /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <span className="text-muted-foreground">
                      Uploaded
                    </span>
                    <p className="mt-1 font-semibold">
                      {(
                        wifiMetrics.uploadBytes /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
              </div>
            </ToolCard>

            {/* Browser network signals */}
            <ToolCard title="Browser Network Signals">
              {connectionSnapshot ? (
                <div className="space-y-3 text-sm">
                  {[
                    {
                      label: "Effective type",
                      value:
                        connectionSnapshot.effectiveType || "Unavailable",
                    },
                    {
                      label: "Estimated downlink",
                      value: connectionSnapshot.downlink
                        ? `${connectionSnapshot.downlink} Mbps`
                        : "Unavailable",
                    },
                    {
                      label: "Browser RTT hint",
                      value:
                        typeof connectionSnapshot.rtt === "number"
                          ? `${connectionSnapshot.rtt} ms`
                          : "Unavailable",
                    },
                    {
                      label: "Data saver",
                      value: connectionSnapshot.saveData
                        ? "Enabled"
                        : "Disabled or unavailable",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 rounded-xl border p-3"
                    >
                      <span className="text-muted-foreground">
                        {row.label}
                      </span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your browser does not expose the Network Information API,
                  so only the live benchmark results are shown.
                </p>
              )}
            </ToolCard>
          </div>
        )}
      </div>
    )
  }

  /* ────────────────────────────────────────────────────── */
  /*  Ping Test UI                                          */
  /* ────────────────────────────────────────────────────── */

  const runPingBenchmark = async () => {
    setLoading(true)
    setError("")

    try {
      const targetUrl =
        pingTargetMode === "same-origin"
          ? "/api/network/benchmark?bytes=4096"
          : normalizePublicHttpUrl(pingTarget).url
      const normalized =
        pingTargetMode === "same-origin"
          ? { error: "" }
          : normalizePublicHttpUrl(pingTarget)

      if (normalized.error) throw new Error(normalized.error)

      const samples = await runPingSeries(
        targetUrl,
        5,
        pingTargetMode === "same-origin" ? "same-origin" : "no-cors"
      )
      setPingSamples(samples)
    } catch (pingError) {
      setError(
        pingError instanceof Error
          ? pingError.message
          : "The ping test could not be completed."
      )
      setPingSamples([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ToolCard title="Ping Test">
        <div className="space-y-4">
          <div>
            <Label>Target mode</Label>
            <select
              value={pingTargetMode}
              onChange={(event) =>
                setPingTargetMode(
                  event.target.value as "same-origin" | "custom"
                )
              }
              className={nativeSelectClasses()}
            >
              <option value="same-origin">
                Current site benchmark
              </option>
              <option value="custom">Custom public URL</option>
            </select>
          </div>

          {pingTargetMode === "custom" ? (
            <div>
              <Label>Public HTTPS URL</Label>
              <Input
                value={pingTarget}
                onChange={(event) => setPingTarget(event.target.value)}
                placeholder="https://example.com"
                className="mt-2"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Some sites block cross-origin timing in the browser. When
                that happens, test the current site benchmark instead.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              The same-origin benchmark gives the most reliable
              browser-side latency reading for your deployed domain.
            </p>
          )}

          <Button
            onClick={runPingBenchmark}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Run Ping Test
          </Button>
        </div>
      </ToolCard>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pingSamples.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Latency Summary">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Average",
                  value: formatMs(average(pingSamples)),
                  unit: "ms",
                  helper: "Across 5 requests",
                },
                {
                  label: "Best",
                  value: formatMs(Math.min(...pingSamples)),
                  unit: "ms",
                  helper: "Fastest request",
                },
                {
                  label: "Jitter",
                  value: formatMs(calculateJitter(pingSamples)),
                  unit: "ms",
                  helper: "Variation between runs",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border bg-muted/20 p-4"
                >
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
                    {stat.value}
                    <span className="ml-1 text-base font-medium text-muted-foreground">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.helper}
                  </p>
                </div>
              ))}
            </div>
          </ToolCard>

          <ToolCard title="Per-request Results">
            <div className="space-y-3">
              {pingSamples.map((sample, index) => (
                <div
                  key={`${sample}-${index}`}
                  className="flex items-center justify-between rounded-xl border p-3 text-sm"
                >
                  <span className="flex items-center gap-2 font-medium">
                    {pingTargetMode === "same-origin" ? (
                      <Waves className="h-4 w-4" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    Attempt {index + 1}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatMs(sample)} ms
                  </span>
                </div>
              ))}
            </div>
          </ToolCard>
        </div>
      )}
    </div>
  )
}
