"use client"

import { useEffect, useRef, useState } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

export function useTextScramble(target: string, enabled: boolean = true) {
  const [display, setDisplay] = useState(target)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled) {
      setDisplay(target)
      return
    }

    let iteration = 0
    const totalFrames = target.length * 3

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
  }, [target, enabled])

  return display
}
