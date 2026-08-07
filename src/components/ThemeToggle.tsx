'use client'

import { useEffect, useState } from 'react'

// Day / night switch. Night is the native palette; day inverts the canvas at
// the root (see globals.css). The choice persists per device.
const KEY = 'lecture-theme'

export default function ThemeToggle() {
  const [day, setDay] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY) === 'day'
    setDay(saved)
    document.documentElement.classList.toggle('day', saved)
  }, [])

  function toggle() {
    const next = !day
    setDay(next)
    document.documentElement.classList.toggle('day', next)
    try { window.localStorage.setItem(KEY, next ? 'day' : 'night') } catch { /* ignore */ }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={day ? 'Switch to night theme' : 'Switch to day theme'}
      aria-label={day ? 'Switch to night theme' : 'Switch to day theme'}
      className="chip cursor-pointer !py-1.5 text-slate-300 transition-colors hover:border-white/30 hover:text-white"
    >
      {day ? (
        /* moon — click to go back to night */
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        /* sun — click to switch to day */
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      )}
      {day ? 'Night' : 'Day'}
    </button>
  )
}
