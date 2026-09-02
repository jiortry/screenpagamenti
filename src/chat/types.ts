import type { DeviceSpec, LocaleId, NetworkType, TextDir } from '../types.ts'

export const TG_SKIN_IDS = [
  'ios-day',
  'ios-tinted',
  'ios-night',
  'android-classic',
  'android-arctic',
  'android-night',
] as const

export type TgSkinId = (typeof TG_SKIN_IDS)[number]

export const TG_WALL_IDS = [
  'auto',
  'doodle-day',
  'doodle-night',
  'solid',
  'gradient',
  'photo-0',
  'photo-1',
  'photo-2',
  'photo-3',
  'photo-4',
  'photo-5',
  'photo-6',
  'photo-7',
  'photo-8',
  'photo-9',
  'photo-10',
  'photo-11',
  'photo-12',
  'photo-13',
] as const

export type TgWallId = (typeof TG_WALL_IDS)[number]

export type ChatKind = 'dm' | 'group'

export type MsgStatus = 'sent' | 'delivered' | 'read'

export type ChatPeer = {
  id: string
  name: string
  avatar: string | null
  initials: string
  color: string
  lastSeen: string
  online: boolean
  verified?: boolean
}

export type ChatReply = {
  author: string
  text: string
  color: string
}

export type ChatMessage = {
  id: string
  from: 'me' | 'peer'
  peerId?: string
  kind: 'text' | 'voice' | 'photo' | 'sticker' | 'service' | 'date' | 'unread'
  text?: string
  time?: string
  reply?: ChatReply
  forwardedFrom?: string
  voiceDuration?: string
  voiceProgress?: number
  photo?: string
  photoAspect?: 'land' | 'port' | 'square' | 'screen'
  sticker?: string
  status?: MsgStatus
  reactions?: { emoji: string; count: number }[]
  edited?: boolean
  link?: { title: string; site: string; desc: string }
  waveform?: number[]
}

export type ChatScenario = {
  seed: number
  id: string
  kind: ChatKind
  locale: LocaleId
  dir: TextDir
  bcp47: string
  timezone: string
  clock24h: boolean
  device: DeviceSpec
  fontScale: number
  peer: ChatPeer
  members: ChatPeer[]
  messages: ChatMessage[]
  composerDraft: string
  typing: boolean
  muted: boolean
  pinned?: string
  timestamp: string
  wallpaper?: Exclude<TgWallId, 'auto'>
  redactNames?: boolean
  battery: number
  clock: string
  signal: number
  carrier: string
  networkType: NetworkType
  charging: boolean
  dualSim: boolean
  showBatteryPct: boolean
  bluetooth: boolean
  focusMode: boolean
}

export type TgSkin = {
  id: TgSkinId
  label: string
  platform: 'ios' | 'android'
  appearance: 'light' | 'dark'
  headerBg: string
  headerFg: string
  headerSub: string
  accent: string
  inBg: string
  outBg: string
  inFg: string
  outFg: string
  inTime: string
  outTime: string
  check: string
  checkRead: string
  composerBg: string
  composerFg: string
  composerPlaceholder: string
  composerInput: string
  sendBg: string
  sendFg: string
  icon: string
  dateBg: string
  dateFg: string
  unreadBg: string
  unreadFg: string
  serviceFg: string
  wallpaper: Exclude<TgWallId, 'auto'>
  statusColor: string
  navColor: string
  hairline: string
  replyBar: string
  voicePlay: string
  voiceWave: string
  voiceWavePlayed: string
}
