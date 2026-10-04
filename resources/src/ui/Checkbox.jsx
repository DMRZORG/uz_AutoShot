import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Checkbox({ checked, indeterminate, onChange, label }) {
  const on = checked || indeterminate
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      className={cn(
        'flex size-18 shrink-0 items-center justify-center rounded-[0.5rem] border transition-colors duration-150 ease-brand [&>svg]:size-12',
        on ? 'border-accent bg-accent text-white' : 'border-white/20 bg-row hover:border-white/35',
      )}
    >
      {checked ? <Check strokeWidth={3} /> : indeterminate ? <Minus strokeWidth={3} /> : null}
    </button>
  )
}
