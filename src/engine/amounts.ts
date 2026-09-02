import { chance, randInt, type Rng } from './random.ts'

function irregularCents(rng: Rng): number {
  if (chance(rng, 0.07)) return 0
  if (chance(rng, 0.12)) return pickCent(rng, [10, 20, 25, 40, 50, 75, 80, 90])
  if (chance(rng, 0.18)) return pickCent(rng, [5, 15, 18, 30, 35, 45, 55, 60, 65, 70, 85, 95])
  return randInt(rng, 1, 99)
}

function pickCent(rng: Rng, cents: number[]): number {
  return cents[Math.floor(rng() * cents.length)] as number
}

function sampleBand(rng: Rng, min: number, max: number, mode: number): number {
  const u = rng()
  const v = rng()
  const tri = u < (mode - min) / (max - min)
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode))
  const mix = tri * 0.72 + (min + v * (max - min)) * 0.28
  return mix
}

export function sampleEurAmount(rng: Rng): number {
  const u = rng()
  let raw: number
  if (u < 0.62) {
    raw = sampleBand(rng, 700, 1200, 940)
  } else if (u < 0.8) {
    raw = sampleBand(rng, 100, 699, 420)
  } else if (u < 0.95) {
    raw = sampleBand(rng, 1201, 2500, 1680)
  } else {
    raw = sampleBand(rng, 2501, 4320, 3100)
  }
  raw = Math.min(4320, Math.max(100, raw))
  const euros = Math.floor(raw)
  const cents = irregularCents(rng)
  const amount = euros + cents / 100
  return Math.min(4320, Math.max(100, Math.round(amount * 100) / 100))
}

export function sampleFeeEur(rng: Rng, category: string, amount: number): number {
  switch (category) {
    case 'sepa':
    case 'iban_transfer':
    case 'bank_transfer':
      return chance(rng, 0.55) ? 0 : roundFee(randInt(rng, 20, 180) / 100)
    case 'swift':
      return roundFee(8 + rng() * 18)
    case 'international_transfer':
      return roundFee(amount * (0.018 + rng() * 0.027) + 2.1 + rng() * 3)
    case 'ton_crypto':
    case 'btc_crypto':
    case 'usdt_crypto':
    case 'eth_crypto':
    case 'xmr_crypto':
      return roundFee(0.12 + rng() * 3.8)
    case 'p2p':
    case 'online_wallet':
      return chance(rng, 0.7) ? 0 : roundFee(amount * 0.005 + rng() * 0.4)
    case 'mobile_recharge':
      return chance(rng, 0.8) ? 0 : roundFee(0.49 + rng() * 0.8)
    case 'cash_transfer':
      return roundFee(amount * (0.012 + rng() * 0.02) + 1.5)
    case 'card_to_card':
      return roundFee(amount * (0.006 + rng() * 0.012) + 0.3)
    default:
      return roundFee(rng() * 4)
  }
}

function roundFee(n: number): number {
  return Math.round(Math.max(0, n) * 100) / 100
}
