import { getIndexNowKey } from "@/lib/seo/indexnow-config"

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
