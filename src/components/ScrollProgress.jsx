import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'

export default function ScrollProgress() {
  const barRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const bar = barRef.current
    if (!bar) return

    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.style.transform = `scaleX(${ratio})`
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div
      id="scroll-progress"
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-marigold"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
