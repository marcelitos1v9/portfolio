"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { useLenis } from "@/components/ui/LenisProvider"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const lenis = useLenis()

  const LINKS = [
    { href: "/#projects", label: t.nav_projects },
    { href: "/stack", label: t.nav_stack },
    { href: "/playground", label: t.nav_playground },
    { href: "/now", label: t.nav_now },
    { href: "/#contact", label: t.nav_contact },
    { href: "https://www.linkedin.com/in/marcelo-augusto-oo/", label: "LinkedIn", external: true },
    { href: "https://github.com/marcelitos1v9", label: "GitHub", external: true },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Lock scroll when mobile menu is open. Use Lenis stop() because Lenis
  // keeps a virtualized scroll loop; setting body.overflow=hidden alone
  // doesn't actually freeze the page.
  useEffect(() => {
    if (open) {
      lenis?.stop()
      document.body.style.overflow = "hidden"
    } else {
      lenis?.start()
      document.body.style.overflow = ""
    }
    return () => {
      lenis?.start()
      document.body.style.overflow = ""
    }
  }, [open, lenis])

  // Close menu on route change (e.g. /stack → /)
  useEffect(() => {
    setOpen(false)
  }, [pathname])

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
          background: scrolled || open ? "rgba(13,13,13,0.95)" : "transparent",
          backdropFilter: scrolled || open ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled || open ? "blur(12px)" : "none",
          borderBottom:
            scrolled || open
              ? "1px solid var(--color-border)"
              : "1px solid transparent",
        }}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="Ir para o início"
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

        <nav
          aria-label="Navegação principal"
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
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

          <button
            onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
            aria-label={t.cmd_open_aria}
            title={t.cmd_open_aria}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: 4,
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              color: "var(--color-muted)",
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)"
              e.currentTarget.style.color = "var(--color-heading)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)"
              e.currentTarget.style.color = "var(--color-muted)"
            }}
          >
            ⌘K
          </button>
        </nav>

        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: "0.5rem",
            cursor: "pointer",
            display: "none",
            flexDirection: "column",
            gap: 5,
            minHeight: 44,
            minWidth: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
          className="nav-hamburger"
        >
          <span style={{ ...barStyle, transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
          <span style={{ ...barStyle, opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }} />
          <span style={{ ...barStyle, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(13,13,13,0.98)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "calc(64px + env(safe-area-inset-top)) clamp(1.5rem, 8vw, 4rem) env(safe-area-inset-bottom)",
              overflowY: "auto",
            }}
            aria-modal="true"
            role="dialog"
            aria-label="Menu de navegação"
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
              }}
              style={{ display: "flex", flexDirection: "column", gap: 0 }}
            >
              {LINKS.map((link) => {
                const itemVariants = {
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0 },
                }
                return link.external ? (
                  <motion.a
                    key={link.href}
                    variants={itemVariants}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    style={{ ...mobileNavStyle, borderBottom: "1px solid var(--color-border)" }}
                  >
                    {link.label} ↗
                  </motion.a>
                ) : (
                  <motion.div
                    key={link.href}
                    variants={itemVariants}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      style={{ ...mobileNavStyle, borderBottom: "1px solid var(--color-border)" }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}

              <motion.button
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  setLang(lang === "pt" ? "en" : "pt")
                  setOpen(false)
                }}
                style={{
                  ...mobileNavStyle,
                  borderBottom: "1px solid var(--color-border)",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "var(--color-accent)",
                  width: "100%",
                }}
              >
                {lang === "pt" ? "English" : "Português"}
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
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
