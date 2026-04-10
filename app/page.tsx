import Navbar from "@/components/layout/Navbar"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Expertise from "@/components/sections/Expertise"
import Projects from "@/components/sections/Projects"
import Timeline from "@/components/sections/Timeline"
import Contact from "@/components/sections/Contact"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Projects />
        <Timeline />
        <Contact />
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
          Marcelo Augusto Aguiar da Cruz
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
