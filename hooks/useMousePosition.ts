"use client"

import { useEffect, useState } from "react"

export function useMousePosition() {
  const [position, setPosition] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const update = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", update)
    return () => window.removeEventListener("mousemove", update)
  }, [])

  return position
}
