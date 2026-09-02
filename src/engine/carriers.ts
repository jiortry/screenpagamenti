import type { BankRegion, LocaleId } from '../types.ts'
import { pick, type Rng } from './random.ts'

const BY_LOCALE: Record<LocaleId, string[]> = {
  it: ['TIM', 'Vodafone', 'WindTre', 'Iliad'],
  de: ['Telekom', 'Vodafone', 'O2'],
  fr: ['Orange', 'SFR', 'Free', 'Bouygues'],
  es: ['Movistar', 'Vodafone', 'Orange'],
  pt: ['Vivo', 'Claro', 'TIM'],
  en: ['Verizon', 'T-Mobile', 'AT&T', 'EE', 'O2'],
  ru: ['МТС', 'Билайн', 'МегаФон'],
  uk: ['Київстар', 'Vodafone'],
  ar: ['stc', 'Etisalat', 'Orange'],
  fa: ['همراه اول', 'ایرانسل'],
  ur: ['Jazz', 'Telenor', 'Zong'],
  tr: ['Turkcell', 'Vodafone', 'Türk Telekom'],
  id: ['Telkomsel', 'XL', 'Indosat'],
  hi: ['Jio', 'Airtel', 'Vi'],
  ja: ['NTT Docomo', 'au', 'SoftBank'],
  ko: ['SKT', 'KT', 'LG U+'],
  pl: ['Orange', 'Play', 'Plus'],
  th: ['AIS', 'True', 'dtac'],
  vi: ['Viettel', 'Vinaphone', 'Mobifone'],
  bn: ['Grameenphone', 'Robi'],
  fil: ['Globe', 'Smart'],
  uz: ['Beeline', 'Ucell'],
}

const BY_REGION: Record<BankRegion, string[]> = {
  IT: ['TIM', 'Vodafone', 'WindTre', 'Iliad'],
  US: ['Verizon', 'T-Mobile', 'AT&T'],
  GB: ['EE', 'O2', 'Vodafone', 'Three'],
  DE: ['Telekom', 'Vodafone', 'O2'],
  FR: ['Orange', 'SFR', 'Free'],
  ES: ['Movistar', 'Vodafone', 'Orange'],
  RO: ['Orange', 'Vodafone', 'Digi'],
  CH: ['Swisscom', 'Salt', 'Sunrise'],
  EU: ['Orange', 'Vodafone', 'Telekom'],
  AF: ['MTN', 'Airtel', 'Safaricom', 'Vodacom'],
  INTL: ['Vodafone', 'Orange', 'MTN'],
}

export function pickCarrier(rng: Rng, locale: LocaleId, region: BankRegion): string {
  if (locale === 'en' && region === 'US') return pick(rng, BY_REGION.US)
  if (locale === 'en' && region === 'GB') return pick(rng, BY_REGION.GB)
  if (locale === 'en' && region === 'AF') return pick(rng, BY_REGION.AF)
  if (region === 'AF' && (locale === 'fr' || locale === 'ar' || locale === 'en')) {
    return pick(rng, BY_REGION.AF)
  }
  return pick(rng, BY_LOCALE[locale] ?? BY_REGION[region] ?? BY_REGION.EU)
}
