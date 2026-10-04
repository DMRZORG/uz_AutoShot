import { Box, Car, Crosshair, Gem, Paintbrush, Shirt, User } from 'lucide-react'
import { iconFor } from '../../lib/icons'

export const TABS = [
  { id: 'ped',        label: 'Ped',        icon: User,       camera: null },
  { id: 'appearance', label: 'Appearance', icon: Paintbrush, camera: null },
  { id: 'cars',       label: 'Vehicles',   icon: Car,        camera: 'vehicle' },
  { id: 'objects',    label: 'Objects',    icon: Box,        camera: 'object' },
  { id: 'weapons',    label: 'Weapons',    icon: Crosshair,  camera: 'weapon' },
]

const catItem = (cat, meta) => ({
  key: cat.key, label: cat.label, icon: iconFor(cat), meta, camera: cat.camera, activate: cat,
})

function modelGroups(classes, type, icon, browse) {
  if (browse) {
    return [{ key: type, flat: true, items: classes.map((c) => ({ ...catItem(c, c.models.length), icon })) }]
  }
  return classes.map((c) => ({
    key: c.key, label: c.label, icon,
    items: c.models.map((model) => ({
      key: `${type}:${model}`, label: model,
      activate: { type, id: c.label, camera: type, firstModel: model },
    })),
  }))
}

export function buildTabGroups(categories, browse) {
  const of = (...types) => categories.filter((c) => types.includes(c.type))
  const withModels = (type) => categories.filter((c) => c.type === type && c.models)
  const count = (c) => (browse && c.drawables != null ? c.drawables : null)

  return {
    ped: [
      { key: 'components', label: 'Clothing', icon: Shirt, items: of('component').map((c) => catItem(c, count(c))) },
      { key: 'props', label: 'Accessories', icon: Gem, items: of('prop').map((c) => catItem(c, count(c))) },
    ],
    appearance: [{ key: 'overlays', flat: true, items: of('overlay').map((c) => catItem(c, count(c))) }],
    cars: modelGroups(withModels('vehicle'), 'vehicle', Car, browse),
    objects: [{
      key: 'objects', flat: true,
      items: of('object').map((c) => ({
        key: browse ? c.key : `object:${c.id}`,
        label: c.label,
        icon: Box,
        meta: c.label !== c.id ? c.id : null,
        activate: browse ? c : { type: 'object', id: c.id, camera: 'object' },
      })),
    }],
    weapons: modelGroups(withModels('weapon'), 'weapon', Crosshair, browse),
  }
}

export function filterGroups(groups, query) {
  const q = query.trim().toLowerCase()
  return groups
    .map((g) => (q ? { ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) } : g))
    .filter((g) => g.items.length > 0)
}

export const groupItems = (groups) => groups.flatMap((g) => g.items)
