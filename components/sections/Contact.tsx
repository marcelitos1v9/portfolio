"use client"

import { useState } from "react"
import { useInView } from "@/hooks/useInView"
import { useLanguage } from "@/contexts/LanguageContext"

const EMAIL = "marceloaugustocge@gmail.com"

type FormStatus = "idle" | "sending" | "success" | "error"

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const { ref, isVisible } = useInView<HTMLElement>()
  const { t, lang } = useLanguage()

  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" })
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const mailtoFallback = () => {
    const subject = encodeURIComponent(`[Portfolio] ${form.name || ""}`.trim())
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "sending") return
    setErrorMsg("")

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error")
      setErrorMsg(t.contact_form_required)
      return
    }
    if (!EMAIL_RE.test(form.email)) {
      setStatus("error")
      setErrorMsg(t.contact_form_invalid_email)
      return
    }

    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ name: "", email: "", message: "", company: "" })
        return
      }
      // No server provider wired up → gracefully hand off to the mail client.
      if (res.status === 501) {
        mailtoFallback()
        setStatus("idle")
        return
      }
      throw new Error(String(res.status))
    } catch {
      setStatus("error")
      setErrorMsg(t.contact_form_error)
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

      {/* Contact form — posts to /api/contact, degrades to mailto */}
      <form
        onSubmit={handleSubmit}
        className={`reveal reveal-delay-2 ${isVisible ? "is-visible" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: 560,
          marginBottom: "3rem",
        }}
      >
        {/* Honeypot — hidden from humans, catches naive bots */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="contact-form-row">
          <Field
            label={t.contact_form_name}
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            autoComplete="name"
            disabled={status === "sending"}
          />
          <Field
            label={t.contact_form_email}
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            autoComplete="email"
            disabled={status === "sending"}
          />
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={fieldLabelStyle}>{t.contact_form_message}</span>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            disabled={status === "sending"}
            rows={5}
            style={{ ...fieldInputStyle, resize: "vertical", minHeight: 120 }}
          />
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: status === "sending" ? "transparent" : "var(--color-accent)",
              color: status === "sending" ? "var(--color-muted)" : "var(--color-bg)",
              border: "1px solid var(--color-accent)",
              padding: "0.85rem 1.75rem",
              cursor: status === "sending" ? "wait" : "pointer",
              transition: "background 0.2s, color 0.2s",
              minHeight: 44,
            }}
          >
            {status === "sending" ? t.contact_form_sending : t.contact_form_send}
          </button>

          {status === "success" && (
            <span aria-live="polite" style={{ ...statusStyle, color: "var(--color-accent)" }}>
              {t.contact_form_success}
            </span>
          )}
          {status === "error" && (
            <span aria-live="polite" style={{ ...statusStyle, color: "#ff8b8b" }}>
              {errorMsg}
            </span>
          )}
        </div>
      </form>

      <span
        className={`reveal reveal-delay-2 ${isVisible ? "is-visible" : ""}`}
        style={{ ...fieldLabelStyle, display: "block", marginBottom: "1rem" }}
      >
        {t.contact_form_or}
      </span>

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

      <style>{`
        @media (max-width: 560px) {
          .contact-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.65rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--color-muted)",
}

const fieldInputStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontSize: "0.95rem",
  color: "var(--color-heading)",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  padding: "0.75rem 0.85rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
}

const statusStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.75rem",
  letterSpacing: "0.03em",
  lineHeight: 1.5,
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  disabled?: boolean
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span style={fieldLabelStyle}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        style={fieldInputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
      />
    </label>
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
