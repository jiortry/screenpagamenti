import type { Appearance, DeviceSpec, Institution, PaymentCategory, QuoteCurrency, RateBook, Scenario } from '../types.ts'
import { formatClock, formatRate } from './format.ts'
import {
  pickupCode,
  synthAccount,
  synthCardMask,
  synthIban,
  synthPhone,
  synthWallet,
} from './identifiers.ts'
import { INSTITUTIONS, pickupPoint } from './institutions.ts'
import { convertFromEur, isCryptoQuote } from './math.ts'
import { mulberry32 } from './random.ts'
import { pickLayout } from './themes.ts'

export const PREVIEW_BRANDS = [
  'intesa-sanpaolo',
  'unicredit',
  'revolut',
  'n26',
  'chase',
  'paypal',
  'cash-app',
  'wise',
  'binance',
  'coinbase',
] as const

function categoryFor(kind: Institution['kind']): PaymentCategory {
  switch (kind) {
    case 'wallet':
      return 'online_wallet'
    case 'p2p':
      return 'p2p'
    case 'remit':
      return 'international_transfer'
    case 'crypto':
      return 'btc_crypto'
    case 'telco':
      return 'mobile_recharge'
    case 'cash':
      return 'cash_transfer'
    case 'cards':
      return 'card_to_card'
    default:
      return 'sepa'
  }
}

export function previewScenario(
  institutionId: string,
  rates: RateBook,
  device: DeviceSpec,
  appearance: Appearance = 'light',
): Scenario {
  const institution = INSTITUTIONS.find((i) => i.id === institutionId)
  if (!institution) throw new Error(`Unknown institution ${institutionId}`)
  const rng = mulberry32(institutionId.split('').reduce((n, c) => n + c.charCodeAt(0), 1))
  const category = categoryFor(institution.kind)
  const crypto = category.includes('crypto')
  const quote: QuoteCurrency = crypto
    ? 'BTC'
    : category === 'international_transfer'
      ? 'USD'
      : institution.region === 'US'
        ? 'USD'
        : 'EUR'
  const amountEur = 1280
  const feeEur = crypto ? 2.4 : 1.5
  const totalEur = Math.round((amountEur + feeEur) * 100) / 100
  const { converted_amount, exchange_rate } = convertFromEur(amountEur, quote, rates)
  const ts = new Date('2026-04-12T14:36:00Z')
  const showRate = isCryptoQuote(quote) || quote !== 'EUR' || category === 'international_transfer'
  const scenario: Scenario = {
    seed: 1,
    synthetic: true,
    category,
    status: 'completed',
    locale: 'en',
    dir: 'ltr',
    bcp47: 'en-US',
    device,
    appearance,
    fontScale: 1,
    themeId: 'atlas',
    layoutId: pickLayout(category),
    region: institution.region,
    institution,
    sender: { given: 'Alex', family: 'Marino', full: 'Alex Marino', initials: 'AM' },
    recipient: { given: 'Sofia', family: 'Chen', full: 'Sofia Chen', initials: 'SC' },
    amountEur,
    feeEur,
    totalEur,
    conversion: {
      base_amount: amountEur,
      base_currency: 'EUR',
      quote_currency: quote,
      exchange_rate,
      converted_amount,
      rate_timestamp: rates.timestamp,
      display_rate: formatRate(quote, exchange_rate, 'en-US'),
      show_rate: showRate,
    },
    transactionId: `PREV-${institution.id.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase()}-4821`,
    note: 'Rent April',
    timestamp: ts.toISOString(),
    etaLabel: 'Instant',
    showStatusBadge: true,
    visual: {
      headerHeight: 64,
      showBalance: true,
      iconStyle: 'circle',
      summaryStyle: 'rows',
      buttonPlacement: 'bottom-sticky',
      bgTreatment: 'flat',
      cardOffset: 4,
      typeScale: 1,
      spacingScale: 1,
    },
    battery: 74,
    clock: formatClock(ts.toISOString(), 'en-US', device.family === 'iphone'),
    signal: 4,
    carrier: 'Verizon',
    accountBalance: 4820.12,
  }
  if (category === 'sepa') {
    scenario.ibanFrom = synthIban(rng, institution.region)
    scenario.ibanTo = synthIban(rng, institution.region)
    scenario.accountFrom = synthAccount(rng)
    scenario.accountTo = synthAccount(rng)
  }
  if (crypto) {
    scenario.networkName = 'Bitcoin'
    scenario.walletFrom = synthWallet(rng, 'BTC')
    scenario.walletTo = synthWallet(rng, 'BTC')
  }
  if (category === 'online_wallet' || category === 'p2p') {
    scenario.accountFrom = synthAccount(rng)
    scenario.accountTo = synthAccount(rng)
  }
  if (category === 'mobile_recharge') {
    scenario.phone = synthPhone(rng, institution.region)
    scenario.operator = institution.short
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
