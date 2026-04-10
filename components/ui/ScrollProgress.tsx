"use client"

import { useEffect, useRef } from "react"

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
    }

    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        zIndex: 9997,
        background: "var(--color-border)",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          background: "var(--color-accent)",
          transformOrigin: "left",
          transform: "scaleX(0)",
          willChange: "transform",
        }}
      />
    </div>
  )
}
