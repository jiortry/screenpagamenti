import type { CSSProperties, ReactNode } from 'react'
import { splitCensored } from '../../chat/censor.ts'
import { chatUi } from '../../chat/copy.ts'
import { resolveWall, skinById } from '../../chat/skins.ts'
import type { ChatMessage, ChatPeer, ChatScenario, TgSkin, TgSkinId, TgWallId } from '../../chat/types.ts'
import { chromeFontStack } from '../../engine/fonts.ts'
import { NavChrome, StatusChrome } from '../chrome.tsx'
import {
  TgAttach,
  TgBack,
  TgCall,
  TgChecks,
  TgMic,
  TgMore,
  TgMute,
  TgPause,
  TgPlane,
  TgPlay,
  TgPlus,
  TgSmile,
  TgVerified,
  TgVideo,
} from './icons.tsx'
import { ChatWallpaper } from './wallpaper.tsx'
import { RedactedName } from './BrushRedact.tsx'

function Avatar({
  peer,
  size,
  online,
  hideInitials,
}: {
  peer: ChatPeer
  size: number
  online?: boolean
  hideInitials?: boolean
}) {
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    objectFit: 'cover',
    background: peer.color,
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontWeight: 600,
    fontSize: size * 0.38,
    position: 'relative',
    overflow: 'hidden',
  }
  return (
    <span style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {peer.avatar ? (
        <img src={peer.avatar} alt="" width={size} height={size} style={{ ...style, display: 'block' }} />
      ) : (
        <span style={style}>{hideInitials ? '' : peer.initials}</span>
      )}
      {online && (
        <span
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: Math.max(8, size * 0.28),
            height: Math.max(8, size * 0.28),
            borderRadius: '50%',
            background: '#4DCD5E',
            boxShadow: '0 0 0 2px #fff',
          }}
        />
      )}
    </span>
  )
}

function Tail({ side, color }: { side: 'in' | 'out'; color: string }) {
  const out = side === 'out'
  return (
    <svg
      width="14"
      height="17"
      viewBox="0 0 14 17"
      aria-hidden
      style={{
        position: 'absolute',
        bottom: 0,
        [out ? 'right' : 'left']: -6,
        display: 'block',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {out ? (
        <path
          fill={color}
          d="M0 0H8V17H0ZM13 17H7V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.562 4.233 4.95 5.74z"
        />
      ) : (
        <path
          fill={color}
          d="M6 0H14V17H6ZM1 17H7V0C6.807 2.84 6.124 5.767 4.95 8.782 4.046 11.107 2.388 13.015 0 17Z"
        />
      )}
    </svg>
  )
}

function peerOf(s: ChatScenario, m: ChatMessage): ChatPeer {
  return s.members.find((p) => p.id === m.peerId) ?? s.peer
}

function Meta({
  m,
  skin,
  mine,
  editedLabel,
  mode = 'abs',
}: {
  m: ChatMessage
  skin: TgSkin
  mine: boolean
  editedLabel: string
  mode?: 'abs' | 'inline'
}) {
  const color = mine ? skin.outTime : skin.inTime
  const inline = mode === 'inline'
  return (
    <span
      style={{
        position: inline ? 'relative' : 'absolute',
        right: inline ? undefined : 7,
        bottom: inline ? undefined : 5,
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf: inline ? 'flex-end' : undefined,
        flexShrink: 0,
        gap: 3,
        marginLeft: inline ? 2 : 0,
        paddingBottom: inline ? 1 : 0,
        fontSize: 11,
        lineHeight: 1,
        height: 13,
        color,
        fontWeight: 400,
        letterSpacing: 0.1,
        whiteSpace: 'nowrap',
      }}
    >
      {m.edited && (
        <span style={{ fontSize: 10, opacity: 0.85 }}>{editedLabel}</span>
      )}
      {m.time}
      {mine && m.status && <TgChecks status={m.status} color={skin.check} read={skin.checkRead} />}
    </span>
  )
}

function BubbleShell({
  mine,
  skin,
  tail,
  children,
  photo,
  maxW,
}: {
  mine: boolean
  skin: TgSkin
  tail: boolean
  children: ReactNode
  photo?: boolean
  maxW: number
}) {
  const bg = mine ? skin.outBg : skin.inBg
  const radius = photo ? 14 : 16
  const br: CSSProperties['borderRadius'] = mine
    ? `${radius}px ${radius}px ${tail ? 0 : radius}px ${radius}px`
    : `${radius}px ${radius}px ${radius}px ${tail ? 0 : radius}px`
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 'fit-content',
        maxWidth: photo ? '100%' : maxW,
        filter: photo ? undefined : 'drop-shadow(0 1px 1px rgba(0,0,0,0.16))',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: 'fit-content',
          maxWidth: photo ? '100%' : maxW,
          background: photo ? 'transparent' : bg,
          color: mine ? skin.outFg : skin.inFg,
          borderRadius: br,
          padding: photo ? 0 : '5px 8px 4px 10px',
          overflow: 'visible',
        }}
      >
        {children}
        {tail && !photo && (
          <>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 0,
                [mine ? 'right' : 'left']: 0,
                width: 6,
                height: 16,
                background: bg,
                pointerEvents: 'none',
              }}
            />
            <Tail side={mine ? 'out' : 'in'} color={bg} />
          </>
        )}
      </div>
    </div>
  )
}

function iHash(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) h ^= id.charCodeAt(i) * (i + 1)
  return h >>> 0
}

function peerNames(s: ChatScenario): string[] {
  const names = [s.peer.name, ...s.members.map((p) => p.name)]
  const parts = names.flatMap((n) => n.split(/\s+/))
  return [...new Set([...names, ...parts])].filter((n) => n.length > 1)
}

function CensoredLine({
  text,
  seed,
  fontSize,
  names,
}: {
  text: string
  seed: number
  fontSize: number
  names: string[]
}) {
  return (
    <>
      {splitCensored(text, names).map((piece, i) =>
        piece.kind === 'hide' ? (
          <RedactedName key={i} name={piece.value} seed={seed + i * 17} fontSize={fontSize} />
        ) : (
          <span key={i}>{piece.value}</span>
        ),
      )}
    </>
  )
}

function TextBody({
  m,
  skin,
  mine,
  ui,
  names,
  seed,
}: {
  m: ChatMessage
  skin: TgSkin
  mine: boolean
  ui: ReturnType<typeof chatUi>
  names: string[]
  seed: number
}) {
  const fontSize = skin.platform === 'ios' ? 17 : 16
  return (
    <>
      {m.forwardedFrom && (
        <div style={{ flexBasis: '100%', width: '100%', fontSize: 13, fontWeight: 600, color: mine ? skin.replyBar : skin.accent, marginBottom: 3 }}>
          {ui.forwarded}{' '}
          <CensoredLine text={m.forwardedFrom} seed={seed ^ 0x21} fontSize={13} names={names} />
        </div>
      )}
      {m.reply && (
        <div
          style={{
            flexBasis: '100%',
            width: '100%',
            display: 'flex',
            gap: 6,
            margin: '0 0 6px',
            padding: '4px 8px 4px 0',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <span style={{ width: 2.5, borderRadius: 2, background: m.reply.color, flexShrink: 0 }} />
          <span style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 650, color: m.reply.color, lineHeight: 1.15 }}>
              {names.length ? <RedactedName name={m.reply.author} seed={seed ^ 0x55} fontSize={13} /> : m.reply.author}
            </div>
            <div style={{ fontSize: 13, opacity: 0.78, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
              <CensoredLine text={m.reply.text} seed={seed + 3} fontSize={13} names={names} />
            </div>
          </span>
        </div>
      )}
      <span
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'flex-end',
          gap: 7,
          maxWidth: '100%',
        }}
      >
        <span
          style={{
            fontSize,
            lineHeight: 1.312,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'normal',
            wordBreak: 'normal',
            color: mine ? skin.outFg : skin.inFg,
          }}
        >
          <CensoredLine text={m.text ?? ''} seed={seed} fontSize={fontSize} names={names} />
        </span>
        <Meta m={m} skin={skin} mine={mine} editedLabel={ui.edited} mode="inline" />
      </span>
      {m.link && (
        <div
          style={{
            marginTop: 6,
            borderLeft: `2.5px solid ${mine ? skin.replyBar : skin.accent}`,
            padding: '4px 8px',
            background: mine ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.04)',
            borderRadius: 4,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.7 }}>{m.link.site}</div>
          <div style={{ fontSize: 14, fontWeight: 650 }}>
            <CensoredLine text={m.link.title} seed={seed ^ 0x71} fontSize={14} names={names} />
          </div>
          <div style={{ fontSize: 13, opacity: 0.78 }}>
            <CensoredLine text={m.link.desc} seed={seed ^ 0x81} fontSize={13} names={names} />
          </div>
        </div>
      )}
    </>
  )
}

function VoiceBody({ m, skin, mine, editedLabel }: { m: ChatMessage; skin: TgSkin; mine: boolean; editedLabel: string }) {
  const played = m.voiceProgress ?? 0
  const bars = m.waveform ?? []
  const playing = played > 0 && played < 1
  const playColor = mine ? skin.voicePlay : skin.accent
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 196, padding: '2px 36px 10px 2px' }}>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: playColor,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {playing ? <TgPause color={mine && skin.id === 'ios-tinted' ? skin.outBg : '#fff'} /> : <TgPlay color={mine && skin.id === 'ios-tinted' ? skin.outBg : '#fff'} />}
      </span>
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.2, height: 26 }}>
        {bars.map((h, i) => {
          const on = i / bars.length <= played
          return (
            <span
              key={i}
              style={{
                width: 2.4,
                height: Math.max(4, h * 22),
                borderRadius: 2,
                background: on ? skin.voiceWavePlayed : skin.voiceWave,
                opacity: mine && skin.id === 'ios-tinted' && !on ? 0.45 : 1,
              }}
            />
          )
        })}
      </span>
      <span style={{ position: 'absolute', left: 52, bottom: 5, fontSize: 11, color: mine ? skin.outTime : skin.inTime }}>
        {m.voiceDuration}
      </span>
      <Meta m={m} skin={skin} mine={mine} editedLabel={editedLabel} />
    </div>
  )
}

function photoSize(deviceWidth: number, aspect: ChatMessage['photoAspect'] = 'land') {
  const w = Math.round(Math.min(deviceWidth * 0.88, deviceWidth - 12))
  if (aspect === 'screen') return { w, h: Math.round(w * 1.62) }
  if (aspect === 'port') return { w, h: Math.round(w * 1.32) }
  if (aspect === 'square') return { w, h: w }
  return { w, h: Math.round(w * 0.82) }
}

function PhotoBody({
  m,
  skin,
  mine,
  width,
}: {
  m: ChatMessage
  skin: TgSkin
  mine: boolean
  width: number
}) {
  const { w, h } = photoSize(width, m.photoAspect)
  const radius = 15
  return (
    <div style={{ position: 'relative', width: w, maxWidth: '100%' }}>
      <img
        src={m.photo}
        alt=""
        style={{
          display: 'block',
          width: w,
          height: h,
          maxWidth: '100%',
          objectFit: 'cover',
          objectPosition: m.photoAspect === 'screen' ? 'top center' : 'center',
          borderRadius: radius,
          boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        }}
      />
      {m.text && (
        <div style={{ padding: '8px 12px 18px', fontSize: 16, lineHeight: 1.28, color: mine ? skin.outFg : skin.inFg }}>
          {m.text}
        </div>
      )}
      <span
        style={{
          position: 'absolute',
          right: 7,
          bottom: m.text ? 5 : 8,
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          fontSize: 11,
          fontWeight: 500,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.45)',
          background: 'rgba(0,0,0,0.38)',
          borderRadius: 10,
          padding: '2px 6px 2px 7px',
          letterSpacing: 0.2,
        }}
      >
        {m.time}
        {mine && m.status && <TgChecks status={m.status} color="#fff" read="#fff" />}
      </span>
    </div>
  )
}

function Reactions({ items, mine }: { items: { emoji: string; count: number }[]; mine: boolean }) {
  return (
    <span
      style={{
        position: 'absolute',
        bottom: -12,
        // Incoming (white): sit on the right of the bubble. Outgoing (green): inner/left corner.
        ...(mine ? { left: 8, right: 'auto' } : { left: '100%', right: 'auto', marginLeft: -6 }),
        display: 'flex',
        gap: 4,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      {items.map((r) => (
        <span
          key={r.emoji}
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 11,
            padding: '1px 6px',
            fontSize: 13,
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
            lineHeight: 1.3,
          }}
        >
          {r.emoji}
          {r.count > 1 ? ` ${r.count}` : ''}
        </span>
      ))}
    </span>
  )
}

function MessageRow({
  s,
  m,
  skin,
  tail,
  showName,
  showAvatar,
}: {
  s: ChatScenario
  m: ChatMessage
  skin: TgSkin
  tail: boolean
  showName: boolean
  showAvatar: boolean
}) {
  if (m.kind === 'date' || m.kind === 'service') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 6px' }}>
        <span
          style={{
            background: skin.dateBg,
            color: m.kind === 'service' ? skin.serviceFg : skin.dateFg,
            fontSize: 13,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 12,
            letterSpacing: 0.1,
          }}
        >
          {m.text}
        </span>
      </div>
    )
  }
  if (m.kind === 'unread') {
    return (
      <div
        style={{
          margin: '8px -8px',
          background: skin.unreadBg,
          color: skin.unreadFg,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 600,
          padding: '7px 0',
        }}
      >
        {m.text}
      </div>
    )
  }

  const mine = m.from === 'me'
  const peer = peerOf(s, m)
  const ui = chatUi(s.locale)

  if (m.kind === 'sticker') {
    return (
      <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', padding: '2px 4px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: 84, lineHeight: 1 }}>{m.sticker}</span>
          <span style={{ position: 'absolute', right: 0, bottom: -2, fontSize: 11, color: skin.dateFg, background: skin.dateBg, borderRadius: 8, padding: '1px 6px' }}>
            {m.time}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: mine ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: 6,
        paddingInline: m.kind === 'photo' ? 5 : 4,
        position: 'relative',
        marginBottom: m.reactions?.length ? 10 : 0,
      }}
    >
      {!mine && s.kind === 'group' && (
        <span style={{ width: 32, alignSelf: 'flex-end' }}>
          {showAvatar ? <Avatar peer={peer} size={32} hideInitials={s.redactNames} /> : null}
        </span>
      )}
      <div
        style={{
          maxWidth: m.kind === 'photo' ? '96%' : '82%',
          width: 'fit-content',
          marginLeft: mine ? 'auto' : 0,
        }}
      >
        {showName && !mine && s.kind === 'group' && (
          <div style={{ fontSize: 13, fontWeight: 650, color: peer.color, padding: '0 10px 2px' }}>
            {s.redactNames ? <RedactedName name={peer.name} seed={s.seed ^ 0x91} fontSize={13} /> : peer.name}
          </div>
        )}
        <BubbleShell
          mine={mine}
          skin={skin}
          tail={tail}
          photo={m.kind === 'photo'}
          maxW={Math.round((s.device.width - (s.kind === 'group' && !mine ? 42 : 8)) * 0.78)}
        >
          {m.kind === 'voice' && <VoiceBody m={m} skin={skin} mine={mine} editedLabel={ui.edited} />}
          {m.kind === 'photo' && (
            <PhotoBody
              m={m}
              skin={skin}
              mine={mine}
              width={s.device.width - (s.kind === 'group' && !mine ? 42 : 8)}
            />
          )}
          {m.kind === 'text' && (
            <TextBody
              m={m}
              skin={skin}
              mine={mine}
              ui={ui}
              names={s.redactNames ? peerNames(s) : []}
              seed={s.seed + iHash(m.id)}
            />
          )}
          {m.reactions && <Reactions items={m.reactions} mine={mine} />}
        </BubbleShell>
      </div>
    </div>
  )
}

function Header({ s, skin }: { s: ChatScenario; skin: TgSkin }) {
  const ios = skin.platform === 'ios'
  const ui = chatUi(s.locale)
  const sub = s.typing ? ui.typing : s.peer.lastSeen
  const subColor = s.typing || s.peer.online ? skin.accent : skin.headerSub
  return (
    <div
      style={{
        height: ios ? 48 : 56,
        display: 'flex',
        alignItems: 'center',
        gap: ios ? 8 : 10,
        paddingInline: ios ? 6 : 8,
        background: skin.headerBg,
        color: skin.headerFg,
        borderBottom: ios ? `0.5px solid ${skin.hairline}` : 'none',
        flexShrink: 0,
        overflow: 'visible',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: ios ? skin.accent : skin.headerFg, minWidth: 28 }}>
        <TgBack color={ios ? skin.accent : skin.headerFg} android={!ios} />
      </span>
      <Avatar peer={s.peer} size={ios ? 40 : 44} online={s.kind === 'dm' && s.peer.online} hideInitials={s.redactNames} />
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.15, overflow: 'visible', position: 'relative', zIndex: 2147483646 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 650, fontSize: ios ? 16 : 17 }}>
          {s.redactNames ? (
            <RedactedName name={s.peer.name} seed={s.seed} fontSize={ios ? 16 : 17} />
          ) : (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.peer.name}</span>
          )}
          {s.peer.verified && <TgVerified color={skin.accent} />}
          {s.muted && <TgMute color={skin.headerSub} />}
        </div>
        <div style={{ fontSize: ios ? 12 : 13, color: subColor, fontWeight: 400 }}>{sub}</div>
      </div>
      {ios ? (
        <span style={{ display: 'flex', gap: 14, paddingRight: 8, color: skin.accent }}>
          {s.kind === 'dm' && <TgCall color={skin.accent} />}
          <TgVideo color={skin.accent} />
        </span>
      ) : (
        <span style={{ display: 'flex', gap: 16, paddingRight: 6, color: skin.headerFg }}>
          {s.kind === 'dm' && <TgCall color={skin.headerFg} />}
          <TgMore color={skin.headerFg} />
        </span>
      )}
    </div>
  )
}

function Composer({ s, skin }: { s: ChatScenario; skin: TgSkin }) {
  const ios = skin.platform === 'ios'
  const ui = chatUi(s.locale)
  const hasDraft = Boolean(s.composerDraft)
  return (
    <div
      style={{
        background: skin.composerBg,
        borderTop: `0.5px solid ${skin.hairline}`,
        padding: ios ? '6px 8px 6px 6px' : '6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}
    >
      {ios ? <TgPlus color={skin.icon} /> : <TgAttach color={skin.icon} />}
      <div
        style={{
          flex: 1,
          minHeight: ios ? 36 : 40,
          borderRadius: ios ? 18 : 22,
          background: skin.composerInput,
          border: ios ? `0.5px solid ${skin.hairline}` : 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '0 6px 0 14px',
          gap: 6,
          color: hasDraft ? skin.composerFg : skin.composerPlaceholder,
          fontSize: ios ? 17 : 16,
        }}
      >
        <span style={{ flex: 1 }}>{hasDraft ? s.composerDraft : ui.message}</span>
        <TgSmile color={skin.icon} />
      </div>
      {hasDraft ? (
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: skin.sendBg,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <TgPlane color={skin.sendFg} />
        </span>
      ) : (
        <span style={{ width: 34, display: 'grid', placeItems: 'center' }}>
          <TgMic color={ios ? skin.icon : skin.accent} />
        </span>
      )}
    </div>
  )
}

export function TelegramScreen({
  s,
  skinId,
  wallId,
}: {
  s: ChatScenario
  skinId: TgSkinId
  wallId: TgWallId
}) {
  const skin = skinById(skinId)
  const wall = resolveWall(skin, s.wallpaper ?? wallId)
  const font = skin.platform === 'ios'
    ? '"Inter", -apple-system, "SF Pro Text", "Noto Sans", sans-serif'
    : '"Roboto", "Noto Sans", sans-serif'

  const rows: ReactNode[] = []
  for (let i = 0; i < s.messages.length; i++) {
    const m = s.messages[i]!
    const prev = s.messages[i - 1]
    const next = s.messages[i + 1]
    const samePrev = prev && prev.from === m.from && prev.peerId === m.peerId && prev.kind !== 'date' && prev.kind !== 'unread' && prev.kind !== 'service'
    const sameNext = next && next.from === m.from && next.peerId === m.peerId && next.kind !== 'date' && next.kind !== 'unread' && next.kind !== 'service'
    const tail = !sameNext && (m.kind === 'text' || m.kind === 'voice' || m.kind === 'photo')
    rows.push(
      <div key={m.id} style={{ marginTop: samePrev ? 2 : 8 }}>
        <MessageRow
          s={s}
          m={m}
          skin={skin}
          tail={Boolean(tail)}
          showName={!samePrev}
          showAvatar={!sameNext}
        />
      </div>,
    )
  }

  const root: CSSProperties = {
    width: s.device.width,
    height: s.device.height,
    overflow: 'hidden',
    borderRadius: s.device.corner,
    fontFamily: font,
    fontSize: 16 * s.fontScale,
    display: 'flex',
    flexDirection: 'column',
    background: skin.headerBg,
    boxSizing: 'border-box',
    color: skin.headerFg,
  }

  return (
    <div
      lang={s.bcp47}
      data-synthetic="true"
      data-device={s.device.id}
      data-skin={skin.id}
      style={root}
    >
      <div style={{ fontFamily: chromeFontStack(s.device.family), background: skin.headerBg }}>
        <StatusChrome s={s} color={skin.statusColor} />
      </div>
      <Header s={s} skin={skin} />
      <div style={{ flex: 1, position: 'relative', minHeight: 0, overflow: 'hidden' }}>
        <ChatWallpaper wall={wall} skin={skin} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '6px 11px 8px',
            overflow: 'visible',
          }}
        >
          {rows}
        </div>
      </div>
      <Composer s={s} skin={skin} />
      <div style={{ fontFamily: chromeFontStack(s.device.family), background: skin.composerBg }}>
        <NavChrome s={s} color={skin.navColor} bg={skin.composerBg} />
      </div>
    </div>
  )
}
