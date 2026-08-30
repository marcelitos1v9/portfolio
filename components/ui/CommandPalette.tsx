"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { useLenis } from "@/components/ui/LenisProvider"

const EMAIL = "marceloaugustocge@gmail.com"
const LINKEDIN = "https://www.linkedin.com/in/marcelo-augusto-oo/"
const GITHUB = "https://github.com/marcelitos1v9"

type Cmd = {
  id: string
  group: "nav" | "actions" | "links"
  label: string
  hint?: string
  keywords?: string
  perform: () => void
}

/**
 * ⌘K / Ctrl-K command palette. Keyboard-first navigation across sections,
 * pages and quick actions. Mirrors the codebase conventions: inline styles,
 * CSS-var colors, i18n via `t`, framer-motion for enter/exit.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()
  const { t, lang, setLang } = useLanguage()

  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    setActive(0)
  }, [])

  // Navigate to an in-page section: smooth-scroll if already on home,
  // otherwise route to /#id and let LenisProvider's hashchange handle it.
  const goToSection = useCallback(
    (id: string) => {
      close()
      // "__top__" is a sentinel for the very top of the home page (Hero has no id).
      if (id === "__top__") {
        if (pathname === "/") {
          lenis?.scrollTo(0)
          history.replaceState(null, "", "/")
        } else {
          router.push("/")
        }
        return
      }
      if (pathname === "/") {
        const el = document.getElementById(id)
        if (el) lenis?.scrollTo(el)
        history.replaceState(null, "", `#${id}`)
      } else {
        router.push(`/#${id}`)
      }
    },
    [pathname, lenis, router, close]
  )

  const goToPage = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [router, close]
  )

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard may be blocked; no-op */
    }
  }, [])

  const commands: Cmd[] = useMemo(() => {
    const list: Cmd[] = [
      { id: "home", group: "nav", label: t.cmd_go_home, keywords: "top início start", perform: () => goToSection("__top__") },
      { id: "about", group: "nav", label: t.cmd_go_about, keywords: "sobre bio", perform: () => goToSection("about") },
      { id: "expertise", group: "nav", label: t.cmd_go_expertise, keywords: "medallion pipeline", perform: () => goToSection("expertise") },
      { id: "projects", group: "nav", label: t.cmd_go_projects, keywords: "trabalho work", perform: () => goToSection("projects") },
      { id: "timeline", group: "nav", label: t.cmd_go_timeline, keywords: "carreira career trajetória", perform: () => goToSection("timeline") },
      { id: "contact", group: "nav", label: t.cmd_go_contact, keywords: "contato email", perform: () => goToSection("contact") },
      { id: "stack", group: "nav", label: t.cmd_go_stack, hint: "/stack", keywords: "tecnologias tech", perform: () => goToPage("/stack") },
      { id: "playground", group: "nav", label: t.cmd_go_playground, hint: "/playground", keywords: "sql duckdb", perform: () => goToPage("/playground") },
      { id: "now", group: "nav", label: t.cmd_go_now, hint: "/now", keywords: "agora atual", perform: () => goToPage("/now") },
      { id: "cv", group: "actions", label: t.cmd_download_cv, hint: "PDF", keywords: "currículo resume pdf", perform: () => { close(); window.open(`/cv?lang=${lang}`, "_blank", "noopener") } },
      { id: "copy-email", group: "actions", label: copied ? t.cmd_copied : t.cmd_copy_email, keywords: "email copiar", perform: copyEmail },
      { id: "lang", group: "actions", label: t.cmd_toggle_lang, keywords: "idioma language pt en", perform: () => { setLang(lang === "pt" ? "en" : "pt") } },
      { id: "linkedin", group: "links", label: "LinkedIn ↗", keywords: "social", perform: () => { close(); window.open(LINKEDIN, "_blank", "noopener") } },
      { id: "github", group: "links", label: "GitHub ↗", keywords: "código code repos", perform: () => { close(); window.open(GITHUB, "_blank", "noopener") } },
    ]
    return list
  }, [t, lang, copied, goToSection, goToPage, copyEmail, close, setLang])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords?.toLowerCase().includes(q)
    )
  }, [query, commands])

  // Toggle with Cmd/Ctrl+K globally; ignore when typing in a field (except to open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === "Escape" && open) {
        e.preventDefault()
        close()
      }
    }
    // Allow any UI affordance (e.g. a Navbar button, useful on touch devices
    // without a keyboard) to open the palette by dispatching this event.
    const onOpenEvent = () => setOpen(true)
    window.addEventListener("keydown", onKey)
    window.addEventListener("open-command-palette", onOpenEvent)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("open-command-palette", onOpenEvent)
    }
  }, [open, close])

  // Lock body scroll (Lenis) while open; focus input on open.
  useEffect(() => {
    if (open) {
      lenis?.stop()
      document.body.style.overflow = "hidden"
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      lenis?.start()
      document.body.style.overflow = ""
    }
    return () => {
      lenis?.start()
      document.body.style.overflow = ""
    }
  }, [open, lenis])

  // Reset the highlight when the filtered set changes. Done during render so
  // the first result is highlighted on the same paint that shows it, rather
  // than one frame later.
  const [activeQuery, setActiveQuery] = useState(query)
  if (activeQuery !== query) {
    setActiveQuery(query)
    setActive(0)
  }

  const runActive = () => {
    const cmd = filtered[active]
    if (cmd) cmd.perform()
  }

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      runActive()
    }
  }

  // Keep the active row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [active])

  const groupLabels: Record<Cmd["group"], string> = {
    nav: t.cmd_group_nav,
    actions: t.cmd_group_actions,
    links: t.cmd_group_links,
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t.cmd_title}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "clamp(4rem, 14vh, 10rem) 1.25rem 2rem",
            background: "rgba(6,6,6,0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onListKey}
            style={{
              width: "100%",
              maxWidth: 560,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 4,
              boxShadow: "0 24px 60px -12px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            {/* Search input */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1rem", borderBottom: "1px solid var(--color-border)" }}>
              <span aria-hidden="true" style={{ color: "var(--color-accent)", fontFamily: "var(--font-dm-mono)", fontSize: "0.8rem" }}>⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.cmd_placeholder}
                aria-label={t.cmd_placeholder}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--color-heading)",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.95rem",
                  padding: "0.95rem 0",
                }}
              />
              <kbd style={kbdStyle}>ESC</kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              style={{ maxHeight: "min(52vh, 400px)", overflowY: "auto", padding: "0.5rem" }}
            >
              {filtered.length === 0 ? (
                <div style={{ padding: "1.5rem 1rem", textAlign: "center", color: "var(--color-muted)", fontFamily: "var(--font-dm-mono)", fontSize: "0.8rem" }}>
                  {t.cmd_empty}
                </div>
              ) : (
                (["nav", "actions", "links"] as const).map((group) => {
                  const items = filtered.filter((c) => c.group === group)
                  if (items.length === 0) return null
                  return (
                    <div key={group} style={{ marginBottom: "0.25rem" }}>
                      <div style={{ padding: "0.5rem 0.75rem 0.35rem", fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                        {groupLabels[group]}
                      </div>
                      {items.map((cmd) => {
                        const idx = filtered.indexOf(cmd)
                        const isActive = idx === active
                        return (
                          <button
                            key={cmd.id}
                            data-idx={idx}
                            onMouseMove={() => setActive(idx)}
                            onClick={() => cmd.perform()}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "1rem",
                              padding: "0.7rem 0.75rem",
                              background: isActive ? "var(--color-accent-dim)" : "transparent",
                              border: "none",
                              borderLeft: `2px solid ${isActive ? "var(--color-accent)" : "transparent"}`,
                              borderRadius: 2,
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background 0.12s",
                            }}
                          >
                            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: isActive ? "var(--color-heading)" : "var(--color-body)" }}>
                              {cmd.label}
                            </span>
                            {cmd.hint && (
                              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--color-muted)" }}>
                                {cmd.hint}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer hints */}
            <div style={{ display: "flex", gap: "1rem", padding: "0.6rem 1rem", borderTop: "1px solid var(--color-border)", fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--color-muted)" }}>
              <span><kbd style={kbdStyle}>↑↓</kbd> {t.cmd_hint_nav}</span>
              <span><kbd style={kbdStyle}>↵</kbd> {t.cmd_hint_select}</span>
              <span><kbd style={kbdStyle}>esc</kbd> {t.cmd_hint_close}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const kbdStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.6rem",
  color: "var(--color-muted)",
  border: "1px solid var(--color-border)",
  borderRadius: 3,
  padding: "0.1rem 0.35rem",
  background: "var(--color-bg)",
}
