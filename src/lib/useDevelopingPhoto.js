import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

// A photo starts near-black and blurred, the way a print sits in the tray
// before it is exposed, and resolves to its full tone the first time it
// scrolls into view. The two states are plain classes (see styles.css), so
// the hook only has to add them at the right moment. is-undeveloped is
// dropped once the develop transition has run, so later filter changes (a
// hover swell) keep their own shorter transition.
//
// On a coarse pointer the print answers a tap as well as the scroll: the
// darkroom cue is "press the shutter", so a photo that has not been seen
// develops when the reader touches it, not only when it happens to pass
// into the frame. The IntersectionObserver still runs, so a photo that
// scrolls in develops on its own; a tap only speeds the same outcome.
export function useDevelopingPhoto({ tap = false } = {}) {
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
    // A tap is the shutter: expose the print now, and let the timer drop the
    // undeveloped class so later filter changes keep their own transition.
    const develop = () => {
      el.classList.add('is-developed')
      clearTimeout(timer)
      timer = setTimeout(() => el.classList.remove('is-undeveloped'), 1700)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        io.disconnect()
        develop()
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    io.observe(el)

    if (tap) {
      el.addEventListener('pointerdown', develop, { once: true })
    }

    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [reduced, tap])

  return ref
}