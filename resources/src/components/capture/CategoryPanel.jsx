import { useCallback, useMemo, useState } from 'react'
import { Camera, Check, Play, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../../ui/Button'
import { IconButton } from '../../ui/IconButton'
import { SearchField } from '../../ui/SearchField'
import { Tabs } from '../../ui/Tabs'
import { GroupList } from './GroupList'
import { buildTabGroups, filterGroups, groupItems, TABS } from './groups'
import { VehicleColors } from './VehicleColors'

const MODEL_TYPES = { cars: 'vehicle', objects: 'object', weapons: 'weapon' }

export function CategoryPanel({
  mode = 'capture', categories, className,
  onActiveChange, onClose, onStart, onSaveAngle, onColorChange,
}) {
  const browse = mode === 'browse'
  const tabGroups = useMemo(() => buildTabGroups(categories, browse), [categories, browse])
  const tabs = useMemo(() => TABS.filter((t) => groupItems(tabGroups[t.id]).length > 0), [tabGroups])

  const [tabId, setTabId] = useState(() => tabs[0]?.id ?? 'ped')
  const [searches, setSearches] = useState({})
  const [selected, setSelected] = useState(() => new Set())
  const [activeKey, setActiveKey] = useState(() => (browse ? categories[0]?.key : null))
  const [activeItem, setActiveItem] = useState(null)
  const [savedCameras, setSavedCameras] = useState(() => new Set())

  const tab = tabs.find((t) => t.id === tabId) ?? tabs[0]
  const search = searches[tab?.id] ?? ''
  const allItems = groupItems(tabGroups[tab?.id] ?? [])
  const groups = filterGroups(tabGroups[tab?.id] ?? [], search)
  const visible = groupItems(groups)

  const tabsWithCounts = tabs.map((t) => ({
    ...t,
    count: browse ? 0 : groupItems(tabGroups[t.id]).filter((i) => selected.has(i.key)).length,
  }))
  const pickedHere = allItems.filter((i) => selected.has(i.key)).length

  const toggle = useCallback((key) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  }), [])

  const selectMany = useCallback((items, on) => setSelected((prev) => {
    const next = new Set(prev)
    items.forEach((i) => (on ? next.add(i.key) : next.delete(i.key)))
    return next
  }), [])

  const activate = useCallback((item) => {
    setActiveKey(item.key)
    setActiveItem(item)
    onActiveChange?.(item.activate)
  }, [onActiveChange])

  const camera = (allItems.includes(activeItem) ? activeItem.camera : null) ?? tab?.camera
  const saveAngle = () => {
    if (!camera) return
    onSaveAngle?.(camera)
    setSavedCameras((prev) => new Set(prev).add(camera))
  }

  const start = () => {
    const chosen = categories.filter((c) => ['component', 'prop', 'overlay'].includes(c.type) && selected.has(c.key))
    for (const [tid, type] of Object.entries(MODEL_TYPES)) {
      const models = [...new Set(groupItems(tabGroups[tid]).filter((i) => selected.has(i.key)).map((i) => i.key.slice(type.length + 1)))]
      if (models.length) chosen.push({ type, id: '__models__', models })
    }
    onStart?.(chosen)
  }

  return (
    <div className={cn('glass flex animate-enter flex-col overflow-hidden rounded-panel', className)}>
      <div className="flex items-start justify-between gap-12 px-20 pt-18 pb-14">
        <div className="flex flex-col gap-4">
          <h2 className="text-title font-semibold leading-none text-white">{browse ? 'Catalog' : 'Capture'}</h2>
          <p className="text-caption font-medium text-muted">
            {browse ? 'Browse captured thumbnails' : 'Tick what to photograph, then start'}
          </p>
        </div>
        {browse && (
          <IconButton label="Close" onClick={onClose}>
            <X />
          </IconButton>
        )}
      </div>

      <div className="flex flex-col gap-10 px-20 pb-12">
        {tabs.length > 1 && <Tabs tabs={tabsWithCounts} value={tab?.id} onChange={setTabId} />}
        <SearchField
          value={search}
          onChange={(v) => setSearches((prev) => ({ ...prev, [tab.id]: v }))}
          placeholder={`Search ${tab?.label.toLowerCase() ?? ''}`}
        />
        {tab?.id === 'cars' && <VehicleColors onChange={onColorChange} />}
      </div>

      {!browse && (
        <div className="flex h-40 items-center gap-6 border-y border-stroke px-20">
          <span className="flex-1 text-caption font-medium text-muted">
            <span className="tabular-nums text-white">{pickedHere}</span> of {allItems.length} selected
          </span>
          <Button variant="ghost" size="sm" onClick={() => selectMany(visible, true)}>All</Button>
          <Button variant="ghost" size="sm" onClick={() => selectMany(visible, false)} disabled={pickedHere === 0}>None</Button>
          <span className="mx-2 h-16 w-px bg-stroke" />
          <Button
            variant="ghost"
            size="sm"
            disabled={!camera}
            onClick={saveAngle}
            title={camera ? `Save the current view as the ${camera} angle` : 'Select a category first'}
            className={cn(savedCameras.has(camera) && 'text-green hover:text-green')}
          >
            {savedCameras.has(camera) ? <Check /> : <Camera />}
            {savedCameras.has(camera) ? 'Saved' : 'Save angle'}
          </Button>
        </div>
      )}

      <div className={cn('show-scrollbar min-h-0 flex-1 overflow-y-auto px-12 py-10', browse && 'border-t border-stroke')}>
        <GroupList
          key={tab?.id}
          groups={groups}
          searching={search.trim().length > 0}
          selectable={!browse}
          selected={selected}
          onToggle={toggle}
          onSelectMany={selectMany}
          activeKey={activeKey}
          onActivate={activate}
          savedCameras={browse ? new Set() : savedCameras}
          defaultOpen={['components', 'props']}
        />
      </div>

      {!browse && (
        <div className="flex items-center justify-between gap-12 border-t border-stroke px-20 py-14">
          <Button variant="neutral" onClick={onClose}>Cancel</Button>
          <Button onClick={start} disabled={selected.size === 0}>
            <Play />
            {selected.size > 0 ? `Capture ${selected.size}` : 'Capture'}
          </Button>
        </div>
      )}
    </div>
  )
}
