import type { LayoutId, LedgerEntry, LocaleId } from '../types.ts'
import { merchantIcon } from './merchants.ts'
import { chance, pick, pickWeighted, randFloat, randInt, type Rng } from './random.ts'

const MERCHANTS: Record<LocaleId, { in: string[]; out: string[] }> = {
  en: {
    in: ['Salary', 'Refund — Amazon', 'Transfer from Alex', 'Freelance payment', 'Cashback'],
    out: ['Amazon', 'Netflix', 'Starbucks', 'Uber', 'Spotify', 'Grocery store', 'Gas station', 'Apple'],
  },
  it: {
    in: ['Stipendio', 'Rimborso — Amazon', 'Bonifico da Marco', 'Fattura #2841', 'Cashback'],
    out: ['Amazon', 'Netflix', 'Conad', 'Enel', 'Bar Centrale', 'Farmacia', 'Esselunga', 'TIM'],
  },
  es: {
    in: ['Nómina', 'Reembolso Amazon', 'Transferencia de Ana', 'Pago freelance'],
    out: ['Amazon', 'Netflix', 'Mercadona', 'Repsol', 'Uber', 'Spotify'],
  },
  fr: {
    in: ['Salaire', 'Remboursement Amazon', 'Virement de Luc', 'Facture client'],
    out: ['Amazon', 'Netflix', 'Carrefour', 'SNCF', 'Uber', 'Spotify'],
  },
  de: {
    in: ['Gehalt', 'Erstattung Amazon', 'Überweisung von Tim', 'Freelance'],
    out: ['Amazon', 'Netflix', 'REWE', 'Shell', 'Uber', 'Spotify'],
  },
  pt: {
    in: ['Salário', 'Reembolso Amazon', 'Transferência de João'],
    out: ['Amazon', 'Netflix', 'Continente', 'Uber', 'Spotify'],
  },
  ru: {
    in: ['Зарплата', 'Возврат Amazon', 'Перевод от Алексея'],
    out: ['Amazon', 'Netflix', 'Пятёрочка', 'Uber', 'Spotify'],
  },
  ar: {
    in: ['راتب', 'استرداد Amazon', 'تحويل من أحمد'],
    out: ['Amazon', 'Netflix', 'Uber', 'Spotify'],
  },
  fa: {
    in: ['حقوق', 'بازگشت Amazon', 'انتقال از علی'],
    out: ['Amazon', 'Netflix', 'Uber'],
  },
  ur: {
    in: ['Salary', 'Amazon refund', 'Transfer from Ali'],
    out: ['Amazon', 'Netflix', 'Uber'],
  },
  id: {
    in: ['Gaji', 'Refund Amazon', 'Transfer dari Budi'],
    out: ['Amazon', 'Netflix', 'Grab', 'Spotify'],
  },
  tr: {
    in: ['Maaş', 'Amazon iadesi', 'Ahmet\'ten havale'],
    out: ['Amazon', 'Netflix', 'Migros', 'Uber'],
  },
  uk: {
    in: ['Зарплата', 'Повернення Amazon', 'Переказ від Олени'],
    out: ['Amazon', 'Netflix', 'Сільпо', 'Uber'],
  },
  hi: {
    in: ['Salary', 'Amazon refund', 'Transfer from Rahul'],
    out: ['Amazon', 'Netflix', 'Swiggy', 'Uber'],
  },
  ko: {
    in: ['급여', 'Amazon 환불', '김민수 송금'],
    out: ['Amazon', 'Netflix', 'Coupang', 'Uber'],
  },
  ja: {
    in: ['給与', 'Amazon返金', '田中さんから送金'],
    out: ['Amazon', 'Netflix', 'セブン', 'Uber'],
  },
  uz: {
    in: ['Maosh', 'Amazon qaytarish'],
    out: ['Amazon', 'Netflix', 'Uber'],
  },
  vi: {
    in: ['Lương', 'Hoàn tiền Amazon'],
    out: ['Amazon', 'Netflix', 'Grab', 'Shopee'],
  },
  pl: {
    in: ['Wynagrodzenie', 'Zwrot Amazon'],
    out: ['Amazon', 'Netflix', 'Biedronka', 'Uber'],
  },
  fil: {
    in: ['Sahod', 'Refund Amazon'],
    out: ['Amazon', 'Netflix', 'Grab'],
  },
  th: {
    in: ['เงินเดือน', 'คืนเงิน Amazon'],
    out: ['Amazon', 'Netflix', 'Grab'],
  },
  bn: {
    in: ['বেতন', 'Amazon রিফান্ড'],
    out: ['Amazon', 'Netflix', 'Uber'],
  },
}

const ACTIVITY_LAYOUTS: LayoutId[] = ['bank', 'hero', 'crypto', 'cards']

const SPOTIFY_PLANS = [6.99, 11.99, 12.99, 17.99, 21.99, 22.99] as const
const NETFLIX_PLANS = [7.99, 12.99, 13.99, 14.99, 18.99, 21.99] as const
const APPLE_CHARGES = [0.99, 2.99, 4.99, 9.99, 11.99, 19.95, 25.95] as const
const TIM_PLANS = [4.99, 9.99, 12.99, 14.99] as const

function euros(rng: Rng, min: number, max: number): number {
  return Math.round(randFloat(rng, min, max) * 100) / 100
}

function groceryAmount(rng: Rng): number {
  const tier = pickWeighted(rng, [
    { min: 14, max: 34, weight: 38 },
    { min: 34, max: 82, weight: 52 },
    { min: 82, max: 96, weight: 10 },
  ])
  return euros(rng, tier.min, tier.max)
}

function amazonAmount(rng: Rng): number {
  const tier = pickWeighted(rng, [
    { min: 12.9, max: 58, weight: 62 },
    { min: 58, max: 128, weight: 28 },
    { min: 128, max: 186, weight: 10 },
  ])
  return euros(rng, tier.min, tier.max)
}

export function sampleMerchantAmount(rng: Rng, label: string): number {
  if (/spotify/i.test(label)) return pick(rng, SPOTIFY_PLANS)
  if (/netflix/i.test(label)) return pick(rng, NETFLIX_PLANS)
  if (/\bapple\b/i.test(label)) return pick(rng, APPLE_CHARGES)
  if (/\btim\b/i.test(label)) return pick(rng, TIM_PLANS)
  if (/enel/i.test(label)) return euros(rng, 48, 128)
  if (/uber/i.test(label)) return chance(rng, 0.12) ? euros(rng, 48, 72) : euros(rng, 8.2, 34.5)
  if (/grab/i.test(label)) return euros(rng, 2.6, 14.8)
  if (/swiggy/i.test(label)) return euros(rng, 4.1, 16.4)
  if (/starbucks/i.test(label)) return euros(rng, 4.5, 13.9)
  if (/^bar /i.test(label)) return euros(rng, 2.2, 11.5)
  if (/farmacia|pharmacy/i.test(label)) return euros(rng, 7.4, 38)
  if (/sncf/i.test(label)) return euros(rng, 16, 89)
  if (/shell|repsol|gas station/i.test(label)) return euros(rng, 38, 92)
  if (/amazon/i.test(label)) return amazonAmount(rng)
  if (/shopee/i.test(label)) return euros(rng, 6.4, 42)
  if (/coupang/i.test(label)) return euros(rng, 10.5, 68)
  if (/セブン/i.test(label)) return euros(rng, 3.2, 16.5)
  if (/mercadona|conad|esselunga|carrefour|rewe|continente|migros|biedronka|grocery|пятёр|сільпо/i.test(label)) {
    return groceryAmount(rng)
  }
  return euros(rng, 6.5, 38)
}

export function shouldShowActivity(rng: Rng, layoutId: LayoutId): boolean {
  if (!ACTIVITY_LAYOUTS.includes(layoutId)) return false
  return chance(rng, 1 / 8)
}

export function sampleLedger(rng: Rng, locale: LocaleId, mainTimestamp: string): LedgerEntry[] {
  const pool = MERCHANTS[locale] ?? MERCHANTS.en
  const count = randInt(rng, 2, 4)
  const mainMs = new Date(mainTimestamp).getTime()
  const entries: LedgerEntry[] = []
  const used = new Set<string>()

  for (let i = 0; i < count; i++) {
    const incoming = chance(rng, 0.32) && pool.in.length > 0
    const labels = incoming ? pool.in : pool.out
    let label = pick(rng, labels)
    let guard = 0
    while (used.has(label) && guard++ < 8) label = pick(rng, labels)
    used.add(label)

    const daysAgo = randInt(rng, 1, 12)
    const hoursAgo = randInt(rng, 0, 23)
    const ts = new Date(mainMs - (daysAgo * 24 + hoursAgo) * 3600000)

    entries.push({
      id: `L${randInt(rng, 10000, 99999)}`,
      direction: incoming ? 'in' : 'out',
      label,
      amountEur: incoming ? euros(rng, 28, 420) : sampleMerchantAmount(rng, label),
      timestamp: ts.toISOString(),
      icon: merchantIcon(label),
    })
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function walletFarFromTx(balanceEur: number, amountEur: number): boolean {
  if (!(balanceEur > 0) || !(amountEur > 0)) return false
  if (balanceEur <= amountEur) return false
  const gap = balanceEur - amountEur
  const minGap = Math.max(500, amountEur * 0.55)
  return gap >= minGap - 0.011
}

function sampleLeftover(rng: Rng): number {
  const band = pickWeighted(rng, [
    { min: 560, max: 1480, weight: 20 },
    { min: 1480, max: 4200, weight: 38 },
    { min: 4200, max: 9800, weight: 28 },
    { min: 9800, max: 26800, weight: 14 },
  ])
  const raw = randFloat(rng, band.min, band.max)
  const cents = randInt(rng, 1, 99)
  return Math.round((Math.floor(raw) + cents / 100) * 100) / 100
}

export function sampleAccountBalance(rng: Rng, amountEur: number, ledger: LedgerEntry[]): number {
  const minGap = Math.max(500, amountEur * 0.55)
  let leftover = sampleLeftover(rng)
  if (leftover < minGap) leftover = minGap + randFloat(rng, 90, 1400)

  let bal =
    leftover +
    amountEur +
    ledger.reduce((sum, e) => sum + (e.direction === 'in' ? e.amountEur : -e.amountEur), 0)

  if (!walletFarFromTx(bal, amountEur)) {
    bal = amountEur + minGap + randFloat(rng, 180, 3600)
  }
  return Math.round(bal * 100) / 100
}
