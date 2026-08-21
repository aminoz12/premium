import { submitToIndexNow } from "@/lib/seo/indexnow"

export async function pingIndexNow(urls: string[]) {
  return submitToIndexNow(urls)
}
