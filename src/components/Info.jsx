import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Reveal, RevealGroup } from './Reveal'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useDevelopingPhoto } from '../lib/useDevelopingPhoto'
import { driftInfo } from '../lib/scroll'
import { storyCamera } from '../lib/camera'
import gsap from 'gsap'

// An inline row photo: sits in the tray until the row scrolls into view, then
// develops to full tone. The viewfinder frame lifts on hover.
function InfoPhoto({ src, alt, className }) {
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
        className="photo aspect-[16/10] w-full max-w-sm border border-line object-cover"
      />
    </div>
  )
}

function usePointerFine() {
  const [fine, setFine] = useState(
    () => (typeof window === 'undefined' ? false : window.matchMedia('(pointer: fine)').matches),
  )
  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    const onChange = (event) => setFine(event.matches)
    media.addEventListener('change', onChange)
    setFine(media.matches)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return fine
}

export default function Info({ data }) {
  const sectionRef = useRef(null)
  const rowsRef = useRef(null)
  const rowRefs = useRef([])
  const hoverRef = useRef(null)
  const imageRef = useRef(null)
  const cameraRef = useRef(null)
  const reduced = useReducedMotion()
  const pointerFine = usePointerFine()
  const showHover = pointerFine && !reduced

  // Drift only the rows column, not the section shell, so the raised band's
  // borders stay put and the sticky "01 About" label keeps working.
  useLayoutEffect(() => {
    if (reduced) return
    if (!rowsRef.current || !sectionRef.current) return
    return driftInfo(rowsRef.current, sectionRef.current)
  }, [reduced])

  // The Info band is its own shot of the take: label and rows settle into
  // frame together, so the sticky label never separates from the rows.
  useLayoutEffect(() => {
    if (reduced) return
    if (!cameraRef.current) return
    return storyCamera(cameraRef.current)
  }, [reduced])

  // Each row carries its own photo. On hover-capable pointers the photo
  // follows the cursor; on touch and reduced motion the photo renders inline
  // under the row value so nothing is hidden behind a pointer check.
  useEffect(() => {
    if (!showHover) return
    const hover = hoverRef.current
    const image = imageRef.current
    if (!hover || !image) return

    const clamp = (event) => {
      const rect = image.getBoundingClientRect()
      const gap = 16
      let x = event.clientX + 26
      let y = event.clientY + 14
      x = Math.min(Math.max(x, gap), window.innerWidth - rect.width - gap)
      y = Math.min(Math.max(y, gap), window.innerHeight - rect.height - gap)
      return { x, y }
    }

    const show = (row, event) => {
      const img = row.dataset.infoImage
      if (!img) return
      image.src = img
      image.alt = row.dataset.infoAlt || ''
      const { x, y } = event.clientX ? clamp(event) : positionForRow(row)
      gsap.set(image, { opacity: 0, x, y })
      gsap.to(image, { opacity: 1, x: 0, y: 0, duration: 0.28, ease: 'power3.out' })
    }
    const positionForRow = (row) => {
      const rect = row.getBoundingClientRect()
      const imgRect = image.getBoundingClientRect()
      const gap = 16
      let x = rect.right + gap
      let y = rect.top - (imgRect.height - rect.height) / 2
      x = Math.min(Math.max(x, gap), window.innerWidth - imgRect.width - gap)
      y = Math.min(Math.max(y, gap), window.innerHeight - imgRect.height - gap)
      return { x, y }
    }
    const move = (event) => {
      const { x, y } = clamp(event)
      gsap.to(image, { x, y, duration: 0.5, ease: 'power3.out' })
    }
    const hide = () => {
      gsap.to(image, { opacity: 0, duration: 0.25, ease: 'power3.out' })
    }

    const onEnter = (event) => {
      const row = event.currentTarget
      show(row, event)
    }
    const onMove = (event) => move(event)
    const onLeave = () => hide()
    const onFocus = (event) => {
      const row = event.currentTarget
      show(row, event)
    }
    const onBlur = hide

    const rows = rowRefs.current.filter(Boolean)
    rows.forEach((row) => {
      row.addEventListener('mouseenter', onEnter)
      row.addEventListener('mousemove', onMove)
      row.addEventListener('mouseleave', onLeave)
      row.addEventListener('focus', onFocus)
      row.addEventListener('blur', onBlur)
    })

    return () => {
      rows.forEach((row) => {
        row.removeEventListener('mouseenter', onEnter)
        row.removeEventListener('mousemove', onMove)
        row.removeEventListener('mouseleave', onLeave)
        row.removeEventListener('focus', onFocus)
        row.removeEventListener('blur', onBlur)
      })
      gsap.killTweensOf(image)
    }
  }, [showHover])

  return (
    <section ref={sectionRef} id="info" className="scroll-mt-24 border-y border-line bg-ink-raised">
      <div
        ref={cameraRef}
        data-shot
        className="page-x grid gap-10 py-20 md:py-28 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-16 lg:py-32"
      >
        <Reveal
          as="h2"
          y={10}
          className="meta flex items-baseline gap-3 text-bone-dim lg:sticky lg:top-28 lg:self-start"
        >
          <span className="text-marigold">01</span>
          {data.label}
        </Reveal>

        <div ref={rowsRef}>
          <RevealGroup as="dl" className="border-t border-line" staggerMs={80}>
            {data.rows.map((row, index) => (
              <div
                key={row.label}
                ref={(el) => {
                  rowRefs.current[index] = el
                }}
                data-info-image={row.image}
                data-info-alt={row.imageAlt}
                data-reveal-item
                tabIndex={0}
                className="grid gap-1 border-b border-line py-5 transition-colors hover:bg-ink/50 focus-visible:bg-ink/50 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:py-7"
              >
                <dt className="meta pt-1.5 text-bone-dim">{row.label}</dt>
                <dd className="font-display text-[1.7rem] leading-[1.15] text-bone sm:text-[2.1rem]">
                  {row.value}
                  {!showHover && row.image && (
                    <InfoPhoto src={row.image} alt={row.imageAlt} className="mt-4 w-full" />
                  )}
                </dd>
              </div>
            ))}
          </RevealGroup>
        </div>
      </div>

      {/* Cursor-following photo preview. Touch and reduced motion skip it. */}
      <div ref={hoverRef} className="pointer-events-none fixed inset-0 z-[70]">
        <img
          ref={imageRef}
          alt=""
          className="info-hover-photo photo pointer-events-none absolute h-[14rem] w-[10.5rem] border border-line object-cover"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  )
}