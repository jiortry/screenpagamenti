import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import type { ScreenApiResult, ScreenKind } from '../api/screen.ts'
import { createChatScenario } from '../chat/engine.ts'
import { generateReviewScript } from '../chat/openrouter.ts'
import { assembleReviewChat } from '../chat/review.ts'
import { skinById } from '../chat/skins.ts'
import type { ChatScenario, TgSkinId } from '../chat/types.ts'
import { TG_SKIN_IDS } from '../chat/types.ts'
import { applyPhotoArtifacts } from '../engine/capture.ts'
import { sampleAndroidPhone, sampleIphone } from '../engine/devices.ts'
import { mulberry32, pick } from '../engine/random.ts'
import { loadRates } from '../engine/rates.ts'
import { createScenario } from '../engine/scenario.ts'
import { qcScenario } from '../engine/quality.ts'
import type { Scenario } from '../types.ts'
import { PaymentScreen } from './PaymentScreen.tsx'
import { clearPaymentRedactions, paintPaymentRedactions } from './chat/BrushRedact.tsx'
import { TelegramScreen } from './chat/TelegramScreen.tsx'

function waitFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(label)), ms)
    promise.then(
      (value) => {
        window.clearTimeout(timer)
        resolve(value)
      },
      (err: unknown) => {
        window.clearTimeout(timer)
        reject(err)
      },
    )
  })
}

async function waitImages(root: HTMLElement) {
  const imgs = [...root.querySelectorAll('img')]
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.addEventListener('load', () => res(), { once: true })
            img.addEventListener('error', () => res(), { once: true })
          }),
    ),
  )
}

function publish(result: ScreenApiResult) {
  window.__SCREEN_API_RESULT__ = result
  document.documentElement.dataset.apiReady = result.ok ? 'ok' : 'err'
}

function parseKind(raw: string | null, rng: () => number): ScreenKind {
  if (raw === 'telegram' || raw === 'payments' || raw === 'chatpay') return raw
  const r = rng()
  if (r < 0.44) return 'telegram'
  if (r < 0.82) return 'payments'
  return 'chatpay'
}

function withSkinDevice(s: ChatScenario, skinId: TgSkinId): ChatScenario {
  const skin = skinById(skinId)
  const wantIos = skin.platform === 'ios'
  const isIos = s.device.family === 'iphone'
  if (wantIos === isIos) return s
  const rng = mulberry32(s.seed ^ 0x51f)
  return { ...s, device: wantIos ? sampleIphone(rng) : sampleAndroidPhone(rng) }
}

async function captureNode(el: HTMLElement, density: number): Promise<string> {
  await document.fonts.ready
  await waitFrames()
  await waitImages(el)
  await new Promise((r) => window.setTimeout(r, 80))
  return withTimeout(
    toPng(el, {
      pixelRatio: Math.min(3, Math.max(1.5, density)),
      cacheBust: false,
      skipFonts: true,
    }),
    14000,
    'capture timeout',
  )
}

function pack(
  kind: ScreenKind,
  seed: number,
  id: string,
  png: string,
  device: Scenario['device'] | ChatScenario['device'],
  locale: string,
  skin?: string,
): ScreenApiResult {
  const base64 = png.includes(',') ? (png.split(',')[1] ?? '') : png
  return {
    ok: true,
    kind,
    id,
    seed,
    createdAt: new Date().toISOString(),
    mime: 'image/png',
    png,
    base64,
    width: device.width,
    height: device.height,
    device: {
      id: device.id,
      label: device.label,
      family: device.family,
      width: device.width,
      height: device.height,
    },
    locale,
    skin,
  }
}

type Job =
  | { kind: 'telegram'; chat: ChatScenario; skinId: TgSkinId }
  | { kind: 'payments'; pay: Scenario }
  | { kind: 'chatpay-pay'; pay: Scenario; seed: number; skinId: TgSkinId }
  | { kind: 'chatpay-chat'; chat: ChatScenario; skinId: TgSkinId; seed: number }

export function ApiCapture() {
  const payRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [status, setStatus] = useState('Generating…')
  const boot = useRef(false)

  useEffect(() => {
    if (boot.current) return
    boot.current = true
    const q = new URLSearchParams(window.location.search)
    const seedRaw = Number(q.get('seed'))
    const seed = Number.isFinite(seedRaw) && seedRaw > 0 ? seedRaw >>> 0 : (Math.random() * 0xffffffff) >>> 0
    const rng = mulberry32(seed)
    const requested = q.get('kind')
    const kind = parseKind(requested, rng)
    const skinId = pick(rng, TG_SKIN_IDS)

    void (async () => {
      try {
        if (kind === 'telegram') {
          const chat = withSkinDevice(
            createChatScenario(mulberry32(seed ^ 0x11), seed, { skinId, locale: 'auto' }),
            skinId,
          )
          setJob({ kind: 'telegram', chat, skinId })
          return
        }
        if (kind === 'payments') {
          const rates = await loadRates()
          if (!rates.ok) throw new Error(rates.message)
          for (let attempt = 1; attempt <= 8; attempt++) {
            const s = createScenario(mulberry32((seed + attempt * 997) >>> 0), rates, (seed + attempt) >>> 0)
            if (!qcScenario(s, rates).ok) continue
            setJob({ kind: 'payments', pay: s })
            return
          }
          throw new Error('Could not build a payment screen')
        }
        const rates = await loadRates()
        if (!rates.ok) throw new Error(rates.message)
        const pay = createScenario(mulberry32(seed ^ 0x22), rates, seed)
        setJob({ kind: 'chatpay-pay', pay, seed, skinId })
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setStatus(error)
        if (requested === 'chatpay' || requested === 'payments') {
          publish({ ok: false, error })
          return
        }
        try {
          const chat = withSkinDevice(
            createChatScenario(mulberry32(seed ^ 0x99), seed, { skinId, locale: 'auto' }),
            skinId,
          )
          setJob({ kind: 'telegram', chat, skinId })
        } catch (fallback) {
          publish({ ok: false, error: fallback instanceof Error ? fallback.message : error })
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (!job) return
    let cancelled = false
    void (async () => {
      try {
        await document.fonts.ready
        await waitFrames()
        if (cancelled) return

        if (job.kind === 'telegram') {
          const el = chatRef.current
          if (!el) throw new Error('missing chat node')
          const png = await captureNode(el, job.chat.device.density)
          if (cancelled) return
          const result = pack('telegram', job.chat.seed, job.chat.id, png, job.chat.device, job.chat.locale, job.skinId)
          setStatus(`ok · ${result.kind} · ${result.id}`)
          publish(result)
          return
        }

        if (job.kind === 'payments') {
          const el = payRef.current
          if (!el) throw new Error('missing pay node')
          const raw = await captureNode(el, job.pay.device.density)
          const png = await applyPhotoArtifacts(raw, job.pay.capture, job.pay.seed)
          if (cancelled) return
          const result = pack('payments', job.pay.seed, job.pay.transactionId, png, job.pay.device, job.pay.locale)
          setStatus(`ok · ${result.kind} · ${result.id}`)
          publish(result)
          return
        }

        if (job.kind === 'chatpay-pay') {
          const el = payRef.current
          if (!el) throw new Error('missing pay node')
          paintPaymentRedactions(el, job.pay, job.seed ^ 0xc0ff)
          await waitFrames()
          const payPng = await captureNode(el, job.pay.device.density)
          clearPaymentRedactions(el)
          const script = await generateReviewScript()
          const chat = withSkinDevice(
            assembleReviewChat(mulberry32(job.seed ^ 0x44), job.seed, {
              skinId: job.skinId,
              script,
              paymentPng: payPng,
            }),
            job.skinId,
          )
          if (cancelled) return
          setJob({ kind: 'chatpay-chat', chat, skinId: job.skinId, seed: job.seed })
          return
        }

        const el = chatRef.current
        if (!el) throw new Error('missing chat node')
        const png = await captureNode(el, job.chat.device.density)
        if (cancelled) return
        const result = pack('chatpay', job.seed, job.chat.id, png, job.chat.device, job.chat.locale, job.skinId)
        setStatus(`ok · ${result.kind} · ${result.id}`)
        publish(result)
      } catch (err) {
        if (cancelled) return
        const error = err instanceof Error ? err.message : String(err)
        setStatus(error)
        publish({ ok: false, error })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [job])

  const pay = job && (job.kind === 'payments' || job.kind === 'chatpay-pay') ? job.pay : null
  const chat =
    job && (job.kind === 'telegram' || job.kind === 'chatpay-chat')
      ? job.chat
      : null
  const skinId = job && 'skinId' in job ? job.skinId : 'ios-day'
  const wallId = chat?.wallpaper ?? 'photo-0'

  return (
    <div style={{ minHeight: '100svh', background: '#0b0d12', color: '#dbe4f0', padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <p style={{ opacity: 0.7, fontSize: 13, margin: 0 }}>GET /api/screen</p>
      <h1 style={{ fontSize: 22, margin: '8px 0 12px' }}>{status}</h1>
      <div className="offscreen" aria-hidden="true">
        {pay && (
          <div
            ref={payRef}
            style={{
              position: 'relative',
              width: pay.device.width,
              height: pay.device.height,
              display: 'block',
            }}
          >
            <PaymentScreen s={pay} />
          </div>
        )}
        {chat && (
          <div
            ref={chatRef}
            style={{
              width: chat.device.width,
              height: chat.device.height,
              display: 'block',
            }}
          >
            <TelegramScreen s={chat} skinId={skinId} wallId={wallId} />
          </div>
        )}
      </div>
    </div>
  )
}
