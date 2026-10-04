import { Play, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'
import { Kbd } from '../ui/Kbd'

export function CaptureWidget({ progress, isPaused, onResume, onCancel }) {
  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="glass fixed top-20 right-20 z-[99999] flex w-360 animate-enter flex-col gap-14 rounded-panel p-20">
      <div className="flex items-center gap-10">
        <span className={cn('size-8 shrink-0 rounded-full', isPaused ? 'bg-gold' : 'animate-pulse-dot bg-accent')} />
        <h2 className="flex-1 text-title font-semibold leading-none text-white">{isPaused ? 'Paused' : 'Capturing'}</h2>
        <span className={cn('text-number font-light leading-none tabular-nums', isPaused ? 'text-muted' : 'text-white')}>
          {pct}%
        </span>
      </div>

      <div className="flex flex-col gap-8">
        <div className="h-6 overflow-hidden rounded-full bg-row">
          <div
            className={cn('h-full rounded-full transition-[width,background-color] duration-300 ease-brand', isPaused ? 'bg-gold' : 'bg-accent')}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-12 text-caption font-medium text-muted">
          <span className="truncate">{progress.category || 'Preparing'}</span>
          {progress.total > 0 && (
            <span className="shrink-0 tabular-nums">
              <span className="text-white">{progress.current}</span> of {progress.total}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-12 border-t border-stroke pt-14">
        {isPaused ? (
          <>
            <Button variant="neutral" size="sm" onClick={onCancel}>
              <X />
              Stop capture
            </Button>
            <Button size="sm" onClick={onResume}>
              <Play />
              Resume
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-16 text-caption font-medium text-muted">
            <span className="flex items-center gap-6"><Kbd>Space</Kbd>Pause</span>
            <span className="flex items-center gap-6"><Kbd>Esc</Kbd>Stop</span>
          </div>
        )}
      </div>
    </div>
  )
}
