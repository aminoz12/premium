import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
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
            "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
          color: "#f8fafc",
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
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "32px",
            padding: "44px",
            background: "rgba(15,23,42,0.42)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "22px",
                color: "#93c5fd",
              }}
            >
              <span>Audio Tools</span>
              <span>•</span>
              <span>Suite</span>
            </div>
            <div
              style={{
                fontSize: "60px",
                lineHeight: 1.04,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                maxWidth: "880px",
              }}
            >
              Audio Tools Suite
            </div>
            <div
              style={{
                fontSize: "28px",
                lineHeight: 1.35,
                color: "#cbd5e1",
                maxWidth: "880px",
              }}
            >
              Free browser-based audio converter — MP3, WAV, OGG, M4A, FLAC,
              AAC, MP4, AIFF. Plus trim, normalize, and waveform export.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "24px",
              color: "#e2e8f0",
            }}
          >
            <span>Browser-based • Privacy-first • The Free AI Tools</span>
            <span>/tools/audio-converter</span>
          </div>
        </div>
      </div>
    ),
    size
  )
}
