export type StudioMode = 'payments' | 'telegram'

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
    </nav>
  )
}
