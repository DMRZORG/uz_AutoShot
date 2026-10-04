import { useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import { itemKey, sameItem } from '../../lib/thumbs'
import { Thumbnail } from './Thumbnail'

const CARD = 9.6
const GAP = 0.6
const LABEL = 2
const SCROLLBAR = 0.8

function useSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

function Cell({ columnIndex, rowIndex, style, data }) {
  const item = data.items[rowIndex * data.cols + columnIndex]
  if (!item) return null
  return (
    <div style={{ ...style, left: style.left + data.gap, top: style.top + data.gap, width: style.width - data.gap, height: style.height - data.gap }}>
      <Thumbnail
        item={item}
        ext={data.ext}
        selected={!data.marking && sameItem(data.selectedItem, item)}
        marked={data.marking && data.marked.has(itemKey(item))}
        onClick={data.onClick}
      />
    </div>
  )
}

export function ItemGrid({ items, ext, selectedItem, onSelect, marking, marked, onMark }) {
  const ref = useRef(null)
  const { width, height } = useSize(ref)
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10
  const gap = GAP * rem
  const card = CARD * rem
  const cols = Math.max(1, Math.floor((width - gap - SCROLLBAR * rem) / (card + gap)))
  const colWidth = (width - gap - SCROLLBAR * rem) / cols

  const data = useMemo(() => ({
    items, ext, selectedItem, marking, marked, cols, gap,
    onClick: marking ? onMark : onSelect,
  }), [items, ext, selectedItem, marking, marked, cols, gap, onMark, onSelect])

  return (
    <div ref={ref} className="relative min-h-0 flex-1">
      {width > 0 && height > 0 && (
        <Grid
          className="show-scrollbar"
          style={{ overflowX: 'hidden' }}
          columnCount={cols}
          columnWidth={colWidth}
          rowCount={Math.ceil(items.length / cols)}
          rowHeight={colWidth + LABEL * rem}
          width={width}
          height={height}
          overscanRowCount={3}
          itemData={data}
        >
          {Cell}
        </Grid>
      )}
    </div>
  )
}
