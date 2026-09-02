import type { BankRegion, PaymentCategory } from '../types.ts'
import { randInt, type Rng } from './random.ts'

function alnum(rng: Rng, n: number, alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'): string {
  let s = ''
  for (let i = 0; i < n; i++) s += alphabet[Math.floor(rng() * alphabet.length)]
  return s
}

function digits(rng: Rng, n: number): string {
  let s = ''
  for (let i = 0; i < n; i++) s += String(randInt(rng, 0, 9))
  return s
}

function hex(rng: Rng, n: number): string {
  return alnum(rng, n, '0123456789abcdef')
}

export function transactionId(rng: Rng, category: PaymentCategory): string {
  const tag = category.replace(/_/g, '').slice(0, 4).toUpperCase()
  return `${tag}-${alnum(rng, 6)}-${digits(rng, 4)}`
}

export function synthIban(rng: Rng, region: BankRegion): string {
  const cc =
    region === 'IT'
      ? 'IT'
      : region === 'DE'
        ? 'DE'
        : region === 'FR'
          ? 'FR'
          : region === 'RO'
            ? 'RO'
            : region === 'ES'
              ? 'ES'
              : region === 'GB'
                ? 'GB'
                : region === 'CH'
                  ? 'CH'
                  : region === 'US'
                    ? 'DE'
                    : 'BE'
  return `${cc}00${digits(rng, 14)}`
}

export function synthAccount(rng: Rng): string {
  return `${digits(rng, 4)} ${digits(rng, 4)} ${digits(rng, 4)}`
}

export function synthWallet(rng: Rng, network: string): string {
  switch (network) {
    case 'BTC':
      return `bc1q${hex(rng, 6)}…${hex(rng, 4)}`
    case 'ETH':
    case 'USDT':
      return `0x${hex(rng, 6)}…${hex(rng, 4)}`
    case 'TON':
      return `EQ${alnum(rng, 6)}…${alnum(rng, 4)}`
    case 'XMR':
      return `4${hex(rng, 6)}…${hex(rng, 4)}`
    default:
      return `${network.toLowerCase()}:${hex(rng, 6)}…${hex(rng, 4)}`
  }
}

export function synthPhone(rng: Rng, region: BankRegion): string {
  switch (region) {
    case 'IT':
      return `+39 333 555 ${digits(rng, 4)}`
    case 'US':
      return `+1 555 010 ${digits(rng, 4)}`
    case 'GB':
      return `+44 7700 900${digits(rng, 3)}`
    case 'DE':
      return `+49 151 555${digits(rng, 5)}`
    case 'FR':
      return `+33 6 55 00 ${digits(rng, 2)} ${digits(rng, 2)}`
    case 'AF':
      return `+27 82 555 ${digits(rng, 4)}`
    default:
      return `+33 6 55 ${digits(rng, 2)} ${digits(rng, 2)} ${digits(rng, 2)}`
  }
}

export function synthCardMask(rng: Rng): string {
  return `•••• ${digits(rng, 4)}`
}

export function pickupCode(rng: Rng): string {
  return `${digits(rng, 4)} ${digits(rng, 4)} ${alnum(rng, 2)}`
}
