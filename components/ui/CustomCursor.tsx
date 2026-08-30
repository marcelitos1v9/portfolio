"use client"

import { useEffect, useRef, useState } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

const HOVER_SELECTOR = "a, button, [role='button'], [data-cursor-hover]"

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  // Live subscription rather than a one-shot read: plugging in a mouse on a
  // touch device now turns the cursor on instead of leaving it off forever.
  const enabled = useMediaQuery("(pointer: fine)")

  useEffect(() => {
    if (!enabled) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Event delegation: works for dynamically added elements (mobile menu items,
    // framer-motion remounts, stack list, etc.)
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest?.(HOVER_SELECTOR)) setIsHovering(true)
    }
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest?.(HOVER_SELECTOR)) setIsHovering(false)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout", onOut)

    const loop = () => {
      const lerp = 0.18
      ringX += (mouseX - ringX) * lerp
      ringY += (mouseY - ringY) * lerp

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* Dot — follows cursor directly */}
      <div
        ref={dotRef}
        data-custom-cursor
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--color-accent)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
      {/* Ring — lags behind with lerp */}
      <div
        ref={ringRef}
        data-custom-cursor
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? 40 : 20,
          height: isHovering ? 40 : 20,
          borderRadius: "50%",
          border: "1px solid var(--color-accent)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          mixBlendMode: isHovering ? "difference" : "normal",
          transition: "width 0.25s ease, height 0.25s ease",
        }}
      />
    </>
  )
}
