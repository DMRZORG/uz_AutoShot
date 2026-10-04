import { cn } from '@/lib/utils'

export function IconButton({ label, active, tone = 'accent', className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'flex size-30 shrink-0 items-center justify-center rounded-row text-muted [&>svg]:size-14',
        'transition-colors duration-200 ease-brand hover:bg-row-hover hover:text-white',
        active && tone === 'gold' && 'bg-gold/15 text-gold hover:bg-gold/20 hover:text-gold',
        active && tone === 'accent' && 'bg-accent/15 text-accent hover:bg-accent/20 hover:text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
