import { useCallback, useRef } from 'react'
import { fetchNUI } from '../lib/nui'

export function useOrbit() {
  const mode = useRef(null)
  const last = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    if (e.target.closest('[data-no-orbit]')) return
    mode.current = e.button === 2 ? 'roll' : 'rotate'
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!mode.current) return
    const deltaX = e.clientX - last.current.x
    const deltaY = e.clientY - last.current.y
    if (mode.current === 'rotate') fetchNUI('rotateCamera', { deltaX, deltaY })
    else fetchNUI('rollCamera', { deltaX })
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const stop = useCallback(() => { mode.current = null }, [])

  const onWheel = useCallback((e) => {
    if (e.target.closest('[data-no-orbit]')) return
    fetchNUI('zoomCamera', { delta: e.deltaY > 0 ? 1 : -1 })
  }, [])

  return {
    onMouseDown, onMouseMove, onWheel,
    onMouseUp: stop, onMouseLeave: stop,
    onContextMenu: (e) => e.preventDefault(),
  }
}
