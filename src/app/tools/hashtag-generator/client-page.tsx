"use client"

import { useState, useRef } from "react"
import { Hash, Copy, Check, RefreshCw, Sparkles, TrendingUp, Target, Search } from "lucide-react"

const HASHTAG_DB: Record<string, string[][]> = {
  // [popular, medium, niche]
  travel: [
    ["#travel", "#travelgram", "#wanderlust", "#travelphotography", "#traveling", "#vacation", "#adventure", "#explore", "#instatravel", "#travelblogger"],
    ["#traveldiaries", "#traveltheworld", "#travellife", "#travelpics", "#traveladdict", "#travels", "#travelphoto", "#travelstyle", "#worldtravel", "#travelersnotebook"],
    ["#travelcouple", "#solotravel", "#backpacker", "#budgettravel", "#luxurytravel", "#sustainabletravel", "#travelinspiration", "#travelwithdogs", "#slowtravel", "#digitalnomad"],
  ],
  food: [
    ["#food", "#foodie", "#foodphotography", "#instafood", "#foodstagram", "#delicious", "#yummy", "#homecooking", "#recipe", "#dinner"],
    ["#foodlover", "#foodblogger", "#foodporn", "#cooking", "#healthyfood", "#foodphoto", "#lunchtime", "#breakfasttime", "#foodart", "#foodgasm"],
    ["#veganfood", "#glutenfree", "#mealprep", "#cleaneating", "#plantbased", "#foodstyling", "#weeknightdinner", "#quickmeals", "#foodhacks", "#cookingathome"],
  ],
  fitness: [
    ["#fitness", "#gym", "#workout", "#fitlife", "#fit", "#bodybuilding", "#training", "#motivation", "#health", "#exercise"],
    ["#fitnessgoals", "#fitnessmotivation", "#gymlife", "#workoutmotivation", "#fitnessjourney", "#weightloss", "#muscle", "#cardio", "#fitspo", "#fitnesslifestyle"],
    ["#homeworkout", "#crossfit", "#hiit", "#strengthtraining", "#personaltrainer", "#gainz", "#sweateveryday", "#fitfam", "#preworkout", "#recoveryrun"],
  ],
  fashion: [
    ["#fashion", "#style", "#ootd", "#outfit", "#fashionista", "#clothing", "#streetstyle", "#trendy", "#stylish", "#fashionable"],
    ["#outfitoftheday", "#fashionblogger", "#fashionphotography", "#lookbook", "#wiwt", "#fashionstyle", "#streetfashion", "#casualstyle", "#outfitinspo", "#styleinspo"],
    ["#sustainablefashion", "#slowfashion", "#vintagefashion", "#thriftflip", "#capsulewardrobe", "#fashiondesigner", "#outfitpost", "#springfashion", "#falloutfit", "#fashionforward"],
  ],
  beauty: [
    ["#beauty", "#makeup", "#skincare", "#makeuplover", "#cosmetics", "#beautyblogger", "#makeuptutorial", "#glam", "#lipstick", "#eyeshadow"],
    ["#makeupartist", "#beautycare", "#skincareroutine", "#glow", "#naturalbeauty", "#skincarecommunity", "#makeupoftheday", "#skincareproducts", "#beautyproducts", "#makeuplook"],
    ["#skintok", "#cleanskincare", "#kbeauty", "#glasskin", "#nofilter", "#antiaging", "#acnecare", "#hyperpigmentation", "#niacinamide", "#spfeveryday"],
  ],
  business: [
    ["#business", "#entrepreneur", "#marketing", "#success", "#motivation", "#startup", "#entrepreneurship", "#smallbusiness", "#leadership", "#growth"],
    ["#businessowner", "#businesstips", "#digitalmarketing", "#contentmarketing", "#socialmediamarketing", "#businessmindset", "#sidehustle", "#hustle", "#businessgrowth", "#b2b"],
    ["#solopreneur", "#ecommerce", "#dropshipping", "#affiliatemarketing", "#emailmarketing", "#seo2026", "#contentcreator", "#remotework", "#freelancer", "#passiveincome"],
  ],
  technology: [
    ["#technology", "#tech", "#innovation", "#ai", "#programming", "#coding", "#software", "#digital", "#developer", "#tech2026"],
    ["#machinelearning", "#artificialintelligence", "#cybersecurity", "#blockchain", "#web3", "#cloudcomputing", "#devops", "#javascript", "#python", "#datascience"],
    ["#llm", "#openai", "#chatgpt", "#generativeai", "#promptengineering", "#aitools", "#techjobs", "#codinglife", "#selfhosted", "#opensourcecode"],
  ],
  photography: [
    ["#photography", "#photo", "#photographer", "#photooftheday", "#picoftheday", "#nature", "#landscape", "#portrait", "#beautiful", "#instagood"],
    ["#photographylovers", "#photographyislife", "#photoart", "#streetphotography", "#naturephotography", "#landscapephotography", "#portraitphotography", "#travelphotography", "#mobilephotography", "#iphonephotography"],
    ["#goldenhour", "#leica", "#filmphotography", "#35mm", "#analogphotography", "#lightroom", "#canonphotography", "#nikontop", "#photographymood", "#visualsoflife"],
  ],
  health: [
    ["#health", "#wellness", "#healthy", "#selfcare", "#mentalhealth", "#mindfulness", "#meditation", "#yoga", "#wellbeing", "#healthylifestyle"],
    ["#healthyliving", "#wellnessjourney", "#selfcaretips", "#mindset", "#healthcoach", "#nutritioncoach", "#holistichealth", "#healthtips", "#mentalwellness", "#stressrelief"],
    ["#guthealth", "#hormonalhealth", "#somatichealing", "#nervousystemregulation", "#cortisol", "#functionalmedicine", "#antiinflammatory", "#sleephealth", "#coldplunge", "#longevity"],
  ],
  pets: [
    ["#dog", "#cat", "#pets", "#puppy", "#kitten", "#dogsofinstagram", "#catsofinstagram", "#animals", "#cute", "#petsofinstagram"],
    ["#doglife", "#catlife", "#doglovers", "#catlovers", "#dogoftheday", "#catoftheday", "#rescuedog", "#rescuecat", "#animallover", "#petphotography"],
    ["#goldenretriever", "#frenchbulldog", "#labrador", "#siamese", "#maincoon", "#dogmom", "#catmom", "#tuxedocat", "#dogpark", "#adoptdontshop"],
  ],
}

const DEFAULT_KEYWORDS = Object.keys(HASHTAG_DB)

function getHashtagsForTopic(topic: string): { popular: string[], medium: string[], niche: string[] } {
  const normalized = topic.toLowerCase().trim()

  // Direct match
  for (const key of Object.keys(HASHTAG_DB)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      const [popular, medium, niche] = HASHTAG_DB[key]
      return { popular, medium, niche }
    }
  }

  // Generate based on input
  const base = normalized.replace(/[^a-z0-9]/g, "")
  const words = normalized.split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, "")).filter(Boolean)

  const popular = [
    `#${base}`, `#${base}life`, `#${base}love`, `#${base}gram`,
    "#instagood", "#photooftheday", "#trending2026", "#viral",
    "#contentcreator", "#followme",
  ].slice(0, 10)

  const medium = [
    `#${base}community`, `#${base}tips`, `#${base}daily`, `#${base}world`,
    `#${base}inspiration`, `#${base}motivation`, `#${base}journey`,
    `#${base}lifestyle`, `#${base}guide`, `#${base}expert`,
  ].slice(0, 10)

  const niche = [
    ...words.flatMap(w => [`#${w}`, `#${w}2026`, `#${w}niche`]),
    `#${base}hack`, `#${base}pro`, `#best${base}`,
  ].slice(0, 10)

  return { popular, medium, niche }
}

export default function HashtagGeneratorClient() {
  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "twitter" | "youtube">("instagram")
  const [result, setResult] = useState<{ popular: string[], medium: string[], niche: string[] } | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const platformLimits: Record<string, { max: number; label: string }> = {
    instagram: { max: 30, label: "Instagram (max 30)" },
    tiktok: { max: 10, label: "TikTok (max 10)" },
    twitter: { max: 5, label: "Twitter/X (max 5)" },
    youtube: { max: 15, label: "YouTube (max 15)" },
  }

  function generate() {
    const input = topic.trim()
    if (!input) return
    setResult(getHashtagsForTopic(input))
  }

  function allHashtags() {
    if (!result) return []
    const limit = platformLimits[platform].max
    return [...result.popular, ...result.medium, ...result.niche].slice(0, limit)
  }

  async function copySection(tags: string[], key: string) {
    await navigator.clipboard.writeText(tags.join(" "))
    setCopiedSection(key)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  function pickRandom() {
    const keys = DEFAULT_KEYWORDS
    const pick = keys[Math.floor(Math.random() * keys.length)]
    setTopic(pick)
    setResult(getHashtagsForTopic(pick))
  }

  const all = allHashtags()

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input Card */}
      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="space-y-3">
          <label htmlFor="topic-input" className="block text-sm font-semibold">
            Your topic or niche
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              id="topic-input"
              type="text"
              placeholder="e.g. travel, fitness, food, technology…"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()}
              className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Platform selector */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Platform</p>
          <div className="flex flex-wrap gap-2">
            {(["instagram", "tiktok", "twitter", "youtube"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  platform === p
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-background border hover:border-primary/50"
                }`}
              >
                {platformLimits[p].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generate}
            disabled={!topic.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm transition-all hover:bg-primary/90 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            Generate Hashtags
          </button>
          <button
            onClick={pickRandom}
            className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl font-semibold text-sm hover:bg-muted/70 transition-all"
            title="Random topic"
          >
            <RefreshCw className="w-4 h-4" />
            Random
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* All hashtags — copy all */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" />
                All {all.length} Hashtags — {platformLimits[platform].label}
              </p>
              <button
                onClick={() => copySection(all, "all")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  copiedSection === "all"
                    ? "bg-green-500 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {copiedSection === "all" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedSection === "all" ? "Copied!" : "Copy All"}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground font-mono break-all">
              {all.join(" ")}
            </p>
          </div>

          {/* Grouped sections */}
          {([
            { key: "popular", label: "Trending (1M+ posts)", tags: result.popular.slice(0, platformLimits[platform].max), icon: <TrendingUp className="w-4 h-4" />, color: "text-orange-500" },
            { key: "medium", label: "Mid-size (100K–1M posts)", tags: result.medium.slice(0, Math.max(0, platformLimits[platform].max - result.popular.length)), icon: <Target className="w-4 h-4" />, color: "text-blue-500" },
            { key: "niche", label: "Niche (<100K posts)", tags: result.niche.slice(0, Math.max(0, platformLimits[platform].max - result.popular.length - result.medium.length)), icon: <Hash className="w-4 h-4" />, color: "text-green-500" },
          ] as const).map(({ key, label, tags, icon, color }) => (
            tags.length > 0 && (
              <div key={key} className="bg-card border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold flex items-center gap-1.5 ${color}`}>
                    {icon} {label}
                  </p>
                  <button
                    onClick={() => copySection(tags, key)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-muted hover:bg-muted/70 transition-all"
                  >
                    {copiedSection === key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSection === key ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      onClick={() => navigator.clipboard.writeText(tag)}
                      className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors"
                      title="Click to copy this hashtag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/40 rounded-xl p-5 space-y-2 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Pro tips for maximum reach</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Mix popular and niche hashtags for best reach</li>
          <li>Instagram allows up to 30 — use them all</li>
          <li>TikTok works best with 3–5 targeted hashtags</li>
          <li>Refresh your hashtag set every 2–4 weeks</li>
          <li>Click any hashtag to copy it individually</li>
        </ul>
      </div>
    </div>
  )
}
