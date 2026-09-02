import { useState } from 'react'
import { ChatPayStudio } from './ui/chat/ChatPayStudio.tsx'
import { ChatStudio } from './ui/chat/ChatStudio.tsx'
import { Studio } from './ui/Studio.tsx'
import type { StudioMode } from './ui/ModeNav.tsx'

function initialMode(): StudioMode {
  const q = new URLSearchParams(window.location.search).get('mode')
  if (q === 'telegram') return 'telegram'
  if (q === 'chatpay') return 'chatpay'
  return 'payments'
}

export default function App() {
  const [mode, setMode] = useState<StudioMode>(initialMode)

  const onMode = (next: StudioMode) => {
    setMode(next)
    const u = new URL(window.location.href)
    if (next === 'payments') u.searchParams.delete('mode')
    else u.searchParams.set('mode', next)
    window.history.replaceState({}, '', u)
  }

  if (mode === 'telegram') return <ChatStudio onMode={onMode} />
  if (mode === 'chatpay') return <ChatPayStudio onMode={onMode} />
  return <Studio onMode={onMode} />
}
