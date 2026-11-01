'use client'

import { useState } from 'react'

// The long-run Brent chart, annotated. The discipline the section teaches is
// that every major move has a driver — so the chart is only useful if you can
// click a spike and name it.
//
// Prices are annual-average-to-peak markers in $/bbl, plotted to show shape
// rather than to be a trading series. Each event carries which side of the
// balance it hit, because that is the classification students need.

type Ev = {
  year: number
  price: number
  label: string
  side: 'supply' | 'demand' | 'policy'
  what: string
}

const EVENTS: Ev[] = [
  { year: 1990, price: 41, label: 'Gulf War', side: 'supply', what: 'Iraq invades Kuwait and takes roughly 4 mb/d off the market overnight. The textbook supply shock — and the textbook response: Saudi spare capacity covered most of it within months, which is why the spike did not last.' },
  { year: 1994, price: 16, label: 'Post-war normal', side: 'supply', what: 'Supply restored, spare capacity comfortable. Prices spend most of the decade in the teens, and the industry convinces itself that is normal.' },
  { year: 1998, price: 10, label: 'Asian crisis low', side: 'demand', what: 'Asian demand collapses just as OPEC had raised quotas. Brent touches about $10 — cheaper in real terms than almost any point since the war. A pure demand shock meeting bad supply timing.' },
  { year: 2003, price: 29, label: 'China takes off', side: 'demand', what: 'The start of the demand supercycle. Chinese growth begins absorbing every incremental barrel, and spare capacity thins year after year.' },
  { year: 2008, price: 147, label: 'The $147 peak', side: 'demand', what: 'Years of demand growth against flat non-OPEC supply, with spare capacity down to almost nothing. The physical market had no cushion left, so the price did the rationing.' },
  { year: 2009, price: 36, label: 'Financial crisis', side: 'demand', what: 'The fastest demand destruction on record. From $147 to the mid-$30s in six months — and a lesson that oil is an asset class as well as a commodity.' },
  { year: 2012, price: 112, label: 'Arab Spring era', side: 'supply', what: 'Libyan outages and Iranian sanctions keep the market tight while shale is still ramping. Three years above $100.' },
  { year: 2016, price: 28, label: 'Market-share war', side: 'policy', what: 'In late 2014 OPEC declines to cut, choosing volume over price to squeeze US shale. Brent falls to about $28. It ends with the OPEC+ alliance in 2016 — the modern era of managed supply begins here.' },
  { year: 2018, price: 76, label: 'OPEC+ holds', side: 'policy', what: 'Coordinated cuts rebalance the market. The new regime works, and the market learns to trade OPEC+ meeting headlines.' },
  { year: 2020, price: 19, label: 'Pandemic', side: 'demand', what: 'Demand falls by around 20 mb/d in weeks. Storage fills, and WTI settles at minus $37 on a single expiry day because there was physically nowhere to put the oil at Cushing.' },
  { year: 2022, price: 128, label: 'Russia–Ukraine', side: 'supply', what: 'A supply shock into a market with almost no spare capacity and very low stocks — the same configuration as 2008, which is why the move was as violent.' },
  { year: 2023, price: 84, label: 'Israel–Gaza', side: 'supply', what: 'A major geopolitical event that did NOT spike the price, because spare capacity had been rebuilt and no barrels were actually lost. The contrast with 2022 is the whole lesson about cushions.' },
  { year: 2025, price: 72, label: 'Managed range', side: 'policy', what: 'OPEC+ unwinding cuts into soft demand growth. Spare capacity back to a comfortable level, and a price that keeps being pulled back into a range.' },
]

const SIDE: Record<Ev['side'], { label: string; color: string }> = {
  supply: { label: 'supply shock', color: '#f43f5e' },
  demand: { label: 'demand shock', color: '#22d3ee' },
  policy: { label: 'policy', color: '#f59e0b' },
}

const COMMON = [
  { k: 'The US dollar', v: 'Oil is priced in dollars, so a stronger dollar makes it dearer in every other currency — and usually weighs on the price.' },
  { k: 'Macro growth & rates', v: 'Oil demand is industrial demand. Rate cycles and growth forecasts move the whole curve before a single barrel changes hands.' },
  { k: 'Financial flows', v: 'Oil trades as an asset class. Index rebalancing and fund positioning can move price with no fundamental news at all — and the CFTC report is how you see it.' },
  { k: 'Energy substitution', v: 'Coal, gas and oil compete barrel for barrel in power and industry; renewables and biofuels take a slice every year. Slow, but relentless.' },
]

// Chart geometry
const W = 640, H = 290, ML = 46, MR = 16, MT = 30, MB = 36
const PW = W - ML - MR
const PH = H - MT - MB
const Y0 = 1988, Y1 = 2026
const P_MAX = 160

const sx = (y: number) => ML + ((y - Y0) / (Y1 - Y0)) * PW
const sy = (p: number) => MT + PH - (p / P_MAX) * PH

export default function OilEventHistory() {
  const [sel, setSel] = useState(10) // Russia–Ukraine
  const e = EVENTS[sel]
  const side = SIDE[e.side]

  const path = EVENTS.map((x, i) => `${i ? 'L' : 'M'} ${sx(x.year).toFixed(1)} ${sy(x.price).toFixed(1)}`).join(' ')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Thirty-five years of Brent — every move has a driver</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        The long-run chart looks random until each turn has a name on it. Click any point: the discipline is to classify the move as
        a <strong className="text-rose-300">supply</strong> shock, a <strong className="text-cyan-300">demand</strong> shock, or{' '}
        <strong className="text-amber-300">policy</strong> — and then to ask what the cushion looked like at the time.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label="Brent crude price from 1990 to 2025 with major events marked">
        <text x={ML - 40} y={14} fill="#64748b" fontSize={10} className="font-mono">Brent $/bbl</text>
        {[0, 40, 80, 120, 160].map(p => (
          <g key={p}>
            <line x1={ML} y1={sy(p)} x2={ML + PW} y2={sy(p)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={ML - 8} y={sy(p)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={10} className="font-mono">{p}</text>
          </g>
        ))}
        <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
        {[1990, 2000, 2010, 2020].map(y => (
          <text key={y} x={sx(y)} y={MT + PH + 16} textAnchor="middle" fill="#64748b" fontSize={10} className="font-mono">{y}</text>
        ))}

        <path d={path} fill="none" stroke="#475569" strokeWidth={2} />

        {EVENTS.map((x, i) => {
          const on = i === sel
          const c = SIDE[x.side].color
          return (
            <g key={x.year} onClick={() => setSel(i)} className="cursor-pointer">
              <circle cx={sx(x.year)} cy={sy(x.price)} r={14} fill="transparent" />
              <circle cx={sx(x.year)} cy={sy(x.price)} r={on ? 6.5 : 4.5}
                fill={on ? c : '#0b1220'} stroke={c} strokeWidth={on ? 2.5 : 2} />
            </g>
          )
        })}

        {/* label only the selected point, so the chart stays readable */}
        <g>
          <text x={sx(e.year)} y={sy(e.price) - 16} textAnchor={e.year > 2018 ? 'end' : e.year < 1996 ? 'start' : 'middle'}
            fill={side.color} fontSize={11} fontWeight="bold" className="font-mono">
            {e.label} · ${e.price}
          </text>
        </g>
      </svg>

      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3.5" style={{ borderColor: side.color + '55', backgroundColor: side.color + '0d' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-sm font-bold" style={{ color: side.color }}>{e.year} · {e.label}</span>
            <span className="rounded px-2 py-0.5 font-mono text-[10px] uppercase" style={{ backgroundColor: side.color + '22', color: side.color }}>
              {side.label}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{e.what}</p>
          <div className="mt-2.5 flex gap-2 border-t border-white/10 pt-2">
            <button type="button" onClick={() => setSel(Math.max(0, sel - 1))} disabled={sel === 0}
              className="rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-all hover:bg-white/5 disabled:opacity-30">
              ← earlier
            </button>
            <button type="button" onClick={() => setSel(Math.min(EVENTS.length - 1, sel + 1))} disabled={sel === EVENTS.length - 1}
              className="rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-all hover:bg-white/5 disabled:opacity-30">
              later →
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            Layered on top: the factors common to every market
          </div>
          <div className="space-y-1.5">
            {COMMON.map(c => (
              <div key={c.k} className="border-b border-white/[0.05] pb-1.5 last:border-0">
                <span className="font-mono text-[11px] font-bold text-slate-200">{c.k}</span>
                <p className="text-[11px] leading-relaxed text-slate-400">{c.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Compare <strong className="text-slate-200">2022</strong> with <strong className="text-slate-200">2023</strong>. Both were
        major geopolitical events; only one repriced the market. The difference was not the headline — it was whether spare
        capacity and stocks could absorb it. That is the entire argument for reading the balance before reading the news.
      </p>
    </div>
  )
}
