import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Components (work controls, back-to-top) borrow the live instance so
// programmatic jumps go through the same smoothing as the wheel.
let activeLenis = null
export function getLenis() {
  return activeLenis
}

// Pinned sections (Path, Work) freeze their bounding box for the whole pin
// range, so rect-based math cannot measure progress through them. Each pin
// registers its scroll range here and the nav reads it instead.
const pinRanges = new Map()
export function registerPinRange(id, getStart, getEnd) {
  pinRanges.set(id, { getStart, getEnd })
  return () => pinRanges.delete(id)
}
export function getPinRange(id) {
  return pinRanges.get(id)
}

// Lenis gives the page a buttery, momentum-based scroll instead of the
// browser's native jump. It is the only part of the page that touches
// window.scrollY directly, so every ScrollTrigger below reads the same
// smoothed value and the parallax stays in step with the reader.
export function createLenis() {
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    orientation: 'vertical',
    smoothWheel: true,
    // Touch devices keep their native scroll. JS-smoothed touch fights
    // pull-to-refresh and browser chrome, and the browser's own momentum
    // is already good there.
    syncTouch: false,
  })

  // Every Lenis tick tells ScrollTrigger to re-read scroll position, so
  // scrub-based parallax (driftHero, scrubRail, …) stays in step with the
  // smoothed scroll instead of the raw window scroll.
  const onScroll = () => ScrollTrigger.update()
  const raf = (time) => lenis.raf(time * 1000)
  lenis.on('scroll', onScroll)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  activeLenis = lenis

  return {
    lenis,
    destroy() {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(raf)
      lenis.destroy()
      activeLenis = null
    },
  }
}

// The rail fills with scroll position, so the line has to reverse when the
// reader scrolls back up. That is ScrollTrigger's job, not a timed animation.
export function scrubRail(line, trigger) {
  const ctx = gsap.context(() => {
    gsap.set(line, { scaleY: 0 })
    gsap.to(line, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top 72%',
        end: 'bottom 78%',
        scrub: 0.5,
      },
    })
  })

  return () => ctx.revert()
}

export function driftHero(block, trigger) {
  const ctx = gsap.context(() => {
    gsap.to(block, {
      y: -28,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  })

  return () => ctx.revert()
}

// The portrait answers the name's drift in the opposite direction, so the
// hero separates into layers as it leaves instead of sliding as one block.
export function driftPortrait(block, trigger) {
  const ctx = gsap.context(() => {
    gsap.to(block, {
      y: 22,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  })

  return () => ctx.revert()
}

// The band photo is oversized inside its clip box, so the parallax never
// reveals an edge. Scale is set once; scroll position drives the drift.
export function driftImage(image, trigger) {
  const ctx = gsap.context(() => {
    gsap.set(image, { scale: 1.15 })
    // The frame is a breath, not a pan: the photo swells a few percent as it
    // crosses the viewport, so the wide shot pushes in instead of only
    // sliding. Scale stays >= 1.15 so the oversized image never shows an edge.
    gsap.fromTo(
      image,
      { yPercent: -6, scale: 1.15 },
      {
        yPercent: 6,
        scale: 1.22,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      },
    )
  })

  return () => ctx.revert()
}

export function driftStatement(block, trigger) {
  const ctx = gsap.context(() => {
    gsap.to(block, {
      y: -18,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    })
  })

  return () => ctx.revert()
}

// The hero metadata is the most distant layer of the first screen: it lifts
// off the page as the name and portrait drift in the opposite direction, so
// the opening shot separates into three planes instead of sliding as one.
export function driftMeta(block, trigger) {
  const ctx = gsap.context(() => {
    gsap.to(block, {
      y: -14,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  })

  return () => ctx.revert()
}

export function driftInfo(block, trigger) {
  const ctx = gsap.context(() => {
    gsap.to(block, {
      y: -14,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    })
  })

  return () => ctx.revert()
}

// The work section stops being a column here: the section pins to the
// viewport and further scrolling moves the project track sideways, so the
// page turns instead of only descending. Panels lean a little with scroll
// velocity so the turn feels physical, not mechanical.
export function horizontalScroll(section, track, { onProgress, skewTargets = [] } = {}) {
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
  const setters = skewTargets.map((el) =>
    gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' }),
  )

  let st = null
  let unregister = () => {}
  const ctx = gsap.context(() => {
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          st = self
          const skew = gsap.utils.clamp(-4, 4, self.getVelocity() / -900)
          setters.forEach((set) => set(skew))
          if (onProgress) onProgress(self.progress, self)
        },
      },
    })
    const sectionId = section.getAttribute('id')
    if (sectionId) {
      unregister = registerPinRange(
        sectionId,
        () => st?.start ?? 0,
        () => st?.end ?? 0
      )
    }
  })

  return () => {
    unregister()
    ctx.revert()
    gsap.killTweensOf(skewTargets)
    gsap.set(skewTargets, { skewX: 0 })
    ScrollTrigger.refresh()
  }
}

export function refreshOnFonts() {
  if (!document.fonts) return
  document.fonts.ready.then(() => ScrollTrigger.refresh())
}
