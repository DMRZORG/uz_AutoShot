import { Play, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../../ui/Button'
import { IconButton } from '../../ui/IconButton'

export function ActionBar({ icon: Icon, tone = 'accent', title, hint, confirmLabel, onConfirm, onCancel }) {
  return (
    <div data-no-orbit className="fixed bottom-80 left-1/2 cursor-default z-[9999] -translate-x-1/2 animate-enter">
      <div className="glass flex items-center gap-14 rounded-panel py-10 pr-10 pl-16">
        <span className={cn(
          'flex size-32 shrink-0 items-center justify-center rounded-rail [&>svg]:size-15',
          tone === 'gold' ? 'bg-gold/15 text-gold' : 'bg-accent/15 text-accent',
        )}>
          <Icon />
        </span>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm font-semibold text-white">{title}</span>
          <span className="text-help font-medium text-muted">{hint}</span>
        </div>
        <Button variant={tone} size="sm" className="ml-10" onClick={onConfirm}>
          <Play />
          {confirmLabel}
        </Button>
        <IconButton label="Cancel" onClick={onCancel}>
          <X />
        </IconButton>
      </div>
    </div>
  )
}
