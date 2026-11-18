import { useLayoutEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useDevelopingPhoto } from '../lib/useDevelopingPhoto'
import { driftImage } from '../lib/scroll'

export default function ImageBand({ data }) {
  const bandRef = useRef(null)
  const imgRef = useDevelopingPhoto()
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    if (!bandRef.current || !imgRef.current) return
    return driftImage(imgRef.current, bandRef.current)
  }, [reduced])

  return (
    <figure className="relative">
      <div
        ref={bandRef}
        className="relative h-[clamp(15rem,48vw,38rem)] overflow-hidden"
      >
        <div className="viewfinder-frame absolute inset-0">
          <img
            ref={imgRef}
            src={data.src}
            alt={data.alt}
            width={2000}
            height={900}
            loading="lazy"
            decoding="async"
            className="photo absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Mobile keeps the caption below the photo; sm+ pins the credit plates
          onto the photo's bottom edge instead of adding a row under it. */}
      <Reveal
        as="figcaption"
        className="page-x flex flex-col items-start gap-2 py-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:py-0 sm:pb-5"
      >
        <span className="meta text-bone-dim sm:border sm:border-line sm:bg-ink sm:px-4 sm:py-2 sm:text-bone">
          {data.caption}
        </span>
        <span className="meta text-bone-dim sm:border sm:border-line sm:bg-ink sm:px-4 sm:py-2">
          {data.credit}
        </span>
      </Reveal>
    </figure>
  )
}
