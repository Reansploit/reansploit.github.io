import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Reveal, RevealGroup } from './Reveal'
import { FlipCounter } from './FlipDigit'
import { useReducedMotion } from '../lib/useReducedMotion'
import { getLenis, horizontalScroll } from '../lib/scroll'
import { useMediaQuery } from '../lib/useMediaQuery'
import gsap from 'gsap'

export default function WorkIndex({ data }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const triggerRef = useRef(null)
  const indexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const horizontal = wide && !reduced
  // Below the desktop breakpoint the same reel survives as a native
  // horizontal scroller with snap points. A phone should not get the plain
  // vertical stack the desktop fallback uses: the sideways reel is the
  // section's identity, so it keeps that identity at thumb width too.
  const reel = !wide && !reduced
  const items = data.items
  const hasWork = items.length > 0
  const activeItem = items[activeIndex]

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0)
  }, [activeIndex, items.length])

  const renderPanel = (item, index) => (
    <article
      key={item.title}
      className={`work-row work-panel group ${
        horizontal
          ? 'lg:w-[min(74vw,54rem)] lg:shrink-0'
          : reel
            ? 'w-[85vw] max-w-[26rem] shrink-0 snap-start'
            : ''
      }`}
    >
      <div
        data-panel-media
        className="relative aspect-[4/3] overflow-hidden border border-line bg-ink-raised lg:aspect-auto lg:h-[min(48vh,30rem)]"
      >
        <img
          src={item.image}
          alt={item.imageAlt}
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
          className="work-thumb photo absolute inset-0 h-full w-full object-cover"
        />
        <span className="meta absolute left-4 top-4 border border-line bg-ink px-3 py-2 text-bone">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-6 border-b border-line pb-4">
        <div>
          <h3
            data-panel-heading={index}
            tabIndex={-1}
            className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.02] tracking-[-0.015em]"
          >
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-bone-dim">{item.type}</p>
          {item.role && <p className="mt-1 text-sm text-bone-dim">{item.role}</p>}
          {item.summary && (
            <p className="mt-2 text-sm leading-relaxed text-bone-dim">{item.summary}</p>
          )}
          {item.outcome && (
            <p className="mt-2 text-sm leading-relaxed text-marigold">{item.outcome}</p>
          )}
          {item.tools && (
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-bone-dim">
              {item.tools}
            </p>
          )}
          {item.links && item.links.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-3">
              {item.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-bone underline decoration-bone-dim hover:text-marigold hover:decoration-marigold transition-colors"
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="meta pt-1 text-bone-dim">{item.year}</span>
      </div>
    </article>
  )

  // On a wide screen the section pins and vertical scrolling drives the
  // track sideways. Narrow screens and reduced motion keep a plain
  // vertical stack, which is why the layout classes are conditional too.
  useLayoutEffect(() => {
    if (!horizontal || !hasWork) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const medias = Array.from(track.querySelectorAll('[data-panel-media]'))
    return horizontalScroll(section, track, {
      skewTargets: medias,
      onProgress: (progress, self) => {
        triggerRef.current = self
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`
        }
        const next = Math.round(progress * (items.length - 1))
        if (next !== indexRef.current) {
          indexRef.current = next
          setActiveIndex(next)
        }
      },
    })
  }, [horizontal, hasWork, items.length])

  // The active panel's media sits a touch larger, confirming the reader's
  // position in the reel. Done in its own effect (keyed on activeIndex) so
  // the scale tween never contends with the skew tween on the same element.
  useEffect(() => {
    if (!horizontal || !hasWork) return
    const track = trackRef.current
    if (!track) return
    const medias = Array.from(track.querySelectorAll('[data-panel-media]'))
    medias.forEach((el, i) => {
      gsap.to(el, {
        scale: i === activeIndex ? 1.06 : 1,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })
  }, [activeIndex, horizontal, hasWork])

  // The mobile reel mirrors the pinned rail's job through a native horizontal
  // scroller: scroll events drive the progress bar and pick the nearest panel
  // as the current one, exactly like the pinned track's onProgress.
  useLayoutEffect(() => {
    if (!reel || !hasWork) return
    const track = trackRef.current
    if (!track) return
    const panels = Array.from(track.querySelectorAll('.work-panel'))
    if (!panels.length) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const max = track.scrollWidth - track.clientWidth
        const progress = max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 0
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
        const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
        const edge = track.getBoundingClientRect().left + pad
        let nearest = 0
        let best = Infinity
        panels.forEach((panel, i) => {
          const distance = Math.abs(panel.getBoundingClientRect().left - edge)
          if (distance < best) {
            best = distance
            nearest = i
          }
        })
        if (nearest !== indexRef.current) {
          indexRef.current = nearest
          setActiveIndex(nearest)
        }
      })
    }
    onScroll()
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
    }
  }, [reel, hasWork, items.length])

  // Arrow keys drive the current reel, matching the motion promised in
  // DESIGN.md. Home and End jump to the ends; the new panel's heading is
  // announced by moving focus there.
  useEffect(() => {
    if ((!horizontal && !reel) || !hasWork) return
    const onKeyDown = (event) => {
      if (reel) {
        const section = sectionRef.current
        if (!section) return
        const rect = section.getBoundingClientRect()
        if (rect.bottom < 96 || rect.top > window.innerHeight - 96) return
      }
      if (event.key === 'ArrowLeft') { event.preventDefault(); (horizontal ? goTo : stepReel)(-1) }
      else if (event.key === 'ArrowRight') { event.preventDefault(); (horizontal ? goTo : stepReel)(1) }
      else if (event.key === 'Home') { event.preventDefault(); if (horizontal) goTo(0); else reelTo(0) }
      else if (event.key === 'End') { event.preventDefault(); if (horizontal) goTo(items.length - 1); else reelTo(items.length - 1) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [horizontal, reel, hasWork, activeIndex, items.length])

  // Prev / Next jump between panels by scrolling the page to the matching
  // point inside the pinned range, so the buttons, the wheel and the arrow
  // keys all agree on where the track lands.
  const goTo = (index) => {
    const self = triggerRef.current
    if (!self || !items.length) return
    const target = ((index % items.length) + items.length) % items.length
    const span = Math.max(1, items.length - 1)
    const y = self.start + (self.end - self.start) * (target / span)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
    const heading = document.querySelector(`#work [data-panel-heading="${target}"]`)
    if (heading) heading.focus({ preventScroll: true })
  }

  // Reel helpers: the mobile track is a real horizontal scroller, so the
  // controls move it by scroll position, not by page scroll.
  const reelTo = (index) => {
    const track = trackRef.current
    if (!track) return
    const panel = track.querySelectorAll('.work-panel')[index]
    if (!panel) return
    const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
    const left = panel.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft - pad
    track.scrollTo({ left, behavior: 'smooth' })
  }

  const stepReel = (dir) => {
    const target = Math.min(items.length - 1, Math.max(0, activeIndex + dir))
    reelTo(target)
    const heading = trackRef.current?.querySelector(`[data-panel-heading="${target}"]`)
    if (heading) {
      window.setTimeout(() => heading.focus({ preventScroll: true }), 450)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="work"
      className={`scroll-mt-24 border-t border-line ${
        horizontal ? 'lg:h-[100svh] lg:overflow-hidden' : 'py-20 md:py-28 lg:py-32'
      }`}
    >
      <div className={horizontal ? 'flex h-full flex-col justify-between' : undefined}>
        <div
          className={`page-x flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10 ${
            horizontal ? 'pt-20 lg:pt-24' : ''
          }`}
        >
          <h2
            aria-label="Work"
            className="font-display text-[clamp(4.5rem,16vw,12rem)] leading-[0.72] tracking-[-0.03em]"
          >
            <span aria-hidden="true" className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <Reveal as="span" y={0} className="block">Work</Reveal>
            </span>
          </h2>
          <p className="meta flex max-w-[18rem] items-baseline gap-3 text-bone-dim sm:pb-3 sm:text-right">
            <span className="text-marigold">04</span>
            {data.note}
          </p>
        </div>

        {!hasWork ? (
          <p className="page-x mt-12 text-sm text-bone-dim">
            No projects are listed yet. Add them in src/data/site.js.
          </p>
        ) : (
          <div className={horizontal ? 'min-h-0 flex-1 lg:overflow-hidden' : 'mt-12'}>
            {horizontal ? (
              <div
                ref={trackRef}
                className="page-x flex h-full w-max items-center gap-8 lg:gap-12"
              >
                {items.map(renderPanel)}
              </div>
            ) : reel ? (
              <div
                ref={trackRef}
                className={`page-x mt-2 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [scroll-padding-inline:clamp(1.25rem,5vw,5rem)] [&::-webkit-scrollbar]:hidden`}
              >
                {items.map(renderPanel)}
              </div>
            ) : (
              <RevealGroup
                as="div"
                className="page-x flex flex-col gap-12 mt-12"
                staggerMs={80}
              >
                {items.map(renderPanel)}
              </RevealGroup>
            )}
          </div>
        )}

        {hasWork && (horizontal || reel) && (
          <div className="page-x flex items-center gap-5 pb-8 pt-4">
            <span
              className="meta shrink-0 text-bone-dim"
              aria-live="polite"
              aria-label={`Project ${activeIndex + 1} of ${items.length}`}
            >
              <FlipCounter
                current={activeIndex + 1}
                total={items.length}
                className="inline-flex"
              />
            </span>
            <div className="h-px flex-1 bg-line">
              <div
                ref={barRef}
                className="h-px w-full origin-left bg-marigold"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <div className="flex shrink-0 gap-3" role="group" aria-label="Project controls">
              <button
                type="button"
                onClick={() => (horizontal ? goTo(activeItem ? activeIndex - 1 : 0) : stepReel(activeItem ? -1 : 0))}
                className="reel-control"
                aria-label="Previous project"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => (horizontal ? goTo(activeIndex + 1) : stepReel(1))}
                className="reel-control"
                aria-label="Next project"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
