"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react"
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

const STORAGE_KEY = "portfolio_lang"
const DEFAULT_LANG: Lang = "pt"

// ── localStorage as an external store ────────────────────────────────
// The saved language can't be read during render (there's no localStorage on
// the server, and reading it would desync the hydration pass), and reading it
// into state from an effect body costs a cascading render on every mount.
// `useSyncExternalStore` is the shape React provides for exactly this: server
// renders the default, the client swaps in the stored value on hydration.

const listeners = new Set<() => void>()

/** Cached so `getSnapshot` doesn't touch localStorage on every render.
 *  `null` means "not read yet". */
let cached: Lang | null = null

function readStored(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === "pt" || saved === "en" ? saved : DEFAULT_LANG
  } catch {
    // localStorage may be unavailable (e.g. Safari private mode)
    return DEFAULT_LANG
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)

  // Toggling the language in one tab now follows in the others.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    cached = readStored()
    emit()
  }
  window.addEventListener("storage", onStorage)

  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener("storage", onStorage)
  }
}

function getSnapshot(): Lang {
  if (cached === null) cached = readStored()
  return cached
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG
}

function writeLang(l: Lang) {
  cached = l
  try {
    localStorage.setItem(STORAGE_KEY, l)
  } catch {
    /* localStorage may be unavailable (e.g. Safari private mode) */
  }
  emit()
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
  }, [lang])

  const setLang = useCallback((l: Lang) => writeLang(l), [])

  const value = useMemo(() => ({ lang, setLang, t: i18n[lang] }), [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
