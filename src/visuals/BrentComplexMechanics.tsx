'use client'

import { useState } from 'react'

// The three mechanics of the Brent complex that students meet as three short
// prose sections: Dated's rolling window, the BFOE forward's nomination
// mechanic, and the DFL that bridges Dated to futures.
//
// They share a file because they are three views of one object — a cargo
// moving from a forward month, through nomination, into a dated window — but
// each is exported separately, since each belongs to its own section.

// ── Dated window ──────────────────────────────────────────────────────────
// Dated Brent assesses cargoes loading 10–31 days ahead of the publication
// date. The window rolls forward every day, which is why "Dated" is not a
// fixed month at all.
const WIN_FROM = 10
const WIN_TO = 31

// ── DFL ───────────────────────────────────────────────────────────────────
const DFL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const GRADES = ['Brent Ninian Blend', 'Forties', 'Oseberg', 'Ekofisk', 'Troll', 'WTI Midland']

const usd0 = (n: number) => (n < 0 ? '−$' : '+$') + Math.abs(Math.round(n)).toLocaleString('en-US')

export function DatedWindow() {
  const [today, setToday] = useState(0)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Dated Brent — a window that moves every day</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">Dated Brent is physical oil with specific loading dates, assessed over a rolling 10–31 day forward window. Roll the publication date and watch the band march right: it is not a month and not a fixed contract.</p>
      <div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            Days ahead of publication — only the shaded band is &ldquo;Dated&rdquo;
          </div>
          <div className="flex gap-[2px]">
            {Array.from({ length: 45 }, (_, d) => {
              const inWin = d >= today + WIN_FROM && d <= today + WIN_TO
              const isToday = d === today
              return (
                <div key={d} className="flex-1" title={`day +${d}`}>
                  <div className="h-8 rounded-sm" style={{
                    backgroundColor: isToday ? '#f43f5e' : inWin ? '#22d3ee' : 'rgba(255,255,255,0.05)',
                    opacity: inWin ? 0.75 : 1,
                  }} />
                </div>
              )
            })}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
            <span>today</span><span>+15</span><span>+30</span><span>+45 days</span>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-rose-300">Roll the publication date forward</span>
              <span className="font-bold tabular-nums text-white">+{today} days</span>
            </div>
            <input type="range" min={0} max={12} step={1} value={today}
              onChange={e => setToday(parseInt(e.target.value, 10))}
              aria-label="Days to roll the publication date forward"
              className="h-2 w-full cursor-pointer accent-rose-400" />
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
            <div className="font-mono text-sm font-bold text-cyan-300">What Dated Brent actually is</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Physical oil with <strong className="text-white">specific loading dates</strong>, assessed over a{' '}
              {WIN_FROM}–{WIN_TO} day forward window beyond the publication date. Cargoes are{' '}
              <strong className="text-white">700,000 bbl ± 1%</strong>, FOB North Sea for the five grades and CFR Rotterdam for
              WTI Midland.
            </p>
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">
              Drag the slider and watch the band march right. Dated is not a month and not a fixed contract — it is a{' '}
              <strong className="text-slate-200">window that moves every single day</strong>, which is exactly why a cargo loading
              in three weeks and one loading in five weeks are not the same instrument.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Where the price comes from</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Three inputs at once: outright fixed trades, differential trades on the derivative markets, and the value of the
              physical cargo market itself. The assessment is a judgement built from all three — which is precisely the
              combination the <strong className="text-cyan-300">CFD</strong> exists to capture and trade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BfoeForward() {
  const [nomDay, setNomDay] = useState(0)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The Brent forward — and the seller’s choice</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">A standardised contract for a full delivery month, loading any time within it. Thirty days before, the seller nominates — and the seller picks which grade you get.</p>
      <div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-3 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            The nomination clock — 30 days before the delivery month
          </div>
          <div className="relative h-2 rounded bg-white/[0.06]">
            <div className="absolute inset-y-0 left-0 rounded bg-amber-400/70 transition-all" style={{ width: `${(nomDay / 30) * 100}%` }} />
            <div className="absolute -top-1 h-4 w-0.5 bg-white/50" style={{ left: '100%' }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
            <span>today</span><span>nomination · 30 days prior</span>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-amber-300">Days elapsed</span>
              <span className="font-bold tabular-nums text-white">{nomDay} / 30</span>
            </div>
            <input type="range" min={0} max={30} step={1} value={nomDay}
              onChange={e => setNomDay(parseInt(e.target.value, 10))}
              aria-label="Days elapsed toward nomination"
              className="h-2 w-full cursor-pointer accent-amber-400" />
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-slate-400">
              {nomDay < 30 ? 'The seller may still nominate any of these' : 'The seller has nominated — and they chose'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GRADES.map((g, i) => (
                <span key={g} className={`rounded px-2 py-1 font-mono text-[11px] transition-all ${
                  nomDay < 30
                    ? 'bg-white/[0.06] text-slate-300'
                    : i === 1 ? 'bg-amber-400/25 text-amber-100' : 'bg-white/[0.03] text-slate-600 line-through'
                }`}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="font-mono text-sm font-bold text-amber-300">The option sits with the seller</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              A Brent Forward is standardised on terms and on a <strong className="text-white">full delivery month</strong> —
              loading any time within it. Thirty days before, the seller nominates, and the seller chooses{' '}
              <strong className="text-white">which of the grades</strong> to deliver. As a buyer you are short that choice, and
              you will be given the one the seller likes least.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Priced fixed, or by EFP</div>
            <p className="text-xs leading-relaxed text-slate-300">
              In practice it is <strong className="text-white">always EFP</strong> now — the forward is priced as a differential
              to the futures rather than as an outright number, so the flat price is handled on the screen and only the
              differential is negotiated. When you buy a forward you ultimately receive a{' '}
              <strong className="text-cyan-300">dated cargo</strong>, and the gap between forward and dated is a price risk of its
              own. That is the CFD&apos;s job.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DflSpread() {
  const [dflLock, setDflLock] = useState(-0.60)
  const [spreads, setSpreads] = useState([-0.80, -0.55, -0.35, -0.70, -0.45])
  const dflAvg = spreads.reduce((s, x) => s + x, 0) / spreads.length
  const dflPnl = (dflAvg - dflLock) * 700000

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">DFL — locking Dated against the futures</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">A swap on Dated Brent versus ICE Brent, settling against a calendar average of the difference. It prices the left side of the triangle before the oil trades.</p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            Daily realised spread — Platts Dated minus ICE settlement
          </div>
          <div className="space-y-2">
            {spreads.map((v, i) => (
              <div key={i}>
                <div className="mb-0.5 flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">{DFL_DAYS[i]}</span>
                  <span className="font-bold tabular-nums text-white">{v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}</span>
                </div>
                <input type="range" min={-2} max={1} step={0.05} value={v}
                  onChange={e => setSpreads(s => s.map((x, k) => (k === i ? parseFloat(e.target.value) : x)))}
                  aria-label={`Dated minus futures spread, ${DFL_DAYS[i]}`}
                  className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-white/10 pt-2.5">
            <div className="mb-0.5 flex justify-between font-mono text-[11px]">
              <span className="text-violet-300">You locked the DFL at</span>
              <span className="font-bold tabular-nums text-white">{dflLock >= 0 ? '+' : '−'}${Math.abs(dflLock).toFixed(2)}</span>
            </div>
            <input type="range" min={-2} max={1} step={0.05} value={dflLock}
              onChange={e => setDflLock(parseFloat(e.target.value))}
              aria-label="DFL level locked"
              className="h-1.5 w-full cursor-pointer accent-violet-400" />
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-violet-500/40 bg-violet-500/[0.08] p-3.5">
            <div className="font-mono text-sm font-bold text-violet-300">DFL — Dated to Front Line</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              A swap on <strong className="text-white">Dated Brent versus ICE Brent futures</strong>: a fixed value against a
              floating settlement of Platts Dated minus the ICE settlement, averaged over a calendar period. It lets you lock the
              relative value of Dated to the futures contract <strong className="text-white">before the oil even trades</strong>.
            </p>
            <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">
              It is the bridge across the left side of the triangle: Futures ↔ Dated.
            </p>
          </div>

          <div className={`rounded-xl border p-3.5 font-mono text-xs tabular-nums ${
            dflPnl >= 0 ? 'border-emerald-500/40 bg-emerald-500/[0.08]' : 'border-rose-500/45 bg-rose-500/[0.10]'
          }`}>
            <div className="eyebrow mb-2 text-slate-300">Settlement on 700,000 bbl</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">floating average</span><span>{dflAvg >= 0 ? '+' : '−'}${Math.abs(dflAvg).toFixed(3)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">you locked</span><span>{dflLock >= 0 ? '+' : '−'}${Math.abs(dflLock).toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1">
                <span className="font-bold text-white">difference</span>
                <span className="font-bold">{(dflAvg - dflLock) >= 0 ? '+' : '−'}${Math.abs(dflAvg - dflLock).toFixed(3)}/bbl</span>
              </div>
            </div>
            <div className={`mt-2 text-2xl font-bold ${dflPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {usd0(dflPnl)}
            </div>
            <p className="mt-1.5 leading-relaxed text-slate-400">
              If you BOUGHT the DFL you are long Dated against the futures, so a stronger Dated pays you. Nothing physical has
              happened — only the relationship between two published numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

