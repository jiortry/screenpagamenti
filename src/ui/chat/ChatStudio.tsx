import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createChatScenario } from '../../chat/engine.ts'
import { skinById, SKIN_LIST } from '../../chat/skins.ts'
import type { ChatScenario, TgSkinId, TgWallId } from '../../chat/types.ts'
import { TG_SKIN_IDS } from '../../chat/types.ts'
import { sampleAndroidPhone, sampleIphone } from '../../engine/devices.ts'
import { mulberry32 } from '../../engine/random.ts'
import { LOCALES } from '../../engine/languages.ts'
import type { LocaleId } from '../../types.ts'
import { ModeNav, type StudioMode } from '../ModeNav.tsx'
import { TelegramScreen } from './TelegramScreen.tsx'

type Saved = { scenario: ChatScenario; png: string; skinId: TgSkinId; wallId: TgWallId }

const WALLS: { id: TgWallId; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'doodle-day', label: 'Doodle' },
  { id: 'doodle-night', label: 'Doodle night' },
  { id: 'solid', label: 'Tinta unita' },
  { id: 'gradient', label: 'Gradiente' },
  { id: 'photo-0', label: 'Foto 1' },
  { id: 'photo-1', label: 'Foto 2' },
  { id: 'photo-2', label: 'Foto 3' },
  { id: 'photo-3', label: 'Foto 4' },
  { id: 'photo-4', label: 'Foto 5' },
]

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

function withSkinDevice(s: ChatScenario, skinId: TgSkinId): ChatScenario {
  const skin = skinById(skinId)
  const wantIos = skin.platform === 'ios'
  const isIos = s.device.family === 'iphone'
  if (wantIos === isIos) return s
  const rng = mulberry32(s.seed ^ 0x51f)
  return { ...s, device: wantIos ? sampleIphone(rng) : sampleAndroidPhone(rng) }
}

export function ChatStudio({ onMode }: { onMode: (m: StudioMode) => void }) {
  const captureRef = useRef<HTMLDivElement>(null)
  const [skinId, setSkinId] = useState<TgSkinId>(() => {
    const s = new URLSearchParams(window.location.search).get('skin')
    return TG_SKIN_IDS.includes(s as TgSkinId) ? (s as TgSkinId) : 'ios-day'
  })
  const [wallId, setWallId] = useState<TgWallId>('auto')
  const [locale, setLocale] = useState<LocaleId | 'auto'>('it')
  const [scenario, setScenario] = useState<ChatScenario | null>(null)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState('Pronto.')
  const [gallery, setGallery] = useState<Saved[]>([])
  const [lastPng, setLastPng] = useState<string | null>(null)

  const apply = useCallback(async (s: ChatScenario) => {
    setScenario(s)
    await document.fonts.ready
    await waitFrames()
    await new Promise((r) => window.setTimeout(r, 80))
    const root = captureRef.current
    if (root) {
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
  }, [])

  const capture = useCallback(async (s: ChatScenario) => {
    const el = captureRef.current
    if (!el) throw new Error('missing node')
    await document.fonts.ready
    await waitFrames()
    return toPng(el, {
      pixelRatio: Math.min(3, Math.max(1.5, s.device.density)),
      cacheBust: false,
      skipFonts: true,
    })
  }, [])

  const generate = useCallback(async (count: number) => {
    setBusy(true)
    try {
      for (let i = 0; i < count; i++) {
        setLog(`Genero ${i + 1}/${count}…`)
        const seed = (Math.random() * 0xffffffff) >>> 0
        const s = createChatScenario(mulberry32(seed), seed, { skinId, locale })
        await apply(s)
        const png = await capture(s)
        setLastPng(png)
        setGallery((g) => [{ scenario: s, png, skinId, wallId }, ...g].slice(0, 40))
      }
      setLog(`Accettate ${count} chat.`)
    } catch (err) {
      setLog(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }, [apply, capture, locale, skinId, wallId])

  const boot = useRef(false)
  useEffect(() => {
    if (boot.current) return
    boot.current = true
    void generate(1)
  }, [generate])

  const recapture = useCallback(async () => {
    if (!scenario) return
    await waitFrames()
    try {
      const png = await capture(withSkinDevice(scenario, skinId))
      setLastPng(png)
    } catch {
      /* still rendering */
    }
  }, [capture, scenario, skinId])

  useEffect(() => {
    void recapture()
  }, [skinId, wallId, recapture])

  const onZip = async () => {
    if (!gallery.length) return
    setBusy(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('telegram-chats')
      if (!folder) throw new Error('zip failed')
      folder.file(
        'MANIFEST.json',
        JSON.stringify({
          synthetic: true,
          generated_at: new Date().toISOString(),
          count: gallery.length,
          notice: 'Synthetic Telegram mockups. Not affiliated with Telegram.',
        }, null, 2),
      )
      for (const item of gallery) {
        folder.file(`${item.scenario.id}.png`, item.png.split(',')[1] ?? '', { base64: true })
        folder.file(`${item.scenario.id}.json`, JSON.stringify(item.scenario, null, 2))
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      downloadDataUrl(url, 'telegram-chats.zip')
      URL.revokeObjectURL(url)
      setLog(`Esportate ${gallery.length} chat.`)
    } finally {
      setBusy(false)
    }
  }

  const view = scenario ? withSkinDevice(scenario, skinId) : null
  const previewScale = view
    ? Math.min(1, 360 / view.device.width, 680 / view.device.height)
    : 1

  return (
    <div className="studio" data-busy={busy ? '1' : '0'}>
      <aside className="panel">
        <ModeNav current="telegram" onMode={onMode} />
        <p className="eyebrow">Chat generator</p>
        <h1>Telegram</h1>
        <p className="lede">
          Mockup pixel-perfect: bubble, reply, vocali, foto, spunte, wallpaper e foto profilo reali.
          Scegli uno skin, poi genera.
        </p>

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

        <h2>Sfondo</h2>
        <div className="wall-picks">
          {WALLS.map((w) => (
            <button
              key={w.id}
              type="button"
              className={wallId === w.id ? 'on' : ''}
              onClick={() => setWallId(w.id)}
            >
              {w.label}
            </button>
          ))}
        </div>

        <label className="field">
          Lingua
          <select value={locale} onChange={(e) => setLocale(e.target.value as LocaleId | 'auto')}>
            <option value="auto">Auto</option>
            <option value="it">Italiano</option>
            {LOCALES.filter((l) => l.id !== 'it').map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </label>

        <div className="actions">
          <button type="button" disabled={busy} onClick={() => void generate(1)}>
            Genera 1
          </button>
          <button type="button" disabled={busy} onClick={() => void generate(8)}>
            Genera 8
          </button>
          <button type="button" disabled={!lastPng || busy} onClick={() => lastPng && downloadDataUrl(lastPng, `${scenario?.id ?? 'chat'}.png`)}>
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
            <div className="empty">Generazione…</div>
          )}
        </div>
        {view && (
          <dl className="meta">
            <div><dt>Mockup</dt><dd>{skinId}</dd></div>
            <div><dt>Device</dt><dd>{view.device.label} {view.device.width}×{view.device.height}</dd></div>
            <div><dt>Chat</dt><dd>{view.kind} · {view.peer.name}</dd></div>
            <div><dt>Locale</dt><dd>{view.locale} · {view.bcp47}</dd></div>
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
                  setWallId(g.wallId)
                }}
              >
                <img src={g.png} alt={g.scenario.peer.name} />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="offscreen" aria-hidden="true">
        {view && (
          <div
            ref={captureRef}
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
