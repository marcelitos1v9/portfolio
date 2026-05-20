"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLenis } from "@/components/ui/LenisProvider"
import { useLanguage } from "@/contexts/LanguageContext"

/**
 * Floating "back to top" affordance. Appears once the viewport has scrolled
 * roughly past the hero (≥ 80% of viewport height). Uses Lenis when available
 * to keep the easing consistent with the rest of the site; otherwise falls
 * back to native smooth scroll.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const lenis = useLenis()
  const { t } = useLanguage()

  useEffect(() => {
    const threshold = () => Math.max(window.innerHeight * 0.8, 600)
    const onScroll = () => setVisible(window.scrollY > threshold())
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const onClick = () => {
    if (lenis) lenis.scrollTo(0, 0)
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          onClick={onClick}
          aria-label={t.backtotop_aria}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "fixed",
            bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            right: "clamp(1rem, 4vw, 2.5rem)",
            zIndex: 90,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-heading)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "1rem",
            lineHeight: 1,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)"
            e.currentTarget.style.color = "var(--color-accent)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)"
            e.currentTarget.style.color = "var(--color-heading)"
          }}
        >
          <span aria-hidden="true">↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
