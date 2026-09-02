export type StudioMode = 'payments' | 'telegram' | 'chatpay'

export function ModeNav({
  current,
  onMode,
}: {
  current: StudioMode
  onMode: (m: StudioMode) => void
}) {
  return (
    <nav className="mode-nav">
      <button type="button" className={current === 'payments' ? 'on' : ''} onClick={() => onMode('payments')}>
        Pagamenti
      </button>
      <button type="button" className={current === 'telegram' ? 'on' : ''} onClick={() => onMode('telegram')}>
        Chat Telegram
      </button>
      <button type="button" className={current === 'chatpay' ? 'on' : ''} onClick={() => onMode('chatpay')}>
        Chat + Pagamenti
      </button>
    </nav>
  )
}

