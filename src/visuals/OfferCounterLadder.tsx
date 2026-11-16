'use client'

import { useState } from 'react'

// The offer/counter dance, with its etiquette — because the etiquette is the
// substance. An offer is firm until its reply time; silence kills it; every
// counter re-states everything still open and concedes something.
//
// The ladder converges on WS, and the closing panel makes the negotiation
// point the debrief asks for: which concession costs nothing?

type Msg = {
  from: 'charterer' | 'owner'
  label: string
  body: string
  ws: number | null
  dem: number | null
  rule: string
}

const DANCE: Msg[] = [
  {
    from: 'charterer', label: 'Firm order', ws: null, dem: null,
    body: '80,000 t ± 5% MOLCO crude, Bonny → UKC, laycan 12–14 March, WS guide, 2.5% total commission.',
    rule: 'The order opens the negotiation but commits to no price. Principals never speak directly — every message goes through the broker, which is what makes a reply time enforceable.',
  },
  {
    from: 'owner', label: 'Firm offer', ws: 135, dem: 50_000,
    body: 'WS135, Asbatankvoy, 72 hrs SHINC, demurrage $50,000 pdpr, reply 15:00.',
    rule: 'FIRM means firm. The owner cannot trade against their own live offer until 15:00 — doing so is a reputation-ending move in a market where everyone fixes with everyone, repeatedly.',
  },
  {
    from: 'charterer', label: 'Counter', ws: 118, dem: 42_000,
    body: 'WS118, demurrage $42,000, otherwise as offered, reply 16:00.',
    rule: 'A counter re-states EVERYTHING still open and concedes something. "Otherwise as offered" is doing real work: it closes every term not mentioned, so the negotiation narrows instead of circling.',
  },
  {
    from: 'owner', label: 'Counter', ws: 128, dem: 45_000,
    body: 'WS128, demurrage $45,000, laycan 12–15 March, reply 17:00.',
    rule: 'Notice the owner widened the laycan by a day without being asked. Giving something that costs you little buys the right to hold the thing that costs a lot.',
  },
  {
    from: 'charterer', label: 'Counter', ws: 122, dem: 48_000,
    body: 'WS122, demurrage $48,000, otherwise as last, reply 17:30.',
    rule: 'The interesting trade: demurrage UP, WS down. A charterer who intends to load and discharge fast is selling something they do not expect to pay for, to buy points they pay on every tonne.',
  },
  {
    from: 'owner', label: 'On subs', ws: 122, dem: 48_000,
    body: 'Accept WS122, demurrage $48,000, on subs charterer’s management + receivers, latest 17:00 tomorrow.',
    rule: 'Main terms agreed, subject to approvals. There is no fixture yet — and there is no walking away for a better price either.',
  },
]

const LAST_DONE = 120
const CARGO = 80_000
const FLAT = 7.60

export default function OfferCounterLadder() {
  const [i, setI] = useState(0)
  const m = DANCE[i]

  const shown = DANCE.slice(0, i + 1).filter(x => x.ws !== null)
  const ws = m.ws ?? shown[shown.length - 1]?.ws ?? LAST_DONE
  const dem = m.dem ?? shown[shown.length - 1]?.dem ?? 0

  const vsLast = (ws - LAST_DONE) * FLAT / 100 * CARGO
  const usd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US')

  // ladder scale
  const lo = 110, hi = 140

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The dance has strict etiquette — and the etiquette is the substance</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        One side is <strong className="text-slate-200">owner</strong> of M/T Meridian (open Rotterdam 8 March, TCE target
        $40,000/day); the other is <strong className="text-slate-200">charterer</strong> XYZ (budget WS115). The broker carries
        every message. Step through it.
      </p>

      {/* the converging ladder */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="relative h-14">
          <div className="absolute inset-x-0 top-7 h-px bg-white/15" />
          {/* last done */}
          <div className="absolute top-3 h-8 w-0.5 bg-slate-400" style={{ left: `${((LAST_DONE - lo) / (hi - lo)) * 100}%` }} />
          <span className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-slate-400"
            style={{ left: `${((LAST_DONE - lo) / (hi - lo)) * 100}%` }}>last done WS{LAST_DONE}</span>
          {shown.map((x, k) => (
            <div key={k}
              className="absolute top-5 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${Math.max(0, Math.min(100, ((x.ws! - lo) / (hi - lo)) * 100))}%` }}>
              <span className={`h-3 w-3 rounded-full ${x.from === 'owner' ? 'bg-amber-400' : 'bg-cyan-400'}`}
                style={{ opacity: k === shown.length - 1 ? 1 : 0.35 }} />
              {k === shown.length - 1 && (
                <span className={`mt-1 font-mono text-[11px] font-bold ${x.from === 'owner' ? 'text-amber-300' : 'text-cyan-300'}`}>
                  WS{x.ws}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-600">
          <span>WS{lo}</span><span className="text-cyan-400">● charterer</span><span className="text-amber-400">● owner</span><span>WS{hi}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className={`rounded-xl border p-3.5 ${m.from === 'owner' ? 'border-amber-500/45 bg-amber-500/[0.08]' : 'border-cyan-400/45 bg-cyan-400/[0.08]'}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className={`font-mono text-sm font-bold ${m.from === 'owner' ? 'text-amber-300' : 'text-cyan-300'}`}>
              {i + 1}. {m.from === 'owner' ? 'Owner' : 'Charterer'} — {m.label}
            </span>
            <span className="font-mono text-[10px] text-slate-500">via the broker</span>
          </div>
          <p className="mt-1.5 font-mono text-xs leading-relaxed text-slate-200">&ldquo;{m.body}&rdquo;</p>
          <div className="mt-2.5 flex gap-2 border-t border-white/10 pt-2.5">
            <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}
              className="rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-all hover:bg-white/5 disabled:opacity-30">
              ← back
            </button>
            <button type="button" onClick={() => setI(Math.min(DANCE.length - 1, i + 1))} disabled={i === DANCE.length - 1}
              className="rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-all hover:bg-white/5 disabled:opacity-30">
              next message →
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The rule in play</div>
            <p className="text-xs leading-relaxed text-slate-300">{m.rule}</p>
          </div>

          {m.ws !== null && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
              <div className="eyebrow mb-2">On the table right now</div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span className="text-slate-500">freight at WS{ws}</span><span>{usd(CARGO * FLAT * ws / 100)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">demurrage</span><span>{usd(dem)} pdpr</span></div>
                <div className="flex justify-between border-t border-white/15 pt-1">
                  <span className="text-white">vs the last done</span>
                  <span className={vsLast >= 0 ? 'text-rose-300' : 'text-emerald-300'}>{usd(vsLast)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        The question for the debrief: <strong className="text-slate-200">what did the best charterer concede that cost them
        nothing?</strong> Usually the demurrage rate — they intend to load fast, so the days never arrive — traded against WS
        points, which are cash on every single tonne. Same market, same ship, and the spread of agreed levels across the room is
        pure negotiation alpha.
      </p>
    </div>
  )
}
