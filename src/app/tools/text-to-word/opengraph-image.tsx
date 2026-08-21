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
          {/* Top section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Category label */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "22px",
                color: "#93c5fd",
              }}
            >
              <span>📄 Document Tools</span>
              <span>•</span>
              <span>Free · No Signup · 100% Private</span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "58px",
                lineHeight: 1.04,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                maxWidth: "880px",
              }}
            >
              Free Text to Word Converter
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "26px",
                lineHeight: 1.4,
                color: "#cbd5e1",
                maxWidth: "880px",
              }}
            >
              Bold · Italic · Headings · Lists · Custom Font · A4 / US Letter
              <br />
              Download .docx instantly. Works in Microsoft Word, Google Docs & more.
            </div>
          </div>

          {/* Feature pills row */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              margin: "8px 0",
            }}
          >
            {["✓ H1–H3 Headings", "✓ Bold & Italic", "✓ Bullet Lists", "✓ 6 Font Families", "✓ Page Numbers", "✓ Browser-only"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    padding: "6px 16px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontSize: "18px",
                    color: "#e2e8f0",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "22px",
              color: "#94a3b8",
            }}
          >
            <span>thefreeaitools.com</span>
            <span style={{ color: "#60a5fa" }}>/tools/text-to-word</span>
          </div>
        </div>
      </div>
    ),
    size
  )
}