import type { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { DynamicToolLoader } from "@/components/tools/dynamic-tool-loader"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { JsonLd } from "@/components/seo/json-ld"
import { buildToolSchema, buildBreadcrumbSchema } from "@/lib/seo/schema"
import { getToolById } from "@/lib/tools/tools-config"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/metronome`

export const metadata: Metadata = {
  title: "Free Online Metronome — BPM Timer, Tap Tempo, No Signup",
  description:
    "Free online metronome — set BPM, tap tempo, and practice in time. Browser-based, sample-accurate Web Audio. No download, no signup, works offline after load.",
  keywords: [
    "metronome online free",
    "free online metronome",
    "bpm metronome online",
    "tap tempo metronome",
    "digital metronome free",
    "metronome no download",
    "music practice metronome",
    "online bpm timer",
    "metronome browser based",
    "free bpm counter online",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free Online Metronome — BPM Timer & Tap Tempo",
    description:
      "Set your BPM, tap the tempo, and practice in time — browser-based metronome with sample-accurate Web Audio. Free, no signup.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const tool = getToolById("metronome")
  return (
    <>
      {tool && (
        <JsonLd
          id="metronome-schema"
          data={[
            buildToolSchema(tool),
            buildBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Audio & Media", path: "/categories/audio" },
              { name: "Online Metronome", path: "/tools/metronome" },
            ]),
          ]}
        />
      )}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Free Online Metronome — BPM Timer, Tap Tempo, No Signup
      </h1>
      <QuickAnswer
        question="What BPM is allegro, andante, and adagio on a metronome?"
        answer="Standard tempo markings: Largo (40–60 BPM), Adagio (66–76 BPM), Andante (76–108 BPM), Moderato (108–120 BPM), Allegro (120–168 BPM), Presto (168–200 BPM). For beginners learning a new piece, set the metronome to 50–60% of the target tempo and gradually increase by 5–10 BPM as you master each speed."
      />
      <DynamicToolLoader category="audio" toolId="metronome" />
    </>
  )
}
