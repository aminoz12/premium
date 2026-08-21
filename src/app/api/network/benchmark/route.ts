const MIN_BYTES = 4 * 1024
const MAX_BYTES = 5 * 1024 * 1024

function clampBytes(value: number) {
  if (!Number.isFinite(value)) {
    return 512 * 1024
  }

  return Math.min(MAX_BYTES, Math.max(MIN_BYTES, Math.round(value)))
}

function createBenchmarkPayload(size: number) {
  const payload = new Uint8Array(size)

  for (let index = 0; index < payload.length; index += 1) {
    payload[index] = (index * 31 + 17) % 251
  }

  return payload
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bytes = clampBytes(Number(searchParams.get("bytes") || 512 * 1024))
  const payload = createBenchmarkPayload(bytes)

  return new Response(payload, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(bytes),
      "Cache-Control": "no-store, max-age=0",
      Pragma: "no-cache",
    },
  })
}

export async function POST(request: Request) {
  const body = await request.arrayBuffer()

  return Response.json(
    {
      receivedBytes: body.byteLength,
      timestamp: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    }
  )
}
