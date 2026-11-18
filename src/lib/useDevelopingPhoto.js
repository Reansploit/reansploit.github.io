import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

// A photo starts near-black and blurred, the way a print sits in the tray
// before it is exposed, and resolves to its full tone the first time it
// scrolls into view. The two states are plain classes (see styles.css), so
// the hook only has to add them at the right moment. is-undeveloped is
// dropped once the develop transition has run, so later filter changes (a
// hover swell) keep their own shorter transition.
export function useDevelopingPhoto() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      el.classList.add('is-developed')
      return
    }

    el.classList.add('is-undeveloped')
    let timer
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        io.disconnect()
        el.classList.add('is-developed')
        timer = setTimeout(() => el.classList.remove('is-undeveloped'), 1700)
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [reduced])

  return ref
}