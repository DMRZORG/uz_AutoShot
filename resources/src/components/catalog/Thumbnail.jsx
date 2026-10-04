import { memo, useEffect, useState } from 'react'
import { Check, ImageOff, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THUMB_BASE, itemLabel, thumbPath } from '../../lib/thumbs'

export const Thumbnail = memo(function Thumbnail({ item, ext, selected, marked, onClick }) {
  const [src, setSrc] = useState(null)
  const [failed, setFailed] = useState(false)
  const path = thumbPath(item, ext)
  const label = itemLabel(item)

  useEffect(() => {
    let cancelled = false
    let url = null
    setSrc(null)
    setFailed(false)
    fetch(THUMB_BASE + path)
      .then((r) => { if (!r.ok) throw new Error(); return r.blob() })
      .then((b) => { if (!cancelled) { url = URL.createObjectURL(b); setSrc(url) } })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [path])

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      title={label}
      className={cn(
        'group relative flex size-full flex-col overflow-hidden rounded-row border text-left transition-colors duration-150 ease-brand',
        marked ? 'border-gold/60 bg-gold/10'
          : selected ? 'border-accent/60 bg-accent/12'
          : 'border-stroke bg-row hover:border-white/20 hover:bg-row-hover',
      )}
    >
      <div className="relative min-h-0 flex-1">
        {!src && !failed && <div className="absolute inset-6 animate-loading rounded-[0.6rem] bg-white/5" />}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-placeholder">
            <ImageOff className="size-16" />
            <span className="text-chip font-medium">No shot</span>
          </div>
        )}
        {src && (
          <img
            src={src}
            alt=""
            draggable={false}
            className="absolute inset-0 size-full object-contain p-6 transition-transform duration-200 ease-brand group-hover:scale-105"
          />
        )}
        {item.texture > 0 && (
          <span className="absolute top-4 left-4 rounded-[0.4rem] bg-black/55 px-4 text-chip font-semibold leading-[1.6rem] text-secondary">
            T{item.texture}
          </span>
        )}
        {(selected || marked) && (
          <span className={cn(
            'absolute top-4 right-4 flex size-18 items-center justify-center rounded-full [&>svg]:size-11',
            marked ? 'bg-gold text-[#1a1306]' : 'bg-accent text-white',
          )}>
            {marked ? <RotateCcw strokeWidth={3} /> : <Check strokeWidth={3} />}
          </span>
        )}
      </div>
      <span className={cn(
        'h-20 shrink-0 truncate px-6 text-center text-help font-medium leading-[2rem] tabular-nums',
        selected || marked ? 'text-white' : 'text-muted',
      )}>
        {label}
      </span>
    </button>
  )
})
