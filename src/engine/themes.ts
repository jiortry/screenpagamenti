import type { Appearance, LayoutId, PaymentCategory, ThemeId } from '../types.ts'
import { chance, pick, type Rng } from './random.ts'

export type ThemeTokens = {
  id: ThemeId
  font: string
  radius: number
  accent: string
  accent2: string
  bg: string
  bg2: string
  surface: string
  text: string
  muted: string
  line: string
  danger: string
  success: string
  warning: string
  nav: string
  button: string
  buttonText: string
  chip: string
}

const LIGHT: Record<ThemeId, ThemeTokens> = {
  northline: {
    id: 'northline',
    font: '"IBM Plex Sans", "Noto Sans", sans-serif',
    radius: 10,
    accent: '#1B3A4B',
    accent2: '#C4A35A',
    bg: '#F4F1EA',
    bg2: '#E7E1D4',
    surface: '#FFFdf8',
    text: '#1A242B',
    muted: '#5C6B74',
    line: '#D9D1C3',
    danger: '#9B2C2C',
    success: '#2F6F4E',
    warning: '#B7791F',
    nav: '#1B3A4B',
    button: '#1B3A4B',
    buttonText: '#F7F1E3',
    chip: '#E7E1D4',
  },
  fold: {
    id: 'fold',
    font: '"Manrope", "Noto Sans", sans-serif',
    radius: 22,
    accent: '#0F766E',
    accent2: '#99F6E4',
    bg: '#F0FDFA',
    bg2: '#CCFBF1',
    surface: '#FFFFFF',
    text: '#134E4A',
    muted: '#5B7C78',
    line: '#99F6E4',
    danger: '#B91C1C',
    success: '#0F766E',
    warning: '#C2410C',
    nav: '#FFFFFF',
    button: '#0F766E',
    buttonText: '#ECFDF5',
    chip: '#CCFBF1',
  },
  quarry: {
    id: 'quarry',
    font: '"Sora", "Noto Sans", sans-serif',
    radius: 8,
    accent: '#F5A524',
    accent2: '#7C5CFF',
    bg: '#F6F3EE',
    bg2: '#E8E2D6',
    surface: '#FFFcf7',
    text: '#1C1917',
    muted: '#78716C',
    line: '#E7E5E4',
    danger: '#DC2626',
    success: '#16A34A',
    warning: '#D97706',
    nav: '#1C1917',
    button: '#1C1917',
    buttonText: '#F5A524',
    chip: '#E7E5E4',
  },
  atlas: {
    id: 'atlas',
    font: '"Outfit", "Noto Sans", sans-serif',
    radius: 14,
    accent: '#1D4ED8',
    accent2: '#F4D19B',
    bg: '#EEF3FB',
    bg2: '#D9E4F5',
    surface: '#FFFFFF',
    text: '#172033',
    muted: '#5B6780',
    line: '#D5DEEE',
    danger: '#B42318',
    success: '#067647',
    warning: '#B54708',
    nav: '#172033',
    button: '#1D4ED8',
    buttonText: '#F8FAFF',
    chip: '#DBEAFE',
  },
  pulse: {
    id: 'pulse',
    font: '"DM Sans", "Noto Sans", sans-serif',
    radius: 18,
    accent: '#C026D3',
    accent2: '#FDE047',
    bg: '#FDF4FF',
    bg2: '#FAE8FF',
    surface: '#FFFFFF',
    text: '#4A044E',
    muted: '#86198F',
    line: '#F5D0FE',
    danger: '#E11D48',
    success: '#15803D',
    warning: '#CA8A04',
    nav: '#FFFFFF',
    button: '#C026D3',
    buttonText: '#FFFBEB',
    chip: '#FAE8FF',
  },
  kin: {
    id: 'kin',
    font: '"Manrope", "Noto Sans", sans-serif',
    radius: 20,
    accent: '#E11D48',
    accent2: '#FFE4E6',
    bg: '#FFF7ED',
    bg2: '#FFEDD5',
    surface: '#FFFFFF',
    text: '#1C1917',
    muted: '#78716C',
    line: '#FED7AA',
    danger: '#B91C1C',
    success: '#15803D',
    warning: '#C2410C',
    nav: '#FFF7ED',
    button: '#E11D48',
    buttonText: '#FFF1F2',
    chip: '#FFE4E6',
  },
  bridge: {
    id: 'bridge',
    font: '"IBM Plex Sans", "Noto Sans", sans-serif',
    radius: 12,
    accent: '#166534',
    accent2: '#D9F99D',
    bg: '#F7FEE7',
    bg2: '#ECFCCB',
    surface: '#FFFFFF',
    text: '#14532D',
    muted: '#3F6212',
    line: '#D9F99D',
    danger: '#B42318',
    success: '#166534',
    warning: '#A16207',
    nav: '#14532D',
    button: '#166534',
    buttonText: '#F7FEE7',
    chip: '#ECFCCB',
  },
  splitcard: {
    id: 'splitcard',
    font: '"Outfit", "Noto Sans", sans-serif',
    radius: 16,
    accent: '#0369A1',
    accent2: '#7DD3FC',
    bg: '#F0F9FF',
    bg2: '#E0F2FE',
    surface: '#FFFFFF',
    text: '#0C4A6E',
    muted: '#0369A1',
    line: '#BAE6FD',
    danger: '#E11D48',
    success: '#047857',
    warning: '#C2410C',
    nav: '#0C4A6E',
    button: '#0369A1',
    buttonText: '#F0F9FF',
    chip: '#E0F2FE',
  },
}

const DARK: Record<ThemeId, ThemeTokens> = {
  northline: {
    ...LIGHT.northline,
    bg: '#12181D',
    bg2: '#1B3A4B',
    surface: '#1C262D',
    text: '#F4F1EA',
    muted: '#A8B6BE',
    line: '#2A3A44',
    nav: '#0E1418',
    chip: '#243038',
    button: '#C4A35A',
    buttonText: '#1A242B',
  },
  fold: {
    ...LIGHT.fold,
    bg: '#042F2E',
    bg2: '#115E59',
    surface: '#134E4A',
    text: '#F0FDFA',
    muted: '#99F6E4',
    line: '#0F766E',
    nav: '#022C2A',
    chip: '#115E59',
    button: '#2DD4BF',
    buttonText: '#042F2E',
  },
  quarry: {
    ...LIGHT.quarry,
    bg: '#0C0A09',
    bg2: '#1C1917',
    surface: '#1C1917',
    text: '#F5F5F4',
    muted: '#A8A29E',
    line: '#292524',
    nav: '#0C0A09',
    chip: '#292524',
    button: '#F5A524',
    buttonText: '#1C1917',
  },
  atlas: {
    ...LIGHT.atlas,
    bg: '#0B1220',
    bg2: '#172033',
    surface: '#172033',
    text: '#EEF3FB',
    muted: '#93A4C4',
    line: '#243044',
    nav: '#070D18',
    chip: '#1E293B',
    button: '#60A5FA',
    buttonText: '#0B1220',
  },
  pulse: {
    ...LIGHT.pulse,
    bg: '#2A0A2E',
    bg2: '#4A044E',
    surface: '#3B0764',
    text: '#FDF4FF',
    muted: '#F0ABFC',
    line: '#701A75',
    nav: '#1A061C',
    chip: '#4A044E',
    button: '#FDE047',
    buttonText: '#4A044E',
  },
  kin: {
    ...LIGHT.kin,
    bg: '#1C1917',
    bg2: '#292524',
    surface: '#292524',
    text: '#FFF7ED',
    muted: '#D6D3D1',
    line: '#44403C',
    nav: '#0C0A09',
    chip: '#44403C',
    button: '#FB7185',
    buttonText: '#1C1917',
  },
  bridge: {
    ...LIGHT.bridge,
    bg: '#052E16',
    bg2: '#14532D',
    surface: '#14532D',
    text: '#ECFCCB',
    muted: '#BBF7D0',
    line: '#166534',
    nav: '#022C12',
    chip: '#166534',
    button: '#D9F99D',
    buttonText: '#14532D',
  },
  splitcard: {
    ...LIGHT.splitcard,
    bg: '#082F49',
    bg2: '#0C4A6E',
    surface: '#0C4A6E',
    text: '#E0F2FE',
    muted: '#7DD3FC',
    line: '#0369A1',
    nav: '#051F33',
    chip: '#075985',
    button: '#7DD3FC',
    buttonText: '#082F49',
  },
}

export function themeTokens(id: ThemeId, appearance: Appearance): ThemeTokens {
  return appearance === 'dark' ? DARK[id] : LIGHT[id]
}

export function pickTheme(rng: Rng, category: PaymentCategory): ThemeId {
  const map: Record<PaymentCategory, ThemeId[]> = {
    ton_crypto: ['quarry', 'splitcard'],
    btc_crypto: ['quarry', 'northline'],
    usdt_crypto: ['quarry', 'atlas'],
    eth_crypto: ['quarry', 'fold'],
    xmr_crypto: ['quarry', 'bridge'],
    online_wallet: ['kin', 'fold', 'pulse'],
    international_transfer: ['atlas', 'bridge'],
    p2p: ['fold', 'kin', 'pulse'],
    bank_transfer: ['northline', 'atlas'],
    sepa: ['northline', 'atlas'],
    swift: ['northline', 'atlas'],
    iban_transfer: ['northline', 'splitcard'],
    mobile_recharge: ['pulse', 'kin'],
    cash_transfer: ['bridge', 'atlas'],
    card_to_card: ['splitcard', 'northline'],
  }
  return pick(rng, map[category])
}

export function pickLayout(category: PaymentCategory): LayoutId {
  switch (category) {
    case 'ton_crypto':
    case 'btc_crypto':
    case 'usdt_crypto':
    case 'eth_crypto':
    case 'xmr_crypto':
      return 'crypto'
    case 'international_transfer':
      return 'remit'
    case 'mobile_recharge':
      return 'topup'
    case 'cash_transfer':
      return 'cash'
    case 'card_to_card':
      return 'cards'
    case 'p2p':
    case 'online_wallet':
      return 'hero'
    default:
      return 'bank'
  }
}

export function pickAppearance(rng: Rng, themeId: ThemeId, family: string): Appearance {
  if (themeId === 'quarry') return chance(rng, 0.72) ? 'dark' : 'light'
  if (family === 'iphone') return chance(rng, 0.62) ? 'light' : 'dark'
  return chance(rng, 0.68) ? 'light' : 'dark'
}

export function scriptFont(locale: string, base: string): string {
  if (locale === 'ar' || locale === 'fa' || locale === 'ur') {
    return `"Noto Naskh Arabic", "Noto Sans Arabic", ${base}`
  }
  if (locale === 'hi') return `"Noto Sans Devanagari", ${base}`
  if (locale === 'bn') return `"Noto Sans Bengali", ${base}`
  if (locale === 'th') return `"Noto Sans Thai", ${base}`
  if (locale === 'ja') return `"Noto Sans JP", ${base}`
  if (locale === 'ko') return `"Noto Sans KR", ${base}`
  if (locale === 'ru' || locale === 'uk') return `"Noto Sans", ${base}`
  return base
}
