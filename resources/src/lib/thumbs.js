export const THUMB_BASE = 'https://cfx-nui-uz_AutoShot/shots/'

export function thumbPath(item, ext) {
  const model = item.model || item.id
  const tex = item.texture > 0 ? `_${item.texture}` : ''
  switch (item.type) {
    case 'vehicle': return `vehicles/${model}.${ext}`
    case 'object':  return `objects/${model}.${ext}`
    case 'weapon':  return `weapons/${model}.${ext}`
    case 'overlay': return `${item.gender}/overlay_${item.id}/${item.drawable}.${ext}`
    case 'prop':    return `${item.gender}/prop_${item.id}/${item.drawable}${tex}.${ext}`
    default:        return `${item.gender}/${item.id}/${item.drawable}${tex}.${ext}`
  }
}

export const itemKey = (item) => `${item.type}-${item.id}-${item.drawable}-${item.texture}`

export const itemLabel = (item) => item.model || `#${item.drawable}`

export function sameItem(a, b) {
  return Boolean(a && b) && a.type === b.type && a.id === b.id && a.drawable === b.drawable && a.texture === b.texture
}
