import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// Teacher-launched live sessions for the timed simulators. The whole market is
// deterministic in `elapsed` seconds, so the ONLY thing that must be shared is
// the session's start timestamp: every student screen then plays the identical
// tape off the wall clock, perfectly in sync. This route stores that one
// timestamp per simulator in Vercel KV (Upstash Redis REST API). It degrades
// gracefully to "no broadcast" when KV is not configured.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const configured = !!(KV_URL && KV_TOKEN)
const TTL_SECONDS = 3 * 60 * 60 // a launched session self-expires after 3h

async function kv(cmd: (string | number)[]): Promise<unknown> {
  const r = await fetch(KV_URL!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`kv ${r.status}`)
  return (await r.json() as { result: unknown }).result
}

const keyFor = (sim: string) => `live:${sim.replace(/[^a-z0-9-]/gi, '').slice(0, 40)}`

export async function GET(req: NextRequest) {
  const sim = req.nextUrl.searchParams.get('sim') ?? ''
  const serverNow = Date.now()
  if (!configured || !sim) return NextResponse.json({ startAt: null, serverNow, configured })
  try {
    const raw = await kv(['GET', keyFor(sim)])
    let startAt: number | null = null
    if (typeof raw === 'string') { const n = Number(JSON.parse(raw).startAt); if (Number.isFinite(n)) startAt = n }
    return NextResponse.json({ startAt, serverNow, configured: true })
  } catch {
    return NextResponse.json({ startAt: null, serverNow, configured: true })
  }
}

export async function POST(req: NextRequest) {
  const serverNow = Date.now()
  // Only someone who cleared the class password can launch/stop a session.
  if (!isAuthenticated(req.cookies.get('session')?.value)) {
    return NextResponse.json({ ok: false, serverNow }, { status: 401 })
  }
  if (!configured) return NextResponse.json({ ok: false, configured: false, serverNow })
  const body = await req.json().catch(() => ({} as Record<string, unknown>))
  const sim = String(body.sim ?? '').trim()
  if (!sim) return NextResponse.json({ ok: false, serverNow }, { status: 400 })
  try {
    if (body.startAt == null) {
      await kv(['DEL', keyFor(sim)])
    } else {
      const startAt = Number(body.startAt)
      if (!Number.isFinite(startAt)) return NextResponse.json({ ok: false, serverNow }, { status: 400 })
      await kv(['SET', keyFor(sim), JSON.stringify({ startAt }), 'EX', TTL_SECONDS])
    }
    return NextResponse.json({ ok: true, configured: true, serverNow })
  } catch {
    return NextResponse.json({ ok: false, serverNow }, { status: 500 })
  }
}
