import type { CSSProperties, ReactNode } from 'react'
import type { Scenario, TxStatus } from '../types.ts'
import type { ThemeTokens } from '../engine/themes.ts'

export function statusTint(status: TxStatus, theme: ThemeTokens): string {
  if (status === 'failed' || status === 'cancelled') return theme.danger
  if (status === 'processing' || status === 'pending' || status === 'scheduled') return theme.warning
  return theme.success
}

export function Monogram({
  letters,
  theme,
  size = 36,
}: {
  letters: string
  theme: ThemeTokens
  size?: number
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: theme.radius,
        background: theme.accent,
        color: theme.buttonText,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.34,
        letterSpacing: 0.4,
        flexShrink: 0,
      }}
    >
      {letters}
    </div>
  )
}

export function Row({
  label,
  value,
  theme,
  mono,
}: {
  label: string
  value: string
  theme: ThemeTokens
  mono?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        paddingBlock: 6,
        borderBottom: `1px solid ${theme.line}`,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ color: theme.muted, fontSize: '0.86em' }}>{label}</span>
      <span
        style={{
          textAlign: 'end',
          fontWeight: 600,
          fontSize: '0.9em',
          maxWidth: '62%',
          overflowWrap: 'anywhere',
          fontFamily: mono ? 'ui-monospace, Menlo, monospace' : undefined,
        }}
      >
        {value}
      </span>
    </div>
  )
}

export function Chip({ children, theme, color }: { children: ReactNode; theme: ThemeTokens; color?: string }) {
  const c = color ?? theme.accent
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: theme.chip,
        color: c,
        fontSize: '0.78em',
        fontWeight: 700,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  )
}

export function PrimaryButton({
  label,
  theme,
  wide,
}: {
  label: string
  theme: ThemeTokens
  wide?: boolean
}) {
  return (
    <div
      style={{
        background: theme.button,
        color: theme.buttonText,
        borderRadius: theme.radius + 4,
        padding: '12px 16px',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.95em',
        flex: wide ? 1 : undefined,
      }}
    >
      {label}
    </div>
  )
}

export function GhostButton({ label, theme }: { label: string; theme: ThemeTokens }) {
  return (
    <div
      style={{
        border: `1px solid ${theme.line}`,
        color: theme.text,
        borderRadius: theme.radius + 4,
        padding: '12px 16px',
        textAlign: 'center',
        fontWeight: 650,
        fontSize: '0.9em',
        flex: 1,
        background: theme.surface,
      }}
    >
      {label}
    </div>
  )
}

export function Actions({ s, theme, done, share }: { s: Scenario; theme: ThemeTokens; done: string; share: string }) {
  if (s.visual.buttonPlacement === 'split') {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <GhostButton label={share} theme={theme} />
        <PrimaryButton label={done} theme={theme} wide />
      </div>
    )
  }
  if (s.visual.buttonPlacement === 'inline') {
    return <PrimaryButton label={done} theme={theme} />
  }
  return (
    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <PrimaryButton label={done} theme={theme} />
      <GhostButton label={share} theme={theme} />
    </div>
  )
}

export function SynthQr({
  seed,
  color,
  bg,
  size = 110,
}: {
  seed: string
  color: string
  bg: string
  size?: number
}) {
  const cells = 17
  const bits: boolean[] = []
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  for (let i = 0; i < cells * cells; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    bits.push((h >>> 0) % 3 !== 0)
  }
  const finder = (x: number, y: number) => {
    const inF = (ox: number, oy: number) => {
      const dx = x - ox
      const dy = y - oy
      return dx >= 0 && dx < 5 && dy >= 0 && dy < 5
    }
    return inF(0, 0) || inF(cells - 5, 0) || inF(0, cells - 5)
  }
  const u = size / cells
  const rects: ReactNode[] = []
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const i = y * cells + x
      const on = finder(x, y)
        ? x % 5 === 0 || y % 5 === 0 || (x % 5 === 2 && y % 5 === 2)
        : bits[i]
      if (on) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x * u}
            y={y * u}
            width={u - 0.4}
            height={u - 0.4}
            fill={color}
          />,
        )
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: bg, borderRadius: 8 }}>
      {rects}
    </svg>
  )
}

export function CardFace({
  mask,
  name,
  theme,
  tone,
}: {
  mask: string
  name: string
  theme: ThemeTokens
  tone: 'from' | 'to'
}) {
  const bg: CSSProperties =
    tone === 'from'
      ? {
          background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.bg2} 100%)`,
          color: theme.buttonText,
        }
      : {
          background: `linear-gradient(135deg, ${theme.bg2} 0%, ${theme.accent2} 100%)`,
          color: theme.text,
        }
  return (
    <div
      style={{
        ...bg,
        borderRadius: 14,
        padding: '12px 14px',
        minHeight: 72,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72em', opacity: 0.9 }}>
        <span>CIRCUIT</span>
        <span>SYNTH</span>
      </div>
      <div
        style={{
          width: 22,
          height: 16,
          borderRadius: 3,
          background: 'linear-gradient(180deg,#f4d19b,#d4a017)',
        }}
      />
      <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 700 }}>{mask}</div>
      <div style={{ fontSize: '0.75em', fontWeight: 600 }}>{name}</div>
    </div>
  )
}

export function backgroundStyle(s: Scenario, theme: ThemeTokens): CSSProperties {
  switch (s.visual.bgTreatment) {
    case 'gradient':
      return { background: `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bg2} 100%)` }
    case 'mesh':
      return {
        background: `radial-gradient(120% 80% at 10% 0%, ${theme.accent2}55, transparent 50%), radial-gradient(90% 70% at 100% 20%, ${theme.accent}33, transparent 46%), ${theme.bg}`,
      }
    case 'paper':
      return { background: theme.bg2 }
    default:
      return { background: theme.bg }
  }
}
