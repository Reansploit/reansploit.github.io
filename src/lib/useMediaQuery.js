import { useEffect, useState } from 'react'

// Shared breakpoint probe. Components use it to decide whether a
// wide-screen motion treatment (pin, horizontal track) may run.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches),
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)
    media.addEventListener('change', onChange)
    setMatches(media.matches)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}
