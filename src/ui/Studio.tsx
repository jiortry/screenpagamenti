import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RateBook, RateError, Scenario } from '../types.ts'
import { mulberry32 } from '../engine/random.ts'
import { loadRates } from '../engine/rates.ts'
import { createScenario } from '../engine/scenario.ts'
import { applyPhotoArtifacts } from '../engine/capture.ts'
import { qcImage, qcLayout, qcScenario, type QcIssue } from '../engine/quality.ts'
import { PaymentScreen } from './PaymentScreen.tsx'
import { SkinGallery } from './SkinGallery.tsx'
import { ModeNav, type StudioMode } from './ModeNav.tsx'

type Accepted = {
  scenario: Scenario
  png: string
  issues: QcIssue[]
}

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

export function Studio({ onMode }: { onMode?: (m: StudioMode) => void }) {
  const captureRef = useRef<HTMLDivElement>(null)
  const [rates, setRates] = useState<RateBook | RateError | null>(null)
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState<string>('Loading live market data…')
  const [gallery, setGallery] = useState<Accepted[]>([])
  const [lastPng, setLastPng] = useState<string | null>(null)
  const applyScenario = useCallback(async (s: Scenario) => {
    setScenario(s)
    await document.fonts.ready
    await waitFrames()
    await new Promise((r) => window.setTimeout(r, 80))
  }, [])

  const refreshRates = useCallback(async () => {
    setLog('Fetching live market data…')
    const book = await loadRates()
    setRates(book)
    if (!book.ok) {
      setLog(book.message)
      setScenario(null)
      return
    }
    setLog(`Rates OK · ${book.source} · ${book.timestamp}`)
  }, [])

  useEffect(() => {
    void refreshRates()
  }, [refreshRates])

  const generateAccepted = useCallback(async (): Promise<Accepted> => {
    if (!rates || !rates.ok) {
      throw new Error('Live market data unavailable. Generation is blocked.')
    }
    const rejected: string[] = []
    for (let attempt = 1; attempt <= 10; attempt++) {
      const seed = (Math.random() * 0xffffffff) >>> 0
      const s = createScenario(mulberry32(seed), rates, seed)
      const pre = qcScenario(s, rates)
      if (!pre.ok) {
        rejected.push(`#${attempt} scenario: ${pre.issues.map((i) => i.code).join(',')}`)
        continue
      }
      await applyScenario(s)
      await document.fonts.ready
      await waitFrames()
      await new Promise((r) => window.setTimeout(r, 50))
      const el = captureRef.current
      if (!el) {
        rejected.push(`#${attempt} missing node`)
        continue
      }
      const lay = qcLayout(s, el)
      if (!lay.ok) {
        rejected.push(`#${attempt} layout: ${lay.issues.map((i) => i.detail).join('; ')}`)
        continue
      }
      let png: string
      try {
        const raw = await withTimeout(
          toPng(el, {
            pixelRatio: Math.min(3, Math.max(1.5, s.device.density)),
            cacheBust: false,
            skipFonts: true,
          }),
          12000,
          'capture timeout',
        )
        png = await applyPhotoArtifacts(raw, s.capture, s.seed)
      } catch (err) {
        rejected.push(`#${attempt} capture: ${err instanceof Error ? err.message : String(err)}`)
        continue
      }
      const img = await qcImage(png, s)
      if (!img.ok) {
        rejected.push(`#${attempt} image: ${img.issues.map((i) => i.detail).join('; ')}`)
        continue
      }
      return { scenario: s, png, issues: [...pre.issues, ...lay.issues, ...img.issues] }
    }
    throw new Error(`QC rejected 10 attempts. ${rejected.slice(-3).join(' | ')}`)
  }, [applyScenario, rates])

  const onGenerate = useCallback(async (count: number) => {
    if (!rates?.ok) return
    setBusy(true)
    const accepted: Accepted[] = []
    try {
      for (let i = 0; i < count; i++) {
        setLog(`Generating ${i + 1}/${count}…`)
        const item = await generateAccepted()
        accepted.push(item)
        setLastPng(item.png)
        setGallery((g) => [item, ...g].slice(0, 40))
      }
      setLog(`Accepted ${accepted.length} screen${accepted.length === 1 ? '' : 's'} after QC.`)
    } catch (err) {
      setLog(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }, [generateAccepted, rates])

  const autoOnce = useRef(false)
  useEffect(() => {
    if (autoOnce.current || !rates?.ok) return
    if (new URLSearchParams(window.location.search).get('autogen') !== '1') return
    autoOnce.current = true
    void onGenerate(1)
  }, [rates, onGenerate])

  const onZip = async () => {
    if (!gallery.length) return
    setBusy(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('synthetic-payments')
      if (!folder) throw new Error('zip failed')
      folder.file(
        'MANIFEST.json',
        JSON.stringify(
          {
            synthetic: true,
            generated_at: new Date().toISOString(),
            rates,
            count: gallery.length,
            notice:
              'Original mockups with fictional institutions. Not affiliated with any bank or payment brand.',
          },
          null,
          2,
        ),
      )
      for (const item of gallery) {
        const id = item.scenario.transactionId
        folder.file(`${id}.png`, item.png.split(',')[1] ?? '', { base64: true })
        folder.file(`${id}.json`, JSON.stringify(item.scenario, null, 2))
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      downloadDataUrl(url, 'synthetic-payments.zip')
      URL.revokeObjectURL(url)
      setLog(`Exported ${gallery.length} PNG+JSON pairs.`)
    } finally {
      setBusy(false)
    }
  }

  const blocked = !rates || !rates.ok
  const skinsMode = new URLSearchParams(window.location.search).has('skins')
  const previewScale = scenario
    ? Math.min(1, 360 / scenario.device.width, 680 / scenario.device.height)
    : 1

  if (skinsMode) {
    if (!rates?.ok) {
      return <div className="empty">{rates && !rates.ok ? rates.message : 'Loading live market data…'}</div>
    }
    return <SkinGallery rates={rates} />
  }

  return (
    <div className="studio" data-ready={lastPng ? '1' : '0'} data-busy={busy ? '1' : '0'}>
      <aside className="panel">
        {onMode && <ModeNav current="payments" onMode={onMode} />}
        <p className="eyebrow">Synthetic dataset studio</p>
        <h1>Payment screen generator</h1>
        <p className="lede">
          Original mockups, invented names, and real mobile carriers in the status bar.
          Live FX is required. If rates cannot be fetched, nothing is generated.
        </p>

        <div className={`rate-card ${blocked ? 'bad' : 'ok'}`}>
          {blocked ? (
            <>
              <strong>Live market data unavailable</strong>
              <p>{rates && !rates.ok ? rates.message : 'Still loading…'}</p>
              <button type="button" onClick={() => void refreshRates()} disabled={busy}>
                Retry rates
              </button>
            </>
          ) : (
            <>
              <strong>Rates live</strong>
              <p>
                {rates.source}
                <br />
                {rates.timestamp}
              </p>
              <p className="ticks">
                BTC {rates.eurPerCrypto.BTC.toLocaleString('en-US', { maximumFractionDigits: 0 })} € · ETH{' '}
                {rates.eurPerCrypto.ETH.toLocaleString('en-US', { maximumFractionDigits: 0 })} € · TON{' '}
                {rates.eurPerCrypto.TON.toFixed(3)} €
              </p>
            </>
          )}
        </div>

        <div className="actions">
          <button type="button" data-testid="gen-1" disabled={blocked || busy} onClick={() => void onGenerate(1)}>
            Generate 1
          </button>
          <button type="button" disabled={blocked || busy} onClick={() => void onGenerate(10)}>
            Generate 10
          </button>
          <button type="button" disabled={blocked || busy} onClick={() => void onGenerate(25)}>
            Generate 25
          </button>
          <button type="button" disabled={!lastPng || busy} onClick={() => lastPng && downloadDataUrl(lastPng, `${scenario?.transactionId ?? 'screen'}.png`)}>
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
          {scenario ? (
            <div
              className="preview-scale"
              style={{
                width: scenario.device.width * previewScale,
                height: scenario.device.height * previewScale,
              }}
            >
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <div
                  className={scenario.device.family === 'iphone' ? undefined : 'bezel'}
                  style={scenario.device.family === 'iphone' ? undefined : { borderRadius: scenario.device.corner + 10 }}
                >
                  <PaymentScreen s={scenario} />
                </div>
              </div>
            </div>
          ) : (
            <div className="empty">No screen until live rates are available.</div>
          )}
        </div>
        {scenario && (
          <dl className="meta">
            <div><dt>Locale</dt><dd>{scenario.locale} · {scenario.bcp47} · {scenario.dir}</dd></div>
            <div><dt>Device</dt><dd>{scenario.device.label} {scenario.device.width}×{scenario.device.height}</dd></div>
            <div><dt>Category</dt><dd>{scenario.category}</dd></div>
            <div><dt>Timezone</dt><dd>{scenario.timezone}</dd></div>
            <div><dt>Status</dt><dd>{scenario.status}</dd></div>
            <div><dt>Institution</dt><dd>{scenario.institution.name}</dd></div>
            <div><dt>Tx</dt><dd>{scenario.transactionId}</dd></div>
          </dl>
        )}
      </section>

      <aside className="side">
        <h2>Session gallery</h2>
        <ul className="thumbs">
          {gallery.map((g) => (
            <li key={g.scenario.transactionId}>
              <button
                type="button"
                onClick={() => {
                  setScenario(g.scenario)
                  setLastPng(g.png)
                }}
              >
                <img src={g.png} alt={g.scenario.transactionId} />
              </button>
            </li>
          ))}
        </ul>
        {scenario && (
          <pre className="json">{JSON.stringify({
            synthetic: true,
            transactionId: scenario.transactionId,
            locale: scenario.locale,
            direction: scenario.direction,
            displayCurrency: scenario.displayCurrency,
            displayPerEur: scenario.displayPerEur,
            category: scenario.category,
            status: scenario.status,
            amountEur: scenario.amountEur,
            accountBalance: scenario.accountBalance,
            conversion: scenario.conversion,
            device: {
              id: scenario.device.id,
              width: scenario.device.width,
              height: scenario.device.height,
            },
          }, null, 2)}</pre>
        )}
      </aside>

      <div className="offscreen" aria-hidden="true">
        {scenario && (
          <div
            ref={captureRef}
            lang={scenario.bcp47}
            dir={scenario.dir}
            data-synthetic="true"
            style={{
              width: scenario.device.width,
              height: scenario.device.height,
              display: 'block',
            }}
          >
            <PaymentScreen s={scenario} />
          </div>
        )}
      </div>
    </div>
  )
}
