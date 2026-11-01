'use client'

import { useState } from 'react'

// The yield table from the lecture, as stacked bars — because the lesson is a
// comparison and a table makes you do the comparing in your head.
//
// The single number to leave with: Arab Light drops 53% straight to fuel oil
// on simple distillation. That is why it needs a coker to be worth running,
// and it is the bridge to the GPW calculation two sections later.

type Grade = {
  key: string
  name: string
  api: number
  sulphur: number
  cuts: Record<string, number>
  note: string
}

const CUTS = [
  { k: 'Naphtha', color: '#67e8f9', value: 'light' },
  { k: 'Kerosene', color: '#34d399', value: 'light' },
  { k: 'Gas oil', color: '#a78bfa', value: 'middle' },
  { k: 'Fuel oil', color: '#f43f5e', value: 'heavy' },
  { k: 'Fuel & loss', color: '#475569', value: 'none' },
]

const GRADES: Grade[] = [
  {
    key: 'wti', name: 'WTI', api: 39.6, sulphur: 0.24,
    cuts: { Naphtha: 26, Kerosene: 14, 'Gas oil': 23, 'Fuel oil': 35, 'Fuel & loss': 2 },
    note: 'The lightest of the three, and it shows: 63% of the barrel comes off as light and middle cuts before any conversion at all. A simple refinery can run WTI and still sell a decent slate — which is part of why it trades at a premium.',
  },
  {
    key: 'brent', name: 'Brent', api: 38.3, sulphur: 0.37,
    cuts: { Naphtha: 23, Kerosene: 12, 'Gas oil': 22, 'Fuel oil': 41, 'Fuel & loss': 2 },
    note: 'A shade heavier and a shade more sour than WTI, and the fuel oil cut jumps six points for it. Small quality differences move a lot of barrels: six points of a 100,000 bbl cargo is 6,000 barrels of the worst product on the slate instead of the best.',
  },
  {
    key: 'arab', name: 'Arab Light', api: 32.8, sulphur: 1.97,
    cuts: { Naphtha: 17, Kerosene: 12, 'Gas oil': 17, 'Fuel oil': 53, 'Fuel & loss': 1 },
    note: 'Despite the name, not light at all by Atlantic-basin standards — and sour. On simple distillation 53% of it goes straight to fuel oil, the cheapest thing on the barrel. This is exactly why it needs a complex, coking refinery to be worth running, and why it has to trade at a discount to attract one.',
  },
]

// Indicative product values, $/bbl, purely to show the consequence of the mix.
const VALUE: Record<string, number> = {
  Naphtha: 72,
  Kerosene: 92,
  'Gas oil': 88,
  'Fuel oil': 52,
  'Fuel & loss': 0,
}

const H = 230
const BAR_W = 76

export default function CrudeYields() {
  const [sel, setSel] = useState('arab')
  const g = GRADES.find(x => x.key === sel)!

  const worth = (grade: Grade) =>
    CUTS.reduce((s, c) => s + ((grade.cuts[c.k] ?? 0) / 100) * VALUE[c.k], 0)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Quality drives the yield — simple distillation, % weight</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Before any conversion kit touches it, a crude is just the cuts it happens to contain. Compare the three bars and watch the
        <strong className="text-slate-200"> red block grow</strong>: that is the fuel oil, the cheapest thing on the barrel.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr]">
        {/* the bars */}
        <div>
          <div className="flex items-end gap-4">
            {GRADES.map(grade => (
              <button
                key={grade.key} type="button" onClick={() => setSel(grade.key)}
                aria-pressed={sel === grade.key}
                className="group text-center"
              >
                <div
                  className={`relative overflow-hidden rounded-t transition-all ${sel === grade.key ? 'ring-2 ring-cyan-400/60' : 'opacity-75 group-hover:opacity-100'}`}
                  style={{ width: BAR_W, height: H }}
                >
                  {CUTS.map(c => {
                    const pct = grade.cuts[c.k] ?? 0
                    return (
                      <div key={c.k} className="flex items-center justify-center" style={{ height: `${pct}%`, backgroundColor: c.color, opacity: 0.85 }}>
                        {pct >= 10 && (
                          <span className="font-mono text-[10px] font-bold text-slate-900">{pct}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className={`mt-1.5 font-mono text-xs font-bold ${sel === grade.key ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {grade.name}
                </div>
                <div className="font-mono text-[10px] text-slate-500">API {grade.api}</div>
              </button>
            ))}
          </div>

          {/* legend */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {CUTS.map(c => (
              <span key={c.k} className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
                {c.k}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/[0.08] p-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-sm font-bold text-cyan-300">{g.name}</span>
              <span className="font-mono text-[11px] text-slate-400">API {g.api} · sulphur {g.sulphur}%</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{g.note}</p>
          </div>

          {/* what the mix is worth, before any conversion */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-slate-300">
              What that slate is worth, at indicative product prices
            </div>
            <div className="space-y-1">
              {GRADES.map(grade => {
                const v = worth(grade)
                const best = Math.max(...GRADES.map(worth))
                return (
                  <div key={grade.key} className="flex items-baseline justify-between gap-3">
                    <span className={grade.key === sel ? 'text-cyan-300' : 'text-slate-400'}>{grade.name}</span>
                    <span className="flex-1">
                      <span className="block h-1.5 rounded bg-white/[0.06]">
                        <span className="block h-full rounded bg-cyan-400/60" style={{ width: `${(v / best) * 100}%` }} />
                      </span>
                    </span>
                    <span className={`w-20 text-right ${grade.key === sel ? 'font-bold text-white' : 'text-slate-400'}`}>
                      ${v.toFixed(2)}/bbl
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 border-t border-white/10 pt-2 leading-relaxed text-slate-400">
              The spread between the best and worst slate here is{' '}
              <strong className="text-white">${(Math.max(...GRADES.map(worth)) - Math.min(...GRADES.map(worth))).toFixed(2)}/bbl</strong>,
              on simple distillation alone. That number is the crude differential the market has to pay you to take the heavier
              barrel — and the next section turns it into a real Gross Product Worth calculation.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">The point of the conversion kit</div>
            <p className="text-xs leading-relaxed text-slate-300">
              These yields assume <strong className="text-white">simple distillation only</strong>. Put a coker behind it and most
              of that red block becomes light product — which is why a complex refinery can bid for Arab Light and a simple one
              cannot. The kit does not just add margin; it changes which crudes you are allowed to want.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
