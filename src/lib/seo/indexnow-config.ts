import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"

export const INDEXNOW_KEY_PATH = "/indexnow-key.txt"

export function getIndexNowKey() {
  return process.env.INDEXNOW_KEY?.trim() ?? ""
}

export function getIndexNowHost() {
  return new URL(siteConfig.url).hostname
}

export function getIndexNowKeyLocation() {
  return process.env.INDEXNOW_KEY_LOCATION?.trim() || buildAbsoluteUrl(INDEXNOW_KEY_PATH)
}
