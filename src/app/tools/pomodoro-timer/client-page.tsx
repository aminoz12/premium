"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, RotateCcw, Check, Plus, Trash2, Coffee, Brain } from "lucide-react"

type Phase = "work" | "short-break" | "long-break"

const PHASE_LABELS: Record<Phase, string> = {
  "work": "Focus",
  "short-break": "Short Break",
  "long-break": "Long Break",
}

const DEFAULT_DURATIONS: Record<Phase, number> = {
  "work": 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
}

function beep(ctx: AudioContext, freq = 880, duration = 0.15, vol = 0.3) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playDone(ctx: AudioContext) {
  [0, 0.2, 0.4].forEach((delay, i) => {
    setTimeout(() => beep(ctx, 660 + i * 110, 0.2, 0.3), delay * 1000)
  })
}

export default function PomodoroTimerClient() {
  const [phase, setPhase] = useState<Phase>("work")
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS["work"])
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([])
  const [newTask, setNewTask] = useState("")
  const [durations, setDurations] = useState(DEFAULT_DURATIONS)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseRef = useRef(phase)
  const durRef = useRef(durations)
  phaseRef.current = phase
  durRef.current = durations

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  const advance = useCallback(() => {
    const cur = phaseRef.current
    let next: Phase
    let nextSessions = sessions
    if (cur === "work") {
      const newCount = sessions + 1
      nextSessions = newCount
      setSessions(newCount)
      next = newCount % 4 === 0 ? "long-break" : "short-break"
    } else {
      next = "work"
    }
    setPhase(next)
    setTimeLeft(durRef.current[next])
    setRunning(false)
    try { playDone(getAudioCtx()) } catch {}
    if (typeof document !== "undefined") {
      document.title = `${PHASE_LABELS[next]} — Pomodoro Timer`
    }
  }, [sessions])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            advance()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, advance])

  useEffect(() => {
    if (!running) return
    const m = String(Math.floor(timeLeft / 60)).padStart(2, "0")
    const s = String(timeLeft % 60).padStart(2, "0")
    document.title = `${m}:${s} — ${PHASE_LABELS[phase]}`
    return () => { document.title = "Pomodoro Timer — Free Online Focus Timer" }
  }, [timeLeft, phase, running])

  function switchPhase(p: Phase) {
    setPhase(p)
    setTimeLeft(durations[p])
    setRunning(false)
  }

  function toggleTimer() {
    try { getAudioCtx().resume() } catch {}
    setRunning(r => !r)
  }

  function reset() {
    setRunning(false)
    setTimeLeft(durations[phase])
  }

  function addTask() {
    const t = newTask.trim()
    if (!t) return
    setTasks(prev => [...prev, { id: Date.now(), text: t, done: false }])
    setNewTask("")
  }

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function removeTask(id: number) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function updateDuration(p: Phase, minutes: number) {
    const secs = Math.max(1, minutes) * 60
    setDurations(prev => ({ ...prev, [p]: secs }))
    if (phase === p && !running) setTimeLeft(secs)
  }

  const totalSecs = durations[phase]
  const progress = ((totalSecs - timeLeft) / totalSecs) * 100
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const secs = String(timeLeft % 60).padStart(2, "0")
  const circumference = 2 * Math.PI * 108

  const phaseColors: Record<Phase, string> = {
    "work": "text-primary stroke-primary",
    "short-break": "text-green-500 stroke-green-500",
    "long-break": "text-blue-500 stroke-blue-500",
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Phase tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {(["work", "short-break", "long-break"] as Phase[]).map(p => (
          <button
            key={p}
            onClick={() => switchPhase(p)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              phase === p ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {PHASE_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240" aria-hidden="true">
            <circle cx="120" cy="120" r="108" fill="none" strokeWidth="10" className="stroke-muted" />
            <circle
              cx="120" cy="120" r="108" fill="none" strokeWidth="10" strokeLinecap="round"
              className={phaseColors[phase]}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference - (progress / 100) * circumference,
                transition: "stroke-dashoffset 0.5s ease",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold tabular-nums ${phaseColors[phase].split(" ")[0]}`} aria-live="polite">
              {mins}:{secs}
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              {phase === "work" ? <Brain className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
              {PHASE_LABELS[phase]}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              #{sessions + 1} · {sessions} done
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-all"
            aria-label="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTimer}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-lg hover:bg-primary/90 transition-all"
            aria-label={running ? "Pause" : "Start"}
          >
            {running ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
            {sessions} <span className="ml-0.5">🍅</span>
          </div>
        </div>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: "Focus done", value: sessions, unit: "sessions" },
          { label: "Focus time", value: Math.round(sessions * (durations.work / 60)), unit: "min" },
          { label: "Next break", value: sessions % 4 === 3 ? "Long (15m)" : "Short (5m)", unit: "" },
        ] as const).map(({ label, value, unit }) => (
          <div key={label} className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{unit && `${unit} · `}{label}</div>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div className="bg-card border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-base">Today&apos;s Tasks</h2>
        <form
          onSubmit={e => { e.preventDefault(); addTask() }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Add a task for this session…"
            className="flex-1 px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks yet — add one above</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-3 group">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
                    task.done ? "bg-green-500 border-green-500" : "border-muted-foreground hover:border-primary"
                  }`}
                  aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                >
                  {task.done && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.text}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                  aria-label="Remove task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Duration settings */}
      <details className="bg-card border rounded-xl p-5">
        <summary className="font-semibold text-sm cursor-pointer select-none">
          Customize durations
        </summary>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {(["work", "short-break", "long-break"] as Phase[]).map(p => (
            <div key={p} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{PHASE_LABELS[p]}</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={durations[p] / 60}
                  onChange={e => updateDuration(p, Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-background border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-xs text-muted-foreground shrink-0">min</span>
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
