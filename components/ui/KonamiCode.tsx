"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const

const LOG_LINES: { delay: number; text: string }[] = [
  { delay: 0, text: "$ ./marcelo --secret" },
  { delay: 250, text: "[boot] decoy partition mounted" },
  { delay: 500, text: "[auth] konami signature accepted ✓" },
  { delay: 850, text: "[load] retrieving dev notes…" },
  { delay: 1300, text: "" },
  { delay: 1350, text: "> nota 1: o cursor amarelo é homenagem ao terminal" },
  { delay: 1450, text: ">         do laboratório onde eu aprendi SQL." },
  { delay: 1700, text: "" },
  { delay: 1750, text: "> nota 2: o nome animado do hero usa o mesmo" },
  { delay: 1850, text: ">         algoritmo do Mr. Robot reveal sequence." },
  { delay: 2100, text: "" },
  { delay: 2150, text: "> nota 3: /playground roda DuckDB inteiro" },
  { delay: 2250, text: ">         no seu browser. zero backend." },
  { delay: 2500, text: "" },
  { delay: 2550, text: "> nota 4: se você chegou até aqui," },
  { delay: 2650, text: ">         provavelmente vamos nos dar bem." },
  { delay: 2800, text: "" },
  { delay: 2850, text: "> marceloaugustocge@gmail.com" },
  { delay: 3000, text: "" },
  { delay: 3050, text: "[exit] pressione ESC para fechar." },
]

export default function KonamiCode() {
  const [unlocked, setUnlocked] = useState(false)
  const bufferRef = useRef<string[]>([])

  // Detect the sequence
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when the user is typing in a field — wouldn't want to capture
      // their arrows mid-edit.
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return

      bufferRef.current.push(e.key.length === 1 ? e.key.toLowerCase() : e.key)
      if (bufferRef.current.length > SEQUENCE.length) {
        bufferRef.current.shift()
      }
      if (
        bufferRef.current.length === SEQUENCE.length &&
        bufferRef.current.every((k, i) => k === SEQUENCE[i])
      ) {
        setUnlocked(true)
        bufferRef.current = []
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // ESC closes when open
  useEffect(() => {
    if (!unlocked) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUnlocked(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [unlocked])

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          key="konami-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-modal="true"
          role="dialog"
          aria-label="Easter egg terminal"
          onClick={(e) => {
            // Click backdrop closes
            if (e.target === e.currentTarget) setUnlocked(false)
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(1rem, 4vw, 3rem)",
          }}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              maxWidth: 720,
              border: "1px solid var(--color-accent)",
              background: "#000",
              boxShadow: "0 0 60px rgba(232, 197, 71, 0.15)",
              padding: "1rem 1.25rem 1.5rem",
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.85rem",
              color: "#7CFFB2",
              lineHeight: 1.6,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #1F2A1F",
              }}
              aria-hidden="true"
            >
              <span style={dot("#ff5f56")} />
              <span style={dot("#ffbd2e")} />
              <span style={dot("#27c93f")} />
              <span
                style={{
                  marginLeft: "auto",
                  color: "var(--color-muted)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                }}
              >
                marcelo@portfolio ~ %
              </span>
            </div>
            <TypingLog />
            <button
              onClick={() => setUnlocked(false)}
              aria-label="Fechar terminal"
              style={{
                marginTop: "1rem",
                background: "transparent",
                border: "1px solid var(--color-accent)",
                color: "var(--color-accent)",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                padding: "0.4rem 0.85rem",
                cursor: "pointer",
              }}
            >
              ESC · close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function dot(color: string): React.CSSProperties {
  return {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: color,
    display: "inline-block",
  }
}

function TypingLog() {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const timers = LOG_LINES.map((line, i) =>
      window.setTimeout(() => setShown(i + 1), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {LOG_LINES.slice(0, shown).map((line, i) => (
        <div
          key={i}
          style={{
            opacity: line.text.startsWith("[") || line.text.startsWith("$")
              ? 0.85
              : 1,
            color: line.text.startsWith(">")
              ? "#E8C547"
              : line.text.startsWith("[exit]")
                ? "var(--color-muted)"
                : "#7CFFB2",
            minHeight: "1.2em",
          }}
        >
          {line.text || " "}
        </div>
      ))}
      {shown < LOG_LINES.length && (
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 14,
            background: "#7CFFB2",
            animation: "blink 1s steps(2) infinite",
            verticalAlign: "text-bottom",
          }}
          aria-hidden="true"
        />
      )}
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
