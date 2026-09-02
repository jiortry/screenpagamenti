import type { CSSProperties } from 'react'
import type { DeviceSpec, NetworkType } from '../types.ts'

export type ChromeSource = {
  device: DeviceSpec
  clock: string
  carrier: string
  dualSim: boolean
  focusMode: boolean
  bluetooth: boolean
  networkType: NetworkType
  signal: number
  battery: number
  charging: boolean
  showBatteryPct: boolean
}

function IosBattery({ pct, color, charging }: { pct: number; color: string; charging?: boolean }) {
  const fill = pct <= 20 ? '#ff3b30' : color
  const inner = Math.max(1.2, 19.2 * (pct / 100))
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
        <rect x="0.6" y="1.1" width="23" height="10.8" rx="2.4" fill="none" stroke={color} strokeWidth="1.2" />
        <rect x="24.4" y="4.1" width="1.8" height="4.8" rx="0.7" fill={color} />
        <rect x="2.2" y="2.7" width={inner} height="7.6" rx="1.3" fill={fill} />
      </svg>
      {charging && (
        <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden>
          <path d="M5.2 0 2.4 5.2H4.6L2.8 10 5.6 4.6H3.4L5.2 0Z" fill={color} />
        </svg>
      )}
    </span>
  )
}

function AndroidBattery({
  pct,
  color,
  showPct,
  charging,
}: {
  pct: number
  color: string
  showPct?: boolean
  charging?: boolean
}) {
  const fill = pct <= 20 ? '#f28b82' : color
  const inner = Math.max(1.2, 16.5 * (pct / 100))
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {showPct && (
        <span style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
      )}
      <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden>
        <rect x="0.5" y="1.5" width="20" height="9" rx="2" fill="none" stroke={color} strokeWidth="1.15" />
        <path d="M21.2 4.2h1.5a.8.8 0 0 1 .8.8v2a.8.8 0 0 1-.8.8h-1.5" fill={color} />
        <rect x="2" y="3.1" width={inner} height="5.8" rx="1" fill={fill} />
      </svg>
      {charging && (
        <svg width="7" height="9" viewBox="0 0 7 9" aria-hidden>
          <path d="M4.6 0 2.1 4.6H3.9L2.4 9 4.9 4.2H3.1L4.6 0Z" fill={color} />
        </svg>
      )}
    </span>
  )
}

function IosSignal({ n, color }: { n: number; color: string }) {
  const h = [4.2, 6.2, 8.2, 10.2]
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden>
      {h.map((height, i) => (
        <rect
          key={i}
          x={i * 4.15}
          y={11.2 - height}
          width="2.55"
          height={height}
          rx="0.55"
          fill={color}
          opacity={i < n ? 1 : 0.22}
        />
      ))}
    </svg>
  )
}

function AndroidSignal({ n, color }: { n: number; color: string }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4}
          y={9.6 - i * 2.2}
          width="2.7"
          height={2.2 + i * 2.2}
          rx="0.4"
          fill={color}
          opacity={i < n ? 1 : 0.25}
        />
      ))}
    </svg>
  )
}

function IosWifi({ color }: { color: string }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
      <path d="M8 10.85a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z" fill={color} />
      <path d="M4.55 7.55a4.9 4.9 0 0 1 6.9 0" fill="none" stroke={color} strokeWidth="1.55" strokeLinecap="round" />
      <path d="M2.45 5.35a7.7 7.7 0 0 1 11.1 0" fill="none" stroke={color} strokeWidth="1.55" strokeLinecap="round" />
      <path d="M0.7 3.15a10.4 10.4 0 0 1 14.6 0" fill="none" stroke={color} strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  )
}

function AndroidWifi({ color }: { color: string }) {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden>
      <path d="M8 13 1.2 5.8A10.2 10.2 0 0 1 8 2.4a10.2 10.2 0 0 1 6.8 3.4L8 13Z" fill={color} />
      <path d="M8 13 4.4 8.9A5.4 5.4 0 0 1 8 7.4a5.4 5.4 0 0 1 3.6 1.5L8 13Z" fill={color} opacity="0.55" />
    </svg>
  )
}

function NetworkLabel({ type }: { type: NetworkType }) {
  if (type === 'wifi') return null
  const label = type === '5g' ? '5G' : type === 'lte' ? 'LTE' : '4G'
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.2, lineHeight: 1 }}>
      {label}
    </span>
  )
}

function DualSimGlyph({ color }: { color: string }) {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
      <rect x="0.5" y="1" width="5.5" height="9" rx="1.2" fill="none" stroke={color} strokeWidth="1.1" />
      <rect x="8" y="2.5" width="5.5" height="9" rx="1.2" fill="none" stroke={color} strokeWidth="1.1" opacity="0.75" />
    </svg>
  )
}

function BluetoothGlyph({ color }: { color: string }) {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden>
      <path
        d="M4.6 0 1.8 3.2 4.2 4.8 1.8 6.4 4.6 9.6V0Zm0 9.6 2.8-3.2-2.4-1.6 2.4-1.6L4.6 0v9.6Z"
        fill={color}
      />
    </svg>
  )
}

function FocusGlyph({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <circle cx="6" cy="6" r="4.6" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M6 3.2v5.6M3.2 6h5.6" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function cutoutWidth(s: ChromeSource): number {
  const d = s.device
  if (d.island === 'island') return Math.round(Math.min(130, d.width * 0.32))
  if (d.island === 'notch') return Math.round(Math.min(168, d.width * 0.42))
  return 0
}

export function StatusChrome({ s, color }: { s: ChromeSource; color: string }) {
  const d = s.device
  const ios = d.family === 'iphone'
  const center = cutoutWidth(s)
  const islandH = d.island === 'island' ? 36 : d.island === 'notch' ? 32 : 0
  const islandTop = d.island === 'island' ? 11 : 0
  const sidePad = ios ? (d.island === 'none' ? 14 : 26) : 10

  const style: CSSProperties = {
    height: d.status,
    position: 'relative',
    flexShrink: 0,
    color,
    fontWeight: ios ? 600 : 500,
    fontSize: ios ? (d.island === 'none' ? 12 : 16) : 12.5,
    fontFamily: ios
      ? '"Inter", -apple-system, "SF Pro Text", "Noto Sans", sans-serif'
      : '"Inter", Roboto, "Noto Sans", sans-serif',
    letterSpacing: ios ? -0.3 : 0.1,
  }

  const clockEl = (
    <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{s.clock}</span>
  )

  return (
    <div style={style} data-chrome="status">
      {d.island === 'notch' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: center,
            height: islandH,
            background: '#000',
            borderRadius: '0 0 18px 18px',
            pointerEvents: 'none',
          }}
        />
      )}
      {d.island === 'island' && (
        <div
          style={{
            position: 'absolute',
            top: islandTop,
            left: '50%',
            transform: 'translateX(-50%)',
            width: center,
            height: islandH,
            background: '#000',
            borderRadius: 22,
            pointerEvents: 'none',
          }}
        />
      )}
      {d.island === 'punch' && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: '#0a0a0a',
            boxShadow: 'inset 0 0 0 1.5px #222',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          height: '100%',
          display: 'grid',
          gridTemplateColumns: center
            ? `minmax(0,1fr) ${center + 8}px minmax(0,1fr)`
            : '1fr 1fr',
          alignItems: 'center',
          paddingInline: sidePad,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            minWidth: 0,
            justifySelf: 'start',
          }}
        >
          {!ios && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                opacity: 0.92,
                letterSpacing: 0.2,
                whiteSpace: 'nowrap',
              }}
            >
              {s.carrier}
              {s.dualSim ? ' · SIM1' : ''}
            </span>
          )}
          {clockEl}
        </div>

        {center ? <div /> : null}

        <div
          style={{
            display: 'flex',
            gap: ios ? 5 : 4,
            alignItems: 'center',
            justifySelf: 'end',
          }}
        >
          {s.focusMode && ios && <FocusGlyph color={color} />}
          {s.bluetooth && <BluetoothGlyph color={color} />}
          {s.dualSim && ios && <DualSimGlyph color={color} />}
          {ios ? (
            <>
              {s.networkType === 'wifi' ? (
                <IosWifi color={color} />
              ) : (
                <>
                  <NetworkLabel type={s.networkType} />
                  <IosSignal n={s.signal} color={color} />
                </>
              )}
              {s.networkType === 'wifi' && <IosSignal n={s.signal} color={color} />}
              <IosBattery pct={s.battery} color={color} charging={s.charging} />
            </>
          ) : (
            <>
              {s.networkType === 'wifi' ? (
                <AndroidWifi color={color} />
              ) : (
                <>
                  <NetworkLabel type={s.networkType} />
                  <AndroidSignal n={s.signal} color={color} />
                </>
              )}
              <AndroidBattery
                pct={s.battery}
                color={color}
                showPct={s.showBatteryPct}
                charging={s.charging}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function NavChrome({ s, color, bg }: { s: ChromeSource; color: string; bg: string }) {
  const d = s.device
  if (d.nav === 'indicator') {
    return (
      <div
        style={{
          height: Math.max(d.safeBottom, 20),
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 8,
          flexShrink: 0,
          background: bg,
        }}
      >
        <div style={{ width: 134, height: 5, borderRadius: 4, background: color, opacity: 0.42 }} />
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
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: `2.5px solid ${color}`,
            opacity: 0.35,
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
        <div style={{ width: 134, height: 5, borderRadius: 4, background: color, opacity: 0.42 }} />
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
