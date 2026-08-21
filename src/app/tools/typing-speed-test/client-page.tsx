'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ============================================================
// TYPES & INTERFACES
// ============================================================
type TimerDuration = 15 | 30 | 60 | 120 | 300;
type Difficulty = 'easy' | 'medium' | 'hard';
type Tab = 'test' | 'history' | 'stats';

interface TestResult {
  date: string;
  wpm: number;
  accuracy: number;
  netWpm: number;
  duration: number;
  difficulty: string;
  errors: number;
  correct: number;
  cpm: number;
}

interface AppData {
  bestWPM: number;
  bestAccuracy: number;
  totalTests: number;
  totalTime: number;
  history: TestResult[];
  settings: {
    darkMode: boolean;
    timerMode: TimerDuration;
    difficulty: Difficulty;
    soundEnabled: boolean;
    showKeyboard: boolean;
  };
}

interface Tier {
  min: number;
  max: number;
  label: string;
  msg: string;
  color: string;
}

// ============================================================
// CONSTANTS & DATA
// ============================================================
const STORAGE_KEY = 'typingTestData_v3';
const CIRCUMFERENCE = 2 * Math.PI * 20;

const TIERS: Tier[] = [
  { min: 0, max: 29, label: 'Beginner', msg: 'Great start! Daily practice will double your speed in weeks.', color: '#6b7280' },
  { min: 30, max: 49, label: 'Novice', msg: 'Building momentum! Focus on accuracy first, speed will follow.', color: '#10b981' },
  { min: 50, max: 69, label: 'Average', msg: "Solid performance. You're at the national average — aim for 70+!", color: '#3b82f6' },
  { min: 70, max: 89, label: 'Good', msg: "Impressive! You're faster than most people — keep pushing.", color: '#f59e0b' },
  { min: 90, max: 109, label: 'Fast', msg: "Excellent speed! You're in the top 10% of typists.", color: '#f97316' },
  { min: 110, max: 129, label: 'Expert', msg: 'Exceptional! You type faster than 98% of people worldwide.', color: '#8b5cf6' },
  { min: 130, max: Infinity, label: 'Elite', msg: 'World-class! You belong in typing competitions.', color: '#ef4444' },
];

const TEXTS: Record<Difficulty, string[]> = {
  easy: [
    "The sun rose over the hills and cast a warm light on the quiet town. Birds began to sing as the day started. Children walked to school with their bags on their backs.",
    "She made a cup of tea and sat by the window. The rain fell soft and slow. She watched the drops run down the glass and felt at peace with the world.",
    "My dog loves to run in the park. He chases the ball every time I throw it. His tail wags so fast when he is happy. We go for walks each morning before work.",
    "The book on the shelf had a red cover. It had been there for many years. One day a young girl took it down and began to read it from the very first page.",
    "He opened the door and walked inside. The room was warm and bright. A fire burned in the corner and filled the air with the smell of wood and smoke.",
    "We drove to the beach on a hot summer day. The sand was white and the sea was blue. We swam and played and ate lunch under the shade of a big tree.",
    "The market was full of color and noise. People sold fruit and bread and fresh flowers. She picked up a ripe orange and smelled it before placing it in her bag.",
    "A bird landed on the fence and looked at me. Its feathers were bright green and blue. I stayed very still so it would not fly away. After a minute it was gone.",
    "He sat down at his desk and opened his notebook. He had a long list of things to do today. He picked up his pen and crossed off the first task with a smile.",
    "The kitchen smelled of bread fresh from the oven. She sliced it thick and spread butter on each piece. They sat at the table and ate while the tea was still hot.",
  ],
  medium: [
    "Effective communication is one of the most important skills in any workplace. Whether you are sending an email, leading a meeting, or presenting data to a client, the ability to express ideas clearly and concisely can determine the outcome of negotiations, projects, and professional relationships.",
    "The history of the internet traces back to the 1960s, when the United States Defense Department funded a project called ARPANET. This early network allowed computers at different universities to share information. Over the following decades, the technology evolved into the global communication infrastructure we rely on today.",
    "Regular physical exercise delivers benefits that extend far beyond weight management. Studies consistently show that people who exercise three to five times per week report better sleep quality, reduced anxiety, sharper focus, and significantly lower rates of chronic illness compared to sedentary individuals of the same age.",
    "Learning a new language requires consistent daily practice rather than occasional intensive sessions. Research in cognitive science suggests that fifteen to thirty minutes of deliberate vocabulary practice each day outperforms three-hour weekend sessions, because regular exposure allows the brain to consolidate new information during sleep.",
    "Urban planning has evolved dramatically over the past century. Early industrial cities prioritized factory access and minimal infrastructure for workers. Modern city planning instead focuses on walkability, green space, mixed-use zoning, and public transit to create livable environments that support both economic activity and resident well-being.",
    "Climate change represents one of the defining challenges of the twenty-first century. Rising global temperatures, driven primarily by the burning of fossil fuels, are altering weather patterns, raising sea levels, and threatening biodiversity at a scale not seen in recorded human history.",
    "Artificial intelligence is transforming nearly every industry simultaneously. From medical diagnosis and drug discovery to financial modeling and content creation, machine learning algorithms are automating tasks that previously required years of specialized human training.",
    "The practice of mindfulness meditation has been extensively studied by modern psychologists. Research demonstrates measurable reductions in cortisol levels, improved emotional regulation, and increased gray matter density in regions of the brain associated with attention and self-awareness.",
    "Small businesses account for the majority of private-sector employment in most developed economies. Despite their collective economic weight, small businesses face persistent challenges including limited access to capital and difficulty competing for talent against large corporations.",
    "The science of nutrition has undergone significant revisions over the past several decades. Foods once considered harmful have been rehabilitated by more nuanced research, while the long-term health effects of highly processed foods have become increasingly well-documented.",
  ],
  hard: [
    "Neuroplasticity — the brain's remarkable capacity to reorganize synaptic connections in response to new experiences — fundamentally challenges the once-dominant view that adult neural architecture was essentially fixed. Contemporary neuroscience demonstrates that deliberate cognitive practice stimulates the production of brain-derived neurotrophic factor (BDNF), facilitating new neural pathways.",
    "The epistemological framework underlying empirical science rests on foundational assumptions: that the physical world exists independently of observation; that natural phenomena follow consistent, discoverable laws; and that systematic experimentation can yield provisional knowledge that progressively converges on accurate descriptions of reality.",
    "Macroeconomic policy involves complex trade-offs between competing objectives: price stability, full employment, sustainable GDP growth, and balance-of-payments equilibrium. Central banks deploy monetary tools — adjusting benchmark interest rates and conducting open-market operations — while elected governments control fiscal levers including taxation and deficit spending.",
    "The QWERTY keyboard layout, designed by Christopher Latham Sholes in 1873, was originally optimized to prevent mechanical jamming in early typewriters by separating commonly paired letters. Despite ergonomic alternatives demonstrating superior key-travel efficiency, network effects have entrenched QWERTY as the de facto global standard for 150+ years.",
    "Quantum entanglement — Einstein's famously skeptical description of it as 'spooky action at a distance' notwithstanding — has been experimentally verified with extraordinary precision. When two particles interact and become entangled, measuring the quantum state of one instantaneously determines the correlated property of its partner, regardless of spatial separation.",
    "Constitutional democracies balance competing values through institutional design: separation of powers prevents concentration of authority; judicial review provides counter-majoritarian protection for minority rights; federalism distributes sovereignty across multiple governance levels; and bill-of-rights provisions establish individual liberties insulated from ordinary legislative majorities.",
    "The pharmaceutical development pipeline typically spans 10-15 years from initial compound discovery to regulatory approval, at an average cost exceeding $2.6 billion per successful drug. The vast majority of candidates fail during Phase II or Phase III clinical trials due to insufficient efficacy or unacceptable adverse event profiles.",
    "Cryptographic protocols securing modern internet communications rely on the computational intractability of specific mathematical problems. RSA encryption exploits the asymmetry between the relative ease of multiplying two large prime numbers and the extraordinary computational difficulty of factoring their product — a disparity insurmountable for classical computers at current key lengths.",
    "Evolutionary biology describes natural selection as the non-random differential reproduction of heritable variants within populations — a process requiring no foresight or optimization target beyond immediate reproductive fitness. Complex adaptations emerge incrementally through accumulation of individually small fitness advantages across thousands of generations of selective pressure.",
    "The thermodynamic principle of entropy — quantified by Boltzmann's equation S = k ln(W) — describes the tendency of isolated systems to evolve toward states of maximum disorder. This unidirectional progression defines the arrow of time: whereas other fundamental physical laws are time-symmetric, entropic increase provides the only thermodynamically consistent distinction between past and future.",
  ],
};

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const FAQ_ITEMS = [
  {
    q: "What is a good typing speed in WPM?",
    a: "The average professional types around 40–60 WPM. A good target for office work is 65–75 WPM. Programmers and writers often aim for 80–100 WPM. Professional typists and transcriptionists typically exceed 100 WPM. If you're above 120 WPM, you're in the top 1% globally.",
  },
  {
    q: "How is WPM (Words Per Minute) calculated?",
    a: "WPM is calculated by dividing the total number of correctly typed characters by 5 (the standard word length), then dividing by the elapsed time in minutes. Net WPM additionally subtracts error penalties. Our tool measures gross WPM in real time and displays net WPM in your final results.",
  },
  {
    q: "What is the difference between gross WPM and net WPM?",
    a: "Gross WPM counts all characters typed (including mistakes) divided by 5, divided by time. Net WPM subtracts an error penalty (one word per error per minute) from gross WPM, and is considered the more accurate measure of true typing proficiency.",
  },
  {
    q: "How can I improve my typing speed?",
    a: "Practice touch typing (without looking at the keyboard), maintain correct posture, learn proper finger placement on the home row (ASDF JKL;), start slow and prioritize accuracy before speed, and practice consistently for at least 15 minutes per day. Using our Hard difficulty mode provides excellent challenge texts.",
  },
  {
    q: "Does this typing test work on mobile devices?",
    a: "Yes! Our typing test is fully responsive and works on smartphones and tablets. However, for the most accurate WPM measurement, we strongly recommend using a physical keyboard. Mobile on-screen keyboards introduce auto-correction and prediction which can artificially inflate scores.",
  },
  {
    q: "Is my typing data saved or shared?",
    a: "All your test history and settings are stored exclusively in your browser's localStorage — nothing is ever sent to any server. Your data remains completely private and persists between sessions on the same device and browser.",
  },
  {
    q: "What keyboard layout does this test use?",
    a: "Our tests are designed for QWERTY keyboards, which is the global standard. The texts are optimized to provide a representative distribution of common English letter combinations, digraphs, and punctuation patterns for realistic speed measurement.",
  },
  {
    q: "Why is accuracy more important than raw speed?",
    a: "High error rates negate speed gains — fixing mistakes takes more time than typing correctly the first time. Professional typists prioritize accuracy above 98% before pushing for higher WPM. Our net WPM calculation reflects this by penalizing errors in the final score.",
  },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getTier = (wpm: number): Tier =>
  TIERS.find(t => wpm >= t.min && wpm <= t.max) ?? TIERS[0];

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return ' , ';
  }
};

const formatTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return ' , ';
  }
};

const defaultData = (): AppData => ({
  bestWPM: 0,
  bestAccuracy: 0,
  totalTests: 0,
  totalTime: 0,
  history: [],
  settings: {
    darkMode: true,
    timerMode: 60,
    difficulty: 'medium',
    soundEnabled: false,
    showKeyboard: true,
  },
});

// ============================================================
// SVG ICON COMPONENTS
// ============================================================
const IconKeyboard = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M8 13h.01M12 13h.01M16 13h.01M6 17h12" />
  </svg>
);

const IconRefresh = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-5.68" />
  </svg>
);

const IconChevron = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconMoon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const IconSun = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const IconSound = ({ size = 14, muted = false }: { size?: number; muted?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {muted ? (
      <><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
    ) : (
      <><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></>
    )}
  </svg>
);

const IconTrophy = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

const IconHistory = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconStats = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IconTrash = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const IconTarget = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const IconZap = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconClock = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

// ============================================================
// SUB-COMPONENTS
// ============================================================

// Animated Counter
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);

  return <>{display.toFixed(decimals)}</>;
}

// Stat Card
function StatCard({
  label, value, unit = '', highlight = false, color = '#c8a96e', sublabel = '',
}: {
  label: string; value: string | number; unit?: string; highlight?: boolean; color?: string; sublabel?: string;
}) {
  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 text-center ${highlight
        ? 'bg-[#1a1a14] border-[#c8a96e]/50 shadow-[0_0_20px_rgba(200,169,110,0.1)]'
        : 'bg-[#141414] border-[#2a2825]'
      }`}>
      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-2">{label}</span>
      <div className="font-mono text-2xl font-bold leading-none" style={{ color: highlight ? color : undefined }}>
        {value}{unit}
      </div>
      {sublabel && <span className="font-mono text-[9px] text-[#4a4845] mt-1 block">{sublabel}</span>}
    </div>
  );
}

// Typing Speed Visual — Gauge / Arc
function SpeedGauge({ wpm, maxWpm = 150 }: { wpm: number; maxWpm?: number }) {
  const pct = Math.min(wpm / maxWpm, 1);
  const tier = getTier(wpm);
  const r = 54;
  const circ = Math.PI * r; // semicircle
  const offset = circ - pct * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-[72px] overflow-hidden">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          <path d={`M 6 60 A ${r} ${r} 0 0 1 114 60`} fill="none" stroke="#2a2825" strokeWidth="8" strokeLinecap="round" />
          <path
            d={`M 6 60 A ${r} ${r} 0 0 1 114 60`}
            fill="none"
            stroke={tier.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <div className="font-mono text-3xl font-bold leading-none" style={{ color: tier.color }}>{wpm}</div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#4a4845]">WPM</div>
        </div>
      </div>
      <div className="font-mono text-xs mt-2" style={{ color: tier.color }}>{tier.label}</div>
    </div>
  );
}

// Mini bar chart for history
function MiniBarChart({ data }: { data: TestResult[] }) {
  if (!data.length) return null;
  const recent = [...data].reverse().slice(-15);
  const maxWpm = Math.max(...recent.map(d => d.wpm), 1);

  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {recent.map((d, i) => {
        const h = Math.max(4, (d.wpm / maxWpm) * 80);
        const tier = getTier(d.wpm);
        return (
          <div
            key={i}
            className="flex-1 rounded-t group relative cursor-default transition-all duration-200 hover:opacity-80"
            style={{ height: `${h}px`, backgroundColor: tier.color }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#1a1a1a] border border-[#3a3835] rounded px-2 py-1 font-mono text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {d.wpm} WPM · {d.accuracy.toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Keyboard heatmap
function KeyboardHeatmap({ errorMap, show }: { errorMap: Record<string, number>; show: boolean }) {
  if (!show) return null;
  const maxErr = Math.max(1, ...Object.values(errorMap));

  return (
    <div className="mt-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-3">
        Error Heatmap — Keys with most mistakes
      </div>
      <div className="flex flex-col gap-1 items-center select-none">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(k => {
              const err = errorMap[k] || 0;
              const intensity = err > 0 ? 0.25 + (err / maxErr) * 0.75 : 0;
              return (
                <div
                  key={k}
                  title={err > 0 ? `${k.toUpperCase()}: ${err} error${err !== 1 ? 's' : ''}` : k.toUpperCase()}
                  className="w-8 h-8 border rounded flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 cursor-default"
                  style={{
                    borderColor: err > 0 ? `rgba(192,80,74,${intensity})` : '#2a2825',
                    backgroundColor: err > 0 ? `rgba(192,80,74,${intensity * 0.4})` : '#141414',
                    color: err > 0 ? `rgba(255,${Math.round(255 - intensity * 200)},${Math.round(255 - intensity * 200)},1)` : '#4a4845',
                  }}
                >
                  {k.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
        {/* Spacebar */}
        <div className="flex gap-1">
          <div className="w-48 h-8 border border-[#2a2825] rounded bg-[#141414] flex items-center justify-center font-mono text-[9px] text-[#4a4845]">
            SPACE
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress ring
function TimerRing({ timeLeft, duration }: { timeLeft: number; duration: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (timeLeft / duration) * circ;
  const pct = timeLeft / duration;
  const color = pct <= 0.15 ? '#c0504a' : pct <= 0.33 ? '#d4875a' : '#c8a96e';
  const pulse = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className={`relative inline-flex items-center justify-center ${pulse ? 'animate-pulse' : ''}`}>
      <svg className="-rotate-90" width="56" height="56" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#2a2825" strokeWidth="3.5" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          stroke={color}
          className="transition-all duration-1000 linear"
        />
      </svg>
      <span className="absolute font-mono text-sm font-bold" style={{ color }}>{timeLeft}</span>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ClientPage() {
  // --- STATE ---
  const [data, setData] = useState<AppData>(defaultData());
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isDark, setIsDark] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('test');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Test state
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [errorMap, setErrorMap] = useState<Record<string, number>>({});
  const [isNewBest, setIsNewBest] = useState(false);
  const [liveWpm, setLiveWpm] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);

  // --- REFS ---
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCharRef = useRef<number>(0);

  // ============================================================
  // LOAD / SAVE
  // ============================================================
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: AppData = JSON.parse(raw);
        setData(parsed);
        if (parsed.settings) {
          setIsDark(parsed.settings.darkMode ?? true);
          setTimerDuration(parsed.settings.timerMode ?? 60);
          setDifficulty(parsed.settings.difficulty ?? 'medium');
          setSoundEnabled(parsed.settings.soundEnabled ?? false);
          setShowKeyboard(parsed.settings.showKeyboard ?? true);
          setTimeLeft(parsed.settings.timerMode ?? 60);
        }
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  const persistData = useCallback((next: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setData(next);
  }, []);

  // ============================================================
  // THEME
  // ============================================================
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // ============================================================
  // PICK TEXT
  // ============================================================
  const pickText = useCallback((diff: Difficulty) => {
    const pool = TEXTS[diff];
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  // ============================================================
  // RESET
  // ============================================================
  const resetTest = useCallback((opts?: { diff?: Difficulty; dur?: TimerDuration }) => {
    const d = opts?.diff ?? difficulty;
    const dur = opts?.dur ?? timerDuration;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    setCurrentText(pickText(d));
    setUserInput('');
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setTimeLeft(dur);
    setCorrectChars(0);
    setTotalTyped(0);
    setErrorCount(0);
    setErrorMap({});
    setIsNewBest(false);
    setLiveWpm(0);
    setWpmHistory([]);
    lastCharRef.current = 0;
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [difficulty, timerDuration, pickText]);

  // Initial text
  useEffect(() => {
    if (isLoaded) resetTest();
  }, [isLoaded]); // eslint-disable-line

  // ============================================================
  // COMPUTED STATS
  // ============================================================
  const stats = useMemo(() => {
    if (!startTime) return { wpm: 0, accuracy: 100, netWpm: 0, cpm: 0 };
    const elapsedMin = (Date.now() - startTime) / 60000;
    if (elapsedMin <= 0) return { wpm: 0, accuracy: 100, netWpm: 0, cpm: 0 };
    const grossWpm = Math.round((correctChars / 5) / elapsedMin);
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 1000) / 10 : 100;
    const errorsPerMin = errorCount / elapsedMin;
    const netWpm = Math.max(0, Math.round(grossWpm - errorsPerMin));
    const cpm = Math.round(correctChars / elapsedMin);
    return { wpm: grossWpm, accuracy, netWpm, cpm };
  }, [correctChars, totalTyped, errorCount, startTime]);

  // ============================================================
  // TIMER
  // ============================================================
  useEffect(() => {
    if (!isStarted || isFinished) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          triggerFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isStarted, isFinished]); // eslint-disable-line

  // Live WPM tracker (every 500ms)
  useEffect(() => {
    if (!isStarted || isFinished) return;
    wpmIntervalRef.current = setInterval(() => {
      if (!startTime) return;
      const elapsedMin = (Date.now() - startTime) / 60000;
      const wpm = elapsedMin > 0 ? Math.round((correctChars / 5) / elapsedMin) : 0;
      setLiveWpm(wpm);
      setWpmHistory(prev => [...prev.slice(-29), wpm]);
    }, 500);
    return () => { if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current); };
  }, [isStarted, isFinished, startTime, correctChars]);

  // ============================================================
  // FINISH
  // ============================================================
  const triggerFinish = useCallback(() => {
    setIsFinished(true);
    setIsStarted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
  }, []);

  // Save results after finish
  useEffect(() => {
    if (!isFinished || !startTime) return;
    const elapsedMin = (Date.now() - startTime) / 60000;
    if (elapsedMin <= 0.01) return;

    const grossWpm = Math.round((correctChars / 5) / elapsedMin);
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 1000) / 10 : 100;
    const errorsPerMin = errorCount / elapsedMin;
    const netWpm = Math.max(0, Math.round(grossWpm - errorsPerMin));
    const cpm = Math.round(correctChars / elapsedMin);

    const newBest = grossWpm > data.bestWPM;
    setIsNewBest(newBest);

    const result: TestResult = {
      date: new Date().toISOString(),
      wpm: grossWpm,
      accuracy,
      netWpm,
      duration: timerDuration,
      difficulty,
      errors: errorCount,
      correct: correctChars,
      cpm,
    };

    const next: AppData = {
      ...data,
      bestWPM: newBest ? grossWpm : data.bestWPM,
      bestAccuracy: grossWpm > data.bestWPM ? accuracy : data.bestAccuracy,
      totalTests: data.totalTests + 1,
      totalTime: (data.totalTime || 0) + timerDuration,
      history: [result, ...data.history].slice(0, 100),
      settings: {
        darkMode: isDark,
        timerMode: timerDuration,
        difficulty,
        soundEnabled,
        showKeyboard,
      },
    };

    persistData(next);
    playComplete();
  }, [isFinished]); // eslint-disable-line

  // ============================================================
  // INPUT HANDLER
  // ============================================================
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;

    // Prevent typing past text length
    if (val.length > currentText.length) return;

    // Start timer
    if (!isStarted && val.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
    if (!isStarted && val.length === 0) return;

    setUserInput(val);
    setTotalTyped(val.length);

    let correct = 0;
    const newErrMap: Record<string, number> = {};

    for (let i = 0; i < val.length; i++) {
      if (val[i] === currentText[i]) {
        correct++;
      } else {
        const expected = currentText[i]?.toLowerCase() ?? '';
        if (/[a-z]/.test(expected)) {
          newErrMap[expected] = (newErrMap[expected] || 0) + 1;
        }
      }
    }

    // Merge error map (accumulate over session)
    setErrorMap(prev => {
      const merged: Record<string, number> = { ...prev };
      for (const [k, v] of Object.entries(newErrMap)) {
        merged[k] = Math.max(merged[k] || 0, v);
      }
      return merged;
    });

    setCorrectChars(correct);
    setErrorCount(val.length - correct);

    // Sound for new character
    if (val.length > lastCharRef.current) {
      const typed = val[val.length - 1];
      const expected = currentText[val.length - 1];
      playClick(typed !== expected);
    }
    lastCharRef.current = val.length;

    // Auto-finish when text complete
    if (val.length >= currentText.length) {
      triggerFinish();
    }
  }, [isFinished, isStarted, currentText, triggerFinish]); // eslint-disable-line

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') { e.preventDefault(); resetTest(); }
      if (e.key === 'Escape' && isStarted) resetTest();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resetTest, isStarted]);

  // ============================================================
  // AUDIO
  // ============================================================
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playClick = (isError: boolean) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = isError ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isError ? 180 : 520, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (isError ? 0.12 : 0.06));
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + (isError ? 0.12 : 0.06));
    } catch {
      // ignore
    }
  };

  const playComplete = () => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current!;
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.13;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch {
      // ignore
    }
  };

  // ============================================================
  // RENDER TEXT
  // ============================================================
  const renderedText = useMemo(() => {
    return currentText.split('').map((char, i) => {
      let cls = 'text-[#3a3835]'; // untyped
      if (i < userInput.length) {
        cls = char === userInput[i]
          ? 'text-[#6ab07c]'
          : 'text-[#d46b65] bg-[rgba(192,80,74,0.15)] rounded-[2px]';
      } else if (i === userInput.length && !isFinished) {
        cls = 'relative';
      }
      return (
        <span key={i} className={cls}>
          {i === userInput.length && !isFinished && (
            <span className="absolute top-0 left-0 w-[2px] h-[1.2em] bg-[#c8a96e] animate-[blink_0.8s_step-end_infinite]" style={{ transform: 'translateY(0.1em)' }} />
          )}
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  }, [currentText, userInput, isFinished]);

  // ============================================================
  // SETTINGS SAVE HELPERS
  // ============================================================
  const updateSetting = useCallback(<K extends keyof AppData['settings']>(
    key: K, value: AppData['settings'][K]
  ) => {
    setData(prev => {
      const next = { ...prev, settings: { ...prev.settings, [key]: value } };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
      return next;
    });
  }, []);

  // ============================================================
  // DERIVED VALUES
  // ============================================================
  const progressPct = currentText.length > 0
    ? Math.min(100, (userInput.length / currentText.length) * 100)
    : 0;

  const tier = getTier(isFinished ? stats.wpm : 0);
  const avgWpm = data.history.length > 0
    ? Math.round(data.history.reduce((s, h) => s + h.wpm, 0) / data.history.length)
    : 0;
  const avgAccuracy = data.history.length > 0
    ? (data.history.reduce((s, h) => s + h.accuracy, 0) / data.history.length).toFixed(1)
    : ' , ';

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#0d0d0d] text-[#f0ede8]' : 'bg-[#f8f6f3] text-[#1a1815]'}`}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fadeup { animation: fadeSlideUp 0.4s ease both; }
        .font-mono { font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace; }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 border-b ${isDark ? 'bg-[#0d0d0d]/95 border-[#2a2825]' : 'bg-[#f8f6f3]/95 border-[#e0ddd8]'} backdrop-blur-md`}>
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#c8a96e] rounded-md flex items-center justify-center">
              <IconKeyboard size={16} />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight">
              TheFreeAITools
              <span className="text-[#c8a96e]"> · Typing</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme */}
            <button
              onClick={() => { setIsDark(d => { updateSetting('darkMode', !d); return !d; }); }}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-[#8a8580] hover:text-[#f0ede8] hover:bg-[#1a1a1a]' : 'text-[#8a8580] hover:text-[#1a1815] hover:bg-[#e8e5e0]'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
            </button>

            {/* Sound */}
            <button
              onClick={() => {
                initAudio();
                const next = !soundEnabled;
                setSoundEnabled(next);
                updateSetting('soundEnabled', next);
              }}
              className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'text-[#c8a96e]' : isDark ? 'text-[#4a4845] hover:text-[#8a8580]' : 'text-[#8a8580] hover:text-[#4a4845]'}`}
              aria-label="Toggle sound"
            >
              <IconSound size={16} muted={!soundEnabled} />
            </button>

            {/* Keyboard heatmap toggle */}
            <button
              onClick={() => {
                const next = !showKeyboard;
                setShowKeyboard(next);
                updateSetting('showKeyboard', next);
              }}
              className={`p-2 rounded-lg transition-colors ${showKeyboard ? 'text-[#c8a96e]' : isDark ? 'text-[#4a4845] hover:text-[#8a8580]' : 'text-[#8a8580] hover:text-[#4a4845]'}`}
              aria-label="Toggle keyboard heatmap"
            >
              <IconKeyboard size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="max-w-[900px] mx-auto px-6 pt-14 pb-10 text-center">
        {/* OG Image / Hero visual */}
        <div className="relative mb-8 flex justify-center">
          <div className={`w-full max-w-2xl rounded-2xl overflow-hidden border ${isDark ? 'border-[#2a2825]' : 'border-[#e0ddd8]'} shadow-2xl`}>
            {/* Simulated keyboard visual */}
            <div className={`relative px-10 py-8 ${isDark ? 'bg-[#141414]' : 'bg-[#f0ede8]'}`}>
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#c8a96e] to-transparent opacity-60" />
              <div className="flex flex-col items-center gap-3">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#c8a96e] mb-1">
                  ✦ Free Typing Speed Test ✦
                </div>
                {/* Fake speed display */}
                <div className="flex items-end gap-6">
                  <div className="text-center">
                    <div className="font-mono text-5xl font-bold text-[#c8a96e] leading-none">87</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mt-1">WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-3xl font-bold text-[#5a9e6f] leading-none">98.2</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mt-1">Accuracy %</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-3xl font-bold leading-none text-[#4a8fa8]">60</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mt-1">Seconds</div>
                  </div>
                </div>
                {/* Fake mini keyboard rows */}
                <div className="flex flex-col gap-1 mt-2 opacity-50">
                  {KEYBOARD_ROWS.map((row, ri) => (
                    <div key={ri} className="flex gap-0.5 justify-center">
                      {row.slice(0, 8).map(k => (
                        <div key={k} className={`w-5 h-5 rounded text-[7px] font-mono flex items-center justify-center font-bold border ${isDark ? 'bg-[#1a1a1a] border-[#3a3835] text-[#4a4845]' : 'bg-white border-[#d0cdc8] text-[#8a8580]'}`}>
                          {k.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] border border-[#c8a96e]/40 bg-[#c8a96e]/5 px-4 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] animate-pulse" />
          Free · No Signup · Instant Results
        </div>

        <h2 className="font-mono text-4xl md:text-[52px] font-bold leading-[1.1] tracking-tight mb-5">
          Free Typing Test Online<br />
          <span className="text-[#c8a96e]">Measure WPM Speed &amp; Accuracy</span>
        </h2>

        <p className="text-base md:text-lg text-[#8a8580] max-w-2xl mx-auto mb-8 leading-relaxed">
          The most accurate free typing speed test. Measure your <strong className="text-[#f0ede8]">words per minute (WPM)</strong>, track <strong className="text-[#f0ede8]">accuracy</strong> in real time, analyze your weak keys with our heatmap, and monitor long-term progress — no registration required.
        </p>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-mono text-[#4a4845]">
          {[
            ['🧑‍💻', '50,000+ Tests'],
            ['⚡', 'Real-time WPM'],
            ['🔒', '100% Private'],
            ['📱', 'All Devices'],
            ['🌙', 'Dark Mode'],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN TOOL ─────────────────────────────────────── */}
      <main id="typing-test" className="max-w-[900px] mx-auto px-6 pb-16">

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {/* Timer */}
          <div className={`flex items-stretch border rounded-xl overflow-hidden ${isDark ? 'bg-[#111111] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
            <span className={`px-3 flex items-center font-mono text-[9px] uppercase tracking-[0.2em] border-r ${isDark ? 'text-[#4a4845] border-[#2a2825]' : 'text-[#8a8580] border-[#e0ddd8]'}`}>
              <IconClock size={12} />
            </span>
            {([15, 30, 60, 120, 300] as TimerDuration[]).map(t => (
              <button
                key={t}
                disabled={isStarted}
                onClick={() => {
                  setTimerDuration(t);
                  setTimeLeft(t);
                  updateSetting('timerMode', t);
                  resetTest({ dur: t });
                }}
                className={`px-4 py-2.5 font-mono text-xs tracking-wider transition-all disabled:opacity-40 ${timerDuration === t
                    ? 'text-[#c8a96e] bg-[#c8a96e]/10 font-bold'
                    : isDark
                      ? 'text-[#4a4845] hover:text-[#f0ede8] hover:bg-[#1a1a1a]'
                      : 'text-[#8a8580] hover:text-[#1a1815] hover:bg-[#f0ede8]'
                  }`}
              >
                {t < 60 ? `${t}s` : `${t / 60}m`}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className={`flex items-stretch border rounded-xl overflow-hidden ${isDark ? 'bg-[#111111] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
            <span className={`px-3 flex items-center font-mono text-[9px] uppercase tracking-[0.2em] border-r ${isDark ? 'text-[#4a4845] border-[#2a2825]' : 'text-[#8a8580] border-[#e0ddd8]'}`}>
              <IconTarget size={12} />
            </span>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                disabled={isStarted}
                onClick={() => {
                  setDifficulty(d);
                  updateSetting('difficulty', d);
                  resetTest({ diff: d });
                }}
                className={`px-4 py-2.5 font-mono text-xs tracking-wider capitalize transition-all disabled:opacity-40 ${difficulty === d
                    ? 'text-[#c8a96e] bg-[#c8a96e]/10 font-bold'
                    : isDark
                      ? 'text-[#4a4845] hover:text-[#f0ede8] hover:bg-[#1a1a1a]'
                      : 'text-[#8a8580] hover:text-[#1a1815] hover:bg-[#f0ede8]'
                  }`}
              >
                {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}
              </button>
            ))}
          </div>

          {/* Restart */}
          <button
            onClick={() => resetTest()}
            className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs tracking-wider border rounded-xl transition-all ${isDark
                ? 'bg-[#111111] border-[#2a2825] text-[#4a4845] hover:text-[#f0ede8] hover:border-[#4a4845]'
                : 'bg-white border-[#e0ddd8] text-[#8a8580] hover:text-[#1a1815]'
              }`}
          >
            <IconRefresh size={12} /> Restart <kbd className={`ml-1 text-[9px] px-1 py-0.5 rounded ${isDark ? 'bg-[#1a1a1a] border border-[#3a3835]' : 'bg-[#f0ede8] border border-[#d0cdc8]'}`}>Tab</kbd>
          </button>
        </div>

        {/* LIVE STATS */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <StatCard label="WPM" value={isStarted ? liveWpm : stats.wpm} highlight={isStarted} />
          <StatCard label="Accuracy" value={totalTyped > 0 ? stats.accuracy.toFixed(1) : '100.0'} unit="%" />
          <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-1">Timer</span>
            <TimerRing timeLeft={timeLeft} duration={timerDuration} />
          </div>
          <StatCard label="Characters" value={correctChars} />
          <StatCard
            label="Errors"
            value={errorCount}
            color="#c0504a"
            highlight={errorCount > 0 && isStarted}
          />
        </div>

        {/* Live WPM mini-graph */}
        {isStarted && wpmHistory.length > 2 && (
          <div className={`mb-4 px-4 pt-3 pb-2 rounded-xl border ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-2 flex items-center gap-1">
              <IconZap size={10} /> Live WPM
            </div>
            <div className="flex items-end gap-0.5 h-10">
              {wpmHistory.map((w, i) => {
                const maxW = Math.max(...wpmHistory, 1);
                const h = Math.max(2, (w / maxW) * 40);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all duration-300"
                    style={{ height: `${h}px`, backgroundColor: '#c8a96e', opacity: 0.4 + (i / wpmHistory.length) * 0.6 }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TYPING AREA */}
        <div
          ref={containerRef}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.focus()}
          onKeyDown={e => { if (e.key === 'Enter') inputRef.current?.focus(); }}
          className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-text ${isStarted
              ? isDark ? 'border-[#3a3835] shadow-[0_0_40px_rgba(200,169,110,0.06)]' : 'border-[#c8a96e]/30 shadow-[0_0_40px_rgba(200,169,110,0.1)]'
              : isDark ? 'border-[#2a2825]' : 'border-[#e0ddd8]'
            } ${isDark ? 'bg-[#141414]' : 'bg-white'}`}
          aria-label="Typing area — click and start typing"
        >
          {/* Progress bar */}
          <div className={`h-[3px] w-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0ede8]'}`}>
            <div
              className="h-full bg-gradient-to-r from-[#c8a96e] to-[#d4875a] transition-all duration-150 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="p-7 md:p-9">
            {/* Text display */}
            <div
              className="font-mono text-[17px] leading-[1.9] tracking-wide break-words select-none relative min-h-[80px]"
              aria-hidden="true"
            >
              {renderedText}
            </div>

            {/* Hidden input */}
            <input
              ref={inputRef}
              type="text"
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={userInput}
              onChange={handleInput}
              onKeyDown={e => {
                if (e.key === 'Tab') { e.preventDefault(); resetTest(); }
                if (e.key === 'Escape') resetTest();
              }}
              aria-label="Typing input"
            />
          </div>

          {/* START OVERLAY */}
          {!isStarted && !isFinished && (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer ${isDark ? 'bg-[#141414]' : 'bg-white'}`}
              onClick={() => inputRef.current?.focus()}
            >
              <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center mb-4 transition-colors ${isDark ? 'border-[#2a2825] text-[#4a4845] hover:border-[#c8a96e] hover:text-[#c8a96e]' : 'border-[#e0ddd8] text-[#8a8580] hover:border-[#c8a96e] hover:text-[#c8a96e]'}`}>
                <IconKeyboard size={28} />
              </div>
              <div className="font-mono text-base font-bold mb-1">Click here &amp; start typing</div>
              <div className="font-mono text-xs text-[#4a4845] mb-3">
                {difficulty === 'easy' ? '🟢 Easy' : difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'} · {timerDuration}s
              </div>
              <div className="flex gap-4 font-mono text-[10px] text-[#4a4845]">
                <span><kbd className={`px-1.5 py-0.5 rounded mr-1 ${isDark ? 'bg-[#1a1a1a] border border-[#3a3835]' : 'bg-[#f0ede8] border border-[#d0cdc8]'}`}>Tab</kbd>Restart</span>
                <span><kbd className={`px-1.5 py-0.5 rounded mr-1 ${isDark ? 'bg-[#1a1a1a] border border-[#3a3835]' : 'bg-[#f0ede8] border border-[#d0cdc8]'}`}>Esc</kbd>Cancel</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULTS ─────────────────────────────────────── */}
        {isFinished && (
          <div className={`mt-5 rounded-2xl border overflow-hidden anim-fadeup ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
            {/* Top accent */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${tier.color}, transparent)` }} />

            <div className="p-8">
              {/* Gauge + tier */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <SpeedGauge wpm={stats.wpm} />
                  {isNewBest && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-[#c8a96e] text-[#0a0a0a] font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                      ★ New Personal Best!
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a4845] mb-1">{tier.label}</div>
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-[#8a8580]' : 'text-[#6a6560]'}`}>{tier.msg}</p>

                  {/* Mini result grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <StatCard label="Accuracy" value={`${stats.accuracy.toFixed(1)}%`} color="#6ab07c" />
                    <StatCard label="Net WPM" value={stats.netWpm} />
                    <StatCard label="CPM" value={stats.cpm} />
                    <StatCard label="Errors" value={errorCount} color="#c0504a" />
                  </div>
                </div>
              </div>

              {/* Comparison to personal bests */}
              {data.history.length > 1 && (
                <div className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-[#111111] border-[#2a2825]' : 'bg-[#f8f6f3] border-[#e0ddd8]'}`}>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-3">Comparison</div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'vs Best', val: stats.wpm - data.bestWPM, unit: 'WPM' },
                      { label: 'vs Average', val: stats.wpm - avgWpm, unit: 'WPM' },
                      { label: 'Accuracy', val: Number(stats.accuracy.toFixed(1)) - Number(avgAccuracy), unit: '%' },
                    ].map(({ label, val, unit }) => (
                      <div key={label} className="text-center">
                        <div className="font-mono text-[9px] uppercase tracking-widest text-[#4a4845] mb-1">{label}</div>
                        <div className={`font-mono text-lg font-bold ${val >= 0 ? 'text-[#6ab07c]' : 'text-[#c0504a]'}`}>
                          {val >= 0 ? '+' : ''}{isNaN(val) ? ' , ' : val.toFixed(unit === '%' ? 1 : 0)}{unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyboard heatmap */}
              <KeyboardHeatmap errorMap={errorMap} show={showKeyboard} />

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => resetTest()}
                  className="bg-[#c8a96e] hover:bg-[#d4b87e] active:scale-95 text-[#0a0a0a] px-8 py-3 rounded-xl font-mono text-sm font-bold tracking-widest uppercase transition-all shadow-lg shadow-[#c8a96e]/20"
                >
                  Try Again
                </button>
                <button
                  onClick={() => { setDifficulty(d => d === 'easy' ? 'medium' : d === 'medium' ? 'hard' : 'hard'); resetTest(); }}
                  className={`px-8 py-3 rounded-xl font-mono text-sm tracking-widest uppercase border transition-all ${isDark ? 'border-[#2a2825] hover:border-[#4a4845] text-[#8a8580]' : 'border-[#e0ddd8] hover:border-[#c8a96e] text-[#8a8580]'}`}
                >
                  Harder Text
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-mono text-sm tracking-widest uppercase border transition-all ${isDark ? 'border-[#2a2825] hover:border-[#4a4845] text-[#8a8580]' : 'border-[#e0ddd8] hover:border-[#c8a96e] text-[#8a8580]'}`}
                >
                  <IconStats size={14} /> View Stats
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── TABS: HISTORY / STATS ───────────────────────── */}
      <section className={`max-w-[900px] mx-auto px-6 pb-20 border-t ${isDark ? 'border-[#2a2825]' : 'border-[#e0ddd8]'}`}>
        <div className="flex gap-0 mt-10 mb-8 border-b border-[#2a2825]">
          {([
            { id: 'history', label: 'History', icon: <IconHistory size={14} /> },
            { id: 'stats', label: 'Statistics', icon: <IconStats size={14} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-widest border-b-2 -mb-px transition-all ${activeTab === tab.id
                  ? 'border-[#c8a96e] text-[#c8a96e]'
                  : 'border-transparent text-[#4a4845] hover:text-[#8a8580]'
                }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="anim-fadeup">
            {data.history.length === 0 ? (
              <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${isDark ? 'border-[#2a2825] text-[#3a3835]' : 'border-[#e0ddd8] text-[#c0bdb8]'}`}>
                <IconHistory size={32} />
                <div className="font-mono text-sm mt-3">No test history yet.</div>
                <div className="font-mono text-xs text-[#4a4845] mt-1">Complete a test to see results here.</div>
              </div>
            ) : (
              <>
                {/* Mini WPM chart */}
                <div className={`p-4 rounded-xl border mb-4 ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-3">
                    WPM Over Last {Math.min(data.history.length, 15)} Tests
                  </div>
                  <MiniBarChart data={data.history} />
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#2a2825]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${isDark ? 'border-[#2a2825] bg-[#111111]' : 'border-[#e0ddd8] bg-[#f8f6f3]'}`}>
                        {['#', 'Date', 'WPM', 'Net WPM', 'Accuracy', 'CPM', 'Errors', 'Duration', 'Level'].map(h => (
                          <th key={h} className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] py-3 px-4 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.history.slice(0, 20).map((h, i) => (
                        <tr key={i} className={`border-b transition-colors ${isDark ? 'border-[#1e1e1e] hover:bg-[#111111]' : 'border-[#f0ede8] hover:bg-[#f8f6f3]'}`}>
                          <td className="font-mono text-[10px] py-3 px-4 text-[#4a4845]">{i + 1}</td>
                          <td className="font-mono text-[10px] py-3 px-4 text-[#4a4845] whitespace-nowrap">
                            <div>{formatDate(h.date)}</div>
                            <div className="text-[#3a3835]">{formatTime(h.date)}</div>
                          </td>
                          <td className="font-mono text-sm font-bold py-3 px-4" style={{ color: getTier(h.wpm).color }}>{h.wpm}</td>
                          <td className="font-mono text-xs py-3 px-4 text-[#8a8580]">{h.netWpm ?? ' , '}</td>
                          <td className="font-mono text-xs py-3 px-4" style={{ color: h.accuracy >= 95 ? '#6ab07c' : h.accuracy >= 85 ? '#c8a96e' : '#c0504a' }}>
                            {h.accuracy.toFixed(1)}%
                          </td>
                          <td className="font-mono text-xs py-3 px-4 text-[#8a8580]">{h.cpm ?? ' , '}</td>
                          <td className="font-mono text-xs py-3 px-4 text-[#c0504a]">{h.errors}</td>
                          <td className="font-mono text-xs py-3 px-4 text-[#4a4845]">{h.duration}s</td>
                          <td className="font-mono text-xs py-3 px-4 capitalize text-[#4a4845]">
                            {h.difficulty === 'easy' ? '🟢' : h.difficulty === 'medium' ? '🟡' : '🔴'} {h.difficulty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowClearModal(true)}
                    className="flex items-center gap-1.5 font-mono text-xs text-[#c0504a] hover:text-[#d46b65] transition-colors"
                  >
                    <IconTrash size={12} /> Clear History
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="anim-fadeup">
            {data.totalTests === 0 ? (
              <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${isDark ? 'border-[#2a2825] text-[#3a3835]' : 'border-[#e0ddd8] text-[#c0bdb8]'}`}>
                <IconStats size={32} />
                <div className="font-mono text-sm mt-3">No statistics yet.</div>
                <div className="font-mono text-xs text-[#4a4845] mt-1">Complete at least one test to see your stats.</div>
              </div>
            ) : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <StatCard label="Best WPM" value={data.bestWPM} highlight color="#c8a96e" sublabel={getTier(data.bestWPM).label} />
                  <StatCard label="Best Accuracy" value={`${data.bestAccuracy.toFixed(1)}%`} color="#6ab07c" />
                  <StatCard label="Avg WPM" value={avgWpm} color="#4a8fa8" />
                  <StatCard label="Tests Taken" value={data.totalTests} color="#9b6fd4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Difficulty breakdown */}
                  <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-4">Tests by Difficulty</div>
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
                      const count = data.history.filter(h => h.difficulty === d).length;
                      const pct = data.history.length > 0 ? (count / data.history.length) * 100 : 0;
                      const avgD = data.history.filter(h => h.difficulty === d).reduce((s, h) => s + h.wpm, 0) / (count || 1);
                      return (
                        <div key={d} className="mb-3">
                          <div className="flex justify-between font-mono text-[10px] mb-1">
                            <span className="capitalize text-[#8a8580]">{d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}</span>
                            <span className="text-[#4a4845]">{count} test{count !== 1 ? 's' : ''} · avg {Math.round(avgD)} WPM</span>
                          </div>
                          <div className={`h-2 rounded-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0ede8]'}`}>
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: d === 'easy' ? '#6ab07c' : d === 'medium' ? '#c8a96e' : '#c0504a',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Time breakdown */}
                  <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white mb-4">Session Summary</div>
                    {[
                      { label: 'Total Tests', value: data.totalTests },
                      { label: 'Total Time', value: `${Math.round((data.totalTime || 0) / 60)}m` },
                      { label: 'Avg Accuracy', value: `${avgAccuracy}%` },
                      { label: 'Best WPM', value: `${data.bestWPM} WPM` },
                    ].map(({ label, value }) => (
                      <div key={label} className={`flex justify-between py-2 border-b font-mono text-xs ${isDark ? 'border-[#1e1e1e]' : 'border-[#f0ede8]'}`}>
                        <span className="text-white">{label}</span>
                        <span className="font-bold text-[#c8a96e]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WPM trend */}
                {data.history.length > 1 && (
                  <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#4a4845] mb-4 flex items-center gap-1">
                      <IconStats size={10} /> WPM Trend (last {Math.min(data.history.length, 15)} tests)
                    </div>
                    <MiniBarChart data={data.history} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* ── SEO CONTENT ─────────────────────────────────── */}
      <section className={`max-w-[900px] mx-auto px-6 py-16 border-t ${isDark ? 'border-[#2a2825]' : 'border-[#e0ddd8]'}`}>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-mono text-xl font-bold mb-4">What is a Typing Speed Test?</h2>
            <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-[#8a8580]' : 'text-[#6a6560]'}`}>
              A <strong className={isDark ? 'text-[#f0ede8]' : 'text-[#1a1815]'}>typing speed test</strong> measures how many words you can type per minute (WPM) with a given level of accuracy. Our free online tool gives you an accurate WPM measurement with real-time feedback, error highlighting, and detailed statistics — no account needed.
            </p>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#8a8580]' : 'text-[#6a6560]'}`}>
              Typing speed is a critical professional skill. Faster, more accurate typing directly increases productivity for programmers, writers, data entry professionals, students, and anyone who works at a computer.
            </p>
          </div>
          <div>
            <h2 className="font-mono text-xl font-bold mb-4">How to Improve Your Typing Speed</h2>
            <ul className={`text-sm space-y-2 ${isDark ? 'text-[#8a8580]' : 'text-[#6a6560]'}`}>
              {[
                ['Learn touch typing', 'Keep fingers on the home row (ASDF JKL;) without looking at keys.'],
                ['Prioritize accuracy', 'Slow down until errors drop below 2%, then gradually increase speed.'],
                ['Practice daily', '15–20 minutes per day beats occasional long sessions significantly.'],
                ['Use Hard difficulty', 'Complex vocabulary builds muscle memory for challenging letter combos.'],
                ['Track your progress', 'Our history tab shows your improvement over time.'],
                ['Fix your posture', 'Sit upright, wrists neutral, elbows at 90° — reduces fatigue and injury risk.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-2">
                  <span className="text-[#c8a96e] mt-0.5 shrink-0">→</span>
                  <span><strong className={isDark ? 'text-[#c8a96e]' : 'text-[#c8a96e]'}>{title}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* WPM Speed Tiers reference */}
        <div className={`mt-12 p-6 rounded-2xl border ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
          <h2 className="font-mono text-lg font-bold mb-5">Typing Speed Reference Guide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIERS.filter(t => t.max !== Infinity).map(t => (
              <div key={t.label} className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#111111] border-[#2a2825]' : 'bg-[#f8f6f3] border-[#e0ddd8]'}`}>
                <div className="font-mono text-base mb-1" style={{ color: t.color }}>{t.label}</div>
                <div className="font-mono text-xs text-white">{t.min}–{t.max} WPM</div>
              </div>
            ))}
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#111111] border-[#2a2825]' : 'bg-[#f8f6f3] border-[#e0ddd8]'}`}>
              <div className="font-mono text-base mb-1" style={{ color: TIERS[6].color }}>{TIERS[6].label}</div>
              <div className="font-mono text-xs text-white">130+ WPM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className={`max-w-[900px] mx-auto px-6 py-16 border-t ${isDark ? 'border-[#2a2825]' : 'border-[#e0ddd8]'}`}>
        <div className="text-center mb-10">
          <h2 className="font-mono text-2xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className={`text-sm ${isDark ? 'text-white' : 'text-[#8a8580]'}`}>Everything you need to know about typing speed tests and WPM measurement.</p>
        </div>

        {/* Schema.org FAQPage structured data */}

        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-all ${activeFaq === i
                  ? isDark ? 'border-[#c8a96e]/30' : 'border-[#c8a96e]/50'
                  : isDark ? 'border-[#2a2825]' : 'border-[#e0ddd8]'
                }`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isDark ? 'bg-[#141414] hover:bg-[#191917]' : 'bg-white hover:bg-[#faf8f5]'}`}
              >
                <span className="font-mono text-sm font-semibold pr-4">{item.q}</span>
                <div className={`shrink-0 transition-transform duration-200 ${activeFaq === i ? 'rotate-180 text-[#c8a96e]' : 'text-[#4a4845]'}`}>
                  <IconChevron size={16} />
                </div>
              </button>
              {activeFaq === i && (
                <div className={`px-5 pb-5 text-sm leading-relaxed anim-fadeup ${isDark ? 'bg-[#141414] text-[#8a8580]' : 'bg-white text-[#6a6560]'}`}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ── CLEAR MODAL ─────────────────────────────────── */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl border p-7 shadow-2xl anim-fadeup ${isDark ? 'bg-[#141414] border-[#2a2825]' : 'bg-white border-[#e0ddd8]'}`}>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-[#c0504a]/10 flex items-center justify-center mx-auto mb-3">
                <IconTrash size={20} />
              </div>
              <h3 className="font-mono text-base font-bold mb-1">Clear All Data?</h3>
              <p className={`font-mono text-xs ${isDark ? 'text-[#4a4845]' : 'text-[#8a8580]'}`}>
                This will permanently delete your history, stats, and settings. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className={`flex-1 py-2.5 rounded-xl font-mono text-sm border transition-colors ${isDark ? 'border-[#2a2825] hover:border-[#4a4845]' : 'border-[#e0ddd8] hover:border-[#c8a96e]'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setShowClearModal(false);
                  setData(defaultData());
                  resetTest();
                }}
                className="flex-1 py-2.5 rounded-xl font-mono text-sm bg-[#c0504a] hover:bg-[#d05550] text-white font-bold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}