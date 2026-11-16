'use client'

import { useState } from 'react'

// "A position is put ON to protect and taken OFF as the risk disappears."
// Students read that and still think of a hedge as a thing you buy. The
// timeline makes it a switch: step through a real cargo and watch the hedge
// come on the moment price risk starts and come off the moment it ends.
//
// The two mistakes are built in as the first and last steps — hedging before
// there is a risk, and leaving the hedge on after the risk is gone. Both turn
// a hedge into a speculation.

type Step = {
  day: string
  event: string
  risk: boolean
  hedge: boolean
  note: string
  warn?: string
}

const STEPS: Step[] = [
  {
    day: 'Day 0', event: 'You are negotiating. Nothing is signed.',
    risk: false, hedge: false,
    note: 'No contract, no obligation, no exposure. Whatever the market does tonight costs you nothing.',
    warn: 'Hedging here is not early caution — it is an outright position. You would be short futures against nothing at all.',
  },
  {
    day: 'Day 1', event: 'You sign: buy 700,000 bbl at a FIXED $82.45/bbl.',
    risk: true, hedge: true,
    note: 'Price risk begins at the stroke of the pen, not when the oil loads. You are long 700,000 bbl at a fixed number, so the hedge goes on NOW: sell 700 lots of ICE Brent.',
  },
  {
    day: 'Days 2–20', event: 'The cargo is nominated, scheduled, and loads 15–17 July.',
    risk: true, hedge: true,
    note: 'The market moves every day and the hedge moves against it, one for one on flat price. Variation margin settles daily — the cash cost of being correctly hedged.',
  },
  {
    day: 'Day 21', event: 'You sell the cargo on, priced off Dated Brent.',
    risk: true, hedge: true,
    note: 'Careful: the sale is FLOATING and the purchase was FIXED, so the flat-price exposure has not gone — it has only become one-sided in the other direction once the pricing window runs.',
  },
  {
    day: 'Days 22–26', event: 'The pricing window runs. The floating leg fixes, day by day.',
    risk: true, hedge: true,
    note: 'This is the moment the risk actually unwinds — in five daily slices, not all at once. A disciplined desk lifts the hedge in the same five slices, matching the pricing.',
  },
  {
    day: 'Day 27', event: 'The last pricing day passes. Both legs are now priced.',
    risk: false, hedge: false,
    note: 'Price risk ends here. Everything from now on is a receivable, not an exposure — the number is known and only the counterparty can still cost you money.',
    warn: 'Leaving the hedge on past this point is the mirror of the first mistake. You are no longer protecting anything; you are short 700 lots of Brent on purpose.',
  },
]

export default function HedgeLifecycle() {
  const [i, setI] = useState(1)
  const s = STEPS[i]

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">A hedge is a switch, not a purchase</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        It goes <strong className="text-slate-200">on</strong> the moment you take price risk and{' '}
        <strong className="text-slate-200">off</strong> the moment that risk is gone. Knowing those two moments is most of the
        skill — so step through one real cargo and watch both switches.
      </p>

      {/* the two tracks */}
      <div className="space-y-2">
        {[
          { label: 'Price risk', key: 'risk' as const, on: '#f43f5e', text: 'exposed' },
          { label: 'Hedge', key: 'hedge' as const, on: '#22d3ee', text: 'on' },
        ].map(track => (
          <div key={track.label} className="flex items-center gap-2">
            <span className="w-20 shrink-0 font-mono text-[11px] text-slate-400">{track.label}</span>
            <div className="flex flex-1 gap-1">
              {STEPS.map((st, k) => (
                <button
                  key={k} type="button" onClick={() => setI(k)}
                  aria-label={`${track.label} at ${st.day}: ${st[track.key] ? track.text : 'off'}`}
                  className={`h-7 flex-1 rounded transition-all ${k === i ? 'ring-2 ring-white/40' : ''}`}
                  style={{
                    backgroundColor: st[track.key] ? track.on : 'rgba(255,255,255,0.05)',
                    opacity: st[track.key] ? (k === i ? 0.95 : 0.6) : 1,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0" />
          <div className="flex flex-1 gap-1">
            {STEPS.map((st, k) => (
              <span key={k} className={`flex-1 text-center font-mono text-[9px] ${k === i ? 'text-cyan-300' : 'text-slate-600'}`}>
                {st.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-3 rounded-xl border p-3.5 ${s.warn ? 'border-amber-500/50 bg-amber-500/[0.08]' : 'border-white/10 bg-white/[0.03]'}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-sm font-bold text-slate-100">{s.day} — {s.event}</span>
          <span className="flex gap-1.5">
            <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
              s.risk ? 'bg-rose-400/15 text-rose-300' : 'bg-white/[0.06] text-slate-500'
            }`}>
              risk {s.risk ? 'on' : 'off'}
            </span>
            <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
              s.hedge ? 'bg-cyan-400/15 text-cyan-300' : 'bg-white/[0.06] text-slate-500'
            }`}>
              hedge {s.hedge ? 'on' : 'off'}
            </span>
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{s.note}</p>
        {s.warn && (
          <p className="mt-2.5 border-t border-white/10 pt-2 text-xs leading-relaxed text-amber-200">
            <strong>The mistake here:</strong> {s.warn}
          </p>
        )}
        <div className="mt-2.5 flex gap-2 border-t border-white/10 pt-2.5">
          <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}
            className="rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-all hover:bg-white/5 disabled:opacity-30">
            ← back
          </button>
          <button type="button" onClick={() => setI(Math.min(STEPS.length - 1, i + 1))} disabled={i === STEPS.length - 1}
            className="rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-all hover:bg-white/5 disabled:opacity-30">
            next →
          </button>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Notice that the two tracks are identical — that is what a correct hedge looks like. Any place where the blue bar is on and
        the red one is off, you are not hedging, you are <strong className="text-slate-200">trading</strong>. Both ends of this
        timeline are real mistakes a desk makes, and neither one looks like a mistake at the time.
      </p>
    </div>
  )
}
