import { useEffect } from 'react'

export function useEscape(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler, enabled])
}
