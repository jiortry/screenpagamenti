import { mulberry32, type Rng } from '../../engine/random.ts'

const INKS = ['#C62828', '#E53935', '#B71C1C', '#D32F2F', '#F44336', '#B71C1C']

export type BrushMark = {
  d: string
  ink: string
  width: number
  opacity: number
  rot: number
  blob?: { cx: number; cy: number; rx: number; ry: number }
}

export function makeBrushMarks(width: number, height: number, seed: number, messy = false): BrushMark[] {
  const rng = mulberry32(seed >>> 0)
  const w = Math.max(28, width)
  const h = Math.max(12, height)
  const n = messy ? 4 + Math.floor(rng() * 6) : 5 + Math.floor(rng() * 3)
  const marks: BrushMark[] = []

  for (let i = 0; i < n; i++) {
    const y = h * (0.16 + (i / Math.max(1, n - 1)) * 0.68) + (rng() - 0.5) * (messy ? 4.8 : 2.4)
    const trimL = messy && rng() > 0.35 ? rng() * w * 0.22 : rng() * 6
    const trimR = messy && rng() > 0.4 ? rng() * w * 0.28 : rng() * 6
    const x0 = -6 + trimL
    const x1 = w + 8 - trimR
    if (x1 - x0 < 16) continue
    const wobble = (messy ? 3.4 : 2.2) + rng() * (messy ? 6 : 3.4)
    const c1y = y + (rng() - 0.5) * wobble * 2
    const c2y = y + (rng() - 0.5) * wobble * 2
    const c1x = w * (0.18 + rng() * 0.28)
    const c2x = w * (0.52 + rng() * 0.3)
    marks.push({
      d: `M ${x0.toFixed(1)} ${y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x1.toFixed(1)} ${(y + (rng() - 0.5) * (messy ? 3.2 : 1.8)).toFixed(1)}`,
      ink: INKS[Math.floor(rng() * INKS.length)]!,
      width: (messy ? 6.2 : 5.5) + rng() * (messy ? 7.5 : 4.2),
      opacity: messy ? 0.88 + rng() * 0.12 : 0.82 + rng() * 0.16,
      rot: (rng() - 0.5) * (messy ? 16 : 7),
    })
  }

  if (messy) {
    const blobs = 1 + Math.floor(rng() * 3)
    for (let i = 0; i < blobs; i++) {
      marks.push({
        d: '',
        ink: INKS[Math.floor(rng() * INKS.length)]!,
        width: 0,
        opacity: 0.78 + rng() * 0.2,
        rot: (rng() - 0.5) * 24,
        blob: {
          cx: w * (0.12 + rng() * 0.76),
          cy: h * (0.25 + rng() * 0.5),
          rx: 4 + rng() * 9,
          ry: 2.2 + rng() * 4.5,
        },
      })
    }
  }

  return marks
}

function BrushSvg({
  width,
  height,
  seed,
  messy = false,
  blend = 'multiply',
}: {
  width: number
  height: number
  seed: number
  messy?: boolean
  blend?: 'multiply' | 'normal'
}) {
  const w = Math.max(28, width)
  const h = Math.max(12, height)
  const marks = makeBrushMarks(w, h, seed, messy)
  return (
    <svg
      width={w}
      height={h + 8}
      viewBox={`0 0 ${w} ${h + 8}`}
      aria-hidden
      style={{
        display: 'block',
        overflow: 'visible',
        pointerEvents: 'none',
        mixBlendMode: blend,
      }}
    >
      {marks.map((s, i) =>
        s.blob ? (
          <ellipse
            key={i}
            cx={s.blob.cx}
            cy={s.blob.cy}
            rx={s.blob.rx}
            ry={s.blob.ry}
            fill={s.ink}
            opacity={s.opacity}
            transform={`rotate(${s.rot} ${w / 2} ${h / 2})`}
          />
        ) : (
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
        ),
      )}
    </svg>
  )
}

export function BrushRedact({
  width,
  height = 17,
  seed,
  messy = false,
  blend = 'multiply',
}: {
  width: number
  height?: number
  seed: number
  messy?: boolean
  blend?: 'multiply' | 'normal'
}) {
  return <BrushSvg width={width} height={height} seed={seed} messy={messy} blend={blend} />
}

export function brushMarkup(width: number, height: number, seed: number): string {
  const w = Math.max(28, width)
  const h = Math.max(12, height)
  const marks = makeBrushMarks(w, h, seed, true)
  const parts = marks.map((s) => {
    const rot = `transform="rotate(${s.rot.toFixed(2)} ${w / 2} ${h / 2})"`
    if (s.blob) {
      return `<ellipse cx="${s.blob.cx.toFixed(1)}" cy="${s.blob.cy.toFixed(1)}" rx="${s.blob.rx.toFixed(1)}" ry="${s.blob.ry.toFixed(1)}" fill="${s.ink}" opacity="${s.opacity.toFixed(2)}" ${rot} />`
    }
    return `<path d="${s.d}" fill="none" stroke="${s.ink}" stroke-width="${s.width.toFixed(1)}" stroke-linecap="round" opacity="${s.opacity.toFixed(2)}" ${rot} />`
  })
  return `<svg width="${w}" height="${h + 8}" viewBox="0 0 ${w} ${h + 8}" aria-hidden="true" style="display:block;overflow:visible;pointer-events:none">${parts.join('')}</svg>`
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
  const rng = mulberry32(seed >>> 0)
  const factor = 0.44 + rng() * 0.28
  const w = Math.max(48, Math.round(name.length * fontSize * factor) + Math.round((rng() - 0.3) * 18))
  const h = Math.round(fontSize + 4 + rng() * 8)
  const ox = Math.round((rng() - 0.55) * 10)
  const oy = Math.round((rng() - 0.5) * 6)
  const extra = rng() > 0.55
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
          opacity: 0.05 + rng() * 0.07,
          fontSize,
          fontWeight: 650,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          filter: `blur(${2.4 + rng() * 2.4}px)`,
          pointerEvents: 'none',
        }}
      >
        {name}
      </span>
      <span style={{ position: 'absolute', left: ox - 4, top: oy - 3 }}>
        <BrushRedact width={w + 10} height={h + 2} seed={seed} messy />
      </span>
      {extra && (
        <span style={{ position: 'absolute', left: ox + Math.round((rng() - 0.5) * 14), top: oy + Math.round((rng() - 0.5) * 5) }}>
          <BrushRedact width={Math.round(w * (0.45 + rng() * 0.4))} height={h - 2} seed={seed ^ 0x51f} messy />
        </span>
      )}
    </span>
  )
}

export function clearPaymentRedactions(root: HTMLElement) {
  root.querySelectorAll('[data-pay-redact]').forEach((n) => n.remove())
}

function needlesFromScenario(s: {
  sender: { full: string; given: string; family: string }
  recipient: { full: string; given: string; family: string }
  ibanFrom?: string
  ibanTo?: string
  ibanFromMasked?: string
  ibanToMasked?: string
  accountFrom?: string
  accountTo?: string
  walletFrom?: string
  walletTo?: string
  cardFrom?: string
  cardTo?: string
  transactionId?: string
  txHash?: string
  phone?: string
  bic?: string
  cro?: string
  pickupCode?: string
}): { text: string; p: number }[] {
  const out: { text: string; p: number }[] = [
    { text: s.sender.full, p: 0.94 },
    { text: s.sender.family, p: 0.62 },
    { text: s.sender.given, p: 0.38 },
    { text: s.recipient.full, p: 0.96 },
    { text: s.recipient.family, p: 0.7 },
    { text: s.recipient.given, p: 0.42 },
    { text: s.ibanFrom ?? '', p: 0.82 },
    { text: s.ibanTo ?? '', p: 0.88 },
    { text: s.ibanFromMasked ?? '', p: 0.55 },
    { text: s.ibanToMasked ?? '', p: 0.6 },
    { text: s.accountFrom ?? '', p: 0.8 },
    { text: s.accountTo ?? '', p: 0.84 },
    { text: s.walletFrom ?? '', p: 0.78 },
    { text: s.walletTo ?? '', p: 0.8 },
    { text: s.cardFrom ?? '', p: 0.72 },
    { text: s.cardTo ?? '', p: 0.72 },
    { text: s.transactionId ?? '', p: 0.48 },
    { text: s.txHash ?? '', p: 0.52 },
    { text: s.phone ?? '', p: 0.8 },
    { text: s.bic ?? '', p: 0.45 },
    { text: s.cro ?? '', p: 0.5 },
    { text: s.pickupCode ?? '', p: 0.7 },
  ]
  return out.filter((n) => n.text.replace(/[•\s]/g, '').length >= 3)
}

function findNeedleRects(root: HTMLElement, needle: string): DOMRect[] {
  const hit: DOMRect[] = []
  const needleNorm = needle.replace(/\s+/g, ' ').trim()
  if (needleNorm.length < 3) return hit
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const lower = needleNorm.toLowerCase()
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const raw = node.textContent ?? ''
    const idx = raw.toLowerCase().indexOf(lower)
    if (idx < 0) continue
    try {
      const range = document.createRange()
      range.setStart(node, idx)
      range.setEnd(node, Math.min(raw.length, idx + needleNorm.length))
      const r = range.getBoundingClientRect()
      if (r.width >= 10 && r.height >= 8) hit.push(r)
    } catch {
      /* ignore broken ranges */
    }
  }
  return hit
}

function randomBodyRects(root: HTMLElement, rng: Rng, n: number): DOMRect[] {
  const body = root.querySelector('[data-screen-body]') ?? root
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT)
  const candidates: DOMRect[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const raw = (node.textContent ?? '').trim()
    if (raw.length < 6 || raw.length > 42) continue
    if (!/[A-Za-z0-9]/.test(raw)) continue
    const parent = node.parentElement
    if (!parent) continue
    const r = parent.getBoundingClientRect()
    if (r.width >= 28 && r.height >= 10 && r.height < 40) candidates.push(r)
  }
  const out: DOMRect[] = []
  const pool = [...candidates]
  while (out.length < n && pool.length) {
    const i = Math.floor(rng() * pool.length)
    out.push(pool.splice(i, 1)[0]!)
  }
  return out
}

export function paintPaymentRedactions(
  root: HTMLElement,
  scenario: Parameters<typeof needlesFromScenario>[0],
  seed: number,
): number {
  clearPaymentRedactions(root)
  const rng = mulberry32(seed >>> 0)
  root.style.position = 'relative'
  const origin = root.getBoundingClientRect()
  const boxes: { x: number; y: number; w: number; h: number }[] = []

  for (const n of needlesFromScenario(scenario)) {
    if (rng() > n.p) continue
    for (const r of findNeedleRects(root, n.text)) {
      const padX = 4 + rng() * 14
      const padY = 1 + rng() * 5
      const trim = rng() > 0.55 ? rng() * r.width * 0.18 : 0
      boxes.push({
        x: r.left - origin.left - padX + trim,
        y: r.top - origin.top - padY + (rng() - 0.5) * 4,
        w: Math.max(32, r.width + padX * 2 - trim * 2),
        h: Math.max(13, r.height + padY * 2),
      })
    }
  }

  if (boxes.length < 2) {
    for (const r of randomBodyRects(root, rng, 2 + Math.floor(rng() * 2))) {
      boxes.push({
        x: r.left - origin.left - 6,
        y: r.top - origin.top - 2,
        w: r.width + 12,
        h: r.height + 6,
      })
    }
  } else if (rng() > 0.55) {
    for (const r of randomBodyRects(root, rng, rng() > 0.5 ? 1 : 2)) {
      boxes.push({
        x: r.left - origin.left - 8 + rng() * 6,
        y: r.top - origin.top - 3,
        w: r.width * (0.55 + rng() * 0.5) + 10,
        h: r.height + 7,
      })
    }
  }

  let i = 0
  for (const b of boxes) {
    const el = document.createElement('div')
    el.setAttribute('data-pay-redact', '1')
    el.style.cssText = `position:absolute;left:${b.x.toFixed(1)}px;top:${b.y.toFixed(1)}px;width:${b.w.toFixed(1)}px;height:${b.h.toFixed(1)}px;z-index:40;pointer-events:none;overflow:visible`
    el.innerHTML = brushMarkup(b.w, b.h, (seed + i * 97) >>> 0)
    root.appendChild(el)
    i += 1
  }
  return i
}
