'use client'

import { useState } from 'react'

// Strengthen / weaken is the pair of words students reverse under exam
// pressure, so this visual does ONE thing: direction. No money, no P&L
// magnitude — the next section's simulator handles that. Here the question is
// only "which way is good for me, and why".
//
// The hook is the physical position: you own the gap, so a bigger gap is good.

type Situation = {
  key: string
  text: string
  side: 'long' | 'short' | 'none'
  why: string
}

const SITUATIONS: Situation[] = [
  {
    key: 'warehouse',
    text: 'You own 500 t sitting in the warehouse and you have sold futures against it.',
    side: 'long',
    why: 'Long physical, short futures — the textbook hedged owner. You own the gap between them, so you are LONG the basis.',
  },
  {
    key: 'sold-forward',
    text: 'You sold 200 t to a roaster for March shipment and bought futures to cover it.',
    side: 'short',
    why: 'Short physical, long futures — the mirror image. You owe the gap, so you are SHORT the basis and you want it to narrow.',
  },
  {
    key: 'ptbf-unfixed',
    text: 'You bought 300 t FOB on a PTBF contract and have not fixed or hedged anything yet.',
    side: 'none',
    why: 'Nothing is priced yet. You own a differential you agreed, but with no futures leg on either side there is no basis POSITION — what you have is an unhedged commitment to take delivery.',
  },
  {
    key: 'exporter',
    text: 'You are an exporter: you bought cherry locally in dong and sold FOB as a differential, hedged on the screen.',
    side: 'long',
    why: 'You bought physical and sold futures, exactly as in the first case — the local currency and the FOB wrapper change nothing. Long the basis.',
  },
]

const SIDES = {
  long: {
    label: 'LONG the basis',
    position: 'long physical / short futures',
    wants: 'strengthen',
    color: '#34d399',
  },
  short: {
    label: 'SHORT the basis',
    position: 'short physical / long futures',
    wants: 'weaken',
    color: '#f59e0b',
  },
} as const

// SVG geometry for the compass
const VB_W = 300
const VB_H = 250
const CX = 150
const Y_TOP = 40
const Y_MID = 125
const Y_BOT = 210

export default function BasisCompass() {
  const [sel, setSel] = useState('warehouse')
  const [move, setMove] = useState<'strengthen' | 'weaken'>('weaken')
  const sit = SITUATIONS.find(s => s.key === sel)!
  const side = sit.side === 'none' ? null : SIDES[sit.side]
  const wins = side ? side.wants === move : null

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="eyebrow mb-1 text-brand-cyan">Which way is good for you?</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Two words, reversed in every exam. Fix them once here — this slide is about{' '}
        <strong className="text-slate-200">direction only</strong>, not how much.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
        {/* the compass */}
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="mx-auto w-full max-w-[300px]" role="img"
          aria-label="The differential moving up is strengthening, down is weakening, measured against the futures price">
          {/* futures reference */}
          {/* starts clear of the price labels on the left */}
          <line x1={78} y1={Y_MID} x2={VB_W - 30} y2={Y_MID} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={VB_W - 30} y={Y_MID - 11} textAnchor="end" fill="#94a3b8" fontSize={11} className="font-mono">
            the futures price
          </text>

          {/* up = strengthen */}
          <line x1={CX} y1={Y_MID - 10} x2={CX} y2={Y_TOP + 6} stroke="#34d399" strokeWidth={2.5} />
          <path d={`M ${CX} ${Y_TOP} l -7 11 l 14 0 Z`} fill="#34d399" />
          <text x={CX} y={Y_TOP - 18} textAnchor="middle" fill="#6ee7b7" fontSize={14} fontWeight="bold" className="font-mono">
            STRENGTHENS
          </text>
          <text x={CX} y={Y_TOP - 5} textAnchor="middle" fill="#94a3b8" fontSize={10} className="font-mono">
            differential moves UP
          </text>

          {/* down = weaken */}
          <line x1={CX} y1={Y_MID + 10} x2={CX} y2={Y_BOT - 6} stroke="#f43f5e" strokeWidth={2.5} />
          <path d={`M ${CX} ${Y_BOT} l -7 -11 l 14 0 Z`} fill="#f43f5e" />
          <text x={CX} y={Y_BOT + 20} textAnchor="middle" fill="#fda4af" fontSize={14} fontWeight="bold" className="font-mono">
            WEAKENS
          </text>
          <text x={CX} y={Y_BOT + 33} textAnchor="middle" fill="#94a3b8" fontSize={10} className="font-mono">
            differential moves DOWN
          </text>

          {/* example levels, so "up" is concrete */}
          <text x={46} y={Y_TOP + 34} fill="#6ee7b7" fontSize={11} className="font-mono">+$40</text>
          <text x={46} y={Y_MID + 4} fill="#94a3b8" fontSize={11} className="font-mono">±$0</text>
          <text x={46} y={Y_BOT - 24} fill="#fda4af" fontSize={11} className="font-mono">−$40</text>
        </svg>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">
              Which position are you in?
            </div>
            <div className="space-y-1.5">
              {SITUATIONS.map(s => (
                <button
                  key={s.key} type="button" onClick={() => setSel(s.key)}
                  aria-pressed={sel === s.key}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-xs leading-relaxed transition-all ${
                    sel === s.key ? 'border-cyan-400/50 bg-cyan-400/[0.08] text-slate-100' : 'border-white/10 text-slate-400 hover:bg-white/[0.03]'
                  }`}
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>

          {side ? (
            <div className="rounded-xl border p-3.5" style={{ borderColor: side.color + '66', backgroundColor: side.color + '0f' }}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-sm font-bold" style={{ color: side.color }}>{side.label}</span>
                <span className="font-mono text-[11px] text-slate-400">{side.position}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{sit.why}</p>

              {/* the drill */}
              <div className="mt-3 border-t border-white/10 pt-3">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-slate-400">Now the differential…</div>
                <div className="flex gap-2">
                  {(['strengthen', 'weaken'] as const).map(m => (
                    <button
                      key={m} type="button" onClick={() => setMove(m)}
                      aria-pressed={move === m}
                      className={`flex-1 rounded-lg border px-3 py-2 font-mono text-xs font-bold transition-all ${
                        move === m
                          ? m === 'strengthen' ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200' : 'border-rose-400/60 bg-rose-400/15 text-rose-200'
                          : 'border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m === 'strengthen' ? '↑ strengthens' : '↓ weakens'}
                    </button>
                  ))}
                </div>
                <div className={`mt-2.5 rounded-lg border px-3 py-2.5 ${
                  wins ? 'border-emerald-500/40 bg-emerald-500/[0.10]' : 'border-rose-500/40 bg-rose-500/[0.10]'
                }`}>
                  <span className={`font-mono text-sm font-bold ${wins ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {wins ? 'You profit.' : 'You lose.'}
                  </span>
                  <span className="ml-1.5 text-xs leading-relaxed text-slate-300">
                    {wins
                      ? `Being ${side.label.toLowerCase()} means you want it to ${side.wants}, and it did.`
                      : `Being ${side.label.toLowerCase()} means you want it to ${side.wants} — this went the other way.`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-violet-500/40 bg-violet-500/[0.08] p-3.5">
              <div className="font-mono text-sm font-bold text-violet-300">No basis position — yet</div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{sit.why}</p>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wide text-slate-200">The hook, if you forget everything else</div>
            <p className="text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-100">You own the physical, so you own the gap.</strong> The gap getting bigger is good for
              you. Everything else — strengthen, weaken, long basis, short basis — falls out of that one sentence.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
