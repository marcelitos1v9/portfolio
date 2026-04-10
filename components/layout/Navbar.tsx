"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()

  const LINKS = [
    { href: "/stack", label: t.nav_stack },
    { href: "/#contact", label: t.nav_contact },
    { href: "https://www.linkedin.com/in/marcelo-augusto-oo/", label: "LinkedIn", external: true },
    { href: "https://github.com/marcelitos1v9", label: "GitHub", external: true },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
          background:
            scrolled || open ? "rgba(13,13,13,0.95)" : "transparent",
          backdropFilter: scrolled || open ? "blur(12px)" : "none",
          borderBottom:
            scrolled || open
              ? "1px solid var(--color-border)"
              : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "var(--color-heading)",
            letterSpacing: "0.08em",
            textDecoration: "none",
            minHeight: "auto",
          }}
        >
          MAA
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Navegação principal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
          className="nav-desktop"
        >
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (abre em nova aba)`}
                style={navLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-heading)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-body)")}
              >
                {link.label} ↗
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                style={{
                  ...navLinkStyle,
                  color: pathname === link.href ? "var(--color-heading)" : "var(--color-body)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-heading)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    pathname === link.href ? "var(--color-heading)" : "var(--color-body)")
                }
              >
                {link.label}
              </Link>
            )
          )}

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            aria-label={lang === "pt" ? "Switch to English" : "Mudar para Português"}
            style={{
              ...navLinkStyle,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "var(--color-accent)",
            }}
          >
            {lang === "pt" ? "EN" : "PT"}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: "0.5rem",
            cursor: "pointer",
            display: "none",
            flexDirection: "column",
            gap: 5,
            minHeight: "auto",
          }}
          className="nav-hamburger"
        >
          <span style={{ ...barStyle, transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
          <span style={{ ...barStyle, opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }} />
          <span style={{ ...barStyle, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(13,13,13,0.98)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 clamp(1.5rem, 8vw, 4rem)",
            paddingTop: 64,
          }}
          aria-modal="true"
          role="dialog"
          aria-label="Menu de navegação"
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {LINKS.map((link, i) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  style={{
                    ...mobileNavStyle,
                    animationDelay: `${i * 60}ms`,
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    ...mobileNavStyle,
                    animationDelay: `${i * 60}ms`,
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Language toggle in mobile menu */}
            <button
              onClick={() => { setLang(lang === "pt" ? "en" : "pt"); setOpen(false) }}
              style={{
                ...mobileNavStyle,
                animationDelay: `${LINKS.length * 60}ms`,
                borderBottom: "1px solid var(--color-border)",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                color: "var(--color-accent)",
              }}
            >
              {lang === "pt" ? "English" : "Português"}
            </button>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

const navLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-body)",
  textDecoration: "none",
  transition: "color 0.2s",
  minHeight: "auto",
}

const mobileNavStyle: React.CSSProperties = {
  fontFamily: "var(--font-fraunces)",
  fontSize: "clamp(1.75rem, 8vw, 3rem)",
  fontWeight: 300,
  color: "var(--color-heading)",
  textDecoration: "none",
  padding: "1.25rem 0",
  display: "block",
  animation: "slideIn 0.3s ease both",
  minHeight: "auto",
}

const barStyle: React.CSSProperties = {
  display: "block",
  width: 22,
  height: 1.5,
  background: "var(--color-heading)",
  transition: "transform 0.3s ease, opacity 0.3s ease",
  transformOrigin: "center",
}
