import type { CryptoQuote, DisplayCurrency, RateBook, RateError } from '../types.ts'
import { DISPLAY_CURRENCIES } from '../types.ts'

const FIAT_CODES = DISPLAY_CURRENCIES.filter(
  (c): c is Exclude<DisplayCurrency, 'EUR'> => c !== 'EUR',
)

/** ECB / market mid as of early Sept 2026 — used when a live feed omits a code. */
export const FALLBACK_FIAT_PER_EUR: Record<Exclude<DisplayCurrency, 'EUR'>, number> = {
  USD: 1.159,
  GBP: 0.8566,
  CHF: 0.9394,
  BRL: 6.0255,
  RUB: 98.4,
  SAR: 4.347,
  INR: 110.05,
  IDR: 20566,
  TRY: 55.95,
  VND: 30220,
  PLN: 4.3313,
  UAH: 51.65,
  KRW: 1593.17,
  JPY: 185.63,
  PHP: 72.355,
  THB: 38.554,
  IRR: 48800,
  BDT: 142.8,
  PKR: 322,
  UZS: 14720,
}

function readFiats(src: Record<string, number> | undefined, lower: boolean): Partial<Record<Exclude<DisplayCurrency, 'EUR'>, number>> {
  if (!src) return {}
  const out: Partial<Record<Exclude<DisplayCurrency, 'EUR'>, number>> = {}
  for (const code of FIAT_CODES) {
    const n = src[lower ? code.toLowerCase() : code]
    if (typeof n === 'number' && Number.isFinite(n) && n > 0) out[code] = n
  }
  return out
}

function completeFiats(
  ...partials: Array<Partial<Record<Exclude<DisplayCurrency, 'EUR'>, number>>>
): Record<Exclude<DisplayCurrency, 'EUR'>, number> {
  const out = { ...FALLBACK_FIAT_PER_EUR }
  for (const part of partials) {
    for (const code of FIAT_CODES) {
      const n = part[code]
      if (typeof n === 'number' && n > 0) out[code] = n
    }
  }
  return out
}

const CRYPTO_IDS: Record<CryptoQuote, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  TON: 'the-open-network',
  XMR: 'monero',
  USDT: 'tether',
}

type CoinGeckoPrice = Record<
  string,
  { eur?: number; usd?: number; gbp?: number; chf?: number; last_updated_at?: number }
>

async function getJson(url: string, timeoutMs = 8000): Promise<unknown> {
  const ctrl = new AbortController()
  const t = window.setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    return await res.json()
  } finally {
    window.clearTimeout(t)
  }
}

function isoFromUnix(sec?: number): string {
  if (!sec || !Number.isFinite(sec)) return new Date().toISOString()
  return new Date(sec * 1000).toISOString()
}

function requirePositive(n: unknown, label: string): number {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) {
    throw new Error(`Invalid rate for ${label}`)
  }
  return n
}

async function fromCoinGecko(base: string): Promise<RateBook> {
  const ids = Object.values(CRYPTO_IDS).join(',')
  const path = `/api/v3/simple/price?ids=${ids}&vs_currencies=eur,usd,gbp,chf&include_last_updated_at=true`
  const data = (await getJson(`${base}${path}`)) as CoinGeckoPrice
  const btc = data.bitcoin
  const eth = data.ethereum
  const ton = data['the-open-network']
  const xmr = data.monero
  const usdt = data.tether
  if (!btc || !eth || !ton || !xmr || !usdt) throw new Error('CoinGecko payload incomplete')

  const eurPerCrypto = {
    BTC: requirePositive(btc.eur, 'BTC/EUR'),
    ETH: requirePositive(eth.eur, 'ETH/EUR'),
    TON: requirePositive(ton.eur, 'TON/EUR'),
    XMR: requirePositive(xmr.eur, 'XMR/EUR'),
    USDT: requirePositive(usdt.eur, 'USDT/EUR'),
  }

  const usd = requirePositive(usdt.usd, 'USDT/USD')
  const gbp = requirePositive(usdt.gbp, 'USDT/GBP')
  const chf = requirePositive(usdt.chf, 'USDT/CHF')
  const usdtEur = eurPerCrypto.USDT

  return {
    ok: true,
    timestamp: isoFromUnix(btc.last_updated_at),
    source: 'CoinGecko',
    eurPerCrypto,
    fiatPerEur: completeFiats({
      USD: usd / usdtEur,
      GBP: gbp / usdtEur,
      CHF: chf / usdtEur,
    }),
  }
}

async function fromErApi(base: string): Promise<{
  fiats: Partial<Record<Exclude<DisplayCurrency, 'EUR'>, number>>
  timestamp: string
}> {
  const data = (await getJson(`${base}/v6/latest/EUR`)) as {
    result?: string
    time_last_update_unix?: number
    rates?: Record<string, number>
  }
  if (data.result !== 'success' || !data.rates) throw new Error('ER-API failed')
  return {
    fiats: readFiats(data.rates, false),
    timestamp: isoFromUnix(data.time_last_update_unix),
  }
}

async function fromCurrencyJsDelivr(base: string): Promise<RateBook> {
  const data = (await getJson(`${base}/v1/currencies/eur.json`)) as {
    date?: string
    eur?: Record<string, number>
  }
  const eur = data.eur
  if (!eur) throw new Error('currency-api payload incomplete')
  const perEurToCoin = {
    BTC: requirePositive(eur.btc, 'btc'),
    ETH: requirePositive(eur.eth, 'eth'),
    TON: requirePositive(eur.ton, 'ton'),
    XMR: requirePositive(eur.xmr, 'xmr'),
    USDT: requirePositive(eur.usdt, 'usdt'),
  }
  return {
    ok: true,
    timestamp: data.date ? `${data.date}T00:00:00.000Z` : new Date().toISOString(),
    source: 'fawazahmed0/currency-api',
    eurPerCrypto: {
      BTC: 1 / perEurToCoin.BTC,
      ETH: 1 / perEurToCoin.ETH,
      TON: 1 / perEurToCoin.TON,
      XMR: 1 / perEurToCoin.XMR,
      USDT: 1 / perEurToCoin.USDT,
    },
    fiatPerEur: completeFiats(readFiats(eur, true)),
  }
}

export async function loadRates(): Promise<RateBook | RateError> {
  const geckoBases = ['https://api.coingecko.com', '/rate-proxy/coingecko']
  const erBases = ['https://open.er-api.com', '/rate-proxy/erapi']
  const jsdelivrBases = [
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest',
    '/rate-proxy/currency',
  ]

  let cryptoBook: RateBook | null = null
  let cryptoErr = ''
  for (const base of geckoBases) {
    try {
      cryptoBook = await fromCoinGecko(base)
      break
    } catch (err) {
      cryptoErr = err instanceof Error ? err.message : String(err)
    }
  }

  if (cryptoBook) {
    for (const base of erBases) {
      try {
        const fiat = await fromErApi(base)
        return {
          ...cryptoBook,
          source: `${cryptoBook.source} + ExchangeRate-API`,
          timestamp: cryptoBook.timestamp,
          fiatPerEur: completeFiats(cryptoBook.fiatPerEur, fiat.fiats),
        }
      } catch {
        /* keep derived tether cross */
      }
    }
    return cryptoBook
  }

  for (const base of jsdelivrBases) {
    try {
      return await fromCurrencyJsDelivr(base)
    } catch (err) {
      cryptoErr = `${cryptoErr}; fallback: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  return {
    ok: false,
    message: `Live market data unavailable. Generation is blocked. (${cryptoErr})`,
  }
}
