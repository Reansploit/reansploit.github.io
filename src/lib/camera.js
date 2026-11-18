import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// The page reads as one continuous take: every shot settles into frame as it
// reaches the centre of the viewport, then drifts up and out as the next shot
// arrives. Translates only, so section boxes never resize and neighbouring
// text can never collide. Pinned sections (Path, Work) are skipped; ScrollTrigger
// already owns their motion.
export function storyCamera(block) {
  const ctx = gsap.context(() => {
    gsap.fromTo(
      block,
      { y: 30 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: block,
          start: 'top bottom-=50',
          end: 'center center',
          scrub: 1,
        },
      },
    )
    gsap.to(block, {
      y: -24,
      ease: 'none',
      scrollTrigger: {
        trigger: block,
        start: 'center center',
        end: 'bottom top-=50',
        scrub: 1,
      },
    })
  }, block)

  return () => ctx.revert()
}

// One slow pan shared by every shot: all camera blocks sway left and back
// together across the whole page, so the moves read as a single camera rather
// than per-section tricks.
export function storyPan(blocks) {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = gsap.utils.clamp(0, 1, self.progress)
        gsap.set(blocks, { x: Math.sin(progress * Math.PI) * 7 })
      },
    })
  })

  return () => ctx.revert()
}
