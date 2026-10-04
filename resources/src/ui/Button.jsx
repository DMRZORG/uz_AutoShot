import { cn } from '@/lib/utils'

const variants = {
  accent:  'bg-accent text-white',
  neutral: 'bg-neutral text-white',
  gold:    'bg-gold text-[#1a1306]',
  green:   'bg-green text-[#04170c]',
  ghost:   'text-muted hover:bg-row-hover hover:text-white',
}

const sizes = {
  sm: 'h-30 px-12 text-caption gap-6 [&>svg]:size-13',
  md: 'h-36 px-16 text-body-sm gap-8 [&>svg]:size-14',
}

export function Button({ variant = 'accent', size = 'md', className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-rail font-medium whitespace-nowrap',
        'transition-[opacity,transform,background-color,color] duration-200 ease-brand',
        'enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40',
        variant !== 'ghost' && 'enabled:hover:opacity-90',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
