import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import NowClient from "./NowClient"

export const metadata: Metadata = {
  title: "Now",
  description:
    "No que estou trabalhando, lendo e aprendendo agora. Atualizado conforme o foco muda.",
  openGraph: {
    title: "Now — Marcelo Augusto",
    description:
      "No que estou trabalhando, lendo e aprendendo agora. Atualizado conforme o foco muda.",
    type: "article",
  },
}

export default function NowPage() {
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
        <NowClient />
      </main>
      <Footer />
    </>
  )
}
