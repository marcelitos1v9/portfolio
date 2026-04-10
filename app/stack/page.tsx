import Navbar from "@/components/layout/Navbar"
import StackExplorer from "@/components/stack/StackExplorer"
import StackPageHeader from "@/components/stack/StackPageHeader"

export const metadata = {
  title: "Stack — Marcelo Aguiar",
  description: "Stack técnica de Marcelo Aguiar: GCP, BigQuery, Dataform, Python, Next.js e mais.",
}

export default function StackPage() {
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
        <StackPageHeader />
        <StackExplorer />
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "2rem clamp(1.5rem, 8vw, 8rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            color: "var(--color-muted)",
          }}
        >
          MAA
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.05em",
            color: "var(--color-muted)",
          }}
        >
          {new Date().getFullYear()}
        </span>
      </footer>
    </>
  )
}
