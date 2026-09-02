import type { BankRegion, LocaleId } from '../types.ts'
import { pickCarrier } from '../engine/carriers.ts'
import { sampleAndroidPhone, sampleFontScale, sampleIphone } from '../engine/devices.ts'
import { formatClock } from '../engine/format.ts'
import { localeMeta, sampleLocale } from '../engine/languages.ts'
import { synthPerson } from '../engine/names.ts'
import { chance, pick, randInt, type Rng } from '../engine/random.ts'
import { maybeAvatar, pickPeerColor, pickPhoto, pickSkyWall } from './avatars.ts'
import { chatUi, NICKS, scriptsFor, type Author, type Script, type Turn } from './copy.ts'
import type { ChatMessage, ChatPeer, ChatScenario, MsgStatus, TgSkinId } from './types.ts'
import { skinById } from './skins.ts'

function pickRegion(rng: Rng, locale: LocaleId): BankRegion {
  switch (locale) {
    case 'it':
      return 'IT'
    case 'de':
      return 'DE'
    case 'fr':
      return 'FR'
    case 'es':
      return 'ES'
    case 'en':
      return chance(rng, 0.55) ? 'US' : 'GB'
    case 'pt':
      return 'BR'
    case 'hi':
      return 'IN'
    default:
      return 'EU'
  }
}

function initialsOf(name: string): string {
  const parts = name.replace(/[^\p{L}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean)
  const a = Array.from(parts[0] ?? 'A')[0] ?? 'A'
  const b = Array.from(parts[1] ?? '')[0]
  return `${a}${b ?? ''}`.toUpperCase()
}

function makePeer(rng: Rng, locale: LocaleId, name?: string): ChatPeer {
  const person = synthPerson(rng, locale)
  const nicks = NICKS[locale]
  const display =
    name ??
    (nicks && chance(rng, 0.28) ? pick(rng, nicks) : chance(rng, 0.45) ? person.given : person.full)
  const ui = chatUi(locale)
  const online = chance(rng, 0.34)
  const mins = randInt(rng, 2, 54)
  const lastSeen = online
    ? ui.online
    : chance(rng, 0.22)
      ? ui.lastJust
      : chance(rng, 0.45)
        ? ui.lastMin(mins)
        : ui.lastRecently
  return {
    id: `p-${Math.floor(rng() * 1e9).toString(36)}`,
    name: display,
    avatar: maybeAvatar(rng),
    initials: initialsOf(display),
    color: pickPeerColor(rng),
    lastSeen,
    online,
    verified: chance(rng, 0.04),
  }
}

function hhmm(date: Date, locale: string, clock24h: boolean): string {
  return formatClock(date.toISOString(), locale, { clock24h, ios: false })
}

const TEXT_EMOJI = ['🔥', '🙏', '😂', '✅', '💯', '🙌', '😎', '✨', '👍']
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu

function maybeTextEmoji(text: string, rng: Rng): string {
  const clean = text.replace(EMOJI_RE, '').replace(/[ \t]{2,}/g, ' ').trim() || text.trim()
  if (!chance(rng, 0.1)) return clean
  return `${clean} ${pick(rng, TEXT_EMOJI)}`
}

function waveform(rng: Rng, n = 28): number[] {
  return Array.from({ length: n }, () => 0.22 + rng() * 0.78)
}

function maxMemberIndex(script: Script): number {
  let max = 0
  for (const t of script.turns) {
    if ('a' in t && typeof t.a === 'number') max = Math.max(max, t.a)
  }
  return max
}

function authorOf(a: Author, members: ChatPeer[]): { from: 'me' | 'peer'; peer?: ChatPeer } {
  if (a === 'me') return { from: 'me' }
  if (a === 'them') return { from: 'peer', peer: members[0] }
  return { from: 'peer', peer: members[a] ?? members[0] }
}

function expandTurns(
  rng: Rng,
  script: Script,
  members: ChatPeer[],
  ui: ReturnType<typeof chatUi>,
  start: Date,
  bcp47: string,
  clock24h: boolean,
): ChatMessage[] {
  const out: ChatMessage[] = []
  let t = start.getTime()
  const texts: { i: number; text: string; author: string; color: string }[] = []

  for (let i = 0; i < script.turns.length; i++) {
    const turn = script.turns[i] as Turn
    t += randInt(rng, 20, 140) * 1000
    const time = hhmm(new Date(t), bcp47, clock24h)
    const id = `m${i}`

    if ('d' in turn) {
      out.push({ id, from: 'peer', kind: 'date', text: turn.d === 'today' ? ui.today : ui.yesterday })
      continue
    }
    if ('u' in turn) {
      out.push({ id, from: 'peer', kind: 'unread', text: ui.unread })
      continue
    }
    if ('s' in turn) {
      out.push({ id, from: 'peer', kind: 'service', text: turn.s })
      continue
    }

    const who = authorOf(turn.a, members)
    const status: MsgStatus | undefined = who.from === 'me' ? (chance(rng, 0.12) ? 'delivered' : 'read') : undefined
    const reactions = 'rx' in turn && turn.rx ? [{ emoji: turn.rx, count: 1 }] : undefined

    if ('v' in turn) {
      out.push({
        id,
        from: who.from,
        peerId: who.peer?.id,
        kind: 'voice',
        time,
        status,
        voiceDuration: turn.v,
        voiceProgress: turn.p ?? (who.from === 'me' ? 0 : chance(rng, 0.4) ? 1 : rng() * 0.6),
        waveform: waveform(rng),
        reactions,
      })
      continue
    }
    if ('ph' in turn) {
      const aspect = chance(rng, 0.48) ? 'port' : chance(rng, 0.55) ? 'land' : 'square'
      out.push({
        id,
        from: who.from,
        peerId: who.peer?.id,
        kind: 'photo',
        time,
        status,
        photo: pickPhoto(rng),
        photoAspect: aspect,
        text: turn.t,
        reactions,
      })
      continue
    }
    if ('st' in turn) {
      out.push({
        id,
        from: who.from,
        peerId: who.peer?.id,
        kind: 'sticker',
        time,
        status,
        sticker: turn.st,
      })
      continue
    }

    let reply: ChatMessage['reply']
    if ('r' in turn && turn.r != null) {
      const src = texts.find((x) => x.i === turn.r)
      if (src) reply = { author: src.author, text: src.text, color: src.color }
    }

    const text = maybeTextEmoji(turn.t, rng)
    const msg: ChatMessage = {
      id,
      from: who.from,
      peerId: who.peer?.id,
      kind: 'text',
      text,
      time,
      status,
      reply,
      forwardedFrom: 'fw' in turn ? turn.fw : undefined,
      edited: 'e' in turn ? turn.e : undefined,
      link: 'link' in turn ? turn.link : undefined,
      reactions,
    }
    out.push(msg)
    texts.push({
      i,
      text,
      author: who.from === 'me' ? ui.you : who.peer?.name ?? '',
      color: who.peer?.color ?? '#62AC55',
    })
  }
  return out
}

export type ChatGenOpts = {
  skinId: TgSkinId
  locale?: LocaleId | 'auto'
}

export function createChatScenario(rng: Rng, seed: number, opts: ChatGenOpts): ChatScenario {
  const loc = opts.locale && opts.locale !== 'auto' ? localeMeta(opts.locale) : sampleLocale(rng)
  const ui = chatUi(loc.id)
  const skin = skinById(opts.skinId)
  const device = skin.platform === 'ios' ? sampleIphone(rng) : sampleAndroidPhone(rng)
  const fontScale = sampleFontScale(rng, device.family)
  const allScripts = scriptsFor(loc.id).filter((s) => s.kind !== 'group')
  const pool = allScripts.length ? allScripts : scriptsFor('en').filter((s) => s.kind !== 'group')
  const photoScripts = pool.filter((s) => s.turns.some((t) => 'ph' in t))
  const script =
    photoScripts.length && chance(rng, 0.58) ? pick(rng, photoScripts) : pick(rng, pool)
  const kind = script.kind

  const members: ChatPeer[] =
    kind === 'group'
      ? Array.from({ length: maxMemberIndex(script) + 1 }, (_, i) =>
          makePeer(rng, loc.id, script.nicks?.[i]),
        )
      : [makePeer(rng, loc.id)]

  const peer: ChatPeer =
    kind === 'group'
      ? {
          id: `g-${seed.toString(16)}`,
          name: script.group ?? 'Group',
          avatar: maybeAvatar(rng),
          initials: initialsOf(script.group ?? 'G'),
          color: pickPeerColor(rng),
          lastSeen: ui.members(members.length + 1),
          online: false,
        }
      : members[0]!

  const now = Date.now()
  const ts = new Date(now - randInt(rng, 2, 90) * 60000)
  const start = new Date(ts.getTime() - randInt(rng, 8, 90) * 60000)
  const messages = expandTurns(rng, script, members, ui, start, loc.bcp47, loc.clock24h)

  const typing = kind === 'dm' && peer.online && chance(rng, 0.18)
  const region = pickRegion(rng, loc.id)
  const ios = device.family === 'iphone'
  const networkType = chance(rng, 0.48) ? 'wifi' as const : chance(rng, 0.55) ? '5g' as const : 'lte' as const
  const battery = randInt(rng, 22, 100)

  return {
    seed,
    id: `tg-${seed.toString(16)}`,
    kind,
    locale: loc.id,
    dir: loc.dir,
    bcp47: loc.bcp47,
    timezone: loc.timezone,
    clock24h: loc.clock24h,
    device,
    fontScale,
    peer,
    members,
    messages,
    composerDraft: chance(rng, 0.08) ? pick(rng, ['ok', 'arrivo', 'yes', 'va bene']).slice(0, 12) : '',
    typing,
    muted: chance(rng, 0.1),
    pinned: kind === 'group' && chance(rng, 0.35) ? messages.find((m) => m.kind === 'text')?.text : undefined,
    timestamp: ts.toISOString(),
    wallpaper: pickSkyWall(rng),
    battery,
    clock: formatClock(ts.toISOString(), loc.bcp47, {
      ios,
      timezone: loc.timezone,
      clock24h: loc.clock24h,
    }),
    signal: randInt(rng, 3, 4),
    carrier: pickCarrier(rng, loc.id, region),
    networkType,
    charging: battery < 90 && chance(rng, 0.22),
    dualSim: !ios && chance(rng, 0.28),
    showBatteryPct: !ios && chance(rng, 0.7),
    bluetooth: chance(rng, 0.18),
    focusMode: ios && chance(rng, 0.1),
  }
}
