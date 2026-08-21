import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith("https://image.pollinations.ai/")) {
    return new NextResponse("Bad request", { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NextJS)" },
    });
  } catch {
    return new NextResponse("Upstream fetch failed", { status: 502 });
  }

  if (!res.ok) {
    return new NextResponse(`Upstream ${res.status}`, { status: res.status });
  }

  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
