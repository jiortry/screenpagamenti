import type { QuoteCurrency, Scenario } from '../types.ts'

const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND', 'IDR', 'UZS', 'IRR'])

export function fiatDigits(currency: string): number {
  return ZERO_DECIMAL.has(currency) ? 0 : 2
}

export function fromEurAmount(amountEur: number, currency: string, perEur: number): number {
  const rate = currency === 'EUR' ? 1 : perEur
  const f = 10 ** fiatDigits(currency)
  return Math.round(amountEur * rate * f) / f
}

export function formatFiat(amount: number, currency: string, locale: string): string {
  const digits = fiatDigits(currency)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount)
}

export function formatLocal(
  s: Pick<Scenario, 'displayCurrency' | 'displayPerEur' | 'bcp47'>,
  amountEur: number,
): string {
  return formatFiat(fromEurAmount(amountEur, s.displayCurrency, s.displayPerEur), s.displayCurrency, s.bcp47)
}

export function formatCrypto(amount: number, symbol: string, locale: string): string {
  const max =
    amount >= 100 ? 2 : amount >= 1 ? 6 : amount >= 0.01 ? 8 : 10
  const n = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: max,
  }).format(amount)
  return `${n} ${symbol}`
}

export function formatQuote(amount: number, quote: QuoteCurrency, locale: string): string {
  if (quote === 'EUR' || quote === 'USD' || quote === 'GBP' || quote === 'CHF') {
    return formatFiat(amount, quote, locale)
  }
  return formatCrypto(amount, quote, locale)
}

export function formatDateTime(iso: string, locale: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso))
}

export function formatRelativeActivity(
  iso: string,
  mainIso: string,
  _locale: string,
  labels: { today: string; yesterday: string; daysAgo: (n: number) => string },
): string {
  const ts = new Date(iso)
  const main = new Date(mainIso)
  const dayMs = 86400000
  const diffDays = Math.max(0, Math.floor((main.setHours(0, 0, 0, 0) - ts.setHours(0, 0, 0, 0)) / dayMs))
  if (diffDays === 0) return labels.today
  if (diffDays === 1) return labels.yesterday
  return labels.daysAgo(diffDays)
}

export type ClockOpts = {
  ios?: boolean
  timezone?: string
  clock24h?: boolean
}

export function formatClock(iso: string, locale: string, opts: ClockOpts | boolean = {}): string {
  const o: ClockOpts = typeof opts === 'boolean' ? { ios: opts } : opts
  const d = new Date(iso)
  const twelveHour =
    o.clock24h === false ||
    (!o.clock24h &&
      (locale.startsWith('en-US') ||
        locale === 'en' ||
        locale.startsWith('en-CA') ||
        locale.startsWith('en-GB') ||
        locale.startsWith('en-AU')))
  const use12 = twelveHour && o.clock24h !== true
  if (o.timezone) {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: use12,
      timeZone: o.timezone,
    }).format(d)
  }
  if (o.ios || use12) {
    if (use12) {
      const h = d.getHours() % 12 || 12
      return `${h}:${String(d.getMinutes()).padStart(2, '0')}`
    }
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

export function formatTxWhen(
  iso: string,
  mainIso: string,
  locale: string,
  labels: { minutesAgo: (n: number) => string; today: string },
): string {
  const ts = new Date(iso).getTime()
  const main = new Date(mainIso).getTime()
  const diffMin = Math.round((main - ts) / 60000)
  if (diffMin >= 0 && diffMin < 60) return labels.minutesAgo(Math.max(1, diffMin))
  const sameDay =
    new Date(iso).toDateString() === new Date(mainIso).toDateString()
  if (sameDay) return labels.today
  return formatDateTime(iso, locale)
}

export function formatRate(
  quote: QuoteCurrency,
  exchangeRate: number,
  locale: string,
): string {
  if (quote === 'EUR') return formatFiat(1, 'EUR', locale)
  if (quote === 'USD' || quote === 'GBP' || quote === 'CHF') {
    return `1 EUR = ${formatFiat(exchangeRate, quote, locale)}`
  }
  return `1 ${quote} = ${formatFiat(exchangeRate, 'EUR', locale)}`
}
