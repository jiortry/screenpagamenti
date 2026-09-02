import type { RateBook, Scenario } from '../types.ts'
import { CANCEL_REASONS, CATALOG, FAIL_REASONS, NOTES } from '../i18n/catalog.ts'
import { mathMatches } from './math.ts'
import { RTL_LOCALES } from './languages.ts'

export type QcIssue = { code: string; detail: string }

export type QcResult = {
  ok: boolean
  issues: QcIssue[]
}

export function qcScenario(s: Scenario, rates: RateBook): QcResult {
  const issues: QcIssue[] = []

  if (!s.synthetic) issues.push({ code: 'synthetic', detail: 'Missing synthetic flag' })
  if (!s.transactionId || s.transactionId.length < 8) {
    issues.push({ code: 'id', detail: 'Transaction id too short' })
  }
  if (!s.carrier) issues.push({ code: 'carrier', detail: 'Missing carrier' })

  if (s.amountEur < 100 || s.amountEur > 4320) {
    issues.push({ code: 'amount', detail: `EUR amount out of range: ${s.amountEur}` })
  }
  const sum = Math.round((s.amountEur + s.feeEur) * 100) / 100
  if (Math.abs(sum - s.totalEur) > 0.011) {
    issues.push({ code: 'fee', detail: 'Total does not equal amount + fee' })
  }

  const conv = s.conversion
  if (conv.base_currency !== 'EUR' || conv.base_amount !== s.amountEur) {
    issues.push({ code: 'math', detail: 'Base amount mismatch' })
  }
  if (conv.rate_timestamp !== rates.timestamp) {
    issues.push({ code: 'rate-ts', detail: 'Rate timestamp does not match live book' })
  }
  if (!mathMatches(conv.base_amount, conv.quote_currency, conv.exchange_rate, conv.converted_amount)) {
    issues.push({ code: 'math', detail: 'Conversion is not internally consistent' })
  }
  if (s.secondary) {
    if (
      !mathMatches(
        s.secondary.base_amount,
        s.secondary.quote_currency,
        s.secondary.exchange_rate,
        s.secondary.converted_amount,
      )
    ) {
      issues.push({ code: 'math', detail: 'Secondary conversion is inconsistent' })
    }
  }

  const pack = CATALOG[s.locale]
  if (!pack) issues.push({ code: 'i18n', detail: `Unknown locale ${s.locale}` })
  if (!NOTES[s.locale]?.includes(s.note)) {
    issues.push({ code: 'i18n', detail: 'Note is not from the selected language pack' })
  }
  if (s.status === 'failed' && s.statusReason && !FAIL_REASONS[s.locale]?.includes(s.statusReason)) {
    issues.push({ code: 'i18n', detail: 'Failure reason language mismatch' })
  }
  if (s.status === 'cancelled' && s.statusReason && !CANCEL_REASONS[s.locale]?.includes(s.statusReason)) {
    issues.push({ code: 'i18n', detail: 'Cancel reason language mismatch' })
  }

  const rtl = RTL_LOCALES.includes(s.locale)
  if (rtl && s.dir !== 'rtl') issues.push({ code: 'rtl', detail: 'RTL locale did not set dir=rtl' })
  if (!rtl && s.dir !== 'ltr') issues.push({ code: 'rtl', detail: 'LTR locale did not set dir=ltr' })

  if (s.device.width < 300 || s.device.height < 560) {
    issues.push({ code: 'device', detail: 'Device viewport too small' })
  }

  return { ok: issues.length === 0, issues }
}

export function qcLayout(s: Scenario, el: HTMLElement): QcResult {
  const issues: QcIssue[] = []
  if (el.lang !== s.bcp47) {
    issues.push({ code: 'lang', detail: `element.lang=${el.lang} expected ${s.bcp47}` })
  }
  const dir = (el.getAttribute('dir') || getComputedStyle(el).direction).toLowerCase()
  if (dir !== s.dir) {
    issues.push({ code: 'rtl', detail: `element dir=${dir} expected ${s.dir}` })
  }
  const w = Math.round(el.offsetWidth)
  const h = Math.round(el.offsetHeight)
  if (Math.abs(w - s.device.width) > 1 || Math.abs(h - s.device.height) > 1) {
    issues.push({
      code: 'device',
      detail: `layout ${w}x${h} != device ${s.device.width}x${s.device.height}`,
    })
  }
  const text = (el.innerText || '').trim()
  if (text.length < 40) issues.push({ code: 'empty', detail: 'Screen text too sparse' })
  if (!text.includes(s.transactionId)) {
    issues.push({ code: 'id', detail: 'Transaction id not visible on screen' })
  }
  const body = el.querySelector('[data-screen-body]') as HTMLElement | null
  if (body && body.scrollHeight > body.clientHeight + 8) {
    issues.push({
      code: 'overflow',
      detail: `content ${body.scrollHeight}px > ${body.clientHeight}px`,
    })
  }
  return { ok: issues.length === 0, issues }
}

export async function qcImage(
  dataUrl: string,
  s: Scenario,
): Promise<QcResult> {
  const issues: QcIssue[] = []
  if (!dataUrl.startsWith('data:image/png')) {
    issues.push({ code: 'image', detail: 'Not a PNG data URL' })
    return { ok: false, issues }
  }
  const img = new Image()
  img.src = dataUrl
  try {
    await img.decode()
  } catch {
    issues.push({ code: 'image', detail: 'PNG failed to decode' })
    return { ok: false, issues }
  }
  const minW = s.device.width
  const minH = s.device.height
  if (img.width < minW * 0.9 || img.height < minH * 0.9) {
    issues.push({
      code: 'image',
      detail: `PNG ${img.width}x${img.height} smaller than device`,
    })
  }
  const canvas = document.createElement('canvas')
  const sampleW = Math.min(160, img.width)
  const sampleH = Math.min(280, img.height)
  canvas.width = sampleW
  canvas.height = sampleH
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    issues.push({ code: 'image', detail: 'No 2d context' })
    return { ok: false, issues }
  }
  ctx.drawImage(img, 0, 0, sampleW, sampleH)
  const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data
  let sum = 0
  let sum2 = 0
  let n = 0
  for (let i = 0; i < pixels.length; i += 16) {
    const g = ((pixels[i] ?? 0) + (pixels[i + 1] ?? 0) + (pixels[i + 2] ?? 0)) / 3
    sum += g
    sum2 += g * g
    n++
  }
  const mean = sum / n
  const variance = sum2 / n - mean * mean
  if (n < 80 || variance < 180) {
    issues.push({ code: 'image', detail: `Low visual variance (${variance.toFixed(1)})` })
  }
  return { ok: issues.length === 0, issues }
}
