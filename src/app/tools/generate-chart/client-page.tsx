"use client"

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  Download,
  BarChart3,
  AlertCircle,
  Upload,
  FileJson,
  FileText,
  Trash2,
  Settings2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  FileCode2,
  Table2,
  Info,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  BubbleController,
  ScatterController,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
  type ChartType as CJSChartType,
} from "chart.js"
import { Chart } from "react-chartjs-2"

// ─── Register ChartJS ────────────────────────────────────────────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  BubbleController,
  ScatterController,
  Title,
  Tooltip,
  Legend,
  Filler
)

// ─── Types ───────────────────────────────────────────────────────────────────
type AppChartType =
  | "bar"
  | "horizontalBar"
  | "stackedBar"
  | "line"
  | "area"
  | "pie"
  | "doughnut"
  | "radar"
  | "polarArea"
  | "scatter"

type ColorPalette =
  | "vibrant"
  | "pastel"
  | "ocean"
  | "sunset"
  | "forest"
  | "neon"
  | "corporate"
  | "mono"

type ExportFormat = "png" | "svg" | "json" | "csv"
type InputMode = "text" | "table"

interface ParsedDataset {
  label: string
  data: (number | { x: number; y: number })[]
}

interface ParsedResult {
  labels: string[]
  datasets: ParsedDataset[]
}

interface ChartJSDataset {
  label: string
  data: (number | { x: number; y: number })[]
  backgroundColor: string | string[]
  borderColor: string | string[]
  borderWidth: number
  fill: boolean
  tension: number
  pointRadius: number
  pointHoverRadius: number
}

interface ChartJSData {
  labels: string[]
  datasets: ChartJSDataset[]
}

interface ExportButtonDef {
  fmt: ExportFormat
  label: string
  icon: React.ReactNode
}

interface ToggleDef {
  id: string
  label: string
  val: boolean
  set: React.Dispatch<React.SetStateAction<boolean>>
}

// ─── Constants ───────────────────────────────────────────────────────────────
const COPY_FEEDBACK_MS = 1800
const ANIMATION_STAGGER_MS = 40

const PALETTES: Record<ColorPalette, string[]> = {
  vibrant: ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6", "#f43f5e", "#14b8a6"],
  pastel: ["#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#67e8f9", "#c084fc", "#fb7185", "#5eead4"],
  ocean: ["#0284c7", "#0369a1", "#075985", "#0c4a6e", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe"],
  sunset: ["#f43f5e", "#e11d48", "#be123c", "#f97316", "#ea580c", "#c2410c", "#fcd34d", "#fbbf24"],
  forest: ["#059669", "#047857", "#065f46", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#86efac"],
  neon: ["#39ff14", "#ff00ff", "#00ffff", "#ffff00", "#ff4500", "#1e90ff", "#ff9900", "#9900ff"],
  corporate: ["#1d4ed8", "#0891b2", "#7c3aed", "#be185d", "#b45309", "#047857", "#1e40af", "#6d28d9"],
  mono: ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"],
}

const CHART_TYPE_OPTIONS: { value: AppChartType; label: string }[] = [
  { value: "bar", label: "Bar Chart" },
  { value: "horizontalBar", label: "Horizontal Bar" },
  { value: "stackedBar", label: "Stacked Bar" },
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "doughnut", label: "Doughnut" },
  { value: "radar", label: "Radar Chart" },
  { value: "polarArea", label: "Polar Area" },
  { value: "scatter", label: "Scatter Plot" },
]

const CIRCULAR_TYPES = new Set<AppChartType>(["pie", "doughnut", "polarArea"])

const SAMPLE_CSV = `Month,Revenue,Profit,Expenses
January,15000,4500,10500
February,18000,5200,12800
March,22000,7100,14900
April,19500,6000,13500
May,25000,8500,16500
June,28000,9800,18200`

const SAMPLE_JSON = `[
  {"Month":"January","Revenue":15000,"Profit":4500,"Expenses":10500},
  {"Month":"February","Revenue":18000,"Profit":5200,"Expenses":12800},
  {"Month":"March","Revenue":22000,"Profit":7100,"Expenses":14900},
  {"Month":"April","Revenue":19500,"Profit":6000,"Expenses":13500},
  {"Month":"May","Revenue":25000,"Profit":8500,"Expenses":16500},
  {"Month":"June","Revenue":28000,"Profit":9800,"Expenses":18200}
]`

const SAMPLE_SCATTER = `x,y,label
10,20,A
15,35,B
25,18,C
30,45,D
40,30,E
50,55,F
60,40,G`

export const CHART_TOOL_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I create a chart for free online?",
    a: "Paste your CSV or JSON data into the input field, choose a chart type, and your chart renders instantly — no signup required.",
  },
  {
    q: "What file formats can I export my chart to?",
    a: "You can export as PNG (raster image), SVG (vector, scalable), JSON (Chart.js config for developers), or download your data back as CSV.",
  },
  {
    q: "What chart types are supported?",
    a: "Bar, Horizontal Bar, Stacked Bar, Line, Area, Pie, Doughnut, Radar, Polar Area, and Scatter charts are all supported.",
  },
  {
    q: "Does this chart maker work with Excel data?",
    a: "Yes — copy any Excel table data and paste it as CSV (comma or tab-separated). The tool auto-detects columns and builds the chart.",
  },
  {
    q: "Is my data private?",
    a: "Fully. All processing happens in your browser — no data is ever uploaded to any server.",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function parseInputData(raw: string): ParsedResult {
  if (!raw.trim()) throw new Error("No data provided.")

  const trimmed = raw.trim()

  // JSON branch
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed: unknown = JSON.parse(trimmed)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("JSON must be a non-empty array of objects.")
    }
    const rows = parsed as Record<string, unknown>[]
    const headers = Object.keys(rows[0])
    if (headers.length < 2) throw new Error("JSON objects must have at least two keys.")

    if (headers.includes("x") && headers.includes("y")) {
      return {
        labels: rows.map((_, i) => `Point ${i + 1}`),
        datasets: [{
          label: "Data",
          data: rows.map((r) => ({ x: Number(r.x), y: Number(r.y) })),
        }],
      }
    }

    return {
      labels: rows.map((r) => String(r[headers[0]])),
      datasets: headers.slice(1).map((h) => ({
        label: h,
        data: rows.map((r) => {
          const v = parseFloat(String(r[h]))
          return isNaN(v) ? 0 : v
        }),
      })),
    }
  }

  // CSV / TSV branch
  const separator = trimmed.includes("\t") ? "\t" : ","
  const lines = trimmed
    .split("\n")
    .map((l) => l.split(separator).map((c) => c.trim()))
    .filter((l) => l.length > 0 && l.some((c) => c !== ""))

  if (lines.length < 2) throw new Error("CSV needs a header row and at least one data row.")
  const headers = lines[0]
  if (headers.length < 2) throw new Error("CSV needs at least two columns.")

  if (
    headers[0].toLowerCase() === "x" &&
    headers[1].toLowerCase() === "y"
  ) {
    return {
      labels: lines.slice(1).map((_, i) => `Point ${i + 1}`),
      datasets: [{
        label: headers[2] ?? "Data",
        data: lines.slice(1).map((row) => ({
          x: parseFloat(row[0]) || 0,
          y: parseFloat(row[1]) || 0,
        })),
      }],
    }
  }

  return {
    labels: lines.slice(1).map((r) => r[0]),
    datasets: headers.slice(1).map((h, ci) => ({
      label: h,
      data: lines.slice(1).map((r) => {
        const v = parseFloat(r[ci + 1])
        return isNaN(v) ? 0 : v
      }),
    })),
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function EmptyChartState() {
  return (
    <div className="flex flex-col items-center gap-4 p-12 text-muted-foreground/50">
      <div className="relative">
        <BarChart3 className="h-16 w-16" style={{ animation: "pulseSoft 2.4s ease-in-out infinite" }} aria-hidden />
        <Sparkles
          className="h-5 w-5 text-primary/40 absolute -top-1 -right-1"
          style={{ animation: "pulseSoft 2.4s ease-in-out 0.6s infinite" }}
          aria-hidden
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm">No chart data</p>
        <p className="text-xs mt-1 max-w-xs leading-relaxed">
          Paste valid CSV or JSON, or click a sample button to preview a chart instantly.
        </p>
      </div>
    </div>
  )
}

interface ExportButtonProps {
  def: ExportButtonDef
  disabled: boolean
  onExport: (fmt: ExportFormat) => void
  copied: boolean
}

function ExportButton({ def, disabled, onExport, copied }: ExportButtonProps) {
  const isActive = copied && def.fmt === "png"
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => onExport(def.fmt)}
      className="h-7 text-xs gap-1.5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      aria-label={`Export chart as ${def.label}`}
    >
      {isActive
        ? <><CheckCircle2 className="h-3 w-3 text-emerald-500" aria-hidden /> Saved!</>
        : <>{def.icon} {def.label}</>
      }
    </Button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ToolClient() {
  // — Input
  const [inputData, setInputData] = useState(SAMPLE_CSV)
  const [inputMode, setInputMode] = useState<InputMode>("text")

  // — Chart config
  const [chartType, setChartType] = useState<AppChartType>("bar")
  const [palette, setPalette] = useState<ColorPalette>("vibrant")
  const [chartTitle, setChartTitle] = useState("")
  const [xLabel, setXLabel] = useState("")
  const [yLabel, setYLabel] = useState("")
  const [showLegend, setShowLegend] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [fillArea, setFillArea] = useState(true)
  const [darkChart, setDarkChart] = useState(false)
  const [showConfigPanel, setShowConfigPanel] = useState(true)

  // — Table editor
  const [tableData, setTableData] = useState<string[][]>([])

  // — UI state
  const [fileError, setFileError] = useState("")
  const [exportCopied, setExportCopied] = useState(false)
  const [chartVisible, setChartVisible] = useState(false)

  const chartRef = useRef<ChartJS>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Animate chart in on mount
  useEffect(() => {
    const t = setTimeout(() => setChartVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // ── Parse input ─────────────────────────────────────────────────────────────
  const { parsedResult, parseError } = useMemo(() => {
    const raw = inputData.trim()
    if (!raw) return { parsedResult: null, parseError: "" }
    try {
      const result = parseInputData(raw)
      return { parsedResult: result, parseError: "" }
    } catch (e) {
      return { parsedResult: null, parseError: (e as Error).message }
    }
  }, [inputData])

  const error = fileError || parseError

  // ── Build ChartJS data ──────────────────────────────────────────────────────
  const chartJSData = useMemo((): ChartJSData | null => {
    if (!parsedResult) return null
    const { labels, datasets } = parsedResult
    const colors = PALETTES[palette]
    const isMultiColor = CIRCULAR_TYPES.has(chartType)

    const builtDatasets: ChartJSDataset[] = datasets.map((ds, ci) => {
      const col = colors[ci % colors.length]
      const bgAlpha = chartType === "area" || (chartType === "line" && fillArea) ? 0.25 : 0.82
      const backgroundColor: string | string[] = isMultiColor
        ? labels.map((_, li) => hexToRgba(colors[li % colors.length], 0.82))
        : hexToRgba(col, bgAlpha)
      const borderColor: string | string[] = isMultiColor
        ? labels.map((_, li) => colors[li % colors.length])
        : col

      return {
        label: ds.label,
        data: ds.data,
        backgroundColor,
        borderColor,
        borderWidth: 2,
        fill: chartType === "area" ? true : chartType === "line" ? fillArea : false,
        tension: 0.35,
        pointRadius: chartType === "scatter" ? 6 : 3,
        pointHoverRadius: 7,
      }
    })

    return { labels, datasets: builtDatasets }
  }, [parsedResult, palette, chartType, fillArea])

  // ── Sync table editor ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!parsedResult) return
    const trimmed = inputData.trim()
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          const keys = Object.keys(parsed[0])
          const rows = [keys, ...parsed.map((r) => keys.map((k) => String(r[k])))]
          setTableData(rows)
        }
      } catch { /* ignore */ }
    } else {
      const separator = trimmed.includes("\t") ? "\t" : ","
      const lines = trimmed.split("\n").map((l) => l.split(separator).map((c) => c.trim()))
      setTableData(lines)
    }
  }, [inputData, parsedResult])

  // ── Derived ChartJS type ────────────────────────────────────────────────────
  const cjsType = useMemo((): CJSChartType => {
    if (chartType === "horizontalBar" || chartType === "stackedBar") return "bar"
    if (chartType === "area") return "line"
    return chartType as CJSChartType
  }, [chartType])

  // ── Chart options ───────────────────────────────────────────────────────────
  const chartOptions = useMemo((): ChartOptions => {
    const textColor = darkChart ? "#e2e8f0" : "#334155"
    const gridColor = darkChart ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
    const isCircular = CIRCULAR_TYPES.has(chartType)
    const isRadar = chartType === "radar"
    const isHoriz = chartType === "horizontalBar"
    const isStacked = chartType === "stackedBar"

    const base: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          display: showLegend,
          position: "top",
          labels: {
            color: textColor,
            font: { family: "inherit", size: 12 },
            padding: 16,
          },
        },
        title: chartTitle
          ? {
            display: true,
            text: chartTitle,
            color: textColor,
            font: { family: "inherit", size: 15, weight: "bold" as const },
            padding: { bottom: 12 },
          }
          : { display: false },
        tooltip: {
          mode: isCircular || isRadar ? "point" : "index",
          intersect: false,
        },
      },
    }

    if (isCircular) return base

    if (isRadar) {
      return {
        ...base,
        scales: {
          r: {
            grid: { color: showGrid ? gridColor : "transparent" },
            ticks: { color: textColor, backdropColor: "transparent" },
            pointLabels: { color: textColor },
          },
        },
      }
    }

    return {
      ...base,
      indexAxis: isHoriz ? ("y" as const) : ("x" as const),
      scales: {
        x: {
          stacked: isStacked,
          grid: { color: showGrid ? gridColor : "transparent" },
          ticks: { color: textColor },
          title: xLabel ? { display: true, text: xLabel, color: textColor } : undefined,
        },
        y: {
          stacked: isStacked,
          grid: { color: showGrid ? gridColor : "transparent" },
          ticks: { color: textColor },
          title: yLabel ? { display: true, text: yLabel, color: textColor } : undefined,
        },
      },
    }
  }, [chartType, showLegend, showGrid, chartTitle, xLabel, yLabel, darkChart])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCellEdit = useCallback((row: number, col: number, val: string) => {
    setTableData((current) => {
      const next = current.map((r) => [...r])
      next[row][col] = val
      setInputData(next.map((r) => r.join(",")).join("\n"))
      return next
    })
  }, [])

  const handleExport = useCallback((fmt: ExportFormat) => {
    const chart = chartRef.current
    const ts = Date.now()

    if (fmt === "png") {
      if (!chart) return
      const url = chart.toBase64Image("image/png", 1)
      const a = document.createElement("a")
      a.download = `chart-${chartType}-${ts}.png`
      a.href = url
      a.click()
      setExportCopied(true)
      setTimeout(() => setExportCopied(false), COPY_FEEDBACK_MS)
      return
    }

    if (fmt === "svg") {
      if (!chart) return
      const canvas = chart.canvas
      const svgNs = "http://www.w3.org/2000/svg"
      const svg = document.createElementNS(svgNs, "svg")
      svg.setAttribute("width", String(canvas.width))
      svg.setAttribute("height", String(canvas.height))
      svg.setAttribute("xmlns", svgNs)
      const img = document.createElementNS(svgNs, "image")
      img.setAttribute("href", chart.toBase64Image())
      img.setAttribute("width", String(canvas.width))
      img.setAttribute("height", String(canvas.height))
      svg.appendChild(img)
      const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
        type: "image/svg+xml",
      })
      downloadBlob(blob, `chart-${chartType}-${ts}.svg`)
      return
    }

    if (fmt === "json") {
      const config = { type: cjsType, data: chartJSData, options: chartOptions }
      downloadBlob(
        new Blob([JSON.stringify(config, null, 2)], { type: "application/json" }),
        `chart-config-${ts}.json`
      )
      return
    }

    if (fmt === "csv") {
      downloadBlob(new Blob([inputData], { type: "text/csv" }), `chart-data-${ts}.csv`)
    }
  }, [chartType, cjsType, chartJSData, chartOptions, inputData])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setInputData(ev.target.result as string)
        setFileError("")
      }
    }
    reader.onerror = () => setFileError("Failed to read file.")
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const handleLoadSample = useCallback((sample: string) => {
    setInputData(sample)
    setFileError("")
  }, [])

  const handleClearData = useCallback(() => {
    setInputData("")
    setFileError("")
  }, [])

  const toggleConfigPanel = useCallback(() => {
    setShowConfigPanel((v) => !v)
  }, [])

  const chartBg = darkChart ? "#0f172a" : "#ffffff"

  const exportButtons: ExportButtonDef[] = [
    { fmt: "png", label: "PNG", icon: <ImageIcon className="h-3 w-3" /> },
    { fmt: "svg", label: "SVG", icon: <FileCode2 className="h-3 w-3" /> },
    { fmt: "json", label: "JSON Config", icon: <FileJson className="h-3 w-3" /> },
    { fmt: "csv", label: "CSV Data", icon: <FileText className="h-3 w-3" /> },
  ]

  const toggleDefs: ToggleDef[] = [
    { id: "toggle-legend", label: "Show Legend", val: showLegend, set: setShowLegend },
    { id: "toggle-grid", label: "Show Grid Lines", val: showGrid, set: setShowGrid },
    { id: "toggle-dark", label: "Dark Chart BG", val: darkChart, set: setDarkChart },
    ...(["line", "area", "radar"].includes(chartType)
      ? [{ id: "toggle-fill", label: "Fill Area", val: fillArea, set: setFillArea }]
      : []
    ),
  ]

  return (
    <>
      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .fade-up     { animation: fadeSlideUp  0.4s ease both; }
        .fade-up-2   { animation: fadeSlideUp  0.4s ease 0.08s both; }
        .fade-up-3   { animation: fadeSlideUp  0.4s ease 0.16s both; }
        .fade-in-sl  { animation: fadeSlideIn  0.35s ease both; }
        .scale-in    { animation: scaleIn      0.35s ease both; }
        .pulse-soft  { animation: pulseSoft    2s ease-in-out infinite; }
        .chart-enter { animation: scaleIn      0.45s ease both; }
      `}</style>

      <article className="w-full space-y-6">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <header className="space-y-1 fade-up">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Data Visualization</p>
          <p className="text-2xl font-black tracking-tight">Free Online Chart Maker</p>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Paste CSV or JSON, pick a chart type, and export as PNG, SVG, or JSON config — no account needed.
          </p>
        </header>

        {/* ── Tool grid ────────────────────────────────────────────────────── */}
        <section
          aria-label="Chart generator interactive tool"
          className="grid gap-4 xl:grid-cols-[340px_1fr]"
        >
          {/* ═══ LEFT PANEL ════════════════════════════════════════════════ */}
          <div className="space-y-4 fade-in-sl">

            {/* Data Input */}
            <ToolCard title="Data Input">
              <div className="space-y-3">
                {/* Toolbar */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 text-xs gap-1 transition-all duration-200 hover:scale-[1.03]"
                    aria-label="Upload CSV or JSON file"
                  >
                    <Upload className="h-3 w-3" /> Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.txt,.tsv"
                    className="hidden"
                    onChange={handleFileUpload}
                    aria-label="Upload data file"
                  />

                  <Button variant="ghost" size="sm" onClick={() => handleLoadSample(SAMPLE_CSV)}
                    className="h-7 text-xs gap-1 transition-colors duration-150" aria-label="Load CSV sample data">
                    <FileText className="h-3 w-3" /> CSV
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleLoadSample(SAMPLE_JSON)}
                    className="h-7 text-xs gap-1 transition-colors duration-150" aria-label="Load JSON sample data">
                    <FileJson className="h-3 w-3" /> JSON
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleLoadSample(SAMPLE_SCATTER)}
                    className="h-7 text-xs gap-1 transition-colors duration-150" aria-label="Load scatter sample">
                    <BarChart3 className="h-3 w-3" /> Scatter
                  </Button>

                  <div className="ml-auto flex gap-1">
                    <Button
                      variant={inputMode === "text" ? "secondary" : "ghost"}
                      size="sm" className="h-7 text-xs gap-1 transition-all duration-200"
                      onClick={() => setInputMode("text")}
                      aria-label="Text editor mode"
                      aria-pressed={inputMode === "text"}
                    >
                      <FileCode2 className="h-3 w-3" /> Text
                    </Button>
                    <Button
                      variant={inputMode === "table" ? "secondary" : "ghost"}
                      size="sm" className="h-7 text-xs gap-1 transition-all duration-200"
                      onClick={() => setInputMode("table")}
                      aria-label="Table editor mode"
                      aria-pressed={inputMode === "table"}
                    >
                      <Table2 className="h-3 w-3" /> Table
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      className="h-7 w-7 p-0 text-destructive transition-all duration-200 hover:scale-110"
                      onClick={handleClearData}
                      aria-label="Clear data"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Text mode */}
                {inputMode === "text" && (
                  <div className="scale-in">
                    <Label htmlFor="data-input" className="sr-only">
                      Raw CSV or JSON data — free online chart generator, paste CSV, Excel, or JSON
                    </Label>
                    <Textarea
                      id="data-input"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      className={`font-mono text-xs min-h-[200px] resize-y leading-5 transition-colors duration-150 ${error ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                      placeholder={`Paste CSV or JSON...\n\nCSV example:\nMonth,Sales\nJan,100\nFeb,150\n\nJSON example:\n[{"Month":"Jan","Sales":100}]`}
                      aria-invalid={!!error}
                      aria-describedby={error ? "data-error" : undefined}
                    />
                    {error && (
                      <p
                        id="data-error"
                        role="alert"
                        className="text-xs text-destructive flex items-start gap-1.5 mt-2 fade-up"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden />
                        {error}
                      </p>
                    )}
                  </div>
                )}

                {/* Table mode */}
                {inputMode === "table" && tableData.length > 0 && (
                  <div className="overflow-auto max-h-[260px] rounded-md border text-xs scale-in">
                    <table className="w-full">
                      <tbody>
                        {tableData.map((row, ri) => (
                          <tr
                            key={ri}
                            className={ri === 0 ? "bg-muted/60 font-medium" : "odd:bg-muted/20"}
                            style={{ animation: `fadeSlideUp 0.25s ease ${ri * ANIMATION_STAGGER_MS}ms both` }}
                          >
                            {row.map((cell, ci) => (
                              <td key={ci} className="border-r last:border-0 p-0">
                                <input
                                  value={cell}
                                  onChange={(e) => handleCellEdit(ri, ci, e.target.value)}
                                  className="w-full px-2 py-1 bg-transparent focus:outline-none focus:bg-primary/5 min-w-[60px] transition-colors duration-100"
                                  aria-label={`Row ${ri + 1} column ${ci + 1}`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {inputMode === "table" && tableData.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6 fade-up">
                    Enter valid CSV or JSON in Text mode first.
                  </p>
                )}
              </div>
            </ToolCard>

            {/* Chart Configuration */}
            <ToolCard title="Chart Configuration">
              <div className="space-y-4">
                {/* Type + Palette */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Chart Type</Label>
                    <Select
                      value={chartType}
                      onValueChange={(v) => setChartType(v as AppChartType)}
                    >
                      <SelectTrigger className="h-8 text-xs transition-colors duration-150" aria-label="Select chart type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHART_TYPE_OPTIONS.map((ct) => (
                          <SelectItem key={ct.value} value={ct.value} className="text-xs">
                            {ct.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Color Palette</Label>
                    <Select
                      value={palette}
                      onValueChange={(v) => setPalette(v as ColorPalette)}
                    >
                      <SelectTrigger className="h-8 text-xs transition-colors duration-150" aria-label="Select color palette">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PALETTES) as ColorPalette[]).map((p) => (
                          <SelectItem key={p} value={p} className="text-xs capitalize">
                            <span className="flex items-center gap-2">
                              <span className="flex gap-0.5">
                                {PALETTES[p].slice(0, 4).map((c, i) => (
                                  <span
                                    key={i}
                                    style={{ background: c }}
                                    className="inline-block w-2.5 h-2.5 rounded-sm"
                                    aria-hidden
                                  />
                                ))}
                              </span>
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced toggle */}
                <button
                  onClick={toggleConfigPanel}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground w-full transition-colors duration-150"
                  aria-expanded={showConfigPanel}
                  aria-controls="advanced-config"
                >
                  <Settings2 className="h-3 w-3" />
                  Advanced options
                  <span className="ml-auto transition-transform duration-300" style={{ transform: showConfigPanel ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </button>

                {/* Advanced panel */}
                <div
                  id="advanced-config"
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: showConfigPanel ? "400px" : "0", opacity: showConfigPanel ? 1 : 0 }}
                >
                  <div className="space-y-4 border-t pt-3">
                    <div className="space-y-2">
                      <Label htmlFor="chart-title" className="text-xs">Chart Title</Label>
                      <Input
                        id="chart-title"
                        value={chartTitle}
                        onChange={(e) => setChartTitle(e.target.value)}
                        placeholder="e.g. Monthly Revenue 2024"
                        className="h-7 text-xs transition-colors duration-150"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="x-label" className="text-xs">X-Axis Label</Label>
                        <Input
                          id="x-label"
                          value={xLabel}
                          onChange={(e) => setXLabel(e.target.value)}
                          placeholder="X axis"
                          className="h-7 text-xs transition-colors duration-150"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="y-label" className="text-xs">Y-Axis Label</Label>
                        <Input
                          id="y-label"
                          value={yLabel}
                          onChange={(e) => setYLabel(e.target.value)}
                          placeholder="Y axis"
                          className="h-7 text-xs transition-colors duration-150"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {toggleDefs.map(({ id, label, val, set }) => (
                        <div
                          key={id}
                          className="flex items-center justify-between"
                          style={{ animation: "fadeSlideUp 0.3s ease both" }}
                        >
                          <Label htmlFor={id} className="text-xs cursor-pointer">{label}</Label>
                          <Switch
                            id={id}
                            checked={val}
                            onCheckedChange={(v) => set(v)}
                            aria-label={label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ToolCard>
          </div>

          {/* ═══ RIGHT PANEL ═══════════════════════════════════════════════ */}
          <div className="space-y-4 fade-up-2">
            {/* Export toolbar */}
            <div className="flex flex-wrap items-center gap-2" aria-label="Export options">
              <span className="text-xs text-muted-foreground font-medium mr-1">Export:</span>
              {exportButtons.map((def) => (
                <ExportButton
                  key={def.fmt}
                  def={def}
                  disabled={!chartJSData}
                  onExport={handleExport}
                  copied={exportCopied}
                />
              ))}
            </div>

            {/* Chart canvas */}
            <ToolCard
              title="Live Chart Preview"
              className="flex flex-col"
            >
              <div
                className="flex-1 rounded-lg border flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-300"
                style={{ background: chartBg, minHeight: 420 }}
                role="img"
                aria-label={`${chartType} chart preview`}
              >
                {chartJSData ? (
                  <div
                    className="w-full h-full"
                    style={{
                      minHeight: 400,
                      animation: chartVisible ? "scaleIn 0.45s ease both" : "none",
                    }}
                  >
                    <Chart
                      type={cjsType}
                      data={chartJSData as ChartData}
                      options={chartOptions}
                      ref={chartRef}
                      style={{ maxHeight: 480 }}
                    />
                  </div>
                ) : (
                  <EmptyChartState />
                )}
              </div>
            </ToolCard>

            {/* SEO + FAQ block */}
            <div className="rounded-xl border bg-muted/30 p-5 space-y-4 text-sm leading-relaxed fade-up-3">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" aria-hidden />
                Free Online Chart Maker — No Signup Required
              </h2>
              <p className="text-muted-foreground">
                Create professional bar charts, line graphs, pie charts, scatter plots, and more
                directly in your browser. Our free chart generator supports{" "}
                <strong>CSV and JSON input</strong>, renders instantly as you type, and lets you
                export to <strong>PNG, SVG, or JSON config</strong> — all without uploading your
                data to any server.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <section aria-label="Supported chart types">
                  <h3 className="font-medium mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                    Supported chart types
                  </h3>
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    {[
                      "Bar chart & Horizontal bar chart",
                      "Stacked bar chart",
                      "Line chart & Area chart",
                      "Pie chart & Doughnut chart",
                      "Radar chart & Polar area chart",
                      "Scatter plot",
                    ].map((t, i) => (
                      <li
                        key={t}
                        className="flex items-center gap-1.5"
                        style={{ animation: `fadeSlideUp 0.3s ease ${i * 40}ms both` }}
                      >
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" aria-hidden />
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-label="Key features">
                  <h3 className="font-medium mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                    Key features
                  </h3>
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    {[
                      "Paste CSV, TSV, or JSON data",
                      "Inline table editor — edit cells live",
                      "Export PNG · SVG · JSON config · CSV",
                      "8 colour palettes",
                      "Custom title & axis labels",
                      "Dark chart background option",
                      "Works with Excel copy-paste",
                      "100% client-side — data stays private",
                    ].map((f, i) => (
                      <li
                        key={f}
                        className="flex items-center gap-1.5"
                        style={{ animation: `fadeSlideUp 0.3s ease ${i * 35}ms both` }}
                      >
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* FAQ accordion */}
              <section aria-labelledby="faq-heading" className="border-t pt-4 space-y-2">
                <h3 id="faq-heading" className="font-semibold text-sm">Frequently Asked Questions</h3>
                <dl className="space-y-2">
                  {CHART_TOOL_FAQS.map((faq, i) => (
                    <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
                  ))}
                </dl>
              </section>

              <p className="text-xs text-muted-foreground border-t pt-3">
                Also useful as a <strong>graph maker online free</strong>,{" "}
                <strong>data visualization tool</strong>,{" "}
                <strong>chart from Excel data</strong> converter, and{" "}
                <strong>make a chart online</strong> utility — no account needed.
              </p>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((v) => !v), [])

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{ animation: `fadeSlideUp 0.3s ease ${index * 60}ms both` }}
    >
      <dt>
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-medium hover:bg-muted/30 transition-colors duration-150"
          aria-expanded={open}
          aria-controls={`faq-answer-${index}`}
        >
          {q}
          <ChevronDown
            className="h-3 w-3 shrink-0 ml-2 text-muted-foreground transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden
          />
        </button>
      </dt>
      <dd
        id={`faq-answer-${index}`}
        className="text-xs text-muted-foreground overflow-hidden transition-all duration-300 leading-relaxed"
        style={{ maxHeight: open ? "120px" : "0", padding: open ? "0 0.75rem 0.75rem" : "0 0.75rem" }}
      >
        {a}
      </dd>
    </div>
  )
}