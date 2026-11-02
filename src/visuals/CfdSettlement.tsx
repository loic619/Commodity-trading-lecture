'use client'

import { useState } from 'react'

// The worked CFD trade from the lecture, settled day by day. Buying the CFD
// makes you long Dated against the forward, so the question each day is
// whether the Dated-to-forward difference NARROWED or WIDENED against the
// level you traded.
//
// The daily table is the point: a CFD does not settle on a view about the
// oil price, it settles on five comparisons of two published numbers.

const DAYS = ['Mon 3 Jul', 'Tue 4 Jul', 'Wed 5 Jul', 'Thu 6 Jul', 'Fri 7 Jul']
const TRADED = -0.80   // bought at AUG − 0.80
const LOTS = 700000    // bbl

export default function CfdSettlement() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [diffs, setDiffs] = useState([-0.95, -0.72, -0.60, -0.84, -0.55])

  const avg = diffs.reduce((s, x) => s + x, 0) / diffs.length
  // Long the CFD = long Dated vs the forward, so a narrower (less negative)
  // difference than the traded level pays you.
  const perBbl = side === 'buy' ? avg - TRADED : TRADED - avg
  const pnl = perBbl * LOTS

  const set = (i: number, v: number) => setDiffs(d => d.map((x, k) => (k === i ? v : x)))
  const sgn = (n: number) => (n >= 0 ? '+' : '−') + '$' + Math.abs(n).toFixed(2)
  const money = (n: number) => (n < 0 ? '−$' : '+$') + Math.abs(Math.round(n)).toLocaleString('en-US')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">A CFD settles on five comparisons, not on a price view</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        On 15 June you trade a CFD for the week <strong className="text-slate-200">3–7 July</strong>, offered at{' '}
        <strong className="text-slate-200">AUG − 0.80</strong>. That number is what you trade. Through the week you compare the
        published <strong className="text-slate-200">Dated Brent</strong> with the published{' '}
        <strong className="text-slate-200">front month</strong>, day by day.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Side">
        {([['buy', 'You BUY the CFD'], ['sell', 'You SELL the CFD']] as const).map(([k, label]) => (
          <button
            key={k} type="button" onClick={() => setSide(k as 'buy' | 'sell')}
            aria-pressed={side === k}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs font-bold transition-all ${
              side === k ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="flex items-center font-mono text-[11px] text-slate-400">
          → {side === 'buy' ? 'long Dated / short the forward' : 'short Dated / long the forward'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 grid grid-cols-[1.1fr_1fr_1fr_0.9fr] gap-2 font-mono text-[10px] uppercase tracking-wide text-slate-500">
            <span>Day</span><span className="text-right">Dated − AUG</span><span>vs traded</span><span className="text-right">Day P&amp;L</span>
          </div>
          <div className="space-y-2">
            {diffs.map((v, i) => {
              const day = (side === 'buy' ? v - TRADED : TRADED - v) * (LOTS / DAYS.length)
              const narrowed = v > TRADED
              return (
                <div key={i} className="grid grid-cols-[1.1fr_1fr_1fr_0.9fr] items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400">{DAYS[i]}</span>
                  <span className="text-right font-mono text-[11px] font-bold tabular-nums text-white">{sgn(v)}</span>
                  <span className={`font-mono text-[10px] ${narrowed ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {narrowed ? 'narrowed' : 'widened'}
                  </span>
                  <span className={`text-right font-mono text-[11px] tabular-nums ${day >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {money(day)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
            {diffs.map((v, i) => (
              <div key={i}>
                <div className="mb-0.5 flex justify-between font-mono text-[10px]">
                  <span className="text-slate-500">{DAYS[i]}</span>
                  <span className="text-slate-400">{sgn(v)}</span>
                </div>
                <input type="range" min={-1.6} max={0.2} step={0.01} value={v}
                  onChange={e => set(i, parseFloat(e.target.value))}
                  aria-label={`Dated minus front month, ${DAYS[i]}`}
                  className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className={`rounded-xl border p-3.5 font-mono text-xs tabular-nums ${
            pnl >= 0 ? 'border-emerald-500/40 bg-emerald-500/[0.08]' : 'border-rose-500/45 bg-rose-500/[0.10]'
          }`}>
            <div className="eyebrow mb-2 text-slate-300">Settlement on {LOTS.toLocaleString('en-US')} bbl</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">week average</span><span>{sgn(avg)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">you traded at</span><span>{sgn(TRADED)}</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1">
                <span className="font-bold text-white">per barrel</span>
                <span className="font-bold">{sgn(perBbl)}</span>
              </div>
            </div>
            <div className={`mt-2 text-2xl font-bold ${pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{money(pnl)}</div>
            <p className="mt-1.5 leading-relaxed text-slate-400">
              {side === 'buy'
                ? 'Long the CFD: the difference narrowing (Dated strengthening against the forward) pays you.'
                : 'Short the CFD: the difference widening (Dated weakening against the forward) pays you.'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">What you did and did not trade</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Notice what is <strong className="text-white">absent</strong> from the settlement: the oil price. Drag every day up
              or down together and nothing changes, because both legs of the comparison move with the market. A CFD is a position
              in the <strong className="text-cyan-300">relationship</strong> between Dated and the forward — which is to say, a
              position in market structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
