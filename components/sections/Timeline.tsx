"use client"

import { useInView } from "@/hooks/useInView"
import { timelineData } from "@/lib/data/timeline"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Timeline() {
  const { ref: titleRef, isVisible: titleVisible } = useInView()
  const { ref: lineRef, isVisible: lineVisible } = useInView<HTMLDivElement>()
  const { lang, t } = useLanguage()

  return (
    <section
      style={{
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 8rem)",
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div ref={titleRef} style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            display: "block",
            marginBottom: "0.75rem",
          }}
        >
          {t.timeline_label}
        </span>
        <h2
          className={`reveal ${titleVisible ? "is-visible" : ""}`}
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 300,
            color: "var(--color-heading)",
          }}
        >
          {t.timeline_heading}
        </h2>
      </div>

      {/* Timeline — rule is top border of the grid container */}
      <div
        ref={lineRef}
        style={{ position: "relative" }}
      >
        {/* Animated horizontal rule across the top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "var(--color-border)",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--color-muted)",
              transformOrigin: "left",
              transform: lineVisible ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>

        {/* Entries — dots sit ON the top border */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0 1rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {timelineData.map((entry, i) => (
            <TimelineEntry key={i} entry={entry} index={i} lineVisible={lineVisible} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineEntry({
  entry,
  index,
  lineVisible,
  lang,
}: {
  entry: { year: string; label: string; label_en: string; description: string; description_en: string }
  index: number
  lineVisible: boolean
  lang: string
}) {
  const { ref, isVisible } = useInView()

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "is-visible" : ""}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        paddingTop: "1.5rem",
        position: "relative",
      }}
    >
      {/* Dot sits ON the top rule */}
      <div
        style={{
          position: "absolute",
          top: -3,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--color-accent)",
          transform: lineVisible ? "scale(1)" : "scale(0)",
          transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 120 + 600}ms`,
        }}
      />

      {/* Year */}
      <span
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.625rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          display: "block",
          marginBottom: "0.4rem",
        }}
      >
        {entry.year}
      </span>

      {/* Label */}
      <h3
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.8rem",
          fontWeight: 500,
          color: "var(--color-heading)",
          marginBottom: "0.35rem",
          letterSpacing: "0.02em",
        }}
      >
        {lang === "en" ? entry.label_en : entry.label}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.8rem",
          color: "var(--color-muted)",
          lineHeight: 1.5,
        }}
      >
        {lang === "en" ? entry.description_en : entry.description}
      </p>
    </div>
  )
}
