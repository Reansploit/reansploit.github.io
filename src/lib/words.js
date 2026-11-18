import { animate, stagger } from 'motion'

// Word-by-word reveal for display headings: hides [data-word] spans, then
// animates them in written order when the heading reaches the viewport.
export function wordReveal(heading, reduced, delay = 0) {
  if (!heading || reduced) return () => {}

  const spans = Array.from(heading.querySelectorAll('[data-word]'))
  if (!spans.length) return () => {}

  spans.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(26px)'
  })

  const reset = () => {
    spans.forEach((el) => {
      el.style.opacity = ''
      el.style.transform = ''
    })
  }

  let animation
  const play = () => {
    animation = animate(spans, {
      opacity: [0, 1],
      translateY: [26, 0],
      duration: 0.65,
      delay: stagger(0.07),
      ease: [0.22, 1, 0.36, 1],
      onComplete: reset,
    })
  }

  if (heading.getBoundingClientRect().top < window.innerHeight) {
    play()
    return () => {
      animation?.cancel()
      reset()
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      io.disconnect()
      play()
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  )
  io.observe(heading)

  return () => {
    io.disconnect()
    animation?.cancel()
    reset()
  }
}