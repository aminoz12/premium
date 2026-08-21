import { NextResponse } from "next/server"

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/videos-sitemap.xml", request.url), 308)
}
