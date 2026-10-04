import { cn } from '@/lib/utils'

export function Tabs({ tabs, value, onChange }) {
  return (
    <div role="tablist" className="flex gap-4 rounded-rail border border-stroke bg-row p-3">
      {tabs.map((tab) => {
        const active = tab.id === value
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            title={tab.label}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex h-30 min-w-0 items-center justify-center gap-6 rounded-row px-8 text-caption font-medium',
              'transition-colors duration-200 ease-brand',
              active ? 'flex-[2.4] bg-accent text-white' : 'flex-1 text-muted hover:text-secondary',
            )}
          >
            <Icon className="size-13 shrink-0" />
            {(active || tabs.length <= 3) && <span className="truncate">{tab.label}</span>}
            {tab.count > 0 && (
              <span className={cn(
                'min-w-16 rounded-[0.4rem] px-4 text-chip font-semibold tabular-nums leading-[1.6rem]',
                active ? 'bg-white/20 text-white' : 'bg-chip text-secondary',
              )}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
