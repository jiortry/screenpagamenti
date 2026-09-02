import type { DisplayCurrency, LocaleId, TextDir } from '../types.ts'
import { pickWeighted, type Rng } from './random.ts'

export type LocaleMeta = {
  id: LocaleId
  weight: number
  dir: TextDir
  bcp47: string
  label: string
  currency: DisplayCurrency
}

export const LOCALES: LocaleMeta[] = [
  { id: 'en', weight: 35, dir: 'ltr', bcp47: 'en-US', label: 'English', currency: 'USD' },
  { id: 'es', weight: 6.2, dir: 'ltr', bcp47: 'es-ES', label: 'Español', currency: 'EUR' },
  { id: 'fr', weight: 5.4, dir: 'ltr', bcp47: 'fr-FR', label: 'Français', currency: 'EUR' },
  { id: 'de', weight: 5.2, dir: 'ltr', bcp47: 'de-DE', label: 'Deutsch', currency: 'EUR' },
  { id: 'pt', weight: 4.8, dir: 'ltr', bcp47: 'pt-BR', label: 'Português', currency: 'BRL' },
  { id: 'it', weight: 4.5, dir: 'ltr', bcp47: 'it-IT', label: 'Italiano', currency: 'EUR' },
  { id: 'ru', weight: 4.2, dir: 'ltr', bcp47: 'ru-RU', label: 'Русский', currency: 'RUB' },
  { id: 'ar', weight: 4.0, dir: 'rtl', bcp47: 'ar-SA', label: 'العربية', currency: 'SAR' },
  { id: 'hi', weight: 3.6, dir: 'ltr', bcp47: 'hi-IN', label: 'हिन्दी', currency: 'INR' },
  { id: 'id', weight: 3.6, dir: 'ltr', bcp47: 'id-ID', label: 'Bahasa Indonesia', currency: 'IDR' },
  { id: 'tr', weight: 3.2, dir: 'ltr', bcp47: 'tr-TR', label: 'Türkçe', currency: 'TRY' },
  { id: 'vi', weight: 2.6, dir: 'ltr', bcp47: 'vi-VN', label: 'Tiếng Việt', currency: 'VND' },
  { id: 'pl', weight: 2.2, dir: 'ltr', bcp47: 'pl-PL', label: 'Polski', currency: 'PLN' },
  { id: 'uk', weight: 2.2, dir: 'ltr', bcp47: 'uk-UA', label: 'Українська', currency: 'UAH' },
  { id: 'ko', weight: 1.8, dir: 'ltr', bcp47: 'ko-KR', label: '한국어', currency: 'KRW' },
  { id: 'ja', weight: 1.8, dir: 'ltr', bcp47: 'ja-JP', label: '日本語', currency: 'JPY' },
  { id: 'fil', weight: 1.8, dir: 'ltr', bcp47: 'fil-PH', label: 'Filipino', currency: 'PHP' },
  { id: 'th', weight: 1.8, dir: 'ltr', bcp47: 'th-TH', label: 'ไทย', currency: 'THB' },
  { id: 'fa', weight: 1.7, dir: 'rtl', bcp47: 'fa-IR', label: 'فارسی', currency: 'IRR' },
  { id: 'bn', weight: 1.5, dir: 'ltr', bcp47: 'bn-BD', label: 'বাংলা', currency: 'BDT' },
  { id: 'ur', weight: 1.5, dir: 'rtl', bcp47: 'ur-PK', label: 'اردو', currency: 'PKR' },
  { id: 'uz', weight: 1.4, dir: 'ltr', bcp47: 'uz-UZ', label: 'O’zbekcha', currency: 'UZS' },
]

export const RTL_LOCALES: LocaleId[] = ['ar', 'fa', 'ur']

export function sampleLocale(rng: Rng): LocaleMeta {
  return pickWeighted(rng, LOCALES)
}
