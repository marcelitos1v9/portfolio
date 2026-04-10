"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { i18n, type Lang, type Translations } from "@/lib/i18n"

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "pt",
  setLang: () => {},
  t: i18n.pt,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt")

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_lang") as Lang | null
    if (saved === "pt" || saved === "en") setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem("portfolio_lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: i18n[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
