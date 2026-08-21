export type AdPageType = "home" | "tool" | "category" | "content" | "notFound"
export type AdPlacement = "inline" | "sidebar" | "rectangle" | "mobile"

export interface AdSlotConfig {
  key: string
  label: string
  format: "iframe"
  width: number
  height: number
  minHeight: number
  invokeSrc: string
}

function splitEnvList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export const ENABLE_CSP_RELAXED_ADS = process.env.NEXT_PUBLIC_ENABLE_CSP_RELAXED_ADS !== "false"

// Native ad network — the defaults match the inventory in adsttera.txt.
export const POPUNDER_SCRIPT_SRC =
  process.env.NEXT_PUBLIC_POPUNDER_SCRIPT_SRC ??
  "https://pl29079684.effectivecpmnetwork.com/f3/b8/19/f3b819d87c1e8397646487db16f656aa.js"
export const NATIVE_AD_SCRIPT_SRC =
  process.env.NEXT_PUBLIC_NATIVE_AD_SCRIPT_SRC ??
  "https://pl29079683.effectivecpmnetwork.com/fd2c3f6bb909007646f53c4eb97254f1/invoke.js"
export const NATIVE_AD_CONTAINER_ID =
  process.env.NEXT_PUBLIC_NATIVE_AD_CONTAINER_ID ??
  "container-fd2c3f6bb909007646f53c4eb97254f1"

export const TAG_SCRIPT_SRC = process.env.NEXT_PUBLIC_TAG_SCRIPT_SRC ?? ""
export const TAG_ZONE_ID = process.env.NEXT_PUBLIC_TAG_ZONE_ID ?? ""
export const SMARTLINK_URLS = splitEnvList(process.env.NEXT_PUBLIC_SMARTLINK_URLS)

// ─── Ad Slots (all sizes from adsttera.txt) ───────────────────────────────────

const leaderboardSlot: AdSlotConfig = {
  key: "235a76e427e9566ed96408404de72b29", // 728×90
  label: "Advertisement",
  format: "iframe",
  width: 728,
  height: 90,
  minHeight: 90,
  invokeSrc: "https://www.highperformanceformat.com/235a76e427e9566ed96408404de72b29/invoke.js",
}

const smallInlineSlot: AdSlotConfig = {
  key: "20e496597263f094a6c316dfa3fcd554", // 468×60
  label: "Advertisement",
  format: "iframe",
  width: 468,
  height: 60,
  minHeight: 60,
  invokeSrc: "https://www.highperformanceformat.com/20e496597263f094a6c316dfa3fcd554/invoke.js",
}

const sidebarSlot: AdSlotConfig = {
  key: "e0fbd1312ec28144e053526080af1ebc", // 160×600
  label: "Advertisement",
  format: "iframe",
  width: 160,
  height: 600,
  minHeight: 600,
  invokeSrc: "https://www.highperformanceformat.com/e0fbd1312ec28144e053526080af1ebc/invoke.js",
}

const smallSidebarSlot: AdSlotConfig = {
  key: "5d0373f44e2f282e85d27df741111032", // 160×300
  label: "Advertisement",
  format: "iframe",
  width: 160,
  height: 300,
  minHeight: 300,
  invokeSrc: "https://www.highperformanceformat.com/5d0373f44e2f282e85d27df741111032/invoke.js",
}

const rectangleSlot: AdSlotConfig = {
  key: "50c611ef1d0277e306c7033c33d12e24", // 300×250
  label: "Advertisement",
  format: "iframe",
  width: 300,
  height: 250,
  minHeight: 250,
  invokeSrc: "https://www.highperformanceformat.com/50c611ef1d0277e306c7033c33d12e24/invoke.js",
}

const mobileSlot: AdSlotConfig = {
  key: "54ce9d543aa4e7e483c0a7269e33ed36", // 320×50
  label: "Advertisement",
  format: "iframe",
  width: 320,
  height: 50,
  minHeight: 50,
  invokeSrc: "https://www.highperformanceformat.com/54ce9d543aa4e7e483c0a7269e33ed36/invoke.js",
}

// Use leaderboard as the primary "inline" slot (728×90 > 468×60 for CPM)
const inlineSlot = leaderboardSlot

export const BANNER_AD_SLOTS = {
  leaderboard: leaderboardSlot,
  smallInline: smallInlineSlot,
  sidebar: sidebarSlot,
  smallSidebar: smallSidebarSlot,
  rectangle: rectangleSlot,
  mobile: mobileSlot,
}

export type BannerAdType = keyof typeof BANNER_AD_SLOTS

export const adConfig: Record<AdPageType, Partial<Record<AdPlacement, AdSlotConfig>>> = {
  home: {
    inline: inlineSlot,
    sidebar: sidebarSlot,
    rectangle: rectangleSlot,
    mobile: mobileSlot,
  },
  tool: {
    inline: inlineSlot,
    sidebar: sidebarSlot,
    rectangle: rectangleSlot,
    mobile: mobileSlot,
  },
  category: {
    inline: inlineSlot,
    sidebar: sidebarSlot,
    rectangle: rectangleSlot,
    mobile: mobileSlot,
  },
  content: {
    inline: inlineSlot,
    sidebar: sidebarSlot,
    rectangle: rectangleSlot,
    mobile: mobileSlot,
  },
  notFound: {
    inline: inlineSlot,
    sidebar: sidebarSlot,
    rectangle: rectangleSlot,
    mobile: mobileSlot,
  },
}

export function getAdSlot(pageType: AdPageType, placement: AdPlacement) {
  return adConfig[pageType][placement]
}
