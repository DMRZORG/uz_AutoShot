import { useEffect } from 'react'
import { fetchNUI } from '../lib/nui'

const KEYS = ['w', 's', 'q', 'e', 'r', 'c', 'arrowup', 'arrowdown']

function copyText(text) {
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export function useCameraKeys(active, onCopied) {
  useEffect(() => {
    if (!active) return
    const held = {}
    let frame = 0

    const tick = () => {
      if (held.w || held.arrowup)   fetchNUI('adjustZPos', { delta:  0.005 })
      if (held.s || held.arrowdown) fetchNUI('adjustZPos', { delta: -0.005 })
      if (held.q) fetchNUI('adjustFov', { delta: -0.15 })
      if (held.e) fetchNUI('adjustFov', { delta:  0.15 })
      frame = requestAnimationFrame(tick)
    }

    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const key = e.key.toLowerCase()
      if (!KEYS.includes(key)) return
      e.preventDefault()
      if (held[key]) return
      held[key] = true
      if (key === 'r') fetchNUI('resetCameraPreset')
      if (key === 'c') {
        fetchNUI('getCameraValues').then((v) => {
          if (!v?.preset) return
          copyText(v.luaFormat || `fov: ${v.fov}, dist: ${v.dist}, angleH: ${v.angleH}, camZ: ${v.camZ}, zPos: ${v.zPos}, roll: ${v.roll}`)
          onCopied?.()
        })
      }
    }
    const onKeyUp = (e) => { delete held[e.key.toLowerCase()] }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      cancelAnimationFrame(frame)
    }
  }, [active, onCopied])
}
