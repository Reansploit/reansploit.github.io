// The footer's film leader runs on a loop. On desktop the Pause/Play button
// lives on the marquee itself; on mobile the pill sits above it, so the
// toggle travels here instead. One state, two controls: whichever the
// reader taps last wins, and the marquee always reflects the current state.
const listeners = new Set()
let paused = false

export function isMarqueePaused() {
  return paused
}

export function toggleMarquee() {
  paused = !paused
  listeners.forEach((fn) => fn(paused))
  return paused
}

export function subscribeMarquee(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}