"use client"

import { useEffect, useRef, useState } from "react"

type Options = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Shared IntersectionObserver across all consumers.
 *
 * Each Element can only have one callback registered at a time (the latest
 * one wins on re-registration). One observer is created per unique
 * (threshold, rootMargin) pair so component-level options still work.
 */
type ObserverKey = string
const observers = new Map<ObserverKey, IntersectionObserver>()
const callbacks = new WeakMap<Element, (entry: IntersectionObserverEntry) => void>()

function getObserver(threshold: number, rootMargin: string): IntersectionObserver {
  const key: ObserverKey = `${threshold}|${rootMargin}`
  let observer = observers.get(key)
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const cb = callbacks.get(entry.target)
        if (cb) cb(entry)
      }
    },
    { threshold, rootMargin }
  )
  observers.set(key, observer)
  return observer
}

const DEFAULTS = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" } as const

export function useInView<T extends Element = HTMLDivElement>(options?: Options) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  const threshold = options?.threshold ?? DEFAULTS.threshold
  const rootMargin = options?.rootMargin ?? DEFAULTS.rootMargin
  const once = options?.once ?? true

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = getObserver(threshold, rootMargin)

    callbacks.set(el, (entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        if (once) {
          observer.unobserve(el)
          callbacks.delete(el)
        }
      } else if (!once) {
        setIsVisible(false)
      }
    })

    observer.observe(el)

    return () => {
      observer.unobserve(el)
      callbacks.delete(el)
    }
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}
