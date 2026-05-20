"use client"

import { createContext, useContext, useEffect, useRef } from "react"
import Lenis from "lenis"

type LenisContextType = {
  lenisRef: React.MutableRefObject<Lenis | null>
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void
  stop: () => void
  start: () => void
}

const LenisContext = createContext<LenisContextType | null>(null)

const HEADER_OFFSET = 64

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const lenis = new Lenis({
      duration: reduceMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduceMotion,
    })

    lenisRef.current = lenis

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    // Intercept in-page anchor clicks so they account for the fixed navbar
    // and use Lenis smooth scrolling.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a")
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href) return
      // Same-page hash (#id) or root-prefixed hash (/#id) when already on "/"
      let id: string | null = null
      if (href.startsWith("#")) id = href.slice(1)
      else if (href.startsWith("/#") && window.location.pathname === "/") id = href.slice(2)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -HEADER_OFFSET })
      // Update the URL hash without re-triggering native jump
      history.replaceState(null, "", `#${id}`)
    }
    document.addEventListener("click", onClick)

    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const id = hash.slice(1)
      const el = document.getElementById(id)
      if (!el) return
      requestAnimationFrame(() =>
        lenis.scrollTo(el, { offset: -HEADER_OFFSET, immediate: reduceMotion })
      )
    }

    // Smooth scroll on initial load if URL has a hash, and when it changes later
    // (e.g. navigating from /stack to /#contact)
    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)

    return () => {
      cancelAnimationFrame(frameId)
      document.removeEventListener("click", onClick)
      window.removeEventListener("hashchange", scrollToHash)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = (target: string | number | HTMLElement, offset = -HEADER_OFFSET) => {
    lenisRef.current?.scrollTo(target, { offset })
  }
  const stop = () => lenisRef.current?.stop()
  const start = () => lenisRef.current?.start()

  return (
    <LenisContext.Provider value={{ lenisRef, scrollTo, stop, start }}>
      {children}
    </LenisContext.Provider>
  )
}

export function useLenis() {
  const ctx = useContext(LenisContext)
  return ctx
}
