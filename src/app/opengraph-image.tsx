import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site-config"
import { toolCount } from "@/lib/tools/tools-config"

export const runtime = "edge"
export const alt = `${siteConfig.name} free online tools directory`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, #ffffff 0%, #eff6ff 45%, #f8fafc 100%)",
          color: "#0f172a",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            borderRadius: "32px",
            padding: "44px",
            background: "rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "22px",
                color: "#2563eb",
              }}
            >
              <span>Free online tools directory</span>
            </div>
            <div
              style={{
                fontSize: "66px",
                lineHeight: 1.06,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                maxWidth: "860px",
              }}
            >
              {siteConfig.name}
            </div>
            <div
              style={{
                fontSize: "28px",
                lineHeight: 1.35,
                color: "#475569",
                maxWidth: "860px",
              }}
            >
              {toolCount}+ client-side tools for developers, marketers, designers, students, and technical teams.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "24px",
              color: "#334155",
            }}
          >
            <div style={{ display: "flex", gap: "14px" }}>
              <span>No signup required</span>
              <span>•</span>
              <span>Accessible</span>
              <span>•</span>
              <span>Privacy-first</span>
            </div>
            <span>{siteConfig.url.replace("https://", "")}</span>
          </div>
        </div>
      </div>
    ),
    size
  )
}

