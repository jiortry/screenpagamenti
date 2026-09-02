import { chance, pick, randInt, type Rng } from '../engine/random.ts'

function locked(token: string): boolean {
  const t = token.trim()
  if (t.length < 2) return true
  if (/https?:\/\//i.test(t) || t.includes('@')) return true
  if (/\d/.test(t) && t.replace(/\s/g, '').length >= 4) return true
  if (/\d/.test(t) && /[A-Z]/i.test(t)) return true
  if (/^[A-Z]{2}\d{2}/.test(t.replace(/\s/g, ''))) return true
  if (/[\u{1F300}-\u{1FAFF}]/u.test(t) && !/\p{L}/u.test(t)) return true
  return false
}

function words(text: string): { raw: string; lock: boolean }[] {
  return text.split(/(\s+)/).map((raw) => ({ raw, lock: /^\s+$/.test(raw) || locked(raw) }))
}

function join(parts: { raw: string }[]): string {
  return parts.map((p) => p.raw).join('')
}

function letterSpans(token: string): number[] {
  const idx: number[] = []
  for (let i = 0; i < token.length; i++) {
    if (/\p{L}/u.test(token[i]!)) idx.push(i)
  }
  return idx
}

function pickUnlocked(parts: { raw: string; lock: boolean }[], rng: Rng): number {
  const ids = parts.map((_, i) => i).filter((i) => !parts[i]!.lock && letterSpans(parts[i]!.raw).length >= 3)
  if (!ids.length) return -1
  return pick(rng, ids)
}

function transpose(token: string, rng: Rng): string {
  const ls = letterSpans(token)
  if (ls.length < 4) return token
  const k = randInt(rng, 1, ls.length - 2)
  const a = ls[k]!
  const b = ls[k + 1]!
  const ch = [...token]
  const tmp = ch[a]!
  ch[a] = ch[b]!
  ch[b] = tmp
  return ch.join('')
}

function dropLetter(token: string, rng: Rng): string {
  const ls = letterSpans(token)
  if (ls.length < 4) return token
  const i = pick(rng, ls.slice(1, -1))
  return token.slice(0, i) + token.slice(i + 1)
}

function doubleLetter(token: string, rng: Rng): string {
  const ls = letterSpans(token)
  if (ls.length < 3) return token
  const i = pick(rng, ls)
  return token.slice(0, i + 1) + token[i] + token.slice(i + 1)
}

const NEIGH: Record<string, string> = {
  a: 'sqw', b: 'vgn', c: 'xvf', d: 'srf', e: 'wrd', f: 'dgc', g: 'fth',
  h: 'gyj', i: 'uko', j: 'hki', k: 'jlo', l: 'kop', m: 'njk', n: 'bhm',
  o: 'ilp', p: 'ol', q: 'wa', r: 'etf', s: 'adw', t: 'ryg', u: 'yji',
  v: 'cgb', w: 'qes', x: 'zsc', y: 'tuh', z: 'ax',
}

function neighbor(token: string, rng: Rng): string {
  const ls = letterSpans(token)
  if (!ls.length) return token
  const i = pick(rng, ls)
  const ch = token[i]!
  const low = ch.toLowerCase()
  const opts = NEIGH[low]
  if (!opts) return token
  const n = opts[randInt(rng, 0, opts.length - 1)]!
  const repl = ch === ch.toUpperCase() ? n.toUpperCase() : n
  return token.slice(0, i) + repl + token.slice(i + 1)
}

function oneTypo(text: string, rng: Rng): string {
  const parts = words(text)
  const i = pickUnlocked(parts, rng)
  if (i < 0) return text
  const fn = pick(rng, [transpose, dropLetter, doubleLetter, neighbor])
  parts[i] = { ...parts[i]!, raw: fn(parts[i]!.raw, rng), lock: true }
  return join(parts)
}

function lowerStart(text: string): string {
  const i = text.search(/\p{L}/u)
  if (i < 0) return text
  const ch = text[i]!
  if (ch !== ch.toUpperCase() || ch === ch.toLowerCase()) return text
  return text.slice(0, i) + ch.toLowerCase() + text.slice(i + 1)
}

function stickyCaps(text: string, rng: Rng): string {
  const parts = words(text)
  const i = parts.findIndex((p) => !p.lock && letterSpans(p.raw).length >= 2)
  if (i < 0) return text
  if (chance(rng, 0.45)) {
    parts[i] = { ...parts[i]!, raw: parts[i]!.raw.toUpperCase() }
  } else {
    const w = parts[i]!.raw
    const n = Math.min(w.length, randInt(rng, 2, 3))
    parts[i] = { ...parts[i]!, raw: w.slice(0, n).toUpperCase() + w.slice(n) }
  }
  return join(parts)
}

function midCap(text: string, rng: Rng): string {
  const parts = words(text)
  const i = pickUnlocked(parts, rng)
  if (i < 0) return text
  const w = parts[i]!.raw
  const ls = letterSpans(w).filter((x) => x > 0)
  if (!ls.length) return text
  const k = pick(rng, ls)
  parts[i] = { ...parts[i]!, raw: w.slice(0, k) + w[k]!.toUpperCase() + w.slice(k + 1) }
  return join(parts)
}

function toCapsLock(text: string): string {
  return words(text)
    .map((p) => (p.lock ? p.raw : p.raw.replace(/\p{L}+/gu, (w) => w.toUpperCase())))
    .join('')
}

function dropAccents(text: string, rng: Rng): string {
  const map: Record<string, string> = {
    à: 'a', á: 'a', â: 'a', ä: 'a',
    è: 'e', é: 'e', ê: 'e', ë: 'e',
    ì: 'i', í: 'i', î: 'i', ï: 'i',
    ò: 'o', ó: 'o', ô: 'o', ö: 'o',
    ù: 'u', ú: 'u', û: 'u', ü: 'u',
    À: 'A', È: 'E', É: 'E', Ì: 'I', Ò: 'O', Ù: 'U',
  }
  return [...text]
    .map((ch) => (map[ch] && chance(rng, 0.7) ? map[ch]! : ch))
    .join('')
}

type Pair = [RegExp, string]

const GRAMMAR: Record<string, Pair[]> = {
  it: [
    [/\bqual è\b/gi, "qual'è"],
    [/\bnon\b/g, 'nn'],
    [/\bperché\b/gi, 'perche'],
    [/\bc'è\b/gi, 'ce'],
    [/\bpo'\b/g, 'po'],
    [/\bc'era\b/gi, 'cera'],
    [/\bho\b/g, 'o'],
    [/\bhai\b/g, 'ai'],
    [/\ba ho\b/gi, 'aho'],
  ],
  en: [
    [/\bthe\b/g, 'teh'],
    [/\byou're\b/gi, 'your'],
    [/\bits\b/g, "it's"],
    [/\btheir\b/gi, 'there'],
    [/\bbecause\b/gi, 'becouse'],
    [/\bgoing to\b/gi, 'gonna'],
    [/\band\b/g, 'adn'],
  ],
  es: [
    [/\bque\b/g, 'q'],
    [/\bporque\b/gi, 'porke'],
    [/\btambién\b/gi, 'tambien'],
    [/\bmás\b/g, 'mas'],
  ],
  fr: [
    [/\bc'est\b/gi, 'cest'],
    [/\bça\b/g, 'ca'],
    [/\best\b/g, 'é'],
    [/\bpeut-être\b/gi, 'peut etre'],
  ],
  de: [
    [/\bdas\b/g, 'dass'],
    [/\bnicht\b/g, 'nich'],
    [/\beine\b/g, 'ne'],
  ],
  pt: [
    [/\bnão\b/gi, 'nao'],
    [/\bvocê\b/gi, 'vc'],
    [/\bestá\b/gi, 'esta'],
  ],
}

function grammar(text: string, rng: Rng, locale: string): string {
  const pairs = GRAMMAR[locale] ?? GRAMMAR.en!
  const hits = pairs.filter(([re]) => new RegExp(re.source, re.flags).test(text))
  if (!hits.length) return text
  const [re, to] = pick(rng, hits)
  return text.replace(new RegExp(re.source, re.flags), to)
}

const STRETCH = /^(ok+|sì+|si+|no+|yes+|yeah+|u+hm*|dai+|wait+|lol+|ah+|eh+|boh+|vale+|ja+|pls+|bro+)$/i

function stretch(text: string, rng: Rng): string {
  const parts = words(text)
  const i = [...parts.keys()].reverse().find((k) => !parts[k]!.lock && STRETCH.test(parts[k]!.raw.replace(/[^a-zA-Zàèéìòùì]/g, '')))
  if (i == null) return text
  const w = parts[i]!.raw
  const last = [...w].reverse().find((ch) => /\p{L}/u.test(ch))
  if (!last) return text
  parts[i] = { ...parts[i]!, raw: w + last.repeat(randInt(rng, 1, 3)) }
  return join(parts)
}

function doubleSpace(text: string, rng: Rng): string {
  const idx = [...text].map((ch, i) => (ch === ' ' ? i : -1)).filter((i) => i >= 0)
  if (!idx.length) return text
  const i = pick(rng, idx)
  return text.slice(0, i) + '  ' + text.slice(i + 1)
}

function smash(text: string, rng: Rng): string {
  const parts = words(text)
  const ids = parts.map((_, i) => i).filter((i) => parts[i]!.raw === ' ' && i > 0 && i < parts.length - 1)
  if (!ids.length) return text
  const i = pick(rng, ids)
  return join(parts.filter((_, k) => k !== i))
}

function extraPunct(text: string, rng: Rng): string {
  const trim = text.replace(/\s+$/, '')
  if (/[!?…]$/.test(trim)) return trim + pick(rng, ['?', '!', '??', '!!'])
  return trim + pick(rng, ['??', '!', '..', '...'])
}

function p(rng: Rng, base: number, slop: number): boolean {
  return chance(rng, Math.min(0.78, base * slop))
}

export function peerSlop(rng: Rng): number {
  if (chance(rng, 0.2)) return 1.5
  if (chance(rng, 0.28)) return 0.42
  return 1
}

export function messIncoming(text: string, rng: Rng, locale = 'en', slop = 1): string {
  const src = text.trim()
  if (src.length < 2) return text
  if (/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+$/u.test(src) && !/\p{L}/u.test(src)) return text

  let out = src
  if (p(rng, 0.055, slop) && letterSpans(out).length >= 3) {
    if (p(rng, 0.35, 1)) out = oneTypo(out, rng)
    return toCapsLock(out)
  }
  if (p(rng, 0.1, slop)) out = grammar(out, rng, locale)
  if (p(rng, 0.12, slop) && /[àáèéìíòóùúäöüÀÈÉÌÒÙ]/.test(out)) out = dropAccents(out, rng)
  if (p(rng, 0.22, slop)) out = oneTypo(out, rng)
  if (p(rng, 0.07, slop)) out = stretch(out, rng)
  if (p(rng, 0.05, slop)) out = doubleSpace(out, rng)
  if (p(rng, 0.04, slop)) out = smash(out, rng)
  if (p(rng, 0.06, slop) && out.length > 4) out = extraPunct(out, rng)
  if (p(rng, 0.08, slop)) out = stickyCaps(out, rng)
  else if (p(rng, 0.26, slop)) out = lowerStart(out)
  else if (p(rng, 0.045, slop)) out = midCap(out, rng)
  return out
}
