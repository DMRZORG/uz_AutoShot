import { useState } from 'react'
import { cn } from '@/lib/utils'

const COLORS = [
  { id: 0,   label: 'Black',        hex: '#0d1116' },
  { id: 1,   label: 'Graphite',     hex: '#1c2024' },
  { id: 12,  label: 'Black Steel',  hex: '#333333' },
  { id: 131, label: 'Matte Black',  hex: '#151921' },
  { id: 4,   label: 'Silver',       hex: '#99a0a7' },
  { id: 6,   label: 'Stone Silver', hex: '#c8cdcf' },
  { id: 145, label: 'Chrome',       hex: '#dfe0e0' },
  { id: 111, label: 'White',        hex: '#f0f0f0' },
  { id: 27,  label: 'Red',          hex: '#c40018' },
  { id: 28,  label: 'Torino Red',   hex: '#d0021b' },
  { id: 38,  label: 'Orange',       hex: '#c85a2b' },
  { id: 89,  label: 'Race Yellow',  hex: '#f5890f' },
  { id: 88,  label: 'Yellow',       hex: '#dadf46' },
  { id: 49,  label: 'Green',        hex: '#418555' },
  { id: 35,  label: 'Dark Green',   hex: '#132428' },
  { id: 61,  label: 'Galaxy Blue',  hex: '#2d547a' },
  { id: 64,  label: 'Blue',         hex: '#47578f' },
  { id: 120, label: 'Pink',         hex: '#df5fa3' },
]

const SLOTS = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
]

const hexOf = (id) => COLORS.find((c) => c.id === id)?.hex ?? COLORS[0].hex

export function VehicleColors({ onChange }) {
  const [colors, setColors] = useState({ primary: 0, secondary: 0 })
  const [slot, setSlot] = useState('primary')

  const pick = (id) => {
    const next = { ...colors, [slot]: id }
    setColors(next)
    onChange?.(next)
  }

  return (
    <div className="flex flex-col gap-8 rounded-row border border-stroke bg-row p-10">
      <div className="flex gap-4">
        {SLOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSlot(s.id)}
            className={cn(
              'flex h-28 flex-1 items-center gap-8 rounded-row px-8 text-caption font-medium transition-colors duration-150 ease-brand',
              slot === s.id ? 'bg-neutral text-white' : 'text-muted hover:text-secondary',
            )}
          >
            <span className="size-12 rounded-full border border-white/25" style={{ background: hexOf(colors[s.id]) }} />
            {s.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-9 gap-4">
        {COLORS.map((c) => {
          const on = colors[slot] === c.id
          return (
            <button
              key={c.id}
              type="button"
              title={c.label}
              aria-label={c.label}
              aria-pressed={on}
              onClick={() => pick(c.id)}
              className={cn(
                'aspect-square rounded-[0.6rem] border transition-transform duration-150 ease-brand hover:scale-110',
                on ? 'border-white ring-2 ring-accent' : 'border-white/15',
              )}
              style={{ background: c.hex }}
            />
          )
        })}
      </div>
    </div>
  )
}
