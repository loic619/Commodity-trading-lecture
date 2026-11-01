'use client'

import { useState } from 'react'

// The call on OPEC is a residual, and residuals are where the leverage is: a
// 1% error in world demand — well inside the forecasting error of the IEA and
// the EIA — moves the call by a million barrels a day, because it lands
// entirely on one small number.
//
// The second half is what the call is set against. Spare capacity is the
// market's shock absorber, and the tightness gauge is what actually prices
// risk: at 5 mb/d a disruption is an inconvenience, at 1.5 mb/d it is a spike.
//
// Anchors: world liquids demand ~103 mb/d, non-OPEC supply ~71.8, OPEC NGLs
// ~5.5 → call on OPEC crude ~25.7 against ~30.5 of crude capacity.

const OPEC = ['Saudi Arabia', 'Iraq', 'UAE', 'Kuwait', 'Iran', 'Nigeria', 'Libya', 'Algeria', 'Venezuela', 'Congo', 'Equatorial Guinea', 'Gabon']
const PLUS = ['Russia', 'Kazakhstan', 'Mexico', 'Oman', 'Azerbaijan', 'Malaysia', 'Bahrain', 'Brunei', 'Sudan', 'South Sudan']

function Slider({ label, value, min, max, step, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; color: string
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold tabular-nums text-white">{value.toFixed(1)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="h-1.5 w-full cursor-pointer" style={{ accentColor: color }} />
    </div>
  )
}

export default function CallOnOpec() {
  const [demand, setDemand] = useState(103.0)
  const [nonOpec, setNonOpec] = useState(71.8)
  const [ngl, setNgl] = useState(5.5)
  const [capacity, setCapacity] = useState(30.5)

  const call = demand - nonOpec - ngl
  const spare = capacity - call
  const sparePct = (spare / demand) * 100

  const band = spare < 1.5
    ? { label: 'Critically thin', color: '#f43f5e', note: 'Any outage of size goes straight into the price — there is no cushion left to cover it. This is the 2022 configuration, and it is why a single pipeline or a single refinery could move Brent several dollars.' }
    : spare < 3
      ? { label: 'Tight', color: '#f59e0b', note: 'The market can absorb a small disruption but not a large one. Expect a risk premium in the price and a nervous curve.' }
      : spare < 5
        ? { label: 'Adequate', color: '#34d399', note: 'A normal cushion. Most single-country outages can be covered, so geopolitical headlines fade within days instead of repricing the curve.' }
        : { label: 'Comfortable', color: '#22d3ee', note: 'A large cushion caps the price: the market knows barrels can be released, so rallies are sold. Comfortable spare capacity is itself bearish.' }

  // Bar scale across the widest figure on show.
  const scale = Math.max(demand, 1)
  const pct = (v: number) => `${Math.max(0, (v / scale) * 100)}%`

  const [tab, setTab] = useState<'opec' | 'plus'>('opec')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">The call on OPEC — a residual, and a cushion</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Everything the rest of the world cannot supply, OPEC must. That makes the call a{' '}
        <strong className="text-slate-200">subtraction</strong> — and subtractions concentrate error. Nudge world demand by one
        percent and watch where the whole revision lands.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {/* the subtraction, as bars */}
          <div className="space-y-2.5">
            {[
              { k: 'Total world demand', v: demand, c: '#22d3ee', sign: '' },
              { k: 'less non-OPEC supply', v: nonOpec, c: '#64748b', sign: '−' },
              { k: 'less OPEC NGLs', v: ngl, c: '#64748b', sign: '−' },
            ].map(r => (
              <div key={r.k}>
                <div className="mb-1 flex justify-between font-mono text-xs">
                  <span className="text-slate-400">{r.sign} {r.k}</span>
                  <span className="font-bold tabular-nums text-white">{r.v.toFixed(1)} mb/d</span>
                </div>
                <div className="h-3 rounded bg-white/[0.04]">
                  <div className="h-full rounded" style={{ width: pct(r.v), backgroundColor: r.c, opacity: 0.7 }} />
                </div>
              </div>
            ))}
            <div className="pt-1" style={{ borderTop: '3px double rgba(255,255,255,0.35)' }}>
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span className="font-bold uppercase tracking-wide text-amber-300">= call on OPEC crude</span>
                <span className="text-lg font-bold tabular-nums text-amber-300">{call.toFixed(1)} mb/d</span>
              </div>
              <div className="h-4 rounded bg-white/[0.04]">
                <div className="h-full rounded bg-amber-400/70" style={{ width: pct(call) }} />
              </div>
            </div>
          </div>

          {/* capacity vs call */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
              Set against what OPEC can actually pump
            </div>
            <div className="mb-1 flex justify-between font-mono text-[11px]">
              <span className="text-amber-300">called {call.toFixed(1)}</span>
              <span style={{ color: band.color }}>spare {spare.toFixed(1)} mb/d</span>
            </div>
            <div className="flex h-5 overflow-hidden rounded bg-white/[0.04]" aria-hidden="true">
              <div className="h-full bg-amber-400/70" style={{ width: `${Math.max(0, Math.min(100, (call / capacity) * 100))}%` }} />
              <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, (spare / capacity) * 100))}%`, backgroundColor: band.color, opacity: 0.6 }} />
            </div>
            <div className="mt-1 text-right font-mono text-[10px] text-slate-500">capacity {capacity.toFixed(1)} mb/d</div>
          </div>

          <div className="mt-3 space-y-2.5 border-t border-white/10 pt-3">
            <Slider label="World liquids demand (mb/d)" value={demand} min={95} max={110} step={0.1} onChange={setDemand} color="#22d3ee" />
            <Slider label="Non-OPEC supply (mb/d)" value={nonOpec} min={65} max={80} step={0.1} onChange={setNonOpec} color="#64748b" />
            <Slider label="OPEC NGLs (mb/d)" value={ngl} min={4} max={7} step={0.1} onChange={setNgl} color="#64748b" />
            <Slider label="OPEC crude capacity (mb/d)" value={capacity} min={26} max={36} step={0.1} onChange={setCapacity} color="#f59e0b" />
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border p-3.5" style={{ borderColor: band.color + '66', backgroundColor: band.color + '12' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-sm font-bold" style={{ color: band.color }}>Spare capacity: {band.label}</span>
              <span className="font-mono text-xs text-slate-400">{spare.toFixed(1)} mb/d · {sparePct.toFixed(1)}% of demand</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{band.note}</p>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/[0.08] p-3.5">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">Why a residual is dangerous</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Demand is about {demand.toFixed(0)} mb/d and the call is about {call.toFixed(0)}. A forecasting error of{' '}
              <strong className="text-white">1% on demand</strong> — well inside what the IEA and the EIA routinely revise — is{' '}
              <strong className="text-white">{(demand * 0.01).toFixed(1)} mb/d</strong>, and it lands entirely on the call: a{' '}
              <strong className="text-amber-200">{((demand * 0.01 / call) * 100).toFixed(0)}% revision</strong> to the number that
              sets OPEC policy. This is why the monthly reports move the market.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 flex items-center gap-1.5">
              {(['opec', 'plus'] as const).map(t => (
                <button
                  key={t} type="button" onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
                    tab === t ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100' : 'border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'opec' ? `OPEC · ${OPEC.length}` : `the + · ${PLUS.length}`}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {(tab === 'opec' ? OPEC : PLUS).map(c => (
                <span key={c} className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                  c === 'Saudi Arabia' || c === 'Russia' ? 'bg-amber-400/20 text-amber-200' : 'bg-white/[0.06] text-slate-300'
                }`}>
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {tab === 'opec'
                ? 'Twelve members, but the spare capacity is not spread evenly: the great majority of it sits with Saudi Arabia, with the UAE a distant second. "OPEC spare capacity" is very nearly a Saudi number.'
                : 'OPEC plus ten partners, led by Russia — the bloc that has set supply policy since 2016. The "+" has no spare capacity to speak of; what it brings is volume and, when it holds, a wider cartel.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
