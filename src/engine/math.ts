import type { CryptoQuote, FiatQuote, QuoteCurrency, RateBook } from '../types.ts'

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function roundCrypto(n: number): number {
  if (n >= 100) return round2(n)
  if (n >= 1) return Math.round(n * 1e6) / 1e6
  if (n >= 0.01) return Math.round(n * 1e8) / 1e8
  return Math.round(n * 1e10) / 1e10
}

export function convertFromEur(
  amountEur: number,
  quote: QuoteCurrency,
  rates: RateBook,
): { converted_amount: number; exchange_rate: number } {
  if (quote === 'EUR') {
    return { converted_amount: round2(amountEur), exchange_rate: 1 }
  }
  if (quote === 'USD' || quote === 'GBP' || quote === 'CHF') {
    const rate = rates.fiatPerEur[quote]
    return { converted_amount: round2(amountEur * rate), exchange_rate: rate }
  }
  const eurPerCoin = rates.eurPerCrypto[quote]
  return {
    converted_amount: roundCrypto(amountEur / eurPerCoin),
    exchange_rate: eurPerCoin,
  }
}

export function expectedConverted(
  amountEur: number,
  quote: QuoteCurrency,
  rates: RateBook,
): number {
  return convertFromEur(amountEur, quote, rates).converted_amount
}

export function mathMatches(
  amountEur: number,
  quote: QuoteCurrency,
  rate: number,
  converted: number,
): boolean {
  if (quote === 'EUR') {
    return Math.abs(converted - amountEur) < 0.011 && Math.abs(rate - 1) < 1e-9
  }
  const fiat: FiatQuote[] = ['USD', 'GBP', 'CHF']
  if ((fiat as string[]).includes(quote)) {
    const expect = round2(amountEur * rate)
    return Math.abs(expect - converted) < 0.02
  }
  const expect = amountEur / rate
  const rel = Math.abs(expect - converted) / Math.max(expect, 1e-12)
  return rel < 0.0025
}

export function isCryptoQuote(q: QuoteCurrency): q is CryptoQuote {
  return q === 'BTC' || q === 'ETH' || q === 'TON' || q === 'XMR' || q === 'USDT'
}
