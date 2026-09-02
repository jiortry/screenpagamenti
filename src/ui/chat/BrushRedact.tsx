import { mulberry32 } from '../../engine/random.ts'

const INKS = ['#C62828', '#E53935', '#B71C1C', '#D32F2F', '#F44336']

export function BrushRedact({
  width,
  height = 17,
  seed,
}: {
  width: number
  height?: number
  seed: number
}) {
  const rng = mulberry32(seed >>> 0)
  const n = 5 + Math.floor(rng() * 3)
  const w = Math.max(42, width)
  const h = Math.max(14, height)
  const strokes = Array.from({ length: n }, (_, i) => {
    const y = h * (0.22 + (i / (n - 1)) * 0.58) + (rng() - 0.5) * 2.4
    const x0 = -4 + rng() * 6
    const x1 = w + 4 - rng() * 6
    const wobble = 2.2 + rng() * 3.4
    const c1y = y + (rng() - 0.5) * wobble * 2
    const c2y = y + (rng() - 0.5) * wobble * 2
    const c1x = w * (0.28 + rng() * 0.12)
    const c2x = w * (0.62 + rng() * 0.12)
    return {
      d: `M ${x0} ${y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x1} ${y + (rng() - 0.5) * 1.8}`,
      ink: INKS[Math.floor(rng() * INKS.length)]!,
      width: 5.5 + rng() * 4.2,
      opacity: 0.82 + rng() * 0.16,
      rot: (rng() - 0.5) * 7,
    }
  })

  return (
    <svg
      width={w}
      height={h + 6}
      viewBox={`0 0 ${w} ${h + 6}`}
      aria-hidden
      style={{
        display: 'block',
        overflow: 'visible',
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
      }}
    >
      {strokes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke={s.ink}
          strokeWidth={s.width}
          strokeLinecap="round"
          opacity={s.opacity}
          transform={`rotate(${s.rot} ${w / 2} ${h / 2})`}
        />
      ))}
    </svg>
  )
}

export function RedactedName({
  name,
  seed,
  fontSize = 16,
}: {
  name: string
  seed: number
  fontSize?: number
}) {
  const w = Math.max(56, Math.round(name.length * fontSize * 0.52))
  const h = Math.round(fontSize + 6)
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: w,
        height: h,
        verticalAlign: 'middle',
        userSelect: 'none',
      }}
      aria-label="redacted"
      title=""
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          fontSize,
          fontWeight: 650,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          filter: 'blur(3.5px)',
          pointerEvents: 'none',
        }}
      >
        {name}
      </span>
      <span style={{ position: 'absolute', left: -2, top: -2 }}>
        <BrushRedact width={w + 4} height={h} seed={seed} />
      </span>
    </span>
  )
}
