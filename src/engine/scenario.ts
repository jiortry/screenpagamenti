import type {
  Conversion,
  CryptoQuote,
  LayoutId,
  PaymentCategory,
  QuoteCurrency,
  RateBook,
  Scenario,
  TxStatus,
  VisualVars,
} from '../types.ts'
import { sampleEurAmount, sampleFeeEur } from './amounts.ts'
import { sampleDevice, sampleFontScale } from './devices.ts'
import { pickupPoint, pickInstitution } from './institutions.ts'
import {
  pickupCode,
  synthAccount,
  synthCardMask,
  synthIban,
  synthPhone,
  synthWallet,
  transactionId,
} from './identifiers.ts'
import { sampleLocale } from './languages.ts'
import { convertFromEur, isCryptoQuote } from './math.ts'
import { synthPair } from './names.ts'
import { chance, pick, pickWeighted, randInt, type Rng } from './random.ts'
import { pickAppearance, pickLayout, pickTheme } from './themes.ts'
import {
  CANCEL_REASONS,
  FAIL_REASONS,
  NOTES,
  tf,
} from '../i18n/catalog.ts'
import { formatClock, formatRate } from './format.ts'

const CATEGORIES: { value: PaymentCategory; weight: number }[] = [
  { value: 'sepa', weight: 10 },
  { value: 'iban_transfer', weight: 9 },
  { value: 'bank_transfer', weight: 8 },
  { value: 'p2p', weight: 8 },
  { value: 'online_wallet', weight: 7 },
  { value: 'international_transfer', weight: 7 },
  { value: 'swift', weight: 6 },
  { value: 'usdt_crypto', weight: 6 },
  { value: 'btc_crypto', weight: 6 },
  { value: 'eth_crypto', weight: 5 },
  { value: 'ton_crypto', weight: 5 },
  { value: 'mobile_recharge', weight: 5 },
  { value: 'card_to_card', weight: 5 },
  { value: 'cash_transfer', weight: 5 },
  { value: 'xmr_crypto', weight: 4 },
]

const STATUSES: { value: TxStatus; weight: number }[] = [
  { value: 'completed', weight: 26 },
  { value: 'sent', weight: 12 },
  { value: 'received', weight: 12 },
  { value: 'confirmed', weight: 12 },
  { value: 'processing', weight: 10 },
  { value: 'pending', weight: 10 },
  { value: 'scheduled', weight: 6 },
  { value: 'failed', weight: 7 },
  { value: 'cancelled', weight: 5 },
]

function cryptoOf(category: PaymentCategory): CryptoQuote | null {
  switch (category) {
    case 'ton_crypto':
      return 'TON'
    case 'btc_crypto':
      return 'BTC'
    case 'usdt_crypto':
      return 'USDT'
    case 'eth_crypto':
      return 'ETH'
    case 'xmr_crypto':
      return 'XMR'
    default:
      return null
  }
}

function networkName(q: CryptoQuote): string {
  switch (q) {
    case 'TON':
      return 'TON'
    case 'BTC':
      return 'Bitcoin'
    case 'USDT':
      return 'USDT TRC-SYNTH'
    case 'ETH':
      return 'Ethereum'
    case 'XMR':
      return 'Monero'
  }
}

function quoteFor(
  rng: Rng,
  category: PaymentCategory,
  region: string,
): QuoteCurrency {
  const c = cryptoOf(category)
  if (c) return c
  if (category === 'international_transfer' || category === 'swift') {
    return pick(rng, ['USD', 'GBP', 'CHF'] as const)
  }
  if (region === 'US') return chance(rng, 0.75) ? 'USD' : 'EUR'
  if (region === 'GB') return chance(rng, 0.6) ? 'GBP' : 'EUR'
  if (region === 'CH') return chance(rng, 0.5) ? 'CHF' : 'EUR'
  return 'EUR'
}

function makeConversion(
  amountEur: number,
  quote: QuoteCurrency,
  rates: RateBook,
  show: boolean,
  bcp47: string,
): Conversion {
  const { converted_amount, exchange_rate } = convertFromEur(amountEur, quote, rates)
  return {
    base_amount: amountEur,
    base_currency: 'EUR',
    quote_currency: quote,
    exchange_rate,
    converted_amount,
    rate_timestamp: rates.timestamp,
    display_rate: formatRate(quote, exchange_rate, bcp47),
    show_rate: show,
  }
}

function etaFor(rng: Rng, status: TxStatus, locale: Scenario['locale'], category: PaymentCategory): string {
  if (status === 'completed' || status === 'received' || status === 'sent' || status === 'confirmed') {
    return tf(locale, 'etaInstant', 0)
  }
  if (status === 'failed' || status === 'cancelled') return '—'
  if (category === 'swift' || category === 'international_transfer') {
    return tf(locale, 'etaDays', randInt(rng, 1, 3))
  }
  if (status === 'scheduled') return tf(locale, 'etaDays', randInt(rng, 1, 2))
  if (chance(rng, 0.5)) return tf(locale, 'etaMinutes', randInt(rng, 2, 45))
  return tf(locale, 'etaHours', randInt(rng, 1, 6))
}

function visuals(rng: Rng, layout: LayoutId, fontScale: number): VisualVars {
  const bg =
    layout === 'bank'
      ? pick(rng, ['paper', 'flat', 'gradient'] as const)
      : layout === 'crypto'
        ? pick(rng, ['mesh', 'flat', 'gradient'] as const)
        : pick(rng, ['flat', 'gradient', 'mesh', 'paper'] as const)
  return {
    headerHeight: randInt(rng, 52, 92),
    showBalance: chance(rng, 0.55),
    iconStyle: pick(rng, ['glyph', 'circle', 'illustration'] as const),
    summaryStyle: pick(rng, ['rows', 'cards', 'stacked'] as const),
    buttonPlacement: pick(rng, ['bottom-sticky', 'inline', 'split'] as const),
    bgTreatment: bg,
    cardOffset: randInt(rng, 0, 18),
    typeScale: fontScale,
    spacingScale: Math.round((0.88 + rng() * 0.28) * 100) / 100,
  }
}

function operators(rng: Rng): string {
  return pick(rng, ['Nexora Mobile', 'VoltSim', 'AetherTel', 'Luma Air'])
}

export function createScenario(rng: Rng, rates: RateBook, seed: number): Scenario {
  const locale = sampleLocale(rng)
  const category = pickWeighted(rng, CATEGORIES).value
  const status = pickWeighted(rng, STATUSES).value
  const device = sampleDevice(rng)
  const fontScale = sampleFontScale(rng, device.family)
  const themeId = pickTheme(rng, category)
  const layoutId = pickLayout(category)
  const appearance = pickAppearance(rng, themeId, device.family)
  const institution = pickInstitution(rng, category, locale.id)
  const { sender, recipient } = synthPair(rng, locale.id)
  const amountEur = sampleEurAmount(rng)
  const feeEur = sampleFeeEur(rng, category, amountEur)
  const totalEur = Math.round((amountEur + feeEur) * 100) / 100
  const quote = quoteFor(rng, category, institution.region)
  const showRate =
    isCryptoQuote(quote) ||
    category === 'international_transfer' ||
    category === 'swift' ||
    quote !== 'EUR'
  const conversion = makeConversion(amountEur, quote, rates, showRate, locale.bcp47)
  let secondary: Conversion | undefined
  if (isCryptoQuote(quote) && chance(rng, 0.45)) {
    secondary = makeConversion(amountEur, pick(rng, ['USD', 'GBP'] as const), rates, false, locale.bcp47)
  } else if (quote === 'EUR' && institution.region === 'US') {
    secondary = makeConversion(amountEur, 'USD', rates, true, locale.bcp47)
  }

  const now = Date.now()
  const offsetMin = randInt(rng, -14 * 24 * 60, status === 'scheduled' ? -30 : 0)
  const ts = new Date(now + offsetMin * 60000)
  const scheduledFor =
    status === 'scheduled'
      ? new Date(now + randInt(rng, 6, 72) * 3600000).toISOString()
      : undefined

  const crypto = cryptoOf(category)
  const note = pick(rng, NOTES[locale.id])
  let statusReason: string | undefined
  if (status === 'failed') statusReason = pick(rng, FAIL_REASONS[locale.id])
  if (status === 'cancelled') statusReason = pick(rng, CANCEL_REASONS[locale.id])

  const scenario: Scenario = {
    seed,
    synthetic: true,
    category,
    status,
    locale: locale.id,
    dir: locale.dir,
    bcp47: locale.bcp47,
    device,
    appearance,
    fontScale,
    themeId,
    layoutId,
    region: institution.region,
    institution,
    sender,
    recipient,
    amountEur,
    feeEur,
    totalEur,
    conversion,
    secondary,
    transactionId: transactionId(rng, category),
    note,
    statusReason,
    timestamp: ts.toISOString(),
    scheduledFor,
    etaLabel: etaFor(rng, status, locale.id, category),
    visual: visuals(rng, layoutId, fontScale),
    battery: randInt(rng, 18, 100),
    clock: formatClock(ts.toISOString(), locale.bcp47),
    signal: randInt(rng, 2, 4),
  }

  if (
    category === 'sepa' ||
    category === 'iban_transfer' ||
    category === 'bank_transfer' ||
    category === 'swift'
  ) {
    scenario.ibanFrom = synthIban(rng, institution.region)
    scenario.ibanTo = synthIban(rng, institution.region)
    scenario.accountFrom = synthAccount(rng)
    scenario.accountTo = synthAccount(rng)
  }
  if (crypto) {
    scenario.networkName = networkName(crypto)
    scenario.walletFrom = synthWallet(rng, crypto)
    scenario.walletTo = synthWallet(rng, crypto)
  }
  if (category === 'online_wallet' || category === 'p2p') {
    scenario.accountFrom = synthAccount(rng)
    scenario.accountTo = synthAccount(rng)
  }
  if (category === 'mobile_recharge') {
    scenario.phone = synthPhone(rng)
    scenario.operator = operators(rng)
  }
  if (category === 'cash_transfer' || category === 'international_transfer') {
    scenario.pickupCode = pickupCode(rng)
    scenario.pickupPoint = pickupPoint(rng, institution.region)
  }
  if (category === 'card_to_card') {
    scenario.cardFrom = synthCardMask(rng)
    scenario.cardTo = synthCardMask(rng)
  }

  return scenario
}
