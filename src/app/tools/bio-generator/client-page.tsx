"use client"

import { useState } from "react"
import { Copy, Check, RefreshCw, Sparkles, User, Briefcase, Heart } from "lucide-react"

type Platform = "instagram" | "tiktok" | "twitter" | "linkedin"

const PLATFORM_LABELS: Record<Platform, { name: string; maxChars: number; emoji: string }> = {
  instagram: { name: "Instagram", maxChars: 150, emoji: "📸" },
  tiktok: { name: "TikTok", maxChars: 80, emoji: "🎵" },
  twitter: { name: "Twitter/X", maxChars: 160, emoji: "🐦" },
  linkedin: { name: "LinkedIn", maxChars: 220, emoji: "💼" },
}

const EMOJI_MAP: Record<string, string> = {
  photographer: "📸", designer: "🎨", developer: "💻", engineer: "⚙️",
  writer: "✍️", blogger: "📝", coach: "🎯", trainer: "💪", chef: "👨‍🍳",
  artist: "🎨", musician: "🎵", teacher: "📚", nurse: "🏥", doctor: "⚕️",
  entrepreneur: "🚀", founder: "🏗️", marketer: "📈", student: "🎓",
  traveler: "✈️", gamer: "🎮", model: "💄", influencer: "⭐", creator: "🎬",
  mom: "👩‍👦", dad: "👨‍👦", dog: "🐕", cat: "🐈", coffee: "☕",
  fitness: "🏋️", yoga: "🧘", hiking: "🏔️", cooking: "🍳", reading: "📚",
  music: "🎸", dance: "💃", fashion: "👗", beauty: "💅", gaming: "🎮",
}

function getEmoji(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji
  }
  return "✨"
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 3) + "..."
}

function generateBios(data: {
  name: string
  profession: string
  interests: string
  tone: "fun" | "professional" | "bold"
  platform: Platform
}): string[] {
  const { name, profession, interests, tone, platform } = data
  const { maxChars } = PLATFORM_LABELS[platform]

  const profEmoji = getEmoji(profession)
  const intList = interests.split(",").map(s => s.trim()).filter(Boolean).slice(0, 3)
  const intStr = intList.join(" · ")
  const intEmojis = intList.map(i => getEmoji(i)).join(" ")

  const bios: string[] = []

  if (platform === "linkedin") {
    if (tone === "professional") {
      bios.push(truncate(`${profession} ${name ? `| ${name}` : ""}\n${intStr ? `Passionate about ${intStr}.` : ""}\nHelping others achieve their goals through expertise and collaboration.`, maxChars))
      bios.push(truncate(`${profession}${name ? ` · ${name}` : ""}\n${intStr ? `Specializing in ${intStr}.` : ""}\nOpen to new opportunities and meaningful conversations.`, maxChars))
      bios.push(truncate(`${profession}\n${intStr ? `Building expertise in ${intStr}.` : ""}\n${name ? `${name} · ` : ""}Let's connect and grow together.`, maxChars))
    } else {
      bios.push(truncate(`${profEmoji} ${profession}\n${intStr ? `Obsessed with ${intStr}.` : ""}\n${name ? `— ${name}` : ""}`, maxChars))
      bios.push(truncate(`${profession} by day ${intEmojis}\n${intStr ? `Into ${intStr} after hours.` : ""}\n${name ? `${name} · ` : ""}Always learning, always growing.`, maxChars))
      bios.push(truncate(`I ${profession.toLowerCase()} things ${profEmoji}\n${intStr ? `${intEmojis} ${intStr}` : ""}\n${name ? `${name} · ` : ""}Connect if you vibe with any of this.`, maxChars))
    }
    return bios
  }

  if (platform === "twitter") {
    if (tone === "professional") {
      bios.push(truncate(`${profession}${name ? ` | ${name}` : ""}. ${intStr ? `Writing about ${intStr}.` : ""}`, maxChars))
      bios.push(truncate(`${profession}${name ? ` · ${name}` : ""}${intStr ? ` · ${intStr}` : ""}`, maxChars))
      bios.push(truncate(`Thoughts on ${intStr || profession}. ${name ? `${name}.` : ""}`, maxChars))
    } else if (tone === "fun") {
      bios.push(truncate(`${profEmoji} ${profession}${name ? ` | ${name}` : ""} ${intEmojis}`, maxChars))
      bios.push(truncate(`Part ${profession.toLowerCase()}, part ${intList[0] || "dreamer"} ${profEmoji}${name ? ` | ${name}` : ""}`, maxChars))
      bios.push(truncate(`${intEmojis} ${intStr || profession}${name ? ` · ${name}` : ""}`, maxChars))
    } else {
      bios.push(truncate(`${profession.toUpperCase()}${name ? ` · ${name}` : ""}. ${intStr ? `${intStr}.` : ""} No filter.`, maxChars))
      bios.push(truncate(`${profEmoji} ${profession}. Unfiltered.${name ? ` ${name}.` : ""}`, maxChars))
      bios.push(truncate(`I say what I think about ${intStr || profession}.${name ? ` — ${name}` : ""}`, maxChars))
    }
    return bios
  }

  if (platform === "tiktok") {
    if (tone === "fun") {
      bios.push(truncate(`${profEmoji} ${profession} ${intEmojis}\n${name ? name : ""}`, maxChars))
      bios.push(truncate(`Just a ${profession.toLowerCase()} who loves ${intList[0] || "creating"} ${profEmoji}`, maxChars))
      bios.push(truncate(`${intEmojis} ${intStr || profession}\n${name ? `↓ ${name}` : ""}`, maxChars))
    } else if (tone === "bold") {
      bios.push(truncate(`${profession.toUpperCase()} 🔥\n${intStr}`, maxChars))
      bios.push(truncate(`Not your average ${profession.toLowerCase()} ${profEmoji}\n${intEmojis}`, maxChars))
      bios.push(truncate(`${profEmoji} ${profession}\n${intStr ? `${intStr} ⚡` : ""}`, maxChars))
    } else {
      bios.push(truncate(`${profession} ${profEmoji}\n${intStr ? `${intStr}` : ""}`, maxChars))
      bios.push(truncate(`${profEmoji} ${profession}\n${name || ""}`, maxChars))
      bios.push(truncate(`${profession} | ${intStr || "creating content"}`, maxChars))
    }
    return bios
  }

  // Instagram
  if (tone === "fun") {
    bios.push(truncate(`${profEmoji} ${profession}\n${intEmojis} ${intStr}\n✨ ${name || "Living my best life"}`, maxChars))
    bios.push(truncate(`Part ${profession.toLowerCase()}, part ${intList[0] || "adventurer"} ${profEmoji}\n${intList[1] ? `${getEmoji(intList[1])} ${intList[1]}` : ""}\n${name || ""}`, maxChars))
    bios.push(truncate(`${intEmojis}\n${profession} who loves ${intStr || "life"}\n${name ? `🌟 ${name}` : ""}`, maxChars))
  } else if (tone === "professional") {
    bios.push(truncate(`${profession}\n${intStr ? `📌 ${intStr}` : ""}\n${name ? `→ ${name}` : ""}`, maxChars))
    bios.push(truncate(`${profEmoji} ${profession}\nPassionate about ${intStr || "my craft"}\n${name || ""}`, maxChars))
    bios.push(truncate(`Professional ${profession.toLowerCase()}\n${intStr ? `${intStr}` : ""}\n${name ? `📧 ${name}` : ""}`, maxChars))
  } else {
    bios.push(truncate(`${profession.toUpperCase()} ${profEmoji}\n${intEmojis} ${intStr}\n${name ? `⚡ ${name}` : ""}`, maxChars))
    bios.push(truncate(`Building things. Breaking limits. ${profEmoji}\n${intStr ? `Into ${intStr}` : ""}\n${name || ""}`, maxChars))
    bios.push(truncate(`${profEmoji} ${profession}\nNot here to fit in.\n${intEmojis} ${intStr}`, maxChars))
  }
  return bios
}

export default function BioGeneratorClient() {
  const [platform, setPlatform] = useState<Platform>("instagram")
  const [name, setName] = useState("")
  const [profession, setProfession] = useState("")
  const [interests, setInterests] = useState("")
  const [tone, setTone] = useState<"fun" | "professional" | "bold">("fun")
  const [bios, setBios] = useState<string[]>([])
  const [copied, setCopied] = useState<number | null>(null)

  function generate() {
    if (!profession.trim()) return
    setBios(generateBios({ name, profession, interests, tone, platform }))
  }

  function regenerate() {
    if (!profession.trim()) return
    setBios(generateBios({ name, profession, interests, tone, platform }))
  }

  async function copy(text: string, i: number) {
    await navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Platform */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(PLATFORM_LABELS) as [Platform, { name: string; maxChars: number; emoji: string }][]).map(([p, info]) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              platform === p ? "bg-primary text-primary-foreground border-transparent" : "bg-background border hover:border-primary/50"
            }`}
          >
            <span>{info.emoji}</span> {info.name}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-card border rounded-2xl p-6 space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" /> Your name (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah, @username"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" /> Profession / what you do *
            </label>
            <input
              type="text"
              placeholder="e.g. photographer, fitness coach, software developer"
              value={profession}
              onChange={e => setProfession(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4 text-muted-foreground" /> Interests / hobbies (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. travel, coffee, dogs"
              value={interests}
              onChange={e => setInterests(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tone</label>
            <div className="flex gap-2">
              {(["fun", "professional", "bold"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                    tone === t ? "bg-primary text-primary-foreground border-transparent" : "bg-background border hover:border-primary/50"
                  }`}
                >
                  {t === "fun" ? "😄 Fun" : t === "professional" ? "💼 Pro" : "⚡ Bold"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!profession.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-40 transition-all"
        >
          <Sparkles className="w-4 h-4" /> Generate Bios
        </button>
      </div>

      {/* Results */}
      {bios.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base">
              {PLATFORM_LABELS[platform].emoji} {PLATFORM_LABELS[platform].name} Bios — pick your favorite
            </h2>
            <button
              onClick={regenerate}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
          </div>

          {bios.map((bio, i) => (
            <div key={i} className="bg-card border rounded-xl p-5 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words font-sans flex-1">
                  {bio}
                </pre>
                <button
                  onClick={() => copy(bio, i)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    copied === i
                      ? "bg-green-500 text-white"
                      : "bg-muted hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {copied === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === i ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <span>Option {i + 1}</span>
                <span>{bio.length} / {PLATFORM_LABELS[platform].maxChars} chars</span>
              </div>
            </div>
          ))}

          <p className="text-xs text-muted-foreground text-center">
            Tip: Mix and match lines from different options to create your perfect bio.
          </p>
        </div>
      )}
    </div>
  )
}
