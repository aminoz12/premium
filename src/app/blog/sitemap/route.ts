import { NextResponse } from "next/server"

export const dynamic = "force-static"
export const revalidate = 3600

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.thefreeaitools.com/blog/</loc>
  </url>
</urlset>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
