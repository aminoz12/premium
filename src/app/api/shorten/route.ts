export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    if (!res.ok) throw new Error("upstream error")
    const short = await res.text()
    if (!short.startsWith("http")) throw new Error("invalid response")
    return new Response(short, {
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    })
  } catch {
    return Response.json({ error: "Could not shorten URL" }, { status: 502 })
  }
}
