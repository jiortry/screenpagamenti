import { pickCarrier } from '../engine/carriers.ts'
import { sampleAndroidPhone, sampleFontScale, sampleIphone } from '../engine/devices.ts'
import { formatClock } from '../engine/format.ts'
import { localeMeta } from '../engine/languages.ts'
import { maybeAvatar, pickPeerColor, pickSkyWall } from './avatars.ts'
import { chatUi } from './copy.ts'
import type { ReviewScript } from './openrouter.ts'
import { chance, pick, randInt, type Rng } from '../engine/random.ts'
import { skinById } from './skins.ts'
import type { ChatMessage, ChatScenario, MsgStatus, TgSkinId } from './types.ts'

function waveform(rng: Rng, n = 28): number[] {
  return Array.from({ length: n }, () => 0.22 + rng() * 0.78)
}

function hhmm(date: Date, bcp47: string, clock24h: boolean): string {
  return formatClock(date.toISOString(), bcp47, { clock24h, ios: false })
}

const AFTER_PAY_EMOJI = ['🔥', '🙏', '😂', '✅', '💯', '🙌', '😎', '✨']
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu

function stripEmojis(text: string): string {
  return text.replace(EMOJI_RE, '').replace(/[ \t]{2,}/g, ' ').trim()
}

function maybeEmoji(text: string, rng: Rng): string {
  const clean = stripEmojis(text) || text.trim() || 'ok'
  if (!chance(rng, 0.1)) return clean
  return `${clean} ${pick(rng, AFTER_PAY_EMOJI)}`
}

function stripNames(text: string, names: string[]): string {
  let out = text
  for (const n of names) {
    if (n.length < 2) continue
    const re = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    out = out.replace(re, '██')
  }
  return out
}

export function assembleReviewChat(
  rng: Rng,
  seed: number,
  opts: { skinId: TgSkinId; script: ReviewScript; paymentPng: string | null },
): ChatScenario {
  const loc = localeMeta('en')
  const ui = chatUi('en')
  const skin = skinById(opts.skinId)
  const device = skin.platform === 'ios' ? sampleIphone(rng) : sampleAndroidPhone(rng)
  const fontScale = sampleFontScale(rng, device.family)
  const name = opts.script.peerName || 'Alex Morgan'
  const parts = name.split(/\s+/).filter(Boolean)
  const banned = [...new Set([name, ...parts])].filter((p) => p.length > 1)

  const allowVoice = chance(rng, 0.42)
  const extraRx = ['👍', '🔥', '❤️', '😂', '🙏', '✅'] as const
  const rollRx = () =>
    chance(rng, 0.04) ? [{ emoji: pick(rng, extraRx), count: 1 }] : undefined

  const peerId = `p-${seed.toString(16)}`
  const peer = {
    id: peerId,
    name,
    avatar: maybeAvatar(rng),
    initials: '•',
    color: pickPeerColor(rng),
    lastSeen: opts.script.online ? ui.online : ui.lastRecently,
    online: Boolean(opts.script.online),
  }

  const now = Date.now()
  const ts = new Date(now - randInt(rng, 3, 80) * 60000)
  let t = ts.getTime() - randInt(rng, 12, 70) * 60000
  const messages: ChatMessage[] = [
    { id: 'd0', from: 'peer', kind: 'date', text: ui.today },
  ]

  const allowPayPhoto = Boolean(opts.paymentPng)
  let payUsed = false

  for (let i = 0; i < opts.script.turns.length; i++) {
    const turn = opts.script.turns[i]!
    t += randInt(rng, 18, 110) * 1000
    const time = hhmm(new Date(t), loc.bcp47, loc.clock24h)
    const from = turn.from === 'me' ? 'me' : 'peer'
    const status: MsgStatus | undefined = from === 'me' ? (chance(rng, 0.14) ? 'delivered' : 'read') : undefined

    if (turn.kind === 'pay') {
      if (!allowPayPhoto || payUsed || !opts.paymentPng) continue
      payUsed = true
      messages.push({
        id: `pay-${i}`,
        from,
        peerId: from === 'peer' ? peerId : undefined,
        kind: 'photo',
        time,
        status,
        photo: opts.paymentPng,
        photoAspect: 'screen',
        reactions: rollRx(),
      })
      continue
    }

    if (turn.kind === 'voice') {
      if (!allowVoice) continue
      messages.push({
        id: `v-${i}`,
        from,
        peerId: from === 'peer' ? peerId : undefined,
        kind: 'voice',
        time,
        status,
        voiceDuration: turn.duration ?? `0:0${randInt(rng, 4, 9)}`,
        voiceProgress: from === 'me' ? 0 : chance(rng, 0.4) ? 1 : rng() * 0.5,
        waveform: waveform(rng),
        reactions: rollRx(),
      })
      continue
    }

    let text = maybeEmoji(stripNames((turn.text ?? 'ok').trim(), banned), rng)
    if (!text) text = 'ok'

    messages.push({
      id: `t-${i}`,
      from,
      peerId: from === 'peer' ? peerId : undefined,
      kind: 'text',
      text,
      time,
      status,
      reactions: rollRx(),
    })
  }

  if (allowPayPhoto && !payUsed && opts.paymentPng) {
    const insertAt = Math.max(2, Math.min(messages.length - 1, 4))
    const time = messages[insertAt]?.time ?? hhmm(ts, loc.bcp47, loc.clock24h)
    messages.splice(insertAt, 0, {
      id: 'pay-fallback',
      from: 'me',
      kind: 'photo',
      time,
      status: 'read',
      photo: opts.paymentPng,
      photoAspect: 'screen',
      reactions: rollRx(),
    })
  }

  const ios = device.family === 'iphone'
  const battery = randInt(rng, 24, 100)

  return {
    seed,
    id: `rev-${seed.toString(16)}`,
    kind: 'dm',
    locale: 'en',
    dir: 'ltr',
    bcp47: loc.bcp47,
    timezone: loc.timezone,
    clock24h: loc.clock24h,
    device,
    fontScale,
    peer,
    members: [peer],
    messages,
    composerDraft: '',
    typing: false,
    muted: false,
    timestamp: ts.toISOString(),
    wallpaper: pickSkyWall(rng),
    redactNames: true,
    battery,
    clock: formatClock(ts.toISOString(), loc.bcp47, {
      ios,
      timezone: loc.timezone,
      clock24h: loc.clock24h,
    }),
    signal: randInt(rng, 3, 4),
    carrier: pickCarrier(rng, 'en', chance(rng, 0.5) ? 'US' : 'GB'),
    networkType: chance(rng, 0.5) ? 'wifi' : chance(rng, 0.55) ? '5g' : 'lte',
    charging: battery < 90 && chance(rng, 0.2),
    dualSim: !ios && chance(rng, 0.22),
    showBatteryPct: !ios && chance(rng, 0.68),
    bluetooth: chance(rng, 0.16),
    focusMode: ios && chance(rng, 0.08),
  }
}
