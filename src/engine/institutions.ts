import type { BankRegion, Institution, PaymentCategory } from '../types.ts'
import { pick, type Rng } from './random.ts'

const icon = (id: string) => `/logos/icons/${id}.png`

export const INSTITUTIONS: Institution[] = [
  { id: 'intesa-sanpaolo', name: 'Intesa Sanpaolo', short: 'Intesa', region: 'IT', kind: 'bank', logo: '/logos/intesa-sanpaolo.svg', icon: icon('intesa-sanpaolo'), domain: 'intesasanpaolo.com' },
  { id: 'unicredit', name: 'UniCredit', short: 'UniCredit', region: 'IT', kind: 'bank', logo: '/logos/unicredit.svg', icon: icon('unicredit'), domain: 'unicredit.it' },
  { id: 'fineco', name: 'Fineco', short: 'Fineco', region: 'IT', kind: 'bank', logo: '/logos/fineco.svg', icon: icon('fineco'), domain: 'finecobank.com' },
  { id: 'chase', name: 'Chase', short: 'Chase', region: 'US', kind: 'bank', logo: '/logos/chase.svg', icon: icon('chase'), domain: 'chase.com' },
  { id: 'bank-of-america', name: 'Bank of America', short: 'BoA', region: 'US', kind: 'bank', logo: '/logos/bankofamerica.svg', icon: icon('bank-of-america'), domain: 'bankofamerica.com' },
  { id: 'wells-fargo', name: 'Wells Fargo', short: 'Wells Fargo', region: 'US', kind: 'bank', logo: '/logos/wellsfargo.svg', icon: icon('wells-fargo'), domain: 'wellsfargo.com' },
  { id: 'revolut', name: 'Revolut', short: 'Revolut', region: 'EU', kind: 'bank', logo: '/logos/revolut.svg', icon: icon('revolut'), domain: 'revolut.com' },
  { id: 'n26', name: 'N26', short: 'N26', region: 'EU', kind: 'bank', logo: '/logos/n26.svg', icon: icon('n26'), domain: 'n26.com' },
  { id: 'deutsche-bank', name: 'Deutsche Bank', short: 'Deutsche Bank', region: 'DE', kind: 'bank', logo: '/logos/deutschebank.svg', icon: icon('deutsche-bank'), domain: 'db.com' },
  { id: 'commerzbank', name: 'Commerzbank', short: 'Commerzbank', region: 'DE', kind: 'bank', logo: '/logos/commerzbank.svg', icon: icon('commerzbank'), domain: 'commerzbank.com' },
  { id: 'bnp-paribas', name: 'BNP Paribas', short: 'BNP', region: 'FR', kind: 'bank', logo: '/logos/bnp-paribas.svg', icon: icon('bnp-paribas'), domain: 'bnpparibas.com' },
  { id: 'societe-generale', name: 'Société Générale', short: 'SocGen', region: 'FR', kind: 'bank', logo: '/logos/societe-generale.svg', icon: icon('societe-generale'), domain: 'societegenerale.com' },
  { id: 'bcr', name: 'BCR', short: 'BCR', region: 'RO', kind: 'bank', logo: '/logos/bcr.png', icon: icon('bcr'), domain: 'bcr.ro' },
  { id: 'brd', name: 'BRD', short: 'BRD', region: 'RO', kind: 'bank', logo: '/logos/brd.png', icon: icon('brd'), domain: 'brd.ro' },
  { id: 'barclays', name: 'Barclays', short: 'Barclays', region: 'GB', kind: 'bank', logo: '/logos/barclays.svg', icon: icon('barclays'), domain: 'barclays.com' },
  { id: 'hsbc', name: 'HSBC', short: 'HSBC', region: 'GB', kind: 'bank', logo: '/logos/hsbc.svg', icon: icon('hsbc'), domain: 'hsbc.com' },
  { id: 'santander', name: 'Santander', short: 'Santander', region: 'ES', kind: 'bank', logo: '/logos/santander.svg', icon: icon('santander'), domain: 'santander.com' },
  { id: 'bbva', name: 'BBVA', short: 'BBVA', region: 'ES', kind: 'bank', logo: '/logos/bbva.svg', icon: icon('bbva'), domain: 'bbva.com' },
  { id: 'ubs', name: 'UBS', short: 'UBS', region: 'CH', kind: 'bank', logo: '/logos/ubs.png', icon: icon('ubs'), domain: 'ubs.com' },
  { id: 'standard-bank', name: 'Standard Bank', short: 'Standard Bank', region: 'AF', kind: 'bank', logo: '/logos/standard-bank.svg', icon: icon('standard-bank'), domain: 'standardbank.com' },
  { id: 'ecobank', name: 'Ecobank', short: 'Ecobank', region: 'AF', kind: 'bank', logo: '/logos/ecobank.png', icon: icon('ecobank'), domain: 'ecobank.com' },
  { id: 'paypal', name: 'PayPal', short: 'PayPal', region: 'INTL', kind: 'wallet', logo: '/logos/paypal.svg', icon: icon('paypal'), domain: 'paypal.com' },
  { id: 'apple-pay', name: 'Apple Pay', short: 'Apple Pay', region: 'INTL', kind: 'wallet', logo: '/logos/applepay.svg', icon: icon('apple-pay'), domain: 'apple.com' },
  { id: 'google-pay', name: 'Google Pay', short: 'Google Pay', region: 'INTL', kind: 'wallet', logo: '/logos/googlepay.svg', icon: icon('google-pay'), domain: 'google.com' },
  { id: 'venmo', name: 'Venmo', short: 'Venmo', region: 'US', kind: 'p2p', logo: '/logos/venmo.svg', icon: icon('venmo'), domain: 'venmo.com' },
  { id: 'cash-app', name: 'Cash App', short: 'Cash App', region: 'US', kind: 'p2p', logo: '/logos/cashapp.svg', icon: icon('cash-app'), domain: 'cash.app' },
  { id: 'wise', name: 'Wise', short: 'Wise', region: 'INTL', kind: 'remit', logo: '/logos/wise.svg', icon: icon('wise'), domain: 'wise.com' },
  { id: 'western-union', name: 'Western Union', short: 'Western Union', region: 'INTL', kind: 'remit', logo: '/logos/westernunion.svg', icon: icon('western-union'), domain: 'westernunion.com' },
  { id: 'remitly', name: 'Remitly', short: 'Remitly', region: 'INTL', kind: 'remit', logo: '/logos/remitly.png', icon: icon('remitly'), domain: 'remitly.com' },
  { id: 'binance', name: 'Binance', short: 'Binance', region: 'INTL', kind: 'crypto', logo: '/logos/binance.svg', icon: icon('binance'), domain: 'binance.com' },
  { id: 'coinbase', name: 'Coinbase', short: 'Coinbase', region: 'INTL', kind: 'crypto', logo: '/logos/coinbase.svg', icon: icon('coinbase'), domain: 'coinbase.com' },
  { id: 'kraken', name: 'Kraken', short: 'Kraken', region: 'INTL', kind: 'crypto', logo: '/logos/kraken.svg', icon: icon('kraken'), domain: 'kraken.com' },
  { id: 'crypto-com', name: 'Crypto.com', short: 'Crypto.com', region: 'INTL', kind: 'crypto', logo: '/logos/crypto-com.svg', icon: icon('crypto-com'), domain: 'crypto.com' },
  { id: 'tim', name: 'TIM', short: 'TIM', region: 'IT', kind: 'telco', logo: '/logos/tim.svg', icon: icon('tim'), domain: 'tim.it' },
  { id: 'vodafone', name: 'Vodafone', short: 'Vodafone', region: 'EU', kind: 'telco', logo: '/logos/vodafone.svg', icon: icon('vodafone'), domain: 'vodafone.com' },
  { id: 'orange', name: 'Orange', short: 'Orange', region: 'FR', kind: 'telco', logo: '/logos/orange.svg', icon: icon('orange'), domain: 'orange.com' },
  { id: 'moneygram', name: 'MoneyGram', short: 'MoneyGram', region: 'INTL', kind: 'cash', logo: '/logos/moneygram.svg', icon: icon('moneygram'), domain: 'moneygram.com' },
  { id: 'visa', name: 'Visa', short: 'Visa', region: 'INTL', kind: 'cards', logo: '/logos/visa.svg', icon: icon('visa'), domain: 'visa.com' },
  { id: 'mastercard', name: 'Mastercard', short: 'Mastercard', region: 'INTL', kind: 'cards', logo: '/logos/mastercard.svg', icon: icon('mastercard'), domain: 'mastercard.com' },
]

function kindFor(category: PaymentCategory): Institution['kind'] {
  switch (category) {
    case 'ton_crypto':
    case 'btc_crypto':
    case 'usdt_crypto':
    case 'eth_crypto':
    case 'xmr_crypto':
      return 'crypto'
    case 'online_wallet':
      return 'wallet'
    case 'international_transfer':
      return 'remit'
    case 'p2p':
      return 'p2p'
    case 'mobile_recharge':
      return 'telco'
    case 'cash_transfer':
      return 'cash'
    case 'card_to_card':
      return 'cards'
    default:
      return 'bank'
  }
}

function regionBias(locale: string): BankRegion[] {
  switch (locale) {
    case 'it':
      return ['IT', 'EU', 'DE', 'FR']
    case 'de':
      return ['DE', 'EU', 'CH', 'FR']
    case 'fr':
      return ['FR', 'EU', 'CH', 'AF']
    case 'es':
      return ['ES', 'EU', 'FR']
    case 'pt':
      return ['EU', 'AF', 'FR', 'ES']
    case 'en':
      return ['US', 'GB', 'EU', 'AF', 'INTL']
    case 'ar':
      return ['AF', 'FR', 'EU', 'INTL']
    case 'fa':
      return ['EU', 'DE', 'INTL']
    case 'ru':
    case 'uk':
      return ['EU', 'DE', 'RO']
    default:
      return ['EU', 'INTL', 'US', 'AF', 'DE', 'FR']
  }
}

export function pickInstitution(
  rng: Rng,
  category: PaymentCategory,
  locale: string,
): Institution {
  const kind = kindFor(category)
  const preferred = regionBias(locale)
  const pool = INSTITUTIONS.filter((i) => i.kind === kind)
  const biased = pool.filter((i) => preferred.includes(i.region))
  const list = biased.length ? biased : pool
  return pick(rng, list)
}

export function pickupPoint(rng: Rng, region: BankRegion): string {
  const places: Record<BankRegion, string[]> = {
    IT: ['Filiale Intesa Sanpaolo, Via Roma 14', 'UniCredit, Piazza Duomo 3', 'Fineco, Corso Garibaldi 88'],
    US: ['Chase Branch Desk 12', 'Bank of America Counter B', 'Wells Fargo Kiosk 4'],
    EU: ['Revolut Point 2', 'N26 Service Desk 9'],
    DE: ['Deutsche Bank Schalter 3', 'Commerzbank Punkt 1'],
    FR: ['BNP Paribas Guichet 5', 'Société Générale Point Relais 2'],
    RO: ['BCR Ghiseu 1', 'BRD Punct 4'],
    GB: ['Barclays Desk 7', 'HSBC Counter 12'],
    ES: ['Santander Ventanilla 3', 'BBVA Punto 6'],
    CH: ['UBS Guichet 1'],
    AF: ['Standard Bank Desk', 'Ecobank Counter 2', 'Western Union Pickup 6'],
    INTL: ['Wise Desk 11', 'Western Union Point 8'],
  }
  return pick(rng, places[region])
}
