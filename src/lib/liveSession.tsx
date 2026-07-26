'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Client side of the teacher-launched live session. Polls the shared start
// timestamp and converts it into the CLIENT's own clock domain (correcting for
// device-clock skew via the server time), so every screen computes the same
// `elapsed`. Returns `clientStartAt` (when a broadcast is live) plus launch/stop
// for the instructor. When KV is not configured the poll simply reports no
// session and the simulator falls back to its local ▶ button.
export type LiveSession = {
  clientStartAt: number | null // launch time in THIS device's clock (skew-corrected), or null
  active: boolean
  configured: boolean
  launch: () => Promise<void>
  stop: () => Promise<void>
}

const POLL_MS = 2500

export function useLiveSession(sim: string): LiveSession {
  const [clientStartAt, setClientStartAt] = useState<number | null>(null)
  const [configured, setConfigured] = useState(false)
  const offsetRef = useRef(0) // serverNow − Date.now(), refreshed each poll

  useEffect(() => {
    let alive = true
    const poll = async () => {
      try {
        const r = await fetch(`/api/live-session?sim=${encodeURIComponent(sim)}`, { cache: 'no-store' })
        const j = await r.json() as { startAt: number | null; serverNow: number; configured: boolean }
        if (!alive) return
        offsetRef.current = (j.serverNow ?? Date.now()) - Date.now()
        setConfigured(!!j.configured)
        setClientStartAt(j.startAt == null ? null : j.startAt - offsetRef.current)
      } catch { /* no server / offline → behave as no broadcast */ }
    }
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => { alive = false; clearInterval(id) }
  }, [sim])

  const launch = useCallback(async () => {
    const serverStartAt = Date.now() + offsetRef.current
    setClientStartAt(Date.now()) // optimistic: this screen goes live immediately
    try {
      await fetch('/api/live-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sim, startAt: serverStartAt }),
      })
    } catch { /* ignore */ }
  }, [sim])

  const stop = useCallback(async () => {
    setClientStartAt(null)
    try {
      await fetch('/api/live-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sim, startAt: null }),
      })
    } catch { /* ignore */ }
  }, [sim])

  return { clientStartAt, active: clientStartAt != null, configured, launch, stop }
}
