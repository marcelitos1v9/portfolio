import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Marcelo Augusto — Stack técnica"
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #E8C54708 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8C54705 0%, transparent 50%)",
          }}
        />

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
          /STACK · MARCELO AUGUSTO
        </div>

        <div
          style={{
            fontSize: 88,
            fontWeight: 300,
            color: "#F0F0F0",
            lineHeight: 1,
            marginBottom: 32,
            display: "flex",
          }}
        >
          Stack técnica.
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            maxWidth: 1000,
          }}
        >
          {[
            "GCP",
            "BigQuery",
            "Dataform",
            "Pub/Sub",
            "Cloud Run",
            "Python",
            "PyTorch",
            "TypeScript",
            "Next.js",
            "Go",
            "Kotlin",
            "Docker",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                color: "#C2C2C2",
                border: "1px solid #3A3A3A",
                padding: "8px 16px",
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
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
          marceloaguiar.dev/stack
        </div>

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
