"use client"

import { AnimatePresence } from "framer-motion"
import { LanguageProvider } from "@/contexts/LanguageContext"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </LanguageProvider>
  )
}
