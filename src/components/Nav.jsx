import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { getLenis, getPinRange } from '../lib/scroll'

export default function Nav({ items, name, suffix }) {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [underlineProgress, setUnderlineProgress] = useState(1)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = items.map((item) => document.querySelector(item.href)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-42% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  // Active link underline grows with scroll progress through its section.
  // Pinned sections freeze their rect, so read progress from the pin range
  // registered in lib/scroll instead of getBoundingClientRect.
  useEffect(() => {
    if (!active) return
    let raf = 0
    const update = () => {
      const section = document.querySelector(active)
      if (!section) return
      let progress
      const range = getPinRange(active.replace('#', ''))
      if (range) {
        const start = range.getStart()
        const end = range.getEnd()
        progress = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(end - start, 1)))
      } else {
        const rect = section.getBoundingClientRect()
        const trigger = window.innerHeight * 0.6
        progress = Math.min(1, Math.max(0, (trigger - rect.top) / Math.max(rect.height, 1)))
      }
      setUnderlineProgress(progress)
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
  }, [active])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        if (toggleRef.current) toggleRef.current.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Animate the mobile panel in/out instead of toggling display instantly,
  // and lock background scroll while it is open so the page does not move
  // under the overlay.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const lenis = getLenis()
    if (menuOpen) {
      panel.style.display = 'block'
      gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power3.out' })
      if (lenis) lenis.stop()
    } else {
      gsap.to(panel, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => { panel.style.display = 'none' } })
      if (lenis) lenis.start()
    }
  }, [menuOpen])

  const links = (className) => (
    <ul className={className}>
      {items.map((item) => {
        const isActive = active === item.href
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => setMenuOpen(false)}
              className={`group relative inline-flex min-h-11 items-center transition-colors ${
                isActive ? 'text-bone' : 'text-bone-dim hover:text-bone'
              }`}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={`u-line absolute bottom-0 left-0 h-px w-full origin-left bg-marigold ${
                  isActive ? '' : 'scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100'
                }`}
                style={isActive ? { transform: `scaleX(${underlineProgress})` } : undefined}
              />
            </a>
          </li>
        )
      })}
    </ul>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menuOpen ? 'border-line bg-ink/92 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="page-x flex h-16 items-center justify-between gap-3">
        <a
          href="#top"
          className="inline-flex min-h-11 min-w-11 items-center text-sm font-medium tracking-[-0.01em] transition-colors hover:text-marigold"
        >
          <span aria-hidden="true" className="inline">
            {name}<span className="text-marigold">{suffix}</span>
          </span>
          <span className="sr-only">{name}{suffix}, back to top</span>
        </a>

        <div className="hidden md:block">{links('flex items-center gap-5')}</div>
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div
        ref={panelRef}
        id="mobile-navigation"
        style={{ display: menuOpen ? 'block' : 'none' }}
        className="border-t border-line bg-ink md:hidden"
      >
        <div className="page-x py-5">{links('flex flex-col items-start gap-2 text-2xl')}</div>
      </div>
    </header>
  )
}
