import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import StackExplorer from "@/components/stack/StackExplorer"
import StackPageHeader from "@/components/stack/StackPageHeader"

export const metadata = {
  title: "Stack",
  description:
    "Stack técnica de Marcelo Augusto: GCP, BigQuery, Dataform, Python, TypeScript, Go, Next.js e mais.",
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
      <Footer />
    </>
  )
}
