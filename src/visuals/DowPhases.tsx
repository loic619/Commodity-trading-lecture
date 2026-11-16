'use client'

import { useState } from 'react'

// Dow's three phases drawn on one idealised bull market, because the phases
// are a shape and a shape should be drawn. The crowd-psychology labels are
// the point: who is buying from whom, at each stage.
//
// The three trends (primary / secondary / minor) are shown as the same path
// read at three zoom levels, which is the idea students most often miss —
// they are not three different things, they are one thing at three scales.

type Phase = {
  key: string
  name: string
  from: number
  to: number
  color: string
  who: string
  what: string
  tell: string
}

const PHASES: Phase[] = [
  {
    key: 'acc', name: 'Accumulation', from: 0, to: 0.33, color: '#22d3ee',
    who: 'Informed money buying from discouraged holders',
    what: 'The news is still terrible and the last sellers are capitulating. Prices stop falling on bad news — which is the first real signal, because it means the selling is exhausted rather than the story improved.',
    tell: 'Volume is dull, the range is narrow, and nobody wants to talk about the market.',
  },
  {
    key: 'pub', name: 'Public participation', from: 0.33, to: 0.72, color: '#34d399',
    who: 'Trend followers and the broad market',
    what: 'The trend becomes visible and the fundamentals start confirming it. This is the longest phase and the one that carries most of the move — which is why trend-following works at all.',
    tell: 'Volume expands on rallies and contracts on pullbacks. Dow’s rule: volume must confirm the trend.',
  },
  {
    key: 'dist', name: 'Distribution', from: 0.72, to: 1, color: '#f43f5e',
    who: 'The informed money selling to the newly enthusiastic',
    what: 'The news is now uniformly good and the story is on the front page. The same participants who accumulated at the bottom are quietly selling into the strength.',
    tell: 'New highs on falling volume, and rallies that fail to hold. Price can still rise — distribution is a process, not a day.',
  },
]

const RULES = [
  { r: 'Averages discount everything', n: 'Every known fundamental is already in the price. That is an assumption, not a fact — but it is the assumption the whole discipline rests on.' },
  { r: 'Three trends', n: 'Primary (months to years), secondary (weeks, the corrections against it), minor (days, noise). A weekly chart holds more information per bar than a daily — a stronger signal that takes longer to form.' },
  { r: 'Three phases', n: 'Accumulation, public participation, distribution. The shape above.' },
  { r: 'Averages must confirm each other', n: 'Dow wanted the industrials and the rails to agree. The modern equivalent: if crude is rallying and the products are not, be suspicious.' },
  { r: 'Volume must confirm the trend', n: 'Price alone can mislead. A rally on falling volume is a rally with no one behind it.' },
  { r: 'A trend continues until it does not', n: 'Do not call the reversal early. That last rule is the spine of trend trading, and the hardest one to actually follow.' },
]

// Chart geometry
const W = 560, H = 230, ML = 20, MR = 20, MT = 30, MB = 34
const PW = W - ML - MR
const PH = H - MT - MB

// An idealised bull market: slow base, strong middle, choppy top.
const CURVE = [
  0.12, 0.10, 0.14, 0.11, 0.15, 0.13, 0.18, 0.16,
  0.24, 0.30, 0.28, 0.38, 0.45, 0.42, 0.54, 0.62,
  0.58, 0.70, 0.78, 0.74, 0.86, 0.92, 0.88, 0.95,
  0.90, 0.96, 0.89, 0.93, 0.84, 0.88, 0.76, 0.70,
]

export default function DowPhases() {
  const [sel, setSel] = useState('acc')
  const p = PHASES.find(x => x.key === sel)!

  const px = (i: number) => ML + (i / (CURVE.length - 1)) * PW
  const py = (v: number) => MT + PH - v * PH * 0.92
  const path = CURVE.map((v, i) => `${i ? 'L' : 'M'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ')

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Dow&apos;s three phases — who is buying from whom</div>
      <p className="mb-3 text-sm leading-relaxed text-slate-400">
        Charles Dow&apos;s framework is not really about charts; it is about <strong className="text-slate-200">crowd
        psychology</strong>. A major trend moves through three phases, and in each one a different participant is on each side of
        the trade. Click a phase.
      </p>

      <div className="mb-2 flex flex-wrap gap-1.5" role="group" aria-label="Phase">
        {PHASES.map(ph => (
          <button
            key={ph.key} type="button" onClick={() => setSel(ph.key)}
            aria-pressed={sel === ph.key}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              sel === ph.key ? 'bg-white/[0.08]' : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            style={sel === ph.key ? { borderColor: ph.color + '99', color: ph.color } : undefined}
          >
            {ph.name}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label="An idealised bull market divided into accumulation, public participation and distribution phases">
        {/* phase bands */}
        {PHASES.map(ph => {
          const x0 = ML + ph.from * PW
          const x1 = ML + ph.to * PW
          const on = ph.key === sel
          return (
            <g key={ph.key} onClick={() => setSel(ph.key)} className="cursor-pointer">
              <rect x={x0} y={MT} width={x1 - x0} height={PH} fill={ph.color} fillOpacity={on ? 0.16 : 0.05} />
              <line x1={x1} y1={MT} x2={x1} y2={MT + PH} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />
              <text x={(x0 + x1) / 2} y={MT - 10} textAnchor="middle" fill={on ? ph.color : '#64748b'}
                fontSize={11} fontWeight={on ? 'bold' : 'normal'} className="font-mono">
                {ph.name}
              </text>
            </g>
          )
        })}

        <path d={path} fill="none" stroke="#e2e8f0" strokeWidth={2.2} strokeLinejoin="round" />

        {/* the secondary corrections against the primary trend */}
        {[9, 15, 21].map(i => (
          <circle key={i} cx={px(i + 1)} cy={py(CURVE[i + 1])} r={3.5} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
        ))}
        <text x={ML + PW} y={MT + PH + 16} textAnchor="end" fill="#f59e0b" fontSize={9.5} className="font-mono">
          ○ secondary corrections — against the primary trend, not the end of it
        </text>
        <text x={ML} y={MT + PH + 16} fill="#64748b" fontSize={9.5} className="font-mono">time →</text>
      </svg>

      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3.5" style={{ borderColor: p.color + '55', backgroundColor: p.color + '0d' }}>
          <div className="font-mono text-sm font-bold" style={{ color: p.color }}>{p.name}</div>
          <div className="mt-0.5 font-mono text-[11px] text-slate-400">{p.who}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{p.what}</p>
          <p className="mt-2 border-t border-white/10 pt-2 text-xs leading-relaxed text-slate-400">
            <strong className="text-slate-200">The tell:</strong> {p.tell}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">Dow&apos;s six rules</div>
          <div className="space-y-1.5">
            {RULES.map(r => (
              <div key={r.r} className="border-b border-white/[0.05] pb-1.5 last:border-0">
                <span className="text-[11px] font-bold text-slate-200">{r.r}</span>
                <p className="text-[11px] leading-relaxed text-slate-400">{r.n}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
