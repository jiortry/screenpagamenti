import { useEffect, useRef } from 'react'
import type { Appearance, RateBook } from '../types.ts'
import { deviceById } from '../engine/devices.ts'
import { PREVIEW_BRANDS, previewScenario } from '../engine/preview.ts'
import { PaymentScreen } from './PaymentScreen.tsx'

function Phone({
  institutionId,
  rates,
  deviceId,
  scale,
  appearance,
}: {
  institutionId: string
  rates: RateBook
  deviceId: string
  scale: number
  appearance: Appearance
}) {
  const device = deviceById(deviceId)
  const s = previewScenario(institutionId, rates, device, appearance)
  return (
    <figure className="skin-phone">
      <figcaption>
        {s.institution.short} · {appearance} · {device.width}×{device.height}
      </figcaption>
      <div
        className="skin-bezel"
        style={{
          width: device.width * scale,
          height: device.height * scale,
        }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <PaymentScreen s={s} />
        </div>
      </div>
    </figure>
  )
}

export function SkinGallery({ rates }: { rates: RateBook }) {
  const params = new URLSearchParams(window.location.search)
  const focus = params.get('focus')
  const deviceFilter = params.get('device')
  const brands = focus ? PREVIEW_BRANDS.filter((id) => id === focus) : [...PREVIEW_BRANDS]
  const showSe = deviceFilter !== 'iphone-16-pro-max'
  const showMax = deviceFilter !== 'iphone-se'
  const seScale = focus ? 1 : 0.38
  const maxScale = focus ? 1 : 0.32
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = root.current
    if (!node) return
    let cancelled = false
    void document.fonts.ready.then(() => {
      window.setTimeout(() => {
        if (cancelled || !root.current) return
        const phones = root.current.querySelectorAll<HTMLElement>('[data-synthetic="true"]')
        const overflow: string[] = []
        const bars: string[] = []
        phones.forEach((el) => {
          const brand = el.getAttribute('data-brand') ?? '?'
          const device = el.getAttribute('data-device') ?? '?'
          const body = el.querySelector<HTMLElement>('[data-screen-body]')
          if (body && body.scrollHeight > body.clientHeight + 8) {
            overflow.push(`${brand}/${device}:${body.scrollHeight}>${body.clientHeight}`)
          }
          const bar = el.querySelector<HTMLElement>('[data-chrome="status"]')?.parentElement
          if (bar) {
            const bg = getComputedStyle(bar).backgroundColor.replace(/\s/g, '')
            if (bg !== 'rgb(255,255,255)' && bg !== 'rgb(0,0,0)') {
              bars.push(`${brand}/${device}:${bg}`)
            }
          }
        })
        root.current.setAttribute('data-skins-ready', '1')
        root.current.setAttribute('data-skins-overflow', overflow.length ? overflow.join('|') : 'ok')
        root.current.setAttribute('data-skins-statusbar', bars.length ? bars.join('|') : 'ok')
      }, 120)
    })
    return () => {
      cancelled = true
    }
  }, [rates])

  return (
    <div className="skin-gallery" ref={root}>
      <header className="skin-gallery-head">
        <p className="eyebrow">Brand skins</p>
        <h1>Per-provider mockups</h1>
        <p className="lede">Same payment, each institution in light and dark. iPhone SE and Pro Max.</p>
      </header>
      {showSe && (
        <section>
          <h2>iPhone SE 375×667</h2>
          <div className="skin-row">
            {brands.flatMap((id) =>
              (['light', 'dark'] as const).map((appearance) => (
                <Phone
                  key={`se-${id}-${appearance}`}
                  institutionId={id}
                  rates={rates}
                  deviceId="iphone-se"
                  scale={seScale}
                  appearance={appearance}
                />
              )),
            )}
          </div>
        </section>
      )}
      {showMax && (
        <section>
          <h2>iPhone 16 Pro Max 440×956</h2>
          <div className="skin-row">
            {brands.flatMap((id) =>
              (['light', 'dark'] as const).map((appearance) => (
                <Phone
                  key={`max-${id}-${appearance}`}
                  institutionId={id}
                  rates={rates}
                  deviceId="iphone-16-pro-max"
                  scale={maxScale}
                  appearance={appearance}
                />
              )),
            )}
          </div>
        </section>
      )}
    </div>
  )
}
