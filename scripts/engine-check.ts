import { sampleEurAmount } from '../src/engine/amounts.ts'
import { brandProfile } from '../src/engine/brands.ts'
import { formatLocal, fromEurAmount } from '../src/engine/format.ts'
import { INSTITUTIONS } from '../src/engine/institutions.ts'
import { LOCALES } from '../src/engine/languages.ts'
import { sampleMerchantAmount, sampleAccountBalance, walletFarFromTx } from '../src/engine/ledger.ts'
import { convertFromEur, mathMatches } from '../src/engine/math.ts'
import { mulberry32 } from '../src/engine/random.ts'
import { FALLBACK_FIAT_PER_EUR } from '../src/engine/rates.ts'
import { createScenario } from '../src/engine/scenario.ts'
import { qcScenario } from '../src/engine/quality.ts'
import type { RateBook } from '../src/types.ts'

const rates: RateBook = {
  ok: true,
  timestamp: '2026-09-02T00:00:00.000Z',
  source: 'test',
  eurPerCrypto: { BTC: 66120, ETH: 2046.07, TON: 1.14, XMR: 447.17, USDT: 0.863666 },
  fiatPerEur: { ...FALLBACK_FIAT_PER_EUR, USD: 1.157, GBP: 0.858, CHF: 0.943 },
}

const rng = mulberry32(42)
const amounts = Array.from({ length: 400 }, () => sampleEurAmount(rng))
const mid = amounts.filter((a) => a >= 700 && a <= 1200).length / amounts.length
const low = amounts.filter((a) => a < 700).length / amounts.length
const rare = amounts.filter((a) => a > 2500).length / amounts.length
if (mid < 0.5 || mid > 0.75) throw new Error(`cluster ${mid}`)
if (rare > 0.12) throw new Error(`rare ${rare}`)
if (low < 0.08 || low > 0.3) throw new Error(`low ${low}`)
if (amounts.some((a) => a < 100 || a > 4320)) throw new Error('range')

{
  const spendRng = mulberry32(99)
  const checks: [string, number, number][] = [
    ['Spotify', 6.99, 22.99],
    ['Netflix', 7.99, 21.99],
    ['Apple', 0.99, 25.95],
    ['TIM', 4.99, 14.99],
    ['Starbucks', 4.5, 13.9],
    ['Uber', 8.2, 72],
    ['Mercadona', 14, 96],
    ['Amazon', 12.9, 186],
    ['Enel', 48, 128],
    ['Grab', 2.6, 14.8],
  ]
  for (const [label, min, max] of checks) {
    for (let i = 0; i < 80; i++) {
      const n = sampleMerchantAmount(spendRng, label)
      if (n < min - 0.011 || n > max + 0.011) throw new Error(`spend ${label} ${n}`)
    }
  }
}

{
  const yen = fromEurAmount(12.99, 'JPY', rates.fiatPerEur.JPY)
  if (yen < 1800 || yen > 3200) throw new Error(`jpy spotify ${yen}`)
  const inr = fromEurAmount(12.99, 'INR', rates.fiatPerEur.INR)
  if (inr < 900 || inr > 2000) throw new Error(`inr spotify ${inr}`)
  if (fromEurAmount(12.99, 'EUR', 1) !== 12.99) throw new Error('eur identity')
  for (const loc of LOCALES) {
    const per = loc.currency === 'EUR' ? 1 : rates.fiatPerEur[loc.currency]
    if (!(per > 0)) throw new Error(`fx ${loc.id} ${loc.currency}`)
  }
}

{
  const balRng = mulberry32(11)
  for (let i = 0; i < 250; i++) {
    const amt = sampleEurAmount(balRng)
    const bal = sampleAccountBalance(balRng, amt, [])
    if (!walletFarFromTx(bal, amt)) throw new Error(`close wallet ${bal} tx ${amt}`)
  }
}

for (const institution of INSTITUTIONS) {
  for (const appearance of ['light', 'dark'] as const) {
    const b = brandProfile(institution, appearance)
    if (b.statusBarBg !== '#FFFFFF' && b.statusBarBg !== '#000000') {
      throw new Error(`statusBarBg ${institution.id} ${appearance} ${b.statusBarBg}`)
    }
    if (b.statusBarFg !== '#FFFFFF' && b.statusBarFg !== '#000000') {
      throw new Error(`statusBarFg ${institution.id} ${appearance} ${b.statusBarFg}`)
    }
    if (b.statusBarBg === b.statusBarFg) {
      throw new Error(`statusBar contrast ${institution.id} ${appearance}`)
    }
    if (!b.bg || !b.text || !b.button) throw new Error(`palette ${institution.id} ${appearance}`)
  }
}

const btc = convertFromEur(1027.55, 'BTC', rates)
if (!mathMatches(1027.55, 'BTC', btc.exchange_rate, btc.converted_amount)) throw new Error('btc math')
const usd = convertFromEur(1027.55, 'USD', rates)
if (!mathMatches(1027.55, 'USD', usd.exchange_rate, usd.converted_amount)) throw new Error('usd math')

let rejected = 0
const locales = new Map<string, number>()
const appearances = new Set<string>()
const statuses = new Set<string>()
for (let i = 0; i < 200; i++) {
  const s = createScenario(mulberry32(1000 + i), rates, 1000 + i)
  const q = qcScenario(s, rates)
  if (!q.ok) {
    rejected++
    console.error(q.issues)
  }
  locales.set(s.locale, (locales.get(s.locale) ?? 0) + 1)
  appearances.add(s.appearance)
  statuses.add(s.status)
  if (!s.carrier) throw new Error('carrier')
  if (s.direction !== 'in') throw new Error(`direction ${s.direction}`)
  if (s.status !== 'received' && s.status !== 'completed' && s.status !== 'confirmed') {
    throw new Error(`status ${s.status}`)
  }
  if (s.status === 'sent') throw new Error('sent status')
  if (s.accountBalance == null || !walletFarFromTx(s.accountBalance, s.amountEur)) {
    throw new Error(`wallet ${s.accountBalance} tx ${s.amountEur}`)
  }
  const loc = LOCALES.find((l) => l.id === s.locale)
  if (!loc || s.displayCurrency !== loc.currency) {
    throw new Error(`currency ${s.locale} ${s.displayCurrency}`)
  }
}
if (rejected > 0) throw new Error(`qc ${rejected}`)
if (!appearances.has('light') || !appearances.has('dark')) throw new Error(`appearance ${[...appearances]}`)
const en = (locales.get('en') ?? 0) / 200
if (en < 0.2 || en > 0.55) throw new Error(`en share ${en}`)
const samples = LOCALES.map((loc) =>
  formatLocal(
    { displayCurrency: loc.currency, displayPerEur: loc.currency === 'EUR' ? 1 : rates.fiatPerEur[loc.currency], bcp47: loc.bcp47 },
    12.99,
  ),
)
console.log('engine ok', { mid, low, rare, en, appearances: [...appearances], statuses: [...statuses], locales: Object.fromEntries(locales), fx12: Object.fromEntries(LOCALES.map((l, i) => [l.id, samples[i]])) })
