import type { LocaleId, Person } from '../types.ts'
import { pick, type Rng } from './random.ts'

type Pool = { given: string[]; family: string[] }

const LATIN: Pool = {
  given: [
    'Nila', 'Vico', 'Sira', 'Arno', 'Mirel', 'Kael', 'Tova', 'Lior', 'Pavelin', 'Orna',
    'Rafi', 'Selka', 'Davin', 'Noe', 'Elma', 'Yaro', 'Ciro', 'Hela', 'Bram', 'Ivena',
    'Soren', 'Mael', 'Rina', 'Tarek', 'Luma', 'Nerio', 'Vesa', 'Jori', 'Anika', 'Pio',
  ],
  family: [
    'Tremonte', 'Sartela', 'Orvane', 'Nolden', 'Vellaro', 'Quintal', 'Morven', 'Halberg',
    'Pivetti', 'Caldera', 'Rouxel', 'Darnel', 'Solane', 'Westrin', 'Korbel', 'Fenwicke',
    'Ibarra-Nox', 'Veltri', 'Marnes', 'Holtzer', 'Sabirra', 'Lindenow', 'Carveth', 'Nunes-Vale',
  ],
}

const IT: Pool = {
  given: ['Nila', 'Vico', 'Sira', 'Arno', 'Mirel', 'Luma', 'Ciro', 'Elma', 'Nerio', 'Tova'],
  family: ['Tremonte', 'Sartela', 'Pivetti', 'Veltri', 'Caldera', 'Montelvo', 'Rovati', 'Bellora'],
}

const DE: Pool = {
  given: ['Soren', 'Hela', 'Bram', 'Anika', 'Jori', 'Mael', 'Vesa', 'Rina'],
  family: ['Nolden', 'Halberg', 'Westrin', 'Holtzer', 'Lindenow', 'Korbel', 'Darnel'],
}

const FR: Pool = {
  given: ['Mael', 'Noe', 'Elma', 'Sira', 'Lior', 'Orna', 'Ciro', 'Luma'],
  family: ['Rouxel', 'Marnes', 'Solane', 'Quintal', 'Carveth', 'Vellaro'],
}

const ES: Pool = {
  given: ['Nila', 'Ciro', 'Ivena', 'Nerio', 'Sira', 'Vico', 'Luma', 'Tova'],
  family: ['Caldera', 'Veltri', 'Sartela', 'Solane', 'Nunes-Vale', 'Morven'],
}

const PT: Pool = {
  given: ['Nila', 'Vico', 'Luma', 'Ciro', 'Ivena', 'Mael', 'Sira'],
  family: ['Nunes-Vale', 'Caldera', 'Sartela', 'Morven', 'Veltri', 'Solane'],
}

const TR: Pool = {
  given: ['Sira', 'Arno', 'Elma', 'Tova', 'Nerio', 'Luma', 'Yaro'],
  family: ['Karvane', 'Demiray', 'Yeltekin', 'Orhanel', 'Tanriva', 'Solane'],
}

const ID: Pool = {
  given: ['Sira', 'Rina', 'Davin', 'Luma', 'Nila', 'Yaro', 'Tova'],
  family: ['Wibawa-Nox', 'Santara', 'Pramula', 'Adiwira', 'Lestara', 'Mahendra-V'],
}

const FIL: Pool = {
  given: ['Luma', 'Nila', 'Ciro', 'Sira', 'Davin', 'Ivena'],
  family: ['Santara', 'Veltri', 'Morven', 'Caldera', 'Carveth'],
}

const VI: Pool = {
  given: ['Linh-V', 'An-Kha', 'Minh-Ra', 'Ha-Nila', 'Quang-Vico', 'Trang-Sira'],
  family: ['Tran-Nox', 'Ngo-Vel', 'Pham-Ora', 'Le-Sartel', 'Hoang-Vale'],
}

const PL: Pool = {
  given: ['Mirel', 'Anika', 'Jori', 'Nila', 'Soren', 'Hela'],
  family: ['Korbel', 'Nowarek', 'Westrin', 'Lindenow', 'Sartela'],
}

const UZ: Pool = {
  given: ['Sira', 'Yaro', 'Dilora', 'Nerio', 'Luma', 'Arno'],
  family: ['Karimov-Nox', 'Tursunel', 'Azizova-V', 'Nolden', 'Orvane'],
}

const CYR_RU: Pool = {
  given: ['Нила', 'Вико', 'Сира', 'Мирел', 'Лума', 'Нерио', 'Яро', 'Элма', 'Това', 'Каэл'],
  family: ['Тремонтев', 'Сартела', 'Орванов', 'Нольден', 'Велларо', 'Корбель', 'Солане'],
}

const CYR_UK: Pool = {
  given: ['Ніла', 'Віко', 'Сіра', 'Мирел', 'Лума', 'Яро', 'Елма', 'Това'],
  family: ['Тремонтенко', 'Сартела', 'Орванчук', 'Нольден', 'Велларо', 'Солане'],
}

const AR: Pool = {
  given: ['نيلا', 'سيرا', 'ليور', 'أرنو', 'توفا', 'ميرايل', 'هالة-نوكس', 'يوسفان'],
  family: ['ترموني', 'أورفان', 'نولدن', 'قنتال', 'سولان', 'مرفان'],
}

const FA: Pool = {
  given: ['نیلا', 'سیرا', 'آرنو', 'لوما', 'یارو', 'توفا', 'میرل'],
  family: ['ترمونه', 'اوروان', 'نولدن', 'سولانه', 'موروِن', 'کربل'],
}

const UR: Pool = {
  given: ['نیلا', 'سیرا', 'لوما', 'یارو', 'آرنو', 'توفا'],
  family: ['ترمونتی', 'اوروان', 'نولدن', 'سارتلا', 'موروین'],
}

const HI: Pool = {
  given: ['नीला', 'सिरा', 'लुमा', 'यारो', 'नेरियो', 'तोवा', 'आरनो'],
  family: ['त्रेमोंते', 'सार्टेला', 'ओरवान', 'नॉल्डेन', 'वेलारो'],
}

const BN: Pool = {
  given: ['নীলা', 'সিরা', 'লুমা', 'য়ারো', 'তোভা', 'আর্নো'],
  family: ['ত্রেমোন্তে', 'সার্টেলা', 'অরভান', 'নোল্ডেন', 'সোলানে'],
}

const TH: Pool = {
  given: ['นิลา', 'สิรา', 'ลูมา', 'ยาโร', 'เนริโอ', 'โทวา'],
  family: ['เตรมอนเต', 'ซาร์เตลา', 'ออร์เวน', 'โนลเดน', 'โซลาเน'],
}

const KO: Pool = {
  given: ['닐라', '시라', '루마', '야로', '네리오', '토바'],
  family: ['트레몬', '사르텔', '오르반', '놀덴', '벨라로'],
}

const JA: Pool = {
  given: ['ニラ', 'シラ', 'ルマ', 'ヤロ', 'ネリオ', 'トヴァ'],
  family: ['トレモンテ', 'サルテラ', 'オルヴァン', 'ノルデン', 'ヴェラーロ'],
}

function poolFor(locale: LocaleId): Pool {
  switch (locale) {
    case 'it':
      return IT
    case 'de':
      return DE
    case 'fr':
      return FR
    case 'es':
      return ES
    case 'pt':
      return PT
    case 'tr':
      return TR
    case 'id':
      return ID
    case 'fil':
      return FIL
    case 'vi':
      return VI
    case 'pl':
      return PL
    case 'uz':
      return UZ
    case 'ru':
      return CYR_RU
    case 'uk':
      return CYR_UK
    case 'ar':
      return AR
    case 'fa':
      return FA
    case 'ur':
      return UR
    case 'hi':
      return HI
    case 'bn':
      return BN
    case 'th':
      return TH
    case 'ko':
      return KO
    case 'ja':
      return JA
    default:
      return LATIN
  }
}

function initialsOf(given: string, family: string): string {
  const g = Array.from(given)[0] ?? 'S'
  const f = Array.from(family)[0] ?? 'N'
  return `${g}${f}`
}

export function synthPerson(rng: Rng, locale: LocaleId): Person {
  const pool = poolFor(locale)
  const given = pick(rng, pool.given)
  let family = pick(rng, pool.family)
  if (family === given) family = pick(rng, pool.family)
  const full = `${given} ${family}`
  return { given, family, full, initials: initialsOf(given, family) }
}

export function synthPair(rng: Rng, locale: LocaleId): { sender: Person; recipient: Person } {
  let sender = synthPerson(rng, locale)
  let recipient = synthPerson(rng, locale)
  let guard = 0
  while (recipient.full === sender.full && guard++ < 8) {
    recipient = synthPerson(rng, locale)
  }
  return { sender, recipient }
}
