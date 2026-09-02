import type { LayoutId, LedgerEntry, LocaleId, PaymentCategory } from '../types.ts'
import { chance, pick, randInt, type Rng } from './random.ts'

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

export function shouldShowActivity(rng: Rng, layoutId: LayoutId): boolean {
  if (!ACTIVITY_LAYOUTS.includes(layoutId)) return false
  return chance(rng, 0.72)
}

export function sampleLedger(
  rng: Rng,
  locale: LocaleId,
  mainTimestamp: string,
  mainAmount: number,
  category: PaymentCategory,
): LedgerEntry[] {
  const pool = MERCHANTS[locale] ?? MERCHANTS.en
  const count = randInt(rng, 2, 4)
  const mainMs = new Date(mainTimestamp).getTime()
  const entries: LedgerEntry[] = []
  const used = new Set<string>()

  for (let i = 0; i < count; i++) {
    const incoming = chance(rng, category.includes('crypto') ? 0.35 : 0.42)
    const labels = incoming ? pool.in : pool.out
    let label = pick(rng, labels)
    let guard = 0
    while (used.has(label) && guard++ < 8) label = pick(rng, labels)
    used.add(label)

    const daysAgo = randInt(rng, 1, 12)
    const hoursAgo = randInt(rng, 0, 23)
    const ts = new Date(mainMs - (daysAgo * 24 + hoursAgo) * 3600000)

    let amountEur: number
    if (incoming) {
      amountEur = Math.round((randInt(rng, 180, 3200) + rng() * 80) * 100) / 100
    } else {
      const cap = Math.max(8, mainAmount * 0.65)
      amountEur = Math.round((randInt(rng, 4, Math.floor(cap)) + rng() * 5) * 100) / 100
    }

    entries.push({
      id: `L${randInt(rng, 10000, 99999)}`,
      direction: incoming ? 'in' : 'out',
      label,
      amountEur,
      timestamp: ts.toISOString(),
    })
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function accountBalance(
  seed: number,
  amountEur: number,
  ledger: LedgerEntry[],
  mainOutgoing: boolean,
): number {
  let bal = 1200 + (seed % 4800) + ledger.reduce((s, e) => s + (e.direction === 'in' ? e.amountEur : -e.amountEur), 0)
  if (mainOutgoing) bal += amountEur
  else bal -= amountEur
  return Math.round(bal * 100) / 100
}
