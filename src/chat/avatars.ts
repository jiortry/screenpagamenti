import { chance, pick, type Rng } from '../engine/random.ts'

const MEN = Array.from({ length: 50 }, (_, i) => `/avatars/m${String(i).padStart(2, '0')}.jpg`)
const WOMEN = Array.from({ length: 50 }, (_, i) => `/avatars/w${String(i).padStart(2, '0')}.jpg`)
const UNSPLASH = [
  'u00', 'u01', 'u02', 'u03', 'u04', 'u05', 'u06', 'u07', 'u09', 'u10',
  'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20', 'u21',
  'u22', 'u23', 'u25', 'u26', 'u27', 'u28', 'u29',
].map((id) => `/avatars/${id}.jpg`)

export const AVATAR_POOL = [...MEN, ...WOMEN, ...UNSPLASH]

export const CHAT_PHOTOS = Array.from({ length: 16 }, (_, i) => `/chat-photos/p${String(i).padStart(2, '0')}.jpg`)

export const PHOTO_WALLS = Array.from({ length: 14 }, (_, i) => `/chat-walls/w${String(i).padStart(2, '0')}.jpg`)

const MOON_WALLS = [0, 4, 6, 7, 8] as const
const NIGHT_WALLS = [1, 2, 3, 5, 13] as const
const SUNSET_WALLS = [9, 10, 11, 12] as const

export function pickSkyWall(rng: Rng): `photo-${number}` {
  const roll = rng()
  const idx =
    roll < 0.78
      ? pick(rng, MOON_WALLS)
      : roll < 0.9
        ? pick(rng, NIGHT_WALLS)
        : pick(rng, SUNSET_WALLS)
  return `photo-${idx}`
}

export const PEER_COLORS = ['#E17076', '#7BC862', '#E5CA77', '#65AADD', '#EE7AAE', '#6EC9CB', '#FA93AE']

export function pickAvatar(rng: Rng): string {
  return pick(rng, AVATAR_POOL)
}

export function maybeAvatar(rng: Rng): string | null {
  if (chance(rng, 0.14)) return null
  return pickAvatar(rng)
}

export function pickPhoto(rng: Rng): string {
  return pick(rng, CHAT_PHOTOS)
}

export function pickPeerColor(rng: Rng): string {
  return pick(rng, PEER_COLORS)
}
