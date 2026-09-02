import { sampleEurAmount } from '../src/engine/amounts.ts'
import { convertFromEur, mathMatches } from '../src/engine/math.ts'
import { mulberry32 } from '../src/engine/random.ts'
import { createScenario } from '../src/engine/scenario.ts'
import { qcScenario } from '../src/engine/quality.ts'
import type { RateBook } from '../src/types.ts'

const rates: RateBook = {
  ok: true,
  timestamp: '2026-09-02T00:00:00.000Z',
  source: 'test',
  eurPerCrypto: { BTC: 66120, ETH: 2046.07, TON: 1.14, XMR: 447.17, USDT: 0.863666 },
  fiatPerEur: { USD: 1.157, GBP: 0.858, CHF: 0.943 },
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

const btc = convertFromEur(1027.55, 'BTC', rates)
if (!mathMatches(1027.55, 'BTC', btc.exchange_rate, btc.converted_amount)) throw new Error('btc math')
const usd = convertFromEur(1027.55, 'USD', rates)
if (!mathMatches(1027.55, 'USD', usd.exchange_rate, usd.converted_amount)) throw new Error('usd math')

let rejected = 0
const locales = new Map<string, number>()
for (let i = 0; i < 200; i++) {
  const s = createScenario(mulberry32(1000 + i), rates, 1000 + i)
  const q = qcScenario(s, rates)
  if (!q.ok) {
    rejected++
    console.error(q.issues)
  }
  locales.set(s.locale, (locales.get(s.locale) ?? 0) + 1)
  if (!s.transactionId.includes('SYNTH')) throw new Error('marker')
}
if (rejected > 0) throw new Error(`qc ${rejected}`)
const en = (locales.get('en') ?? 0) / 200
if (en < 0.2 || en > 0.55) throw new Error(`en share ${en}`)
console.log('engine ok', { mid, low, rare, en, locales: Object.fromEntries(locales) })
