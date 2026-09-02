import type { BankRegion, Institution, PaymentCategory } from '../types.ts'
import { pick, type Rng } from './random.ts'

export const INSTITUTIONS: Institution[] = [
  { id: 'limenia', name: 'Banca Limenia', short: 'Limenia', region: 'IT', kind: 'bank', monogram: 'BL' },
  { id: 'valtora', name: 'Credito Valtora', short: 'Valtora', region: 'IT', kind: 'bank', monogram: 'CV' },
  { id: 'nortesca', name: 'Cassa Nortesca', short: 'Nortesca', region: 'IT', kind: 'bank', monogram: 'CN' },
  { id: 'harborline', name: 'Harborline Bank', short: 'Harborline', region: 'US', kind: 'bank', monogram: 'HB' },
  { id: 'northridge', name: 'Northridge Federal', short: 'Northridge', region: 'US', kind: 'bank', monogram: 'NF' },
  { id: 'cedarway', name: 'Cedarway Mutual', short: 'Cedarway', region: 'US', kind: 'bank', monogram: 'CM' },
  { id: 'nordhaven', name: 'Nordhaven Bank', short: 'Nordhaven', region: 'EU', kind: 'bank', monogram: 'NH' },
  { id: 'elbwacht', name: 'Elbwacht Bank', short: 'Elbwacht', region: 'DE', kind: 'bank', monogram: 'EB' },
  { id: 'rheinwald', name: 'Rheinwald Kasse', short: 'Rheinwald', region: 'DE', kind: 'bank', monogram: 'RK' },
  { id: 'celeste', name: 'Banque Céleste', short: 'Céleste', region: 'FR', kind: 'bank', monogram: 'BC' },
  { id: 'lyre', name: 'Crédit du Lyre', short: 'Lyre', region: 'FR', kind: 'bank', monogram: 'CL' },
  { id: 'dunarii', name: 'Banca Dunării V', short: 'Dunării', region: 'RO', kind: 'bank', monogram: 'BD' },
  { id: 'orizont', name: 'Credit Orizont', short: 'Orizont', region: 'RO', kind: 'bank', monogram: 'CO' },
  { id: 'thamesor', name: 'Thamesor Trust', short: 'Thamesor', region: 'GB', kind: 'bank', monogram: 'TT' },
  { id: 'iberline', name: 'Iberline Caja', short: 'Iberline', region: 'ES', kind: 'bank', monogram: 'IC' },
  { id: 'alpenor', name: 'Alpenor Banque', short: 'Alpenor', region: 'CH', kind: 'bank', monogram: 'AB' },
  { id: 'okun', name: 'Okun Harbor Bank', short: 'Okun', region: 'AF', kind: 'bank', monogram: 'OH' },
  { id: 'nilebridge', name: 'Nilebridge Ledger', short: 'Nilebridge', region: 'AF', kind: 'bank', monogram: 'NL' },
  { id: 'savanna', name: 'Savanna Wire Bank', short: 'Savanna', region: 'AF', kind: 'bank', monogram: 'SW' },
  { id: 'pebble', name: 'PebblePay', short: 'Pebble', region: 'INTL', kind: 'wallet', monogram: 'PP' },
  { id: 'kinship', name: 'Kinship', short: 'Kinship', region: 'US', kind: 'p2p', monogram: 'KN' },
  { id: 'foldcash', name: 'Fold Cash', short: 'Fold', region: 'US', kind: 'p2p', monogram: 'FC' },
  { id: 'meridian', name: 'Meridian Wire', short: 'Meridian', region: 'INTL', kind: 'remit', monogram: 'MW' },
  { id: 'corridor', name: 'Corridor Send', short: 'Corridor', region: 'INTL', kind: 'remit', monogram: 'CS' },
  { id: 'quarry', name: 'Quarry Wallet', short: 'Quarry', region: 'INTL', kind: 'crypto', monogram: 'QW' },
  { id: 'orbit', name: 'Orbit Vault', short: 'Orbit', region: 'INTL', kind: 'crypto', monogram: 'OV' },
  { id: 'hexbar', name: 'Hexbar', short: 'Hexbar', region: 'INTL', kind: 'crypto', monogram: 'HX' },
  { id: 'nexora', name: 'Nexora Mobile', short: 'Nexora', region: 'EU', kind: 'telco', monogram: 'NX' },
  { id: 'voltsim', name: 'VoltSim', short: 'VoltSim', region: 'IT', kind: 'telco', monogram: 'VS' },
  { id: 'aethertel', name: 'AetherTel', short: 'AetherTel', region: 'US', kind: 'telco', monogram: 'AT' },
  { id: 'kivupick', name: 'Kivu Pickup', short: 'Kivu', region: 'AF', kind: 'cash', monogram: 'KP' },
  { id: 'deskcash', name: 'DeskCash Point', short: 'DeskCash', region: 'EU', kind: 'cash', monogram: 'DC' },
  { id: 'splitcard', name: 'Splitcard', short: 'Splitcard', region: 'EU', kind: 'cards', monogram: 'SC' },
  { id: 'circuit', name: 'Circuit Debit', short: 'Circuit', region: 'US', kind: 'cards', monogram: 'CD' },
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
    IT: ['Via Nox 14, Limenia', 'Piazza Valtora 3', 'Corso Sartela 88'],
    US: ['Harborline Desk 12', 'Northridge Counter B', 'Cedarway Kiosk 4'],
    EU: ['Nordhaven Desk 2', 'EU Corridor Point 9'],
    DE: ['Elbwacht Schalter 3', 'Rheinwald Punkt 1'],
    FR: ['Guichet Céleste 5', 'Lyre Point Relais 2'],
    RO: ['Orizont Ghiseu 1', 'Dunării Punct 4'],
    GB: ['Thamesor Desk 7', 'Wharf Counter SYNTH'],
    ES: ['Iberline Ventanilla 3'],
    CH: ['Alpenor Guichet 1'],
    AF: ['Okun Harbor Desk', 'Nilebridge Counter 2', 'Savanna Pickup 6'],
    INTL: ['Meridian Desk 11', 'Corridor Point SYNTH'],
  }
  return pick(rng, places[region])
}
