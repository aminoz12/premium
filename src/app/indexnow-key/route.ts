import { getIndexNowKey } from "@/lib/seo/indexnow-config"

// Legacy helper endpoint kept for manual verification and backwards compatibility.
// IndexNow submissions now point search engines at /indexnow-key.txt via keyLocation.
export async function GET() {
  const indexNowKey = getIndexNowKey()

  if (!indexNowKey) {
    return new Response("IndexNow key not configured", { status: 404 })
  }

  return new Response(indexNowKey, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
