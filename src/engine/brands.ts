import type { Appearance, Institution } from '../types.ts'
import type { ThemeTokens } from './themes.ts'

export type BrandProfile = {
  icon?: string
  logoBg: string
  logoPad: number
  logoRadius: number
  preferDark: boolean
  font: string
  radius: number
  headerBg: string
  headerText: string
  headerStyle: 'full' | 'compact'
  bg: string
  bg2: string
  surface: string
  text: string
  muted: string
  line: string
  accent: string
  accent2: string
  button: string
  buttonText: string
  chip: string
  success: string
  danger: string
  warning: string
  /** System status bar fill — only #FFFFFF or #000000. */
  statusBarBg: '#FFFFFF' | '#000000'
  /** Clock / signal / battery — opposite of the fill. */
  statusBarFg: '#000000' | '#FFFFFF'
  amount: string
}

const I = (id: string) => `/logos/icons/${id}.png`

const SYS = '-apple-system, "SF Pro Text", Roboto, "Noto Sans", sans-serif'
const INTER = 'Inter, "SF Pro Text", Roboto, "Noto Sans", sans-serif'
const MANROPE = 'Manrope, "SF Pro Text", Roboto, "Noto Sans", sans-serif'
const OUTFIT = 'Outfit, Roboto, "Noto Sans", sans-serif'
const SORA = 'Sora, Roboto, "Noto Sans", sans-serif'
const IBM = '"IBM Plex Sans", Roboto, "Noto Sans", sans-serif'
const DM = '"DM Sans", Roboto, "Noto Sans", sans-serif'

type BrandInput = {
  logoBg: string
  logoPad: number
  logoRadius: number
  preferDark: boolean
  bg: string
  surface: string
  text: string
  muted: string
  line: string
  accent: string
  button: string
  buttonText: string
  font?: string
  radius?: number
  headerStyle?: 'full' | 'compact'
  accent2?: string
  warning?: string
  bg2?: string
  chip?: string
  success?: string
  danger?: string
  headerBg?: string
  headerText?: string
  amount?: string
}

function mk(id: string, p: BrandInput): BrandProfile {
  const dark = p.preferDark
  const statusBarBg: '#FFFFFF' | '#000000' = dark ? '#000000' : '#FFFFFF'
  const statusBarFg: '#000000' | '#FFFFFF' = dark ? '#FFFFFF' : '#000000'
  return {
    icon: I(id),
    font: p.font ?? SYS,
    radius: p.radius ?? 12,
    headerStyle: p.headerStyle ?? 'compact',
    logoBg: p.logoBg,
    logoPad: p.logoPad,
    logoRadius: p.logoRadius,
    preferDark: dark,
    headerBg: p.headerBg ?? (dark ? '#000000' : '#FFFFFF'),
    headerText: p.headerText ?? (dark ? '#FFFFFF' : p.text),
    bg: p.bg,
    bg2: p.bg2 ?? p.bg,
    surface: p.surface,
    text: p.text,
    muted: p.muted,
    line: p.line,
    accent: p.accent,
    accent2: p.accent2 ?? p.accent,
    button: p.button,
    buttonText: p.buttonText,
    chip: p.chip ?? (dark ? '#2A2A2A' : '#F3F4F6'),
    success: p.success ?? '#16A34A',
    danger: p.danger ?? '#DC2626',
    warning: p.warning ?? '#D97706',
    statusBarBg,
    statusBarFg,
    amount: p.amount ?? (dark ? '#FFFFFF' : '#111111'),
  }
}

const PROFILES: Record<string, BrandProfile> = {
  'intesa-sanpaolo': mk('intesa-sanpaolo', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    bg: '#F4F5F4', surface: '#fff', text: '#1A1A1A', muted: '#5F6B5F', line: '#E4EAE4',
    accent: '#258900', button: '#258900', buttonText: '#fff',
    success: '#258900',
  }),
  unicredit: mk('unicredit', {
    logoBg: '#fff', logoPad: 3, logoRadius: 6, preferDark: false,
    bg: '#F7F7F7', surface: '#fff', text: '#1A1A1A', muted: '#6B6B6B', line: '#E8E8E8',
    accent: '#E2001A', button: '#E2001A', buttonText: '#fff',
    radius: 8, font: IBM,
  }),
  fineco: mk('fineco', {
    logoBg: '#fff', logoPad: 3, logoRadius: 6, preferDark: false,
    bg: '#F3F6FA', surface: '#fff', text: '#0F2744', muted: '#5A6E82', line: '#DCE4EE',
    accent: '#00549F', button: '#00549F', buttonText: '#fff',
    radius: 8, font: IBM,
  }),
  chase: mk('chase', {
    logoBg: '#117ACA', logoPad: 4, logoRadius: 8, preferDark: false,
    bg: '#F5F7FA', surface: '#fff', text: '#0A2540', muted: '#5A6B7D', line: '#DCE3EA',
    accent: '#117ACA', button: '#117ACA', buttonText: '#fff',
    radius: 8,
  }),
  'bank-of-america': mk('bank-of-america', {
    logoBg: '#fff', logoPad: 3, logoRadius: 6, preferDark: false,
    bg: '#F4F5F7', surface: '#fff', text: '#012169', muted: '#5C6478', line: '#DDE1E8',
    accent: '#E31837', accent2: '#012169', button: '#012169', buttonText: '#fff',
    radius: 6,
  }),
  'wells-fargo': mk('wells-fargo', {
    logoBg: '#D71E28', logoPad: 4, logoRadius: 8, preferDark: false,
    bg: '#F7F5F5', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8DEDE',
    accent: '#D71E28', button: '#D71E28', buttonText: '#fff',
    radius: 8,
  }),
  revolut: mk('revolut', {
    logoBg: '#0666EB', logoPad: 4, logoRadius: 12, preferDark: true,
    headerBg: '#000000', headerText: '#fff',
    bg: '#000000', bg2: '#191C1F', surface: '#191C1F', text: '#F5F5F5', muted: '#8B919A', line: '#2A2E33',
    accent: '#0666EB', button: '#0666EB', buttonText: '#fff',
    chip: '#25282C', radius: 18, font: INTER, amount: '#FFFFFF',
  }),
  n26: mk('n26', {
    logoBg: '#36A18B', logoPad: 4, logoRadius: 12, preferDark: false,
    bg: '#FAFBFA', surface: '#fff', text: '#1B1B1B', muted: '#6B7A76', line: '#E6EEEC',
    accent: '#36A18B', button: '#36A18B', buttonText: '#fff',
    radius: 20, font: MANROPE, success: '#36A18B',
  }),
  'deutsche-bank': mk('deutsche-bank', {
    logoBg: '#0018A8', logoPad: 4, logoRadius: 2, preferDark: false,
    bg: '#F4F5F8', surface: '#fff', text: '#0018A8', muted: '#5C6080', line: '#D8DAE4',
    accent: '#0018A8', button: '#0018A8', buttonText: '#fff',
    radius: 2, font: IBM,
  }),
  commerzbank: mk('commerzbank', {
    logoBg: '#FFE600', logoPad: 3, logoRadius: 4, preferDark: false,
    bg: '#F3F5F6', surface: '#fff', text: '#002E3C', muted: '#5C6B70', line: '#D6DEE0',
    accent: '#002E3C', accent2: '#FFE600', button: '#002E3C', buttonText: '#FFE600',
    radius: 4, font: IBM,
  }),
  'bnp-paribas': mk('bnp-paribas', {
    logoBg: '#00915A', logoPad: 4, logoRadius: 8, preferDark: false,
    bg: '#F3F8F5', surface: '#fff', text: '#14332A', muted: '#5C7A6B', line: '#D7E6DD',
    accent: '#00915A', button: '#00915A', buttonText: '#fff',
    success: '#00915A',
  }),
  'societe-generale': mk('societe-generale', {
    logoBg: '#fff', logoPad: 3, logoRadius: 4, preferDark: false,
    bg: '#F5F5F5', surface: '#fff', text: '#111', muted: '#666', line: '#E2E2E2',
    accent: '#E60028', button: '#000000', buttonText: '#fff',
    radius: 4,
  }),
  bcr: mk('bcr', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    bg: '#F4F6F8', surface: '#fff', text: '#003366', muted: '#5C6B7A', line: '#D8DEE6',
    accent: '#E2001A', button: '#003366', buttonText: '#fff',
  }),
  brd: mk('brd', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    bg: '#F7F4F5', surface: '#fff', text: '#1A1A1A', muted: '#6B5C60', line: '#E6DCE0',
    accent: '#CC092F', button: '#CC092F', buttonText: '#fff',
  }),
  barclays: mk('barclays', {
    logoBg: '#00AEEF', logoPad: 4, logoRadius: 8, preferDark: false,
    bg: '#F3F8FC', surface: '#fff', text: '#00395D', muted: '#5C7A8A', line: '#D4E4EE',
    accent: '#00AEEF', button: '#00AEEF', buttonText: '#fff',
  }),
  hsbc: mk('hsbc', {
    logoBg: '#DB0011', logoPad: 4, logoRadius: 6, preferDark: false,
    bg: '#F7F5F5', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8DEDE',
    accent: '#DB0011', button: '#DB0011', buttonText: '#fff',
    radius: 6,
  }),
  santander: mk('santander', {
    logoBg: '#EC0000', logoPad: 4, logoRadius: 12, preferDark: false,
    bg: '#F7F4F4', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8DEDE',
    accent: '#EC0000', button: '#EC0000', buttonText: '#fff',
    radius: 16, font: MANROPE,
  }),
  bbva: mk('bbva', {
    logoBg: '#004481', logoPad: 4, logoRadius: 10, preferDark: false,
    bg: '#F2F6FA', surface: '#fff', text: '#072146', muted: '#5B708B', line: '#D5DEE8',
    accent: '#004481', button: '#004481', buttonText: '#fff',
    radius: 8, font: DM,
  }),
  ubs: mk('ubs', {
    logoBg: '#E60000', logoPad: 4, logoRadius: 4, preferDark: false,
    bg: '#F6F6F6', surface: '#fff', text: '#1A1A1A', muted: '#666', line: '#E2E2E2',
    accent: '#E60000', button: '#000000', buttonText: '#fff',
    radius: 4, font: IBM,
  }),
  'standard-bank': mk('standard-bank', {
    logoBg: '#0033A0', logoPad: 4, logoRadius: 8, preferDark: false,
    bg: '#F3F5FA', surface: '#fff', text: '#0033A0', muted: '#5C6B8A', line: '#D6DEE8',
    accent: '#0033A0', button: '#0033A0', buttonText: '#fff',
  }),
  ecobank: mk('ecobank', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    bg: '#F3F6F8', surface: '#fff', text: '#003B5C', muted: '#5C7080', line: '#D4E0E6',
    accent: '#00A651', button: '#003B5C', buttonText: '#fff',
  }),
  paypal: mk('paypal', {
    logoBg: '#fff', logoPad: 3, logoRadius: 12, preferDark: false,
    bg: '#F5F7FA', surface: '#fff', text: '#001C64', muted: '#6B7C93', line: '#E1E7EF',
    accent: '#0070BA', accent2: '#003087', button: '#0070BA', buttonText: '#fff',
    radius: 24, font: OUTFIT, success: '#00A857',
  }),
  'apple-pay': mk('apple-pay', {
    logoBg: '#000', logoPad: 5, logoRadius: 12, preferDark: true,
    headerBg: '#000000', headerText: '#fff',
    bg: '#000000', bg2: '#1C1C1E', surface: '#1C1C1E', text: '#F5F5F7', muted: '#8E8E93', line: '#38383A',
    accent: '#FFFFFF', button: '#FFFFFF', buttonText: '#000000',
    chip: '#2C2C2E', radius: 14, amount: '#FFFFFF',
  }),
  'google-pay': mk('google-pay', {
    logoBg: '#fff', logoPad: 3, logoRadius: 12, preferDark: false,
    bg: '#FFFFFF', surface: '#F8F9FA', text: '#202124', muted: '#5F6368', line: '#E8EAED',
    accent: '#1A73E8', button: '#1A73E8', buttonText: '#fff',
    radius: 24, font: 'Roboto, "Noto Sans", sans-serif',
  }),
  venmo: mk('venmo', {
    logoBg: '#008CFF', logoPad: 5, logoRadius: 14, preferDark: false,
    bg: '#F5F8FB', surface: '#fff', text: '#1A3A52', muted: '#6A8494', line: '#D9E6EE',
    accent: '#008CFF', button: '#008CFF', buttonText: '#fff',
    radius: 20, font: MANROPE,
  }),
  'cash-app': mk('cash-app', {
    logoBg: '#00D632', logoPad: 5, logoRadius: 14, preferDark: true,
    headerBg: '#000000', headerText: '#fff',
    bg: '#000000', bg2: '#111111', surface: '#111111', text: '#FFFFFF', muted: '#9CA3AF', line: '#2A2A2A',
    accent: '#00D632', button: '#00D632', buttonText: '#000000',
    chip: '#1A1A1A', radius: 16, font: SORA, amount: '#00D632',
  }),
  wise: mk('wise', {
    logoBg: '#9FE870', logoPad: 4, logoRadius: 12, preferDark: false,
    bg: '#F2F2F2', surface: '#fff', text: '#0E0F0C', muted: '#5C6356', line: '#E2E4DC',
    accent: '#9FE870', button: '#163300', buttonText: '#9FE870',
    radius: 16, font: MANROPE, amount: '#0E0F0C',
  }),
  'western-union': mk('western-union', {
    logoBg: '#FFDD00', logoPad: 3, logoRadius: 6, preferDark: false,
    bg: '#FAFAF5', surface: '#fff', text: '#1A1A1A', muted: '#6B6B5C', line: '#E8E4D4',
    accent: '#FFDD00', button: '#000000', buttonText: '#FFDD00',
    radius: 8,
  }),
  remitly: mk('remitly', {
    logoBg: '#316AFF', logoPad: 4, logoRadius: 12, preferDark: false,
    bg: '#F4F6FF', surface: '#fff', text: '#1A2A52', muted: '#5C6B8A', line: '#DCE2F0',
    accent: '#316AFF', button: '#316AFF', buttonText: '#fff',
    radius: 14, font: DM,
  }),
  binance: mk('binance', {
    logoBg: '#1E2329', logoPad: 4, logoRadius: 8, preferDark: true,
    headerBg: '#000000', headerText: '#fff',
    bg: '#0B0E11', bg2: '#1E2329', surface: '#1E2329', text: '#EAECEF', muted: '#848E9C', line: '#2B3139',
    accent: '#F0B90B', button: '#F0B90B', buttonText: '#0B0E11',
    chip: '#2B3139', radius: 6, font: SORA, amount: '#FFFFFF',
  }),
  coinbase: mk('coinbase', {
    logoBg: '#0052FF', logoPad: 5, logoRadius: 14, preferDark: false,
    bg: '#FFFFFF', surface: '#F5F8FF', text: '#0A0B0D', muted: '#5C6370', line: '#E6EAF2',
    accent: '#0052FF', button: '#0052FF', buttonText: '#fff',
    radius: 16, font: INTER,
  }),
  kraken: mk('kraken', {
    logoBg: '#5741D9', logoPad: 4, logoRadius: 12, preferDark: true,
    headerBg: '#000000', headerText: '#fff',
    bg: '#000000', bg2: '#12121A', surface: '#12121A', text: '#F0F0F5', muted: '#8B8B9A', line: '#242430',
    accent: '#5741D9', button: '#5741D9', buttonText: '#fff',
    chip: '#1A1A24', radius: 12, font: INTER, amount: '#FFFFFF',
  }),
  'crypto-com': mk('crypto-com', {
    logoBg: '#002D74', logoPad: 4, logoRadius: 12, preferDark: true,
    headerBg: '#000000', headerText: '#fff',
    bg: '#000000', bg2: '#0B1426', surface: '#0F1A2E', text: '#E8ECF4', muted: '#7A8BA8', line: '#1E2D4A',
    accent: '#1199FA', button: '#1199FA', buttonText: '#fff',
    chip: '#152238', radius: 12, font: INTER, amount: '#FFFFFF',
  }),
  tim: mk('tim', {
    logoBg: '#0033A0', logoPad: 4, logoRadius: 10, preferDark: false,
    bg: '#F3F5FA', surface: '#fff', text: '#0033A0', muted: '#5C6B8A', line: '#D6DEE8',
    accent: '#E30613', button: '#0033A0', buttonText: '#fff',
  }),
  vodafone: mk('vodafone', {
    logoBg: '#E60000', logoPad: 4, logoRadius: 12, preferDark: false,
    bg: '#F7F4F4', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8DEDE',
    accent: '#E60000', button: '#E60000', buttonText: '#fff',
    radius: 16, font: MANROPE,
  }),
  orange: mk('orange', {
    logoBg: '#FF7900', logoPad: 4, logoRadius: 12, preferDark: false,
    bg: '#FFF8F2', surface: '#fff', text: '#000000', muted: '#6B6050', line: '#F0E4D6',
    accent: '#FF7900', button: '#FF7900', buttonText: '#fff',
    radius: 16, font: OUTFIT,
  }),
  moneygram: mk('moneygram', {
    logoBg: '#DF2127', logoPad: 4, logoRadius: 8, preferDark: false,
    bg: '#F7F4F4', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8DEDE',
    accent: '#DF2127', button: '#DF2127', buttonText: '#fff',
  }),
  visa: mk('visa', {
    logoBg: '#1A1F71', logoPad: 4, logoRadius: 6, preferDark: false,
    bg: '#F4F5FA', surface: '#fff', text: '#1A1F71', muted: '#5C6080', line: '#D8DCE8',
    accent: '#1A1F71', button: '#1A1F71', buttonText: '#F7B600',
    radius: 6, font: IBM,
  }),
  mastercard: mk('mastercard', {
    logoBg: '#fff', logoPad: 3, logoRadius: 10, preferDark: false,
    bg: '#F6F6F6', surface: '#fff', text: '#1A1A1A', muted: '#6B6B6B', line: '#E4E4E4',
    accent: '#EB001B', accent2: '#F79E1B', button: '#EB001B', buttonText: '#fff',
    radius: 12, font: OUTFIT,
  }),
}

const DEFAULT: BrandProfile = {
  icon: undefined,
  font: SYS,
  radius: 12,
  headerStyle: 'compact',
  logoBg: '#fff',
  logoPad: 4,
  logoRadius: 10,
  preferDark: false,
  headerBg: '#FFFFFF',
  headerText: '#111111',
  statusBarBg: '#FFFFFF',
  statusBarFg: '#000000',
  bg: '#F5F7FA',
  bg2: '#F5F7FA',
  surface: '#fff',
  text: '#1A1A1A',
  muted: '#6B7280',
  line: '#E5E7EB',
  accent: '#1E3A5F',
  accent2: '#1E3A5F',
  button: '#1E3A5F',
  buttonText: '#fff',
  chip: '#F3F4F6',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#D97706',
  amount: '#111111',
}

export function brandProfile(institution: Institution): BrandProfile {
  return PROFILES[institution.id] ?? { ...DEFAULT, icon: institution.icon ?? institution.logo }
}

export function brandedTheme(
  _base: ThemeTokens,
  institution: Institution,
  _appearance: Appearance,
): ThemeTokens {
  const b = brandProfile(institution)
  return {
    id: _base.id,
    font: b.font,
    radius: b.radius,
    accent: b.accent,
    accent2: b.accent2,
    bg: b.bg,
    bg2: b.bg2,
    surface: b.surface,
    text: b.text,
    muted: b.muted,
    line: b.line,
    danger: b.danger,
    success: b.success,
    warning: b.warning,
    nav: b.bg,
    button: b.button,
    buttonText: b.buttonText,
    chip: b.chip,
  }
}

export function brandLogoSrc(institution: Institution): string {
  return brandProfile(institution).icon ?? institution.icon ?? institution.logo
}

export function statusBarColor(institution: Institution): string {
  return brandProfile(institution).statusBarFg
}

export function statusBarBackground(institution: Institution): string {
  return brandProfile(institution).statusBarBg
}

export function brandBackground(institution: Institution): string {
  return brandProfile(institution).bg
}
