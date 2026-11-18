import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// Hovering the label scrambles its letters for a beat, then resolves them
// back to the real text, left to right. Read-only flourish, never a claim.
export function ScrambleText({ text, className = '', ...rest }) {
  const ref = useRef(null)
  const interval = useRef(null)
  const reduced = useReducedMotion()

  const scramble = () => {
    const el = ref.current
    if (!el) return
    // Cancel any in-flight scramble so rapid re-enters can't stack intervals.
    if (interval.current) clearInterval(interval.current)
    const length = text.length
    let step = 0
    interval.current = setInterval(() => {
      step += 1
      el.textContent = text
        .split('')
        .map((char, i) => (i < step - length ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('')
      if (step >= length) {
        clearInterval(interval.current)
        interval.current = null
        el.textContent = text
      }
    }, 45)
  }

  useEffect(
    () => () => {
      if (interval.current) clearInterval(interval.current)
    },
    [],
  )

  if (reduced) {
    return (
      <span ref={ref} className={className} {...rest}>
        {text}
      </span>
    )
  }

  return (
    <span ref={ref} className={className} onMouseEnter={scramble} {...rest}>
      {text}
    </span>
  )
}