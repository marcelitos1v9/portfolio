import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Marcelo Augusto — Data Engineer & Full Stack Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
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
        {/* Noise overlay simulation (subtle grid) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #E8C54708 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8C54705 0%, transparent 50%)",
          }}
        />

        {/* Accent line top */}
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

        {/* Label */}
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
          DATA ENGINEER · FULL STACK · AI
        </div>

        {/* Name */}
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
          Marcelo Augusto.
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "#A8A8A8",
            lineHeight: 1.6,
            maxWidth: 700,
            display: "flex",
          }}
        >
          Pipelines end-to-end em GCP · BigQuery · Dataform · Medallion Architecture · Registro, SP
        </div>

        {/* Bottom separator + URL */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontFamily: "monospace",
            fontSize: 14,
            color: "#3A3A3A",
            letterSpacing: "0.08em",
            display: "flex",
          }}
        >
          marceloaguiar.dev
        </div>

        {/* Left border accent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background:
              "linear-gradient(to bottom, #E8C547 0%, transparent 60%)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
