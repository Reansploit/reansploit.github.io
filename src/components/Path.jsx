import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Reveal, RevealGroup } from './Reveal'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useMediaQuery } from '../lib/useMediaQuery'
import { scrubRail, registerPinRange } from '../lib/scroll'
import { FlipCounter } from './FlipDigit'
import { ScrambleText } from './ScrambleText'
import { useDevelopingPhoto } from '../lib/useDevelopingPhoto'

// A photo that sits inline in the rail starts in the tray and develops the
// first time it scrolls into view. The pinned crossfade stack stays fully
// exposed — it is already in frame.
function PathPhoto({ src, alt, className }) {
  const ref = useDevelopingPhoto({ tap: true })
  return (
    <div className={`viewfinder-frame ${className}`}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={800}
        height={500}
        loading="lazy"
        decoding="async"
        className="photo aspect-[16/10] w-full border border-line object-cover"
      />
    </div>
  )
}

export default function Path({ data }) {
  const sectionRef = useRef(null)
  const railRef = useRef(null)
  const lineRef = useRef(null)
  const imageRefs = useRef([])
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const pinned = wide && !reduced
  const nodes = data.nodes
  const hasNodes = nodes.length > 0
  const span = Math.max(1, nodes.length - 1)

  // Phone and reduced-motion: the rail fills as the reader passes and each
  // node pops as the line reaches it. No pinning, photos sit inline.
  useLayoutEffect(() => {
    if (reduced || pinned) return
    if (!railRef.current || !lineRef.current) return
    return scrubRail(lineRef.current, railRef.current)
  }, [reduced, pinned])

  useLayoutEffect(() => {
    if (reduced || pinned) return
    const rail = railRef.current
    if (!rail) return

    const dots = Array.from(rail.querySelectorAll('[data-node]'))
    if (!dots.length) return

    const ctx = gsap.context(() => {
      dots.forEach((dot) => {
        gsap.fromTo(
          dot,
          { opacity: 0.35, scale: 0.4 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: dot.closest('li'),
              start: 'top 62%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    }, rail)

    return () => ctx.revert()
  }, [reduced, pinned])

  // Pinned desktop view: the section pins, the rail draws across every stop
  // while the page keeps scrolling, and the photo crossfades at each stop
  // so the page turns instead of only descending.
  useLayoutEffect(() => {
    if (!pinned || !hasNodes) return
    const section = sectionRef.current
    const line = lineRef.current
    const images = imageRefs.current.filter(Boolean)
    if (!section || !line || !images.length) return

    let st = null
    let unregister = () => {}
    const ctx = gsap.context(() => {
      gsap.set(line, { scaleY: 0 })
      gsap.set(images.slice(1), { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.1 * span,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            st = self
            const next = Math.round(self.progress * span)
            setActive((prev) => (prev === next ? prev : next))
          },
        },
      })
      unregister = registerPinRange(
        'path',
        () => st?.start ?? 0,
        () => st?.end ?? 0
      )

      tl.to(line, { scaleY: 1, ease: 'none' }, 0)

      images.forEach((img, i) => {
        if (i === 0) return
        const at = i / span
        tl.to(img, { opacity: 1, duration: 0.34, ease: 'none' }, at - 0.17)
        if (i < images.length - 1) {
          tl.to(img, { opacity: 0, duration: 0.34, ease: 'none' }, at + 0.17)
        }
      })
    })

    return () => {
      unregister()
      ctx.revert()
    }
  }, [pinned, hasNodes, nodes.length, span])

  // The browser tab names the current stop, but only while the Path section is
  // actually on screen; everywhere else the site title stays put.
  useEffect(() => {
    if (!hasNodes) return
    const section = sectionRef.current
    if (!section) return
    const original = document.title
    const io = new IntersectionObserver(
      ([entry]) => {
        const node = nodes[active]
        document.title = entry.isIntersecting && node ? `${node.title} / Path` : original
      },
      { threshold: 0.5 },
    )
    io.observe(section)
    return () => {
      io.disconnect()
      document.title = original
    }
  }, [hasNodes, nodes, active])

  const dotClass = (isTarget, isActive) =>
    pinned
      ? `absolute -left-8 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-all duration-300 ${
          isActive
            ? isTarget
              ? 'scale-125 border border-marigold bg-marigold'
              : 'scale-125 bg-marigold'
            : isTarget
              ? 'scale-100 border border-dashed border-marigold bg-ink'
              : 'scale-100 bg-marigold/40'
        }`
      : `absolute -left-8 top-2 h-4 w-4 -translate-x-1/2 rounded-full sm:-left-10 ${
          isTarget ? 'border border-dashed border-marigold bg-ink' : 'bg-marigold'
        }`

  return (
    <section
      ref={sectionRef}
      id="path"
      className={`scroll-mt-24 border-t border-line ${
        pinned ? 'py-20 lg:h-[100svh] lg:py-0' : 'py-24 md:py-32 lg:py-40'
      }`}
    >
      <div
        className={`page-x ${
          pinned ? 'flex h-full flex-col justify-center gap-10 lg:gap-14' : ''
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <Reveal as="h2" y={10} className="meta flex items-baseline gap-3 text-bone-dim">
              <span className="text-marigold">03</span>
              {data.label}
            </Reveal>
            <Reveal
              as="p"
              delay={100}
              className="mt-5 max-w-xs text-balance font-display text-[clamp(2rem,2.6vw,2.75rem)] leading-[1.05]"
            >
              {data.title}
            </Reveal>
          </div>
          {pinned && (
            <p className="meta hidden items-baseline gap-3 text-bone-dim sm:flex" aria-live="polite" aria-label={`Stop ${active + 1} of ${nodes.length}`}>
              <FlipCounter current={active + 1} total={nodes.length} className="text-marigold inline-flex" />
            </p>
          )}
        </div>

        <div
          className={`grid gap-10 lg:gap-16 ${
            pinned
              ? 'lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:items-center'
              : 'lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)]'
          }`}
        >
          <div ref={railRef} className="relative pl-8 sm:pl-10">
            <div aria-hidden="true" className="timeline-rail absolute inset-y-0 left-0 w-px">
              <div className="absolute inset-0 bg-line" />
              <div ref={lineRef} className="absolute inset-0 origin-top bg-marigold" />
            </div>

            <RevealGroup
              as="ol"
              className={pinned ? '' : 'space-y-16 sm:space-y-24'}
              staggerMs={120}
            >
              {nodes.map((node, index) => {
                const isTarget = node.status === 'Target'
                const isActive = pinned && index === active
                return (
                  <li
                    key={node.title}
                    data-reveal-item
                    className={`relative ${
                      pinned ? 'border-b border-line py-4 last:border-b-0' : 'pb-8 last:pb-0'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      data-node
                      className={dotClass(isTarget, isActive)}
                    />
                    <div
                      className={
                        pinned
                          ? 'flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2'
                          : 'flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3'
                      }
                    >
                      {isTarget ? (
                        <ScrambleText
                          text={node.status}
                          className="meta border border-dashed border-marigold px-2 py-1 text-marigold"
                        />
                      ) : (
                        <span
                          className={`meta ${
                            pinned && !isActive ? 'text-bone-dim' : 'text-marigold'
                          }`}
                        >
                          {node.status}
                        </span>
                      )}
                      <span
                        className={`font-display transition-colors duration-300 sm:text-2xl ${
                          isActive ? 'text-bone' : 'text-bone-dim'
                        }`}
                      >
                        {node.years}
                      </span>
                    </div>
                    <h3
                      className={`mt-1.5 max-w-xl font-display ${
                        pinned
                          ? 'text-[clamp(1.3rem,1.6vw,1.6rem)] leading-[1.1] tracking-[-0.01em]'
                          : 'text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.0] tracking-[-0.015em]'
                      } ${isActive ? 'path-stop-in text-bone' : pinned ? 'text-bone-dim' : 'text-bone'} transition-colors duration-300`}
                    >
                      {node.title}
                    </h3>
                    {!pinned && node.meta && (
                      <p className="mt-2 text-sm text-bone-dim">{node.meta}</p>
                    )}
                    {!pinned && node.note && (
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone-dim sm:text-base">
                        {node.note}
                      </p>
                    )}
                    {!pinned && node.image && (
                      <PathPhoto
                        src={node.image}
                        alt={node.imageAlt}
                        className="mt-5 w-full"
                      />
                    )}
                  </li>
                )
              })}
            </RevealGroup>
          </div>

          {pinned && (
            <div>
              <div className="relative h-[min(56vh,30rem)] w-full border border-line bg-ink-raised">
                {nodes.map((node, index) => (
                  <img
                    key={node.title}
                    ref={(el) => {
                      imageRefs.current[index] = el
                    }}
                    src={node.image}
                    alt={index === active ? node.imageAlt : ''}
                    aria-hidden={index !== active}
                    width={800}
                    height={1000}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="photo absolute inset-0 h-full w-full object-cover"
                    style={{ opacity: index === 0 ? 1 : 0 }}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                  <span className="meta border border-line bg-ink px-3 py-2 text-bone">
                    {String(active + 1).padStart(2, '0')} /{' '}
                    {String(nodes.length).padStart(2, '0')}
                  </span>
                  <span className="meta border border-line bg-ink px-3 py-2 text-bone-dim">
                    {nodes[active].years}
                  </span>
                </div>
              </div>

              <div key={active} className="path-detail mt-4 max-w-[24rem]">
                <p className="meta text-marigold">{nodes[active].status}</p>
                <p className="mt-2 text-sm leading-relaxed text-bone-dim sm:text-base">
                  {nodes[active].note}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
