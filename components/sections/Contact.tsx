"use client"

import { useState } from "react"
import { useInView } from "@/hooks/useInView"
import { useLanguage } from "@/contexts/LanguageContext"

const EMAIL = "marceloaugustocge@gmail.com"

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const { ref, isVisible } = useInView<HTMLElement>()
  const { t, lang } = useLanguage()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 8rem)",
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <h2
        className={`reveal ${isVisible ? "is-visible" : ""}`}
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          fontWeight: 300,
          color: "var(--color-heading)",
          lineHeight: 1.1,
          marginBottom: "1.5rem",
        }}
      >
        {t.contact_heading}
      </h2>

      <p
        className={`reveal reveal-delay-1 ${isVisible ? "is-visible" : ""}`}
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "clamp(1rem, 1.8vw, 1.125rem)",
          color: "var(--color-body)",
          lineHeight: 1.7,
          maxWidth: "520px",
          marginBottom: "3.5rem",
        }}
      >
        {t.contact_body}
      </p>

      <div
        className={`reveal reveal-delay-2 ${isVisible ? "is-visible" : ""}`}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={copyEmail}
          aria-label={copied ? t.contact_copy_aria_done : t.contact_copy_aria_default}
          aria-live="polite"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            color: copied ? "var(--color-accent)" : "var(--color-heading)",
            background: "none",
            border: `1px solid ${copied ? "var(--color-accent)" : "var(--color-border)"}`,
            padding: "0.85rem 1.5rem",
            cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
            minHeight: 44,
            wordBreak: "break-all",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            if (!copied) e.currentTarget.style.borderColor = "var(--color-accent)"
          }}
          onMouseLeave={(e) => {
            if (!copied) e.currentTarget.style.borderColor = "var(--color-border)"
          }}
        >
          {copied ? t.contact_copied : `${EMAIL} →`}
        </button>

        <ExternalLink href="https://www.linkedin.com/in/marcelo-augusto-oo/">LinkedIn →</ExternalLink>
        <ExternalLink href="https://github.com/marcelitos1v9">GitHub →</ExternalLink>
        <a
          href={`/cv?lang=${lang}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact_cv_aria}
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            color: "var(--color-accent)",
            textDecoration: "none",
            border: "1px solid var(--color-accent)",
            padding: "0.85rem 1.5rem",
            transition: "background 0.2s, color 0.2s",
            display: "inline-flex",
            alignItems: "center",
            minHeight: 44,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent)"
            e.currentTarget.style.color = "var(--color-bg)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = "var(--color-accent)"
          }}
        >
          {t.contact_cv}
        </a>
      </div>
    </section>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: "var(--font-dm-mono)",
        fontSize: "0.8rem",
        letterSpacing: "0.08em",
        color: "var(--color-body)",
        textDecoration: "none",
        border: "1px solid var(--color-border)",
        padding: "0.85rem 1.5rem",
        transition: "border-color 0.2s, color 0.2s",
        display: "inline-flex",
        alignItems: "center",
        minHeight: 44,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)"
        e.currentTarget.style.color = "var(--color-heading)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)"
        e.currentTarget.style.color = "var(--color-body)"
      }}
    >
      {children}
    </a>
  )
}
