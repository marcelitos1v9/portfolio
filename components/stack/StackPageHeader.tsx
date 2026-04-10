"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function StackPageHeader() {
  const { t } = useLanguage()

  return (
    <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
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
        {t.stack_label}
      </span>
      <h1
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          fontWeight: 300,
          color: "var(--color-heading)",
          lineHeight: 1.1,
        }}
      >
        {t.stack_heading}
      </h1>
    </div>
  )
}
