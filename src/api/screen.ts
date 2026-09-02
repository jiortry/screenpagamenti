export type ScreenKind = 'telegram' | 'payments' | 'chatpay'

export type ScreenApiOk = {
  ok: true
  kind: ScreenKind
  id: string
  seed: number
  createdAt: string
  mime: 'image/png'
  png: string
  base64: string
  width: number
  height: number
  device: {
    id: string
    label: string
    family: string
    width: number
    height: number
  }
  locale: string
  skin?: string
}

export type ScreenApiErr = {
  ok: false
  error: string
}

export type ScreenApiResult = ScreenApiOk | ScreenApiErr

declare global {
  interface Window {
    __SCREEN_API_RESULT__?: ScreenApiResult
  }
}
