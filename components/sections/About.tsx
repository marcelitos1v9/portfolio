"use client"

import { useInView } from "@/hooks/useInView"
import { useLanguage } from "@/contexts/LanguageContext"

export default function About() {
  const { ref: sectionRef, isVisible: sectionVisible } = useInView<HTMLElement>()
  const { ref: lineRef, isVisible: lineVisible } = useInView<HTMLSpanElement>()
  const { ref: cardsRef, isVisible: cardsVisible } = useInView()
  const { lang, t } = useLanguage()

  const highlights = [
    { label: t.about_fact_date_label, value: t.about_fact_date_value },
    { label: t.about_fact_sector_label, value: t.about_fact_sector_value },
    { label: t.about_fact_edu_label, value: t.about_fact_edu_value },
    { label: t.about_fact_loc_label, value: t.about_fact_loc_value },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 8rem)",
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "clamp(80px, 15vw, 160px) 1fr",
          gap: "clamp(2rem, 5vw, 5rem)",
          maxWidth: "1000px",
        }}
        className="about-grid"
      >
        {/* Left: label */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            {t.about_label}
          </span>
          <span
            ref={lineRef}
            className={`animated-line ${lineVisible ? "is-visible" : ""}`}
            style={{ transitionDelay: "200ms" }}
          />
        </div>

        {/* Right: content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* Main bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p
              className={`reveal ${sectionVisible ? "is-visible" : ""}`}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                lineHeight: 1.85,
                color: "var(--color-body)",
              }}
            >
              {t.about_bio1_pre}{" "}
              <span style={{ color: "var(--color-heading)", fontWeight: 500 }}>
                {t.about_bio1_highlight1}
              </span>
              {t.about_bio1_mid}{" "}
              <span style={{ color: "var(--color-heading)", fontWeight: 500 }}>
                {t.about_bio1_highlight2}
              </span>
              {t.about_bio1_post}
            </p>

            <p
              className={`reveal reveal-delay-1 ${sectionVisible ? "is-visible" : ""}`}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                lineHeight: 1.85,
                color: "var(--color-body)",
              }}
            >
              {t.about_bio2_pre}{" "}
              <span style={{ color: "var(--color-heading)" }}>{t.about_bio2_h1}</span>
              {t.about_bio2_mid}{" "}
              <span style={{ color: "var(--color-heading)" }}>{t.about_bio2_h2}</span>{" "}
              {t.about_bio2_mid2}{" "}
              <span style={{ color: "var(--color-heading)" }}>{t.about_bio2_h3}</span>
              {t.about_bio2_post}
            </p>

            <p
              className={`reveal reveal-delay-2 ${sectionVisible ? "is-visible" : ""}`}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                lineHeight: 1.85,
                color: "var(--color-body)",
              }}
            >
              {t.about_bio3}
            </p>

            <p
              className={`reveal reveal-delay-3 ${sectionVisible ? "is-visible" : ""}`}
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.875rem",
                color: "var(--color-muted)",
                letterSpacing: "0.05em",
              }}
            >
              {t.about_location}
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </p>
          </div>

          {/* Quick facts grid */}
          <div
            ref={cardsRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0",
              borderTop: "1px solid var(--color-border)",
              borderLeft: "1px solid var(--color-border)",
            }}
            className="facts-grid"
          >
            {highlights.map((item, i) => (
              <div
                key={i}
                className={`reveal ${cardsVisible ? "is-visible" : ""}`}
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid var(--color-border)",
                  borderRight: "1px solid var(--color-border)",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    display: "block",
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.875rem",
                    color: "var(--color-heading)",
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 480px) {
          .facts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
