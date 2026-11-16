'use client'

import { useState } from 'react'

// Brent's authority is wildly out of proportion to the oil underneath it, and
// that disproportion IS the lesson: a benchmark is made by the liquidity and
// transparency around it, not by the volume of the grade.
//
// The three ingredients are shown as switches — turn any one off and the
// benchmark stops working, which is the honest way to show why so few
// benchmarks exist.

type Ingredient = {
  key: string
  name: string
  color: string
  have: string
  without: string
}

const INGREDIENTS: Ingredient[] = [
  {
    key: 'few', name: 'Few loading installations', color: '#22d3ee',
    have: 'About 150 fields drain through a handful of terminals. A small number of physical choke points means a small number of places where the price is actually made — and so a price everyone can see.',
    without: 'With 150 separate export points there is no single observable price, only 150 local ones. Nothing to assess, nothing to quote against.',
  },
  {
    key: 'dates', name: 'Published loading programmes', color: '#34d399',
    have: 'Terminals publish which cargo loads on which dates, weeks ahead. That turns a vague future barrel into a specific, tradeable object with a name and a date range.',
    without: 'If nobody knows which cargo loads when, a "dated" cargo cannot exist — and with it goes the entire Dated Brent assessment.',
  },
  {
    key: 'paper', name: 'A deep paper market', color: '#a78bfa',
    have: 'Futures, forwards, CFDs and DFLs stacked on top of a tiny physical base. The paper volume is orders of magnitude larger than the oil, and that depth is what makes the price hard to push around.',
    without: 'A thin paper market is a manipulable one. Without depth, a single large physical player sets the benchmark that prices everyone else — which is exactly what a benchmark must not be.',
  },
]

export default function BrentWhy() {
  const [on, setOn] = useState<Record<string, boolean>>({ few: true, dates: true, paper: true })
  const [sel, setSel] = useState('paper')
  const ing = INGREDIENTS.find(i => i.key === sel)!
  const allOn = INGREDIENTS.every(i => on[i.key])

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Less than 3% of world production, most of its pricing</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Brent&apos;s importance has almost nothing to do with how much oil the North Sea pumps. The disproportion{' '}
        <em>is</em> the point: a benchmark is made by what surrounds it, not by the volume underneath it.
      </p>

      {/* the disproportion */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="font-mono text-[11px] uppercase tracking-wide text-slate-400">Share of world crude production</div>
          <div className="mt-1 font-mono text-3xl font-bold tabular-nums text-slate-300">&lt; 3%</div>
          <div className="mt-2 h-3 rounded bg-white/[0.05]">
            <div className="h-full rounded bg-slate-500" style={{ width: '3%' }} />
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-slate-500">~150 fields, a handful of terminals</p>
        </div>
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
          <div className="font-mono text-[11px] uppercase tracking-wide text-cyan-300">Share of internationally traded crude it prices</div>
          <div className="mt-1 font-mono text-3xl font-bold tabular-nums text-cyan-300">~2/3</div>
          <div className="mt-2 h-3 rounded bg-white/[0.05]">
            <div className="h-full rounded bg-cyan-400/80" style={{ width: '66%' }} />
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-slate-500">West Africa, the Med, the Caspian, Gulf crude heading west</p>
        </div>
      </div>

      {/* the three ingredients, as switches */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="mb-2.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
          Three ingredients — switch one off and see what happens
        </div>
        <div className="space-y-1.5">
          {INGREDIENTS.map(x => (
            <div key={x.key} className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => { setOn(o => ({ ...o, [x.key]: !o[x.key] })); setSel(x.key) }}
                aria-pressed={on[x.key]}
                aria-label={`${x.name}: ${on[x.key] ? 'on' : 'off'}`}
                className={`w-11 shrink-0 rounded-full border px-1 py-1 transition-all ${
                  on[x.key] ? 'border-emerald-400/60 bg-emerald-400/20' : 'border-white/15 bg-white/[0.04]'
                }`}
              >
                <span className={`block h-3 w-3 rounded-full transition-all ${on[x.key] ? 'ml-auto bg-emerald-300' : 'bg-slate-500'}`} />
              </button>
              <button
                type="button" onClick={() => setSel(x.key)}
                className={`flex-1 text-left text-sm transition-all ${
                  on[x.key] ? 'text-slate-200' : 'text-slate-500 line-through'
                } ${sel === x.key ? 'font-bold' : ''}`}
                style={sel === x.key ? { color: on[x.key] ? x.color : undefined } : undefined}
              >
                {x.name}
              </button>
            </div>
          ))}
        </div>

        <div className={`mt-3 rounded-lg border px-3 py-2.5 ${
          allOn ? 'border-emerald-500/40 bg-emerald-500/[0.08]' : 'border-rose-500/45 bg-rose-500/[0.10]'
        }`}>
          <div className={`font-mono text-sm font-bold ${allOn ? 'text-emerald-300' : 'text-rose-300'}`}>
            {allOn
              ? 'Few terminals + transparent dates + deep paper = the most-watched price on earth'
              : 'Not a benchmark any more'}
          </div>
          {!allOn && (
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              All three have to hold at once. That is why there are three or four credible crude benchmarks in the world and not
              three hundred — and why keeping Brent working has required adding grades (Forties, Oseberg, Ekofisk, Troll, and now
              WTI Midland) as North Sea output declined.
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl border p-3.5" style={{ borderColor: ing.color + '55', backgroundColor: ing.color + '0d' }}>
        <div className="font-mono text-sm font-bold" style={{ color: ing.color }}>{ing.name}</div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
          <strong className="text-slate-100">With it:</strong> {ing.have}
        </p>
        <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">
          <strong className="text-rose-300">Without it:</strong> {ing.without}
        </p>
      </div>
    </div>
  )
}
