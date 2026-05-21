"use client"

import { AnimatePresence } from "framer-motion"
import { LanguageProvider } from "@/contexts/LanguageContext"
import CustomCursor from "@/components/ui/CustomCursor"
import ScrollProgress from "@/components/ui/ScrollProgress"
import BackToTop from "@/components/ui/BackToTop"
import KonamiCode from "@/components/ui/KonamiCode"

/**
 * Single client-side wrapper that owns:
 *   - the language context (used by BackToTop, Navbar, all sections)
 *   - persistent UI siblings (custom cursor, scroll progress, back-to-top)
 *   - the `AnimatePresence` that drives page-transition animations
 *
 * Important: only `{children}` lives inside `AnimatePresence`, because
 * `template.tsx` wraps each route in a keyed `motion.div`. Putting
 * BackToTop / CustomCursor / ScrollProgress as siblings of that
 * AnimatePresence avoids "two children with the same key" — those
 * persistent components don't need to be tracked for exit animations.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CustomCursor />
      <ScrollProgress />
      <AnimatePresence mode="wait">{children}</AnimatePresence>
      <BackToTop />
      <KonamiCode />
    </LanguageProvider>
  )
}
