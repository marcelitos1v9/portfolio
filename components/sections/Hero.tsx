"use client"

import { useEffect, useState } from "react"
import { useTextScramble } from "@/hooks/useTextScramble"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [lineVisible, setLineVisible] = useState(false)
  const [scrollVisible, setScrollVisible] = useState(true)
  const scrambledName = useTextScramble("Marcelo Augusto.", mounted)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    const t1 = setTimeout(() => setLineVisible(true), 400)
    const onScroll = () => {
      if (window.scrollY > 50) setScrollVisible(false)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(t1)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <section
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(1.5rem, 8vw, 8rem)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        {/* Label */}
        <div
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "1rem",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease 0.1s",
          }}
        >
          Data Engineer · Full Stack · AI
        </div>

        {/* Animated line */}
        <div
          style={{
            height: 1,
            background: "var(--color-muted)",
            transformOrigin: "left",
            transform: lineVisible ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            marginBottom: "1.5rem",
            width: "clamp(80px, 15vw, 160px)",
          }}
        />

        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            fontWeight: 300,
            lineHeight: 1.0,
            color: "var(--color-heading)",
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.2s",
          }}
        >
          {scrambledName}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            color: "var(--color-body)",
            lineHeight: 1.7,
            maxWidth: "480px",
            marginBottom: "3rem",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          {t.hero_subtitle_line1}
          <br />
          {t.hero_subtitle_line2}
          <br />
          <span style={{ color: "var(--color-muted)", fontSize: "0.9em" }}>{t.hero_location}</span>
        </p>

        {/* CTA */}
        <a
          href="/stack"
          aria-label={t.hero_cta_aria}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-heading)",
            textDecoration: "none",
            border: "1px solid var(--color-border)",
            padding: "0.75rem 1.5rem",
            transition: "border-color 0.2s, color 0.2s",
            opacity: mounted ? 1 : 0,
            transitionDelay: "0.6s, 0.6s, 0.6s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)"
            e.currentTarget.style.color = "var(--color-accent)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)"
            e.currentTarget.style.color = "var(--color-heading)"
          }}
        >
          {t.hero_cta}
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          opacity: scrollVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <ScrollPulse />
      </div>
    </section>
  )
}

function ScrollPulse() {
  return (
    <div
      style={{
        width: 1,
        height: 40,
        background: "var(--color-muted)",
        animation: "scrollPulse 1.8s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
