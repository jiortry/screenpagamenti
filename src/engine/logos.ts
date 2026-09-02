import type { CryptoQuote } from '../types.ts'

/** Mappa nome operatore/carrier → file logo in /public/logos */
export const CARRIER_LOGOS: Record<string, string> = {
  TIM: '/logos/tim.svg',
  Vodafone: '/logos/vodafone.svg',
  WindTre: '/logos/windtre.png',
  Iliad: '/logos/iliad.png',
  Telekom: '/logos/deutschetelekom.svg',
  'Deutsche Telekom': '/logos/deutschetelekom.svg',
  Orange: '/logos/orange.svg',
  SFR: '/logos/sfr.svg',
  Movistar: '/logos/movistar.svg',
  Verizon: '/logos/verizon.svg',
  'T-Mobile': '/logos/t-mobile.svg',
  'AT&T': '/logos/atandt.svg',
  O2: '/logos/o2.svg',
  Jio: '/logos/jio.svg',
  Airtel: '/logos/airtel.svg',
  MTN: '/logos/mtn.png',
  Safaricom: '/logos/safaricom.svg',
  Swisscom: '/logos/swisscom.svg',
}

export const CRYPTO_LOGOS: Record<CryptoQuote, string> = {
  BTC: '/logos/bitcoin.svg',
  ETH: '/logos/ethereum.svg',
  USDT: '/logos/tether.svg',
  TON: '/logos/ton.svg',
  XMR: '/logos/monero.svg',
}

export function carrierLogo(carrier: string): string | undefined {
  return CARRIER_LOGOS[carrier]
}
