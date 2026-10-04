import { useCallback, useEffect, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { CaptureWidget } from './components/CaptureWidget'
import { CategoryPanel } from './components/capture/CategoryPanel'
import { CatalogView } from './components/catalog/CatalogView'
import { ActionBar } from './components/overlays/ActionBar'
import { OrbitHint } from './components/overlays/OrbitHint'
import { useCameraKeys } from './hooks/useCameraKeys'
import { useEscape } from './hooks/useEscape'
import { useOrbit } from './hooks/useOrbit'
import { TYPE_ICON } from './lib/icons'
import { fetchNUI } from './lib/nui'

function itemsFor(cat, gender) {
  if (!cat) return []
  if ((cat.type === 'vehicle' || cat.type === 'weapon') && cat.models) {
    return cat.models.map((model, idx) => ({ type: cat.type, id: model, gender: 'unisex', drawable: idx, texture: 0, label: model, model }))
  }
  if (cat.type === 'object') {
    return [{ type: cat.type, id: cat.id, gender: 'unisex', drawable: 0, texture: 0, label: cat.label, model: cat.id }]
  }
  return Array.from({ length: cat.drawables }, (_, d) => ({ type: cat.type, id: cat.id, gender, drawable: d, texture: 0, label: cat.label }))
}

const withKeys = (categories) => categories.map((cat, idx) => ({ ...cat, key: `${cat.type}-${cat.id}-${idx}` }))

export default function App() {
  const [visible, setVisible] = useState(false)
  const [gender, setGender] = useState('male')
  const [imgExt, setImgExt] = useState('png')
  const [categories, setCategories] = useState([])
  const [activeCatIdx, setActiveCatIdx] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [previewing, setPreviewing] = useState(false)
  const [previewCats, setPreviewCats] = useState([])
  const [capturing, setCapturing] = useState(false)
  const [capturePaused, setCapturePaused] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [progress, setProgress] = useState({ current: 0, total: 0, category: '' })

  const [recapturePreviewing, setRecapturePreviewing] = useState(false)
  const [recaptureQueue, setRecaptureQueue] = useState([])
  const [singleEntity, setSingleEntity] = useState(null)
  const [copied, setCopied] = useState(false)

  const orbit = useOrbit()

  useEffect(() => {
    const handler = ({ data: d }) => {
      switch (d.type) {
        case 'openMenu':
          setGender(d.gender)
          setCategories(withKeys(d.categories || []))
          setActiveCatIdx(0)
          setSelectedItem(null)
          setSearchQuery('')
          if (d.imgExt) setImgExt(d.imgExt)
          setVisible(true)
          break
        case 'capturePreview':
          setPreviewCats(withKeys(d.categories || []))
          setPreviewing(true)
          break
        case 'captureStart':
          setPreviewing(false); setRecapturePreviewing(false); setSingleEntity(null)
          setCapturing(true); setCapturePaused(false)
          setOverlayVisible(true); setProgress({ current: 0, total: 0, category: '' })
          break
        case 'setCapturePaused': setCapturePaused(d.paused); break
        case 'captureProgress': setProgress({ current: d.current || 0, total: d.total || 0, category: d.category || '' }); break
        case 'captureComplete':
        case 'captureCancelled':
          setPreviewing(false); setCapturing(false); setCapturePaused(false); setRecapturePreviewing(false); setSingleEntity(null)
          break
        case 'singleEntityPreview': setSingleEntity({ model: d.model, entityType: d.entityType }); break
        case 'setOverlayVisible': setOverlayVisible(d.visible); break
        case 'forceClose': setVisible(false); setPreviewing(false); setRecapturePreviewing(false); setSingleEntity(null); break
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.accent = gender === 'female' ? 'female' : 'male'
  }, [gender])

  const activeCat = categories[activeCatIdx]
  const items = useMemo(() => itemsFor(activeCat, gender), [activeCat, gender])

  useEffect(() => {
    setSelectedItem(null)
    if (visible && activeCat?.camera) fetchNUI('setCameraPreset', { camera: activeCat.camera, categoryType: activeCat.type, categoryId: activeCat.id })
  }, [activeCat, visible])

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => `#${i.drawable}`.includes(q) || i.label.toLowerCase().includes(q))
  }, [items, searchQuery])

  const handleSelect = useCallback((item) => {
    setSelectedItem(item)
    fetchNUI('applyClothing', { itemType: item.type, id: item.id, drawable: item.drawable, texture: item.texture, model: item.model })
  }, [])

  const handleClose = useCallback(() => { setVisible(false); fetchNUI('closeMenu') }, [])
  const handleResume = useCallback(() => { setCapturePaused(false); fetchNUI('resumeCapture') }, [])
  const handleCancel = useCallback(() => { setCapturing(false); setCapturePaused(false); fetchNUI('cancelCapture') }, [])

  const handleRecapture = useCallback((queue) => {
    setRecaptureQueue(queue)
    setVisible(false)
    setRecapturePreviewing(true)
    fetchNUI('enterRecapturePreview')
  }, [])
  const handleRecaptureConfirm = useCallback(() => {
    setRecapturePreviewing(false)
    fetchNUI('recaptureItems', { items: recaptureQueue })
  }, [recaptureQueue])
  const handleRecaptureCancel = useCallback(() => {
    setRecapturePreviewing(false)
    setRecaptureQueue([])
    fetchNUI('cancelRecapturePreview')
  }, [])

  const handleCancelPreview = useCallback(() => { setPreviewing(false); fetchNUI('cancelPreview') }, [])
  const handlePreviewStart = useCallback((chosen) => {
    const ids = (type) => chosen.filter((c) => c.type === type && !c.models).map((c) => c.id)
    const models = (type) => chosen.find((c) => c.type === type && c.models)?.models || []
    setPreviewing(false)
    fetchNUI('startCapture', {
      selectedComponents: ids('component'), selectedProps: ids('prop'), selectedOverlays: ids('overlay'),
      selectedVehicles: models('vehicle'), selectedObjects: models('object'), selectedWeapons: models('weapon'),
    })
  }, [])
  const handlePreviewActive = useCallback((cat) => {
    if (cat.camera) fetchNUI('setCameraPreset', { camera: cat.camera, categoryType: cat.type, categoryId: cat.id, firstModel: cat.firstModel })
  }, [])

  const handleSingleConfirm = useCallback(() => {
    if (!singleEntity) return
    setSingleEntity(null)
    fetchNUI('confirmSingleCapture', singleEntity)
  }, [singleEntity])
  const handleSingleCancel = useCallback(() => { setSingleEntity(null); fetchNUI('cancelSingleCapture') }, [])

  const onCopied = useCallback(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }, [])

  useCameraKeys(previewing || recapturePreviewing || visible || Boolean(singleEntity), onCopied)
  useEscape(handleClose, visible && !previewing && !recapturePreviewing && !singleEntity && !capturing)
  useEscape(handleCancelPreview, previewing)
  useEscape(handleRecaptureCancel, recapturePreviewing)
  useEscape(handleSingleCancel, Boolean(singleEntity))

  if (singleEntity) {
    const Icon = TYPE_ICON[singleEntity.entityType] ?? TYPE_ICON.object
    return (
      <div className="fixed inset-0 z-[9998] cursor-grab active:cursor-grabbing" {...orbit}>
        <ActionBar
          icon={Icon}
          title={singleEntity.model}
          hint="Frame the shot, then capture"
          confirmLabel="Capture"
          onConfirm={handleSingleConfirm}
          onCancel={handleSingleCancel}
        />
        <OrbitHint copied={copied} />
      </div>
    )
  }

  if (recapturePreviewing) {
    return (
      <div className="fixed inset-0 z-[9998] cursor-grab active:cursor-grabbing" {...orbit}>
        <ActionBar
          icon={RotateCcw}
          tone="gold"
          title={`Re-capture ${recaptureQueue.length} item${recaptureQueue.length === 1 ? '' : 's'}`}
          hint="Adjust the camera, then start"
          confirmLabel="Start"
          onConfirm={handleRecaptureConfirm}
          onCancel={handleRecaptureCancel}
        />
        <OrbitHint copied={copied} />
      </div>
    )
  }

  if (previewing) {
    return (
      <div className="fixed inset-0 z-[9998] cursor-grab active:cursor-grabbing" {...orbit}>
        <div data-no-orbit className="fixed top-1/2 right-20 z-[9999] flex h-[86vh] w-400 -translate-y-1/2 cursor-default">
          <CategoryPanel
            className="w-full"
            categories={previewCats}
            onStart={handlePreviewStart}
            onClose={handleCancelPreview}
            onActiveChange={handlePreviewActive}
            onSaveAngle={(camera) => fetchNUI('saveCameraAngle', { camera })}
            onColorChange={(colors) => fetchNUI('setVehicleColor', colors)}
          />
        </div>
        <OrbitHint copied={copied} />
      </div>
    )
  }

  if (capturing) {
    if (!overlayVisible) return null
    return <CaptureWidget progress={progress} isPaused={capturePaused} onResume={handleResume} onCancel={handleCancel} />
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9998] cursor-grab active:cursor-grabbing" {...orbit}>
      <CatalogView
        categories={categories}
        activeCatIdx={activeCatIdx}
        onCategoryChange={setActiveCatIdx}
        items={filteredItems}
        ext={imgExt}
        selectedItem={selectedItem}
        onSelect={handleSelect}
        search={searchQuery}
        onSearchChange={setSearchQuery}
        onClose={handleClose}
        onRecapture={handleRecapture}
      />
      <OrbitHint copied={copied} />
    </div>
  )
}
