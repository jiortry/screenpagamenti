import type { LocaleId, TextDir } from '../types.ts'
import { pickWeighted, type Rng } from './random.ts'

export type LocaleMeta = {
  id: LocaleId
  weight: number
  dir: TextDir
  bcp47: string
  label: string
}

export const LOCALES: LocaleMeta[] = [
  { id: 'en', weight: 35, dir: 'ltr', bcp47: 'en-US', label: 'English' },
  { id: 'es', weight: 6.2, dir: 'ltr', bcp47: 'es-ES', label: 'Español' },
  { id: 'fr', weight: 5.4, dir: 'ltr', bcp47: 'fr-FR', label: 'Français' },
  { id: 'de', weight: 5.2, dir: 'ltr', bcp47: 'de-DE', label: 'Deutsch' },
  { id: 'pt', weight: 4.8, dir: 'ltr', bcp47: 'pt-BR', label: 'Português' },
  { id: 'it', weight: 4.5, dir: 'ltr', bcp47: 'it-IT', label: 'Italiano' },
  { id: 'ru', weight: 4.2, dir: 'ltr', bcp47: 'ru-RU', label: 'Русский' },
  { id: 'ar', weight: 4.0, dir: 'rtl', bcp47: 'ar-SA', label: 'العربية' },
  { id: 'hi', weight: 3.6, dir: 'ltr', bcp47: 'hi-IN', label: 'हिन्दी' },
  { id: 'id', weight: 3.6, dir: 'ltr', bcp47: 'id-ID', label: 'Bahasa Indonesia' },
  { id: 'tr', weight: 3.2, dir: 'ltr', bcp47: 'tr-TR', label: 'Türkçe' },
  { id: 'vi', weight: 2.6, dir: 'ltr', bcp47: 'vi-VN', label: 'Tiếng Việt' },
  { id: 'pl', weight: 2.2, dir: 'ltr', bcp47: 'pl-PL', label: 'Polski' },
  { id: 'uk', weight: 2.2, dir: 'ltr', bcp47: 'uk-UA', label: 'Українська' },
  { id: 'ko', weight: 1.8, dir: 'ltr', bcp47: 'ko-KR', label: '한국어' },
  { id: 'ja', weight: 1.8, dir: 'ltr', bcp47: 'ja-JP', label: '日本語' },
  { id: 'fil', weight: 1.8, dir: 'ltr', bcp47: 'fil-PH', label: 'Filipino' },
  { id: 'th', weight: 1.8, dir: 'ltr', bcp47: 'th-TH', label: 'ไทย' },
  { id: 'fa', weight: 1.7, dir: 'rtl', bcp47: 'fa-IR', label: 'فارسی' },
  { id: 'bn', weight: 1.5, dir: 'ltr', bcp47: 'bn-BD', label: 'বাংলা' },
  { id: 'ur', weight: 1.5, dir: 'rtl', bcp47: 'ur-PK', label: 'اردو' },
  { id: 'uz', weight: 1.4, dir: 'ltr', bcp47: 'uz-UZ', label: 'O’zbekcha' },
]

export const RTL_LOCALES: LocaleId[] = ['ar', 'fa', 'ur']

export function sampleLocale(rng: Rng): LocaleMeta {
  return pickWeighted(rng, LOCALES)
}
