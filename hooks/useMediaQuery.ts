"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * Subscribes to a CSS media query.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: matchMedia is
 * an external store, and reading it into state from an effect body triggers a
 * cascading render on every mount (and is flagged by
 * `react-hooks/set-state-in-effect`).
 *
 * @param serverFallback what the query evaluates to during SSR and the
 *   hydration render, where `window` doesn't exist. Pick the safe answer for
 *   the feature — e.g. `true` for `prefers-reduced-motion` so animation never
 *   flashes before the real preference is known.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener("change", onStoreChange)
      return () => mq.removeEventListener("change", onStoreChange)
    },
    [query]
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
