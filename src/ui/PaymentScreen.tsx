import type { Scenario } from '../types.ts'
import { isCryptoQuote } from '../engine/math.ts'
import { formatDateTime, formatFiat, formatQuote } from '../engine/format.ts'
import { scriptFont, themeTokens } from '../engine/themes.ts'
import { methodKey, statusKey, t, titleKey } from '../i18n/catalog.ts'
import {
  Actions,
  backgroundStyle,
  CardFace,
  Chip,
  Monogram,
  Row,
  statusTint,
  SynthQr,
} from './bits.tsx'
import { NavChrome, StatusChrome } from './chrome.tsx'

function CheckGlyph({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="20" fill="none" stroke={color} strokeWidth="2" />
      <path d="M12 22 l6 6 12-14" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function WarnGlyph({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="20" fill="none" stroke={color} strokeWidth="2" />
      <path d="M21 12 v12" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="21" cy="30" r="1.6" fill={color} />
    </svg>
  )
}

function CoinGlyph({ kind, color }: { kind: string; color: string }) {
  const letter =
    kind.includes('btc') ? 'B' : kind.includes('eth') ? 'Ξ' : kind.includes('ton') ? 'T' : kind.includes('xmr') ? 'X' : '₮'
  return (
    <svg width="46" height="46" viewBox="0 0 46 46">
      <circle cx="23" cy="23" r="21" fill="none" stroke={color} strokeWidth="2" />
      <text x="23" y="28" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
        {letter}
      </text>
    </svg>
  )
}

export function PaymentScreen({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const font = scriptFont(s.locale, theme.font)
  const chrome =
    s.device.family === 'iphone'
      ? '-apple-system, "SF Pro Text", "Noto Sans", sans-serif'
      : 'Roboto, "Noto Sans", sans-serif'
  const chromeColor = s.appearance === 'dark' ? '#f5f5f4' : '#111827'
  const pad = Math.round(s.device.width * 0.048 * s.visual.spacingScale)
  const fail = s.status === 'failed' || s.status === 'cancelled'

  return (
    <div
      lang={s.bcp47}
      dir={s.dir}
      data-synthetic="true"
      data-device={s.device.id}
      style={{
        width: s.device.width,
        height: s.device.height,
        overflow: 'hidden',
        borderRadius: s.device.corner,
        fontFamily: font,
        fontSize: 14 * s.fontScale,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        ...backgroundStyle(s, theme),
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontFamily: chrome }}>
        <StatusChrome s={s} color={chromeColor} />
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          paddingInline: pad,
          paddingTop: 4,
          paddingBottom: 6,
          gap: Math.max(4, 7 * s.visual.spacingScale),
        }}
      >
        {s.layoutId === 'crypto' && <CryptoLayout s={s} />}
        {s.layoutId === 'hero' && <HeroLayout s={s} />}
        {s.layoutId === 'bank' && <BankLayout s={s} />}
        {s.layoutId === 'remit' && <RemitLayout s={s} />}
        {s.layoutId === 'topup' && <TopupLayout s={s} />}
        {s.layoutId === 'cash' && <CashLayout s={s} />}
        {s.layoutId === 'cards' && <CardsLayout s={s} />}
      </div>
      <div style={{ fontFamily: chrome }}>
        <NavChrome s={s} color={chromeColor} bg={fail ? theme.bg : theme.nav === theme.button ? theme.bg : 'transparent'} />
      </div>
    </div>
  )
}

function Header({ s, withBalance }: { s: Scenario; withBalance?: boolean }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const bal = Math.round((s.amountEur * 2.4 + (s.seed % 1700) + 420) * 100) / 100
  return (
    <div
      style={{
        minHeight: s.visual.headerHeight * 0.45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Monogram letters={s.institution.monogram} theme={theme} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95em' }}>{s.institution.name}</div>
          {withBalance && s.visual.showBalance && (
            <div style={{ color: theme.muted, fontSize: '0.75em' }}>
              {t(loc, 'available')} {formatFiat(bal, 'EUR', s.bcp47)}
            </div>
          )}
        </div>
      </div>
      <Chip theme={theme} color={statusTint(s.status, theme)}>
        {t(loc, statusKey(s.status))}
      </Chip>
    </div>
  )
}

function AmountBlock({ s, primaryCrypto }: { s: Scenario; primaryCrypto?: boolean }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const c = s.conversion
  const loc = s.locale
  const primary = primaryCrypto && isCryptoQuote(c.quote_currency)
    ? formatQuote(c.converted_amount, c.quote_currency, s.bcp47)
    : formatFiat(s.amountEur, 'EUR', s.bcp47)
  const secondary = primaryCrypto && isCryptoQuote(c.quote_currency)
    ? formatFiat(s.amountEur, 'EUR', s.bcp47)
    : c.quote_currency !== 'EUR'
      ? formatQuote(c.converted_amount, c.quote_currency, s.bcp47)
      : s.secondary
        ? formatQuote(s.secondary.converted_amount, s.secondary.quote_currency, s.bcp47)
        : null
  return (
    <div style={{ textAlign: s.visual.summaryStyle === 'stacked' ? 'start' : 'center', paddingBlock: 6 }}>
      <div style={{ color: theme.muted, fontSize: '0.8em', fontWeight: 600 }}>{t(loc, titleKey(s.status))}</div>
      <div
        style={{
          fontSize: s.visual.typeScale * (s.device.width < 360 || s.device.height < 740 ? 1.45 : 1.85) + 'em',
          fontWeight: 800,
          letterSpacing: -0.8,
          lineHeight: 1.1,
          marginTop: 4,
        }}
      >
        {primary}
      </div>
      {secondary && (
        <div style={{ color: theme.muted, marginTop: 4, fontSize: '0.88em' }}>
          {t(loc, 'converted')} · {secondary}
        </div>
      )}
    </div>
  )
}

function HeroLayout({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const tint = statusTint(s.status, theme)
  const person = s.status === 'received' ? s.sender : s.recipient
  return (
    <>
      <Header s={s} withBalance />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: s.visual.cardOffset }}>
        {s.visual.iconStyle === 'illustration' ? (
          s.status === 'failed' || s.status === 'cancelled' ? (
            <WarnGlyph color={tint} />
          ) : (
            <CheckGlyph color={tint} />
          )
        ) : (
          <Monogram letters={person.initials} theme={theme} size={52} />
        )}
      </div>
      <div style={{ textAlign: 'center', fontWeight: 700 }}>{person.full}</div>
      <AmountBlock s={s} />
      <div
        style={{
          background: theme.surface,
          borderRadius: theme.radius + 6,
          padding: 12,
          boxShadow: s.visual.summaryStyle === 'cards' ? '0 10px 24px rgba(0,0,0,0.08)' : undefined,
        }}
      >
        <Row label={t(loc, 'from')} value={s.sender.full} theme={theme} />
        <Row label={t(loc, 'to')} value={s.recipient.full} theme={theme} />
        <Row label={t(loc, 'date')} value={formatDateTime(s.timestamp, s.bcp47)} theme={theme} />
        <Row label={t(loc, 'reference')} value={s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'note')} value={s.note} theme={theme} />
        {s.feeEur > 0 && <Row label={t(loc, 'fee')} value={formatFiat(s.feeEur, 'EUR', s.bcp47)} theme={theme} />}
      </div>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'share')} />
    </>
  )
}

function CryptoLayout({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const tint = statusTint(s.status, theme)
  const conf = s.status === 'confirmed' || s.status === 'completed' ? '12/12' : s.status === 'pending' ? '2/12' : '0/12'
  return (
    <>
      <Header s={s} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: s.visual.cardOffset }}>
        <CoinGlyph kind={s.category} color={theme.accent2} />
        <div>
          <Chip theme={theme}>{s.networkName}</Chip>
          <div style={{ fontWeight: 800, marginTop: 6 }}>{t(loc, titleKey(s.status))}</div>
        </div>
      </div>
      <AmountBlock s={s} primaryCrypto />
      <div
        style={{
          background: theme.surface,
          borderRadius: theme.radius,
          padding: 12,
          border: `1px solid ${theme.line}`,
        }}
      >
        <Row label={t(loc, 'from')} value={s.walletFrom ?? s.sender.full} theme={theme} mono />
        <Row label={t(loc, 'to')} value={s.walletTo ?? s.recipient.full} theme={theme} mono />
        <Row label={t(loc, 'networkFee')} value={formatFiat(s.feeEur, 'EUR', s.bcp47)} theme={theme} />
        {s.conversion.show_rate && <Row label={t(loc, 'rate')} value={s.conversion.display_rate} theme={theme} />}
        <Row label={t(loc, 'confirmations')} value={conf} theme={theme} />
        <Row label={t(loc, 'reference')} value={s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'note')} value={s.note} theme={theme} />
      </div>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} />
    </>
  )
}

function BankLayout({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const tint = statusTint(s.status, theme)
  const paper = s.visual.bgTreatment === 'paper'
  return (
    <>
      <Header s={s} withBalance />
      <div
        style={{
          marginTop: s.visual.cardOffset,
          background: paper ? theme.surface : theme.surface,
          borderRadius: theme.radius,
          padding: 14,
          boxShadow: paper ? '0 1px 0 rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.08)' : undefined,
          border: `1px solid ${theme.line}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800 }}>{t(loc, 'transferDetails')}</span>
          <Chip theme={theme} color={tint}>
            {t(loc, methodKey(s.category))}
          </Chip>
        </div>
        <AmountBlock s={s} />
        <Row label={t(loc, 'sender')} value={s.sender.full} theme={theme} />
        <Row label={t(loc, 'iban')} value={s.ibanFrom ?? '—'} theme={theme} mono />
        <Row label={t(loc, 'recipient')} value={s.recipient.full} theme={theme} />
        <Row label={t(loc, 'iban')} value={s.ibanTo ?? '—'} theme={theme} mono />
        {s.device.height >= 760 && <Row label={t(loc, 'bank')} value={s.institution.name} theme={theme} />}
        <Row label={t(loc, 'date')} value={formatDateTime(s.timestamp, s.bcp47)} theme={theme} />
        <Row label={t(loc, 'fee')} value={formatFiat(s.feeEur, 'EUR', s.bcp47)} theme={theme} />
        <Row label={t(loc, 'total')} value={formatFiat(s.totalEur, 'EUR', s.bcp47)} theme={theme} />
        {s.conversion.show_rate && s.device.height >= 700 && (
          <Row label={t(loc, 'rate')} value={s.conversion.display_rate} theme={theme} />
        )}
        {s.status !== 'completed' && s.status !== 'sent' && s.status !== 'received' && (
          <Row label={t(loc, 'eta')} value={s.etaLabel} theme={theme} />
        )}
        <Row label={t(loc, 'reference')} value={s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'note')} value={s.note} theme={theme} />
      </div>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} />
    </>
  )
}

function RemitLayout({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const tint = statusTint(s.status, theme)
  return (
    <>
      <Header s={s} />
      <div style={{ textAlign: 'center', fontWeight: 800 }}>{t(loc, titleKey(s.status))}</div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 4 }}>
        <Monogram letters={s.sender.initials} theme={theme} size={44} />
        <div style={{ color: theme.muted, fontWeight: 700 }}>→</div>
        <Monogram letters={s.recipient.initials} theme={theme} size={44} />
      </div>
      <AmountBlock s={s} />
      <div style={{ background: theme.surface, borderRadius: theme.radius + 4, padding: 12 }}>
        <Row label={t(loc, 'youSent')} value={formatFiat(s.amountEur, 'EUR', s.bcp47)} theme={theme} />
        <Row
          label={t(loc, 'youReceived')}
          value={formatQuote(s.conversion.converted_amount, s.conversion.quote_currency, s.bcp47)}
          theme={theme}
        />
        <Row label={t(loc, 'fee')} value={formatFiat(s.feeEur, 'EUR', s.bcp47)} theme={theme} />
        {s.conversion.show_rate && <Row label={t(loc, 'rate')} value={s.conversion.display_rate} theme={theme} />}
        <Row label={t(loc, 'pickupCode')} value={s.pickupCode ?? s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'pickupLocation')} value={s.pickupPoint ?? s.institution.short} theme={theme} />
        <Row label={t(loc, 'eta')} value={s.etaLabel} theme={theme} />
        <Row label={t(loc, 'reference')} value={s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'note')} value={s.note} theme={theme} />
      </div>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'share')} />
    </>
  )
}

function TopupLayout({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const tint = statusTint(s.status, theme)
  return (
    <>
      <Header s={s} withBalance />
      <div style={{ textAlign: 'center', marginTop: s.visual.cardOffset }}>
        <Chip theme={theme}>{s.operator}</Chip>
        <div style={{ fontSize: '1.15em', fontWeight: 800, marginTop: 10 }}>{s.phone}</div>
      </div>
      <AmountBlock s={s} />
      <div style={{ background: theme.surface, borderRadius: theme.radius + 8, padding: 12 }}>
        <Row label={t(loc, 'operator')} value={s.operator ?? '—'} theme={theme} />
        <Row label={t(loc, 'phone')} value={s.phone ?? '—'} theme={theme} mono />
        <Row label={t(loc, 'amount')} value={formatFiat(s.amountEur, 'EUR', s.bcp47)} theme={theme} />
        <Row label={t(loc, 'fee')} value={formatFiat(s.feeEur, 'EUR', s.bcp47)} theme={theme} />
        <Row label={t(loc, 'total')} value={formatFiat(s.totalEur, 'EUR', s.bcp47)} theme={theme} />
        <Row label={t(loc, 'date')} value={formatDateTime(s.timestamp, s.bcp47)} theme={theme} />
        <Row label={t(loc, 'reference')} value={s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'note')} value={s.note} theme={theme} />
      </div>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} />
    </>
  )
}

function CashLayout({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const tint = statusTint(s.status, theme)
  return (
    <>
      <Header s={s} />
      <div style={{ textAlign: 'center', fontWeight: 800 }}>{t(loc, titleKey(s.status))}</div>
      <div
        style={{
          background: theme.surface,
          borderRadius: theme.radius,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginTop: s.visual.cardOffset,
        }}
      >
        <div style={{ fontSize: '0.78em', color: theme.muted }}>{t(loc, 'pickupCode')}</div>
        <div style={{ fontWeight: 800, fontSize: '1.25em', letterSpacing: 1.2 }}>{s.pickupCode}</div>
        <SynthQr seed={s.transactionId} color={theme.text} bg={theme.surface} size={s.device.height < 760 ? 84 : 110} />
        <AmountBlock s={s} />
      </div>
      <div style={{ background: theme.surface, borderRadius: theme.radius, padding: 12 }}>
        <Row label={t(loc, 'sender')} value={s.sender.full} theme={theme} />
        <Row label={t(loc, 'recipient')} value={s.recipient.full} theme={theme} />
        <Row label={t(loc, 'pickupLocation')} value={s.pickupPoint ?? '—'} theme={theme} />
        <Row label={t(loc, 'eta')} value={s.etaLabel} theme={theme} />
        <Row label={t(loc, 'reference')} value={s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'note')} value={s.note} theme={theme} />
      </div>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'share')} />
    </>
  )
}

function CardsLayout({ s }: { s: Scenario }) {
  const theme = themeTokens(s.themeId, s.appearance)
  const loc = s.locale
  const tint = statusTint(s.status, theme)
  return (
    <>
      <Header s={s} withBalance />
      <div style={{ display: 'grid', gap: 10, marginTop: s.visual.cardOffset }}>
        <CardFace mask={s.cardFrom ?? '•••• 0000'} name={s.sender.full} theme={theme} tone="from" />
        <div style={{ textAlign: 'center', color: theme.muted, fontWeight: 700, fontSize: '0.85em' }}>↓</div>
        <CardFace mask={s.cardTo ?? '•••• 0000'} name={s.recipient.full} theme={theme} tone="to" />
      </div>
      <AmountBlock s={s} />
      <div style={{ background: theme.surface, borderRadius: theme.radius + 4, padding: 12 }}>
        <Row label={t(loc, 'method')} value={t(loc, 'methodCard')} theme={theme} />
        <Row label={t(loc, 'fee')} value={formatFiat(s.feeEur, 'EUR', s.bcp47)} theme={theme} />
        <Row label={t(loc, 'total')} value={formatFiat(s.totalEur, 'EUR', s.bcp47)} theme={theme} />
        <Row label={t(loc, 'date')} value={formatDateTime(s.timestamp, s.bcp47)} theme={theme} />
        <Row label={t(loc, 'reference')} value={s.transactionId} theme={theme} mono />
        <Row label={t(loc, 'note')} value={s.note} theme={theme} />
      </div>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} />
    </>
  )
}
