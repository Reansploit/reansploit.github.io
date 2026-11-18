import { useEffect } from 'react'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import Info from './components/Info'
import Statement from './components/Statement'
import ImageBand from './components/ImageBand'
import Path from './components/Path'
import WorkIndex from './components/WorkIndex'
import Footer from './components/Footer'
import { site } from './data/site'
import { refreshOnFonts, createLenis } from './lib/scroll'
import { useReducedMotion } from './lib/useReducedMotion'

export default function App() {
  const reduced = useReducedMotion()

  useEffect(() => {
    refreshOnFonts()
  }, [])

  // Butter-smooth, momentum-based scroll. Disabled when the user asks for
  // reduced motion, so Lenis never overrides their accessibility choice.
  useEffect(() => {
    if (reduced) return
    const { lenis, destroy } = createLenis()

    // Route in-page anchors through Lenis so they glide instead of jumping.
    const onAnchorClick = (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a[href^="#"]')
      if (!link) return
      // The skip link must move focus, not glide, so leave it to the browser.
      if (link.classList.contains('skip-link')) return
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return
      const section = document.querySelector(hash)
      if (!section) return
      event.preventDefault()
      // Landing on a section must also move keyboard focus there, otherwise
      // the next Tab resumes from the header and keyboard readers lose track
      // of where they are on the page.
      section.setAttribute('tabindex', '-1')
      lenis.scrollTo(section, { offset: -72, onComplete: () => section.focus({ preventScroll: true }) })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      destroy()
    }
  }, [reduced])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Nav items={site.nav} name={site.hero.name} suffix={site.hero.suffix} />
      <ScrollProgress />

      <main id="main" tabIndex={-1}>
        <Hero data={site.hero} />
        <Info data={site.info} />
        <Statement data={site.statement} />
        <ImageBand data={site.band} />
        <Path data={site.path} />
        <WorkIndex data={site.work} />
      </main>

      <Footer data={site.footer} identity={site.hero} />
    </>
  )
}
