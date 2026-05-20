"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { stackData, type StackItem, type StackCategory } from "@/lib/data/stack"
import { useLanguage } from "@/contexts/LanguageContext"

type View = "list" | "detail"

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

function matches(item: StackItem, q: string) {
  if (!q) return true
  const needle = normalize(q)
  return (
    normalize(item.name).includes(needle) ||
    normalize(item.description).includes(needle) ||
    normalize(item.description_en).includes(needle) ||
    normalize(item.context).includes(needle) ||
    normalize(item.context_en).includes(needle)
  )
}

export default function StackExplorer() {
  const [active, setActive] = useState<StackItem>(stackData[0].items[0])
  const [mobileView, setMobileView] = useState<View>("list")
  const [query, setQuery] = useState("")
  const explorerRef = useRef<HTMLDivElement>(null)
  const { lang, t } = useLanguage()

  const filtered = useMemo(() => {
    if (!query.trim()) return stackData
    return stackData
      .map((cat) => ({ ...cat, items: cat.items.filter((i) => matches(i, query)) }))
      .filter((cat) => cat.items.length > 0)
  }, [query])

  const totalResults = useMemo(
    () => filtered.reduce((acc, cat) => acc + cat.items.length, 0),
    [filtered]
  )

  // If the user filters down and the active item disappears, switch to the
  // first visible item so the detail panel never goes blank.
  useEffect(() => {
    if (!filtered.length) return
    const allVisible = filtered.flatMap((c) => c.items)
    if (!allVisible.find((i) => i.name === active.name)) {
      setActive(allVisible[0])
    }
  }, [filtered, active.name])

  const handleSelect = (item: StackItem) => {
    setActive(item)
    setMobileView("detail")
    if (window.innerWidth <= 768) {
      explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div ref={explorerRef}>
      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--color-border)",
          flexWrap: "wrap",
        }}
      >
        <label className="sr-only" htmlFor="stack-search">
          {t.stack_search_aria}
        </label>
        <span aria-hidden="true" style={{ color: "var(--color-muted)", fontFamily: "var(--font-dm-mono)", fontSize: "0.85rem" }}>
          /
        </span>
        <input
          id="stack-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.stack_search_placeholder}
          aria-label={t.stack_search_aria}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            minWidth: 200,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "0.5rem 0",
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.95rem",
            color: "var(--color-heading)",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            style={{
              background: "none",
              border: "none",
              color: "var(--color-muted)",
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-heading)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
          >
            ESC ✕
          </button>
        )}
        <span
          aria-live="polite"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            color: "var(--color-muted)",
          }}
        >
          {t.stack_results_count(totalResults)}
        </span>
      </div>

      {/* Mobile tab bar */}
      <div className="stack-tabs" style={{ display: "none", marginBottom: "1.5rem" }}>
        {(["list", "detail"] as View[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileView(tab)}
            style={{
              flex: 1,
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${mobileView === tab ? "var(--color-accent)" : "var(--color-border)"}`,
              color: mobileView === tab ? "var(--color-accent)" : "var(--color-muted)",
              padding: "0.75rem 0",
              cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
              minHeight: 44,
            }}
          >
            {tab === "list" ? t.stack_tab_list : t.stack_tab_detail}
          </button>
        ))}
      </div>

      {/* Two-panel desktop / tab mobile layout.
          `alignItems: start` is what lets the right panel use `position:
          sticky` — without it, the grid stretches the column to match the
          left column's height and there's nothing to "stick" against. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: "3rem",
          minHeight: "60vh",
          alignItems: "start",
        }}
        className="stack-explorer"
      >
        {/* Left panel: list */}
        <div
          style={{
            borderRight: "1px solid var(--color-border)",
            paddingRight: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
          }}
          className={`stack-panel-list ${mobileView === "list" ? "mobile-active" : "mobile-hidden"}`}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.8rem",
                color: "var(--color-muted)",
                padding: "2rem 0",
                textAlign: "center",
                borderTop: "1px dashed var(--color-border)",
                borderBottom: "1px dashed var(--color-border)",
              }}
            >
              {t.stack_no_results}
            </div>
          ) : (
            filtered.map((cat) => (
              <CategoryGroup
                key={cat.category}
                category={cat}
                active={active}
                onSelect={handleSelect}
                lang={lang}
                query={query}
              />
            ))
          )}
        </div>

        {/* Right panel: detail.
            Sticky on desktop so it follows the user while they scan the
            (potentially long) left list. `top` matches the fixed navbar
            height + a little breathing room. On mobile (≤768px) the CSS
            below resets `position: static` so it stays inside the tab flow. */}
        <div
          className={`stack-panel-detail ${mobileView === "detail" ? "mobile-active" : "mobile-hidden"}`}
          style={{
            overflow: "hidden",
            position: "sticky",
            top: "calc(var(--header-height) + 1.5rem)",
            maxHeight: "calc(100svh - var(--header-height) - 3rem)",
            overflowY: "auto",
            alignSelf: "start",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active.name}-${lang}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%" }}
            >
              <DetailPanel item={active} onBack={() => setMobileView("list")} lang={lang} t={t} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stack-tabs { display: flex !important; }
          .stack-explorer {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            min-height: unset !important;
          }
          .stack-panel-list {
            border-right: none !important;
            padding-right: 0 !important;
          }
          .stack-panel-detail {
            position: static !important;
            max-height: none !important;
            overflow-y: visible !important;
          }
          .mobile-hidden { display: none !important; }
          .mobile-active { display: flex !important; flex-direction: column; }
        }
        /* The sticky panel scrolls internally when the description is taller
           than the viewport — hide its scrollbar to match the page aesthetic. */
        .stack-panel-detail::-webkit-scrollbar { width: 2px; }
        .stack-panel-detail::-webkit-scrollbar-thumb { background: var(--color-border); }
      `}</style>
    </div>
  )
}

function highlight(text: string, q: string) {
  if (!q.trim()) return text
  const needle = normalize(q)
  const idx = normalize(text).indexOf(needle)
  if (idx < 0) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "var(--color-accent-dim)",
          color: "inherit",
          padding: "0 2px",
        }}
      >
        {text.slice(idx, idx + needle.length)}
      </mark>
      {text.slice(idx + needle.length)}
    </>
  )
}

function CategoryGroup({
  category,
  active,
  onSelect,
  lang,
  query,
}: {
  category: StackCategory
  active: StackItem
  onSelect: (item: StackItem) => void
  lang: string
  query: string
}) {
  return (
    <div>
      <span className="label-mono" style={{ display: "block", marginBottom: "0.75rem" }}>
        {lang === "en" ? category.category_en : category.category}
      </span>

      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" }}>
        {category.items.map((item) => {
          const isActive = item.name === active.name
          return (
            <li key={item.name}>
              <button
                onClick={() => onSelect(item)}
                aria-pressed={isActive}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? "var(--color-accent-dim)" : "transparent",
                  border: "none",
                  padding: "0.6rem 0.75rem",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.9rem",
                  color: isActive ? "var(--color-accent)" : "var(--color-body)",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  position: "relative",
                  minHeight: 44,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-heading)"
                    e.currentTarget.style.background = "var(--color-surface)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-body)"
                    e.currentTarget.style.background = "transparent"
                  }
                }}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: "var(--color-accent)",
                    }}
                  />
                )}
                {highlight(item.name, query)}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DetailPanel({
  item,
  onBack,
  lang,
  t,
}: {
  item: StackItem
  onBack: () => void
  lang: string
  t: { stack_back: string }
}) {
  const description = lang === "en" ? item.description_en : item.description
  const context = lang === "en" ? item.context_en : item.context

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "0.5rem",
      }}
    >
      <button
        onClick={onBack}
        className="stack-back-btn"
        style={{
          display: "none",
          background: "none",
          border: "none",
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          cursor: "pointer",
          marginBottom: "1.5rem",
          alignItems: "center",
          gap: "0.5rem",
          padding: 0,
          minHeight: 44,
        }}
      >
        {t.stack_back}
      </button>

      <span
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "0.625rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          display: "block",
          marginBottom: "1.25rem",
        }}
      >
        {context}
      </span>

      <h2
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 300,
          color: "var(--color-heading)",
          lineHeight: 1.1,
          marginBottom: "1.5rem",
        }}
      >
        {item.name}
      </h2>

      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
          color: "var(--color-body)",
          lineHeight: 1.8,
          maxWidth: "480px",
        }}
      >
        {description}
      </p>

      <style>{`
        @media (max-width: 768px) {
          .stack-back-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
