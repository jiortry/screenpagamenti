import type { CSSProperties, ReactNode } from 'react'
import type { Scenario } from '../types.ts'
import {
  brandProfile,
  brandedTheme,
  brandSkin,
  statusBarColor,
  statusBarBackground,
  brandBackground,
  screenMetrics,
  type MockupSkin,
} from '../engine/brands.ts'
import { isCryptoQuote } from '../engine/math.ts'
import { formatDateTime, formatFiat, formatQuote } from '../engine/format.ts'
import { CRYPTO_LOGOS, carrierLogo } from '../engine/logos.ts'
import { scriptFont, themeTokens, type ThemeTokens } from '../engine/themes.ts'
import { methodKey, statusKey, t, titleKey } from '../i18n/catalog.ts'
import {
  Actions,
  AppLogo,
  CardFace,
  Chip,
  CryptoLogo,
  Monogram,
  RecentActivity,
  Row,
  statusTint,
  SynthQr,
} from './bits.tsx'
import { NavChrome, StatusChrome } from './chrome.tsx'

function screenTheme(s: Scenario): ThemeTokens {
  return brandedTheme(themeTokens(s.themeId, s.appearance), s.institution, s.appearance)
}

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

function CoinGlyph({ kind }: { kind: string }) {
  const coin =
    kind.includes('btc') ? 'BTC' : kind.includes('eth') ? 'ETH' : kind.includes('ton') ? 'TON' : kind.includes('xmr') ? 'XMR' : 'USDT'
  return <CryptoLogo src={CRYPTO_LOGOS[coin]} alt={coin} />
}

function sheetStyle(theme: ThemeTokens, ui: MockupSkin, extra?: CSSProperties): CSSProperties {
  const base: CSSProperties = {
    background: ui.card === 'none' ? 'transparent' : theme.surface,
    borderRadius: ui.card === 'none' ? 0 : theme.radius,
    padding: ui.card === 'none' ? 0 : 12,
  }
  if (ui.card === 'border') base.border = `1px solid ${theme.line}`
  if (ui.card === 'shadow') base.boxShadow = '0 8px 22px rgba(0,0,0,0.08)'
  return { ...base, ...extra }
}

export function PaymentScreen({ s }: { s: Scenario }) {
  const theme = screenTheme(s)
  const ui = brandSkin(s.institution)
  const font = scriptFont(s.locale, theme.font)
  const chrome =
    s.device.family === 'iphone'
      ? '-apple-system, "SF Pro Text", "Noto Sans", sans-serif'
      : 'Roboto, "Noto Sans", sans-serif'
  const chromeColor = statusBarColor(s.institution)
  const chromeBg = statusBarBackground(s.institution)
  const m = screenMetrics(s.device.width, s.device.height, s.visual.spacingScale, ui)

  return (
    <div
      lang={s.bcp47}
      dir={s.dir}
      data-synthetic="true"
      data-device={s.device.id}
      data-brand={s.institution.id}
      style={{
        width: s.device.width,
        height: s.device.height,
        overflow: 'hidden',
        borderRadius: s.device.corner,
        fontFamily: font,
        fontSize: (m.narrow ? 13 : 14) * s.fontScale,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        background: brandBackground(s.institution),
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontFamily: chrome, background: chromeBg }}>
        <StatusChrome s={s} color={chromeColor} />
      </div>
      <div
        data-screen-body=""
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          paddingInline: m.pad,
          paddingTop: ui.chrome === 'bare' ? 8 : 4,
          paddingBottom: 6,
          gap: m.gap,
          minHeight: 0,
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
      <div style={{ fontFamily: chrome, background: theme.bg }}>
        <NavChrome s={s} color={chromeColor} bg={theme.bg} />
      </div>
    </div>
  )
}

function BackChevron({ color }: { color: string }) {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden>
      <path d="M10 2 2 10l8 8" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Header({ s, withBalance }: { s: Scenario; withBalance?: boolean }) {
  const theme = screenTheme(s)
  const brand = brandProfile(s.institution)
  const ui = brand.ui
  const loc = s.locale
  const m = screenMetrics(s.device.width, s.device.height, s.visual.spacingScale, ui)
  const bal = s.accountBalance ?? Math.round((s.amountEur * 2.4 + (s.seed % 1700) + 420) * 100) / 100
  const tint = statusTint(s.status, theme)
  const status = (
    <span
      style={{
        display: 'inline-flex',
        padding: '3px 8px',
        borderRadius: ui.pill ? 999 : 6,
        background: `${tint}22`,
        color: tint,
        fontSize: '0.68em',
        fontWeight: 700,
        letterSpacing: 0.15,
        flexShrink: 0,
      }}
    >
      {t(loc, statusKey(s.status))}
    </span>
  )

  if (ui.chrome === 'bare') {
    return (
      <div
        style={{
          marginInline: -m.pad,
          marginTop: -4,
          padding: '4px 14px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: brand.headerText,
        }}
      >
        <BackChevron color={brand.headerText} />
        {status}
      </div>
    )
  }

  if (ui.chrome === 'minimal') {
    return (
      <div
        style={{
          marginInline: -m.pad,
          marginTop: -4,
          padding: '6px 14px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: brand.headerText,
          background: brand.headerBg,
        }}
      >
        <BackChevron color={brand.headerText} />
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 650, fontSize: '0.92em' }}>{s.institution.short}</div>
        {status}
      </div>
    )
  }

  return (
    <div
      style={{
        marginInline: -m.pad,
        marginTop: -4,
        padding: '6px 14px 10px',
        background: brand.headerBg,
        color: brand.headerText,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: ui.hairline ? `0.5px solid ${theme.line}` : undefined,
      }}
    >
      <span style={{ display: 'flex', width: 22, flexShrink: 0, opacity: 0.9 }} aria-hidden>
        <BackChevron color={brand.headerText} />
      </span>
      {ui.brandInHeader && <AppLogo institution={s.institution} alt={s.institution.name} size={m.short ? 24 : 28} />}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '0.92em',
            letterSpacing: -0.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {s.institution.name}
        </div>
        {withBalance && s.visual.showBalance && (
          <div style={{ color: theme.muted, fontSize: '0.72em', fontWeight: 500 }}>
            {t(loc, 'available')} {formatFiat(bal, 'EUR', s.bcp47)}
          </div>
        )}
      </div>
      {status}
    </div>
  )
}

function skinOf(s: Scenario) {
  const theme = screenTheme(s)
  const brand = brandProfile(s.institution)
  const ui = brand.ui
  const m = screenMetrics(s.device.width, s.device.height, s.visual.spacingScale, ui)
  const details: MockupSkin['details'] = m.short && ui.details === 'full' ? 'lite' : ui.details
  return { theme, brand, ui, m, details, loc: s.locale }
}

function showActivity(s: Scenario, short: boolean, ui: MockupSkin) {
  return Boolean(s.recentActivity?.length) && ui.density !== 'air' && ui.chrome !== 'bare' && !short
}

function heroGap(ui: MockupSkin) {
  return ui.density === 'air' ? 10 : ui.density === 'tight' ? 0 : 4
}

function AmountBlock({ s, primaryCrypto }: { s: Scenario; primaryCrypto?: boolean }) {
  const { theme, brand, ui, m, loc } = skinOf(s)
  const c = s.conversion
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
  const px = Math.round(
    Math.min(s.device.width * 0.112 * (m.amountEm / 1.7), s.device.height * 0.078),
  )
  return (
    <div style={{ textAlign: ui.amountAlign, paddingBlock: ui.density === 'air' ? 8 : 4 }}>
      <div style={{ color: theme.muted, fontSize: '0.78em', fontWeight: 500 }}>{t(loc, titleKey(s.status))}</div>
      <div
        style={{
          fontSize: px,
          fontWeight: ui.weight,
          letterSpacing: ui.tracking,
          lineHeight: 1.05,
          marginTop: 4,
          color: brand.amount,
          fontVariantNumeric: 'tabular-nums',
          overflowWrap: 'anywhere',
        }}
      >
        {primary}
      </div>
      {secondary && (
        <div style={{ color: theme.muted, marginTop: 4, fontSize: '0.84em' }}>
          {t(loc, 'converted')} · {secondary}
        </div>
      )}
    </div>
  )
}

function DetailSheet({ s, children }: { s: Scenario; children: ReactNode }) {
  const theme = screenTheme(s)
  const ui = brandSkin(s.institution)
  return <div style={sheetStyle(theme, ui)}>{children}</div>
}

function PersonMark({ s, letters, size = 52 }: { s: Scenario; letters: string; size?: number }) {
  const theme = screenTheme(s)
  const ui = brandSkin(s.institution)
  if (ui.avatar === 'none') return null
  const tint = statusTint(s.status, theme)
  if (s.visual.iconStyle === 'illustration') {
    return s.status === 'failed' || s.status === 'cancelled' ? <WarnGlyph color={tint} /> : <CheckGlyph color={tint} />
  }
  return <Monogram letters={letters} theme={theme} size={size} circle={ui.avatar === 'circle'} />
}

function HeroLayout({ s }: { s: Scenario }) {
  const { theme, ui, m, details, loc } = skinOf(s)
  const tint = statusTint(s.status, theme)
  const person = s.status === 'received' ? s.sender : s.recipient
  const rows: Array<[string, string, boolean?]> = []
  if (details !== 'min') rows.push([t(loc, 'from'), s.sender.full])
  rows.push([t(loc, 'to'), s.recipient.full])
  rows.push([t(loc, 'date'), formatDateTime(s.timestamp, s.bcp47)])
  rows.push([t(loc, 'reference'), s.transactionId, true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'note'), s.note])
  if (details !== 'min' && s.feeEur > 0) rows.push([t(loc, 'fee'), formatFiat(s.feeEur, 'EUR', s.bcp47)])
  return (
    <>
      <Header s={s} withBalance={ui.chrome === 'toolbar'} />
      {ui.hero !== 'amount' && (
        <div style={{ display: 'flex', justifyContent: ui.amountAlign === 'start' ? 'flex-start' : 'center', marginTop: heroGap(ui) }}>
          <PersonMark s={s} letters={person.initials} />
        </div>
      )}
      {ui.hero !== 'amount' && (
        <div style={{ textAlign: ui.amountAlign, fontWeight: 700 }}>{person.full}</div>
      )}
      <AmountBlock s={s} />
      <DetailSheet s={s}>
        {rows.map(([label, value, mono]) => (
          <Row key={label} label={label} value={value} theme={theme} mono={mono} mode={ui.rows} />
        ))}
      </DetailSheet>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      {showActivity(s, m.short, ui) && <RecentActivity s={s} theme={theme} />}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'share')} compact={m.short} />
    </>
  )
}

function CryptoLayout({ s }: { s: Scenario }) {
  const { theme, ui, m, details, loc } = skinOf(s)
  const tint = statusTint(s.status, theme)
  const conf = s.status === 'confirmed' || s.status === 'completed' ? '12/12' : s.status === 'pending' ? '2/12' : '0/12'
  const rows: Array<[string, string, boolean?]> = []
  if (details !== 'min') rows.push([t(loc, 'from'), s.walletFrom ?? s.sender.full, true])
  rows.push([t(loc, 'to'), s.walletTo ?? s.recipient.full, true])
  if (details !== 'min') rows.push([t(loc, 'networkFee'), formatFiat(s.feeEur, 'EUR', s.bcp47)])
  if (details === 'full' && s.conversion.show_rate) rows.push([t(loc, 'rate'), s.conversion.display_rate])
  if (details === 'full' && !m.short) rows.push([t(loc, 'confirmations'), conf])
  rows.push([t(loc, 'reference'), s.transactionId, true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'note'), s.note])
  return (
    <>
      <Header s={s} />
      {ui.hero !== 'amount' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: heroGap(ui) }}>
          <CoinGlyph kind={s.category} />
          <div>
            <Chip theme={theme}>{s.networkName}</Chip>
            <div style={{ fontWeight: 800, marginTop: 6 }}>{t(loc, titleKey(s.status))}</div>
          </div>
        </div>
      )}
      <AmountBlock s={s} primaryCrypto />
      <DetailSheet s={s}>
        {rows.map(([label, value, mono]) => (
          <Row key={label} label={label} value={value} theme={theme} mono={mono} mode={ui.rows} />
        ))}
      </DetailSheet>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      {showActivity(s, m.short, ui) && <RecentActivity s={s} theme={theme} />}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} compact={m.short} />
    </>
  )
}

function BankLayout({ s }: { s: Scenario }) {
  const { theme, ui, m, details, loc } = skinOf(s)
  const tint = statusTint(s.status, theme)
  const person = s.status === 'received' ? s.sender : s.recipient
  const rows: Array<[string, string, boolean?]> = []
  if (details !== 'min') rows.push([t(loc, 'sender'), s.sender.full])
  if (details === 'full') rows.push([t(loc, 'iban'), s.ibanFrom ?? '—', true])
  rows.push([t(loc, 'recipient'), s.recipient.full])
  if (details !== 'min') rows.push([t(loc, 'iban'), s.ibanTo ?? '—', true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'bank'), s.institution.name])
  rows.push([t(loc, 'date'), formatDateTime(s.timestamp, s.bcp47)])
  if (details === 'full') {
    rows.push([t(loc, 'fee'), formatFiat(s.feeEur, 'EUR', s.bcp47)])
    rows.push([t(loc, 'total'), formatFiat(s.totalEur, 'EUR', s.bcp47)])
  } else if (details === 'lite' && s.feeEur > 0) {
    rows.push([t(loc, 'fee'), formatFiat(s.feeEur, 'EUR', s.bcp47)])
  }
  if (details === 'full' && s.conversion.show_rate && !m.short) {
    rows.push([t(loc, 'rate'), s.conversion.display_rate])
  }
  if (details === 'full' && s.status !== 'completed' && s.status !== 'sent' && s.status !== 'received') {
    rows.push([t(loc, 'eta'), s.etaLabel])
  }
  rows.push([t(loc, 'reference'), s.transactionId, true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'note'), s.note])
  return (
    <>
      <Header s={s} withBalance={ui.chrome === 'toolbar'} />
      {ui.hero === 'person' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: ui.amountAlign === 'start' ? 'flex-start' : 'center', gap: 6 }}>
          <PersonMark s={s} letters={person.initials} size={48} />
          <div style={{ fontWeight: 700 }}>{person.full}</div>
        </div>
      )}
      {ui.hero === 'ledger' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800 }}>{t(loc, 'transferDetails')}</span>
          <Chip theme={theme} color={tint}>
            {t(loc, methodKey(s.category))}
          </Chip>
        </div>
      )}
      <AmountBlock s={s} />
      <DetailSheet s={s}>
        {rows.map(([label, value, mono], i) => (
          <Row key={`${label}-${i}`} label={label} value={value} theme={theme} mono={mono} mode={ui.rows} />
        ))}
      </DetailSheet>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      {showActivity(s, m.short, ui) && <RecentActivity s={s} theme={theme} />}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} compact={m.short} />
    </>
  )
}

function RemitLayout({ s }: { s: Scenario }) {
  const { theme, ui, m, details, loc } = skinOf(s)
  const tint = statusTint(s.status, theme)
  const rows: Array<[string, string, boolean?]> = []
  if (details !== 'min') rows.push([t(loc, 'youSent'), formatFiat(s.amountEur, 'EUR', s.bcp47)])
  rows.push([t(loc, 'youReceived'), formatQuote(s.conversion.converted_amount, s.conversion.quote_currency, s.bcp47)])
  if (details === 'full') rows.push([t(loc, 'fee'), formatFiat(s.feeEur, 'EUR', s.bcp47)])
  if (details !== 'min' && s.conversion.show_rate) rows.push([t(loc, 'rate'), s.conversion.display_rate])
  if (details === 'full' && !m.short) {
    rows.push([t(loc, 'pickupCode'), s.pickupCode ?? s.transactionId, true])
    rows.push([t(loc, 'pickupLocation'), s.pickupPoint ?? s.institution.short])
    rows.push([t(loc, 'eta'), s.etaLabel])
  }
  rows.push([t(loc, 'reference'), s.transactionId, true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'note'), s.note])
  return (
    <>
      <Header s={s} />
      {ui.hero !== 'amount' && (
        <>
          <div style={{ textAlign: ui.amountAlign, fontWeight: 800 }}>{t(loc, titleKey(s.status))}</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 4 }}>
            <PersonMark s={s} letters={s.sender.initials} size={44} />
            <div style={{ color: theme.muted, fontWeight: 700 }}>→</div>
            <PersonMark s={s} letters={s.recipient.initials} size={44} />
          </div>
        </>
      )}
      <AmountBlock s={s} />
      <DetailSheet s={s}>
        {rows.map(([label, value, mono]) => (
          <Row key={label} label={label} value={value} theme={theme} mono={mono} mode={ui.rows} />
        ))}
      </DetailSheet>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'share')} compact={m.short} />
    </>
  )
}

function TopupLayout({ s }: { s: Scenario }) {
  const { theme, ui, m, details, loc } = skinOf(s)
  const tint = statusTint(s.status, theme)
  const rows: Array<[string, string, boolean?]> = []
  if (details !== 'min') rows.push([t(loc, 'operator'), s.operator ?? '—'])
  rows.push([t(loc, 'phone'), s.phone ?? '—', true])
  if (details === 'full') {
    rows.push([t(loc, 'amount'), formatFiat(s.amountEur, 'EUR', s.bcp47)])
    rows.push([t(loc, 'fee'), formatFiat(s.feeEur, 'EUR', s.bcp47)])
  }
  if (details !== 'min') rows.push([t(loc, 'total'), formatFiat(s.totalEur, 'EUR', s.bcp47)])
  rows.push([t(loc, 'date'), formatDateTime(s.timestamp, s.bcp47)])
  rows.push([t(loc, 'reference'), s.transactionId, true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'note'), s.note])
  return (
    <>
      <Header s={s} withBalance={ui.chrome === 'toolbar'} />
      <div style={{ textAlign: ui.amountAlign, marginTop: heroGap(ui) }}>
        <div style={{ display: 'flex', justifyContent: ui.amountAlign === 'start' ? 'flex-start' : 'center', alignItems: 'center', gap: 8 }}>
          {s.operator && carrierLogo(s.operator) && (
            <img
              src={carrierLogo(s.operator)}
              alt={s.operator}
              width={36}
              height={36}
              style={{ objectFit: 'contain', borderRadius: ui.avatar === 'circle' ? 18 : 10, background: '#fff', padding: 4 }}
              draggable={false}
            />
          )}
          <Chip theme={theme}>{s.operator}</Chip>
        </div>
        <div style={{ fontSize: '1.15em', fontWeight: 800, marginTop: 10 }}>{s.phone}</div>
      </div>
      <AmountBlock s={s} />
      <DetailSheet s={s}>
        {rows.map(([label, value, mono]) => (
          <Row key={label} label={label} value={value} theme={theme} mono={mono} mode={ui.rows} />
        ))}
      </DetailSheet>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} compact={m.short} />
    </>
  )
}

function CashLayout({ s }: { s: Scenario }) {
  const { theme, ui, m, details, loc } = skinOf(s)
  const tint = statusTint(s.status, theme)
  const rows: Array<[string, string, boolean?]> = [[t(loc, 'sender'), s.sender.full]]
  if (details !== 'min') rows.push([t(loc, 'recipient'), s.recipient.full])
  if (details !== 'min') rows.push([t(loc, 'pickupLocation'), s.pickupPoint ?? '—'])
  if (details === 'full') rows.push([t(loc, 'eta'), s.etaLabel])
  rows.push([t(loc, 'reference'), s.transactionId, true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'note'), s.note])
  return (
    <>
      <Header s={s} />
      <div style={{ textAlign: 'center', fontWeight: 800 }}>{t(loc, titleKey(s.status))}</div>
      <div
        style={{
          ...sheetStyle(theme, ui, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginTop: heroGap(ui),
          }),
        }}
      >
        <div style={{ fontSize: '0.78em', color: theme.muted }}>{t(loc, 'pickupCode')}</div>
        <div style={{ fontWeight: 800, fontSize: '1.25em', letterSpacing: 1.2 }}>{s.pickupCode}</div>
        <SynthQr seed={s.transactionId} color={theme.text} bg={theme.surface} size={m.short ? 64 : 110} />
        <AmountBlock s={s} />
      </div>
      <DetailSheet s={s}>
        {rows.map(([label, value, mono]) => (
          <Row key={label} label={label} value={value} theme={theme} mono={mono} mode={ui.rows} />
        ))}
      </DetailSheet>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'share')} compact={m.short} />
    </>
  )
}

function CardsLayout({ s }: { s: Scenario }) {
  const { theme, ui, m, details, loc } = skinOf(s)
  const tint = statusTint(s.status, theme)
  const rows: Array<[string, string, boolean?]> = []
  if (details === 'full') rows.push([t(loc, 'method'), t(loc, 'methodCard')])
  if (details === 'full') rows.push([t(loc, 'fee'), formatFiat(s.feeEur, 'EUR', s.bcp47)])
  if (details !== 'min') rows.push([t(loc, 'total'), formatFiat(s.totalEur, 'EUR', s.bcp47)])
  rows.push([t(loc, 'date'), formatDateTime(s.timestamp, s.bcp47)])
  rows.push([t(loc, 'reference'), s.transactionId, true])
  if (details === 'full' && !m.short) rows.push([t(loc, 'note'), s.note])
  return (
    <>
      <Header s={s} withBalance={ui.chrome === 'toolbar'} />
      <div style={{ display: 'grid', gap: m.short ? 6 : 10, marginTop: heroGap(ui) }}>
        <CardFace mask={s.cardFrom ?? '•••• 0000'} name={s.sender.full} theme={theme} tone="from" brand={s.institution.icon ?? s.institution.logo} />
        <div style={{ textAlign: 'center', color: theme.muted, fontWeight: 700, fontSize: '0.85em' }}>↓</div>
        <CardFace mask={s.cardTo ?? '•••• 0000'} name={s.recipient.full} theme={theme} tone="to" brand={s.institution.icon ?? s.institution.logo} />
      </div>
      <AmountBlock s={s} />
      <DetailSheet s={s}>
        {rows.map(([label, value, mono]) => (
          <Row key={label} label={label} value={value} theme={theme} mono={mono} mode={ui.rows} />
        ))}
      </DetailSheet>
      {s.statusReason && <p style={{ color: tint, fontSize: '0.85em', margin: 0 }}>{s.statusReason}</p>}
      {showActivity(s, m.short, ui) && <RecentActivity s={s} theme={theme} />}
      <Actions s={s} theme={theme} done={t(loc, 'done')} share={t(loc, 'saveReceipt')} compact={m.short} />
    </>
  )
}
