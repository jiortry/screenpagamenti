import type { QuoteCurrency } from '../types.ts'

export function formatFiat(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
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

export function formatClock(iso: string, locale: string, ios = false): string {
  const d = new Date(iso)
  const twelveHour = locale.startsWith('en-US') || locale === 'en' || locale.startsWith('en-CA')
  if (ios || twelveHour) {
    if (twelveHour) {
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
