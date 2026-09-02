import type { DeviceFamily, DeviceSpec } from '../types.ts'
import { pick, randFloat, randInt, type Rng } from './random.ts'

const IPHONE: DeviceSpec[] = [
  {
    id: 'iphone-13-mini',
    family: 'iphone',
    label: 'compact iPhone',
    width: 375,
    height: 812,
    corner: 44,
    status: 44,
    island: 'notch',
    nav: 'indicator',
    density: 3,
    safeTop: 44,
    safeBottom: 28,
  },
  {
    id: 'iphone-14',
    family: 'iphone',
    label: 'modern iPhone',
    width: 390,
    height: 844,
    corner: 47,
    status: 47,
    island: 'notch',
    nav: 'indicator',
    density: 3,
    safeTop: 47,
    safeBottom: 30,
  },
  {
    id: 'iphone-15',
    family: 'iphone',
    label: 'modern iPhone',
    width: 393,
    height: 852,
    corner: 55,
    status: 59,
    island: 'island',
    nav: 'indicator',
    density: 3,
    safeTop: 59,
    safeBottom: 32,
  },
  {
    id: 'iphone-15-plus',
    family: 'iphone',
    label: 'modern iPhone',
    width: 428,
    height: 926,
    corner: 55,
    status: 59,
    island: 'island',
    nav: 'indicator',
    density: 3,
    safeTop: 59,
    safeBottom: 34,
  },
  {
    id: 'iphone-16-pro-max',
    family: 'iphone',
    label: 'modern iPhone',
    width: 440,
    height: 956,
    corner: 58,
    status: 59,
    island: 'island',
    nav: 'indicator',
    density: 3,
    safeTop: 59,
    safeBottom: 34,
  },
]

const PIXEL: DeviceSpec[] = [
  {
    id: 'pixel-8a',
    family: 'pixel',
    label: 'Google Pixel-style Android',
    width: 412,
    height: 915,
    corner: 30,
    status: 28,
    island: 'none',
    nav: 'gesture',
    density: 2.625,
    safeTop: 28,
    safeBottom: 22,
  },
  {
    id: 'pixel-compact',
    family: 'pixel',
    label: 'Google Pixel-style Android',
    width: 384,
    height: 832,
    corner: 28,
    status: 26,
    island: 'none',
    nav: 'gesture',
    density: 2.625,
    safeTop: 26,
    safeBottom: 20,
  },
]

const SAMSUNG: DeviceSpec[] = [
  {
    id: 'samsung-s-compact',
    family: 'samsung',
    label: 'Samsung-style Android',
    width: 360,
    height: 780,
    corner: 26,
    status: 32,
    island: 'punch',
    nav: 'gesture',
    density: 3,
    safeTop: 32,
    safeBottom: 18,
  },
  {
    id: 'samsung-s-large',
    family: 'samsung',
    label: 'Samsung-style Android',
    width: 384,
    height: 854,
    corner: 16,
    status: 34,
    island: 'punch',
    nav: 'gesture',
    density: 3,
    safeTop: 34,
    safeBottom: 20,
  },
  {
    id: 'samsung-a',
    family: 'samsung',
    label: 'compact Android',
    width: 360,
    height: 740,
    corner: 22,
    status: 28,
    island: 'punch',
    nav: 'buttons',
    density: 2.25,
    safeTop: 28,
    safeBottom: 48,
  },
]

const ANDROID: DeviceSpec[] = [
  {
    id: 'android-compact',
    family: 'android',
    label: 'compact Android',
    width: 360,
    height: 720,
    corner: 20,
    status: 24,
    island: 'none',
    nav: 'buttons',
    density: 2,
    safeTop: 24,
    safeBottom: 48,
  },
  {
    id: 'android-large',
    family: 'android',
    label: 'large Android phone',
    width: 430,
    height: 920,
    corner: 26,
    status: 28,
    island: 'punch',
    nav: 'gesture',
    density: 2.5,
    safeTop: 28,
    safeBottom: 22,
  },
]

const BUDGET: DeviceSpec[] = [
  {
    id: 'android-budget',
    family: 'android-budget',
    label: 'small-budget Android phone',
    width: 320,
    height: 640,
    corner: 10,
    status: 20,
    island: 'none',
    nav: 'buttons',
    density: 1.5,
    safeTop: 20,
    safeBottom: 44,
  },
  {
    id: 'android-budget-tall',
    family: 'android-budget',
    label: 'small-budget Android phone',
    width: 360,
    height: 680,
    corner: 12,
    status: 22,
    island: 'none',
    nav: 'buttons',
    density: 2,
    safeTop: 22,
    safeBottom: 46,
  },
]

const FAMILIES: { family: DeviceFamily; weight: number; list: DeviceSpec[] }[] = [
  { family: 'iphone', weight: 28, list: IPHONE },
  { family: 'samsung', weight: 22, list: SAMSUNG },
  { family: 'pixel', weight: 16, list: PIXEL },
  { family: 'android', weight: 22, list: ANDROID },
  { family: 'android-budget', weight: 12, list: BUDGET },
]

const ALL_DEVICES: DeviceSpec[] = [...IPHONE, ...PIXEL, ...SAMSUNG, ...ANDROID, ...BUDGET]

export function deviceById(id: string): DeviceSpec {
  return ALL_DEVICES.find((d) => d.id === id) ?? IPHONE[0]
}

export function sampleIphone(rng: Rng): DeviceSpec {
  return { ...pick(rng, IPHONE) }
}

export function sampleAndroidPhone(rng: Rng): DeviceSpec {
  const list = [...PIXEL, ...SAMSUNG, ...ANDROID]
  const base = pick(rng, list)
  const jitterW = randInt(rng, -4, 6)
  const jitterH = randInt(rng, -8, 12)
  return {
    ...base,
    width: Math.max(320, base.width + jitterW),
    height: Math.max(640, base.height + jitterH),
    density: Math.round(randFloat(rng, 2, 3) * 4) / 4,
  }
}

export function sampleDevice(rng: Rng): DeviceSpec {
  const total = FAMILIES.reduce((s, f) => s + f.weight, 0)
  let r = rng() * total
  let pack = FAMILIES[0]
  for (const f of FAMILIES) {
    r -= f.weight
    if (r <= 0) {
      pack = f
      break
    }
  }
  const base = pick(rng, pack.list)
  const jitterW = pack.family === 'iphone' ? 0 : randInt(rng, -4, 6)
  const jitterH = pack.family === 'iphone' ? 0 : randInt(rng, -8, 12)
  return {
    ...base,
    width: Math.max(300, base.width + jitterW),
    height: Math.max(560, base.height + jitterH),
    density: pack.family === 'iphone' ? base.density : Math.round(randFloat(rng, 1.5, 3) * 4) / 4,
  }
}

export function sampleFontScale(rng: Rng, family: DeviceFamily): number {
  if (family === 'iphone') return Math.round(randFloat(rng, 0.94, 1.08) * 100) / 100
  if (family === 'android-budget') return Math.round(randFloat(rng, 0.88, 1.12) * 100) / 100
  return Math.round(randFloat(rng, 0.9, 1.14) * 100) / 100
}
