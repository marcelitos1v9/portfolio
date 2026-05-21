"use client"

import Link from "next/link"
import { useInView } from "@/hooks/useInView"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Expertise() {
  const { ref: titleRef, isVisible: titleVisible } = useInView()
  const { t } = useLanguage()

  const stages = [
    { step: "01", label: t.expertise_ingestion, techs: ["Pub/Sub", "Cloud Run", "CDC"] },
    { step: "02", label: t.expertise_staging, techs: ["Datastream", "GCS", "Raw Zone"] },
    { step: "03", label: t.expertise_bronze, techs: ["Dataform", "BigQuery", t.expertise_tech_validation] },
    { step: "04", label: t.expertise_silver, techs: ["SQL UDFs", "Transforms", t.expertise_tech_partitions] },
    { step: "05", label: t.expertise_gold, techs: ["Mart Tables", "BI Layer", "Output"] },
  ]

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
      <div
        ref={titleRef}
        style={{ marginBottom: "clamp(2.5rem, 6vw, 5rem)" }}
      >
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
          {t.expertise_label}
        </span>
        <h2
          className={`reveal ${titleVisible ? "is-visible" : ""}`}
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 300,
            color: "var(--color-heading)",
            lineHeight: 1.2,
          }}
        >
          {t.expertise_heading}
        </h2>
      </div>

      {/* Scroll hint — only on mobile */}
      <div className="expertise-scroll-hint" style={{ display: "none", marginBottom: "0.75rem" }}>
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.625rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          {t.expertise_scroll}
        </span>
      </div>

      {/* Pipeline horizontal scroll */}
      <div
        className="hide-scrollbar"
        style={{
          overflowX: "auto",
          paddingBottom: "1rem",
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .expertise-scroll-hint { display: block !important; }
          }
        `}</style>
        <div
          style={{
            display: "flex",
            gap: 0,
            minWidth: "min-content",
            alignItems: "stretch",
          }}
        >
          {stages.map((stage, i) => (
            <StageCard key={stage.step} stage={stage} index={i} total={stages.length} />
          ))}
        </div>
      </div>

      {/* Live pipeline CTA */}
      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/playground"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            textDecoration: "none",
            borderBottom: "1px solid transparent",
            transition: "border-color 0.2s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        >
          {t.expertise_try_link}
        </Link>
      </div>
    </section>
  )
}

function StageCard({
  stage,
  index,
  total,
}: {
  stage: { step: string; label: string; techs: string[] }
  index: number
  total: number
}) {
  const { ref, isVisible } = useInView()

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        flexShrink: 0,
      }}
    >
      {/* Card */}
      <div
        ref={ref}
        className={`reveal ${isVisible ? "is-visible" : ""}`}
        style={{
          width: "clamp(160px, 20vw, 220px)",
          padding: "clamp(1.25rem, 3vw, 1.75rem)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          position: "relative",
          transitionDelay: `${index * 80}ms`,
          transition:
            "opacity 0.7s ease, transform 0.7s ease, border-color 0.25s",
          cursor: "default",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = "var(--color-accent)"
          const topLine = el.querySelector<HTMLElement>(".top-accent")
          if (topLine) topLine.style.transform = "scaleX(1)"
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = "var(--color-border)"
          const topLine = el.querySelector<HTMLElement>(".top-accent")
          if (topLine) topLine.style.transform = "scaleX(0)"
        }}
      >
        {/* Top accent bar */}
        <div
          className="top-accent"
          style={{
            position: "absolute",
            top: -1,
            left: -1,
            right: -1,
            height: 2,
            background: "var(--color-accent)",
            transformOrigin: "left",
            transform: "scaleX(0)",
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* Step number (decorative) */}
        <span
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.875rem",
            fontFamily: "var(--font-fraunces)",
            fontSize: "3rem",
            fontWeight: 300,
            color: "var(--color-heading)",
            opacity: 0.05,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {stage.step}
        </span>

        {/* Label */}
        <h3
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-heading)",
            marginBottom: "1.25rem",
          }}
        >
          {stage.label}
        </h3>

        {/* Technologies */}
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {stage.techs.map((tech) => (
            <li
              key={tech}
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                color: "var(--color-muted)",
                letterSpacing: "0.05em",
              }}
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      {/* Arrow connector */}
      {index < total - 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 0.25rem",
            flexShrink: 0,
          }}
        >
          <ArrowConnector delay={index * 80 + 200} visible={isVisible} />
        </div>
      )}
    </div>
  )
}

function ArrowConnector({ delay, visible }: { delay: number; visible: boolean }) {
  return (
    <svg
      width="32"
      height="16"
      viewBox="0 0 32 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <line
        x1="0"
        y1="8"
        x2="24"
        y2="8"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="24"
        strokeDashoffset={visible ? 0 : 24}
        style={{
          transition: `stroke-dashoffset 0.5s ease ${delay}ms`,
        }}
      />
      <polyline
        points="20,4 28,8 20,12"
        stroke="var(--color-border)"
        strokeWidth="1"
        fill="none"
        opacity={visible ? 1 : 0}
        style={{ transition: `opacity 0.3s ease ${delay + 300}ms` }}
      />
    </svg>
  )
}
