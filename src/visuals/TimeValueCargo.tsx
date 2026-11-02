'use client'

import { useState } from 'react'

// Two cargoes, the SAME floating formula, different loading dates — and
// therefore different value. That is the whole case for CFDs, and it is
// genuinely counter-intuitive: students assume an identical formula means an
// identical price.
//
// Flip the market structure and watch which cargo is worth more invert.

type Mode = 'contango' | 'backwardation' | 'flat'

const MODES: Record<Mode, { label: string; color: string; slope: number; note: string }> = {
  contango: {
    label: 'Contango', color: '#34d399', slope: 0.09,
    note: 'Later is dearer. The August cargo prices into a higher part of the curve, so the LATE cargo is worth more — and a seller quoting both at the same differential is giving the early one away.',
  },
  backwardation: {
    label: 'Backwardation', color: '#f43f5e', slope: -0.09,
    note: 'Prompt is dearer. Now the EARLY cargo is the valuable one. The same differential on both cargoes means you have mispriced the late one.',
  },
  flat: {
    label: 'Flat curve', color: '#94a3b8', slope: 0,
    note: 'The only case where two cargoes with the same formula really are worth the same — and it is the case that almost never holds.',
  },
}

const BASE = 82.0
const EARLY_DAY = 3   // loading 2–4 August
const LATE_DAY = 22   // loading 21–25 August

// Chart geometry
const W = 560, H = 210, ML = 50, MR = 20, MT = 26, MB = 34
const PW = W - ML - MR
const PH = H - MT - MB
const DAYS = 31

export default function TimeValueCargo() {
  const [mode, setMode] = useState<Mode>('contango')
  const m = MODES[mode]

  const priceAt = (d: number) => BASE + m.slope * (d - 15) / 2
  const early = priceAt(EARLY_DAY)
  const late = priceAt(LATE_DAY)
  const gap = late - early

  const lo = BASE - 1.2, hi = BASE + 1.2
  const sx = (d: number) => ML + ((d - 1) / (DAYS - 1)) * PW
  const sy = (p: number) => MT + PH - ((p - lo) / (hi - lo)) * PH
  const path = Array.from({ length: DAYS }, (_, i) => `${i ? 'L' : 'M'} ${sx(i + 1).toFixed(1)} ${sy(priceAt(i + 1)).toFixed(1)}`).join(' ')

  const usd = (n: number) => (n < 0 ? '−$' : '$') + Math.abs(n).toFixed(2)

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Same formula, different dates, different value</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Two cargoes priced on <strong className="text-slate-200">identical terms</strong> — Dated Brent, five days after the B/L.
        One offered 2–4 August, one 21–25 August. They are not worth the same amount, and the difference is{' '}
        <strong className="text-slate-200">time value</strong>: in crude, that is traded as a CFD.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Market structure">
        {(Object.keys(MODES) as Mode[]).map(k => (
          <button
            key={k} type="button" onClick={() => setMode(k)}
            aria-pressed={mode === k}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              mode === k ? 'bg-white/[0.08]' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            style={mode === k ? { borderColor: MODES[k].color + '99', color: MODES[k].color } : undefined}
          >
            {MODES[k].label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label={`An August price curve in ${m.label.toLowerCase()}, with an early and a late cargo marked`}>
        <text x={ML - 42} y={14} fill="#64748b" fontSize={10} className="font-mono">$/bbl</text>
        {[BASE - 1, BASE, BASE + 1].map(p => (
          <g key={p}>
            <line x1={ML} y1={sy(p)} x2={ML + PW} y2={sy(p)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={ML - 8} y={sy(p)} textAnchor="end" dominantBaseline="central" fill="#64748b" fontSize={10} className="font-mono">
              {p.toFixed(0)}
            </text>
          </g>
        ))}
        <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
        {[1, 10, 20, 31].map(d => (
          <text key={d} x={sx(d)} y={MT + PH + 16} textAnchor="middle" fill="#64748b" fontSize={10} className="font-mono">
            {d} Aug
          </text>
        ))}

        <path d={path} fill="none" stroke={m.color} strokeWidth={2.5} />

        {/* the two loading windows */}
        {[
          { d: EARLY_DAY, w: 2, label: '2–4 Aug', p: early, c: '#22d3ee' },
          { d: LATE_DAY, w: 4, label: '21–25 Aug', p: late, c: '#f59e0b' },
        ].map(x => (
          <g key={x.label}>
            <rect x={sx(x.d - x.w / 2)} y={MT} width={sx(x.d + x.w / 2) - sx(x.d - x.w / 2)} height={PH}
              fill={x.c} fillOpacity={0.12} />
            <circle cx={sx(x.d)} cy={sy(x.p)} r={5.5} fill="#0b1220" stroke={x.c} strokeWidth={2.5} />
            <text x={sx(x.d)} y={MT - 8} textAnchor="middle" fill={x.c} fontSize={10} fontWeight="bold" className="font-mono">
              {x.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 font-mono text-xs tabular-nums">
          <div className="eyebrow mb-2">Two identical formulas</div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between"><span className="text-cyan-300">2–4 Aug cargo</span><span className="font-bold text-white">{usd(early)}/bbl</span></div>
            <div className="flex justify-between"><span className="text-amber-300">21–25 Aug cargo</span><span className="font-bold text-white">{usd(late)}/bbl</span></div>
            <div className="flex justify-between border-t border-white/15 pt-1.5">
              <span className="font-bold text-white">difference</span>
              <span className="font-bold" style={{ color: m.color }}>{usd(gap)}/bbl</span>
            </div>
            <div className="text-[11px] text-slate-500">
              on a 700,000 bbl cargo: {usd(Math.abs(gap * 700000)).replace('.00', '')} of value in the dates alone
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-3.5" style={{ borderColor: m.color + '55', backgroundColor: m.color + '0d' }}>
          <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.label}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{m.note}</p>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">
            Backwardation and contango are only adjectives for the price of oil in the future relative to oil today. In crude that
            structure is not an observation — it is a <strong className="text-slate-200">traded instrument</strong>, and the
            instrument is the CFD.
          </p>
        </div>
      </div>
    </div>
  )
}
