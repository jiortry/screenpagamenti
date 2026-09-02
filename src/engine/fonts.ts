import type { CSSProperties } from 'react'
import type { DeviceFamily, LocaleId } from '../types.ts'

const ROBOTO = 'Roboto, "Noto Sans", sans-serif'
const INTER_IOS = '"Inter", -apple-system, "SF Pro Text", "SF Pro Display", "Noto Sans", sans-serif'

export function chromeFontStack(family: DeviceFamily): string {
  return family === 'iphone' ? INTER_IOS : ROBOTO
}

export function bodyFontStack(family: DeviceFamily, brandFont: string): string {
  if (family === 'iphone') {
    return `${brandFont}, ${INTER_IOS}`
  }
  return `${brandFont}, ${ROBOTO}`
}

export function tabularStyle(): CSSProperties {
  return {
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
  }
}

export function scriptFontForLocale(locale: LocaleId, baseFont: string): string {
  switch (locale) {
    case 'ja':
      return `"Noto Sans JP", ${baseFont}`
    case 'ko':
      return `"Noto Sans KR", ${baseFont}`
    case 'ar':
    case 'fa':
    case 'ur':
      return `"Noto Sans Arabic", ${baseFont}`
    case 'hi':
      return `"Noto Sans Devanagari", ${baseFont}`
    case 'th':
      return `"Noto Sans Thai", ${baseFont}`
    case 'bn':
      return `"Noto Sans Bengali", ${baseFont}`
    default:
      return baseFont
  }
}
