import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../lib/useReducedMotion'

// A single digit that rolls vertically on change: the mask stays put while
// the glyph slides out the top and the new one drops in from the bottom.
// React owns the text; GSAP only moves the box. (GSAP's innerHTML set would
// parse "02" to the number 2 and strip the leading zero.)
export function FlipDigit({ value, width = 2, className = '' }) {
  const ref = useRef(null)
  const prev = useRef(value)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || prev.current === value) return
    prev.current = value
    if (reduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.to(el, { translateY: '-50%', opacity: 0, duration: 0.18, ease: 'power2.in' })
      tl.set(el, { translateY: '50%' })
      tl.to(el, { translateY: '0%', opacity: 1, duration: 0.22, ease: 'power2.out' })
    }, el)

    // Reverting a completed flip leaves the glyph at the exit-tween state
    // (translateY(-50%)), so the next roll would start clipped. Reset it.
    return () => {
      ctx.revert()
      // The new value renders in the same commit that runs this cleanup, so a
      // new timeline may already be animating this element. clearProps wipes
      // GSAP's inline transform rather than starting a tween it would clobber.
      gsap.set(el, { clearProps: 'transform,opacity' })
    }
  }, [value, width])

  return (
    <span
      className={`inline-block overflow-hidden align-middle tabular-nums ${className}`}
    >
      <span ref={ref} className="inline-block">
        {String(value).padStart(width, '0')}
      </span>
    </span>
  )
}

export function FlipCounter({ current, total, className = '' }) {
  return (
    <span className={`flex items-baseline gap-1.5 ${className}`}>
      <FlipDigit value={current} width={2} />
      <span className="text-bone-dim">/</span>
      <FlipDigit value={total} width={2} />
    </span>
  )
}