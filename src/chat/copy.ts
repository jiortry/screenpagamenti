import type { LocaleId } from '../types.ts'

export type Author = 'me' | 'them' | 0 | 1 | 2 | 3

export type Turn =
  | { d: 'today' | 'yesterday' }
  | { u: true }
  | { s: string }
  | { a: Author; t: string; r?: number; e?: boolean; rx?: string; fw?: string; link?: { title: string; site: string; desc: string } }
  | { a: Author; v: string; p?: number; rx?: string }
  | { a: Author; ph: true; t?: string }
  | { a: Author; st: string }

export type Script = {
  kind: 'dm' | 'group'
  group?: string
  nicks?: string[]
  turns: Turn[]
}

export type ChatUi = {
  message: string
  online: string
  typing: string
  lastJust: string
  lastMin: (n: number) => string
  lastAt: (t: string) => string
  lastYest: (t: string) => string
  lastRecently: string
  today: string
  yesterday: string
  unread: string
  members: (n: number) => string
  forwarded: string
  edited: string
  you: string
}

export const UI: Record<string, ChatUi> = {
  it: {
    message: 'Messaggio',
    online: 'online',
    typing: 'sta scrivendo...',
    lastJust: 'ultimo accesso adesso',
    lastMin: (n) => `ultimo accesso ${n} minuti fa`,
    lastAt: (t) => `ultimo accesso alle ${t}`,
    lastYest: (t) => `ultimo accesso ieri alle ${t}`,
    lastRecently: 'ultimo accesso di recente',
    today: 'Oggi',
    yesterday: 'Ieri',
    unread: 'Messaggi non letti',
    members: (n) => `${n} membri`,
    forwarded: 'Inoltrato da',
    edited: 'modificato',
    you: 'Tu',
  },
  en: {
    message: 'Message',
    online: 'online',
    typing: 'typing...',
    lastJust: 'last seen just now',
    lastMin: (n) => `last seen ${n} minutes ago`,
    lastAt: (t) => `last seen at ${t}`,
    lastYest: (t) => `last seen yesterday at ${t}`,
    lastRecently: 'last seen recently',
    today: 'Today',
    yesterday: 'Yesterday',
    unread: 'Unread messages',
    members: (n) => `${n} members`,
    forwarded: 'Forwarded from',
    edited: 'edited',
    you: 'You',
  },
  es: {
    message: 'Mensaje',
    online: 'en línea',
    typing: 'escribiendo...',
    lastJust: 'última vez ahora',
    lastMin: (n) => `última vez hace ${n} minutos`,
    lastAt: (t) => `última vez a las ${t}`,
    lastYest: (t) => `última vez ayer a las ${t}`,
    lastRecently: 'última vez recientemente',
    today: 'Hoy',
    yesterday: 'Ayer',
    unread: 'Mensajes no leídos',
    members: (n) => `${n} miembros`,
    forwarded: 'Reenviado de',
    edited: 'editado',
    you: 'Tú',
  },
  fr: {
    message: 'Message',
    online: 'en ligne',
    typing: 'écrit...',
    lastJust: 'vu à l’instant',
    lastMin: (n) => `vu il y a ${n} minutes`,
    lastAt: (t) => `vu à ${t}`,
    lastYest: (t) => `vu hier à ${t}`,
    lastRecently: 'vu récemment',
    today: 'Aujourd’hui',
    yesterday: 'Hier',
    unread: 'Messages non lus',
    members: (n) => `${n} membres`,
    forwarded: 'Transféré de',
    edited: 'modifié',
    you: 'Vous',
  },
  de: {
    message: 'Nachricht',
    online: 'online',
    typing: 'schreibt...',
    lastJust: 'zuletzt gerade eben',
    lastMin: (n) => `zuletzt vor ${n} Minuten`,
    lastAt: (t) => `zuletzt um ${t}`,
    lastYest: (t) => `zuletzt gestern um ${t}`,
    lastRecently: 'zuletzt kürzlich',
    today: 'Heute',
    yesterday: 'Gestern',
    unread: 'Ungelesene Nachrichten',
    members: (n) => `${n} Mitglieder`,
    forwarded: 'Weitergeleitet von',
    edited: 'bearbeitet',
    you: 'Du',
  },
  ru: {
    message: 'Сообщение',
    online: 'в сети',
    typing: 'печатает...',
    lastJust: 'был(а) только что',
    lastMin: (n) => `был(а) ${n} минут назад`,
    lastAt: (t) => `был(а) в ${t}`,
    lastYest: (t) => `был(а) вчера в ${t}`,
    lastRecently: 'был(а) недавно',
    today: 'Сегодня',
    yesterday: 'Вчера',
    unread: 'Непрочитанные',
    members: (n) => `${n} участников`,
    forwarded: 'Переслано от',
    edited: 'изменено',
    you: 'Вы',
  },
  pt: {
    message: 'Mensagem',
    online: 'online',
    typing: 'digitando...',
    lastJust: 'visto agora',
    lastMin: (n) => `visto há ${n} min`,
    lastAt: (t) => `visto às ${t}`,
    lastYest: (t) => `visto ontem às ${t}`,
    lastRecently: 'visto recentemente',
    today: 'Hoje',
    yesterday: 'Ontem',
    unread: 'Não lidas',
    members: (n) => `${n} membros`,
    forwarded: 'Encaminhado de',
    edited: 'editado',
    you: 'Você',
  },
  tr: {
    message: 'Mesaj',
    online: 'çevrimiçi',
    typing: 'yazıyor...',
    lastJust: 'son görülme şimdi',
    lastMin: (n) => `son görülme ${n} dk önce`,
    lastAt: (t) => `son görülme saat ${t}`,
    lastYest: (t) => `son görülme dün ${t}`,
    lastRecently: 'son görülme yakınlarda',
    today: 'Bugün',
    yesterday: 'Dün',
    unread: 'Okunmamış mesajlar',
    members: (n) => `${n} üye`,
    forwarded: 'İletildi',
    edited: 'düzenlendi',
    you: 'Sen',
  },
  ar: {
    message: 'رسالة',
    online: 'متصل',
    typing: 'يكتب...',
    lastJust: 'آخر ظهور الآن',
    lastMin: (n) => `آخر ظهور قبل ${n} دقائق`,
    lastAt: (t) => `آخر ظهور الساعة ${t}`,
    lastYest: (t) => `آخر ظهور أمس الساعة ${t}`,
    lastRecently: 'آخر ظهور مؤخرًا',
    today: 'اليوم',
    yesterday: 'أمس',
    unread: 'رسائل غير مقروءة',
    members: (n) => `${n} أعضاء`,
    forwarded: 'مُعاد توجيهه من',
    edited: 'معدّل',
    you: 'أنت',
  },
  pl: {
    message: 'Wiadomość',
    online: 'online',
    typing: 'pisze...',
    lastJust: 'ostatnio teraz',
    lastMin: (n) => `ostatnio ${n} min temu`,
    lastAt: (t) => `ostatnio o ${t}`,
    lastYest: (t) => `ostatnio wczoraj o ${t}`,
    lastRecently: 'ostatnio niedawno',
    today: 'Dzisiaj',
    yesterday: 'Wczoraj',
    unread: 'Nieprzeczytane',
    members: (n) => `${n} członków`,
    forwarded: 'Przekazano od',
    edited: 'edytowano',
    you: 'Ty',
  },
  uk: {
    message: 'Повідомлення',
    online: 'в мережі',
    typing: 'друкує...',
    lastJust: 'був(ла) щойно',
    lastMin: (n) => `був(ла) ${n} хв тому`,
    lastAt: (t) => `був(ла) о ${t}`,
    lastYest: (t) => `був(ла) вчора о ${t}`,
    lastRecently: 'був(ла) нещодавно',
    today: 'Сьогодні',
    yesterday: 'Вчора',
    unread: 'Непрочитані',
    members: (n) => `${n} учасників`,
    forwarded: 'Переслано від',
    edited: 'змінено',
    you: 'Ви',
  },
}

export function chatUi(locale: LocaleId): ChatUi {
  return UI[locale] ?? UI.en
}

const IT: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Ciao, sei già partito?' },
      { a: 'me', t: 'Sì, 5 minuti e sono sotto' },
      { a: 'them', t: 'Ok ti aspetto fuori, citofono Rossi', r: 2 },
      { a: 'me', v: '0:07' },
      { a: 'them', t: 'Perfetto 👍' },
      { a: 'them', ph: true },
      { a: 'me', ph: true },
      { a: 'me', t: 'Arrivato' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'yesterday' },
      { a: 'me', t: 'Ti ho mandato i 50€ su Revolut' },
      { a: 'them', t: 'Aspetta che controllo' },
      { d: 'today' },
      { a: 'them', t: 'Arrivati, grazie 🙏' },
      { a: 'me', t: 'Di niente, allora siamo a posto' },
      { a: 'them', t: 'Sì tutto ok', rx: '👍' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Domani sera siete liberi?' },
      { a: 'me', t: 'Io sì, verso che ora?' },
      { a: 'them', t: 'Tipo 20:30 da Marco' },
      { a: 'them', t: 'Porto la focaccia' },
      { a: 'me', t: 'Perfetto, porto da bere', r: 3 },
      { a: 'them', t: 'Fatto ✨' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Il codice è 847291' },
      { a: 'me', t: 'Non mi fa entrare' },
      { a: 'them', t: 'Riprova, a volte lagga un secondo' },
      { a: 'me', t: 'Ok ora sì', r: 3 },
      { a: 'them', t: 'Bene' },
      { a: 'them', st: '👌' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'Mi mandi l’iban quando puoi?' },
      { a: 'them', t: 'IT60 X054 2811 1010 0000 0123 456' },
      { a: 'them', t: 'Intesa, intestato a me' },
      { a: 'me', t: 'Mandato adesso', r: 2 },
      { a: 'them', t: 'Ricevuto, grazie' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Guarda sta foto' },
      { a: 'them', ph: true },
      { a: 'them', ph: true },
      { a: 'me', t: 'Nooo incredibile 😂' },
      { a: 'them', t: 'Giuro è successa stamattina' },
      { a: 'me', v: '0:11', p: 1 },
      { a: 'them', t: 'Ahahah esatto' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Chiamami appena esci' },
      { u: true },
      { a: 'them', t: 'Cioè tipo tra 10 min?' },
      { a: 'them', t: 'Ok niente, scrivimi tu' },
    ],
  },
  {
    kind: 'group',
    group: 'Cena venerdì',
    nicks: ['Luca', 'Sara', 'Ale'],
    turns: [
      { d: 'today' },
      { s: 'Sara ha creato il gruppo' },
      { a: 1, t: 'Allora, pizzeria o sushi?' },
      { a: 0, t: 'Pizza, sempre' },
      { a: 2, t: 'Ok pizza. Ore 21 da Da Michele?' },
      { a: 'me', t: 'Ci sto' },
      { a: 1, t: 'Prenoto per 4', r: 4 },
      { a: 0, t: 'Perfetto' },
    ],
  },
  {
    kind: 'group',
    group: 'Viaggio ✈️',
    nicks: ['Giulia', 'Marco', 'Elena'],
    turns: [
      { d: 'yesterday' },
      { a: 0, t: 'Ho preso i biglietti del bus per l’aeroporto' },
      { a: 2, t: 'Che ora parte?' },
      { a: 0, t: '6:40, quindi in stazione alle 6:20' },
      { d: 'today' },
      { a: 1, t: 'Io dormo da voi stasera, ok?' },
      { a: 'me', t: 'Sì porta la sveglia 😭' },
      { a: 2, ph: true },
    ],
  },
]

const EN: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Hey, you on your way?' },
      { a: 'me', t: 'Yeah, 5 min' },
      { a: 'them', t: 'Cool, I’ll wait downstairs', r: 2 },
      { a: 'me', v: '0:06' },
      { a: 'them', t: 'Got it 👍' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'yesterday' },
      { a: 'me', t: 'Sent you $40 on PayPal' },
      { a: 'them', t: 'Checking' },
      { d: 'today' },
      { a: 'them', t: 'Got it, thanks' },
      { a: 'me', t: 'All good then' },
      { a: 'them', t: 'Yep we’re even', rx: '🔥' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Look at this' },
      { a: 'them', ph: true },
      { a: 'me', t: 'No way 😂' },
      { a: 'them', t: 'I swear this was today' },
      { a: 'me', t: 'Send it to the group' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Can you call me when you’re free?' },
      { u: true },
      { a: 'them', t: 'No rush, after 6 is fine' },
      { a: 'them', t: 'Ok nvm I’ll text' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'What’s the address again?' },
      { a: 'them', t: '14 King Street, buzzer 3B' },
      { a: 'them', t: 'If it doesn’t work call me' },
      { a: 'me', t: 'I’m here' },
      { a: 'them', t: 'Coming' },
    ],
  },
  {
    kind: 'group',
    group: 'Friday hang',
    nicks: ['James', 'Emily', 'Chris'],
    turns: [
      { d: 'today' },
      { a: 1, t: 'Pub or someone’s place?' },
      { a: 0, t: 'Pub. The Crown at 8?' },
      { a: 2, t: 'Works for me' },
      { a: 'me', t: 'Same' },
      { a: 1, t: 'Booked', r: 2 },
    ],
  },
]

const ES: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: '¿Ya saliste?' },
      { a: 'me', t: 'Sí, 5 minutos' },
      { a: 'them', t: 'Vale, te espero abajo', r: 2 },
      { a: 'me', v: '0:08' },
      { a: 'them', t: 'Perfecto 👍' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'Te acabo de bizumear 30€' },
      { a: 'them', t: 'Miro' },
      { a: 'them', t: 'Ya está, gracias' },
      { a: 'me', t: 'Genial' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Mira esto' },
      { a: 'them', ph: true },
      { a: 'me', t: 'Jajaja no puede ser' },
      { a: 'them', t: 'Te lo juro' },
    ],
  },
  {
    kind: 'group',
    group: 'Cena',
    nicks: ['Lucía', 'Pablo', 'Ana'],
    turns: [
      { d: 'today' },
      { a: 0, t: '¿Tapas o sushi?' },
      { a: 1, t: 'Tapas, 21h' },
      { a: 'me', t: 'Yo llego' },
      { a: 2, t: 'Reservo', r: 2 },
    ],
  },
]

const FR: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'T’es en route ?' },
      { a: 'me', t: 'Oui, 5 min' },
      { a: 'them', t: 'Ok je t’attends en bas' },
      { a: 'me', v: '0:05' },
      { a: 'them', t: 'Parfait' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'Je t’ai envoyé 40€ sur Lydia' },
      { a: 'them', t: 'Reçu, merci 🙏' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', ph: true },
      { a: 'me', t: 'N’importe quoi 😂' },
      { a: 'them', t: 'Je te jure' },
    ],
  },
]

const DE: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Bist du schon unterwegs?' },
      { a: 'me', t: 'Ja, 5 Minuten' },
      { a: 'them', t: 'Ok, ich warte unten', r: 2 },
      { a: 'them', t: 'Klingel Müller' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'Hab dir 35€ per PayPal geschickt' },
      { a: 'them', t: 'Ist da, danke' },
    ],
  },
  {
    kind: 'group',
    group: 'Freitag',
    nicks: ['Anna', 'Thomas', 'Lea'],
    turns: [
      { d: 'today' },
      { a: 1, t: 'Biergarten um 19?' },
      { a: 0, t: 'Ja' },
      { a: 'me', t: 'Bin dabei' },
      { a: 2, t: 'Ich komme etwas später' },
    ],
  },
]

const RU: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Ты уже вышел?' },
      { a: 'me', t: 'Да, минуты 5' },
      { a: 'them', t: 'Ок, жду внизу' },
      { a: 'me', v: '0:06' },
      { a: 'them', t: '👍' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'Кинул 2000₽' },
      { a: 'them', t: 'Пришло, спасибо' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', ph: true },
      { a: 'me', t: 'Офигеть 😂' },
      { a: 'them', t: 'Это сегодня утром' },
    ],
  },
]

const PT: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Já saiu?' },
      { a: 'me', t: 'Sim, 5 min' },
      { a: 'them', t: 'Beleza, te espero embaixo' },
      { a: 'me', v: '0:07' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'Te mandei 80 no Pix' },
      { a: 'them', t: 'Caiu, valeu' },
    ],
  },
]

const TR: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Yola çıktın mı?' },
      { a: 'me', t: 'Evet, 5 dk' },
      { a: 'them', t: 'Tamam aşağıdayım' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: '50₺ attım' },
      { a: 'them', t: 'Geldi, teşekkürler' },
    ],
  },
]

const AR: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'طلعت؟' },
      { a: 'me', t: 'إي، خمس دقايق' },
      { a: 'them', t: 'تمام، أستناك تحت' },
    ],
  },
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'me', t: 'حوّلت لك 100' },
      { a: 'them', t: 'وصلت، شكراً' },
    ],
  },
]

const PL: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Już jedziesz?' },
      { a: 'me', t: 'Tak, 5 min' },
      { a: 'them', t: 'Ok, czekam na dole' },
    ],
  },
]

const UK: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Ти вже вийшов?' },
      { a: 'me', t: 'Так, хвилин 5' },
      { a: 'them', t: 'Ок, чекаю внизу' },
    ],
  },
]

const ID: Script[] = [
  {
    kind: 'dm',
    turns: [
      { d: 'today' },
      { a: 'them', t: 'Udah berangkat?' },
      { a: 'me', t: 'Iya, 5 menit lagi' },
      { a: 'them', t: 'Oke, aku nunggu di bawah' },
    ],
  },
]

const MORE: Record<string, Script[]> = {
  it: [
    {
      kind: 'dm',
      turns: [
        { d: 'today' },
        { a: 'them', t: 'https://maps.app.goo.gl/x', link: { title: 'Via Torino 14', site: 'maps.google.com', desc: 'Milano, Italia' } },
        { a: 'me', t: 'Ok vedo, 12 min a piedi' },
        { a: 'them', t: 'Prendi il tram se piove' },
      ],
    },
    {
      kind: 'dm',
      turns: [
        { d: 'today' },
        { a: 'them', t: 'Mamma ha detto di passare a prendere il pacco' },
        { a: 'me', t: 'A che ora è a casa?' },
        { a: 'them', t: 'Dopo le 18' },
        { a: 'me', t: 'Passo io' },
        { a: 'them', t: 'Grazie ❤️' },
      ],
    },
  ],
  en: [
    {
      kind: 'dm',
      turns: [
        { d: 'today' },
        { a: 'them', t: 'https://maps.app.goo.gl/x', link: { title: '14 King Street', site: 'maps.google.com', desc: 'London, UK' } },
        { a: 'me', t: 'Ok I see it, 10 min walk' },
      ],
    },
  ],
}

const BY_LOCALE: Partial<Record<LocaleId, Script[]>> = {
  it: [...IT, ...(MORE.it ?? [])],
  en: [...EN, ...(MORE.en ?? [])],
  es: ES,
  fr: FR,
  de: DE,
  ru: RU,
  pt: PT,
  tr: TR,
  ar: AR,
  pl: PL,
  uk: UK,
  id: ID,
}

export function scriptsFor(locale: LocaleId): Script[] {
  return BY_LOCALE[locale] ?? BY_LOCALE.en ?? EN
}

export const NICKS: Partial<Record<LocaleId, string[]>> = {
  it: ['mamma', 'papà', 'Ale 🍕', 'Giulia ☀️', 'Sara 💕', 'Luca', 'il capo', 'Fra', 'Vale 🌸', 'Nico'],
  en: ['Mom', 'Dad', 'Alex 🍕', 'Em ☀️', 'Sam', 'boss', 'Jess 💕', 'Chris'],
  es: ['mamá', 'papá', 'Lucía ☀️', 'Pablo', 'Ana 💕'],
  fr: ['maman', 'papa', 'Léa ☀️', 'Hugo', 'Chloé'],
  de: ['Mama', 'Papa', 'Anna ☀️', 'Tom', 'Lea'],
  ru: ['мама', 'папа', 'Саша', 'Маша 💕', 'Дима'],
  pt: ['mãe', 'pai', 'Ana ☀️', 'João', 'Bia 💕'],
  tr: ['anne', 'baba', 'Ayşe ☀️', 'Mehmet', 'Elif'],
  ar: ['ماما', 'بابا', 'سارة', 'أحمد'],
}
