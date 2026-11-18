import { useLayoutEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { useReducedMotion } from '../lib/useReducedMotion'
import { wordReveal } from '../lib/words'
import { driftStatement } from '../lib/scroll'
import { storyCamera } from '../lib/camera'

export default function Statement({ data }) {
  const headingRef = useRef(null)
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => wordReveal(headingRef.current, reduced), [reduced])

  useLayoutEffect(() => {
    if (reduced) return
    if (!sectionRef.current || !headingRef.current) return
    return driftStatement(headingRef.current, sectionRef.current)
  }, [reduced])

  // The statement is its own shot: it pushes in as it reaches the centre of
  // the viewport, then drifts out as the photo band takes over the take.
  useLayoutEffect(() => {
    if (reduced) return
    if (!sectionRef.current) return
    return storyCamera(sectionRef.current)
  }, [reduced])

  const words = [
    { text: data.lead, accent: false, tone: 'bone' },
    { text: data.accent, accent: true, tone: 'bone' },
    { text: data.tail, accent: false, tone: 'dim' },
  ].flatMap((part) =>
    part.text
      .split(' ')
      .filter(Boolean)
      .map((word) => ({ word, accent: part.accent, tone: part.tone })),
  )

  return (
    <section ref={sectionRef} id="statement" data-shot className="page-x py-24 md:py-32 lg:py-40">
      <h2
        ref={headingRef}
        aria-label={`${data.lead} ${data.accent} ${data.tail}`}
        className="text-balance font-display text-[clamp(2.6rem,7.4vw,8rem)] leading-[0.94] tracking-[-0.02em]"
      >
        <span aria-hidden="true">
          {words.map((item, index) => (
            <span key={index}>
              <span
                data-word
                className={`inline-block ${
                  item.accent
                    ? 'italic text-marigold'
                    : item.tone === 'dim'
                      ? 'text-bone-dim'
                      : 'text-bone'
                }`}
              >
                {item.word}
              </span>
              {index < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      </h2>

      <Reveal
        delay={120}
        className="mt-12 grid gap-6 border-t border-line pt-6 md:mt-20 md:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] md:gap-16"
      >
        <p className="meta flex items-baseline gap-3 text-bone-dim">
          <span className="text-marigold">02</span>
          {data.label}
        </p>
        <p className="max-w-xl text-base leading-[1.65] text-bone-dim">{data.body}</p>
      </Reveal>
    </section>
  )
}
