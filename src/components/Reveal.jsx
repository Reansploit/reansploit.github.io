import { useLayoutEffect, useRef } from 'react'
import { animate, stagger } from 'motion'
import { useReducedMotion } from '../lib/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1]

function hide(el, x, y) {
  el.style.opacity = '0'
  el.style.transform = `translate(${x}px, ${y}px)`
}

function show(el) {
  el.style.opacity = ''
  el.style.transform = ''
}

function showAll(items) {
  items.forEach((el) => show(el))
}

export function Reveal({ as: Tag = 'div', children, className, delay = 0, y = 22, x = 0 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    hide(el, x, y)
    const rect = el.getBoundingClientRect()

    if (rect.bottom <= 0) {
      show(el)
      return
    }

    let animation
    const play = () => {
      animation = animate(el, {
        opacity: [0, 1],
        translateX: [x, 0],
        translateY: [y, 0],
        duration: 0.7,
        delay: delay / 1000,
        ease: EASE,
        onComplete: () => show(el),
      })
    }

    if (rect.top < window.innerHeight) {
      play()
      return () => {
        animation?.cancel()
        show(el)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        io.disconnect()
        play()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      animation?.cancel()
      show(el)
    }
  }, [reduced, delay, x, y])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

export function RevealGroup({
  as: Tag = 'div',
  children,
  className,
  staggerMs = 70,
  y = 24,
  x = 0,
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || reduced) return

    const items = Array.from(root.querySelectorAll('[data-reveal-item]'))
    if (!items.length) return

    items.forEach((el) => hide(el, x, y))
    const rect = root.getBoundingClientRect()

    if (rect.bottom <= 0) {
      showAll(items)
      return
    }

    let animation
    const play = () => {
      animation = animate(items, {
        opacity: [0, 1],
        translateX: [x, 0],
        translateY: [y, 0],
        duration: 0.7,
        delay: stagger(staggerMs / 1000),
        ease: EASE,
        onComplete: () => showAll(items),
      })
    }

    if (rect.top < window.innerHeight) {
      play()
      return () => {
        animation?.cancel()
        showAll(items)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        io.disconnect()
        play()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    io.observe(root)

    return () => {
      io.disconnect()
      animation?.cancel()
      showAll(items)
    }
  }, [reduced, staggerMs, x, y])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}