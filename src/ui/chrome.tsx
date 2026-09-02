import type { CSSProperties } from 'react'
import type { Scenario } from '../types.ts'

function Battery({ pct, color }: { pct: number; color: string }) {
  const fill = pct <= 20 ? '#ef4444' : color
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
      <rect x="0.5" y="2" width="20" height="8" rx="2" fill="none" stroke={color} strokeWidth="1.2" />
      <rect x="21.2" y="4.2" width="2.2" height="3.6" rx="0.6" fill={color} />
      <rect x="2" y="3.5" width={Math.max(1.5, 17 * (pct / 100))} height="5" rx="1" fill={fill} />
    </svg>
  )
}

function Signal({ n, color }: { n: number; color: string }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4}
          y={8 - i * 2}
          width="2.6"
          height={3 + i * 2}
          rx="0.5"
          fill={color}
          opacity={i < n ? 1 : 0.28}
        />
      ))}
    </svg>
  )
}

function Wifi({ color }: { color: string }) {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
      <path d="M1 4.2c3.4-3.2 8.6-3.2 12 0" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3.2 6.4c2.2-2 5.4-2 7.6 0" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="9.4" r="1.15" fill={color} />
    </svg>
  )
}

export function StatusChrome({ s, color }: { s: Scenario; color: string }) {
  const d = s.device
  const ios = d.family === 'iphone'
  const style: CSSProperties = {
    height: d.status,
    paddingInline: ios ? 18 : 12,
    paddingTop: d.island === 'island' || d.island === 'notch' ? 2 : 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    color,
    fontWeight: ios ? 600 : 500,
    fontSize: ios ? 14 : 12,
    position: 'relative',
    flexShrink: 0,
    fontFamily: ios
      ? '-apple-system, "SF Pro Text", "Noto Sans", sans-serif'
      : 'Roboto, "Noto Sans", sans-serif',
  }
  return (
    <div style={style} data-chrome="status">
      {d.island === 'notch' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            height: 28,
            background: '#0a0a0a',
            borderRadius: '0 0 18px 18px',
          }}
        />
      )}
      {d.island === 'island' && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 112,
            height: 32,
            background: '#0a0a0a',
            borderRadius: 18,
          }}
        />
      )}
      {d.island === 'punch' && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            insetInlineEnd: '22%',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#0a0a0a',
            boxShadow: 'inset 0 0 0 1.5px #1a1a1a',
          }}
        />
      )}
      <span style={{ zIndex: 1, minWidth: 52 }}>{s.clock}</span>
      <span
        style={{
          zIndex: 1,
          display: 'flex',
          gap: 5,
          alignItems: 'center',
          fontSize: 11,
          letterSpacing: 0.3,
        }}
      >
        {ios && <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.9 }}>SYNTH</span>}
        <Signal n={s.signal} color={color} />
        <Wifi color={color} />
        <Battery pct={s.battery} color={color} />
      </span>
    </div>
  )
}

export function NavChrome({ s, color, bg }: { s: Scenario; color: string; bg: string }) {
  const d = s.device
  if (d.nav === 'indicator') {
    return (
      <div
        style={{
          height: Math.max(d.safeBottom, 18),
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 8,
          flexShrink: 0,
          background: bg,
        }}
      >
        <div style={{ width: 118, height: 5, borderRadius: 4, background: color, opacity: 0.55 }} />
      </div>
    )
  }
  if (d.nav === 'home-button') {
    return (
      <div
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: bg,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            opacity: 0.45,
          }}
        />
      </div>
    )
  }
  if (d.nav === 'gesture') {
    return (
      <div
        style={{
          height: Math.max(d.safeBottom, 16),
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 6,
          flexShrink: 0,
          background: bg,
        }}
      >
        <div style={{ width: 96, height: 4, borderRadius: 4, background: color, opacity: 0.5 }} />
      </div>
    )
  }
  return (
    <div
      style={{
        height: Math.max(d.safeBottom, 40),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexShrink: 0,
        background: bg,
        color,
        paddingBottom: 4,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M12 3 L5 9 L12 15" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="6" fill="none" stroke={color} strokeWidth="1.7" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="3" y="4" width="12" height="10" rx="1.5" fill="none" stroke={color} strokeWidth="1.7" />
      </svg>
    </div>
  )
}
