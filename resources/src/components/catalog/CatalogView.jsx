import { CategoryPanel } from '../capture/CategoryPanel'
import { ItemPanel } from './ItemPanel'

export function CatalogView({ categories, activeCatIdx, onCategoryChange, items, ext, selectedItem, onSelect, search, onSearchChange, onClose, onRecapture }) {
  return (
    <>
      <div data-no-orbit className="fixed top-20 bottom-180 left-20 z-[9999] flex w-320 cursor-default">
        <CategoryPanel
          mode="browse"
          className="w-full"
          categories={categories}
          onClose={onClose}
          onActiveChange={(cat) => {
            const idx = categories.findIndex((c) => c.type === cat.type && c.id === cat.id)
            if (idx >= 0) onCategoryChange(idx)
          }}
        />
      </div>
      <div data-no-orbit className="fixed top-20 right-20 bottom-20 z-[9999] flex w-440 cursor-default flex-col">
        <ItemPanel
          category={categories[activeCatIdx]}
          items={items}
          ext={ext}
          selectedItem={selectedItem}
          onSelect={onSelect}
          search={search}
          onSearchChange={onSearchChange}
          onRecapture={onRecapture}
        />
      </div>
    </>
  )
}
