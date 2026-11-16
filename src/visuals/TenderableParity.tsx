'use client'

import { useState } from 'react'

// Tenderable parity as the switch it is: two realisations of the same coffee,
// and the differential level at which they cross.
//
// The number line is the point of the visual. Parity sits at
// (class differential − delivery costs), and the whole cash differential range
// to the LEFT of it is the zone where coffee stops being sold and starts being
// tendered. That level is the floor under every differential a student will
// ever quote.
//
// Defaults are the worked example from the lecture: futures $4,500, Class 1 at
// par, $250 of delivery costs, cash bidding futures − $300 → tendering wins by
// $50/t, which is the Vietnam 2024–25 mechanism.

type CostKey = 'freight' | 'handling' | 'grading' | 'financing'

const COSTS: { key: CostKey; label: string; note: string; max: number; color: string }[] = [
  { key: 'freight', label: 'Freight to an exchange warehouse', note: 'HCM → Antwerp — the leg only an importer can do', max: 300, color: '#22d3ee' },
  { key: 'handling', label: 'Handling & warehouse rent', note: 'in and out, plus storage while you wait', max: 160, color: '#34d399' },
  { key: 'grading', label: 'Grading & certification', note: 'the exchange’s own exam', max: 80, color: '#a78bfa' },
  { key: 'financing', label: 'Financing while you wait', note: '~3 months of capital tied up in transit and grading', max: 160, color: '#f472b6' },
]

// Differential axis for the number line
const AX_MIN = -500
const AX_MAX = 100
const VB_W = 760
const VB_H = 190
const X0 = 40
const X1 = 720
const Y_AXIS = 112
const Y_ZONE = Y_AXIS - 34   // top of the two zone bands

const px = (d: number) => X0 + ((d - AX_MIN) / (AX_MAX - AX_MIN)) * (X1 - X0)

export default function TenderableParity() {
  const [futures, setFutures] = useState(4500)
  const [classDiff, setClassDiff] = useState(0)
  const [cashDiff, setCashDiff] = useState(-300)
  const [costs, setCosts] = useState<Record<CostKey, number>>({ freight: 120, handling: 60, grading: 25, financing: 45 })

  const totalCosts = COSTS.reduce((s, c) => s + costs[c.key], 0)
  const exchange = futures + classDiff - totalCosts
  const cash = futures + cashDiff
  const edge = exchange - cash
  const tenders = edge > 0
  // The switch point, expressed as a cash differential.
  const parity = classDiff - totalCosts

  const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
  const signed = (n: number) => (n >= 0 ? '+' : '−') + '$' + Math.abs(Math.round(n))

  // Centred labels get clamped: parity and the cash bid can both sit at an end
  // of the axis, where half the text would otherwise fall outside the viewBox.
  const labelX = Math.min(Math.max(px(parity), 110), VB_W - 110)
  const cashLabelX = Math.min(Math.max(px(cashDiff), 70), VB_W - 70)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Tenderable parity — the floor under every differential</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        One question: is this coffee worth more <strong className="text-slate-200">delivered to the exchange</strong> or{' '}
        <strong className="text-slate-200">sold in the cash market</strong>? Drag the cash differential down and find the level where
        the answer flips. That level is tenderable parity.
      </p>

      {/* the number line */}
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" role="img"
        aria-label={`Cash differential number line: parity at ${parity} dollars, cash market currently at ${cashDiff} dollars`}>
        {/* zones */}
        <rect x={X0} y={Y_ZONE} width={px(parity) - X0} height={34} fill="#f59e0b" fillOpacity={0.12} />
        <rect x={px(parity)} y={Y_ZONE} width={X1 - px(parity)} height={34} fill="#34d399" fillOpacity={0.1} />
        <text x={(X0 + px(parity)) / 2} y={Y_ZONE - 10} textAnchor="middle" fill="#fbbf24" fontSize={12} fontWeight="bold" className="font-mono">
          TENDER — the exchange pays more
        </text>
        <text x={(px(parity) + X1) / 2} y={Y_ZONE - 10} textAnchor="middle" fill="#6ee7b7" fontSize={12} fontWeight="bold" className="font-mono">
          SELL CASH — the market pays more
        </text>

        {/* axis */}
        <line x1={X0} y1={Y_AXIS} x2={X1} y2={Y_AXIS} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
        {[-500, -400, -300, -200, -100, 0, 100].map(d => (
          <g key={d}>
            <line x1={px(d)} y1={Y_AXIS} x2={px(d)} y2={Y_AXIS + 6} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
            <text x={px(d)} y={Y_AXIS + 20} textAnchor="middle" fill="#64748b" fontSize={11} className="font-mono">{d}</text>
          </g>
        ))}
        <text x={X1} y={Y_AXIS + 62} textAnchor="end" fill="#64748b" fontSize={11} className="font-mono">
          cash differential, $/t vs futures →
        </text>

        {/* parity line — the switch point */}
        <line x1={px(parity)} y1={Y_ZONE - 4} x2={px(parity)} y2={Y_AXIS + 8} stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 3" />
        <text x={labelX} y={Y_ZONE - 46} textAnchor="middle" fill="#fbbf24" fontSize={13} fontWeight="bold" className="font-mono">
          parity {signed(parity)}
        </text>
        <text x={labelX} y={Y_ZONE - 32} textAnchor="middle" fill="#a1a1aa" fontSize={10} className="font-mono">
          = class diff {signed(classDiff)} − costs {usd(totalCosts)}
        </text>

        {/* where the cash market actually is */}
        <g>
          <line x1={px(cashDiff)} y1={Y_AXIS} x2={px(cashDiff)} y2={Y_ZONE} stroke="#22d3ee" strokeWidth={2} />
          <circle cx={px(cashDiff)} cy={Y_AXIS} r={6} fill="#0b1220" stroke="#22d3ee" strokeWidth={2.5} />
          <text x={cashLabelX} y={Y_AXIS + 40} textAnchor="middle" fill="#67e8f9" fontSize={12} fontWeight="bold" className="font-mono">
            cash bid {signed(cashDiff)}
          </text>
        </g>
      </svg>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* inputs */}
        <div className="space-y-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 flex justify-between font-mono text-xs">
              <span className="text-cyan-300">Cash market differential ($/t)</span>
              <span className="font-bold tabular-nums text-white">{signed(cashDiff)}</span>
            </div>
            <input type="range" min={-500} max={100} step={10} value={cashDiff}
              onChange={e => setCashDiff(parseFloat(e.target.value))}
              aria-label="Cash market differential in dollars per tonne"
              className="h-2 w-full cursor-pointer accent-brand-cyan" />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Delivery costs</span>
              <span className="font-mono text-sm font-bold tabular-nums text-amber-300">{usd(totalCosts)}/t</span>
            </div>
            {/* stacked build-up */}
            <div className="mb-3 flex h-3 overflow-hidden rounded bg-white/[0.04]" aria-hidden="true">
              {COSTS.map(c => (
                <div key={c.key} style={{ width: `${(costs[c.key] / Math.max(totalCosts, 1)) * 100}%`, backgroundColor: c.color, opacity: 0.7 }} />
              ))}
            </div>
            <div className="space-y-2.5">
              {COSTS.map(c => (
                <div key={c.key}>
                  <div className="mb-0.5 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-slate-300">
                      {c.label}
                      <span className="block font-mono text-[10px] text-slate-500">{c.note}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-white">{usd(costs[c.key])}</span>
                  </div>
                  <input type="range" min={0} max={c.max} step={5} value={costs[c.key]}
                    onChange={e => setCosts(s => ({ ...s, [c.key]: parseFloat(e.target.value) }))}
                    aria-label={c.label}
                    className="h-1.5 w-full cursor-pointer" style={{ accentColor: c.color }} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="mb-1 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Futures</span>
                <span className="font-bold tabular-nums text-white">{usd(futures)}</span>
              </div>
              <input type="range" min={3000} max={6000} step={50} value={futures}
                onChange={e => setFutures(parseFloat(e.target.value))}
                aria-label="Futures price in dollars per tonne"
                className="h-1.5 w-full cursor-pointer accent-brand-blue" />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="mb-1 flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Class differential</span>
                <span className="font-bold tabular-nums text-white">{signed(classDiff)}</span>
              </div>
              <input type="range" min={-90} max={30} step={5} value={classDiff}
                onChange={e => setClassDiff(parseFloat(e.target.value))}
                aria-label="Exchange class or growth differential in dollars per tonne"
                className="h-1.5 w-full cursor-pointer accent-brand-blue" />
            </div>
          </div>
        </div>

        {/* the two realisations */}
        <div className="space-y-2.5">
          <div className={`rounded-xl border p-3 font-mono text-xs tabular-nums ${tenders ? 'border-amber-500/50 bg-amber-500/[0.08]' : 'border-white/10 bg-white/[0.02]'}`}>
            <div className={`eyebrow mb-2 ${tenders ? 'text-amber-300' : 'text-slate-400'}`}>Exchange realisation — tender it</div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-slate-400">Futures</span><span className="text-white">{usd(futures)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Class / growth differential</span><span className="text-white">{signed(classDiff)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Delivery costs</span><span className="text-rose-300">−{usd(totalCosts)}</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="font-bold text-white">Net to you</span>
                <span className="text-lg font-bold text-amber-300">{usd(exchange)}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-3 font-mono text-xs tabular-nums ${!tenders ? 'border-emerald-500/50 bg-emerald-500/[0.08]' : 'border-white/10 bg-white/[0.02]'}`}>
            <div className={`eyebrow mb-2 ${!tenders ? 'text-emerald-300' : 'text-slate-400'}`}>Cash realisation — sell it</div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-slate-400">Futures</span><span className="text-white">{usd(futures)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Market differential</span><span className="text-white">{signed(cashDiff)}</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1.5">
                <span className="font-bold text-white">Net to you</span>
                <span className="text-lg font-bold text-emerald-300">{usd(cash)}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-3.5 ${tenders ? 'border-amber-500/50 bg-amber-500/[0.10]' : 'border-emerald-500/40 bg-emerald-500/[0.08]'}`}>
            <div className={`font-mono text-sm font-bold ${tenders ? 'text-amber-300' : 'text-emerald-300'}`}>
              {tenders ? 'Tendering wins' : 'The cash market wins'} by {usd(Math.abs(edge))}/t
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              {tenders ? (
                <>Sell futures, ship the coffee to a certified warehouse, grade it, deliver it. That flow is mechanical, and it is
                exactly what Vietnamese gradings did in 2024–25 — surging about three months behind the differential’s collapse, the
                time it takes to ship, warehouse and grade.</>
              ) : (
                <>Nobody tenders: the cash market pays more, so the coffee stays in the physical chain and the cash market sets the
                pace. Drag the cash differential below <strong className="text-amber-300">{signed(parity)}</strong> and the flow starts.</>
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Why this is a floor, not a forecast</div>
            <p className="text-xs leading-relaxed text-slate-300">
              A differential can fall below parity — briefly. But every tonne that crosses the line leaves the cash market and lands on
              the exchange, tightening physical supply until the differential is pulled back up. The arbitrage is what forces physical
              and futures to converge, and it is why{' '}
              <strong className="text-amber-300">{signed(parity)}</strong> is the number to quote against, not zero.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        Note which costs do the work. Freight is the biggest line and only the <strong className="text-slate-200">import</strong> side
        can pay it — an exporter at origin cannot tender, which is why the floor binds on the destination differential, not the FOB one.
        Push the freight slider to zero and watch parity move toward zero: with no cost of delivery, futures and physical would have to
        trade at the same price.
      </p>
    </div>
  )
}
