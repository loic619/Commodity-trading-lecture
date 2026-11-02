'use client'

import { useState } from 'react'

// Why a fixed-price futures hedge cannot fully offset a floating-formula
// exposure. The cargo prices as an AVERAGE over five published days after the
// B/L; the futures hedge is one number, lifted on one day. The residual is
// the gap between a point and an average — and it is exactly what swaps and
// CFDs exist to close.
//
// Drag the five daily Dated prints and watch the average drift away from the
// single futures level the hedge was lifted at.

const DAYS = ['B/L +1', '+2', '+3', '+4', '+5']
const DIFF = -0.50       // the formula's fixed differential
const FUTURES_LIFT = 82.40

// Chart geometry
const W = 560, H = 230, ML = 54, MR = 86, MT = 26, MB = 34
const PW = W - ML - MR
const PH = H - MT - MB
const LO = 78, HI = 88

const sx = (i: number) => ML + ((i + 0.5) / DAYS.length) * PW
const sy = (p: number) => MT + PH - ((p - LO) / (HI - LO)) * PH

export default function FormulaGap() {
  const [prints, setPrints] = useState([82.90, 83.40, 82.10, 81.60, 82.20])
  const [lift, setLift] = useState(FUTURES_LIFT)

  const avg = prints.reduce((s, p) => s + p, 0) / prints.length
  const invoice = avg + DIFF
  // The hedge was lifted at one number; the exposure settled at an average.
  const residual = avg - lift
  const spread = Math.max(...prints) - Math.min(...prints)

  const set = (i: number, v: number) => setPrints(p => p.map((x, k) => (k === i ? v : x)))
  const usd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(n).toFixed(2)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">A point cannot hedge an average</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Real cargoes do not price at a number. They price at{' '}
        <span className="font-mono text-slate-300">&ldquo;Dated Brent − $0.50, averaged over the five working days after the
        B/L&rdquo;</span> — a figure nobody knows yet. Your futures hedge, meanwhile, is lifted at{' '}
        <strong className="text-slate-200">one price on one day</strong>.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label={`Five daily Dated Brent prints averaging ${avg.toFixed(2)} against a futures hedge lifted at ${lift.toFixed(2)}`}>
        <text x={ML - 46} y={14} fill="#64748b" fontSize={10} className="font-mono">$/bbl</text>
        {[80, 82, 84, 86].map(p => (
          <g key={p}>
            <line x1={ML} y1={sy(p)} x2={ML + PW} y2={sy(p)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={ML - 8} y={sy(p)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={10} className="font-mono">{p}</text>
          </g>
        ))}
        <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
        {DAYS.map((d, i) => (
          <text key={d} x={sx(i)} y={MT + PH + 16} textAnchor="middle" fill="#64748b" fontSize={10} className="font-mono">{d}</text>
        ))}

        {/* where the futures hedge was lifted — one line, one number */}
        <line x1={ML} y1={sy(lift)} x2={ML + PW} y2={sy(lift)} stroke="#f59e0b" strokeWidth={2} />
        <text x={ML + PW + 6} y={sy(lift)} dominantBaseline="central" fill="#f59e0b" fontSize={10} className="font-mono">
          hedge {lift.toFixed(2)}
        </text>

        {/* the average the exposure actually settles at */}
        <line x1={ML} y1={sy(avg)} x2={ML + PW} y2={sy(avg)} stroke="#22d3ee" strokeWidth={2} strokeDasharray="6 4" />
        <text x={ML + PW + 6} y={sy(avg)} dominantBaseline="central" fill="#22d3ee" fontSize={10} className="font-mono">
          avg {avg.toFixed(2)}
        </text>

        {/* the daily prints */}
        {prints.map((p, i) => (
          <g key={i}>
            <line x1={sx(i)} y1={sy(avg)} x2={sx(i)} y2={sy(p)} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            <circle cx={sx(i)} cy={sy(p)} r={5} fill="#0b1220" stroke="#e2e8f0" strokeWidth={2} />
          </g>
        ))}
      </svg>

      <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
            Drag the five published Dated prints
          </div>
          <div className="space-y-2">
            {prints.map((p, i) => (
              <div key={i}>
                <div className="mb-0.5 flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">{DAYS[i]}</span>
                  <span className="font-bold tabular-nums text-white">{p.toFixed(2)}</span>
                </div>
                <input type="range" min={78} max={88} step={0.05} value={p}
                  onChange={e => set(i, parseFloat(e.target.value))}
                  aria-label={`Dated Brent print, day ${DAYS[i]}`}
                  className="h-1.5 w-full cursor-pointer accent-brand-cyan" />
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-white/10 pt-2.5">
            <div className="mb-0.5 flex justify-between font-mono text-[11px]">
              <span className="text-amber-300">Futures lifted at</span>
              <span className="font-bold tabular-nums text-white">{lift.toFixed(2)}</span>
            </div>
            <input type="range" min={78} max={88} step={0.05} value={lift}
              onChange={e => setLift(parseFloat(e.target.value))}
              aria-label="Futures price the hedge was lifted at"
              className="h-1.5 w-full cursor-pointer accent-amber-400" />
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs tabular-nums">
            <div className="eyebrow mb-2">The invoice</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">5-day Dated average</span><span>{avg.toFixed(3)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">formula differential</span><span>−0.50</span></div>
              <div className="flex justify-between border-t border-white/15 pt-1"><span className="font-bold text-white">cargo prices at</span><span className="font-bold text-cyan-300">{invoice.toFixed(3)}</span></div>
            </div>
          </div>

          <div className={`rounded-xl border p-3.5 ${
            Math.abs(residual) < 0.05 ? 'border-emerald-500/40 bg-emerald-500/[0.08]' : 'border-rose-500/45 bg-rose-500/[0.10]'
          }`}>
            <div className={`font-mono text-xs font-bold uppercase tracking-wide ${Math.abs(residual) < 0.05 ? 'text-emerald-300' : 'text-rose-300'}`}>
              What the hedge left behind
            </div>
            <div className={`mt-1 font-mono text-2xl font-bold tabular-nums ${Math.abs(residual) < 0.05 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {usd(residual)}/bbl
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              {Math.abs(residual) < 0.05
                ? 'Almost nothing — but that is luck, not hedging. You happened to lift the futures at very close to where the five-day average landed, and you could not have known that when you lifted it.'
                : <>The average settled {usd(Math.abs(residual))} {residual > 0 ? 'above' : 'below'} the single price your hedge was
                  lifted at. On a 700,000 bbl cargo that is{' '}
                  <strong className="text-white">${Math.abs(residual * 700000).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>{' '}
                  that the futures leg simply did not cover.</>}
            </p>
            <p className="mt-2 border-t border-white/10 pt-2 font-mono text-[11px] text-slate-400">
              high − low across the window: {spread.toFixed(2)} — the wider the window swings, the less a point can stand in for it
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-slate-400">
        The futures contract did its job: it neutralised the <em>flat price</em>. What it cannot do is turn a point into an average,
        or match Dated Brent to a futures month. <strong className="text-slate-200">Futures alone are not sufficient</strong> —
        hedging crude properly is futures plus swaps, and the rest of this module is the toolkit for the gap you are looking at.
      </p>
    </div>
  )
}
