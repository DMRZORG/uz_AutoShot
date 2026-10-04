import {
  Box, Car, Crosshair, Ear, Eye, Footprints, Gem, Glasses, HardHat,
  Paintbrush, Shield, Shirt, ShoppingBag, User, Watch,
} from 'lucide-react'

const BY_LABEL = {
  'Mask': HardHat, 'Arms / Gloves': Shirt, 'Pants': Shirt,
  'Bags': ShoppingBag, 'Shoes': Footprints, 'Accessories': Gem,
  'Undershirt': Shirt, 'Body Armor': Shield, 'Decals': Paintbrush,
  'Tops': Shirt, 'Hats': HardHat, 'Glasses': Glasses,
  'Ears': Ear, 'Watches': Watch, 'Bracelets': Gem,
  'Hair': User, 'Facial Hair': User, 'Chest Hair': User, 'Eyebrows': Eye,
}

export const TYPE_ICON = {
  component: Shirt, prop: HardHat, overlay: Paintbrush,
  vehicle: Car, object: Box, weapon: Crosshair,
}

export function iconFor(cat) {
  return BY_LABEL[cat?.label] ?? TYPE_ICON[cat?.type] ?? Shirt
}
