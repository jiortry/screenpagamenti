export function TgBack({ color, android }: { color: string; android?: boolean }) {
  if (android) {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <path d="M14.2 4.2 6.4 11l7.8 6.8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden>
      <path d="M10.4 1.6 2 10l8.4 8.4" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TgCall({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M4.2 2.8c.5-.5 1.3-.5 1.8 0l1.6 1.6c.4.4.5 1.1.2 1.6L7 8.2c1.4 2.2 3.2 3.9 5.4 5.2l2.1-.8c.5-.3 1.2-.2 1.6.2l1.6 1.6c.5.5.5 1.3 0 1.8l-1.1 1.1c-.6.6-1.5.9-2.4.7C9.4 17.2 2.8 10.6 2 5.8c-.2-.9.1-1.8.7-2.4L4.2 2.8Z"
        fill={color}
      />
    </svg>
  )
}

export function TgVideo({ color }: { color: string }) {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden>
      <rect x="0.7" y="1.4" width="14.2" height="13.2" rx="3.2" fill="none" stroke={color} strokeWidth="1.7" />
      <path d="M16.2 6.1 21 3.4v9.2l-4.8-2.7V6.1Z" fill={color} />
    </svg>
  )
}

export function TgMore({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <circle cx="9" cy="4" r="1.45" fill={color} />
      <circle cx="9" cy="9" r="1.45" fill={color} />
      <circle cx="9" cy="14" r="1.45" fill={color} />
    </svg>
  )
}

export function TgMute({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path d="M2 4.6h1.8L6.4 2.4v7.2L3.8 7.4H2V4.6Z" fill={color} />
      <path d="M8.1 4.2 10.6 7.8M10.6 4.2 8.1 7.8" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function TgPlus({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r="11.2" fill="none" stroke={color} strokeWidth="1.7" />
      <path d="M14 8.6v10.8M8.6 14h10.8" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function TgAttach({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <path
        d="M18.4 10.2 10.6 18a4.4 4.4 0 0 1-6.2-6.2l8.6-8.6a3.1 3.1 0 0 1 4.4 4.4l-8.3 8.3a1.8 1.8 0 0 1-2.5-2.5l7.2-7.2"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TgSmile({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <circle cx="11" cy="11" r="8.2" fill="none" stroke={color} strokeWidth="1.7" />
      <circle cx="8.2" cy="9.2" r="1.05" fill={color} />
      <circle cx="13.8" cy="9.2" r="1.05" fill={color} />
      <path d="M7.6 13.2c.9 1.5 2.1 2.2 3.4 2.2s2.5-.7 3.4-2.2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function TgMic({ color }: { color: string }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden>
      <rect x="5.4" y="1.4" width="7.2" height="11.2" rx="3.6" fill="none" stroke={color} strokeWidth="1.7" />
      <path d="M3 10.6a6 6 0 0 0 12 0M9 16.6v3.4" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function TgPlane({ color }: { color: string }) {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" aria-hidden>
      <path d="M1.4 18.6 20.6 10 1.4 1.4 1.4 8.2 14.2 10 1.4 11.8Z" fill={color} />
    </svg>
  )
}

export function TgPlay({ color }: { color: string }) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden>
      <path d="M2 1.4 12.4 8 2 14.6Z" fill={color} />
    </svg>
  )
}

export function TgPause({ color }: { color: string }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden>
      <rect x="1" y="1" width="3.2" height="12" rx="1" fill={color} />
      <rect x="7.6" y="1" width="3.2" height="12" rx="1" fill={color} />
    </svg>
  )
}

export function TgChecks({
  status,
  color,
  read,
}: {
  status: 'sent' | 'delivered' | 'read'
  color: string
  read: string
}) {
  const c = status === 'read' ? read : color
  if (status === 'sent') {
    return (
      <svg width="12" height="10" viewBox="0 0 12 10" aria-hidden>
        <path d="M1.2 5.2 4.1 8.2 10.8 1.4" fill="none" stroke={c} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
      <path d="M1 5.2 3.8 8.1 10.2 1.4" fill="none" stroke={c} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 8.1 13.8 1.4" fill="none" stroke={c} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TgVerified({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="7" fill={color} />
      <path d="M3.8 7.1 6 9.3 10.3 4.7" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
