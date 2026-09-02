import type { BankRegion, PaymentCategory } from '../types.ts'
import { randInt, type Rng } from './random.ts'

const SYNTH = 'SYNTH'

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

export function transactionId(rng: Rng, category: PaymentCategory): string {
  const tag = category.replace(/_/g, '').slice(0, 6).toUpperCase()
  return `${SYNTH}-${tag}-${alnum(rng, 4)}-${digits(rng, 6)}`
}

export function referenceCode(rng: Rng): string {
  return `RF-${SYNTH}-${digits(rng, 8)}`
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
                    : 'EU'
  const body = `${SYNTH}${digits(rng, 10)}`
  return `${cc}00${body}`
}

export function synthAccount(rng: Rng): string {
  return `${SYNTH}-${digits(rng, 4)}-${digits(rng, 4)}`
}

export function synthWallet(rng: Rng, network: string): string {
  const core = alnum(rng, 22, '0123456789abcdef')
  switch (network) {
    case 'BTC':
      return `SYNTH1btc${core.slice(0, 18)}`
    case 'ETH':
    case 'USDT':
      return `0xSYNTH${core}${alnum(rng, 10, '0123456789abcdef')}`
    case 'TON':
      return `EQ-SYNTH-${core.slice(0, 16)}`
    case 'XMR':
      return `4SYNTH${core}${alnum(rng, 18, '0123456789abcdef')}`
    default:
      return `SYNTH1${network.toLowerCase()}${core.slice(0, 16)}`
  }
}

export function synthPhone(rng: Rng): string {
  return `+000 ${digits(rng, 2)} SYNTH ${digits(rng, 4)}`
}

export function synthCardMask(rng: Rng): string {
  return `•••• ${digits(rng, 4)}`
}

export function pickupCode(rng: Rng): string {
  return `${SYNTH}-${digits(rng, 4)}-${alnum(rng, 4)}`
}
