const ped = [
  ['component', 1, 'Mask', 'head', 120], ['component', 11, 'Tops', 'torso', 420], ['component', 4, 'Pants', 'legs', 180],
  ['component', 6, 'Shoes', 'feet', 110], ['component', 5, 'Bags', 'torso', 90], ['component', 9, 'Body Armor', 'torso', 40],
  ['prop', 0, 'Hats', 'head', 160], ['prop', 1, 'Glasses', 'head', 45], ['prop', 6, 'Watches', 'hands', 30],
].map(([type, id, label, camera, drawables]) => ({ type, id, label, camera, drawables }))

const categories = [
  ...ped,
  ...['Blemishes', 'Facial Hair', 'Eyebrows', 'Makeup'].map((label, id) => ({ type: 'overlay', id, label, camera: 'head', drawables: 20 })),
  { type: 'vehicle', id: 'Sports', label: 'Sports', camera: 'vehicle', drawables: 4, models: ['comet2', 'elegy', 'jester', 'sultan'] },
  { type: 'vehicle', id: 'Super', label: 'Super', camera: 'vehicle', drawables: 3, models: ['adder', 'zentorno', 't20'] },
  { type: 'object', id: 'prop_box_wood02a', label: 'Wooden box', camera: 'object' },
  { type: 'weapon', id: 'Pistols', label: 'Pistols', camera: 'weapon', drawables: 2, models: ['weapon_pistol', 'weapon_combatpistol'] },
]

const messages = {
  catalog: [{ type: 'openMenu', gender: 'male', imgExt: 'png', categories }],
  female: [{ type: 'openMenu', gender: 'female', imgExt: 'png', categories }],
  capture: [{ type: 'capturePreview', categories }],
  progress: [{ type: 'captureStart' }, { type: 'captureProgress', current: 132, total: 420, category: 'Tops' }],
  paused: [{ type: 'captureStart' }, { type: 'captureProgress', current: 132, total: 420, category: 'Tops' }, { type: 'setCapturePaused', paused: true }],
  single: [{ type: 'singleEntityPreview', model: 'adder', entityType: 'vehicle' }],
}

const view = new URLSearchParams(location.search).get('view') ?? 'catalog'
document.body.style.background = '#3a4048'
setTimeout(() => (messages[view] ?? messages.catalog).forEach((data) => window.postMessage(data, '*')), 400)
