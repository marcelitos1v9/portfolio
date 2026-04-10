"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { stackData, type StackItem, type StackCategory } from "@/lib/data/stack"
import { useLanguage } from "@/contexts/LanguageContext"

type View = "list" | "detail"

export default function StackExplorer() {
  const [active, setActive] = useState<StackItem>(stackData[0].items[0])
  const [mobileView, setMobileView] = useState<View>("list")
  const explorerRef = useRef<HTMLDivElement>(null)
  const { lang, t } = useLanguage()

  const handleSelect = (item: StackItem) => {
    setActive(item)
    setMobileView("detail")
    // On mobile, scroll to top of explorer so detail is visible
    if (window.innerWidth <= 768) {
      explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div ref={explorerRef}>
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
              minHeight: "auto",
            }}
          >
            {tab === "list" ? t.stack_tab_list : t.stack_tab_detail}
          </button>
        ))}
      </div>

      {/* Two-panel desktop / tab mobile layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: "3rem",
          minHeight: "60vh",
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
          {stackData.map((cat) => (
            <CategoryGroup
              key={cat.category}
              category={cat}
              active={active}
              onSelect={handleSelect}
              lang={lang}
            />
          ))}
        </div>

        {/* Right panel: detail — AnimatePresence for guaranteed transitions */}
        <div
          className={`stack-panel-detail ${mobileView === "detail" ? "mobile-active" : "mobile-hidden"}`}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%" }}
            >
              <DetailPanel
                item={active}
                onBack={() => setMobileView("list")}
                lang={lang}
                t={t}
              />
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
          .mobile-hidden { display: none !important; }
          .mobile-active { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </div>
  )
}

function CategoryGroup({
  category,
  active,
  onSelect,
  lang,
}: {
  category: StackCategory
  active: StackItem
  onSelect: (item: StackItem) => void
  lang: string
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
                {item.name}
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "0.5rem",
      }}
    >
      {/* Mobile back button */}
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
          minHeight: "auto",
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
        {item.context}
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
