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
  statusBar: string
}

const I = (id: string) => `/logos/icons/${id}.png`

function mk(
  id: string,
  p: Omit<BrandProfile, 'icon' | 'font' | 'radius' | 'headerStyle' | 'accent2' | 'warning' | 'statusBar' | 'bg2' | 'chip' | 'success' | 'danger'> &
    Partial<Pick<BrandProfile, 'font' | 'radius' | 'headerStyle' | 'accent2' | 'warning' | 'statusBar' | 'bg2' | 'chip' | 'success' | 'danger'>>,
): BrandProfile {
  return {
    icon: I(id),
    font: '-apple-system, "SF Pro Text", Roboto, "Noto Sans", sans-serif',
    radius: 12,
    headerStyle: 'full',
    accent2: p.accent,
    bg2: p.bg,
    chip: p.surface,
    success: '#16A34A',
    danger: '#DC2626',
    warning: '#D97706',
    statusBar: p.headerText,
    ...p,
  }
}

const PROFILES: Record<string, BrandProfile> = {
  'intesa-sanpaolo': mk('intesa-sanpaolo', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#258900', headerText: '#fff',
    bg: '#F4F6F4', surface: '#fff', text: '#1A1A1A', muted: '#5C6B5C', line: '#DDE8DD',
    accent: '#258900', button: '#258900', buttonText: '#fff',
  }),
  unicredit: mk('unicredit', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#E2001A', headerText: '#fff',
    bg: '#F8F4F4', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8DDDD',
    accent: '#E2001A', button: '#E2001A', buttonText: '#fff',
  }),
  fineco: mk('fineco', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#00549F', headerText: '#fff',
    bg: '#F2F6FA', surface: '#fff', text: '#0F172A', muted: '#5C6B7A', line: '#DDE4EE',
    accent: '#00549F', button: '#00549F', buttonText: '#fff', radius: 8,
  }),
  chase: mk('chase', {
    logoBg: '#117ACA', logoPad: 4, logoRadius: 10, preferDark: false,
    headerBg: '#117ACA', headerText: '#fff',
    bg: '#F0F4F8', surface: '#fff', text: '#0A2540', muted: '#5A6B7D', line: '#D4DEE8',
    accent: '#117ACA', button: '#117ACA', buttonText: '#fff',
  }),
  'bank-of-america': mk('bank-of-america', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#012169', headerText: '#fff',
    bg: '#F2F4F8', surface: '#fff', text: '#012169', muted: '#5C6478', line: '#D8DEE8',
    accent: '#E31837', accent2: '#012169', button: '#012169', buttonText: '#fff',
  }),
  'wells-fargo': mk('wells-fargo', {
    logoBg: '#D71E28', logoPad: 4, logoRadius: 10, preferDark: false,
    headerBg: '#D71E28', headerText: '#fff',
    bg: '#F8F2F2', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8D8D8',
    accent: '#D71E28', button: '#D71E28', buttonText: '#fff', radius: 10,
  }),
  revolut: mk('revolut', {
    logoBg: '#0075EB', logoPad: 4, logoRadius: 12, preferDark: true,
    headerBg: '#191C1F', headerText: '#fff',
    bg: '#191C1F', bg2: '#252A2F', surface: '#252A2F', text: '#F5F5F5', muted: '#9CA3AF', line: '#3A3F44',
    accent: '#0075EB', button: '#0075EB', buttonText: '#fff', chip: '#2D3238', radius: 16,
  }),
  n26: mk('n26', {
    logoBg: '#36A18B', logoPad: 4, logoRadius: 12, preferDark: false,
    headerBg: '#36A18B', headerText: '#fff',
    bg: '#F0FAF7', surface: '#fff', text: '#163D35', muted: '#5C7A72', line: '#D4E8E2',
    accent: '#36A18B', button: '#36A18B', buttonText: '#fff', radius: 16,
  }),
  'deutsche-bank': mk('deutsche-bank', {
    logoBg: '#0018A8', logoPad: 4, logoRadius: 4, preferDark: false,
    headerBg: '#0018A8', headerText: '#fff',
    bg: '#F2F3F8', surface: '#fff', text: '#0018A8', muted: '#5C6080', line: '#D8DAE8',
    accent: '#0018A8', button: '#0018A8', buttonText: '#fff', radius: 4,
  }),
  commerzbank: mk('commerzbank', {
    logoBg: '#FFE600', logoPad: 3, logoRadius: 6, preferDark: false,
    headerBg: '#002E3C', headerText: '#FFE600',
    bg: '#F2F6F7', surface: '#fff', text: '#002E3C', muted: '#5C6B70', line: '#D4DEE0',
    accent: '#FFE600', accent2: '#002E3C', button: '#002E3C', buttonText: '#FFE600', radius: 6,
  }),
  'bnp-paribas': mk('bnp-paribas', {
    logoBg: '#00915A', logoPad: 4, logoRadius: 8, preferDark: false,
    headerBg: '#00915A', headerText: '#fff',
    bg: '#F2F8F5', surface: '#fff', text: '#1A3D2E', muted: '#5C7A6B', line: '#D4E8DD',
    accent: '#00915A', button: '#00915A', buttonText: '#fff',
  }),
  'societe-generale': mk('societe-generale', {
    logoBg: '#fff', logoPad: 3, logoRadius: 6, preferDark: false,
    headerBg: '#000', headerText: '#fff',
    bg: '#F5F5F5', surface: '#fff', text: '#111', muted: '#666', line: '#E0E0E0',
    accent: '#E60028', button: '#000', buttonText: '#fff', radius: 6,
  }),
  bcr: mk('bcr', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#003366', headerText: '#fff',
    bg: '#F2F5F8', surface: '#fff', text: '#003366', muted: '#5C6B7A', line: '#D4DEE8',
    accent: '#E2001A', button: '#003366', buttonText: '#fff',
  }),
  brd: mk('brd', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#CC092F', headerText: '#fff',
    bg: '#F8F2F4', surface: '#fff', text: '#1A1A1A', muted: '#6B5C60', line: '#E8D8DC',
    accent: '#CC092F', button: '#CC092F', buttonText: '#fff',
  }),
  barclays: mk('barclays', {
    logoBg: '#00AEEF', logoPad: 4, logoRadius: 8, preferDark: false,
    headerBg: '#00AEEF', headerText: '#fff',
    bg: '#F0F8FC', surface: '#fff', text: '#00395D', muted: '#5C7A8A', line: '#D4E8F0',
    accent: '#00AEEF', button: '#00AEEF', buttonText: '#fff',
  }),
  hsbc: mk('hsbc', {
    logoBg: '#DB0011', logoPad: 4, logoRadius: 8, preferDark: false,
    headerBg: '#DB0011', headerText: '#fff',
    bg: '#F8F2F2', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8D8D8',
    accent: '#DB0011', button: '#DB0011', buttonText: '#fff',
  }),
  santander: mk('santander', {
    logoBg: '#EC0000', logoPad: 4, logoRadius: 12, preferDark: false,
    headerBg: '#EC0000', headerText: '#fff',
    bg: '#F8F2F2', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8D8D8',
    accent: '#EC0000', button: '#EC0000', buttonText: '#fff', radius: 14,
  }),
  bbva: mk('bbva', {
    logoBg: '#004481', logoPad: 4, logoRadius: 10, preferDark: false,
    headerBg: '#004481', headerText: '#fff',
    bg: '#F0F4F8', surface: '#fff', text: '#004481', muted: '#5C6B7A', line: '#D4DEE8',
    accent: '#004481', button: '#004481', buttonText: '#fff',
  }),
  ubs: mk('ubs', {
    logoBg: '#E60000', logoPad: 4, logoRadius: 6, preferDark: false,
    headerBg: '#1A1A1A', headerText: '#fff',
    bg: '#F5F5F5', surface: '#fff', text: '#1A1A1A', muted: '#666', line: '#E0E0E0',
    accent: '#E60000', button: '#1A1A1A', buttonText: '#fff', radius: 6,
  }),
  'standard-bank': mk('standard-bank', {
    logoBg: '#0033A0', logoPad: 4, logoRadius: 8, preferDark: false,
    headerBg: '#0033A0', headerText: '#fff',
    bg: '#F0F4FA', surface: '#fff', text: '#0033A0', muted: '#5C6B8A', line: '#D4DEE8',
    accent: '#0033A0', button: '#0033A0', buttonText: '#fff',
  }),
  ecobank: mk('ecobank', {
    logoBg: '#fff', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#003B5C', headerText: '#fff',
    bg: '#F0F5F8', surface: '#fff', text: '#003B5C', muted: '#5C7080', line: '#D4E0E8',
    accent: '#00A651', button: '#003B5C', buttonText: '#fff',
  }),
  paypal: mk('paypal', {
    logoBg: '#fff', logoPad: 3, logoRadius: 12, preferDark: false,
    headerBg: '#0070BA', headerText: '#fff',
    bg: '#F5F7FA', surface: '#fff', text: '#003087', muted: '#5C6B8A', line: '#D8E2EE',
    accent: '#0070BA', accent2: '#003087', button: '#0070BA', buttonText: '#fff', radius: 24,
  }),
  'apple-pay': mk('apple-pay', {
    logoBg: '#000', logoPad: 5, logoRadius: 12, preferDark: true,
    headerBg: '#000', headerText: '#fff',
    bg: '#000', bg2: '#1C1C1E', surface: '#1C1C1E', text: '#F5F5F7', muted: '#8E8E93', line: '#38383A',
    accent: '#fff', button: '#fff', buttonText: '#000', chip: '#2C2C2E', radius: 14,
  }),
  'google-pay': mk('google-pay', {
    logoBg: '#fff', logoPad: 3, logoRadius: 12, preferDark: false,
    headerBg: '#fff', headerText: '#202124', headerStyle: 'compact',
    bg: '#fff', surface: '#F8F9FA', text: '#202124', muted: '#5F6368', line: '#E8EAED',
    accent: '#1A73E8', button: '#1A73E8', buttonText: '#fff', radius: 24, statusBar: '#202124',
  }),
  venmo: mk('venmo', {
    logoBg: '#3D95CE', logoPad: 5, logoRadius: 14, preferDark: false,
    headerBg: '#3D95CE', headerText: '#fff',
    bg: '#EBF5FB', surface: '#fff', text: '#1A3A52', muted: '#5C7A8A', line: '#D4E8F0',
    accent: '#3D95CE', button: '#3D95CE', buttonText: '#fff', radius: 20,
  }),
  'cash-app': mk('cash-app', {
    logoBg: '#00D632', logoPad: 5, logoRadius: 14, preferDark: true,
    headerBg: '#00D632', headerText: '#000',
    bg: '#000', bg2: '#1A1A1A', surface: '#1A1A1A', text: '#fff', muted: '#9CA3AF', line: '#333',
    accent: '#00D632', button: '#00D632', buttonText: '#000', chip: '#262626', radius: 14, statusBar: '#000',
  }),
  wise: mk('wise', {
    logoBg: '#9FE870', logoPad: 4, logoRadius: 12, preferDark: false,
    headerBg: '#9FE870', headerText: '#163300',
    bg: '#E8F9D8', surface: '#fff', text: '#163300', muted: '#4A6B30', line: '#C8E8A8',
    accent: '#163300', button: '#163300', buttonText: '#9FE870', radius: 16,
  }),
  'western-union': mk('western-union', {
    logoBg: '#FFDD00', logoPad: 3, logoRadius: 8, preferDark: false,
    headerBg: '#FFDD00', headerText: '#000',
    bg: '#FFFAE8', surface: '#fff', text: '#1A1A1A', muted: '#6B6B5C', line: '#E8E0C8',
    accent: '#FFDD00', button: '#000', buttonText: '#FFDD00',
  }),
  remitly: mk('remitly', {
    logoBg: '#316AFF', logoPad: 4, logoRadius: 12, preferDark: false,
    headerBg: '#316AFF', headerText: '#fff',
    bg: '#F0F4FF', surface: '#fff', text: '#1A2A52', muted: '#5C6B8A', line: '#D4DEE8',
    accent: '#316AFF', button: '#316AFF', buttonText: '#fff', radius: 14,
  }),
  binance: mk('binance', {
    logoBg: '#1E2329', logoPad: 4, logoRadius: 12, preferDark: true,
    headerBg: '#1E2329', headerText: '#F0B90B',
    bg: '#1E2329', bg2: '#2B3139', surface: '#2B3139', text: '#EAECEF', muted: '#848E9C', line: '#3C4043',
    accent: '#F0B90B', button: '#F0B90B', buttonText: '#1E2329', chip: '#363C45', radius: 8,
  }),
  coinbase: mk('coinbase', {
    logoBg: '#0052FF', logoPad: 5, logoRadius: 14, preferDark: false,
    headerBg: '#0052FF', headerText: '#fff',
    bg: '#F0F4FF', surface: '#fff', text: '#0A0B0D', muted: '#5C6370', line: '#D8DEE8',
    accent: '#0052FF', button: '#0052FF', buttonText: '#fff', radius: 16,
  }),
  kraken: mk('kraken', {
    logoBg: '#5741D9', logoPad: 4, logoRadius: 12, preferDark: true,
    headerBg: '#0B0B0F', headerText: '#fff',
    bg: '#0B0B0F', bg2: '#1A1A22', surface: '#1A1A22', text: '#F0F0F5', muted: '#8B8B9A', line: '#2A2A35',
    accent: '#5741D9', button: '#5741D9', buttonText: '#fff', chip: '#252530', radius: 12,
  }),
  'crypto-com': mk('crypto-com', {
    logoBg: '#002D74', logoPad: 4, logoRadius: 12, preferDark: true,
    headerBg: '#002D74', headerText: '#fff',
    bg: '#0B1426', bg2: '#0F1A2E', surface: '#0F1A2E', text: '#E8ECF4', muted: '#7A8BA8', line: '#1E2D4A',
    accent: '#1199FA', button: '#1199FA', buttonText: '#fff', chip: '#152238', radius: 12,
  }),
  tim: mk('tim', {
    logoBg: '#0033A0', logoPad: 4, logoRadius: 10, preferDark: false,
    headerBg: '#0033A0', headerText: '#fff',
    bg: '#F0F4FA', surface: '#fff', text: '#0033A0', muted: '#5C6B8A', line: '#D4DEE8',
    accent: '#EB0029', button: '#0033A0', buttonText: '#fff',
  }),
  vodafone: mk('vodafone', {
    logoBg: '#E60000', logoPad: 4, logoRadius: 12, preferDark: false,
    headerBg: '#E60000', headerText: '#fff',
    bg: '#F8F2F2', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8D8D8',
    accent: '#E60000', button: '#E60000', buttonText: '#fff', radius: 14,
  }),
  orange: mk('orange', {
    logoBg: '#FF7900', logoPad: 4, logoRadius: 12, preferDark: false,
    headerBg: '#FF7900', headerText: '#fff',
    bg: '#FFF8F0', surface: '#fff', text: '#1A1A1A', muted: '#6B6050', line: '#F0E0D0',
    accent: '#FF7900', button: '#FF7900', buttonText: '#fff', radius: 14,
  }),
  moneygram: mk('moneygram', {
    logoBg: '#DF2127', logoPad: 4, logoRadius: 10, preferDark: false,
    headerBg: '#DF2127', headerText: '#fff',
    bg: '#F8F2F2', surface: '#fff', text: '#1A1A1A', muted: '#6B5C5C', line: '#E8D8D8',
    accent: '#DF2127', button: '#DF2127', buttonText: '#fff',
  }),
  visa: mk('visa', {
    logoBg: '#1A1F71', logoPad: 4, logoRadius: 8, preferDark: false,
    headerBg: '#1A1F71', headerText: '#fff',
    bg: '#F0F2F8', surface: '#fff', text: '#1A1F71', muted: '#5C6080', line: '#D4D8E8',
    accent: '#1A1F71', button: '#1A1F71', buttonText: '#F7B600', radius: 8,
  }),
  mastercard: mk('mastercard', {
    logoBg: '#000', logoPad: 4, logoRadius: 10, preferDark: true,
    headerBg: '#1A1A1A', headerText: '#fff',
    bg: '#1A1A1A', bg2: '#262626', surface: '#262626', text: '#F5F5F5', muted: '#9CA3AF', line: '#404040',
    accent: '#EB001B', accent2: '#F79E1B', button: '#EB001B', buttonText: '#fff', chip: '#333', radius: 10,
  }),
}

const DEFAULT: BrandProfile = {
  icon: undefined,
  font: '-apple-system, "SF Pro Text", Roboto, "Noto Sans", sans-serif',
  radius: 12,
  headerStyle: 'full',
  logoBg: '#fff',
  logoPad: 4,
  logoRadius: 10,
  preferDark: false,
  headerBg: '#1E3A5F',
  headerText: '#fff',
  statusBar: '#fff',
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
  chip: '#fff',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#D97706',
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
    nav: b.button,
    button: b.button,
    buttonText: b.buttonText,
    chip: b.chip,
  }
}

export function brandLogoSrc(institution: Institution): string {
  return brandProfile(institution).icon ?? institution.icon ?? institution.logo
}

export function statusBarColor(institution: Institution): string {
  return brandProfile(institution).statusBar
}

export function brandBackground(institution: Institution): string {
  return brandProfile(institution).bg
}
