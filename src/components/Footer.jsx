import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Reveal, RevealGroup } from './Reveal'
import { Countdown } from './Countdown'
import { useReducedMotion } from '../lib/useReducedMotion'
import { wordReveal } from '../lib/words'

function LocalTime({ zone, label }) {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: zone,
    })
    const tick = () => setTime(format.format(new Date()))
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [zone])

  return (
    <span>
      {time} {label}
    </span>
  )
}

function Marquee({ name, suffix }) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)

  return (
    <div className="mt-6 border-t border-line">
      {!reduced && (
        <div className="page-x flex justify-end py-3">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="inline-flex min-h-11 items-center border border-line px-3 text-[0.6875rem] uppercase tracking-[0.16em] text-bone-dim transition-colors hover:border-bone hover:text-bone active:bg-ink-raised"
          >
            <span>{paused ? 'Play' : 'Pause'}</span>
            <span className="sr-only"> name motion</span>
          </button>
        </div>
      )}

      <div className="marquee overflow-hidden pb-4" data-paused={paused} aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="whitespace-nowrap pb-[0.22em] pr-10 font-display text-[15vw] leading-[0.8]"
            >
              {name}
              <span className="text-marigold">{suffix}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Footer({ data, identity }) {
  const titleRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => wordReveal(titleRef.current, reduced), [reduced])

  const words = data.title.split(' ').filter(Boolean)

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-line">
      <div className="page-x pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-16">
          <div>
            <Reveal as="h2" y={10} className="meta flex items-baseline gap-3 text-bone-dim">
              <span className="text-marigold">05</span>
              {data.label}
            </Reveal>
            <p
              ref={titleRef}
              aria-label={data.title}
              className="mt-5 max-w-xl text-balance font-display text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.95]"
            >
              <span aria-hidden="true">
                {words.map((word, index) => (
                  <span key={index}>
                    <span data-word className="inline-block">
                      {word}
                    </span>
                    {index < words.length - 1 ? ' ' : null}
                  </span>
                ))}
              </span>
            </p>
          </div>

          <RevealGroup as="dl" className="border-b border-line md:pt-1" staggerMs={80}>
            {data.rows.map((row) => (
              <div
                key={row.label}
                data-reveal-item
                className="grid gap-1 border-t border-line py-4 sm:grid-cols-[7rem_1fr] sm:gap-4"
              >
                <dt className="meta pt-0.5 text-bone-dim">{row.label}</dt>
                <dd className="select-all text-lg text-bone sm:text-xl">
                  {row.href ? (
                    <a
                      href={row.href}
                      className="text-bone hover:text-marigold transition-colors underline decoration-bone-dim hover:decoration-marigold underline-offset-4"
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
            <div
              data-reveal-item
              className="grid gap-1 border-t border-line py-4 sm:grid-cols-[7rem_1fr] sm:gap-4"
            >
              <dt className="meta pt-0.5 text-bone-dim">Local time</dt>
              <dd className="text-lg text-bone sm:text-xl">
                <LocalTime zone={data.clock.zone} label={data.clock.label} />
              </dd>
            </div>
          </RevealGroup>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs leading-relaxed text-bone-dim">
              {data.colophon?.updated ? `Updated ${data.colophon.updated}` : data.note}
            </p>
            <Countdown target={data.countdown?.target} zone={data.clock.zone} label="Until 2028" />
          </div>
          <div className="flex items-center gap-4 sm:justify-end">
            <a
              href="#top"
              className="group relative inline-flex min-h-11 items-center self-start text-sm text-bone transition-colors hover:text-marigold sm:self-auto"
            >
              {data.backToTop}
              <span
                aria-hidden="true"
                className="u-line absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-marigold transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </div>
        </div>
      </div>

      <Marquee name={identity.name} suffix={identity.suffix} />
    </footer>
  )
}
