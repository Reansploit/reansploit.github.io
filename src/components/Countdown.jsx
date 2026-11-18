import { useEffect, useState } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'

// Live countdown to 2028, Asia/Jakarta time, reinforcing the footer's
// "Say hello before 2028." Ticks in real time. Values come from the real
// clock, so nothing is fabricated — it is a live date difference.
function jakartaParts(date, zone) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, Number(p.value)]),
  )
  return parts
}

function diffToTarget(targetDate, now, zone) {
  const t = jakartaParts(targetDate, zone)
  const n = jakartaParts(now, zone)

  let years = t.year - n.year
  let months = t.month - n.month
  let days = t.day - n.day
  let hours = t.hour - n.hour
  let minutes = t.minute - n.minute
  let seconds = t.second - n.second

  if (seconds < 0) { seconds += 60; minutes -= 1 }
  if (minutes < 0) { minutes += 60; hours -= 1 }
  if (hours < 0) { hours += 24; days -= 1 }
  if (days < 0) {
    // Borrow one month: the days we add are the length of the month just
    // before the target's month, since that is the month the borrow comes
    // from. Using "now"'s month length is off by a day whenever the two
    // months differ.
    days += new Date(t.year, t.month - 1, 0).getDate()
    months -= 1
  }
  if (months < 0) { months += 12; years -= 1 }

  return { years, months, days, hours, minutes, seconds }
}

export function Countdown({ target, zone, label }) {
  if (!target) return null
  const reduced = useReducedMotion()
  const [remaining, setRemaining] = useState(() => diffToTarget(new Date(target), new Date(), zone))

  useEffect(() => {
    if (reduced) return
    const tick = () => {
      const now = new Date()
      let diff = target ? new Date(target) - now : 0
      if (diff <= 0) {
        setRemaining({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setRemaining(diffToTarget(new Date(target), now, zone))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target, zone])

  if (!remaining) return null

  const fields = [
    { value: remaining.years, unit: 'y' },
    { value: remaining.months, unit: 'mo' },
    { value: remaining.days, unit: 'd' },
    { value: remaining.hours, unit: 'h' },
    { value: remaining.minutes, unit: 'm' },
    { value: remaining.seconds, unit: 's' },
  ]

  return (
    <p className="meta mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-bone-dim tabular-nums">
      <span className="text-marigold">{label}</span>
      {fields.map((f, i) => (
        <span key={f.unit} className="flex items-baseline gap-1">
          <span className="text-bone">{String(f.value).padStart(2, '0')}</span>
          <span className="text-bone-dim">{f.unit}</span>
        </span>
      ))}
    </p>
  )
}