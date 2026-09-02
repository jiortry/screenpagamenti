import type { Appearance, Institution } from '../types.ts'
import type { ThemeTokens } from './themes.ts'

export type BrandProfile = {
  icon?: string
  logoBg: string
  logoPad: number
  logoRadius: number
  preferDark: boolean
  headerBg?: string
  headerText?: string
  accent?: string
  button?: string
  surface?: string
  font?: string
}

const ICON = (id: string) => `/logos/icons/${id}.png`

const PROFILES: Record<string, BrandProfile> = {
  'intesa-sanpaolo': {
    icon: ICON('intesa-sanpaolo'),
    logoBg: '#ffffff',
    logoPad: 4,
    logoRadius: 10,
    preferDark: false,
    accent: '#258900',
    button: '#258900',
    headerBg: '#258900',
    headerText: '#ffffff',
  },
  unicredit: {
    icon: ICON('unicredit'),
    logoBg: '#ffffff',
    logoPad: 4,
    logoRadius: 10,
    preferDark: false,
    accent: '#E2001A',
    button: '#E2001A',
    headerBg: '#E2001A',
    headerText: '#ffffff',
  },
  fineco: {
    icon: ICON('fineco'),
    logoBg: '#ffffff',
    logoPad: 4,
    logoRadius: 10,
    preferDark: false,
    accent: '#00549F',
    button: '#00549F',
  },
  chase: {
    icon: ICON('chase'),
    logoBg: '#117ACA',
    logoPad: 5,
    logoRadius: 12,
    preferDark: false,
    accent: '#117ACA',
    button: '#117ACA',
    headerBg: '#117ACA',
    headerText: '#ffffff',
  },
  'bank-of-america': {
    icon: ICON('bank-of-america'),
    logoBg: '#ffffff',
    logoPad: 4,
    logoRadius: 10,
    preferDark: false,
    accent: '#E31837',
    button: '#012169',
    headerBg: '#012169',
    headerText: '#ffffff',
  },
  'wells-fargo': {
    icon: ICON('wells-fargo'),
    logoBg: '#D71E28',
    logoPad: 5,
    logoRadius: 12,
    preferDark: false,
    accent: '#D71E28',
    button: '#D71E28',
    headerBg: '#D71E28',
    headerText: '#ffffff',
  },
  revolut: {
    icon: ICON('revolut'),
    logoBg: '#191C1F',
    logoPad: 5,
    logoRadius: 12,
    preferDark: true,
    accent: '#0075EB',
    button: '#0075EB',
    headerBg: '#191C1F',
    headerText: '#ffffff',
    surface: '#252A2F',
  },
  n26: {
    icon: ICON('n26'),
    logoBg: '#36A18B',
    logoPad: 5,
    logoRadius: 12,
    preferDark: false,
    accent: '#36A18B',
    button: '#36A18B',
    headerBg: '#36A18B',
    headerText: '#ffffff',
  },
  'deutsche-bank': {
    icon: ICON('deutsche-bank'),
    logoBg: '#0018A8',
    logoPad: 5,
    logoRadius: 10,
    preferDark: false,
    accent: '#0018A8',
    button: '#0018A8',
    headerBg: '#0018A8',
    headerText: '#ffffff',
  },
  commerzbank: {
    icon: ICON('commerzbank'),
    logoBg: '#FFE600',
    logoPad: 4,
    logoRadius: 10,
    preferDark: false,
    accent: '#FFE600',
    button: '#002E3C',
    headerBg: '#002E3C',
    headerText: '#FFE600',
  },
  'bnp-paribas': {
    icon: ICON('bnp-paribas'),
    logoBg: '#00915A',
    logoPad: 5,
    logoRadius: 10,
    preferDark: false,
    accent: '#00915A',
    button: '#00915A',
    headerBg: '#00915A',
    headerText: '#ffffff',
  },
  'societe-generale': {
    icon: ICON('societe-generale'),
    logoBg: '#ffffff',
    logoPad: 4,
    logoRadius: 10,
    preferDark: false,
    accent: '#E60028',
    button: '#000000',
    headerBg: '#000000',
    headerText: '#ffffff',
  },
  barclays: {
    icon: ICON('barclays'),
    logoBg: '#00AEEF',
    logoPad: 5,
    logoRadius: 10,
    preferDark: false,
    accent: '#00AEEF',
    button: '#00AEEF',
    headerBg: '#00AEEF',
    headerText: '#ffffff',
  },
  hsbc: {
    icon: ICON('hsbc'),
    logoBg: '#DB0011',
    logoPad: 5,
    logoRadius: 10,
    preferDark: false,
    accent: '#DB0011',
    button: '#DB0011',
    headerBg: '#DB0011',
    headerText: '#ffffff',
  },
  santander: {
    icon: ICON('santander'),
    logoBg: '#EC0000',
    logoPad: 5,
    logoRadius: 12,
    preferDark: false,
    accent: '#EC0000',
    button: '#EC0000',
    headerBg: '#EC0000',
    headerText: '#ffffff',
  },
  bbva: {
    icon: ICON('bbva'),
    logoBg: '#004481',
    logoPad: 5,
    logoRadius: 10,
    preferDark: false,
    accent: '#004481',
    button: '#004481',
    headerBg: '#004481',
    headerText: '#ffffff',
  },
  paypal: {
    icon: ICON('paypal'),
    logoBg: '#ffffff',
    logoPad: 4,
    logoRadius: 12,
    preferDark: false,
    accent: '#003087',
    button: '#0070BA',
    headerBg: '#0070BA',
    headerText: '#ffffff',
  },
  'apple-pay': {
    icon: ICON('apple-pay'),
    logoBg: '#000000',
    logoPad: 5,
    logoRadius: 12,
    preferDark: true,
    accent: '#000000',
    button: '#000000',
    headerBg: '#000000',
    headerText: '#ffffff',
    surface: '#1C1C1E',
  },
  'google-pay': {
    icon: ICON('google-pay'),
    logoBg: '#ffffff',
    logoPad: 4,
    logoRadius: 12,
    preferDark: false,
    accent: '#4285F4',
    button: '#1A73E8',
    headerBg: '#ffffff',
    headerText: '#202124',
  },
  venmo: {
    icon: ICON('venmo'),
    logoBg: '#3D95CE',
    logoPad: 5,
    logoRadius: 14,
    preferDark: false,
    accent: '#3D95CE',
    button: '#3D95CE',
    headerBg: '#3D95CE',
    headerText: '#ffffff',
  },
  'cash-app': {
    icon: ICON('cash-app'),
    logoBg: '#00D632',
    logoPad: 5,
    logoRadius: 14,
    preferDark: true,
    accent: '#00D632',
    button: '#00D632',
    headerBg: '#00D632',
    headerText: '#000000',
    surface: '#1A1A1A',
  },
  wise: {
    icon: ICON('wise'),
    logoBg: '#9FE870',
    logoPad: 5,
    logoRadius: 12,
    preferDark: false,
    accent: '#163300',
    button: '#163300',
    headerBg: '#9FE870',
    headerText: '#163300',
  },
  'western-union': {
    icon: ICON('western-union'),
    logoBg: '#FFDD00',
    logoPad: 4,
    logoRadius: 10,
    preferDark: false,
    accent: '#FFDD00',
    button: '#000000',
    headerBg: '#FFDD00',
    headerText: '#000000',
  },
  binance: {
    icon: ICON('binance'),
    logoBg: '#1E2329',
    logoPad: 5,
    logoRadius: 12,
    preferDark: true,
    accent: '#F0B90B',
    button: '#F0B90B',
    headerBg: '#1E2329',
    headerText: '#F0B90B',
    surface: '#2B3139',
  },
  coinbase: {
    icon: ICON('coinbase'),
    logoBg: '#0052FF',
    logoPad: 5,
    logoRadius: 14,
    preferDark: false,
    accent: '#0052FF',
    button: '#0052FF',
    headerBg: '#0052FF',
    headerText: '#ffffff',
  },
  kraken: {
    icon: ICON('kraken'),
    logoBg: '#5741D9',
    logoPad: 5,
    logoRadius: 12,
    preferDark: true,
    accent: '#5741D9',
    button: '#5741D9',
    headerBg: '#0B0B0F',
    headerText: '#ffffff',
    surface: '#1A1A22',
  },
  'crypto-com': {
    icon: ICON('crypto-com'),
    logoBg: '#002D74',
    logoPad: 5,
    logoRadius: 12,
    preferDark: true,
    accent: '#1199FA',
    button: '#1199FA',
    headerBg: '#002D74',
    headerText: '#ffffff',
    surface: '#0F1A2E',
  },
  visa: {
    icon: ICON('visa'),
    logoBg: '#1A1F71',
    logoPad: 5,
    logoRadius: 10,
    preferDark: false,
    accent: '#1A1F71',
    button: '#1A1F71',
    headerBg: '#1A1F71',
    headerText: '#ffffff',
  },
  mastercard: {
    icon: ICON('mastercard'),
    logoBg: '#000000',
    logoPad: 5,
    logoRadius: 10,
    preferDark: true,
    accent: '#EB001B',
    button: '#EB001B',
    headerBg: '#1A1A1A',
    headerText: '#ffffff',
    surface: '#262626',
  },
}

const DEFAULT_PROFILE: BrandProfile = {
  logoBg: '#ffffff',
  logoPad: 4,
  logoRadius: 10,
  preferDark: false,
}

export function brandProfile(institution: Institution): BrandProfile {
  return PROFILES[institution.id] ?? {
    ...DEFAULT_PROFILE,
    icon: institution.icon ?? institution.logo,
  }
}

export function brandedTheme(
  base: ThemeTokens,
  institution: Institution,
  appearance: Appearance,
): ThemeTokens {
  const brand = brandProfile(institution)
  const dark = appearance === 'dark' || brand.preferDark
  const next = { ...base }
  if (brand.accent) {
    next.accent = brand.accent
    if (dark) next.accent2 = brand.accent
  }
  if (brand.button) {
    next.button = brand.button
    next.nav = brand.button
  }
  if (brand.surface && dark) next.surface = brand.surface
  if (brand.font) next.font = brand.font
  if (dark && brand.preferDark) {
    next.bg = brand.surface ?? '#121212'
    next.bg2 = brand.headerBg ?? '#1A1A1A'
    next.text = '#F5F5F5'
    next.muted = '#A3A3A3'
    next.line = '#2E2E2E'
    next.chip = '#2A2A2A'
    next.buttonText = brand.headerText ?? '#FFFFFF'
  }
  return next
}

export function brandLogoSrc(institution: Institution): string {
  const brand = brandProfile(institution)
  return brand.icon ?? institution.icon ?? institution.logo
}
