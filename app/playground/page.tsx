import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import PlaygroundClient from "./PlaygroundClient"

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Pipeline Medallion completo rodando no seu browser via DuckDB-WASM — Staging → Bronze → Silver → Gold, sem backend.",
  openGraph: {
    title: "Playground — Marcelo Augusto",
    description:
      "DuckDB-WASM no browser. Pipeline Medallion completo (Staging → Bronze → Silver → Gold) sobre dados sintéticos.",
    type: "article",
  },
}

export default function PlaygroundPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: "calc(64px + clamp(3rem, 8vw, 6rem))",
          paddingBottom: "clamp(5rem, 12vw, 10rem)",
          paddingLeft: "clamp(1.5rem, 8vw, 8rem)",
          paddingRight: "clamp(1.5rem, 8vw, 8rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <PlaygroundClient />
      </main>
      <Footer />
    </>
  )
}
