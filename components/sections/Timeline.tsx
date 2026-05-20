"use client"

import { useState } from "react"
import { useInView } from "@/hooks/useInView"
import { timelineData, type TimelineEntry as TimelineEntryType } from "@/lib/data/timeline"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Translations } from "@/lib/i18n"

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
      <div ref={lineRef} style={{ position: "relative" }}>
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
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--color-decorative)",
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
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1.75rem 1rem",
            position: "relative",
            zIndex: 1,
          }}
          className="timeline-grid"
        >
          {timelineData.map((entry, i) => (
            <TimelineEntry
              key={i}
              entry={entry}
              index={i}
              lineVisible={lineVisible}
              lang={lang}
              t={t}
            />
          ))}
        </div>

        <style>{`
          @media (max-width: 480px) {
            .timeline-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

function TimelineEntry({
  entry,
  index,
  lineVisible,
  lang,
  t,
}: {
  entry: TimelineEntryType
  index: number
  lineVisible: boolean
  lang: string
  t: Translations
}) {
  const { ref, isVisible } = useInView()
  const [expanded, setExpanded] = useState(false)
  const hasDetail = Boolean(entry.detail)

  const label = lang === "en" ? entry.label_en : entry.label
  const description = lang === "en" ? entry.description_en : entry.description

  const content = (
    <>
      {/* Dot sits ON the top rule */}
      <div
        aria-hidden="true"
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
        {label}
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
        {description}
      </p>

      {/* Detail (collapsible) */}
      {hasDetail && (
        <div
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1)",
            marginTop: expanded ? "0.6rem" : 0,
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                color: "var(--color-body)",
                lineHeight: 1.55,
                letterSpacing: "0.02em",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {entry.detail}
            </p>
          </div>
        </div>
      )}
    </>
  )

  // Only render as button if there's a detail to reveal — otherwise the
  // entry is plain text (no need for an interactive role).
  if (!hasDetail) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`reveal ${isVisible ? "is-visible" : ""}`}
        style={{
          transitionDelay: `${index * 120}ms`,
          paddingTop: "1.5rem",
          position: "relative",
        }}
      >
        {content}
      </div>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-expanded={expanded}
      aria-label={expanded ? t.timeline_collapse_aria : t.timeline_expand_aria}
      onClick={() => setExpanded((v) => !v)}
      className={`reveal ${isVisible ? "is-visible" : ""}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        paddingTop: "1.5rem",
        position: "relative",
        background: "none",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
        padding: "1.5rem 0 0 0",
        width: "100%",
        display: "block",
      }}
    >
      {content}
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.6rem",
          color: "var(--color-muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          display: "inline-block",
          marginTop: "0.5rem",
          transition: "transform 0.25s ease, color 0.2s",
          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        →
      </span>
    </button>
  )
}
