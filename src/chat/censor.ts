export type Reveal = { left: string; mid: string; right: string }

export function revealEnds(text: string): Reveal {
  const chars = Array.from(text)
  const n = chars.length
  if (n <= 1) return { left: text, mid: '', right: '' }
  if (n <= 3) return { left: chars[0]!, mid: chars.slice(1).join(''), right: '' }
  const keepL = n <= 5 ? 1 : 2
  const keepR = n >= 8 ? 1 : 0
  return {
    left: chars.slice(0, keepL).join(''),
    mid: chars.slice(keepL, keepR ? n - keepR : n).join(''),
    right: keepR ? chars.slice(n - keepR).join('') : '',
  }
}

export type TextSpan = { start: number; end: number }

function pushSpan(spans: TextSpan[], start: number, end: number) {
  if (end - start < 2) return
  spans.push({ start, end })
}

function mergeSpans(spans: TextSpan[]): TextSpan[] {
  if (!spans.length) return []
  const sorted = [...spans].sort((a, b) => a.start - b.start || b.end - a.end)
  const out: TextSpan[] = [sorted[0]!]
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i]!
    const prev = out[out.length - 1]!
    if (cur.start <= prev.end) prev.end = Math.max(prev.end, cur.end)
    else out.push({ ...cur })
  }
  return out
}

function digitCount(s: string): number {
  return (s.match(/\d/g) ?? []).length
}

function isYear(s: string): boolean {
  return /^(19|20)\d{2}$/.test(s.trim())
}

function isClock(s: string): boolean {
  return /^\d{1,2}:\d{2}$/.test(s.trim())
}

const PII: RegExp[] = [
  /\b[A-Z]{2}\d{2}(?:[\s]?[A-Z0-9]){8,32}\b/g,
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  /@[A-Za-z][A-Za-z0-9_]{2,31}/g,
  /(?:\+|00)\s?(?:\d[\s().-]?){7,16}\d/g,
  /\b0\d(?:[\s().-]?\d){7,14}\b/g,
  /\b[3-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3,4}\b/g,
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  /\b[A-Z]{1,5}[-/]?\d{6,}\b/g,
  /\b\d{6,}\b/g,
]

function piiOk(raw: string): boolean {
  const t = raw.trim()
  if (t.length < 4) return false
  if (isClock(t) || isYear(t)) return false
  if (t.startsWith('@') && t.length < 4) return false
  if (/^\d+$/.test(t.replace(/[\s.-]/g, '')) && digitCount(t) < 6) return false
  if (digitCount(t) >= 6) return true
  if (t.includes('@') && !t.startsWith('@')) return true
  if (t.startsWith('@')) return true
  if (/^[A-Z]{2}\d{2}/.test(t.replace(/\s/g, ''))) return true
  return t.length >= 8
}

export function findPiiSpans(text: string): TextSpan[] {
  const spans: TextSpan[] = []
  const src = text ?? ''
  for (const proto of PII) {
    const re = new RegExp(proto.source, proto.flags)
    let m: RegExpExecArray | null
    while ((m = re.exec(src))) {
      if (piiOk(m[0])) pushSpan(spans, m.index, m.index + m[0].length)
      if (m[0].length === 0) re.lastIndex += 1
    }
  }
  return mergeSpans(spans)
}

export function findNameSpans(text: string, names: string[] = []): TextSpan[] {
  const spans: TextSpan[] = []
  const uniq = [...new Set((names ?? []).map((n) => n.trim()).filter((n) => n.length > 1))].sort(
    (a, b) => b.length - a.length,
  )
  const lower = (text ?? '').toLowerCase()
  for (const name of uniq) {
    const needle = name.toLowerCase()
    let from = 0
    while (from <= lower.length - needle.length) {
      const idx = lower.indexOf(needle, from)
      if (idx < 0) break
      const before = idx === 0 ? '' : text[idx - 1]!
      const after = idx + name.length >= text.length ? '' : text[idx + name.length]!
      const boundL = !before || /[^\p{L}\p{N}]/u.test(before)
      const boundR = !after || /[^\p{L}\p{N}]/u.test(after)
      if (boundL && boundR) pushSpan(spans, idx, idx + name.length)
      from = idx + needle.length
    }
  }
  return mergeSpans(spans)
}

export function findCensorSpans(text: string, names: string[] = []): TextSpan[] {
  const marked: TextSpan[] = []
  const src = text ?? ''
  const block = /█+/g
  let m: RegExpExecArray | null
  while ((m = block.exec(src))) pushSpan(marked, m.index, m.index + m[0].length)
  return mergeSpans([...findNameSpans(src, names), ...findPiiSpans(src), ...marked])
}

export type CensorPiece = { kind: 'text' | 'hide'; value: string }

export function splitCensored(text: string, names: string[] = []): CensorPiece[] {
  const src = text ?? ''
  const spans = findCensorSpans(src, names)
  if (!spans.length) return [{ kind: 'text', value: src }]
  const pieces: CensorPiece[] = []
  let cursor = 0
  for (const s of spans) {
    if (s.start > cursor) pieces.push({ kind: 'text', value: src.slice(cursor, s.start) })
    pieces.push({ kind: 'hide', value: src.slice(s.start, s.end) })
    cursor = s.end
  }
  if (cursor < src.length) pieces.push({ kind: 'text', value: src.slice(cursor) })
  return pieces
}
