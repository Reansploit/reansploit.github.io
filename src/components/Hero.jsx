import { useLayoutEffect, useRef } from 'react'
import { animate } from 'motion'
import gsap from 'gsap'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useDevelopingPhoto } from '../lib/useDevelopingPhoto'
import { driftHero, driftPortrait } from '../lib/scroll'
import { storyCamera } from '../lib/camera'

export default function Hero({ data }) {
  const sectionRef = useRef(null)
  const metaRef = useRef(null)
  const statementWordsRef = useRef(null)
  const ctaRef = useRef(null)
  const hairlineRef = useRef(null)
  const nameBlockRef = useRef(null)
  const figureRef = useRef(null)
  const frameRef = useRef(null)
  const portraitRef = useDevelopingPhoto()
  const introDoneRef = useRef(false)
  const reduced = useReducedMotion()

  // One choreographed intro: meta first, then the statement reads itself
  // word by word, the name rises letter by letter, the hairline draws
  // itself, and the CTA arrives last.
  useLayoutEffect(() => {
    if (reduced) return

    const section = sectionRef.current
    const meta = metaRef.current
    const words = statementWordsRef.current
    const cta = ctaRef.current
    const hairline = hairlineRef.current
    if (!section || !meta || !words || !cta || !hairline) return

    const wordSpans = Array.from(words.querySelectorAll('[data-word]'))
    const letters = Array.from(section.querySelectorAll('h1 [data-letter]'))

    meta.style.opacity = '0'
    meta.style.transform = 'translateY(10px)'
    cta.style.opacity = '0'
    cta.style.transform = 'translateY(16px)'
    hairline.style.transform = 'scaleX(0)'
    wordSpans.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(36px)'
    })
    letters.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(175%) scaleY(1.4)'
    })

    const reset = (el) => {
      el.style.opacity = ''
      el.style.transform = ''
    }

    const EASE = [0.22, 1, 0.36, 1]
    const run = (target, keyframes, options = {}) =>
      animate(target, keyframes, { ease: EASE, ...options })
    const runs = [
      run(meta, { opacity: 1, translateY: 0 }, { duration: 0.6 }),
      run(wordSpans, { opacity: [0, 1], translateY: [36, 0] }, {
        duration: 0.72,
        delay: (i) => 0.26 + i * 0.04,
      }),
      run(
        letters,
        {
          opacity: [0, 1],
          translateY: ['175%', '0%'],
          scaleY: [1.4, 1],
        },
        { duration: 1, delay: (i) => 0.52 + i * 0.028 },
      ),
      run(hairline, { scaleX: [0, 1] }, { duration: 1.2, delay: 0.98 }),
      run(cta, { opacity: 1, translateY: 0 }, { duration: 0.6, delay: 1.18 }),
    ]

    // The name letters answer hover only after the intro has finished, so
    // the hover transform never fights the entrance.
    const done = setTimeout(() => { introDoneRef.current = true }, 2100)

    return () => {
      clearTimeout(done)
      runs.forEach((animation) => animation.cancel())
      reset(meta)
      reset(cta)
      hairline.style.transform = ''
      wordSpans.forEach(reset)
      letters.forEach(reset)
    }
  }, [reduced])

  // The portrait wipes open from its bottom edge, the same horizon the name
  // rises from. GSAP owns this one timed entrance because clip-path
  // interpolation is CSSPlugin's job; Anime.js keeps the text entrances.
  useLayoutEffect(() => {
    if (reduced) return

    const frame = frameRef.current
    const img = portraitRef.current
    if (!frame || !img) return

    const ctx = gsap.context(() => {
      gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(img, { scale: 1.16 })
      gsap.to(frame, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        delay: 0.4,
        ease: 'power3.out',
      })
      gsap.to(img, { scale: 1, duration: 1.35, delay: 0.4, ease: 'power3.out' })
    })

    return () => ctx.revert()
  }, [reduced])

  useLayoutEffect(() => {
    if (reduced) return
    if (!nameBlockRef.current || !sectionRef.current) return
    return driftHero(nameBlockRef.current, sectionRef.current)
  }, [reduced])

  useLayoutEffect(() => {
    if (reduced) return
    if (!figureRef.current || !sectionRef.current) return
    return driftPortrait(figureRef.current, sectionRef.current)
  }, [reduced])

  // Pointer-reactive parallax: the portrait and the statement answer the
  // cursor in opposite directions, so the first screen has depth without a
  // custom cursor. Mouse only; touch and reduced motion skip it.
  useLayoutEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const section = sectionRef.current
    const portrait = portraitRef.current
    const words = statementWordsRef.current
    if (!section || !portrait || !words) return

    const portraitX = gsap.quickTo(portrait, 'x', { duration: 0.8, ease: 'power2.out' })
    const portraitY = gsap.quickTo(portrait, 'y', { duration: 0.8, ease: 'power2.out' })
    const wordsX = gsap.quickTo(words, 'x', { duration: 1, ease: 'power2.out' })
    const wordsY = gsap.quickTo(words, 'y', { duration: 1, ease: 'power2.out' })

    const onMove = (event) => {
      const rect = section.getBoundingClientRect()
      const nx = (event.clientX - rect.left) / rect.width - 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5
      portraitX(nx * 14)
      portraitY(ny * 10)
      wordsX(nx * -8)
      wordsY(ny * -6)
    }
    const onLeave = () => {
      portraitX(0)
      portraitY(0)
      wordsX(0)
      wordsY(0)
    }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)

    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf([portrait, words])
    }
  }, [reduced])

  // Letter settle: the name letters answer hover only once the intro has
  // finished, so the hover transform never fights the entrance. Each letter
  // lifts a little off its mount, then settles back into place.
  useLayoutEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const letters = Array.from(section.querySelectorAll('h1 [data-letter]'))
    if (!section || !letters.length) return
    // Touch taps fire pointerenter, which would make the name judder on tap.
    if (!window.matchMedia('(pointer: fine)').matches) return

    let pending = false
    const onEnter = () => {
      if (!introDoneRef.current || pending) return
      pending = true
      gsap.to(letters, {
        y: (i) => (i % 2 === 0 ? -8 : 6),
        x: (i) => (i % 3 === 0 ? 4 : -3),
        rotation: (i) => (i % 2 === 0 ? -2.4 : 2.4),
        duration: 0.5,
        ease: 'power3.out',
      })
    }
    const onLeave = () => {
      pending = false
      gsap.to(letters, {
        y: 0,
        x: 0,
        rotation: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.012,
      })
    }

    section.addEventListener('pointerenter', onEnter)
    section.addEventListener('pointerleave', onLeave)

    return () => {
      section.removeEventListener('pointerenter', onEnter)
      section.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(letters)
    }
  }, [reduced])

  // The hero is the opening shot of the page's single take: it settles into
  // frame at load, then drifts up as the next shot arrives.
  useLayoutEffect(() => {
    if (reduced) return
    if (!sectionRef.current) return
    return storyCamera(sectionRef.current)
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="top"
      data-shot
      className="page-x relative flex min-h-[100svh] flex-col justify-between pb-8 pt-24 sm:pb-10 sm:pt-24"
    >
      <div
        ref={metaRef}
        className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
      >
        <p className="meta text-bone-dim">{data.location}</p>
        <p className="meta text-bone-dim sm:text-right">{data.kicker}</p>
      </div>

      <div className="grid gap-8 py-8 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] md:items-stretch md:gap-12 md:py-8">
        <div className="order-2 flex flex-col justify-end gap-8 md:order-1 md:pb-2">
          <div>
            <p className="meta text-marigold">{data.hi}</p>
          <p
              ref={statementWordsRef}
              aria-label={data.statement}
              className="mt-6 max-w-[28ch] text-pretty font-display text-[clamp(1.55rem,1.4vw+0.6rem,2.4rem)] leading-[1.22] text-bone"
            >
              <span aria-hidden="true">
                {data.statement
                  .split(' ')
                  .filter(Boolean)
                  .map((word, index, all) => (
                    <span key={index}>
                      <span data-word className="inline-block">
                        {word}
                      </span>
                      {index < all.length - 1 ? ' ' : null}
                    </span>
                  ))}
              </span>
            </p>
          </div>

          <a
            ref={ctaRef}
            href={data.cta.href}
            className="group relative inline-flex min-h-11 w-fit items-center gap-3 border-b border-line pb-2 text-sm text-bone transition-colors hover:border-marigold hover:text-marigold focus-visible:border-marigold focus-visible:text-marigold"
          >
            {data.cta.label}
            <span
              aria-hidden="true"
              className="u-line absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-marigold transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </a>
        </div>

        <figure
          ref={figureRef}
          className="hero-portrait-figure relative order-first w-full justify-self-center md:order-2 md:w-fit md:justify-self-end md:border-l md:border-line"
        >
          <div
            ref={frameRef}
            className="hero-portrait-frame viewfinder-frame relative overflow-hidden border border-line md:w-fit md:border-r-0 md:border-l-0"
          >
            <img
              ref={portraitRef}
              src={data.portrait}
              alt={data.portraitAlt}
              width={800}
              height={1000}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="hero-portrait photo aspect-[4/5] w-auto object-cover"
            />
          </div>
          <figcaption className="meta mt-4 flex items-center gap-3 text-bone-dim md:justify-end">
            {data.portraitCaption}
          </figcaption>
        </figure>
      </div>

      <div ref={nameBlockRef}>
        <div ref={hairlineRef} className="h-px w-full origin-left bg-line" />
        <div className="overflow-hidden pt-5 sm:pt-7">
          <h1
            aria-label={`${data.name}${data.suffix}`}
            className="pb-[0.22em] text-right font-display text-[clamp(2.6rem,min(13vw,17vh),12rem)] leading-[0.8] tracking-[-0.03em]"
          >
            <span aria-hidden="true">
              {[...data.name, ...data.suffix].map((char, index) => (
                <span
                  key={index}
                  data-letter
                  className={`inline-block ${index >= data.name.length ? 'text-marigold' : ''}`}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>

    </section>
  )
}
