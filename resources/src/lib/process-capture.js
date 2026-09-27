// Chroma key, crop/resize and final encode run here in CEF instead of on the
// server: the browser encodes webp natively, so FXServer never has to host a
// wasm codec or chew through multi-megabyte frames on its main thread.

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('could not decode screenshot'))
    img.src = src
  })
}

function removeChromaKey(image, mode) {
  const d = image.data
  const w = image.width, h = image.height
  const isMagenta = mode === 'magenta'

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2]
    let keyness = 0

    if (isMagenta) {
      const rOverG = r - g
      const bOverG = b - g
      const minOver = rOverG < bOverG ? rOverG : bOverG
      const primary = r < b ? r : b
      if (minOver > 0 && primary > 10) {
        const edgeSoft = minOver < 20 ? minOver / 20 : 1
        const primarySoft = primary < 40 ? (primary - 10) / 30 : 1
        keyness = Math.min(1, (rOverG + bOverG) / (r + b + 1)) * edgeSoft * primarySoft
      }
    } else {
      const gOverR = g - r
      const gOverB = g - b
      const minOver = gOverR < gOverB ? gOverR : gOverB
      if (minOver > 0 && g > 10) {
        const edgeSoft = minOver < 20 ? minOver / 20 : 1
        const primarySoft = g < 40 ? (g - 10) / 30 : 1
        keyness = Math.min(1, (gOverR + gOverB) / (g + 1)) * edgeSoft * primarySoft
      }
    }

    if (keyness > 0) {
      d[i + 3] = (255 * (1 - keyness) + 0.5) | 0
      if (isMagenta) {
        d[i] = (r - (r - g) * keyness + 0.5) | 0
        d[i + 2] = (b - (b - g) * keyness + 0.5) | 0
      } else {
        const cap = r > b ? r : b
        d[i + 1] = (g - (g - cap) * keyness + 0.5) | 0
      }
    }
  }

  const RADIUS = 2
  const KERNEL = (RADIUS * 2 + 1) * (RADIUS * 2 + 1)
  const totalPx = w * h
  const src = new Uint8Array(totalPx)

  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < totalPx; i++) src[i] = d[(i << 2) + 3]

    for (let y = RADIUS; y < h - RADIUS; y++) {
      for (let x = RADIUS; x < w - RADIUS; x++) {
        const idx = y * w + x
        const a = src[idx]
        if ((a === 0 || a === 255) &&
          src[idx - 1] === a && src[idx + 1] === a &&
          src[idx - w] === a && src[idx + w] === a) continue

        let sum = 0
        for (let ky = -RADIUS; ky <= RADIUS; ky++) {
          const rowOff = (y + ky) * w + x
          for (let kx = -RADIUS; kx <= RADIUS; kx++) sum += src[rowOff + kx]
        }
        d[(idx << 2) + 3] = (sum / KERNEL + 0.5) | 0
      }
    }
  }
}

function resize(image, targetW, targetH) {
  if (image.width === targetW && image.height === targetH) return image

  const srcAspect = image.width / image.height
  const dstAspect = targetW / targetH

  let cropX = 0, cropY = 0, cropW = image.width, cropH = image.height
  if (srcAspect > dstAspect) {
    cropW = Math.round(image.height * dstAspect)
    cropX = Math.round((image.width - cropW) / 2)
  } else if (srcAspect < dstAspect) {
    cropH = Math.round(image.width / dstAspect)
    cropY = Math.round((image.height - cropH) / 2)
  }

  const dst = new ImageData(targetW, targetH)
  const sd = image.data, dd = dst.data
  const sw = image.width
  const xRatio = cropW / targetW
  const yRatio = cropH / targetH
  const isDownscale = cropW > targetW || cropH > targetH

  if (isDownscale) {
    for (let y = 0; y < targetH; y++) {
      const sy0 = cropY + y * yRatio
      const sy1 = cropY + (y + 1) * yRatio
      const iy0 = sy0 | 0
      const iy1 = Math.min((sy1 | 0) + 1, cropY + cropH)

      for (let x = 0; x < targetW; x++) {
        const sx0 = cropX + x * xRatio
        const sx1 = cropX + (x + 1) * xRatio
        const ix0 = sx0 | 0
        const ix1 = Math.min((sx1 | 0) + 1, cropX + cropW)

        let r = 0, g = 0, b = 0, a = 0, totalW = 0

        for (let sy = iy0; sy < iy1; sy++) {
          const wy = sy < sy0 ? 1 - (sy0 - sy) : sy + 1 > sy1 ? sy1 - sy : 1
          const rowOff = sy * sw

          for (let sx = ix0; sx < ix1; sx++) {
            const wx = sx < sx0 ? 1 - (sx0 - sx) : sx + 1 > sx1 ? sx1 - sx : 1
            const wt = wx * wy
            const si = (rowOff + sx) << 2
            r += sd[si] * wt
            g += sd[si + 1] * wt
            b += sd[si + 2] * wt
            a += sd[si + 3] * wt
            totalW += wt
          }
        }

        const di = (y * targetW + x) << 2
        const inv = 1 / totalW
        dd[di] = (r * inv + 0.5) | 0
        dd[di + 1] = (g * inv + 0.5) | 0
        dd[di + 2] = (b * inv + 0.5) | 0
        dd[di + 3] = (a * inv + 0.5) | 0
      }
    }
  } else {
    const maxCropX = cropX + cropW - 1
    const maxCropY = cropY + cropH - 1

    for (let y = 0; y < targetH; y++) {
      const srcY = cropY + y * yRatio
      const y0 = srcY | 0
      const y1 = y0 < maxCropY ? y0 + 1 : maxCropY
      const yf = srcY - y0
      const yf1 = 1 - yf
      const rowA = y0 * sw
      const rowB = y1 * sw

      for (let x = 0; x < targetW; x++) {
        const srcX = cropX + x * xRatio
        const x0 = srcX | 0
        const x1 = x0 < maxCropX ? x0 + 1 : maxCropX
        const xf = srcX - x0
        const xf1 = 1 - xf

        const i00 = (rowA + x0) << 2
        const i10 = (rowA + x1) << 2
        const i01 = (rowB + x0) << 2
        const i11 = (rowB + x1) << 2
        const di = (y * targetW + x) << 2

        const w00 = xf1 * yf1, w10 = xf * yf1, w01 = xf1 * yf, w11 = xf * yf
        for (let c = 0; c < 4; c++) {
          dd[di + c] = (sd[i00 + c] * w00 + sd[i10 + c] * w10 + sd[i01 + c] * w01 + sd[i11 + c] * w11 + 0.5) | 0
        }
      }
    }
  }

  if (isDownscale) {
    const STRENGTH = 0.3
    const src = new Uint8ClampedArray(dd)
    for (let y = 1; y < targetH - 1; y++) {
      for (let x = 1; x < targetW - 1; x++) {
        const ci = (y * targetW + x) << 2
        if (src[ci + 3] === 0) continue
        const t = ci - (targetW << 2)
        const b = ci + (targetW << 2)
        for (let c = 0; c < 3; c++) {
          const sharp = 5 * src[ci + c] - src[t + c] - src[b + c] - src[ci - 4 + c] - src[ci + 4 + c]
          dd[ci + c] = src[ci + c] + (sharp - src[ci + c]) * STRENGTH
        }
      }
    }
  }

  return dst
}

export async function processCapture({ image, format, quality, transparent, chromaKey, width, height }) {
  const img = await loadImage(image)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)

  let frame = ctx.getImageData(0, 0, canvas.width, canvas.height)

  if (transparent) removeChromaKey(frame, chromaKey)

  if (width > 0 && height > 0) {
    const clamp = (v) => Math.min(Math.max(v, 16), 4096)
    frame = resize(frame, clamp(width), clamp(height))
  }

  canvas.width = frame.width
  canvas.height = frame.height
  ctx.putImageData(frame, 0, 0)

  // jpg drops alpha, so a keyed frame falls back to png (same rule as the server)
  const mime = format === 'webp' ? 'image/webp'
    : format === 'jpg' && !transparent ? 'image/jpeg'
      : 'image/png'

  return canvas.toDataURL(mime, quality)
}

window.addEventListener('message', async (event) => {
  const d = event.data
  if (!d || d.type !== 'processCapture') return

  let result = null
  try {
    result = await processCapture(d)
  } catch (err) {
    console.error('[uz_AutoShot] capture processing failed:', err)
  }

  fetch('https://uz_AutoShot/captureProcessed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: d.id, image: result }),
  }).catch(() => {})
})
