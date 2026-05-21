"use client"

import { useEffect, useRef } from "react"

/**
 * Lightweight canvas-2D particle field for the Hero background.
 *
 * Theme: "data flowing" — small dots drifting horizontally, occasionally
 * connecting with thin lines when they pass close to each other. Cheap
 * enough to keep at 60fps on mid-range phones because:
 *   - Particle count scales with viewport area, capped at 80
 *   - Connection distance is squared (no sqrt) for the proximity check
 *   - We pause via `IntersectionObserver` when the hero isn't on screen
 *   - We bail out entirely under `prefers-reduced-motion` or when
 *     `navigator.hardwareConcurrency` reports a low-end device
 */
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Skip on very low-end devices (e.g. older Android phones)
    const lowEnd =
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency <= 2
    if (reduce || lowEnd) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    type Particle = {
      x: number
      y: number
      vx: number
      vy: number
      r: number
    }
    let particles: Particle[] = []

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Re-seed particles proportionally to area, capped.
      const target = Math.min(80, Math.floor((width * height) / 18000))
      particles = Array.from({ length: target }, () => spawnParticle(width, height))
    }

    const onResize = () => resize()
    resize()
    window.addEventListener("resize", onResize)

    // Pause when not visible
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const MAX_DIST_SQ = 110 * 110

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Move + draw points
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        // wrap on horizontal exit so the field always feels "flowing"
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(232, 197, 71, 0.55)" // accent, low alpha
        ctx.fill()
      }

      // Connection lines — O(n²) but n ≤ 80
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq < MAX_DIST_SQ) {
            const t = 1 - distSq / MAX_DIST_SQ
            ctx.strokeStyle = `rgba(232, 197, 71, ${t * 0.18})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    const loop = () => {
      if (visibleRef.current) draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
      io.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        // Soft fade so the particles don't compete with the foreground text.
        maskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
      }}
    />
  )
}

function spawnParticle(w: number, h: number) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.3) * 0.35, // bias slightly to the right ("flowing")
    vy: (Math.random() - 0.5) * 0.1,
    r: Math.random() * 1.6 + 0.6,
  }
}
