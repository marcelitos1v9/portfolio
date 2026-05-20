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

const HTML_LANG: Record<Lang, string> = {
  pt: "pt-BR",
  en: "en",
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt")

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_lang") as Lang | null
    if (saved === "pt" || saved === "en") {
      setLangState(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
  }, [lang])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem("portfolio_lang", l)
    } catch {
      /* localStorage may be unavailable (e.g. Safari private mode) */
    }
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
