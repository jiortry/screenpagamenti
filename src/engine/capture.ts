import { chance, randFloat, type Rng } from './random.ts'

export type CaptureStyle = {
  grain: number
  rotation: number
  vignette: number
  bezel: boolean
  oledCrush: boolean
  fontScaleBoost: number
}

export function sampleCaptureStyle(
  rng: Rng,
  appearance: 'light' | 'dark' | { appearance: 'light' | 'dark' },
): CaptureStyle {
  const dark = (typeof appearance === 'string' ? appearance : appearance.appearance) === 'dark'
  return {
    grain: Math.round(randFloat(rng, 0.06, 0.18) * 1000) / 1000,
    rotation: Math.round(randFloat(rng, -0.9, 0.9) * 100) / 100,
    vignette: Math.round(randFloat(rng, 0.0, 0.14) * 1000) / 1000,
    bezel: chance(rng, 0.42),
    oledCrush: dark && chance(rng, 0.58),
    fontScaleBoost: Math.round(randFloat(rng, 0.92, 1.18) * 100) / 100,
  }
}

export async function applyPhotoArtifacts(
  dataUrl: string,
  style?: CaptureStyle | null,
  seed = 0,
): Promise<string> {
  if (!style) return dataUrl
  const img = new Image()
  img.src = dataUrl
  await img.decode()

  const pad = style.bezel ? 28 : 0
  const canvas = document.createElement('canvas')
  canvas.width = img.width + pad * 2
  canvas.height = img.height + pad * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return dataUrl

  if (style.bezel) {
    ctx.fillStyle = '#141416'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const r = 38
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(pad - 2, pad - 2, img.width + 4, img.height + 4, r)
    ctx.fillStyle = '#0a0a0c'
    ctx.fill()
    ctx.restore()
  } else {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((style.rotation * Math.PI) / 180)
  ctx.translate(-canvas.width / 2, -canvas.height / 2)
  ctx.drawImage(img, pad, pad)
  ctx.restore()

  if (style.oledCrush) {
    const crush = ctx.getImageData(pad, pad, img.width, img.height)
    for (let i = 0; i < crush.data.length; i += 4) {
      const r = crush.data[i]!
      const g = crush.data[i + 1]!
      const b = crush.data[i + 2]!
      if (r < 24 && g < 24 && b < 24) {
        crush.data[i] = 0
        crush.data[i + 1] = 0
        crush.data[i + 2] = 0
      }
    }
    ctx.putImageData(crush, pad, pad)
  }

  if (style.grain > 0) {
    const noise = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let n = seed >>> 0
    const next = () => {
      n = (n * 1664525 + 1013904223) >>> 0
      return n / 0xffffffff
    }
    for (let i = 0; i < noise.data.length; i += 4) {
      const g = (next() - 0.5) * style.grain * 255
      noise.data[i] = Math.min(255, Math.max(0, noise.data[i]! + g))
      noise.data[i + 1] = Math.min(255, Math.max(0, noise.data[i + 1]! + g))
      noise.data[i + 2] = Math.min(255, Math.max(0, noise.data[i + 2]! + g))
    }
    ctx.putImageData(noise, 0, 0)
  }

  if (style.vignette > 0) {
    const g = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.2,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.72,
    )
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, `rgba(0,0,0,${style.vignette})`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  return canvas.toDataURL('image/png')
}
