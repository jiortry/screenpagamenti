import { useState } from 'react'
import { ChatStudio } from './ui/chat/ChatStudio.tsx'
import { Studio } from './ui/Studio.tsx'
import type { StudioMode } from './ui/ModeNav.tsx'

function initialMode(): StudioMode {
  return new URLSearchParams(window.location.search).get('mode') === 'telegram' ? 'telegram' : 'payments'
}

export default function App() {
  const [mode, setMode] = useState<StudioMode>(initialMode)

  const onMode = (next: StudioMode) => {
    setMode(next)
    const u = new URL(window.location.href)
    if (next === 'telegram') u.searchParams.set('mode', 'telegram')
    else u.searchParams.delete('mode')
    window.history.replaceState({}, '', u)
  }

  if (mode === 'telegram') return <ChatStudio onMode={onMode} />
  return <Studio onMode={onMode} />
}
