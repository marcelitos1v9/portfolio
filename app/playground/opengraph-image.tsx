import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Marcelo Augusto — Pipeline Playground (DuckDB-WASM)"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  const stages = [
    { name: "Staging", color: "#8A8A8A" },
    { name: "Bronze", color: "#CD7F32" },
    { name: "Silver", color: "#C0C0C0" },
    { name: "Gold", color: "#E8C547" },
  ]
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0D0D0D",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "#E8C547",
          }}
        />

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#E8C547",
            marginBottom: 24,
            display: "flex",
          }}
        >
          /PLAYGROUND · MARCELO AUGUSTO
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 300,
            color: "#F0F0F0",
            lineHeight: 1,
            marginBottom: 32,
            display: "flex",
          }}
        >
          Medallion, in-browser.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          {stages.map((stage, i) => (
            <div key={stage.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 20,
                  color: "#C2C2C2",
                  border: `2px solid ${stage.color}`,
                  padding: "12px 20px",
                  display: "flex",
                }}
              >
                {stage.name}
              </div>
              {i < stages.length - 1 && (
                <span style={{ color: "#3A3A3A", fontSize: 24, display: "flex" }}>→</span>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 18,
            color: "#8A8A8A",
            display: "flex",
          }}
        >
          DuckDB-WASM · SQL · zero backend
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontFamily: "monospace",
            fontSize: 14,
            color: "#8A8A8A",
            letterSpacing: "0.08em",
            display: "flex",
          }}
        >
          marceloaguiar.dev/playground
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: "linear-gradient(to bottom, #E8C547 0%, transparent 60%)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
