import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '../../ui/Checkbox'

export function ItemRow({ item, nested, active, saved, selectable, checked, onToggle, onActivate }) {
  const Icon = item.icon
  return (
    <div
      onClick={onActivate}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-10 rounded-row border px-8 transition-colors duration-150 ease-brand',
        nested ? 'h-32' : 'h-36',
        active ? 'border-accent/45 bg-accent/15' : 'border-transparent hover:bg-row',
      )}
    >
      {selectable && <Checkbox label={`Select ${item.label}`} checked={checked} onChange={onToggle} />}
      {Icon && !nested && <Icon className={cn('size-14 shrink-0', active ? 'text-accent' : 'text-muted')} />}
      <span className={cn('flex-1 truncate font-medium', nested ? 'text-caption' : 'text-body-sm', active || checked ? 'text-white' : 'text-secondary')}>
        {item.label}
      </span>
      {saved && <Camera aria-label="Camera angle saved" className="size-12 shrink-0 text-green" />}
      {item.meta != null && <span className="shrink-0 text-help font-medium tabular-nums text-muted">{item.meta}</span>}
    </div>
  )
}
