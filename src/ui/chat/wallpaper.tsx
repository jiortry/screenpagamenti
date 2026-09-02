import type { CSSProperties } from 'react'
import { PHOTO_WALLS } from '../../chat/avatars.ts'
import type { TgSkin } from '../../chat/types.ts'
import type { TgWallId } from '../../chat/types.ts'

function DoodlePattern({ id, stroke, opacity }: { id: string; stroke: string; opacity: number }) {
  return (
    <pattern id={id} width="220" height="220" patternUnits="userSpaceOnUse">
      <g fill="none" stroke={stroke} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path d="M18 36 l22-8 4 20-18 2z" />
        <path d="M28 32 l8 6" />
        <path d="M72 28 c12-10 28-8 34 6 4 10-2 22-14 24" />
        <circle cx="168" cy="44" r="7" />
        <path d="M188 38 l14 14 M202 38 l-14 14" />
        <path d="M36 92 c8-14 28-14 34 2 8 18-10 28-22 18" />
        <path d="M118 88 l26 8-8 22-18-6z" />
        <path d="M124 96 l10 8" />
        <path d="M178 102 c10 0 16 10 12 18-8 6-20 2-18-8" />
        <path d="M24 158 l18-4 6 16-14 6z" />
        <circle cx="86" cy="168" r="5" />
        <path d="M108 154 c14-8 30 2 28 16" />
        <path d="M160 150 l22 10-10 18" />
        <path d="M48 198 q18-16 36 0" />
        <path d="M132 204 l8-10 8 10" />
        <circle cx="198" cy="188" r="4" />
        <path d="M10 118 h16" />
        <path d="M96 48 l6 14" />
        <path d="M210 78 v16" />
      </g>
    </pattern>
  )
}

export function ChatWallpaper({
  wall,
  skin,
}: {
  wall: Exclude<TgWallId, 'auto'>
  skin: TgSkin
}) {
  const cover: CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none' }

  if (wall.startsWith('photo-')) {
    const i = Number(wall.slice(6))
    const src = PHOTO_WALLS[i] ?? PHOTO_WALLS[0]
    return (
      <div style={cover}>
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85) brightness(0.92)' }} />
        <div style={{ ...cover, background: skin.appearance === 'dark' ? 'rgba(8,14,22,0.45)' : 'rgba(255,255,255,0.12)' }} />
      </div>
    )
  }

  if (wall === 'solid') {
    return <div style={{ ...cover, background: skin.appearance === 'dark' ? '#0E1621' : '#C8D4DE' }} />
  }

  if (wall === 'gradient') {
    return (
      <div
        style={{
          ...cover,
          background:
            skin.appearance === 'dark'
              ? 'linear-gradient(180deg, #1A2740 0%, #0B1018 100%)'
              : 'linear-gradient(180deg, #B9D0E4 0%, #D5C4A8 100%)',
        }}
      />
    )
  }

  if (wall === 'doodle-night') {
    const pid = `tg-night-${skin.id}`
    return (
      <svg style={cover} width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <DoodlePattern id={pid} stroke="#8FB3D1" opacity={0.14} />
        </defs>
        <rect width="100%" height="100%" fill="#0E1621" />
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
    )
  }

  const pid = `tg-day-${skin.id}`
  return (
    <svg style={cover} width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <DoodlePattern id={pid} stroke="#FFFFFF" opacity={0.42} />
      </defs>
      <rect width="100%" height="100%" fill="#B5C9D8" />
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  )
}
