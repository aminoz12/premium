import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"

export const dynamic = "force-dynamic"

export function GET() {
  const body = [
    `Contact: mailto:${siteConfig.securityEmail}`,
    `Contact: mailto:${siteConfig.email}`,
    `Preferred-Languages: en`,
    `Canonical: ${buildAbsoluteUrl("/.well-known/security.txt")}`,
    `Policy: ${buildAbsoluteUrl("/security")}`,
    `Expires: 2027-03-24T00:00:00.000Z`,
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
