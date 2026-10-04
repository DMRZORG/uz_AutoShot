import { useCallback, useState } from 'react'
import { ImageOff, RotateCcw, X } from 'lucide-react'
import { iconFor } from '../../lib/icons'
import { itemKey, itemLabel } from '../../lib/thumbs'
import { Button } from '../../ui/Button'
import { IconButton } from '../../ui/IconButton'
import { SearchField } from '../../ui/SearchField'
import { ItemGrid } from './ItemGrid'

const SUBTITLE = {
  component: (c) => `Clothing · component ${c.id}`,
  prop: (c) => `Accessory · prop ${c.id}`,
  overlay: (c) => `Appearance · overlay ${c.id}`,
}

function EmptyState({ searching, onClear }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-24 text-center">
      <ImageOff className="size-24 text-placeholder" />
      <p className="text-body-sm font-medium text-secondary">{searching ? 'No items match that search' : 'This category is empty'}</p>
      {searching && <Button variant="neutral" size="sm" onClick={onClear}>Clear search</Button>}
    </div>
  )
}

export function ItemPanel({ category, items, ext, selectedItem, onSelect, search, onSearchChange, onRecapture }) {
  const [marking, setMarking] = useState(false)
  const [marked, setMarked] = useState(() => new Map())
  const Icon = iconFor(category)

  const toggleMarking = useCallback(() => {
    setMarking((m) => !m)
    setMarked(new Map())
  }, [])

  const mark = useCallback((item) => setMarked((prev) => {
    const next = new Map(prev)
    const key = itemKey(item)
    next.has(key) ? next.delete(key) : next.set(key, { type: item.type, id: item.id, drawable: item.drawable, texture: item.texture })
    return next
  }), [])

  const recapture = () => {
    onRecapture([...marked.values()])
    setMarking(false)
    setMarked(new Map())
  }

  return (
    <div className="glass flex min-h-0 flex-1 animate-enter flex-col overflow-hidden rounded-panel">
      <div className="flex items-center gap-12 px-20 pt-18 pb-14">
        <span className="flex size-36 shrink-0 items-center justify-center rounded-rail bg-accent/15 text-accent [&>svg]:size-16">
          <Icon />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h2 className="truncate text-title font-semibold leading-none text-white">{category?.label ?? 'Nothing selected'}</h2>
          <p className="truncate text-caption font-medium text-muted">
            {category ? (SUBTITLE[category.type]?.(category) ?? category.id) : 'Pick a category on the left'}
          </p>
        </div>
        <IconButton label={marking ? 'Stop re-capture selection' : 'Select items to re-capture'} active={marking} tone="gold" onClick={toggleMarking}>
          <RotateCcw />
        </IconButton>
      </div>

      <div className="px-20 pb-12">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name or #number"
          trailing={<span className="text-help font-medium tabular-nums text-placeholder">{items.length}</span>}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-stroke px-14 pb-8">
        {items.length > 0
          ? <ItemGrid items={items} ext={ext} selectedItem={selectedItem} onSelect={onSelect} marking={marking} marked={marked} onMark={mark} />
          : <EmptyState searching={search.trim().length > 0} onClear={() => onSearchChange('')} />}
      </div>

      <div className="flex h-52 shrink-0 items-center gap-10 border-t border-stroke px-20">
        {marking ? (
          <>
            <RotateCcw className="size-14 shrink-0 text-gold" />
            <span className="flex-1 truncate text-caption font-medium text-secondary">
              {marked.size > 0 ? <><span className="tabular-nums text-gold">{marked.size}</span> marked for re-capture</> : 'Click thumbnails to mark them'}
            </span>
            <Button variant="gold" size="sm" disabled={marked.size === 0} onClick={recapture}>Re-capture</Button>
            <IconButton label="Cancel re-capture" onClick={toggleMarking}><X /></IconButton>
          </>
        ) : selectedItem ? (
          <>
            <span className="size-8 shrink-0 rounded-full bg-green" />
            <span className="flex-1 truncate text-caption font-medium text-secondary">Previewing {selectedItem.model || selectedItem.label}</span>
            <span className="rounded-[0.5rem] bg-chip px-8 text-help font-semibold leading-[2.2rem] tabular-nums text-white">{itemLabel(selectedItem)}</span>
          </>
        ) : (
          <span className="text-caption font-medium text-placeholder">Click a thumbnail to preview it</span>
        )}
      </div>
    </div>
  )
}
