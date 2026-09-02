import type { BankRegion, Institution, PaymentCategory } from '../types.ts'
import { pick, type Rng } from './random.ts'

export const INSTITUTIONS: Institution[] = [
  // Banche IT
  { id: 'intesa-sanpaolo', name: 'Intesa Sanpaolo', short: 'Intesa', region: 'IT', kind: 'bank', logo: '/logos/intesa-sanpaolo.svg' },
  { id: 'unicredit', name: 'UniCredit', short: 'UniCredit', region: 'IT', kind: 'bank', logo: '/logos/unicredit.svg' },
  { id: 'fineco', name: 'Fineco', short: 'Fineco', region: 'IT', kind: 'bank', logo: '/logos/fineco.svg' },
  // Banche US
  { id: 'chase', name: 'Chase', short: 'Chase', region: 'US', kind: 'bank', logo: '/logos/chase.svg' },
  { id: 'bank-of-america', name: 'Bank of America', short: 'BoA', region: 'US', kind: 'bank', logo: '/logos/bankofamerica.svg' },
  { id: 'wells-fargo', name: 'Wells Fargo', short: 'Wells Fargo', region: 'US', kind: 'bank', logo: '/logos/wellsfargo.svg' },
  // Banche EU
  { id: 'revolut', name: 'Revolut', short: 'Revolut', region: 'EU', kind: 'bank', logo: '/logos/revolut.svg' },
  { id: 'n26', name: 'N26', short: 'N26', region: 'EU', kind: 'bank', logo: '/logos/n26.svg' },
  // Banche DE
  { id: 'deutsche-bank', name: 'Deutsche Bank', short: 'Deutsche Bank', region: 'DE', kind: 'bank', logo: '/logos/deutschebank.svg' },
  { id: 'commerzbank', name: 'Commerzbank', short: 'Commerzbank', region: 'DE', kind: 'bank', logo: '/logos/commerzbank.svg' },
  // Banche FR
  { id: 'bnp-paribas', name: 'BNP Paribas', short: 'BNP', region: 'FR', kind: 'bank', logo: '/logos/bnp-paribas.svg' },
  { id: 'societe-generale', name: 'Société Générale', short: 'SocGen', region: 'FR', kind: 'bank', logo: '/logos/societe-generale.svg' },
  // Banche RO
  { id: 'bcr', name: 'BCR', short: 'BCR', region: 'RO', kind: 'bank', logo: '/logos/bcr.png' },
  { id: 'brd', name: 'BRD', short: 'BRD', region: 'RO', kind: 'bank', logo: '/logos/brd.png' },
  // Banche GB
  { id: 'barclays', name: 'Barclays', short: 'Barclays', region: 'GB', kind: 'bank', logo: '/logos/barclays.svg' },
  { id: 'hsbc', name: 'HSBC', short: 'HSBC', region: 'GB', kind: 'bank', logo: '/logos/hsbc.svg' },
  // Banche ES
  { id: 'santander', name: 'Santander', short: 'Santander', region: 'ES', kind: 'bank', logo: '/logos/santander.svg' },
  { id: 'bbva', name: 'BBVA', short: 'BBVA', region: 'ES', kind: 'bank', logo: '/logos/bbva.svg' },
  // Banche CH
  { id: 'ubs', name: 'UBS', short: 'UBS', region: 'CH', kind: 'bank', logo: '/logos/ubs.png' },
  // Banche AF
  { id: 'standard-bank', name: 'Standard Bank', short: 'Standard Bank', region: 'AF', kind: 'bank', logo: '/logos/standard-bank.svg' },
  { id: 'ecobank', name: 'Ecobank', short: 'Ecobank', region: 'AF', kind: 'bank', logo: '/logos/ecobank.png' },
  // Wallet
  { id: 'paypal', name: 'PayPal', short: 'PayPal', region: 'INTL', kind: 'wallet', logo: '/logos/paypal.svg' },
  { id: 'apple-pay', name: 'Apple Pay', short: 'Apple Pay', region: 'INTL', kind: 'wallet', logo: '/logos/applepay.svg' },
  { id: 'google-pay', name: 'Google Pay', short: 'Google Pay', region: 'INTL', kind: 'wallet', logo: '/logos/googlepay.svg' },
  // P2P
  { id: 'venmo', name: 'Venmo', short: 'Venmo', region: 'US', kind: 'p2p', logo: '/logos/venmo.svg' },
  { id: 'cash-app', name: 'Cash App', short: 'Cash App', region: 'US', kind: 'p2p', logo: '/logos/cashapp.svg' },
  // Remit
  { id: 'wise', name: 'Wise', short: 'Wise', region: 'INTL', kind: 'remit', logo: '/logos/wise.svg' },
  { id: 'western-union', name: 'Western Union', short: 'Western Union', region: 'INTL', kind: 'remit', logo: '/logos/westernunion.svg' },
  { id: 'remitly', name: 'Remitly', short: 'Remitly', region: 'INTL', kind: 'remit', logo: '/logos/remitly.png' },
  // Crypto exchange
  { id: 'binance', name: 'Binance', short: 'Binance', region: 'INTL', kind: 'crypto', logo: '/logos/binance.svg' },
  { id: 'coinbase', name: 'Coinbase', short: 'Coinbase', region: 'INTL', kind: 'crypto', logo: '/logos/coinbase.svg' },
  { id: 'kraken', name: 'Kraken', short: 'Kraken', region: 'INTL', kind: 'crypto', logo: '/logos/kraken.svg' },
  { id: 'crypto-com', name: 'Crypto.com', short: 'Crypto.com', region: 'INTL', kind: 'crypto', logo: '/logos/crypto-com.svg' },
  // Telco
  { id: 'tim', name: 'TIM', short: 'TIM', region: 'IT', kind: 'telco', logo: '/logos/tim.svg' },
  { id: 'vodafone', name: 'Vodafone', short: 'Vodafone', region: 'EU', kind: 'telco', logo: '/logos/vodafone.svg' },
  { id: 'orange', name: 'Orange', short: 'Orange', region: 'FR', kind: 'telco', logo: '/logos/orange.svg' },
  // Cash
  { id: 'moneygram', name: 'MoneyGram', short: 'MoneyGram', region: 'INTL', kind: 'cash', logo: '/logos/moneygram.svg' },
  // Carte
  { id: 'visa', name: 'Visa', short: 'Visa', region: 'INTL', kind: 'cards', logo: '/logos/visa.svg' },
  { id: 'mastercard', name: 'Mastercard', short: 'Mastercard', region: 'INTL', kind: 'cards', logo: '/logos/mastercard.svg' },
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
