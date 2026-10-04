import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '../../ui/Checkbox'
import { ItemRow } from './ItemRow'

function GroupHeader({ group, open, onToggle, selectable, selected, onSelectAll }) {
  const Icon = group.icon
  const picked = group.items.filter((i) => selected.has(i.key)).length
  return (
    <div
      onClick={onToggle}
      className="flex h-34 cursor-pointer items-center gap-8 rounded-row px-8 transition-colors duration-150 ease-brand hover:bg-row"
    >
      <ChevronRight className={cn('size-14 shrink-0 text-muted transition-transform duration-200 ease-brand', open && 'rotate-90')} />
      {Icon && <Icon className="size-14 shrink-0 text-muted" />}
      <span className="flex-1 truncate text-body-sm font-medium text-text">{group.label}</span>
      <span className="text-help font-medium tabular-nums text-muted">
        {selectable ? `${picked}/${group.items.length}` : group.items.length}
      </span>
      {selectable && (
        <Checkbox
          label={`Select all ${group.label}`}
          checked={picked === group.items.length}
          indeterminate={picked > 0 && picked < group.items.length}
          onChange={(on) => onSelectAll(group.items, on)}
        />
      )}
    </div>
  )
}

export function GroupList({ groups, searching, selectable, selected, onToggle, onSelectMany, activeKey, onActivate, savedCameras, defaultOpen }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen))
  const toggleGroup = (key) => setOpen((prev) => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  if (groups.length === 0) {
    return <p className="px-8 py-24 text-center text-caption font-medium text-placeholder">Nothing matches your search</p>
  }

  const rows = (items, nested) => items.map((item) => (
    <ItemRow
      key={item.key}
      item={item}
      nested={nested}
      active={item.key === activeKey}
      saved={savedCameras.has(item.camera)}
      selectable={selectable}
      checked={selected.has(item.key)}
      onToggle={() => onToggle(item.key)}
      onActivate={() => onActivate(item)}
    />
  ))

  return (
    <div className="flex flex-col gap-2">
      {groups.map((group) => {
        if (group.flat) return <div key={group.key} className="flex flex-col gap-2">{rows(group.items, false)}</div>
        const isOpen = searching || open.has(group.key)
        return (
          <div key={group.key} className="flex flex-col gap-2">
            <GroupHeader
              group={group}
              open={isOpen}
              onToggle={() => toggleGroup(group.key)}
              selectable={selectable}
              selected={selected}
              onSelectAll={onSelectMany}
            />
            {isOpen && (
              <div className="ml-15 flex flex-col gap-2 border-l border-stroke pl-8">
                {rows(group.items, true)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
