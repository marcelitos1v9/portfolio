"use client"

import { useEffect, useState } from "react"
import { useTextScramble } from "@/hooks/useTextScramble"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [lineVisible, setLineVisible] = useState(false)
  const [scrollVisible, setScrollVisible] = useState(true)
  const { t, lang } = useLanguage()
  // Replay scramble whenever the user toggles language.
  const scrambledName = useTextScramble("Marcelo Augusto.", mounted, lang)

  useEffect(() => {
    setMounted(true)
    const t1 = setTimeout(() => setLineVisible(true), 400)
    const onScroll = () => {
      setScrollVisible(window.scrollY <= 50)
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
        padding: "calc(var(--header-height) + 1rem) clamp(1.5rem, 8vw, 8rem) 4rem",
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
          aria-hidden="true"
          style={{
            height: 1,
            background: "var(--color-decorative)",
            transformOrigin: "left",
            transform: lineVisible ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            marginBottom: "1.5rem",
            width: "clamp(80px, 15vw, 160px)",
          }}
        />

        {/* Name — `aria-label` ensures screen readers always read the
            final text, never the scrambled intermediate frames. */}
        <h1
          aria-label={t.hero_name_aria}
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
          <span aria-hidden="true">{scrambledName}</span>
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

        {/* CTAs: primary (projects) + secondary (stack) + CV */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.6s",
          }}
        >
          <a
            href="#projects"
            aria-label={t.hero_cta_primary_aria}
            style={ctaStyle("primary")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "var(--color-accent)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent)"
              e.currentTarget.style.color = "var(--color-bg)"
            }}
          >
            {t.hero_cta_primary}
          </a>

          <a
            href="/stack"
            aria-label={t.hero_cta_secondary_aria}
            style={ctaStyle("secondary")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)"
              e.currentTarget.style.color = "var(--color-accent)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)"
              e.currentTarget.style.color = "var(--color-heading)"
            }}
          >
            {t.hero_cta_secondary}
          </a>

          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.hero_cta_cv_aria}
            download
            style={ctaStyle("ghost")}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-heading)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-muted)"
            }}
          >
            {t.hero_cta_cv} ↓
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll-indicator"
        aria-hidden="true"
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
          pointerEvents: scrollVisible ? "auto" : "none",
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

function ctaStyle(variant: "primary" | "secondary" | "ghost"): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textDecoration: "none",
    padding: "0.85rem 1.5rem",
    transition: "border-color 0.2s, color 0.2s, background 0.2s",
    minHeight: 44,
  }

  if (variant === "primary") {
    return {
      ...base,
      background: "var(--color-accent)",
      color: "var(--color-bg)",
      border: "1px solid var(--color-accent)",
    }
  }
  if (variant === "secondary") {
    return {
      ...base,
      color: "var(--color-heading)",
      border: "1px solid var(--color-border)",
    }
  }
  // ghost
  return {
    ...base,
    color: "var(--color-muted)",
    border: "1px solid transparent",
    padding: "0.85rem 0.75rem",
  }
}

function ScrollPulse() {
  return (
    <div
      style={{
        width: 1,
        height: 40,
        background: "var(--color-decorative)",
        animation: "scrollPulse 1.8s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @media (max-width: 480px) {
          .hero-scroll-indicator { display: none !important; }
        }
      `}</style>
    </div>
  )
}
