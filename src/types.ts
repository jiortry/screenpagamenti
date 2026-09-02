export const PAYMENT_CATEGORIES = [
  'ton_crypto',
  'btc_crypto',
  'usdt_crypto',
  'eth_crypto',
  'xmr_crypto',
  'online_wallet',
  'international_transfer',
  'p2p',
  'bank_transfer',
  'sepa',
  'swift',
  'iban_transfer',
  'mobile_recharge',
  'cash_transfer',
  'card_to_card',
] as const

export type PaymentCategory = (typeof PAYMENT_CATEGORIES)[number]

export const TX_STATUSES = [
  'completed',
  'processing',
  'pending',
  'scheduled',
  'confirmed',
  'received',
  'sent',
  'failed',
  'cancelled',
] as const

export type TxStatus = (typeof TX_STATUSES)[number]

export const LOCALE_IDS = [
  'en',
  'fa',
  'ru',
  'id',
  'ar',
  'tr',
  'uk',
  'fr',
  'es',
  'pt',
  'hi',
  'ko',
  'ja',
  'it',
  'ur',
  'uz',
  'vi',
  'pl',
  'fil',
  'de',
  'th',
  'bn',
] as const

export type LocaleId = (typeof LOCALE_IDS)[number]

export type TextDir = 'ltr' | 'rtl'

export type FiatQuote = 'USD' | 'GBP' | 'CHF' | 'EUR'
export type CryptoQuote = 'BTC' | 'ETH' | 'TON' | 'XMR' | 'USDT'
export type QuoteCurrency = FiatQuote | CryptoQuote

export type BankRegion =
  | 'IT'
  | 'US'
  | 'EU'
  | 'DE'
  | 'FR'
  | 'RO'
  | 'GB'
  | 'ES'
  | 'CH'
  | 'AF'
  | 'INTL'

export type DeviceFamily =
  | 'iphone'
  | 'samsung'
  | 'pixel'
  | 'android'
  | 'android-budget'

export type IslandStyle = 'none' | 'notch' | 'island' | 'punch'
export type NavStyle = 'home-button' | 'indicator' | 'gesture' | 'buttons'
export type Appearance = 'light' | 'dark'

export type LayoutId =
  | 'hero'
  | 'crypto'
  | 'bank'
  | 'remit'
  | 'topup'
  | 'cash'
  | 'cards'

export type ThemeId =
  | 'northline'
  | 'fold'
  | 'quarry'
  | 'atlas'
  | 'pulse'
  | 'kin'
  | 'bridge'
  | 'splitcard'

export type RateBook = {
  ok: true
  timestamp: string
  source: string
  eurPerCrypto: Record<CryptoQuote, number>
  fiatPerEur: Record<Exclude<FiatQuote, 'EUR'>, number>
}

export type RateError = {
  ok: false
  message: string
}

export type Conversion = {
  base_amount: number
  base_currency: 'EUR'
  quote_currency: QuoteCurrency
  exchange_rate: number
  converted_amount: number
  rate_timestamp: string
  display_rate: string
  show_rate: boolean
}

export type DeviceSpec = {
  id: string
  family: DeviceFamily
  label: string
  width: number
  height: number
  corner: number
  status: number
  island: IslandStyle
  nav: NavStyle
  density: number
  safeTop: number
  safeBottom: number
}

export type VisualVars = {
  headerHeight: number
  showBalance: boolean
  iconStyle: 'glyph' | 'circle' | 'illustration'
  summaryStyle: 'rows' | 'cards' | 'stacked'
  buttonPlacement: 'bottom-sticky' | 'inline' | 'split'
  bgTreatment: 'flat' | 'gradient' | 'mesh' | 'paper'
  cardOffset: number
  typeScale: number
  spacingScale: number
}

export type Person = {
  given: string
  family: string
  full: string
  initials: string
}

export type Institution = {
  id: string
  name: string
  short: string
  region: BankRegion
  kind: 'bank' | 'wallet' | 'p2p' | 'remit' | 'crypto' | 'telco' | 'cash' | 'cards'
  logo: string
  icon?: string
  domain?: string
}

export type LedgerEntry = {
  id: string
  direction: 'in' | 'out'
  label: string
  amountEur: number
  timestamp: string
}

export type Scenario = {
  seed: number
  synthetic: true
  category: PaymentCategory
  status: TxStatus
  locale: LocaleId
  dir: TextDir
  bcp47: string
  device: DeviceSpec
  appearance: Appearance
  fontScale: number
  themeId: ThemeId
  layoutId: LayoutId
  region: BankRegion
  institution: Institution
  sender: Person
  recipient: Person
  amountEur: number
  feeEur: number
  totalEur: number
  conversion: Conversion
  secondary?: Conversion
  transactionId: string
  ibanFrom?: string
  ibanTo?: string
  accountFrom?: string
  accountTo?: string
  walletFrom?: string
  walletTo?: string
  phone?: string
  operator?: string
  cardFrom?: string
  cardTo?: string
  pickupCode?: string
  pickupPoint?: string
  networkName?: string
  note: string
  statusReason?: string
  timestamp: string
  scheduledFor?: string
  etaLabel: string
  visual: VisualVars
  battery: number
  clock: string
  signal: number
  carrier: string
  accountBalance?: number
  recentActivity?: LedgerEntry[]
}
