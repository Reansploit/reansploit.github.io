import { useLayoutEffect, useRef, useState } from 'react'
import { getLenis } from '../lib/scroll'

// The rail is the page's tour guide. On desktop it is a hairline down the
// left margin with one node per stop and a marigold dot that travels as the
// reader scrolls. On mobile it is left out: the hairline has no margin to
// anchor to on a narrow screen, so the page reads cleaner without it.
const STOPS = [
  { id: 'top', label: 'Opening' },
  { id: 'info', label: 'About' },
  { id: 'statement', label: 'Statement' },
  { id: 'band', label: 'Photo' },
  { id: 'path', label: 'Path' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

export default function GuideRail() {
  const desktopDotRef = useRef(null)
  const nodeRefs = useRef([])
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const desktopDot = desktopDotRef.current
    if (!desktopDot) return

    const stops = STOPS.map((stop) => ({
      ...stop,
      el: document.getElementById(stop.id),
    })).filter((stop) => stop.el)

    if (!stops.length) return

    const doc = document.documentElement

    // Pinned sections (Path, Work) live inside a GSAP pin-spacer, so their own
    // offsetTop collapses to the pinned box. The spacer's top is the scroll
    // position where the section actually arrives, so measure that instead.
    const arrivalOf = (el) => {
      const spacer = el.closest?.('.pin-spacer')
      return (spacer || el).offsetTop
    }

    // Node positions are fractions of the whole document, so the rail keeps
    // its proportions however tall the page grows after fonts load.
    const compute = () => {
      const docHeight = doc.scrollHeight
      stops.forEach((stop) => {
        stop.pos = arrivalOf(stop.el) / docHeight
      })
      stops.forEach((stop, index) => {
        const node = nodeRefs.current[index]
        if (node) node.style.top = `${stop.pos * 100}%`
      })
    }
    compute()
    // Child sections create their pins after this effect runs, so re-measure
    // once the frame has painted and again once fonts settle the layout.
    const raf = requestAnimationFrame(() => compute())
    const timer = setTimeout(compute, 60)

    // A plain scroll listener, not ScrollTrigger: pin-spacers grow the
    // document after mount, which would leave a fixed ScrollTrigger end
    // stale and freeze the dot mid-rail. window.scrollY is always live.
    const onScroll = () => {
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (desktopDot) desktopDot.style.top = `${progress * 100}%`
      // A stop counts as reached once its top lands under the header, the
      // same offset jump() scrolls to, not when the page centre crosses it.
      const arrival = window.scrollY + 72
      let index = 0
      stops.forEach((stop, i) => {
        if (arrivalOf(stop.el) <= arrival) index = i
      })
      setActive((prev) => (prev === index ? prev : index))
    }
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', compute)
    if (document.fonts?.ready) document.fonts.ready.then(compute)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', compute)
    }
  }, [])

  const jump = (event, id) => {
    event.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: -72 })
    else window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
    // Keyboard readers keep their place: focus moves with the jump.
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  return (
    <nav aria-label="Page tour" className="guide-rail pointer-events-none z-40">
      {/* Desktop: vertical hairline on the left margin. */}
      <div className="fixed left-5 top-1/2 z-40 hidden h-[60vh] w-px -translate-y-1/2 bg-line lg:block">
        <span
          ref={desktopDotRef}
          aria-hidden="true"
          className="guide-dot absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold"
          style={{ top: '0%' }}
        />
        {STOPS.map((stop, index) => (
          <a
            key={stop.id}
            href={`#${stop.id}`}
            ref={(el) => {
              nodeRefs.current[index] = el
            }}
            onClick={(event) => jump(event, stop.id)}
            aria-current={index === active ? 'true' : undefined}
            aria-label={`Stop ${index + 1} of ${STOPS.length}: ${stop.label}`}
            className="guide-stop pointer-events-auto absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="guide-node block h-2.5 w-2.5 rounded-full border border-line bg-ink" />
            <span className="guide-pulse block h-2.5 w-2.5 rounded-full border border-marigold" aria-hidden="true" />
            <span className="guide-label meta pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-bone-dim">
              {String(index + 1).padStart(2, '0')} {stop.label}
            </span>
          </a>
        ))}
        <span className="sr-only" role="status" aria-live="polite">
          {`Stop ${active + 1} of ${STOPS.length}: ${STOPS[active]?.label ?? ''}`}
        </span>
      </div>
    </nav>
  )
}
