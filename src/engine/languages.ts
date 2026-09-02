import type { LocaleId } from '../types.ts'
import { pickWeighted } from './random.ts'

export type LocaleMeta = {
  id: LocaleId
  weight: number
  dir: 'ltr' | 'rtl'
  bcp47: string
  label: string
  currency: import('../types.ts').DisplayCurrency
  timezone: string
  clock24h: boolean
}

export const LOCALES: LocaleMeta[] = [
  { id: 'en', weight: 35, dir: 'ltr', bcp47: 'en-US', label: 'English', currency: 'USD', timezone: 'America/New_York', clock24h: false },
  { id: 'es', weight: 6.2, dir: 'ltr', bcp47: 'es-ES', label: 'Español', currency: 'EUR', timezone: 'Europe/Madrid', clock24h: true },
  { id: 'fr', weight: 5.4, dir: 'ltr', bcp47: 'fr-FR', label: 'Français', currency: 'EUR', timezone: 'Europe/Paris', clock24h: true },
  { id: 'de', weight: 5.2, dir: 'ltr', bcp47: 'de-DE', label: 'Deutsch', currency: 'EUR', timezone: 'Europe/Berlin', clock24h: true },
  { id: 'pt', weight: 4.8, dir: 'ltr', bcp47: 'pt-BR', label: 'Português', currency: 'BRL', timezone: 'America/Sao_Paulo', clock24h: true },
  { id: 'it', weight: 4.5, dir: 'ltr', bcp47: 'it-IT', label: 'Italiano', currency: 'EUR', timezone: 'Europe/Rome', clock24h: true },
  { id: 'ru', weight: 4.2, dir: 'ltr', bcp47: 'ru-RU', label: 'Русский', currency: 'RUB', timezone: 'Europe/Moscow', clock24h: true },
  { id: 'ar', weight: 4.0, dir: 'rtl', bcp47: 'ar-SA', label: 'العربية', currency: 'SAR', timezone: 'Asia/Riyadh', clock24h: true },
  { id: 'hi', weight: 3.6, dir: 'ltr', bcp47: 'hi-IN', label: 'हिन्दी', currency: 'INR', timezone: 'Asia/Kolkata', clock24h: true },
  { id: 'id', weight: 3.6, dir: 'ltr', bcp47: 'id-ID', label: 'Bahasa Indonesia', currency: 'IDR', timezone: 'Asia/Jakarta', clock24h: true },
  { id: 'tr', weight: 3.2, dir: 'ltr', bcp47: 'tr-TR', label: 'Türkçe', currency: 'TRY', timezone: 'Europe/Istanbul', clock24h: true },
  { id: 'vi', weight: 2.6, dir: 'ltr', bcp47: 'vi-VN', label: 'Tiếng Việt', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh', clock24h: true },
  { id: 'pl', weight: 2.2, dir: 'ltr', bcp47: 'pl-PL', label: 'Polski', currency: 'PLN', timezone: 'Europe/Warsaw', clock24h: true },
  { id: 'uk', weight: 2.2, dir: 'ltr', bcp47: 'uk-UA', label: 'Українська', currency: 'UAH', timezone: 'Europe/Kyiv', clock24h: true },
  { id: 'ko', weight: 1.8, dir: 'ltr', bcp47: 'ko-KR', label: '한국어', currency: 'KRW', timezone: 'Asia/Seoul', clock24h: true },
  { id: 'ja', weight: 1.8, dir: 'ltr', bcp47: 'ja-JP', label: '日本語', currency: 'JPY', timezone: 'Asia/Tokyo', clock24h: true },
  { id: 'fil', weight: 1.8, dir: 'ltr', bcp47: 'fil-PH', label: 'Filipino', currency: 'PHP', timezone: 'Asia/Manila', clock24h: true },
  { id: 'th', weight: 1.8, dir: 'ltr', bcp47: 'th-TH', label: 'ไทย', currency: 'THB', timezone: 'Asia/Bangkok', clock24h: true },
  { id: 'fa', weight: 1.7, dir: 'rtl', bcp47: 'fa-IR', label: 'فارسی', currency: 'IRR', timezone: 'Asia/Tehran', clock24h: true },
  { id: 'bn', weight: 1.5, dir: 'ltr', bcp47: 'bn-BD', label: 'বাংলা', currency: 'BDT', timezone: 'Asia/Dhaka', clock24h: true },
  { id: 'ur', weight: 1.5, dir: 'rtl', bcp47: 'ur-PK', label: 'اردو', currency: 'PKR', timezone: 'Asia/Karachi', clock24h: true },
  { id: 'uz', weight: 1.4, dir: 'ltr', bcp47: 'uz-UZ', label: 'O’zbekcha', currency: 'UZS', timezone: 'Asia/Tashkent', clock24h: true },
]

export const RTL_LOCALES: LocaleId[] = ['ar', 'fa', 'ur']

export function localeMeta(id: LocaleId): LocaleMeta {
  return LOCALES.find((l) => l.id === id) ?? LOCALES[0]!
}

export function sampleLocale(rng: import('./random.ts').Rng): LocaleMeta {
  return pickWeighted(rng, LOCALES)
}
