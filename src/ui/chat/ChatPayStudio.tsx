import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { useCallback, useEffect, useRef, useState } from 'react'
import { generateReviewScript } from '../../chat/openrouter.ts'
import { assembleReviewChat } from '../../chat/review.ts'
import { skinById, SKIN_LIST } from '../../chat/skins.ts'
import type { ChatScenario, TgSkinId, TgWallId } from '../../chat/types.ts'
import { TG_SKIN_IDS } from '../../chat/types.ts'
import { sampleAndroidPhone, sampleIphone } from '../../engine/devices.ts'
import { loadRates } from '../../engine/rates.ts'
import { mulberry32 } from '../../engine/random.ts'
import { createScenario } from '../../engine/scenario.ts'
import type { RateBook, RateError, Scenario } from '../../types.ts'
import { ModeNav, type StudioMode } from '../ModeNav.tsx'
import { PaymentScreen } from '../PaymentScreen.tsx'
import { clearPaymentRedactions, paintPaymentRedactions } from './BrushRedact.tsx'
import { TelegramScreen } from './TelegramScreen.tsx'

type Saved = { scenario: ChatScenario; png: string; skinId: TgSkinId; wallId: TgWallId }

function downloadDataUrl(dataUrl: string, name: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = name
  a.click()
}

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

function withSkinDevice(s: ChatScenario, skinId: TgSkinId): ChatScenario {
  const skin = skinById(skinId)
  const wantIos = skin.platform === 'ios'
  const isIos = s.device.family === 'iphone'
  if (wantIos === isIos) return s
  const rng = mulberry32(s.seed ^ 0x51f)
  return { ...s, device: wantIos ? sampleIphone(rng) : sampleAndroidPhone(rng) }
}

export function ChatPayStudio({ onMode }: { onMode: (m: StudioMode) => void }) {
  const payRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [skinId, setSkinId] = useState<TgSkinId>(() => {
    const s = new URLSearchParams(window.location.search).get('skin')
    return TG_SKIN_IDS.includes(s as TgSkinId) ? (s as TgSkinId) : 'ios-day'
  })
  const [wallId] = useState<TgWallId>('auto')
  const [rates, setRates] = useState<RateBook | RateError | null>(null)
  const [payScenario, setPayScenario] = useState<Scenario | null>(null)
  const [scenario, setScenario] = useState<ChatScenario | null>(null)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState('Loading live market data…')
  const [gallery, setGallery] = useState<Saved[]>([])
  const [lastPng, setLastPng] = useState<string | null>(null)

  const refreshRates = useCallback(async () => {
    setLog('Fetching live market data…')
    const book = await loadRates()
    setRates(book)
    setLog(book.ok ? `Rates OK · ${book.source}` : book.message)
  }, [])

  useEffect(() => {
    void refreshRates()
  }, [refreshRates])

  const capturePay = useCallback(async (): Promise<string | null> => {
    if (!rates || !rates.ok) return null
    for (let attempt = 1; attempt <= 5; attempt++) {
      const seed = (Math.random() * 0xffffffff) >>> 0
      const s = createScenario(mulberry32(seed), rates, seed)
      setPayScenario(s)
      await document.fonts.ready
      await waitFrames()
      await new Promise((r) => window.setTimeout(r, 140))
      const el = payRef.current
      if (!el) continue
      try {
        const imgs = [...el.querySelectorAll('img')]
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
        paintPaymentRedactions(el, s, seed ^ 0xc0ff)
        await waitFrames()
        const raw = await withTimeout(
          toPng(el, {
            pixelRatio: 2,
            cacheBust: false,
            skipFonts: true,
          }),
          8000,
          'pay capture timeout',
        )
        clearPaymentRedactions(el)
        if (!raw || raw.length < 80) continue
        return raw
      } catch {
        clearPaymentRedactions(el)
        continue
      }
    }
    return null
  }, [rates])

  const captureChat = useCallback(async (s: ChatScenario) => {
    const el = chatRef.current
    if (!el) throw new Error('missing chat node')
    await document.fonts.ready
    await waitFrames()
    const imgs = [...el.querySelectorAll('img')]
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
    return toPng(el, {
      pixelRatio: Math.min(3, Math.max(1.5, s.device.density)),
      cacheBust: false,
      skipFonts: true,
    })
  }, [])

  const generate = useCallback(async (count: number) => {
    if (!rates?.ok) return
    setBusy(true)
    try {
      for (let i = 0; i < count; i++) {
        setLog(`Generating bank screenshot ${i + 1}/${count}…`)
        const payPng = await capturePay()
        if (!payPng) throw new Error('Could not export a redacted payment PNG')
        setLog(`Gemini 2.5 Flash writing English chat ${i + 1}/${count}…`)
        const script = await generateReviewScript()
        const seed = (Math.random() * 0xffffffff) >>> 0
        const s = assembleReviewChat(mulberry32(seed), seed, {
          skinId,
          script,
          paymentPng: payPng,
        })
        setScenario(s)
        await document.fonts.ready
        await waitFrames()
        await new Promise((r) => window.setTimeout(r, 80))
        const png = await captureChat(s)
        setLastPng(png)
        setGallery((g) => [{ scenario: s, png, skinId, wallId }, ...g].slice(0, 40))
      }
      setLog(`Accepted ${count} review chat${count === 1 ? '' : 's'}.`)
    } catch (err) {
      setLog(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }, [captureChat, capturePay, rates, skinId, wallId])

  const boot = useRef(false)
  useEffect(() => {
    if (boot.current || !rates?.ok) return
    boot.current = true
    void generate(1)
  }, [generate, rates])

  const onZip = async () => {
    if (!gallery.length) return
    setBusy(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('telegram-review-chats')
      if (!folder) throw new Error('zip failed')
      for (const item of gallery) {
        folder.file(`${item.scenario.id}.png`, item.png.split(',')[1] ?? '', { base64: true })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      downloadDataUrl(url, 'telegram-review-chats.zip')
      URL.revokeObjectURL(url)
      setLog(`Exported ${gallery.length} chats.`)
    } finally {
      setBusy(false)
    }
  }

  const view = scenario ? withSkinDevice(scenario, skinId) : null
  const previewScale = view
    ? Math.min(1, 360 / view.device.width, 680 / view.device.height)
    : 1
  const blocked = !rates || !rates.ok

  return (
    <div className="studio" data-busy={busy ? '1' : '0'}>
      <aside className="panel">
        <ModeNav current="chatpay" onMode={onMode} />
        <p className="eyebrow">Chat + payments</p>
        <h1>Review chat</h1>
        <p className="lede">
          Gemini 2.5 Flash writes an English Telegram review. The bank screen is generated, painted
          over with a red editor brush, exported to PNG, then dropped in as the only photo. Contact
          names are redacted. Reactions show on about 4% of messages.
        </p>

        <div className={`rate-card ${blocked ? 'bad' : 'ok'}`}>
          {blocked ? (
            <>
              <strong>Live market data unavailable</strong>
              <p>{rates && !rates.ok ? rates.message : 'Still loading…'}</p>
              <button type="button" onClick={() => void refreshRates()} disabled={busy}>Retry rates</button>
            </>
          ) : (
            <>
              <strong>Gemini + live rates</strong>
              <p>google/gemini-2.5-flash · English only · redacted PNG</p>
            </>
          )}
        </div>

        <h2>Mockup</h2>
        <div className="skin-picks">
          {SKIN_LIST.map((sk) => (
            <button
              key={sk.id}
              type="button"
              className={`skin-pick ${skinId === sk.id ? 'on' : ''}`}
              onClick={() => setSkinId(sk.id)}
            >
              <span className="skin-swatch" style={{ background: sk.headerBg }}>
                <i style={{ background: sk.inBg }} />
                <i style={{ background: sk.outBg, alignSelf: 'flex-end' }} />
              </span>
              <span>{sk.label}</span>
            </button>
          ))}
        </div>

        <div className="actions">
          <button type="button" disabled={blocked || busy} onClick={() => void generate(1)}>
            Genera 1
          </button>
          <button type="button" disabled={blocked || busy} onClick={() => void generate(4)}>
            Genera 4
          </button>
          <button type="button" disabled={!lastPng || busy} onClick={() => lastPng && downloadDataUrl(lastPng, `${scenario?.id ?? 'review'}.png`)}>
            Download PNG
          </button>
          <button type="button" disabled={!gallery.length || busy} onClick={() => void onZip()}>
            Download ZIP
          </button>
        </div>
        <p className="log">{busy ? 'Working… ' : ''}{log}</p>
      </aside>

      <section className="stage">
        <div className="preview-wrap">
          {view ? (
            <div
              className="preview-scale"
              style={{
                width: view.device.width * previewScale,
                height: view.device.height * previewScale,
              }}
            >
              <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
                <div className="bezel" style={{ borderRadius: view.device.corner + 10 }}>
                  <TelegramScreen s={view} skinId={skinId} wallId={wallId} />
                </div>
              </div>
            </div>
          ) : (
            <div className="empty">{blocked ? 'Need live rates.' : 'Generating review chat…'}</div>
          )}
        </div>
        {view && (
          <dl className="meta">
            <div><dt>Mockup</dt><dd>{skinId}</dd></div>
            <div><dt>Lang</dt><dd>English · redacted</dd></div>
            <div><dt>Device</dt><dd>{view.device.label} {view.device.width}×{view.device.height}</dd></div>
            <div><dt>Chat</dt><dd>review DM</dd></div>
          </dl>
        )}
      </section>

      <aside className="side">
        <h2>Session gallery</h2>
        <ul className="thumbs">
          {gallery.map((g) => (
            <li key={g.scenario.id}>
              <button
                type="button"
                onClick={() => {
                  setScenario(g.scenario)
                  setLastPng(g.png)
                  setSkinId(g.skinId)
                }}
              >
                <img src={g.png} alt="" />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="offscreen" aria-hidden="true">
        {payScenario && (
          <div
            ref={payRef}
            style={{
              position: 'relative',
              width: payScenario.device.width,
              height: payScenario.device.height,
              display: 'block',
            }}
          >
            <PaymentScreen s={payScenario} />
          </div>
        )}
        {view && (
          <div
            ref={chatRef}
            style={{
              width: view.device.width,
              height: view.device.height,
              display: 'block',
            }}
          >
            <TelegramScreen s={view} skinId={skinId} wallId={wallId} />
          </div>
        )}
      </div>
    </div>
  )
}
