"use client"

import { useEffect, useRef, useState } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

/**
 * Animated text-scramble effect that resolves to `target`.
 *
 * - `enabled`: when false, just displays `target` as-is.
 * - `triggerKey`: bump this (e.g. on language change) to replay the scramble
 *   without changing the target itself.
 */
export function useTextScramble(
  target: string,
  enabled: boolean = true,
  triggerKey: string | number = 0
) {
  const [display, setDisplay] = useState(target)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled) {
      setDisplay(target)
      return
    }

    let iteration = 0
    const totalFrames = target.length * 3

    if (frameRef.current) clearInterval(frameRef.current)

    frameRef.current = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < iteration / 3) return char
            return randomChar()
          })
          .join("")
      )

      iteration++
      if (iteration >= totalFrames) {
        if (frameRef.current) clearInterval(frameRef.current)
        setDisplay(target)
      }
    }, 30)

    return () => {
      if (frameRef.current) clearInterval(frameRef.current)
    }
  }, [target, enabled, triggerKey])

  return display
}
